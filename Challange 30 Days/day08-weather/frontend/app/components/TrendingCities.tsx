'use client';

import { motion } from 'framer-motion';
import { TrendingCity } from '../types/weather';

interface TrendingCitiesProps {
    cities: TrendingCity[];
    onCityClick: (cityName: string) => void;
    isLoading?: boolean;
}

export default function TrendingCities({
    cities,
    onCityClick,
    isLoading = false,
}: TrendingCitiesProps) {
    // Loading state - show skeleton loaders
    if (isLoading) {
        return (
            <div className="flex flex-wrap gap-3 justify-center">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="h-10 w-28 bg-gray-600 rounded-full animate-pulse"
                    />
                ))}
            </div>
        );
    }

    // Empty state - no cities yet
    if (!cities || cities.length === 0) {
        return (
            <p className="text-white text-center py-4">
                لا توجد مدن رائجة بعد - ابحث عن مدينة لتبدأ!
            </p>
        );
    }

    // Cities exist - show buttons
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-3 justify-center"
        >
            {cities.map((city) => (
                <motion.button
                    key={city.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onCityClick(city.name)}
                    className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 border border-gray-500 rounded-full
                     text-white font-medium transition-all duration-300 cursor-pointer"
                >
                    <span className="flex items-center gap-2">
                        <span>{city.name}</span>
                        <span className="text-xs bg-gray-500 text-white px-2 py-0.5 rounded-full">
                            {city.count ?? 0}
                        </span>
                    </span>
                </motion.button>
            ))}
        </motion.div>
    );
}
