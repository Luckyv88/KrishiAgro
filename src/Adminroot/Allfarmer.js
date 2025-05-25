import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Backend/api";
import qs from "qs";

/* 🌐 Translations */
const translations = {
  hindi:   { title:"सभी किसान",   myProfile:"मेरा प्रोफाइल",  search:"खोजें...", phone:"फ़ोन", email:"ई-मेल", state:"राज्य", city:"शहर", role:"भूमिका", goBack:"वापस जाएँ", none:"कोई किसान नहीं मिला", loading:"किसान लोड हो रहे हैं..." },
  english: { title:"All Farmers", myProfile:"My Profile",     search:"Search...", phone:"Phone", email:"Email", state:"State", city:"City", role:"Role", goBack:"Go Back", none:"No farmers found.", loading:"Loading farmers..." },
  punjabi: { title:"ਸਾਰੇ ਕਿਸਾਨ",  myProfile:"ਮੇਰਾ ਪਰੋਫ਼ਾਈਲ", search:"ਖੋਜੋ...",  phone:"ਫ਼ੋਨ", email:"ਈ-ਮੇਲ", state:"ਰਾਜ", city:"ਸ਼ਹਿਰ", role:"ਭੂਮਿਕਾ", goBack:"ਵਾਪਸ ਜਾਓ", none:"ਕੋਈ ਕਿਸਾਨ ਨਹੀਂ ਮਿਲਿਆ", loading:"ਕਿਸਾਨ ਲੋਡ ਹੋ ਰਹੇ ਹਨ..." },
  malayalam:{ title:"എല്ലാ കര്‍ഷകര്‍",myProfile:"എന്‍റെ പ്രൊഫൈല്‍",search:"തിരയുക...",phone:"ഫോണ്‍",email:"ഇ-മെയില്‍",state:"സംസ്ഥാനം",city:"നഗരം",role:"പങ്ക്",goBack:"തിരികെ പോകുക",none:"കാര്‍ഷകര്‍ ലഭ്യമായില്ല",loading:"കാര്‍ഷകര്‍ ലോഡ് ചെയ്യുന്നു..." },
  telugu:  { title:"అన్ని రైతులు", myProfile:"నా ప్రొఫైల్",  search:"శోధించండి...",phone:"ఫోన్",email:"ఈ-మెయిల్",state:"రాష్ట్రం",city:"నగరం",role:"పాత్ర",goBack:"వెనక్కి వెళ్లండి",none:"రైతులు కనపడలేదు",loading:"రైతులను లోడ్ చేస్తోంది..." },
  marathi: { title:"सर्व शेतकरी", myProfile:"माझे प्रोफाइल",search:"शोधा...",phone:"फोन",email:"ई-मेल",state:"राज्य",city:"शहर",role:"भूमिका",goBack:"मागे जा",none:"शेतकरी आढळले नाहीत",loading:"शेतकरी लोड होत आहेत..." }
};

