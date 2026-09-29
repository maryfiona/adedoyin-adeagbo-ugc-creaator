import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabase";

export default function Hero() {
  const [hero, setHero] = useState({
    heading: "Creating content that sells, not just looks pretty.",
    subheading: "UGC CREATOR • BEAUTY • LIFESTYLE",
    description:
      "I help brands turn scroll-stopping ideas into content that actually converts. Short-form video, photography and creative strategy — all in one place.",
    image_url: "/Image/images.jfif",
  });

  useEffect(() => {
    getHero();

    // Realtime updates when Hero is edited
    const channel = supabase
      .channel("hero-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "hero",
        },
        () => {
          getHero();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch the newest hero row
  async function getHero() {
    const { data, error } = await supabase
      .from("hero")
      .select("*")
      .order("created_at", { ascending: false }) // Always get newest
      .limit(1);

    if (error) {
      console.error("Hero Fetch Error:", error);
      return;
    }

    if (data && data.length > 0) {
      const latestHero = data[0];

      setHero({
        heading:
          latestHero.heading ||
          "Creating content that sells, not just looks pretty.",
        subheading: latestHero.subheading || "UGC CREATOR • BEAUTY • LIFESTYLE",
        description:
          latestHero.description ||
          "I help brands turn scroll-stopping ideas into content that actually converts. Short-form video, photography and creative strategy — all in one place.",
        image_url: latestHero.image_url || "/Image/images.jfif",
      });
    }
  }

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section
      id="hero"
      className="bg-black text-white min-h-screen flex items-center py-20 px-5 sm:px-8 lg:px-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <p className="uppercase tracking-[5px] sm:tracking-[8px] text-pink-500 text-xs sm:text-sm mb-4">
            {hero.subheading}
          </p>

          <h1 className="font-serif font-semibold leading-tight mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {hero.heading}
          </h1>

          <p className="text-gray-400 text-base sm:text-lg leading-8 max-w-xl mx-auto lg:mx-0 mb-8">
            {hero.description}
          </p>

          {/* BUTTON */}
          <div className="flex justify-center lg:justify-start">
            <button
              onClick={scrollToContact}
              className="bg-pink-500 hover:bg-pink-400 transition-all duration-300 px-8 py-4 rounded-full font-medium"
            >
              Work With Me
            </button>
          </div>

          {/* MOBILE IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center mt-12 lg:hidden"
          >
            <div className="absolute w-64 h-64 bg-pink-600 rounded-full blur-[100px] opacity-30"></div>

            <img
              src={hero.image_url || "/Image/images.jfif"}
              alt="UGC Creator"
              className="relative w-[260px] sm:w-[320px] rounded-[30px] object-cover border border-pink-500/20 shadow-2xl"
            />
          </motion.div>
        </motion.div>

        {/* DESKTOP IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="hidden lg:flex justify-center relative"
        >
          <div className="absolute w-[420px] h-[420px] bg-pink-600 rounded-full blur-[120px] opacity-30"></div>

          <img
            src={hero.image_url || "/Image/images.jfif"}
            alt="UGC Creator"
            className="relative w-[420px] h-[560px] rounded-[32px] object-cover border border-pink-500/20 shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
