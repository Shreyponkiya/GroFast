import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from '../common/ProductCard';
import "swiper/css";
import "swiper/css/navigation";
import "../../style/Swiper.css";

const ProductCategory = ({ 
  category, 
  categoryId, 
  cart, 
  addToCart, 
  removeFromCart, 
  formatPrice 
}) => {
  return (
    <div key={categoryId}>
      {/* Category Title */}
      <h2 className="text-2xl font-bold text-green-700 mb-4">
        {category.name}
      </h2>

      {/* Horizontal Scroll Carousel */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={4}
        navigation
        pagination={{ clickable: true }}                            
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