const Allfarmer = () => {
  const { language } = useParams();
  const navigate     = useNavigate();
  const t            = translations[language] || translations.english;

  const userId = localStorage.getItem("userId");
  useEffect(() => { if (!userId) navigate("/login"); }, [userId, navigate]);

  const [farmers, setFarmers]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState("");
  const [search,  setSearch]    = useState("");

  /* 🚀 fetch once */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/auth/by-role", {
          params: { role:"Farmer" },
          paramsSerializer: p => qs.stringify(p)
        });

        let raw  = res.data;
        const end = raw.lastIndexOf("]}") + 2;
        const parsed = JSON.parse(raw.slice(0, end));
        const list   = Array.isArray(parsed.users) ? parsed.users : [];

        setFarmers(list);
      } catch (err) {
        console.error("Fetch farmers:", err);
        setError("Failed to load farmers.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* shared styles */
  const navBtn     = { background:"none", border:"none", color:"white", fontSize:"0.8rem", cursor:"pointer" };
  const summaryBox = { display:"flex", alignItems:"center", gap:"10px", padding:"10px 15px", background:"rgba(255,255,255,0.1)", borderRadius:"6px", cursor:"pointer", fontWeight:"bold" };
  const detailsBox = { width:"100%", background:"rgba(255,255,255,0.05)", borderRadius:"6px", overflow:"hidden", boxShadow:"0 0 6px rgba(0,0,0,0.4)", marginBottom:"12px" };

  return (
    <>
      <style>{`
        /* Responsive tweaks */
        @media (max-width: 1024px) {
          /* Tablet and below: stack vertical navbar horizontally above middle content */
          .container {
            flex-direction: column;
          }
          .vertical-nav {
            width: 100% !important;
            height: auto !important;
            flex-direction: row !important;
            padding: 8px 0 !important;
            justify-content: center !important;
            gap: 15px;
          }
          .middle-content {
            padding: 15px !important;
          }
        }
        @media (max-width: 600px) {
          /* Mobile */
          .horizontal-nav {
            flex-direction: column;
            gap: 8px;
            padding: 10px 15px !important;
            text-align: center;
          }
          .horizontal-nav > div {
            font-size: 1.2rem !important;
          }
          .horizontal-nav button {
            font-size: 0.9rem !important;
          }
          .vertical-nav {
            flex-direction: row !important;
            width: 100% !important;
            height: auto !important;
            padding: 5px 0 !important;
            justify-content: center !important;
            gap: 10px;
          }
          .middle-content {
            padding: 10px !important;
            width: 100%;
          }
          input[type="text"] {
            width: 100% !important;
            box-sizing: border-box;
          }
          .details-box {
            margin-bottom: 10px !important;
          }
        }
      `}</style>

      <div style={{
        height:"100vh",
        display:"flex",
        flexDirection:"column",
        fontFamily:"Arial, sans-serif",
        backgroundImage:"url('/home1.jpg')",
        backgroundSize:"cover",
        backgroundPosition:"center",
        backgroundBlendMode:"darken",
        backgroundColor:"rgba(0,0,0,0.6)",
        color:"white"
      }}>
        {/* Horizontal Navbar */}
        <div className="horizontal-nav" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#28a745", padding:"10px 20px" }}>
          <div style={{ fontSize:"1.5rem", fontWeight:"bold" }}>Krishi Agro</div>
          <div style={{ fontSize:"1.2rem" }}>{t.title}</div>
          <button style={{ ...navBtn, fontSize:"1rem" }} onClick={()=>navigate(`/Adminroot/Admin/${language}`)}>{t.goBack}</button>
        </div>

        <div className="container" style={{ display:"flex", height:"calc(100vh - 50px)" }}>
          {/* Vertical Navbar */}
          <div className="vertical-nav" style={{ width:"120px", background:"#333", padding:"10px", display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ fontSize:"1.2rem", marginBottom:"10px" }}>👤</div>
            <button style={navBtn} onClick={()=>navigate(`/farmer/profile/${language}`)}>{t.myProfile}</button>
          </div>

          {/* Middle Content */}
          <div className="middle-content" style={{ flex:1, overflowY:"auto", padding:"20px" }}>
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder={t.search}
              style={{ width:"200px", padding:"6px", borderRadius:"4px", border:"1px solid #ccc", marginBottom:"15px" }}
              type="text"
            />
            {loading && <div>{t.loading}</div>}
            {error   && <div style={{ color:"red" }}>{error}</div>}
            {!loading && farmers.length===0 && <div>{t.none}</div>}

            {/* Farmer list */}
            <div style={{ display:"flex", flexDirection:"column" }}>
              {farmers
                .filter(f=>f.name?.toLowerCase().includes(search.toLowerCase()))
                .map(f=>(
                  <div key={f.id} className="details-box" style={detailsBox}>
                    <div style={summaryBox}>
                      <span>{f.name}</span>
                    </div>
                    <div style={{ padding:"10px 20px" }}>
                      <p><b>{t.email}:</b> {f.email || "—"}</p>
                      <p><b>{t.phone}:</b> {f.phoneNumber || "—"}</p>
                      <p><b>{t.state}:</b> {f.state || "—"}</p>
                      <p><b>{t.city}:</b> {f.city || "—"}</p>
                      <p><b>{t.role}:</b> {f.role || "—"}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Allfarmer;
