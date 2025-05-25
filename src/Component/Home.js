import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLanguageSelect = (language) => {
    navigate(`/home1/${language}`);
  };

  return (
    <>
      {/* ---------- responsive tweaks (phones & tablets) ---------- */}
      <style>{`
        @media (max-width: 600px) {
          .home-wrapper h1 { font-size: 2rem !important; }
          .home-buttons { gap: 8px !important; }
          .home-button  { max-width: 100% !important; }
        }
        @media (min-width: 601px) and (max-width: 900px) {
          .home-wrapper h1 { font-size: 2.2rem !important; }
          .home-button  { max-width: 160px !important; }
        }
      `}</style>

      <div
        className="home-wrapper"
        style={{
          backgroundImage: "url('/farm.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "darken",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: "#fff",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          padding: "20px"
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "20px",
            maxWidth: "90%"
          }}
        >
          Krishi Agro
        </h1>

        <div
          className="home-buttons"
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "90%"
          }}
        >
          {[
            { lang: "hindi",    label: "हिन्दी"   },
            { lang: "english",  label: "English"  },
            { lang: "punjabi",  label: "ਪੰਜਾਬੀ"   },
            { lang: "malayalam",label: "മലയാളം"  },
            { lang: "telugu",   label: "తెలుగు"   },
            { lang: "marathi",  label: "मराठी"    }
          ].map(({ lang, label }) => (
            <button
              key={lang}
              className="home-button"
              onClick={() => handleLanguageSelect(lang)}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                width: "100%",
                maxWidth: "200px"
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
