import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../Backend/api";
import qs from "qs";

/* 🌐 Translations */
const translations = {
  hindi:   { title:"मेरे उत्पाद",        delete:"हटाएं", search:"खोजें...",       goBack:"वापस जाएं" },
  english: { title:"My Products",        delete:"Delete", search:"Search...",     goBack:"Go Back" },
  punjabi: { title:"ਮੇਰੇ ਉਤਪਾਦ",        delete:"ਹਟਾਓ", search:"ਖੋਜ...",          goBack:"ਵਾਪਸ ਜਾਓ" },
  malayalam:{ title:"എൻ‍റെ ഉൽപ്പന്നങ്ങൾ", delete:"നീക്കം ചെയ്യുക", search:"തിരയുക...", goBack:"തിരികെ പോകുക" },
  telugu:  { title:"నా ఉత్పత్తులు",      delete:"తొలగించు", search:"శోధించండి...", goBack:"వెనక్కి వెళ్ళండి" },
  marathi: { title:"माझी उत्पादने",      delete:"हटवा", search:"शोधा...",        goBack:"मागे जा" },
};

/* 🔎 Helper */
const pick = (obj, ...keys) => {
  for (const k of keys)
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  return undefined;
};

const Delete = () => {
  const { language = "english" } = useParams();
  const navigate  = useNavigate();
  const t         = translations[language] || translations.english;
  const farmerId  = localStorage.getItem("userId");

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ─── Fetch farmer products ─── */
  useEffect(() => {
    (async () => {
      if (!farmerId) { setError("User not logged in."); return; }
      try {
        setLoading(true);
        const res  = await api.get("/products/by-farmer", { params:{ farmer_id: farmerId } });
        const data = Array.isArray(res.data) ? res.data : res.data.products || [];
        setProducts(data);
      } catch (err) {
        console.error("❌ Unable to fetch products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    })();
  }, [farmerId]);

  const navBtn = { background:"none", border:"none", color:"white", fontSize:"0.8rem", cursor:"pointer" };

  return (
    <div style={{
      height:"100vh",
      fontFamily:"Arial, sans-serif",
      backgroundImage:"url('/home1.jpg')",
      backgroundSize:"cover",
      backgroundPosition:"center",
      color:"white",
      display:"flex",
      flexDirection:"column",
      overflow: "hidden",
    }}>
      {/* Horizontal Navbar */}
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        background:"#28a745", padding:"10px 20px", color:"white",
        flexShrink: 0,
      }}>
        <div style={{ fontSize:"1.5rem", fontWeight:"bold" }}>Krishi Agro</div>
        <div style={{ fontSize:"1.2rem" }}>{t.title}</div>
        <button
          style={{ background:"none", border:"none", color:"white", fontSize:"1rem", cursor:"pointer" }}
          onClick={()=>navigate(`/farmer/successloged/${language}`)}
        >
          {t.goBack}
        </button>
      </div>

      {/* Main Layout */}
      <div style={{ display:"flex", height:"calc(100vh - 50px)", overflow: "hidden" }}>
        {/* Sidebar */}
        <div
          className="sidebar"
          style={{
            width:"120px",
            background:"#333",
            color:"white",
            padding:"10px",
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
            flexShrink: 0,
            transition: "width 0.3s ease",
          }}
        >
          <div style={{ fontSize:"1.2rem", marginBottom:"10px" }}>👤</div>
        </div>

        {/* Middle Content */}
        <div style={{
          flex:1,
          overflowY:"auto",
          overflowX:"auto",
          padding:"20px",
          backgroundImage:"url('/home1.jpg')",
          backgroundSize:"cover",
          backgroundPosition:"center",
          backgroundBlendMode:"darken",
          backgroundColor:"rgba(0,0,0,0.6)",
          minWidth: 0,
          minHeight: 0,
        }}>
          {loading && <div>Loading products...</div>}
          {error && <div style={{ color:"red" }}>{error}</div>}
          {!loading && products.length === 0 && <div>No products found.</div>}

          {/* Grid */}
          <div
            style={{
              display:"flex",
              flexWrap:"wrap",
              gap:"20px",
              justifyContent:"center",
            }}
            className="product-grid"
          >
            {products.map(p => {
              const city  = pick(p,"city");
              const state = pick(p,"state");
              const qty   = pick(p,"quantity_available","quantityAvailable");
              const price = pick(p,"price");
              const desc  = pick(p,"description","desc");
              return (
                <div key={p.id} style={{
                  width:"calc(50% - 10px)",
                  background:"rgba(255,255,255,0.1)",
                  borderRadius:"8px",
                  overflow:"hidden",
                  boxShadow:"0 0 10px rgba(0,0,0,0.5)",
                  display:"flex",
                  flexDirection:"column",
                  minWidth: 250,
                }}>
                  <div style={{ padding:"15px" }}>
                    <h2 style={{ margin:"0 0 8px" }}>{p.name}</h2>
                    <p style={{ margin:"0 0 4px" }}><b>City:</b> {city}</p>
                    <p style={{ margin:"0 0 4px" }}><b>State:</b> {state}</p>
                    <p style={{ margin:"0 0 4px" }}><b>Quantity Available:</b> {qty}</p>
                    <p style={{ margin:"0 0 8px" }}><b>Price:</b> ₹{price}</p>
                    <p style={{ margin:0 }}><strong>Description:</strong> {desc?.trim() || "No description."}</p>

                    {/* Delete button */}
                    <button
                      onClick={() =>
                        navigate(`/farmer/delete1/${language}/${p.id}`, { state:{ product:p } })
                      }
                      style={{
                        marginTop:"10px", padding:"6px 12px",
                        borderRadius:"4px", border:"none",
                        background:"#dc3545", color:"#fff",
                        fontWeight:"bold", cursor:"pointer",
                      }}
                    >
                      {t.delete}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Inline CSS for responsive behavior */}
      <style>{`
        /* On screens <= 600px, show only 1 product per row */
        @media (max-width: 600px) {
          .product-grid > div {
            width: 100% !important;
          }
          .sidebar {
            width: 50px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Delete;
