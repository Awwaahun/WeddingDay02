import React, { useState, useEffect, useCallback } from 'react';
import { generateIslamicWeddingPrayer } from './services/geminiService';
import { ClockIcon, SparklesIcon } from './components/icons';

// Countdown Component Logic
const Countdown: React.FC = () => {
  const weddingDate = new Date('2025-11-14T14:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      setTimeLeft({
        days: Math.max(Math.floor(distance / (1000 * 60 * 60 * 24)), 0),
        hours: Math.max(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 0),
        minutes: Math.max(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), 0),
        seconds: Math.max(Math.floor((distance % (1000 * 60)) / 1000), 0),
      });
    };
    
    calculateTimeLeft(); // Initial calculation
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  return (
    <div className="py-20 bg-gradient-to-r from-rose-500 to-orange-400 shadow-inner">
      <div className="container mx-auto px-4 text-center text-white">
        <ClockIcon className="w-12 h-12 mx-auto mb-4 text-white" />
        <h2 className="text-4xl md:text-5xl font-serif mb-2">Olivia & Liam</h2>
        <p className="text-lg md:text-xl mb-12">Are getting married!</p>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-3xl mx-auto">
          {Object.entries(timeLeft).map(([unit, value], index) => (
            <div
              key={unit}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 md:p-8 w-24 md:w-32 hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up flex flex-col items-center justify-center"
              style={{ animationDelay: `${index * 0.15}s`, opacity: 0 }}
            >
              <div className="text-4xl md:text-6xl font-bold mb-2 transition-transform duration-300">
                {value.toString().padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm uppercase tracking-wider">{unit}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Prayer Letter Component Logic
const PrayerLetter: React.FC = () => {
    const [letter, setLetter] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateLetter = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setLetter('');
        try {
            const result = await generateIslamicWeddingPrayer();
            setLetter(result);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred while generating the prayer.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="py-20 px-4 text-center bg-rose-50">
            <h3 className="text-3xl md:text-4xl font-serif text-gray-800">A Special Prayer</h3>
            <p className="text-gray-600 max-w-xl mx-auto my-4">
                Generate a beautiful Islamic wedding prayer from the Quran and Sunnah for Olivia & Liam's blessed union.
            </p>
            <button
                onClick={handleGenerateLetter}
                disabled={isLoading}
                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center mx-auto space-x-2"
                aria-label="Generate prayer letter"
            >
                <SparklesIcon className="w-5 h-5" />
                <span>{isLoading ? 'Generating...' : 'Generate Prayer'}</span>
            </button>
            
            {error && <p className="text-red-600 mt-6 max-w-xl mx-auto" role="alert">Error: {error}</p>}

            {isLoading && (
                <div className="mt-8 text-gray-500 animate-pulse" aria-live="polite">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    <p className="sr-only">Composing prayer...</p>
                </div>
            )}

            {letter && (
                <div className="mt-10 bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto animate-fade-in-up text-left border border-rose-100" style={{opacity: 0}}>
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed font-serif">
                        {letter}
                    </div>
                </div>
            )}
        </div>
    );
};


// Main App Component
export default function CountdownAndLetter() {
  return (
    <main className="min-h-screen bg-rose-50 antialiased">
        <Countdown />
        <PrayerLetter />
        <footer className="text-center py-6 text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Olivia & Liam's Wedding Celebration. All rights reserved.</p>
        </footer>
    </main>
  );
}
