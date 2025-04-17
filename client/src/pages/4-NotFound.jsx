import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-600">404</h1>
      <p className="text-xl text-gray-700 mt-4">Oops! The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate('/home')}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go to Homepage
      </button>
    </div>
  );
}
