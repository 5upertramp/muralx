'use client';

import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

// --- Utility function for addresses ---
// Function to shorten an Ethereum address for cleaner display
const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// --- Contract Constants ---
const MURALX_CONTRACT_ADDRESS = '0x4c3a3c7589C1f3d71FD63b682f454Dacc93e98Fd'; 
const MURALX_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "commissions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "patron",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "budget",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isCompleted",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_budget",
        "type": "uint256"
      }
    ],
    "name": "createCommission",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCommissionCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]; 


export default function CommissionPage() {
  const params = useParams();
  const router = useRouter(); 
  const commissionId = Number(params.id);
  const [commission, setCommission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch a single commission by ID
  const fetchCommissionDetail = async (id: number) => {
    if (typeof window.ethereum === 'undefined' || id === 0) return;
    setIsLoading(true);

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
            MURALX_CONTRACT_ADDRESS, 
            MURALX_ABI, 
            provider
        );

        // We fetch by array index (id - 1)
        const commissionData = await contract.commissions(id - 1); 

        const fetchedCommission = {
            id: id,
            patron: commissionData[1],
            title: commissionData[2],
            description: commissionData[3],
            budget: ethers.formatEther(commissionData[4]), 
            status: commissionData[5] ? 'completed' : 'open',
        };
        
        setCommission(fetchedCommission);
    } catch (err) {
        console.error("Error fetching commission detail:", err);
        setCommission(null); 
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (commissionId) {
        fetchCommissionDetail(commissionId);
    }
  }, [commissionId]);

  if (isLoading) return <div style={{padding: '4rem', color: 'white'}}>Loading Commission #{commissionId}...</div>;
  if (!commission) return <div style={{padding: '4rem', color: 'white'}}>Commission not found</div>;


  return (
    <div style={{ minHeight: "100vh", background: "black", color: "white" }}>
      <Navbar />
      
      <main style={{
        padding: '2rem 4rem',
        fontFamily: 'sans-serif',
      }}>
        {/* Back Button was removed here */}

        {/* Main Content Area */}
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '3rem',
            alignItems: 'flex-start',
        }}>
            {/* Left Column: Placeholder Art */}
            <div style={{
                flex: 1,
                backgroundColor: '#222',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '4/3',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Visual placeholder */}
                {[...Array(10)].map((_, i) => {
                    const size = Math.floor(Math.random() * 50) + 20;
                    const top = Math.random() * 100;
                    const left = Math.random() * 100;
                    const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
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
                            transform: 'translate(-50%, -50%)'
                        }} />
                    )
                })}
                <span style={{ fontSize: '1.5rem', opacity: 0.3, position: 'absolute' }}>[ART PREVIEW]</span>
            </div>
            
            {/* Right Column: Updated Detail Display (NO BOX STYLING) */}
            <div style={{ 
                flex: 1, 
                borderRadius: '12px',
                marginTop: '-15px', /* Nudge UP the right column */
            }}>
                
                {/* Title and ID Header (Still uses the gray separator) */}
                <div style={{ 
                    borderBottom: '1px solid #333',
                    paddingBottom: '0.5rem', 
                    marginBottom: '0.75rem' /* More compact space below header */
                }}>
                    <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.25rem 0' }}>
                        {commission.title}
                    </h1>
                    <p style={{ margin: '0', color: '#aaa', fontSize: '1rem' }}> 
                        Commission #{commission.id}
                    </p>
                </div>

                {/* Description - Made slightly more compact */}
                <p style={{ 
                    fontSize: '1rem', 
                    marginBottom: '1rem', /* More compact space below description */
                    color: '#ccc' 
                }}>
                    {commission.description}
                </p>

                {/* Status */}
                <div style={{ marginBottom: '0.25rem' }}> 
                    <h3 style={{ fontSize: '1rem', color: '#aaa', margin: '0 0 0.05rem 0', textTransform: 'uppercase' }}>Status</h3> 
                    <p style={{ 
                        margin: 0, 
                        fontWeight: 'bold',
                        fontSize: '1rem', 
                        color: commission.status === 'open' ? '#32cd32' : '#ffc300' 
                    }}>
                        {commission.status.toUpperCase()}
                    </p>
                </div>

                {/* Budget */}
                <div style={{ marginBottom: '0.25rem' }}> 
                    <h3 style={{ fontSize: '1rem', color: '#aaa', margin: '0 0 0.05rem 0', textTransform: 'uppercase' }}>Patron Budget</h3> 
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem', color: '#fff' }}> 
                        {commission.budget} ETH
                    </p>
                </div>

                {/* Patron Address */}
                <div style={{ marginBottom: '0' }}>
                    <h3 style={{ fontSize: '1rem', color: '#aaa', margin: '0 0 0.05rem 0', textTransform: 'uppercase' }}>Patron Address</h3> 
                    <a 
                        href={`https://sepolia.etherscan.io/address/${commission.patron}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#00aaff', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem' }} 
                    >
                        {shortenAddress(commission.patron)} ↗
                    </a>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}