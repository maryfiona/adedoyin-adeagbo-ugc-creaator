import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabase";
import { FaStar } from "react-icons/fa";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getTestimonials();

    // Live updates whenever admin adds/edits/deletes
    const channel = supabase
      .channel("testimonials-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "testimonials",
        },
        () => getTestimonials()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function getTestimonials() {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Testimonials Error:", error);
      return;
    }

    setTestimonials(data || []);
  }

  return (
    <section id="testimonials" className="bg-black py-24 px-5 sm:px-8 lg:px-14">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <p className="uppercase tracking-[6px] text-pink-500 text-sm mb-3">
          Testimonials
        </p>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white mb-4">
          Loved by brands.
        </h2>

        <p className="text-gray-400 max-w-xl mb-14 leading-7">
          Real feedback from brands and clients I've worked with.
        </p>

        {/* Empty State */}
        {testimonials.length === 0 && (
          <div className="bg-[#111111] rounded-[28px] border border-pink-500/20 p-10 text-center">
            <p className="text-gray-400">
              No testimonials yet. Add your first testimonial from the Admin Panel.
            </p>
          </div>
        )}

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="bg-[#111111] rounded-[28px] p-7 border border-pink-500/20 hover:border-pink-500/40 transition-all"
            >
              {/* Profile */}
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-pink-500"
                />

                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {item.name}
                  </h3>

                  <p className="text-pink-400 text-sm">
                    {item.brand}
                  </p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: item.rating || 5 }).map((_, index) => (
                  <FaStar
                    key={index}
                    className="text-yellow-400 text-sm"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-gray-300 leading-7 italic">
                "{item.review}"
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}