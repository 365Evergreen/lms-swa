import { client } from './authProvider';

export function addUserFromSubject(subjectId: string, userId: string) {
  // Example usage to avoid unused variable error
  console.log(`Adding user ${userId} to subject ${subjectId}`);
  // ...function logic...
}
// Add user to subject (Person column)

export async function addUserToSubject(itemId: string, personColumn: string, userEmail: string) {
  await client
    .api(`/sites/365evergreen.sharepoint.com,e67b7043-0a51-4a1c-be01-a10b810c5e82,4e9c91e4-aa21-4248-a191-2846c1ad21dd/lists/7a7ce272-9995-4a68-9d2a-e35f8af7d751/items/${itemId}/fields`)
    .patch({
      [personColumn]: [{ email: userEmail }]
    });
}
