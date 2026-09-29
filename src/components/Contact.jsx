import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import {
  FaInstagram,
  FaTiktok,
  FaEnvelope,
  FaWhatsapp,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Contact() {
  const [contact, setContact] = useState({
    email: "",
    phone: "",
    whatsapp: "",
    instagram: "",
    tiktok: "",
    location: "",
  });

  useEffect(() => {
    fetchContact();

    // Live updates from admin
    const channel = supabase
      .channel("contact-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "contact",
        },
        () => fetchContact()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchContact() {
    const { data, error } = await supabase
      .from("contact")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error(error);
      return;
    }

    if (data.length > 0) {
      setContact(data[0]);
    }
  }

  return (
    <section
      id="contact"
      className="py-24 px-5 sm:px-8 lg:px-14 bg-gradient-to-b from-[#090909] to-black text-white"
    >
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <p className="uppercase tracking-[6px] text-pink-500 text-sm mb-4">
          Contact
        </p>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif mb-6">
          Let's create together.
        </h2>

        <p className="text-gray-400 mb-12 max-w-xl leading-8">
          Ready to work together? Reach me through any of the channels below.
        </p>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* Contact Info */}
          <div className="bg-[#111111] rounded-[30px] border border-pink-500/20 p-8 space-y-6">

            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-4 hover:text-pink-400 transition"
            >
              <FaEnvelope className="text-pink-500 text-xl" />
              {contact.email || "No email added "}
            </a>

            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-4 hover:text-pink-400 transition"
            >
              <FaPhoneAlt className="text-pink-500 text-xl" />
              {contact.phone || "No phone added"}
            </a>

            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 hover:text-pink-400 transition"
            >
              <FaWhatsapp className="text-pink-500 text-xl" />
              {contact.whatsapp || "No WhatsApp added"}
            </a>

            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-pink-500 text-xl" />
              {contact.location || "Location not added"}
            </div>

          </div>

          {/* Socials */}
          <div className="bg-[#111111] rounded-[30px] border border-pink-500/20 p-8 flex flex-col justify-between">

            <div>
              <h3 className="text-2xl font-serif mb-8">
                Follow me
              </h3>

              <div className="space-y-6">

                <a
                  href={`https://www.instagram.com${contact.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 hover:text-pink-400 transition"
                >
                  <FaInstagram className="text-pink-500 text-2xl" />
                  @{contact.instagram || "instagram"}
                </a>

                <a
                  href={`https://www.tiktok.com${contact.tiktok}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 hover:text-pink-400 transition"
                >
                  <FaTiktok className="text-pink-500 text-2xl" />
                  @{contact.tiktok || "tiktok"}
                </a>

              </div>
            </div>

            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-10 bg-pink-500 hover:bg-pink-400 transition py-4 rounded-full text-center font-semibold"
            >
              Book a Collaboration
            </a>

          </div>

        </div>

        {/* Copyright Footer */}
        <div className="mt-20 pt-8 border-t border-pink-500/20 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Adedoyin. All rights reserved.
          </p>

          <p className="text-pink-400 text-sm mt-2">
            Designed & Developed by{" "}
            <span className="font-semibold">FiocodeTech</span>
          </p>
        </div>

      </div>
    </section>
  );
}