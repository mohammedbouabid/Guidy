// src/components/Footer.jsx
import { FaCcVisa, FaCcMastercard, FaCcApplePay, FaCcDiscover, FaCcPaypal, FaCcAmex } from "react-icons/fa";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const onSubscribe = (e) => {
    e.preventDefault();
    // TODO: Add newsletter logic
  };

  return (
    <footer className="relative bg-[#FFF8F5] pt-10">
<div className="absolute -top-[1px] left-0 w-full overflow-hidden leading-none">
  <svg
    className="relative block w-full h-[70px]"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
  >
    <path
      d="M0,0V46.29c47.26,22.56,104.6,29.37,158,17.39C230.4,49.83,284.3,16.07,339,6.23c54.2-9.77,109.9,6.14,163.7,24.91C564,49.86,618,74.3,673,77.2c60.2,3.2,113.9-19.86,172.1-33.92C944.5,27.89,1013.4,21.2,1079,28.38c48.8,5.35,95.3,19.47,121,30.49V0Z"
      fill="#fafafa"
    />
  </svg>
</div>



      {/* === MAIN FOOTER CONTENT === */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top section: call & socials */}
        <div className="flex flex-col items-center justify-between gap-4 py-10 md:flex-row">
          <p className="text-center text-sm text-gray-700">
            Speak to our expert at{" "}
            <a href="tel:18004536744" className="font-semibold text-orange-600">
              1-800-453-6744
            </a>
          </p>          
          

        </div>

        <hr className="border-orange-100" />

        {/* === Footer Columns === */}
        <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Contact</h3>
            <address className="not-italic text-sm text-gray-600">
              328 Queensberry Street, North Melbourne VIC 3051, Australia.
              <br />
              <a href="mailto:hi@viatours.com" className="mt-3 inline-block text-gray-700 hover:text-gray-900">
                hi@viatours.com
              </a>
            </address>


         <div className="text-sm font-medium text-gray-700 mt-6">Follow Us</div> <br />



            <div className="flex items-center gap-4 mt-1">
              
  <a href="#" aria-label="Facebook" className="bg-[#1877F2]/10 text-[#1877F2] p-2 rounded-full hover:bg-[#1877F2]/20 transition-all">
    <Facebook className="h-5 w-5" />
  </a>
  <a href="#" aria-label="Instagram" className="bg-[#E1306C]/10 text-[#E1306C] p-2 rounded-full hover:bg-[#E1306C]/20 transition-all">
    <Instagram className="h-5 w-5" />
  </a>
  <a href="#" aria-label="Twitter" className="bg-[#1DA1F2]/10 text-[#1DA1F2] p-2 rounded-full hover:bg-[#1DA1F2]/20 transition-all">
    <Twitter className="h-5 w-5" />
  </a>
  <a href="#" aria-label="YouTube" className="bg-[#FF0000]/10 text-[#FF0000] p-2 rounded-full hover:bg-[#FF0000]/20 transition-all">
    <Youtube className="h-5 w-5" />
  </a>
</div>

          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">About Us</a></li>
              <li><a href="#" className="hover:text-gray-900">Tourz Reviews</a></li>
              <li><a href="#" className="hover:text-gray-900">Contact Us</a></li>
              <li><a href="#" className="hover:text-gray-900">Travel Guides</a></li>
              <li><a href="#" className="hover:text-gray-900">Data Policy</a></li>
              <li><a href="#" className="hover:text-gray-900">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-gray-900">Legal</a></li>
              <li><a href="#" className="hover:text-gray-900">Sitemap</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Get in Touch</a></li>
              <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-900">Live Chat</a></li>
              <li><a href="#" className="hover:text-gray-900">How it Works</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Newsletter</h3>
            <p className="mb-4 text-sm text-gray-600">
              Subscribe to the free newsletter and stay up to date.
            </p>
            <form onSubmit={onSubscribe} className="flex w-full max-w-sm items-center gap-2">
              <input
                type="email"
                required
                placeholder="Your email address"
                className="w-full rounded-md border border-orange-100 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
              <button
                type="submit"
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm ring-1 ring-inset ring-orange-200 hover:bg-orange-100"
              >
                Send
              </button>
            </form>
          </div>

          {/* Mobile Apps */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Mobile Apps</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">iOS App</a></li>
              <li><a href="#" className="hover:text-gray-900">Android App</a></li>
            </ul>
          </div>
        </div>

        {/* === Bottom Strip === */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-orange-100 py-6 text-xs text-gray-500 md:flex-row">
          <p>© Copyright Viatours {year}</p>
<ul className="flex flex-wrap items-center justify-center gap-4 text-4xl text-gray-600">
  <li className="hover:text-blue-700 transition-colors"><FaCcVisa /></li>
  <li className="hover:text-orange-600 transition-colors"><FaCcMastercard /></li>
  <li className="hover:text-black transition-colors"><FaCcApplePay /></li>
  <li className="hover:text-orange-500 transition-colors"><FaCcDiscover /></li>
  <li className="hover:text-sky-700 transition-colors"><FaCcPaypal /></li>
  <li className="hover:text-blue-500 transition-colors"><FaCcAmex /></li>
</ul>

        </div>
      </div>
    </footer>
  );
}
