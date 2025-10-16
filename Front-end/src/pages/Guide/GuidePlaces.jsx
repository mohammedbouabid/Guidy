import React from "react";
import CardGuidePlace from "../../Components/GuidePlace/CardGuidePlace";

export default function GuidePlaces() {
  const guidePlaces = [
    {
      id: 1,
      name: "Paris Experience",
      price: 249.99,
       images: [
         "https://imgs.search.brave.com/dWyDS9NESEbTGKaXP0WfXqf7SYimQyninwP8d_8YE2Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzc4LzEzLzQ5/LzM2MF9GXzE3ODEz/NDk5OF83VkJEaFlr/b0xCY284aHFEWDlT/bVFCc1AwUFBoWk5C/Vy5qcGc",
         "https://imgs.search.brave.com/PtcKaW6xkgaQ5UU4nY7zCFPp90BWShuy3AGahvlJuEk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by90/cmF2ZWwtY29uY2Vw/dC13aXRoLWxhbmRt/YXJrc18yMy0yMTQ5/MTUzMjU2LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA",
        "https://imgs.search.brave.com/bSHWWNN-OrOBOZ3Bza4eY39z4gPXxIyNEyFmGZA3NiI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by90b3VyaXNtLWRh/eS1zdWl0Y2FzZS1j/b2xsYWdlcy1kZXNp/Z25fMjMtMjE1MTcy/MTc1NS5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQwJnE9ODA"
      ],
      rating: 4,
      reviews: 15,
    },
    {
      id: 2,
      name: "Paris Experience",
      price: 249.99,
      images: [
        "https://imgs.search.brave.com/PtcKaW6xkgaQ5UU4nY7zCFPp90BWShuy3AGahvlJuEk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by90/cmF2ZWwtY29uY2Vw/dC13aXRoLWxhbmRt/YXJrc18yMy0yMTQ5/MTUzMjU2LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA",
        "https://imgs.search.brave.com/dWyDS9NESEbTGKaXP0WfXqf7SYimQyninwP8d_8YE2Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzc4LzEzLzQ5/LzM2MF9GXzE3ODEz/NDk5OF83VkJEaFlr/b0xCY284aHFEWDlT/bVFCc1AwUFBoWk5C/Vy5qcGc",
        "https://imgs.search.brave.com/bSHWWNN-OrOBOZ3Bza4eY39z4gPXxIyNEyFmGZA3NiI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by90b3VyaXNtLWRh/eS1zdWl0Y2FzZS1j/b2xsYWdlcy1kZXNp/Z25fMjMtMjE1MTcy/MTc1NS5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQwJnE9ODA"
      ],
      rating: 4,
      reviews: 15,
    },
    {
      id: 3,
      name: "Paris Experience",
      price: 249.99,
       images: [
         "https://imgs.search.brave.com/bSHWWNN-OrOBOZ3Bza4eY39z4gPXxIyNEyFmGZA3NiI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by90b3VyaXNtLWRh/eS1zdWl0Y2FzZS1j/b2xsYWdlcy1kZXNp/Z25fMjMtMjE1MTcy/MTc1NS5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQwJnE9ODA",
        "https://imgs.search.brave.com/PtcKaW6xkgaQ5UU4nY7zCFPp90BWShuy3AGahvlJuEk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by90/cmF2ZWwtY29uY2Vw/dC13aXRoLWxhbmRt/YXJrc18yMy0yMTQ5/MTUzMjU2LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA",
        "https://imgs.search.brave.com/dWyDS9NESEbTGKaXP0WfXqf7SYimQyninwP8d_8YE2Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzc4LzEzLzQ5/LzM2MF9GXzE3ODEz/NDk5OF83VkJEaFlr/b0xCY284aHFEWDlT/bVFCc1AwUFBoWk5C/Vy5qcGc",
      ],
      rating: 4,
      reviews: 15,
    },
    {
      id: 4,
      name: "Paris Experience",
      price: 249.99,
       images: [
         "https://imgs.search.brave.com/PtcKaW6xkgaQ5UU4nY7zCFPp90BWShuy3AGahvlJuEk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by90/cmF2ZWwtY29uY2Vw/dC13aXRoLWxhbmRt/YXJrc18yMy0yMTQ5/MTUzMjU2LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA",
         "https://imgs.search.brave.com/bSHWWNN-OrOBOZ3Bza4eY39z4gPXxIyNEyFmGZA3NiI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by90b3VyaXNtLWRh/eS1zdWl0Y2FzZS1j/b2xsYWdlcy1kZXNp/Z25fMjMtMjE1MTcy/MTc1NS5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQwJnE9ODA",
        "https://imgs.search.brave.com/dWyDS9NESEbTGKaXP0WfXqf7SYimQyninwP8d_8YE2Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzc4LzEzLzQ5/LzM2MF9GXzE3ODEz/NDk5OF83VkJEaFlr/b0xCY284aHFEWDlT/bVFCc1AwUFBoWk5C/Vy5qcGc",
      ],
      rating: 4,
      reviews: 15,
    },
    {
      id: 5,
      name: "Paris Experience",
      price: 249.99,
       images: [
         "https://imgs.search.brave.com/PtcKaW6xkgaQ5UU4nY7zCFPp90BWShuy3AGahvlJuEk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by90/cmF2ZWwtY29uY2Vw/dC13aXRoLWxhbmRt/YXJrc18yMy0yMTQ5/MTUzMjU2LmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDAmcT04/MA",
         "https://imgs.search.brave.com/bSHWWNN-OrOBOZ3Bza4eY39z4gPXxIyNEyFmGZA3NiI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by90b3VyaXNtLWRh/eS1zdWl0Y2FzZS1j/b2xsYWdlcy1kZXNp/Z25fMjMtMjE1MTcy/MTc1NS5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQwJnE9ODA",
        "https://imgs.search.brave.com/dWyDS9NESEbTGKaXP0WfXqf7SYimQyninwP8d_8YE2Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzc4LzEzLzQ5/LzM2MF9GXzE3ODEz/NDk5OF83VkJEaFlr/b0xCY284aHFEWDlT/bVFCc1AwUFBoWk5C/Vy5qcGc",
      ],
      rating: 4,
      reviews: 15,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-3">Guide Places</h1>

        {/* Grid de cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guidePlaces.map((place) => (
            <CardGuidePlace key={place.id} place={place} />
          ))}
        </div>
      </div>
    </div>
  );
}
