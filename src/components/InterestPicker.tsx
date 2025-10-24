
import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { createCourseSubjectItem } from "../services/interestService";

const TERM_SET_ID = "1d71428c-e453-4cd7-8ce9-e93ff656f6d2"; // Example GUID, update as needed
const SITE_ID = "365evergreen.sharepoint.com,e67b7043-0a51-4a1c-be01-a10b810c5e82,4e9c91e4-aa21-4248-a191-2846c1ad21dd";

const InterestPicker = () => {
  const [terms, setTerms] = useState<{ id: string; labels: { name: string }[] }[]>([]);
  const [starred, setStarred] = useState<{ [termId: string]: boolean }>({});
  const { instance, accounts } = useMsal();

  useEffect(() => {
    const fetchTerms = async () => {
      if (!accounts || accounts.length === 0) return;
      try {
        const response = await instance.acquireTokenSilent({
          scopes: ["TermStore.Read.All"],
          account: accounts[0],
        });
        const token = response.accessToken;
        const res = await fetch(
          `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/termStore/sets/${TERM_SET_ID}/terms`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          console.error("Failed to fetch terms:", res.status, await res.text());
          setTerms([]);
          return;
        }
        const data = await res.json();
        setTerms(data.value || []);
      } catch (error) {
        console.error("Error fetching terms:", error);
        setTerms([]);
      }
    };
    fetchTerms();
  }, [instance, accounts]);

  // Handler for starring a term (creates a new item with managed metadata)
  const handleStar = async (term: { id: string; labels: { name: string }[] }) => {
    try {
      if (!accounts || accounts.length === 0) return;
      const response = await instance.acquireTokenSilent({
        scopes: ["Sites.ReadWrite.All"],
        account: accounts[0],
      });
      const accessToken = response.accessToken;
      const label = term.labels[0]?.name || "Unnamed term";
      const userEmail = accounts[0]?.username || "";
      await createCourseSubjectItem({ termId: term.id, label }, accessToken, userEmail);
      setStarred((prev) => ({ ...prev, [term.id]: true }));
      console.log(`Successfully starred term: ${label}`);
    } catch (err) {
      console.error("Error starring term:", err);
    }
  };

  // Handler for unstarring a term (removal logic can be added)
  const handleUnstar = async (term: { id: string }) => {
    setStarred((prev) => ({ ...prev, [term.id]: false }));
    // Optionally implement deletion logic here
  };

  return (
    <div>
      <h2>Pick your interests</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        {terms.length === 0 ? (
          <span>No terms found or unable to load.</span>
        ) : (
          (() => {
            const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
            return terms.map((term) => {
              const label = term.labels[0]?.name || "Unnamed term";
              return (
                <button
                  key={term.id}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: starred[term.id] ? "2px solid #0078d4" : "1px solid #ccc",
                    background: starred[term.id]
                      ? isDark
                        ? "#222"
                        : "#e0e7ff"
                      : isDark
                      ? "#111"
                      : "#fff",
                    color: isDark ? "#fff" : "#000",
                    cursor: "pointer",
                    fontWeight: starred[term.id] ? "bold" : "normal",
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onClick={() =>
                    starred[term.id] ? handleUnstar(term) : handleStar(term)
                  }
                >
                  {starred[term.id] ? "★ " : "☆ "}
                  {label}
                </button>
              );
            });
          })()
        )}
      </div>
    </div>
  );
};

export default InterestPicker;


