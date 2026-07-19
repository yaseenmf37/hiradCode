import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { isLoggedIn } from "@/lib/auth";

/**
 * Server-side upload to Vercel Blob.
 *
 * The newer Blob store connects via BLOB_STORE_ID + Vercel's automatic OIDC
 * token rather than a static BLOB_READ_WRITE_TOKEN, so `put()` authenticates
 * itself on Vercel with no secret to manage. The file passes through this
 * function, which caps it at 4 MB to stay under the serverless body limit —
 * ample for portfolio imagery. For anything larger, the panel still accepts a
 * pasted image URL.
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
