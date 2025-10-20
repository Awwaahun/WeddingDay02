
import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Users, Gift, Wallet, MessageCircle, UserCircle, Send, Film } from 'lucide-react';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import Couple from './components/Couple';
import Story from './components/Story';
import EventDetails from './components/EventDetails';
import Gallery from './components/Gallery';
import Donation from './components/Donation';
import RSVP from './components/RSVP';
import GuestBook from './components/GuestBook';
import LoadingScreen from './components/LoadingScreen';
import InvitationModal from './components/InvitationModal';
import FloralDecorations from './components/FloralDecorations';
import LoginModal from './components/LoginModal';
import ClientDashboard from './components/ClientDashboard';
import { useInvitation } from './hooks/useInvitation';
import { useWeddingConfig } from './hooks/useWeddingConfig';
import MusicPlayer from './components/MusicPlayer';
import PrayerDisplay from './components/PrayerDisplay';
import PrayerLetter from './components/PrayerLetter';
import CinematicIntro from './components/CinematicIntro';
import type { WeddingConfig } from './hooks/useWeddingConfig';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { isLoading, showInvitation, handleOpenInvitation } = useInvitation();
  const [mainVisible, setMainVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMusicButton, setShowMusicButton] = useState(false);
  const [playMusicTrigger, setPlayMusicTrigger] = useState(false);
  const [showCinematic, setShowCinematic] = useState(false);
  const [guestName, setGuestName] = useState<string | null>(null);
  
  // Admin/Dashboard states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Wedding config
  const defaultConfig = useWeddingConfig();
  const [weddingConfig, setWeddingConfig] = useState<WeddingConfig>(defaultConfig);

  // Load guest name from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('to');
    if (name && name.trim()) {
      setGuestName(name.trim());
    }
  }, []);

  // Load saved config on mount, merging with defaults for robustness
  useEffect(() => {
    const savedConfigRaw = localStorage.getItem('weddingConfig');
    if (savedConfigRaw) {
      try {
        const savedConfig = JSON.parse(savedConfigRaw);

        // Simple deep merge utility to ensure config structure is always up-to-date
        // with the latest defaults, preventing errors from old saved versions.
        const mergeDeep = (defaults: any, saved: any): WeddingConfig => {
          const merged = { ...defaults };
          for (const key in saved) {
            if (Object.prototype.hasOwnProperty.call(saved, key)) {
              const defaultValue = merged[key];
              const savedValue = saved[key];
              
              // If both are objects (but not arrays), recurse
              if (
                typeof defaultValue === 'object' && defaultValue !== null && !Array.isArray(defaultValue) &&
                typeof savedValue === 'object' && savedValue !== null && !Array.isArray(savedValue)
              ) {
                merged[key] = mergeDeep(defaultValue, savedValue);
              } else if (savedValue !== undefined) {
                // Otherwise, saved value (primitive or array) overwrites the default
                merged[key] = savedValue;
              }
            }
          }
          return merged as WeddingConfig;
        };

        if (typeof savedConfig === 'object' && savedConfig !== null) {
          setWeddingConfig(mergeDeep(defaultConfig, savedConfig));
        } else {
          console.warn('Invalid config in localStorage, using defaults.');
        }

      } catch (e) {
        console.error('Failed to parse config from localStorage, using defaults.', e);
        localStorage.removeItem('weddingConfig');
      }
    }
  }, []); // Run only once on mount

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['hero', 'couple', 'story', 'event', 'gallery', 'donation', 'rsvp', 'prayer'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            if (activeSection !== section) {
              setActiveSection(section);
            }
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  useEffect(() => {
    if (showInvitation) setIsModalOpen(true);
  }, [showInvitation]);

  const onInvitationOpened = () => {
    handleOpenInvitation();
    setIsModalOpen(false);
    setTimeout(() => {
      setMainVisible(true);
      document.body.style.overflow = 'auto';
      setShowMusicButton(true);
      setPlayMusicTrigger(true);
    }, 500);
  };

  useEffect(() => {
    if (isLoading || isModalOpen || showDashboard || showCinematic) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isLoading, isModalOpen, showCinematic, showDashboard]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Admin access handler
  const handleAdminAccess = () => {
    setShowLoginModal(true);
  };

  // Login handler
  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'wedding2025') {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setShowDashboard(true);
      document.body.style.overflow = 'hidden';
    }
  };

  // Save config handler
  const handleSaveConfig = (newConfig: WeddingConfig) => {
    setWeddingConfig(newConfig);
    localStorage.setItem('weddingConfig', JSON.stringify(newConfig));
  };

  // Close dashboard handler
  const handleCloseDashboard = () => {
    setShowDashboard(false);
    setIsAuthenticated(false);
    document.body.style.overflow = 'auto';
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <InvitationModal isOpen={isModalOpen} onOpen={onInvitationOpened} config={weddingConfig} guestName={guestName} />
      <CinematicIntro show={showCinematic} onClose={() => setShowCinematic(false)} config={weddingConfig} />
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
      <ClientDashboard
        isOpen={showDashboard}
        onClose={handleCloseDashboard}
        config={weddingConfig}
        onSave={handleSaveConfig}
      />

      <div className={`transition-opacity duration-1000 ease-in ${mainVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans overflow-x-hidden relative">
          
          {mainVisible && <FloralDecorations activeSection={activeSection} />}
          
          <nav
            className={`fixed top-0 w-full z-[60] transition-all duration-300 ${
              scrolled ? 'bg-white/80 backdrop-blur-sm shadow-md py-4' : 'bg-transparent py-6'
            }`}
          >
            <div className="container mx-auto px-4">
              <div className="flex justify-center items-center space-x-3 md:space-x-6">
                {[
                  { icon: Heart, label: 'Home', id: 'hero' },
                  { icon: UserCircle, label: 'Couple', id: 'couple' },
                  { icon: Users, label: 'Story', id: 'story' },
                  { icon: Calendar, label: 'Event', id: 'event' },
                  { icon: Gift, label: 'Gallery', id: 'gallery' },
                  { icon: Wallet, label: 'Gift', id: 'donation' },
                  { icon: MessageCircle, label: 'RSVP', id: 'rsvp' },
                  { icon: Send, label: 'Prayer', id: 'prayer' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex flex-col md:flex-row items-center space-x-0 md:space-x-2 transition-colors duration-300 ${
                      scrolled ? 'text-gray-700 hover:text-rose-500' : 'text-white/90 hover:text-white'
                    } ${activeSection === item.id ? (scrolled ? 'text-rose-500 font-bold' : 'text-white font-bold') : ''}`}
                  >
                    <item.icon size={18} />
                    <span className="hidden md:inline text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          <main>
            <div id="hero"><Hero onAdminAccess={handleAdminAccess} config={weddingConfig} /></div>
            <Countdown config={weddingConfig} />
            <div id="couple"><Couple config={weddingConfig} /></div>
            <div id="story"><Story config={weddingConfig} /></div>
            <div id="event"><EventDetails config={weddingConfig} /></div>
            <div id="gallery"><Gallery config={weddingConfig} /></div>
            <div id="donation"><Donation config={weddingConfig} /></div>
            <div id="rsvp"><RSVP /></div>
            <div id="prayer"><PrayerDisplay /></div>
            <PrayerLetter config={weddingConfig} />
            <GuestBook />
          </main>

          {showMusicButton && (
            <MusicPlayer
              lyrics={weddingConfig.music.lyrics}
              audioSrc={weddingConfig.music.audioSrc}
              initialShowLyrics={false}
              autoPlay={playMusicTrigger}
              autoPlayLyrics={playMusicTrigger}
            />
          )}

          <footer className="bg-gray-900 text-white py-12 relative z-10">
            <div className="container mx-auto px-4 text-center">
              <Heart className="inline-block text-rose-500 mb-2" size={24} />
              <p className="font-serif text-lg">{weddingConfig.couple.groom.name} & {weddingConfig.couple.bride.name}</p>
              <p className="text-sm">Made with love for our special day</p>
              <button
                onClick={() => setShowCinematic(true)}
                className="mt-4 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-all duration-300 inline-flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-105 hover:shadow-lg"
              >
                <Film size={20} />
                <span>Watch Our Cinematic Story</span>
              </button>
              <p className="text-xs text-gray-400 mt-6">© 2025 {weddingConfig.couple.groom.name} & {weddingConfig.couple.bride.name} - All rights reserved</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
