import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../Backend/api";


/* ─────────────── language texts ─────────────── */
const translations = {
  hindi:   { title:"रुचि अनुमोदन",   approve:"अनुमोदित करें", deny:"अस्वीकार करें", noInterest:"कोई रुचि अनुरोध नहीं।", loading:"लोड हो रहा है...", error:"त्रुटि हुई। पुनः प्रयास करें।" },
  english: { title:"Interest Requests", approve:"Approve",       deny:"Deny",         noInterest:"No interest requests.", loading:"Loading...",     error:"Error occurred. Please try again." },
  punjabi: { title:"ਰੁਚੀ ਦੀ ਮੰਜੂਰੀ", approve:"ਮੰਜ਼ੂਰ ਕਰੋ",     deny:"ਨਕਾਰੋ",        noInterest:"ਕੋਈ ਰੁਚੀ ਦੀ ਬੇਨਤੀ ਨਹੀਂ।",     loading:"ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",  error:"ਗਲਤੀ ਹੋਈ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।" },
  malayalam:{ title:"ആശയം അംഗീകരിക്കൽ", approve:"അംഗീകരിക്കുക", deny:"നിഷേധിക്കുക", noInterest:"ആശയ അഭ്യർത്ഥനകളില്ല.",          loading:"ലോഡ് ചെയ്യുന്നു...", error:"പിശക് സംഭവിച്ചു. ദയവായി വീണ്ടും ശ്രമിക്കുക." },
  telugu:  { title:"ఆసక్తి అభ్యర్థనలు", approve:"ఆమోదించండి",  deny:"తిరస్కరించండి", noInterest:"ఎలాంటి ఆసక్తి అభ్యర్థనలు లేవు.",   loading:"లోడ్ అవుతోంది...",  error:"పొరపాటు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి." },
  marathi: { title:"रुची विनंत्या",   approve:"मंजूर करा",      deny:"नाकार",         noInterest:"कोणत्याही रुची विनंत्या नाहीत.",   loading:"लोड करत आहे...",   error:"त्रुटी झाली. कृपया पुन्हा प्रयत्न करा." },
};

/* ──────── NEW: per-language status translations ──────── */
const statusTranslations = {
  english:  { pending:"Pending",    approved:"Approved",   denied:"Denied" },
  hindi:    { pending:"लंबित",      approved:"अनुमोदित",   denied:"अस्वीकृत" },
  marathi:  { pending:"प्रलंबित",    approved:"मंजूर",      denied:"नाकारले" },
  punjabi:  { pending:"ਬਕਾਇਆ",     approved:"ਮੰਜ਼ੂਰ ਕੀਤਾ", denied:"ਨਕਾਰ ਦਿੱਤਾ" },
  telugu:   { pending:"పెండింగ్",    approved:"అనుమతించబడింది", denied:"తిరస్కరించబడింది" },
  malayalam:{ pending:"തീർപ്പാകാത്തത്", approved:"അംഗീകരിച്ചത്", denied:"തിരസ്കരിച്ചു" },
};

/* ─────────────── navbar placeholders (unchanged) ─────────────── */
const VerticalNavbar = () => (
  <div style={{
    width:"120px",
    background:"#333",
    color:"white",
    padding:"10px",
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    flexShrink:0,
  }}>
    <div style={{ fontSize:"1.2rem", marginBottom:"10px" }}>👤</div>
    <button style={{ background:"none", border:"none", color:"white", fontSize:"0.8rem", cursor:"pointer" }}>My Profile</button>
  </div>
);

const HorizontalNavbar = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div style={{
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      background:"#28a745",
      padding:"10px 20px",
      color:"white",
      flexShrink:0,
    }}>
      <div style={{ fontSize:"1.5rem", fontWeight:"bold" }}>Krishi Agro</div>
      <div style={{ fontSize:"1.2rem" }}>{title}</div>
      <button
        style={{ background:"none", border:"none", color:"white", fontSize:"1rem", cursor:"pointer" }}
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </div>
  );
};

