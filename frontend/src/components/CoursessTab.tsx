import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, Search, Filter, Star, Clock, Users, Award, X, ChevronRight,
  Code, Palette, Briefcase, Heart, ShoppingCart, GraduationCap, TrendingUp, Share2
} from 'lucide-react';

interface Course {
  id: number;
  name: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
  duration: string;
  students: number;
  rating: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface CoursesTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange' | 'royalBlue' | 'emerald';
}

const COURSES_DATA: Course[] = [
  // Computer Courses
  { id: 1, name: 'Basic Computer Course', category: 'Computer', icon: <Code className="w-6 h-6" />, color: 'text-blue-500', bgColor: 'bg-blue-500/10', description: 'Fundamentals of computing and operating systems', duration: '4 weeks', students: 234, rating: 4.8, difficulty: 'Beginner' },
  { id: 2, name: 'Advanced Computer Application', category: 'Computer', icon: <Code className="w-6 h-6" />, color: 'text-blue-600', bgColor: 'bg-blue-500/10', description: 'Master advanced software applications', duration: '6 weeks', students: 189, rating: 4.7, difficulty: 'Advanced' },
  { id: 3, name: 'MS Office Professional', category: 'Computer', icon: <Code className="w-6 h-6" />, color: 'text-green-500', bgColor: 'bg-green-500/10', description: 'Word, Excel, PowerPoint and Outlook', duration: '5 weeks', students: 412, rating: 4.9, difficulty: 'Beginner' },
  { id: 4, name: 'Tally Prime with GST', category: 'Computer', icon: <Code className="w-6 h-6" />, color: 'text-purple-500', bgColor: 'bg-purple-500/10', description: 'Accounting with Tally ERP', duration: '6 weeks', students: 156, rating: 4.6, difficulty: 'Intermediate' },
  { id: 5, name: 'Computer Hardware & Networking', category: 'Computer', icon: <Code className="w-6 h-6" />, color: 'text-orange-500', bgColor: 'bg-orange-500/10', description: 'Hardware troubleshooting and network setup', duration: '8 weeks', students: 98, rating: 4.5, difficulty: 'Intermediate' },
  { id: 6, name: 'Data Entry Operator', category: 'Computer', icon: <Code className="w-6 h-6" />, color: 'text-pink-500', bgColor: 'bg-pink-500/10', description: 'Speed and accuracy in data entry', duration: '4 weeks', students: 267, rating: 4.7, difficulty: 'Beginner' },
  { id: 7, name: 'DTP (Desktop Publishing)', category: 'Computer', icon: <Code className="w-6 h-6" />, color: 'text-red-500', bgColor: 'bg-red-500/10', description: 'Professional publishing and design software', duration: '5 weeks', students: 145, rating: 4.6, difficulty: 'Beginner' },
  { id: 8, name: 'Graphic Designing', category: 'Computer', icon: <Palette className="w-6 h-6" />, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10', description: 'Adobe Creative Suite mastery', duration: '10 weeks', students: 234, rating: 4.8, difficulty: 'Intermediate' },
  { id: 9, name: 'AutoCAD Designing', category: 'Computer', icon: <Code className="w-6 h-6" />, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', description: '2D and 3D design with AutoCAD', duration: '8 weeks', students: 112, rating: 4.7, difficulty: 'Intermediate' },
  { id: 10, name: 'Cyber Security Basics', category: 'Computer', icon: <Code className="w-6 h-6" />, color: 'text-red-600', bgColor: 'bg-red-500/10', description: 'Network security and ethical hacking basics', duration: '6 weeks', students: 178, rating: 4.9, difficulty: 'Intermediate' },

  // Digital Marketing Courses
  { id: 11, name: 'Digital Marketing', category: 'Digital Marketing', icon: <TrendingUp className="w-6 h-6" />, color: 'text-green-600', bgColor: 'bg-green-500/10', description: 'Complete digital marketing strategies', duration: '7 weeks', students: 456, rating: 4.8, difficulty: 'Beginner' },
  { id: 12, name: 'Social Media Marketing', category: 'Digital Marketing', icon: <Share2 className="w-6 h-6" />, color: 'text-pink-600', bgColor: 'bg-pink-500/10', description: 'Master Facebook, Instagram, Twitter', duration: '6 weeks', students: 523, rating: 4.9, difficulty: 'Beginner' },
  { id: 13, name: 'SEO (Search Engine Optimization)', category: 'Digital Marketing', icon: <TrendingUp className="w-6 h-6" />, color: 'text-blue-600', bgColor: 'bg-blue-500/10', description: 'Organic search engine optimization', duration: '8 weeks', students: 342, rating: 4.7, difficulty: 'Intermediate' },
  { id: 14, name: 'Google Ads Management', category: 'Digital Marketing', icon: <Code className="w-6 h-6" />, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', description: 'PPC and Google Ads campaigns', duration: '5 weeks', students: 267, rating: 4.8, difficulty: 'Beginner' },
  { id: 15, name: 'Content Marketing', category: 'Digital Marketing', icon: <BookOpen className="w-6 h-6" />, color: 'text-purple-600', bgColor: 'bg-purple-500/10', description: 'Create engaging content strategies', duration: '6 weeks', students: 298, rating: 4.6, difficulty: 'Intermediate' },
  { id: 16, name: 'Email Marketing', category: 'Digital Marketing', icon: <Code className="w-6 h-6" />, color: 'text-orange-600', bgColor: 'bg-orange-500/10', description: 'Email campaigns and automation', duration: '4 weeks', students: 189, rating: 4.7, difficulty: 'Beginner' },
  { id: 17, name: 'Affiliate Marketing', category: 'Digital Marketing', icon: <TrendingUp className="w-6 h-6" />, color: 'text-green-700', bgColor: 'bg-green-500/10', description: 'Build profitable affiliate programs', duration: '5 weeks', students: 134, rating: 4.5, difficulty: 'Advanced' },
  { id: 18, name: 'YouTube Marketing', category: 'Digital Marketing', icon: <Code className="w-6 h-6" />, color: 'text-red-600', bgColor: 'bg-red-500/10', description: 'Channel growth and monetization', duration: '6 weeks', students: 245, rating: 4.8, difficulty: 'Intermediate' },
  { id: 19, name: 'E-Commerce Management', category: 'Digital Marketing', icon: <ShoppingCart className="w-6 h-6" />, color: 'text-blue-700', bgColor: 'bg-blue-500/10', description: 'Online store setup and optimization', duration: '7 weeks', students: 178, rating: 4.7, difficulty: 'Intermediate' },
  { id: 20, name: 'Influencer Marketing', category: 'Digital Marketing', icon: <Award className="w-6 h-6" />, color: 'text-pink-700', bgColor: 'bg-pink-500/10', description: 'Collaborate with influencers', duration: '5 weeks', students: 156, rating: 4.6, difficulty: 'Intermediate' },

  // Web Development Courses
  { id: 21, name: 'Web Designing', category: 'Web Development', icon: <Palette className="w-6 h-6" />, color: 'text-purple-500', bgColor: 'bg-purple-500/10', description: 'Modern web design principles', duration: '6 weeks', students: 267, rating: 4.8, difficulty: 'Beginner' },
  { id: 22, name: 'HTML & CSS Development', category: 'Web Development', icon: <Code className="w-6 h-6" />, color: 'text-red-500', bgColor: 'bg-red-500/10', description: 'Frontend fundamentals', duration: '4 weeks', students: 512, rating: 4.9, difficulty: 'Beginner' },
  { id: 23, name: 'JavaScript Programming', category: 'Web Development', icon: <Code className="w-6 h-6" />, color: 'text-yellow-600', bgColor: 'bg-yellow-500/10', description: 'Interactive web development', duration: '8 weeks', students: 389, rating: 4.8, difficulty: 'Intermediate' },
  { id: 24, name: 'WordPress Development', category: 'Web Development', icon: <Code className="w-6 h-6" />, color: 'text-blue-600', bgColor: 'bg-blue-500/10', description: 'WordPress themes and plugins', duration: '5 weeks', students: 234, rating: 4.7, difficulty: 'Beginner' },
  { id: 25, name: 'Responsive Website Design', category: 'Web Development', icon: <Palette className="w-6 h-6" />, color: 'text-green-500', bgColor: 'bg-green-500/10', description: 'Mobile-first design approach', duration: '5 weeks', students: 198, rating: 4.8, difficulty: 'Intermediate' },
  { id: 26, name: 'Front-End Development', category: 'Web Development', icon: <Code className="w-6 h-6" />, color: 'text-indigo-600', bgColor: 'bg-indigo-500/10', description: 'React, Vue, Angular frameworks', duration: '10 weeks', students: 156, rating: 4.7, difficulty: 'Advanced' },
  { id: 27, name: 'UI/UX Design', category: 'Web Development', icon: <Palette className="w-6 h-6" />, color: 'text-pink-600', bgColor: 'bg-pink-500/10', description: 'User interface and experience design', duration: '8 weeks', students: 212, rating: 4.9, difficulty: 'Intermediate' },
  { id: 28, name: 'Shopify Website Design', category: 'Web Development', icon: <ShoppingCart className="w-6 h-6" />, color: 'text-green-600', bgColor: 'bg-green-500/10', description: 'E-commerce with Shopify', duration: '6 weeks', students: 145, rating: 4.6, difficulty: 'Beginner' },
  { id: 29, name: 'Web Application Development', category: 'Web Development', icon: <Code className="w-6 h-6" />, color: 'text-blue-700', bgColor: 'bg-blue-500/10', description: 'Full-stack web applications', duration: '12 weeks', students: 98, rating: 4.8, difficulty: 'Advanced' },
  { id: 30, name: 'Freelancing for Web Designers', category: 'Web Development', icon: <Briefcase className="w-6 h-6" />, color: 'text-orange-600', bgColor: 'bg-orange-500/10', description: 'Build freelance career', duration: '4 weeks', students: 189, rating: 4.7, difficulty: 'Beginner' },

  // Art & Craft Courses
  { id: 31, name: 'Drawing & Sketching', category: 'Art & Craft', icon: <Palette className="w-6 h-6" />, color: 'text-amber-600', bgColor: 'bg-amber-500/10', description: 'Basic to advanced drawing techniques', duration: '8 weeks', students: 145, rating: 4.7, difficulty: 'Beginner' },
  { id: 32, name: 'Painting & Color Theory', category: 'Art & Craft', icon: <Palette className="w-6 h-6" />, color: 'text-pink-500', bgColor: 'bg-pink-500/10', description: 'Oil, acrylic, watercolor painting', duration: '10 weeks', students: 123, rating: 4.8, difficulty: 'Beginner' },
  { id: 33, name: 'Fabric Painting', category: 'Art & Craft', icon: <Palette className="w-6 h-6" />, color: 'text-purple-600', bgColor: 'bg-purple-500/10', description: 'Paint on textiles and fabrics', duration: '4 weeks', students: 87, rating: 4.6, difficulty: 'Beginner' },
  { id: 34, name: 'Glass Painting', category: 'Art & Craft', icon: <Palette className="w-6 h-6" />, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', description: 'Decorative glass art', duration: '5 weeks', students: 67, rating: 4.5, difficulty: 'Beginner' },
  { id: 35, name: 'Pottery & Clay Modelling', category: 'Art & Craft', icon: <Palette className="w-6 h-6" />, color: 'text-orange-700', bgColor: 'bg-orange-500/10', description: 'Hands-on pottery techniques', duration: '8 weeks', students: 102, rating: 4.7, difficulty: 'Beginner' },
  { id: 36, name: 'Paper Craft Making', category: 'Art & Craft', icon: <Palette className="w-6 h-6" />, color: 'text-yellow-600', bgColor: 'bg-yellow-500/10', description: 'Creative paper projects', duration: '4 weeks', students: 156, rating: 4.6, difficulty: 'Beginner' },
  { id: 37, name: 'Waste Material Craft', category: 'Art & Craft', icon: <Palette className="w-6 h-6" />, color: 'text-green-700', bgColor: 'bg-green-500/10', description: 'Upcycling and eco-friendly crafts', duration: '5 weeks', students: 178, rating: 4.8, difficulty: 'Beginner' },
  { id: 38, name: 'Candle Making', category: 'Art & Craft', icon: <Palette className="w-6 h-6" />, color: 'text-red-500', bgColor: 'bg-red-500/10', description: 'Create decorative candles', duration: '3 weeks', students: 134, rating: 4.7, difficulty: 'Beginner' },
  { id: 39, name: 'Handmade Gift Making', category: 'Art & Craft', icon: <Palette className="w-6 h-6" />, color: 'text-pink-600', bgColor: 'bg-pink-500/10', description: 'DIY gift ideas and packaging', duration: '4 weeks', students: 201, rating: 4.7, difficulty: 'Beginner' },
  { id: 40, name: 'Decorative Item Making', category: 'Art & Craft', icon: <Palette className="w-6 h-6" />, color: 'text-purple-500', bgColor: 'bg-purple-500/10', description: 'Home decoration projects', duration: '5 weeks', students: 145, rating: 4.6, difficulty: 'Beginner' },

  // Cookery Courses
  { id: 41, name: 'Basic Cooking Skills', category: 'Cookery', icon: <Award className="w-6 h-6" />, color: 'text-red-600', bgColor: 'bg-red-500/10', description: 'Fundamental cooking techniques', duration: '4 weeks', students: 298, rating: 4.8, difficulty: 'Beginner' },
  { id: 42, name: 'Indian Cuisine Mastery', category: 'Cookery', icon: <Award className="w-6 h-6" />, color: 'text-orange-600', bgColor: 'bg-orange-500/10', description: 'Traditional Indian recipes and spices', duration: '6 weeks', students: 467, rating: 4.9, difficulty: 'Beginner' },
  { id: 43, name: 'Baking & Pastry', category: 'Cookery', icon: <Award className="w-6 h-6" />, color: 'text-yellow-600', bgColor: 'bg-yellow-500/10', description: 'Breads, cakes, pastries and desserts', duration: '8 weeks', students: 234, rating: 4.7, difficulty: 'Intermediate' },
  { id: 44, name: 'Continental Cuisine', category: 'Cookery', icon: <Award className="w-6 h-6" />, color: 'text-blue-600', bgColor: 'bg-blue-500/10', description: 'European cooking techniques', duration: '6 weeks', students: 156, rating: 4.6, difficulty: 'Intermediate' },
  { id: 45, name: 'Chinese Cooking', category: 'Cookery', icon: <Award className="w-6 h-6" />, color: 'text-red-700', bgColor: 'bg-red-500/10', description: 'Chinese recipes and cooking methods', duration: '5 weeks', students: 189, rating: 4.7, difficulty: 'Intermediate' },
  { id: 46, name: 'Cake Decorating', category: 'Cookery', icon: <Award className="w-6 h-6" />, color: 'text-pink-600', bgColor: 'bg-pink-500/10', description: 'Advanced cake decoration techniques', duration: '6 weeks', students: 145, rating: 4.8, difficulty: 'Intermediate' },
  { id: 47, name: 'Health & Nutrition Cooking', category: 'Cookery', icon: <Award className="w-6 h-6" />, color: 'text-green-600', bgColor: 'bg-green-500/10', description: 'Nutritious and healthy meal prep', duration: '5 weeks', students: 212, rating: 4.6, difficulty: 'Beginner' },
  { id: 48, name: 'Microwave Cooking', category: 'Cookery', icon: <Award className="w-6 h-6" />, color: 'text-purple-600', bgColor: 'bg-purple-500/10', description: 'Quick and easy microwave recipes', duration: '3 weeks', students: 178, rating: 4.7, difficulty: 'Beginner' },
  { id: 49, name: 'Italian Cuisine', category: 'Cookery', icon: <Award className="w-6 h-6" />, color: 'text-green-700', bgColor: 'bg-green-500/10', description: 'Authentic Italian cooking', duration: '6 weeks', students: 134, rating: 4.8, difficulty: 'Intermediate' },
  { id: 50, name: 'Chocolate Making', category: 'Cookery', icon: <Award className="w-6 h-6" />, color: 'text-amber-900', bgColor: 'bg-amber-500/10', description: 'Homemade chocolate and confectionery', duration: '4 weeks', students: 98, rating: 4.9, difficulty: 'Intermediate' },
];

const courseImageByCategory: Record<string, string> = {
  Computer: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'Digital Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
  'Web Development': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
  'Art & Craft': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80',
  Cookery: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80',
};

function courseImage(course: Course) {
  return courseImageByCategory[course.category] || courseImageByCategory.Computer;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-100 text-green-800';
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'Advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function CoursesTab({ theme = 'original' }: CoursesTabProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const categories = Array.from(new Set(COURSES_DATA.map(c => c.category)));
  
  const filteredCourses = COURSES_DATA.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isGlass = theme === 'glassNavy';
  const isSunrise = theme === 'sunriseOrange';

  const bgClass = isGlass 
    ? 'bg-white' 
    : isSunrise 
    ? 'bg-gradient-to-br from-orange-50 to-amber-50'
    : 'bg-[#09090f]';
  
  const textColor = isGlass ? 'text-gray-900' : 'text-white';
  const borderColor = isGlass ? 'border-gray-200' : 'border-[#2C2C2E]';

  return (
    <div className={`w-full min-h-screen ${bgClass} ${textColor}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-black">Courses</h1>
          </div>
          <p className={`text-sm ${isGlass ? 'text-gray-600' : 'text-gray-400'}`}>
            Discover and enroll in our wide range of professional courses
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isGlass 
                  ? 'bg-white border-gray-200 text-gray-900' 
                  : 'bg-[#18181B] border-[#2C2C2E] text-white'
              }`}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                !selectedCategory
                  ? isGlass
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-blue-600 text-white border-blue-600'
                  : isGlass
                  ? 'bg-white border-gray-200 text-gray-900'
                  : 'bg-[#18181B] border-[#2C2C2E] text-white'
              }`}
            >
              All Courses
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  selectedCategory === category
                    ? isGlass
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-blue-600 text-white border-blue-600'
                    : isGlass
                    ? 'bg-white border-gray-200 text-gray-900'
                    : 'bg-[#18181B] border-[#2C2C2E] text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCourses.length === 0 ? (
            <div className={`col-span-full py-12 text-center rounded-lg border-2 border-dashed ${borderColor}`}>
              <p className="text-lg font-semibold">No courses found</p>
              <p className={`text-sm mt-2 ${isGlass ? 'text-gray-600' : 'text-gray-400'}`}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            filteredCourses.map(course => (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`cursor-pointer overflow-hidden rounded-lg border transition-all hover:shadow-lg hover:scale-105 ${
                  isGlass
                    ? 'bg-white border-gray-200'
                    : 'bg-[#18181B] border-[#2C2C2E]'
                }`}
              >
                <div className="relative h-36 overflow-hidden">
                  <img src={courseImage(course)} alt="" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute left-4 bottom-3 px-3 py-1 rounded-full bg-white/90 text-blue-700 text-[10px] font-black">
                    {course.category}
                  </span>
                </div>
                <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${course.bgColor}`}>
                    <div className={`${course.color} w-6 h-6`}>
                      {course.icon}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="text-sm font-bold">{course.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2">{course.name}</h3>
                <p className={`text-xs font-semibold mb-3 ${isGlass ? 'text-blue-600' : 'text-blue-400'}`}>
                  {course.category}
                </p>
                <p className={`text-sm mb-4 ${isGlass ? 'text-gray-600' : 'text-gray-400'}`}>
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-3 text-xs mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {course.students}
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-lg text-xs font-bold w-fit ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Course Detail Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-lg max-h-screen overflow-y-auto w-full max-w-2xl border ${
              isGlass
                ? 'bg-white border-gray-200'
                : 'bg-[#1C1C1F] border-[#2C2C2E]'
            }`}>
              <div className={`p-6 border-b flex items-center justify-between sticky top-0 ${
                isGlass ? 'bg-white border-gray-200' : 'bg-[#18181B] border-[#2C2C2E]'
              }`}>
                <h2 className="text-2xl font-black">{selectedCourse.name}</h2>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className={`p-2 rounded-lg transition-all ${isGlass ? 'hover:bg-gray-100' : 'hover:bg-[#2C2C2E]'}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="relative h-56 rounded-xl overflow-hidden">
                  <img src={courseImage(selectedCourse)} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                  <div className="absolute left-5 bottom-5 text-white">
                    <p className="text-xs font-black uppercase opacity-80">{selectedCourse.category}</p>
                    <h3 className="text-2xl font-black">{selectedCourse.name}</h3>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-xl ${selectedCourse.bgColor}`}>
                    <div className={`${selectedCourse.color} w-8 h-8`}>
                      {selectedCourse.icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-600 mb-1">{selectedCourse.category}</p>
                    <p className={`${isGlass ? 'text-gray-600' : 'text-gray-400'}`}>{selectedCourse.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${isGlass ? 'bg-gray-50' : 'bg-[#0F0F12]'}`}>
                    <p className="text-xs font-bold uppercase opacity-60 mb-2">Duration</p>
                    <p className="text-lg font-black">{selectedCourse.duration}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${isGlass ? 'bg-gray-50' : 'bg-[#0F0F12]'}`}>
                    <p className="text-xs font-bold uppercase opacity-60 mb-2">Difficulty</p>
                    <p className={`text-lg font-black px-2 py-1 rounded w-fit ${getDifficultyColor(selectedCourse.difficulty)}`}>
                      {selectedCourse.difficulty}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${isGlass ? 'bg-gray-50' : 'bg-[#0F0F12]'}`}>
                    <p className="text-xs font-bold uppercase opacity-60 mb-2">Enrolled</p>
                    <p className="text-lg font-black">{selectedCourse.students} Students</p>
                  </div>
                  <div className={`p-4 rounded-xl ${isGlass ? 'bg-gray-50' : 'bg-[#0F0F12]'}`}>
                    <p className="text-xs font-bold uppercase opacity-60 mb-2">Rating</p>
                    <p className="text-lg font-black flex items-center gap-1">
                      <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                      {selectedCourse.rating}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t flex gap-3">
                  <button className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    isGlass
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                    Enroll in Course
                  </button>
                  <button className={`flex-1 py-3 rounded-xl font-bold border transition-all ${
                    isGlass
                      ? 'bg-white border-gray-200 text-blue-600 hover:bg-gray-50'
                      : 'bg-[#0F0F12] border-[#2C2C2E] text-white hover:bg-[#18181B]'
                  }`}>
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
