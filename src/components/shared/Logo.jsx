export default function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <polygon points="20,4 36,34 4,34" fill="#C9A84C" opacity="0.9" />
      <polygon points="20,10 30,30 10,30" fill="#F5E6C0" opacity="0.6" />
    </svg>
  );
}
