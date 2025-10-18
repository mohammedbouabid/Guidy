import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import React from "react";

const products = [
  {
    id: 1,
    title: "Morocco Adventure Tour",
    price: "$450.00",
    rating: 5,
    reviews: 131,
    images: [
      "https://imgs.search.brave.com/PtcKaW6xkgaQ5UU4nY7zCFPp90BWShuy3AGahvlJuEk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by90/cmF2ZWwtY29uY2Vw/dC13aXRoLWxhbmRt/YXJrc18yMy0yMTQ5/MTUzMjU2LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA",
      "https://imgs.search.brave.com/bSHWWNN-OrOBOZ3Bza4eY39z4gPXxIyNEyFmGZA3NiI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by90b3VyaXNtLWRh/eS1zdWl0Y2FzZS1j/b2xsYWdlcy1kZXNp/Z25fMjMtMjE1MTcy/MTc1NS5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQwJnE9ODA",
      "https://imgs.search.brave.com/dWyDS9NESEbTGKaXP0WfXqf7SYimQyninwP8d_8YE2Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzc4LzEzLzQ5/LzM2MF9GXzE3ODEz/NDk5OF83VkJEaFlr/b0xCY284aHFEWDlT/bVFCc1AwUFBoWk5C/Vy5qcGc",
    ],
    buttonText: "Edit Pack",
    isFavorited: false,
  },
  {
    id: 2,
    title: "Sahara Desert Experience",
    price: "$600.00",
    rating: 5,
    reviews: 64,
    images: [
      "https://imgs.search.brave.com/PtcKaW6xkgaQ5UU4nY7zCFPp90BWShuy3AGahvlJuEk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by90/cmF2ZWwtY29uY2Vw/dC13aXRoLWxhbmRt/YXJrc18yMy0yMTQ5/MTUzMjU2LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA",
      "https://imgs.search.brave.com/bSHWWNN-OrOBOZ3Bza4eY39z4gPXxIyNEyFmGZA3NiI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by90b3VyaXNtLWRh/eS1zdWl0Y2FzZS1j/b2xsYWdlcy1kZXNp/Z25fMjMtMjE1MTcy/MTc1NS5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQwJnE9ODA",
      "https://imgs.search.brave.com/dWyDS9NESEbTGKaXP0WfXqf7SYimQyninwP8d_8YE2Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzc4LzEzLzQ5/LzM2MF9GXzE3ODEz/NDk5OF83VkJEaFlr/b0xCY284aHFEWDlT/bVFCc1AwUFBoWk5C/Vy5qcGc",
    ],
    buttonText: "Edit Pack",
    isFavorited: true,
  },
  {
    id: 3,
    title: "Minimal Chair Tool",
    price: "$24.59",
    rating: 5,
    reviews: 63,
    images: [
      "https://imgs.search.brave.com/PtcKaW6xkgaQ5UU4nY7zCFPp90BWShuy3AGahvlJuEk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by90/cmF2ZWwtY29uY2Vw/dC13aXRoLWxhbmRt/YXJrc18yMy0yMTQ5/MTUzMjU2LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA",
      "https://imgs.search.brave.com/bSHWWNN-OrOBOZ3Bza4eY39z4gPXxIyNEyFmGZA3NiI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by90b3VyaXNtLWRh/eS1zdWl0Y2FzZS1j/b2xsYWdlcy1kZXNp/Z25fMjMtMjE1MTcy/MTc1NS5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQwJnE9ODA",
      "https://imgs.search.brave.com/dWyDS9NESEbTGKaXP0WfXqf7SYimQyninwP8d_8YE2Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzc4LzEzLzQ5/LzM2MF9GXzE3ODEz/NDk5OF83VkJEaFlr/b0xCY284aHFEWDlT/bVFCc1AwUFBoWk5C/Vy5qcGc",
    ],
    buttonText: "Edit Product",
    isFavorited: false,
  },
  {
    id: 4,
    title: "Amazfit Vip",
    price: "$78.35",
    rating: 5,
    reviews: 154,
    images: [
      "https://imgs.search.brave.com/PtcKaW6xkgaQ5UU4nY7zCFPp90BWShuy3AGahvlJuEk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by90/cmF2ZWwtY29uY2Vw/dC13aXRoLWxhbmRt/YXJrc18yMy0yMTQ5/MTUzMjU2LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA",
      "https://imgs.search.brave.com/bSHWWNN-OrOBOZ3Bza4eY39z4gPXxIyNEyFmGZA3NiI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by90b3VyaXNtLWRh/eS1zdWl0Y2FzZS1j/b2xsYWdlcy1kZXNp/Z25fMjMtMjE1MTcy/MTc1NS5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQwJnE9ODA",
      "https://imgs.search.brave.com/dWyDS9NESEbTGKaXP0WfXqf7SYimQyninwP8d_8YE2Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzc4LzEzLzQ5/LzM2MF9GXzE3ODEz/NDk5OF83VkJEaFlr/b0xCY284aHFEWDlT/bVFCc1AwUFBoWk5C/Vy5qcGc",
    ],
    buttonText: "Add To Cart",
    isFavorited: false,
  },
  {
    id: 5,
    title: "Gumbo Mouse",
    price: "$32.42",
    rating: 5,
    reviews: 35,
    images: [
      "https://imgs.search.brave.com/PtcKaW6xkgaQ5UU4nY7zCFPp90BWShuy3AGahvlJuEk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by90/cmF2ZWwtY29uY2Vw/dC13aXRoLWxhbmRt/YXJrc18yMy0yMTQ5/MTUzMjU2LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA",
      "https://imgs.search.brave.com/bSHWWNN-OrOBOZ3Bza4eY39z4gPXxIyNEyFmGZA3NiI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by90b3VyaXNtLWRh/eS1zdWl0Y2FzZS1j/b2xsYWdlcy1kZXNp/Z25fMjMtMjE1MTcy/MTc1NS5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQwJnE9ODA",
      "https://imgs.search.brave.com/dWyDS9NESEbTGKaXP0WfXqf7SYimQyninwP8d_8YE2Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzc4LzEzLzQ5/LzM2MF9GXzE3ODEz/NDk5OF83VkJEaFlr/b0xCY284aHFEWDlT/bVFCc1AwUFBoWk5C/Vy5qcGc",
    ],
    buttonText: "Add To Cart",
    isFavorited: false,
  },
  {
    id: 6,
    title: "Camera Tripod",
    price: "$50.00",
    rating: 5,
    reviews: 535,
    images: [
      "https://imgs.search.brave.com/PtcKaW6xkgaQ5UU4nY7zCFPp90BWShuy3AGahvlJuEk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by90/cmF2ZWwtY29uY2Vw/dC13aXRoLWxhbmRt/YXJrc18yMy0yMTQ5/MTUzMjU2LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA",
      "https://imgs.search.brave.com/bSHWWNN-OrOBOZ3Bza4eY39z4gPXxIyNEyFmGZA3NiI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by90b3VyaXNtLWRh/eS1zdWl0Y2FzZS1j/b2xsYWdlcy1kZXNp/Z25fMjMtMjE1MTcy/MTc1NS5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQwJnE9ODA",
      "https://imgs.search.brave.com/dWyDS9NESEbTGKaXP0WfXqf7SYimQyninwP8d_8YE2Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzc4LzEzLzQ5/LzM2MF9GXzE3ODEz/NDk5OF83VkJEaFlr/b0xCY284aHFEWDlT/bVFCc1AwUFBoWk5C/Vy5qcGc",
    ],
    buttonText: "Add To Cart",
    isFavorited: false,
  },
];

