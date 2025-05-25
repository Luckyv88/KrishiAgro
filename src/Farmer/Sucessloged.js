/**
 * Successloged.js
 * ------------------------------------------------------------
 * Displays the farmer dashboard with navbars unchanged, shows
 * products in a 30 % / 70 % card (image / data) and supports
 * qs-encoded API calls for listing and deleting products.
 * ------------------------------------------------------------
 * ‣ Do **NOT** rename this file or paths.
 * ‣ Navbars, styles, fonts, and layout are IDENTICAL to your
 *   existing structure; only safe fallbacks were added so
 *   runtime errors never occur.
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import API from "../Backend/api";
import qs from "qs";

/* ─────── translations (unchanged content) ─────── */
const translations = {
  hindi: {
    home: "होम",
    login: "लॉग इन करें",
    register: "पंजीकरण करें",
    myProfile: "मेरा प्रोफ़ाइल",
    updateProfile: "प्रोफ़ाइल अपडेट करें",
     viewProduct: "उत्पाद देखें",
    help: "मदद",
    logout: "लॉग आउट",
    delete:"हटाएं",
    searchPlaceholder: "खोजें...",
    showMore: "और दिखाएं",
    gehu: "गेहूं",
    productUpdate:"उत्पाद अपडेट करें",
    chana: "चना",
    apple: "सेब",
    addProduct: "उत्पाद जोड़ें",
    
    request:"	अनुरोध"
  },
  english: {
    home: "Home",
    login: "Login",
    register: "Register",
    myProfile: "My Profile",
    updateProfile: "Update Profile",
  viewProduct: "View Product",
    help: "Help",
    delete:"Delete",
    logout: "Logout",
    searchPlaceholder: "Search...",
    showMore: "Show More",
    gehu: "Wheat",
    productUpdate:"Update Product",
    chana: "Chickpeas",
        complaints: "Complaint",
    apple: "Apple",
    addProduct: "Add Product",
    request:"	Request"
  },
  punjabi: {
    home: "ਘਰ",
    login: "ਲਾਗਇਨ",
    register: "ਰਜਿਸਟਰ",
    myProfile: "ਮੇਰਾ ਪ੍ਰੋਫਾਈਲ",
    updateProfile: "ਪ੍ਰੋਫਾਈਲ ਅਪਡੇਟ ਕਰੋ",
     viewProduct: "ਉਤਪਾਦ ਵੇਖੋ",
    help: "ਮਦਦ",
     delete:"ਹਟਾਓ",
    logout: "ਲਾਗਆਉਟ",
    searchPlaceholder: "ਖੋਜੋ...",
    showMore: "ਹੋਰ ਵੇਖੋ",
    gehu: "ਗੇਹੂੰ",
    productUpdate:"	ਉਤਪਾਦ ਅੱਪਡੇਟ ਕਰੋ",
    chana: "ਚਨਾ",
    delete:"നീക്കം ചെയ്യുക",
    apple: "ਸੇਬ",
    addProduct: "ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ",
    request:"ਬੇਨਤੀ",
      complaints: "ਸ਼ਿਕਾਇਤ",
  },
  malayalam: {
    home: "ഹോം",
    login: "ലോഗിൻ",
    register: "രജിസ്റ്റർ",
    myProfile: "എൻറെ പ്രൊഫൈൽ",
    updateProfile: "പ്രൊഫൈൽ അപ്‌ഡേറ്റ് ചെയ്യുക",
    viewProduct: "ഉൽപ്പന്നം കാണുക",
    help: "സഹായം",
    logout: "ലോഗൗട്ട്",
    delete:"നീക്കം ചെയ്യുക", 
    searchPlaceholder: "തിരയൂ...",
    showMore: "കൂടുതൽ കാണിക്കുക",
    gehu: "ഗേഹു",
    productUpdate:"	ഉൽപ്പന്നം അപ്ഡേറ്റ് ചെയ്യുക",
    chana: "ചണ",
    apple: "ആപ്പിൾ",
    addProduct: "ഉൽപ്പന്നം ചേർക്കുക",
    request:"	അഭ്യർത്ഥന",
     complaints: "പരാതി",
  },
  telugu: {
    home: "హోమ్",
    login: "లాగిన్",
    register: "నమోదు",
    myProfile: "నా ప్రొఫైల్",
    updateProfile: "ప్రొఫైల్ నవీకరించు",
     viewProduct: "ఉత్పత్తి చూడండి",
    help: "సహాయం",
    delete:"తొలగించు",
    logout: "లాగౌట్",
    searchPlaceholder: "శోధించండి...",
    showMore: "ఇంకా చూపించు",
    gehu: "గేహు",
    productUpdate:"	ఉత్పత్తిని నవీకరించండి",
    chana: "సెనగలు",
    apple: "ఆపిల్",
    addProduct: "ఉత్పత్తి జోడించండి",
    request:"	అభ్యర్థన",
      complaints: "ఫిర్యాదు",
  },
  marathi: {
    home: "मुख्यपृष्ठ",
    login: "लॉगिन",
    register: "नोंदणी",
    myProfile: "माझी प्रोफाइल",
     delete:"हटवा",
    updateProfile: "प्रोफाइल अपडेट करा",
    viewProduct: "उत्पादने पहा",
    help: "मदत",
    logout: "बाहेर पडा",
    searchPlaceholder: "शोधा...",
    showMore: "अधिक दाखवा",
    gehu: "गहू",
    productUpdate:"	उत्पादन अपडेट करा",
    chana: "हरभरा",
    apple: "सफरचंद",
    addProduct: "उत्पादन जोडा",
    request:"	विनंती",
    complaints: "तक्रार",
  },
};

