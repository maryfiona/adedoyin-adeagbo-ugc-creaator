import { useEffect, useState } from "react";
import { supabase } from "../supabase";

import {
  FaHeart,
  FaRegCommentDots,
  FaPaperPlane,
  FaBookmark,
  FaEye,
  FaArrowUp,
  FaVideo,
  FaCamera,
  FaInstagram,
  FaCalendarAlt,
} from "react-icons/fa";

export default function ResultServices() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    getContent();

    // Realtime update when admin edits
    const channel = supabase
      .channel("result-services-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "result_services",
        },
        () => {
          getContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function getContent() {
    const { data, error } = await supabase
      .from("result_services")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setContent(data);
  }

  const results = [
    {
      icon: <FaHeart />,
      number: content?.likes || "120K",
      label: "LIKES",
    },
    {
      icon: <FaRegCommentDots />,
      number: content?.comments || "8.4K",
      label: "COMMENTS",
    },
    {
      icon: <FaPaperPlane />,
      number: content?.shares || "1.6k",
      label: "Followers",
    },
    {
      icon: <FaBookmark />,
      number: content?.saves || "22K",
      label: "SAVES",
    },
    {
      icon: <FaEye />,
      number: content?.views || "3.1M",
      label: "VIEWS",
    },
    {
      icon: <FaArrowUp />,
      number: content?.growth || "+38%",
      label: "AVG. GROWTH",
    },
  ];

  const services = [
    {
      icon: <FaVideo />,
      title: content?.service1 || "UGC Videos",
      text: "High-converting TikTok, Reels and short-form content for beauty and lifestyle brands.",
    },
    {
      icon: <FaCamera />,
      title: content?.service2 || "Product Photography",
      text: "Luxury product photos, flat lays and aesthetic lifestyle photography for campaigns.",
    },
    {
      icon: <FaInstagram />,
      title: content?.service3 || "Creative Strategy",
      text: "Creative concepts, voiceovers, tutorials, reviews and trending content for social media.",
    },
    {
      icon: <FaCalendarAlt />,
      title: content?.service4 || "Monthly Content Packages",
      text: "Consistent content creation for brands that need weekly or monthly UGC deliverables.",
    },
    {
      icon: <FaVideo />,
      title: content?.service5 || "Voiceover",
      text: "Authentic voiceovers, product demonstrations and storytelling videos for beauty and lifestyle campaigns.",
    },
    {
      icon: <FaCamera />,
      title: content?.service6 || "Brand Content",
      text: "Lifestyle content designed to build trust, increase engagement and convert viewers into customers.",
    },
  ];

  return (
    <section className="bg-[#1D2147] text-white py-20 px-5 sm:px-8 lg:px-14">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <p className="uppercase tracking-[5px] text-pink-400 text-xs sm:text-sm mb-3">
          Results & Services
        </p>

        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#FFD5DD] mb-5">
          Results & Services
        </h2>

        <p className="text-gray-300 text-base sm:text-lg leading-8 max-w-2xl mb-14">
          Numbers from recent campaigns and the ways we can work together.
        </p>

        {/* RESULT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {results.map((item, index) => (
            <div
              key={index}
              className="bg-[#2B2F5D] rounded-[28px] p-5 sm:p-7 border border-[#40446E] hover:border-pink-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,105,180,0.15)]"
            >
              <div className="text-pink-300 text-2xl sm:text-3xl mb-8">
                {item.icon}
              </div>

              <h3 className="font-serif text-3xl sm:text-5xl text-[#FFE7EB] mb-2">
                {item.number}
              </h3>

              <p className="uppercase tracking-[3px] text-xs sm:text-sm text-[#D9D7E8]">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* SERVICES */}
        <div className="mt-20">
          <p className="uppercase tracking-[5px] text-pink-400 text-xs sm:text-sm mb-3">
            Services
          </p>

          <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FFE7EB] mb-10">
            How we can work together
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-[#2B2F5D] rounded-[24px] p-6 border border-[#40446E] hover:border-pink-400 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,105,180,0.15)]"
              >
                <div className="text-pink-300 text-3xl mb-6">
                  {service.icon}
                </div>

                <p className="text-pink-300 uppercase text-xs tracking-[3px] mb-3">
                  0{index + 1}
                </p>

                <h4 className="font-semibold text-lg leading-7 mb-3">
                  {service.title}
                </h4>

                <p className="text-gray-300 text-sm leading-6">
                  {service.text}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}