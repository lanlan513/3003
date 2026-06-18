import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Filter, X, Calendar, Palette, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import SealLabel from '@/components/common/SealLabel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { timelineData } from '@/data/timeline';
import type { TimelineDynasty, TypicalArtifact, GlazeFeature, CraftEvolution, DetailData } from '@/types';

type FilterCategory = 'all' | 'artifact' | 'glaze' | 'craft';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

export default function TimelineSection({ onOpenDetail }: Props) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);
  const [selectedDynastyId, setSelectedDynastyId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedDynasty = timelineData.find(d => d.id === selectedDynastyId) || null;

  const minZoom = 0.6;
  const maxZoom = 3;
  const baseCardWidth = 200;

  const handleZoomIn = () => setZoom(z => Math.min(maxZoom, z + 0.2));
  const handleZoomOut = () => setZoom(z => Math.max(minZoom, z - 0.2));
  const handleZoomReset = () => setZoom(1);

  const handleScrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -400, behavior: 'smooth' });
  };
  const handleScrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 400, behavior: 'smooth' });
  };

  const formatYear = (year: number): string => {
    if (year < 0) {
      return `公元前${Math.abs(year)}年`;
    }
    return `公元${year}年`;
  };

  const totalTimeSpan = Math.abs(timelineData[timelineData.length - 1].endYear - timelineData[0].startYear);
  const earliestYear = timelineData[0].startYear;

  const getYearPosition = (year: number): number => {
    return ((year - earliestYear) / totalTimeSpan) * 100;
  };

  const handleOpenArtifact = (dynasty: TimelineDynasty, artifact: TypicalArtifact) => {
    onOpenDetail({
      type: 'artifact',
      id: `${dynasty.id}-${artifact.name}`,
      title: artifact.name,
      subtitle: `${dynasty.dynasty} · 典型器物`,
      description: artifact.desc,
      sections: [
        { title: '所属朝代', content: [`${dynasty.dynasty}（${dynasty.year}）`] },
        { title: '器物简介', content: [artifact.desc] },
        { title: '时代背景', content: [dynasty.summary] },
      ],
      color: dynasty.color,
      bgColor: `${dynasty.color}15`,
      imagePrompt: artifact.imagePrompt,
    });
  };

  const handleOpenGlaze = (dynasty: TimelineDynasty, glaze: GlazeFeature) => {
    onOpenDetail({
      type: 'glaze',
      id: `${dynasty.id}-${glaze.name}`,
      title: glaze.name,
      subtitle: `${dynasty.dynasty} · 釉色特点`,
      description: glaze.description,
      sections: [
        { title: '釉色特点', content: [glaze.description] },
        ...(glaze.formula ? [{ title: '釉料配方', content: [glaze.formula] }] : []),
        { title: '时代背景', content: [`${dynasty.dynasty}：${dynasty.summary}`] },
      ],
      color: glaze.color,
      bgColor: `${glaze.color}15`,
      imagePrompt: `Ceramic glaze sample of ${glaze.name}, ${glaze.color} color, porcelain surface with glossy texture, museum quality, close-up photography`,
    });
  };

  const handleOpenCraft = (dynasty: TimelineDynasty, craft: CraftEvolution) => {
    onOpenDetail({
      type: 'craft-evolution',
      id: `${dynasty.id}-${craft.title}`,
      title: craft.title,
      subtitle: `${dynasty.dynasty} · 工艺变化`,
      description: craft.description + '\n\n' + craft.impact,
      sections: [
        { title: '工艺描述', content: [craft.description] },
        { title: '历史影响', content: [craft.impact] },
      ],
      color: dynasty.color,
      bgColor: `${dynasty.color}15`,
      imagePrompt: `Traditional Chinese porcelain making process, showing ${craft.title}, craftsman hands working, ancient workshop atmosphere, warm lighting, historical illustration style`,
    });
  };

  const handleOpenDynastyDetail = (dynasty: TimelineDynasty) => {
    onOpenDetail({
      type: 'timeline',
      id: dynasty.id,
      title: `${dynasty.dynasty} · ${dynasty.period}`,
      subtitle: dynasty.year,
      description: dynasty.description,
      sections: [
        { title: '重要成就', content: dynasty.achievements },
        { title: '典型器物', content: dynasty.typicalArtifacts.map(a => `${a.name}：${a.desc.slice(0, 60)}...`) },
        { title: '代表釉色', content: dynasty.glazeFeatures.map(g => `${g.name}：${g.description.slice(0, 50)}...`) },
        { title: '工艺进步', content: dynasty.craftEvolutions.map(c => `${c.title}：${c.impact.slice(0, 60)}...`) },
      ],
      color: dynasty.color,
      bgColor: `${dynasty.color}15`,
      imagePrompt: dynasty.imagePrompt,
    });
  };

  const getFilteredCount = (dynasty: TimelineDynasty) => {
    switch (filterCategory) {
      case 'artifact': return dynasty.typicalArtifacts.length;
      case 'glaze': return dynasty.glazeFeatures.length;
      case 'craft': return dynasty.craftEvolutions.length;
      default: return dynasty.typicalArtifacts.length + dynasty.glazeFeatures.length + dynasty.craftEvolutions.length;
    }
  };

  return (
    <section id="timeline" className="section-padding bg-gradient-porcelain crackle-bg relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <pattern id="gridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#D4C8A8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <SectionTitle
          tag="TIMELINE · 陶瓷长廊"
          title="陶瓷时间长廊"
          subtitle="穿越五千年时光长河，一览中华陶瓷文明的辉煌历程。点击朝代节点，探索典型器物、釉色之美与工艺演变"
        />

        <div
          ref={ref}
          className={`reveal ${isVisible ? 'is-visible' : ''} relative`}
        >
          <div className="bg-porcelain-scroll/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 mb-6 border border-porcelain-crackle/40 shadow-porcelain">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <Filter size={16} strokeWidth={2} className="text-porcelain-inkbrown/50" />
                  <span className="text-sm font-medium text-porcelain-inkbrown/70">筛选：</span>
                </div>
                {[
                  { key: 'all', label: '全部', icon: null },
                  { key: 'artifact', label: '典型器物', icon: Sparkles },
                  { key: 'glaze', label: '釉色特点', icon: Palette },
                  { key: 'craft', label: '工艺变化', icon: Calendar },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setFilterCategory(key as FilterCategory)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                      filterCategory === key
                        ? 'bg-porcelain-youlihong text-white shadow-md'
                        : 'bg-porcelain-paper text-porcelain-inkbrown/70 hover:bg-porcelain-gold/20 border border-porcelain-crackle/40'
                    }`}
                  >
                    {Icon && <Icon size={12} strokeWidth={2} />}
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-porcelain-paper rounded-full p-1 border border-porcelain-crackle/40">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= minZoom}
                    className="p-2 rounded-full hover:bg-porcelain-crackle/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="缩小"
                  >
                    <ZoomOut size={16} strokeWidth={2} className="text-porcelain-inkbrown/70" />
                  </button>
                  <button
                    onClick={handleZoomReset}
                    className="px-3 py-1 text-xs font-medium text-porcelain-inkbrown/70 hover:text-porcelain-inkbrown transition-colors min-w-[48px]"
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= maxZoom}
                    className="p-2 rounded-full hover:bg-porcelain-crackle/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="放大"
                  >
                    <ZoomIn size={16} strokeWidth={2} className="text-porcelain-inkbrown/70" />
                  </button>
                </div>

                <div className="hidden md:flex items-center gap-1 bg-porcelain-paper rounded-full p-1 border border-porcelain-crackle/40">
                  <button
                    onClick={handleScrollLeft}
                    className="p-2 rounded-full hover:bg-porcelain-crackle/30 transition-colors"
                    aria-label="向左滚动"
                  >
                    <ChevronLeft size={16} strokeWidth={2} className="text-porcelain-inkbrown/70" />
                  </button>
                  <button
                    onClick={handleScrollRight}
                    className="p-2 rounded-full hover:bg-porcelain-crackle/30 transition-colors"
                    aria-label="向右滚动"
                  >
                    <ChevronRight size={16} strokeWidth={2} className="text-porcelain-inkbrown/70" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mb-6">
            <div
              ref={scrollContainerRef}
              className="relative overflow-x-auto pb-8 -mx-4 px-4 md:-mx-8 md:px-8 scrollbar-thin"
              style={{ scrollbarWidth: 'thin' }}
            >
              <div
                className="relative pt-16 pb-4"
                style={{ width: `${100 * zoom}%`, minWidth: '100%', transition: 'width 0.3s ease' }}
              >
                <div className="absolute top-20 left-0 right-0 h-2 bg-gradient-to-r from-porcelain-crackle/60 via-porcelain-gold/60 to-porcelain-crackle/60 rounded-full shadow-inner" />

                <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none">
                  {[-8000, -6000, -4000, -2000, 0, 500, 1000, 1500, 2000].map(year => (
                    year >= earliestYear && year <= timelineData[timelineData.length - 1].endYear && (
                      <div
                        key={year}
                        className="absolute top-0"
                        style={{ left: `${getYearPosition(year)}%`, transform: 'translateX(-50%)' }}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-porcelain-inkbrown/50 font-mono mb-1">
                            {formatYear(year)}
                          </span>
                          <div className="w-px h-3 bg-porcelain-crackle/60" />
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {hoveredYear !== null && (
                  <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-porcelain-inkbrown text-white text-xs px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                      {formatYear(hoveredYear)}
                    </div>
                  </div>
                )}

                <div className="relative z-10 flex items-start justify-between pt-4 min-w-max" style={{ width: '100%' }}>
                  {timelineData.map((dynasty, idx) => {
                    const filteredCount = getFilteredCount(dynasty);
                    const isActive = selectedDynastyId === dynasty.id;
                    const isEmpty = filterCategory !== 'all' && filteredCount === 0;

                    return (
                      <div
                        key={dynasty.id}
                        className="flex flex-col items-center relative"
                        style={{
                          animationDelay: `${idx * 0.08}s`,
                          opacity: isEmpty ? 0.35 : 1,
                          transition: 'opacity 0.3s ease',
                        }}
                      >
                        <button
                          onClick={() => setSelectedDynastyId(isActive ? null : dynasty.id)}
                          onMouseEnter={() => setHoveredYear(dynasty.startYear)}
                          onMouseLeave={() => setHoveredYear(null)}
                          className={`group relative flex flex-col items-center transition-all duration-300 ${
                            isVisible ? 'animate-fade-in-up' : ''
                          }`}
                        >
                          <div
                            className={`absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 transition-all duration-300 cursor-pointer z-20 ${
                              isActive
                                ? 'scale-125 shadow-xl'
                                : 'hover:scale-110 group-hover:scale-110'
                            }`}
                            style={{
                              top: '6px',
                              backgroundColor: dynasty.color,
                              borderColor: '#FAF7F0',
                              boxShadow: isActive
                                ? `0 0 0 4px ${dynasty.color}40, 0 0 24px ${dynasty.color}80`
                                : `0 0 0 2px ${dynasty.color}40`,
                            }}
                          />

                          <div
                            className={`mt-14 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-md transition-all duration-300 whitespace-nowrap ${
                              isActive ? 'scale-105 shadow-lg' : 'group-hover:scale-105'
                            }`}
                            style={{ backgroundColor: dynasty.color }}
                          >
                            {dynasty.dynasty}
                          </div>
                          <div className="text-[10px] text-porcelain-inkbrown/50 mt-1 whitespace-nowrap font-mono">
                            {dynasty.year.split('—')[0].trim()}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {selectedDynasty && (
            <div
              key={selectedDynasty.id}
              className="bg-porcelain-scroll/70 backdrop-blur-sm rounded-2xl p-5 md:p-8 border border-porcelain-crackle/50 shadow-porcelain-lg animate-fade-in"
              style={{
                borderColor: `${selectedDynasty.color}50`,
                boxShadow: `0 16px 48px ${selectedDynasty.color}18, 0 4px 16px rgba(44, 62, 80, 0.12)`,
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                    style={{ backgroundColor: selectedDynasty.color }}
                  >
                    <SealLabel text={selectedDynasty.dynasty.charAt(0)} size="md" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3
                        className="font-serif text-2xl md:text-3xl font-bold text-porcelain-inkbrown"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        {selectedDynasty.dynasty}
                      </h3>
                      <span
                        className="text-xs px-3 py-1 rounded-full text-white font-medium"
                        style={{ backgroundColor: selectedDynasty.color }}
                      >
                        {selectedDynasty.year}
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-porcelain-inkbrown/70 font-serif" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      {selectedDynasty.period}
                    </p>
                    <p className="text-sm text-porcelain-inkbrown/60 mt-1 leading-relaxed max-w-2xl">
                      {selectedDynasty.summary}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDynastyId(null)}
                  className="p-2 rounded-full hover:bg-porcelain-crackle/40 text-porcelain-inkbrown/50 hover:text-porcelain-inkbrown transition-colors"
                  aria-label="关闭"
                >
                  <X size={20} strokeWidth={1.8} />
                </button>
              </div>

              <button
                onClick={() => handleOpenDynastyDetail(selectedDynasty)}
                className="text-sm inline-flex items-center gap-1.5 mb-6 px-4 py-2 rounded-lg transition-all hover:shadow-md"
                style={{
                  backgroundColor: `${selectedDynasty.color}15`,
                  color: selectedDynasty.color,
                }}
              >
                <Calendar size={14} strokeWidth={2} />
                <span className="font-medium">查看朝代完整历史</span>
              </button>

              <div className="space-y-8">
                {(filterCategory === 'all' || filterCategory === 'artifact') && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="w-1.5 h-6 rounded-full"
                        style={{ backgroundColor: selectedDynasty.color }}
                      />
                      <h4
                        className="font-serif text-lg font-semibold text-porcelain-inkbrown flex items-center gap-2"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        <Sparkles size={18} strokeWidth={2} style={{ color: selectedDynasty.color }} />
                        典型器物
                      </h4>
                      <span className="text-xs text-porcelain-inkbrown/50 bg-porcelain-paper px-2 py-0.5 rounded-full">
                        {selectedDynasty.typicalArtifacts.length}件
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {selectedDynasty.typicalArtifacts.map((artifact, i) => (
                        <button
                          key={artifact.name}
                          onClick={() => handleOpenArtifact(selectedDynasty, artifact)}
                          className={`group text-left bg-porcelain-paper rounded-xl overflow-hidden border border-porcelain-crackle/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                            isVisible ? 'animate-fade-in-up' : ''
                          }`}
                          style={{ animationDelay: `${i * 0.05}s` }}
                        >
                          <div
                            className="w-full h-36 flex items-center justify-center overflow-hidden relative"
                            style={{ backgroundColor: `${selectedDynasty.color}15` }}
                          >
                            <div
                              className="w-20 h-20 rounded-full shadow-lg transition-transform duration-500 group-hover:scale-110"
                              style={{
                                background: `radial-gradient(circle at 30% 30%, ${selectedDynasty.color}30, ${selectedDynasty.color}60)`,
                                boxShadow: `0 8px 24px ${selectedDynasty.color}40`,
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-porcelain-paper/80 to-transparent pointer-events-none" />
                          </div>
                          <div className="p-4">
                            <h5
                              className="font-serif text-base font-bold text-porcelain-inkbrown mb-1.5 group-hover:text-porcelain-youlihong transition-colors"
                              style={{ fontFamily: '"Noto Serif SC", serif' }}
                            >
                              {artifact.name}
                            </h5>
                            <p className="text-xs text-porcelain-inkbrown/60 leading-relaxed line-clamp-2">
                              {artifact.desc}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(filterCategory === 'all' || filterCategory === 'glaze') && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="w-1.5 h-6 rounded-full"
                        style={{ backgroundColor: selectedDynasty.color }}
                      />
                      <h4
                        className="font-serif text-lg font-semibold text-porcelain-inkbrown flex items-center gap-2"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        <Palette size={18} strokeWidth={2} style={{ color: selectedDynasty.color }} />
                        釉色特点
                      </h4>
                      <span className="text-xs text-porcelain-inkbrown/50 bg-porcelain-paper px-2 py-0.5 rounded-full">
                        {selectedDynasty.glazeFeatures.length}种
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {selectedDynasty.glazeFeatures.map((glaze, i) => (
                        <button
                          key={glaze.name}
                          onClick={() => handleOpenGlaze(selectedDynasty, glaze)}
                          className={`group text-left bg-porcelain-paper rounded-xl p-4 border border-porcelain-crackle/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                            isVisible ? 'animate-fade-in-up' : ''
                          }`}
                          style={{ animationDelay: `${i * 0.05}s` }}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className="w-12 h-12 rounded-xl shadow-inner transition-transform duration-500 group-hover:scale-110"
                              style={{
                                background: `linear-gradient(135deg, ${glaze.color}cc, ${glaze.color})`,
                                boxShadow: `inset 0 2px 6px rgba(255,255,255,0.3), inset 0 -2px 6px rgba(0,0,0,0.15), 0 4px 12px ${glaze.color}40`,
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h5
                                className="font-serif text-sm font-bold truncate group-hover:text-porcelain-youlihong transition-colors"
                                style={{ fontFamily: '"Noto Serif SC", serif', color: glaze.color }}
                              >
                                {glaze.name}
                              </h5>
                              {glaze.formula && (
                                <p className="text-[10px] text-porcelain-inkbrown/40 truncate mt-0.5">
                                  {glaze.formula.split('，')[0]}
                                </p>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-porcelain-inkbrown/60 leading-relaxed line-clamp-2">
                            {glaze.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(filterCategory === 'all' || filterCategory === 'craft') && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="w-1.5 h-6 rounded-full"
                        style={{ backgroundColor: selectedDynasty.color }}
                      />
                      <h4
                        className="font-serif text-lg font-semibold text-porcelain-inkbrown flex items-center gap-2"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        <Calendar size={18} strokeWidth={2} style={{ color: selectedDynasty.color }} />
                        工艺变化
                      </h4>
                      <span className="text-xs text-porcelain-inkbrown/50 bg-porcelain-paper px-2 py-0.5 rounded-full">
                        {selectedDynasty.craftEvolutions.length}项
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {selectedDynasty.craftEvolutions.map((craft, i) => (
                        <button
                          key={craft.title}
                          onClick={() => handleOpenCraft(selectedDynasty, craft)}
                          className={`group text-left bg-porcelain-paper rounded-xl p-5 border border-porcelain-crackle/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${
                            isVisible ? 'animate-fade-in-up' : ''
                          }`}
                          style={{ animationDelay: `${i * 0.05}s` }}
                        >
                          <div
                            className="absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-2"
                            style={{ backgroundColor: selectedDynasty.color }}
                          />
                          <div className="pl-3">
                            <div className="flex items-center gap-2 mb-3">
                              <span
                                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                                style={{ backgroundColor: selectedDynasty.color }}
                              >
                                {i + 1}
                              </span>
                              <h5
                                className="font-serif text-base font-bold text-porcelain-inkbrown group-hover:text-porcelain-youlihong transition-colors"
                                style={{ fontFamily: '"Noto Serif SC", serif' }}
                              >
                                {craft.title}
                              </h5>
                            </div>
                            <p className="text-xs text-porcelain-inkbrown/65 leading-relaxed mb-3 line-clamp-3">
                              {craft.description}
                            </p>
                            <div className="pt-3 border-t border-porcelain-crackle/30">
                              <p className="text-[11px] leading-relaxed" style={{ color: selectedDynasty.color }}>
                                <span className="font-bold">历史影响：</span>
                                {craft.impact}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!selectedDynasty && (
            <div className="text-center py-12 bg-porcelain-scroll/40 rounded-2xl border border-dashed border-porcelain-crackle/50">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-porcelain-gold/20 flex items-center justify-center">
                <Calendar size={28} strokeWidth={1.8} className="text-porcelain-gold" />
              </div>
              <p className="text-porcelain-inkbrown/60 font-serif text-base" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                点击上方时间轴上的朝代节点
              </p>
              <p className="text-porcelain-inkbrown/40 text-sm mt-1">
                探索该时期的典型器物、釉色特点与工艺变化
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
