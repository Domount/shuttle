type AppIconProps = {
  size?: number;
  className?: string;
};

/** Canonical Shuttle mark — synced from brand/shuttle-icon.png via npm run sync:favicon */
export function AppIcon({ size = 20, className }: AppIconProps) {
  return (
    <img
      src="/shuttle-icon.png"
      className={className}
      width={size}
      height={size}
      alt=""
      aria-hidden
    />
  );
}
