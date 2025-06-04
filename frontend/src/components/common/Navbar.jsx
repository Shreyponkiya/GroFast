import React, { useEffect, useState } from "react";
import { reverseGeocode } from "../../location/getLocation";
import { Package, ShoppingCart, Plus, Minus } from "lucide-react";
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
  useEffect(() => {
    if (currentLocation) {
      const { lat, lng } = currentLocation;
      const getLocation = async () => {
        if (lat && lng) {
          const addressInfo = await reverseGeocode(lat, lng);
          setAddressLocation(addressInfo.formattedAddress);
        }
        setCurrentLocation();
      };
      getLocation();
    }
  }, [currentLocation]);
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

  return (
    <nav className="px-8 py-2 lg:px-25 flex justify-between items-center bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-12" />
      </div>
      <div>
        <h1 className="text-lg font-bold text-gray-800">Delivery Location</h1>
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

      {isSearchShow && (
        <div className="flex items-center space-x-4">
          <input
            type="text"
            className="border border-gray-400 rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      )}
      <div className="flex items-center gap-4">
        <span className="font-medium">Welcome, </span>
        {user && (
          <span className="px-3 py-2 rounded-full text-sm bg-emerald-100 text-emerald-800 shadow-md">
            <span className="font-medium">{user.fullname}</span>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
