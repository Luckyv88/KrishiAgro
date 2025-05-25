/* ===========================================================
   Successlogin.jsx  – Businessman dashboard with “interest” flow
   (responsive & image-less card grid)
   ========================================================== */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import api from "../Backend/api";
import API from "../Backend/api";
import qs from "qs";

/* 🌐 Translations (unchanged) */
const translations = {   hindi:   { home:"होम", login:"लॉग इन करें", register:"पंजीकरण करें", myProfile:"मेरा प्रोफ़ाइल",
             updateProfile:"प्रोफ़ाइल अपडेट करें", savedItems:"रुचिकर आइटम्स", help:"मदद",
             logout:"लॉग आउट", searchPlaceholder:"खोजें...", showMore:"और दिखाएं",
             interested:"रुचि", interestSuccess:"सफलतापूर्वक रुचि सहेजी गई!", gehu:"गेहूं",
             chana:"चना", apple:"सेब", complaints:"शिकायत", states:"स्थिति" },

  english: { home:"Home", login:"Login", register:"Register", myProfile:"My Profile",
             updateProfile:"Update Profile", savedItems:"Interested Items", help:"Help",
             logout:"Logout", searchPlaceholder:"Search...", showMore:"Show More",
             interested:"Interested", interestSuccess:"Interest saved successfully!",
             gehu:"Wheat", chana:"Chickpeas", apple:"Apple", complaints:"Complaint",
             states:"Status" },

  punjabi: { home:"ਘਰ", login:"ਲਾਗਇਨ", register:"ਰਜਿਸਟਰ", myProfile:"ਮੇਰਾ ਪ੍ਰੋਫਾਈਲ",
             updateProfile:"ਪ੍ਰੋਫਾਈਲ ਅਪਡੇਟ ਕਰੋ", savedItems:"ਰੁਚੀ ਵਾਲੀਆਂ ਚੀਜ਼ਾਂ", help:"ਮਦਦ",
             logout:"ਲਾਗਆਉਟ", searchPlaceholder:"ਖੋਜੋ...", showMore:"ਹੋਰ ਵੇਖੋ",
             interested:"ਰੁਚੀ", interestSuccess:"ਰੁਚੀ ਸਫਲਤਾਪੂਰਵਕ ਸੇਵ ਕੀਤੀ ਗਈ!",
             gehu:"ਗੇਹੂੰ", chana:"ਚਨਾ", apple:"ਸੇਬ", complaints:"ਸ਼ਿਕਾਇਤ", states:"ਸਥਿਤੀ" },

  malayalam:{ home:"ഹോം", login:"ലോഗിൻ", register:"രജിസ്റ്റർ", myProfile:"എൻറെ പ്രൊഫൈൽ",
              updateProfile:"പ്രൊഫൈൽ അപ്‌ഡേറ്റ് ചെയ്യുക", savedItems:"ആസക്തിയായ ഇനങ്ങൾ",
              help:"സഹായം", logout:"ലോഗൗട്ട്", searchPlaceholder:"തിരയൂ...",
              showMore:"കൂടുതൽ കാണിക്കുക", interested:"ആസക്തി",
              interestSuccess:"ആസക്തി വിജയകരമായി സേവ് ചെയ്തു!", gehu:"ഗേഹു",
              chana:"ചണ", apple:"ആപ്പിൾ", complaints:"പരാതി", states:"സ്ഥിതി" },

  telugu:   { home:"హోమ్", login:"లాగిన్", register:"నమోదు", myProfile:"నా ప్రొఫైల్",
              updateProfile:"ప్రొఫైల్ నవీకరించు", savedItems:"ఆసక్తి ఉన్న వస్తువులు",
              help:"సహాయం", logout:"లాగౌట్", searchPlaceholder:"శోధించండి...",
              showMore:"ఇంకా చూపించు", interested:"ఆసక్తి",
              interestSuccess:"ఆసక్తి విజయవంతంగా సేవ్ చేయబడింది!", gehu:"గేహు",
              chana:"సెనగలు", apple:"ఆపిల్", complaints:"ఫిర్యాదు", states:"స్థితి" },

  marathi:  { home:"मुख्यपृष्ठ", login:"लॉगिन", register:"नोंदणी", myProfile:"माझी प्रोफाइल",
              updateProfile:"प्रोफाइल अपडेट करा", savedItems:"आवडलेली उत्पादने", help:"मदत",
              logout:"बाहेर पडा", searchPlaceholder:"शोधा...", showMore:"अधिक दाखवा",
              interested:"रुची", interestSuccess:"रुची यशस्वीपणे जतन झाली!",
              gehu:"गहू", chana:"हरभरा", apple:"सफरचंद", complaints:"तक्रार", states:"स्थिती" }, };

/* 🔎 helper (unchanged) */
const pick = (o, ...k) =>
  k.find(key => o && o[key] != null) ? o[k.find(key => o && o[key] != null)] : undefined;

