// Create a new item with managed metadata value and set Title to term label
export async function createCourseSubjectItem(
  term: { termId: string, label: string },
  accessToken: string,
  userEmail: string // Add userEmail as a parameter
) {
  const client = getGraphClient(accessToken);
  // Step 1: POST only Title
  const minimalPayload = {
    fields: {
      Title: term.label
    }
  };
  console.log("POST minimal payload:", minimalPayload);
  try {
    const response = await client
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .post(minimalPayload);
    console.log("Minimal payload response:", response);

    // Step 2: PATCH StarredBy only
    if (response.id) {
      const patchStarredBy = {
        StarredBy: [{ email: userEmail }]
      };
      console.log("PATCH StarredBy payload:", patchStarredBy);
      try {
        const patchStarredByResponse = await client
          .api(`/sites/${siteId}/lists/${listId}/items/${response.id}/fields`)
          .patch(patchStarredBy);
        console.log("PATCH StarredBy response:", patchStarredByResponse);
      } catch (err) {
        if (
          err &&
          typeof err === "object" &&
          "response" in err &&
          (err as { response?: { text?: () => Promise<string> } }).response?.text
        ) {
          const errorText = await (err as { response: { text: () => Promise<string> } }).response.text();
          console.error("Graph API error response (StarredBy):", errorText);
        }
        console.error("Error patching StarredBy", err);
      }
    }

    // Step 3: PATCH e365_LearningFunction only
    if (response.id) {
      const patchTaxonomy = {
        e365_LearningFunction: {
          TermGuid: term.termId,
          Label: term.label,
          WssId: -1
        }
      };
      console.log("PATCH taxonomy payload:", patchTaxonomy);
      try {
        const patchTaxonomyResponse = await client
          .api(`/sites/${siteId}/lists/${listId}/items/${response.id}/fields`)
          .patch(patchTaxonomy);
        console.log("PATCH taxonomy response:", patchTaxonomyResponse);
      } catch (err) {
        if (
          err &&
          typeof err === "object" &&
          "response" in err &&
          (err as { response?: { text?: () => Promise<string> } }).response?.text
        ) {
          const errorText = await (err as { response: { text: () => Promise<string> } }).response.text();
          console.error("Graph API error response (taxonomy):", errorText);
        }
        console.error("Error patching taxonomy field", err);
      }
    }
    return response;
  } catch (err) {
    if (
      err &&
      typeof err === "object" &&
      "response" in err &&
      (err as { response?: { text?: () => Promise<string> } }).response?.text
    ) {
      const errorText = await (err as { response: { text: () => Promise<string> } }).response.text();
      console.error("Graph API error response:", errorText);
    }
    console.error("Error creating course subject item", err);
    throw err;
  }
}
// Get starred items for a user (by email)
export async function getStarredItemsForUser(userEmail: string, accessToken: string) {
  const client = getGraphClient(accessToken);
  // Filter items where StarredBy contains the user email
  const filter = `fields/StarredBy/any(u:u/email eq '${userEmail}')`;
  try {
    const response = await client
      .api(`/sites/${siteId}/lists/${listId}/items`)
      .filter(filter)
      .get();
    return response.value || [];
  } catch (err) {
    console.error("Error fetching starred items for user", err);
    throw err;
  }
}
import { Client } from "@microsoft/microsoft-graph-client";
import React from "react";

const siteId = "365evergreen.sharepoint.com,e67b7043-0a51-4a1c-be01-a10b810c5e82,4e9c91e4-aa21-4248-a191-2846c1ad21dd";
const listId = "7a7ce272-9995-4a68-9d2a-e35f8af7d751";

export function getGraphClient(accessToken: string) {
  return Client.init({
    authProvider: (done) => done(null, accessToken),
  });
}

