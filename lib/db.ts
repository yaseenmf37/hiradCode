import "server-only";

import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { SEED_PROJECTS } from "./seed";
import type {
  Message,
  MessageInput,
  Post,
  PostInput,
  Project,
  ProjectInput,
} from "./types";

/* ══════════════════════════════════════════════════════
   Two drivers, one interface.

   - DATABASE_URL set   → Neon Postgres. This is production.
   - DATABASE_URL unset → JSON files under .data/. Lets the panel be driven
     end-to-end locally before any database exists. Vercel's filesystem is
     read-only, so this driver is local-dev only; on Vercel without a database
     the site falls back to read-only seed data.
   ══════════════════════════════════════════════════════ */

export type Store = {
  list(): Promise<Project[]>;
  getBySlug(slug: string): Promise<Project | null>;
  getById(id: string): Promise<Project | null>;
  create(input: ProjectInput): Promise<Project>;
  update(id: string, input: ProjectInput): Promise<Project | null>;
  remove(id: string): Promise<boolean>;
};

export type MessageStore = {
  list(): Promise<Message[]>;
  create(input: MessageInput): Promise<Message>;
  setRead(id: string, read: boolean): Promise<void>;
  remove(id: string): Promise<boolean>;
};

export type PostStore = {
  list(): Promise<Post[]>;
  getBySlug(slug: string): Promise<Post | null>;
  getById(id: string): Promise<Post | null>;
  create(input: PostInput): Promise<Post>;
  update(id: string, input: PostInput): Promise<Post | null>;
  remove(id: string): Promise<boolean>;
};

export const hasDatabase = Boolean(process.env.DATABASE_URL);

/** True on Vercel with no database — writes cannot persist there. */
export const isReadOnly = !hasDatabase && Boolean(process.env.VERCEL);

const slugify = (raw: string) =>
  raw
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "") || "project";

/** Appends -2, -3, … until the slug is free. Works for any store with getBySlug. */
async function uniqueSlug(
  lookup: (slug: string) => Promise<{ id: string } | null>,
  desired: string,
  ignoreId?: string,
) {
  const base = slugify(desired);
  let candidate = base;
  let n = 2;

  for (;;) {
    const clash = await lookup(candidate);
    if (!clash || clash.id === ignoreId) return candidate;
    candidate = `${base}-${n++}`;
  }
}

/* ══════════════════════════════════════════════════════
   Postgres
   ══════════════════════════════════════════════════════ */

type Row = Record<string, unknown>;

const rowToProject = (row: Row): Project => ({
  id: String(row.id),
  slug: String(row.slug),
  title: String(row.title),
  subtitle: String(row.subtitle ?? ""),
  category: String(row.category ?? ""),
  description: String(row.description ?? ""),
  titleEn: (row.title_en as string | null) ?? null,
  subtitleEn: (row.subtitle_en as string | null) ?? null,
  descriptionEn: (row.description_en as string | null) ?? null,
  coverImage: String(row.cover_image ?? ""),
  gallery: (row.gallery as string[]) ?? [],
  liveUrl: (row.live_url as string | null) ?? null,
  client: (row.client as string | null) ?? null,
  year: row.year === null || row.year === undefined ? null : Number(row.year),
  duration: (row.duration as string | null) ?? null,
  role: (row.role as string | null) ?? null,
  tags: (row.tags as string[]) ?? [],
  services: (row.services as string[]) ?? [],
  results: (row.results as Project["results"]) ?? [],
  featured: Boolean(row.featured),
  accent: String(row.accent ?? "#ff2e8b"),
  sortOrder: Number(row.sort_order ?? 0),
  createdAt: new Date(row.created_at as string).toISOString(),
});

const rowToMessage = (row: Row): Message => ({
  id: String(row.id),
  name: String(row.name),
  email: String(row.email),
  phone: (row.phone as string | null) ?? null,
  subject: String(row.subject ?? ""),
  budget: (row.budget as string | null) ?? null,
  body: String(row.body ?? ""),
  read: Boolean(row.read),
  createdAt: new Date(row.created_at as string).toISOString(),
});

