import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../Backend/api";
import qs from "qs";   // npm install qs

/* -----------------------------------------------------------
   🌐 Translations (unchanged)
----------------------------------------------------------- */
const translations = {
  hindi: {
    title: "पंजीकरण",
    name: "नाम",
    email: "ईमेल",
    password: "पासवर्ड",
    phone: "फ़ोन नंबर",
    state: "राज्य",
    city: "शहर",
    submit: "सबमिट करें",
    goBack: "वापस जाएं",
    myProfile: "मेरी प्रोफ़ाइल",
    role: "भूमिका",
    farmer: "किसान के रूप में",
    businessman: "व्यवसायी के रूप में"
  },
  english: {
    title: "Registration",
    name: "Name",
    email: "Email",
    password: "Password",
    phone: "Phone No",
    state: "State",
    city: "City",
    submit: "Submit",
    goBack: "Go Back",
    myProfile: "My Profile",
    role: "Role",
    farmer: "As a Farmer",
    businessman: "As a Businessman"
  },
  punjabi: {
    title: "ਰਜਿਸਟਰੇਸ਼ਨ",
    name: "ਨਾਂ",
    email: "ਈਮੇਲ",
    password: "ਪਾਸਵਰਡ",
    phone: "ਫ਼ੋਨ ਨੰਬਰ",
    state: "ਰਾਜ",
    city: "ਸ਼ਹਿਰ",
    submit: "ਸਬਮਿਟ ਕਰੋ",
    goBack: "ਵਾਪਸ ਜਾਓ",
    myProfile: "ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ",
    role: "ਭੂਮਿਕਾ",
    farmer: "ਕਿਸਾਨ ਵਜੋਂ",
    businessman: "ਕਾਰੋਬਾਰੀ ਵਜੋਂ"
  },
};

const states = [
  "Madhya Pradesh", "Maharashtra", "Uttar Pradesh", "Rajasthan", "Gujarat",
  "Punjab", "Kerala", "Tamil Nadu", "Karnataka", "Bihar", "Assam"
];
const cities = {
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
  "Punjab": ["Amritsar", "Ludhiana", "Patiala"],
  "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode"],
  "Tamil Nadu": ["Chennai", "Madurai", "Coimbatore"],
  "Karnataka": ["Bangalore", "Mysore", "Mangalore"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh"],
};

