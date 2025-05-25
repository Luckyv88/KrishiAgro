import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Backend/api";

/* -----------------------------------------------------------
🌐 Translations (re-using keys from AddProduct)
----------------------------------------------------------- */
const translations = {
  hindi:   { title:"मेरे उत्पाद", productName:"उत्पाद का नाम", description:"विवरण", city:"शहर", state:"राज्य", quantity_available:"मात्रा उपलब्ध", price:"कीमत", goBack:"वापस जाएं", update:"अपडेट करें" },
  english: { title:"My Products", productName:"Product Name",  description:"Description", city:"City", state:"State", quantity_available:"Quantity Available", price:"Price", goBack:"Go Back", update:"Update" },
  punjabi: { title:"ਮੇਰੇ ਉਤਪਾਦ", productName:"ਉਤਪਾਦ ਦਾ ਨਾਂ", description:"ਵਰਣਨ", city:"ਸ਼ਹਿਰ", state:"ਰਾਜ", quantity_available:"ਮਾਤਰਾ", price:"ਕੀਮਤ", goBack:"ਵਾਪਸ ਜਾਓ", update:"ਅੱਪਡੇਟ ਕਰੋ" },
  malayalam:{ title:"എൻ‍റെ ഉൽപ്പന്നങ്ങൾ", productName:"ഉൽപ്പന്നത്തിന്റെ പേര്", description:"വിവരണം", city:"നഗരം", state:"സംസ്ഥാനം", quantity_available:"അളവ്", price:"വില", goBack:"തിരികെ പോകുക", update:"അപ്‌ഡേറ്റ് ചെയ്യുക" },
  telugu:  { title:"నా ఉత్పత్తులు", productName:"ఉత్పత్తి పేరు", description:"వివరణ", city:"నగరం", state:"రాష్ట్రం", quantity_available:"పరిమాణం", price:"ధర", goBack:"వెనక్కి వెళ్లండి", update:"నవీకరించు" },
  marathi: { title:"माझी उत्पादने", productName:"उत्पादनाचे नाव", description:"वर्णन", city:"शहर", state:"राज्य", quantity_available:"मात्रा उपलब्ध", price:"किंमत", goBack:"मागे जा", update:"अपडेट करा" },
};

/* -----------------------------------------------------------
🔎 Helper
----------------------------------------------------------- */
const pick = (obj, ...keys) => {
  for (const k of keys)
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  return undefined;
};

/* ===========================================================
✅ Component
=========================================================== */
const Update = () => {
  const { language } = useParams();
  const navigate = useNavigate();
  const t = translations[language] || translations.english;

  const farmerId = localStorage.getItem("userId");

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      if (!farmerId) {
        setError("User not logged in.");
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("/products/by-farmer", {
          params: { farmer_id: farmerId },
        });

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];

        setProducts(data);
      } catch (err) {
        console.error("❌ Unable to fetch farmer products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    })();
  }, [farmerId]);

  const navBtn = { background:"none", border:"none", color:"white", fontSize:"0.8rem", cursor:"pointer" };

  /* Responsive inline styles */
  const containerStyle = {
    height:"100vh",
    fontFamily:"Arial, sans-serif",
    backgroundImage:"url('/home1.jpg')",
    backgroundSize:"cover",
    backgroundPosition:"center",
    color:"white",
    display:"flex",
    flexDirection:"column",
  };

  const navbarStyle = {
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    background:"#28a745",
    padding:"10px 20px",
    color:"white",
  };

  const mainLayoutStyle = {
    display:"flex",
    height:"calc(100vh - 50px)",
  };

  const sidebarStyle = {
    width:"120px",
    background:"#333",
    color:"white",
    padding:"10px",
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
  };

  const middleContentStyle = {
    flex: 1,
    overflowY: "auto",
    padding:"20px",
    backgroundImage:"url('/home1.jpg')",
    backgroundSize:"cover",
    backgroundPosition:"center",
    backgroundBlendMode:"darken",
    backgroundColor:"rgba(0,0,0,0.6)",
  };

  /* Product Grid style with media query fallback */
  const productGridStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  };

  /* We will dynamically decide product box width via CSS media queries */
  // Since inline styles can't handle media queries, use a <style> tag approach for responsive product box.

  return (
    <>
      <style>{`
        /* Responsive: On small screens (max-width 600px), show 1 product per row */
        .product-box {
          width: calc(50% - 10px);
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
        }
        @media (max-width: 600px) {
          .product-box {
            width: 100% !important;
          }
        }
      `}</style>

      <div style={containerStyle}>
        {/* Horizontal Navbar */}
        <div style={navbarStyle}>
          <div style={{ fontSize:"1.5rem", fontWeight:"bold" }}>Krishi Agro</div>
          <div style={{ fontSize:"1.2rem" }}>{t.title}</div>
          <button
            style={{ background:"none", border:"none", color:"white", fontSize:"1rem", cursor:"pointer" }}
            onClick={() => navigate(`/farmer/successloged/${language}`)}
          >
            {t.goBack}
          </button>
        </div>

        {/* Main Layout */}
        <div style={mainLayoutStyle}>
          {/* Sidebar */}
          <div style={sidebarStyle}>
            <div style={{ fontSize:"1.2rem", marginBottom:"10px" }}>👤</div>
          </div>

          {/* Middle Content */}
          <div style={middleContentStyle}>
            {loading && <div>Loading products...</div>}
            {error && <div style={{ color:"red" }}>{error}</div>}
            {!loading && products.length === 0 && <div>No products found.</div>}

            {/* Grid */}
            <div style={productGridStyle}>
              {products
                .filter((p)=> p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((p) => {
                  const city   = pick(p,"city");
                  const state  = pick(p,"state");
                  const qty    = pick(p,"quantity_available","quantityAvailable");
                  const price  = pick(p,"price");
                  const desc   = pick(p,"description","desc");

                  return (
                    <div
                      key={p.id}
                      className="product-box"
                    >
                      <div style={{ padding:"15px" }}>
                        <h2 style={{ margin:"0 0 8px 0" }}>{p.name}</h2>
                        <p style={{ margin:"0 0 4px 0" }}><b>City:</b> {city}</p>
                        <p style={{ margin:"0 0 4px 0" }}><b>State:</b> {state}</p>
                        <p style={{ margin:"0 0 4px 0" }}><b>Quantity Available:</b> {qty}</p>
                        <p style={{ margin:"0 0 8px 0" }}><b>Price:</b> ₹{price}</p>
                        <p style={{ margin:0 }}><strong>Description:</strong> {desc?.trim() || "No description."}</p>

                        {/* Update Button */}
                        <button
                          onClick={() => navigate(`/Farmer/Update1/${language}/${p.id}`)}
                          style={{
                            marginTop:"10px",
                            padding:"6px 12px",
                            borderRadius:"4px",
                            border:"none",
                            background:"#ffc107",
                            color:"#000",
                            fontWeight:"bold",
                            cursor:"pointer"
                          }}
                        >
                          {t.update}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Update;
