
import { ShoppingBag, Clock, Truck } from "lucide-react";
import heroImage from "../../assets/hero-groceries.jpg";
import React from "react";
const HeroSection = () => {
  return (
    <section className="relative min-h-[30vh] flex items-center overflow-hidden bg-gradient-to-b from-secondary/30 to-background">
      {/* Hero Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Fresh Groceries - Organic fruits and vegetables"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 py-20 lg:px-12">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              Now delivering in your area
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-background mb-6 leading-tight">
            Fresh Groceries
            <span className="block text-accent">In 10 Minutes</span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-background/95 mb-8 font-medium">
            Premium quality groceries delivered to your doorstep at lightning
            speed
          </p>

          {/* CTA Buttons */}
          {/* <div className="flex flex-wrap gap-4 mb-12">
            <Button variant="hero" size="lg" className="group">
              <ShoppingBag className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Start Shopping
            </Button>
            <Button variant="accent" size="lg" className="group">
              <Clock className="mr-2 h-5 w-5" />
              Order Now
            </Button>
          </div> */}

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm px-5 py-3 rounded-full shadow-md">
              <Truck className="h-5 w-5 text-accent" />
              <span className="font-semibold text-foreground">
                10 Min Delivery
              </span>
            </div>
            <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm px-5 py-3 rounded-full shadow-md">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">100% Fresh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;// // import { Button } from "@/components/ui/button";
// import { ShoppingBag, Clock, Truck } from "lucide-react";
// import heroImage from "../../assets/hero-groceries.jpg";
// import React from "react";

// const HeroSection = () => {
//   return (
//     <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-b from-secondary/30 to-background">
//       {/* Hero Image with Overlay */}
//       <div className="absolute inset-0 z-0">
//         <img
//           src={heroImage}
//           alt="Fresh Groceries - Organic fruits and vegetables"
//           className="w-full h-full object-cover"
//         />
//         <div
//           className="absolute inset-0"
//           style={{ background: "var(--gradient-hero)" }}
//         />
//       </div>

//       {/* Content */}
//       <div className="container relative z-10 mx-auto px-6 py-20 lg:px-12">
//         <div className="max-w-2xl">
//           {/* Badge */}
//           <div className="inline-flex items-center gap-2 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-lg">
//             <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
//             <span className="text-sm font-medium text-foreground">
//               Now delivering in your area
//             </span>
//           </div>

//           {/* Main Heading */}
//           <h1 className="text-5xl md:text-7xl font-bold text-background mb-6 leading-tight">
//             Fresh Groceries
//             <span className="block text-accent">In 10 Minutes</span>
//           </h1>

//           {/* Description */}
//           <p className="text-xl md:text-2xl text-background/95 mb-8 font-medium">
//             Premium quality groceries delivered to your doorstep at lightning
//             speed
//           </p>

//           {/* CTA Buttons using common Button */}
//           {/* <div className="flex flex-wrap gap-4 mb-12">
//             <Button variant="hero" size="lg" className="group">
//               <ShoppingBag className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
//               Start Shopping
//             </Button>
//             <Button variant="accent" size="lg" className="group">
//               <Clock className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
//               Order Now
//             </Button>
//           </div> */}

//           {/* Feature Pills */}
//           <div className="flex flex-wrap gap-4">
//             <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm px-5 py-3 rounded-full shadow-md">
//               <Truck className="h-5 w-5 text-accent" />
//               <span className="font-semibold text-foreground">
//                 10 Min Delivery
//               </span>
//             </div>
//             <div className="flex items-center gap-2 bg-background/90 backdrop-blur-sm px-5 py-3 rounded-full shadow-md">
//               <ShoppingBag className="h-5 w-5 text-primary" />
//               <span className="font-semibold text-foreground">100% Fresh</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Decorative Element */}
//       <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
//     </section>
//   );
// };

// export default HeroSection;
