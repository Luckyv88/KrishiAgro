import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import api from "../Backend/api";
import API from "../Backend/api";
import qs from "qs";

const translations = {
  hindi:   { home:"होम", login:"लॉग इन करें", goBack:"वापस जाएं",register:"पंजीकरण करें", myProfile:"मेरा प्रोफ़ाइल", updateProfile:"प्रोफ़ाइल अपडेट करें", savedItems:"रुचिकर आइटम्स", help:"मदद", logout:"लॉग आउट", searchPlaceholder:"खोजें...", showMore:"और दिखाएं", interested:"रुचि", interestSuccess:"सफलतापूर्वक रुचि सहेजी गई!", waitingResponse:"प्रतिक्रिया का इंतजार है..." },
  english: { home:"Home", login:"Login", register:"Register", goBack:"Go Back", myProfile:"My Profile", updateProfile:"Update Profile", savedItems:"Interested Items", help:"Help", logout:"Logout", searchPlaceholder:"Search...", showMore:"Show More", interested:"Interested", interestSuccess:"Interest saved successfully!", waitingResponse:"Waiting for response..." },
  punjabi: { home:"ਘਰ", login:"ਲਾਗਇਨ", register:"ਰਜਿਸਟਰ",goBack:"ਵਾਪਸ ਜਾਓ", myProfile:"ਮੇਰਾ ਪ੍ਰੋਫਾਈਲ", updateProfile:"ਪ੍ਰੋਫਾਈਲ ਅਪਡੇਟ ਕਰੋ", savedItems:"ਰੁਚੀ ਵਾਲੀਆਂ ਚੀਜ਼ਾਂ", help:"ਮਦਦ", logout:"ਲਾਗਆਉਟ", searchPlaceholder:"ਖੋਜੋ...", showMore:"ਹੋਰ ਵੇਖੋ", interested:"ਰੁਚੀ", interestSuccess:"ਰੁਚੀ ਸਫਲਤਾਪੂਰਵਕ ਸੇਵ ਕੀਤੀ ਗਈ!", waitingResponse:"ਜਵਾਬ ਦੀ ਉਡੀਕ ਕਰ ਰਹੇ ਹਾਂ..." },
  malayalam:{ home:"ഹോം", login:"ലോഗിൻ", register:"രജിസ്റ്റർ", goBack:"മടങ്ങുക", myProfile:"എൻറെ പ്രൊഫൈൽ", updateProfile:"പ്രൊഫൈൽ അപ്‌ഡേറ്റ് ചെയ്യുക", savedItems:"ആസക്തിയായ ഇനങ്ങൾ", help:"സഹായം", logout:"ലോഗൗട്ട്", searchPlaceholder:"തിരയൂ...", showMore:"കൂടുതൽ കാണിക്കുക", interested:"ആസക്തി", interestSuccess:"ആസക്തി വിജയകരമായി സേവ് ചെയ്തു!", waitingResponse:"പ്രതികരണത്തിനായി കാത്തിരിക്കുന്നു..." },
  telugu:  { home:"హోమ్", login:"లాగిన్", goBack:"తిరిగి వెళ్లు", register:"నమోదు", myProfile:"నా ప్రొఫైల్", updateProfile:"ప్రొఫైల్ నవీకరించు", savedItems:"ఆసక్తి ఉన్న వస్తువులు", help:"సహాయం", logout:"లాగౌట్", searchPlaceholder:"శోధించండి...", showMore:"ఇంకా చూపించు", interested:"ఆసక్తి", interestSuccess:"ఆసక్తి విజయవంతంగా సేవ్ చేయబడింది!", waitingResponse:"సమాధానానికి ఎదురుచూస్తున్నారు..." },
  marathi: { home:"मुख्यपृष्ठ", login:"लॉगिन", goBack:"मागे जा", register:"नोंदणी", myProfile:"माझी प्रोफाइल", updateProfile:"प्रोफाइल अपडेट करा", savedItems:"आवडलेली उत्पादने", help:"मदत", logout:"बाहेर पडा", searchPlaceholder:"शोधा...", showMore:"अधिक दाखवा", interested:"रुची", interestSuccess:"रुची यशस्वीपणे जतन झाली!", waitingResponse:"प्रतिक्रियेसाठी वाट पाहत आहे..." },
};

