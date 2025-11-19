// app/commission/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

const mockCommissions = [
  { id: 1, title: 'Landscape Painting', description: 'Serene mountains and lake.', status: 'open' },
  { id: 2, title: 'Modern Portrait', description: 'Vibrant oil portrait.', status: 'inProgress' },
  { id: 3, title: 'Abstract Art', description: 'Colorful geometric shapes.', status: 'completed' },
  { id: 4, title: 'Cityscape Sketch', description: 'Busy streets at sunset.', status: 'open' },
  { id: 5, title: 'Fantasy Illustration', description: 'Dragons and castles.', status: 'inProgress' },
  { id: 6, title: 'Still Life', description: 'Fruits and vases.', status: 'completed' },
  { id: 7, title: 'Digital Character', description: 'Concept art for games.', status: 'open' },
  { id: 8, title: 'Watercolor Flowers', description: 'Soft pastel blossoms.', status: 'completed' },
];

export default function CommissionPage() {
  const params = useParams();
  const commissionId = Number(params.id);
  const commission = mockCommissions.find(c => c.id === commissionId);

  if (!commission) return <div>Commission not found</div>;

  return (
    <>
      <Navbar />
      <main style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem',
        padding: '4rem 2rem',
        fontFamily: 'sans-serif',
        alignItems: 'flex-start',
      }}>
        <div style={{
          flex: 1,
          backgroundColor: '#eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          aspectRatio: '4/3',
          position: 'relative',
        }}>
          {[...Array(10)].map((_, i) => {
            const size = Math.floor(Math.random() * 50) + 20; // circle size 20-70px
            const top = Math.random() * 100; // percent
            const left = Math.random() * 100; // percent
            const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
            return (
              <div key={i} style={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                backgroundColor: color,
                top: `${top}%`,
                left: `${left}%`,
                transform: 'translate(-50%, -50%)'
              }} />
            )
          })}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{commission.title}</h2>
          <p style={{ marginBottom: '1rem' }}>{commission.description}</p>
          <p>Status: {commission.status === 'inProgress' ? 'In Progress' : commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}</p>
        </div>
      </main>
    </>
  );
}
