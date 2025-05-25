import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Backend/api";
import qs from "qs";

const translations = {
  hindi:{ home:"होम", login:"लॉग इन करें", register:"पंजीकरण करें", myProfile:"मेरा प्रोफ़ाइल", email:"ईमेल", password:"पासवर्ड", loginTitle:"लॉगिन", goBack:"वापस जाएं", updateProfile:"प्रोफ़ाइल अपडेट करें", savedItems:"सहेजे गए आइटम" },
  english:{ home:"Home", login:"Login", register:"Register", myProfile:"My Profile", email:"Email", password:"Password", loginTitle:"Login", goBack:"Go Back", updateProfile:"Update Profile", savedItems:"Saved Items" },
  punjabi:{ home:"ਘਰ", login:"ਲਾਗਇਨ", register:"ਰਜਿਸਟਰ", myProfile:"ਮੇਰਾ ਪ੍ਰੋਫਾਈਲ", email:"ਈਮੇਲ", password:"ਪਾਸਵਰਡ", loginTitle:"ਲਾਗਇਨ", goBack:"ਵਾਪਸ ਜਾਓ", updateProfile:"ਪ੍ਰੋਫਾਈਲ ਅਪਡੇਟ", savedItems:"ਸੰਭਾਲੀਆਂ ਚੀਜ਼ਾਂ" },
  malayalam:{ home:"ഹോം", login:"ലോഗിൻ", register:"രജിസ്റ്റർ", myProfile:"എൻറെ പ്രൊഫൈൽ", email:"ഇമെയിൽ", password:"പാസ്വേഡ്", loginTitle:"ലോഗിൻ", goBack:"മടങ്ങുക", updateProfile:"പ്രൊഫൈൽ അപ്ഡേറ്റ്", savedItems:"സേവ് ചെയ്തവ" },
  telugu:{ home:"హోమ్", login:"లాగిన్", register:"నమోదు", myProfile:"నా ప్రొఫైల్", email:"ఈమెయిల్", password:"పాస్వర్డ్", loginTitle:"లాగిన్", goBack:"తిరిగి వెళ్లు", updateProfile:"ప్రొఫైల్ నవీకరణ", savedItems:"భద్రపరచినవి" },
  marathi:{ home:"मुख्यपृष्ठ", login:"लॉगिन", register:"नोंदणी", myProfile:"माझी प्रोफाइल", email:"ईमेल", password:"पासवर्ड", loginTitle:"लॉगिन", goBack:"मागे जा", updateProfile:"प्रोफाइल अपडेट करा", savedItems:"जतन केलेल्या वस्तू" }
};

const Login = () => {
  const { language } = useParams();
  const navigate     = useNavigate();
  const t            = translations[language] || translations.english;

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(
        "/auth/login",
        qs.stringify({ email, password }),
        { headers:{ "Content-Type":"application/x-www-form-urlencoded" } }
      );

      if (res.data.success && res.data.user) {
        const { id, email, role } = res.data.user;
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userId", id);
        localStorage.setItem("userRole", role);

        const path = role?.trim().toLowerCase() === "farmer"
          ? `/farmer/successloged/${language}`
          : role?.trim().toLowerCase() === "businessman"
            ? `/Businessman/successlogin/${language}`
            : `/Adminroot/Admin/${language}`;
        navigate(path);
      } else {
        setError(res.data.message || "Invalid credentials. Please check your email and password.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* -------- responsive tweaks only, layout untouched -------- */}
      <style>{`
        /* stack topbar buttons on very small screens */
        @media (max-width: 600px){
          .login-topbar{flex-direction:column;align-items:flex-start}
          .login-topbar button{margin-right:0!important;margin-top:8px}
        }
        /* make login card full width on phones, narrower on tablets */
        @media (max-width:600px){
          .login-card{width:100%!important;min-width:0!important}
        }
        @media (min-width:601px) and (max-width:900px){
          .login-card{width:70%!important}
        }
      `}</style>

      <div style={{
        display:"flex", flexDirection:"column", height:"100vh",
        fontFamily:"Arial, sans-serif",
        backgroundImage:"url('/home1.jpg')", backgroundSize:"cover",
        backgroundPosition:"center", backgroundBlendMode:"darken",
        backgroundColor:"rgba(0,0,0,0.6)", color:"white"
      }}>
        {/* Horizontal Navbar */}
        <div className="login-topbar" style={{
          display:"flex", justifyContent:"space-between", alignItems:"center",
          background:"#28a745", padding:"10px 20px", color:"white",
          flexWrap:"wrap", fontSize:"1.2rem"
        }}>
          <div style={{ fontSize:"1.5rem", fontWeight:"bold" }}>Krishi Agro</div>
          <div>
            <button style={{ background:"none", border:"none", color:"white",
                             fontSize:"1rem", cursor:"pointer", marginRight:"10px" }}
                    onClick={()=>navigate("/")}>{t.home}</button>
            <button style={{ background:"none", border:"none", color:"white",
                             fontSize:"1rem", cursor:"pointer" }}
                    onClick={()=>navigate(`/home1/${language}`)}>{t.goBack}</button>
          </div>
        </div>

        <div style={{ display:"flex", flex:1, flexDirection:"row", flexWrap:"wrap" }}>
          {/* Vertical Navbar (empty placeholder kept) */}
          <div style={{
            width:"100%", maxWidth:"120px", background:"#333", color:"white",
            padding:"10px", display:"flex", flexDirection:"column",
            alignItems:"center", fontSize:"0.8rem", minWidth:"60px"
          }}></div>

          {/* Login Form */}
          <div style={{
            flex:1, display:"flex", alignItems:"center", justifyContent:"center",
            padding:"20px", textAlign:"center", flexDirection:"column", fontSize:"1rem"
          }}>
            <div className="login-card" style={{
              background:"white", color:"black", padding:"20px", borderRadius:"10px",
              boxShadow:"0 4px 8px rgba(0,0,0,0.2)", minWidth:"300px", textAlign:"center"
            }}>
              <h2>{t.loginTitle} to KrishiAgro</h2>

              {error && <p style={{ color:"red" }}>{error}</p>}

              <form onSubmit={handleSubmit}>
                <label>{t.email}:</label>
                <input type="email" required value={email}
                       onChange={(e)=>setEmail(e.target.value)}
                       style={{ width:"100%", marginBottom:"10px", padding:"5px" }}/><br/>
                <label>{t.password}:</label>
                <input type="password" required value={password}
                       onChange={(e)=>setPassword(e.target.value)}
                       style={{ width:"100%", marginBottom:"10px", padding:"5px" }}/><br/>
                <button type="submit" disabled={loading} style={{
                  background:"#28a745", color:"white", padding:"5px 10px",
                  borderRadius:"5px", cursor:"pointer", border:"none",
                  width:"100%"
                }}>
                  {loading ? "Loading..." : t.login}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
