import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../Backend/api"; // Axios instance

const translations = {
  hindi: { home:"होम", myProfile:"मेरा प्रोफ़ाइल",goBack:"वापस जाएं", updateProfile:"प्रोफ़ाइल अपडेट करें", savedItems:"रुचिकर आइटम्स", help:"मदद", logout:"लॉग आउट", searchPlaceholder:"खोजें...", waiting:"प्रतिक्रिया का इंतजार है...", rejected:"अनुरोध अस्वीकृत", phoneLabel:"किसान फ़ोन", phone:"किसान फ़ोन", denied:"अनुरोध स्वीकार नहीं किया गया", pending:"प्रतीक्षा में…", loading:"लोड हो रहा है...", none:"कोई रुचिकर उत्पाद नहीं मिला।", error:"डेटा लोड करने में विफल।" },
  english: { home:"Home", myProfile:"My Profile", goBack:"Go Back", updateProfile:"Update Profile", savedItems:"Interested Items", help:"Help", logout:"Logout", searchPlaceholder:"Search...", waiting:"Waiting for response...", rejected:"Request rejected", phoneLabel:"Farmer Phone", phone:"Farmer Phone", denied:"Request not accepted", pending:"Pending…", loading:"Loading...", none:"No interested products found.", error:"Failed to load product interest data." },
  punjabi: { home:"ਘਰ", myProfile:"ਮੇਰਾ ਪ੍ਰੋਫਾਈਲ",goBack:"ਵਾਪਸ ਜਾਓ", updateProfile:"ਪ੍ਰੋਫਾਈਲ ਅਪਡੇਟ ਕਰੋ", savedItems:"ਰੁਚੀ ਵਾਲੀਆਂ ਚੀਜ਼ਾਂ", help:"ਮਦਦ", logout:"ਲਾਗਆਉਟ", searchPlaceholder:"ਖੋਜੋ...", waiting:"ਜਵਾਬ ਦੀ ਉਡੀਕ ਕਰ ਰਹੇ ਹਾਂ...", rejected:"ਬੇਨਤੀ ਰੱਦ ਹੋਈ", phoneLabel:"ਕਿਸਾਨ ਫ਼ੋਨ", phone:"ਕਿਸਾਨ ਫ਼ੋਨ", denied:"ਬੇਨਤੀ ਸਵੀਕਾਰ ਨਹੀਂ ਕੀਤੀ ਗਈ", pending:"ਬਕਾਇਆ…", loading:"ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...", none:"ਕੋਈ ਰੁਚੀ ਵਾਲੀਆਂ ਚੀਜ਼ਾਂ ਨਹੀਂ ਮਿਲੀਆਂ।", error:"ਡਾਟਾ ਲੋਡ ਕਰਨ ਵਿੱਚ ਅਸਫਲਤਾ" },
  malayalam:{ home:"ഹോം", myProfile:"എൻറെ പ്രൊഫൈൽ",  goBack:"മടങ്ങുക",updateProfile:"പ്രൊഫൈൽ അപ്‌ഡേറ്റ് ചെയ്യുക", savedItems:"ആസക്തിയായ ഇനങ്ങൾ", help:"സഹായം", logout:"ലോഗൗട്ട്", searchPlaceholder:"തിരയൂ...", waiting:"പ്രതികരണത്തിനായി കാത്തിരിക്കുന്നു...", rejected:"അഭ്യർത്ഥന നിഷേധിച്ചു", phoneLabel:"കർഷക ഫോൺ", phone:"കർഷക ഫോൺ", denied:"വിനंതി സ്വീകരിച്ചില്ല", pending:"തുടരുന്നു…", loading:"ലോഡ് ചെയ്യുന്നു...", none:"ആസക്തിയായ ഉൽപ്പന്നങ്ങൾ ഇല്ല.", error:"ഡാറ്റാ ലോഡ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു." },
  telugu:   { home:"హోమ్", myProfile:"నా ప్రొఫైల్", goBack:"తిరిగి వెళ్లు", updateProfile:"ప్రొఫైల్ నవీకరించు", savedItems:"ఆసక్తి ఉన్న వస్తువులు", help:"సహాయం", logout:"లాగౌట్", searchPlaceholder:"శోధించండి...", waiting:"సమాధానానికి ఎదురుచూస్తున్నారు...", rejected:"అభ్యర్థన తిరస్కరించబడింది", phoneLabel:"రైతు ఫోన్", phone:"రైతు ఫోన్", denied:"అభ్యర్థన ఆమోదించలేదు", pending:"పెండింగ్…", loading:"లోడ్ అవుతోంది...", none:"ఆసక్తి ఉన్న ఉత్పత్తులు కనపడలేదు.", error:"డేటా లోడ్ చేయడంలో విఫలమైంది." },
  marathi:  { home:"मुख्यपृष्ठ", myProfile:"माझी प्रोफाइल",  goBack:"मागे जा",updateProfile:"प्रोफाइल अपडेट करा", savedItems:"आवडलेली उत्पादने", help:"मदत", logout:"बाहेर पडा", searchPlaceholder:"शोधा...", waiting:"प्रतिक्रियेसाठी वाट पाहत आहे...", rejected:"विनंती नाकारली", phoneLabel:"शेतकरी फोन", phone:"शेतकरी फोन", denied:"अभ्यर्थना स्वीकारली नाही", pending:"प्रलंबित…", loading:"लोड करत आहे...", none:"कोणतेही आवडलेले उत्पादने सापडली नाहीत.", error:"डेटा लोड करण्यात अयशस्वी." }
};

