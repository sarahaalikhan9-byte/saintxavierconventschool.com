import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Filter,
  GraduationCap,
  PlayCircle,
  Search,
  Star,
  Youtube
} from 'lucide-react';
import { SCHOOL_YOUTUBE_CHANNEL_URL } from '../settings';

interface DigitalLibraryTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange' | 'royalBlue' | 'emerald';
}

interface LibraryVideo {
  id: string;
  title: string;
  subject: string;
  grade: string;
  category: string;
  duration: string;
  level: string;
  description: string;
  query: string;
}

const libraryVideos: LibraryVideo[] = [
  {
    id: 'nursery-phonics',
    title: 'ABC Phonics & Early Reading',
    subject: 'English',
    grade: 'Nursery',
    category: 'Foundation',
    duration: '15 min',
    level: 'Beginner',
    description: 'Alphabet sounds, pronunciation, and picture-word recognition for early learners.',
    query: 'ABC phonics for nursery kids'
  },
  {
    id: 'kg-numbers',
    title: 'Counting 1 to 100',
    subject: 'Mathematics',
    grade: 'KG',
    category: 'Foundation',
    duration: '18 min',
    level: 'Beginner',
    description: 'Number recognition, counting practice, and simple classroom activities.',
    query: 'counting 1 to 100 kindergarten learning'
  },
  {
    id: 'class-1-hindi',
    title: 'Hindi Varnmala Practice',
    subject: 'Hindi',
    grade: 'I',
    category: 'Language',
    duration: '20 min',
    level: 'Beginner',
    description: 'Hindi letters, matras, and basic reading practice.',
    query: 'Hindi varnmala class 1 learning'
  },
  {
    id: 'class-3-evs',
    title: 'Plants Around Us',
    subject: 'EVS',
    grade: 'III',
    category: 'Science',
    duration: '22 min',
    level: 'Primary',
    description: 'Parts of plants, uses of plants, and simple observation activities.',
    query: 'EVS plants around us class 3'
  },
  {
    id: 'class-5-fractions',
    title: 'Fractions Made Easy',
    subject: 'Mathematics',
    grade: 'V',
    category: 'Math',
    duration: '25 min',
    level: 'Primary',
    description: 'Fractions, numerator, denominator, comparison, and examples.',
    query: 'fractions class 5 maths explanation'
  },
  {
    id: 'class-6-science',
    title: 'Food: Where Does It Come From?',
    subject: 'Science',
    grade: 'VI',
    category: 'Science',
    duration: '28 min',
    level: 'Middle',
    description: 'Food sources, plant and animal products, and nutrition basics.',
    query: 'class 6 science food where does it come from'
  },
  {
    id: 'class-7-history',
    title: 'Medieval India Overview',
    subject: 'Social Science',
    grade: 'VII',
    category: 'Social Studies',
    duration: '30 min',
    level: 'Middle',
    description: 'A visual introduction to medieval Indian history and major dynasties.',
    query: 'class 7 history medieval India explanation'
  },
  {
    id: 'class-8-algebra',
    title: 'Algebraic Expressions',
    subject: 'Mathematics',
    grade: 'VIII',
    category: 'Math',
    duration: '32 min',
    level: 'Middle',
    description: 'Terms, coefficients, like terms, and basic algebra operations.',
    query: 'class 8 algebraic expressions full chapter'
  },
  {
    id: 'class-9-motion',
    title: 'Motion and Graphs',
    subject: 'Physics',
    grade: 'IX',
    category: 'Science',
    duration: '35 min',
    level: 'Secondary',
    description: 'Distance, displacement, speed, velocity, acceleration, and graph reading.',
    query: 'class 9 physics motion graphs explanation'
  },
  {
    id: 'class-10-chemical',
    title: 'Chemical Reactions and Equations',
    subject: 'Chemistry',
    grade: 'X',
    category: 'Science',
    duration: '40 min',
    level: 'Board Prep',
    description: 'Balancing equations, reaction types, oxidation, and reduction.',
    query: 'class 10 chemical reactions and equations one shot'
  },
  {
    id: 'class-10-history',
    title: 'Nationalism in India',
    subject: 'History',
    grade: 'X',
    category: 'Social Studies',
    duration: '38 min',
    level: 'Board Prep',
    description: 'Important events, leaders, movements, and board exam revision points.',
    query: 'class 10 nationalism in India full chapter'
  },
  {
    id: 'class-11-physics',
    title: 'Units and Measurements',
    subject: 'Physics',
    grade: 'XI',
    category: 'Science',
    duration: '45 min',
    level: 'Senior',
    description: 'SI units, dimensions, errors, and significant figures.',
    query: 'class 11 physics units and measurements full chapter'
  },
  {
    id: 'class-11-accountancy',
    title: 'Accounting Basics',
    subject: 'Accountancy',
    grade: 'XI',
    category: 'Commerce',
    duration: '42 min',
    level: 'Senior',
    description: 'Accounting concepts, rules, debit-credit logic, and journal basics.',
    query: 'class 11 accountancy basics debit credit journal'
  },
  {
    id: 'class-12-biology',
    title: 'Human Reproduction Revision',
    subject: 'Biology',
    grade: 'XII',
    category: 'Science',
    duration: '50 min',
    level: 'Board Prep',
    description: 'Important diagrams, definitions, and exam-focused revision.',
    query: 'class 12 biology human reproduction revision'
  },
  {
    id: 'class-12-economics',
    title: 'National Income Concepts',
    subject: 'Economics',
    grade: 'XII',
    category: 'Commerce',
    duration: '44 min',
    level: 'Board Prep',
    description: 'GDP, GNP, NNP, factor cost, market price, and numerical basics.',
    query: 'class 12 economics national income concepts'
  },
  {
    id: 'spoken-english',
    title: 'Spoken English Practice',
    subject: 'English',
    grade: 'All',
    category: 'Skill',
    duration: '25 min',
    level: 'All Levels',
    description: 'Daily English speaking practice for school communication and confidence.',
    query: 'spoken English practice for school students'
  },
  {
    id: 'computer-basics',
    title: 'Computer Basics',
    subject: 'Computer',
    grade: 'All',
    category: 'Skill',
    duration: '30 min',
    level: 'All Levels',
    description: 'Hardware, software, internet basics, and digital safety.',
    query: 'computer basics for school students'
  },
  {
    id: 'exam-strategy',
    title: 'Board Exam Study Strategy',
    subject: 'Study Skills',
    grade: 'IX-XII',
    category: 'Exam Prep',
    duration: '20 min',
    level: 'Exam Prep',
    description: 'Timetable planning, revision, note-making, and answer writing tips.',
    query: 'board exam study strategy for students'
  }
];

