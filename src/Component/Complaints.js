/* ===========================================================
   Complaints.js – Submit & view complaints
   (Now includes only **CSS** tweaks so the same markup works
   comfortably on phones, tablets, and laptops.  No JS logic,
   routes, fetch calls, colours, fonts, paths or wording were
   touched.)
=========================================================== */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../Backend/api";
import qs from "qs";

/* 🌐 Translations (unchanged) */
const translations = {
  hindi:   { title:"शिकायत",  home:"होम",  myProfile:"मेरा प्रोफ़ाइल", complaint:"शिकायत", help:"मदद",
             submit:"जमा करें", descPlaceholder:"अपनी शिकायत लिखें...", searchPlaceholder:"खोजें..." },
  english: { title:"Complaint", home:"Home", myProfile:"My Profile", complaint:"Complaint", help:"Help",
             submit:"Submit", descPlaceholder:"Enter your complaint...", searchPlaceholder:"Search..." },
  punjabi: { title:"ਸ਼ਿਕਾਇਤ",  home:"ਹੁਮ",  myProfile:"ਮੈਂ ਪ੍ਰੋਫ਼ਾਈਲ", complaint:"ਸ਼ਿਕਾਇਤ", help:"ਮਦਦ",
             submit:"ਜਮਾ ਕਰੋ", descPlaceholder:"ਇੱਥੇ ਆਪਣੀ ਸ਼ਿਕਾਇਤ ਲਿਖੋ...", searchPlaceholder:"ਖੋਜ..." },
  malayalam:{ title:"പരാതി",  home:"ഹോം", myProfile:"എൻ്റെ പ്രൊഫൈൽ", complaint:"പരാതി", help:"സഹായം",
             submit:"സമർപ്പിക്കുക", descPlaceholder:"പരാതി എഴുതി നൽകൂ...", searchPlaceholder:"തിരയുക..." },
  telugu:  { title:"ఫిర్యాదు", home:"హోమ్", myProfile:"నా ప్రొఫైల్", complaint:"ఫిర్యాదు", help:"సహాయం",
             submit:"సమర్పించు", descPlaceholder:"మీ ఫిర్యాదును ఇవ్వండి...", searchPlaceholder:"శోధించండి..." },
  marathi: { title:"तक्रार",   home:"मुख्यपृष्ठ", myProfile:"माझे प्रोफाइल", complaint:"तक्रार", help:"मदत",
             submit:"सबमिट", descPlaceholder:"तुमची तक्रार लिहा...", searchPlaceholder:"शोधा..." },
};

