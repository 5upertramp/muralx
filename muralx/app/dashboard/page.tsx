"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { getContract } from "@/utils/ethers";
import { ethers } from "ethers";

export default function DashboardPage() {
  const [mode, setMode] = useState<"patron" | "artist">("patron");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    finishDate: "",
    price: "",
  });

  const [commissions, setCommissions] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const contract = getContract();
    if (!contract) return;

    try {
      const tx = await contract.createCommission(
        formData.description,
        formData.finishDate,
        ethers.utils.parseEther(formData.price)
      );
      await tx.wait();
      console.log("Commission created!", tx);
      setFormData({ description: "", finishDate: "", price: "" });
      setShowForm(false);
      fetchCommissions();
    } catch (err) {
      console.error("Error creating commission:", err);
    }
  };

  const fetchCommissions = async () => {
    const contract = getContract();
    if (!contract) return;

    const count = await contract.commissionCount();
    const commissionList = [];

    for (let i = 1; i <= count; i++) {
      const commission = await contract.getCommission(i);
      commissionList.push(commission);
    }

    setCommissions(commissionList);
  };

  return (
    <div style={{ minHeight: "100vh", background: "black", color: "white" }}>
      <Navbar />

      <div style={{ padding: "2rem" }}>
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
          >
            + New Commission
          </button>
        )}

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
              }}
            >
              <h2 style={{ margin: 0 }}>New Commission</h2>
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
                />
                <input
                  type="date"
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
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
