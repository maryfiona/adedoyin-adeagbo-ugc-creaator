import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { FaSave } from "react-icons/fa";
import BackButton from "./BackButton";
import Dialog from "../components/Dialog";

export default function ResultServicesEditor() {
  const [loading, setLoading] = useState(false);
  const [rowId, setRowId] = useState(null);

  // Dialog State
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

  const [form, setForm] = useState({
    likes: "",
    comments: "",
    shares: "",
    saves: "",
    views: "",
    growth: "",
    service1: "",
    service2: "",
    service3: "",
    service4: "",
    service5: "",
    service6: "",
  });

  useEffect(() => {
    fetchContent();
  }, []);

  // Fetch existing content
  async function fetchContent() {
    const { data, error } = await supabase
      .from("result_services")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error(error);

      showDialog(
        "error",
        "Unable to Load",
        "Failed to load Results & Services."
      );
      return;
    }

    setRowId(data.id);

    setForm({
      likes: data.likes || "",
      comments: data.comments || "",
      shares: data.shares || "",
      saves: data.saves || "",
      views: data.views || "",
      growth: data.growth || "",
      service1: data.service1 || "",
      service2: data.service2 || "",
      service3: data.service3 || "",
      service4: data.service4 || "",
      service5: data.service5 || "",
      service6: data.service6 || "",
    });
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Save everything
  async function saveChanges() {
    if (!rowId) {
      showDialog(
        "warning",
        "No Data Found",
        "There is no Results & Services record to update."
      );
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("result_services")
      .update(form)
      .eq("id", rowId);

    if (error) {
      console.error(error);

      showDialog(
        "error",
        "Update Failed",
        error.message
      );

      setLoading(false);
      return;
    }

    showDialog(
      "success",
      "Changes Saved 🎉",
      "Results & Services have been updated successfully.",
      true
    );

    setLoading(false);
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

      <div className="min-h-screen bg-black text-white px-5 py-10">
        <BackButton />

        <div className="max-w-5xl mx-auto">
          <p className="uppercase tracking-[5px] text-pink-500 text-xs mb-2">
            Admin Panel
          </p>

          <h1 className="text-4xl font-serif mb-10">
            Results & Services Editor
          </h1>

          {/* RESULTS */}
          <div className="bg-[#161616] rounded-[30px] border border-pink-500/20 p-6 mb-10">
            <h2 className="text-2xl font-serif text-pink-300 mb-6">
              Campaign Results
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Likes"
                name="likes"
                value={form.likes}
                onChange={handleChange}
              />

              <Input
                label="Comments"
                name="comments"
                value={form.comments}
                onChange={handleChange}
              />

              <Input
                label="Shares"
                name="shares"
                value={form.shares}
                onChange={handleChange}
              />

              <Input
                label="Saves"
                name="saves"
                value={form.saves}
                onChange={handleChange}
              />

              <Input
                label="Views"
                name="views"
                value={form.views}
                onChange={handleChange}
              />

              <Input
                label="Average Growth"
                name="growth"
                value={form.growth}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* SERVICES */}
          <div className="bg-[#161616] rounded-[30px] border border-pink-500/20 p-6">
            <h2 className="text-2xl font-serif text-pink-300 mb-6">
              Services
            </h2>

            <div className="grid gap-5">
              <Input
                label="Service 1"
                name="service1"
                value={form.service1}
                onChange={handleChange}
              />

              <Input
                label="Service 2"
                name="service2"
                value={form.service2}
                onChange={handleChange}
              />

              <Input
                label="Service 3"
                name="service3"
                value={form.service3}
                onChange={handleChange}
              />

              <Input
                label="Service 4"
                name="service4"
                value={form.service4}
                onChange={handleChange}
              />

              <Input
                label="Service 5"
                name="service5"
                value={form.service5}
                onChange={handleChange}
              />

              <Input
                label="Service 6"
                name="service6"
                value={form.service6}
                onChange={handleChange}
              />
            </div>

            <button
              onClick={saveChanges}
              disabled={loading}
              className="w-full mt-8 bg-pink-500 hover:bg-pink-400 py-4 rounded-full font-semibold flex items-center justify-center gap-3 disabled:opacity-50 transition"
            >
              <FaSave />
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Reusable Input Component
function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-pink-300 text-sm mb-2 uppercase tracking-[2px]">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-[#242424] rounded-xl p-4 outline-none border border-transparent focus:border-pink-500"
      />
    </div>
  );
}