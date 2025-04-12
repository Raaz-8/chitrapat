import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white px-4">
      <h1 className="text-9xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-2xl font-semibold mb-2">Page Not Found</p>
      <p className="text-center max-w-md text-gray-400 mb-6">
        Oops! The page you're looking for doesn’t exist or has been moved. Let's get you back on track.
      </p>
      <Link
        to="/"
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
