import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Pickaxe,
  Shovel,
  Sparkles,
  Droplets,
  Search,
  BookOpen,
  Archive,
  ChevronRight,
  ChevronLeft,
  Star,
  Trophy,
  Crown,
  Gem,
  Zap,
  RotateCcw,
  Check,
  X,
  MapPin,
  Clock,
  AlertCircle,
  Layers,
  Eye,
  Info,
  Award,
} from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import SealLabel from '@/components/common/SealLabel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  excavationSites,
  excavationArtifacts,
  rarityConfig,
  conditionConfig,
  categoryLabels,
  getRandomArtifact,
} from '@/data/excavation';
import type {
  ExcavationSite,
  FoundArtifact,
  ProcessingStage,
  ArtifactCategory,
  ExcavationArtifact,
  ArtifactRarity,
  DetailData,
} from '@/types';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

type ViewMode = 'sites' | 'dig' | 'inventory' | 'museum';

const rarityIcons: Record<ArtifactRarity, JSX.Element> = {
  common: <Star size={12} />,
  uncommon: <Star size={12} />,
  rare: <Gem size={12} />,
  epic: <Trophy size={12} />,
  legendary: <Crown size={12} />,
};

const stageLabels: Record<ProcessingStage, { name: string; icon: JSX.Element }> = {
  raw: { name: '待清理', icon: <Shovel size={12} /> },
  cleaned: { name: '待分类', icon: <Droplets size={12} /> },
  classified: { name: '待鉴定', icon: <Layers size={12} /> },
  identified: { name: '待入藏', icon: <Search size={12} /> },
  collected: { name: '已入藏', icon: <Archive size={12} /> },
};

