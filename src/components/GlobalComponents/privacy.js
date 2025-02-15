import React from "react";

const Privacy = () => {

  return (
    <div className="min-h-screen  text-white py-12 px-6 md:px-16">
      <div className="max-w-4xl mx-auto bg-[#47424281] p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[#F30045] mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-300 text-sm text-center mb-8">
          Last Updated: 31/01/2025
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#F30045] mb-2">
            1. Data Collection & Usage
          </h2>
          <p className="text-gray-400">
            Users are required to <strong>log in</strong> before rating or commenting on a movie.
            User ratings and reviews are stored in <strong>Chitrapat's internal ratings database </strong>
            and do <strong>not</strong> modify TMDb’s official ratings.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#F30045] mb-2">
            2. Third-Party Services
          </h2>
          <p className="text-gray-400">
            Chitrapat uses <strong>The Movie Database (TMDb) API</strong> to fetch movie details, ratings,
            images, and other related data. We do <strong>not</strong> claim ownership over any data provided by TMDb.
          </p>
          <p className="text-gray-400 mt-2">
            For more details, visit
            <a
              href="https://www.themoviedb.org/documentation/api/terms-of-use"
              className="text-blue-400 hover:text-blue-500 ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              TMDb's Terms of Use
            </a>.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#F30045] mb-2">
            3. Intellectual Property & Disclaimer
          </h2>
          <p className="text-gray-400">
            Chitrapat does <strong>not</strong> host, distribute, or stream any movies or TV shows.
            All movie posters, descriptions, and related data are fetched from TMDb and remain the
            property of their respective owners.
          </p>
          <p className="text-gray-400 mt-2 italic border-l-4 border-[#F30045] pl-4">
            "This product uses the TMDb API but is not endorsed or certified by TMDb."
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#F30045] mb-2">
            4. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-400">
            We may update this Privacy Policy from time to time. Changes will be reflected on this
            page, and your continued use of the website implies your acceptance of these terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#F30045] mb-2">
            5. Contact Information
          </h2>
          <p className="text-gray-400">
            If you have any questions, please contact us at [Your Contact Email].
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
