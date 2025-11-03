import { Heart, Instagram, Mail, Sparkles, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

const Couple = ({ config }) => {
  const { bride, groom } = config?.couple || {};
  const [activeCard, setActiveCard] = useState(null);

  const CoupleCard = ({ person, reverse, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      setMousePosition({ x, y });
    };

    return (
      <div
        className={`flex flex-col ${
          reverse ? 'md:flex-row-reverse' : 'md:flex-row'
        } gap-8 md:gap-12 items-center mb-20`}
        onMouseEnter={() => setActiveCard(index)}
        onMouseLeave={() => setActiveCard(null)}
      >
        {/* Image Section */}
        <div className="md:w-5/12 w-full">
          <div 
            className="relative group perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Glow Effect */}
            <div className={`absolute -inset-4 bg-gradient-to-br ${
              person?.role === 'Mempelai Wanita' ? 'from-rose-400 to-pink-400' : 'from-blue-400 to-indigo-400'
            } rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
            
            {/* Decorative Frame */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-400 to-orange-400 rounded-3xl transform rotate-6 group-hover:rotate-12 transition-transform duration-700" />
            
            {/* Image Container */}
            <div 
              className="relative rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 border-4 border-white"
              style={{
                transform: isHovered 
                  ? `perspective(1000px) rotateY(${mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.5}deg) scale(1.05)`
                  : 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)'
              }}
            >
              <img
                src={person?.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'}
                alt={person?.name}
                className="w-full h-[500px] object-cover"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Sparkles on Hover */}
              {isHovered && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(10)].map((_, i) => (
                    <Sparkles
                      key={i}
                      className="absolute text-amber-300 animate-ping"
                      size={15 + Math.random() * 10}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Decorative Hearts */}
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-rose-500 to-pink-500 p-4 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-500">
              <Heart size={32} fill="white" className="text-white" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="md:w-7/12 w-full">
          <div className={`text-center md:text-${reverse ? 'right' : 'left'} space-y-6`}>
            {/* Quote Icon */}
            <div className={`flex ${reverse ? 'justify-center md:justify-end' : 'justify-center md:justify-start'}`}>
              <div className={`bg-gradient-to-br ${
                person?.role === 'Mempelai Wanita' ? 'from-rose-100 to-pink-100' : 'from-blue-100 to-indigo-100'
              } p-4 rounded-2xl shadow-lg transform hover:rotate-12 transition-transform duration-300`}>
                <Quote className={person?.role === 'Mempelai Wanita' ? 'text-rose-500' : 'text-blue-500'} size={32} />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-3">
              <p className={`${
                person?.role === 'Mempelai Wanita' ? 'text-rose-500' : 'text-blue-500'
              } font-semibold text-lg tracking-wider uppercase`}>
                {person?.role}
              </p>
              <h3 className="text-5xl md:text-6xl font-serif text-gray-800 mb-2 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-rose-500 hover:to-orange-500 transition-all duration-300">
                {person?.name}
              </h3>
              <p className="text-2xl text-gray-600 font-light">{person?.fullName}</p>
            </div>

            {/* Decorative Line */}
            <div className={`flex items-center ${reverse ? 'justify-center md:justify-end' : 'justify-center md:justify-start'} gap-4 my-6`}>
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-300" />
              <div className={`p-2 rounded-full ${
                person?.role === 'Mempelai Wanita' ? 'bg-rose-100' : 'bg-blue-100'
              }`}>
                <Heart 
                  className={person?.role === 'Mempelai Wanita' ? 'text-rose-500' : 'text-blue-500'} 
                  size={20} 
                  fill="currentColor" 
                />
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-300" />
            </div>

            {/* Bio */}
            <div className={`bg-gradient-to-br ${
              person?.role === 'Mempelai Wanita' 
                ? 'from-rose-50 to-pink-50' 
                : 'from-blue-50 to-indigo-50'
            } rounded-2xl p-6 shadow-lg border-l-4 ${
              person?.role === 'Mempelai Wanita' ? 'border-rose-400' : 'border-blue-400'
            } hover:shadow-2xl transition-shadow duration-300`}>
              <p className="text-gray-700 leading-relaxed text-lg">{person?.bio}</p>
            </div>

            {/* Parents */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <p className="text-gray-500 italic text-sm mb-2">Putri/Putra dari:</p>
              <p className="text-gray-800 font-medium text-lg">{person?.parents}</p>
            </div>

            {/* Social Links */}
            <div className={`flex items-center gap-4 ${reverse ? 'justify-center md:justify-end' : 'justify-center md:justify-start'}`}>
              <a
                href={`https://instagram.com/${person?.instagram?.replace('@', '') || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-3 bg-gradient-to-r ${
                  person?.role === 'Mempelai Wanita' 
                    ? 'from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600' 
                    : 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                } text-white px-6 py-3 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}
              >
                <Instagram size={20} />
                <span className="font-medium">{person?.instagram}</span>
              </a>
              <a
                href={`mailto:${person?.email || ''}`}
                className="group bg-white hover:bg-gray-50 p-4 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Mail className={person?.role === 'Mempelai Wanita' ? 'text-rose-500' : 'text-blue-500'} size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(251,207,232,0.3)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(254,215,170,0.3)_0%,_transparent_50%)]" />
      </div>

      {/* Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-rose-200 opacity-20 animate-float"
            size={30 + Math.random() * 30}
            fill="currentColor"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-8 py-4 shadow-xl mb-6">
            <Heart className="text-rose-500" size={24} fill="currentColor" />
            <span className="text-rose-500 font-semibold">Our Love Story</span>
            <Heart className="text-rose-500" size={24} fill="currentColor" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-serif text-gray-800 mb-6 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-rose-500 hover:via-pink-500 hover:to-orange-500 transition-all duration-500">
            Perkenalkan Kami
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-rose-400 to-transparent rounded-full" />
            <Sparkles className="text-amber-400" size={24} />
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-rose-400 to-transparent rounded-full" />
          </div>
          
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            Dua Jiwa, Satu Hati, Satu Tujuan
          </p>
        </div>

        {/* Couple Cards */}
        <div className="max-w-7xl mx-auto space-y-20">
          <CoupleCard person={bride} index={0} />

          {/* Center Heart Divider */}
          <div className="flex justify-center my-20">
            <div className="relative">
              {/* Animated Rings */}
              <div className="absolute inset-0 animate-ping">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full opacity-20" />
              </div>
              <div className="absolute inset-0 animate-pulse">
                <div className="absolute inset-2 bg-gradient-to-r from-rose-300 to-orange-300 rounded-full opacity-30" />
              </div>
              
              {/* Main Heart */}
              <div className="relative bg-white rounded-full p-8 shadow-2xl border-4 border-rose-100 transform hover:scale-110 hover:rotate-12 transition-all duration-500">
                <Heart className="text-rose-500" size={64} fill="currentColor" />
              </div>

              {/* Decorative Sparkles */}
              {[...Array(8)].map((_, i) => (
                <Sparkles
                  key={i}
                  className="absolute text-amber-300 animate-sparkle"
                  size={20}
                  style={{
                    left: `${50 + Math.cos(i * Math.PI / 4) * 80}px`,
                    top: `${50 + Math.sin(i * Math.PI / 4) * 80}px`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <CoupleCard person={groom} reverse index={1} />
        </div>

        {/* Bottom Quote */}
        <div className="mt-24 text-center">
          <div className="inline-block bg-white/80 backdrop-blur-md rounded-3xl px-12 py-8 shadow-2xl border border-rose-100 max-w-3xl">
            <Quote className="text-rose-300 mx-auto mb-4" size={40} />
            <p className="text-2xl md:text-3xl font-serif text-gray-700 italic leading-relaxed">
              "Cinta sejati tidak pernah berjalan mulus, namun dengan kasih sayang dan pengertian, 
              kami siap menghadapi segalanya bersama"
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-300" />
              <Heart className="text-rose-400" size={20} fill="currentColor" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-rose-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Couple;