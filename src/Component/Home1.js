import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import qs from "qs";
import api from "../Backend/api";

/* -----------------------------------------------------------
   🔄  Home1 Component
   Tolerant to both snake_case and camelCase keys
-------------------------------------------------------------*/

const translations = {
  hindi: {
    home: "होम",
    login: "लॉग इन करें",
    register: "पंजीकरण करें",
    myProfile: "मेरा प्रोफ़ाइल",
    updateProfile: "प्रोफ़ाइल अपडेट करें",
    help: "मदद",
    searchPlaceholder: "खोजें...",
    showMore: "और दिखाएं",
    interested: "रुचि",
    gehu: "गेहूं",
    chana: "चना",
    apple: "सेब",
  },
  english: {
    home: "Home",
    login: "Login",
    register: "Register",
    myProfile: "My Profile",
    updateProfile: "Update Profile",
    help: "Help",
    searchPlaceholder: "Search...",
    showMore: "Show More",
    interested: "Interested",
    gehu: "Wheat",
    chana: "Chickpeas",
    apple: "Apple",
  },
};

const pick = (obj, ...keys) => {
  for (const k of keys)
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  return undefined;
};

const Home1 = () => {
  const { language } = useParams();
  const navigate = useNavigate();
  const t = translations[language] || translations.english;

  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleProfileClick = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.role) return navigate(`/Businessman/Notloge/${language}`);

      const roleData = qs.stringify({ role: user.role });
      const resp = await api.post("/user/role-check", roleData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (resp.data.success) {
        return user.role === "farmer"
          ? navigate(`/Farmer/FarmerMyprofile`)
          : navigate(`/Businessman/BusinessmsnMyprofile`);
      }
      alert("Role check failed. Please try again later.");
    } catch (err) {
      console.error("Profile Click Error:", err);
      alert("Failed to navigate to profile.");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/products/list");
        const data = Array.isArray(res.data) ? res.data : res.data.products || [];
        setProducts(data);
      } catch (err) {
        console.error("❌ Unable to fetch products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const navBtn = {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "0.8rem",
    cursor: "pointer",
  };

  return (
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
        backgroundColor: "rgba(0,0,0,0.6)",
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

        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={t.searchPlaceholder}
          style={{
            width: "150px",
            padding: "3px",
            borderRadius: "3px",
            border: "1px solid #ccc",
            marginRight: "20px",
            fontSize: "1rem",
          }}
        />

        <button
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "1rem",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/`)}
        >
          {t.home}
        </button>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            style={{
              background: "white",
              color: "#28a745",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/login/${language}`)}
          >
            {t.login}
          </button>
          <button
            style={{
              background: "white",
              color: "#28a745",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/register/${language}`)}
          >
            {t.register}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Vertical Navbar */}
        <div
          style={{
            width: "100%",
            maxWidth: "120px",
            background: "#333",
            color: "white",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "0.8rem",
            minWidth: "60px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div style={{ fontSize: "1.2rem", marginBottom: "10px" }}>👤</div>
            <button style={navBtn} onClick={handleProfileClick}>
              {t.myProfile}
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button style={navBtn}>{t.help}</button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            fontSize: "1.1rem",
            color: "white",
            backgroundImage: "url('/home1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "darken",
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          {loading && <div>Loading products...</div>}
          {error && <div style={{ color: "red" }}>{error}</div>}
          {!loading && products.length === 0 && <div>No products found.</div>}

          {/* Product Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {products.map((p) => {
              const name = pick(p, "name");
              const city = pick(p, "city");
              const state = pick(p, "state");
              const qty = pick(p, "quantity_available", "quantityAvailable");
              const description = pick(p, "description", "desc");
              const price = pick(p, "price");

              return (
                <div
                  key={p.id}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                    display: "flex",
                    flexDirection: "column",
                    padding: "15px",
                  }}
                >
                  <h2 style={{ margin: "0 0 8px 0" }}>{name}</h2>
                  <p style={{ margin: "0 0 4px 0" }}>
                    <b>City:</b> {city}
                  </p>
                  <p style={{ margin: "0 0 4px 0" }}>
                    <b>State:</b> {state}
                  </p>
                  <p style={{ margin: "0 0 4px 0" }}>
                    <b>Quantity Available:</b> {qty}
                  </p>
                  <p style={{ margin: "0 0 8px 0" }}>
                    <b>Price:</b> ₹{price}
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>Description:</strong>{" "}
                    {description?.trim() ? description : "No description provided."}
                  </p>

                  {/* 🔹 Interested button */}
                  <button
                    style={{
                      marginTop: "12px",
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                    onClick={() => navigate(`/Businessman/Notloge/${language}`)}
                  >
                    {t.interested}
                  </button>
                </div>
              );
            })}
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home1;
