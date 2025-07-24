import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-gray-800">KSDA Songs</Link>
            <div className="flex space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-800">Home</Link>
              <Link to="/add" className="text-gray-600 hover:text-gray-800">Add Song</Link>
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
