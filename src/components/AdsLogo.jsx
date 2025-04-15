import React from "react";

function AdsLogo() {
  return (
    <div className="w-full bg-[#d9d5d4] grid grid-cols-3 gap-4 items-center justify-items-center py-6 px-4">
      <img
        src="/assets/grab-food-seeklogo.png"
        alt="Grab Food"
        className="h-10 object-contain"
      />
      <img
        src="/assets/shopee-food-indonesia-seeklogo.png"
        alt="Shopee Food"
        className="h-10 object-contain"
      />
      <img
        src="/assets/tiktok-shop-seeklogo.png"
        alt="Tiktok Shop"
        className="h-10 object-contain"
      />
    </div>
  );
}

export default AdsLogo;
