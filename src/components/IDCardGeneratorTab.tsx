import React, { useState, useEffect, useCallback } from 'react';
import {
  BadgeCheck, Printer, FileDown, Search, ArrowRight, UserCircle,
  Settings, BarChart3, Upload, Copy, Trash2, Edit2, Eye, EyeOff,
  Download, Plus, Filter, RefreshCw, CheckCircle, AlertCircle,
  Save, X, Image as ImageIcon, Palette
} from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';
import { ScholarProfile } from '../types';

// ============ TYPE DEFINITIONS ============
interface CardTemplate {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  schoolName: string;
  schoolSubtitle: string;
  schoolAddress: string;
  showBloodGroup: boolean;
  showDOB: boolean;
  showPhoto: boolean;
  cardWidth: number;
  cardHeight: number;
}

interface IDCardGeneratorState {
  scholarsList: ScholarProfile[];
  activeId: string;
  searchTerm: string;
  selectedStudents: string[];
  currentTemplate: CardTemplate;
  templates: CardTemplate[];
  showTemplateEditor: boolean;
  showBatchPanel: boolean;
  showAnalytics: boolean;
  showSettings: boolean;
  filterClass?: string;
  sortBy: 'name' | 'id' | 'class';
}

interface AnalyticsData {
  totalStudents: number;
  cardsGenerated: number;
  templatesCreated: number;
  generatedToday: number;
  classDistribution: Record<string, number>;
}

// ============ DEFAULT TEMPLATE ============
const DEFAULT_TEMPLATE: CardTemplate = {
  id: 'default-1',
  name: 'Classic Blue',
  primaryColor: '#431407',
  secondaryColor: '#FFF7ED',
  accentColor: '#F97316',
  schoolName: 'Saint Xavier',
  schoolSubtitle: 'Convent School',
  schoolAddress: '45 Avenue West, M.P. 452010',
  showBloodGroup: true,
  showDOB: true,
  showPhoto: true,
  cardWidth: 54,
  cardHeight: 86,
};