const rowToPost = (row: Row): Post => ({
  id: String(row.id),
  slug: String(row.slug),
  title: String(row.title),
  excerpt: String(row.excerpt ?? ""),
  content: String(row.content ?? ""),
  coverImage: String(row.cover_image ?? ""),
  tags: (row.tags as string[]) ?? [],
  titleEn: (row.title_en as string | null) ?? null,
  excerptEn: (row.excerpt_en as string | null) ?? null,
  contentEn: (row.content_en as string | null) ?? null,
  published: Boolean(row.published),
  publishedAt: row.published_at
    ? new Date(row.published_at as string).toISOString()
    : null,
  createdAt: new Date(row.created_at as string).toISOString(),
});

const sql = () => neon(process.env.DATABASE_URL!);

let schemaReady: Promise<void> | null = null;

/** Idempotent. One round trip per cold start, in exchange for zero migration steps. */
function ensureSchema() {
  schemaReady ??= (async () => {
    const db = sql();

    await db`
      CREATE TABLE IF NOT EXISTS projects (
        id          TEXT PRIMARY KEY,
        slug        TEXT UNIQUE NOT NULL,
        title       TEXT NOT NULL,
        subtitle    TEXT NOT NULL DEFAULT '',
        category    TEXT NOT NULL DEFAULT '',
        description TEXT NOT NULL DEFAULT '',
        title_en       TEXT,
        subtitle_en    TEXT,
        description_en TEXT,
        cover_image TEXT NOT NULL DEFAULT '',
        gallery     JSONB NOT NULL DEFAULT '[]'::jsonb,
        live_url    TEXT,
        client      TEXT,
        year        INTEGER,
        duration    TEXT,
        role        TEXT,
        tags        JSONB NOT NULL DEFAULT '[]'::jsonb,
        services    JSONB NOT NULL DEFAULT '[]'::jsonb,
        results     JSONB NOT NULL DEFAULT '[]'::jsonb,
        featured    BOOLEAN NOT NULL DEFAULT FALSE,
        accent      TEXT NOT NULL DEFAULT '#ff2e8b',
        sort_order  INTEGER NOT NULL DEFAULT 0,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS messages (
        id         TEXT PRIMARY KEY,
        name       TEXT NOT NULL,
        email      TEXT NOT NULL,
        phone      TEXT,
        subject    TEXT NOT NULL DEFAULT '',
        budget     TEXT,
        body       TEXT NOT NULL DEFAULT '',
        read       BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS posts (
        id           TEXT PRIMARY KEY,
        slug         TEXT UNIQUE NOT NULL,
        title        TEXT NOT NULL,
        excerpt      TEXT NOT NULL DEFAULT '',
        content      TEXT NOT NULL DEFAULT '',
        cover_image  TEXT NOT NULL DEFAULT '',
        tags         JSONB NOT NULL DEFAULT '[]'::jsonb,
        title_en     TEXT,
        excerpt_en   TEXT,
        content_en   TEXT,
        published    BOOLEAN NOT NULL DEFAULT FALSE,
        published_at TIMESTAMPTZ,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // Bilingual columns were added later; bring existing tables up to date.
    await db`ALTER TABLE projects ADD COLUMN IF NOT EXISTS title_en TEXT`;
    await db`ALTER TABLE projects ADD COLUMN IF NOT EXISTS subtitle_en TEXT`;
    await db`ALTER TABLE projects ADD COLUMN IF NOT EXISTS description_en TEXT`;

    // Seed only an untouched table, so a deliberately emptied portfolio stays empty.
    const [{ count }] = (await db`SELECT COUNT(*)::int AS count FROM projects`) as [
      { count: number },
    ];
    if (count > 0) return;

    for (const p of SEED_PROJECTS) {
      await db`
        INSERT INTO projects (
          id, slug, title, subtitle, category, description, cover_image,
          gallery, live_url, client, year, duration, role, tags, services,
          results, featured, accent, sort_order, created_at
        ) VALUES (
          ${p.id}, ${p.slug}, ${p.title}, ${p.subtitle}, ${p.category},
          ${p.description}, ${p.coverImage}, ${JSON.stringify(p.gallery)},
          ${p.liveUrl}, ${p.client}, ${p.year}, ${p.duration}, ${p.role},
          ${JSON.stringify(p.tags)}, ${JSON.stringify(p.services)},
          ${JSON.stringify(p.results)}, ${p.featured}, ${p.accent},
          ${p.sortOrder}, ${p.createdAt}
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }
  })().catch((err) => {
    schemaReady = null; // let the next request retry a transient failure
    throw err;
  });

  return schemaReady;
}

