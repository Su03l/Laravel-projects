import axios from 'axios';
import { WeatherResponse, TrendingCity } from '../types/weather';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export const weatherApi = {
    /**
     * Get weather data for a specific city
     */
    getWeather: async (city: string): Promise<WeatherResponse> => {
        const response = await apiClient.get<WeatherResponse>(`/weather/${encodeURIComponent(city)}`);
        return response.data;
    },

    /**
     * Get trending/top searched cities
     */
    getTrendingCities: async (): Promise<TrendingCity[]> => {
        const response = await apiClient.get<TrendingCity[]>('/weather/top');
        return response.data;
    },
};

export default weatherApi;
