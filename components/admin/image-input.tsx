"use client";

import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { useRef, useState } from "react";

import { Input } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type UploadState = { busy: boolean; error?: string };

async function uploadFile(file: File): Promise<string> {
  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
  });
  return blob.url;
}

/** Cover image: paste a URL, pick a file, or drop one on the box. */
export function ImageInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}) {
  const [state, setState] = useState<UploadState>({ busy: false });
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;

    setState({ busy: true });
    try {
      onChange(await uploadFile(file));
      setState({ busy: false });
    } catch (err) {
      setState({
        busy: false,
        error: err instanceof Error ? err.message : "آپلود ناموفق بود.",
      });
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "relative aspect-video overflow-hidden rounded-2xl border-2 border-dashed transition-colors",
          dragging
            ? "border-neon-pink bg-neon-pink/10"
            : error
              ? "border-red-500/40"
              : "border-white/10 bg-white/[0.03]",
        )}
      >
        {value ? (
          <>
            <Image src={value} alt="پیش‌نمایش" fill sizes="600px" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-3 end-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition-colors hover:bg-red-500"
              aria-label="حذف تصویر"
            >
              ✕
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={state.busy}
            className="text-fog-500 hover:text-fog-300 flex h-full w-full flex-col items-center justify-center gap-2 transition-colors"
          >
            {state.busy ? (
              <>
                <span className="border-neon-pink h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-current" />
                <span className="text-xs font-bold">در حال آپلود…</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden>
                  <path
                    d="M12 16V4m0 0L8 8m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xs font-bold">
                  تصویر را بکشید یا کلیک کنید
                </span>
                <span className="text-fog-600 text-[10px]">
                  JPG، PNG، WebP — حداکثر ۸ مگابایت
                </span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir="ltr"
        placeholder="…یا آدرس تصویر را اینجا بچسبانید https://"
        className="text-xs"
      />

      {state.error && (
        <p className="text-[11px] font-bold text-red-400">{state.error}</p>
      )}
      {error && <p className="text-[11px] font-bold text-red-400">{error}</p>}
    </div>
  );
}

/** Gallery: any number of extra shots, each removable. */
export function GalleryInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [state, setState] = useState<UploadState>({ busy: false });
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    setState({ busy: true });
    try {
      const uploaded = await Promise.all([...files].map(uploadFile));
      onChange([...value, ...uploaded]);
      setState({ busy: false });
    } catch (err) {
      setState({
        busy: false,
        error: err instanceof Error ? err.message : "آپلود ناموفق بود.",
      });
    }
  };

  const addUrl = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setUrl("");
  };

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10"
            >
              <Image src={src} alt="" fill sizes="150px" className="object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, index) => index !== i))}
                className="absolute inset-0 flex items-center justify-center bg-black/70 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="حذف تصویر"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={state.busy}
          className="text-fog-400 hover:border-neon-pink/40 hover:text-fog-100 flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 text-xs font-bold transition-colors disabled:opacity-50"
        >
          {state.busy ? (
            <>
              <span className="border-neon-pink h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-current" />
              در حال آپلود…
            </>
          ) : (
            "+ افزودن تصویر"
          )}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      <div className="flex gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          dir="ltr"
          placeholder="https://… افزودن با آدرس"
          className="text-xs"
        />
        <button
          type="button"
          onClick={addUrl}
          className="text-fog-300 hover:text-fog-100 shrink-0 rounded-2xl border border-white/10 px-4 text-xs font-bold transition-colors hover:bg-white/5"
        >
          افزودن
        </button>
      </div>

      {state.error && (
        <p className="text-[11px] font-bold text-red-400">{state.error}</p>
      )}
    </div>
  );
}
