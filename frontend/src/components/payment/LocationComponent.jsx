import React, { useState, useEffect } from "react";
import { LocateFixed } from "lucide-react";
import { reverseGeocode } from "../../location/getLocation";
import axios from "axios";
const LocationComponent = ({
  addressLocation,
  setAddressLocation,
  user,
  refetchUser,
}) => {
  const [islocationOpen, setIslocationOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);

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
  }, [currentLocation, setAddressLocation]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const address = `${data.buildingName},${data.floorNumber},${data.towerWing},${data.nearbyLandmark}`;
    console.log("Address:", address);
    setIslocationOpen(false);

    const res = await axios.put(
      "http://localhost:8000/api/user/update-address",
      {
        address: address,
      }
    );
    if (res.status === 200) {
      console.log("Address updated successfully");
      setAddressLocation(address);
      refetchUser?.(); // Trigger parent to fetch fresh user data
    } else {
      console.error("Error updating address");
    }

    setAddressLocation(address);
  };

  const handleCurrentLocation = async () => {
    setAddressLocation(null);
    const { lat, lng } = currentLocation;
    if (lat && lng) {
      const addressInfo = await reverseGeocode(lat, lng);
      const address = addressInfo.formattedAddress;

      const res = await axios.put(
        "http://localhost:8000/api/user/update-address",
        {
          address: address,
        }
      );
      if (res.status === 200) {
        console.log("Address updated successfully");
        setCurrentAddress(address);
        setAddressLocation(address);
        refetchUser?.(); // Trigger parent to fetch fresh user data
      } else {
        console.error("Error updating address");
      }

      setAddressLocation(address);
    }
  };

  return (
    <div className="flex flex-col transition-all duration-5000 ease-in-out animate-slideDown">
      <div
        className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 cursor-pointer flex justify-between items-center rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
        onClick={() => setIslocationOpen(!islocationOpen)}
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Change Location</h1>
          <p className="text-green-100 mt-1">
            {user?.address ? (
              user?.address
            ) : addressLocation ? (
              addressLocation
            ) : (
              <span className="animate-spin text-sm text-white">
                Requesting location...
              </span>
            )}
          </p>
        </div>
      </div>

      {islocationOpen && (
        <div className="transition duration-1000 ease-in-out animate-slideDown">
          <div className="bg-green-100 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 2a10 10 0 00-10 10c0 5.523 10 10 10 10s10-4.477 10-10a10 10 0 00-10-10zm0 14a4 4 0 110-8 4 4 0 010 8z"
                />
              </svg>
              <h2 className="text-lg font-semibold text-green-800">
                Current Location:{" "}
                <span className="font-mono">
                  {user?.address ? (
                    user?.address
                  ) : addressLocation ? (
                    addressLocation
                  ) : (
                    <span className="text-sm text-gray-600">
                      Requesting location...
                    </span>
                  )}
                </span>
              </h2>
            </div>
          </div>
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-4 justify-between items-center mb-4">
                <div className="w-full">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="buildingName"
                  >
                    Office / Building Name
                  </label>
                  <input
                    type="text"
                    id="buildingName"
                    name="buildingName"
                    placeholder="Office / Building Name"
                    className="border border-gray-300 rounded-md py-2 px-8 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="floorNumber"
                  >
                    Floor / Flat Number
                  </label>
                  <input
                    type="text"
                    id="floorNumber"
                    name="floorNumber"
                    placeholder="Enter your floor / flat number"
                    className="border border-gray-300 rounded-md py-2 px-8 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 justify-between items-center mb-4">
                <div className="w-full">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="towerWing"
                  >
                    Tower / Wing (optional)
                  </label>
                  <input
                    type="text"
                    id="towerWing"
                    name="towerWing"
                    placeholder="Enter your tower / wing"
                    className="border border-gray-300 rounded-md py-2 px-8 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="w-full">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor="nearbyLandmark"
                  >
                    Nearby landmark (optional)
                  </label>
                  <input
                    type="text"
                    id="nearbyLandmark"
                    name="nearbyLandmark"
                    placeholder="Enter nearby landmark"
                    className="border border-gray-300 rounded-md py-2 px-8 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex gap-4 justify-between items-center mb-4">
                <button
                  type="submit"
                  className="bg-green-600 w-full text-white font-semibold rounded-md py-2 px-4 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Save Location
                </button>
              </div>
              <div
                className="flex items-center mb-4 bg-gray-200 py-3 w-full rounded-lg pl-5"
                onClick={handleCurrentLocation}
              >
                <LocateFixed />
                <div className="pl-5">
                  <p className="text-sm text-gray-600">Get Current Location</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationComponent;
