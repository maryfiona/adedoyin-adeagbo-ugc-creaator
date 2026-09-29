import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase";

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    "All",
    "Brand Collaboration",
    "Beauty",
    "Lifestyle",
    "Tech",
  ];

  useEffect(() => {
    getVideos();

    // Live updates from Supabase
    const channel = supabase
      .channel("videos-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "videos",
        },
        () => getVideos()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch videos
  async function getVideos() {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET VIDEOS ERROR:", error);
      return;
    }

    setVideos(data || []);
  }

  // Filter videos using category from Supabase
  const filteredVideos = useMemo(() => {
    if (activeFilter === "All") return videos;

    return videos.filter((video) => video.category === activeFilter);
  }, [videos, activeFilter]);

  return (
    <section
      id="videos"
      className="bg-black text-white py-24 px-5 sm:px-8 lg:px-14"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <p className="uppercase tracking-[6px] text-pink-500 text-xs mb-3">
          Video Projects
        </p>

        <h2 className="text-4xl sm:text-5xl font-serif mb-5">
          Featured Content
        </h2>

        <p className="text-gray-400 max-w-xl leading-8 mb-10">
          A selection of scroll-stopping content created for beauty, lifestyle,
          tech and brand collaborations.
        </p>

        {/* RESPONSIVE CATEGORY BUTTONS */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 sm:px-6 py-3 rounded-full border transition-all duration-300 font-semibold uppercase tracking-[2px] text-[11px] sm:text-xs lg:text-sm ${
                activeFilter === filter
                  ? "bg-pink-400 text-black border-pink-400 shadow-lg shadow-pink-500/30"
                  : "bg-transparent border-pink-400 text-pink-300 hover:bg-pink-400 hover:text-black"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredVideos.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <div className="bg-[#24244A] p-[4px] rounded-[28px] shadow-xl">
                  <div className="relative bg-[#05061C] rounded-[24px] overflow-hidden aspect-[9/16] flex items-center justify-center">
                    <p className="text-gray-600 text-[10px] uppercase tracking-[2px]">
                      Coming Soon
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-center uppercase text-[11px] tracking-[2px] text-gray-500">
                  Coming Soon
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* VIDEO GRID */
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredVideos.map((item) => (
              <div key={item.id} className="group">
                {/* Phone Frame */}
                <div className="bg-[#24244A] p-[4px] rounded-[28px] shadow-xl transition-all duration-300 group-hover:shadow-pink-500/30 group-hover:scale-[1.02]">
                  <div className="relative bg-[#05061C] rounded-[24px] overflow-hidden aspect-[9/16]">
                    {/* Speaker */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1.5 rounded-full bg-gray-500 z-20"></div>

                    <video
                      src={item.video_url}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Category Badge */}
                <div className="flex justify-center mt-3">
                  <span className="bg-pink-500/20 border border-pink-500/30 text-pink-300 text-[10px] uppercase tracking-[2px] px-3 py-1 rounded-full">
                    {item.category || "Brand Collaboration"}
                  </span>
                </div>

                {/* Video Title */}
                <p className="mt-3 text-center uppercase text-[11px] sm:text-xs font-semibold tracking-[2px] line-clamp-2">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}