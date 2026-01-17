// Weather API Response Types

export interface WeatherData {
  temp: string;           // "25°C" - string with unit
  description: string;    // "سماء صافية"
  humidity: string;       // "36%" - string with unit
  wind_speed: string;     // "2.47 m/s" - string with unit
  icon: string;           // Full URL to weather icon
}

export interface SearchStats {
  total_searches: number;
  is_trending: boolean;
}

export interface WeatherResponse {
  city: string;
  search_stats: SearchStats;
  weather: WeatherData;
  cached: boolean;
}

export interface TrendingCity {
  name: string;
  count: number;
}
