import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CourseCatalog from './components/CourseCatalog';
import ContentEditor from './components/ContentEditor';
import Home from './components/Home';
import MyLearning from './components/MyLearning';
import BrowseCourses from './components/BrowseCourses';
import Help from './components/Help';
import Support from './components/Support';

function App() {
  const isAuthenticated = useIsAuthenticated();

  // For demo, assume role based on auth
  const userRole = isAuthenticated ? 'Course Participant' : '';

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard role={userRole} /> : <Login />} />
          <Route path="/my-learning" element={isAuthenticated ? <MyLearning /> : <Login />} />
          <Route path="/browse-courses" element={isAuthenticated ? <BrowseCourses /> : <Login />} />
          <Route path="/catalog" element={isAuthenticated ? <CourseCatalog /> : <Login />} />
          <Route path="/editor" element={isAuthenticated ? <ContentEditor /> : <Login />} />
          <Route path="/help" element={<Help />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
