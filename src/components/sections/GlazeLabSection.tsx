import { useState, useMemo, useCallback, useEffect } from 'react';
import { Beaker, Flame, Save, Trash2, Clock, ChevronDown, ChevronUp, RotateCcw, BookOpen, Plus, Minus, Search, Edit3, Check, X, Palette, Download, Layers } from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import SealLabel from '@/components/common/SealLabel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  glazeMinerals,
  atmosphereOptions,
  coolingRateOptions,
  presetFormulas,
  calculateGlazeColor,
  createDefaultFormula,
  createDefaultFiringCondition,
  generateExperimentId,
} from '@/data/glazeLab';
import type { GlazeFormula, FiringCondition, GlazeExperiment, GlazeLabResult, DetailData } from '@/types';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

const categoryLabels: Record<string, string> = {
  base: '基料',
  flux: '助熔',
  colorant: '着色',
  stabilizer: '稳定',
};

const categoryColors: Record<string, string> = {
  base: '#2C3E50',
  flux: '#C9A962',
  colorant: '#A83232',
  stabilizer: '#8BA888',
};

const textureLabels: Record<string, string> = {
  glossy: '光亮',
  matte: '哑光',
  satin: '丝光',
  crystalline: '结晶',
};

const vesselTypes = [
  { id: 'meiping', name: '梅瓶' },
  { id: 'bowl', name: '碗' },
  { id: 'plate', name: '盘' },
] as const;

type VesselType = typeof vesselTypes[number]['id'];

const STORAGE_KEY = 'glaze_lab_experiments';

function loadExperiments(): GlazeExperiment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveExperiments(experiments: GlazeExperiment[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments));
  } catch {}
}

const VesselPreview = ({ result, vesselType, size = 'large', uniqueKey }: { result: GlazeLabResult; vesselType: VesselType; size?: 'small' | 'large'; uniqueKey?: string }) => {
  const isCrystalline = result.texture === 'crystalline';
  const isMatte = result.texture === 'matte';
  const w = size === 'large' ? 160 : 64;
  const h = size === 'large' ? 220 : 88;
  const idSuffix = uniqueKey ? `${uniqueKey}_` : '';

  const glazeGradientId = `vesselGrad_${idSuffix}${vesselType}_${size}`;
  const crystalPatternId = `crystalPattern_${idSuffix}${vesselType}_${size}`;
  const highlightClipId = `highlightClip_${idSuffix}${vesselType}_${size}`;
  const highlightOpacity = isMatte ? '0.15' : '0.4';

  const vesselPath = (() => {
    switch (vesselType) {
      case 'meiping':
        return 'M 55 15 C 50 15, 38 20, 35 35 C 32 50, 30 65, 28 90 C 26 120, 28 160, 35 185 C 38 195, 55 200, 80 200 C 105 200, 122 195, 125 185 C 132 160, 134 120, 132 90 C 130 65, 128 50, 125 35 C 122 20, 110 15, 105 15 Z';
      case 'bowl':
        return 'M 20 60 C 20 40, 40 25, 80 25 C 120 25, 140 40, 140 60 C 140 70, 130 85, 110 95 C 100 100, 60 100, 50 95 C 30 85, 20 70, 20 60 Z';
      case 'plate':
        return 'M 10 80 C 10 55, 35 40, 80 40 C 125 40, 150 55, 150 80 C 150 90, 130 100, 80 100 C 30 100, 10 90, 10 80 Z';
      default:
        return 'M 55 15 C 50 15, 38 20, 35 35 C 32 50, 30 65, 28 90 C 26 120, 28 160, 35 185 C 38 195, 55 200, 80 200 C 105 200, 122 195, 125 185 C 132 160, 134 120, 132 90 C 130 65, 128 50, 125 35 C 122 20, 110 15, 105 15 Z';
    }
  })();

  const crystalDensity = size === 'large' ? 6 : 3;

  return (
    <svg width={w} height={h} viewBox="0 0 160 220" className="drop-shadow-2xl">
      <defs>
        <radialGradient id={glazeGradientId} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor={result.lightColor} />
          <stop offset="60%" stopColor={result.color} />
          <stop offset="100%" stopColor={result.color} />
        </radialGradient>
        {isCrystalline && (
          <pattern id={crystalPatternId} patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill={`url(#${glazeGradientId})`} />
            <g opacity="0.55">
              <polygon
                points="10,3 12,8 17,9 13,13 14,18 10,15 6,18 7,13 3,9 8,8"
                fill={result.lightColor}
                opacity="0.7"
              />
              <polygon
                points="10,5 11.2,8.3 14.5,9 11.8,11.2 12.5,14.5 10,12.8 7.5,14.5 8.2,11.2 5.5,9 8.8,8.3"
                fill="white"
                opacity="0.35"
              />
            </g>
            <g opacity="0.4">
              <circle cx="3" cy="3" r="1.2" fill={result.lightColor} />
              <circle cx="17" cy="17" r="0.8" fill="white" opacity="0.5" />
              <circle cx="4" cy="16" r="0.6" fill={result.lightColor} opacity="0.6" />
            </g>
          </pattern>
        )}
        <clipPath id={highlightClipId}>
          <ellipse cx="55" cy="80" rx="30" ry="60" />
        </clipPath>
      </defs>
      <path
        d={vesselPath}
        fill={isCrystalline ? `url(#${crystalPatternId})` : `url(#${glazeGradientId})`}
        stroke={result.color}
        strokeWidth="1.5"
        opacity="0.95"
      />
      <path
        d={vesselPath}
        fill="white"
        opacity={highlightOpacity}
        clipPath={`url(#${highlightClipId})`}
      />
      {isCrystalline && size === 'large' && (
        <g opacity="0.5">
          {Array.from({ length: crystalDensity }).map((_, i) => {
            const cx = 50 + (i * 18) % 70;
            const cy = 60 + Math.floor(i / 2) * 35;
            const sizeC = 5 + (i % 3) * 2;
            return (
              <g key={i} transform={`translate(${cx},${cy})`}>
                <polygon
                  points={`0,${-sizeC} ${sizeC * 0.6},${-sizeC * 0.2} ${sizeC},0 ${sizeC * 0.6},${sizeC * 0.5} 0,${sizeC} ${-sizeC * 0.6},${sizeC * 0.5} ${-sizeC},0 ${-sizeC * 0.6},${-sizeC * 0.2}`}
                  fill={result.lightColor}
                  opacity="0.5"
                />
                <polygon
                  points={`0,${-sizeC * 0.6} ${sizeC * 0.35},${-sizeC * 0.12} ${sizeC * 0.6},0 ${sizeC * 0.35},${sizeC * 0.3} 0,${sizeC * 0.6} ${-sizeC * 0.35},${sizeC * 0.3} ${-sizeC * 0.6},0 ${-sizeC * 0.35},${-sizeC * 0.12}`}
                  fill="white"
                  opacity="0.25"
                />
              </g>
            );
          })}
        </g>
      )}
      {result.crackleLevel > 20 && (
        <g opacity={result.crackleLevel / 200}>
          {Array.from({ length: Math.floor(result.crackleLevel / 12) }).map((_, i) => (
            <path
              key={i}
              d={`M${35 + i * 7} ${30 + i * 8} L${60 + i * 5} ${70 + i * 6} L${45 + i * 6} ${110 + i * 5}`}
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="0.5"
            />
          ))}
        </g>
      )}
      {result.flowLevel > 30 && vesselType === 'meiping' && (
        <ellipse
          cx="80"
          cy="195"
          rx={15 + result.flowLevel / 8}
          ry="4"
          fill={result.color}
          opacity="0.3"
        />
      )}
    </svg>
  );
};

