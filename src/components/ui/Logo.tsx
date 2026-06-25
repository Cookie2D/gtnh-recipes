import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="logo-link">
      Mod<span className="text-neon">Crafter</span>
    </Link>
  );
}
