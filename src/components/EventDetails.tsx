import { Calendar, MapPin, Clock, Navigation, Phone, Mail } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useState, useEffect } from 'react';

export default function EventDetails() {
  const [activeEvent, setActiveEvent] = useState(0);
  const [progress, setProgress] = useState(0);

  const events = [
    {
      title: 'Akad Nikah',
      time: '20:00 PM',
      duration: '1 Jam',
      location: 'Rumah Mempelai Wanita',
      address: 'Jl. Raya Temoran Omben, kab. Sampang',
      description: 'Bergabunglah dengan kami saat kami mengucapkan janji pernikahan di hadapan orang-orang yang kami cintai',
      icon: Calendar,
      phone: '+62 0875-1263-4567',
      email: 'ceremony@wedding.com',
      color: 'from-rose-500 to-pink-500',
    },
    {
      title: 'Resepsi',
      time: '08:00 AM',
      duration: '4 hours',
      location: 'Grand Hotel Ballroom',
      address: 'Jl. Jendral Sudirman',
      description: 'Rayakan bersama kami dengan makan malam, berdansa, dan kenangan yang tak terlupakan',
      icon: Clock,
      phone: '+62 0875-2987-6543',
      email: 'reception@wedding.com',
      color: 'from-orange-500 to-amber-500',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <div className="py-20 bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">Kapan & Dimana</h2>
          <p className="text-gray-600 text-lg">Ikuti perjalanan kami melalui hari yang sempurna</p>
        </div>

        <div 
          ref={elementRef}
          className={`relative z-[30] max-w-7xl mx-auto animate-on-scroll ${isVisible ? 'visible' : ''}`}
        >
          {/* Timeline Track Map */}
          <div className="relative">
            {/* Desktop Track */}
            <div className="hidden md:block">
              <div className="relative h-60">
                {/* Track Background */}
                <div className="absolute inset-x-0 top-12 h-2 bg-gray-200 rounded-full transform -translate-y-1/2">
                  {/* Animated Progress */}
                  <div 
                    className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Event Markers */}
                {events.map((event, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveEvent(index)}
                    className={`absolute top-1 transform -translate-y-1 transition-all duration-500 ${
                      index === 0 ? 'left-0' : 'right-0'
                    }`}
                    style={{
                      animation: activeEvent === index ? 'pulse-marker 2s infinite' : 'none'
                    }}
                  >
                    <div className={`relative ${activeEvent === index ? 'scale-125' : 'scale-100'} transition-transform duration-300`}>
                      {/* Outer Ring */}
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${event.color} p-1 shadow-lg`}>
                        {/* Inner Circle */}
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                          <event.icon className={`${activeEvent === index ? 'text-rose-500' : 'text-gray-600'}`} size={32} />
                        </div>
                      </div>
                      
                      {/* Time Label */}
                      <div className={`absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap ${
                        activeEvent === index ? 'opacity-100' : 'opacity-60'
                      }`}>
                        <div className={`bg-gradient-to-r ${event.color} text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg`}>
                          {event.time}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                {/* Animated Car/Icon */}
                <div 
                  className="absolute top-12 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-300"
                  style={{ left: `${progress}%` }}
                >
                  <div className="bg-white p-3 rounded-full shadow-xl animate-bounce">
                    <Navigation className="text-rose-500" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Selector */}
            <div className="md:hidden flex space-x-4 justify-center mb-8">
              {events.map((event, index) => (
                <button
                  key={index}
                  onClick={() => setActiveEvent(index)}
                  className={`flex-1 py-4 rounded-xl transition-all duration-300 ${
                    activeEvent === index
                      ? `bg-gradient-to-r ${event.color} text-white shadow-lg scale-105`
                      : 'bg-white text-gray-600 shadow'
                  }`}
                >
                  <event.icon className="mx-auto mb-2" size={24} />
                  <div className="text-sm font-semibold">{event.time}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Event Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((event, index) => (
              <div
                key={index}
                onClick={() => setActiveEvent(index)}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 cursor-pointer ${
                  activeEvent === index 
                    ? 'scale-105 shadow-2xl ring-4 ring-rose-300' 
                    : 'hover:scale-102 hover:shadow-2xl'
                }`}
                style={{ 
                  animationDelay: `${index * 0.2}s`,
                  opacity: activeEvent === index ? 1 : 0.7
                }}
              >
                {/* Header with Gradient */}
                <div className={`bg-gradient-to-r ${event.color} p-6 text-white relative overflow-hidden`}>
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                      animation: 'slide-bg 20s linear infinite'
                    }} />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                        <event.icon size={32} />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{event.time}</div>
                        <div className="text-sm opacity-90">{event.duration}</div>
                      </div>
                    </div>
                    <h3 className="text-3xl font-serif font-bold">{event.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Location */}
                  <div className="flex items-start space-x-3 group">
                    <div className="bg-rose-100 p-2 rounded-lg group-hover:bg-rose-200 transition-colors">
                      <MapPin className="text-rose-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{event.location}</p>
                      <p className="text-gray-600 text-sm">{event.address}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed pl-11">
                    {event.description}
                  </p>

                  {/* Contact Info */}
                  <div className="flex items-center space-x-4 pl-11 pt-2">
                    <a 
                      href={`tel:${event.phone}`}
                      className="flex items-center space-x-2 text-sm text-gray-500 hover:text-rose-600 transition-colors"
                    >
                      <Phone size={16} />
                      <span>Call</span>
                    </a>
                    <a 
                      href={`mailto:${event.email}`}
                      className="flex items-center space-x-2 text-sm text-gray-500 hover:text-rose-600 transition-colors"
                    >
                      <Mail size={16} />
                      <span>Email</span>
                    </a>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <button className={`bg-gradient-to-r ${event.color} text-white py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center space-x-2`}>
                      <MapPin size={18} />
                      <span>Directions</span>
                    </button>
                    <button className="bg-gray-100 text-gray-800 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-gray-200 hover:scale-105 flex items-center justify-center space-x-2">
                      <Calendar size={18} />
                      <span>Calendar</span>
                    </button>
                  </div>
                </div>

                {/* Decorative Bottom */}
                <div className={`h-2 bg-gradient-to-r ${event.color}`} />
              </div>
            ))}
          </div>

          {/* Timeline Info */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-4 text-gray-600">
              <Clock className="text-rose-500" size={24} />
              <div className="text-center">
                <p className="font-semibold text-gray-800">Jadwal Acara</p>
                <p className="text-sm">2:00 PM - 9:00 PM</p>
              </div>
              <div className="h-12 w-px bg-gray-300" />
              <div className="text-center">
                <p className="font-semibold text-gray-800">Jarak</p>
                <p className="text-sm">~5 KM Tempat Tujuan</p>
              </div>
              <div className="h-12 w-px bg-gray-300" />
              <div className="text-center">
                <p className="font-semibold text-gray-800">Waktu Perjalanan</p>
                <p className="text-sm">~15 Menit</p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="mt-8 bg-gradient-to-r from-rose-100 to-orange-100 rounded-xl p-6 max-w-3xl mx-auto border-l-4 border-rose-500">
            <div className="flex items-start space-x-3">
              <div className="bg-rose-500 text-white p-2 rounded-lg">
                <Navigation size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Catatan Transportasi</h4>
                <p className="text-gray-600 text-sm">
                  Layanan antar-jemput tersedia antar lokasi tujuan. Tempat parkir tersedia di kedua lokasi.
Kami sarankan Anda tiba 15 menit lebih awal untuk mendapatkan tempat parkir dan beristirahat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-marker {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(244, 63, 94, 0);
          }
        }

        @keyframes slide-bg {
          0% {
            transform: translateX(0) translateY(0);
          }
          100% {
            transform: translateX(20px) translateY(20px);
          }
        }
      `}</style>
    </div>
  );
}