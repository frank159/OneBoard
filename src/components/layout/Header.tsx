"use client";

import { useEffect, useState } from "react";
import {
  Sun,
  Cloud,
  Umbrella,
  Snowflake,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Wind,
  Zap,
} from "lucide-react";

export const Header = () => {
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [location, setLocation] = useState({ lat: 0, lon: 0 });

  const isClient = typeof window !== "undefined";

  useEffect(() => {
    if (!isClient) return;

    setDateTime(new Date());
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [isClient]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error("Erro ao obter localização: ", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (location.lat && location.lon) {
      const apiKey = "75c7006e01ea14d93bb2cac904bbc30c";
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&lang=pt_br&appid=${apiKey}`;

      fetch(weatherUrl)
        .then((response) => response.json())
        .then((data) => {
          setWeather(data);
        })
        .catch((error) => {
          console.error("Erro ao buscar clima: ", error);
        });
    }
  }, [location]);

  const hour = dateTime?.getHours() || 0;
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  const formattedDate = dateTime
    ? dateTime.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  const formattedTime = dateTime
    ? dateTime.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  const weatherIconMap: { [key: string]: JSX.Element } = {
    Clear: <Sun className="w-8 h-8 text-yellow-400" />,
    Clouds: <Cloud className="w-8 h-8 text-gray-500" />,
    Rain: <Umbrella className="w-8 h-8 text-blue-500" />,
    Drizzle: <CloudDrizzle className="w-8 h-8 text-blue-300" />,
    Thunderstorm: <CloudLightning className="w-8 h-8 text-yellow-600" />,
    Snow: <Snowflake className="w-8 h-8 text-blue-200" />,
    Mist: <CloudFog className="w-8 h-8 text-gray-400" />,
    Fog: <CloudFog className="w-8 h-8 text-gray-400" />,
    Tornado: <Zap className="w-8 h-8 text-red-600" />,
    Wind: <Wind className="w-8 h-8 text-gray-400" />,
  };

  const mainWeather = weather?.weather?.[0]?.main;
  const weatherIcon = weatherIconMap[mainWeather] || (
    <Sun className="w-8 h-8 text-gray-400" />
  );

  // Só renderiza no cliente
  if (!isClient || !dateTime) return null;

  return (
    <header className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-2 px-2 py-4 border-b">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {greeting}, Usuário 👋
        </h1>
        <p className="text-sm text-muted-foreground">Tenha um dia produtivo!</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 text-right text-sm md:text-base text-muted-foreground">
        <div>
          <p className="capitalize">{formattedDate}</p>
          <p className="font-mono text-lg">{formattedTime}</p>
        </div>
        |
        <div className="text-sm text-muted-foreground">{weatherIcon}</div>
      </div>
    </header>
  );
};
