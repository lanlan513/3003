import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Palette,
  Plus,
  Edit3,
  Eye,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ChevronRight,
  Search,
  Filter,
  X,
  Check,
  Save,
  GalleryHorizontalEnd,
  FileText,
  ListOrdered,
  Star,
  Crown,
  Gem,
  Trophy,
  Sparkles,
  MapPin,
  Clock,
  Info,
  BookOpen,
  Wand2,
  RefreshCw,
  AlertCircle,
  Grid3X3,
} from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import SealLabel from '@/components/common/SealLabel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  excavationArtifacts,
  rarityConfig,
} from '@/data/excavation';
import {
  exhibitionThemes,
  defaultCuratorNoteTemplates,
  generateCuratorNote,
  getThemeById,
  createNewExhibition,
  validateExhibition,
} from '@/data/curator';
import type {
  FoundArtifact,
  ExcavationArtifact,
  ArtifactRarity,
  Exhibition,
  ExhibitItem,
  CuratorViewMode,
  DetailData,
} from '@/types';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

const rarityIcons: Record<ArtifactRarity, JSX.Element> = {
  common: <Star size={12} />,
  uncommon: <Star size={12} />,
  rare: <Gem size={12} />,
  epic: <Trophy size={12} />,
  legendary: <Crown size={12} />,
};

const STORAGE_KEY = 'ciyuntang_curator_exhibitions';

