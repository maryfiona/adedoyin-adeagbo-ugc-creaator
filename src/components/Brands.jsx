import { useEffect, useState } from "react";

export default function Brands() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    loadBrands();

    // Update immediately when admin saves a brand
    window.addEventListener("storage", loadBrands);

    return () => window.removeEventListener("storage", loadBrands);
  }, []);

  function loadBrands() {
    const saved = JSON.parse(localStorage.getItem("brands")) || [];
    setBrands(saved);
  }

  return (
    <section
      id="brands"
      className="scroll-mt-28 bg-[#080808] py-24 px-5 sm:px-8 lg:px-12 text-white"
    >
      {/* Heading */}
      <p className="uppercase tracking-[6px] text-pink-500 text-xs mb-3">
        Trusted By
      </p>

      <h2 className="text-4xl sm:text-5xl font-serif mb-14">
        Brands I've Worked With
      </h2>

      {brands.length === 0 ? (
        <p className="text-gray-500">No brands added yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-10 justify-items-center">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group"
            >
              {/* Logo Circle */}
              <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden border border-pink-500/20 bg-[#111] p-1 transition duration-300 group-hover:border-pink-400 group-hover:scale-105">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Brand Name BELOW the logo */}
              <h3 className="mt-5 font-serif text-lg sm:text-xl text-pink-200 tracking-wide capitalize">
                {brand.name}
              </h3>

              {/* Small luxury line */}
              <div className="w-10 h-[1px] bg-pink-500/40 mt-2 group-hover:w-16 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}