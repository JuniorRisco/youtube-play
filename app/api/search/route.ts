export default async function handler(req, res) {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método no permitido" });
    }
  
    const { query } = req.query; // Obtener el parámetro de búsqueda
  
    if (!query) {
      return res.status(400).json({ error: "Falta el parámetro de búsqueda" });
    }
  
    try {
      const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`, {
        headers: {
          "Accept": "application/json",
          "X-Subscription-Token": process.env.BRAVE_API_KEY, // Usamos la API Key de las variables de entorno
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error en la API de Brave: ${response.statusText}`);
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  