export default function CuratorSection({ onOpenDetail }: Props) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);
  const [view, setView] = useState<CuratorViewMode>('drafts');
  const [currentExhibition, setCurrentExhibition] = useState<Exhibition | null>(null);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [foundArtifacts, setFoundArtifacts] = useState<FoundArtifact[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRarity, setFilterRarity] = useState<ArtifactRarity | 'all'>('all');
  const [filterEra, setFilterEra] = useState<string>('all');

  const [currentEditExhibitId, setCurrentEditExhibitId] = useState<string | null>(null);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showArtifactPicker, setShowArtifactPicker] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setExhibitions(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
    const savedArtifacts = localStorage.getItem('ciyuntang_excavation_artifacts');
    if (savedArtifacts) {
      try {
        const parsed = JSON.parse(savedArtifacts);
        if (Array.isArray(parsed)) {
          setFoundArtifacts(parsed.filter((a: FoundArtifact) => a.stage === 'collected'));
          return;
        }
      } catch {
        // ignore
      }
    }
    setFoundArtifacts((prev) => (prev.length === 0 ? generateMockCollection() : prev));
  }, []);

  useEffect(() => {
    if (exhibitions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exhibitions));
    }
  }, [exhibitions]);

  const collectedArtifacts = useMemo(
    () => foundArtifacts.filter((fa) => fa.stage === 'collected'),
    [foundArtifacts]
  );

  const eras = useMemo(() => {
    const set = new Set<string>();
    collectedArtifacts.forEach((fa) => {
      const art = excavationArtifacts.find((a) => a.id === fa.artifactId);
      if (art) set.add(art.era);
    });
    return Array.from(set);
  }, [collectedArtifacts]);

  const filteredCollection = useMemo(() => {
    return collectedArtifacts.filter((fa) => {
      const art = excavationArtifacts.find((a) => a.id === fa.artifactId);
      if (!art) return false;

      if (filterRarity !== 'all' && art.rarity !== filterRarity) return false;
      if (filterEra !== 'all' && art.era !== filterEra) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !art.name.toLowerCase().includes(q) &&
          !art.originKiln.toLowerCase().includes(q) &&
          !art.era.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [collectedArtifacts, filterRarity, filterEra, searchQuery]);

  const currentTheme = useMemo(
    () => (currentExhibition ? getThemeById(currentExhibition.themeId) : exhibitionThemes[0]),
    [currentExhibition]
  );

  const handleCreateNew = useCallback(() => {
    const newExh = createNewExhibition();
    setCurrentExhibition(newExh);
    setValidationErrors([]);
    setView('create');
  }, []);

  const handleEdit = useCallback((exh: Exhibition) => {
    setCurrentExhibition({ ...exh });
    setValidationErrors([]);
    setView('edit');
  }, []);

  const handleDelete = useCallback(
    (exhId: string) => {
      if (!confirm('确定要删除这个展览吗？此操作不可撤销。')) return;
      setExhibitions((prev) => prev.filter((e) => e.id !== exhId));
    },
    []
  );

  const handleSave = useCallback(() => {
    if (!currentExhibition) return;

    const { valid, errors } = validateExhibition(currentExhibition);
    if (!valid) {
      setValidationErrors(errors);
      return;
    }

    const updated = { ...currentExhibition, updatedAt: Date.now() };
    setExhibitions((prev) => {
      const exists = prev.some((e) => e.id === updated.id);
      return exists ? prev.map((e) => (e.id === updated.id ? updated : e)) : [...prev, updated];
    });
    setCurrentExhibition(updated);
    setView('preview');
  }, [currentExhibition]);

  const handlePreview = useCallback((exh: Exhibition) => {
    setCurrentExhibition(exh);
    setActivePreviewIndex(0);
    setView('gallery');
  }, []);

  const handleBack = useCallback(() => {
    setCurrentExhibition(null);
    setCurrentEditExhibitId(null);
    setView('drafts');
  }, []);

  const handleAddExhibit = useCallback(
    (foundArtifact: FoundArtifact) => {
      if (!currentExhibition) return;

      const alreadyExists = currentExhibition.exhibits.some(
        (e) => e.foundArtifactId === foundArtifact.id
      );
      if (alreadyExists) return;

      const art = excavationArtifacts.find((a) => a.id === foundArtifact.artifactId);
      if (!art) return;

      const template = defaultCuratorNoteTemplates[Math.floor(Math.random() * defaultCuratorNoteTemplates.length)];

      const newExhibit: ExhibitItem = {
        id: `exhibit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        foundArtifactId: foundArtifact.id,
        artifactId: foundArtifact.artifactId,
        order: currentExhibition.exhibits.length,
        curatorNote: generateCuratorNote(template, {
          name: art.name,
          era: art.era,
          originKiln: art.originKiln,
          decoration: art.decoration,
        }),
      };

      setCurrentExhibition((prev) =>
        prev ? { ...prev, exhibits: [...prev.exhibits, newExhibit] } : null
      );
      setShowArtifactPicker(false);
    },
    [currentExhibition]
  );

  const handleRemoveExhibit = useCallback(
    (exhibitId: string) => {
      if (!currentExhibition) return;
      const filtered = currentExhibition.exhibits
        .filter((e) => e.id !== exhibitId)
        .map((e, i) => ({ ...e, order: i }));
      setCurrentExhibition((prev) => (prev ? { ...prev, exhibits: filtered } : null));
      if (currentEditExhibitId === exhibitId) {
        setCurrentEditExhibitId(null);
      }
    },
    [currentExhibition, currentEditExhibitId]
  );

  const handleMoveExhibit = useCallback(
    (exhibitId: string, direction: 'up' | 'down') => {
      if (!currentExhibition) return;
      const exhibits = [...currentExhibition.exhibits];
      const idx = exhibits.findIndex((e) => e.id === exhibitId);
      if (idx === -1) return;
      if (direction === 'up' && idx === 0) return;
      if (direction === 'down' && idx === exhibits.length - 1) return;

      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      [exhibits[idx], exhibits[swapIdx]] = [exhibits[swapIdx], exhibits[idx]];
      const reordered = exhibits.map((e, i) => ({ ...e, order: i }));
      setCurrentExhibition((prev) => (prev ? { ...prev, exhibits: reordered } : null));
    },
    [currentExhibition]
  );

  const handleUpdateExhibitNote = useCallback(
    (exhibitId: string, note: string) => {
      if (!currentExhibition) return;
      setCurrentExhibition((prev) =>
        prev
          ? {
              ...prev,
              exhibits: prev.exhibits.map((e) =>
                e.id === exhibitId ? { ...e, curatorNote: note } : e
              ),
            }
          : null
      );
    },
    [currentExhibition]
  );

  const handleAutoGenerateNote = useCallback(
    (exhibit: ExhibitItem) => {
      const art = excavationArtifacts.find((a) => a.id === exhibit.artifactId);
      if (!art) return;
      const template =
        defaultCuratorNoteTemplates[
          Math.floor(Math.random() * defaultCuratorNoteTemplates.length)
        ];
      const note = generateCuratorNote(template, {
        name: art.name,
        era: art.era,
        originKiln: art.originKiln,
        decoration: art.decoration,
      });
      handleUpdateExhibitNote(exhibit.id, note);
    },
    [handleUpdateExhibitNote]
  );

  const getArtifact = (artifactId: string) =>
    excavationArtifacts.find((a) => a.id === artifactId);

  const ArtifactCard = ({
    found,
    onClick,
    isSelected = false,
    showAdd = false,
  }: {
    found: FoundArtifact;
    onClick?: () => void;
    isSelected?: boolean;
    showAdd?: boolean;
  }) => {
    const artifact = getArtifact(found.artifactId);
    if (!artifact) return null;
    const rc = rarityConfig[artifact.rarity];

    return (
      <div
        onClick={onClick}
        className={`relative rounded-xl p-3 border-2 transition-all duration-300 cursor-pointer group ${
          isSelected
            ? 'border-porcelain-gold shadow-lg scale-[1.02]'
            : 'border-porcelain-crackle/30 hover:border-porcelain-gold/50 hover:-translate-y-0.5'
        }`}
        style={{ backgroundColor: `${rc.bgColor}90` }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center shadow-inner"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${artifact.color}40, ${artifact.color}90)`,
            }}
          >
            {artifact.type === 'shard' ? (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="white" strokeWidth="1.8">
                <path d="M4 14 L8 4 L20 6 L18 18 L8 20 Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="white" strokeWidth="1.8">
                <path d="M8 4 L16 4 L14 8 Q19 12 17 17 Q16 21 12 21 Q8 21 7 17 Q5 12 10 8 Z" />
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
            </div>
            <p
              className="font-serif text-xs font-bold text-porcelain-inkbrown line-clamp-1"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              {artifact.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-porcelain-inkbrown/50">
                {artifact.era} · {artifact.originKiln}
              </span>
            </div>
          </div>
          {showAdd && (
            <div className="flex-shrink-0 self-center">
              <Plus
                size={18}
                className={`transition-colors ${
                  isSelected ? 'text-porcelain-gold' : 'text-porcelain-inkbrown/30 group-hover:text-porcelain-gold'
                }`}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const sortedExhibits = useMemo(
    () => (currentExhibition ? [...currentExhibition.exhibits].sort((a, b) => a.order - b.order) : []),
    [currentExhibition]
  );

  const renderThemeIcon = (iconId: string, color: string, size = 18) => {
    const icons: Record<string, JSX.Element> = {
      moon: (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
      waves: (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        </svg>
      ),
      crown: (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 19h20M3 7l4 5 5-8 5 8 4-5v10H3V7z" />
        </svg>
      ),
      flower: (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
      dig: (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2l8 8-9 9-4 1-6-1 1-4 9-9zM3 22h18" />
        </svg>
      ),
      frame: (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16v16H4z" />
          <path d="M9 9h6v6H9z" />
        </svg>
      ),
    };
    return icons[iconId] || icons.frame;
  };

  const handleViewArtifactDetail = useCallback(
    (artifact: ExcavationArtifact) => {
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
    },
    [onOpenDetail]
  );

  const handleViewExhibitionDetail = useCallback(
    (exh: Exhibition) => {
      const theme = getThemeById(exh.themeId);
      const exhibitDescriptions = exh.exhibits
        .sort((a, b) => a.order - b.order)
        .map((ex) => {
          const art = getArtifact(ex.artifactId);
          if (!art) return '';
          return `【展品 ${ex.order + 1}】${art.name}（${art.era}·${art.originKiln}）\n${ex.curatorNote}`;
        })
        .filter(Boolean);

      onOpenDetail({
        type: 'exhibition',
        id: exh.id,
        title: exh.title,
        subtitle: exh.subtitle || `策展人：${exh.curatorName}`,
        description: exh.description,
        sections: [
          { title: '策展人', content: [exh.curatorName] },
          { title: '展览主题', content: [theme.name + '：' + theme.description] },
          { title: '展品导览', content: exhibitDescriptions },
          { title: '展品数量', content: [`共 ${exh.exhibits.length} 件藏品`] },
        ],
        color: theme.color,
        bgColor: `${theme.color}10`,
        imagePrompt: exh.exhibits.length > 0
          ? (getArtifact(exh.exhibits[0].artifactId)?.imagePrompt || 'ceramic exhibition')
          : 'ceramic exhibition',
      });
    },
    [onOpenDetail]
  );

  return (
    <section
      id="curator"
      className={`section-padding bg-gradient-to-b from-porcelain-scroll/30 to-porcelain-paper relative overflow-hidden`}
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-porcelain-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-porcelain-ji-blue/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-8 relative">
        <SectionTitle
          tag="CURATOR · 玖"
          title="策展工坊"
          subtitle='"罗千年珍瓷于一室，汇万载匠心于一观"。化身策展人，从私人藏品中遴选珍品，设计专题展览，讲述你的陶瓷故事'
        />

        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <div className="bg-porcelain-paper/80 rounded-2xl p-5 md:p-8 shadow-porcelain border border-porcelain-crackle/40 backdrop-blur-sm">
            <div className="flex items-start gap-3 mb-6 flex-wrap">
              <SealLabel text="策" size="md" />
              <div className="flex-1">
                <h3
                  className="font-serif text-xl md:text-2xl font-bold text-porcelain-inkbrown mb-1"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  虚拟策展人工坊
                </h3>
                <p
                  className="text-sm text-porcelain-inkbrown/65 leading-relaxed max-w-3xl"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  从您的私人藏品库中精选珍品，设置展厅主题，编排展品顺序，撰写导览讲解，策划一场属于您的陶瓷文化专题展览。
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-center px-3 py-1.5 rounded-lg bg-porcelain-gold/10">
                  <p className="text-lg font-bold text-porcelain-gold">{collectedArtifacts.length}</p>
                  <p className="text-[10px] text-porcelain-inkbrown/50">可用藏品</p>
                </div>
                <div className="text-center px-3 py-1.5 rounded-lg bg-porcelain-ji-blue/10">
                  <p className="text-lg font-bold text-porcelain-ji-blue">{exhibitions.length}</p>
                  <p className="text-[10px] text-porcelain-inkbrown/50">已办展览</p>
                </div>
              </div>
            </div>

            {(view === 'create' || view === 'edit') && currentExhibition ? (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-porcelain-crackle/20">
                  <button
                    onClick={handleBack}
                    className="text-xs text-porcelain-inkbrown/55 hover:text-porcelain-youlihong transition-colors flex items-center gap-1"
                  >
                    <ArrowLeft size={14} />
                    返回展览列表
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentExhibition(currentExhibition);
                        setView('preview');
                      }}
                      className="px-3 py-2 rounded-lg border border-porcelain-crackle/40 text-xs text-porcelain-inkbrown/70 hover:bg-porcelain-scroll/50 transition-colors flex items-center gap-1.5"
                    >
                      <Eye size={14} />
                      预览
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 rounded-lg bg-porcelain-youlihong text-white text-xs font-bold hover:bg-porcelain-youlihong/90 transition-colors shadow-md flex items-center gap-1.5"
                    >
                      <Save size={14} />
                      保存展览
                    </button>
                  </div>
                </div>

                {validationErrors.length > 0 && (
                  <div className="mb-5 p-4 rounded-xl bg-porcelain-youlihong/10 border border-porcelain-youlihong/30">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={16} className="text-porcelain-youlihong" />
                      <span className="text-sm font-bold text-porcelain-youlihong">请完善以下信息</span>
                    </div>
                    <ul className="space-y-1 ml-7">
                      {validationErrors.map((err, i) => (
                        <li key={i} className="text-xs text-porcelain-inkbrown/70 list-disc">
                          {err}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-2 space-y-5">
                    <div>
                      <h4
                        className="font-serif text-base font-bold text-porcelain-inkbrown mb-3 flex items-center gap-2"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        <FileText size={16} className="text-porcelain-youlihong" />
                        展览基本信息
                      </h4>
                      <div className="space-y-3 bg-porcelain-scroll/30 rounded-xl p-4">
                        <div>
                          <label className="text-[11px] text-porcelain-inkbrown/60 mb-1 block">
                            展览标题 *
                          </label>
                          <input
                            type="text"
                            placeholder="例如：千年瓷韵·宋代青瓷特展"
                            value={currentExhibition.title}
                            onChange={(e) =>
                              setCurrentExhibition((prev) =>
                                prev ? { ...prev, title: e.target.value } : null
                              )
                            }
                            className="w-full px-3 py-2 rounded-lg border border-porcelain-crackle/30 bg-white text-sm focus:outline-none focus:border-porcelain-gold/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-porcelain-inkbrown/60 mb-1 block">
                            展览副标题
                          </label>
                          <input
                            type="text"
                            placeholder="例如：雨过天青云破处"
                            value={currentExhibition.subtitle}
                            onChange={(e) =>
                              setCurrentExhibition((prev) =>
                                prev ? { ...prev, subtitle: e.target.value } : null
                              )
                            }
                            className="w-full px-3 py-2 rounded-lg border border-porcelain-crackle/30 bg-white text-sm focus:outline-none focus:border-porcelain-gold/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-porcelain-inkbrown/60 mb-1 block">
                            策展人 *
                          </label>
                          <input
                            type="text"
                            placeholder="请输入您的名字"
                            value={currentExhibition.curatorName}
                            onChange={(e) =>
                              setCurrentExhibition((prev) =>
                                prev ? { ...prev, curatorName: e.target.value } : null
                              )
                            }
                            className="w-full px-3 py-2 rounded-lg border border-porcelain-crackle/30 bg-white text-sm focus:outline-none focus:border-porcelain-gold/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-porcelain-inkbrown/60 mb-1 block">
                            展览前言
                          </label>
                          <textarea
                            rows={4}
                            placeholder="为您的展览撰写一段动人的前言，讲述策展理念与故事..."
                            value={currentExhibition.description}
                            onChange={(e) =>
                              setCurrentExhibition((prev) =>
                                prev ? { ...prev, description: e.target.value } : null
                              )
                            }
                            className="w-full px-3 py-2 rounded-lg border border-porcelain-crackle/30 bg-white text-sm focus:outline-none focus:border-porcelain-gold/50 transition-colors resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4
                        className="font-serif text-base font-bold text-porcelain-inkbrown mb-3 flex items-center gap-2"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        <Palette size={16} className="text-porcelain-youlihong" />
                        选择展厅主题
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {exhibitionThemes.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() =>
                              setCurrentExhibition((prev) =>
                                prev ? { ...prev, themeId: theme.id } : null
                              )
                            }
                            className={`relative text-left p-3 rounded-xl border-2 transition-all duration-300 ${
                              currentExhibition.themeId === theme.id
                                ? 'border-current shadow-md scale-[1.02]'
                                : 'border-porcelain-crackle/30 hover:border-porcelain-gold/50'
                            }`}
                            style={{
                              borderColor: currentExhibition.themeId === theme.id ? theme.color : undefined,
                              backgroundColor: `${theme.color}08`,
                            }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${theme.color}20` }}
                              >
                                {renderThemeIcon(theme.icon, theme.color, 16)}
                              </div>
                              <span
                                className="font-serif text-sm font-bold"
                                style={{ fontFamily: '"Noto Serif SC", serif', color: theme.color }}
                              >
                                {theme.name}
                              </span>
                            </div>
                            <p className="text-[10px] text-porcelain-inkbrown/55 line-clamp-2 leading-relaxed">
                              {theme.description}
                            </p>
                            {currentExhibition.themeId === theme.id && (
                              <div
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: theme.color }}
                              >
                                <Check size={12} className="text-white" strokeWidth={2.5} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-3">
                      <h4
                        className="font-serif text-base font-bold text-porcelain-inkbrown flex items-center gap-2"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        <ListOrdered size={16} className="text-porcelain-youlihong" />
                        展品编排
                        <span className="text-xs text-porcelain-inkbrown/50 font-normal ml-2">
                          {currentExhibition.exhibits.length} 件展品
                        </span>
                      </h4>
                      <button
                        onClick={() => setShowArtifactPicker(true)}
                        disabled={collectedArtifacts.length === 0}
                        className="px-3 py-2 rounded-lg bg-porcelain-celadon/15 text-porcelain-celadon text-xs font-bold hover:bg-porcelain-celadon/25 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={14} />
                        添加展品
                      </button>
                    </div>

                    {sortedExhibits.length === 0 ? (
                      <div className="rounded-2xl border-2 border-dashed border-porcelain-crackle/30 p-10 text-center">
                        <div className="w-16 h-16 rounded-full bg-porcelain-crackle/15 flex items-center justify-center mx-auto mb-4">
                          <Grid3X3 size={28} className="text-porcelain-inkbrown/30" />
                        </div>
                        <p
                          className="font-serif text-sm text-porcelain-inkbrown/50 mb-2"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          展览尚未挑选展品
                        </p>
                        <p className="text-xs text-porcelain-inkbrown/40 mb-4">
                          从您的藏品库中精选陶瓷珍品，开始策划您的专题展览
                        </p>
                        <button
                          onClick={() => setShowArtifactPicker(true)}
                          disabled={collectedArtifacts.length === 0}
                          className="px-5 py-2.5 rounded-xl bg-porcelain-youlihong text-white text-sm font-bold hover:bg-porcelain-youlihong/90 transition-colors shadow-md flex items-center gap-2 mx-auto disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                          {collectedArtifacts.length === 0 ? '暂无可用藏品' : '开始挑选展品'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                        {sortedExhibits.map((exhibit, idx) => {
                          const artifact = getArtifact(exhibit.artifactId);
                          if (!artifact) return null;
                          const rc = rarityConfig[artifact.rarity];
                          const isEditing = currentEditExhibitId === exhibit.id;

                          return (
                            <div
                              key={exhibit.id}
                              className={`rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                                isEditing
                                  ? 'border-porcelain-gold shadow-lg'
                                  : 'border-porcelain-crackle/30'
                              }`}
                            >
                              <div className="p-4 bg-white">
                                <div className="flex items-start gap-3">
                                  <div
                                    className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center shadow-inner"
                                    style={{
                                      background: `radial-gradient(circle at 30% 30%, ${artifact.color}40, ${artifact.color}90)`,
                                    }}
                                  >
                                    {artifact.type === 'shard' ? (
                                      <svg
                                        viewBox="0 0 24 24"
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="1.8"
                                      >
                                        <path d="M4 14 L8 4 L20 6 L18 18 L8 20 Z" />
                                      </svg>
                                    ) : (
                                      <svg
                                        viewBox="0 0 24 24"
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="1.8"
                                      >
                                        <path d="M8 4 L16 4 L14 8 Q19 12 17 17 Q16 21 12 21 Q8 21 7 17 Q5 12 10 8 Z" />
                                      </svg>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span
                                          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0"
                                          style={{
                                            backgroundColor: currentTheme.color + '20',
                                            color: currentTheme.color,
                                          }}
                                        >
                                          {idx + 1}
                                        </span>
                                        <p
                                          className="font-serif text-sm font-bold text-porcelain-inkbrown line-clamp-1"
                                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                                        >
                                          {artifact.name}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-1 flex-shrink-0">
                                        <span
                                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold"
                                          style={{ backgroundColor: rc.bgColor, color: rc.color }}
                                        >
                                          {rarityIcons[artifact.rarity]}
                                          {rc.name}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-[11px] text-porcelain-inkbrown/55 mb-2">
                                      <span className="flex items-center gap-0.5">
                                        <Clock size={10} />
                                        {artifact.era}
                                      </span>
                                      <span className="flex items-center gap-0.5">
                                        <MapPin size={10} />
                                        {artifact.originKiln}
                                      </span>
                                    </div>

                                    {isEditing ? (
                                      <div className="space-y-2 mt-3 animate-fade-in">
                                        <div className="flex items-center justify-between">
                                          <label className="text-[10px] font-bold text-porcelain-inkbrown/70 flex items-center gap-1">
                                            <Edit3 size={11} />
                                            策展人讲解词
                                          </label>
                                          <button
                                            onClick={() => handleAutoGenerateNote(exhibit)}
                                            className="text-[10px] text-porcelain-gold hover:underline flex items-center gap-0.5"
                                          >
                                            <Wand2 size={11} />
                                            AI 润色
                                          </button>
                                        </div>
                                        <textarea
                                          rows={3}
                                          value={exhibit.curatorNote}
                                          onChange={(e) =>
                                            handleUpdateExhibitNote(exhibit.id, e.target.value)
                                          }
                                          className="w-full px-3 py-2 rounded-lg border border-porcelain-crackle/30 bg-porcelain-scroll/20 text-xs focus:outline-none focus:border-porcelain-gold/50 transition-colors resize-none"
                                          placeholder="为这件展品撰写一段导览讲解..."
                                        />
                                        <div className="flex justify-end gap-2">
                                          <button
                                            onClick={() => setCurrentEditExhibitId(null)}
                                            className="px-3 py-1.5 rounded-lg bg-porcelain-gold/15 text-porcelain-gold text-[11px] font-bold hover:bg-porcelain-gold/25 transition-colors flex items-center gap-1"
                                          >
                                            <Check size={12} />
                                            完成
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        onClick={() => setCurrentEditExhibitId(exhibit.id)}
                                        className="mt-2 p-2.5 rounded-lg bg-porcelain-scroll/40 hover:bg-porcelain-scroll/60 transition-colors cursor-pointer group"
                                      >
                                        <p className="text-[11px] text-porcelain-inkbrown/70 leading-relaxed line-clamp-2">
                                          {exhibit.curatorNote || '点击添加策展人讲解词...'}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-porcelain-crackle/15">
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleMoveExhibit(exhibit.id, 'up')}
                                      disabled={idx === 0}
                                      className="w-8 h-8 rounded-lg bg-porcelain-scroll/50 text-porcelain-inkbrown/60 hover:bg-porcelain-ji-blue/15 hover:text-porcelain-ji-blue transition-colors disabled:opacity-30 disabled:hover:bg-porcelain-scroll/50 disabled:hover:text-porcelain-inkbrown/60 flex items-center justify-center"
                                      title="上移"
                                    >
                                      <ArrowUp size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleMoveExhibit(exhibit.id, 'down')}
                                      disabled={idx === sortedExhibits.length - 1}
                                      className="w-8 h-8 rounded-lg bg-porcelain-scroll/50 text-porcelain-inkbrown/60 hover:bg-porcelain-ji-blue/15 hover:text-porcelain-ji-blue transition-colors disabled:opacity-30 disabled:hover:bg-porcelain-scroll/50 disabled:hover:text-porcelain-inkbrown/60 flex items-center justify-center"
                                      title="下移"
                                    >
                                      <ArrowDown size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleViewArtifactDetail(artifact)}
                                      className="w-8 h-8 rounded-lg bg-porcelain-scroll/50 text-porcelain-inkbrown/60 hover:bg-porcelain-gold/15 hover:text-porcelain-gold transition-colors flex items-center justify-center ml-1"
                                      title="查看文物详情"
                                    >
                                      <BookOpen size={14} />
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveExhibit(exhibit.id)}
                                    className="w-8 h-8 rounded-lg bg-porcelain-scroll/50 text-porcelain-inkbrown/60 hover:bg-porcelain-youlihong/15 hover:text-porcelain-youlihong transition-colors flex items-center justify-center"
                                    title="移除此展品"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : view === 'preview' && currentExhibition ? (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-porcelain-crackle/20">
                  <button
                    onClick={() => setView(currentExhibition.title ? 'edit' : 'create')}
                    className="text-xs text-porcelain-inkbrown/55 hover:text-porcelain-youlihong transition-colors flex items-center gap-1"
                  >
                    <ArrowLeft size={14} />
                    返回编辑
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setView(currentExhibition.title ? 'edit' : 'create')}
                      className="px-3 py-2 rounded-lg border border-porcelain-crackle/40 text-xs text-porcelain-inkbrown/70 hover:bg-porcelain-scroll/50 transition-colors flex items-center gap-1.5"
                    >
                      <Edit3 size={14} />
                      继续编辑
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 rounded-lg bg-porcelain-celadon text-white text-xs font-bold hover:bg-porcelain-celadon/90 transition-colors shadow-md flex items-center gap-1.5"
                    >
                      <Save size={14} />
                      确认发布
                    </button>
                  </div>
                </div>

                <div
                  className={`rounded-2xl overflow-hidden bg-gradient-to-br ${currentTheme.bgGradient} shadow-porcelain`}
                >
                  <div
                    className="p-8 md:p-12 border-b"
                    style={{ borderColor: currentTheme.color + '20' }}
                  >
                    <div className="max-w-3xl mx-auto text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5" style={{ backgroundColor: currentTheme.color + '15' }}>
                        {renderThemeIcon(currentTheme.icon, currentTheme.color, 16)}
                        <span
                          className="text-xs font-bold"
                          style={{ color: currentTheme.color }}
                        >
                          {currentTheme.name}
                        </span>
                      </div>
                      <h2
                        className="font-serif text-3xl md:text-4xl font-bold text-porcelain-inkbrown mb-3"
                        style={{ fontFamily: '"Noto Serif SC", serif', color: currentTheme.color }}
                      >
                        {currentExhibition.title || '（未命名展览）'}
                      </h2>
                      {currentExhibition.subtitle && (
                        <p
                          className="font-serif text-lg text-porcelain-inkbrown/70 mb-5"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          「{currentExhibition.subtitle}」
                        </p>
                      )}
                      {currentExhibition.description && (
                        <p
                          className="text-sm text-porcelain-inkbrown/65 leading-loose"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          {currentExhibition.description}
                        </p>
                      )}
                      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-porcelain-inkbrown/55">
                        <span>策展人：{currentExhibition.curatorName || '（未署名）'}</span>
                        <span>·</span>
                        <span>展品 {currentExhibition.exhibits.length} 件</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-10">
                    {sortedExhibits.length === 0 ? (
                      <div className="text-center py-12 text-porcelain-inkbrown/50">
                        暂无展品，请先添加
                      </div>
                    ) : (
                      <div className="space-y-6 max-w-4xl mx-auto">
                        {sortedExhibits.map((exhibit, idx) => {
                          const artifact = getArtifact(exhibit.artifactId);
                          if (!artifact) return null;
                          const rc = rarityConfig[artifact.rarity];

                          return (
                            <div
                              key={exhibit.id}
                              className="grid grid-cols-1 md:grid-cols-5 gap-5 p-5 rounded-xl bg-white/70 border"
                              style={{ borderColor: currentTheme.color + '20' }}
                            >
                              <div className="md:col-span-1">
                                <div
                                  className="aspect-square rounded-xl flex items-center justify-center shadow-inner mx-auto"
                                  style={{
                                    background: `radial-gradient(circle at 30% 30%, ${artifact.color}30, ${artifact.color}80)`,
                                    maxWidth: '140px',
                                  }}
                                >
                                  {artifact.type === 'shard' ? (
                                    <svg
                                      viewBox="0 0 24 24"
                                      className="w-16 h-16"
                                      fill="none"
                                      stroke="white"
                                      strokeWidth="1.5"
                                    >
                                      <path d="M4 14 L8 4 L20 6 L18 18 L8 20 Z" />
                                    </svg>
                                  ) : (
                                    <svg
                                      viewBox="0 0 24 24"
                                      className="w-16 h-16"
                                      fill="none"
                                      stroke="white"
                                      strokeWidth="1.5"
                                    >
                                      <path d="M8 4 L16 4 L14 8 Q19 12 17 17 Q16 21 12 21 Q8 21 7 17 Q5 12 10 8 Z" />
                                    </svg>
                                  )}
                                </div>
                                <div className="text-center mt-3">
                                  <span
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                                    style={{ backgroundColor: rc.bgColor, color: rc.color }}
                                  >
                                    {rarityIcons[artifact.rarity]}
                                    {rc.name}
                                  </span>
                                </div>
                              </div>
                              <div className="md:col-span-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span
                                    className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold"
                                    style={{
                                      backgroundColor: currentTheme.color + '20',
                                      color: currentTheme.color,
                                    }}
                                  >
                                    {idx + 1}
                                  </span>
                                  <h3
                                    className="font-serif text-xl font-bold text-porcelain-inkbrown"
                                    style={{ fontFamily: '"Noto Serif SC", serif' }}
                                  >
                                    {artifact.name}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-porcelain-inkbrown/55 mb-3">
                                  <span className="flex items-center gap-0.5">
                                    <Clock size={12} />
                                    {artifact.era}
                                  </span>
                                  <span className="flex items-center gap-0.5">
                                    <MapPin size={12} />
                                    {artifact.originKiln}
                                  </span>
                                  <span className="flex items-center gap-0.5">
                                    <Info size={12} />
                                    {artifact.category === 'vase'
                                      ? '瓶'
                                      : artifact.category === 'bowl'
                                      ? '洗'
                                      : artifact.category === 'jar'
                                      ? '罐'
                                      : artifact.category === 'plate'
                                      ? '盘'
                                      : artifact.category === 'teapot'
                                      ? '壶'
                                      : artifact.category === 'cup'
                                      ? '杯'
                                      : '其他'}
                                  </span>
                                </div>
                                <div
                                  className="p-4 rounded-lg"
                                  style={{ backgroundColor: currentTheme.color + '08' }}
                                >
                                  <p
                                    className="text-xs font-bold mb-1.5 flex items-center gap-1"
                                    style={{ color: currentTheme.color }}
                                  >
                                    <Wand2 size={12} />
                                    策展人导览
                                  </p>
                                  <p
                                    className="text-sm text-porcelain-inkbrown/70 leading-relaxed"
                                    style={{ fontFamily: '"Noto Serif SC", serif' }}
                                  >
                                    {exhibit.curatorNote || '（暂无讲解词）'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : view === 'gallery' && currentExhibition ? (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-porcelain-crackle/20">
                  <button
                    onClick={handleBack}
                    className="text-xs text-porcelain-inkbrown/55 hover:text-porcelain-youlihong transition-colors flex items-center gap-1"
                  >
                    <ArrowLeft size={14} />
                    返回展览长廊
                  </button>
                  <button
                    onClick={() => handleViewExhibitionDetail(currentExhibition)}
                    className="px-3 py-2 rounded-lg border border-porcelain-crackle/40 text-xs text-porcelain-inkbrown/70 hover:bg-porcelain-scroll/50 transition-colors flex items-center gap-1.5"
                  >
                    <Info size={14} />
                    展览信息
                  </button>
                </div>

                <div
                  className={`rounded-2xl overflow-hidden bg-gradient-to-br ${currentTheme.bgGradient} shadow-porcelain min-h-[500px]`}
                >
                  <div className="p-6 md:p-8 border-b" style={{ borderColor: currentTheme.color + '20' }}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ backgroundColor: currentTheme.color + '15' }}>
                          {renderThemeIcon(currentTheme.icon, currentTheme.color, 14)}
                          <span
                            className="text-[11px] font-bold"
                            style={{ color: currentTheme.color }}
                          >
                            {currentTheme.name}
                          </span>
                        </div>
                        <h2
                          className="font-serif text-2xl md:text-3xl font-bold mb-1"
                          style={{ fontFamily: '"Noto Serif SC", serif', color: currentTheme.color }}
                        >
                          {currentExhibition.title}
                        </h2>
                        {currentExhibition.subtitle && (
                          <p
                            className="font-serif text-sm text-porcelain-inkbrown/65"
                            style={{ fontFamily: '"Noto Serif SC", serif' }}
                          >
                            「{currentExhibition.subtitle}」
                          </p>
                        )}
                      </div>
                      <div className="text-right text-xs text-porcelain-inkbrown/55">
                        <p>策展人：{currentExhibition.curatorName}</p>
                        <p>展品 {currentExhibition.exhibits.length} 件</p>
                      </div>
                    </div>
                  </div>

                  {sortedExhibits.length > 0 && activePreviewIndex < sortedExhibits.length && (
                    <>
                      {(() => {
                        const exhibit = sortedExhibits[activePreviewIndex];
                        const artifact = getArtifact(exhibit.artifactId);
                        if (!artifact) return null;
                        const rc = rarityConfig[artifact.rarity];

                        return (
                          <div className="p-6 md:p-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
                              <div
                                className="aspect-square rounded-2xl flex items-center justify-center shadow-xl mx-auto w-full max-w-[360px] relative overflow-hidden"
                                style={{
                                  background: `radial-gradient(circle at 30% 20%, ${artifact.color}20, ${artifact.color}60 60%, ${artifact.color}90)`,
                                }}
                              >
                                <div className="absolute inset-0 opacity-20">
                                  <div className="absolute top-6 left-6 w-20 h-20 rounded-full bg-white blur-2xl" />
                                </div>
                                <div className="relative z-10">
                                  {artifact.type === 'shard' ? (
                                    <svg
                                      viewBox="0 0 120 120"
                                      className="w-44 h-44"
                                      fill="none"
                                      stroke="white"
                                      strokeWidth="2.2"
                                    >
                                      <path d="M20 70 L40 20 L100 30 L90 90 L40 100 Z" />
                                      <path d="M40 20 L70 60 L100 30" opacity="0.3" />
                                    </svg>
                                  ) : (
                                    <svg
                                      viewBox="0 0 120 120"
                                      className="w-44 h-44"
                                      fill="none"
                                      stroke="white"
                                      strokeWidth="2"
                                    >
                                      <path d="M40 20 L80 20 L70 40 Q95 60 85 85 Q80 105 60 105 Q40 105 35 85 Q25 60 50 40 Z" />
                                      <path d="M35 65 Q60 60 85 65" opacity="0.35" />
                                      <path d="M40 80 Q60 77 80 80" opacity="0.25" />
                                    </svg>
                                  )}
                                </div>
                                <div
                                  className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1"
                                  style={{ backgroundColor: rc.bgColor + 'cc', color: rc.color }}
                                >
                                  {rarityIcons[artifact.rarity]}
                                  {rc.name}
                                </div>
                                <div
                                  className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                                  style={{
                                    backgroundColor: currentTheme.color,
                                    color: 'white',
                                  }}
                                >
                                  {activePreviewIndex + 1}/{sortedExhibits.length}
                                </div>
                              </div>

                              <div>
                                <p
                                  className="text-xs font-bold mb-2"
                                  style={{ color: currentTheme.color }}
                                >
                                  展品 {String(activePreviewIndex + 1).padStart(2, '0')}
                                </p>
                                <h3
                                  className="font-serif text-2xl md:text-3xl font-bold text-porcelain-inkbrown mb-3"
                                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                                >
                                  {artifact.name}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-porcelain-inkbrown/60 mb-5 pb-5 border-b border-porcelain-crackle/20">
                                  <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {artifact.era}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin size={12} />
                                    {artifact.originKiln}
                                  </span>
                                  <span>{artifact.material}</span>
                                  {artifact.glazeColor && <span>釉色：{artifact.glazeColor}</span>}
                                </div>

                                <div
                                  className="p-5 rounded-xl mb-5"
                                  style={{ backgroundColor: currentTheme.color + '08' }}
                                >
                                  <p
                                    className="text-xs font-bold mb-2 flex items-center gap-1.5"
                                    style={{ color: currentTheme.color }}
                                  >
                                    <Wand2 size={13} />
                                    策展人导览
                                  </p>
                                  <p
                                    className="text-sm md:text-base text-porcelain-inkbrown/75 leading-loose"
                                    style={{ fontFamily: '"Noto Serif SC", serif' }}
                                  >
                                    {exhibit.curatorNote || '（暂无讲解词）'}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={() =>
                                      setActivePreviewIndex((i) => Math.max(0, i - 1))
                                    }
                                    disabled={activePreviewIndex === 0}
                                    className="px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    style={{
                                      borderColor: currentTheme.color + '30',
                                      color: currentTheme.color,
                                    }}
                                  >
                                    <ArrowLeft size={14} />
                                    上一件
                                  </button>
                                  <button
                                    onClick={() => handleViewArtifactDetail(artifact)}
                                    className="text-xs text-porcelain-inkbrown/50 hover:text-porcelain-inkbrown/70 transition-colors flex items-center gap-1"
                                  >
                                    <BookOpen size={13} />
                                    查看文物档案
                                  </button>
                                  <button
                                    onClick={() =>
                                      setActivePreviewIndex((i) =>
                                        Math.min(sortedExhibits.length - 1, i + 1)
                                      )
                                    }
                                    disabled={activePreviewIndex === sortedExhibits.length - 1}
                                    className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
                                    style={{ backgroundColor: currentTheme.color }}
                                  >
                                    下一件
                                    <ChevronRight size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-center gap-1.5 mt-8">
                              {sortedExhibits.map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setActivePreviewIndex(i)}
                                  className={`transition-all duration-300 ${
                                    i === activePreviewIndex
                                      ? 'w-8 h-2 rounded-full'
                                      : 'w-2 h-2 rounded-full hover:scale-125'
                                  }`}
                                  style={{
                                    backgroundColor:
                                      i === activePreviewIndex
                                        ? currentTheme.color
                                        : currentTheme.color + '30',
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <GalleryHorizontalEnd size={18} className="text-porcelain-ji-blue" />
                    <h4
                      className="font-serif text-lg font-bold text-porcelain-inkbrown"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      我的展览长廊
                    </h4>
                  </div>
                  <button
                    onClick={handleCreateNew}
                    disabled={collectedArtifacts.length === 0}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-porcelain-youlihong to-porcelain-youlihong/80 text-white text-sm font-bold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-md"
                  >
                    <Plus size={16} />
                    策划新展览
                  </button>
                </div>

                {exhibitions.length === 0 ? (
                  <div className="rounded-2xl p-12 md:p-16 text-center bg-gradient-to-br from-porcelain-scroll/20 to-porcelain-paper border border-dashed border-porcelain-crackle/30">
                    <div className="w-24 h-24 rounded-full bg-porcelain-gold/10 flex items-center justify-center mx-auto mb-6">
                      <Sparkles size={40} className="text-porcelain-gold/60" />
                    </div>
                    <h5
                      className="font-serif text-xl font-bold text-porcelain-inkbrown/70 mb-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      您还没有策划过展览
                    </h5>
                    <p
                      className="text-sm text-porcelain-inkbrown/50 mb-6 max-w-md mx-auto leading-relaxed"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      {collectedArtifacts.length === 0
                        ? '请先参与考古发掘玩法，收集陶瓷珍品入藏您的私人博物馆'
                        : '从您的私人藏品库中精选珍品，选择展厅主题，编排展品顺序，讲述一段动人的陶瓷故事'}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={handleCreateNew}
                        disabled={collectedArtifacts.length === 0}
                        className="px-6 py-3 rounded-xl bg-porcelain-youlihong text-white text-sm font-bold hover:bg-porcelain-youlihong/90 transition-colors shadow-md flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={16} />
                        {collectedArtifacts.length === 0 ? '暂无藏品' : '开始策划'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exhibitions
                      .sort((a, b) => b.updatedAt - a.updatedAt)
                      .map((exh, idx) => {
                        const theme = getThemeById(exh.themeId);
                        const firstArtifact =
                          exh.exhibits.length > 0
                            ? getArtifact(exh.exhibits.sort((a, b) => a.order - b.order)[0].artifactId)
                            : null;
                        return (
                          <div
                            key={exh.id}
                            className={`group rounded-2xl overflow-hidden border border-porcelain-crackle/30 hover:border-transparent hover:shadow-porcelain transition-all duration-300 ${
                              isVisible ? 'animate-fade-in-up' : ''
                            }`}
                            style={{
                              animationDelay: `${idx * 0.05}s`,
                            }}
                          >
                            <div
                              className="relative h-40 p-5 flex flex-col justify-between overflow-hidden"
                              style={{
                                background: `linear-gradient(135deg, ${theme.color}15, ${theme.color}08)`,
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div
                                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                                  style={{ backgroundColor: `${theme.color}25` }}
                                >
                                  {renderThemeIcon(theme.icon, theme.color, 18)}
                                </div>
                                <span
                                  className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                  style={{ backgroundColor: 'white', color: theme.color }}
                                >
                                  {theme.name}
                                </span>
                              </div>
                              <div>
                                <h5
                                  className="font-serif text-lg font-bold text-porcelain-inkbrown line-clamp-2 leading-tight"
                                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                                >
                                  {exh.title}
                                </h5>
                                {exh.subtitle && (
                                  <p
                                    className="text-[11px] text-porcelain-inkbrown/55 mt-1 line-clamp-1"
                                    style={{ fontFamily: '"Noto Serif SC", serif' }}
                                  >
                                    「{exh.subtitle}」
                                  </p>
                                )}
                              </div>
                              {firstArtifact && (
                                <div
                                  className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-30 group-hover:opacity-50 transition-opacity"
                                  style={{
                                    background: `radial-gradient(circle, ${firstArtifact.color}90, ${firstArtifact.color}30)`,
                                  }}
                                />
                              )}
                            </div>

                            <div className="p-4 bg-white/80">
                              <div className="flex items-center justify-between mb-3 pb-3 border-b border-porcelain-crackle/15">
                                <div className="flex items-center gap-1.5 text-[11px] text-porcelain-inkbrown/55">
                                  <Palette size={12} style={{ color: theme.color }} />
                                  <span>策展人：{exh.curatorName}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-porcelain-inkbrown/55">
                                  <Grid3X3 size={12} />
                                  <span>{exh.exhibits.length} 件</span>
                                </div>
                              </div>

                              {exh.exhibits.length > 0 && (
                                <div className="flex -space-x-2 mb-3">
                                  {exh.exhibits
                                    .sort((a, b) => a.order - b.order)
                                    .slice(0, 5)
                                    .map((ex) => {
                                      const art = getArtifact(ex.artifactId);
                                      if (!art) return null;
                                      return (
                                        <div
                                          key={ex.id}
                                          className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow-sm"
                                          style={{ backgroundColor: art.color }}
                                          title={art.name}
                                        >
                                          <svg
                                            viewBox="0 0 24 24"
                                            className="w-3.5 h-3.5"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="2"
                                          >
                                            <path d="M8 4 L16 4 L14 8 Q19 12 17 17 Q16 21 12 21 Q8 21 7 17 Q5 12 10 8 Z" />
                                          </svg>
                                        </div>
                                      );
                                    })}
                                  {exh.exhibits.length > 5 && (
                                    <div className="w-7 h-7 rounded-full border-2 border-white bg-porcelain-crackle/30 flex items-center justify-center text-[10px] font-bold text-porcelain-inkbrown/60">
                                      +{exh.exhibits.length - 5}
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handlePreview(exh)}
                                  className="flex-1 px-2.5 py-2 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                                  style={{
                                    backgroundColor: `${theme.color}15`,
                                    color: theme.color,
                                  }}
                                >
                                  <Eye size={12} />
                                  观展
                                </button>
                                <button
                                  onClick={() => handleEdit(exh)}
                                  className="flex-1 px-2.5 py-2 rounded-lg bg-porcelain-scroll/50 text-porcelain-inkbrown/70 text-[11px] font-bold hover:bg-porcelain-scroll transition-colors flex items-center justify-center gap-1"
                                >
                                  <Edit3 size={12} />
                                  编辑
                                </button>
                                <button
                                  onClick={() => handleDelete(exh.id)}
                                  className="px-2.5 py-2 rounded-lg bg-porcelain-inkbrown/5 text-porcelain-inkbrown/50 hover:bg-porcelain-youlihong/10 hover:text-porcelain-youlihong transition-colors flex items-center justify-center"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showArtifactPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-porcelain-inkbrown/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-porcelain-paper rounded-2xl shadow-porcelain-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-fade-in-up">
            <div className="p-5 border-b border-porcelain-crackle/20 flex items-start justify-between gap-3 flex-shrink-0">
              <div>
                <h5
                  className="font-serif text-xl font-bold text-porcelain-inkbrown mb-1"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  从藏品库中挑选展品
                </h5>
                <p className="text-xs text-porcelain-inkbrown/55">
                  共 {collectedArtifacts.length} 件可用藏品，{filteredCollection.length} 件匹配筛选
                </p>
              </div>
              <button
                onClick={() => setShowArtifactPicker(false)}
                className="w-8 h-8 rounded-lg bg-porcelain-scroll/50 text-porcelain-inkbrown/60 hover:bg-porcelain-youlihong/10 hover:text-porcelain-youlihong transition-colors flex items-center justify-center flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 border-b border-porcelain-crackle/15 flex items-center gap-2 flex-wrap flex-shrink-0">
              <div className="relative flex-1 min-w-[180px]">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-porcelain-inkbrown/40"
                />
                <input
                  type="text"
                  placeholder="搜索名称、窑口、年代..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-porcelain-crackle/30 bg-white text-sm focus:outline-none focus:border-porcelain-gold/50 transition-colors"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Filter size={14} className="text-porcelain-inkbrown/50" />
                <select
                  value={filterRarity}
                  onChange={(e) => setFilterRarity(e.target.value as ArtifactRarity | 'all')}
                  className="px-2.5 py-2 rounded-lg border border-porcelain-crackle/30 bg-white text-xs focus:outline-none focus:border-porcelain-gold/50 transition-colors text-porcelain-inkbrown/70"
                >
                  <option value="all">全部等级</option>
                  <option value="legendary">国宝级</option>
                  <option value="epic">珍品</option>
                  <option value="rare">稀有</option>
                  <option value="uncommon">少见</option>
                  <option value="common">普通</option>
                </select>
                <select
                  value={filterEra}
                  onChange={(e) => setFilterEra(e.target.value)}
                  className="px-2.5 py-2 rounded-lg border border-porcelain-crackle/30 bg-white text-xs focus:outline-none focus:border-porcelain-gold/50 transition-colors text-porcelain-inkbrown/70 max-w-[130px]"
                >
                  <option value="all">全部年代</option>
                  {eras.map((era) => (
                    <option key={era} value={era}>
                      {era}
                    </option>
                  ))}
                </select>
                {(filterRarity !== 'all' || filterEra !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setFilterRarity('all');
                      setFilterEra('all');
                      setSearchQuery('');
                    }}
                    className="px-2 py-2 rounded-lg text-porcelain-inkbrown/50 hover:text-porcelain-youlihong transition-colors"
                    title="清除筛选"
                  >
                    <RefreshCw size={14} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {filteredCollection.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-porcelain-crackle/15 flex items-center justify-center mb-4">
                    <Search size={28} className="text-porcelain-inkbrown/30" />
                  </div>
                  <p
                    className="font-serif text-sm text-porcelain-inkbrown/50 mb-1"
                    style={{ fontFamily: '"Noto Serif SC", serif' }}
                  >
                    没有找到匹配的藏品
                  </p>
                  <p className="text-xs text-porcelain-inkbrown/40">尝试调整搜索词或筛选条件</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredCollection.map((fa) => {
                    const isAdded = currentExhibition?.exhibits.some(
                      (e) => e.foundArtifactId === fa.id
                    );
                    return (
                      <div key={fa.id}>
                        <ArtifactCard
                          found={fa}
                          onClick={() => !isAdded && handleAddExhibit(fa)}
                          isSelected={!!isAdded}
                          showAdd={!isAdded}
                        />
                        {isAdded && (
                          <p className="text-[10px] text-porcelain-gold/80 mt-1 text-center">
                            ✓ 已添加到展览
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function generateMockCollection(): FoundArtifact[] {
  const mockArtifactIds = [
    'ru_complete_1',
    'ru_complete_2',
    'guan_complete_1',
    'ding_complete_1',
    'ding_complete_2',
    'jun_complete_1',
    'longquan_complete_1',
    'longquan_complete_2',
    'jdz_complete_1',
    'jdz_complete_2',
    'jdz_complete_3',
  ];

  return mockArtifactIds.slice(0, 8).map((id, idx) => ({
    id: `mock_found_${idx}_${Date.now() + idx}`,
    artifactId: id,
    foundAt: Date.now() - idx * 86400000,
    siteId: `qingliangsi`,
    stage: 'collected' as const,
    condition: (['excellent', 'good', 'fair', 'pristine'] as const)[idx % 4],
    cleanProgress: 100,
    collectedAt: Date.now() - idx * 3600000,
    museumNote: '',
  }));
}