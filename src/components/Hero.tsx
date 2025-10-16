import { Heart, ChevronDown, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50">
        <div className="absolute inset-0 bg-[url('https://files.catbox.moe/444fud.jpg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20"></div>
      </div>

      {/* Animated hearts */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-rose-300 opacity-20 animate-float"
            size={Math.random() * 30 + 20}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-amber-400 opacity-40 animate-sparkle"
            size={Math.random() * 20 + 10}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 5 + 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <div className="mb-8 animate-fade-in">
          <p className="text-gray-700 font-serif text-lg mb-2">The Wedding of</p>
          <h1 className="text-6xl md:text-8xl font-serif text-gray-800 mb-4 animate-scale-in">
            Adam & Sarah
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-600">
            <div className="h-px w-16 bg-gray-400 animate-slide-in-left"></div>
            <Heart className="text-rose-500 animate-pulse-glow" size={24} fill="currentColor" />
            <div className="h-px w-16 bg-gray-400 animate-slide-in-right"></div>
          </div>
        </div>

        <div className="animate-fade-in-delay">
          <p className="text-2xl font-light text-gray-700 mb-8">
            Sabtu, 22 November 2025
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Bersama keluarga kami, kami mengundang Anda untuk merayakan cinta kami dan awal perjalanan kami sebagai suami istri.
          </p>
        </div>

        <div className="mt-16 animate-bounce">
          <ChevronDown size={32} className="text-gray-600 mx-auto" />
        </div>
      </div>
    </div>
  );
}
