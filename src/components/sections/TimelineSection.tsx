import { useState, useRef, useMemo, useEffect } from 'react';
import { ZoomIn, ZoomOut, Filter, X, Calendar, Palette, Sparkles, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import SealLabel from '@/components/common/SealLabel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { timelineData } from '@/data/timeline';
import type { TimelineDynasty, TypicalArtifact, GlazeFeature, CraftEvolution, DetailData } from '@/types';

type FilterCategory = 'all' | 'artifact' | 'glaze' | 'craft';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

const ERA_RANGES: { key: string; label: string; startId: string; endId: string }[] = [
  { key: 'all', label: '全部时代', startId: 'neolithic', endId: 'modern' },
  { key: 'ancient', label: '远古时期', startId: 'neolithic', endId: 'han' },
  { key: 'medieval', label: '中古盛世', startId: 'sui-tang', endId: 'song' },
  { key: 'late', label: '近古集大成', startId: 'yuan', endId: 'qing' },
  { key: 'modern', label: '近现代', startId: 'modern', endId: 'modern' },
];

export default function TimelineSection({ onOpenDetail }: Props) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);
  const [selectedDynastyId, setSelectedDynastyId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [eraRange, setEraRange] = useState<string>('all');
  const [selectedDynasties, setSelectedDynasties] = useState<Set<string>>(new Set());
  const [showDynastySelector, setShowDynastySelector] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const minZoom = 0.5;
  const maxZoom = 4;

  const handleZoomIn = () => setZoom(z => Math.min(maxZoom, Number((z + 0.2).toFixed(2))));
  const handleZoomOut = () => setZoom(z => Math.max(minZoom, Number((z - 0.2).toFixed(2))));
  const handleZoomReset = () => setZoom(1);

  const handleScrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -600, behavior: 'smooth' });
  };
  const handleScrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 600, behavior: 'smooth' });
  };

  const formatYear = (year: number): string => {
    if (year < 0) {
      return `前${Math.abs(year)}年`;
    }
    if (year === 0) return '公元元年';
    return `${year}年`;
  };

  const formatYearFull = (year: number): string => {
    if (year < 0) {
      return `公元前${Math.abs(year)}年`;
    }
    return `公元${year}年`;
  };

  const filteredTimeline = useMemo(() => {
    let data = timelineData;

    if (eraRange !== 'all') {
      const range = ERA_RANGES.find(r => r.key === eraRange);
      if (range) {
        const startIdx = data.findIndex(d => d.id === range.startId);
        const endIdx = data.findIndex(d => d.id === range.endId);
        if (startIdx !== -1 && endIdx !== -1) {
          data = data.slice(startIdx, endIdx + 1);
        }
      }
    }

    if (selectedDynasties.size > 0) {
      data = data.filter(d => selectedDynasties.has(d.id));
    }

    return data;
  }, [eraRange, selectedDynasties]);

  const viewStartYear = useMemo(() => filteredTimeline[0]?.startYear ?? timelineData[0].startYear, [filteredTimeline]);
  const viewEndYear = useMemo(() => filteredTimeline[filteredTimeline.length - 1]?.endYear ?? timelineData[timelineData.length - 1].endYear, [filteredTimeline]);
  const viewTimeSpan = viewEndYear - viewStartYear;

  const getYearPosition = (year: number): number => {
    if (viewTimeSpan === 0) return 50;
    return ((year - viewStartYear) / viewTimeSpan) * 100;
  };

  const tickYears = useMemo(() => {
    const ticks: number[] = [];
    const span = viewTimeSpan;
    let step = 1000;
    if (span <= 500) step = 100;
    else if (span <= 2000) step = 200;
    else if (span <= 5000) step = 500;
    else if (span <= 10000) step = 1000;
    else step = 2000;

    const start = Math.ceil(viewStartYear / step) * step;
    for (let y = start; y <= viewEndYear; y += step) {
      ticks.push(y);
    }
    return ticks;
  }, [viewStartYear, viewEndYear, viewTimeSpan]);

  const handleEraChange = (key: string) => {
    setEraRange(key);
    setSelectedDynasties(new Set());
  };

  const toggleDynasty = (id: string) => {
    setSelectedDynasties(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearDynastyFilter = () => {
    setSelectedDynasties(new Set());
    setEraRange('all');
  };

  const isDynastyFilterActive = selectedDynasties.size > 0 || eraRange !== 'all';

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

  const selectedDynasty = selectedDynastyId ? timelineData.find(d => d.id === selectedDynastyId) || null : null;

  const timelineBaseWidth = 100;
  const timelineActualWidth = timelineBaseWidth * zoom;

  useEffect(() => {
    if (scrollContainerRef.current && filteredTimeline.length > 0) {
      requestAnimationFrame(() => {
        scrollContainerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
      });
    }
  }, [eraRange, selectedDynasties]);

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
          <div className="space-y-4 mb-6">
            <div className="bg-porcelain-scroll/60 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-porcelain-crackle/40 shadow-porcelain">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-2">
                    <Filter size={15} strokeWidth={2} className="text-porcelain-inkbrown/50" />
                    <span className="text-sm font-medium text-porcelain-inkbrown/70">内容类型：</span>
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
                      {Icon && <Icon size={11} strokeWidth={2} />}
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-porcelain-scroll/60 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-porcelain-crackle/40 shadow-porcelain">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-2">
                    <Calendar size={15} strokeWidth={2} className="text-porcelain-inkbrown/50" />
                    <span className="text-sm font-medium text-porcelain-inkbrown/70">时代范围：</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ERA_RANGES.map(range => (
                      <button
                        key={range.key}
                        onClick={() => handleEraChange(range.key)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                          eraRange === range.key && selectedDynasties.size === 0
                            ? 'bg-porcelain-ji-blue text-white shadow-md'
                            : 'bg-porcelain-paper text-porcelain-inkbrown/70 hover:bg-porcelain-celadon/20 border border-porcelain-crackle/40'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowDynastySelector(s => !s)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                        selectedDynasties.size > 0
                          ? 'bg-porcelain-celadon text-white shadow-md'
                          : 'bg-porcelain-paper text-porcelain-inkbrown/70 hover:bg-porcelain-gold/20 border border-porcelain-crackle/40'
                      }`}
                    >
                      <Filter size={11} strokeWidth={2} />
                      {selectedDynasties.size > 0 ? `已选 ${selectedDynasties.size} 朝` : '按朝代筛选'}
                    </button>

                    {showDynastySelector && (
                      <div className="absolute top-full mt-2 left-0 z-30 bg-porcelain-paper rounded-xl shadow-porcelain-lg border border-porcelain-crackle/50 p-3 w-64 animate-fade-in">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-porcelain-crackle/40">
                          <span className="text-xs font-bold text-porcelain-inkbrown/80">选择朝代</span>
                          <button
                            onClick={() => { clearDynastyFilter(); setShowDynastySelector(false); }}
                            className="text-[10px] text-porcelain-inkbrown/50 hover:text-porcelain-youlihong inline-flex items-center gap-1"
                          >
                            <RotateCcw size={10} />重置
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto">
                          {timelineData.map(d => (
                            <button
                              key={d.id}
                              onClick={() => toggleDynasty(d.id)}
                              className={`text-xs py-2 px-2 rounded-lg font-medium transition-all duration-200 truncate ${
                                selectedDynasties.has(d.id)
                                  ? 'text-white shadow-sm'
                                  : 'bg-porcelain-scroll/60 text-porcelain-inkbrown/60 hover:bg-porcelain-scroll border border-transparent'
                              }`}
                              style={{
                                backgroundColor: selectedDynasties.has(d.id) ? d.color : undefined,
                              }}
                            >
                              {d.dynasty}
                            </button>
                          ))}
                        </div>
                        {isDynastyFilterActive && (
                          <div className="mt-3 pt-3 border-t border-porcelain-crackle/40">
                            <button
                              onClick={() => { setShowDynastySelector(false); }}
                              className="w-full py-1.5 rounded-lg bg-porcelain-youlihong text-white text-xs font-medium hover:opacity-90 transition-opacity"
                            >
                              确认筛选
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {isDynastyFilterActive && (
                    <button
                      onClick={clearDynastyFilter}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] text-porcelain-youlihong/80 bg-porcelain-youlihong/10 hover:bg-porcelain-youlihong/20 transition-colors"
                    >
                      <X size={11} />清除筛选
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 lg:ml-4">
                  <div className="flex items-center gap-0.5 bg-porcelain-paper rounded-full p-1 border border-porcelain-crackle/40">
                    <button
                      onClick={handleZoomOut}
                      disabled={zoom <= minZoom}
                      className="p-1.5 rounded-full hover:bg-porcelain-crackle/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="缩小"
                    >
                      <ZoomOut size={14} strokeWidth={2} className="text-porcelain-inkbrown/70" />
                    </button>
                    <button
                      onClick={handleZoomReset}
                      className="px-2.5 py-1 text-[11px] font-medium text-porcelain-inkbrown/70 hover:text-porcelain-inkbrown transition-colors min-w-[44px]"
                    >
                      {Math.round(zoom * 100)}%
                    </button>
                    <button
                      onClick={handleZoomIn}
                      disabled={zoom >= maxZoom}
                      className="p-1.5 rounded-full hover:bg-porcelain-crackle/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="放大"
                    >
                      <ZoomIn size={14} strokeWidth={2} className="text-porcelain-inkbrown/70" />
                    </button>
                  </div>

                  <div className="hidden md:flex items-center gap-0.5 bg-porcelain-paper rounded-full p-1 border border-porcelain-crackle/40">
                    <button
                      onClick={handleScrollLeft}
                      className="p-1.5 rounded-full hover:bg-porcelain-crackle/30 transition-colors"
                      aria-label="向左滚动"
                    >
                      <ChevronLeft size={14} strokeWidth={2} className="text-porcelain-inkbrown/70" />
                    </button>
                    <button
                      onClick={handleScrollRight}
                      className="p-1.5 rounded-full hover:bg-porcelain-crackle/30 transition-colors"
                      aria-label="向右滚动"
                    >
                      <ChevronRight size={14} strokeWidth={2} className="text-porcelain-inkbrown/70" />
                    </button>
                  </div>
                </div>
              </div>

              {(isDynastyFilterActive) && (
                <div className="mt-3 pt-3 border-t border-porcelain-crackle/30 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-porcelain-inkbrown/50">当前显示范围：</span>
                  <span
                    className="text-[11px] px-2 py-0.5 rounded-full text-white font-medium"
                    style={{ backgroundColor: filteredTimeline[0]?.color }}
                  >
                    {filteredTimeline[0]?.dynasty}
                  </span>
                  {filteredTimeline.length > 1 && (
                    <>
                      <ChevronRight size={12} className="text-porcelain-crackle" />
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full text-white font-medium"
                        style={{ backgroundColor: filteredTimeline[filteredTimeline.length - 1]?.color }}
                      >
                        {filteredTimeline[filteredTimeline.length - 1]?.dynasty}
                      </span>
                    </>
                  )}
                  <span className="text-[11px] text-porcelain-inkbrown/40 ml-2">
                    共 {filteredTimeline.length} 个朝代 · {formatYearFull(viewStartYear)} 至 {formatYearFull(viewEndYear)}
                  </span>
                </div>
              )}
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
                style={{
                  width: `${timelineActualWidth}%`,
                  minWidth: `${filteredTimeline.length * 180}px`,
                  transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div className="absolute top-20 left-4 right-4 h-1.5 bg-gradient-to-r from-porcelain-crackle/60 via-porcelain-gold/70 to-porcelain-crackle/60 rounded-full shadow-inner" />

                <div className="absolute top-0 left-4 right-4 h-16 pointer-events-none">
                  {tickYears.map(year => (
                    <div
                      key={year}
                      className="absolute top-0"
                      style={{ left: `${getYearPosition(year)}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-porcelain-inkbrown/50 font-mono mb-1 whitespace-nowrap">
                          {formatYear(year)}
                        </span>
                        <div className="w-px h-3 bg-porcelain-crackle/60" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute left-4 right-4 h-16 pointer-events-none">
                  {filteredTimeline.map(dynasty => (
                    <div
                      key={`range-${dynasty.id}`}
                      className="absolute top-[26px] h-6 rounded-md opacity-15"
                      style={{
                        left: `${getYearPosition(dynasty.startYear)}%`,
                        width: `${Math.max(getYearPosition(dynasty.endYear) - getYearPosition(dynasty.startYear), 2)}%`,
                        backgroundColor: dynasty.color,
                      }}
                    />
                  ))}
                </div>

                {hoveredYear !== null && (
                  <div
                    className="absolute top-24 z-20 pointer-events-none"
                    style={{ left: `${getYearPosition(hoveredYear)}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="bg-porcelain-inkbrown text-white text-[10px] px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap">
                      {formatYearFull(hoveredYear)}
                    </div>
                  </div>
                )}

                <div className="relative z-10 pt-4">
                  {filteredTimeline.map((dynasty, idx) => {
                    const filteredCount = getFilteredCount(dynasty);
                    const isActive = selectedDynastyId === dynasty.id;
                    const isEmpty = filterCategory !== 'all' && filteredCount === 0;
                    const artifactCount = dynasty.typicalArtifacts.length;
                    const midYear = (dynasty.startYear + dynasty.endYear) / 2;

                    return (
                      <div
                        key={dynasty.id}
                        className="absolute flex flex-col items-center"
                        style={{
                          left: `calc(4% + ${getYearPosition(midYear)}% * 0.92)`,
                          transform: 'translateX(-50%)',
                          animationDelay: `${idx * 0.08}s`,
                          opacity: isEmpty ? 0.35 : 1,
                          transition: 'opacity 0.3s ease, left 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        <button
                          onClick={() => setSelectedDynastyId(isActive ? null : dynasty.id)}
                          onMouseEnter={() => setHoveredYear(midYear)}
                          onMouseLeave={() => setHoveredYear(null)}
                          className={`group relative flex flex-col items-center transition-all duration-300 ${
                            isVisible ? 'animate-fade-in-up' : ''
                          }`}
                        >
                          <div className="flex flex-col items-center mb-1">
                            <div className="flex gap-1 mb-1.5">
                              {dynasty.typicalArtifacts.slice(0, 3).map((art, i) => (
                                <button
                                  key={i}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenArtifact(dynasty, art);
                                  }}
                                  onMouseEnter={(e) => e.stopPropagation()}
                                  onMouseLeave={(e) => e.stopPropagation()}
                                  className={`w-6 h-6 rounded-full shadow-md border-2 border-white transition-all duration-300 hover:scale-125 hover:shadow-lg ${
                                    artifactCount <= 2 ? 'w-7 h-7' : artifactCount === 1 ? 'w-8 h-8' : ''
                                  }`}
                                  style={{
                                    background: `linear-gradient(135deg, ${dynasty.color}dd, ${dynasty.color})`,
                                    zIndex: 10 - i,
                                    transform: `translateX(${(i - (Math.min(3, artifactCount) - 1) / 2) * 4}px)`,
                                  }}
                                  title={art.name}
                                >
                                  <span className="flex items-center justify-center w-full h-full text-white text-[8px] font-bold">
                                    {art.name.charAt(0)}
                                  </span>
                                </button>
                              ))}
                            </div>

                            <div
                              className={`relative w-7 h-7 rounded-full border-[3px] transition-all duration-300 cursor-pointer z-20 group-hover:scale-110 ${
                                isActive ? 'scale-125' : ''
                              }`}
                              style={{
                                backgroundColor: dynasty.color,
                                borderColor: '#FAF7F0',
                                boxShadow: isActive
                                  ? `0 0 0 5px ${dynasty.color}30, 0 0 28px ${dynasty.color}90, 0 0 48px ${dynasty.color}40`
                                  : `0 0 0 2px ${dynasty.color}40, 0 2px 8px rgba(0,0,0,0.15)`,
                              }}
                            >
                              {isActive && (
                                <div className="absolute inset-0 rounded-full animate-ping opacity-60"
                                  style={{ backgroundColor: dynasty.color }}
                                />
                              )}
                            </div>
                          </div>

                          <div
                            className={`mt-3 px-2.5 py-1 rounded-full text-white text-[11px] font-bold shadow-md transition-all duration-300 whitespace-nowrap ${
                              isActive ? 'scale-105 shadow-lg' : 'group-hover:scale-105'
                            }`}
                            style={{ backgroundColor: dynasty.color }}
                          >
                            {dynasty.dynasty}
                          </div>
                          <div className="text-[9px] text-porcelain-inkbrown/50 mt-0.5 whitespace-nowrap font-mono">
                            {artifactCount}件 · {dynasty.year.split('—')[0].trim()}
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
              <div className="mt-4 flex items-center justify-center gap-4 flex-wrap max-w-xl mx-auto">
                <div className="flex items-center gap-2 text-xs text-porcelain-inkbrown/40">
                  <Sparkles size={12} />
                  <span>彩色小圆点代表该朝代的典型瓷器，点击可直接查看</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