/* ───────────── main component ───────────── */
const Interestfarmer = () => {
  const { language: routeLang } = useParams();  
const texts = translations[routeLang] || translations.english;

  const navigate   = useNavigate();
  
  const farmerId   = localStorage.getItem("userId");


  const [interests, setInterests] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [processingIds, setProcessingIds] = useState(new Set());

  /* ───────────── fetch interests ───────────── */
  useEffect(() => {
    (async () => {
      if (!farmerId) {
        alert("Please login as a farmer.");
        navigate("/");
        return;
      }
      try {
        setLoading(true);
        const response = await api.get("/interest/farmer-interests", {
          params: { farmer_id: farmerId },
        });
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.interests || [];
        setInterests(data);
      } catch (err) {
        console.error("❌ Unable to fetch farmer interests:", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
        }
        setError(texts.error);
      } finally {
        setLoading(false);
      }
    })();
  }, [farmerId, navigate, texts.error]);

  /* ───────────── approve / deny ───────────── */
  const handleInterestStatus = async (interestId, status) => {
    if (processingIds.has(interestId)) return;
    setProcessingIds(prev => new Set(prev).add(interestId));
    try {
      const path = status === "Approved" ? "/interest/approve" : "/interest/deny";

      const res = await api.post(path, null, { params: { interest_id: interestId } });

      if (res.data?.success) {
        alert(`Interest ${status.toLowerCase()} successfully.`);
        setInterests(prev =>
          prev.map(i =>
            i.id === interestId
              ? {
                  ...i,
                  status,
                  approval_timestamp: new Date().toISOString(),
                  approvalTimestamp: new Date().toISOString(),
                }
              : i
          )
        );
      } else {
        alert(res.data?.message || `Failed to ${status.toLowerCase()} interest.`);
      }
    } catch (e) {
      alert("Server error. Please try later.");
      console.error(e);
    } finally {
      setProcessingIds(prev => {
        const s = new Set(prev);
        s.delete(interestId);
        return s;
      });
    }
  };

  /* ───────────── helper: localise status ───────────── */
const localiseStatus = (status) => {
  if (!status) return "—";
  const lower = status.toLowerCase();
  return (
    statusTranslations[routeLang]?.[lower] ||
    statusTranslations.english[lower] ||
    status
  );
};


  /* ───────────── render ───────────── */
  return (
    <div
      style={{
        height:"100vh",
        width:"100vw",
        fontFamily:"Arial, sans-serif",
        backgroundImage:"url('/home1.jpg')",
        backgroundSize:"cover",
        backgroundPosition:"center",
        color:"white",
        display:"flex",
        flexDirection:"column",
        backgroundAttachment:"fixed",
        overflow:"hidden",
      }}
    >
      <HorizontalNavbar title={texts.title} />

      <div
        style={{
          flex:1,
          display:"flex",
          overflow:"hidden",
          minHeight:0,
        }}
      >
        <VerticalNavbar />

        <main
          style={{
            flex:1,
            padding:"20px",
            backgroundColor:"rgba(0,0,0,0.5)",
            borderRadius:"10px",
            margin:"10px",
            overflowY:"auto",
            overflowX:"auto",
            minHeight:0,
          }}
        >
          {loading && <p>{texts.loading}</p>}
          {error && <p style={{ color:"red" }}>{error}</p>}
          {!loading && !error && interests.length === 0 && <p>{texts.noInterest}</p>}

          {!loading && !error && interests.length > 0 && (
            <table
              style={{
                width:"100%",
                borderCollapse:"collapse",
                color:"white",
                fontSize:"1rem",
                minWidth:"600px",
              }}
            >
              <thead>
                <tr style={{ borderBottom:"2px solid #28a745" }}>
                  <th style={{ padding:"10px", textAlign:"left" }}>Product</th>
                  <th style={{ padding:"10px", textAlign:"left" }}>Businessman</th>
                  <th style={{ padding:"10px", textAlign:"left" }}>Status</th>
                  <th style={{ padding:"10px", textAlign:"left" }}>Requested At</th>
                  <th style={{ padding:"10px", textAlign:"left" }}>Approval Time</th>
                  <th style={{ padding:"10px", textAlign:"center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interests.map((interest) => (
                  <tr key={interest.id} style={{ borderBottom:"1px solid #555" }}>
                    <td style={{ padding:"10px" }}>
                      {interest.product_name || interest.productName || "—"}
                    </td>
                    <td style={{ padding:"10px" }}>
                      {interest.businessman_name || interest.businessmanName || "—"}
                    </td>
                    <td style={{ padding:"10px" }}>
                      {localiseStatus(interest.status)}
                    </td>
                    <td style={{ padding:"10px" }}>
                      {new Date(
                        interest.timestamp || interest.requestTime || interest.request_time
                      ).toLocaleString()}
                    </td>
                    <td style={{ padding:"10px" }}>
                      {interest.approval_timestamp || interest.approvalTimestamp
                        ? new Date(
                            interest.approval_timestamp || interest.approvalTimestamp
                          ).toLocaleString()
                        : "—"}
                    </td>
                    <td style={{ padding:"10px", textAlign:"center" }}>
                      {interest.status === "Pending" ? (
                        <>
                          <button
                            disabled={processingIds.has(interest.id)}
                            onClick={() => handleInterestStatus(interest.id, "Approved")}
                            style={{
                              marginRight:"8px",
                              padding:"6px 12px",
                              backgroundColor:"#28a745",
                              border:"none",
                              color:"white",
                              borderRadius:"4px",
                              cursor:"pointer",
                            }}
                          >
                            {texts.approve}
                          </button>
                          <button
                            disabled={processingIds.has(interest.id)}
                            onClick={() => handleInterestStatus(interest.id, "Denied")}
                            style={{
                              padding:"6px 12px",
                              backgroundColor:"#dc3545",
                              border:"none",
                              color:"white",
                              borderRadius:"4px",
                              cursor:"pointer",
                            }}
                          >
                            {texts.deny}
                          </button>
                        </>
                      ) : (
                        <span style={{ fontStyle:"italic", color:"#ccc" }}>
                          {localiseStatus(interest.status)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
};

export default Interestfarmer;
