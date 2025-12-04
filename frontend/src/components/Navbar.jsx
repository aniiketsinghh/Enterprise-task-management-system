import { useEffect, useState } from "react";
import { Link } from "react-router";
import { FaHome, FaCog } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { IoFolderOpenOutline } from "react-icons/io5";



const Navbar = () => {
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    setToday(`${day}-${month}-${year}`);
  }, []);

  return (
    <nav className="w-full bg-white shadow-[0_3px_10px_rgba(0,0,0,0.07)] px-6 py-3 flex items-center justify-between sticky top-0 z-50">

      {/* Left Section */}
      <div className="flex items-center gap-8">
        
        {/* Brand */}
        <h1 className="text-xl font-bold text-green-600 tracking-wide">
          SRZ <span className="text-gray-900">Tasks</span>
        </h1>

        {/* Home Link */}
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-700 font-medium hover:text-green-600 transition-all"
        >
          <FaHome size={18} />
          <span className="text-sm">Home</span>
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
       
       <Link
          to="/"
          className="flex items-center gap-2 text-gray-700 font-medium hover:text-green-600 transition-all"
        >
          <FaTasks size={18} />
          <span className="text-sm">Tasks</span>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-2 text-gray-700 font-medium hover:text-green-600 transition-all"
        >
          < IoFolderOpenOutline   size={18} />
          <span className="text-sm">Projects</span>
        </Link>
   

        {/* Create Button */}
        <button className="flex items-center bg-green-600 text-white px-4 py-[6px] rounded-lg font-medium shadow hover:bg-green-700 hover:shadow-md transition-all">
        <MdAdd size={18} className="mb-[1px]" />
        <span className="text-sm">Create</span>
        </button>


        {/* Date Box */}
        <div className="px-4 py-[6px] bg-gray-100 rounded-lg shadow-sm text-gray-700 text-sm font-medium">
          {today}
        </div>

        {/* Settings */}
        <button className="text-gray-700 hover:text-green-600 transition-all">
          <FaCog size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
