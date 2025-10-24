// import { Client } from '@microsoft/microsoft-graph-client';
// import { ImplicitMSALAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/implicitMsal';

// export const getGraphClient = (pca: any) => {
//   const authProvider = new ImplicitMSALAuthenticationProvider(pca, {
//     scopes: ['User.Read', 'Calendars.Read', 'Files.ReadWrite', 'Sites.ReadWrite.All'],
//   });

//   return Client.initWithMiddleware({
//     authProvider,
//   });
// };

// export const getUserProfile = async (client: any) => {
//   return await client.api('/me').get();
// };


// Fetch top 10 recent items from SharePoint 'Courses' list
export const getCoursesFromSharePoint = async (siteId: string, listId: string, accessToken: string) => {
  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?$orderby=createdDateTime desc&$top=10&$expand=fields`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    console.error('CourseCarousel fetch failed:', response.status, await response.text());
    throw new Error('Failed to fetch courses from SharePoint');
  }
  const data = await response.json();
  console.log('Course list response:', data);
  if (!data || !data.value) {
    console.error('CourseCarousel: No value in response', data);
    return [];
  }
  return data.value;
};