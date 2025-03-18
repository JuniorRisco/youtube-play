export async function GET(req: Request) {
    const { searchParams } = new URL(req.url, `http://${req.headers.get("host")}`);
    const query = searchParams.get("q"); // Cambia "query" por "q"
  
    console.log("Query:", query);
  
    if (!query) {
      return new Response(JSON.stringify({ error: "Falta el parámetro de búsqueda" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    try {
      const response = await fetch(
        `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Accept: "application/json",
            "X-Subscription-Token": process.env.BRAVE_API_KEY as string,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error en la API de Brave: ${response.statusText}`);
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  