import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-lg text-white flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-project-diagram text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">TeamFlow</h1>
          <p className="text-gray-600 mt-1">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-circle-notch fa-spin mr-2"></i>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-6">
          <p className="text-center text-sm text-gray-600">
            Demo accounts:
          </p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div 
              className="border border-gray-200 p-2 rounded text-sm hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => {
                setEmail('admin@example.com');
                setPassword('admin');
              }}
            >
              <div className="font-medium">Admin</div>
              <div className="text-gray-500">admin@example.com</div>
            </div>
            <div 
              className="border border-gray-200 p-2 rounded text-sm hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => {
                setEmail('employee@example.com');
                setPassword('employee');
              }}
            >
              <div className="font-medium">Employee</div>
              <div className="text-gray-500">employee@example.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;