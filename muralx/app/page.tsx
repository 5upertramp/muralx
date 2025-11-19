'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import CommissionCard from '@/components/CommissionCard';
import Link from 'next/link';

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

export default function Home() {
  const [filter, setFilter] = useState<'all' | 'open' | 'inProgress' | 'completed'>('all');

  const filteredCommissions = filter === 'all'
    ? mockCommissions
    : mockCommissions.filter(c => c.status === filter);

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

        <div style={{ marginBottom: '1.5rem', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <label style={{ marginRight: '0.5rem' }}>Filter by status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '2rem',
          width: '100%',
          maxWidth: '1000px'
        }}>
          {filteredCommissions.map((c) => (
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
