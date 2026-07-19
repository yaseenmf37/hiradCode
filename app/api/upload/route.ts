import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { isLoggedIn } from "@/lib/auth";

/**
 * Server-side upload to Vercel Blob.
 *
 * `put()` reads BLOB_READ_WRITE_TOKEN from the environment (set when a public
 * Blob store is connected) — or, if only BLOB_STORE_ID is present, authenticates
 * via Vercel's automatic OIDC token. Either way there is no secret to pass by
 * hand. The store must be PUBLIC, since portfolio images are loaded directly by
 * visitors' browsers. The file passes through this function, capped at 4 MB to
 * stay under the serverless body limit — ample for portfolio imagery; anything
 * larger can still go in as a pasted image URL.
 */

const MAX_BYTES = 4 * 1024 * 1024;

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const canUpload = () =>
  Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);

export async function POST(request: Request): Promise<NextResponse> {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "برای آپلود باید وارد شوید." }, { status: 401 });
  }

  if (!canUpload()) {
    return NextResponse.json(
      {
        error:
          "آپلود فایل روی این محیط فعال نیست. به‌جای آن می‌توانید آدرس تصویر را وارد کنید.",
      },
      { status: 501 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "فایلی دریافت نشد." }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "فقط تصویر مجاز است (JPG، PNG، WebP، AVIF، GIF)." },
      { status: 415 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "حجم فایل باید کمتر از ۴ مگابایت باشد." },
      { status: 413 },
    );
  }

  try {
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("blob upload failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "آپلود ناموفق بود." },
      { status: 400 },
    );
  }
}
