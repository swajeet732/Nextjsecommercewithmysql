// src/pages/index.js
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to My E-commerce App</h1>
        <Link href="/signup">
          <a className="text-blue-500 hover:underline">Go to Signup</a>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
