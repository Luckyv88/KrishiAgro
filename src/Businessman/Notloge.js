import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const translations = {
  hindi: { myProfile: "मेरा प्रोफ़ाइल", notLoggedIn: "आप लॉग इन नहीं हैं, कृपया लॉग इन करें", goBack: "वापस जाएं" },
  english: { myProfile: "My Profile", notLoggedIn: "You are not login please Login" , goBack: "Go Back"},
  punjabi: { myProfile: "ਮੇਰਾ ਪ੍ਰੋਫਾਈਲ", notLoggedIn: "ਤੁਸੀਂ ਲੌਗ ਇਨ ਨਹੀਂ ਹੋ, ਕਿਰਪਾ ਕਰਕੇ ਲੌਗ ਇਨ ਕਰੋ", goBack: "ਵਾਪਸ ਜਾਓ" },
  malayalam: { myProfile: "എൻറെ പ്രൊഫൈൽ", notLoggedIn: "നിങ്ങൾ ലോഗിൻ ചെയ്തിട്ടില്ല, ദയവായി ലോഗിൻ ചെയ്യുക" , goBack: "മടങ്ങുക"},
  telugu: { myProfile: "నా ప్రొఫైల్", notLoggedIn: "మీరు లాగిన్ కాలేదు, దయచేసి లాగిన్ అవ్వండి" , goBack: "తిరిగి వెళ్ళండి"},
  marathi: { myProfile: "माझी प्रोफाइल", notLoggedIn: "आपण लॉगिन केलेले नाही, कृपया लॉगिन करा" , goBack: "मागे जा"},
};

const Notloge = () => {
  const { language } = useParams();
  const navigate = useNavigate();
  const t = translations[language] || translations.english;

  const buttonStyle = {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "0.8rem",
    cursor: "pointer",
  };

  return (
    <>
      <style>{`
        /* Responsive styles */

        /* Tablet (iPad) */
        @media (max-width: 992px) {
          div[style*="flex-direction: row"] {
            flex-direction: column !important;
          }
          div[style*="max-width: 120px"] {
            width: 100% !important;
            max-width: none !important;
            flex-direction: row !important;
            justify-content: space-around !important;
            padding: 5px 0 !important;
            font-size: 1rem !important;
          }
          div[style*="max-width: 120px"] > div {
            flex-direction: row !important;
            gap: 5px !important;
          }
          div[style*="background-color: rgba(255,255,255,0.1)"] {
            padding: 20px 30px !important;
            font-size: 1.1rem !important;
          }
        }

        /* Mobile (phones) */
        @media (max-width: 600px) {
          div[style*="flex-direction: row"] {
            flex-direction: column !important;
          }
          div[style*="max-width: 120px"] {
            width: 100% !important;
            max-width: none !important;
            flex-direction: row !important;
            justify-content: space-around !important;
            padding: 10px 0 !important;
            font-size: 1rem !important;
          }
          div[style*="max-width: 120px"] > div {
            flex-direction: row !important;
            gap: 5px !important;
          }
          div[style*="background-color: rgba(255,255,255,0.1)"] {
            padding: 15px 20px !important;
            font-size: 1rem !important;
            width: 90vw !important;
            box-sizing: border-box;
          }
          /* Adjust horizontal navbar buttons on smaller screens */
          button[style*="background: white"] {
            padding: 8px 12px !important;
            font-size: 1rem !important;
          }
          /* Reduce navbar font size */
          div[style*="background: #28a745"] {
            font-size: 1rem !important;
            padding: 10px 10px !important;
          }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          fontFamily: "Arial, sans-serif",
          backgroundImage:`url(${process.env.PUBLIC_URL}/home1.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "darken",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
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
              Login
            </button>
            <div>
              <button
                style={{ background: "none", border: "none", color: "white", fontSize: "1rem", cursor: "pointer" }}
                onClick={() => navigate(`/home1/${language}`)}
              >
                {t.goBack}
              </button>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div style={{ display: "flex", flex: 1, flexDirection: "row", overflow: "hidden" }}>
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
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div style={{ fontSize: "1.2rem", marginBottom: "10px" }}>👤</div>
              <button style={buttonStyle} onClick={() => navigate(`/businessman/notloge/${language}`)}>
                {t.myProfile}
              </button>
            </div>
            <div></div> {/* empty for bottom spacing */}
          </div>

          {/* Middle Content */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.2rem",
              color: "white",
              padding: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                padding: "30px 50px",
                borderRadius: "10px",
                backdropFilter: "blur(5px)",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                textAlign: "center",
                color: "white",
              }}
            >
              {t.notLoggedIn}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notloge;
