'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const [mode, setMode] = useState<'patron' | 'artist'>('patron');

  const modeStyle = (current: 'patron' | 'artist') => ({
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    backgroundColor: mode === current ? '#fff' : 'transparent',
    color: mode === current ? '#111' : '#fff',
    fontWeight: 'bold',
    fontFamily: "'Orbitron', sans-serif",
    transition: 'all 0.2s',
  });

  const buttonStyle = {
    padding: '1rem 2rem',
    backgroundColor: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontFamily: "'Orbitron', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem',
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: 10,
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <div>
          <span
            onClick={() => setMode('patron')}
            style={modeStyle('patron')}
          >
            Patron
          </span>
          <span
            onClick={() => setMode('artist')}
            style={modeStyle('artist')}
          >
            Artist
          </span>
        </div>
      </div>

      <button style={buttonStyle}>
        <span>+</span> New Commission
      </button>
    </div>
  );
}
