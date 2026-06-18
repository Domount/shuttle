const SHUTTLE_ICON_PATH =
  "M11 11.5h6.5c2.2 0 3.5 1.1 3.5 2.6 0 1.2-.7 2.1-2 2.5l3.2 5.4H14.8l-2.8-4.8H11v4.8H8V11.5h3zm3 3.8h2.8c.8 0 1.2-.4 1.2-.9s-.4-.9-1.2-.9H14v1.8z";

type AppIconProps = {
  size?: number;
  className?: string;
};

/** Canonical Shuttle mark — keep in sync with web/public/favicon.svg */
export function AppIcon({ size = 20, className }: AppIconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      aria-hidden
    >
      <rect width="32" height="32" rx="7" fill="#3b82f6" />
      <path d={SHUTTLE_ICON_PATH} fill="#fff" />
    </svg>
  );
}

export const shuttleIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="7" fill="#3b82f6"/><path d="${SHUTTLE_ICON_PATH}" fill="#fff"/></svg>`;
