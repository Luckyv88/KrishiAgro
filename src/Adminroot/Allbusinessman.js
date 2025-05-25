import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Backend/api";
import qs from "qs";

/* 🌐 Translations */
const translations = {
  hindi:   { title:"सभी व्यापारी", myProfile:"मेरा प्रोफाइल", search:"खोजें...", phone:"फ़ोन", email:"ई-मेल", state:"राज्य", city:"शहर", role:"भूमिका", goBack:"वापस जाएँ", none:"कोई व्यापारी नहीं मिला", loading:"व्यापारी लोड हो रहे हैं..." },
  english: { title:"All Businessmen", myProfile:"My Profile", search:"Search...", phone:"Phone", email:"Email", state:"State", city:"City", role:"Role", goBack:"Go Back", none:"No businessmen found.", loading:"Loading businessmen..." },
  punjabi: { title:"ਸਾਰੇ ਵਪਾਰੀ", myProfile:"ਮੇਰਾ ਪਰੋਫ਼ਾਈਲ", search:"ਖੋਜੋ...", phone:"ਫ਼ੋਨ", email:"ਈ-ਮੇਲ", state:"ਰਾਜ", city:"ਸ਼ਹਿਰ", role:"ਭੂਮਿਕਾ", goBack:"ਵਾਪਸ ਜਾਓ", none:"ਕੋਈ ਵਪਾਰੀ ਨਹੀਂ ਮਿਲਿਆ", loading:"ਵਪਾਰੀ ਲੋਡ ਹੋ ਰਹੇ ਹਨ..." },
  malayalam:{ title:"എല്ലാ വ്യാപാരികള്‍",myProfile:"എന്‍റെ പ്രൊഫൈല്‍", search:"തിരയുക...", phone:"ഫോണ്‍", email:"ഇ-മെയില്‍", state:"സംസ്ഥാനം", city:"നഗരം", role:"പങ്ക്", goBack:"തിരികെ പോകുക", none:"വ്യാപാരകര്‍ ലഭ്യമായില്ല", loading:"വ്യാപാരകര്‍ ലോഡ് ചെയ്യുന്നു..." },
  telugu:  { title:"అన్ని వ్యాపారులు", myProfile:"నా ప్రొఫైల్", search:"శోధించండి...", phone:"ఫోన్", email:"ఈ-మెయిల్", state:"రాష్ట్రం", city:"నగరం", role:"పాత్ర", goBack:"వెనక్కి వెళ్లండి", none:"వ్యాపారులు కనపడలేదు", loading:"వ్యాపారులను లోడ్ చేస్తోంది..." },
  marathi: { title:"सर्व व्यापारी", myProfile:"माझे प्रोफाइल", search:"शोधा...", phone:"फोन", email:"ई-मेल", state:"राज्य", city:"शहर", role:"भूमिका", goBack:"मागे जा", none:"व्यापारी आढळले नाहीत", loading:"व्यापारी लोड होत आहेत..." }
};