const navBtn = { background:"none", border:"none", color:"white", fontSize:"0.8rem", cursor:"pointer" };

const VerticalNavbar = ({ t, navigate, language }) => (
  <div style={{ width:"120px", background:"#333", color:"white", padding:"10px", display:"flex", flexDirection:"column", alignItems:"center", fontSize:"0.8rem", justifyContent:"space-between" }}>
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"10px" }}>
      <div style={{ fontSize:"1.2rem", marginBottom:"10px" }}>👤</div>
      {/* <button style={navBtn} onClick={()=>navigate(`/Businessman/Businessmanmyprofile/${language}`)}>{t.myProfile}</button>
      <button style={navBtn} onClick={()=>navigate(`/updateprofile/${language}`)}>{t.updateProfile}</button>
      <button style={navBtn} onClick={()=>navigate(`/saveditems/${language}`)}>{t.savedItems}</button> */}
    </div>
    <button style={navBtn}>{t.help}</button>
  </div>
);

const HorizontalNavbar = ({ navigate, language, t }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#28a745", padding:"10px 20px", color:"white", flexWrap:"wrap", fontSize:"1.2rem" }}>
    <div style={{ fontSize:"1.5rem", fontWeight:"bold" }}>Krishi Agro</div>
    <button style={{ background:"none", border:"none", color:"white", fontSize:"1rem", cursor:"pointer" }} onClick={()=>navigate("/")}>{t.home}</button>
    <button style={{ background:"white", color:"#28a745", padding:"5px 10px", borderRadius:"5px", cursor:"pointer" }} onClick={()=>navigate(`/home1/${language}`)}>{t.logout}</button>
    <button style={{ background:"none", border:"none", color:"white", fontSize:"1rem", cursor:"pointer" }} onClick={()=>navigate(-1)}>{t.goBack}</button>
  </div>
);

const Status = () => {
  const { language } = useParams();
  const t = translations[language] || translations.english;
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState("");

  const businessmanId = localStorage.getItem("userId");

  useEffect(() => {
    if (!businessmanId) { setError("Businessman ID missing."); return; }

    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/interest/businessman-status", { params:{ businessman_id: businessmanId } });
        const list = Array.isArray(res.data) ? res.data : (res.data.interests || []);
        setProducts(list);
      } catch (err) {
        setError(t.error);
      } finally {
        setLoading(false);
      }
    })();
  }, [businessmanId, t.error]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      fontFamily: "Arial, sans-serif",
      overflowX: "hidden",
      backgroundImage: "url('/home1.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundBlendMode: "darken",
      backgroundColor: "rgba(0,0,0,0.6)",
      color: "white",
    }}>
      <HorizontalNavbar navigate={navigate} language={language} t={t} />

      <div style={{
        display: "flex",
        flex: 1,
        overflow: "hidden",
        flexDirection: "row"
      }}>
        <VerticalNavbar t={t} navigate={navigate} language={language} />

        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          fontSize: "1.1rem",
          backgroundImage: "url('/home1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "darken",
          backgroundColor: "rgba(0,0,0,0.6)"
        }}>
          {loading && <div>{t.loading}</div>}
          {!loading && products.length === 0 && !error && <div>{t.none}</div>}
          {error && <div style={{ color: "red" }}>{error}</div>}

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            justifyItems: "center"
          }}>
            {products.map(p => (
              <div key={p.id} style={{
                width: "100%",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "15px",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)"
              }}>
                <h3>{p.name || p.productName}</h3>
                <p><strong>Businessman:</strong> {p.businessmanName || p.businessman || "N/A"}</p>
                <p><strong>{t.phoneLabel}:</strong> {p.farmerPhone || "N/A"}</p>
                <p><strong>Status:</strong> {p.status || t.pending}</p>
                <p><strong>Approval Time:</strong> {p.approvalTimestamp || "N/A"}</p>
                <p><strong>Interest Timestamp:</strong> {p.timestamp || "N/A"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
