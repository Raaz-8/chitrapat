const About = () => {
  return (
    <div className=" min-h-screen flex flex-col items-center py-12 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto bg-[#47424281] p-8 rounded-lg shadow-lg">
      <div className="max-w-3xl text-center">
      <h1 className="text-4xl font-bold text-[#F30045] mb-6">About Chitrapat</h1>
      <p className="text-gray-300 text-lg leading-relaxed">
        Welcome to <span className="text-[#F30045] font-semibold">Chitrapat</span> – a movie rating website built for learning purposes. This platform allows users to explore movies, rate them, and share their thoughts through reviews.
      </p>
    </div>

    <div className="max-w-3xl mt-8">
      <h2 className="text-2xl font-semibold text-[#F30045] mb-4">Why Chitrapat?</h2>
      <p className="text-gray-400 leading-relaxed">
        Chitrapat is a passion project designed to improve development skills while creating an engaging platform for movie enthusiasts. We aim to offer an easy-to-use interface where users can browse trending, top-rated, and newly released films.
      </p>
    </div>

    <div className="max-w-3xl mt-8">
      <h2 className="text-2xl font-semibold text-[#F30045] mb-4">Data Source & Disclaimer</h2>
      <p className="text-gray-400 leading-relaxed">
        Chitrapat uses data from <span className="text-[#F30045] font-semibold">The Movie Database (TMDb)</span> API. However, Chitrapat does not hold any rights over the movie data displayed. Movie posters, details, and metadata belong to their respective copyright owners.
      </p>
    </div>

    <div className="max-w-3xl mt-8">
      <h2 className="text-2xl font-semibold text-[#F30045] mb-4">User Experience</h2>
      <p className="text-gray-400 leading-relaxed">
        To rate or comment on a movie, users must log in. Ratings and reviews are stored in the Chitrapat database and do not affect TMDb ratings.
      </p>
    </div>

    <div className="max-w-3xl mt-8">
    <h2 className="text-2xl font-semibold text-[#F30045] mt-10 mb-4">Badges & Rewards System</h2>
        <p className="text-gray-400 mb-4">To make interactions more engaging, users can earn badges based on their activity:</p>
        <ul className="list-disc list-inside text-gray-400">
          <li><strong>🏆 Cinephile</strong> – Joined the platform</li>
          <li><strong>✍️ First Critic</strong> – Rated 1st movie</li>
          <li><strong>🎬 Star Giver</strong> – Rating without comments</li>
          <li><strong>🔥 Silent Observer</strong> – Visiting Chitrapat Regulary without giving ratings</li>
          <li><strong>🎖️ Top Reviewer</strong> – Rated 25+ movies</li>
        </ul>

        <h2 className="text-2xl font-semibold text-[#F30045] mt-10 mb-4">Smart Movie Suggestions</h2>
        <p className="text-gray-400 mb-4">
          Chitrapat offers personalized recommendations based on:
        </p>
        <ul className="list-disc list-inside text-gray-400">
          <li>Your most-watched genres</li>
          <li>Your highest-rated movies</li>
          <li>Community trends & top-rated reviews</li>
        </ul>
    </div>
      </div>
    </div>
  );
};

export default About;