/**
 * PATCH StarredBy field for an existing item.
 * Usage: Call when you have an itemId and want to add a user to the StarredBy column.
 * Required properties:
 *   - itemId: string (ID of the existing item)
 *   - userEmail: string (email to add)
 *   - accessToken: string (Graph API token)
 * PATCH payload:
 *   {
 *     StarredBy: [{ email: userEmail }]
 *   }
 */
export async function addUserToStarredBy(itemId: string, userEmail: string, accessToken: string) {
  const client = getGraphClient(accessToken);
  await client
    .api(`/sites/${siteId}/lists/${listId}/items/${itemId}/fields`)
    .patch({
      StarredBy: [{ email: userEmail }],
    });
}

/**
 * PATCH StarredBy field to remove users for an existing item.
 * Usage: Call when you have an itemId and want to update the StarredBy column with a new list of emails.
 * Required properties:
 *   - itemId: string (ID of the existing item)
 *   - userEmails: string[] (array of emails to keep)
 *   - accessToken: string (Graph API token)
 * PATCH payload:
 *   {
 *     StarredBy: [{ email: ... }, ...]
 *   }
 */
export async function removeUserFromStarredBy(itemId: string, userEmails: string[], accessToken: string) {
  const client = getGraphClient(accessToken);
  await client
    .api(`/sites/${siteId}/lists/${listId}/items/${itemId}/fields`)
    .patch({
      StarredBy: userEmails.map(email => ({ email })),
    });
}

// Example React hook for starring/unstarring a subject
export function useStarredBy(itemId: string, userEmail: string, accessToken: string) {
  const [isStarred, setIsStarred] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Call this to add user to StarredBy
  const starSubject = async () => {
    setLoading(true);
    try {
      await addUserToStarredBy(itemId, userEmail, accessToken);
      setIsStarred(true);
    } catch (err) {
      console.error("Error starring subject:", err);
    } finally {
      setLoading(false);
    }
  };

  // Call this to remove user from StarredBy
  const unstarSubject = async (remainingEmails: string[]) => {
    setLoading(true);
    try {
      await removeUserFromStarredBy(itemId, remainingEmails, accessToken);
      setIsStarred(false);
    } catch (err) {
      console.error("Error unstarring subject:", err);
    } finally {
      setLoading(false);
    }
  };

  return { isStarred, loading, starSubject, unstarSubject };
}

// Usage in a component:
//
// const { isStarred, loading, starSubject, unstarSubject } = useStarredBy(itemId, userEmail, accessToken);
// <button onClick={starSubject} disabled={loading || isStarred}>Star</button>
// <button onClick={() => unstarSubject(remainingEmails)} disabled={loading || !isStarred}>Unstar</button>

/**
 * PATCH managed metadata value for e365_LearningFunction column on an existing item.
 * Usage: Call when you have an itemId and want to set the managed metadata value.
 * Required properties:
 *   - itemId: string (ID of the existing item)
 *   - term: { termId: string, label: string } (term GUID and label)
 *   - accessToken: string (Graph API token)
 * PATCH payload:
 *   {
 *     e365_LearningFunction: {
 *       TermGuid: term.termId,
 *       Label: term.label,
 *       WssId: 1
 *     }
 *   }
 */
export async function setCourseSubjectTerm(itemId: string, term: { termId: string, label: string }, accessToken: string) {
  const client = getGraphClient(accessToken);
  const singleValuePayload = {
    e365_LearningFunction: {
      TermGuid: term.termId,
      Label: term.label,
      WssId: 1 // Use 1 as default, matches UI value
    }
  };
  console.log("PATCH single-value taxonomy:", singleValuePayload);
  try {
    await client
      .api(`/sites/${siteId}/lists/${listId}/items/${itemId}/fields`)
      .patch(singleValuePayload);
  } catch (err) {
    console.error("Single-value taxonomy patch failed", err);
    throw err;
  }
}

// Example usage:
// await setCourseSubjectTerm(itemId, { termId: "TERM_GUID", label: "TERM_LABEL" }, accessToken);
