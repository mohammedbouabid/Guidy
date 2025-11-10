import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "Can I get the refund?",
    answer:
      "For a full refund, cancellation must be made at least 24 hours in advance of the start of the experience. Discover and book the tour with peace of mind."
  },
  {
    question: "Can I change the travel date?",
    answer:
      "Yes, you can request a change up to 48 hours before the tour starts, subject to availability."
  },
  {
    question: "When and where does the tour end?",
    answer:
      "The tour ends at the same meeting point where it started, unless otherwise specified in your booking details."
  },
  {
    question: "Do you arrange airport transfers?",
    answer:
      "Airport transfers are not included in this package, but we can help arrange them upon request."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#05073c]">
          Frequently Asked Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="py-4 cursor-pointer">
              <button
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="font-medium text-gray-800">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 " />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
