"use client";

import React from "react";
import { ReusableCard } from "@/components/widgets/CardWidget"; // ajuste o caminho conforme sua estrutura
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Wind,
  Snowflake,
  Zap,
} from "lucide-react";

interface WeatherWidgetProps {
  weather: any;
}

// Mapeamento dos ícones conforme o clima
const weatherIconMap: { [key: string]: React.ElementType } = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Drizzle: CloudDrizzle,
  Thunderstorm: CloudLightning,
  Snow: Snowflake,
  Mist: CloudFog,
  Smoke: CloudFog,
  Haze: CloudFog,
  Dust: Wind,
  Fog: CloudFog,
  Sand: Wind,
  Ash: Wind,
  Squall: Wind,
  Tornado: Zap,
};

export const WeatherWidget = ({ weather }: WeatherWidgetProps) => {
  const mainWeather = weather?.weather?.[0]?.main;
  const Icon =
    mainWeather && weatherIconMap[mainWeather] ? weatherIconMap[mainWeather] : Sun;

  // Conteúdo do cabeçalho do card (versão resumida)
  const header = (
    <div className="flex items-center gap-4">
      <Icon className="w-10 h-10 text-yellow-400" />
      {weather ? (
        <div>
          <h3 className="font-semibold">
            {weather.name}, {weather.sys.country}
          </h3>
          <p className="text-sm text-muted-foreground">
            {weather.weather[0].description} {weather.main.temp}°C
          </p>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">Carregando clima...</div>
      )}
    </div>
  );

  // Conteúdo extra opcional (pode deixar vazio se não desejar)
  const content = null;

  // Conteúdo detalhado a ser exibido no modal expandido
  const expandedContent = (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold">
            {weather?.name}, {weather?.sys.country}
          </h2>
          <p className="text-sm text-muted-foreground capitalize">
            {weather?.weather[0].description}
          </p>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <Icon className="w-12 h-12 text-yellow-400" />
        <div className="text-2sm text-white">
          <p>
            🌡️ Temp: {weather?.main.temp}°C (Sensação: {weather?.main.feels_like}°C)
          </p>
          <p>💧 Umidade: {weather?.main.humidity}%</p>
          <p>🌬️ Vento: {weather?.wind.speed} m/s</p>
          <p>📈 Pressão: {weather?.main.pressure} hPa</p>
          <p>🔭 Visibilidade: {weather?.visibility / 1000} km</p>
        </div>
      </div>
    </div>
  );

  return (
    <ReusableCard
      header={header}
      content={content}
      expandedContent={expandedContent}
      expandedWidth={521} // ou outro valor conforme sua necessidade
      expandedHeight={220}
    />
  );
};
