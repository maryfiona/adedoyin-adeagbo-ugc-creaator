import { NavLink } from "react-router-dom"; 
import { 
  FaVideo, 
  FaStar, 
  FaUser, 
  FaBuilding, 
  FaEnvelope, 
  FaChartBar, 
  FaSignOutAlt, 
} from "react-icons/fa"; 
 
export default function Sidebar() { 
  const menuClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${ 
      isActive 
        ? "bg-pink-500 text-white" 
        : "text-gray-300 hover:bg-pink-500/20 hover:text-pink-300" 
    }`; 
 
  return ( 
    <aside className="bg-[#111111] w-64 min-h-screen p-8 border-r border-pink-500/10">
  
 
      {/* Logo */} 
      <h1 className="text-pink-500 text-2xl font-serif mb-10"> 
        Adedoyin Adeagbo
      </h1> 
 
      {/* Navigation */} 
      <nav className="space-y-3"> 
 
        <NavLink to="/admin/videos" className={menuClass}> 
          <FaVideo /> 
          Videos 
        </NavLink> 
 
        <NavLink to="/admin/brands" className={menuClass}> 
          <FaBuilding /> 
          Brands 
        </NavLink> 
 
        <NavLink to="/admin/hero" className={menuClass}> 
          <FaUser /> 
          Hero 
        </NavLink> 
 
        <NavLink to="/admin/results" className={menuClass}> 
          <FaChartBar /> 
          Results & Services 
        </NavLink> 
 
        <NavLink to="/admin/testimonials" className={menuClass}> 
          <FaStar /> 
          Testimonials 
        </NavLink> 
 
        <NavLink to="/admin/contact" className={menuClass}> 
          <FaEnvelope /> 
          Contact 
        </NavLink> 
 
      </nav> 
 
      {/* Logout */} 
      <button 
        onClick={() => { 
          localStorage.removeItem("admin"); 
          window.location.href = "/admin/login"; 
        }} 
        className="flex items-center gap-3 text-pink-500 hover:text-pink-400 mt-12" 
      > 
        <FaSignOutAlt /> 
        Logout 
      </button> 
 
    </aside> 
  ); 
}