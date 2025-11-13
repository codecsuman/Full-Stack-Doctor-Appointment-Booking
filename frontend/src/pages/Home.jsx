import React from "react";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";

const Home = () => {
  return (
    // Primary Container: Sets the soft background and ensures content fills the screen.
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* Header component */}
      <Header />

      {/* Main Content: Uses the semantic <main> tag */}
      <main>
        {/* Responsive Container: Centers content and applies consistent padding */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section 1: Speciality Menu */}
          <section className="py-12 md:py-16">
            <h2 className="text-3xl font-extrabold text-center mb-10">
              Find a <span className="text-primary">Specialist</span>
            </h2>
            <SpecialityMenu />
          </section>

          {/* Section 2: Top Doctors */}
          <section className="py-12 md:py-16">
            <h2 className="text-3xl font-extrabold text-center mb-10">
              Our <span className="text-primary">Top Rated</span> Doctors
            </h2>
            <TopDoctors />
          </section>

        </div>
        {/* End Responsive Container */}

        {/* Section 3: Banner/CTA (Often slightly visually separated) */}
        <section className="py-12 md:py-16 bg-white shadow-inner">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Banner />
          </div>
        </section>

      </main>

      {/* FOOTER IS EXCLUDED AS REQUESTED */}

    </div>
  );
};

export default Home;