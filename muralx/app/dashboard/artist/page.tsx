'use client';

import Navbar from '@/components/Navbar';
import CommissionCard from '@/components/CommissionCard';
import Link from 'next/link';

const mockArtworks = [
  { id: 1, title: 'Abstract Art', description: 'Colorful geometric shapes.', status: 'open' },
  { id: 2, title: 'Modern Portrait', description: 'Vibrant oil portrait.', status: 'inProgress' },
  { id: 3, title: 'Still Life', description: 'Fruits and vases.', status: 'completed' },
];

export default function ArtistDashboard() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h2 style={{ marginBottom: '1rem' }}>Your Artworks & Bids</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem',
          width: '100%',
          maxWidth: '1000px'
        }}>
          {mockArtworks.map(c => (
            <Link key={c.id} href={`/commission/${c.id}`} style={{ textDecoration: 'none' }}>
              <CommissionCard
                title={c.title}
                description={c.description}
                status={c.status as 'open' | 'inProgress' | 'completed'}
              />
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