const Registration = () => {
  const { language } = useParams();
  const navigate     = useNavigate();
  const texts        = translations[language] || translations.english;

  const [formData,setFormData] = useState({
    name:"", email:"", password:"", role:"",
    phone_number:"", state:"", city:""
  });
  const [errors,setErrors] = useState({});

  const handleChange = (e)=>{
    const { name,value } = e.target;
    if(name==="state") setFormData({ ...formData, state:value, city:"" });
    else               setFormData({ ...formData, [name]:value });
  };

  const validateEmail = (v)=>/\S+@\S+\.\S+/.test(v);
  const validatePhone = (v)=>/^[0-9]{10}$/.test(v);

  const validateForm = ()=>{
    let e={};
    if(!formData.name) e.name = `${texts.name} is required`;
    if(!formData.email || !validateEmail(formData.email)) e.email = `${texts.email} is invalid`;
    if(!formData.password) e.password = `${texts.password} is required`;
    if(!formData.role) e.role = `${texts.role} is required`;
    if(!formData.phone_number || !validatePhone(formData.phone_number)) e.phone_number = `${texts.phone} must be 10 digits`;
    if(!formData.state) e.state = `${texts.state} is required`;
    if(!formData.city)  e.city  = `${texts.city} is required`;
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!validateForm()) return;
    try{
      const res = await API.post("/auth/signup", qs.stringify(formData),
        { headers:{ "Content-Type":"application/x-www-form-urlencoded" }});
      alert(res.data.message);
      if(formData.role==="farmer")       navigate("/");
      else if(formData.role==="businessman") navigate("/");
    }catch(err){
      console.error("Signup Error:",err);
      alert("Signup Failed ❌");
    }
  };

  /* -----------------------------------------------------------
     RENDER  (responsive tweaks only, logic untouched)
  ----------------------------------------------------------- */
  return (
    <>
      {/* --- responsive CSS overrides --- */}
      <style>{`
        @media (max-width:600px){
          .reg-topbar{flex-direction:column;align-items:flex-start}
          .reg-topbar button{margin-top:8px}
          .reg-form-card{width:100%!important;min-width:0!important;padding:15px!important}
        }
        @media (min-width:601px) and (max-width:900px){
          .reg-form-card{width:70%!important}
        }
      `}</style>

      <div style={{
        height:"100vh", fontFamily:"Arial, sans-serif",
        backgroundImage:`url(${process.env.PUBLIC_URL}/home1.jpg)`, backgroundSize:"cover",
        backgroundPosition:"center", color:"white"
      }}>
        {/* ---------- Top Bar ---------- */}
        <div className="reg-topbar" style={{
          display:"flex", justifyContent:"space-between", alignItems:"center",
          background:"#28a745", padding:"10px 20px", color:"white"
        }}>
          <div style={{ fontSize:"1.5rem", fontWeight:"bold" }}>Krishi Agro</div>
          <div style={{ fontSize:"1.2rem" }}>{texts.title}</div>
          <button style={{ background:"none", border:"none", color:"white",
                           fontSize:"1rem", cursor:"pointer" }}
                  onClick={()=>navigate(`/home1/${language}`)}>
            {texts.goBack}
          </button>
        </div>

        <div style={{ display:"flex", height:"calc(100vh - 50px)" }}>
          {/* Sidebar placeholder (unchanged) */}
          <div style={{
            width:"120px", background:"#333", color:"white", padding:"10px",
            display:"flex", flexDirection:"column", alignItems:"center"
          }}>
            <div style={{ fontSize:"1.2rem", marginBottom:"10px" }}>👤</div>
            <button style={{
              background:"none", border:"none", color:"white",
              fontSize:"0.8rem", cursor:"pointer"
            }}>
              {texts.myProfile}
            </button>
          </div>

          {/* ---------------- Form ---------------- */}
          <div style={{
            flex:1, display:"flex", alignItems:"center", justifyContent:"center"
          }}>
            <form className="reg-form-card" onSubmit={handleSubmit} style={{
              background:"white", color:"black", padding:"20px", borderRadius:"10px",
              boxShadow:"0 4px 8px rgba(0,0,0,0.2)", minWidth:"400px",
              maxHeight:"80vh", overflowY:"auto"
            }}>
              <h2>{texts.title}</h2>

              {/* Name */}
              <div>
                <label>{texts.name}:</label>
                <input name="name" value={formData.name} onChange={handleChange}
                       style={{ width:"100%", marginBottom:"10px", padding:"5px" }}/>
                {errors.name && <span style={{ color:"red", fontSize:"12px" }}>{errors.name}</span>}
              </div>

              {/* Email */}
              <div>
                <label>{texts.email}:</label>
                <input name="email" value={formData.email} onChange={handleChange}
                       style={{ width:"100%", marginBottom:"10px", padding:"5px" }}/>
                {errors.email && <span style={{ color:"red", fontSize:"12px" }}>{errors.email}</span>}
              </div>

              {/* Password */}
              <div>
                <label>{texts.password}:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange}
                       style={{ width:"100%", marginBottom:"10px", padding:"5px" }}/>
                {errors.password && <span style={{ color:"red", fontSize:"12px" }}>{errors.password}</span>}
              </div>

              {/* Role */}
              <div>
                <label>{texts.role}:</label>
                <select name="role" value={formData.role} onChange={handleChange}
                        style={{ width:"100%", marginBottom:"10px", padding:"5px" }}>
                  <option value="">{`Select ${texts.role}`}</option>
                  <option value="farmer">{texts.farmer}</option>
                  <option value="businessman">{texts.businessman}</option>
                </select>
                {errors.role && <span style={{ color:"red", fontSize:"12px" }}>{errors.role}</span>}
              </div>

              {/* Phone */}
              <div>
                <label>{texts.phone}:</label>
                <input name="phone_number" value={formData.phone_number} onChange={handleChange}
                       style={{ width:"100%", marginBottom:"10px", padding:"5px" }}/>
                {errors.phone_number && <span style={{ color:"red", fontSize:"12px" }}>{errors.phone_number}</span>}
              </div>

              {/* State */}
              <div>
                <label>{texts.state}:</label>
                <select name="state" value={formData.state} onChange={handleChange}
                        style={{ width:"100%", marginBottom:"10px", padding:"5px" }}>
                  <option value="">{`Select ${texts.state}`}</option>
                  {states.map(s=><option key={s}>{s}</option>)}
                </select>
                {errors.state && <span style={{ color:"red", fontSize:"12px" }}>{errors.state}</span>}
              </div>

              {/* City */}
              <div>
                <label>{texts.city}:</label>
                <select name="city" value={formData.city} onChange={handleChange}
                        style={{ width:"100%", marginBottom:"10px", padding:"5px" }}>
                  <option value="">{`Select ${texts.city}`}</option>
                  {(cities[formData.state] || []).map(c=><option key={c}>{c}</option>)}
                </select>
                {errors.city && <span style={{ color:"red", fontSize:"12px" }}>{errors.city}</span>}
              </div>

              <button type="submit" style={{
                background:"#28a745", color:"white", padding:"10px",
                borderRadius:"5px", cursor:"pointer", width:"100%"
              }}>
                {texts.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
