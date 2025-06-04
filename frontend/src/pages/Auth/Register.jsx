import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/slices/authSlice";
import logo from "../../assets/grofast-logo.png";
import Sidelogo from "../../assets/side_image.png";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
    roleDetails: {
      // Role-specific details will be populated here based on selected role
      user: {
        userAddress: "",
      },
      admin: {
        shopName: "",
        shopGST: "",
        shopAddress: "",
      },
      deliveryBoy: {
        vehicleNumber: "",
        drivingLicense: "",
        deliveryBoyAddress: "",
      },
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === "user") {
        navigate("/user/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "deliveryBoy") {
        navigate("/delivery/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested roleDetails properties up to 3 levels
    const keys = name.split(".");

    if (keys.length === 3) {
      const [parent, role, field] = keys;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [parent]: {
          ...prevFormData[parent],
          [role]: {
            ...prevFormData[parent][role],
            [field]: value,
          },
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Validate role-specific fields
    if (formData.role === "admin") {
      if (!formData.roleDetails.admin.shopName) {
        newErrors["roleDetails.admin.shopName"] = "Shop name is required";
      }
      if (!formData.roleDetails.admin.shopGST) {
        newErrors["roleDetails.admin.shopGST"] = "Shop GST number is required";
      }
      if (!formData.roleDetails.admin.shopAddress) {
        newErrors["roleDetails.admin.shopAddress"] = "Shop address is required";
      }
    } else if (formData.role === "user") {
      if (!formData.roleDetails.user.userAddress) {
        newErrors["roleDetails.user.userAddress"] = "Address is required";
      }
    } else if (formData.role === "deliveryBoy") {
      if (!formData.roleDetails.deliveryBoy.vehicleNumber) {
        newErrors["roleDetails.deliveryBoy.vehicleNumber"] =
          "Vehicle number is required";
      }
      if (!formData.roleDetails.deliveryBoy.drivingLicense) {
        newErrors["roleDetails.deliveryBoy.drivingLicense"] =
          "License number is required";
      }
      if (!formData.roleDetails.deliveryBoy.deliveryBoyAddress) {
        newErrors["roleDetails.deliveryBoy.deliveryBoyAddress"] =
          "Address is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Find the handleSubmit function and replace it with this improved version
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Remove confirmPassword from the data to be sent
        const { confirmPassword, ...registerData } = formData;

        // Structure the data exactly as it's already organized in the form state
        // This now matches the MongoDB schema structure perfectly
        const finalRegisterData = {
          fullname: registerData.fullname,
          email: registerData.email,
          password: registerData.password,
          role: registerData.role,
          // Include the entire roleDetails object with its nested structure
          roleDetails: {
            user: registerData.roleDetails.user,
            admin: registerData.roleDetails.admin,
            deliveryBoy: registerData.roleDetails.deliveryBoy,
          },
        };

        console.log("Sending registration data:", finalRegisterData);
        const data = await dispatch(register(finalRegisterData)).unwrap();
        console.log("Registration successful", data);
        // Redirect based on user role
        navigate("/login");
      } catch (err) {
        console.error("Registration failed", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  return (
    <div className="flex min-h-screen w-full py-12 items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="flex w-full justify-center items-center max-w-6xl mx-auto">
        {/* Side Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-green-50/50 z-10"></div>
          <img
            src={Sidelogo}
            alt="Grocery Shopping"
            className="h-full w-full object-cover rounded-l-3xl shadow-xl"
          />
          <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg z-20 max-w-sm">
            <h3 className="text-xl font-bold text-green-700 mb-2">
              Join GroFast Today!
            </h3>
            <p className="text-gray-700">
              Get fresh groceries delivered to your doorstep within minutes.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="w-full lg:w-1/2 p-4">
          <div className="max-w-md mx-auto overflow-hidden rounded-2xl bg-white shadow-2xl border border-green-100">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
              <div className="flex justify-center mb-4">
                <img
                  src={logo}
                  alt="GroFast Logo"
                  className="h-16 rounded-lg shadow-lg transform transition hover:scale-105 duration-300"
                />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Create an Account
              </h2>
              <p className="text-green-100">
                Join the fastest growing grocery platform
              </p>
            </div>

            <div className="p-8">
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-700 border-l-4 border-red-500 animate-pulse">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="mb-4">
                  <label
                    htmlFor="fullname"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className={`w-full rounded-lg border p-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 ${
                      errors.fullname ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.fullname && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.fullname}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-lg border p-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-1">
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full rounded-lg border p-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="••••••••"
                      />
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-1">
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full rounded-lg border p-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    I am a
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`cursor-pointer rounded-lg border p-4 text-center transition hover:transform hover:scale-105 duration-200 ${
                        formData.role === "user"
                          ? "border-green-500 bg-green-50 shadow-md"
                          : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                      }`}
                      onClick={() => setFormData({ ...formData, role: "user" })}
                    >
                      <div className="mb-2 flex justify-center">
                        <svg
                          className="h-8 w-8 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="text-sm font-medium">Customer</div>
                    </div>

                    <div
                      className={`cursor-pointer rounded-lg border p-4 text-center transition hover:transform hover:scale-105 duration-200 ${
                        formData.role === "admin"
                          ? "border-green-500 bg-green-50 shadow-md"
                          : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, role: "admin" })
                      }
                    >
                      <div className="mb-2 flex justify-center">
                        <svg
                          className="h-8 w-8 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="text-sm font-medium">Shopkeeper</div>
                    </div>

                    <div
                      className={`cursor-pointer rounded-lg border p-4 text-center transition hover:transform hover:scale-105 duration-200 ${
                        formData.role === "deliveryBoy"
                          ? "border-green-500 bg-green-50 shadow-md"
                          : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, role: "deliveryBoy" })
                      }
                    >
                      <div className="mb-2 flex justify-center">
                        <svg
                          className="h-8 w-8 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-1h3.5a1 1 0 00.8-.4l3.5-4.5a1 1 0 00.2-.6V8a1 1 0 00-1-1h-1.05A2.5 2.5 0 0013 4.5h-1a1 1 0 00-1-1H3z" />
                        </svg>
                      </div>
                      <div className="text-sm font-medium">Delivery</div>
                    </div>
                  </div>
                </div>

                {/* Role-specific form fields */}
                {formData.role === "admin" && (
                  <div className="mb-4 bg-green-50 p-4 rounded-lg border border-green-100">
                    <h3 className="font-medium text-green-700 mb-3 text-center">
                      Shopkeeper Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label
                          htmlFor="shopName"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Shop Name
                        </label>
                        <input
                          type="text"
                          id="shopName"
                          name="roleDetails.admin.shopName"
                          value={formData.roleDetails.admin.shopName}
                          onChange={handleChange}
                          placeholder="Enter Your Shop Name"
                          className={`w-full rounded-lg border p-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 ${
                            errors["roleDetails.admin.shopName"]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors["roleDetails.admin.shopName"] && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors["roleDetails.admin.shopName"]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="shopGST"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Shop GST
                        </label>
                        <input
                          type="text"
                          id="shopGST"
                          name="roleDetails.admin.shopGST"
                          value={formData.roleDetails.admin.shopGST}
                          onChange={handleChange}
                          placeholder="Enter Your Shop GST Number"
                          className={`w-full rounded-lg border p-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 ${
                            errors["roleDetails.admin.shopGST"]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors["roleDetails.admin.shopGST"] && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors["roleDetails.admin.shopGST"]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="shopAddress"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Shop Address
                      </label>
                      <textarea
                        id="shopAddress"
                        name="roleDetails.admin.shopAddress"
                        value={formData.roleDetails.admin.shopAddress}
                        onChange={handleChange}
                        placeholder="Enter Your Shop Address"
                        rows="3"
                        className={`w-full rounded-lg border p-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 ${
                          errors["roleDetails.admin.shopAddress"]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors["roleDetails.admin.shopAddress"] && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors["roleDetails.admin.shopAddress"]}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {formData.role === "user" && (
                  <div className="mb-4 bg-green-50 p-4 rounded-lg border border-green-100">
                    <h3 className="font-medium text-green-700 mb-3 text-center">
                      Customer Details
                    </h3>
                    <div className="w-full">
                      <label
                        htmlFor="userAddress"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Your Delivery Address
                      </label>
                      <textarea
                        id="userAddress"
                        name="roleDetails.user.userAddress"
                        value={formData.roleDetails.user.userAddress}
                        onChange={handleChange}
                        placeholder="Enter Your Complete Address"
                        rows="3"
                        className={`w-full rounded-lg border p-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 ${
                          errors["roleDetails.user.userAddress"]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors["roleDetails.user.userAddress"] && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors["roleDetails.user.userAddress"]}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {formData.role === "deliveryBoy" && (
                  <div className="mb-4 bg-green-50 p-4 rounded-lg border border-green-100">
                    <h3 className="font-medium text-green-700 mb-3 text-center">
                      Delivery Partner Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label
                          htmlFor="vehicleNumber"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Vehicle Number
                        </label>
                        <input
                          type="text"
                          id="vehicleNumber"
                          name="roleDetails.deliveryBoy.vehicleNumber"
                          value={formData.roleDetails.deliveryBoy.vehicleNumber}
                          onChange={handleChange}
                          placeholder="Enter Your Vehicle Number"
                          className={`w-full rounded-lg border p-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 ${
                            errors["roleDetails.deliveryBoy.vehicleNumber"]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors["roleDetails.deliveryBoy.vehicleNumber"] && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors["roleDetails.deliveryBoy.vehicleNumber"]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="drivingLicense"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          Driving License Number
                        </label>
                        <input
                          type="text"
                          id="drivingLicense"
                          name="roleDetails.deliveryBoy.drivingLicense"
                          value={
                            formData.roleDetails.deliveryBoy.drivingLicense
                          }
                          onChange={handleChange}
                          placeholder="Enter Your Driving License Number"
                          className={`w-full rounded-lg border p-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 ${
                            errors["roleDetails.deliveryBoy.drivingLicense"]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors["roleDetails.deliveryBoy.drivingLicense"] && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors["roleDetails.deliveryBoy.drivingLicense"]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="deliveryBoyAddress"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Your Address
                      </label>
                      <textarea
                        id="deliveryBoyAddress"
                        name="roleDetails.deliveryBoy.deliveryBoyAddress"
                        value={
                          formData.roleDetails.deliveryBoy.deliveryBoyAddress
                        }
                        onChange={handleChange}
                        placeholder="Enter Your Complete Address"
                        rows="3"
                        className={`w-full rounded-lg border p-3 shadow-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 ${
                          errors["roleDetails.deliveryBoy.deliveryBoyAddress"]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors["roleDetails.deliveryBoy.deliveryBoyAddress"] && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors["roleDetails.deliveryBoy.deliveryBoyAddress"]}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-gradient-to-r from-green-500 to-green-600 py-3 text-center font-semibold text-white shadow-md transition hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 transform hover:scale-105 duration-200"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-green-600 hover:text-green-800 transition duration-200 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
