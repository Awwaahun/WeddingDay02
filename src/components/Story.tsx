import { Heart, ChevronLeft, ChevronRight, MapPin, Calendar, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const Story = ({ config }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState('next');
  
  const stories = config?.story || [];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setDirection('next');
      setCurrentSlide((prev) => (prev + 1) % stories.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [stories.length, isAutoPlaying]);

  const nextSlide = () => {
    setDirection('next');
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setDirection('prev');
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 'next' : 'prev');
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  return (
    <div className="relative py-24 md:py-32 bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(251,207,232,0.2)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,_rgba(254,215,170,0.2)_0%,_transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${15 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            {i % 3 === 0 ? (
              <Heart className="text-rose-200" size={20 + Math.random() * 15} fill="currentColor" />
            ) : (
              <Sparkles className="text-amber-200" size={15 + Math.random() * 10} />
            )}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-full px-6 py-3 shadow-xl mb-6">
            <Heart size={20} fill="currentColor" />
            <span className="font-semibold">Our Journey</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-serif text-gray-800 mb-6">
            Kisah Cinta Kami
          </h2>

          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-gray-300" />
            <Heart className="text-rose-500" size={24} fill="currentColor" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-gray-300" />
          </div>

          <p className="text-gray-600 text-xl">
            Setiap bab membawa kami lebih dekat
          </p>
        </div>

        {/* Main Story Carousel */}
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            {/* Story Cards */}
            <div className="relative h-[600px] md:h-[700px] rounded-3xl overflow-hidden shadow-2xl">
              {stories.map((story, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ${
                    index === currentSlide
                      ? 'opacity-100 scale-100'
                      : direction === 'next'
                      ? 'opacity-0 -translate-x-full'
                      : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="relative h-full flex flex-col md:flex-row bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
                    {/* Image Section */}
                    <div className="md:w-1/2 h-64 md:h-full relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 to-orange-400/20 z-10" />
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                      
                      {/* Decorative Corner */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/30 to-transparent z-20" />
                      
                    </div>

                    {/* Content Section */}
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,0,0,0.1)_1px,_transparent_1px)] bg-[length:30px_30px]" />
                      </div>

                      <div className="relative z-10">
                        {/* Date Badge */}
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-full px-6 py-3 shadow-lg mb-6">
                          <Calendar size={18} />
                          <span className="font-semibold text-sm">{story.date}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-800 mb-6 leading-tight">
                          {story.title}
                        </h3>

                        {/* Decorative Line */}
                        <div className="flex items-center gap-3 mb-6">
                          <div className="h-1 w-16 bg-gradient-to-r from-rose-400 to-transparent rounded-full" />
                          <Heart className="text-rose-400" size={20} fill="currentColor" />
                          <div className="h-1 w-16 bg-gradient-to-l from-rose-400 to-transparent rounded-full" />
                        </div>

                        {/* Description */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-rose-100 shadow-lg">
                          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                            {story.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/55 hover:bg-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
            >
              <ChevronLeft className="text-gray-800 group-hover:text-rose-500 transition-colors" size={28} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/95 hover:bg-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
            >
              <ChevronRight className="text-gray-800 group-hover:text-rose-500 transition-colors" size={28} />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === index
                    ? 'w-16 h-4 bg-gradient-to-r from-rose-500 to-orange-500 shadow-lg'
                    : 'w-4 h-4 bg-gray-300 hover:bg-rose-300 hover:scale-125'
                }`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="max-w-3xl mx-auto mt-6">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-pink-400 to-orange-500 transition-all duration-300 relative"
                style={{ width: `${((currentSlide + 1) / stories.length) * 100}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/50" />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>Chapter {currentSlide + 1}</span>
              <span>{stories.length} Chapters</span>
            </div>
          </div>

          {/* Auto Play Control */}
          <div className="text-center mt-8">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200"
            >
              <div className={`w-3 h-3 rounded-full ${isAutoPlaying ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium text-gray-700">
                {isAutoPlaying ? 'Auto Playing' : 'Paused'}
              </span>
            </button>
          </div>

          {/* Swipe Hint */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm animate-pulse">
              ← Swipe atau gunakan tombol navigasi →
            </p>
          </div>
        </div>

        {/* Timeline Preview */}
        <div className="max-w-7xl mx-auto mt-20">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-rose-100">
            <h3 className="text-2xl font-serif text-gray-800 mb-8 text-center">Timeline Perjalanan Kami</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stories.map((story, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                    currentSlide === index 
                      ? 'ring-4 ring-rose-400 shadow-2xl scale-105' 
                      : 'hover:scale-105 hover:shadow-xl'
                  }`}
                >
                  <div className="aspect-[4/3] relative">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-xs font-semibold mb-1">{story.date}</p>
                      <p className="text-white font-serif text-lg">{story.title}</p>
                    </div>

                    {currentSlide === index && (
                      <div className="absolute top-4 right-4 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                        Now Playing
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;