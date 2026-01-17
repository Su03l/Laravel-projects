'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchInput from './components/SearchInput';
import WeatherDisplay from './components/WeatherDisplay';
import TrendingCities from './components/TrendingCities';
import weatherApi from './services/api';
import { WeatherResponse, TrendingCity } from './types/weather';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [trendingCities, setTrendingCities] = useState<TrendingCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await weatherApi.getTrendingCities();
        setTrendingCities(data);
      } catch (err) {
        console.error('Failed to fetch trending cities:', err);
      } finally {
        setIsTrendingLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const refreshTrending = async () => {
    try {
      const data = await weatherApi.getTrendingCities();
      setTrendingCities(data);
    } catch (err) {
      console.error('Failed to refresh trending:', err);
    }
  };

  const handleSearch = useCallback(async (city: string) => {
    setIsSearching(true);
    setError(null);

    try {
      const data = await weatherApi.getWeather(city);
      setWeatherData(data);
      await refreshTrending();
    } catch (err: unknown) {
      console.error('Failed to fetch weather:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to fetch weather data');
      } else {
        setError('Failed to fetch weather data');
      }
      setWeatherData(null);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleTrendingClick = useCallback((cityName: string) => {
    handleSearch(cityName);
  }, [handleSearch]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-extralight text-white mb-4 text-glow tracking-tight">
            الطقس
          </h1>
          <p className="text-gray-500 text-lg font-light">
            اكتشف حالة الطقس حول العالم
          </p>
        </motion.div>

        <SearchInput onSearch={handleSearch} isLoading={isSearching} />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {weatherData && (
            <motion.div
              key={weatherData.city}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="mt-12 w-full flex justify-center"
            >
              <WeatherDisplay data={weatherData} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative z-10 py-12 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-white/70 text-sm uppercase tracking-widest mb-6">
            المدن الرائجة
          </h2>
          <TrendingCities
            cities={trendingCities}
            onCityClick={handleTrendingClick}
            isLoading={isTrendingLoading}
          />
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-white/5">
        <p className="text-gray-400 text-sm mb-2">
          تحدي 30 يوم 30 مشروع
        </p>
        <p className="text-gray-500 text-xs">
          اليوم 8 : نظام الطقس والتحليلات
        </p>
      </footer>
    </div>
  );
}
