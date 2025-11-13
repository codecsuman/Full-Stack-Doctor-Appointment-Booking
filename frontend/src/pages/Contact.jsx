import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    // Added container for better spacing
    <div className="container mx-auto px-4 py-10">
      {/* --- Section 1: CONTACT US Heading --- */}
      <div className="text-center text-3xl sm:text-4xl pt-10 mb-12 text-gray-500 font-light">
        <p>
          GET IN <span className="text-primary font-extrabold tracking-wider">TOUCH</span>
        </p>
      </div>

      {/* --- Section 2: Image and Contact Details --- */}
      <div className="my-10 flex flex-col justify-center md:flex-row gap-12 lg:gap-20 mb-16 text-base items-center">
        {/* Image */}
        <div className="w-full md:w-2/5 lg:w-1/3 relative shadow-2xl rounded-xl overflow-hidden">
          <img
            className="w-full h-auto object-cover rounded-xl"
            src={assets.contact_image}
            alt="Contact us image: a person on the phone"
          />
        </div>

        {/* Contact Details and Career CTA */}
        <div className="flex flex-col justify-center items-start gap-8 md:w-3/5 lg:w-2/3">

          {/* Office Info */}
          <div>
            <p className="font-extrabold text-xl text-primary border-b-2 border-primary pb-1 mb-3">OUR OFFICE</p>
            <p className="text-gray-600 leading-relaxed">
              <span className="font-semibold">Prescripto HQ:</span> 54709 Willms Station <br /> Suite 350, Washington, USA
            </p>
          </div>

          {/* Contact Methods */}
          <div>
            <p className="font-extrabold text-xl text-primary border-b-2 border-primary pb-1 mb-3">CONTACT</p>
            <p className="text-gray-600 leading-relaxed">
              <span className="font-semibold">Tel:</span> (415) 555-0132 <br />
              <span className="font-semibold">Email:</span> greatstackdev@gmail.com
            </p>
          </div>

          {/* Careers CTA */}
          <div className="mt-4">
            <p className="font-extrabold text-xl text-gray-800">
              CAREERS AT PRESCRIPTO
            </p>

            <p className="text-gray-600 mt-2">
              Learn more about our teams and job openings. We're looking for passionate individuals!
            </p>
          </div>

          {/* --- EXPLORE JOBS BUTTON with Beautiful Hover Effect --- */}
          <button
            className="
              // Base Styling
              bg-white 
              border 
              border-primary 
              text-primary 
              font-bold 
              px-10 py-3 
              text-base 
              rounded-full 
              shadow-md

              // Beautiful Hover Effect
              hover:bg-primary 
              hover:text-white 
              hover:shadow-lg 
              hover:scale-[1.02] 
              active:scale-[0.98] 
              transition-all 
              duration-300
              ease-in-out
            "
          >
            Explore Jobs
          </button>
        </div>
      </div>

      <hr className="my-16 border-t-2 border-gray-100" />

      {/* --- Section 3: Contact Form --- */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-700 text-center mb-10">
          Send Us A <span className="text-primary">Message</span>
        </h2>

        <form className="bg-white p-8 sm:p-12 shadow-2xl rounded-xl border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Your Full Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-150"
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-150"
                required
              />
            </div>

          </div>

          {/* Subject */}
          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              placeholder="E.g., Partnership Inquiry"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-150"
              required
            />
          </div>

          {/* Message */}
          <div className="mb-8">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              rows="5"
              placeholder="How can we help you today?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition duration-150 resize-none"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="
              w-full 
              bg-primary 
              text-white 
              font-extrabold 
              py-3 
              rounded-lg 
              shadow-lg
              hover:bg-primary-dark // Assuming a darker primary variant for hover
              hover:shadow-xl
              hover:scale-[1.005]
              transition-all duration-300
            "
          >
            Send Message
          </button>

        </form>
      </div>

    </div>
  );
};

export default Contact;