export default function ExcavationSection({ onOpenDetail }: Props) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);
  const [view, setView] = useState<ViewMode>('sites');
  const [energy, setEnergy] = useState(100);
  const [maxEnergy] = useState(100);
  const [totalDigs, setTotalDigs] = useState(0);
  const [foundArtifacts, setFoundArtifacts] = useState<FoundArtifact[]>([]);
  const [currentSiteId, setCurrentSiteId] = useState<string | null>(null);
  const [isDigging, setIsDigging] = useState(false);
  const [digResult, setDigResult] = useState<{ artifact: ExcavationArtifact; found: FoundArtifact } | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<FoundArtifact | null>(null);
  const [categoryGuess, setCategoryGuess] = useState<ArtifactCategory | null>(null);
  const [identificationOptions, setIdentificationOptions] = useState<ExcavationArtifact[]>([]);
  const [showIdentificationResult, setShowIdentificationResult] = useState(false);
  const [lastIdentificationCorrect, setLastIdentificationCorrect] = useState(false);

  const currentSite = currentSiteId
    ? excavationSites.find(s => s.id === currentSiteId) || null
    : null;

  const museumCollection = useMemo(() => {
    const collected = foundArtifacts.filter(a => a.stage === 'collected');
    const byRarity: Record<ArtifactRarity, number> = {
      common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0,
    };
    const byEra: Record<string, number> = {};
    const byKiln: Record<string, number> = {};

    collected.forEach(fa => {
      const artifact = excavationArtifacts.find(a => a.id === fa.artifactId);
      if (artifact) {
        byRarity[artifact.rarity]++;
        byEra[artifact.era] = (byEra[artifact.era] || 0) + 1;
        byKiln[artifact.originKiln] = (byKiln[artifact.originKiln] || 0) + 1;
      }
    });

    return {
      totalCollected: collected.length,
      byRarity,
      byEra,
      byKiln,
    };
  }, [foundArtifacts]);

  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy(e => Math.min(e + 2, maxEnergy));
    }, 5000);
    return () => clearInterval(timer);
  }, [maxEnergy]);

  const handleDig = useCallback(async () => {
    if (!currentSiteId || energy < 20 || isDigging) return;

    setEnergy(e => e - 20);
    setTotalDigs(n => n + 1);
    setIsDigging(true);
    setDigResult(null);

    await new Promise(r => setTimeout(r, 1800));

    const { artifact, condition } = getRandomArtifact(currentSiteId);
    const found: FoundArtifact = {
      id: `found_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      artifactId: artifact.id,
      foundAt: Date.now(),
      siteId: currentSiteId,
      stage: 'raw',
      condition,
      cleanProgress: 0,
    };

    setFoundArtifacts(prev => [found, ...prev]);
    setDigResult({ artifact, found });
    setIsDigging(false);
  }, [currentSiteId, energy, isDigging]);

  const handleClean = useCallback((foundId: string) => {
    setFoundArtifacts(prev =>
      prev.map(fa => {
        if (fa.id !== foundId) return fa;
        const newProgress = Math.min(fa.cleanProgress + 25, 100);
        return {
          ...fa,
          cleanProgress: newProgress,
          stage: newProgress >= 100 ? 'cleaned' : fa.stage,
        };
      })
    );
  }, []);

  const handleClassify = useCallback((foundId: string, category: ArtifactCategory) => {
    const found = foundArtifacts.find(f => f.id === foundId);
    if (!found) return;
    const correctArtifact = excavationArtifacts.find(a => a.id === found.artifactId);
    const isCorrect = correctArtifact?.category === category;

    setFoundArtifacts(prev =>
      prev.map(fa =>
        fa.id === foundId
          ? {
              ...fa,
              categoryGuess: category,
              stage: 'classified',
            }
          : fa
      )
    );

    const siteId = found.siteId;
    const siteArtifacts = excavationArtifacts.filter(a => a.originSite === siteId);
    const correct = excavationArtifacts.find(a => a.id === found.artifactId)!;
    const distractors = siteArtifacts
      .filter(a => a.id !== correct.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [...distractors, correct].sort(() => Math.random() - 0.5);
    setIdentificationOptions(options);

    if (!isCorrect) {
      setFoundArtifacts(prev =>
        prev.map(fa =>
          fa.id === foundId
            ? { ...fa, categoryGuess: category }
            : fa
        )
      );
    }
  }, [foundArtifacts]);

  const handleIdentify = useCallback((foundId: string, selectedArtifactId: string) => {
    const found = foundArtifacts.find(f => f.id === foundId);
    if (!found) return;
    const isCorrect = found.artifactId === selectedArtifactId;
    const result = excavationArtifacts.find(a => a.id === selectedArtifactId);

    setLastIdentificationCorrect(isCorrect);
    setShowIdentificationResult(true);

    setTimeout(() => {
      if (isCorrect) {
        setFoundArtifacts(prev =>
          prev.map(fa =>
            fa.id === foundId
              ? {
                  ...fa,
                  stage: 'identified',
                  identificationResult: result,
                }
              : fa
          )
        );
      }
      setShowIdentificationResult(false);
    }, 1800);
  }, [foundArtifacts]);

  const handleCollect = useCallback((foundId: string, note?: string) => {
    setFoundArtifacts(prev =>
      prev.map(fa =>
        fa.id === foundId
          ? {
              ...fa,
              stage: 'collected' as ProcessingStage,
              collectedAt: Date.now(),
              museumNote: note,
            }
          : fa
      )
    );
    setSelectedArtifact(null);
  }, []);

  const handleViewArtifactDetail = useCallback((found: FoundArtifact) => {
    const artifact = excavationArtifacts.find(a => a.id === found.artifactId);
    if (!artifact) return;
    onOpenDetail({
      type: 'excavation-artifact',
      id: artifact.id,
      title: artifact.name,
      subtitle: `${artifact.era} · ${artifact.originKiln}`,
      description: artifact.description + '\n\n' + artifact.historicalContext,
      sections: [
        { title: '鉴定要点', content: artifact.identificationPoints },
        {
          title: '基本信息',
          content: [
            `材质：${artifact.material}`,
            `釉色：${artifact.glazeColor || '—'}`,
            `装饰：${artifact.decoration || '—'}`,
            `造型：${artifact.shapeFeatures || '—'}`,
            `款识：${artifact.baseMark || '无款'}`,
          ],
        },
        { title: '参考价值', content: [artifact.referenceValue] },
      ],
      color: artifact.color,
      bgColor: `${artifact.color}15`,
      imagePrompt: artifact.imagePrompt,
    });
  }, [onOpenDetail]);

  const handleViewSiteDetail = useCallback((site: ExcavationSite) => {
    onOpenDetail({
      type: 'excavation-site',
      id: site.id,
      title: site.name,
      subtitle: site.location,
      description: site.description,
      sections: [
        { title: '遗址特征', content: site.features },
        { title: '著名出土', content: site.famousFinds },
        { title: '时代', content: [site.era] },
      ],
      color: site.color,
      bgColor: site.bgColor,
      imagePrompt: site.imagePrompt,
    });
  }, [onOpenDetail]);

  const ArtifactBadge = ({ found }: { found: FoundArtifact }) => {
    const artifact = excavationArtifacts.find(a => a.id === found.artifactId);
    if (!artifact) return null;
    const rc = rarityConfig[artifact.rarity];
    const cc = conditionConfig[found.condition];
    const sl = stageLabels[found.stage];

    return (
      <div
        className={`relative rounded-xl p-3 border-2 transition-all duration-300 cursor-pointer group ${
          selectedArtifact?.id === found.id
            ? 'border-porcelain-gold shadow-lg scale-[1.02]'
            : 'border-porcelain-crackle/30 hover:border-porcelain-gold/50 hover:-translate-y-0.5'
        }`}
        style={{ backgroundColor: `${rc.bgColor}80` }}
        onClick={() => {
          setSelectedArtifact(found);
          setCategoryGuess(null);
          setIdentificationOptions([]);
          const siteArtifacts = excavationArtifacts.filter(a => a.originSite === found.siteId);
          const correct = excavationArtifacts.find(a => a.id === found.artifactId)!;
          const distractors = siteArtifacts
            .filter(a => a.id !== correct.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
          setIdentificationOptions([...distractors, correct].sort(() => Math.random() - 0.5));
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center shadow-inner"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${artifact.color}30, ${artifact.color}60)`,
            }}
          >
            {artifact.type === 'shard' ? (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={artifact.color} strokeWidth="1.8">
                <path d="M4 14 L8 4 L20 6 L18 18 L8 20 Z" />
                <path d="M8 4 L14 12 L20 6" opacity="0.4" />
                <path d="M4 14 L12 15 L18 18" opacity="0.4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={artifact.color} strokeWidth="1.8">
                <path d="M8 4 L16 4 L14 8 Q19 12 17 17 Q16 21 12 21 Q8 21 7 17 Q5 12 10 8 Z" />
                <path d="M7 13 Q12 12 17 13" opacity="0.4" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold"
                style={{ backgroundColor: rc.bgColor, color: rc.color }}
              >
                {rarityIcons[artifact.rarity]}
                {rc.name}
              </span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${cc.color}15`, color: cc.color }}
              >
                {cc.name}
              </span>
            </div>
            <p className="font-serif text-xs font-bold text-porcelain-inkbrown line-clamp-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>
              {artifact.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="inline-flex items-center gap-0.5 text-[10px] text-porcelain-inkbrown/55"
                style={{ color: sl === stageLabels.collected ? '#10B981' : undefined }}
              >
                {sl.icon}
                {sl.name}
              </span>
              {found.stage === 'raw' && (
                <div className="flex-1 h-1 bg-porcelain-crackle/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-porcelain-celadon transition-all duration-300"
                    style={{ width: `${found.cleanProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="excavation" className="section-padding bg-gradient-to-b from-porcelain-paper to-porcelain-scroll/40 relative overflow-hidden">
      <div className="absolute top-20 right-0 w-96 h-96 bg-porcelain-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-porcelain-youlihong/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-8 relative">
        <SectionTitle
          tag="EXCAVATION · 柒"
          title="考古发掘"
          subtitle='"探方拨开千年土，拂尘重现宋时瓷"。在各大名窑遗址开展考古发掘，清理文物碎片，鉴定年代窑口，构建您的私人陶瓷博物馆'
        />

        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <div className="bg-porcelain-paper/80 rounded-2xl p-5 md:p-8 shadow-porcelain border border-porcelain-crackle/40 backdrop-blur-sm">
            <div className="flex items-start gap-3 mb-6">
              <SealLabel text="考" size="md" />
              <div className="flex-1">
                <h3
                  className="font-serif text-xl md:text-2xl font-bold text-porcelain-inkbrown mb-1"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  虚拟考古发掘系统
                </h3>
                <p className="text-sm text-porcelain-inkbrown/65 leading-relaxed max-w-3xl" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  选择遗址进行发掘，随机获得陶瓷碎片与完整器物。对出土文物进行清洗、分类、鉴定，完成全部流程后即可入藏您的私人博物馆。
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-xs text-porcelain-inkbrown/60 mb-1">
                    <Zap size={12} className="text-porcelain-gold" />
                    <span>发掘体力</span>
                  </div>
                  <div className="w-24 h-2.5 bg-porcelain-crackle/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-porcelain-gold to-porcelain-youlihong transition-all duration-500 rounded-full"
                      style={{ width: `${(energy / maxEnergy) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-porcelain-inkbrown/50 mt-0.5">{energy} / {maxEnergy}</p>
                </div>
                <div className="text-center px-3 py-1.5 rounded-lg bg-porcelain-celadon/10">
                  <p className="text-lg font-bold text-porcelain-celadon">{museumCollection.totalCollected}</p>
                  <p className="text-[10px] text-porcelain-inkbrown/50">已入藏</p>
                </div>
                <div className="text-center px-3 py-1.5 rounded-lg bg-porcelain-ji-blue/10">
                  <p className="text-lg font-bold text-porcelain-ji-blue">{totalDigs}</p>
                  <p className="text-[10px] text-porcelain-inkbrown/50">总发掘</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {[
                { id: 'sites', label: '选择遗址', icon: MapPin },
                { id: 'dig', label: '开始发掘', icon: Pickaxe, disabled: !currentSite },
                { id: 'inventory', label: '文物整理', icon: Layers, badge: foundArtifacts.filter(a => a.stage !== 'collected').length || undefined },
                { id: 'museum', label: '私人博物馆', icon: Archive, badge: museumCollection.totalCollected || undefined },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setView(tab.id as ViewMode)}
                  disabled={tab.disabled}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                    view === tab.id
                      ? 'bg-porcelain-youlihong text-white shadow-lg'
                      : tab.disabled
                      ? 'bg-porcelain-crackle/20 text-porcelain-inkbrown/30 cursor-not-allowed'
                      : 'bg-porcelain-scroll/50 text-porcelain-inkbrown/70 hover:bg-porcelain-scroll hover:text-porcelain-inkbrown'
                  }`}
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-porcelain-gold text-white text-[10px] flex items-center justify-center font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {view === 'sites' && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {excavationSites.map((site, idx) => (
                    <button
                      key={site.id}
                      onClick={() => {
                        setCurrentSiteId(site.id);
                        setView('dig');
                      }}
                      className={`group relative text-left p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                        currentSiteId === site.id
                          ? 'border-porcelain-youlihong shadow-lg scale-[1.01]'
                          : 'border-porcelain-crackle/30 hover:border-porcelain-gold/50 hover:-translate-y-1 hover:shadow-porcelain'
                      } ${isVisible ? 'animate-fade-in-up' : ''}`}
                      style={{
                        animationDelay: `${idx * 0.05}s`,
                        backgroundColor: site.bgColor,
                      }}
                    >
                      <div
                        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
                        style={{ backgroundColor: site.color }}
                      />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md"
                            style={{ backgroundColor: `${site.color}20` }}
                          >
                            <MapPin size={24} style={{ color: site.color }} />
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: site.difficulty }).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < site.difficulty ? 'fill-current' : ''}
                                style={{ color: site.color }}
                              />
                            ))}
                          </div>
                        </div>
                        <h4
                          className="font-serif text-lg font-bold mb-1"
                          style={{ fontFamily: '"Noto Serif SC", serif', color: site.color }}
                        >
                          {site.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-porcelain-inkbrown/55 mb-2">
                          <span className="flex items-center gap-0.5"><MapPin size={10} />{site.location}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5"><Clock size={10} />{site.era}</span>
                        </div>
                        <p className="text-xs text-porcelain-inkbrown/65 leading-relaxed mb-3 line-clamp-3" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          {site.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {site.features.slice(0, 2).map((f, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: `${site.color}15`, color: site.color }}
                              >
                                {f.split('，')[0]}
                              </span>
                            ))}
                          </div>
                          <span className="flex items-center gap-1 text-xs font-bold" style={{ color: site.color }}>
                            前往发掘
                            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {view === 'dig' && currentSite && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-2">
                    <div
                      className="rounded-2xl p-5 h-full relative overflow-hidden"
                      style={{ backgroundColor: currentSite.bgColor }}
                    >
                      <div
                        className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 blur-3xl"
                        style={{ backgroundColor: currentSite.color }}
                      />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                            style={{ backgroundColor: `${currentSite.color}20`, color: currentSite.color }}
                          >
                            <MapPin size={12} />
                            当前遗址
                          </span>
                          <button
                            onClick={() => setView('sites')}
                            className="text-xs text-porcelain-inkbrown/50 hover:text-porcelain-youlihong transition-colors flex items-center gap-0.5"
                          >
                            <ChevronLeft size={12} />
                            更换遗址
                          </button>
                        </div>
                        <h4
                          className="font-serif text-2xl font-bold mb-2"
                          style={{ fontFamily: '"Noto Serif SC", serif', color: currentSite.color }}
                        >
                          {currentSite.name}
                        </h4>
                        <div className="flex items-center gap-3 text-[11px] text-porcelain-inkbrown/60 mb-4">
                          <span className="flex items-center gap-1"><MapPin size={11} />{currentSite.location}</span>
                          <span className="flex items-center gap-1"><Clock size={11} />{currentSite.era}</span>
                        </div>
                        <p className="text-sm text-porcelain-inkbrown/70 leading-relaxed mb-5" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          {currentSite.description}
                        </p>
                        <button
                          onClick={() => handleViewSiteDetail(currentSite)}
                          className="flex items-center gap-1 text-xs text-porcelain-inkbrown/55 hover:text-porcelain-ji-blue transition-colors mb-6"
                        >
                          <Info size={12} />
                          查看遗址详情
                        </button>

                        <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-dashed" style={{ borderColor: `${currentSite.color}30` }}>
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ backgroundColor: `${currentSite.color}08` }}
                          >
                            {isDigging ? (
                              <div className="text-center">
                                <div className="relative w-20 h-20 mx-auto mb-3">
                                  <div className="absolute inset-0 rounded-full bg-porcelain-youlihong/20 animate-ping" />
                                  <div className="absolute inset-2 rounded-full bg-porcelain-youlihong/30 animate-pulse" />
                                  <Pickaxe size={32} className="absolute inset-0 m-auto text-porcelain-youlihong animate-bounce" style={{ color: currentSite.color }} />
                                </div>
                                <p className="font-serif text-sm font-bold text-porcelain-inkbrown/70" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                                  探方挖掘中...
                                </p>
                              </div>
                            ) : digResult ? (
                              <div className="text-center animate-fade-in">
                                <Sparkles size={40} className="mx-auto mb-2 text-porcelain-gold animate-glow-pulse" />
                                <p className="font-serif text-lg font-bold mb-1" style={{ fontFamily: '"Noto Serif SC", serif', color: rarityConfig[digResult.artifact.rarity].color }}>
                                  {rarityConfig[digResult.artifact.rarity].name}发现！
                                </p>
                                <p className="font-serif text-sm text-porcelain-inkbrown/70" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                                  {digResult.artifact.name}
                                </p>
                              </div>
                            ) : (
                              <div className="text-center">
                                <svg viewBox="0 0 120 80" className="w-32 h-24 mx-auto mb-2">
                                  <path d="M10 70 Q30 55 40 65 Q50 50 65 60 Q80 45 95 55 Q105 50 110 70 L110 75 L10 75 Z" fill="#8B7355" opacity="0.3" />
                                  <path d="M15 68 Q35 58 45 63 Q55 52 70 58 Q85 48 100 58" fill="none" stroke="#8B7355" strokeWidth="2" opacity="0.5" />
                                  <ellipse cx="45" cy="62" rx="6" ry="3" fill={digResult ? digResult.artifact.color : '#D4C8A8'} opacity="0.7" />
                                  <ellipse cx="75" cy="57" rx="4" ry="2" fill={digResult ? digResult.artifact.color : '#D4C8A8'} opacity="0.6" />
                                  <rect x="85" y="50" width="8" height="15" rx="1" fill={digResult ? digResult.artifact.color : '#D4C8A8'} opacity="0.5" transform="rotate(15 89 57)" />
                                </svg>
                                <p className="text-xs text-porcelain-inkbrown/40" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                                  点击下方按钮开始发掘
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={handleDig}
                          disabled={energy < 20 || isDigging}
                          className={`mt-5 w-full py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                            energy < 20 || isDigging
                              ? 'bg-porcelain-crackle/40 text-porcelain-inkbrown/40 cursor-not-allowed'
                              : 'bg-gradient-to-r from-porcelain-youlihong to-porcelain-youlihong/80 text-white hover:shadow-xl hover:scale-[1.02]'
                          }`}
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          <Pickaxe size={18} className={isDigging ? 'animate-bounce' : ''} />
                          {isDigging ? '发掘中...' : energy < 20 ? '体力不足，等待恢复' : `挥动探铲（消耗 20 体力）`}
                        </button>
                        {digResult && (
                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={() => setDigResult(null)}
                              className="flex-1 py-2 rounded-lg border border-porcelain-crackle/40 text-xs text-porcelain-inkbrown/65 hover:bg-porcelain-scroll/50 transition-colors"
                              style={{ fontFamily: '"Noto Serif SC", serif' }}
                            >
                              继续发掘
                            </button>
                            <button
                              onClick={() => {
                                setSelectedArtifact(digResult.found);
                                setCategoryGuess(null);
                                const siteArtifacts = excavationArtifacts.filter(a => a.originSite === digResult.found.siteId);
                                const correct = excavationArtifacts.find(a => a.id === digResult.found.artifactId)!;
                                const distractors = siteArtifacts.filter(a => a.id !== correct.id).sort(() => Math.random() - 0.5).slice(0, 3);
                                setIdentificationOptions([...distractors, correct].sort(() => Math.random() - 0.5));
                                setView('inventory');
                              }}
                              className="flex-1 py-2 rounded-lg bg-porcelain-celadon/15 text-porcelain-celadon text-xs font-bold hover:bg-porcelain-celadon/25 transition-colors"
                              style={{ fontFamily: '"Noto Serif SC", serif' }}
                            >
                              前往整理
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <div className="bg-porcelain-scroll/30 rounded-2xl p-5 h-full">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-serif font-bold text-porcelain-inkbrown flex items-center gap-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          <Layers size={16} />
                          最近发掘记录
                        </h5>
                        <button
                          onClick={() => setView('inventory')}
                          className="text-xs text-porcelain-youlihong hover:underline flex items-center gap-0.5"
                        >
                          查看全部 <ChevronRight size={12} />
                        </button>
                      </div>
                      {foundArtifacts.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-center">
                          <div>
                            <div className="w-16 h-16 rounded-full bg-porcelain-crackle/20 flex items-center justify-center mx-auto mb-3">
                              <Shovel size={28} className="text-porcelain-inkbrown/30" />
                            </div>
                            <p className="font-serif text-sm text-porcelain-inkbrown/50" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                              还没有发掘记录
                            </p>
                            <p className="text-xs text-porcelain-inkbrown/40 mt-1">开始您的第一次考古发掘吧！</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                          {foundArtifacts.slice(0, 8).map(fa => (
                            <ArtifactBadge key={fa.id} found={fa} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === 'inventory' && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-porcelain-scroll/30 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-serif font-bold text-porcelain-inkbrown flex items-center gap-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          <Archive size={16} />
                          待整理文物
                        </h5>
                      </div>
                      {foundArtifacts.filter(a => a.stage !== 'collected').length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-center">
                          <div>
                            <div className="w-16 h-16 rounded-full bg-porcelain-crackle/20 flex items-center justify-center mx-auto mb-3">
                              <Sparkles size={28} className="text-porcelain-inkbrown/30" />
                            </div>
                            <p className="font-serif text-sm text-porcelain-inkbrown/50" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                              所有文物已整理完毕
                            </p>
                            <button
                              onClick={() => currentSite ? setView('dig') : setView('sites')}
                              className="mt-3 px-4 py-2 rounded-lg bg-porcelain-youlihong/10 text-porcelain-youlihong text-xs font-bold hover:bg-porcelain-youlihong/20 transition-colors"
                              style={{ fontFamily: '"Noto Serif SC", serif' }}
                            >
                              去发掘更多文物
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                          {foundArtifacts
                            .filter(a => a.stage !== 'collected')
                            .map(fa => (
                              <ArtifactBadge key={fa.id} found={fa} />
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    {selectedArtifact ? (
                      <ProcessingPanel
                        found={selectedArtifact}
                        categoryGuess={categoryGuess}
                        setCategoryGuess={setCategoryGuess}
                        identificationOptions={identificationOptions}
                        showIdentificationResult={showIdentificationResult}
                        lastIdentificationCorrect={lastIdentificationCorrect}
                        onClean={handleClean}
                        onClassify={handleClassify}
                        onIdentify={handleIdentify}
                        onCollect={handleCollect}
                        onViewDetail={handleViewArtifactDetail}
                      />
                    ) : (
                      <div className="h-full min-h-[500px] flex items-center justify-center rounded-2xl border-2 border-dashed border-porcelain-crackle/30">
                        <div className="text-center">
                          <div className="w-20 h-20 rounded-full bg-porcelain-crackle/15 flex items-center justify-center mx-auto mb-4">
                            <Eye size={32} className="text-porcelain-inkbrown/30" />
                          </div>
                          <p className="font-serif text-base text-porcelain-inkbrown/50 mb-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                            请从左侧选择一件文物
                          </p>
                          <p className="text-xs text-porcelain-inkbrown/40">依次完成清理、分类、鉴定后即可入藏博物馆</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {view === 'museum' && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  {[
                    { label: '总入藏品', value: museumCollection.totalCollected, icon: Award, color: '#C9A962' },
                    { label: '国宝级', value: museumCollection.byRarity.legendary, icon: Crown, color: '#F59E0B' },
                    { label: '珍品', value: museumCollection.byRarity.epic, icon: Trophy, color: '#8B5CF6' },
                    { label: '稀有', value: museumCollection.byRarity.rare, icon: Gem, color: '#3B82F6' },
                    { label: '少见', value: museumCollection.byRarity.uncommon + museumCollection.byRarity.common, icon: Star, color: '#10B981' },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl p-4 text-center relative overflow-hidden"
                      style={{ backgroundColor: `${stat.color}10` }}
                    >
                      <stat.icon size={20} className="mx-auto mb-2" style={{ color: stat.color }} />
                      <p className="text-2xl font-bold mb-0.5" style={{ color: stat.color }}>{stat.value}</p>
                      <p className="text-[11px] text-porcelain-inkbrown/60" style={{ fontFamily: '"Noto Serif SC", serif' }}>{stat.label}</p>
                    </div>
                  ))}
                </div>

                {(Object.keys(museumCollection.byEra).length > 0 || Object.keys(museumCollection.byKiln).length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {Object.keys(museumCollection.byEra).length > 0 && (
                      <div className="rounded-xl p-4 bg-porcelain-scroll/40">
                        <h6 className="font-serif text-sm font-bold text-porcelain-inkbrown mb-3 flex items-center gap-1.5" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          <Clock size={14} />
                          按年代分布
                        </h6>
                        <div className="space-y-2">
                          {Object.entries(museumCollection.byEra)
                            .sort(([, a], [, b]) => b - a)
                            .map(([era, count]) => (
                              <div key={era} className="flex items-center gap-3">
                                <span className="text-xs text-porcelain-inkbrown/70 w-20 flex-shrink-0" style={{ fontFamily: '"Noto Serif SC", serif' }}>{era}</span>
                                <div className="flex-1 h-2 bg-porcelain-crackle/30 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-porcelain-ji-blue to-porcelain-celadon rounded-full"
                                    style={{ width: `${(count / Math.max(...Object.values(museumCollection.byEra))) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold text-porcelain-inkbrown/70 w-6 text-right">{count}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                    {Object.keys(museumCollection.byKiln).length > 0 && (
                      <div className="rounded-xl p-4 bg-porcelain-scroll/40">
                        <h6 className="font-serif text-sm font-bold text-porcelain-inkbrown mb-3 flex items-center gap-1.5" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          <MapPin size={14} />
                          按窑口分布
                        </h6>
                        <div className="space-y-2">
                          {Object.entries(museumCollection.byKiln)
                            .sort(([, a], [, b]) => b - a)
                            .map(([kiln, count]) => (
                              <div key={kiln} className="flex items-center gap-3">
                                <span className="text-xs text-porcelain-inkbrown/70 w-28 flex-shrink-0" style={{ fontFamily: '"Noto Serif SC", serif' }}>{kiln}</span>
                                <div className="flex-1 h-2 bg-porcelain-crackle/30 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-porcelain-youlihong to-porcelain-gold rounded-full"
                                    style={{ width: `${(count / Math.max(...Object.values(museumCollection.byKiln))) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold text-porcelain-inkbrown/70 w-6 text-right">{count}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {foundArtifacts.filter(a => a.stage === 'collected').length === 0 ? (
                  <div className="rounded-2xl p-16 text-center bg-porcelain-scroll/20 border border-dashed border-porcelain-crackle/30">
                    <div className="w-24 h-24 rounded-full bg-porcelain-gold/10 flex items-center justify-center mx-auto mb-5">
                      <Archive size={40} className="text-porcelain-gold/60" />
                    </div>
                    <h5 className="font-serif text-xl font-bold text-porcelain-inkbrown/70 mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      博物馆尚未开馆
                    </h5>
                    <p className="text-sm text-porcelain-inkbrown/50 mb-6" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      完成考古发掘与文物鉴定后，国宝重器将在此陈列
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setView('sites')}
                        className="px-5 py-2.5 rounded-xl bg-porcelain-youlihong text-white text-sm font-bold hover:bg-porcelain-youlihong/90 transition-colors shadow-md"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        前往遗址发掘
                      </button>
                      <button
                        onClick={() => setView('inventory')}
                        className="px-5 py-2.5 rounded-xl border border-porcelain-crackle/40 text-porcelain-inkbrown/70 text-sm font-medium hover:bg-porcelain-scroll/50 transition-colors"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        整理已有文物
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {foundArtifacts
                      .filter(a => a.stage === 'collected')
                      .map(fa => {
                        const artifact = excavationArtifacts.find(a => a.id === fa.artifactId);
                        if (!artifact) return null;
                        const rc = rarityConfig[artifact.rarity];
                        return (
                          <button
                            key={fa.id}
                            onClick={() => handleViewArtifactDetail(fa)}
                            className="group relative rounded-xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-porcelain border border-porcelain-crackle/20"
                            style={{ backgroundColor: rc.bgColor }}
                          >
                            <div
                              className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"
                              style={{
                                background: `radial-gradient(circle at 30% 30%, ${artifact.color}40, ${artifact.color}80)`,
                                boxShadow: `0 4px 16px ${artifact.color}30, inset 0 2px 8px rgba(255,255,255,0.3)`,
                              }}
                            >
                              {artifact.type === 'shard' ? (
                                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="white" strokeWidth="1.8">
                                  <path d="M4 14 L8 4 L20 6 L18 18 L8 20 Z" />
                                </svg>
                              ) : (
                                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="white" strokeWidth="1.8">
                                  <path d="M8 4 L16 4 L14 8 Q19 12 17 17 Q16 21 12 21 Q8 21 7 17 Q5 12 10 8 Z" />
                                </svg>
                              )}
                            </div>
                            <span
                              className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold mb-1.5"
                              style={{ backgroundColor: 'white', color: rc.color }}
                            >
                              {rarityIcons[artifact.rarity]}
                              {rc.name}
                            </span>
                            <p className="font-serif text-xs font-bold text-porcelain-inkbrown line-clamp-2 leading-tight mb-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                              {artifact.name}
                            </p>
                            <p className="text-[10px] text-porcelain-inkbrown/50">{artifact.era} · {artifact.originKiln}</p>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessingPanel({
  found,
  categoryGuess,
  setCategoryGuess,
  identificationOptions,
  showIdentificationResult,
  lastIdentificationCorrect,
  onClean,
  onClassify,
  onIdentify,
  onCollect,
  onViewDetail,
}: {
  found: FoundArtifact;
  categoryGuess: ArtifactCategory | null;
  setCategoryGuess: (c: ArtifactCategory | null) => void;
  identificationOptions: ExcavationArtifact[];
  showIdentificationResult: boolean;
  lastIdentificationCorrect: boolean;
  onClean: (id: string) => void;
  onClassify: (id: string, cat: ArtifactCategory) => void;
  onIdentify: (id: string, artifactId: string) => void;
  onCollect: (id: string, note?: string) => void;
  onViewDetail: (f: FoundArtifact) => void;
}) {
  const artifact = excavationArtifacts.find(a => a.id === found.artifactId);
  if (!artifact) return null;
  const rc = rarityConfig[artifact.rarity];
  const cc = conditionConfig[found.condition];

  const stageOrder: ProcessingStage[] = ['raw', 'cleaned', 'classified', 'identified', 'collected'];
  const currentStep = stageOrder.indexOf(found.stage);

  return (
    <div className="bg-porcelain-paper rounded-2xl p-5 md:p-6 h-full border border-porcelain-crackle/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
            style={{ backgroundColor: rc.bgColor, color: rc.color }}
          >
            {rarityIcons[artifact.rarity]}
            {rc.name}
          </span>
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px]"
            style={{ backgroundColor: `${cc.color}15`, color: cc.color }}
          >
            品相：{cc.name}
          </span>
        </div>
        <button
          onClick={() => onViewDetail(found)}
          className="text-xs text-porcelain-ji-blue hover:underline flex items-center gap-0.5"
        >
          <BookOpen size={12} />
          参考资料
        </button>
      </div>

      <div className="flex items-center justify-between mb-6 relative">
        <div className="absolute left-6 right-6 top-5 h-0.5 bg-porcelain-crackle/30" />
        {stageOrder.slice(0, 4).map((stage, idx) => {
          const sl = stageLabels[stage];
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div key={stage} className="relative flex flex-col items-center z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isDone
                    ? 'bg-porcelain-celadon border-porcelain-celadon text-white'
                    : isCurrent
                    ? 'bg-porcelain-youlihong border-porcelain-youlihong text-white shadow-lg scale-110 animate-glow-pulse'
                    : 'bg-porcelain-paper border-porcelain-crackle/40 text-porcelain-inkbrown/30'
                }`}
              >
                {isDone ? <Check size={16} strokeWidth={2.5} /> : sl.icon}
              </div>
              <span
                className={`text-[10px] mt-1.5 font-medium ${
                  isDone || isCurrent ? 'text-porcelain-inkbrown/80' : 'text-porcelain-inkbrown/40'
                }`}
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                {sl.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <div className="md:col-span-2">
          <div
            className="aspect-square rounded-2xl flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: `${artifact.color}12` }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${artifact.color}40, transparent 60%)`,
              }}
            />
            <div className="relative text-center">
              <div
                className={`w-28 h-28 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl transition-all duration-500 ${
                  found.stage === 'raw' ? 'opacity-40 grayscale-[60%] blur-[1px]' : ''
                } ${found.stage === 'cleaned' || found.stage === 'classified' ? 'opacity-70' : ''}`}
                style={{
                  background: found.stage === 'raw'
                    ? `radial-gradient(circle at 30% 30%, #8B735580, #5E4A3A)`
                    : `radial-gradient(circle at 30% 30%, ${artifact.color}50, ${artifact.color}90)`,
                  boxShadow: found.stage !== 'raw'
                    ? `0 12px 40px ${artifact.color}40, inset 0 4px 16px rgba(255,255,255,0.3)`
                    : '0 4px 20px rgba(0,0,0,0.2)',
                }}
              >
                {artifact.type === 'shard' ? (
                  <svg viewBox="0 0 48 48" className="w-16 h-16" fill="none" stroke={found.stage === 'raw' ? '#3A2F24' : 'white'} strokeWidth="2">
                    <path d="M8 28 L16 8 L40 12 L36 40 L16 42 Z" />
                    <path d="M16 8 L28 24 L40 12" opacity={found.stage === 'raw' ? 0.3 : 0.5} />
                    <path d="M8 28 L24 30 L36 40" opacity={found.stage === 'raw' ? 0.3 : 0.5} />
                  </svg>
                ) : (
                  <svg viewBox="0 0 48 48" className="w-16 h-16" fill="none" stroke={found.stage === 'raw' ? '#3A2F24' : 'white'} strokeWidth="2">
                    <path d="M16 8 L32 8 L28 16 Q40 22 36 34 Q34 42 24 42 Q14 42 12 34 Q8 22 20 16 Z" />
                    <path d="M14 26 Q24 24 34 26" opacity={found.stage === 'raw' ? 0.3 : 0.5} />
                  </svg>
                )}
              </div>
              {found.stage === 'raw' && (
                <div className="space-y-1">
                  <p className="text-xs text-porcelain-inkbrown/60" style={{ fontFamily: '"Noto Serif SC", serif' }}>文物表面被泥土覆盖</p>
                  <p className="text-[10px] text-porcelain-inkbrown/40">需要先进行清理</p>
                </div>
              )}
              {found.stage === 'collected' && (
                <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-porcelain-celadon/20 text-porcelain-celadon text-xs font-bold">
                  <Check size={12} /> 已入藏
                </div>
              )}
            </div>
          </div>

          {found.stage === 'raw' && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-porcelain-inkbrown/60" style={{ fontFamily: '"Noto Serif SC", serif' }}>清理进度</span>
                <span className="text-xs font-bold text-porcelain-celadon">{found.cleanProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-porcelain-crackle/30 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-porcelain-celadon to-porcelain-ji-blue transition-all duration-500 rounded-full"
                  style={{ width: `${found.cleanProgress}%` }}
                />
              </div>
              <button
                onClick={() => onClean(found.id)}
                className="w-full py-2.5 rounded-xl bg-porcelain-celadon/15 text-porcelain-celadon text-sm font-bold hover:bg-porcelain-celadon/25 transition-colors flex items-center justify-center gap-1.5"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                <Droplets size={16} />
                {found.cleanProgress === 0 ? '开始清洗' : found.cleanProgress < 100 ? '继续清洗' : '清洗完成'}
              </button>
            </div>
          )}
        </div>

        <div className="md:col-span-3">
          <h5
            className="font-serif text-xl font-bold text-porcelain-inkbrown mb-1"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            {found.stage === 'raw' ? '???（未清理文物）' : artifact.name}
          </h5>
          <p className="text-xs text-porcelain-inkbrown/55 mb-4">
            {found.stage === 'raw'
              ? '出土遗址：' + (excavationSites.find(s => s.id === found.siteId)?.name || '未知')
              : `${artifact.era} · ${artifact.originKiln}`}
          </p>

          {found.stage === 'cleaned' && (
            <div className="animate-fade-in">
              <div className="mb-4 p-4 rounded-xl bg-porcelain-scroll/40 border border-porcelain-crackle/20">
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle size={14} className="text-porcelain-gold mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-porcelain-inkbrown/70 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    文物已清洗完毕，釉色与纹饰初步显现。请根据可见特征判断该文物的器型类别，这是鉴定的第一步。
                  </p>
                </div>
                {artifact.glazeColor && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] text-porcelain-inkbrown/55 w-16">可见釉色：</span>
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded"
                      style={{ backgroundColor: `${artifact.color}15`, color: artifact.color }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: artifact.color }} />
                      {artifact.glazeColor}
                    </span>
                  </div>
                )}
                {artifact.decoration && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-porcelain-inkbrown/55 w-16">可见纹饰：</span>
                    <span className="text-[11px] text-porcelain-inkbrown/75">{artifact.decoration}</span>
                  </div>
                )}
              </div>

              <h6 className="font-serif text-sm font-bold text-porcelain-inkbrown mb-3 flex items-center gap-1.5" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                <Layers size={14} />
                请选择器型类别
              </h6>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {(Object.keys(categoryLabels) as ArtifactCategory[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoryGuess(cat);
                      onClassify(found.id, cat);
                    }}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                      categoryGuess === cat
                        ? 'border-porcelain-youlihong bg-porcelain-youlihong/5'
                        : 'border-porcelain-crackle/30 hover:border-porcelain-gold/50 bg-porcelain-paper'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg mx-auto mb-1.5 flex items-center justify-center" style={{ backgroundColor: categoryGuess === cat ? '#A8323215' : '#F0EAD8' }}>
                      {cat === 'vase' && <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={categoryGuess === cat ? '#A83232' : '#8BA888'} strokeWidth="1.8"><path d="M8 4 L16 4 L14 8 Q19 12 17 17 Q16 21 12 21 Q8 21 7 17 Q5 12 10 8 Z" /></svg>}
                      {cat === 'bowl' && <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={categoryGuess === cat ? '#A83232' : '#8BA888'} strokeWidth="1.8"><path d="M4 10 Q4 18 12 18 Q20 18 20 10" /><path d="M3 10 L21 10" /></svg>}
                      {cat === 'plate' && <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={categoryGuess === cat ? '#A83232' : '#8BA888'} strokeWidth="1.8"><ellipse cx="12" cy="12" rx="8" ry="3" /><path d="M4 12 Q4 16 12 16 Q20 16 20 12" /></svg>}
                      {cat === 'jar' && <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={categoryGuess === cat ? '#A83232' : '#8BA888'} strokeWidth="1.8"><path d="M9 4 L15 4 L15 7 Q20 9 19 15 Q18 21 12 21 Q6 21 5 15 Q4 9 9 7 Z" /></svg>}
                      {cat === 'teapot' && <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={categoryGuess === cat ? '#A83232' : '#8BA888'} strokeWidth="1.8"><path d="M7 8 Q7 16 12 16 Q17 16 17 8" /><path d="M4 10 Q4 6 7 6" /><path d="M17 10 L21 8 L20 12" /><path d="M9 6 Q9 3 12 3 Q15 3 15 6" /></svg>}
                      {cat === 'cup' && <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={categoryGuess === cat ? '#A83232' : '#8BA888'} strokeWidth="1.8"><path d="M6 6 L18 6 L17 16 Q17 18 12 18 Q7 18 7 16 L6 6 Z" /><path d="M18 10 Q22 10 21 14 Q20 17 17 16" /></svg>}
                      {cat === 'other' && <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={categoryGuess === cat ? '#A83232' : '#8BA888'} strokeWidth="1.8"><rect x="4" y="6" width="16" height="12" rx="2" /><path d="M8 10 L16 10 M8 14 L14 14" /></svg>}
                    </div>
                    <p className="text-[11px] font-bold text-porcelain-inkbrown/80" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      {categoryLabels[cat]}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {found.stage === 'classified' && (
            <div className="animate-fade-in">
              <div className="mb-4 p-4 rounded-xl bg-porcelain-scroll/40 border border-porcelain-crackle/20">
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle size={14} className="text-porcelain-ji-blue mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-porcelain-inkbrown/70 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    请从下列器物中选出您认为匹配的文物。仔细比对釉色、纹饰、造型等鉴定要点，做出准确判断。
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-porcelain-inkbrown/55">您的分类：</span>
                  <span className="text-[11px] font-bold text-porcelain-youlihong">{found.categoryGuess ? categoryLabels[found.categoryGuess] : '—'}</span>
                  <span className="text-[11px] text-porcelain-inkbrown/40">（正确：{categoryLabels[artifact.category]}）</span>
                </div>
              </div>

              {showIdentificationResult ? (
                <div className={`rounded-xl p-6 text-center animate-fade-in ${lastIdentificationCorrect ? 'bg-porcelain-celadon/15 border border-porcelain-celadon/30' : 'bg-porcelain-youlihong/15 border border-porcelain-youlihong/30'}`}>
                  {lastIdentificationCorrect ? (
                    <>
                      <div className="w-14 h-14 rounded-full bg-porcelain-celadon/20 flex items-center justify-center mx-auto mb-3">
                        <Check size={28} className="text-porcelain-celadon" />
                      </div>
                      <h6 className="font-serif text-lg font-bold text-porcelain-celadon mb-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>鉴定成功！</h6>
                      <p className="text-xs text-porcelain-inkbrown/60">您准确识别了这件文物，可以进入博物馆收藏了</p>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-porcelain-youlihong/20 flex items-center justify-center mx-auto mb-3">
                        <X size={28} className="text-porcelain-youlihong" />
                      </div>
                      <h6 className="font-serif text-lg font-bold text-porcelain-youlihong mb-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>鉴定有误</h6>
                      <p className="text-xs text-porcelain-inkbrown/60">请仔细阅读参考资料，重新进行鉴定</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {identificationOptions.map(opt => {
                    const orc = rarityConfig[opt.rarity];
                    return (
                      <button
                        key={opt.id}
                        onClick={() => onIdentify(found.id, opt.id)}
                        className="text-left p-4 rounded-xl border-2 border-porcelain-crackle/30 hover:border-porcelain-gold/50 bg-porcelain-paper transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center shadow-inner"
                            style={{
                              background: `radial-gradient(circle at 30% 30%, ${opt.color}30, ${opt.color}60)`,
                            }}
                          >
                            {opt.type === 'shard' ? (
                              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="white" strokeWidth="1.8"><path d="M4 14 L8 4 L20 6 L18 18 L8 20 Z" /></svg>
                            ) : (
                              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="white" strokeWidth="1.8"><path d="M8 4 L16 4 L14 8 Q19 12 17 17 Q16 21 12 21 Q8 21 7 17 Q5 12 10 8 Z" /></svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: orc.bgColor, color: orc.color }}>
                                {rarityIcons[opt.rarity]}
                                {orc.name}
                              </span>
                              <span className="text-[10px] text-porcelain-inkbrown/50">{opt.era}</span>
                            </div>
                            <p className="font-serif text-sm font-bold text-porcelain-inkbrown line-clamp-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                              {opt.name}
                            </p>
                            <p className="text-[10px] text-porcelain-inkbrown/50 mt-0.5 line-clamp-1">{opt.glazeColor} · {opt.decoration || '素面'}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {found.stage === 'identified' && (
            <div className="animate-fade-in">
              <div className="mb-4 p-4 rounded-xl bg-porcelain-gold/10 border border-porcelain-gold/30">
                <div className="flex items-start gap-2 mb-3">
                  <Award size={16} className="text-porcelain-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <h6 className="font-serif text-base font-bold text-porcelain-inkbrown mb-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      {artifact.name}
                    </h6>
                    <p className="text-xs text-porcelain-inkbrown/65 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      {artifact.historicalContext}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-porcelain-paper">
                    <span className="text-[10px] text-porcelain-inkbrown/50">年代</span>
                    <p className="text-xs font-bold text-porcelain-inkbrown/80 mt-0.5">{artifact.era}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-porcelain-paper">
                    <span className="text-[10px] text-porcelain-inkbrown/50">窑口</span>
                    <p className="text-xs font-bold text-porcelain-inkbrown/80 mt-0.5">{artifact.originKiln}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-porcelain-paper">
                    <span className="text-[10px] text-porcelain-inkbrown/50">釉色</span>
                    <p className="text-xs font-bold mt-0.5" style={{ color: artifact.color }}>{artifact.glazeColor}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-porcelain-paper">
                    <span className="text-[10px] text-porcelain-inkbrown/50">品相</span>
                    <p className="text-xs font-bold mt-0.5" style={{ color: cc.color }}>{cc.name}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onCollect(found.id)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-porcelain-gold to-porcelain-gold/80 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                <Archive size={18} />
                加入私人博物馆收藏
              </button>
            </div>
          )}

          {found.stage === 'collected' && (
            <div className="animate-fade-in text-center py-6">
              <div className="w-20 h-20 rounded-full bg-porcelain-celadon/15 flex items-center justify-center mx-auto mb-4">
                <Archive size={36} className="text-porcelain-celadon" />
              </div>
              <h6 className="font-serif text-xl font-bold text-porcelain-celadon mb-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                已入藏私人博物馆
              </h6>
              <p className="text-xs text-porcelain-inkbrown/55 mb-5" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                入藏时间：{found.collectedAt ? new Date(found.collectedAt).toLocaleString('zh-CN') : '—'}
              </p>
              <p className="text-sm text-porcelain-inkbrown/65 leading-relaxed mb-5" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                "{artifact.referenceValue}"
              </p>
              <button
                onClick={() => onViewDetail(found)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-porcelain-ji-blue/10 text-porcelain-ji-blue text-sm font-bold hover:bg-porcelain-ji-blue/20 transition-colors"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                <BookOpen size={14} />
                查看完整档案
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
