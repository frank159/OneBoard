"use client";

import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { QuoteWidget } from "@/components/widgets/QuoteWidget";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [dateTime, setDateTime] = useState(new Date());
  const [weather, setWeather] = useState<any>(null);
  const [location, setLocation] = useState({ lat: 0, lon: 0 });

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error("Error obtaining location: ", error);
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
          console.error("Error fetching weather data: ", error);
        });
    }
  }, [location]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <WeatherWidget weather={weather} />

      <QuoteWidget />
      {/* outros widgets aqui */}
    </div>
  );
}
