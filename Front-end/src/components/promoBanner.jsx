import React from "react";
import { Button } from "./ui/button"; // adjust path

const PromoBanner = () => {
  return (
    <section className="w-full py-12 px-[25px]">
      <div className="max-w-[1320px] mx-auto px-[25px]">
        <div
          className="relative w-full rounded-xl bg-cover bg-center overflow-hidden"
          style={{
            backgroundImage: "url('https://i.postimg.cc/mrTCM16g/image-1.png')",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 "></div>

          {/* Content */}
          <div className="relative z-10 max-w-[500px] py-16 px-10 text-left">
            <h2 className="font-bold text-[40px] leading-[52px] text-[#05073c]">
              Grab up to{" "}
              <span className="text-[#eb662b]">
                35% off
                <br />
              </span>
              on your favorite
              <br />
              Destination
            </h2>

            <p className="mt-6 text-[15px] leading-[28px] text-[#05073c]">
              Limited time offer, don’t miss the opportunity
            </p>

            <Button className="mt-8 w-[168px] h-[62px] bg-[#eb662b] hover:bg-[#d55a24] rounded-xl cursor-pointer">
              <span className="font-medium text-white text-[14px]">
                Book Now
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
