import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { FaUpload, FaTrash } from "react-icons/fa";
import BackButton from "./BackButton";
import Dialog from "../components/Dialog";

export default function VideosEditor() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Brand Collaboration");
  const [videoFile, setVideoFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [dialog, setDialog] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  useEffect(() => {
    getVideos();
  }, []);

  // Fetch Videos
  async function getVideos() {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setVideos(data || []);
  }

  // Dialog Helper
  function showDialog(type, title, message, autoClose = false) {
    setDialog({ open: true, type, title, message });

    if (autoClose) {
      setTimeout(() => {
        setDialog((prev) => ({ ...prev, open: false }));
      }, 2500);
    }
  }

  // Pick Video
 function handleUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  setVideoFile(file);
  setPreview(URL.createObjectURL(file));
}

  // Upload Video
  async function saveVideo() {
    if (loading) return;

    if (!title.trim()) {
      showDialog(
        "warning",
        "Title Required",
        "Please enter a title for this video."
      );
      return;
    }

    if (!videoFile) {
      showDialog(
        "warning",
        "Video Required",
        "Please choose a video before saving."
      );
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const progressTimer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 400);

    try {
      const fileName = `${Date.now()}-${videoFile.name}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("Adedoyin-adeagbo-ugc-creator")
        .upload(fileName, videoFile);

      if (uploadError) throw uploadError;

      clearInterval(progressTimer);
      setUploadProgress(100);

      // Get Public URL
      const { data: urlData } = supabase.storage
        .from("Adedoyin-adeagbo-ugc-creator")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Save in Database
      const { error: insertError } = await supabase.from("videos").insert({
        title: title.trim(),
        category,
        video_url: publicUrl,
      });

      if (insertError) throw insertError;

      showDialog(
        "success",
        "Video Uploaded 🎉",
        "Your video has been uploaded successfully.",
        true
      );

      // Reset Form
      setTitle("");
      setCategory("Brand Collaboration");
      setVideoFile(null);
      setPreview("");

      getVideos();
    } catch (error) {
      console.error(error);

      showDialog(
        "error",
        "Upload Failed",
        error.message || "Something went wrong while uploading."
      );
    } finally {
      clearInterval(progressTimer);
      setLoading(false);

      setTimeout(() => {
        setUploadProgress(0);
      }, 600);
    }
  }

  // Delete Video
  async function deleteVideo(video) {
    try {
      const fileName = video.video_url.split("/").pop();

      await supabase.storage
        .from("Adedoyin-adeagbo-ugc-creator")
        .remove([fileName]);

      await supabase.from("videos").delete().eq("id", video.id);

      getVideos();

      showDialog(
        "success",
        "Video Deleted 🗑️",
        "The video has been removed successfully.",
        true
      );
    } catch (error) {
      showDialog(
        "error",
        "Delete Failed",
        error.message || "Unable to delete this video."
      );
    }
  }

  return (
    <>
      <Dialog
        open={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onClose={() => setDialog({ ...dialog, open: false })}
      />

      <div className="min-h-screen bg-black text-white px-5 py-10">
        <BackButton />

        <div className="max-w-6xl mx-auto">
          <p className="uppercase tracking-[5px] text-pink-500 text-xs mb-2">
            Admin Panel
          </p>

          <h1 className="text-4xl font-serif mb-8">Videos Editor</h1>

          {/* Upload Card */}
          <div className="bg-[#161616] rounded-[30px] border border-pink-500/20 p-6 space-y-5 mb-12">

            {/* Title */}
            <div>
              <label className="block text-pink-300 text-sm uppercase tracking-[2px] mb-2">
                Video Title
              </label>

              <input
                type="text"
                placeholder="e.g. Fenty Foundation Campaign"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#242424] rounded-xl p-4 outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-pink-300 text-sm uppercase tracking-[2px] mb-2">
                Video Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#242424] rounded-xl p-4 outline-none text-white"
              >
                <option>Brand Collaboration</option>
                <option>Beauty</option>
                <option>Lifestyle</option>
                <option>Tech</option>
              </select>
            </div>

            {/* Upload */}
            <label className="flex items-center justify-center gap-3 bg-pink-500 hover:bg-pink-400 rounded-full py-3 cursor-pointer font-semibold transition">
              <FaUpload />
              Choose Video

              <input
                hidden
                type="file"
                accept="video/*"
                onChange={handleUpload}
              />
            </label>

            {/* Preview */}
            {preview && (
              <div className="flex justify-center">
                <video
                  src={preview}
                  controls
                  className="w-[180px] h-[320px] rounded-[22px] object-cover border border-pink-500"
                />
              </div>
            )}

            {/* Progress Bar */}
            {loading && (
              <div>
                <div className="flex justify-between text-sm text-pink-300 mb-2">
                  <span>Uploading video...</span>
                  <span>{uploadProgress}%</span>
                </div>

                <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <button
              type="button"
              onClick={saveVideo}
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-400 py-4 rounded-full font-semibold disabled:opacity-60 transition"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading Video...
                </div>
              ) : (
                "Save Video"
              )}
            </button>
          </div>

          {/* Uploaded Videos */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-serif">Uploaded Videos</h2>

            <span className="text-pink-400 text-sm">
              {videos.length} Video(s)
            </span>
          </div>

          {videos.length === 0 ? (
            <div className="bg-[#161616] rounded-[30px] border border-pink-500/10 py-16 text-center text-gray-500">
              No videos uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-[#161616] rounded-[24px] border border-pink-500/10 p-3"
                >
                  <video
                    src={video.video_url}
                    controls
                    className="w-full aspect-[9/16] rounded-[18px] object-cover"
                  />

                  {/* Category Badge */}
                  <div className="flex justify-center mt-3">
                    <span className="bg-pink-500/20 border border-pink-500/30 text-pink-300 px-3 py-1 rounded-full text-[10px] uppercase tracking-[2px]">
                      {video.category || "Brand Collaboration"}
                    </span>
                  </div>

                  {/* Title */}
                  <p className="mt-3 text-center uppercase text-[11px] font-semibold tracking-[2px] line-clamp-2">
                    {video.title}
                  </p>

                  {/* Delete */}
                  <button
                    onClick={() => deleteVideo(video)}
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-2 rounded-xl hover:bg-red-500/20 transition"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}