import React from 'react';
import Navigation from './Navigation';

const BrowseCourses: React.FC = () => (
  <div>
    <Navigation />
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Browse Courses</h1>
      <p>Explore available courses and enroll.</p>
    </main>
  </div>
);

export default BrowseCourses;
