'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';
import { WeatherResponse } from '../types/weather';
import { Droplets, Wind } from 'lucide-react';

interface WeatherDisplayProps {
    data: WeatherResponse;
}

export default function WeatherDisplay({ data }: WeatherDisplayProps) {
    const { city, weather, search_stats } = data;

    // Extract temperature number from "25°C" format
    const tempMatch = weather?.temp?.match(/(-?\d+)/);
    const tempValue = tempMatch ? tempMatch[1] : '--';

    // Extract humidity number from "36%" format
    const humidityMatch = weather?.humidity?.match(/(\d+)/);
    const humidityValue = humidityMatch ? humidityMatch[1] : '--';

    // Extract wind speed from "2.47 m/s" format
    const windMatch = weather?.wind_speed?.match(/([\d.]+)/);
    const windValue = windMatch ? windMatch[1] : '--';

    return (
        <GlassCard className="p-8 md:p-12 w-full max-w-2xl" intensity="medium">
            {/* Analytics Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6"
            >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gray-400 text-sm">
                    تم البحث <span className="text-white font-medium">{search_stats?.total_searches ?? 0}</span> مرة
                </span>
            </motion.div>

            {/* City Name */}
            <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-3xl md:text-4xl font-light text-gray-300 mb-2"
            >
                {city}
            </motion.h2>

            {/* Main Weather Display */}
            <div className="flex items-center justify-between flex-wrap gap-6">
                {/* Temperature */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
                    className="flex items-start"
                >
                    <span className="text-8xl md:text-9xl font-extralight text-white tracking-tighter">
                        {tempValue}
                    </span>
                    <span className="text-4xl md:text-5xl font-extralight text-gray-500 mt-4">°C</span>
                </motion.div>

                {/* Weather Icon */}
                {weather?.icon && (
                    <motion.div
                        initial={{ opacity: 0, rotate: -20 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="relative flex flex-col items-center"
                    >
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl" />
                        <Image
                            src={weather.icon}
                            alt={weather.description || 'Weather icon'}
                            width={160}
                            height={160}
                            className="w-32 h-32 md:w-40 md:h-40 relative z-10 drop-shadow-2xl brightness-0 invert"
                            unoptimized
                        />
                        <span className="text-sm text-gray-400 mt-2 capitalize">
                            {weather?.description || ''}
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Weather Description */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-xl text-gray-400 capitalize mt-4 mb-8"
            >
                {weather?.description || '--'}
            </motion.p>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="grid grid-cols-2 gap-4"
            >
                {/* Humidity */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Droplets className="h-5 w-5 text-gray-500" strokeWidth={1.5} />
                        <span className="text-gray-500 text-sm">الرطوبة</span>
                    </div>
                    <p className="text-2xl font-light text-white mt-2">{humidityValue}%</p>
                </div>

                {/* Wind Speed */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <Wind className="h-5 w-5 text-gray-500" strokeWidth={1.5} />
                        <span className="text-gray-500 text-sm">الرياح</span>
                    </div>
                    <p className="text-2xl font-light text-white mt-2">{windValue} m/s</p>
                </div>
            </motion.div>
        </GlassCard>
    );
}
