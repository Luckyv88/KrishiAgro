import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../Backend/api";
import qs from "qs";

const translations = {
  hindi:   { title:"एडमिन डैशबोर्ड", home:"होम", allUsers:"सभी उपयोगकर्ता", allComplaints:"सभी शिकायतें", logout:"लॉग आउट" },
  english: { title:"Admin Dashboard", home:"Home", allUsers:"All Users", allComplaints:"All Complaints", logout:"Logout" },
  punjabi: { title:"ਐਡਮਿਨ ਡੈਸ਼ਬੋਰਡ", home:"ਹੁਮ", allUsers:"ਸਾਰੇ ਯੂਜ਼ਰ", allComplaints:"ਸਾਰੀਆਂ ਸ਼ਿਕਾਇਤਾਂ", logout:"ਲੌਗ ਆਉਟ" },
  malayalam:{ title:"അഡ്മിൻ ഡാഷ്ബോർഡ്", home:"ഹോം", allUsers:"എല്ലാ ഉപയോക്താക്കൾ", allComplaints:"എല്ലാ പരാതികളും", logout:"ലോഗ്ഔട്ട്" },
  telugu:  { title:"అడ్మిన్ డాష్‌బోర్డ్", home:"హోమ్", allUsers:"అన్ని వినియోగదారులు", allComplaints:"అన్ని ఫిర్యాదులు", logout:"లాగ్ అవుట్" },
  marathi: { title:"अ‍ॅडमिन डॅशबोर्ड", home:"मुख्यपृष्ठ", allUsers:"सर्व वापरकर्ते", allComplaints:"सर्व तक्रारी", logout:"लॉग आउट" },
};

const Admin = () => {
  const { language = "english" } = useParams();
  const navigate = useNavigate();
  const t = translations[language] || translations.english;
  const userId = localStorage.getItem("userId");

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (!userId) {
      alert("Please log in first.");
      navigate(`/login/${language}`);
    }
  }, [userId, language, navigate]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buttonStyle = {
    background: "none",
    border: "none",
    color: "white",
    fontSize: windowWidth <= 480 ? "0.7rem" : "0.8rem",
    cursor: "pointer",
    padding: windowWidth <= 480 ? "6px" : "unset",
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate(`/login/${language}`);
  };

  // Responsive container styles
  const containerStyle = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif",
    backgroundImage:`url(${process.env.PUBLIC_URL}/home1.jpg)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundBlendMode: "darken",
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "white",
  };

  const horizontalNavStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#28a745",
    padding: windowWidth <= 480 ? "8px 10px" : "10px 20px",
    color: "white",
    fontSize: windowWidth <= 480 ? "0.9rem" : "1rem",
  };

  // Main layout flex direction changes to column on small devices
  const mainLayoutStyle = {
    display: "flex",
    height: `calc(100vh - ${windowWidth <= 480 ? 40 : 50}px)`,
    flexDirection: windowWidth <= 768 ? "column" : "row",
  };

  // Vertical navbar style changes width and alignment on small devices
  const verticalNavStyle = {
    width: windowWidth <= 768 ? "100%" : "120px",
    background: "#333",
    color: "white",
    padding: "10px",
    display: "flex",
    flexDirection: windowWidth <= 768 ? "row" : "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: windowWidth <= 768 ? "10px" : "0",
  };

  const verticalNavButtonsContainer = {
    display: "flex",
    flexDirection: windowWidth <= 768 ? "row" : "column",
    alignItems: "center",
    gap: windowWidth <= 768 ? "10px" : "10px",
  };

  // Middle content styles adjust padding and height on small devices
  const middleContentStyle = {
    flex: 1,
    padding: windowWidth <= 480 ? "10px" : "20px",
     backgroundImage:`url(${process.env.PUBLIC_URL}/home1.jpg)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundBlendMode: "darken",
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: windowWidth <= 480 ? "1.2rem" : "1.5rem",
    height: windowWidth <= 768 ? "auto" : "calc(100vh - 50px)",
  };

  return (
    <div style={containerStyle}>
      {/* Horizontal Navbar */}
      <div style={horizontalNavStyle}>
        <div style={{ fontSize: windowWidth <= 480 ? "1.2rem" : "1.5rem", fontWeight: "bold" }}>
          Krishi Agro
        </div>
        <div style={{ fontSize: windowWidth <= 480 ? "1rem" : "1.2rem" }}>{t.title}</div>
        <button style={{ background: "none", border: "none", color: "white", fontSize: windowWidth <= 480 ? "0.9rem" : "1rem", cursor: "pointer" }} onClick={() => navigate(-1)}>
          {t.home}
        </button>
      </div>

      {/* Main Layout */}
      <div style={mainLayoutStyle}>
        {/* Vertical Navbar */}
        <div style={verticalNavStyle}>
          <div style={verticalNavButtonsContainer}>
            <div style={{ fontSize: windowWidth <= 480 ? "1rem" : "1.2rem", marginBottom: windowWidth <= 768 ? "0" : "10px" }}>👨‍💼</div>

            <button style={buttonStyle} onClick={() => navigate(`/Adminroot/Allfarmer/${language}`)}>
              All Farmer
            </button>
            <button style={buttonStyle} onClick={() => navigate(`/Adminroot/Allbusinessman/${language}`)}>
              All Businessman
            </button>
            <button style={buttonStyle} onClick={() => navigate(`/Adminroot/AdminComplaints/${language}`)}>
              All Complaints
            </button>
          </div>

          <button style={buttonStyle} onClick={handleLogout}>
            {t.logout}
          </button>
        </div>

        {/* Middle Content */}
        <div style={middleContentStyle}>
          <p>Welcome to Admin Dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
