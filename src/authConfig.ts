import type { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "64666110-7eb6-4c16-8647-053ec8675b1d", // Replace with actual client ID
    authority:
      "https://login.microsoftonline.com/7a5bf294-6ae8-47c4-b0c4-b2f9166d7a3f", // Replace with tenant ID
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: [
    "User.Read",
    "Calendars.Read",
    "Files.ReadWrite",
    "Sites.ReadWrite.All",
    "TeamsApp.ReadWrite",
  ],
};
