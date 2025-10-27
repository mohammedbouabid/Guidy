import React from "react"

import flexibilityIcon from "../assets/icons/flexibilityIcon.png"
import experiencesIcon from "../assets/icons/experiencesIcon.png"
import qualityIcon from "../assets/icons/qualityIcon.png"
import supportIcon from "../assets/icons/supportIcon.png"

export default function Features() {
  const features = [
    {
      title: "Ultimate flexibility",
      description:
        "You're in control, with free cancellation and payment options to satisfy any plan or budget.",
      icon: flexibilityIcon,
    },
    {
      title: "Memorable experiences",
      description:
        "Browse and book tours and activities so incredible, you’ll want to tell your friends.",
      icon: experiencesIcon,
    },
    {
      title: "Quality at our core",
      description:
        "High-quality standards. Millions of reviews. A tour company.",
      icon: qualityIcon,
    },
    {
      title: "Award-winning support",
      description:
        "New place? New plan? No problem. We’re here to help, 24/7.",
      icon: supportIcon,
    },
  ]

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#05073c] mb-14">
          Why choose Guidy
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col items-center text-center"
            >
              <img
                src={feature.icon}
                alt={feature.title}
                className="h-12 w-12 mb-4 object-contain"
              />
              <h3 className="text-lg font-semibold text-[#05073c] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