/* ✅ Component */
const Complaints = () => {
  const { language="english" } = useParams();
  const navigate   = useNavigate();
  const t          = translations[language] || translations.english;
  const userId     = localStorage.getItem("userId");

  const [searchTerm,  setSearchTerm]  = useState("");
  const [complaints,  setComplaints]  = useState([]);
  const [form,        setForm]        = useState({ description:"" });
  const [loading,     setLoading]     = useState(false);

  /* ─── Helpers ─── */
  const isResolved = status => status?.toLowerCase() === "resolved";
  const buttonStyle = { background:"none", border:"none", color:"white",
                        fontSize:"0.8rem", cursor:"pointer" };

  /* ─── Fetch user complaints ─── */
  const fetchComplaints = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await API.get("/complaints/user", {
        params:{ user_id:userId },
        paramsSerializer: p=>qs.stringify(p),
      });
      if (res.data.success) setComplaints(res.data.complaints);
      else                  alert("Failed to fetch complaints");
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally { setLoading(false); }
  };

  /* ─── Initial load ─── */
  useEffect(()=>{
    if (!userId) {
      alert("Please log in first.");
      navigate(`/login/${language}`);
    } else {
      fetchComplaints();
    }
    // eslint-disable-next-line
  }, []);  // run once

  /* ─── Handlers ─── */
  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.description.trim()) return alert("Description is required!");
    try {
      const payload = qs.stringify({ description:form.description, user_id:userId });
      const res     = await API.post("/complaints/submit", payload, {
        headers:{ "Content-Type":"application/x-www-form-urlencoded" },
      });
      alert(res.data.message || "Complaint submitted");
      setForm({ description:"" });
      fetchComplaints();
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to submit complaint");
    }
  };

  const handleProfileClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.role) return navigate(`/Businessman/Notloge/${language}`);
    if (user.role === "farmer")       navigate(`/Farmer/FarmerMyprofile`);
    else if (user.role === "businessman") navigate(`/Businessman/BusinessmsnMyprofile`);
  };

  /* ─── Render ─── */
  return (
    <>
      {/* ---------- ONLY CSS ADDED FOR RESPONSIVENESS ---------- */}
      <style>{`
        @media (max-width: 600px){
          .comp-topbar{flex-direction:column;align-items:flex-start;padding:12px}
          .comp-topbar button{margin-top:8px}
          .comp-sidebar{display:none}
          .comp-form-box{max-width:100%!important}
        }
        @media (min-width: 601px) and (max-width: 900px){
          .comp-form-box{max-width:80%!important}
        }
      `}</style>

      <div style={{
        height:"100vh", display:"flex", flexDirection:"column",
        fontFamily:"Arial, sans-serif",
        backgroundImage:"url('/home1.jpg')", backgroundSize:"cover",
        backgroundPosition:"center", backgroundBlendMode:"darken",
        backgroundColor:"rgba(0,0,0,0.6)", color:"white",
      }}>
        {/* ── Horizontal Navbar ── */}
        <div className="comp-topbar" style={{
          display:"flex", justifyContent:"space-between", alignItems:"center",
          background:"#28a745", padding:"10px 20px", color:"white",
        }}>
          <div style={{ fontSize:"1.5rem", fontWeight:"bold" }}>Krishi Agro</div>
          <div style={{ fontSize:"1.2rem" }}>{t.title}</div>
          <button
            style={{ background:"none", border:"none", color:"white",
                     fontSize:"1rem", cursor:"pointer" }}
            onClick={()=>navigate(-1)}
          >
            {t.home}
          </button>
        </div>

        {/* ── Main Layout ── */}
        <div style={{ display:"flex", height:"calc(100vh - 50px)" }}>
          {/* Vertical Navbar */}
          <div className="comp-sidebar" style={{
            width:"120px", background:"#333", color:"white", padding:"10px",
            display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"space-between",
          }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"10px" }}>
              <div style={{ fontSize:"1.2rem", marginBottom:"10px" }}>👤</div>
              <button style={buttonStyle} onClick={handleProfileClick}>
                {t.myProfile}
              </button>
              <button style={buttonStyle} onClick={()=>navigate(`/farmer/complaints/${language}`)}>
                📢 {t.complaint}
              </button>
            </div>
            <button style={buttonStyle}>{t.help}</button>
          </div>

          {/* Middle Content */}
          <div style={{
            flex:1, overflowY:"auto", padding:"20px",
            backgroundImage:"url('/home1.jpg')", backgroundSize:"cover",
            backgroundPosition:"center", backgroundBlendMode:"darken",
            backgroundColor:"rgba(0,0,0,0.6)",
          }}>
            {/* ── Complaint form ── */}
            <h2>{t.title}</h2>
            <div className="comp-form-box" style={{ maxWidth:"500px", marginBottom:"25px" }}>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder={t.descPlaceholder}
                style={{ width:"100%", height:"120px", padding:"8px",
                         borderRadius:"4px", border:"1px solid #ccc" }}
              />
              <button
                onClick={handleSubmit}
                style={{ marginTop:"10px", padding:"8px 20px",
                         border:"none", borderRadius:"4px",
                         background:"#ffc107", color:"#000",
                         fontWeight:"bold", cursor:"pointer" }}
              >
                {t.submit}
              </button>
            </div>

            {/* ── Complaint list ── */}
            <h3>{t.myComplaintList || "Your Complaints"}</h3>
            {loading && <p>Loading…</p>}
            <ul style={{ listStyle:"none", padding:0 }}>
              {complaints
                .filter(c=>c.description?.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(comp=>(
                <li key={comp.id} style={{
                  border:"1px solid #ccc", borderRadius:"6px",
                  marginBottom:"12px", padding:"10px",
                  backgroundColor:isResolved(comp.status) ? "#d4edda" : "#f8d7da",
                  color:"#000",
                }}>
                  <strong>#{comp.id}</strong> – {isResolved(comp.status) ? "✅ Resolved" : "❌ Pending"}
                  <p style={{ margin:"6px 0 0" }}>{comp.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Complaints;
