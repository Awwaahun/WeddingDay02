import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Users, Calendar, MapPin, Music, Image, Gift, Settings, LogOut, Heart, Sparkles, Film, FileJson, Upload, Download, Palette, Mail, BookOpen, Send, PlusCircle, Trash2, FileUp, Loader2 } from 'lucide-react';
import type { WeddingConfig } from '../hooks/useWeddingConfig';
import { supabase } from '../lib/supabase';

interface ClientDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  config: WeddingConfig;
  onSave: (newConfig: WeddingConfig) => void;
}

interface Guest {
  id: string;
  name: string;
  phone: string | null;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ isOpen, onClose, config, onSave }) => {
  const [editedConfig, setEditedConfig] = useState<WeddingConfig>(config);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);
  
  // Guest management states
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [whatsappMessage, setWhatsappMessage] = useState(
`_Assalamualaikum Warahmatullahi Wabarakatuh_

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *guestname* untuk menghadiri acara kami.

*Berikut link undangan kami*, untuk info lengkap dari acara bisa kunjungi:
link url to guest name

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

*Mohon maaf perihal undangan hanya di bagikan melalui pesan ini.*

Terima kasih banyak atas perhatiannya.

Salam Hormat
${config.couple.groom.name} & ${config.couple.bride.name}`
  );

  useEffect(() => {
    setEditedConfig(config);
     setWhatsappMessage(prev => prev.replace(
      /Salam Hormat\n.*/,
      `Salam Hormat\n${config.couple.groom.name} & ${config.couple.bride.name}`
    ));
  }, [config]);

  const tabs = [
    { id: 'couple', label: 'Couple Info', icon: Heart },
    { id: 'hero', label: 'Hero Section', icon: Sparkles },
    { id: 'cinematic', label: 'Cinematic', icon: Film },
    { id: 'invitation', label: 'Invitation', icon: Mail },
    { id: 'wedding', label: 'Wedding Date', icon: Calendar },
    { id: 'events', label: 'Events', icon: MapPin },
    { id: 'story', label: 'Story', icon: Users },
    { id: 'prayerLetter', label: 'Prayer Letter', icon: BookOpen },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'donations', label: 'Donations', icon: Gift },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'whatsapp', label: 'Bulk WhatsApp', icon: Send },
    { id: 'json', label: 'Settings & Data', icon: FileJson },
  ] as const;
  
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('couple');

  useEffect(() => {
    const fetchGuests = async () => {
        if (activeTab === 'whatsapp') {
            setLoadingGuests(true);
            try {
                const { data, error } = await supabase
                    .from('guests')
                    .select('id, name, phone')
                    .order('name', { ascending: true });
                
                if (error) {
                    throw error;
                }
                if (data) {
                    setGuests(data);
                }
            } catch (error) {
                console.error('Error fetching guests:', error);
                alert('Could not fetch guest list from Supabase.');
            } finally {
                setLoadingGuests(false);
            }
        }
    };

    if (isOpen) {
        fetchGuests();
    }
  }, [activeTab, isOpen]);

  const handleInputChange = (section: keyof WeddingConfig, field: string, value: any, index?: number) => {
    setEditedConfig(prev => {
      const newConfig = JSON.parse(JSON.stringify(prev)); // Deep copy
      
      if (index !== undefined && Array.isArray(newConfig[section])) {
        const arr = newConfig[section] as any[];
        arr[index] = { ...arr[index], [field]: value };
        (newConfig as any)[section] = arr;
      } else {
        // This handles both existing and optional objects like 'theme' correctly
        (newConfig as any)[section] = {
          ...((newConfig as any)[section] as object || {}),
          [field]: value
        };
      }
      
      return newConfig;
    });
    setHasChanges(true);
  };

  const handleNestedInputChange = (section: keyof WeddingConfig, parentField: string, field: string, value: any) => {
    setEditedConfig(prev => {
      const newConfig = JSON.parse(JSON.stringify(prev)); // Deep copy
      (newConfig as any)[section][parentField][field] = value;
      return newConfig;
    });
    setHasChanges(true);
  };
  
  const handleExport = () => {
    const jsonString = JSON.stringify(editedConfig, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'wedding-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File is not readable");
        const importedConfig = JSON.parse(text);
        setEditedConfig(importedConfig);
        setHasChanges(true);
        alert("Configuration imported successfully! Remember to save your changes.");
      } catch (error) {
        alert("Failed to import configuration. Please check if the file is a valid JSON config.");
        console.error(error);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    onSave(editedConfig);
    setHasChanges(false);
    alert('Configuration saved successfully!');
  };

  const handleLogout = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to logout?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };
  
  const handleSendWhatsapp = (guest: Guest) => {
    if (!guest.phone) {
        alert(`Phone number is missing for ${guest.name}.`);
        return;
    }

    const cleanedPhone = guest.phone.replace(/[^0-9]/g, '');

    const baseUrl = window.location.origin;
    const guestUrl = `${baseUrl}/?to=${encodeURIComponent(guest.name)}`;

    const finalMessage = whatsappMessage
        .replace(/\*guestname\*/g, `*${guest.name}*`)
        .replace('link url to guest name', guestUrl);

    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(finalMessage)}`;

    window.open(whatsappUrl, '_blank');
  };
  
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
        alert('Guest name is required.');
        return;
    }
    setIsAdding(true);
    try {
        const { data, error } = await supabase
            .from('guests')
            .insert([{ name: newName.trim(), phone: newPhone.trim() || null }])
            .select();
        
        if (error) throw error;
        if (data) {
            setGuests(prev => [...prev, ...data].sort((a, b) => a.name.localeCompare(b.name)));
            setNewName('');
            setNewPhone('');
        }
    } catch (error) {
        console.error('Error adding guest:', error);
        alert('Failed to add guest.');
    } finally {
        setIsAdding(false);
    }
  };

  const handleDeleteGuest = async (guest: Guest) => {
    if (window.confirm(`Are you sure you want to delete ${guest.name}?`)) {
        setDeletingId(guest.id);
        try {
            const { error } = await supabase
                .from('guests')
                .delete()
                .match({ id: guest.id });

            if (error) throw error;
            setGuests(prev => prev.filter(g => g.id !== guest.id));
        } catch (error) {
            console.error('Error deleting guest:', error);
            alert('Failed to delete guest.');
        } finally {
            setDeletingId(null);
        }
    }
  };

  const handleImportGuestsClick = () => {
    importFileRef.current?.click();
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const text = e.target?.result as string;
            const rows = text.split('\n').filter(row => row.trim() !== '');
            const newGuests = rows.map(row => {
                const [name, phone] = row.split(',').map(field => field.trim());
                return { name, phone };
            }).filter(g => g.name);

            if (newGuests.length === 0) {
                alert('No valid guests found in the file.');
                setIsImporting(false);
                return;
            }
            
            const { error } = await supabase.from('guests').insert(newGuests);
            if (error) throw error;

            const { data, error: fetchError } = await supabase
                .from('guests')
                .select('id, name, phone')
                .order('name', { ascending: true });
            
            if (fetchError) throw fetchError;
            if (data) setGuests(data);

            alert(`${newGuests.length} guests imported successfully!`);

        } catch (error) {
            console.error('Error importing CSV:', error);
            alert('Failed to import CSV. Please check the file format (Name,Phone) and console for errors.');
        } finally {
            setIsImporting(false);
            if (importFileRef.current) {
                importFileRef.current.value = '';
            }
        }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
          <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full"><Settings size={24} /></div>
                <div>
                  <h1 className="text-2xl font-serif font-bold">Wedding Configuration Dashboard</h1>
                  <p className="text-sm text-white/80">Customize your wedding website</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {hasChanges && (
                  <button onClick={handleSave} className="flex items-center space-x-2 bg-white text-rose-600 px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors">
                    <Save size={18} /> <span className="hidden md:inline">Save Changes</span>
                  </button>
                )}
                <button onClick={handleLogout} className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                  <LogOut size={18} /> <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="md:w-64 bg-gray-50 border-r border-gray-200">
              <nav className="p-4 space-y-2">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}>
                    <tab.icon size={20} /> <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-200px)]">
              {activeTab === 'couple' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Couple Information</h2>
                  <div className="bg-rose-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-rose-600 mb-4">Bride Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <InputField label="Name" value={editedConfig.couple.bride.name} onChange={e => handleNestedInputChange('couple', 'bride', 'name', e.target.value)} />
                      <InputField label="Full Name" value={editedConfig.couple.bride.fullName} onChange={e => handleNestedInputChange('couple', 'bride', 'fullName', e.target.value)} />
                      <InputField label="Instagram" value={editedConfig.couple.bride.instagram} onChange={e => handleNestedInputChange('couple', 'bride', 'instagram', e.target.value)} />
                      <InputField label="Email" type="email" value={editedConfig.couple.bride.email} onChange={e => handleNestedInputChange('couple', 'bride', 'email', e.target.value)} />
                      <div className="md:col-span-2"><InputField label="Parents" value={editedConfig.couple.bride.parents} onChange={e => handleNestedInputChange('couple', 'bride', 'parents', e.target.value)} /></div>
                      <div className="md:col-span-2"><TextareaField label="Bio" value={editedConfig.couple.bride.bio} onChange={e => handleNestedInputChange('couple', 'bride', 'bio', e.target.value)} /></div>
                      <div className="md:col-span-2"><InputField label="Image URL" type="url" value={editedConfig.couple.bride.image} onChange={e => handleNestedInputChange('couple', 'bride', 'image', e.target.value)} /></div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-blue-600 mb-4">Groom Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <InputField label="Name" value={editedConfig.couple.groom.name} onChange={e => handleNestedInputChange('couple', 'groom', 'name', e.target.value)} focusColor="focus:ring-blue-500" />
                        <InputField label="Full Name" value={editedConfig.couple.groom.fullName} onChange={e => handleNestedInputChange('couple', 'groom', 'fullName', e.target.value)} focusColor="focus:ring-blue-500"/>
                        <InputField label="Instagram" value={editedConfig.couple.groom.instagram} onChange={e => handleNestedInputChange('couple', 'groom', 'instagram', e.target.value)} focusColor="focus:ring-blue-500"/>
                        <InputField label="Email" type="email" value={editedConfig.couple.groom.email} onChange={e => handleNestedInputChange('couple', 'groom', 'email', e.target.value)} focusColor="focus:ring-blue-500"/>
                        <div className="md:col-span-2"><InputField label="Parents" value={editedConfig.couple.groom.parents} onChange={e => handleNestedInputChange('couple', 'groom', 'parents', e.target.value)} focusColor="focus:ring-blue-500"/></div>
                        <div className="md:col-span-2"><TextareaField label="Bio" value={editedConfig.couple.groom.bio} onChange={e => handleNestedInputChange('couple', 'groom', 'bio', e.target.value)} focusColor="focus:ring-blue-500"/></div>
                        <div className="md:col-span-2"><InputField label="Image URL" type="url" value={editedConfig.couple.groom.image} onChange={e => handleNestedInputChange('couple', 'groom', 'image', e.target.value)} focusColor="focus:ring-blue-500"/></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Hero Section</h2>
                  <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6">
                    <div className="space-y-4">
                      <InputField label="Background Image URL" type="url" value={editedConfig.hero.backgroundImage} onChange={(e) => handleInputChange('hero', 'backgroundImage', e.target.value)} />
                      <TextareaField label="Tagline" value={editedConfig.hero.tagline} onChange={(e) => handleInputChange('hero', 'tagline', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'cinematic' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Cinematic Intro</h2>
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <div className="space-y-4">
                      <InputField label="Video Source URL" type="url" value={editedConfig.cinematic.videoSrc} onChange={(e) => handleInputChange('cinematic', 'videoSrc', e.target.value)} />
                      <InputField label="Door Image URL" type="url" value={editedConfig.cinematic.doorImage} onChange={(e) => handleInputChange('cinematic', 'doorImage', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'invitation' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Invitation Modal</h2>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                    <div className="space-y-4">
                      <InputField 
                        label="Title" 
                        value={editedConfig.invitation.title} 
                        onChange={(e) => handleInputChange('invitation', 'title', e.target.value)} 
                        focusColor="focus:ring-indigo-500"
                      />
                      <InputField 
                        label="Subtitle" 
                        value={editedConfig.invitation.subtitle} 
                        onChange={(e) => handleInputChange('invitation', 'subtitle', e.target.value)} 
                        focusColor="focus:ring-indigo-500"
                      />
                      <InputField 
                        label="Button Text" 
                        value={editedConfig.invitation.buttonText} 
                        onChange={(e) => handleInputChange('invitation', 'buttonText', e.target.value)} 
                        focusColor="focus:ring-indigo-500"
                      />
                      <InputField 
                        label="Background Video URL" 
                        type="url" 
                        value={editedConfig.invitation.backgroundVideo} 
                        onChange={(e) => handleInputChange('invitation', 'backgroundVideo', e.target.value)} 
                        focusColor="focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'wedding' && (
                  <div className="space-y-6">
                      <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Wedding Date & Time</h2>
                      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-6">
                          <div className="space-y-4">
                              <InputField label="Wedding Date" type="date" value={editedConfig.wedding.date} onChange={(e) => handleInputChange('wedding', 'date', e.target.value)} />
                              <InputField label="Display Date Text" value={editedConfig.wedding.dateDisplay} onChange={(e) => handleInputChange('wedding', 'dateDisplay', e.target.value)} placeholder="e.g., Sabtu, 22 November 2025" />
                              <InputField label="Time" type="time" value={editedConfig.wedding.time} onChange={(e) => handleInputChange('wedding', 'time', e.target.value)} />
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'events' && (
                  <div className="space-y-6">
                      <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Event Details</h2>
                      {editedConfig.events.map((event, index) => (
                          <div key={event.id} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                              <h3 className="text-xl font-semibold text-gray-800 mb-4">Event {index + 1}: {event.title}</h3>
                              <div className="grid md:grid-cols-2 gap-4">
                                <InputField label="Title" value={event.title} onChange={(e) => handleInputChange('events', 'title', e.target.value, index)} />
                                <InputField label="Time" value={event.time} onChange={(e) => handleInputChange('events', 'time', e.target.value, index)} />
                                <InputField label="Duration" value={event.duration} onChange={(e) => handleInputChange('events', 'duration', e.target.value, index)} />
                                <InputField label="Location" value={event.location} onChange={(e) => handleInputChange('events', 'location', e.target.value, index)} />
                                <div className="md:col-span-2"><InputField label="Address" value={event.address} onChange={(e) => handleInputChange('events', 'address', e.target.value, index)} /></div>
                                <InputField label="Phone" type="tel" value={event.phone} onChange={(e) => handleInputChange('events', 'phone', e.target.value, index)} />
                                <InputField label="Email" type="email" value={event.email} onChange={(e) => handleInputChange('events', 'email', e.target.value, index)} />
                                <div className="md:col-span-2"><TextareaField label="Description" value={event.description} onChange={(e) => handleInputChange('events', 'description', e.target.value, index)} /></div>
                              </div>
                          </div>
                      ))}
                  </div>
              )}

              {activeTab === 'story' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Our Story Timeline</h2>
                    {editedConfig.story.map((storyItem, index) => (
                        <div key={`story-${index}`} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Story Point {index + 1}: {storyItem.title}</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <InputField label="Title" value={storyItem.title} onChange={(e) => handleInputChange('story', 'title', e.target.value, index)} />
                                <InputField label="Date" value={storyItem.date} onChange={(e) => handleInputChange('story', 'date', e.target.value, index)} />
                                <div className="md:col-span-2"><InputField label="Image URL" type="url" value={storyItem.image} onChange={(e) => handleInputChange('story', 'image', e.target.value, index)} /></div>
                                <div className="md:col-span-2"><TextareaField label="Description" value={storyItem.description} onChange={(e) => handleInputChange('story', 'description', e.target.value, index)} /></div>
                            </div>
                        </div>
                    ))}
                </div>
              )}

              {activeTab === 'prayerLetter' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Prayer Letter Content</h2>
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <p className="text-sm text-gray-600 mb-4">Edit the content of the prayer letter. The couple's names are added automatically at the end.</p>
                    <div className="space-y-4">
                      <TextareaField 
                        label="Greeting" 
                        value={editedConfig.prayerLetter?.greeting || ''} 
                        onChange={(e) => handleInputChange('prayerLetter', 'greeting', e.target.value)} 
                      />
                      <TextareaField 
                        label="Body Paragraph 1" 
                        value={editedConfig.prayerLetter?.body1 || ''} 
                        onChange={(e) => handleInputChange('prayerLetter', 'body1', e.target.value)} 
                      />
                      <TextareaField 
                        label="Body Paragraph 2" 
                        value={editedConfig.prayerLetter?.body2 || ''} 
                        onChange={(e) => handleInputChange('prayerLetter', 'body2', e.target.value)} 
                      />
                      <TextareaField 
                        label="Body Paragraph 3" 
                        value={editedConfig.prayerLetter?.body3 || ''} 
                        onChange={(e) => handleInputChange('prayerLetter', 'body3', e.target.value)} 
                      />
                      <TextareaField 
                        label="Closing" 
                        value={editedConfig.prayerLetter?.closing || ''} 
                        onChange={(e) => handleInputChange('prayerLetter', 'closing', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              )}

               {activeTab === 'music' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Music Configuration</h2>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <div className="space-y-4">
                      <InputField label="Audio Source URL" type="url" value={editedConfig.music.audioSrc} onChange={(e) => handleInputChange('music', 'audioSrc', e.target.value)} focusColor="focus:ring-purple-500" />
                      <p className="text-sm text-gray-600">Lyrics configuration requires manual editing in the code for now.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Gallery Images</h2>
                    {editedConfig.gallery.map((image, index) => (
                        <div key={`gallery-${index}`} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Image {index + 1}</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="md:col-span-2"><InputField label="Image URL" type="url" value={image.url} onChange={(e) => handleInputChange('gallery', 'url', e.target.value, index)} /></div>
                                <InputField label="Title" value={image.title} onChange={(e) => handleInputChange('gallery', 'title', e.target.value, index)} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={image.type}
                                        onChange={(e) => handleInputChange('gallery', 'type', e.target.value, index)}
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none`}
                                    >
                                        <option value="portrait">Portrait</option>
                                        <option value="landscape">Landscape</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              )}

              {activeTab === 'donations' && (
                  <div className="space-y-6">
                      <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Donation Accounts</h2>
                      {editedConfig.donations.map((donation, index) => (
                          <div key={donation.id} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                              <h3 className="text-xl font-semibold text-green-700 mb-4">Account {index + 1}</h3>
                              <div className="grid md:grid-cols-2 gap-4">
                                <InputField label="Type" value={donation.type} onChange={(e) => handleInputChange('donations', 'type', e.target.value, index)} focusColor="focus:ring-green-500" />
                                <InputField label="Bank/E-Wallet" value={donation.bank} onChange={(e) => handleInputChange('donations', 'bank', e.target.value, index)} focusColor="focus:ring-green-500" />
                                <InputField label="Account Number" value={donation.accountNumber} onChange={(e) => handleInputChange('donations', 'accountNumber', e.target.value, index)} focusColor="focus:ring-green-500" />
                                <InputField label="Account Name" value={donation.accountName} onChange={(e) => handleInputChange('donations', 'accountName', e.target.value, index)} focusColor="focus:ring-green-500" />
                                <div className="md:col-span-2">
                                  <InputField 
                                    label="QR Code Image URL (Optional)" 
                                    type="url" 
                                    value={donation.qrUrl || ''} 
                                    onChange={(e) => handleInputChange('donations', 'qrUrl', e.target.value, index)} 
                                    focusColor="focus:ring-green-500" 
                                    placeholder="https://example.com/qris.png"
                                  />
                                </div>
                              </div>
                          </div>
                      ))}
                  </div>
              )}

              {activeTab === 'theme' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Theme Colors</h2>
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <p className="text-sm text-gray-600 mb-6">Customize the main colors of your website. Changes apply to various elements like buttons and highlights.</p>
                    <div className="grid md:grid-cols-3 gap-6">
                      <ColorInputField label="Primary" value={editedConfig.theme?.primary || '#f43f5e'} onChange={e => handleInputChange('theme', 'primary', e.target.value)} />
                      <ColorInputField label="Secondary" value={editedConfig.theme?.secondary || '#f97316'} onChange={e => handleInputChange('theme', 'secondary', e.target.value)} />
                      <ColorInputField label="Accent" value={editedConfig.theme?.accent || '#ec4899'} onChange={e => handleInputChange('theme', 'accent', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'whatsapp' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Send Bulk WhatsApp Invitations</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                              <PlusCircle className="mr-2 text-green-600" size={22} /> Add New Guest
                          </h3>
                          <form onSubmit={handleAddGuest} className="space-y-3">
                              <InputField label="Guest Name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Enter full name" />
                              <InputField label="Phone Number" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="e.g., 628123456789" />
                              <button type="submit" disabled={isAdding} className="w-full flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:bg-gray-400">
                                  {isAdding ? <Loader2 className="animate-spin" size={18} /> : <Save size={16} />}
                                  <span>{isAdding ? 'Adding...' : 'Add Guest'}</span>
                              </button>
                          </form>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                              <FileUp className="mr-2 text-blue-600" size={22} /> Import from CSV
                          </h3>
                          <input type="file" ref={importFileRef} onChange={handleImportCSV} className="hidden" accept=".csv" />
                          <button onClick={handleImportGuestsClick} disabled={isImporting} className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:bg-gray-400">
                              {isImporting ? <Loader2 className="animate-spin" size={18} /> : <Upload size={16} />}
                              <span>{isImporting ? 'Importing...' : 'Import Guests from CSV'}</span>
                          </button>
                          <p className="text-xs text-gray-500 mt-3">
                              <b>Format:</b> Create a CSV file with two columns: `Name,Phone`.
                              <br />
                              Example: `John Doe,628123456789`
                          </p>
                      </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Message Template</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Edit the message below. `*guestname*` will be replaced with the guest's name, and `link url to guest name` will be replaced with their unique invitation link.
                    </p>
                    <TextareaField 
                      label="WhatsApp Message" 
                      value={whatsappMessage} 
                      onChange={(e) => setWhatsappMessage(e.target.value)} 
                      rows={15}
                    />
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Guest List ({guests.length})</h3>
                    <div className="overflow-x-auto max-h-96">
                      <table className="w-full text-left">
                        <thead className="bg-gray-100 sticky top-0">
                          <tr>
                            <th className="p-3 font-semibold text-sm text-gray-600">Name</th>
                            <th className="p-3 font-semibold text-sm text-gray-600">Phone</th>
                            <th className="p-3 font-semibold text-sm text-gray-600 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loadingGuests ? (
                            <tr><td colSpan={3} className="text-center p-4 text-gray-500 flex items-center justify-center"><Loader2 className="animate-spin mr-2" /> Loading guests...</td></tr>
                          ) : guests.length > 0 ? (
                            guests.map(guest => (
                              <tr key={guest.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-3 text-gray-800">{guest.name}</td>
                                <td className="p-3 text-gray-600 font-mono">{guest.phone || 'N/A'}</td>
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center space-x-2">
                                    <button
                                      onClick={() => handleSendWhatsapp(guest)}
                                      disabled={!guest.phone || deletingId === guest.id}
                                      className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                      <Send size={14} /> <span>Send</span>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteGuest(guest)}
                                      disabled={deletingId === guest.id}
                                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50"
                                      title="Delete Guest"
                                    >
                                      {deletingId === guest.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan={3} className="text-center p-4 text-gray-500">No guests found. Add guests above or import a CSV file.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'json' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Settings & Data Management</h2>
                  
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Import / Export</h3>
                    <div className="flex space-x-4">
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
                      <button onClick={handleImportClick} className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <Upload size={18} /> <span>Import JSON</span>
                      </button>
                      <button onClick={handleExport} className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <Download size={18} /> <span>Export JSON</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Importing a file will overwrite your current unsaved changes.</p>
                  </div>
                  
                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Live JSON Preview</h3>
                    <textarea
                      readOnly
                      value={JSON.stringify(editedConfig, null, 2)}
                      className="w-full h-96 bg-gray-900 text-green-300 font-mono text-xs rounded-lg p-4 border border-gray-700 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; focusColor?: string }> = 
({ label, value, onChange, type = 'text', placeholder, focusColor = 'focus:ring-rose-500' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor} focus:outline-none`}
    />
  </div>
);

const TextareaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; focusColor?: string; rows?: number }> = 
({ label, value, onChange, focusColor = 'focus:ring-rose-500', rows = 3 }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 ${focusColor} focus:outline-none`}
      />
    </div>
);

const ColorInputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = 
({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={value}
        onChange={onChange}
        className="p-1 h-10 w-10 block bg-white border border-gray-300 cursor-pointer rounded-lg"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none`}
      />
    </div>
  </div>
);

export default ClientDashboard;