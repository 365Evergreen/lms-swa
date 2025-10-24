import React from 'react';
import Navigation from './Navigation';

const MyLearning: React.FC = () => (
  <div>
    <Navigation />
      <main className="p-8 content-area">
        <div className="content-area">Hello, world!</div>
      <h1 className="text-2xl font-bold mb-4">My Learning</h1>
      <p>Track your enrolled courses and progress here.</p>
    </main>
  </div>
);

export default MyLearning;
