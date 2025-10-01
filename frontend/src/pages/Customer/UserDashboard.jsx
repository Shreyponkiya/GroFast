import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, getProfile } from "../../redux/slices/authSlice";
import { fetchProducts } from "../../redux/slices/CustomerSilce";
import { fetchCategories } from "../../redux/slices/ProductSlice";

// Import components
import Navbar from "../../components/common/Navbar";
import HeroSection from "../../components/CustomerDashBoard/HeroSection";
import ProductCategory from "../../components/CustomerDashBoard/ProductCategory";
import CartButton from "../../components/CustomerDashBoard/CartButton";
import CartSidebar from "../../components/CustomerDashBoard/CartSidebar";
import Footer from "../../components/common/Footer";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);

  // Get user profile
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // Fetch all products and categories
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch categories first
        const categoriesResponse = await dispatch(fetchCategories({}));
        if (categoriesResponse?.payload?.categories) {
          console.log("categoriesResponse", categoriesResponse);
          setCategories(categoriesResponse.payload.categories);
        }

        // Then fetch products
        const productsResponse = await dispatch(fetchProducts({}));
        if (productsResponse?.payload) {
          console.log("productsResponse", productsResponse);
          setProducts(productsResponse.payload.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Function to organize products by category
  const getProductsByCategory = () => {
    if (!products.length || !categories.length) {
      return {};
    }

    const productsByCategory = {};

    // Initialize categories
    categories.forEach((category) => {
      productsByCategory[category._id] = {
        name: category.categoryName,
        products: [],
      };
    });

    // Group products by category
    products.forEach((product) => {
      const categoryId = product.productCategory?._id;

      // Check if category exists and product matches search term if there is one
      if (categoryId && productsByCategory[categoryId]) {
        if (
          !searchTerm ||
          product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          productsByCategory[categoryId].products.push(product);
        }
      }
    });

    return productsByCategory;
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[product._id]) {
        updatedCart[product._id].quantity += 1;
      } else {
        updatedCart[product._id] = { ...product, quantity: 1 };
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (product) => {
    setCart((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[product._id]) {
        updatedCart[product._id].quantity -= 1;
        if (updatedCart[product._id].quantity <= 0) {
          delete updatedCart[product._id];
        }
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = async () => {
    localStorage.removeItem("cart");
    await dispatch(logout());
    navigate("/login");
  };

  // Format price with commas and two decimal places
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  // Calculate cart count
  const cartItemsCount = Object.keys(cart).length;

  // Toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navbar
        user={user}
        searchTerm={searchTerm}
        isSearchShow={true}
        handleSearchChange={handleSearchChange}
        handleLogout={handleLogout}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content - Products by Category */}
      <div className="mb-16 px-8 lg:px-25">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-xl">Loading products...</div>
          </div>
        ) : (
          <>
            {/* Categories and Products */}
            {categories.length > 0 ? (
              <div className="space-y-10">
                {Object.entries(getProductsByCategory()).map(
                  ([categoryId, category]) =>
                    category.products.length > 0 && (
                      <ProductCategory
                        key={categoryId}
                        categoryId={categoryId}
                        category={category}
                        cart={cart}
                        addToCart={addToCart}
                        removeFromCart={removeFromCart}
                        formatPrice={formatPrice}
                      />
                    )
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center h-32">
                <div className="text-xl">No categories available.</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Cart Button */}
      <CartButton cartItemsCount={cartItemsCount} toggleCart={toggleCart} />

      {/* Cart Sidebar */}
      <CartSidebar
        user={user}
        isCartOpen={isCartOpen}
        toggleCart={toggleCart}
        cart={cart}
        formatPrice={formatPrice}
      />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserDashboard;
