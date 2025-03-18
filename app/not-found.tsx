"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <AlertTriangle className="w-16 h-16 text-red-500" />
      <h1 className="text-4xl font-bold mt-4">Página no encontrada</h1>
      <p className="text-gray-600 mt-2">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
      <Button className="mt-6" onClick={() => router.push("/")}>Volver al inicio</Button>
    </div>
  );
}