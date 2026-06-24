import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Plus, Trash2, Calendar, BarChart3, AlertCircle, ExternalLink, Monitor, UploadCloud, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DEFAULT_SOCIAL_LINKS, SCHOOL_YOUTUBE_CHANNEL_URL, getSocialIcon } from '../settings';

interface Post {
  id: string;
  platform: string;
  content: string;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'posted';
  image?: string;
  engagement?: number;
}

interface Course {
  id: string;
  title: string;
  date: string;
  platform: string;
}

const SocialMediaDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    platform: 'instagram',
    content: '',
    scheduledTime: '',
    image: ''
  });
  const [newCourse, setNewCourse] = useState({
    title: '',
    date: '',
    platform: 'instagram'
  });
  const [quickUpload, setQuickUpload] = useState({
    platform: 'instagram',
    type: 'msg' as 'msg' | 'video' | 'reel',
    message: '',
    mediaUrl: ''
  });
  const [aiPromotion, setAiPromotion] = useState({
    topic: '',
    platform: 'instagram',
    audience: 'parents and students',
    tone: 'professional',
    contentType: 'post',
    result: '',
    source: ''
  });
  const [isGeneratingPromotion, setIsGeneratingPromotion] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'desktop' | 'posts' | 'courses' | 'analytics'>('desktop');
  const [dailyUpdateTime, setDailyUpdateTime] = useState('09:00');

  const ADMIN_EMAIL = 'Aftabkhan@outlook.com';
  const ADMIN_PASSWORD = 'Saint@1990';

  // Load data from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('socialPosts');
    const savedCourses = localStorage.getItem('courses');
    const savedTime = localStorage.getItem('dailyUpdateTime');
    
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    if (savedTime) setDailyUpdateTime(savedTime);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('socialPosts', JSON.stringify(posts));
      localStorage.setItem('courses', JSON.stringify(courses));
      localStorage.setItem('dailyUpdateTime', dailyUpdateTime);
    }
  }, [posts, courses, dailyUpdateTime, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setEmail('');
      setPassword('');
      confetti();
    } else {
      alert('Wrong email or password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setPosts([]);
    setCourses([]);
  };

  const addPost = () => {
    if (!newPost.content || !newPost.scheduledTime) {
      alert('कृपया सभी फील्ड भरें (Please fill all fields)');
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      platform: newPost.platform,
      content: newPost.content,
      scheduledTime: newPost.scheduledTime,
      image: newPost.image,
      status: 'scheduled',
      engagement: 0
    };

    setPosts([...posts, post]);
    setNewPost({ platform: 'instagram', content: '', scheduledTime: '', image: '' });
    setShowPostForm(false);
    confetti({ particleCount: 50, spread: 45 });
  };

  const addCourse = () => {
    if (!newCourse.title || !newCourse.date) {
      alert('कृपया सभी फील्ड भरें (Please fill all fields)');
      return;
    }

    const course: Course = {
      id: Date.now().toString(),
      title: newCourse.title,
      date: newCourse.date,
      platform: newCourse.platform
    };

    setCourses([...courses, course]);
    setNewCourse({ title: '', date: '', platform: 'instagram' });
    setShowCourseForm(false);
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const updatePostStatus = (id: string, status: Post['status']) => {
    setPosts(posts.map(p => p.id === id ? { ...p, status } : p));
  };

  const getComposerUrl = () => {
    const app = DEFAULT_SOCIAL_LINKS.find(item => item.id === quickUpload.platform);
    const message = encodeURIComponent(quickUpload.message);
    const mediaUrl = encodeURIComponent(quickUpload.mediaUrl);

    switch (quickUpload.platform) {
      case 'whatsapp':
        return `https://wa.me/?text=${message}${mediaUrl ? `%0A${mediaUrl}` : ''}`;
      case 'telegram':
        return `https://t.me/share/url?url=${mediaUrl || encodeURIComponent(app?.url || '')}&text=${message}`;
      case 'x':
        return `https://x.com/intent/tweet?text=${message}${mediaUrl ? `&url=${mediaUrl}` : ''}`;
      case 'facebook':
        return quickUpload.mediaUrl
          ? `https://www.facebook.com/sharer/sharer.php?u=${mediaUrl}&quote=${message}`
          : 'https://www.facebook.com/';
      case 'linkedin':
        return quickUpload.mediaUrl
          ? `https://www.linkedin.com/sharing/share-offsite/?url=${mediaUrl}`
          : 'https://www.linkedin.com/feed/';
      case 'reddit':
        return quickUpload.mediaUrl
          ? `https://www.reddit.com/submit?url=${mediaUrl}&title=${message}`
          : 'https://www.reddit.com/submit';
      case 'pinterest':
        return quickUpload.mediaUrl
          ? `https://www.pinterest.com/pin/create/button/?url=${mediaUrl}&description=${message}`
          : 'https://www.pinterest.com/pin-builder/';
      case 'youtube':
        return SCHOOL_YOUTUBE_CHANNEL_URL;
      case 'instagram':
        return 'https://www.instagram.com/';
      default:
        return app?.url || 'https://www.google.com';
    }
  };

  const handleOneClickUpload = () => {
    if (!quickUpload.message.trim() && !quickUpload.mediaUrl.trim()) {
      alert('Message ya media URL add karo.');
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      platform: quickUpload.platform,
      content: `[${quickUpload.type.toUpperCase()}] ${quickUpload.message || quickUpload.mediaUrl}`,
      scheduledTime: new Date().toISOString(),
      image: quickUpload.mediaUrl,
      status: 'posted',
      engagement: 0
    };

    setPosts([post, ...posts]);
    window.open(getComposerUrl(), '_blank', 'noopener,noreferrer');
    confetti({ particleCount: 70, spread: 55 });
  };

  const generateAiPromotion = async () => {
    if (!aiPromotion.topic.trim()) {
      alert('Promotion topic add karo.');
      return;
    }

    setIsGeneratingPromotion(true);
    try {
      const platformLabel = DEFAULT_SOCIAL_LINKS.find(app => app.id === aiPromotion.platform)?.label || aiPromotion.platform;
      const response = await fetch('http://localhost:3001/api/ai/promotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiPromotion.topic,
          platform: platformLabel,
          audience: aiPromotion.audience,
          tone: aiPromotion.tone,
          contentType: aiPromotion.contentType
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'AI promotion failed');
      }
      setAiPromotion(prev => ({
        ...prev,
        result: data.promotion || '',
        source: data.source || 'ai'
      }));
    } catch (error) {
      const fallback = `Saint Xavier Convent School update: ${aiPromotion.topic}\n\nA special ${aiPromotion.contentType} for ${aiPromotion.audience}. Stay connected with our school community for important updates, achievements, events, and student success stories.\n\nContact the school office for details.\n\n#SaintXavierConventSchool #IndoreSchool #Education #StudentSuccess #SchoolUpdate`;
      setAiPromotion(prev => ({ ...prev, result: fallback, source: 'browser-fallback' }));
    } finally {
      setIsGeneratingPromotion(false);
    }
  };

  const applyPromotionToUpload = () => {
    if (!aiPromotion.result.trim()) {
      alert('Pehle AI promotion generate karo.');
      return;
    }
    setQuickUpload(prev => ({
      ...prev,
      platform: aiPromotion.platform,
      type: aiPromotion.contentType === 'reel' ? 'reel' : aiPromotion.contentType === 'video' ? 'video' : 'msg',
      message: aiPromotion.result
    }));
    confetti({ particleCount: 35, spread: 35 });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'posted': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch(platform) {
      case 'instagram': return 'bg-pink-100 text-pink-800';
      case 'facebook': return 'bg-blue-100 text-blue-800';
      case 'twitter': return 'bg-cyan-100 text-cyan-800';
      case 'whatsapp': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-600 p-4 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            📱 सोशल मीडिया डैशबोर्ड
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Saint Xavier Convent School
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email ID
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Aftabkhan@outlook.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                पासवर्ड (Password)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
            >
              लॉगिन करें (Login)
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> Aftabkhan@outlook.com<br />
              <strong>Password:</strong> Saint@1990
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">📱 सोशल मीडिया डैशबोर्ड</h1>
            <p className="text-purple-100">Saint Xavier Convent School, Indore</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            <LogOut className="w-5 h-5" />
            लॉगआउट
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-6 bg-white rounded-lg p-2 shadow">
          <button
            onClick={() => setActiveTab('desktop')}
            className={`px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'desktop'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Monitor className="w-4 h-4" />
            Desktop Apps
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'posts'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📝 पोस्ट्स ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'courses'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📚 कोर्सेज ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'analytics'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 एनालिटिक्स
          </button>
        </div>

        {/* Desktop Apps Tab */}
        {activeTab === 'desktop' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    AI Auto Promotion
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">School campaign ke liye caption, CTA, hashtags, aur platform-ready promotion generate kare.</p>
                </div>
                <button
                  onClick={generateAiPromotion}
                  disabled={isGeneratingPromotion}
                  className="h-12 px-6 rounded-lg bg-gray-900 text-white font-black hover:bg-purple-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {isGeneratingPromotion ? 'Generating...' : 'Generate Promotion'}
                </button>
              </div>

              <div className="grid lg:grid-cols-[2fr_1fr_1fr] gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Promotion Topic</label>
                  <input
                    type="text"
                    value={aiPromotion.topic}
                    onChange={(e) => setAiPromotion({ ...aiPromotion, topic: e.target.value })}
                    placeholder="Example: Annual function admission open, science fair, board results..."
                    className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Platform</label>
                  <select
                    value={aiPromotion.platform}
                    onChange={(e) => setAiPromotion({ ...aiPromotion, platform: e.target.value })}
                    className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {DEFAULT_SOCIAL_LINKS.map(app => (
                      <option key={app.id} value={app.id}>{app.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Content</label>
                  <select
                    value={aiPromotion.contentType}
                    onChange={(e) => setAiPromotion({ ...aiPromotion, contentType: e.target.value })}
                    className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="post">Post</option>
                    <option value="reel">Reel</option>
                    <option value="video">Video</option>
                    <option value="story">Story</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Audience</label>
                  <input
                    type="text"
                    value={aiPromotion.audience}
                    onChange={(e) => setAiPromotion({ ...aiPromotion, audience: e.target.value })}
                    className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Tone</label>
                  <select
                    value={aiPromotion.tone}
                    onChange={(e) => setAiPromotion({ ...aiPromotion, tone: e.target.value })}
                    className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="professional">Professional</option>
                    <option value="festive">Festive</option>
                    <option value="urgent">Urgent</option>
                    <option value="friendly">Friendly</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>

              {aiPromotion.result && (
                <div className="mt-5 border border-purple-100 bg-purple-50 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-700">
                      Generated by {aiPromotion.source || 'AI'}
                    </span>
                    <button
                      onClick={applyPromotionToUpload}
                      className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-black hover:bg-purple-700 transition"
                    >
                      Use in One Click Upload
                    </button>
                  </div>
                  <textarea
                    value={aiPromotion.result}
                    onChange={(e) => setAiPromotion({ ...aiPromotion, result: e.target.value })}
                    className="w-full min-h-[150px] px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800"
                  />
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">One Click Upload</h2>
                  <p className="text-sm text-gray-500 mt-1">Message, video, or reel ko post log me save karke selected app ka composer open kare.</p>
                </div>
                <button
                  onClick={handleOneClickUpload}
                  className="h-12 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black hover:from-purple-700 hover:to-pink-700 transition flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-5 h-5" />
                  One Click Upload
                </button>
              </div>

              <div className="grid lg:grid-cols-[1fr_1fr_2fr] gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">App</label>
                  <select
                    value={quickUpload.platform}
                    onChange={(e) => setQuickUpload({ ...quickUpload, platform: e.target.value })}
                    className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {DEFAULT_SOCIAL_LINKS.map(app => (
                      <option key={app.id} value={app.id}>{app.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Content Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['msg', 'video', 'reel'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setQuickUpload({ ...quickUpload, type })}
                        className={`h-11 rounded-lg border text-sm font-black uppercase ${
                          quickUpload.type === type
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Media URL</label>
                  <input
                    type="url"
                    value={quickUpload.mediaUrl}
                    onChange={(e) => setQuickUpload({ ...quickUpload, mediaUrl: e.target.value })}
                    placeholder="https://example.com/video-or-reel.mp4"
                    className="w-full h-11 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Message / Caption</label>
                <textarea
                  value={quickUpload.message}
                  onChange={(e) => setQuickUpload({ ...quickUpload, message: e.target.value })}
                  placeholder="Caption ya message likhiye..."
                  className="w-full min-h-[96px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Social Media Handler Desktop</h2>
                  <p className="text-sm text-gray-500 mt-1">Open official social media apps from one admin desktop.</p>
                </div>
                <div className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100 px-3 py-2 rounded-lg">
                  {DEFAULT_SOCIAL_LINKS.length} official apps
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {DEFAULT_SOCIAL_LINKS.map((app, index) => {
                  const Icon = getSocialIcon(app.id);
                  const foreground = app.id === 'snapchat' ? '#111827' : app.color;
                  return (
                    <a
                      key={app.id}
                      href={app.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group min-h-[148px] rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all p-4 flex flex-col justify-between"
                      title={`Open ${app.label}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                          style={{ background: `${app.color}18`, color: foreground }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-black text-gray-400 tabular-nums">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-gray-900 text-sm leading-tight">{app.label}</h3>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-purple-600" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 leading-snug">{app.category}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {!showPostForm ? (
              <button
                onClick={() => setShowPostForm(true)}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                नई पोस्ट जोड़ें (Add New Post)
              </button>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                <h2 className="text-xl font-bold text-gray-800">नई पोस्ट बनाएं</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    प्लेटफॉर्म (Platform)
                  </label>
                  <select
                    value={newPost.platform}
                    onChange={(e) => setNewPost({ ...newPost, platform: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    कंटेंट (Content)
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="अपनी पोस्ट लिखें..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    शेड्यूल समय (Scheduled Time)
                  </label>
                  <input
                    type="datetime-local"
                    value={newPost.scheduledTime}
                    onChange={(e) => setNewPost({ ...newPost, scheduledTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    इमेज यूआरएल (Image URL)
                  </label>
                  <input
                    type="text"
                    value={newPost.image}
                    onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={addPost}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    ✅ पोस्ट शेड्यूल करें
                  </button>
                  <button
                    onClick={() => setShowPostForm(false)}
                    className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    ❌ रद्द करें
                  </button>
                </div>
              </div>
            )}

            {/* Posts List */}
            <div className="grid gap-4">
              {posts.length === 0 ? (
                <div className="bg-white p-8 rounded-lg text-center text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>कोई पोस्ट नहीं (No posts yet)</p>
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPlatformColor(post.platform)}`}>
                          {post.platform.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(post.status)}`}>
                          {post.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{post.content}</p>
                    
                    {post.image && (
                      <img src={post.image} alt="Post" className="w-full h-48 object-cover rounded mb-4" />
                    )}

                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.scheduledTime).toLocaleString('hi-IN')}</span>
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={post.status}
                        onChange={(e) => updatePostStatus(post.id, e.target.value as Post['status'])}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="posted">Posted</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            {!showCourseForm ? (
              <button
                onClick={() => setShowCourseForm(true)}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                नया कोर्स जोड़ें (Add New Course)
              </button>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                <h2 className="text-xl font-bold text-gray-800">नया कोर्स जोड़ें</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    कोर्स का नाम (Course Title)
                  </label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    placeholder="कोर्स का नाम..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    तारीख (Date)
                  </label>
                  <input
                    type="date"
                    value={newCourse.date}
                    onChange={(e) => setNewCourse({ ...newCourse, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    प्लेटफॉर्म (Platform)
                  </label>
                  <select
                    value={newCourse.platform}
                    onChange={(e) => setNewCourse({ ...newCourse, platform: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="website">Website</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={addCourse}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    ✅ कोर्स जोड़ें
                  </button>
                  <button
                    onClick={() => setShowCourseForm(false)}
                    className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    ❌ रद्द करें
                  </button>
                </div>
              </div>
            )}

            {/* Courses List */}
            <div className="grid md:grid-cols-2 gap-4">
              {courses.length === 0 ? (
                <div className="bg-white p-8 rounded-lg text-center text-gray-500 md:col-span-2">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>कोई कोर्स नहीं (No courses yet)</p>
                </div>
              ) : (
                courses.map(course => (
                  <div key={course.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPlatformColor(course.platform)}`}>
                        {course.platform.toUpperCase()}
                      </span>
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{course.title}</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(course.date).toLocaleDateString('hi-IN')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                पोस्ट की जानकारी
              </h2>
              <div className="space-y-2 text-gray-700">
                <p className="flex justify-between"><span>कुल पोस्ट्स:</span> <span className="font-bold">{posts.length}</span></p>
                <p className="flex justify-between"><span>शेड्यूल किये हुए:</span> <span className="font-bold">{posts.filter(p => p.status === 'scheduled').length}</span></p>
                <p className="flex justify-between"><span>पोस्ट किये हुए:</span> <span className="font-bold text-green-600">{posts.filter(p => p.status === 'posted').length}</span></p>
                <p className="flex justify-between"><span>ड्राफ्ट:</span> <span className="font-bold text-gray-600">{posts.filter(p => p.status === 'draft').length}</span></p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-800 mb-4">👥 प्लेटफॉर्म विश्लेषण</h2>
              <div className="space-y-2 text-gray-700">
                {['instagram', 'facebook', 'twitter', 'whatsapp'].map(platform => (
                  <p key={platform} className="flex justify-between">
                    <span className="capitalize">{platform}:</span>
                    <span className="font-bold">{posts.filter(p => p.platform === platform).length}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-4">⏰ दैनिक अपडेट का समय</h2>
              <div className="flex items-center gap-4">
                <input
                  type="time"
                  value={dailyUpdateTime}
                  onChange={(e) => setDailyUpdateTime(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-gray-600">हर दिन इस समय अपडेट होगा</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📅 आने वाले कोर्सेज</h2>
              {courses.length === 0 ? (
                <p className="text-gray-500">कोई आने वाला कोर्स नहीं</p>
              ) : (
                <div className="space-y-2">
                  {courses.slice(0, 5).map(course => (
                    <div key={course.id} className="flex justify-between text-gray-700 pb-2 border-b">
                      <span>{course.title}</span>
                      <span className="text-sm text-gray-500">{new Date(course.date).toLocaleDateString('hi-IN')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaDashboard;
