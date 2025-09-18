import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../Backend/api";
import qs from "qs";

const translations = {
  hindi: { myProfile: "मेरी प्रोफ़ाइल", goBack: "वापस जाएं", name: "नाम", email: "ईमेल", phone: "फ़ोन नंबर", state: "राज्य", city: "शहर", pin: "पिन कोड", role: "भूमिका", update: "अपडेट करें", submit: "सबमिट करें" },
  english: { myProfile: "My Profile", goBack: "Go Back", name: "Name", email: "Email", phone: "Phone No", state: "State", city: "City", pin: "PIN Code", role: "Role", update: "Update", submit: "Submit" },
  punjabi: { myProfile: "ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ", goBack: "ਵਾਪਸ ਜਾਓ", name: "ਨਾਂ", email: "ਈਮੇਲ", phone: "ਫ਼ੋਨ ਨੰਬਰ", state: "ਰਾਜ", city: "ਸ਼ਹਿਰ", pin: "ਪਿੰਨ ਕੋਡ", role: "ਭੂਮਿਕਾ", update: "ਅੱਪਡੇਟ ਕਰੋ", submit: "ਸਬਮਿਟ ਕਰੋ" },
  malayalam: { myProfile: "എന്റെ പ്രൊഫൈൽ", goBack: "പുറത്ത് പോയി", name: "പേര്", email: "ഇമെയിൽ", phone: "ഫോൺ നമ്പർ", state: "സംസ്ഥാനം", city: "പട്ടണം", pin: "പിന് കോഡ്", role: "പങ്ക്", update: "അപ്പ്‌ഡേറ്റ് ചെയ്യുക", submit: "സമർപ്പിക്കുക" },
  telugu: { myProfile: "నా ప్రొఫైల్", goBack: "తిరిగి వెళ్ళండి", name: "పేరు", email: "ఇమెయిల్", phone: "ఫోన్ నంబర్", state: "రాజ్యం", city: "పట్టణం", pin: "పిన్ కోడ్", role: "పాత్ర", update: "నవీకరించు", submit: "సమర్పించు" },
  marathi: { myProfile: "माझं प्रोफाइल", goBack: "परत जा", name: "नाव", email: "ईमेल", phone: "फोन नंबर", state: "राज्य", city: "शहर", pin: "पिन कोड", role: "भूमिका", update: "अद्यतन करा", submit: "सबमिट करा" }
};

const BusinessmanMyprofile = () => {
  const { language } = useParams();
  const navigate = useNavigate();
  const texts = translations[language] || translations.english;

  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone_number: "",
    state: "",
    city: "",
    role: "",
    language_preference: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return navigate("/login");

      try {
        setLoading(true);
        const response = await API.get(`/auth/profile`, { params: { id: userId } });
        if (response.data.success) {
          setFormData({
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            phone_number: response.data.user.phoneNumber,
            role: response.data.user.role,
            state: response.data.user.state || "",
            city: response.data.user.city || "",
          });
        } else {
          alert(response.data.message || "Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { email, phone_number } = formData;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phoneRegex = /^[0-9]{10}$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format.");
      return false;
    }
    if (!phoneRegex.test(phone_number)) {
      alert("Invalid phone number. It should contain 10 digits.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone_number,
        state: formData.state || "",
        city: formData.city || "",
        role: formData.role,
        language_preference: language || "english"
      };

      const response = await API.put(
        "/auth/updateUserProfile",
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      alert(response.data.message);
      setIsEditable(false);
    } catch (error) {
      console.error("Profile update error:", error?.response?.data || error.message);
      alert("Failed to update profile");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* ---------- Responsive tweaks ONLY ---------- */}
      <style>{`
        @media (max-width: 600px){
          .bm-topbar{flex-direction:column;align-items:flex-start;padding:12px}
          .bm-topbar button{margin-top:8px}
          .bm-sidebar{display:none}
          .bm-card{width:100%!important;min-width:0!important;padding:20px!important}
        }
        @media (min-width:601px) and (max-width:900px){
          .bm-card{width:80%!important}
        }
      `}</style>

      <div style={{ height: "100vh", fontFamily: "Arial, sans-serif", backgroundImage:`url(${process.env.PUBLIC_URL}/home1.jpg)`, backgroundSize: "cover", backgroundPosition: "center", color: "white" }}>
        <div className="bm-topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#28a745", padding: "10px 20px", color: "white" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Krishi Agro</div>
          <div style={{ fontSize: "1.2rem" }}>{texts.myProfile}</div>
          <button onClick={() => navigate(`/Businessman/Successlogin/${language}`)} style={{ background: "none", border: "none", color: "white", fontSize: "1rem", cursor: "pointer" }}>
            {texts.goBack}
          </button>
        </div>

        <div style={{ display: "flex", height: "calc(100vh - 50px)" }}>
          <div className="bm-sidebar" style={{ width: "120px", background: "#333", color: "white", padding: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "10px" }}>👤</div>
            <button style={{ background: "none", border: "none", color: "white", fontSize: "0.8rem", cursor: "pointer" }}>{texts.myProfile}</button>
          </div>

          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="bm-card" style={{ background: "rgba(255,255,255,0.9)", color: "#333", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", minWidth: "400px", textAlign: "left" }}>
              <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{texts.myProfile}</h2>

              {["name", "email", "phone_number", "state", "city", "role"].map((field) => (
                <p style={{ margin: "10px 0", fontSize: "16px" }} key={field}>
                  <strong>{texts[field === "phone_number" ? "phone" : field]}:</strong>{" "}
                  {isEditable ? (
                    <input type="text" name={field} value={formData[field] || ''} onChange={handleChange} style={{ marginLeft: "10px", padding: "5px", fontSize: "14px" }} />
                  ) : (
                    <span style={{ marginLeft: "10px" }}>{formData[field] || 'N/A'}</span>
                  )}
                </p>
              ))}

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                {isEditable ? (
                  <button onClick={handleSubmit} style={{ background: "#28a745", color: "white", padding: "8px 20px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                    {texts.submit}
                  </button>
                ) : (
                  <button onClick={() => setIsEditable(true)} style={{ background: "#ffc107", color: "#333", padding: "8px 20px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                    {texts.update}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessmanMyprofile;
