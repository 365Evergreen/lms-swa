// DataverseService.ts
// Service for connecting to Microsoft Dataverse from LMS frontend
import { PublicClientApplication } from '@azure/msal-browser';

const dataverseScope = 'https://<your-environment>.crm.dynamics.com/.default';
const dataverseApiUrl = 'https://<your-environment>.crm.dynamics.com/api/data/v9.2';

export async function getDataverseToken(msalInstance: PublicClientApplication) {
  const accounts = msalInstance.getAllAccounts();
  if (!accounts.length) throw new Error('No accounts found');
  return msalInstance.acquireTokenSilent({
    scopes: [dataverseScope],
    account: accounts[0],
  });
}

export async function fetchDataverseEntity(entity: string, msalInstance: PublicClientApplication) {
  const tokenResponse = await getDataverseToken(msalInstance);
  const response = await fetch(`${dataverseApiUrl}/${entity}`, {
    headers: {
      Authorization: `Bearer ${tokenResponse.accessToken}`,
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0',
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
  if (!response.ok) throw new Error('Dataverse API error');
  return response.json();
}

// Example usage:
// const courses = await fetchDataverseEntity('new_courses', msalInstance);
