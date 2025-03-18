"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  // Leer el modo oscuro desde localStorage cuando se monta el componente
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Cambiar el modo y almacenarlo en localStorage
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 mx-auto sm:max-w-4xl md:max-w-6xl ">
      <h1
        className="text-3xl font-semibold flex items-center gap-1 cursor-pointer"
        onClick={() => router.push("/")}
      >
        Youtube-play<span className="font-bold text-gray-900 dark:text-white">10</span>
      </h1>

      <div className="hidden sm:flex gap-4">
        <Button variant="ghost" onClick={() => router.push("/products")}>Productos</Button>
        <Button variant="ghost" onClick={() => router.push("/about")}>Nosotros</Button>
        <Button variant="ghost" onClick={() => router.push("/contact")}>Contacto</Button>
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="cursor-pointer" onClick={() => router.push("/profile")}>
          <AvatarImage src="/placeholder-avatar.png" alt="Usuario" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <Button
  variant="outline"
  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
  onClick={toggleDarkMode}
>
  {darkMode ? "☀️" : "🌚"}
</Button>

      </div>
    </div>
  );
}
