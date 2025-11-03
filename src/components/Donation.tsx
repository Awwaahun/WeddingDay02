import { useState, useEffect } from 'react';
import { Gift, Copy, Check, CreditCard, Wallet, QrCode, Sparkles, Heart, X } from 'lucide-react';

const Donation = ({ config }) => {
  const [copiedAccount, setCopiedAccount] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);
  const [qrCodes, setQrCodes] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  const accounts = (config?.donations || []).map(account => ({
    ...account,
    icon: account.type === 'Bank Account' ? CreditCard : Wallet,
    color: account.type === 'Bank Account' ? 'from-blue-500 to-indigo-500' : 'from-green-500 to-emerald-500',
    bgColor: account.type === 'Bank Account' ? 'from-blue-50 to-indigo-50' : 'from-green-50 to-emerald-50',
  }));

  useEffect(() => {
    const generateQRCodes = async () => {
      const codes = {};
      for (const account of accounts) {
        if (account.qrUrl) {
          codes[account.id] = account.qrUrl;
        } else {
          const qrData = `${account.bank}|${account.accountName}|${account.accountNumber}`;
          codes[account.id] = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
        }
      }
      setQrCodes(codes);
    };
    if (accounts.length > 0) {
      generateQRCodes();
    }
  }, [accounts.length]);

  const copyToClipboard = (text, accountId) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(accountId);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  return (
    <div className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-rose-50">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(251,207,232,0.2)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(254,215,170,0.2)_0%,_transparent_50%)]" />
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
            {i % 2 === 0 ? (
              <Gift className="text-rose-200" size={20 + Math.random() * 15} />
            ) : (
              <Sparkles className="text-amber-200" size={15 + Math.random() * 10} />
            )}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative">
              {/* Animated Rings */}
              <div className="absolute inset-0 animate-ping">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full opacity-20" />
              </div>
              <div className="relative bg-gradient-to-br from-rose-100 to-orange-100 p-8 rounded-full shadow-2xl">
                <Gift className="text-rose-600 animate-pulse" size={56} />
              </div>
            </div>
          </div>

          <h2 className="text-5xl md:text-7xl font-serif text-gray-800 mb-6">
            Beri Dukungan Istimewa
          </h2>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-gray-300" />
            <Heart className="text-rose-500" size={24} fill="currentColor" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-gray-300" />
          </div>

          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            Kehadiran Anda di pernikahan kami adalah hadiah terindah. Namun, jika Anda ingin memberikan hadiah,
            kami dengan senang hati akan menerima untuk masa depan kami bersama.
          </p>
        </div>

        {/* Donation Cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 mb-16">
          {accounts.map((account, index) => (
            <div
              key={account.id}
              className="group relative"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${account.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />

              {/* Card */}
              <div className={`relative bg-gradient-to-br ${account.bgColor} rounded-3xl p-8 shadow-xl border-2 border-white hover:shadow-2xl transition-all duration-500 hover:scale-105`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`bg-gradient-to-r ${account.color} p-4 rounded-2xl shadow-lg`}>
                      <account.icon className="text-white" size={32} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{account.type}</p>
                      <p className="text-xl font-bold text-gray-800">{account.bank}</p>
                    </div>
                  </div>

                  {/* Decorative Badge */}
                  <div className={`bg-gradient-to-r ${account.color} px-4 py-2 rounded-full shadow-lg`}>
                    <span className="text-white text-xs font-bold">#{index + 1}</span>
                  </div>
                </div>

                {/* Account Details */}
                <div className="space-y-4">
                  {/* Account Name */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1 font-medium">Account Name</p>
                    <p className="text-lg font-bold text-gray-800">{account.accountName}</p>
                  </div>

                  {/* Account Number */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Account Number</p>
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-mono text-xl font-bold text-gray-800 tracking-wider">
                        {account.accountNumber}
                      </p>
                      <button
                        onClick={() => copyToClipboard(account.accountNumber, account.id)}
                        className={`p-3 rounded-xl transition-all duration-300 ${
                          copiedAccount === account.id
                            ? 'bg-green-500 text-white'
                            : `bg-gradient-to-r ${account.color} text-white hover:shadow-lg`
                        }`}
                        title="Copy to clipboard"
                      >
                        {copiedAccount === account.id ? (
                          <Check size={20} />
                        ) : (
                          <Copy size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* QR Code Button */}
                <button
                  onClick={() => setSelectedQR(account.id)}
                  className={`w-full mt-6 flex items-center justify-center gap-3 bg-gradient-to-r ${account.color} text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}
                >
                  <QrCode size={24} />
                  <span>Show QR Code</span>
                </button>

                {/* Hover Effect */}
                {hoveredCard === index && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <Sparkles
                        key={i}
                        className="absolute text-amber-400 animate-ping"
                        size={15}
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
            </div>
          ))}
        </div>

        {/* Note Section */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-rose-400 to-orange-400 rounded-3xl blur-2xl opacity-20" />
            
            {/* Content */}
            <div className="relative bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-white">
              <div className="flex items-start gap-6">
                <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-4 rounded-2xl shadow-lg">
                  <Heart className="text-white" size={32} fill="currentColor" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-serif text-gray-800 mb-4">Catatan Penting</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Hadiah dan dukungan Anda akan membantu kami memulai babak baru bersama. 
                    Terima kasih telah menjadi bagian dari hari istimewa kami dan atas cinta serta dukungan Anda. 
                    Setiap kontribusi akan sangat berarti bagi kami. 🙏
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedQR && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedQR(null)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-md w-full animate-scale-in shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-serif text-gray-800">Scan QR Code</h3>
              <button
                onClick={() => setSelectedQR(null)}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* QR Code */}
            {qrCodes[selectedQR] && (
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  {/* Animated Border */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-rose-400 to-orange-400 rounded-2xl blur animate-pulse" />
                  
                  {/* QR Container */}
                  <div className="relative bg-white p-6 rounded-2xl shadow-2xl border-4 border-rose-100">
                    <img
                      src={qrCodes[selectedQR]}
                      alt="QR Code"
                      className="w-64 h-64 rounded-lg"
                    />
                  </div>
                </div>

                {/* Account Info */}
                {accounts.map((account) => {
                  if (account.id === selectedQR) {
                    return (
                      <div key={account.id} className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl p-6 border-2 border-rose-100">
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <account.icon className="text-rose-600" size={24} />
                          <p className="text-lg font-semibold text-rose-600">{account.bank}</p>
                        </div>
                        <p className="text-gray-800 font-bold text-xl mb-2">{account.accountName}</p>
                        <p className="font-mono text-gray-700 text-lg">{account.accountNumber}</p>
                      </div>
                    );
                  }
                  return null;
                })}

                <p className="text-sm text-gray-500 mt-6">
                  Scan QR code ini dengan aplikasi banking Anda untuk mengirim hadiah
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Donation;