import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../Backend/api";

const translations = {
  hindi:   { myProfile:"मेरी प्रोफ़ाइल", goBack:"वापस जाएं", name:"नाम",  email:"ईमेल", phone:"फ़ोन नंबर", state:"राज्य", city:"शहर", pin:"पिन कोड", role:"भूमिका", updateProfile:"प्रोफ़ाइल अपडेट", addProduct:"उत्पाद जोड़ें", viewProduct:"उत्पाद देखें", productUpdate:"उत्पाद अपडेट", delete:"हटाएं", request:"अनुरोध" },
  english: { myProfile:"My Profile",    goBack:"Go Back",     name:"Name", email:"Email", phone:"Phone No", state:"State", city:"City", pin:"PIN Code", role:"Role", updateProfile:"Update Profile", addProduct:"Add Product", viewProduct:"View Product", productUpdate:"Product Update", delete:"Delete", request:"Request" },
  punjabi: { myProfile:"ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ", goBack:"ਵਾਪਸ ਜਾਓ",   name:"ਨਾਂ",  email:"ਈਮੇਲ", phone:"ਫ਼ੋਨ ਨੰਬਰ", state:"ਰਾਜ", city:"ਸ਼ਹਿਰ", pin:"ਪਿੰਨ ਕੋਡ", role:"ਭੂਮਿਕਾ", updateProfile:"ਪ੍ਰੋਫਾਈਲ ਅੱਪਡੇਟ", addProduct:"ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ", viewProduct:"ਉਤਪਾਦ ਵੇਖੋ", productUpdate:"ਉਤਪਾਦ ਅੱਪਡੇਟ", delete:"ਹਟਾਓ", request:"ਬੇਨਤੀ" },
  malayalam:{ myProfile:"എന്റെ പ്രൊഫൈൽ", goBack:"പുറത്ത് പോയി", name:"പേര്", email:"ഇമെയിൽ", phone:"ഫോൺ നമ്പർ", state:"സംസ്ഥാനം", city:"പട്ടണം", pin:"പിന് കോഡ്", role:"പങ്ക്", updateProfile:"പ്രൊഫൈൽ അപ്‌ഡേറ്റ്", addProduct:"ഉൽപ്പന്നം ചേർക്കുക", viewProduct:"ഉൽപ്പന്നം കാണുക", productUpdate:"ഉൽപ്പന്നം അപ്‌ഡേറ്റ്", delete:"അഴിച്ചകളയുക", request:"അഭ്യർത്ഥന" },
  telugu:  { myProfile:"నా ప్రొఫైల్",   goBack:"తిరిగి వెళ్ళండి", name:"పేరు", email:"ఇమెయిల్", phone:"ఫోన్ నంబర్", state:"రాజ్యం", city:"పట్టణం", pin:"పిన్ కోడ్", role:"పాత్ర", updateProfile:"ప్రొఫైల్ నవీకరణ", addProduct:"ఉత్పత్తి జోడించండి", viewProduct:"ఉత్పత్తిని చూడండి", productUpdate:"ఉత్పత్తి నవీకరణ", delete:"తొలగించు", request:"అభ్యర్థన" },
  marathi: { myProfile:"माझं प्रोफाइल", goBack:"परत जा",      name:"नाव",  email:"ईमेल", phone:"फोन नंबर", state:"राज्य", city:"शहर", pin:"पिन कोड", role:"भूमिका", updateProfile:"प्रोफाइल अपडेट", addProduct:"उत्पादन जोडा", viewProduct:"उत्पादन पहा", productUpdate:"उत्पादन अपडेट", delete:"हटवा", request:"विनंती" }
};

const FarmerMyprofile = () => {
  const { language } = useParams();
  const navigate = useNavigate();
  const texts = translations[language] || translations.english;

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id:"", name:"", email:"", phone_number:"", state:"", city:"", role:""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return navigate("/login");

      try {
        setLoading(true);
        const res = await API.get("/auth/profile", { params:{ id:userId } });
        if (res.data.success) {
          setFormData({
            id:   res.data.user.id,
            name: res.data.user.name,
            email:res.data.user.email,
            phone_number:res.data.user.phoneNumber,
            state:res.data.user.state || "",
            city: res.data.user.city  || "",
            role: res.data.user.role
          });
        } else {
          alert(res.data.message || "Failed to fetch profile data");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{
      height:"100vh", fontFamily:"Arial, sans-serif",
      backgroundImage:`url(${process.env.PUBLIC_URL}/home1.jpg)`, backgroundSize:"cover",
      backgroundPosition:"center", color:"white"
    }}>
      {/* top nav */}
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        background:"#28a745", padding:"10px 20px"
      }}>
        <div style={{fontSize:"1.5rem", fontWeight:"bold"}}>Krishi Agro</div>
        <div style={{fontSize:"1.2rem"}}>{texts.myProfile}</div>
        <button
          onClick={()=>navigate(`/farmer/successloged/${language}`)}
          style={{
            background:"none", border:"none", color:"white",
            fontSize:"1rem", cursor:"pointer"
          }}
        >
          {texts.goBack}
        </button>
      </div>

      {/* body */}
      <div style={{display:"flex", height:"calc(100vh - 50px)"}}>
        {/* vertical nav */}
        <div style={{
          width:"120px", background:"#333", color:"white", padding:"10px",
          display:"flex", flexDirection:"column", alignItems:"center"
        }}>
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:"10px"}}>
            <div style={{fontSize:"1.2rem", marginBottom:"10px"}}>👤</div>
            <div style={{background:"none", border:"none", color:"white", fontSize:"0.8rem", cursor:"pointer"}}>{texts.myProfile}</div>
            <div style={{background:"none", border:"none", color:"white", fontSize:"0.8rem", cursor:"pointer"}}>{texts.updateProfile}</div>
            <div style={{background:"none", border:"none", color:"white", fontSize:"0.8rem", cursor:"pointer"}}>{texts.addProduct}</div>
            <div style={{background:"none", border:"none", color:"white", fontSize:"0.8rem", cursor:"pointer"}}>{texts.viewProduct}</div>
            <div style={{background:"none", border:"none", color:"white", fontSize:"0.8rem", cursor:"pointer"}}>{texts.productUpdate}</div>
            <div style={{background:"none", border:"none", color:"white", fontSize:"0.8rem", cursor:"pointer"}}>{texts.delete}</div>
            <div style={{background:"none", border:"none", color:"white", fontSize:"0.8rem", cursor:"pointer"}}>{texts.request}</div>
          </div>
        </div>

        {/* profile card */}
        <div style={{flex:1, display:"flex", alignItems:"center", justifyContent:"center"}}>
          <div style={{
            background:"rgba(255,255,255,0.9)", color:"#333",
            padding:"30px", borderRadius:"12px",
            boxShadow:"0 4px 12px rgba(0,0,0,0.3)",
            minWidth:"400px", textAlign:"left"
          }}>
            <h2 style={{textAlign:"center", marginBottom:"20px"}}>
              {texts.myProfile}
            </h2>

            {["name","email","phone_number","state","city","role"].map(field=>(
              <div key={field} style={{
                display:"flex",
                alignItems:"center",
                marginBottom:"10px"
              }}>
                <label style={{width:"120px", fontWeight:"bold"}}>
                  {texts[field==="phone_number" ? "phone" : field]}:
                </label>
                <span style={{flex:1}}>
                  {formData[field] || "N/A"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerMyprofile;
