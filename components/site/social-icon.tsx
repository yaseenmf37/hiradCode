/** Brand glyphs for the social links defined in lib/site-config. */
export type SocialName = "instagram" | "linkedin" | "telegram" | "whatsapp";

export function SocialIcon({
  name,
  className = "h-[18px] w-[18px]",
}: {
  name: string;
  className?: string;
}) {
  const icon = ICONS[name as SocialName] ?? null;
  if (!icon) return null;

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      {icon}
    </svg>
  );
}

const ICONS: Record<SocialName, React.ReactNode> = {
  instagram: (
    <>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
    </>
  ),
  linkedin: (
    <>
      <path
        fill="currentColor"
        d="M6.94 8.5H4.06V20h2.88V8.5ZM5.5 4a1.67 1.67 0 1 0 0 3.34A1.67 1.67 0 0 0 5.5 4ZM20 13.7c0-2.86-1.53-4.19-3.57-4.19-1.64 0-2.38.9-2.79 1.54V8.5h-2.88c.04.81 0 11.5 0 11.5h2.88v-6.42c0-.26.02-.52.1-.7.2-.52.68-1.05 1.48-1.05 1.05 0 1.47.8 1.47 1.97V20H20v-6.3Z"
      />
    </>
  ),
  telegram: (
    <path
      fill="currentColor"
      d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42Z"
    />
  ),
  whatsapp: (
    <path
      fill="currentColor"
      d="M12.04 2C6.6 2 2.17 6.42 2.17 11.86c0 1.94.53 3.76 1.44 5.32L2 22l4.94-1.58a9.8 9.8 0 0 0 5.1 1.42h.01c5.44 0 9.87-4.42 9.87-9.86 0-2.64-1.03-5.11-2.9-6.98A9.8 9.8 0 0 0 12.04 2Zm5.79 14.06c-.24.68-1.42 1.32-1.95 1.36-.5.04-1.13.22-3.7-.79-3.1-1.23-5.1-4.42-5.25-4.62-.15-.2-1.25-1.66-1.25-3.17s.79-2.25 1.07-2.56c.28-.31.61-.39.82-.39l.59.01c.19 0 .44-.07.68.53.24.6.83 2.06.9 2.21.07.15.12.33.02.53-.1.2-.15.32-.3.5l-.45.52c-.15.15-.31.31-.13.61.18.3.79 1.3 1.69 2.11 1.16 1.03 2.14 1.35 2.44 1.5.3.15.48.13.66-.08l.94-1.09c.21-.26.39-.2.66-.1.27.1 1.71.81 2.01.96.3.15.5.22.57.35.07.13.07.75-.17 1.43Z"
    />
  ),
};
