'use client';

// FIX: Import useState and useEffect from 'react'
import { useState, useEffect } from "react"; 
import Navbar from "@/components/Navbar";
import { ethers } from "ethers"; 

// --- 1. CONTRACT CONSTANTS ---
// Your deployed contract address
const MURALX_CONTRACT_ADDRESS = '0x4c3a3c7589C1f3d71FD63b682f454Dacc93e98Fd'; 

// Full ABI
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


export default function DashboardPage() {
  const [mode, setMode] = useState<"patron" | "artist">("patron");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    finishDate: "", 
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [commissions, setCommissions] = useState<any[]>([]);


  // --- Ethers.js READ Logic (FIXED LOOP & FILTER) ---
  const fetchCommissions = async () => {
      if (typeof window.ethereum === 'undefined') return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      
      const contract = new ethers.Contract(
          MURALX_CONTRACT_ADDRESS, 
          MURALX_ABI, 
          provider
      );

      try {
          const countBigInt = await contract.getCommissionCount();
          const totalCount = Number(countBigInt); 
          
          const fetchedCommissions = [];

          // Loop starts at 0 and goes up to (but not including) totalCount
          for (let i = 0; i < totalCount; i++) {
              const commissionData = await contract.commissions(i); 

              const commission = {
                  // Use i + 1 for the ID for better display/URL consistency
                  id: i + 1, 
                  patron: commissionData[1],
                  title: commissionData[2],
                  description: commissionData[3],
                  // Convert Wei to ETH for display
                  budget: ethers.formatEther(commissionData[4]), 
                  isCompleted: commissionData[5],
              };
              
              // Filter: Only show commissions created by the active user (Patron mode)
              if (commission.patron.toLowerCase() === userAddress.toLowerCase()) {
                  fetchedCommissions.push(commission);
              }
          }

          setCommissions(fetchedCommissions);
      } catch (err) {
          console.error("Error fetching commissions:", err);
      }
  };

  // Fetch data on load
  useEffect(() => {
      fetchCommissions();
  }, []); 


  // --- Ethers.js WRITE Logic ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof window.ethereum === 'undefined') {
        alert("Please install MetaMask to create a commission.");
        return;
    }
    
    setLoading(true);

    try {
        // Force MetaMask to switch to the Sepolia network (Chain ID: 0xaa36a7)
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], 
        });

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        const titleForContract = formData.description.substring(0, 30); 
        const budgetInWei = ethers.parseEther(formData.price); 

        const contract = new ethers.Contract(
            MURALX_CONTRACT_ADDRESS, 
            MURALX_ABI, 
            signer 
        );

        const tx = await contract.createCommission(
            titleForContract, 
            formData.description,
            budgetInWei
        );

        alert(`Transaction sent! Waiting for confirmation (Hash: ${tx.hash.substring(0, 10)}...).`);
        
        await tx.wait(); 
        
        alert("Commission created successfully on Sepolia!");
        
        // Reset state and HIDE form
        setFormData({ description: "", finishDate: "", price: "" });
        setShowForm(false);
        
        // Refresh the commission list
        fetchCommissions(); 
        
    } catch (err: any) {
        console.error("Error creating commission:", err);
        alert(`Transaction failed: ${err.reason || err.message || 'Check console.'}`);
    } finally {
        setLoading(false);
    }
  };


  return (
    <div style={{ minHeight: "100vh", background: "black", color: "white" }}>
      <Navbar />

      <div style={{ padding: "2rem" }}>
        {/* Mode Switch UI */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <span
            onClick={() => setMode("patron")}
            style={{
              cursor: "pointer",
              padding: "0.5rem 1rem",
              backgroundColor: mode === "patron" ? "#fff" : "#000",
              color: mode === "patron" ? "#000" : "#fff",
              borderRadius: "8px",
            }}
          >
            Patron
          </span>
          <span
            onClick={() => setMode("artist")}
            style={{
              cursor: "pointer",
              padding: "0.5rem 1rem",
              backgroundColor: mode === "artist" ? "#fff" : "#000",
              color: mode === "artist" ? "#000" : "#fff",
              borderRadius: "8px",
            }}
          >
            Artist
          </span>
        </div>
        
        {/* Commission List Display */}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            {mode === 'patron' ? 'My Created Commissions' : 'Available Commissions'} ({commissions.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {commissions.map((commission) => (
                <a 
                    key={commission.id} 
                    href={`/commission/${commission.id}`} 
                    style={{ textDecoration: 'none' }}
                >
                    <div 
                        style={{ 
                            padding: '1.5rem', 
                            backgroundColor: '#1a1a1a', 
                            borderRadius: '10px', 
                            border: '1px solid #333',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{commission.title}</h3>
                        <p style={{ margin: '0 0 0.75rem 0', color: '#bbb', fontSize: '0.9rem' }}>
                            {commission.description.substring(0, 80)}{commission.description.length > 80 ? '...' : ''}
                        </p>
                        <p style={{ margin: '0.25rem 0', fontWeight: 'bold' }}>
                            Budget: {commission.budget} ETH
                        </p>
                        <p style={{ margin: '0', fontSize: '0.9rem' }}>
                            Status: {commission.isCompleted ? 'Completed' : 'Open'}
                        </p>
                    </div>
                </a>
            ))}
        </div>
        
        {/* + New Commission Button */}
        {mode === "patron" && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              position: "fixed",
              bottom: "30px",
              right: "30px",
              padding: "1rem 1.5rem",
              fontSize: "1rem",
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: "50px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            disabled={loading}
          >
            {loading ? "Processing..." : "+ New Commission"}
          </button>
        )}

        {/* New Commission Form Modal (UPDATED with Close Button) */}
        {showForm && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "2rem",
            }}
            // Add overlay click handler to close the modal
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setShowForm(false);
                }
            }}
          >
            <div
              style={{
                background: "#111",
                padding: "2rem",
                borderRadius: "12px",
                width: "350px",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                border: "1px solid #333",
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <h2 style={{ margin: 0 }}>New Commission</h2>
                 {/* NEW CLOSE BUTTON */}
                 <button
                    onClick={() => setShowForm(false)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        padding: '0',
                        lineHeight: '1',
                    }}
                    disabled={loading}
                 >
                    &times; {/* HTML entity for 'x' */}
                 </button>
              </div>
              
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={{
                    padding: "0.75rem",
                    borderRadius: "6px",
                    background: "#222",
                    color: "white",
                    border: "1px solid #444",
                  }}
                  disabled={loading}
                />
                <input
                  type="date"
                  placeholder="Finish Date"
                  value={formData.finishDate}
                  onChange={(e) =>
                    setFormData({ ...formData, finishDate: e.target.value })
                  }
                  style={{
                    padding: "0.75rem",
                    borderRadius: "6px",
                    background: "#222",
                    color: "white",
                    border: "1px solid #444",
                  }}
                  disabled={loading}
                />
                <input
                  type="number"
                  placeholder="Price (ETH)"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  style={{
                    padding: "0.75rem",
                    borderRadius: "6px",
                    background: "#222",
                    color: "white",
                    border: "1px solid #444",
                  }}
                  disabled={loading}
                />
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem",
                    borderRadius: "8px",
                    background: "#fff",
                    color: "#000",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  disabled={loading}
                >
                  {loading ? "Sending Transaction..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}