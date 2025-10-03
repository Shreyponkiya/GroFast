import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProfile, logout } from "../../redux/slices/authSlice";
import Navbar from "../../components/common/Navbar";
import LocationComponent from "../../components/payment/LocationComponent";
import BillComponent from "../../components/payment/BillComponent";


const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { OrderId } = useParams();
  const [addressLocation, setAddressLocation] = useState(null);

  useEffect(() => {
    // Fetch user profile
    dispatch(getProfile());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="bg-green-50 min-h-screen">
      <Navbar user={user} handleLogout={handleLogout} isSearchShow={false} />

      {/* <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="text-center">
            <button
              onClick={() => navigate("/user/dashboard")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Back to Dashboard
            </button>
          </div>
        </div> */}

      <div className="max-w-4xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div>
          <button
            className="mb-3 text-green-600 font-semibold"
            onClick={() => navigate(-1)}
          >
            &larr; Back
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-green-100">
          {/* Header with both components */}
          <div className="flex flex-col gap-4">
            <LocationComponent
              user={user}
              addressLocation={addressLocation}
              setAddressLocation={setAddressLocation}
              refetchUser={() => dispatch(getProfile())}
            />
          </div>
        </div>
        {/* <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-green-100 mt-4">
        </div> */}
        <BillComponent OrderId={OrderId} user={user} dispatch={dispatch} />
        {/* Footer */}
      </div>
    </div>
  );
};

export default Payment;
