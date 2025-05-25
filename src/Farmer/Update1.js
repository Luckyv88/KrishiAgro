import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../Backend/api";
import qs from "qs";

const translations = {
  hindi:   { title:"उत्पाद अपडेट करें", productName:"उत्पाद का नाम", description:"विवरण", city:"शहर", state:"राज्य", quantity_available:"मात्रा उपलब्ध", price:"कीमत", submit:"अपडेट", goBack:"वापस जाएं" },
  english: { title:"Update Product",  productName:"Product Name", description:"Description", city:"City", state:"State", quantity_available:"Quantity Available", price:"Price", submit:"Update", goBack:"Go Back" },
  punjabi: { title:"ਉਤਪਾਦ ਅੱਪਡੇਟ ਕਰੋ", productName:"ਉਤਪਾਦ ਦਾ ਨਾਂ", description:"ਵਰਣਨ", city:"ਸ਼ਹਿਰ", state:"ਰਾਜ", quantity_available:"ਮਾਤਰਾ", price:"ਕੀਮਤ", submit:"ਅੱਪਡੇਟ ਕਰੋ", goBack:"ਵਾਪਸ ਜਾਓ" },
  malayalam:{ title:"ഉൽപ്പന്നം അപ്‌ഡേറ്റ് ചെയ്യുക", productName:"ഉൽപ്പന്നത്തിന്റെ പേര്", description:"വിവരണം", city:"നഗരം", state:"സംസ്ഥാനം", quantity_available:"അളവ്", price:"വില", submit:"അപ്‌ഡേറ്റ് ചെയ്യുക", goBack:"തിരികെ പോകുക" },
  telugu:  { title:"ఉత్పత్తి నవీకరించండి", productName:"ఉత్పత్తి పేరు", description:"వివరణ", city:"నగరం", state:"రాష్ట్రం", quantity_available:"పరిమాణం", price:"ధర", submit:"నవీకరించు", goBack:"వెనక్కి వెళ్లండి" },
  marathi: { title:"उत्पादन अपडेट करा", productName:"उत्पादनाचे नाव", description:"वर्णन", city:"शहर", state:"राज्य", quantity_available:"मात्रा उपलब्ध", price:"किंमत", submit:"अपडेट करा", goBack:"मागे जा" },
};

/* ------------------------------------- */
/* 🔎 Helpers (same as AddProduct)       */
/* ------------------------------------- */
const getImageForProduct = (productName) => {
  const lower = productName.toLowerCase();
  if (lower.includes("wheat") || lower.includes("gehu")) return "gehu.png";
  return "default.png";
};

