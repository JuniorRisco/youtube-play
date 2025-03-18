"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


// Definimos la interfaz para los videos obtenidos de la API
interface Video {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: { medium: { url: string } };
  };
}

// Declaramos las propiedades de la ventana para YouTube API
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const playerRef = useRef<YT.Player | null>(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/youtube?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setVideos(data.items || []);
      setCurrentIndex(null);
    } catch (error) {
      console.error("Error al buscar videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const playVideo = (index: number) => {
    setCurrentIndex(index);
  };

  const handleVideoEnd = () => {
    if (currentIndex !== null && videos.length > 0) {
      const nextIndex = (currentIndex + 1) % videos.length;
      setCurrentIndex(nextIndex);
    }
  };

  useEffect(() => {
    if (currentIndex !== null) {
      const videoId = videos[currentIndex]?.id?.videoId;
      if (videoId && window.YT) {
        if (!playerRef.current) {
          playerRef.current = new window.YT.Player("youtube-player", {
            videoId,
            events: {
              onStateChange: (event: YT.OnStateChangeEvent) => {
                if (event.data === window.YT.PlayerState.ENDED) {
                  handleVideoEnd();
                }
              },
            },
          });
        } else {
          playerRef.current.loadVideoById(videoId);
        }
      }
    }
  }, [currentIndex, videos, handleVideoEnd]); // Se agregó handleVideoEnd

  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Buscar videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>Buscar</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-2/3">
          {currentIndex !== null ? (
            <Card>
              <CardContent className="p-4">
                <div id="youtube-player" className="w-full h-[400px] rounded-lg"></div>
                <Button variant="destructive" className="mt-4" onClick={() => setCurrentIndex(null)}>
                  Cerrar Video
                </Button>
              </CardContent>
            </Card>
          ) : (
            <p className="text-gray-500 text-center">Selecciona un video para verlo aquí.</p>
          )}
        </div>

        <div className="md:w-1/3 space-y-4">
          {loading && <Skeleton className="h-16 w-full" />}
          {videos.map((video, index) => (
            <Card key={index} className="cursor-pointer" onClick={() => playVideo(index)}>
              <CardContent className="flex gap-4 p-2 items-center">
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  width={120}
                  height={90}
                  className="w-24 h-16 rounded-md"
                />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{video.snippet.title}</h3>
                  <p className="text-xs text-gray-500">{video.snippet.channelTitle}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
