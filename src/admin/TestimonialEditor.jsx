import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import BackButton from "./BackButton";
import Dialog from "../components/Dialog";
import { FaUpload, FaTrash, FaSave, FaEdit, FaStar } from "react-icons/fa";

export default function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    review: "",
    rating: 5,
    image_url: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Luxury Dialog State
  const [dialog, setDialog] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

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

  // Load testimonials
  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setTestimonials(data || []);
  }

  // Input change
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "rating" ? Number(e.target.value) : e.target.value,
    });
  }

  // Image Preview
  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  // Save / Update Testimonial
  async function saveTestimonial() {
    if (!form.name.trim() || !form.review.trim()) {
      showDialog(
        "warning",
        "Missing Information",
        "Please enter the customer's name and review.",
      );
      return;
    }

    setLoading(true);

    try {
      let imageUrl = form.image_url;

      // Upload image if user selected one
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from("Adedoyin-adeagbo-ugc-creator")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("Adedoyin-adeagbo-ugc-creator")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      const testimonial = {
        name: form.name,
        brand: form.brand,
        review: form.review,
        rating: form.rating,
        image_url: imageUrl,
      };

      let error;

      if (editingId) {
        ({ error } = await supabase
          .from("testimonials")
          .update(testimonial)
          .eq("id", editingId));
      } else {
        ({ error } = await supabase.from("testimonials").insert([testimonial]));
      }

      if (error) throw error;

      showDialog(
        "success",
        editingId ? "Testimonial Updated 💖" : "Testimonial Added 🎉",
        editingId
          ? "The testimonial has been updated successfully."
          : "The testimonial has been added successfully.",
        true,
      );

      resetForm();
      fetchTestimonials();
    } catch (err) {
      console.error(err);

      showDialog("error", "Save Failed", err.message);
    } finally {
      setLoading(false);
    }
  }
  // Edit testimonial
  function editTestimonial(item) {
    setEditingId(item.id);

    setForm({
      name: item.name,
      brand: item.brand,
      review: item.review,
      rating: item.rating,
      image_url: item.image_url,
    });

    setPreview(item.image_url);
    setImageFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Delete testimonial
  async function deleteTestimonial(item) {
    showDialog(
      "warning",
      "Delete Testimonial?",
      "Click OK below to permanently delete this testimonial.",
    );

    try {
      if (item.image_url) {
        const fileName = item.image_url.split("/").pop();

        await supabase.storage
          .from("Adedoyin-adeagbo-ugc-creator")
          .remove([fileName]);
      }

      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", item.id);

      if (error) throw error;

      fetchTestimonials();

      showDialog(
        "success",
        "Testimonial Deleted 🗑️",
        "The testimonial has been deleted successfully.",
        true,
      );
    } catch (err) {
      console.error(err);

      showDialog("error", "Delete Failed", err.message);
    }
  }

  // Reset form
  function resetForm() {
    setEditingId(null);
    setImageFile(null);
    setPreview("");

    setForm({
      name: "",
      brand: "",
      review: "",
      rating: 5,
      image_url: "",
    });
  }

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

      <div className="min-h-screen bg-black text-white py-10 px-5">
        <div className="max-w-6xl mx-auto">
          <BackButton />

          <p className="uppercase tracking-[5px] text-pink-500 text-xs mb-2">
            Admin Panel
          </p>

          <h1 className="text-4xl font-serif mb-8">Testimonials Editor</h1>

          {/* FORM */}
          <div className="bg-[#161616] rounded-[30px] border border-pink-500/20 p-6 space-y-6">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Customer Name"
              className="w-full bg-[#242424] rounded-xl p-4 outline-none"
            />

            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand Name"
              className="w-full bg-[#242424] rounded-xl p-4 outline-none"
            />

            <textarea
              name="review"
              value={form.review}
              onChange={handleChange}
              rows={5}
              placeholder="Write customer's review..."
              className="w-full bg-[#242424] rounded-xl p-4 outline-none resize-none"
            />

            {/* Rating */}
            <div>
              <label className="text-pink-300 text-sm block mb-2">Rating</label>

              <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className="w-full bg-[#242424] rounded-xl p-4 outline-none"
              >
                {[5, 4, 3, 2, 1].map((star) => (
                  <option key={star} value={star}>
                    {star} Star
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Photo */}
            <label className="cursor-pointer bg-pink-500 hover:bg-pink-400 rounded-full py-3 flex justify-center items-center gap-3 font-semibold transition">
              <FaUpload />
              Upload Customer Photo
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImage}
              />
            </label>

            {/* Preview */}
            {preview && (
              <div className="flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-36 h-36 rounded-full object-cover border-4 border-pink-500"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={saveTestimonial}
                disabled={loading}
                className="flex-1 bg-pink-500 hover:bg-pink-400 py-4 rounded-full font-semibold flex justify-center items-center gap-3 disabled:opacity-50 transition"
              >
                <FaSave />
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Testimonial"
                    : "Save Testimonial"}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="flex-1 border border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white py-4 rounded-full transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          {/* SAVED TESTIMONIALS */}
          <h2 className="text-3xl font-serif mt-12 mb-6">
            Saved Testimonials ({testimonials.length})
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-[#161616] rounded-[28px] border border-pink-500/10 p-5"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>

                    <p className="text-pink-400 text-sm">{item.brand}</p>

                    <div className="flex mt-1 gap-1">
                      {Array.from({ length: item.rating }).map((_, index) => (
                        <FaStar key={index} className="text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 leading-7 mt-5">{item.review}</p>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => editTestimonial(item)}
                    className="flex-1 bg-pink-500 hover:bg-pink-400 py-3 rounded-full flex justify-center items-center gap-2 transition"
                  >
                    <FaEdit />
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTestimonial(item)}
                    className="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-full flex justify-center items-center gap-2 transition"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