const PropertyBar = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div className="flex items-center gap-2">
    <span className="text-[10px] text-porcelain-inkbrown/60 w-14 text-right">{label}</span>
    <div className="flex-1 h-1.5 bg-porcelain-crackle/20 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
    <span className="text-[10px] font-bold text-porcelain-inkbrown/70 w-8">{value}</span>
  </div>
);

const PropertyRadar = ({ experiments }: { experiments: GlazeExperiment[] }) => {
  const cx = 100;
  const cy = 100;
  const r = 70;
  const axes = ['translucency', 'crackleLevel', 'flowLevel'] as const;
  const axisLabels = ['透光度', '开片度', '流动度'] as const;
  const colors = ['#A83232', '#C9A962', '#2C3E50', '#8BA888'];

  const getPoint = (axisIdx: number, value: number) => {
    const angle = (axisIdx * 2 * Math.PI) / axes.length - Math.PI / 2;
    const dist = (value / 100) * r;
    return {
      x: cx + dist * Math.cos(angle),
      y: cy + dist * Math.sin(angle),
    };
  };

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      {axes.map((_, i) => {
        const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2;
        return (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(angle)}
            y2={cy + r * Math.sin(angle)}
            stroke="#D4C8A8"
            strokeWidth="0.5"
          />
        );
      })}
      {[25, 50, 75, 100].map((level) => (
        <polygon
          key={`grid-${level}`}
          points={axes.map((_, i) => {
            const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2;
            const dist = (level / 100) * r;
            return `${cx + dist * Math.cos(angle)},${cy + dist * Math.sin(angle)}`;
          }).join(' ')}
          fill="none"
          stroke="#D4C8A8"
          strokeWidth="0.5"
          opacity="0.5"
        />
      ))}
      {axes.map((_, i) => {
        const angle = (i * 2 * Math.PI) / axes.length - Math.PI / 2;
        const labelR = r + 18;
        return (
          <text
            key={`label-${i}`}
            x={cx + labelR * Math.cos(angle)}
            y={cy + labelR * Math.sin(angle)}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[8px] fill-porcelain-inkbrown/60"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            {axisLabels[i]}
          </text>
        );
      })}
      {experiments.map((exp, expIdx) => {
        const points = axes.map((axis) => getPoint(axes.indexOf(axis), exp.result[axis])).map((p) => `${p.x},${p.y}`).join(' ');
        return (
          <polygon
            key={exp.id}
            points={points}
            fill={colors[expIdx % colors.length]}
            fillOpacity="0.15"
            stroke={colors[expIdx % colors.length]}
            strokeWidth="1.5"
          />
        );
      })}
    </svg>
  );
};