function createPostgresStore(): Store {
  const store: Store = {
    async list() {
      await ensureSchema();
      const rows = (await sql()`
        SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC
      `) as Row[];
      return rows.map(rowToProject);
    },

    async getBySlug(slug) {
      await ensureSchema();
      const rows = (await sql()`
        SELECT * FROM projects WHERE slug = ${slug} LIMIT 1
      `) as Row[];
      return rows[0] ? rowToProject(rows[0]) : null;
    },

    async getById(id) {
      await ensureSchema();
      const rows = (await sql()`
        SELECT * FROM projects WHERE id = ${id} LIMIT 1
      `) as Row[];
      return rows[0] ? rowToProject(rows[0]) : null;
    },

    async create(input) {
      await ensureSchema();
      const id = randomUUID();
      const slug = await uniqueSlug((s) => store.getBySlug(s),input.slug || input.title);
      const rows = (await sql()`
        INSERT INTO projects (
          id, slug, title, subtitle, category, description,
          title_en, subtitle_en, description_en, cover_image,
          gallery, live_url, client, year, duration, role, tags, services,
          results, featured, accent, sort_order
        ) VALUES (
          ${id}, ${slug}, ${input.title}, ${input.subtitle}, ${input.category},
          ${input.description}, ${input.titleEn ?? null}, ${input.subtitleEn ?? null},
          ${input.descriptionEn ?? null}, ${input.coverImage}, ${JSON.stringify(input.gallery)},
          ${input.liveUrl}, ${input.client}, ${input.year}, ${input.duration},
          ${input.role}, ${JSON.stringify(input.tags)}, ${JSON.stringify(input.services)},
          ${JSON.stringify(input.results)}, ${input.featured}, ${input.accent},
          ${input.sortOrder}
        )
        RETURNING *
      `) as Row[];
      return rowToProject(rows[0]);
    },

    async update(id, input) {
      await ensureSchema();
      const slug = await uniqueSlug((s) => store.getBySlug(s),input.slug || input.title, id);
      const rows = (await sql()`
        UPDATE projects SET
          slug = ${slug},
          title = ${input.title},
          subtitle = ${input.subtitle},
          category = ${input.category},
          description = ${input.description},
          title_en = ${input.titleEn ?? null},
          subtitle_en = ${input.subtitleEn ?? null},
          description_en = ${input.descriptionEn ?? null},
          cover_image = ${input.coverImage},
          gallery = ${JSON.stringify(input.gallery)},
          live_url = ${input.liveUrl},
          client = ${input.client},
          year = ${input.year},
          duration = ${input.duration},
          role = ${input.role},
          tags = ${JSON.stringify(input.tags)},
          services = ${JSON.stringify(input.services)},
          results = ${JSON.stringify(input.results)},
          featured = ${input.featured},
          accent = ${input.accent},
          sort_order = ${input.sortOrder}
        WHERE id = ${id}
        RETURNING *
      `) as Row[];
      return rows[0] ? rowToProject(rows[0]) : null;
    },

    async remove(id) {
      await ensureSchema();
      const rows = (await sql()`
        DELETE FROM projects WHERE id = ${id} RETURNING id
      `) as Row[];
      return rows.length > 0;
    },
  };

  return store;
}

function createPostgresMessageStore(): MessageStore {
  return {
    async list() {
      await ensureSchema();
      const rows = (await sql()`
        SELECT * FROM messages ORDER BY created_at DESC
      `) as Row[];
      return rows.map(rowToMessage);
    },

    async create(input) {
      await ensureSchema();
      const rows = (await sql()`
        INSERT INTO messages (id, name, email, phone, subject, budget, body)
        VALUES (
          ${randomUUID()}, ${input.name}, ${input.email}, ${input.phone},
          ${input.subject}, ${input.budget}, ${input.body}
        )
        RETURNING *
      `) as Row[];
      return rowToMessage(rows[0]);
    },

    async setRead(id, read) {
      await ensureSchema();
      await sql()`UPDATE messages SET read = ${read} WHERE id = ${id}`;
    },

    async remove(id) {
      await ensureSchema();
      const rows = (await sql()`
        DELETE FROM messages WHERE id = ${id} RETURNING id
      `) as Row[];
      return rows.length > 0;
    },
  };
}