const gradeFilters = ['All', 'Nursery', 'KG', 'I', 'III', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'IX-XII'];
const categories = ['All', 'Foundation', 'Language', 'Math', 'Science', 'Social Studies', 'Commerce', 'Skill', 'Exam Prep'];

function youtubeSearchUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

const libraryImageByCategory: Record<string, string> = {
  Foundation: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
  Language: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80',
  Math: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80',
  Science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80',
  'Social Studies': 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=900&q=80',
  Commerce: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
  Skill: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'Exam Prep': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80',
};

function libraryImage(video: LibraryVideo) {
  return libraryImageByCategory[video.category] || libraryImageByCategory.Foundation;
}

export default function DigitalLibraryTab({ theme = 'glassNavy' }: DigitalLibraryTabProps) {
  const isGlass = theme === 'glassNavy';
  const isSunrise = theme === 'sunriseOrange';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeVideoId, setActiveVideoId] = useState(libraryVideos[0].id);

  const filteredVideos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return libraryVideos.filter(video => {
      const matchesSearch = !query
        || video.title.toLowerCase().includes(query)
        || video.subject.toLowerCase().includes(query)
        || video.description.toLowerCase().includes(query);
      const matchesGrade = selectedGrade === 'All' || video.grade === selectedGrade || video.grade === 'All';
      const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
      return matchesSearch && matchesGrade && matchesCategory;
    });
  }, [searchTerm, selectedGrade, selectedCategory]);

  const activeVideo = filteredVideos.find(video => video.id === activeVideoId) || filteredVideos[0] || libraryVideos[0];

  const bgClass = isGlass
    ? 'bg-white/85 backdrop-blur-xl border-white/40 text-[#431407]'
    : isSunrise
      ? 'bg-gradient-to-br from-orange-50/90 to-amber-50/90 text-gray-900 border-orange-200/50'
      : 'bg-[#1C1C1F] border-[#2C2C2E] text-white';

  const panelClass = isGlass || isSunrise
    ? 'bg-white border-gray-200'
    : 'bg-[#0F0F12] border-[#2C2C2E]';

  const inputClass = isGlass || isSunrise
    ? 'bg-white border-gray-200 focus:border-red-500 text-gray-900'
    : 'bg-[#151518] border-[#2C2C2E] focus:border-red-500 text-white';

  return (
    <div className={`p-6 sm:p-8 rounded-3xl min-h-screen border ${bgClass}`}>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8 pb-6 border-b border-gray-500/10">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-xs font-black uppercase tracking-wider mb-3">
            <Youtube className="w-4 h-4" />
            YouTube Learning Hub
          </span>
          <h2 className="text-3xl md:text-4xl font-black flex items-center gap-3">
            <BookOpen className="text-red-500 w-8 h-8" />
            Digital Video Library
          </h2>
          <p className="opacity-65 text-sm mt-2 font-medium">
            Class-wise YouTube learning links for school revision, homework help, and board preparation.
          </p>
        </div>

        <div className={`rounded-2xl border px-4 py-3 ${panelClass}`}>
          <div className="text-xs font-bold opacity-60 uppercase">Available Videos</div>
          <div className="text-3xl font-black text-red-600">{filteredVideos.length}</div>
        </div>
      </div>

      <div className={`rounded-2xl border p-5 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${panelClass}`}>
        <div>
          <h3 className="text-xl font-black flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-600" />
            Saint Xavier Official YouTube Channel
          </h3>
          <p className="text-sm opacity-65 mt-1">School videos, learning updates, events, and digital classes.</p>
        </div>
        <a
          href={SCHOOL_YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-black transition"
        >
          Open Channel
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-6 mb-8">
        <div className={`rounded-2xl border overflow-hidden ${panelClass}`}>
          <div className="relative aspect-video bg-gradient-to-br from-red-600 via-slate-900 to-black flex items-center justify-center p-8 text-center text-white overflow-hidden">
            <img src={libraryImage(activeVideo)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[1px] scale-105" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/72 via-red-950/55 to-black/72" />
            <div className="relative z-10">
              <PlayCircle className="w-20 h-20 mx-auto mb-4 text-white/90" />
              <h3 className="text-2xl font-black">{activeVideo.title}</h3>
              <p className="text-sm text-white/75 mt-2 max-w-xl">{activeVideo.description}</p>
              <a
                href={youtubeSearchUrl(activeVideo.query)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-5 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-black transition"
              >
                <Youtube className="w-5 h-5" />
                Watch on YouTube
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border p-5 ${panelClass}`}>
          <h3 className="text-xl font-black mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-red-500" />
            Selected Lesson
          </h3>
          <div className="space-y-3 text-sm">
            <p><span className="font-black opacity-60">Subject:</span> {activeVideo.subject}</p>
            <p><span className="font-black opacity-60">Class:</span> {activeVideo.grade}</p>
            <p><span className="font-black opacity-60">Level:</span> {activeVideo.level}</p>
            <p><span className="font-black opacity-60">Duration:</span> {activeVideo.duration}</p>
            <p><span className="font-black opacity-60">Category:</span> {activeVideo.category}</p>
          </div>
          <div className="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/15 text-sm font-semibold">
            Open button YouTube search result par le jayega, jahan teacher/student exact video choose kar sakte hain.
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search YouTube lessons by subject, class, or topic..."
            className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none font-medium transition ${inputClass}`}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="relative">
            <select
              value={selectedGrade}
              onChange={(event) => setSelectedGrade(event.target.value)}
              className={`appearance-none w-full pl-4 pr-10 py-3 rounded-xl border outline-none font-medium cursor-pointer ${inputClass}`}
            >
              {gradeFilters.map(grade => (
                <option key={grade} value={grade}>{grade === 'All' ? 'All Classes' : `Class ${grade}`}</option>
              ))}
            </select>
            <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className={`appearance-none w-full pl-4 pr-10 py-3 rounded-xl border outline-none font-medium cursor-pointer ${inputClass}`}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category === 'All' ? 'All Categories' : category}</option>
              ))}
            </select>
            <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredVideos.map(video => {
          const isActive = activeVideo.id === video.id;
          return (
            <button
              key={video.id}
              type="button"
              onClick={() => setActiveVideoId(video.id)}
              className={`text-left rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-lg ${panelClass} ${isActive ? 'ring-2 ring-red-500 border-red-400' : ''}`}
            >
              <div className="mb-4 -mx-5 -mt-5 h-32 rounded-t-2xl overflow-hidden relative">
                <img src={libraryImage(video)} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <span className="absolute left-3 bottom-3 text-[10px] font-black px-2 py-1 rounded-full bg-white/90 text-red-600">
                  {video.category}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black px-2 py-1 rounded-full bg-gray-500/10 opacity-70">
                  {video.duration}
                </span>
              </div>

              <h3 className="font-black text-lg leading-tight">{video.title}</h3>
              <p className="text-sm opacity-65 mt-2 line-clamp-2">{video.description}</p>

              <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-bold">
                <span className="px-2 py-1 rounded-lg bg-red-500/10 text-red-600">{video.subject}</span>
                <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-600">{video.grade}</span>
                <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {video.level}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {filteredVideos.length === 0 && (
        <div className={`text-center py-16 rounded-2xl border ${panelClass}`}>
          <Youtube className="w-14 h-14 mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-black">No YouTube lessons found</h3>
          <p className="opacity-60 text-sm mt-2">Try another class, category, or search topic.</p>
        </div>
      )}
    </div>
  );
}
