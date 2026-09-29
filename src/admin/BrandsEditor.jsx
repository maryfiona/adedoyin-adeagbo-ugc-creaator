import { useState, useEffect } from "react";
import BackButton from "../admin/BackButton";
import Dialog from "../components/Dialog";

export default function BrandsEditor() {
  const [brands, setBrands] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState("");

  // Dialog state
  const [dialog, setDialog] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  // Luxury dialog helper
  function showDialog(type, title, message, autoClose = false) {
    setDialog({
      open: true,
      type,
      title,
      message,
    });

    if (autoClose) {
      setTimeout(() => {
        setDialog((prev) => ({ ...prev, open: false }));
      }, 2500);
    }
  }

  // Load brands
  useEffect(() => {
    const savedBrands = JSON.parse(localStorage.getItem("brands")) || [];
    setBrands(savedBrands);
  }, []);

  // Upload logo
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setBrandLogo(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // Save Brand
  const saveBrand = () => {
    if (!brandName.trim() || !brandLogo) {
      showDialog(
        "warning",
        "Missing Information",
        "Please upload a logo and enter a brand name."
      );
      return;
    }

    const updated = [
      ...brands,
      {
        name: brandName.trim(), // Keep proper capitalization
        logo: brandLogo,
      },
    ];

    setBrands(updated);
    localStorage.setItem("brands", JSON.stringify(updated));

    // Clear form
    setBrandName("");
    setBrandLogo("");

    // Clear chosen file
    const uploadInput = document.getElementById("brandUpload");
    if (uploadInput) uploadInput.value = "";

    showDialog(
      "success",
      "Brand Saved 🎉",
      "Your brand has been added successfully.",
      true
    );
  };

  // Delete Brand
  const deleteBrand = (index) => {
    const updated = brands.filter((_, i) => i !== index);

    setBrands(updated);
    localStorage.setItem("brands", JSON.stringify(updated));

    showDialog(
      "success",
      "Brand Deleted 🗑️",
      "The brand has been removed successfully.",
      true
    );
  };

  return (
    <>
      {/* Luxury Dialog */}
      <Dialog
        open={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog({ ...dialog, open: false })}
      />

      <div className="min-h-screen bg-black text-white py-12 px-5">
        <BackButton />

        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-[5px] text-pink-500 text-xs mb-2">
            Admin Panel
          </p>

          <h1 className="text-4xl font-serif mb-8">
            Brands Editor
          </h1>

          {/* Upload Card */}
          <div className="bg-[#111] rounded-[30px] border border-pink-500/20 p-6 space-y-5">

            {/* Brand Name */}
            <div>
              <label className="block text-pink-300 text-sm uppercase tracking-[2px] mb-2">
                Brand Name
              </label>

              <input
                type="text"
                placeholder="e.g. Rare Beauty"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-[#1d1d1d] rounded-xl p-4 text-white outline-none border border-transparent focus:border-pink-500"
              />
            </div>

            {/* Upload Button */}
            <label className="flex items-center justify-center bg-pink-500 hover:bg-pink-400 transition rounded-full py-3 cursor-pointer font-semibold">
              Upload Brand Logo

              <input
                id="brandUpload"
                hidden
                type="file"
                accept="image/*"
                onChange={handleUpload}
              />
            </label>

            {/* Luxury Preview */}
            {brandLogo && (
              <div className="flex flex-col items-center pt-4">
                <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-pink-500 bg-[#1a1a1a] p-1">
                  <img
                    src={brandLogo}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Brand name BELOW logo */}
                <h2 className="mt-5 text-xl font-serif text-pink-200 tracking-wide capitalize text-center">
                  {brandName || "Brand Name"}
                </h2>

                <div className="w-12 h-[2px] bg-pink-500/50 rounded-full mt-2"></div>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={saveBrand}
              className="w-full bg-pink-500 hover:bg-pink-400 py-4 rounded-full font-semibold transition"
            >
              Save Brand
            </button>
          </div>

          {/* Saved Brands */}
          <div className="mt-14">
            <h2 className="text-3xl font-serif mb-8">
              Saved Brands
            </h2>

            {brands.length === 0 ? (
              <div className="bg-[#111] rounded-[30px] border border-pink-500/10 py-12 text-center text-gray-500">
                No brands added yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                {brands.map((brand, index) => (
                  <div key={index} className="flex flex-col items-center text-center group">

                    {/* Logo */}
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-pink-500/20 bg-[#1a1a1a] p-1 transition duration-300 group-hover:border-pink-400 group-hover:scale-105">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    {/* Brand Name */}
                    <h3 className="mt-4 text-lg font-serif text-pink-200 capitalize">
                      {brand.name}
                    </h3>

                    <div className="w-8 h-[1px] bg-pink-500/40 mt-2 group-hover:w-12 transition-all duration-300"></div>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteBrand(index)}
                      className="mt-4 text-red-400 hover:text-red-300 text-sm transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}