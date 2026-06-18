import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Globe,
  Ship,
  MapPin,
  BookOpen,
  Palette,
  Sparkles,
  ChevronRight,
  Play,
  Pause,
  Info,
  Users,
  Compass,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import SealLabel from '@/components/common/SealLabel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { tradeData } from '@/data/trade';
import type {
  TradeRoute,
  TradeEvent,
  CulturalInfluence,
  ExportedArtifact,
  DetailData,
} from '@/types';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

type TabType = 'routes' | 'events' | 'influence' | 'artifacts';

const eventTypeIcons: Record<string, JSX.Element> = {
  voyage: <Ship size={14} strokeWidth={2} />,
  treaty: <BookOpen size={14} strokeWidth={2} />,
  discovery: <Compass size={14} strokeWidth={2} />,
  diplomacy: <Users size={14} strokeWidth={2} />,
  innovation: <Sparkles size={14} strokeWidth={2} />,
  commerce: <TrendingUp size={14} strokeWidth={2} />,
};

const eventTypeLabels: Record<string, string> = {
  voyage: '航海',
  treaty: '条约',
  discovery: '发现',
  diplomacy: '外交',
  innovation: '技术',
  commerce: '贸易',
};

const influenceTypeLabels: Record<string, string> = {
  technology: '技术传播',
  aesthetic: '审美影响',
  social: '社会文化',
  economic: '经济影响',
};

