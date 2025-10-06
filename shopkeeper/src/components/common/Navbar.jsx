import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/remove.png";

const Navbar = React.forwardRef(({ user, sidebarOpen, setSidebarOpen, handleLogout: propHandleLogout }, ref) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditProfile = () => {
    setDropdownOpen(false);
    navigate("/admin/edit-profile");
  };

  const handleChangePassword = () => {
    setDropdownOpen(false);
    navigate("/admin/change-password");
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    if (propHandleLogout) {
      propHandleLogout();
    } else {
      // Fallback if not passed
      navigate("/login");
    }
  };

  return (
    <nav
      ref={ref}
      className="fixed top-0 left-0 px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center bg-white shadow-sm w-full z-50"
    >
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden"
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? (
            <X className="h-6 w-6 text-emerald-600" />
          ) : (
            <Menu className="h-6 w-6 text-emerald-600" />
          )}
        </button>
        <img src={logo} alt="Logo" className="h-10 sm:h-12 ml-4 sm:ml-6" />
      </div>
      <div ref={dropdownRef} className="flex items-center gap-2 sm:gap-4 relative">
        {user && (
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center text-gray-700 text-sm sm:text-base focus:outline-none"
          >
            <User className="h-5 w-5 text-emerald-600" />
            <span className="hidden sm:inline ml-2 font-medium">{user.fullname}</span>
            <ChevronDown className="h-4 w-4 ml-1 text-emerald-600" />
          </button>
        )}
        <span className="px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm bg-emerald-100 text-emerald-800 shadow-md whitespace-nowrap">
          Shopkeeper
        </span>
        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 transition-opacity duration-200 opacity-100">
            <button
              onClick={handleEditProfile}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 w-full text-left"
            >
              Edit Profile
            </button>
            <button
              onClick={handleChangePassword}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 w-full text-left"
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 w-full text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
});

export default Navbar;