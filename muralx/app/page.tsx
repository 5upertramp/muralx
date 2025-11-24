'use client';

import { useState, useEffect } from "react"; 
import Navbar from "@/components/Navbar";
import CommissionCard from "@/components/CommissionCard";
import { ethers } from "ethers"; 

// --- 1. CONTRACT CONSTANTS ---
const MURALX_CONTRACT_ADDRESS = '0x6EF00175Da07083A0965ff521C76338D2EC1C9A4'; 
const MURALX_ABI = [
    // Include all necessary ABI entries here, truncated for brevity
    { "inputs": [], "name": "commissionIdCounter", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "_commissionId", "type": "uint256" }], "name": "getCommission", "outputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "address", "name": "client", "type": "address" }, { "internalType": "address", "name": "artist", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "enum MuralX.CommissionStatus", "name": "status", "type": "uint8" }, { "internalType": "bool", "name": "clientAgreed", "type": "bool" }, { "internalType": "bool", "name": "artistAgreed", "type": "bool" }, { "internalType": "uint256", "name": "finishDate", "type": "uint256" }, { "internalType": "bool", "name": "isProposal", "type": "bool" }], "stateMutability": "view", "type": "function" }
];


// --- 2. DATA STRUCTURE & HELPERS ---
const getStatusText = (statusIndex: number): string => {
    switch (statusIndex) {
        case 0: return 'Open';
        case 1: return 'In Progress';
        case 2: return 'Review Pending';
        case 3: return 'Disputed';
        case 4: return 'Closed';
        default: return 'Unknown';
    }
};

const formatDeadline = (timestamp: number): string => {
    if (timestamp === 0) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};


// --- 3. MAIN HOMEPAGE COMPONENT ---
export default function HomePage() {
    const [loading, setLoading] = useState(false);
    const [openItems, setOpenItems] = useState<any[]>([]);

    const fetchAllOpenItems = async () => {
        if (typeof window.ethereum === 'undefined') {
            console.warn("Wallet not detected. Using a read-only provider would be required for production.");
            return;
        }

        setLoading(true);

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(MURALX_CONTRACT_ADDRESS, MURALX_ABI, provider);

            const counter = await contract.commissionIdCounter();
            const totalItems = Number(counter);

            const fetchedOpenItems = [];

            for (let id = 1; id <= totalItems; id++) { 
                const commissionData = await contract.getCommission(id);
                const statusIndex = Number(commissionData[6]);

                if (statusIndex === 0) {
                    fetchedOpenItems.push({
                        id: id, 
                        patron: commissionData[1], 
                        artist: commissionData[2], 
                        budget: ethers.formatEther(commissionData[3]), 
                        title: commissionData[4],
                        description: commissionData[5],
                        statusText: getStatusText(statusIndex),
                        clientAgreed: commissionData[7],
                        artistAgreed: commissionData[8],
                        finishDate: formatDeadline(Number(commissionData[9])),
                        isProposal: commissionData[10],
                    });
                }
            }

            setOpenItems(fetchedOpenItems);
        } catch (err) {
            console.error("Error fetching open items:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOpenItems();
    }, []);


    // --- RENDERING LOGIC ---

    const renderContent = () => {
        if (loading) {
            return <div style={{ color: '#aaa' }}>Loading the decentralized gallery feed...</div>;
        }

        if (openItems.length === 0) {
            return (
                <div style={{ color: '#aaa', gridColumn: '1 / -1', padding: '2rem', textAlign: 'center' }}>
                    The marketplace is quiet right now. Check back later!
                </div>
            );
        }

        return (
            <div style={{ 
                display: 'grid', 
                // FIX: Explicitly define 3 columns of equal fraction (1fr) so that 
                // if there are only 2 items, they occupy only the first two columns (2/3 of the width).
                gridTemplateColumns: '1fr 1fr 1fr', 
                gap: '2rem' 
            }}>
                {openItems.map((item) => (
                    <CommissionCard 
                        key={item.id} 
                        item={item} 
                    />
                ))}
            </div>
        );
    };


    return (
        <div style={{ minHeight: "100vh", background: "black", color: "white" }}>
            <Navbar />
            
            <div style={{ padding: "2rem" }}>
                {renderContent()}
            </div>
        </div>
    );
}