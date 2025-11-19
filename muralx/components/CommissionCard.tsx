// components/CommissionCard.tsx
export default function CommissionCard({ title, description, status }: CommissionCardProps) {
  const displayStatus = status === 'inProgress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '2rem',
      minHeight: '200px',
      fontSize: '1.2rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      paddingBottom: '3rem' // added extra padding at the bottom
    }}>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
      <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{description}</p>
      <span style={{ marginBottom: '1rem' }}>{displayStatus}</span>
    </div>
  );
}