export default function TradeSection({ onOpenDetail }: Props) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);
  const [activeTab, setActiveTab] = useState<TabType>('routes');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>('land-silk-road');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isAnimating) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }
    let startTime: number | null = null;
    const duration = 4000;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min((elapsed % duration) / duration, 1);
      setAnimationProgress(progress);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAnimating, selectedRouteId]);

  const selectedRoute = useMemo(
    () => tradeData.routes.find((r) => r.id === selectedRouteId) || null,
    [selectedRouteId],
  );

  const selectedEvent = useMemo(
    () => tradeData.events.find((e) => e.id === selectedEventId) || null,
    [selectedEventId],
  );

  const sortedEvents = useMemo(
    () => [...tradeData.events].sort((a, b) => a.year - b.year),
    [],
  );

  const lngToX = (lng: number) => ((lng + 180) / 360) * 100;
  const latToY = (lat: number) => ((90 - lat) / 180) * 100;

  const handleOpenRouteDetail = (route: TradeRoute) => {
    onOpenDetail({
      type: 'trade-route',
      id: route.id,
      title: route.name,
      subtitle: `${route.type === 'maritime' ? '海上' : '陆上'}通道 · ${route.era}`,
      description: route.description + '\n\n' + route.history,
      sections: [
        { title: '主要货物', content: route.keyGoods },
        { title: '途经地点', content: route.keyLocations.map(locId => {
          const loc = tradeData.locations.find(l => l.id === locId);
          return loc ? `${loc.name}（${loc.region}）：${loc.description}` : locId;
        }) },
        { title: '文化影响', content: route.culturalImpact },
        {
          title: '行程分段',
          content: route.segments.map(
            (s) => {
              const from = tradeData.locations.find(l => l.id === s.from);
              const to = tradeData.locations.find(l => l.id === s.to);
              return `${from?.name || s.from} → ${to?.name || s.to}：约${s.distance}公里，耗时${s.duration}。风险：${s.hazards.join('、')}`;
            },
          ),
        },
      ],
      color: route.color,
      bgColor: `${route.color}15`,
      imagePrompt: route.imagePrompt,
    });
  };

  const handleOpenEventDetail = (event: TradeEvent) => {
    const loc = tradeData.locations.find(l => l.id === event.location);
    onOpenDetail({
      type: 'trade-event',
      id: event.id,
      title: event.title,
      subtitle: `${event.yearDisplay} · ${loc?.name || event.location}`,
      description: event.description + '\n\n' + event.impact,
      sections: [
        { title: '参与方', content: event.participants },
        { title: '历史影响', content: [event.impact] },
        event.relatedRoutes.length > 0
          ? {
              title: '相关贸易路线',
              content: event.relatedRoutes.map((rid) => {
                const r = tradeData.routes.find((x) => x.id === rid);
                return r ? r.name : rid;
              }),
            }
          : null,
      ].filter(Boolean) as { title: string; content: string[] }[],
      color: event.color,
      bgColor: `${event.color}15`,
      imagePrompt: event.imagePrompt,
    });
  };

  const handleOpenInfluenceDetail = (inf: CulturalInfluence) => {
    onOpenDetail({
      type: 'cultural-influence',
      id: inf.id,
      title: inf.title,
      subtitle: `${inf.country} · ${inf.era} · ${influenceTypeLabels[inf.influenceType]}`,
      description: inf.description,
      sections: [
        { title: '具体表现', content: inf.examples },
        { title: '相关器物', content: inf.artifacts.length > 0 ? inf.artifacts : ['暂无'] },
      ],
      color: inf.color,
      bgColor: `${inf.color}15`,
      imagePrompt: inf.imagePrompt,
    });
  };

  const handleOpenArtifactDetail = (art: ExportedArtifact) => {
    onOpenDetail({
      type: 'exported-artifact',
      id: art.id,
      title: art.name,
      subtitle: `${art.originDynasty} · ${art.originKiln}`,
      description: art.description + '\n\n' + art.significance,
      sections: [
        {
          title: '流传经过',
          content: [
            `产地：${art.originKiln}`,
            `出土地：${art.discoveredIn}`,
            `现存地点：${art.currentLocation}`,
            `材质：${art.material}`,
          ],
        },
        { title: '历史意义', content: [art.significance] },
      ],
      color: art.color,
      bgColor: `${art.color}15`,
      imagePrompt: art.imagePrompt,
    });
  };

  return (
    <section id="trade" className="section-padding bg-porcelain-paper relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <pattern id="mapGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#D4C8A8" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <SectionTitle
          tag="TRADE · 陶瓷之路"
          title="贸易与文化交流"
          subtitle='从陆上丝绸之路到海上陶瓷之路，中国瓷器跨越千山万水，连接东西方文明。探索千年贸易史上的伟大航线、重要事件与文化交融'
        />

        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { key: 'routes', label: '贸易路线', icon: Globe },
              { key: 'events', label: '历史事件', icon: Calendar },
              { key: 'influence', label: '文化影响', icon: Palette },
              { key: 'artifacts', label: '外销器物', icon: Sparkles },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as TabType)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === key
                    ? 'bg-porcelain-ji-blue text-white shadow-md scale-105'
                    : 'bg-porcelain-scroll/60 text-porcelain-inkbrown/70 hover:bg-porcelain-gold/20 border border-porcelain-crackle/40'
                }`}
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'routes' && (
            <div className="space-y-6">
              <div className="bg-porcelain-scroll/60 backdrop-blur-sm rounded-2xl p-5 md:p-8 border border-porcelain-crackle/40 shadow-porcelain">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <SealLabel text="通" size="md" />
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      动态贸易地图
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAnimating(!isAnimating)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isAnimating
                          ? 'bg-porcelain-youlihong text-white shadow-md'
                          : 'bg-porcelain-paper text-porcelain-inkbrown/60 border border-porcelain-crackle/40'
                      }`}
                    >
                      {isAnimating ? <Pause size={12} /> : <Play size={12} />}
                      {isAnimating ? '暂停动画' : '播放动画'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {tradeData.routes.map((route) => (
                    <button
                      key={route.id}
                      onClick={() => setSelectedRouteId(route.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                        selectedRouteId === route.id
                          ? 'text-white shadow-md scale-105'
                          : 'bg-porcelain-paper text-porcelain-inkbrown/60 hover:scale-105 border border-porcelain-crackle/40'
                      }`}
                      style={{
                        backgroundColor: selectedRouteId === route.id ? route.color : undefined,
                      }}
                    >
                      {route.type === 'maritime' ? <Ship size={12} /> : <Globe size={12} />}
                      {route.name}
                    </button>
                  ))}
                </div>

                <div className="relative w-full aspect-[2/1] bg-gradient-to-br from-porcelain-scroll/80 to-porcelain-gold/10 rounded-xl overflow-hidden border border-porcelain-crackle/50">
                  <svg
                    viewBox="0 0 1000 500"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <pattern id="oceanPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="0.5" fill="#2C3E50" opacity="0.15" />
                      </pattern>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <rect width="1000" height="500" fill="url(#oceanPattern)" />

                    <g opacity="0.25" fill="#C9A962" stroke="#C9A962" strokeWidth="0.5">
                      <path d="M180,120 Q200,100 230,110 L260,90 Q280,80 310,95 L340,80 Q370,70 400,85 L420,75 Q450,60 490,70 L520,60 Q550,55 580,70 L600,65 Q620,60 650,80 L680,70 Q710,55 740,70 L760,80 Q780,90 760,110 L740,130 Q720,150 690,150 L660,160 Q630,170 600,165 L570,175 Q540,190 510,185 L480,195 Q450,210 420,200 L390,210 Q360,220 330,210 L300,220 Q270,230 240,215 L210,220 Q180,225 160,200 L150,170 Q140,145 180,120 Z" />
                      <path d="M200,260 Q220,240 250,250 L280,240 Q310,230 340,245 L370,235 Q400,225 430,240 L460,235 Q490,225 520,240 L550,245 Q580,250 610,245 L640,255 Q670,265 700,260 L730,270 Q760,280 790,275 L810,285 Q830,295 820,315 L800,330 Q780,340 750,330 L720,340 Q690,350 660,345 L630,355 Q600,365 570,355 L540,360 Q510,365 480,355 L450,365 Q420,375 390,365 L360,370 Q330,375 300,365 L270,370 Q240,375 210,360 L190,340 Q170,315 200,260 Z" />
                      <path d="M780,150 Q800,135 830,140 L860,130 Q890,120 920,135 L940,145 Q960,160 950,185 L930,200 Q910,215 880,210 L850,220 Q820,230 790,220 L770,200 Q760,175 780,150 Z" />
                      <path d="M120,290 Q140,275 170,280 L200,270 Q230,260 260,275 L290,270 Q320,265 350,280 L380,285 Q410,290 400,315 L380,335 Q360,350 330,345 L300,355 Q270,365 240,355 L210,365 Q180,375 150,360 L130,335 Q110,310 120,290 Z" />
                      <path d="M750,350 Q780,335 810,340 L840,330 Q870,320 900,335 L930,345 Q960,360 950,390 L920,410 Q890,425 860,420 L830,430 Q800,440 770,430 L750,410 Q730,380 750,350 Z" />
                    </g>

                    {selectedRoute && (
                      <g>
                        {selectedRoute.segments.map((seg, idx) => {
                          const fromLoc = tradeData.locations.find((l) => l.id === seg.from);
                          const toLoc = tradeData.locations.find((l) => l.id === seg.to);
                          if (!fromLoc || !toLoc) return null;
                          const x1 = lngToX(fromLoc.lng) * 10;
                          const y1 = latToY(fromLoc.lat) * 5;
                          const x2 = lngToX(toLoc.lng) * 10;
                          const y2 = latToY(toLoc.lat) * 5;
                          const mx = (x1 + x2) / 2;
                          const my = (y1 + y2) / 2 - (selectedRoute.type === 'maritime' ? 40 : 20);

                          const totalSegments = selectedRoute.segments.length;
                          const segStart = idx / totalSegments;
                          const segEnd = (idx + 1) / totalSegments;
                          const isActive = animationProgress >= segStart && animationProgress < segEnd;
                          const segProgress = isActive
                            ? (animationProgress - segStart) / (segEnd - segStart)
                            : animationProgress > segEnd
                            ? 1
                            : 0;

                          return (
                            <g key={`${seg.from}-${seg.to}`}>
                              <path
                                d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                                fill="none"
                                stroke={selectedRoute.color}
                                strokeWidth="2"
                                strokeDasharray="8 4"
                                opacity="0.3"
                              />
                              <path
                                d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                                fill="none"
                                stroke={selectedRoute.color}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray="1000"
                                strokeDashoffset={1000 * (1 - segProgress)}
                                filter="url(#glow)"
                              />
                              {isAnimating && segProgress > 0 && segProgress < 1 && (
                                <circle
                                  r="8"
                                  fill={selectedRoute.color}
                                  filter="url(#glow)"
                                  opacity="0.9"
                                >
                                  <animateMotion
                                    dur={`${4 / totalSegments}s`}
                                    repeatCount="indefinite"
                                    path={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                                    begin={`${idx * (4 / totalSegments)}s`}
                                  />
                                </circle>
                              )}
                            </g>
                          );
                        })}
                      </g>
                    )}

                    {selectedRoute?.keyLocations.map((locId) => {
                      const loc = tradeData.locations.find((l) => l.id === locId);
                      if (!loc) return null;
                      const x = lngToX(loc.lng) * 10;
                      const y = latToY(loc.lat) * 5;
                      const size = loc.importance === 'primary' ? 10 : loc.importance === 'secondary' ? 7 : 5;
                      return (
                        <g key={loc.id} className="cursor-pointer">
                          <circle
                            cx={x}
                            cy={y}
                            r={size + 4}
                            fill={loc.color}
                            opacity="0.25"
                          >
                            <animate attributeName="r" values={`${size + 4};${size + 10};${size + 4}`} dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.25;0.05;0.25" dur="2s" repeatCount="indefinite" />
                          </circle>
                          <circle cx={x} cy={y} r={size} fill={loc.color} stroke="#FAF7F0" strokeWidth="2" />
                          <text x={x} y={y + size + 14} textAnchor="middle" fontSize="10" fill="#3D2B1F" fontWeight="bold">
                            {loc.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {selectedRoute && (
                  <div
                    key={selectedRoute.id}
                    className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-in"
                  >
                    <div className="lg:col-span-2 bg-porcelain-paper rounded-xl p-5 border border-porcelain-crackle/30">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                          style={{ backgroundColor: selectedRoute.color }}
                        >
                          {selectedRoute.type === 'maritime' ? (
                            <Ship size={24} className="text-white" />
                          ) : (
                            <Globe size={24} className="text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="font-serif text-xl font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                              {selectedRoute.name}
                            </h4>
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium"
                              style={{ backgroundColor: selectedRoute.color }}
                            >
                              {selectedRoute.type === 'maritime' ? '海上通道' : '陆上通道'}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-porcelain-scroll text-porcelain-inkbrown/60">
                              {selectedRoute.era}
                            </span>
                          </div>
                          <p className="text-sm text-porcelain-inkbrown/65 leading-relaxed">
                            {selectedRoute.description}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-porcelain-scroll/50 rounded-lg p-3">
                          <div className="flex items-center gap-1.5 text-xs text-porcelain-inkbrown/50 mb-1.5">
                            <Sparkles size={11} />
                            <span>主要货物</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {selectedRoute.keyGoods.map((g) => (
                              <span
                                key={g}
                                className="text-[10px] px-2 py-0.5 rounded-full text-white"
                                style={{ backgroundColor: `${selectedRoute.color}cc` }}
                              >
                                {g}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-porcelain-scroll/50 rounded-lg p-3">
                          <div className="flex items-center gap-1.5 text-xs text-porcelain-inkbrown/50 mb-1.5">
                            <MapPin size={11} />
                            <span>途经城市</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {selectedRoute.keyLocations.slice(0, 4).map((lid) => {
                              const loc = tradeData.locations.find((l) => l.id === lid);
                              return (
                                <span
                                  key={lid}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-porcelain-paper border border-porcelain-crackle/40 text-porcelain-inkbrown/60"
                                >
                                  {loc?.name || lid}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenRouteDetail(selectedRoute)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                        style={{
                          backgroundColor: `${selectedRoute.color}15`,
                          color: selectedRoute.color,
                        }}
                      >
                        <Info size={14} />
                        查看路线详情
                      </button>
                    </div>

                    <div className="bg-porcelain-scroll/50 rounded-xl p-5 border border-porcelain-crackle/30">
                      <div className="flex items-center gap-2 mb-4">
                        <Compass size={16} className="text-porcelain-gold" />
                        <h5 className="font-serif text-base font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          文化影响
                        </h5>
                      </div>
                      <ul className="space-y-2.5">
                        {selectedRoute.culturalImpact.map((impact, i) => (
                          <li
                            key={i}
                            className="text-sm text-porcelain-inkbrown/70 leading-relaxed pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full"
                            style={{ fontFamily: '"Noto Serif SC", serif' }}
                          >
                            <span className="block w-1.5 h-1.5 rounded-full absolute left-0 top-2" style={{ backgroundColor: selectedRoute.color }} />
                            {impact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="bg-porcelain-scroll/60 backdrop-blur-sm rounded-2xl p-5 md:p-8 border border-porcelain-crackle/40 shadow-porcelain">
                <div className="flex items-center gap-3 mb-8">
                  <SealLabel text="史" size="md" />
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    贸易历史事件时间轴
                  </h3>
                </div>

                <div className="relative">
                  <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-porcelain-gold/60 via-porcelain-celadon/60 to-porcelain-youlihong/60" />

                  <div className="space-y-6">
                    {sortedEvents.map((event, idx) => {
                      const loc = tradeData.locations.find((l) => l.id === event.location);
                      const isLeft = idx % 2 === 0;
                      const isActive = selectedEventId === event.id;

                      return (
                        <div
                          key={event.id}
                          className={`relative flex items-start gap-4 md:gap-8 ${
                            isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                          }`}
                        >
                          <div className={`w-full md:w-[calc(50%-2rem)] ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                            <button
                              onClick={() => {
                                setSelectedEventId(isActive ? null : event.id);
                              }}
                              className={`text-left w-full group bg-porcelain-paper rounded-xl p-4 md:p-5 border border-porcelain-crackle/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
                                isActive ? 'ring-2 ring-offset-2' : ''
                              }`}
                              style={{
                                boxShadow: isActive ? `0 0 0 2px ${event.color}, 0 12px 40px rgba(44, 62, 80, 0.18)` : undefined,
                              }}
                            >
                              <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'md:justify-end' : ''} flex-wrap`}>
                                <span
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
                                  style={{ backgroundColor: event.color }}
                                >
                                  {eventTypeIcons[event.type]}
                                  {eventTypeLabels[event.type]}
                                </span>
                                <span className="text-xs text-porcelain-inkbrown/50 font-mono">
                                  {event.yearDisplay}
                                </span>
                              </div>
                              <h5 className="font-serif text-base md:text-lg font-bold text-porcelain-inkbrown mb-2 group-hover:text-porcelain-youlihong transition-colors" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                                {event.title}
                              </h5>
                              <div className={`flex items-center gap-1.5 text-xs text-porcelain-inkbrown/50 mb-2 ${isLeft ? 'md:justify-end' : ''}`}>
                                <MapPin size={11} />
                                <span>{loc?.name || event.location}</span>
                              </div>
                              <p className="text-xs md:text-sm text-porcelain-inkbrown/65 leading-relaxed line-clamp-2">
                                {event.description}
                              </p>
                            </button>
                          </div>

                          <div className="hidden md:block w-0" />

                          <div className="absolute left-6 md:left-1/2 top-5 -translate-x-1/2 z-10">
                            <div
                              className={`w-4 h-4 rounded-full border-[3px] border-porcelain-paper shadow-md transition-all ${
                                isActive ? 'scale-125 animate-glow-pulse' : ''
                              }`}
                              style={{ backgroundColor: event.color }}
                            />
                          </div>

                          <div className="hidden md:block w-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedEvent && (
                  <div
                    className="mt-8 bg-porcelain-paper rounded-xl p-5 md:p-6 border border-porcelain-crackle/40 animate-fade-in"
                    style={{
                      borderColor: `${selectedEvent.color}50`,
                      boxShadow: `0 12px 40px ${selectedEvent.color}18`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                          style={{ backgroundColor: selectedEvent.color }}
                        >
                          <span className="text-white">{eventTypeIcons[selectedEvent.type]}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="font-serif text-xl font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                              {selectedEvent.title}
                            </h4>
                            <span className="text-xs px-2.5 py-0.5 rounded-full text-white font-medium" style={{ backgroundColor: selectedEvent.color }}>
                              {selectedEvent.yearDisplay}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-porcelain-inkbrown/50">
                            <span className="flex items-center gap-1">
                              <MapPin size={11} />
                              {tradeData.locations.find((l) => l.id === selectedEvent.location)?.name}
                            </span>
                            <span className="flex items-center gap-1">
                              {eventTypeIcons[selectedEvent.type]}
                              {eventTypeLabels[selectedEvent.type]}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedEventId(null)}
                        className="p-1.5 rounded-full hover:bg-porcelain-crackle/30 text-porcelain-inkbrown/50 transition-colors"
                      >
                        <ChevronRight size={20} className="rotate-45" />
                      </button>
                    </div>
                    <p className="text-sm md:text-base text-porcelain-inkbrown/75 leading-relaxed mb-4" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      {selectedEvent.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: selectedEvent.color }} />
                      <span className="font-serif text-sm font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                        历史影响
                      </span>
                    </div>
                    <p className="text-sm text-porcelain-inkbrown/70 leading-relaxed mb-5 pl-3.5 border-l-2" style={{ borderColor: `${selectedEvent.color}50` }}>
                      {selectedEvent.impact}
                    </p>
                    <button
                      onClick={() => handleOpenEventDetail(selectedEvent)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                      style={{
                        backgroundColor: `${selectedEvent.color}15`,
                        color: selectedEvent.color,
                      }}
                    >
                      <Info size={14} />
                      查看完整事件
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'influence' && (
            <div className="space-y-6">
              <div className="bg-porcelain-scroll/60 backdrop-blur-sm rounded-2xl p-5 md:p-8 border border-porcelain-crackle/40 shadow-porcelain">
                <div className="flex items-center gap-3 mb-8">
                  <SealLabel text="化" size="md" />
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    陶瓷与世界文化交融
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {['technology', 'aesthetic', 'social', 'economic'].map((t) => (
                    <div
                      key={t}
                      className="text-center bg-porcelain-paper rounded-xl p-4 border border-porcelain-crackle/30"
                    >
                      {t === 'technology' && <Sparkles size={24} className="mx-auto mb-2 text-porcelain-ji-blue" />}
                      {t === 'aesthetic' && <Palette size={24} className="mx-auto mb-2 text-porcelain-youlihong" />}
                      {t === 'social' && <Users size={24} className="mx-auto mb-2 text-porcelain-celadon" />}
                      {t === 'economic' && <TrendingUp size={24} className="mx-auto mb-2 text-porcelain-gold" />}
                      <div className="font-serif text-sm font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                        {influenceTypeLabels[t]}
                      </div>
                      <div className="text-xs text-porcelain-inkbrown/50 mt-1">
                        {tradeData.culturalInfluences.filter((i) => i.influenceType === t).length} 项
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {tradeData.culturalInfluences.map((inf, idx) => (
                    <button
                      key={inf.id}
                      onClick={() => handleOpenInfluenceDetail(inf)}
                      className={`group text-left bg-porcelain-paper rounded-xl overflow-hidden border border-porcelain-crackle/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                        isVisible ? 'animate-fade-in-up' : ''
                      }`}
                      style={{ animationDelay: `${idx * 0.06}s` }}
                    >
                      <div className="relative h-28 overflow-hidden" style={{ backgroundColor: `${inf.color}25` }}>
                        <div
                          className="absolute inset-0 opacity-60"
                          style={{
                            background: `radial-gradient(circle at 30% 30%, ${inf.color}40, transparent 60%)`,
                          }}
                        />
                        <div className="absolute top-3 right-3">
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium"
                            style={{ backgroundColor: inf.color }}
                          >
                            {influenceTypeLabels[inf.influenceType]}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-4">
                          <div className="flex items-center gap-2">
                            <MapPin size={12} className="text-porcelain-inkbrown/60" />
                            <span className="text-xs text-porcelain-inkbrown/70">
                              {inf.country}
                            </span>
                            <span className="text-[10px] text-porcelain-inkbrown/40">·</span>
                            <span className="text-[10px] text-porcelain-inkbrown/50">{inf.era}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h5 className="font-serif text-base font-bold text-porcelain-inkbrown mb-2 group-hover:text-porcelain-youlihong transition-colors" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          {inf.title}
                        </h5>
                        <p className="text-xs text-porcelain-inkbrown/65 leading-relaxed line-clamp-2 mb-3">
                          {inf.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {inf.examples.slice(0, 2).map((ex, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-porcelain-scroll/60 text-porcelain-inkbrown/55"
                            >
                              {ex.slice(0, 15)}...
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'artifacts' && (
            <div className="space-y-6">
              <div className="bg-porcelain-scroll/60 backdrop-blur-sm rounded-2xl p-5 md:p-8 border border-porcelain-crackle/40 shadow-porcelain">
                <div className="flex items-center gap-3 mb-8">
                  <SealLabel text="宝" size="md" />
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    海外珍藏的中国瓷器
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {tradeData.exportedArtifacts.map((art, idx) => (
                    <button
                      key={art.id}
                      onClick={() => handleOpenArtifactDetail(art)}
                      className={`group text-left bg-porcelain-paper rounded-xl overflow-hidden border border-porcelain-crackle/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                        isVisible ? 'animate-fade-in-up' : ''
                      }`}
                      style={{ animationDelay: `${idx * 0.06}s` }}
                    >
                      <div
                        className="relative w-full aspect-square overflow-hidden flex items-center justify-center"
                        style={{ backgroundColor: `${art.color}18` }}
                      >
                        <div
                          className="w-28 h-28 rounded-full shadow-lg transition-transform duration-500 group-hover:scale-110"
                          style={{
                            background: `radial-gradient(circle at 30% 30%, ${art.color}30, ${art.color}60)`,
                            boxShadow: `0 10px 30px ${art.color}35`,
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-porcelain-paper/70 to-transparent pointer-events-none" />
                        <div className="absolute top-3 left-3">
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium"
                            style={{ backgroundColor: art.color }}
                          >
                            {art.era}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h5 className="font-serif text-sm font-bold text-porcelain-inkbrown mb-1 group-hover:text-porcelain-youlihong transition-colors line-clamp-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          {art.name}
                        </h5>
                        <div className="flex items-center gap-1 text-[10px] text-porcelain-inkbrown/50 mb-2">
                          <span>{art.originDynasty}</span>
                          <span>·</span>
                          <span>{art.originKiln}</span>
                        </div>
                        <p className="text-[11px] text-porcelain-inkbrown/60 leading-relaxed line-clamp-2">
                          {art.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
