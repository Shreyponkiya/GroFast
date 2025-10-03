import React, { useEffect, useState } from "react";
import { reverseGeocode } from "../../location/getLocation";
import { Menu, X } from "lucide-react";
import logo from "../../assets/remove.png";

const Navbar = ({
  user,
  searchTerm,
  handleSearchChange,
  handleLogout,
  isSearchShow,
}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [addressLocation, setAddressLocation] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false); // Laptop toggle

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Reverse geocode
  useEffect(() => {
    if (currentLocation) {
      const { lat, lng } = currentLocation;
      const getLocation = async () => {
        if (lat && lng) {
          const addressInfo = await reverseGeocode(lat, lng);
          setAddressLocation(addressInfo.formattedAddress);
        }
      };
      getLocation();
    }
  }, [currentLocation]);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img src={logo} alt="Logo" className="h-12" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* Delivery Location Toggle */}
            <div className="relative">
              <button
                onClick={() => setLocationOpen(!locationOpen)}
                className="text-gray-800 font-bold"
              >
                Delivery Location
              </button>

              {locationOpen && (
                <div className="absolute mt-2 p-3 bg-white border border-gray-200 rounded shadow-md w-64 lg:w-80">
                  {user?.address || addressLocation ? (
                    <p className="text-sm text-gray-600">
                      {user?.address
                        ? user.address
                        : addressLocation.length > 40
                        ? `${addressLocation.slice(0, 40)}...`
                        : addressLocation}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Requesting location...
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Search */}
            {isSearchShow && (
              <input
                type="text"
                className="border border-gray-400 rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            )}

            {/* User Info */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Welcome,</span>
              {user && (
                <span className="px-3 py-2 rounded-full text-sm bg-emerald-100 text-emerald-800 shadow-md">
                  {user.fullname}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-4 pb-2 space-y-4 border-t border-gray-200">
          {/* Delivery Location */}
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              Delivery Location
            </h1>
            {user?.address || addressLocation ? (
              <p className="text-sm text-gray-600">
                {user?.address
                  ? user.address
                  : addressLocation.length > 40
                  ? `${addressLocation.slice(0, 40)}...`
                  : addressLocation}
              </p>
            ) : (
              <p className="text-sm text-gray-600">Requesting location...</p>
            )}
          </div>

          {/* Search */}
          {isSearchShow && (
            <input
              type="text"
              className="border border-gray-400 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          )}

          {/* User Info & Logout */}
          <div className="flex flex-col gap-2">
            <span className="font-medium">Welcome, {user?.fullname}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors w-full"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