function createPostgresPostStore(): PostStore {
  const store: PostStore = {
    async list() {
      await ensureSchema();
      const rows = (await sql()`
        SELECT * FROM posts ORDER BY COALESCE(published_at, created_at) DESC
      `) as Row[];
      return rows.map(rowToPost);
    },

    async getBySlug(slug) {
      await ensureSchema();
      const rows = (await sql()`
        SELECT * FROM posts WHERE slug = ${slug} LIMIT 1
      `) as Row[];
      return rows[0] ? rowToPost(rows[0]) : null;
    },

    async getById(id) {
      await ensureSchema();
      const rows = (await sql()`
        SELECT * FROM posts WHERE id = ${id} LIMIT 1
      `) as Row[];
      return rows[0] ? rowToPost(rows[0]) : null;
    },

    async create(input) {
      await ensureSchema();
      const id = randomUUID();
      const slug = await uniqueSlug((s) => store.getBySlug(s), input.slug || input.title);
      const rows = (await sql()`
        INSERT INTO posts (
          id, slug, title, excerpt, content, cover_image, tags,
          title_en, excerpt_en, content_en, published, published_at
        ) VALUES (
          ${id}, ${slug}, ${input.title}, ${input.excerpt}, ${input.content},
          ${input.coverImage}, ${JSON.stringify(input.tags)},
          ${input.titleEn ?? null}, ${input.excerptEn ?? null}, ${input.contentEn ?? null},
          ${input.published}, ${input.publishedAt}
        )
        RETURNING *
      `) as Row[];
      return rowToPost(rows[0]);
    },

    async update(id, input) {
      await ensureSchema();
      const slug = await uniqueSlug(
        (s) => store.getBySlug(s),
        input.slug || input.title,
        id,
      );
      const rows = (await sql()`
        UPDATE posts SET
          slug = ${slug},
          title = ${input.title},
          excerpt = ${input.excerpt},
          content = ${input.content},
          cover_image = ${input.coverImage},
          tags = ${JSON.stringify(input.tags)},
          title_en = ${input.titleEn ?? null},
          excerpt_en = ${input.excerptEn ?? null},
          content_en = ${input.contentEn ?? null},
          published = ${input.published},
          published_at = ${input.publishedAt}
        WHERE id = ${id}
        RETURNING *
      `) as Row[];
      return rows[0] ? rowToPost(rows[0]) : null;
    },

    async remove(id) {
      await ensureSchema();
      const rows = (await sql()`
        DELETE FROM posts WHERE id = ${id} RETURNING id
      `) as Row[];
      return rows.length > 0;
    },
  };

  return store;
}

/* ══════════════════════════════════════════════════════
   Local JSON files
   ══════════════════════════════════════════════════════ */

const dataFile = (name: string) => path.join(process.cwd(), ".data", `${name}.json`);

