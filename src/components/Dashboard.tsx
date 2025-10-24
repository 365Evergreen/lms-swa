
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

interface DashboardProps {
  role: string;
}

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">LMS Dashboard - {role}</h1>
            <nav className="space-x-4">
              <Link to="/catalog" className="text-blue-600 hover:text-blue-800">Course Catalog</Link>
              {role === 'Content Editor' && <Link to="/editor" className="text-blue-600 hover:text-blue-800">Content Editor</Link>}
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500">Dashboard content for {role}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;