import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../Backend/api";
import qs from "qs"; // Make sure to install this: npm install qs

const translations = {
  hindi: { title: "उत्पाद जोड़ें", productName: "उत्पाद का नाम", description: "विवरण", city: "शहर", state: "राज्य", quantity_available: "मात्रा उपलब्ध", price: "कीमत", imageUrl: "छवि URL", submit: "जमा करें", goBack: "वापस जाएं" },
  english: { title: "Add Product", productName: "Product Name", description: "Description", city: "City", state: "State", quantity_available: "Quantity Available", price: "Price", imageUrl: "Image URL", submit: "Submit", goBack: "Go Back" },
  punjabi: { title: "ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ", productName: "ਉਤਪਾਦ ਦਾ ਨਾਂ", description: "ਵਰਣਨ", city: "ਸ਼ਹਿਰ", state: "ਰਾਜ", quantity_available: "ਮਾਤਰਾ", price: "ਕੀਮਤ", imageUrl: "ਚਿੱਤਰ URL", submit: "ਜਮ੍ਹਾਂ ਕਰੋ", goBack: "ਵਾਪਸ ਜਾਓ" },
  malayalam: { title: "ഉൽപ്പന്നം ചേർക്കുക", productName: "ഉൽപ്പന്നത്തിന്റെ പേര്", description: "വിവരണം", city: "നഗരം", state: "സംസ്ഥാനം", quantity_available: "അളവ് ലഭ്യമാണ്", price: "വില", imageUrl: "ചിത്ര URL", submit: "സമർപ്പിക്കുക", goBack: "തിരികെ പോകുക" },
  telugu: { title: "ఉత్పత్తి జోడించండి", productName: "ఉత్పత్తి పేరు", description: "వివరణ", city: "నగరం", state: "రాష్ట్రం", quantity_available: "ప్రామాణిక పరిమాణం", price: "ధర", imageUrl: "చిత్ర URL", submit: "సమర్పించండి", goBack: "వెనక్కి వెళ్లండి" },
  marathi: { title: "उत्पादन जोडा", productName: "उत्पादनाचे नाव", description: "वर्णन", city: "शहर", state: "राज्य", quantity_available: "मात्रा उपलब्ध", price: "किंमत", imageUrl: "प्रतिमा URL", submit: "सादर करा", goBack: "मागे जा" },
};

const AddProduct = () => {
  const { language } = useParams();
const navigate = useNavigate();
const texts = translations[language] || translations.english;

const rawFarmerId = localStorage.getItem("userId");
const farmerId = rawFarmerId && !isNaN(rawFarmerId) ? parseInt(rawFarmerId, 10) : null;


// ✅ Then define `formData`
const [formData, setFormData] = useState({
  farmer_id: farmerId, // Correctly initialized
  name: "",
  description: "",
  city: "",
  state: "",
  quantity_available: "",
  price: "",
});

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = `${texts.productName} is required`;
    if (!formData.description) newErrors.description = `${texts.description} is required`;
    if (!formData.city) newErrors.city = `${texts.city} is required`;
    if (!formData.state) newErrors.state = `${texts.state} is required`;
    if (!formData.quantity_available) newErrors.quantity_available = `${texts.quantity_available} is required`;
    if (!formData.price) newErrors.price = `${texts.price} is required`;
     if (!formData.farmer_id || isNaN(formData.farmer_id)) newErrors.farmer_id = `${texts.farmerId} is required or invalid`;  // Add farmer_id validation
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const getImageForProduct = (productName) => {
  const lowerName = productName.toLowerCase();
  if (lowerName.includes("wheat") || lowerName.includes("gehu")) {
    return "gehu.png";
  }
  return "default.png"; // Fallback image
};

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting form...");

  if (validateForm()) {
    console.log("Form validation passed!");

    try {
      const formattedData = {
        ...formData,
        image_url: getImageForProduct(formData.name), // ✅ Auto-assign image
        farmer_id: formData.farmer_id ? parseInt(formData.farmer_id, 10) : "", // ✅ Ensure proper numeric format
        quantity_available: formData.quantity_available ? parseInt(formData.quantity_available.replace(/,/g, ""), 10) : "", 
        price: formData.price ? parseFloat(formData.price.replace(/[^\d.]/g, "")) : "",
      };

      console.log("Final formatted data (before encoding):", formattedData); // Debugging

      const encodedData = qs.stringify(formattedData); // ✅ Convert to URL-encoded format
      console.log("Encoded Data:", encodedData); // ✅ Log encoded request

      const response = await API.post(
        "/products/add",
        encodedData, // ✅ Send URL-encoded data
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } } // ✅ Ensure proper encoding
      );

      console.log("API response:", response); // ✅ Log response
      alert(response.data.message);
      navigate(`/farmer/addproduct/${language}`);
    } catch (error) {
      console.error("API request failed ❌:", error); // ✅ Debug API error
      alert("Failed to add product ❌");
    }
  }
};

  return (
    <div style={{ height: "100vh", fontFamily: "Arial, sans-serif", backgroundImage:`url(${process.env.PUBLIC_URL}/home1.jpg)`, backgroundSize: "cover", backgroundPosition: "center", color: "white" }}>
      
      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#28a745", padding: "10px 20px", color: "white" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Krishi Agro</div>
        <div style={{ fontSize: "1.2rem" }}>{texts.title}</div>
        <button style={{ background: "none", border: "none", color: "white", fontSize: "1rem", cursor: "pointer" }} onClick={() => navigate(`/farmer/successloged/${language}`)}>{texts.goBack}</button>
      </div>

      {/* Main Layout */}
      <div style={{ display: "flex", height: "calc(100vh - 50px)" }}>
        
        {/* Sidebar */}
        <div style={{ width: "120px", background: "#333", color: "white", padding: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: "1.2rem", marginBottom: "10px" }}>👤</div>
          <button style={{ background: "none", border: "none", color: "white", fontSize: "0.8rem", cursor: "pointer" }}>My Profile</button>
        </div>

        {/* Form Section */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <form style={{ background: "white", color: "black", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", minWidth: "400px", maxHeight: "80vh", overflowY: "auto" }} onSubmit={handleSubmit}>
            <h2>{texts.title}</h2>

           {Object.keys(formData).map((key) => (
              key !== "farmer_id" && ( // ✅ Skip farmer_id in the form display
                <div key={key}>
                  <label htmlFor={key}>{key === "name" ? texts.productName : texts[key]}:</label>
                  <input id={key} type="text" name={key} value={formData[key]} onChange={handleChange} style={{ width: "100%", marginBottom: "10px", padding: "5px" }} />
                  {errors[key] && <span style={{ color: "red", fontSize: "12px" }}>{errors[key]}</span>}
                </div>
              )
            ))}

            <button type="submit" style={{ background: "#28a745", color: "white", padding: "10px", borderRadius: "5px", cursor: "pointer", width: "100%" }}>{texts.submit}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;