async function readJson<T>(name: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(dataFile(name), "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(name: string, value: unknown) {
  await fs.mkdir(path.dirname(dataFile(name)), { recursive: true });
  await fs.writeFile(dataFile(name), JSON.stringify(value, null, 2), "utf8");
}

function createFileStore(): Store {
  const read = () => readJson<Project[]>("projects", structuredClone(SEED_PROJECTS));

  const sorted = (projects: Project[]) =>
    [...projects].sort(
      (a, b) =>
        a.sortOrder - b.sortOrder ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const store: Store = {
    async list() {
      return sorted(await read());
    },

    async getBySlug(slug) {
      return (await read()).find((p) => p.slug === slug) ?? null;
    },

    async getById(id) {
      return (await read()).find((p) => p.id === id) ?? null;
    },

    async create(input) {
      const projects = await read();
      const project: Project = {
        ...input,
        slug: await uniqueSlug((s) => store.getBySlug(s),input.slug || input.title),
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      };
      await writeJson("projects", [...projects, project]);
      return project;
    },

    async update(id, input) {
      const projects = await read();
      const index = projects.findIndex((p) => p.id === id);
      if (index === -1) return null;

      const updated: Project = {
        ...projects[index],
        ...input,
        slug: await uniqueSlug((s) => store.getBySlug(s),input.slug || input.title, id),
      };
      projects[index] = updated;
      await writeJson("projects", projects);
      return updated;
    },

    async remove(id) {
      const projects = await read();
      const next = projects.filter((p) => p.id !== id);
      if (next.length === projects.length) return false;
      await writeJson("projects", next);
      return true;
    },
  };

  return store;
}

function createFileMessageStore(): MessageStore {
  const read = () => readJson<Message[]>("messages", []);

  return {
    async list() {
      const messages = await read();
      return [...messages].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    },

    async create(input) {
      const messages = await read();
      const message: Message = {
        ...input,
        id: randomUUID(),
        read: false,
        createdAt: new Date().toISOString(),
      };
      await writeJson("messages", [...messages, message]);
      return message;
    },

    async setRead(id, read) {
      const messages = await this.list();
      const index = messages.findIndex((m) => m.id === id);
      if (index === -1) return;
      messages[index] = { ...messages[index], read };
      await writeJson("messages", messages);
    },

    async remove(id) {
      const messages = await read();
      const next = messages.filter((m) => m.id !== id);
      if (next.length === messages.length) return false;
      await writeJson("messages", next);
      return true;
    },
  };
}

function createFilePostStore(): PostStore {
  const read = () => readJson<Post[]>("posts", []);

  const sorted = (posts: Post[]) =>
    [...posts].sort(
      (a, b) =>
        new Date(b.publishedAt ?? b.createdAt).getTime() -
        new Date(a.publishedAt ?? a.createdAt).getTime(),
    );

  const store: PostStore = {
    async list() {
      return sorted(await read());
    },

    async getBySlug(slug) {
      return (await read()).find((p) => p.slug === slug) ?? null;
    },

    async getById(id) {
      return (await read()).find((p) => p.id === id) ?? null;
    },

    async create(input) {
      const posts = await read();
      const post: Post = {
        ...input,
        slug: await uniqueSlug((s) => store.getBySlug(s), input.slug || input.title),
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      };
      await writeJson("posts", [...posts, post]);
      return post;
    },

    async update(id, input) {
      const posts = await read();
      const index = posts.findIndex((p) => p.id === id);
      if (index === -1) return null;

      const updated: Post = {
        ...posts[index],
        ...input,
        slug: await uniqueSlug((s) => store.getBySlug(s), input.slug || input.title, id),
      };
      posts[index] = updated;
      await writeJson("posts", posts);
      return updated;
    },

    async remove(id) {
      const posts = await read();
      const next = posts.filter((p) => p.id !== id);
      if (next.length === posts.length) return false;
      await writeJson("posts", next);
      return true;
    },
  };

  return store;
}

/* ══════════════════════════════════════════════════════
   Read-only fallback (Vercel, no database)
   ══════════════════════════════════════════════════════ */

const NO_DB_ERROR =
  "پایگاه داده وصل نیست. متغیر DATABASE_URL را در تنظیمات Vercel اضافه کنید.";

function createReadOnlyStore(): Store {
  const reject = async (): Promise<never> => {
    throw new Error(NO_DB_ERROR);
  };

  return {
    async list() {
      return structuredClone(SEED_PROJECTS);
    },
    async getBySlug(slug) {
      return SEED_PROJECTS.find((p) => p.slug === slug) ?? null;
    },
    async getById(id) {
      return SEED_PROJECTS.find((p) => p.id === id) ?? null;
    },
    create: reject,
    update: reject,
    remove: reject,
  };
}

function createReadOnlyMessageStore(): MessageStore {
  const reject = async (): Promise<never> => {
    throw new Error(NO_DB_ERROR);
  };

  return {
    async list() {
      return [];
    },
    create: reject,
    setRead: reject,
    remove: reject,
  };
}

function createReadOnlyPostStore(): PostStore {
  const reject = async (): Promise<never> => {
    throw new Error(NO_DB_ERROR);
  };

  return {
    async list() {
      return [];
    },
    async getBySlug() {
      return null;
    },
    async getById() {
      return null;
    },
    create: reject,
    update: reject,
    remove: reject,
  };
}

/* ══════════════════════════════════════════════════════
   Selection
   ══════════════════════════════════════════════════════ */

let projectStore: Store | null = null;
let messageStore: MessageStore | null = null;
let postStore: PostStore | null = null;

export function getStore(): Store {
  projectStore ??= hasDatabase
    ? createPostgresStore()
    : isReadOnly
      ? createReadOnlyStore()
      : createFileStore();
  return projectStore;
}

export function getMessageStore(): MessageStore {
  messageStore ??= hasDatabase
    ? createPostgresMessageStore()
    : isReadOnly
      ? createReadOnlyMessageStore()
      : createFileMessageStore();
  return messageStore;
}

export function getPostStore(): PostStore {
  postStore ??= hasDatabase
    ? createPostgresPostStore()
    : isReadOnly
      ? createReadOnlyPostStore()
      : createFilePostStore();
  return postStore;
}
