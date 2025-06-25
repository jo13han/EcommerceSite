"use client";
import { FiPhone, FiMail } from "react-icons/fi";

export default function ContactSection() {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12">
      <div className="text-sm text-gray-500 mb-8 flex gap-2">
        <span>Home</span>
        <span>/</span>
        <span className="text-black">Contact</span>
      </div>
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-2 py-6 md:py-12">
        <div className="bg-white rounded-lg shadow p-4 sm:p-8 flex flex-col gap-8 max-w-lg w-full mx-auto md:mx-0">
          <div className="flex gap-4 items-start">
            <div className="bg-[#DB4444] rounded-full p-3 mt-1">
              <FiPhone className="text-white text-2xl" />
            </div>
            <div>
              <div className="font-semibold text-black mb-1">Call Us</div>
              <div className="text-gray-600 mb-2">We are available 24/7, 7 days a week.</div>
              <div className="text-black font-medium">Phone: +8801611112222</div>
            </div>
          </div>
          <hr className="my-2 border-gray-200" />
          <div className="flex gap-4 items-start">
            <div className="bg-[#DB4444] rounded-full p-3 mt-1">
              <FiMail className="text-white text-2xl" />
            </div>
            <div>
              <div className="font-semibold text-black mb-1">Write To Us</div>
              <div className="text-gray-600 mb-2">Fill out our form and we will contact you within 24 hours.</div>
              <div className="text-black">Emails: customer@exclusive.com</div>
              <div className="text-black">Emails: support@exclusive.com</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-8 flex-1 max-w-lg w-full mx-auto md:mx-0">
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
              <input type="text" placeholder="Name*" className="flex-1 min-w-0 bg-gray-50 border rounded px-4 py-3 outline-none text-slate-500 w-full" required />
              <input type="email" placeholder="Email*" className="flex-1 min-w-0 bg-gray-50 border rounded px-4 py-3 outline-none text-slate-500 w-full" required />
            </div>
            <textarea placeholder="Message" className="bg-gray-50 border rounded px-4 py-3 outline-none text-slate-500 min-h-[120px] md:min-h-[150px] w-full" required />
            <div className="flex justify-end">
              <button type="submit" className="bg-[#DB4444] text-white px-8 sm:px-10 py-3 rounded hover:opacity-90 transition-opacity font-medium w-full sm:w-auto">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
