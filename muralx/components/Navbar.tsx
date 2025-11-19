import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "1rem 2rem",
      backgroundColor: "#111",
      color: "#fff"
    }}>
      <Link href="/" style={{ fontWeight: "bold", color: "#fff", textDecoration: "none" }}>
        muralX
      </Link>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link href="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>
          Dashboard
        </Link>
      </div>
    </nav>
  );
}
