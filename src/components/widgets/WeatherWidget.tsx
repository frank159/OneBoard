"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  CloudSun,
  CloudMoon,
  Wind,
  Snowflake,
  Zap,
  Droplets,
  ThermometerSun,
  ThermometerSnowflake,
} from "lucide-react";

interface WeatherWidgetProps {
  weather: any;
}

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
  const Icon = mainWeather && weatherIconMap[mainWeather] ? weatherIconMap[mainWeather] : Sun;

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
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
      </CardContent>
    </Card>
  );
};
