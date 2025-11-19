interface CommissionCardProps {
  title: string;
  description: string;
  status: 'open' | 'inProgress' | 'completed';
}

export default function CommissionCard({ title, description, status }: CommissionCardProps) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1rem',
      width: '250px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      margin: '0.5rem'
    }}>
      <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: '#555' }}>{description}</p>
      <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
        Status: {status}
      </p>
    </div>
  );
}
