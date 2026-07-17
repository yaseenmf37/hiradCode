import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { isLoggedIn } from "@/lib/auth";

/**
 * Issues short-lived client-upload tokens for Vercel Blob. The browser uploads
 * straight to Blob storage, so files never pass through the serverless function
 * and the 4.5 MB request-body ceiling doesn't apply.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "آپلود فایل پیکربندی نشده است. در داشبورد Vercel یک Blob Store بسازید یا به‌جای آپلود، آدرس تصویر را وارد کنید.",
      },
      { status: 501 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // The token is what authorises the upload — check the session here,
        // not after the fact.
        if (!(await isLoggedIn())) {
          throw new Error("برای آپلود باید وارد شوید.");
        }

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
            "image/gif",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 8 * 1024 * 1024,
        };
      },
      onUploadCompleted: async () => {
        // Required by the contract; nothing to reconcile since the URL is
        // written into the project row by the form submit.
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "آپلود ناموفق بود." },
      { status: 400 },
    );
  }
}
