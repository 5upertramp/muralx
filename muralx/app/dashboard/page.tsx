import Navbar from '@/components/Navbar';

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <main style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "sans-serif",
        padding: "2rem"
      }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>Dashboard</h1>
        <p style={{ opacity: 0.7, textAlign: "center" }}>
          This is where users can switch roles between Patron and Artist,
          view their commissions, and manage their creations.
        </p>
      </main>
    </>
  );
}
