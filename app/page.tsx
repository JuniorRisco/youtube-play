import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBrave = async () => {
    if (!query) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${query}`);
      const data = await res.json();
      setResults(data.web?.results || []);
    } catch (error) {
      console.error("Error al buscar:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Búsqueda con Brave API</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar en Brave..."
        style={{ marginRight: "10px" }}
      />
      <button onClick={searchBrave} disabled={loading}>
        {loading ? "Buscando..." : "Buscar"}
      </button>

      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              {result.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
