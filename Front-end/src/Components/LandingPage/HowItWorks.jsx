import React from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPinned, Smile } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      number: '01',
      title: 'Choose Destination',
      description: 'Browse amazing destinations across Morocco'
    },
    {
      icon: Calendar,
      number: '02',
      title: 'Book Adventure',
      description: 'Select dates and book with expert guides'
    },
    {
      icon: MapPinned,
      number: '03',
      title: 'Meet Guide',
      description: 'Connect with your professional guide'
    },
    {
      icon: Smile,
      number: '04',
      title: 'Enjoy Experience',
      description: 'Immerse in Moroccan beauty and culture'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            How <span className="text-[#EB662B]">It Works</span>
          </h2>
          <p className="text-base text-gray-600">
            Book your Moroccan adventure in four simple steps
          </p>
        </motion.div>

        {/* Steps - Simple Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Simple Small Card */}
                <div className="bg-white rounded-xl p-5 border-2 border-gray-100 hover:border-[#EB662B]/30 transition-all duration-300 h-full">
                  {/* Number */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#EB662B] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{step.number}</span>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-[#EB662B]/50 to-transparent" />
                  </div>

                  {/* Icon */}
                  <div className="mb-3">
                    <div className="w-12 h-12 rounded-lg bg-[#EB662B]/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#EB662B]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