const Allbusinessman = () => {
  const { language } = useParams();
  const navigate     = useNavigate();
  const t            = translations[language] || translations.english;

  const userId = localStorage.getItem("userId");
  useEffect(() => { if (!userId) navigate("/login"); }, [userId, navigate]);

  const [biz,      setBiz]      = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");

  /* 🚀 fetch once */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/auth/by-role", {
          params: { role:"Businessman" },
          paramsSerializer: p => qs.stringify(p)
        });

        let raw   = res.data;
        const end = raw.lastIndexOf("]}") + 2;
        const parsed = JSON.parse(raw.slice(0, end));
        const list   = Array.isArray(parsed.users) ? parsed.users : [];

        setBiz(list);
      } catch (err) {
        console.error("Fetch businessmen:", err);
        setError("Failed to load businessmen.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* shared styles */
  const navBtn     = { background:"none", border:"none", color:"white", fontSize:"0.8rem", cursor:"pointer" };
  const summaryBox = { display:"flex", alignItems:"center", gap:"10px", padding:"10px 15px", background:"rgba(255,255,255,0.1)", borderRadius:"6px", cursor:"pointer", fontWeight:"bold" };
  const detailsBox = { width:"100%", background:"rgba(255,255,255,0.05)", borderRadius:"6px", overflow:"hidden", boxShadow:"0 0 6px rgba(0,0,0,0.4)", marginBottom:"12px" };

  /* RESPONSIVE STYLES */
  const containerStyle = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif",
    backgroundImage: "url('/home1.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundBlendMode: "darken",
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "white",
  };

  const horizontalNavbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#28a745",
    padding: "10px 20px",
    flexWrap: "wrap",
  };

  const horizontalNavbarTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
  };

  const horizontalNavbarCenterStyle = {
    fontSize: "1.2rem",
    flex: "1 1 auto",
    textAlign: "center",
    minWidth: 150,
  };

  const goBackBtnStyle = {
    ...navBtn,
    fontSize: "1rem",
    flexShrink: 0,
  };

  const mainContentWrapper = {
    display: "flex",
    height: "calc(100vh - 50px)",
    flexDirection: "row",
  };

  const verticalNavbarStyle = {
    width: 120,
    background: "#333",
    padding: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
  };

  const middleContentStyle = {
    flex: 1,
    overflowY: "auto",
    padding: 20,
  };

  /* Media queries inside component using window width */
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive adjustments
  if (windowWidth <= 600) {
    // Phones: vertical navbar becomes horizontal bottom nav, input full width, stacked layout
    mainContentWrapper.flexDirection = "column";
    verticalNavbarStyle.width = "100%";
    verticalNavbarStyle.flexDirection = "row";
    verticalNavbarStyle.justifyContent = "space-around";
    verticalNavbarStyle.padding = "10px 0";
    middleContentStyle.padding = 10;
  } else if (windowWidth <= 900) {
    // Tablets: slightly smaller nav widths and font sizes
    verticalNavbarStyle.width = 100;
    horizontalNavbarTitleStyle.fontSize = "1.3rem";
    horizontalNavbarCenterStyle.fontSize = "1rem";
  }

  return (
    <div style={containerStyle}>
      {/* Horizontal Navbar */}
      <div style={horizontalNavbarStyle}>
        <div style={horizontalNavbarTitleStyle}>Krishi Agro</div>
        <div style={horizontalNavbarCenterStyle}>{t.title}</div>
        <button style={goBackBtnStyle} onClick={() => navigate(`/Adminroot/Admin/${language}`)}>{t.goBack}</button>
      </div>

      <div style={mainContentWrapper}>
        {/* Vertical Navbar */}
        <div style={verticalNavbarStyle}>
          <div style={{ fontSize: "1.2rem", marginBottom: windowWidth <= 600 ? 0 : "10px" }}>👤</div>
          <button style={navBtn} onClick={() => navigate(`/businessman/profile/${language}`)}>{t.myProfile}</button>
        </div>

        {/* Middle Content */}
        <div style={middleContentStyle}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.search}
            style={{
              width: windowWidth <= 600 ? "100%" : 200,
              padding: 6,
              borderRadius: 4,
              border: "1px solid #ccc",
              marginBottom: 15,
              fontSize: "1rem",
              boxSizing: "border-box",
            }}
          />
          {loading && <div>{t.loading}</div>}
          {error && <div style={{ color: "red" }}>{error}</div>}
          {!loading && biz.length === 0 && <div>{t.none}</div>}

          {/* Businessman list */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {biz
              .filter(b => b.name?.toLowerCase().includes(search.toLowerCase()))
              .map(b => (
                <div key={b.id} style={detailsBox}>
                  <div style={summaryBox}>
                    <span>{b.name}</span>
                  </div>
                  <div style={{ padding: "10px 20px" }}>
                    <p><b>{t.email}:</b> {b.email || "—"}</p>
                    <p><b>{t.phone}:</b> {b.phoneNumber || "—"}</p>
                    <p><b>{t.state}:</b> {b.state || "—"}</p>
                    <p><b>{t.city}:</b>  {b.city || "—"}</p>
                    <p><b>{t.role}:</b>  {b.role}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allbusinessman;