export const PacksGuid = () => {
  return (
    <section className="w-full py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="bg-white rounded-[14px] shadow-[6px_6px_54px_#0000000d] overflow-hidden"
          >
            <CardContent className="p-0">
              <div className="relative aspect-[4/3]">
                <img
                  className="w-full h-full object-cover"
                  alt={product.title}
                  src={product.images[0]} // Using first image as main
                />
                <button className="absolute top-1/2 -translate-y-1/2 left-4 w-10 h-10 flex items-center justify-center bg-white/80 rounded-full hover:bg-white transition-colors">
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <button className="absolute top-1/2 -translate-y-1/2 right-4 w-10 h-10 flex items-center justify-center bg-white/80 rounded-full hover:bg-white transition-colors">
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-bold text-[#202224] text-lg leading-5">
                  {product.title}
                </h3>

                <div className="font-bold text-[#EB662B] text-base leading-5">
                  {product.price}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className="w-4 h-4 fill-[#EB662B] text-[#EB662B]"
                      />
                    ))}
                  </div>
                  <span className="opacity-40 font-semibold text-black text-sm">
                    ({product.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button className="bg-[#e2eaf8] hover:bg-[#d2dae8] text-[#202224] font-bold text-sm rounded-xl h-auto py-2 px-6">
                    {product.buttonText}
                  </Button>

                  <button className="w-10 h-10 flex items-center justify-center hover:text-[#EB662B] transition-colors">
                    <Heart
                      className={`w-6 h-6 ${
                        product.isFavorited
                          ? "fill-[#EB662B] text-[#EB662B]"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PacksGuid;