const Update1 = () => {
  const { language = "english", id } = useParams();   // id === product_id
  const navigate   = useNavigate();
  const location   = useLocation();
  const texts      = translations[language] || translations.english;

  const rawFarmerId = localStorage.getItem("userId");
  const farmer_id   = rawFarmerId && !isNaN(rawFarmerId) ? parseInt(rawFarmerId,10) : null;
  const product_id  = id;

  const [loading,  setLoading]  = useState(true);
  const [errors,   setErrors]   = useState({});
  const [formData, setFormData] = useState({
    farmer_id, product_id,
    name:"", description:"", city:"", state:"", quantity_available:"", price:""
  });

  /* Responsive state to handle window width */
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Update windowWidth on resize
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (location.state?.product) {
      const p = location.state.product;
      setFormData(f => ({
        ...f,
        ...p,
        quantity_available: p.quantity_available ?? p.quantityAvailable ?? "",
      }));
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      if (!product_id) {
        alert("No product ID provided."); setLoading(false); return;
      }
      try {
        setLoading(true);
        const res = await API.get("/products/get", { params: { product_id } });
        const p   = res.data.product || res.data;
        setFormData(f => ({
          ...f,
          ...p,
          quantity_available: p.quantity_available ?? p.quantityAvailable ?? "",
        }));
      } catch (err) {
        console.error("❌ Cannot load product", err);
        alert("Failed to load product.");
        navigate(`/farmer/viewproduct/${language}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [product_id, location.state, language, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const err = {};
    if (!formData.name)                 err.name  = `${texts.productName} is required`;
    if (!formData.description)          err.description = `${texts.description} is required`;
    if (!formData.city)                 err.city  = `${texts.city} is required`;
    if (!formData.state)                err.state = `${texts.state} is required`;
    if (!formData.quantity_available)   err.quantity_available = `${texts.quantity_available} is required`;
    if (!formData.price)                err.price = `${texts.price} is required`;
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const getImageForProduct = name =>
    /gehu|wheat/i.test(name) ? "gehu.png" : "default.png";

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        image_url: getImageForProduct(formData.name),
        quantity_available: parseInt(String(formData.quantity_available).replace(/,/g,""),10),
        price: parseFloat(String(formData.price).replace(/[^\d.]/g,"")),
      };

      await API.post(
        "/products/update",
        qs.stringify(payload),
        { headers:{ "Content-Type":"application/x-www-form-urlencoded" } }
      );

      alert("Product updated ✅");
      navigate(`/farmer/viewproduct/${language}`);
    } catch (err) {
      console.error("❌ Update failed", err.response || err.message || err);
      alert("Failed to update product");
    }
  };

  if (loading) return <div style={{color:"white",padding:"20px"}}>Loading...</div>;

  /* Responsive styles */
  // If window width less than 600px, stack sidebar & form vertically, else horizontal
  const isMobile = windowWidth < 600;

  return (
    <div style={{ 
      height:"100vh", 
      fontFamily:"Arial, sans-serif", 
      backgroundImage:"url('/home1.jpg')", 
      backgroundSize:"cover", 
      backgroundPosition:"center", 
      color:"white",
      overflowX: "hidden"
    }}>
      {/* -------- Navbar -------- */}
      <div style={{ 
        display:"flex", 
        justifyContent:"space-between", 
        alignItems:"center", 
        background:"#28a745", 
        padding:"10px 20px", 
        color:"white" 
      }}>
        <div style={{ fontSize:"1.5rem", fontWeight:"bold" }}>Krishi Agro</div>
        <div style={{ fontSize:"1.2rem" }}>{texts.title}</div>
        <button
          style={{ background:"none", border:"none", color:"white", fontSize:"1rem", cursor:"pointer" }}
          onClick={() => navigate(-1)}
        >
          {texts.goBack}
        </button>
      </div>

      {/* -------- Main Layout -------- */}
      <div 
        style={{ 
          display:"flex", 
          flexDirection: isMobile ? "column" : "row",
          height:"calc(100vh - 50px)",
          overflowY: "auto",
          padding: isMobile ? "10px" : "0",
          boxSizing: "border-box",
        }}
      >
        {/* Sidebar (unchanged, but horizontal width 100% on mobile) */}
        <div style={{ 
          width: isMobile ? "100%" : "120px", 
          background:"#333", 
          color:"white", 
          padding:"10px", 
          display:"flex", 
          flexDirection:"column", 
          alignItems:"center",
          boxSizing: "border-box",
          marginBottom: isMobile ? "10px" : 0,
          flexShrink: 0
        }}>
          <div style={{ fontSize:"1.2rem", marginBottom:"10px" }}>👤</div>
          {/* Other sidebar content can go here */}
        </div>

        {/* Form container */}
        <div style={{ 
          flex: 1, 
          display:"flex", 
          alignItems:"center", 
          justifyContent:"center",
          width: isMobile ? "100%" : "auto",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}>
          <form
            onSubmit={handleSubmit}
            style={{ 
              background:"white", 
              color:"black", 
              padding:"20px", 
              borderRadius:"10px", 
              boxShadow:"0 4px 8px rgba(0,0,0,0.2)", 
              minWidth:"280px",  // smaller min-width for mobile
              maxWidth: "450px",
              width: "100%",
              maxHeight:"80vh", 
              overflowY:"auto",
              boxSizing: "border-box",
            }}
          >
            <h2>{texts.title}</h2>

            {["name","description","city","state","quantity_available","price"].map((key)=>(
              <div key={key} style={{ marginBottom: "15px" }}>
                <label htmlFor={key} style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  { key==="name" ? texts.productName : texts[key] }:
                </label>
                <input
                  id={key}
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  style={{ 
                    width:"100%", 
                    padding:"8px", 
                    fontSize:"1rem", 
                    borderRadius:"4px", 
                    border: errors[key] ? "1px solid red" : "1px solid #ccc" 
                  }}
                />
                {errors[key] && <span style={{ color:"red", fontSize:"12px" }}>{errors[key]}</span>}
              </div>
            ))}

            <button 
              type="submit" 
              style={{ 
                background:"#28a745", 
                color:"white", 
                padding:"10px", 
                borderRadius:"5px", 
                cursor:"pointer", 
                width:"100%", 
                fontSize: "1.1rem",
                fontWeight: "bold"
              }}
            >
              {texts.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Update1;
