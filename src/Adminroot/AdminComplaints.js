import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Backend/api";
import qs from "qs";

const AdminComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const user = JSON.parse(localStorage.getItem("userId"));
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    // Redirect if not admin
    if (!user || role?.trim().toLowerCase() !== "admin") {
      alert("Unauthorized access");
      navigate("/");
    } else {
      fetchAllComplaints();
    }
  }, []);

  const fetchAllComplaints = async () => {
    try {
      const res = await API.get("/complaints/list");

      // Directly use the array since it's not wrapped
      if (Array.isArray(res.data)) {
        setComplaints(res.data);
      } else {
        alert("Unexpected response format");
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      alert("Error fetching complaints");
    }
  };

  const handleResolve = async (id) => {
    try {
      const payload = qs.stringify({ complaint_id: id }); // 👈 FIXED HERE
      const res = await API.post("/complaints/resolve", payload, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      alert(res.data.message || "Complaint resolved");
      fetchAllComplaints();
    } catch (err) {
      console.error("Failed to resolve complaint", err);
      alert("Error resolving complaint");
    }
  };

  const isResolved = (status) => status?.toLowerCase() === "resolved";

  const buttonStyle = {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "0.8rem",
    cursor: "pointer",
  };

  return (
    <>
      <style>
        {`
          /* Responsive adjustments */

          /* Container for main layout flex */
          .main-layout {
            display: flex;
            flex: 1;
            height: calc(100vh - 52px); /* navbar height approx */
            overflow: hidden;
          }

          /* Vertical navbar */
          .vertical-navbar {
            width: 120px;
            max-width: 120px;
            background: #333;
            color: white;
            padding: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 0.8rem;
            min-width: 60px;
            justify-content: space-between;
            flex-shrink: 0;
          }

          /* Complaint section with scroll */
          .complaint-section {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            color: white;
          }

          /* Responsive tweaks */
          @media (max-width: 1024px) {
            /* iPad landscape/tablet */
            .main-layout {
              flex-direction: column;
              height: auto;
            }
            .vertical-navbar {
              width: 100%;
              max-width: 100%;
              flex-direction: row;
              justify-content: space-around;
              padding: 5px 10px;
              font-size: 0.75rem;
            }
            .complaint-section {
              padding: 10px;
              max-height: 60vh;
              overflow-y: auto;
            }
          }

          @media (max-width: 600px) {
            /* Phones */
            .main-layout {
              flex-direction: column;
              height: auto;
            }
            .vertical-navbar {
              width: 100%;
              max-width: 100%;
              flex-direction: row;
              justify-content: space-around;
              padding: 5px 10px;
              font-size: 0.7rem;
            }
            .complaint-section {
              padding: 10px 5px;
              max-height: 50vh;
              overflow-y: auto;
            }
            ul {
              padding-left: 0;
            }
            li {
              font-size: 0.9rem;
            }
            button {
              font-size: 0.8rem !important;
              padding: 4px 8px !important;
            }
          }
        `}
      </style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          fontFamily: "Arial, sans-serif",
          backgroundImage: "url('/home1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "darken",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: "white",
        }}
      >
        {/* Horizontal Navbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#28a745",
            padding: "10px 20px",
            color: "white",
            flexWrap: "wrap",
            fontSize: "1.2rem",
          }}
        >
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Krishi Agro</div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={{
                background: "white",
                color: "#28a745",
                padding: "5px 10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/Adminroot/Admin/${"english"}`)}
            >
              Home
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="main-layout">
          {/* Vertical Navbar */}
          <div className="vertical-navbar">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div style={{ fontSize: "1.2rem", marginBottom: "10px" }}>🛠️</div>
              
            </div>
            <div>
            
            </div>
          </div>

          {/* Complaint Section */}
          <div className="complaint-section">
            <h2>All Complaints (Admin View)</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {complaints.map((comp) => (
                <li
                  key={comp.id}
                  style={{
                    border: "1px solid #ccc",
                    marginBottom: "10px",
                    padding: "10px",
                    backgroundColor: isResolved(comp.status) ? "#d4edda" : "#f8d7da",
                    color: "#000",
                  }}
                >
                  <strong>Complaint #{comp.id}</strong>
                  <p>
                    <strong>User ID:</strong> {comp.userId}
                  </p>
                  <p>{comp.description}</p>
                  <p>Status: {isResolved(comp.status) ? "✅ Resolved" : "❌ Pending"}</p>
                  {!isResolved(comp.status) && (
                    <button
                      onClick={() => handleResolve(comp.id)}
                      style={{
                        marginTop: "5px",
                        backgroundColor: "#28a745",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Mark as Resolved
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminComplaints;