export default function GlazeLabSection({ onOpenDetail }: Props) {
  const [formula, setFormula] = useState<GlazeFormula>(createDefaultFormula());
  const [firingCondition, setFiringCondition] = useState<FiringCondition>(createDefaultFiringCondition());
  const [experiments, setExperiments] = useState<GlazeExperiment[]>(() => loadExperiments());
  const [showArchive, setShowArchive] = useState(false);
  const [expandedMinerals, setExpandedMinerals] = useState<Record<string, boolean>>({});
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [vesselType, setVesselType] = useState<VesselType>('meiping');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [showNotesId, setShowNotesId] = useState<string | null>(null);
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);

  const result = useMemo(() => calculateGlazeColor(formula, firingCondition), [formula, firingCondition]);

  useEffect(() => {
    saveExperiments(experiments);
  }, [experiments]);

  const handleMineralRatioChange = useCallback((mineralId: string, ratio: number) => {
    setFormula((prev) => {
      const existing = prev.minerals.find((m) => m.mineralId === mineralId);
      let newMinerals;
      if (existing) {
        if (ratio <= 0) {
          newMinerals = prev.minerals.filter((m) => m.mineralId !== mineralId);
        } else {
          newMinerals = prev.minerals.map((m) =>
            m.mineralId === mineralId ? { ...m, ratio } : m
          );
        }
      } else if (ratio > 0) {
        newMinerals = [...prev.minerals, { mineralId, ratio }];
      } else {
        newMinerals = prev.minerals;
      }
      return {
        minerals: newMinerals,
        totalRatio: newMinerals.reduce((sum, m) => sum + m.ratio, 0),
      };
    });
  }, []);

  const handleAddMineral = useCallback((mineralId: string) => {
    const mineral = glazeMinerals.find((m) => m.id === mineralId);
    if (!mineral) return;
    setFormula((prev) => {
      if (prev.minerals.some((m) => m.mineralId === mineralId)) return prev;
      const newMinerals = [...prev.minerals, { mineralId, ratio: mineral.defaultRatio }];
      return {
        minerals: newMinerals,
        totalRatio: newMinerals.reduce((sum, m) => sum + m.ratio, 0),
      };
    });
  }, []);

  const handleRemoveMineral = useCallback((mineralId: string) => {
    setFormula((prev) => {
      const newMinerals = prev.minerals.filter((m) => m.mineralId !== mineralId);
      return {
        minerals: newMinerals,
        totalRatio: newMinerals.reduce((sum, m) => sum + m.ratio, 0),
      };
    });
  }, []);

  const handleLoadPreset = useCallback((presetIdx: number) => {
    const preset = presetFormulas[presetIdx];
    if (!preset) return;
    setFormula({ ...preset.formula, totalRatio: preset.formula.minerals.reduce((s, m) => s + m.ratio, 0) });
    setFiringCondition({ ...preset.firingCondition });
  }, []);

  const handleSaveExperiment = useCallback(() => {
    const newExp: GlazeExperiment = {
      id: generateExperimentId(),
      name: `${result.name} #${experiments.length + 1}`,
      formula: { ...formula, minerals: [...formula.minerals] },
      firingCondition: { ...firingCondition },
      result: { ...result },
      createdAt: Date.now(),
      notes: '',
    };
    setExperiments((prev) => [newExp, ...prev]);
  }, [formula, firingCondition, result, experiments.length]);

  const handleDeleteExperiment = useCallback((id: string) => {
    setExperiments((prev) => prev.filter((e) => e.id !== id));
    setCompareIds((prev) => prev.filter((cid) => cid !== id));
    if (editingId === id) setEditingId(null);
    if (showNotesId === id) setShowNotesId(null);
  }, [editingId, showNotesId]);

  const handleLoadExperiment = useCallback((exp: GlazeExperiment) => {
    setFormula({ ...exp.formula, minerals: [...exp.formula.minerals] });
    setFiringCondition({ ...exp.firingCondition });
  }, []);

  const handleReset = useCallback(() => {
    setFormula(createDefaultFormula());
    setFiringCondition(createDefaultFiringCondition());
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((cid) => cid !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }, []);

  const handleStartEditName = useCallback((exp: GlazeExperiment) => {
    setEditingId(exp.id);
    setEditName(exp.name);
    setEditNotes(exp.notes);
  }, []);

  const handleSaveEdit = useCallback((id: string) => {
    setExperiments((prev) =>
      prev.map((e) => e.id === id ? { ...e, name: editName, notes: editNotes } : e)
    );
    setEditingId(null);
  }, [editName, editNotes]);

  const handleExportExperiments = useCallback(() => {
    const data = JSON.stringify(experiments, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glaze_experiments_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [experiments]);

  const activeMineralIds = formula.minerals.map((m) => m.mineralId);
  const availableMinerals = glazeMinerals.filter((m) => !activeMineralIds.includes(m.id));
  const selectedExperiments = experiments.filter((e) => compareIds.includes(e.id));

  const filteredExperiments = useMemo(() => {
    if (!searchQuery.trim()) return experiments;
    const q = searchQuery.toLowerCase();
    return experiments.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.result.name.toLowerCase().includes(q) ||
        e.notes.toLowerCase().includes(q) ||
        e.formula.minerals.some((item) => {
          const mineral = glazeMinerals.find((m) => m.id === item.mineralId);
          return mineral?.name.toLowerCase().includes(q);
        })
    );
  }, [experiments, searchQuery]);

  const groupedExperiments = useMemo(() => {
    const groups: Record<string, GlazeExperiment[]> = {};
    filteredExperiments.forEach((exp) => {
      const key = exp.result.name.replace(/[·\s]/g, '').slice(0, 4);
      if (!groups[key]) groups[key] = [];
      groups[key].push(exp);
    });
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filteredExperiments]);

  const getMineralName = (id: string) => glazeMinerals.find((m) => m.id === id)?.name || id;

  return (
    <section id="glaze-lab" className="section-padding bg-gradient-to-b from-porcelain-paper to-porcelain-scroll/20 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-96 h-96 bg-porcelain-celadon/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-porcelain-youlihong/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-8 relative">
        <SectionTitle
          tag="LAB · 陆"
          title="釉色实验室"
          subtitle='"入窑一色，出窑万彩"。自由调配釉料配方与矿物比例，设定烧制条件，实时预览釉色变化，记录每一次实验'
        />

        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <div className="bg-porcelain-paper/80 rounded-2xl p-5 md:p-8 shadow-porcelain border border-porcelain-crackle/40 backdrop-blur-sm">
            <div className="flex items-start gap-3 mb-6">
              <SealLabel text="釉" size="md" />
              <div>
                <h3
                  className="font-serif text-xl md:text-2xl font-bold text-porcelain-inkbrown mb-1"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  陶瓷釉色实验室
                </h3>
                <p className="text-sm text-porcelain-inkbrown/65 leading-relaxed max-w-3xl" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  调整釉料配方中的矿物比例，设定烧成温度与气氛，系统实时计算并呈现釉色效果。保存实验记录，对比不同配方的差异。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-porcelain-scroll/30 rounded-xl p-4 border border-porcelain-crackle/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4
                      className="font-serif text-base font-bold text-porcelain-inkbrown flex items-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <Beaker size={16} className="text-porcelain-gold" />
                      釉料配方
                    </h4>
                    <div className="flex items-center gap-2">
                      {availableMinerals.length > 0 && (
                        <div className="relative group">
                          <button className="px-2.5 py-1 rounded-lg bg-porcelain-celadon/15 text-porcelain-celadon text-xs font-bold flex items-center gap-1 hover:bg-porcelain-celadon/25 transition-colors">
                            <Plus size={12} /> 添加矿物
                          </button>
                          <div className="absolute right-0 top-full mt-1 bg-porcelain-paper rounded-lg shadow-porcelain-lg border border-porcelain-crackle/40 py-1 w-36 z-10 hidden group-hover:block max-h-64 overflow-y-auto">
                            {(['base', 'flux', 'colorant', 'stabilizer'] as const).map((cat) => {
                              const catMinerals = availableMinerals.filter((m) => m.category === cat);
                              if (catMinerals.length === 0) return null;
                              return (
                                <div key={cat}>
                                  <div className="px-3 py-1 text-[9px] font-bold uppercase" style={{ color: categoryColors[cat] }}>
                                    {categoryLabels[cat]}
                                  </div>
                                  {catMinerals.map((m) => (
                                    <button
                                      key={m.id}
                                      onClick={() => handleAddMineral(m.id)}
                                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-porcelain-scroll/50 flex items-center gap-2 transition-colors"
                                    >
                                      <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: categoryColors[m.category] }}
                                      />
                                      <span style={{ fontFamily: '"Noto Serif SC", serif' }}>{m.name}</span>
                                    </button>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {formula.minerals.map((item) => {
                      const mineral = glazeMinerals.find((m) => m.id === item.mineralId);
                      if (!mineral) return null;
                      const percentage = formula.totalRatio > 0 ? ((item.ratio / formula.totalRatio) * 100).toFixed(1) : '0';
                      const isExpanded = expandedMinerals[item.mineralId] || false;

                      return (
                        <div
                          key={item.mineralId}
                          className="bg-porcelain-paper rounded-lg border border-porcelain-crackle/20 overflow-hidden"
                        >
                          <div className="flex items-center gap-3 p-3">
                            <button
                              onClick={() => setExpandedMinerals((prev) => ({ ...prev, [item.mineralId]: !prev[item.mineralId] }))}
                              className="flex-shrink-0 text-porcelain-inkbrown/40 hover:text-porcelain-inkbrown/70 transition-colors"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: categoryColors[mineral.category] }}
                            />
                            <span
                              className="font-serif text-sm font-bold text-porcelain-inkbrown flex-1"
                              style={{ fontFamily: '"Noto Serif SC", serif' }}
                            >
                              {mineral.name}
                            </span>
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: `${categoryColors[mineral.category]}15`,
                                color: categoryColors[mineral.category],
                              }}
                            >
                              {categoryLabels[mineral.category]}
                            </span>
                            <span className="text-xs text-porcelain-inkbrown/60 w-12 text-right font-mono">
                              {percentage}%
                            </span>
                            <button
                              onClick={() => handleRemoveMineral(item.mineralId)}
                              className="text-porcelain-inkbrown/30 hover:text-porcelain-youlihong transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                          </div>

                          <div className="px-3 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-porcelain-inkbrown/40 w-8">{mineral.minRatio}</span>
                              <input
                                type="range"
                                min={mineral.minRatio}
                                max={mineral.maxRatio}
                                step={0.5}
                                value={item.ratio}
                                onChange={(e) => handleMineralRatioChange(item.mineralId, parseFloat(e.target.value))}
                                className="flex-1 h-1.5 appearance-none bg-porcelain-crackle/30 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
                                style={{
                                  accentColor: categoryColors[mineral.category],
                                }}
                              />
                              <span className="text-[10px] text-porcelain-inkbrown/40 w-8">{mineral.maxRatio}</span>
                              <span className="text-xs font-bold text-porcelain-inkbrown/80 w-8 text-center">
                                {item.ratio}
                              </span>
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="px-3 pb-3 pt-1 border-t border-porcelain-crackle/15">
                              <p className="text-[11px] text-porcelain-inkbrown/60 leading-relaxed mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                                {mineral.description}
                              </p>
                              <div className="flex gap-3 text-[10px] text-porcelain-inkbrown/50">
                                <span>温度敏感度: {mineral.temperatureSensitivity}</span>
                                <span>气氛影响: {mineral.atmosphereEffect === 'neutral' ? '无' : mineral.atmosphereEffect === 'oxidize' ? '氧化' : '还原'}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {formula.totalRatio > 0 && (
                    <div className="mt-3 pt-3 border-t border-porcelain-crackle/20">
                      <div className="flex items-center justify-between text-xs text-porcelain-inkbrown/60">
                        <span style={{ fontFamily: '"Noto Serif SC", serif' }}>配方总量</span>
                        <span className="font-mono font-bold">{formula.totalRatio.toFixed(1)}</span>
                      </div>
                      <div className="mt-2 h-3 bg-porcelain-crackle/20 rounded-full overflow-hidden flex">
                        {formula.minerals.map((item) => {
                          const mineral = glazeMinerals.find((m) => m.id === item.mineralId);
                          const width = (item.ratio / formula.totalRatio) * 100;
                          return (
                            <div
                              key={item.mineralId}
                              className="h-full transition-all duration-300"
                              style={{
                                width: `${width}%`,
                                backgroundColor: categoryColors[mineral?.category || 'base'],
                                opacity: 0.7,
                              }}
                              title={`${mineral?.name}: ${width.toFixed(1)}%`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-porcelain-scroll/30 rounded-xl p-4 border border-porcelain-crackle/30">
                  <h4
                    className="font-serif text-base font-bold text-porcelain-inkbrown flex items-center gap-2 mb-3"
                    style={{ fontFamily: '"Noto Serif SC", serif' }}
                  >
                    <Flame size={16} className="text-porcelain-youlihong" />
                    烧制条件
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-porcelain-inkbrown/65" style={{ fontFamily: '"Noto Serif SC", serif' }}>烧成温度</span>
                        <span className="text-sm font-bold font-mono" style={{ color: firingCondition.temperature >= 1300 ? '#A83232' : firingCondition.temperature >= 1200 ? '#C9A962' : '#8BA888' }}>
                          {firingCondition.temperature}°C
                        </span>
                      </div>
                      <input
                        type="range"
                        min={900}
                        max={1400}
                        step={10}
                        value={firingCondition.temperature}
                        onChange={(e) => setFiringCondition((prev) => ({ ...prev, temperature: parseInt(e.target.value) }))}
                        className="w-full h-2 appearance-none rounded-full outline-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #8BA888 0%, #C9A962 40%, #A83232 80%, #C04040 100%)`,
                        }}
                      />
                      <div className="flex justify-between text-[9px] text-porcelain-inkbrown/40 mt-0.5">
                        <span>900°C 低温</span>
                        <span>1150°C 中温</span>
                        <span>1300°C 高温</span>
                        <span>1400°C</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-porcelain-inkbrown/65 block mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>烧成气氛</span>
                      <div className="grid grid-cols-3 gap-2">
                        {atmosphereOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setFiringCondition((prev) => ({ ...prev, atmosphere: opt.value }))}
                            className={`px-2 py-2 rounded-lg text-center text-xs font-bold border-2 transition-all ${
                              firingCondition.atmosphere === opt.value
                                ? 'border-current bg-white/80 shadow-md scale-105'
                                : 'border-porcelain-crackle/30 bg-porcelain-paper hover:border-porcelain-crackle/60'
                            }`}
                            style={{
                              color: firingCondition.atmosphere === opt.value ? opt.color : '#3D2B1F80',
                              fontFamily: '"Noto Serif SC", serif',
                            }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-porcelain-inkbrown/65" style={{ fontFamily: '"Noto Serif SC", serif' }}>保温时间</span>
                        <span className="text-sm font-bold font-mono text-porcelain-gold">{firingCondition.duration} 小时</span>
                      </div>
                      <input
                        type="range"
                        min={2}
                        max={20}
                        step={1}
                        value={firingCondition.duration}
                        onChange={(e) => setFiringCondition((prev) => ({ ...prev, duration: parseInt(e.target.value) }))}
                        className="w-full h-1.5 appearance-none bg-porcelain-crackle/30 rounded-full outline-none cursor-pointer"
                        style={{ accentColor: '#C9A962' }}
                      />
                    </div>

                    <div>
                      <span className="text-xs text-porcelain-inkbrown/65 block mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>冷却方式</span>
                      <div className="grid grid-cols-3 gap-2">
                        {coolingRateOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setFiringCondition((prev) => ({ ...prev, coolingRate: opt.value }))}
                            className={`px-2 py-1.5 rounded-lg text-center text-[11px] border-2 transition-all ${
                              firingCondition.coolingRate === opt.value
                                ? 'border-porcelain-celadon bg-porcelain-celadon/10 text-porcelain-celadon shadow-sm'
                                : 'border-porcelain-crackle/30 bg-porcelain-paper text-porcelain-inkbrown/55 hover:border-porcelain-crackle/60'
                            }`}
                            style={{ fontFamily: '"Noto Serif SC", serif' }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-porcelain-scroll/30 rounded-xl p-4 border border-porcelain-crackle/30">
                  <h4
                    className="font-serif text-base font-bold text-porcelain-inkbrown flex items-center gap-2 mb-3"
                    style={{ fontFamily: '"Noto Serif SC", serif' }}
                  >
                    <BookOpen size={16} className="text-porcelain-ji-blue" />
                    经典配方
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {presetFormulas.map((preset, idx) => (
                      <button
                        key={preset.name}
                        onClick={() => handleLoadPreset(idx)}
                        className="px-3 py-2 rounded-lg text-[11px] font-bold border border-porcelain-crackle/30 bg-porcelain-paper hover:border-porcelain-gold/50 hover:bg-porcelain-gold/10 transition-all text-center"
                        style={{ fontFamily: '"Noto Serif SC", serif', color: '#3D2B1Fcc' }}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <div className="bg-gradient-to-br from-porcelain-scroll/40 to-porcelain-paper rounded-xl p-6 border border-porcelain-crackle/30 flex flex-col items-center">
                  <h4
                    className="font-serif text-base font-bold text-porcelain-inkbrown flex items-center gap-2 mb-2"
                    style={{ fontFamily: '"Noto Serif SC", serif' }}
                  >
                    <span className="w-2 h-2 rounded-full bg-porcelain-gold animate-pulse" />
                    实时釉色预览
                  </h4>

                  <div className="flex gap-2 mb-4">
                    {vesselTypes.map((vt) => (
                      <button
                        key={vt.id}
                        onClick={() => setVesselType(vt.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                          vesselType === vt.id
                            ? 'border-porcelain-gold bg-porcelain-gold/15 text-porcelain-gold'
                            : 'border-porcelain-crackle/30 bg-porcelain-paper text-porcelain-inkbrown/50 hover:border-porcelain-crackle/60'
                        }`}
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        {vt.name}
                      </button>
                    ))}
                  </div>

                  <VesselPreview result={result} vesselType={vesselType} size="large" uniqueKey="main" />

                  <div className="mt-5 text-center">
                    <h5
                      className="font-serif text-2xl md:text-3xl font-bold mb-1"
                      style={{ fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif', color: result.color }}
                    >
                      {result.name}
                    </h5>
                    <p
                      className="text-xs text-porcelain-inkbrown/55 mb-3"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      {result.description}
                    </p>

                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div
                        className="w-10 h-10 rounded-lg shadow-inner"
                        style={{
                          backgroundColor: result.color,
                          boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.3), inset 0 -2px 8px rgba(0,0,0,0.1)',
                        }}
                      />
                      <div className="text-left">
                        <div className="text-[10px] text-porcelain-inkbrown/50">色值</div>
                        <div className="text-xs font-mono font-bold text-porcelain-inkbrown/80">{result.color.toUpperCase()}</div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full space-y-1.5 mt-2">
                    <PropertyBar value={result.translucency} label="透光度" color="#8BA888" />
                    <PropertyBar value={result.crackleLevel} label="开片度" color="#C9A962" />
                    <PropertyBar value={result.flowLevel} label="流动度" color="#A83232" />
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-porcelain-inkbrown/60 w-14 text-right">质感</span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${result.texture === 'glossy' ? '#C9A962' : result.texture === 'crystalline' ? '#7BA3A8' : result.texture === 'matte' ? '#8BA888' : '#2C3E50'}15`,
                          color: result.texture === 'glossy' ? '#C9A962' : result.texture === 'crystalline' ? '#7BA3A8' : result.texture === 'matte' ? '#8BA888' : '#2C3E50',
                        }}
                      >
                        {textureLabels[result.texture]}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-5 w-full">
                    <button
                      onClick={handleSaveExperiment}
                      className="flex-1 px-4 py-2.5 bg-porcelain-gold/15 text-porcelain-gold rounded-lg font-bold text-sm hover:bg-porcelain-gold/25 transition-colors flex items-center justify-center gap-1.5"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <Save size={14} /> 保存实验
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2.5 bg-porcelain-inkbrown/10 text-porcelain-inkbrown/65 rounded-lg font-bold text-sm hover:bg-porcelain-inkbrown/15 transition-colors flex items-center justify-center gap-1.5"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <RotateCcw size={14} /> 重置
                    </button>
                  </div>
                </div>

                {experiments.length > 0 && (
                  <div className="bg-porcelain-scroll/30 rounded-xl p-4 border border-porcelain-crackle/30">
                    <h4
                      className="font-serif text-sm font-bold text-porcelain-inkbrown flex items-center gap-2 mb-3"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <Palette size={14} className="text-porcelain-celadon" />
                      釉色色带
                    </h4>
                    <div className="flex rounded-lg overflow-hidden h-8 shadow-inner">
                      {experiments.slice(0, 20).map((exp) => (
                        <div
                          key={exp.id}
                          className="flex-1 cursor-pointer transition-all hover:flex-[2]"
                          style={{ backgroundColor: exp.result.color }}
                          title={`${exp.name} (${exp.result.color})`}
                          onClick={() => handleLoadExperiment(exp)}
                        />
                      ))}
                    </div>
                    {experiments.length > 20 && (
                      <p className="text-[10px] text-porcelain-inkbrown/40 mt-1 text-center">
                        显示最近 20 条，共 {experiments.length} 条
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="lg:col-span-3 space-y-4">
                <div className="bg-porcelain-scroll/30 rounded-xl p-4 border border-porcelain-crackle/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4
                      className="font-serif text-base font-bold text-porcelain-inkbrown flex items-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <Clock size={16} className="text-porcelain-youlihong" />
                      实验档案
                      <span className="text-xs text-porcelain-inkbrown/40 font-normal">({experiments.length})</span>
                    </h4>
                    <div className="flex items-center gap-1.5">
                      {experiments.length > 0 && (
                        <>
                          <button
                            onClick={handleExportExperiments}
                            className="p-1.5 rounded-lg text-porcelain-inkbrown/40 hover:text-porcelain-inkbrown/70 hover:bg-porcelain-inkbrown/5 transition-all"
                            title="导出实验数据"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => setShowArchive(!showArchive)}
                            className="text-xs text-porcelain-inkbrown/50 hover:text-porcelain-inkbrown/80 flex items-center gap-1 transition-colors"
                          >
                            {showArchive ? '收起' : '展开'}
                            {showArchive ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {experiments.length > 3 && (
                    <div className="relative mb-3">
                      <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-porcelain-inkbrown/30" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="搜索实验名称、釉色、矿物..."
                        className="w-full pl-7 pr-3 py-1.5 text-xs bg-porcelain-paper border border-porcelain-crackle/30 rounded-lg outline-none focus:border-porcelain-gold/50 transition-colors"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      />
                    </div>
                  )}

                  {experiments.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-porcelain-crackle/15 flex items-center justify-center mx-auto mb-3">
                        <Save size={24} className="text-porcelain-crackle/60" />
                      </div>
                      <p className="text-xs text-porcelain-inkbrown/50" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                        调配配方后点击"保存实验"
                        <br />
                        记录每一次尝试
                      </p>
                    </div>
                  ) : (
                    <div className={`space-y-2 ${!showArchive ? 'max-h-[360px] overflow-y-auto' : ''}`}>
                      {searchQuery.trim() ? (
                        filteredExperiments.map((exp) => (
                          <ExperimentCard
                            key={exp.id}
                            exp={exp}
                            compareIds={compareIds}
                            editingId={editingId}
                            editName={editName}
                            editNotes={editNotes}
                            showNotesId={showNotesId}
                            vesselType={vesselType}
                            onToggleCompare={toggleCompare}
                            onDelete={handleDeleteExperiment}
                            onLoad={handleLoadExperiment}
                            onStartEdit={handleStartEditName}
                            onSaveEdit={handleSaveEdit}
                            onCancelEdit={() => setEditingId(null)}
                            onEditNameChange={setEditName}
                            onEditNotesChange={setEditNotes}
                            onToggleNotes={(id) => setShowNotesId(showNotesId === id ? null : id)}
                            getMineralName={getMineralName}
                          />
                        ))
                      ) : (
                        groupedExperiments.map(([group, exps]) => (
                          <div key={group}>
                            <div className="flex items-center gap-2 mb-1 mt-2 first:mt-0">
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: exps[0].result.color }}
                              />
                              <span
                                className="text-[10px] font-bold text-porcelain-inkbrown/50"
                                style={{ fontFamily: '"Noto Serif SC", serif' }}
                              >
                                {exps[0].result.name}
                              </span>
                              <span className="text-[9px] text-porcelain-inkbrown/30">({exps.length})</span>
                            </div>
                            {exps.map((exp) => (
                              <ExperimentCard
                                key={exp.id}
                                exp={exp}
                                compareIds={compareIds}
                                editingId={editingId}
                                editName={editName}
                                editNotes={editNotes}
                                showNotesId={showNotesId}
                                vesselType={vesselType}
                                onToggleCompare={toggleCompare}
                                onDelete={handleDeleteExperiment}
                                onLoad={handleLoadExperiment}
                                onStartEdit={handleStartEditName}
                                onSaveEdit={handleSaveEdit}
                                onCancelEdit={() => setEditingId(null)}
                                onEditNameChange={setEditName}
                                onEditNotesChange={setEditNotes}
                                onToggleNotes={(id) => setShowNotesId(showNotesId === id ? null : id)}
                                getMineralName={getMineralName}
                              />
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {compareIds.length >= 2 && (
                    <div className="mt-4 pt-4 border-t border-porcelain-crackle/20">
                      <h5
                        className="font-serif text-sm font-bold text-porcelain-inkbrown mb-3 flex items-center gap-1.5"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        <Layers size={14} className="text-porcelain-gold" />
                        配方对比
                      </h5>

                      <PropertyRadar experiments={selectedExperiments} />

                      <div className="space-y-2 mt-3">
                        {selectedExperiments.map((exp, idx) => {
                          const colors = ['#A83232', '#C9A962', '#2C3E50', '#8BA888'];
                          return (
                            <div key={exp.id} className="flex items-center gap-2 p-2 rounded-lg bg-porcelain-paper border border-porcelain-crackle/20">
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: colors[idx % colors.length] }}
                              />
                              <div
                                className="w-6 h-6 rounded-full flex-shrink-0"
                                style={{
                                  background: `radial-gradient(circle at 30% 30%, ${exp.result.lightColor}, ${exp.result.color})`,
                                  boxShadow: 'inset 0 1px 4px rgba(255,255,255,0.3), inset 0 -1px 4px rgba(0,0,0,0.1)',
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <div
                                  className="font-serif text-xs font-bold truncate"
                                  style={{ fontFamily: '"Noto Serif SC", serif', color: exp.result.color }}
                                >
                                  {exp.name}
                                </div>
                                <div className="flex gap-2 text-[9px] text-porcelain-inkbrown/50">
                                  <span>透光 {exp.result.translucency}</span>
                                  <span>开片 {exp.result.crackleLevel}</span>
                                  <span>流动 {exp.result.flowLevel}</span>
                                </div>
                              </div>
                              <div className="text-[9px] text-porcelain-inkbrown/40 font-mono">{exp.result.color}</div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-3 p-3 rounded-lg bg-porcelain-scroll/30">
                        <div className="grid grid-cols-3 gap-2 text-[10px] text-center">
                          <div>
                            <div className="text-porcelain-inkbrown/40 mb-1">温度范围</div>
                            <div className="font-mono font-bold text-porcelain-inkbrown/70">
                              {Math.min(...selectedExperiments.map(e => e.firingCondition.temperature))}-
                              {Math.max(...selectedExperiments.map(e => e.firingCondition.temperature))}°C
                            </div>
                          </div>
                          <div>
                            <div className="text-porcelain-inkbrown/40 mb-1">气氛</div>
                            <div className="font-bold text-porcelain-inkbrown/70" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                              {new Set(selectedExperiments.map(e => e.firingCondition.atmosphere)).size === 1
                                ? atmosphereOptions.find(a => a.value === selectedExperiments[0].firingCondition.atmosphere)?.label
                                : '多种'}
                            </div>
                          </div>
                          <div>
                            <div className="text-porcelain-inkbrown/40 mb-1">实验数</div>
                            <div className="font-mono font-bold text-porcelain-inkbrown/70">{selectedExperiments.length}</div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-porcelain-crackle/20">
                          <div className="text-[10px] text-porcelain-inkbrown/50 mb-1.5">矿物差异</div>
                          <div className="space-y-1">
                            {(() => {
                              const allMineralIds = [...new Set(selectedExperiments.flatMap(e => e.formula.minerals.map(m => m.mineralId)))];
                              return allMineralIds.map((mid) => {
                                const values = selectedExperiments.map(e => e.formula.minerals.find(m => m.mineralId === mid)?.ratio || 0);
                                const hasDiff = new Set(values).size > 1;
                                return (
                                  <div key={mid} className="flex items-center gap-2 text-[9px]">
                                    <span className={`w-16 text-right ${hasDiff ? 'text-porcelain-youlihong font-bold' : 'text-porcelain-inkbrown/40'}`}>
                                      {getMineralName(mid)}
                                    </span>
                                    <div className="flex-1 flex gap-1">
                                      {values.map((v, i) => (
                                        <div
                                          key={i}
                                          className="flex-1 text-center font-mono rounded px-1 py-0.5"
                                          style={{
                                            backgroundColor: hasDiff ? `${['#A8323215', '#C9A96215', '#2C3E5015', '#8BA88815'][i % 4]}` : 'transparent',
                                          }}
                                        >
                                          {v}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ExperimentCardProps {
  exp: GlazeExperiment;
  compareIds: string[];
  editingId: string | null;
  editName: string;
  editNotes: string;
  showNotesId: string | null;
  vesselType: VesselType;
  onToggleCompare: (id: string) => void;
  onDelete: (id: string) => void;
  onLoad: (exp: GlazeExperiment) => void;
  onStartEdit: (exp: GlazeExperiment) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onEditNameChange: (name: string) => void;
  onEditNotesChange: (notes: string) => void;
  onToggleNotes: (id: string) => void;
  getMineralName: (id: string) => string;
}

function ExperimentCard({
  exp,
  compareIds,
  editingId,
  editName,
  editNotes,
  showNotesId,
  vesselType,
  onToggleCompare,
  onDelete,
  onLoad,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditNameChange,
  onEditNotesChange,
  onToggleNotes,
  getMineralName,
}: ExperimentCardProps) {
  const isEditing = editingId === exp.id;
  const isShowNotes = showNotesId === exp.id;

  return (
    <div
      className={`p-3 rounded-lg border transition-all cursor-pointer ${
        compareIds.includes(exp.id)
          ? 'border-porcelain-gold bg-porcelain-gold/10'
          : 'border-porcelain-crackle/20 bg-porcelain-paper hover:border-porcelain-crackle/40'
      }`}
      onClick={() => !isEditing && onLoad(exp)}
    >
      <div className="flex items-center gap-3">
        <VesselPreview result={exp.result} vesselType={vesselType} size="small" uniqueKey={exp.id} />
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editName}
                onChange={(e) => onEditNameChange(e.target.value)}
                className="flex-1 text-sm bg-porcelain-scroll/50 border border-porcelain-crackle/30 rounded px-2 py-0.5 outline-none focus:border-porcelain-gold/50"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              />
              <button
                onClick={() => onSaveEdit(exp.id)}
                className="p-1 text-porcelain-celadon hover:bg-porcelain-celadon/10 rounded"
              >
                <Check size={12} />
              </button>
              <button
                onClick={onCancelEdit}
                className="p-1 text-porcelain-inkbrown/40 hover:bg-porcelain-inkbrown/5 rounded"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div
              className="font-serif text-sm font-bold truncate"
              style={{ fontFamily: '"Noto Serif SC", serif', color: exp.result.color }}
            >
              {exp.name}
            </div>
          )}
          <div className="text-[10px] text-porcelain-inkbrown/50 mt-0.5">
            {new Date(exp.createdAt).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-[10px] text-porcelain-inkbrown/45 mt-0.5">
            {exp.firingCondition.temperature}°C · {atmosphereOptions.find(a => a.value === exp.firingCondition.atmosphere)?.label}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCompare(exp.id); }}
            className={`p-1 rounded transition-colors ${
              compareIds.includes(exp.id) ? 'text-porcelain-gold' : 'text-porcelain-inkbrown/30 hover:text-porcelain-inkbrown/60'
            }`}
            title="加入对比"
          >
            <Layers size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onStartEdit(exp); }}
            className="p-1 rounded text-porcelain-inkbrown/30 hover:text-porcelain-inkbrown/60 transition-colors"
            title="编辑"
          >
            <Edit3 size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleNotes(exp.id); }}
            className={`p-1 rounded transition-colors ${
              isShowNotes ? 'text-porcelain-celadon' : 'text-porcelain-inkbrown/30 hover:text-porcelain-inkbrown/60'
            }`}
            title="笔记"
          >
            <BookOpen size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(exp.id); }}
            className="p-1 rounded text-porcelain-inkbrown/30 hover:text-porcelain-youlihong transition-colors"
            title="删除"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
          <textarea
            value={editNotes}
            onChange={(e) => onEditNotesChange(e.target.value)}
            placeholder="添加实验笔记..."
            className="w-full text-[11px] bg-porcelain-scroll/50 border border-porcelain-crackle/30 rounded-lg px-2 py-1.5 outline-none focus:border-porcelain-gold/50 resize-none h-16"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          />
        </div>
      )}

      {isShowNotes && !isEditing && exp.notes && (
        <div className="mt-2 p-2 rounded-lg bg-porcelain-scroll/30 border border-porcelain-crackle/15">
          <p className="text-[11px] text-porcelain-inkbrown/60 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            {exp.notes}
          </p>
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-1.5">
        {exp.formula.minerals.slice(0, 4).map((item) => (
          <span key={item.mineralId} className="text-[9px] px-1.5 py-0.5 rounded bg-porcelain-inkbrown/5 text-porcelain-inkbrown/55">
            {getMineralName(item.mineralId)} {item.ratio}
          </span>
        ))}
        {exp.formula.minerals.length > 4 && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-porcelain-inkbrown/5 text-porcelain-inkbrown/40">
            +{exp.formula.minerals.length - 4}
          </span>
        )}
      </div>
    </div>
  );
}