const pick = (obj, ...keys) => {
  for (const k of keys) if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  return undefined;
};

const Interested = () => {
  const { language } = useParams();
  const navigate     = useNavigate();
  const t            = translations[language] || translations.english;

  const [searchTerm,setSearchTerm]        = useState("");
  const [products,  setProducts]          = useState([]);
  const [loading,   setLoading]           = useState(false);
  const [error,     setError]             = useState("");
  const [loadingInterestIds, setLoadingInterestIds]   = useState(new Set());
  const [interestedProductIds, setInterestedProductIds] = useState(new Set());

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("interestedProducts") || "[]");
    setInterestedProductIds(new Set(saved));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/products/list");
        const data = Array.isArray(res.data) ? res.data : res.data.products || [];
        const filtered = data.filter(prod => interestedProductIds.has(prod.id));
        setProducts(filtered);
      } catch (err) {
        console.error("❌ Unable to fetch products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    })();
  }, [interestedProductIds]);

  const handleInterest = async (e, product_id) => {
    e.preventDefault();
    const user = { id: localStorage.getItem("userId"), role: localStorage.getItem("userRole") };
    if (!user.id || user.role.toLowerCase() !== "businessman") {
      alert("Please login as a businessman first.");
      return navigate(`/Businessman/Successlogin/${language}`);
    }
    setLoadingInterestIds(prev => new Set(prev).add(product_id));
    const formData = { businessman_id: user.id, product_id };
    try {
      const response = await API.post(
        "/interest/express",
        qs.stringify(formData),
        { headers:{ "Content-Type":"application/x-www-form-urlencoded" } }
      );
      alert(response.data.message || (response.data.success ? t.interestSuccess : "Failed to express interest."));
      if (response.data.success) {
        setInterestedProductIds(prev => {
          const updated = new Set(prev).add(product_id);
          localStorage.setItem("interestedProducts", JSON.stringify(Array.from(updated)));
          return updated;
        });
      }
    } catch {
      alert("Server error. Please try later.");
    } finally {
      setLoadingInterestIds(prev => { const c=new Set(prev); c.delete(product_id); return c; });
    }
  };

  const navBtn = { background:"none", border:"none", color:"white", fontSize:"0.8rem", cursor:"pointer" };

  return (
    <div
      style={{
        display:"flex", flexDirection:"column", height:"100vh",
        fontFamily:"Arial, sans-serif",
        backgroundImage:`url(${process.env.PUBLIC_URL}/home1.jpg)`, backgroundSize:"cover",
        backgroundPosition:"center", backgroundBlendMode:"darken",
        backgroundColor:"rgba(0,0,0,0.6)", color:"white",
      }}
    >
      {/* ---------- Horizontal Navbar ---------- */}
      <div
        style={{
          display:"flex", justifyContent:"space-between", alignItems:"center",
          background:"#28a745", padding:"10px 20px", color:"white",
          flexWrap:"wrap", fontSize:"1.2rem",
        }}
      >
        <div style={{ fontSize:"1.5rem", fontWeight:"bold" }}>Krishi Agro</div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
          placeholder={t.searchPlaceholder}
          style={{
            width:"150px", padding:"3px", borderRadius:"3px",
            border:"1px solid #ccc", marginRight:"20px", fontSize:"1rem",
          }}
        />
        <button style={{ background:"none", border:"none", color:"white", fontSize:"1rem", cursor:"pointer" }}
                onClick={()=>navigate("/")}>{t.home}</button>
        <button style={{ background:"white", color:"#28a745", padding:"5px 10px",
                         borderRadius:"5px", cursor:"pointer" }}
                onClick={()=>navigate(`/home1/${language}`)}>{t.logout}</button>
        <button style={{ background:"none", border:"none", color:"white", fontSize:"1rem", cursor:"pointer" }}
                onClick={()=>navigate(-1)}>{t.goBack}</button>
      </div>

      {/* ---------------- Main Layout ---------------- */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        {/* -------- Vertical Navbar -------- */}
        <div
          style={{
            width:"100%", maxWidth:"120px", background:"#333", color:"white",
            padding:"10px", display:"flex", flexDirection:"column",
            alignItems:"center", fontSize:"0.8rem", minWidth:"60px",
            justifyContent:"space-between",
          }}
        >
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"10px" }}>
            <div style={{ fontSize:"1.2rem", marginBottom:"10px" }}>👤</div>
            {/* <button style={navBtn} onClick={() => navigate(`/Businessman/Businessmanmyprofile/${language}`)}>{t.myProfile}</button>
            <button style={navBtn} onClick={() => navigate(`/updateprofile/${language}`)}>{t.updateProfile}</button>
            <button style={navBtn} onClick={() => navigate(`/saveditems/${language}`)}>{t.savedItems}</button> */}
          </div>
          <button style={navBtn}>{t.help}</button>
        </div>

        {/* -------- Scrollable Middle Content -------- */}
        <div
          style={{
            flex:1, overflowY:"auto", padding:"20px", fontSize:"1.1rem",
            backgroundImage:`url(${process.env.PUBLIC_URL}/home1.jpg)`, backgroundSize:"cover",
            backgroundPosition:"center", backgroundBlendMode:"darken",
            backgroundColor:"rgba(0,0,0,0.6)",
          }}
        >
          {loading && <div>Loading products...</div>}
          {error && <div style={{ color:"red" }}>{error}</div>}
          {!loading && products.length === 0 && <div>No interested products found.</div>}

          <style>{`
            @media (min-width: 768px) {
              .product-card {
                flex: 1 1 calc(50% - 10px);
                max-width: calc(50% - 10px);
              }
            }
            @media (max-width: 767px) {
              .product-card {
                flex: 1 1 100%;
                max-width: 100%;
              }
            }
          `}</style>

          {/* ---------- Responsive Product Grid ---------- */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:"20px", justifyContent:"center" }}>
            {products.map((p) => {
              const name  = pick(p,"name");
              const city  = pick(p,"city");
              const state = pick(p,"state");
              const qty   = pick(p,"quantity_available","quantityAvailable");
              const desc  = pick(p,"description","desc");
              const price = pick(p,"price");

              return (
                <div key={p.id} className="product-card"
                  style={{
                    background:"rgba(255,255,255,0.1)",
                    borderRadius:"8px", overflow:"hidden",
                    boxShadow:"0 0 10px rgba(0,0,0,0.5)", display:"flex",
                    flexDirection:"column", padding:"15px",
                  }}
                >
                  <h2 style={{ margin:"0 0 8px 0" }}>{name}</h2>
                  <p style={{ margin:"0 0 4px 0" }}><b>City:</b> {city}</p>
                  <p style={{ margin:"0 0 4px 0" }}><b>State:</b> {state}</p>
                  <p style={{ margin:"0 0 4px 0" }}><b>Quantity Available:</b> {qty}</p>
                  <p style={{ margin:"0 0 8px 0" }}><b>Price:</b> ₹{price}</p>
                  <p style={{ margin:0 }}><strong>Description:</strong> {desc?.trim() || "No description."}</p>
                  {loadingInterestIds.has(p.id) ? (
                    <div style={{ position:"relative", fontSize:"0.8rem", color:"#ffd700", marginTop:"6px" }}>
                      {t.waitingResponse}
                    </div>
                  ) : (
                    <div style={{ color:"green", fontWeight:"bold", marginTop:"6px" }}>
                      Interest expressed!
                    </div>
                  )}
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

export default Interested;
