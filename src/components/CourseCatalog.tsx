import React from 'react';
import Navigation from './Navigation';

const CourseCatalog: React.FC = () => {
  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Course Catalog</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample course cards */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Introduction to React</h3>
                <p className="mt-2 text-sm text-gray-500">Learn the basics of React development.</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Enroll</button>
              </div>
            </div>
            {/* Add more courses */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseCatalog;