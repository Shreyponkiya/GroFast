// src/components/DeliveryBoy/MainContent.jsx
import React,{useEffect,useState} from "react";
import { Package, CheckCircle, Map } from "lucide-react";
import DeliveryMessage from "./DeliveryMessage";
import { useDispatch } from "react-redux";
import { UpdateDeliveryBoyStatus } from "../../redux/slices/deliverySlice";
import io from "socket.io-client";

const socket = io("http://localhost:8000"); // Update with your server URL

const MainContent = ({
  currentView,
  pendingDeliveries,
  completedDeliveries,
  deliveryRequests,
  user,
  msg,
  acceptDelivery,
  completeDelivery,
  activeStatus,
  toggleActiveStatus,
}) => {
  const dispatch = useDispatch();
  const handleStatus = async (status) => {
    console.log("user._id", user._id);
    console.log("status", status);

    const [location, setLocation] = useState(null);

    const result = await dispatch(
      UpdateDeliveryBoyStatus({ deliveryId: user._id, status })
    );

    console.log("Status changed to:", status);
    // Dispatch the action to update the status
  };
  useEffect(() => {
    if (navigator.geolocation) {
      console.log("location will be send ")
      navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          socket.emit("location", { lat, lon });
        },
        (error) => {
          console.error("Error getting location: ", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    }
  }, []);

  return (
    <div className="flex-1 pl-6">
      <div className="bg-white rounded-lg shadow p-6 h-[calc(100vh-140px)] overflow-auto">
        {/* Default View - Summary Dashboard */}
        {!currentView && (
          <div>
            <h2 className="text-2xl font-semibold text-green-900 mb-6 font-mono">
              Delivery Dashboard
            </h2>

            {/* Status Card */}
            <div className="bg-green-50 p-4 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-green-800">
                    Current Status
                  </h3>
                  <p className="text-gray-600">
                    You are currently {activeStatus ? "active" : "inactive"} for
                    deliveries
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newStatus = activeStatus ? "inactive" : "active";
                    handleStatus(newStatus); // send to backend
                    toggleActiveStatus(); // toggle local state
                  }}
                  type="button"
                  className={`px-4 py-2 rounded-md ${
                    activeStatus
                      ? "bg-red-100 text-red-800 hover:bg-red-200"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  {activeStatus ? "Go Inactive" : "Go Active"}
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                <h4 className="text-gray-500 text-sm">Pending Deliveries</h4>
                <p className="text-2xl font-bold text-gray-800">
                  {pendingDeliveries.length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                <h4 className="text-gray-500 text-sm">Completed Today</h4>
                <p className="text-2xl font-bold text-gray-800">
                  {completedDeliveries.length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                <h4 className="text-gray-500 text-sm">New Requests</h4>
                <p className="text-2xl font-bold text-gray-800">
                  {deliveryRequests.length}
                </p>
              </div>
            </div>

            {/* Pending Deliveries */}
            <h3 className="text-xl font-semibold text-green-800 mb-3">
              Pending Deliveries
            </h3>
            {msg && (
              <DeliveryMessage
                msg={msg}
                status={null}
                handleAccept={() => {
                  acceptDelivery(user._id);
                }}
                handleReject={() => console.log("Rejected")}
              />
            )}
          </div>
        )}

        {/* Pending Deliveries View */}
        {currentView === "pendingDeliveries" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-900 mb-4 font-mono">
              Recent Deliveries
            </h2>

            {pendingDeliveries.length === 0 ? (
              <div className="text-center py-10">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No Recent deliveries found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium">{delivery.id}</h3>
                      <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                        {delivery.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">
                      <span className="font-medium">Customer:</span>{" "}
                      {delivery.customerName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Address:</span>{" "}
                      {delivery.address}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Items:</span>{" "}
                      {delivery.items}
                    </p>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => completeDelivery(delivery.id)}
                        className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark as Delivered
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Completed Deliveries View */}
        {currentView === "completedDeliveries" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-900 mb-4 font-mono">
              Completed Deliveries
            </h2>

            {completedDeliveries.length === 0 ? (
              <div className="text-center py-10">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No completed deliveries yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivered On
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {completedDeliveries.map((delivery) => (
                      <tr key={delivery.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {delivery.id}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {delivery.customerName}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {delivery.address}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {delivery.items}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {new Date(delivery.deliveredAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Route Map View */}
        {currentView === "routeMap" && (
          <div>
            <h2 className="text-2xl font-semibold text-green-900 mb-4 font-mono">
              Delivery Route Map
            </h2>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Map view would be displayed here
                </p>
                <p className="text-gray-400 text-sm">
                  Connect to mapping service to view routes
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
