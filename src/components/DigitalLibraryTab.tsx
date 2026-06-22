import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Download, Search, Filter, Star, Users, Calendar, Zap } from 'lucide-react';

interface DigitalLibraryTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange';
}

const mockLibraryResources = [
  // NURSERY & KINDERGARTEN
  { id: 'b1', title: 'ABC Learning Colors & Shapes', subject: 'English', grade: 'Nursery', stream: 'General', type: 'Picture Book', category: 'School', cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2345, rating: 4.9 },
  { id: 'b2', title: 'Number Fun 1-10', subject: 'Mathematics', grade: 'Nursery', stream: 'General', type: 'Activity Book', category: 'School', cover: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2156, rating: 4.9 },
  { id: 'b3', title: 'Hindi Varnmala', subject: 'Hindi', grade: 'Nursery', stream: 'General', type: 'Picture Book', category: 'School', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1834, rating: 4.8 },
  { id: 'b4', title: 'Kindergarten Rhymes & Stories', subject: 'English', grade: 'KG', stream: 'General', type: 'Story Book', category: 'School', cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2567, rating: 4.9 },
  { id: 'b5', title: 'Counting & Shapes KG', subject: 'Mathematics', grade: 'KG', stream: 'General', type: 'Workbook', category: 'School', cover: 'https://images.unsplash.com/photo-1515194967-3a1fb3b2fdf7?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2234, rating: 4.8 },

  // CLASS I-III
  { id: 'b6', title: 'English Reading Comprehension I', subject: 'English', grade: 'I', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1876, rating: 4.7 },
  { id: 'b7', title: 'Mathematics Fundamentals I', subject: 'Mathematics', grade: 'I', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2043, rating: 4.8 },
  { id: 'b8', title: 'Hindi Primer Class I', subject: 'Hindi', grade: 'I', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1645, rating: 4.7 },
  { id: 'b9', title: 'Science Around Us II', subject: 'Science', grade: 'II', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1923, rating: 4.8 },
  { id: 'b10', title: 'Environmental Studies III', subject: 'Social Studies', grade: 'III', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1447069387366-2a34706322b7?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1567, rating: 4.6 },

  // CLASS IV-V
  { id: 'b11', title: 'English Grammar & Writing IV', subject: 'English', grade: 'IV', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1734, rating: 4.7 },
  { id: 'b12', title: 'Mathematics Problem Solving IV', subject: 'Mathematics', grade: 'IV', stream: 'General', type: 'Workbook', category: 'School', cover: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1892, rating: 4.8 },
  { id: 'b13', title: 'Science & Nature V', subject: 'Science', grade: 'V', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2156, rating: 4.8 },
  { id: 'b14', title: 'Social Studies Explore & Learn V', subject: 'Social Studies', grade: 'V', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1447069387366-2a34706322b7?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1823, rating: 4.7 },

  // CLASS VI-VIII (Pre-Secondary)
  { id: 'b15', title: 'English Grammar Mastery VI', subject: 'English', grade: 'VI', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1945, rating: 4.8 },
  { id: 'b16', title: 'Mathematics Textbook VI', subject: 'Mathematics', grade: 'VI', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2234, rating: 4.9 },
  { id: 'b17', title: 'Science & Technology VI', subject: 'Science', grade: 'VI', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2012, rating: 4.8 },
  { id: 'b18', title: 'Social Studies VI', subject: 'Social Studies', grade: 'VI', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1447069387366-2a34706322b7?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1678, rating: 4.7 },
  { id: 'b19', title: 'Hindi Vyakaran VI', subject: 'Hindi', grade: 'VI', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1456, rating: 4.7 },
  { id: 'b20', title: 'Sanskrit Basics VI', subject: 'Sanskrit', grade: 'VI', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1234, rating: 4.6 },

  { id: 'b21', title: 'English VII Textbook', subject: 'English', grade: 'VII', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2067, rating: 4.8 },
  { id: 'b22', title: 'Mathematics Concepts VII', subject: 'Mathematics', grade: 'VII', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2145, rating: 4.9 },
  { id: 'b23', title: 'Science Experiments VII', subject: 'Science', grade: 'VII', stream: 'General', type: 'Lab Manual', category: 'School', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1834, rating: 4.8 },
  { id: 'b24', title: 'History & Geography VII', subject: 'Social Studies', grade: 'VII', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1447069387366-2a34706322b7?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1567, rating: 4.7 },

  { id: 'b25', title: 'English Literature VIII', subject: 'English', grade: 'VIII', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1923, rating: 4.8 },
  { id: 'b26', title: 'Algebra & Geometry VIII', subject: 'Mathematics', grade: 'VIII', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2234, rating: 4.9 },
  { id: 'b27', title: 'Physics & Chemistry VIII', subject: 'Science', grade: 'VIII', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2012, rating: 4.8 },
  { id: 'b28', title: 'Civics VIII', subject: 'Social Studies', grade: 'VIII', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1447069387366-2a34706322b7?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1678, rating: 4.7 },

  // CLASS IX-X (Secondary - All Streams)
  { id: 'b29', title: 'English IX (CBSE)', subject: 'English', grade: 'IX', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2345, rating: 4.9 },
  { id: 'b30', title: 'Mathematics IX', subject: 'Mathematics', grade: 'IX', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2567, rating: 4.9 },
  { id: 'b31', title: 'Science IX (Physics, Chemistry, Biology)', subject: 'Science', grade: 'IX', stream: 'Science', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2456, rating: 4.9 },
  { id: 'b32', title: 'Social Studies IX', subject: 'Social Studies', grade: 'IX', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1447069387366-2a34706322b7?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1834, rating: 4.8 },
  { id: 'b33', title: 'Hindi IX', subject: 'Hindi', grade: 'IX', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1567, rating: 4.7 },
  { id: 'b34', title: 'Sanskrit IX', subject: 'Sanskrit', grade: 'IX', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1245, rating: 4.6 },

  { id: 'b35', title: 'English X (Board Exam)', subject: 'English', grade: 'X', stream: 'General', type: 'Study Guide', category: 'School', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200&h=300', downloads: 3456, rating: 4.9 },
  { id: 'b36', title: 'Mathematics X (Board)', subject: 'Mathematics', grade: 'X', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&q=80&w=200&h=300', downloads: 3678, rating: 4.9 },
  { id: 'b37', title: 'Science X (Physics, Chemistry, Biology)', subject: 'Science', grade: 'X', stream: 'Science', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200&h=300', downloads: 3234, rating: 4.9 },
  { id: 'b38', title: 'Social Science X (SST)', subject: 'Social Studies', grade: 'X', stream: 'General', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1447069387366-2a34706322b7?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2567, rating: 4.8 },

  // CLASS XI-XII (Senior Secondary - Science Stream)
  { id: 'b39', title: 'Physics XI (NCERT)', subject: 'Physics', grade: 'XI', stream: 'Science', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2834, rating: 4.9 },
  { id: 'b40', title: 'Chemistry XI (NCERT)', subject: 'Chemistry', grade: 'XI', stream: 'Science', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2567, rating: 4.9 },
  { id: 'b41', title: 'Biology XI (Botany & Zoology)', subject: 'Biology', grade: 'XI', stream: 'Science', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2345, rating: 4.8 },
  { id: 'b42', title: 'Mathematics XI (Science)', subject: 'Mathematics', grade: 'XI', stream: 'Science', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2456, rating: 4.9 },
  { id: 'b43', title: 'English XI', subject: 'English', grade: 'XI', stream: 'Science', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1834, rating: 4.8 },

  { id: 'b44', title: 'Physics XII (CBSE Board)', subject: 'Physics', grade: 'XII', stream: 'Science', type: 'Study Guide', category: 'School', cover: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=200&h=300', downloads: 3123, rating: 4.9 },
  { id: 'b45', title: 'Chemistry XII (CBSE Board)', subject: 'Chemistry', grade: 'XII', stream: 'Science', type: 'Study Guide', category: 'School', cover: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2945, rating: 4.9 },
  { id: 'b46', title: 'Biology XII (CBSE Board)', subject: 'Biology', grade: 'XII', stream: 'Science', type: 'Study Guide', category: 'School', cover: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2834, rating: 4.9 },
  { id: 'b47', title: 'Mathematics XII (Science)', subject: 'Mathematics', grade: 'XII', stream: 'Science', type: 'Problem Set', category: 'School', cover: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&q=80&w=200&h=300', downloads: 3234, rating: 4.9 },
  { id: 'b48', title: 'English XII', subject: 'English', grade: 'XII', stream: 'Science', type: 'Study Guide', category: 'School', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2012, rating: 4.8 },

  // CLASS XI-XII (Commerce Stream)
  { id: 'b49', title: 'Accountancy XI (Commerce)', subject: 'Accountancy', grade: 'XI', stream: 'Commerce', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1945, rating: 4.8 },
  { id: 'b50', title: 'Economics XI (Commerce)', subject: 'Economics', grade: 'XI', stream: 'Commerce', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1611432579699-484f7990f308?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1678, rating: 4.7 },
  { id: 'b51', title: 'Business Studies XI', subject: 'Business Studies', grade: 'XI', stream: 'Commerce', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1567, rating: 4.7 },
  { id: 'b52', title: 'Mathematics XI (Commerce)', subject: 'Mathematics', grade: 'XI', stream: 'Commerce', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1834, rating: 4.8 },

  { id: 'b53', title: 'Accountancy XII (Board)', subject: 'Accountancy', grade: 'XII', stream: 'Commerce', type: 'Study Guide', category: 'School', cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2234, rating: 4.9 },
  { id: 'b54', title: 'Economics XII (Board)', subject: 'Economics', grade: 'XII', stream: 'Commerce', type: 'Study Guide', category: 'School', cover: 'https://images.unsplash.com/photo-1611432579699-484f7990f308?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2012, rating: 4.8 },
  { id: 'b55', title: 'Business Studies XII', subject: 'Business Studies', grade: 'XII', stream: 'Commerce', type: 'Study Guide', category: 'School', cover: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1923, rating: 4.8 },

  // CLASS XI-XII (Arts Stream)
  { id: 'b56', title: 'History XI (CBSE)', subject: 'History', grade: 'XI', stream: 'Arts', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1447069387366-2a34706322b7?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1678, rating: 4.7 },
  { id: 'b57', title: 'Geography XI (Arts)', subject: 'Geography', grade: 'XI', stream: 'Arts', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1456, rating: 4.6 },
  { id: 'b58', title: 'Political Science XI', subject: 'Political Science', grade: 'XI', stream: 'Arts', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1234, rating: 4.6 },
  { id: 'b59', title: 'Sociology XI (Arts)', subject: 'Sociology', grade: 'XI', stream: 'Arts', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1045, rating: 4.5 },

  { id: 'b60', title: 'History XII (Board)', subject: 'History', grade: 'XII', stream: 'Arts', type: 'Study Guide', category: 'School', cover: 'https://images.unsplash.com/photo-1447069387366-2a34706322b7?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2345, rating: 4.9 },
  { id: 'b61', title: 'Geography XII (Board)', subject: 'Geography', grade: 'XII', stream: 'Arts', type: 'Study Guide', category: 'School', cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2012, rating: 4.8 },
  { id: 'b62', title: 'Political Science XII', subject: 'Political Science', grade: 'XII', stream: 'Arts', type: 'Study Guide', category: 'School', cover: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1834, rating: 4.8 },

  // Vocational Courses (Class IX-XII)
  { id: 'b63', title: 'IT Basics & Coding', subject: 'IT/Vocational', grade: 'IX', stream: 'Vocational', type: 'Study Guide', category: 'School', cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1734, rating: 4.8 },
  { id: 'b64', title: 'Hospitality Management', subject: 'Hospitality', grade: 'X', stream: 'Vocational', type: 'Study Guide', category: 'School', cover: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1245, rating: 4.6 },
  { id: 'b65', title: 'Healthcare Fundamentals', subject: 'Healthcare', grade: 'XI', stream: 'Vocational', type: 'Textbook', category: 'School', cover: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1567, rating: 4.7 },
  { id: 'b66', title: 'Automotive Technology XII', subject: 'Automotive', grade: 'XII', stream: 'Vocational', type: 'Study Guide', category: 'School', cover: 'https://images.unsplash.com/photo-1495877892519-b21e455b59d1?auto=format&fit=crop&q=80&w=200&h=300', downloads: 1045, rating: 4.5 },

  // Competitive Exams
  { id: 'b67', title: 'NEET Complete Study Material', subject: 'Science', grade: 'XII', stream: 'Science', type: 'Exam Guide', category: 'Competitive', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200&h=300', downloads: 4567, rating: 4.9 },
  { id: 'b68', title: 'JEE Mains & Advanced', subject: 'Mathematics', grade: 'XII', stream: 'Science', type: 'Exam Guide', category: 'Competitive', cover: 'https://images.unsplash.com/photo-1615014606552-829dce6deba8?auto=format&fit=crop&q=80&w=200&h=300', downloads: 4234, rating: 4.9 },
  { id: 'b69', title: 'UPSC & State PSC Notes', subject: 'Social Studies', grade: 'XII', stream: 'Arts', type: 'Study Guide', category: 'Competitive', cover: 'https://images.unsplash.com/photo-1447069387366-2a34706322b7?auto=format&fit=crop&q=80&w=200&h=300', downloads: 3456, rating: 4.9 },
  { id: 'b70', title: 'CAT & Management Exams', subject: 'Quantitative', grade: 'XII', stream: 'Commerce', type: 'Exam Guide', category: 'Competitive', cover: 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?auto=format&fit=crop&q=80&w=200&h=300', downloads: 2834, rating: 4.8 },
  { id: 'b71', title: 'SSC & Banking Exams', subject: 'General', grade: 'XII', stream: 'General', type: 'Exam Guide', category: 'Competitive', cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&q=80&w=200&h=300', downloads: 3123, rating: 4.8 },

  // Free Online Resources & Reference
  { id: 'b72', title: 'Khan Academy - All Subjects', subject: 'Multiple', grade: 'I', stream: 'General', type: 'Online Platform', category: 'Free Online', cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&q=80&w=200&h=300', downloads: 6234, rating: 4.9 },
  { id: 'b73', title: 'OpenStax Free Textbooks', subject: 'Science', grade: 'X', stream: 'General', type: 'Open Source', category: 'Free Online', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200&h=300', downloads: 5456, rating: 4.9 },
  { id: 'b74', title: 'NCERT Complete Collection', subject: 'Multiple', grade: 'I', stream: 'General', type: 'Official', category: 'Free Online', cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200&h=300', downloads: 7123, rating: 4.9 },
  { id: 'b75', title: 'Dictionary & Reference', subject: 'English', grade: 'VI', stream: 'General', type: 'Reference', category: 'Reference', cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&q=80&w=200&h=300', downloads: 3456, rating: 4.9 },
];

const GRADES = ['Nursery', 'KG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const STREAMS = ['General', 'Science', 'Commerce', 'Arts', 'Vocational'];

export default function DigitalLibraryTab({ theme = 'glassNavy' }: DigitalLibraryTabProps) {
  const isGlass = theme === 'glassNavy';
  const isSunrise = theme === 'sunriseOrange';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('IX');
  const [selectedStream, setSelectedStream] = useState('General');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('downloads');

  const categories = ['All', 'School', 'Competitive', 'Reference', 'Free Online'];

  const filteredResources = mockLibraryResources
    .filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = selectedGrade === 'All' || resource.grade === selectedGrade;
      const matchesStream = resource.stream === 'General' || resource.stream === selectedStream || selectedStream === 'General';
      const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
      return matchesSearch && matchesGrade && matchesStream && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });

  const bgClass = isGlass 
    ? 'bg-white/80 backdrop-blur-xl border-white/40 text-[#431407]'
    : isSunrise
    ? 'bg-gradient-to-br from-orange-50/90 to-amber-50/90 text-gray-900 border-orange-200/50'
    : 'bg-[#1C1C1F] border-[#2C2C2E] text-white';

  const inputClass = isGlass
    ? 'bg-white border-gray-200 focus:border-blue-500 text-gray-900'
    : isSunrise
    ? 'bg-white/70 border-orange-200 focus:border-orange-500 text-gray-900'
    : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-blue-500 text-white';

  const cardClass = isGlass
    ? 'bg-white border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-md'
    : isSunrise
    ? 'bg-white/60 border-orange-100/50 hover:border-orange-300 hover:shadow-sm'
    : 'bg-[#0F0F12] border-[#2C2C2E] hover:border-blue-500/50 hover:shadow-lg';

  return (
    <div className={`p-6 sm:p-8 rounded-3xl min-h-screen border ${bgClass}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-gray-500/10 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black flex items-center gap-3">
            <BookOpen className="text-blue-500 w-8 h-8" /> Digital Library
          </h2>
          <p className="opacity-60 text-sm mt-2 font-medium">
            Access 75+ free textbooks & resources for Nursery to 12th across all streams
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="space-y-4 mb-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search books, subjects, topics..."
            className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none font-medium transition ${inputClass}`}
          />
        </div>

        {/* Filter Controls - Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Grade Filter */}
          <div className="relative">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className={`appearance-none w-full pl-4 pr-10 py-3 rounded-xl border outline-none font-medium transition cursor-pointer ${inputClass}`}
            >
              {GRADES.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
            <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
          </div>

          {/* Stream Filter */}
          <div className="relative">
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className={`appearance-none w-full pl-4 pr-10 py-3 rounded-xl border outline-none font-medium transition cursor-pointer ${inputClass}`}
            >
              {STREAMS.map(stream => (
                <option key={stream} value={stream}>{stream}</option>
              ))}
            </select>
            <Zap className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`appearance-none w-full pl-4 pr-10 py-3 rounded-xl border outline-none font-medium transition cursor-pointer ${inputClass}`}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
            <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
          </div>
        </div>

        {/* Filter Controls - Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`appearance-none w-full pl-4 pr-10 py-3 rounded-xl border outline-none font-medium transition cursor-pointer ${inputClass}`}
            >
              <option value="downloads">Most Downloaded</option>
              <option value="rating">Highest Rated</option>
              <option value="name">A-Z</option>
            </select>
            <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
          </div>

          {/* Results Count */}
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${inputClass}`}>
            <span className="font-semibold">Results: <span className="text-blue-600 font-bold text-lg">{filteredResources.length}</span></span>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map(resource => (
            <div 
              key={resource.id} 
              className={`group rounded-2xl border transition-all hover:-translate-y-2 hover:shadow-xl overflow-hidden flex flex-col cursor-pointer ${cardClass}`}
            >
              {/* Book Cover */}
              <div className="h-48 w-full relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img 
                  src={resource.cover} 
                  alt={resource.title} 
                  className="w-full h-full object-cover object-center opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-300" 
                />
                {/* Type Badge */}
                <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded backdrop-blur-md">
                  {resource.type}
                </div>
                {/* Grade Badge */}
                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded">
                  {resource.grade}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                {/* Subject & Stream */}
                <div className="mb-2 flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm ${
                    isGlass ? 'bg-blue-50 text-blue-600' : isSunrise ? 'bg-orange-100 text-orange-700' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {resource.subject}
                  </span>
                  {resource.stream !== 'General' && (
                    <span className="text-xs opacity-70 font-bold px-2 py-1 rounded-sm bg-gray-400/20">
                      {resource.stream}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-bold text-sm leading-snug group-hover:text-blue-600 transition-colors mb-3">
                  {resource.title}
                </h4>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs opacity-70 mb-4">
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {resource.downloads}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {resource.rating}
                  </div>
                </div>

                {/* Download Button */}
                <button className={`mt-auto w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isGlass 
                    ? 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 hover:border-blue-300'
                    : isSunrise
                    ? 'bg-orange-100/50 text-orange-700 hover:bg-orange-200 border border-orange-200 hover:border-orange-400'
                    : 'bg-[#1C1C1F] text-gray-300 hover:text-white hover:bg-blue-500/20 border border-[#2C2C2E] hover:border-blue-500/50'
                }`}>
                  <Download className="w-4 h-4" /> View/Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`py-20 text-center rounded-2xl border-2 border-dashed ${
          isGlass 
            ? 'bg-gray-50/50 border-gray-200' 
            : isSunrise
            ? 'bg-orange-50/30 border-orange-200'
            : 'bg-[#0F0F12]/50 border-[#2C2C2E]'
        }`}>
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <h4 className="font-bold mb-2 text-lg">No resources found</h4>
          <p className="text-sm opacity-60 max-w-sm mx-auto">
            Try adjusting your filters or select a different grade/stream to find what you're looking for.
          </p>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-12 pt-8 border-t border-gray-500/10">
        <p className="text-xs opacity-60 text-center font-medium">
          📚 75+ School Books | 🎓 Science, Commerce & Arts Streams | 📖 Nursery to 12th Grade | ⭐ Exam Guides & References | Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
