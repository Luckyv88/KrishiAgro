import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../Backend/api";
import qs from "qs";

const translations = {
  hindi:    { myProfile:"मेरी प्रोफ़ाइल", goBack:"वापस जाएं", name:"नाम", email:"ईमेल", phone:"फ़ोन नंबर", state:"राज्य", city:"शहर", pin:"पिन कोड", role:"भूमिका", submit:"सबमिट करें" },
  english:  { myProfile:"My Profile", goBack:"Go Back", name:"Name", email:"Email", phone:"Phone No", state:"State", city:"City", pin:"PIN Code", role:"Role", submit:"Submit" },
  punjabi:  { myProfile:"ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ", goBack:"ਵਾਪਸ ਜਾਓ", name:"ਨਾਂ", email:"ਈਮੇਲ", phone:"ਫ਼ੋਨ ਨੰਬਰ", state:"ਰਾਜ", city:"ਸ਼ਹਿਰ", pin:"ਪਿੰਨ ਕੋਡ", role:"ਭੂਮਿਕਾ", submit:"ਸਬਮਿਟ ਕਰੋ" },
  malayalam:{ myProfile:"എന്റെ പ്രൊഫൈൽ", goBack:"പുറത്ത് പോയി", name:"പേര്", email:"ഇമെയിൽ", phone:"ഫോൺ നമ്പർ", state:"സംസ്ഥാനം", city:"പട്ടണം", pin:"പിന് കോഡ്", role:"പങ്ക്", submit:"സമർപ്പിക്കുക" },
  telugu:   { myProfile:"నా ప్రొఫైల్", goBack:"తిరిగి వెళ్ళండి", name:"పేరు", email:"ఇమెయిల్", phone:"ఫోన్ నంబర్", state:"రాజ్యం", city:"పట్టణం", pin:"పిన్ కోడ్", role:"పాత్ర", submit:"సమర్పించు" },
  marathi:  { myProfile:"माझं प्रोफाइल", goBack:"परत जा", name:"नाव", email:"ईमेल", phone:"फोन नंबर", state:"राज्य", city:"शहर", pin:"पिन कोड", role:"भूमिका", submit:"सबमिट करा" }
};

const FarmerUpdateMyprofile = () => {
  const { language } = useParams();
  const navigate = useNavigate();
  const texts = translations[language] || translations.english;

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: "", name: "", email: "", phone_number: "", state: "", city: "", role: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return navigate("/login");

      try {
        setLoading(true);
        const res = await API.get("/auth/profile", { params: { id: userId } });
        if (res.data.success) {
          setFormData({
            id: res.data.user.id,
            name: res.data.user.name,
            email: res.data.user.email,
            phone_number: res.data.user.phoneNumber,
            state: res.data.user.state || "",
            city: res.data.user.city || "",
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

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { email, phone_number } = formData;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phoneRegex = /^[0-9]{10}$/;
    if (!emailRegex.test(email)) { alert("Invalid email format."); return false; }
    if (!phoneRegex.test(phone_number)) { alert("Invalid phone number. It should contain 10 digits."); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        state: formData.state || "",
        city: formData.city || "",
        role: formData.role,
        language_preference: language || "english"
      };

      const res = await API.put(
        "/auth/profile",
        qs.stringify(payload),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      alert(res.data.message);
      navigate(`/farmer/farmermyprofile/${language}`);
    } catch (err) {
      console.error("Profile update error:", err?.response?.data || err.message);
      alert("Failed to update profile");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{
      height: "100vh",
      fontFamily: "Arial, sans-serif",
       backgroundImage:`url(${process.env.PUBLIC_URL}/home1.jpg)`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "white"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#28a745",
        padding: "10px 20px"
      }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Krishi Agro</div>
        <div style={{ fontSize: "1.2rem" }}>{texts.myProfile}</div>
        <button
          onClick={() => navigate(`/farmer/successloged/${language}`)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "1rem",
            cursor: "pointer"
          }}>
          {texts.goBack}
        </button>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 50px)" }}>
        <div style={{
          width: "120px", background: "#333", color: "white", padding: "10px",
          display: "flex", flexDirection: "column", alignItems: "center"
        }}>
          <div style={{ fontSize: "1.2rem", marginBottom: "10px" }}>👤</div>
          <button style={{
            background: "none", border: "none", color: "white",
            fontSize: "0.8rem", cursor: "pointer"
          }}>
            {texts.myProfile}
          </button>
        </div>

        <div style={{
          flex: 1, display: "flex", alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            background: "rgba(255,255,255,0.9)", color: "#333",
            padding: "30px", borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            minWidth: "400px", textAlign: "left"
          }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
              {texts.myProfile}
            </h2>

            {["name", "email", "phone_number", "state", "city", "role"].map(field => (
              <div key={field} style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px"
              }}>
                <label style={{ width: "120px", fontWeight: "bold" }}>
                  {texts[field === "phone_number" ? "phone" : field]}:
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  style={{
                    flex: 1,
                    padding: "5px",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "4px"
                  }}
                />
              </div>
            ))}

            <button
              onClick={handleSubmit}
              style={{
                marginTop: "20px",
                background: "#007bff",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                width: "100%"
              }}>
              {texts.submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerUpdateMyprofile;
