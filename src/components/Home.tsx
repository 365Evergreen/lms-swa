import React, { useEffect, useState } from 'react';
// Error boundary for rendering errors
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: 'red', padding: 16 }}>Something went wrong while rendering courses. Please check your SharePoint field mapping and try again.</div>;
    }
    return this.props.children;
  }
}
import { Carousel } from '@fluentui/react-components';
import Navigation from './Navigation';
import { CourseCard } from './CourseCard';
import { useMsal } from '@azure/msal-react';
import InterestPicker from './InterestPicker';


const siteId = '365evergreen.sharepoint.com,e67b7043-0a51-4a1c-be01-a10b810c5e82,4e9c91e4-aa21-4248-a191-2846c1ad21dd';
const listId = 'df8fd70f-a476-4840-a3a3-4bf3f1c0ee88';

interface Course {
  id: string;
  fields: {
    Title?: string;
    Description?: string;
    Duration?: string;
    Type?: string;
    IconUrl?: string;
    Author?: string;
    Views?: number;
    [key: string]: string | number | undefined;
  };
}

const Home: React.FC = () => {
  const { instance, accounts } = useMsal();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [rawApiResponse, setRawApiResponse] = useState<unknown>(null);

  // Replace with actual user first name source
  const firstName = 'Pauli';
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17 && hour < 24) greeting = 'Good evening';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const tokenResponse = await instance.acquireTokenSilent({
          scopes: ['Sites.ReadWrite.All'],
          account: accounts[0],
        });
        // Fetch raw response for debugging
        const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?$orderby=createdDateTime desc&$top=10&$expand=fields`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
            Accept: 'application/json',
          },
        });
        const data = await response.json();
        setRawApiResponse(data);
        setCourses(data.value || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    if (accounts.length) fetchCourses();
  }, [instance, accounts]);

  return (
    <div style={{ width: '100vw', maxWidth: '100%', minWidth: '100%', marginTop: 0, paddingTop: 90, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start' }}>
      <Navigation />
      <main className="p-8">
        <div className="content-area home">Hello, world!</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h1 className="text-2xl font-bold mb-4" style={{ marginBottom: 0 }}>{greeting}, {firstName}</h1>
          <div style={{ display: 'flex', alignItems: 'center', width: '350px', background: '#fff', borderRadius: '6px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <span style={{ marginLeft: '12px', color: '#888' }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search for a course"
              style={{
                border: 'none',
                outline: 'none',
                padding: '12px',
                fontSize: '16px',
                width: '100%',
                background: 'transparent',
                borderRadius: '6px',
              }}
            />
          </div>
        </div>
        <InterestPicker />
        <button
          style={{ margin: '16px 0', padding: '8px 16px', fontSize: '16px' }}
          onClick={() => alert(JSON.stringify(rawApiResponse, null, 2))}
        >
          Show Raw API Response
        </button>
        {loading ? (
          <div>Loading courses...</div>
        ) : (
            <ErrorBoundary>
              <div className="carousel-section">
                {courses.length > 0 ? (
                  <Carousel>
                    {courses.map((course) => (
                      <CourseCard
                        key={course.id}
                        title={course.fields.Title ?? ''}
                        description={course.fields.e365_CourseDescription !== undefined ? String(course.fields.e365_CourseDescription) : ''}
                        duration={course.fields.e365_Duration !== undefined ? String(course.fields.e365_Duration) : ''}
                        type={course.fields.e365_CourseLevel !== undefined ? String(course.fields.e365_CourseLevel) : ''}
                        iconUrl={course.fields.e365_CourseImage !== undefined ? String(course.fields.e365_CourseImageURL) : undefined}
                      />
                    ))}
                  </Carousel>
                ) : (
                  <div>No courses available.</div>
                )}
              </div>
            </ErrorBoundary>
        )}
        <p>Welcome to the LMS Home page.</p>
      </main>
    </div>
  );
};

export default Home;
