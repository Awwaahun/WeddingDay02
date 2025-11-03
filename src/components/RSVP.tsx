import { useState } from 'react';
import { Heart, Send, User, Mail, Users, Check, MessageCircle, Utensils, PartyPopper, Sparkles } from 'lucide-react';

const RSVP = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '1',
    attending: 'yes',
    dietary: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      guests: '1',
      attending: 'yes',
      dietary: '',
      message: '',
    });
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="relative py-24 md:py-32 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <Heart
              key={i}
              className="absolute text-rose-300 animate-float"
              size={20 + Math.random() * 20}
              fill="currentColor"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-12 text-center animate-scale-in border-4 border-rose-100">
            <div className="relative inline-flex mb-8">
              <div className="absolute inset-0 animate-ping">
                <div className="absolute inset-0 bg-green-400 rounded-full opacity-20" />
              </div>
              <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 p-6 rounded-full shadow-2xl">
                <Check size={64} className="text-white" strokeWidth={3} />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">
              Terima Kasih!
            </h2>
            
            <div className="flex items-center justify-center gap-4 my-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-300" />
              <Heart className="text-rose-500" size={24} fill="currentColor" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-300" />
            </div>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              RSVP Anda telah diterima dengan sukses. Kami sangat senang bisa merayakan hari istimewa kami bersama Anda!
            </p>

            <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-6 mb-8 border-2 border-rose-100">
              <PartyPopper className="text-rose-500 mx-auto mb-3" size={32} />
              <p className="text-gray-700">
                Kami akan mengirimkan detail lebih lanjut ke email Anda segera.
              </p>
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Send size={20} />
              Kirim RSVP Lainnya
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-24 md:py-32 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(251,207,232,0.3)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(254,215,170,0.3)_0%,_transparent_50%)]" />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
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
            <Sparkles className="text-amber-200" size={15 + Math.random() * 10} />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-full px-6 py-3 shadow-xl mb-6">
            <PartyPopper size={20} />
            <span className="font-semibold">Konfirmasi Kehadiran</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-serif text-gray-800 mb-6">
            RSVP
          </h2>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-gray-300" />
            <Heart className="text-rose-500" size={24} fill="currentColor" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-gray-300" />
          </div>

          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Mohon konfirmasi kehadiran Anda. Informasi ini sangat membantu kami dalam persiapan acara.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-rose-400 to-orange-400 rounded-3xl blur-2xl opacity-20" />

            <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-white">
              <div className="space-y-6">
                <div className="group">
                  <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                    <User size={20} className="text-rose-500" />
                    Nama Lengkap *
                  </label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'scale-105' : ''}`}>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 text-lg"
                      placeholder="Masukkan nama lengkap Anda"
                    />
                    {focusedField === 'name' && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Sparkles className="text-rose-400 animate-pulse" size={20} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                    <Mail size={20} className="text-rose-500" />
                    Email *
                  </label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-105' : ''}`}>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 text-lg"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                      <Users size={20} className="text-rose-500" />
                      Jumlah Tamu *
                    </label>
                    <select
                      required
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 text-lg appearance-none bg-white cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Orang' : 'Orang'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                      <PartyPopper size={20} className="text-rose-500" />
                      Kehadiran *
                    </label>
                    <select
                      required
                      value={formData.attending}
                      onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 text-lg appearance-none bg-white cursor-pointer"
                    >
                      <option value="yes">✓ Ya, Saya Akan Hadir</option>
                      <option value="no">✗ Maaf, Tidak Bisa Hadir</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                    <Utensils size={20} className="text-rose-500" />
                    Kebutuhan Khusus
                  </label>
                  <input
                    type="text"
                    value={formData.dietary}
                    onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 text-lg"
                    placeholder="Vegetarian, Alergi, dll."
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                    <MessageCircle size={20} className="text-rose-500" />
                    Pesan untuk Pengantin
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 text-lg resize-none"
                    placeholder="Bagikan harapan Anda untuk kami..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white py-5 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <Send size={24} />
                        <span>Kirim Konfirmasi</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSVP;