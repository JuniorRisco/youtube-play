export async function GET(req: Request) {
  const { searchParams } = new URL(req.url, `http://${req.headers.get("host")}`);
  const query = searchParams.get("q");

  if (!query) {
    return new Response(JSON.stringify({ error: "Falta el parámetro de búsqueda" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`;

  try {
    const response = await fetch(YOUTUBE_API_URL);
    if (!response.ok) {
      throw new Error(`Error en la API de YouTube: ${response.statusText}`);
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