/* ─────────── component ─────────── */
const Successloged = () => {
  /* language safe-fallback */
  const { language } = useParams();
  const langKey = language && translations[language] ? language : "english";
  const t = translations[langKey];

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  const farmerId = localStorage.getItem("userId");

  /* fetch products with qs-encoded POST */
 useEffect(() => {
  const fetchProducts = async () => {
    if (!farmerId) return;
    try {
      const body = qs.stringify({ farmerId });  // <-- changed key here
      const res = await API.post(
        "/products/list",
        body,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      const list = Array.isArray(res.data) ? res.data : res.data.products;
      setProducts(list || []);
    } catch (err) {
      console.error("❌ Unable to fetch products:", err);
    }
  };
  fetchProducts();
}, [farmerId]);


  /* delete product (qs-encoded) */
  const handleDelete = async (productId) => {
    try {
      const encoded = qs.stringify({ product_id: productId });
      await API.post(
        "/products/delete",
        encoded,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  /* unchanged button style */
  const buttonStyle = {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "0.8rem",
    cursor: "pointer",
  };

  /* filter for search box */
  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "white",
      }}
    >
      {/* Horizontal Navbar (unchanged) */}
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
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t.searchPlaceholder || "Search..."} 
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
          style={{ background: "none", border: "none", color: "white", fontSize: "1rem", cursor: "pointer" }}
          onClick={() => navigate(`/`)}
        >
          {t.home}
        </button>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            style={{ background: "white", color: "#28a745", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
            onClick={() => navigate(`/home1/${langKey}`)}
          >
            {t.logout}
          </button>
        </div>
      </div>

      {/* Main Layout (unchanged) */}
      <div style={{ display: "flex", flex: 1, flexDirection: "row", overflow: "hidden" }}>
        {/* Vertical Navbar (unchanged) */}
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "10px" }}>👤</div>
            <button style={buttonStyle} onClick={() => navigate(`/Farmer/Farmermyprofile/${langKey}`)}>{t.myProfile}</button>
            <button style={buttonStyle} onClick={() => navigate(`/Farmer/FarmerUpdateMyprofile/${langKey}`)}>{t.updateProfile}</button>
            <button style={buttonStyle} onClick={() => navigate(`/Farmer/Addproduct/${langKey}`)}>{t.addProduct}</button>
             <button style={buttonStyle} onClick={() => navigate(`/Farmer/Viewproduct/${langKey}`)}>{t.  viewProduct}</button>
             <button style={buttonStyle} onClick={() => navigate(`/Farmer/Update/${langKey}`)}>{t.productUpdate}</button>
             <button style={buttonStyle} onClick={() => navigate(`/Farmer/Delete/${langKey}`)}>{t.delete}</button>
             
              <button style={buttonStyle} onClick={() => navigate(`/Farmer/Interestfarmer/${langKey}`)}>{t.request}</button>

            
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <button style={buttonStyle} onClick={() => navigate(`/Component/Complaints/${langKey}`)}>{t.complaints}</button>
          </div>
        </div>

        {/* Center area with product cards */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.2rem",
            color: "white",
          }}
        >
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            {filtered.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "white",
                  color: "black",
                  borderRadius: "10px",
                  width: "90%",
                  maxWidth: "600px",
                  display: "flex",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                {/* 30 % picture */}
                <img
                  src={p.image_url || "default.png"}
                  alt={p.name}
                  style={{ width: "30%", objectFit: "cover", borderRadius: "10px 0 0 10px" }}
                />

                {/* 70 % data */}
                <div style={{ padding: "10px", flex: "1 1 70%", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{p.name}</div>

                  {/* scrollable description only */}
                  <div style={{ maxHeight: "100px", overflowY: "auto", whiteSpace: "pre-wrap" }}>
                    {p.description}
                  </div>

                  <span>{p.city}, {p.state}</span>
                  <span>Quantity: {p.quantity_available}</span>
                  <span>Price: ₹{p.price}</span>

                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{
                      background: "#dc3545",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      border: "none",
                      cursor: "pointer",
                      marginTop: "auto",
                      alignSelf: "flex-start",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* keep nested routes alive */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Successloged;
