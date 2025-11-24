'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from "ethers"; // Needed for types if using TypeScript (optional, but good practice)

// --- DATA STRUCTURE & HELPERS (Copied from page.tsx for local use) ---
interface Commission {
    id: number;
    title: string;
    description: string;
    value: string; // Use string for formatted ETH
    statusText: string;
    isProposal: boolean;
    finishDate: string;
    budget: string; // Use the property name from your fetch
}

// Function to generate a consistent random number based on a seed
const randomSeeder = (seed: number) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// --- COMMISSION CARD COMPONENT ---

const CommissionCard: React.FC<{ item: Commission }> = ({ item }) => {
    const router = useRouter();

    const handleNavigate = () => {
        router.push(`/commission/${item.id}`);
    };

    // Original minHeight was '200px' plus 1.5rem padding + 3rem padding-bottom.
    // Reducing the minHeight from '200px' to '150px' and removing the description 
    // should achieve roughly a 25% reduction in overall height.
    const newMinHeight = '150px'; 

    return (
        <a 
            onClick={handleNavigate}
            style={{ textDecoration: 'none' }}
        >
            <div 
                style={{ 
                    // Card structure styling
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '2rem',
                    // HEIGHT CHANGE APPLIED HERE
                    minHeight: newMinHeight, 
                    fontSize: '1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    paddingBottom: '3rem', 
                    
                    // Background styling
                    background: `
                        radial-gradient(circle at 10% 10%, rgba(255, 215, 0, 0.05) 0%, transparent 40%),
                        radial-gradient(circle at 90% 80%, rgba(167, 165, 255, 0.05) 0%, transparent 40%),
                        ${item.isProposal ? '#0f0f1c' : '#000'}
                    `,
                    
                    color: 'white',
                    cursor: 'pointer',
                    borderColor: item.isProposal ? '#5a528e' : '#333', 
                }}
            >
                
                {/* TITLE (Unchanged) */}
                <h3 style={{ 
                    fontSize: '1.5rem', 
                    marginBottom: '1rem', 
                    color: item.isProposal ? '#a7a5ff' : '#FFD700'
                }}>
                    {item.title}
                </h3>
                
                {/* DESCRIPTION REMOVED: 
                <p style={{ 
                    fontSize: '1.1rem', 
                    marginBottom: '1rem', 
                    color: '#bbb', 
                    flexGrow: 1 
                }}>
                    {item.description.substring(0, 100)}{item.description.length > 100 ? '...' : ''}
                </p>
                */}

                {/* --- PROCEDURAL ART CANVAS --- */}
                <div 
                    style={{ 
                        position: 'relative', 
                        width: '100%', 
                        // HEIGHT KEPT THE SAME to maintain aspect ratio of the art
                        height: '200px', 
                        backgroundColor: '#222', 
                        borderRadius: '8px', 
                        marginBottom: '1rem',
                        border: '1px solid #444',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }} 
                >
                    {[...Array(10)].map((_, i) => {
                        const seed = (item.id * 1000) + i; 
                        
                        const size = Math.floor(randomSeeder(seed + 1) * 70) + 30; 
                        const top = randomSeeder(seed + 2) * 100;
                        const left = randomSeeder(seed + 3) * 100;
                        const hue = randomSeeder(seed + 4) * 360;
                        const color = `hsl(${hue}, 70%, 60%)`;
                        
                        return (
                            <div key={i} style={{
                                position: 'absolute',
                                width: `${size}px`,
                                height: `${size}px`,
                                borderRadius: '50%',
                                backgroundColor: color,
                                opacity: 0.6, 
                                top: `${top}%`,
                                left: `${left}%`,
                                transform: 'translate(-50%, -50%)',
                            }} />
                        );
                    })}
                    <span style={{ fontSize: '1.5rem', opacity: 0.3, position: 'absolute' }}>[ART PREVIEW]</span>
                </div>
                {/* ----------------------------- */}
                
                {/* FOOTER (Value and Deadline) (Unchanged) */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderTop: '1px solid #333', 
                    paddingTop: '1rem',
                    marginTop: 'auto' 
                }}>
                    <div style={{ textAlign: 'left' }}>
                        <p style={{ margin: '0', fontWeight: 'bold', fontSize: '1rem', color: '#fff' }}>
                            {item.budget} ETH
                        </p>
                        <p style={{ margin: '0', fontSize: '0.75rem', color: '#888' }}>
                            Value
                        </p>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0', fontWeight: 'bold', fontSize: '1rem', color: item.finishDate === 'N/A' ? '#888' : '#fff' }}>
                            {item.finishDate}
                        </p>
                        <p style={{ margin: '0', fontSize: '0.75rem', color: '#888' }}>
                            {item.isProposal ? 'Est. Date' : 'Deadline'}
                        </p>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default CommissionCard;