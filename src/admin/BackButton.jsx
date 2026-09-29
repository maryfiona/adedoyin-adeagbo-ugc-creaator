import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/admin")}
      className="inline-flex items-center gap-3 bg-[#161616] border border-pink-500/20 hover:border-pink-500 hover:bg-pink-500/10 text-pink-300 px-5 py-3 rounded-full transition-all duration-300 mb-8"
    >
      <FaArrowLeft />
      Back to Dashboard
    </button>
  );
}