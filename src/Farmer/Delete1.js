/* ===========================================================
   Delete1.js – Confirm & delete a single product
   • Route : /farmer/delete1/:language/:product_id
   • Receives product in location.state for instant preview;
     otherwise fetches it.
   • Sends POST (x-www-form-urlencoded) to /products/delete
     with  { product_id }  — matches your servlet.
=========================================================== */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../Backend/api";
import qs from "qs";

/* 🌐 Translations */
const t = {
  hindi:   { title:"उत्पाद हटाएं", confirm:"क्या आप वाकई इस उत्पाद को हटाना चाहते हैं?", delete:"हटाएं", cancel:"रद्द करें", goBack:"वापस जाएं" },
  english: { title:"Delete Product", confirm:"Are you sure you want to delete this product?", delete:"Delete", cancel:"Cancel", goBack:"Go Back" },
  punjabi: { title:"ਉਤਪਾਦ ਹਟਾਓ", confirm:"ਕੀ ਤੁਸੀਂ ਇਹ ਉਤਪਾਦ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?", delete:"ਹਟਾਓ", cancel:"ਰੱਦ ਕਰੋ", goBack:"ਵਾਪਸ ਜਾਓ" },
  malayalam:{ title:"ഉൽപ്പന്നം നീക്കം ചെയ്യുക", confirm:"ഈ ഉൽപ്പന്നം നീക്കം ചെയ്യാനുറപ്പാണോ?", delete:"നീക്കം ചെയ്യുക", cancel:"റദ്ദാക്കുക", goBack:"തിരികെ പോകുക" },
  telugu:  { title:"ఉత్పత్తిని తొలగించండి", confirm:"ఈ ఉత్పత్తిని నిజంగా తొలగించాలా?", delete:"తొలగించు", cancel:"రద్దు", goBack:"వెనక్కి వెళ్ళండి" },
  marathi: { title:"उत्पादन हटवा", confirm:"आपण हे उत्पादन हटवू इच्छिता?", delete:"हटवा", cancel:"रद्द करा", goBack:"मागे जा" },
};

/* Helper – choose thumbnail by name */
const getImageForProduct = name =>
  /gehu|wheat/i.test(name) ? "gehu.png" : "default.png";

const Delete1 = () => {
  const { language="english", product_id:id } = useParams();
  const navigate  = useNavigate();
  const location  = useLocation();
  const texts     = t[language] || t.english;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  /* ─── Grab product from state or fetch ─── */
  useEffect(()=>{
    if (location.state?.product) {
      setProduct(location.state.product); setLoading(false); return;
    }
    const fetchProduct = async () => {
      try {
        const res = await API.get("/products/get", { params:{ product_id:id } });
        setProduct(res?.data?.product || res.data);
      } catch (e) {
        console.error("❌ Product fetch error:", e);
        setErr("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, location.state]);

  /* ─── Delete handler ─── */
  const handleDelete = async () => {
    try {
      await API.post(
        "/products/delete",
        qs.stringify({ product_id:id }),
        { headers:{ "Content-Type":"application/x-www-form-urlencoded" } }
      );
      alert("✅ Product deleted");
      navigate(`/farmer/delete/${language}`);
    } catch (e) {
      console.error("❌ Delete failed:", e.response || e);
      alert("Failed to delete product");
    }
  };

  /* ─── Shared styles ─── */
  const navBtn = { background:"none", border:"none", color:"white", fontSize:"0.8rem", cursor:"pointer" };
  const pageBg = { height:"100vh", fontFamily:"Arial, sans-serif",
                   backgroundImage:"url('/home1.jpg')", backgroundSize:"cover",
                   backgroundPosition:"center", color:"white", display:"flex",
                   flexDirection:"column" };

  if (loading)   return <div style={{color:"white",padding:"20px"}}>Loading…</div>;
  if (err)       return <div style={{color:"red",padding:"20px"}}>{err}</div>;
  if (!product)  return <div style={{color:"white",padding:"20px"}}>No product found.</div>;

  return (
    <div style={pageBg}>
      {/* ── Horizontal Navbar ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                    background:"#28a745", padding:"10px 20px", color:"white" }}>
        <div style={{ fontSize:"1.5rem", fontWeight:"bold" }}>Krishi Agro</div>
        <div style={{ fontSize:"1.2rem" }}>{texts.title}</div>
        <button
          style={{ background:"none", border:"none", color:"white", fontSize:"1rem", cursor:"pointer" }}
          onClick={()=>navigate(-1)}
        >
          {texts.goBack}
        </button>
      </div>

      {/* ── Main Layout ── */}
      <div style={{ display:"flex", height:"calc(100vh - 50px)" }}>
        {/* Sidebar */}
        <div style={{ width:"120px", background:"#333", color:"white",
                      padding:"10px", display:"flex", flexDirection:"column",
                      alignItems:"center" }}>
          <div style={{ fontSize:"1.2rem", marginBottom:"10px" }}>👤</div>
         
        </div>

        {/* Centre card */}
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"white", color:"black", padding:"25px 30px",
                        borderRadius:"10px", boxShadow:"0 4px 8px rgba(0,0,0,0.2)",
                        maxWidth:"450px", textAlign:"center" }}>
            <img
              src={`/images/${getImageForProduct(product.name)}`}
              alt={product.name}
              style={{ width:"100%", maxHeight:"200px", objectFit:"cover",
                       borderRadius:"6px", marginBottom:"15px" }}
            />
            <h2 style={{margin:"0 0 10px"}}>{product.name}</h2>
            <p style={{margin:"0 0 20px"}}>{texts.confirm}</p>

            <button
              onClick={handleDelete}
              style={{ background:"#dc3545", color:"white", padding:"8px 20px",
                       border:"none", borderRadius:"4px", fontWeight:"bold",
                       cursor:"pointer", marginRight:"10px" }}
            >
              {texts.delete}
            </button>
            <button
              onClick={()=>navigate(-1)}
              style={{ background:"#6c757d", color:"white", padding:"8px 20px",
                       border:"none", borderRadius:"4px", cursor:"pointer" }}
            >
              {texts.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delete1;
