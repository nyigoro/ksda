import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRoutes } from '../utils/apiRoutes';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(apiRoutes.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result: { token?: string; error?: string } = await response.json();

      if (response.ok) {
        localStorage.setItem('api_secret', result.token);
        navigate('/'); // Redirect to home page on successful login
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (e: unknown) {
      let errorMessage = 'An unexpected error occurred.';
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      setError(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary dark:text-primary-light">Login</h1>
      {error && (
        <div className="p-3 mb-4 rounded-sm text-center bg-error/10 text-error dark:text-neutral-200 dark:bg-neutral-700">
          {error}
        </div>
      )}
      <form onSubmit={(e) => { void handleSubmit(e); }} className="bg-white shadow-md rounded-sm px-8 pt-6 pb-8 mb-4 dark:bg-neutral-800">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-neutral-300" htmlFor="username">Username</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-primary focus:ring-primary sm:text-sm dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:focus:border-primary-light dark:focus:ring-primary-light"
            id="username" type="text" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value); }} required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-neutral-300" htmlFor="password">Password</label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-primary focus:ring-primary sm:text-sm dark:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600 dark:focus:border-primary-light dark:focus:ring-primary-light"
            id="password" type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); }} required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-xs hover:bg-primary-dark focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-primary-dark dark:hover:bg-secondary-dark dark:focus:ring-primary-light"
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
