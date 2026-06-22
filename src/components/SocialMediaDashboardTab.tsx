import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Plus, Edit2, Trash2, Calendar, BarChart3, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'courses' | 'analytics'>('posts');
  const [dailyUpdateTime, setDailyUpdateTime] = useState('09:00');

  const ADMIN_PASSWORD = 'Xavier@2024'; // Change this to your password

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
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
      confetti();
    } else {
      alert('❌ गलत पासवर्ड! (Wrong Password!)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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
              <strong>Demo Password:</strong> Xavier@2024
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
        <div className="flex gap-4 mb-6 bg-white rounded-lg p-2 shadow">
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
