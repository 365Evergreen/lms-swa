import React from "react";
import { useStarredBy } from "../services/interestService";

interface StarSubjectProps {
  itemId: string;
  userEmail: string;
  accessToken: string;
  starredBy: string[]; // Array of emails currently in StarredBy
}

export const StarSubject: React.FC<StarSubjectProps> = ({ itemId, userEmail, accessToken, starredBy }) => {
  const { isStarred, loading, starSubject, unstarSubject } = useStarredBy(itemId, userEmail, accessToken);

  // Compute remaining emails for unstar
  const remainingEmails = starredBy.filter(email => email !== userEmail);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button
        onClick={starSubject}
        disabled={loading || isStarred}
        style={{
          padding: "8px 20px",
          borderRadius: 6,
          background: isStarred ? "#e6f0fa" : "#0078d4",
          color: isStarred ? "#0078d4" : "#fff",
          border: "none",
          fontWeight: 600,
          cursor: loading || isStarred ? "not-allowed" : "pointer"
        }}
      >
        {isStarred ? "Starred" : "Star"}
      </button>
      <button
        onClick={() => unstarSubject(remainingEmails)}
        disabled={loading || !isStarred}
        style={{
          padding: "8px 20px",
          borderRadius: 6,
          background: !isStarred ? "#f9f9f9" : "#d32f2f",
          color: !isStarred ? "#888" : "#fff",
          border: "none",
          fontWeight: 600,
          cursor: loading || !isStarred ? "not-allowed" : "pointer"
        }}
      >
        Unstar
      </button>
      {loading && <span style={{ color: "#888" }}>Processing...</span>}
    </div>
  );
};