// ============ MAIN COMPONENT ============
export default function IDCardGeneratorEnhanced({ theme = 'glassNavy' }: { theme?: 'original' | 'glassNavy' | 'sunriseOrange' }) {
  const isGlass = theme === 'glassNavy';

  // State Management
  const [state, setState] = useState<IDCardGeneratorState>({
    scholarsList: [],
    activeId: '',
    searchTerm: '',
    selectedStudents: [],
    currentTemplate: DEFAULT_TEMPLATE,
    templates: [DEFAULT_TEMPLATE],
    showTemplateEditor: false,
    showBatchPanel: false,
    showAnalytics: false,
    showSettings: false,
    sortBy: 'name',
  });

  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalStudents: 0,
    cardsGenerated: 0,
    templatesCreated: 1,
    generatedToday: 0,
    classDistribution: {},
  });

  // Load initial data
  useEffect(() => {
    const saved = localStorage.getItem('sxc_all_scholars');
    const savedTemplates = localStorage.getItem('sxc_templates');
    const savedAnalytics = localStorage.getItem('sxc_analytics');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setState(prev => ({
            ...prev,
            scholarsList: parsed,
            activeId: parsed[0].id,
          }));
          updateAnalytics(parsed);
        }
      } catch (e) {
        console.error('Failed to load scholars:', e);
      }
    } else {
      const defaults = generateDefaultScholars();
      setState(prev => ({
        ...prev,
        scholarsList: defaults,
        activeId: defaults[0].id,
      }));
      localStorage.setItem('sxc_all_scholars', JSON.stringify(defaults));
    }

    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates);
        setState(prev => ({
          ...prev,
          templates: parsed,
          currentTemplate: parsed[0],
        }));
      } catch (e) {
        console.error('Failed to load templates:', e);
      }
    }

    if (savedAnalytics) {
      try {
        const parsed = JSON.parse(savedAnalytics);
        setAnalytics(parsed);
      } catch (e) {
        console.error('Failed to load analytics:', e);
      }
    }
  }, []);

  // ============ HELPER FUNCTIONS ============
  const generateDefaultScholars = (): ScholarProfile[] => [
    {
      id: 'sc-1',
      scholarNo: '5281',
      studentName: 'PRIYA PATEL',
      currentClass: 'CLASS VII-A',
      annualFee: 42000,
      transactions: [],
    },
    {
      id: 'sc-2',
      scholarNo: '4928',
      studentName: 'RAHUL SHARMA',
      currentClass: 'CLASS VI-B',
      annualFee: 38000,
      transactions: [],
    },
    {
      id: 'sc-3',
      scholarNo: '5156',
      studentName: 'ANJALI GUPTA',
      currentClass: 'CLASS VIII-A',
      annualFee: 45000,
      transactions: [],
    },
  ];

  const updateAnalytics = (scholars: ScholarProfile[]) => {
    const classDistribution: Record<string, number> = {};
    scholars.forEach(s => {
      const cls = s.currentClass || 'Unknown';
      classDistribution[cls] = (classDistribution[cls] || 0) + 1;
    });

    setAnalytics(prev => ({
      ...prev,
      totalStudents: scholars.length,
      classDistribution,
    }));
  };

  const getFilteredScholars = useCallback(() => {
    let filtered = state.scholarsList.filter(s =>
      s.studentName.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      s.scholarNo.includes(state.searchTerm) ||
      (s.currentClass ?? '').toLowerCase().includes(state.searchTerm.toLowerCase())
    );

    if (state.filterClass) {
      filtered = filtered.filter(s => s.currentClass === state.filterClass);
    }

    return filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'id':
          return a.scholarNo.localeCompare(b.scholarNo);
        case 'class':
          return (a.currentClass || '').localeCompare(b.currentClass || '');
        default:
          return a.studentName.localeCompare(b.studentName);
      }
    });
  }, [state.scholarsList, state.searchTerm, state.filterClass, state.sortBy]);

  const activeProfile = state.scholarsList.find(s => s.id === state.activeId) || state.scholarsList[0];
  const filteredScholars = getFilteredScholars();
  const uniqueClasses = [...new Set(state.scholarsList.map(s => s.currentClass))].filter(Boolean);

  // ============ EVENT HANDLERS ============
  const handleSelectStudent = (id: string) => {
    setState(prev => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(id)
        ? prev.selectedStudents.filter(sid => sid !== id)
        : [...prev.selectedStudents, id],
    }));
  };

  const handleSelectAll = () => {
    setState(prev => ({
      ...prev,
      selectedStudents: prev.selectedStudents.length === filteredScholars.length
        ? []
        : filteredScholars.map(s => s.id),
    }));
  };

  const handleSaveTemplate = (newTemplate: CardTemplate) => {
    setState(prev => ({
      ...prev,
      templates: prev.templates.map(t => t.id === newTemplate.id ? newTemplate : t),
      currentTemplate: newTemplate,
    }));
    localStorage.setItem('sxc_templates', JSON.stringify(state.templates));
  };

  const handleCreateTemplate = (newTemplate: CardTemplate) => {
    const template = { ...newTemplate, id: `template-${Date.now()}` };
    setState(prev => ({
      ...prev,
      templates: [...prev.templates, template],
      currentTemplate: template,
    }));
    localStorage.setItem('sxc_templates', JSON.stringify([...state.templates, template]));
  };

  const handleBatchPrint = () => {
    const selectedIds = state.selectedStudents.length > 0 ? state.selectedStudents : [state.activeId];
    window.print();
  };

  const handleExportPDF = async () => {
    // This would integrate with a PDF library like jsPDF
    alert('PDF export coming soon - integrate with jsPDF library');
  };

  const handleDeleteStudent = (id: string) => {
    const updated = state.scholarsList.filter(s => s.id !== id);
    setState(prev => ({
      ...prev,
      scholarsList: updated,
      activeId: updated.length > 0 ? updated[0].id : '',
      selectedStudents: prev.selectedStudents.filter(sid => sid !== id),
    }));
    localStorage.setItem('sxc_all_scholars', JSON.stringify(updated));
    updateAnalytics(updated);
  };

  // ============ STYLE HELPERS ============
  const bgClass = isGlass ? 'bg-white/70 backdrop-blur-xl' : 'bg-gradient-to-br from-[#0F0F12] to-[#1A1A1F]';
  const borderClass = isGlass ? 'border-white/50' : 'border-[#242427]';
  const textClass = isGlass ? 'text-[#431407]' : 'text-white';
  const cardBgClass = isGlass ? 'bg-white/50' : 'bg-[#1C1C1F]/80';
  const hoverClass = isGlass
    ? 'hover:bg-blue-50 hover:border-blue-200'
    : 'hover:bg-blue-500/10 hover:border-blue-500/30';

  // ============ RENDER ============
  return (
    <div className={`min-h-screen ${bgClass} rounded-3xl p-6 ${borderClass} border`}>
      {/* Header with Tabs */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-black ${textClass}`}>ID Card Management</h1>
            <p className="text-sm text-gray-500 mt-1">Professional identity card generation & administration</p>
          </div>

          {/* Top Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setState(prev => ({ ...prev, showAnalytics: !prev.showAnalytics }))}
              className={`p-2.5 rounded-xl border transition ${cardBgClass} ${borderClass} ${textClass}`}
              title="Analytics"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setState(prev => ({ ...prev, showTemplateEditor: !prev.showTemplateEditor }))}
              className={`p-2.5 rounded-xl border transition ${cardBgClass} ${borderClass} ${textClass}`}
              title="Templates"
            >
              <Palette className="w-5 h-5" />
            </button>
            <button
              onClick={() => setState(prev => ({ ...prev, showSettings: !prev.showSettings }))}
              className={`p-2.5 rounded-xl border transition ${cardBgClass} ${borderClass} ${textClass}`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-6 border-b border-white/10 pb-4">
          <button
            onClick={() => setState(prev => ({ ...prev, showBatchPanel: false, showTemplateEditor: false, showAnalytics: false, showSettings: false }))}
            className={`px-4 py-2 font-bold rounded-t-xl transition ${!state.showBatchPanel && !state.showTemplateEditor && !state.showAnalytics && !state.showSettings ? 'bg-blue-600 text-white' : `${textClass} opacity-60 hover:opacity-100`}`}
          >
            Generate Cards
          </button>
          <button
            onClick={() => setState(prev => ({ ...prev, showBatchPanel: !prev.showBatchPanel }))}
            className={`px-4 py-2 font-bold rounded-t-xl transition ${state.showBatchPanel ? 'bg-blue-600 text-white' : `${textClass} opacity-60 hover:opacity-100`}`}
          >
            Batch Operations
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className={`lg:col-span-1 space-y-4 p-4 rounded-2xl ${cardBgClass} ${borderClass} border`}>
          {/* Search */}
          <div>
            <label className="text-xs font-black uppercase opacity-60 mb-2 block">Search Students</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
              <input
                type="text"
                placeholder="Name, ID, or class..."
                value={state.searchTerm}
                onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border outline-none text-sm font-medium transition ${isGlass ? 'bg-white border-gray-200 text-gray-900 focus:border-blue-500' : 'bg-[#242427] border-[#3C3C41] text-white focus:border-blue-500'}`}
              />
            </div>
          </div>

          {/* Filters */}
          <div>
            <label className="text-xs font-black uppercase opacity-60 mb-2 block">Filter by Class</label>
            <select
              value={state.filterClass || ''}
              onChange={(e) => setState(prev => ({ ...prev, filterClass: e.target.value || undefined }))}
              className={`w-full px-3 py-2.5 rounded-xl border outline-none text-sm font-medium transition ${isGlass ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#242427] border-[#3C3C41] text-white'}`}
            >
              <option value="">All Classes</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="text-xs font-black uppercase opacity-60 mb-2 block">Sort By</label>
            <select
              value={state.sortBy}
              onChange={(e) => setState(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className={`w-full px-3 py-2.5 rounded-xl border outline-none text-sm font-medium transition ${isGlass ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#242427] border-[#3C3C41] text-white'}`}
            >
              <option value="name">Name</option>
              <option value="id">Scholar ID</option>
              <option value="class">Class</option>
            </select>
          </div>

          {/* Student List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase opacity-60">Students ({filteredScholars.length})</label>
              {state.showBatchPanel && (
                <button
                  onClick={handleSelectAll}
                  className="text-xs font-bold text-blue-500 hover:text-blue-600"
                >
                  {state.selectedStudents.length === filteredScholars.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            <div className={`space-y-2 max-h-[500px] overflow-y-auto pr-2`}>
              {filteredScholars.map(scholar => (
                <button
                  key={scholar.id}
                  onClick={() => {
                    if (state.showBatchPanel && event?.ctrlKey) {
                      handleSelectStudent(scholar.id);
                    } else {
                      setState(prev => ({ ...prev, activeId: scholar.id }));
                    }
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-3 ${activeProfile?.id === scholar.id ? 'bg-blue-600 border-blue-600 text-white' : `${cardBgClass} ${borderClass} border ${hoverClass}`}`}
                >
                  {state.showBatchPanel && (
                    <input
                      type="checkbox"
                      checked={state.selectedStudents.includes(scholar.id)}
                      onChange={() => handleSelectStudent(scholar.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 cursor-pointer"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{scholar.studentName}</h4>
                    <p className="text-xs opacity-70 truncate">ID: {scholar.scholarNo} • {scholar.currentClass || 'N/A'}</p>
                  </div>
                  <ArrowRight className={`w-4 h-4 flex-shrink-0 ${activeProfile?.id === scholar.id ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Analytics Panel */}
          {state.showAnalytics && (
            <AnalyticsPanel analytics={analytics} isGlass={isGlass} />
          )}

          {/* Template Editor Panel */}
          {state.showTemplateEditor && (
            <TemplateEditorPanel
              templates={state.templates}
              currentTemplate={state.currentTemplate}
              onSave={handleSaveTemplate}
              onCreate={handleCreateTemplate}
              isGlass={isGlass}
            />
          )}

          {/* Batch Operations Panel */}
          {state.showBatchPanel && (
            <BatchOperationsPanel
              selectedCount={state.selectedStudents.length}
              totalCount={filteredScholars.length}
              onBatchPrint={handleBatchPrint}
              onExportPDF={handleExportPDF}
              isGlass={isGlass}
            />
          )}

          {/* ID Card Preview */}
          {activeProfile && !state.showBatchPanel && !state.showTemplateEditor && !state.showAnalytics && (
            <IDCardPreview
              profile={activeProfile}
              template={state.currentTemplate}
              isGlass={isGlass}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============ SUB-COMPONENTS ============

// Analytics Panel Component
function AnalyticsPanel({ analytics, isGlass }: { analytics: AnalyticsData; isGlass: boolean }) {
  const bgClass = isGlass ? 'bg-white/50' : 'bg-[#1C1C1F]/80';
  const borderClass = isGlass ? 'border-white/50' : 'border-[#242427]';

  return (
    <div className={`p-6 rounded-2xl ${bgClass} ${borderClass} border space-y-6`}>
      <h2 className={`text-xl font-black ${isGlass ? 'text-[#431407]' : 'text-white'}`}>Analytics Dashboard</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={analytics.totalStudents} isGlass={isGlass} />
        <StatCard label="Cards Generated" value={analytics.cardsGenerated} isGlass={isGlass} />
        <StatCard label="Templates" value={analytics.templatesCreated} isGlass={isGlass} />
        <StatCard label="Generated Today" value={analytics.generatedToday} isGlass={isGlass} />
      </div>

      {Object.keys(analytics.classDistribution).length > 0 && (
        <div>
          <h3 className={`text-sm font-bold mb-3 ${isGlass ? 'text-[#431407]' : 'text-white'}`}>Class Distribution</h3>
          <div className="space-y-2">
            {Object.entries(analytics.classDistribution).map(([cls, count]) => (
              <div key={cls} className="flex items-center gap-2">
                <span className="text-xs font-medium min-w-[100px]">{cls}</span>
                <div className="flex-1 h-2 bg-blue-500/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(count / analytics.totalStudents) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, isGlass }: { label: string; value: number; isGlass: boolean }) {
  return (
    <div className={`p-4 rounded-xl ${isGlass ? 'bg-blue-50 border border-blue-200' : 'bg-blue-500/10 border border-blue-500/30'} text-center`}>
      <p className={`text-xs uppercase font-bold opacity-60 mb-1`}>{label}</p>
      <p className={`text-2xl font-black ${isGlass ? 'text-[#431407]' : 'text-blue-400'}`}>{value}</p>
    </div>
  );
}

// Template Editor Component
function TemplateEditorPanel({
  templates,
  currentTemplate,
  onSave,
  onCreate,
  isGlass,
}: {
  templates: CardTemplate[];
  currentTemplate: CardTemplate;
  onSave: (template: CardTemplate) => void;
  onCreate: (template: CardTemplate) => void;
  isGlass: boolean;
}) {
  const [editingTemplate, setEditingTemplate] = useState(currentTemplate);

  const bgClass = isGlass ? 'bg-white/50' : 'bg-[#1C1C1F]/80';
  const borderClass = isGlass ? 'border-white/50' : 'border-[#242427]';
  const inputClass = isGlass ? 'bg-white border-gray-200' : 'bg-[#242427] border-[#3C3C41] text-white';

  return (
    <div className={`p-6 rounded-2xl ${bgClass} ${borderClass} border space-y-6`}>
      <h2 className={`text-xl font-black ${isGlass ? 'text-[#431407]' : 'text-white'}`}>Template Editor</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Template Selection */}
        <div>
          <label className="text-xs font-bold uppercase mb-2 block opacity-60">Select Template</label>
          <div className="space-y-2">
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => setEditingTemplate(template)}
                className={`w-full p-3 rounded-xl border text-left transition ${editingTemplate.id === template.id ? 'bg-blue-600 text-white border-blue-600' : `${inputClass} border`}`}
              >
                <p className="font-bold text-sm">{template.name}</p>
                <div className="flex gap-2 mt-1">
                  <div className="w-4 h-4 rounded border" style={{ backgroundColor: template.primaryColor }} />
                  <div className="w-4 h-4 rounded border" style={{ backgroundColor: template.secondaryColor }} />
                  <div className="w-4 h-4 rounded border" style={{ backgroundColor: template.accentColor }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Template Settings */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase mb-2 block opacity-60">Template Name</label>
            <input
              type="text"
              value={editingTemplate.name}
              onChange={(e) => setEditingTemplate(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 rounded-xl border outline-none text-sm ${inputClass}`}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase mb-2 block opacity-60">School Name</label>
            <input
              type="text"
              value={editingTemplate.schoolName}
              onChange={(e) => setEditingTemplate(prev => ({ ...prev, schoolName: e.target.value }))}
              className={`w-full px-3 py-2 rounded-xl border outline-none text-sm ${inputClass}`}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <ColorInput
              label="Primary"
              value={editingTemplate.primaryColor}
              onChange={(color) => setEditingTemplate(prev => ({ ...prev, primaryColor: color }))}
              isGlass={isGlass}
            />
            <ColorInput
              label="Secondary"
              value={editingTemplate.secondaryColor}
              onChange={(color) => setEditingTemplate(prev => ({ ...prev, secondaryColor: color }))}
              isGlass={isGlass}
            />
            <ColorInput
              label="Accent"
              value={editingTemplate.accentColor}
              onChange={(color) => setEditingTemplate(prev => ({ ...prev, accentColor: color }))}
              isGlass={isGlass}
            />
          </div>

          <div className="space-y-2 pt-4 border-t border-white/10">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingTemplate.showPhoto}
                onChange={(e) => setEditingTemplate(prev => ({ ...prev, showPhoto: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="text-sm font-bold">Show Photo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingTemplate.showDOB}
                onChange={(e) => setEditingTemplate(prev => ({ ...prev, showDOB: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="text-sm font-bold">Show Date of Birth</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingTemplate.showBloodGroup}
                onChange={(e) => setEditingTemplate(prev => ({ ...prev, showBloodGroup: e.target.checked }))}
                className="w-4 h-4"
              />
              <span className="text-sm font-bold">Show Blood Group</span>
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => onSave(editingTemplate)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
            <button
              onClick={() => onCreate(editingTemplate)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl transition"
            >
              <Plus className="w-4 h-4" /> New Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorInput({ label, value, onChange, isGlass }: { label: string; value: string; onChange: (color: string) => void; isGlass: boolean }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase mb-1 block opacity-60">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 px-2 py-2 rounded-lg border outline-none text-xs font-mono ${isGlass ? 'bg-white border-gray-200' : 'bg-[#242427] border-[#3C3C41] text-white'}`}
        />
      </div>
    </div>
  );
}

// Batch Operations Component
function BatchOperationsPanel({
  selectedCount,
  totalCount,
  onBatchPrint,
  onExportPDF,
  isGlass,
}: {
  selectedCount: number;
  totalCount: number;
  onBatchPrint: () => void;
  onExportPDF: () => void;
  isGlass: boolean;
}) {
  const bgClass = isGlass ? 'bg-white/50' : 'bg-[#1C1C1F]/80';
  const borderClass = isGlass ? 'border-white/50' : 'border-[#242427]';

  return (
    <div className={`p-6 rounded-2xl ${bgClass} ${borderClass} border`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-black ${isGlass ? 'text-[#431407]' : 'text-white'}`}>Batch Operations</h2>
          <p className="text-sm opacity-60 mt-1">
            {selectedCount > 0 ? `${selectedCount} student${selectedCount !== 1 ? 's' : ''} selected` : 'Select students using Ctrl+Click'}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg ${isGlass ? 'bg-blue-100' : 'bg-blue-500/20'} font-bold`}>
          {selectedCount}/{totalCount}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <button
          onClick={onBatchPrint}
          disabled={selectedCount === 0}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-3 rounded-xl transition"
        >
          <Printer className="w-5 h-5" /> Batch Print
        </button>
        <button
          onClick={onExportPDF}
          disabled={selectedCount === 0}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white font-bold py-3 rounded-xl transition"
        >
          <FileDown className="w-5 h-5" /> Export PDF
        </button>
        <button
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition"
        >
          <Copy className="w-5 h-5" /> Duplicate
        </button>
        <button
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition"
        >
          <Trash2 className="w-5 h-5" /> Delete Selected
        </button>
      </div>

      <div className={`mt-6 p-4 rounded-xl ${isGlass ? 'bg-blue-50 border border-blue-200' : 'bg-blue-500/10 border border-blue-500/30'}`}>
        <p className="text-sm font-bold">💡 Pro Tip: Use Ctrl+Click on student names to select multiple records for bulk operations.</p>
      </div>
    </div>
  );
}

// ID Card Preview Component
function IDCardPreview({
  profile,
  template,
  isGlass,
}: {
  profile: ScholarProfile;
  template: CardTemplate;
  isGlass: boolean;
}) {
  const bgClass = isGlass ? 'bg-white/50' : 'bg-[#1C1C1F]/80';
  const borderClass = isGlass ? 'border-white/50' : 'border-[#242427]';

  const cardWidth = `${template.cardWidth}mm`;
  const cardHeight = `${template.cardHeight}mm`;

  return (
    <div className={`p-6 rounded-2xl ${bgClass} ${borderClass} border space-y-6`}>
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-black ${isGlass ? 'text-[#431407]' : 'text-white'}`}>ID Card Preview</h2>
        <div className="text-xs opacity-60 font-bold">
          {cardWidth} × {cardHeight}
        </div>
      </div>

      {/* Card Preview */}
      <div className="flex justify-center overflow-x-auto pb-4">
        <div
          className="print-page flex-shrink-0 bg-white text-gray-900 shadow-2xl relative select-none flex flex-col justify-between border-2 overflow-hidden"
          style={{
            width: cardWidth,
            height: cardHeight,
            borderColor: template.primaryColor,
            boxSizing: 'border-box',
          }}
        >
          {/* Header */}
          <div
            className="text-center pt-3 pb-2 px-2 shrink-0"
            style={{ backgroundColor: template.primaryColor, color: template.secondaryColor }}
          >
            <h1 className="text-[11px] font-black tracking-widest uppercase leading-tight">{template.schoolName}</h1>
            <h2 className="text-[7px] font-medium tracking-widest uppercase opacity-90 leading-tight">{template.schoolSubtitle}</h2>
            <div className="text-[5px] mt-1 opacity-75 leading-tight">{template.schoolAddress}</div>
          </div>

          {/* Photo Area */}
          {template.showPhoto && (
            <div className="flex flex-col items-center mt-2">
              <div className="w-[20mm] h-[25mm] border-2 bg-gray-100 flex items-center justify-center rounded-sm shadow-sm overflow-hidden" style={{ borderColor: template.primaryColor }}>
                <UserCircle className="w-[14mm] h-[14mm]" style={{ color: template.primaryColor + '33' }} />
              </div>
              <div className="mt-2 text-center w-full px-2">
                <h2 className="text-[11px] font-black leading-tight truncate" style={{ color: template.primaryColor }}>
                  {profile.studentName}
                </h2>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="px-3 pt-1 flex-1 flex flex-col justify-center">
            <div className="space-y-1 text-[8px]">
              <div className="grid grid-cols-[16mm_1fr] border-b pb-0.5" style={{ borderColor: template.primaryColor + '20' }}>
                <span className="font-bold uppercase text-[6px] tracking-wider opacity-70">Scholar ID:</span>
                <span className="font-extrabold font-mono" style={{ color: template.primaryColor }}>
                  {profile.scholarNo}
                </span>
              </div>
              <div className="grid grid-cols-[16mm_1fr] border-b pb-0.5" style={{ borderColor: template.primaryColor + '20' }}>
                <span className="font-bold uppercase text-[6px] tracking-wider opacity-70">Class & Sec:</span>
                <span className="font-bold" style={{ color: template.primaryColor }}>
                  {profile.currentClass ?? 'CLASS N/A'}
                </span>
              </div>
              {template.showDOB && (
                <div className="grid grid-cols-[16mm_1fr] border-b pb-0.5" style={{ borderColor: template.primaryColor + '20' }}>
                  <span className="font-bold uppercase text-[6px] tracking-wider opacity-70">Date of Birth:</span>
                  <span className="font-bold" style={{ color: template.primaryColor }}>
                    14-Aug-2015
                  </span>
                </div>
              )}
              {template.showBloodGroup && (
                <div className="grid grid-cols-[16mm_1fr] pb-0.5">
                  <span className="font-bold uppercase text-[6px] tracking-wider opacity-70">Blood Group:</span>
                  <span className="font-bold text-red-600">O+</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-3 pb-3 pt-1 flex items-end justify-between border-t-2 bg-gray-50/50" style={{ borderColor: template.accentColor + '33' }}>
            <div className="p-0.5 bg-white border shadow-sm rounded-sm" style={{ borderColor: template.primaryColor + '33' }}>
              <QRCodeGenerator
                value={`SXC-ID: ${profile.scholarNo} | Name: ${profile.studentName}`}
                size={28}
                studentId={profile.scholarNo}
                label=""
              />
            </div>
            <div className="text-center w-[16mm]">
              <div className="h-[4mm]">
                <svg viewBox="0 0 100 30" className="w-full h-full opacity-60">
                  <path d="M10,15 Q30,5 50,20 T90,10" fill="none" stroke={template.primaryColor} strokeWidth="2" />
                </svg>
              </div>
              <div className="border-t mt-1" style={{ borderColor: template.primaryColor + '66' }}></div>
              <div className="text-[5px] font-black uppercase tracking-widest mt-0.5 scale-90" style={{ color: template.primaryColor }}>
                Principal
              </div>
            </div>
          </div>

          {/* Colored Strip */}
          <div className="h-[3mm] shrink-0" style={{ backgroundColor: template.accentColor }}></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition">
          <Printer className="w-5 h-5" /> Print
        </button>
        <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition">
          <FileDown className="w-5 h-5" /> Export
        </button>
      </div>
    </div>
  );
}
