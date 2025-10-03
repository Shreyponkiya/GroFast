import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "../common/ProductCard";
import "swiper/css";
import "swiper/css/navigation";
import "../../style/Swiper.css";

const ProductCategory = ({
  category,
  categoryId,
  cart,
  addToCart,
  removeFromCart,
  formatPrice,
}) => {
  return (
    <div key={categoryId} className="space-y-4">
      {/* Category Title */}
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">
        {category.name}
      </h2>

      {/* Responsive Carousel */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={1} // Start with 1 full slide for smallest screens to avoid partial views
        navigation
        breakpoints={{
          480: {
            slidesPerView: 2, // Show 2 full slides
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 3, // Show 3 full slides
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 4, // Show 4 full slides
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 5, // Show 5 full slides
            spaceBetween: 24,
          },
        }}
        className="product-swiper"
      >
        {category.products.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard
              product={product}
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              formatPrice={formatPrice}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductCategory;