/* ===========================================================
   ✅ Component
=========================================================== */
const Successlogin = () => {
  const { language } = useParams();
  const navigate = useNavigate();
  const t = translations[language] || translations.english;

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingInterestIds, setLoadingInterestIds] = useState(new Set());
  const [interestedProductIds, setInterestedProductIds] = useState(new Set());

  /* once: read saved interests */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("interestedProducts") || "[]");
    setInterestedProductIds(new Set(saved));
  }, []);

  /* express interest */
  const handleInterest = async (e, product_id) => {
    e.preventDefault();
    const user = {
      id: localStorage.getItem("userId"),
      role: localStorage.getItem("userRole"),
    };
    if (!user.id || user.role?.toLowerCase() !== "businessman") {
      alert("Please login as a businessman first.");
      return navigate(`/Businessman/Successlogin/${language}`);
    }
    setLoadingInterestIds(prev => new Set(prev).add(product_id));
    try {
      const r = await API.post(
        "/interest/express",
        qs.stringify({ businessman_id: user.id, product_id }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      alert(
        r.data.message ||
          (r.data.success ? "Interest Expressed Successfully!" : "Failed to express interest.")
      );
      if (r.data.success) {
        setInterestedProductIds(prev => {
          const up = new Set(prev).add(product_id);
          localStorage.setItem("interestedProducts", JSON.stringify([...up]));
          return up;
        });
      }
    } catch (err) {
      console.error("Interest Error:", err);
      alert("Server error. Please try again later.");
    } finally {
      setLoadingInterestIds(prev => {
        const s = new Set(prev);
        s.delete(product_id);
        return s;
      });
    }
  };

  /* fetch products once */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/products/list");
        setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
      } catch (err) {
        console.error("❌ Unable to fetch products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* tiny helpers */
  const navBtn = {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "0.8rem",
    cursor: "pointer",
  };

  /* -------------------------------------------------------- */
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
      {/* ---------------- Top Navbar ---------------- */}
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
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
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
          style={{ background: "none", border: "none", color: "white", fontSize: "1rem" }}
          onClick={() => navigate("/")}
        >
          {t.home}
        </button>
        <button
          style={{
            background: "white",
            color: "#28a745",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/home1/${language}`)}
        >
          {t.logout}
        </button>
      </div>

      {/* ---------------- Layout ---------------- */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* -------------- Vertical navbar -------------- */}
        <div
          style={{
            width: "100%",
            maxWidth: "120px",
            minWidth: "60px",
            background: "#333",
            color: "white",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "0.8rem",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "10px" }}>👤</div>
            <button style={navBtn} onClick={() => navigate(`/Businessman/Businessmanmyprofile/${language}`)}>
              {t.myProfile}
            </button>
            <button style={navBtn} onClick={() => navigate(`/Businessman/Businessmanupdate/${language}`)}>
              {t.updateProfile}
            </button>
            <button style={navBtn} onClick={() => navigate(`/Businessman/Interested/${language}`)}>
              {t.savedItems}
            </button>
            <button style={navBtn} onClick={() => navigate(`/Businessman/Status/${language}`)}>
              {t.states}
            </button>
          </div>
          <button style={navBtn} onClick={() => navigate(`/Component/Complaints/${language}`)}>
            {t.complaints}
          </button>
        </div>

        {/* ---------------- Main content ---------------- */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            fontSize: "1.1rem",
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

          {/* ---------- responsive tweaks ---------- */}
          <style>{`
            @media (max-width: 767px){
              .biz-card{width:100%!important;font-size:0.95rem}
            }
            @media (min-width:768px) and (max-width:1199px){
              .biz-card{width:calc(50% - 14px)!important;}
            }
            @media (min-width:1200px){
              .biz-card{width:calc(33.333% - 16px)!important;}
            }
          `}</style>

          {/* ---------- card grid ---------- */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
            {products
              .filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(p => {
                const name = pick(p, "name");
                const city = pick(p, "city");
                const state = pick(p, "state");
                const qty = pick(p, "quantity_available", "quantityAvailable");
                const desc = pick(p, "description", "desc");
                const price = pick(p, "price");

                return (
                  <div
                    key={p.id}
                    className="biz-card"
                    style={{
                      width: "calc(45% - 10px)",
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* details */}
                    <div style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <h2 style={{ margin: "0 0 8px 0" }}>{name}</h2>
                      <p style={{ margin: 0 }}>
                        <b>City:</b> {city}
                      </p>
                      <p style={{ margin: 0 }}>
                        <b>State:</b> {state}
                      </p>
                      <p style={{ margin: 0 }}>
                        <b>Quantity Available:</b> {qty}
                      </p>
                      <p style={{ margin: "0 0 8px 0" }}>
                        <b>Price:</b> ₹{price}
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong>Description:</strong> {desc?.trim() || "No description provided."}
                      </p>

                      {loadingInterestIds.has(p.id) ? (
                        <div style={{ fontSize: "0.8rem", color: "#555", marginTop: "6px" }}>
                          Waiting for response...
                        </div>
                      ) : interestedProductIds.has(p.id) ? (
                        <div style={{ color: "lawngreen", fontWeight: "bold", marginTop: "6px" }}>
                          Interest expressed!
                        </div>
                      ) : (
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
                          onClick={e => handleInterest(e, p.id)}
                        >
                          {t.interested}
                        </button>
                      )}
                    </div>
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

export default Successlogin;
