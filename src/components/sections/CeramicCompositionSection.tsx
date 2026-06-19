import { useState, useMemo, useCallback } from 'react';
import { FlaskConical, Microscope, Search, Plus, Minus, Flame, ThermometerSun, Gem, Eye, Palette, Lightbulb, Box, Atom, Droplets, ChevronRight, RotateCcw, Zap, Target, Layers } from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import SealLabel from '@/components/common/SealLabel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  ceramicMaterials,
  ceramicTypes,
  defaultExperimentRecipe,
  calculateExperimentResult,
  microscopeSamples,
  materialCategoryLabels,
  materialCategoryColors,
  atmosphereOptions,
} from '@/data/ceramicComposition';
import type { CeramicMaterial, CeramicType, CeramicExperimentResult, MicroscopeSample, DetailData, FiringCondition } from '@/types';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

type TabMode = 'materials' | 'recipes' | 'experiment' | 'microscope';

const qualityGradeColors: Record<string, string> = {
  精品: '#A83232',
  佳品: '#C9A962',
  合格品: '#8BA888',
  次品: '#7BA3A8',
  废品: '#999999',
};

const microstructureLabels: Record<string, string> = {
  crystalline: '晶质结构',
  glassy: '玻璃质结构',
  mixed: '混合结构',
  porous: '多孔结构',
  amorphous: '无定形结构',
};

export default function CeramicCompositionSection({ onOpenDetail }: Props) {
  const [activeTab, setActiveTab] = useState<TabMode>('materials');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCeramicType, setSelectedCeramicType] = useState<CeramicType | null>(ceramicTypes[0]);
  const [selectedMicroscopeSample, setSelectedMicroscopeSample] = useState<MicroscopeSample | null>(microscopeSamples[0]);
  const [experimentRecipe, setExperimentRecipe] = useState<{
    materials: { materialId: string; ratio: number }[];
    firingTemperature: number;
    atmosphere: FiringCondition['atmosphere'];
  }>(defaultExperimentRecipe);
  const [isExperimenting, setIsExperimenting] = useState(false);
  const [experimentResult, setExperimentResult] = useState<CeramicExperimentResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);

  const filteredMaterials = useMemo(() => {
    return ceramicMaterials.filter((m) => {
      const matchCategory = !selectedCategory || m.category === selectedCategory;
      const matchSearch = !searchTerm || m.name.includes(searchTerm) || m.chineseName.includes(searchTerm) || m.description.includes(searchTerm);
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchTerm]);

  const totalRatio = useMemo(() => {
    return experimentRecipe.materials.reduce((sum, m) => sum + m.ratio, 0);
  }, [experimentRecipe]);

  const runExperiment = useCallback(() => {
    setIsExperimenting(true);
    setTimeout(() => {
      const result = calculateExperimentResult(experimentRecipe);
      setExperimentResult(result);
      setIsExperimenting(false);
    }, 1200);
  }, [experimentRecipe]);

  const resetExperiment = useCallback(() => {
    setExperimentRecipe(defaultExperimentRecipe);
    setExperimentResult(null);
  }, []);

  const updateMaterialRatio = useCallback((materialId: string, delta: number) => {
    setExperimentRecipe((prev) => {
      const existing = prev.materials.find((m) => m.materialId === materialId);
      if (existing) {
        const newRatio = Math.max(0, Math.min(80, existing.ratio + delta));
        if (newRatio === 0) {
          return {
            ...prev,
            materials: prev.materials.filter((m) => m.materialId !== materialId),
          };
        }
        return {
          ...prev,
          materials: prev.materials.map((m) =>
            m.materialId === materialId ? { ...m, ratio: newRatio } : m
          ),
        };
      }
      return {
        ...prev,
        materials: [...prev.materials, { materialId, ratio: Math.min(80, Math.max(0, delta)) }],
      };
    });
  }, []);

  const loadPresetRecipe = useCallback((ceramic: CeramicType) => {
    setExperimentRecipe({
      materials: ceramic.composition.map((c) => ({ ...c })),
      firingTemperature: ceramic.firingTemperature,
      atmosphere: ceramic.atmosphere,
    });
    setExperimentResult(null);
    setActiveTab('experiment');
  }, []);

  const handleMaterialClick = useCallback((material: CeramicMaterial) => {
    onOpenDetail({
      type: 'ceramic-material',
      id: material.id,
      title: material.chineseName,
      subtitle: material.chemicalFormula,
      description: material.description + '\n\n' + material.historicalNote,
      sections: [
        { title: '基本属性', content: [`产地：${material.origin}`, `熔点：${material.meltingPoint}℃`, `类别：${materialCategoryLabels[material.category]}`] },
        { title: '原料特性', content: [
          `可塑性：${material.properties.plasticity}/100`,
          `烧结性：${material.properties.sinterability}/100`,
          `白度：${material.properties.whiteness}/100`,
          `耐火度：${material.properties.refractoriness}/100`,
        ] },
        { title: '对瓷胎的影响', content: [
          `硬度贡献：${Math.round(material.impact.hardness * 100)}%`,
          `呈色影响：${Math.round(material.impact.color * 100)}%`,
          `透光性：${Math.round(material.impact.translucency * 100)}%`,
          `收缩率：${Math.round(material.impact.shrinkage * 100)}%`,
        ] },
      ],
      color: materialCategoryColors[material.category],
      bgColor: material.color + '40',
      imagePrompt: material.name + ' mineral sample, ' + material.description + ', geological specimen, high quality',
    });
  }, [onOpenDetail]);

  const handleCeramicTypeClick = useCallback((ceramic: CeramicType) => {
    onOpenDetail({
      type: 'ceramic-type',
      id: ceramic.id,
      title: ceramic.name,
      subtitle: ceramic.dynasty,
      description: ceramic.description,
      sections: [
        { title: '烧成条件', content: [`烧成温度：${ceramic.firingTemperature}℃`, `烧成气氛：${atmosphereOptions.find((a) => a.value === ceramic.atmosphere)?.label}`] },
        { title: '物理性能', content: [
          `硬度：${ceramic.properties.hardness}/100`,
          `白度：${ceramic.properties.whiteness}/100`,
          `透光性：${ceramic.properties.translucency}/100`,
          `热稳定性：${ceramic.properties.thermalStability}/100`,
          `釉面光洁度：${ceramic.properties.glazeSmoothness}/100`,
        ] },
        { title: '传世名品', content: ceramic.famousPieces },
      ],
      color: ceramic.color,
      bgColor: ceramic.color + '25',
      imagePrompt: ceramic.imagePrompt,
    });
  }, [onOpenDetail]);

  const handleMicroscopeSampleClick = useCallback((sample: MicroscopeSample) => {
    onOpenDetail({
      type: 'microscope-sample',
      id: sample.id,
      title: sample.name,
      subtitle: `放大 ${sample.magnification} 倍`,
      description: sample.description,
      sections: [
        { title: '显微特征', content: sample.features },
      ],
      color: '#2C3E50',
      bgColor: '#2C3E5015',
      imagePrompt: sample.imagePrompt,
    });
  }, [onOpenDetail]);

  const getMaterialRatio = useCallback((materialId: string) => {
    const item = experimentRecipe.materials.find((m) => m.materialId === materialId);
    return item?.ratio || 0;
  }, [experimentRecipe]);

  const CompositionPieChart = ({ composition, size = 180 }: { composition: { materialId: string; ratio: number }[]; size?: number }) => {
    const total = composition.reduce((sum, c) => sum + c.ratio, 0);
    let currentAngle = -90;

    return (
      <svg width={size} height={size} viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="#FAF7F0" stroke="#E5DDC8" strokeWidth="1" />
        {composition.map((item, idx) => {
          const material = ceramicMaterials.find((m) => m.id === item.materialId);
          if (!material || item.ratio <= 0) return null;
          const angle = (item.ratio / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle = endAngle;

          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          const x1 = 100 + 80 * Math.cos(startRad);
          const y1 = 100 + 80 * Math.sin(startRad);
          const x2 = 100 + 80 * Math.cos(endRad);
          const y2 = 100 + 80 * Math.sin(endRad);
          const largeArc = angle > 180 ? 1 : 0;

          const midAngle = startAngle + angle / 2;
          const midRad = (midAngle * Math.PI) / 180;
          const labelX = 100 + 55 * Math.cos(midRad);
          const labelY = 100 + 55 * Math.sin(midRad);

          return (
            <g key={item.materialId}>
              <path
                d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={material.color}
                stroke="#FFFFFF"
                strokeWidth="2"
                opacity="0.9"
              />
              {angle > 10 && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] font-bold"
                  fill={angle > 25 ? '#2C3E50' : '#666'}
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  {material.chineseName} {Math.round((item.ratio / total) * 100)}%
                </text>
              )}
            </g>
          );
        })}
        <circle cx="100" cy="100" r="35" fill="#FAF7F0" />
        <text x="100" y="95" textAnchor="middle" className="text-xs font-bold" fill="#2C3E50">
          {total}%
        </text>
        <text x="100" y="112" textAnchor="middle" className="text-[10px]" fill="#888">
          总配比
        </text>
      </svg>
    );
  };

  const MicroscopeView = ({ sample, size = 300 }: { sample: MicroscopeSample; size?: number }) => {
    return (
      <div className="relative">
        <svg width={size} height={size} viewBox="0 0 300 300" className="rounded-full border-4 border-porcelain-crackle/50 shadow-inner">
          <defs>
            <radialGradient id={`micro_${sample.id}`} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#F5F1E8" />
              <stop offset="60%" stopColor="#E8E0D0" />
              <stop offset="100%" stopColor="#D8D0C0" />
            </radialGradient>
            <clipPath id={`clip_${sample.id}`}>
              <circle cx="150" cy="150" r="145" />
            </clipPath>
          </defs>
          <circle cx="150" cy="150" r="148" fill={`url(#micro_${sample.id})`} />
          <g clipPath={`url(#clip_${sample.id})`}>
            {sample.id.includes('kaolin') && (
              <g opacity="0.8">
                {Array.from({ length: 30 }).map((_, i) => (
                  <ellipse
                    key={i}
                    cx={30 + (i * 24) % 240}
                    cy={30 + Math.floor(i / 5) * 48}
                    rx={12 + (i % 3) * 4}
                    ry={4 + (i % 4) * 2}
                    transform={`rotate(${(i * 37) % 180}, ${30 + (i * 24) % 240}, ${30 + Math.floor(i / 5) * 48})`}
                    fill="#C9B896"
                    stroke="#A89676"
                    strokeWidth="0.5"
                  />
                ))}
              </g>
            )}
            {sample.id.includes('quartz') && (
              <g opacity="0.85">
                {Array.from({ length: 15 }).map((_, i) => {
                  const cx = 50 + (i * 37) % 200;
                  const cy = 50 + Math.floor(i / 4) * 55;
                  const r = 15 + (i % 4) * 8;
                  return (
                    <polygon
                      key={i}
                      points={`${cx},${cy - r} ${cx + r * 0.87},${cy - r * 0.5} ${cx + r * 0.87},${cy + r * 0.5} ${cx},${cy + r} ${cx - r * 0.87},${cy + r * 0.5} ${cx - r * 0.87},${cy - r * 0.5}`}
                      fill="#E8E4D8"
                      stroke="#C8C0B0"
                      strokeWidth="1"
                    />
                  );
                })}
              </g>
            )}
            {sample.id.includes('feldspar') && (
              <g opacity="0.8">
                <rect x="30" y="30" width="240" height="240" fill="#EDE7D7" />
                {Array.from({ length: 25 }).map((_, i) => (
                  <rect
                    key={i}
                    x={40 + (i * 29) % 220}
                    y={40 + Math.floor(i / 6) * 42}
                    width={18 + (i % 3) * 6}
                    height={8 + (i % 4) * 4}
                    fill="#C9B896"
                    stroke="#9A8A66"
                    strokeWidth="0.5"
                    transform={`rotate(${(i * 23) % 30 - 15}, ${50 + (i * 29) % 220}, ${44 + Math.floor(i / 6) * 42})`}
                  />
                ))}
              </g>
            )}
            {sample.id.includes('porcelain_body') && (
              <g opacity="0.85">
                <rect x="20" y="20" width="260" height="260" fill="#F0EADB" />
                {Array.from({ length: 20 }).map((_, i) => (
                  <circle
                    key={`q_${i}`}
                    cx={40 + (i * 31) % 220}
                    cy={40 + Math.floor(i / 5) * 52}
                    r={10 + (i % 4) * 5}
                    fill="#FAF7F0"
                    stroke="#D8D0C0"
                    strokeWidth="1"
                  />
                ))}
                {Array.from({ length: 40 }).map((_, i) => (
                  <line
                    key={`m_${i}`}
                    x1={30 + (i * 27) % 240}
                    y1={30 + Math.floor(i / 8) * 30}
                    x2={30 + (i * 27) % 240 + 20}
                    y2={30 + Math.floor(i / 8) * 30 + 3}
                    stroke="#B8A888"
                    strokeWidth="1.5"
                    transform={`rotate(${(i * 47) % 180}, ${40 + (i * 27) % 240}, ${31.5 + Math.floor(i / 8) * 30})`}
                  />
                ))}
              </g>
            )}
            {sample.id.includes('ru_glaze') && (
              <g opacity="0.85">
                <rect x="20" y="20" width="260" height="260" fill="#8FA8A2" />
                {Array.from({ length: 60 }).map((_, i) => (
                  <circle
                    key={i}
                    cx={30 + (i * 19) % 240}
                    cy={30 + Math.floor(i / 10) * 24}
                    r={2 + (i % 5) * 2}
                    fill="rgba(255,255,255,0.5)"
                  />
                ))}
                {Array.from({ length: 15 }).map((_, i) => (
                  <circle
                    key={`qz_${i}`}
                    cx={50 + (i * 37) % 200}
                    cy={50 + Math.floor(i / 4) * 55}
                    r={8 + (i % 3) * 4}
                    fill="rgba(250,247,240,0.7)"
                    stroke="rgba(200,192,176,0.8)"
                    strokeWidth="0.5"
                  />
                ))}
              </g>
            )}
            {sample.id.includes('jian_hare') && (
              <g opacity="0.9">
                <rect x="20" y="20" width="260" height="260" fill="#2D1F14" />
                {Array.from({ length: 12 }).map((_, i) => (
                  <g key={i} transform={`translate(${40 + (i * 21) % 220}, ${30 + Math.floor(i / 3) * 80})`}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <line
                        key={j}
                        x1={j * 3}
                        y1={0}
                        x2={j * 3 - 8}
                        y2={60}
                        stroke={j % 3 === 0 ? '#D4A856' : '#B8864A'}
                        strokeWidth="2"
                        opacity="0.8"
                      />
                    ))}
                  </g>
                ))}
              </g>
            )}
            {sample.id.includes('jun_yao') && (
              <g opacity="0.85">
                <rect x="20" y="20" width="260" height="260" fill="#C04850" />
                {Array.from({ length: 35 }).map((_, i) => (
                  <circle
                    key={i}
                    cx={30 + (i * 23) % 240}
                    cy={30 + Math.floor(i / 7) * 36}
                    r={12 + (i % 6) * 8}
                    fill={i % 2 === 0 ? '#E87870' : '#9078A8'}
                    opacity="0.5"
                  />
                ))}
              </g>
            )}
            {sample.id.includes('crackle') && (
              <g opacity="0.9">
                <rect x="20" y="20" width="260" height="260" fill="#6B7A78" />
                <path d="M30 50 L80 80 L120 60 L180 110 L220 90 L270 130" stroke="#1a1a1a" strokeWidth="3" fill="none" />
                <path d="M50 150 L100 170 L150 140 L200 180 L250 160" stroke="#1a1a1a" strokeWidth="3" fill="none" />
                <path d="M40 200 L90 220 L140 190 L190 230 L240 200" stroke="#1a1a1a" strokeWidth="3" fill="none" />
                <path d="M60 40 L100 70 L140 50 L180 80 L230 60" stroke="#D4A856" strokeWidth="1.5" fill="none" />
                <path d="M80 120 L130 150 L170 130 L220 160 L260 140" stroke="#D4A856" strokeWidth="1.5" fill="none" />
                <path d="M70 220 L110 240 L160 210 L210 250 L250 220" stroke="#D4A856" strokeWidth="1.5" fill="none" />
              </g>
            )}
            {sample.id.includes('mullite') && (
              <g opacity="0.85">
                <rect x="20" y="20" width="260" height="260" fill="#E8E0D0" />
                {Array.from({ length: 50 }).map((_, i) => {
                  const cx = 30 + (i * 22) % 240;
                  const cy = 30 + Math.floor(i / 10) * 24;
                  return (
                    <line
                      key={i}
                      x1={cx - 15}
                      y1={cy}
                      x2={cx + 15}
                      y2={cy + (i % 3) * 2}
                      stroke="#8B7355"
                      strokeWidth="2"
                      transform={`rotate(${(i * 53) % 180}, ${cx}, ${cy})`}
                    />
                  );
                })}
              </g>
            )}
            {sample.id.includes('bone_china') && (
              <g opacity="0.85">
                <rect x="20" y="20" width="260" height="260" fill="#F8F5EE" />
                {Array.from({ length: 30 }).map((_, i) => (
                  <circle
                    key={i}
                    cx={40 + (i * 26) % 220}
                    cy={40 + Math.floor(i / 6) * 42}
                    r={10 + (i % 4) * 5}
                    fill="#E8E4D8"
                    stroke="#D8D0C0"
                    strokeWidth="1"
                  />
                ))}
              </g>
            )}
          </g>
          <circle cx="150" cy="150" r="148" fill="none" stroke="#8B7355" strokeWidth="6" />
          <circle cx="150" cy="150" r="148" fill="none" stroke="#C9A962" strokeWidth="2" />
        </svg>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-porcelain-inkbrown/90 text-white px-4 py-1.5 rounded-full text-xs font-medium">
          {sample.magnification}× 放大
        </div>
      </div>
    );
  };

  const PropertyBar = ({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon?: any }) => (
    <div className="mb-2">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="flex items-center gap-1.5 text-porcelain-inkbrown/75">
          {Icon && <Icon size={12} strokeWidth={2} />}
          {label}
        </span>
        <span className="font-bold" style={{ color }}>{value.toFixed(1)}</span>
      </div>
      <div className="h-2 bg-porcelain-scroll/50 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );

  return (
    <section id="ceramic-composition" className="section-padding bg-porcelain-paper relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-porcelain-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-porcelain-youlihong/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative">
        <SectionTitle
          tag="COMPOSITION · 捌"
          title="成分解密"
          subtitle='"瓷土配方，千年秘传"。高岭土、长石、石英——天地造化的三元配方，解构每一件名瓷背后的物质密码，亲手调配属于你的独特瓷胎'
        />

        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
            {[
              { id: 'materials' as TabMode, label: '原料图鉴', icon: FlaskConical, color: '#A83232' },
              { id: 'recipes' as TabMode, label: '名瓷配方', icon: Layers, color: '#C9A962' },
              { id: 'experiment' as TabMode, label: '互动实验', icon: Zap, color: '#8BA888' },
              { id: 'microscope' as TabMode, label: '显微镜室', icon: Microscope, color: '#2C3E50' },
            ].map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative px-4 md:px-6 py-2.5 md:py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-porcelain-scroll/40 text-porcelain-inkbrown/70 hover:bg-porcelain-scroll/60 hover:text-porcelain-inkbrown'
                } ${isVisible ? 'animate-fade-in-up' : ''}`}
                style={{
                  backgroundColor: activeTab === tab.id ? tab.color : undefined,
                  animationDelay: `${idx * 0.05}s`,
                }}
              >
                <tab.icon size={18} strokeWidth={1.8} />
                <span className="font-medium text-sm" style={{ fontFamily: '"Noto Serif SC", serif' }}>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45" style={{ backgroundColor: tab.color }} />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'materials' && (
            <div className="animate-fade-in">
              <div className="bg-porcelain-scroll/30 rounded-2xl p-4 md:p-6 mb-6 border border-porcelain-crackle/40">
                <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        !selectedCategory
                          ? 'bg-porcelain-inkbrown text-white shadow-md'
                          : 'bg-porcelain-paper text-porcelain-inkbrown/70 hover:bg-porcelain-scroll/50'
                      }`}
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      全部
                    </button>
                    {Object.entries(materialCategoryLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                          selectedCategory === key
                            ? 'text-white shadow-md'
                            : 'bg-porcelain-paper text-porcelain-inkbrown/70 hover:bg-porcelain-scroll/50'
                        }`}
                        style={{
                          backgroundColor: selectedCategory === key ? materialCategoryColors[key] : undefined,
                          fontFamily: '"Noto Serif SC", serif',
                        }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: materialCategoryColors[key] }}
                        />
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="relative md:w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-porcelain-inkbrown/40" strokeWidth={2} />
                    <input
                      type="text"
                      placeholder="搜索原料名称..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-porcelain-paper border border-porcelain-crackle/40 rounded-lg text-sm focus:outline-none focus:border-porcelain-gold transition-colors"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {filteredMaterials.map((material, idx) => (
                  <button
                    key={material.id}
                    onClick={() => handleMaterialClick(material)}
                    className={`group bg-porcelain-scroll/40 rounded-xl p-4 md:p-5 border border-porcelain-crackle/30 hover:border-porcelain-gold/60 transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-porcelain-lg ${
                      isVisible ? 'animate-fade-in-up' : ''
                    }`}
                    style={{ animationDelay: `${idx * 0.03}s` }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-xl shadow-inner flex-shrink-0 border-2 border-white/50 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: material.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-bold text-base md:text-lg text-porcelain-inkbrown group-hover:text-porcelain-ji-blue transition-colors truncate"
                          style={{ fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif' }}
                        >
                          {material.chineseName}
                        </div>
                        <div className="text-xs text-porcelain-inkbrown/50 truncate">{material.name}</div>
                      </div>
                      <SealLabel text={materialCategoryLabels[material.category][0]} size="sm" />
                    </div>
                    <p className="text-xs text-porcelain-inkbrown/65 leading-relaxed line-clamp-2 mb-3" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      {material.description}
                    </p>
                    <div className="text-[10px] text-porcelain-inkbrown/45 font-mono mb-3 truncate">
                      {material.chemicalFormula}
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { val: material.properties.plasticity, label: '可塑' },
                        { val: material.properties.sinterability, label: '烧结' },
                        { val: material.properties.whiteness, label: '白度' },
                        { val: material.properties.refractoriness, label: '耐火' },
                      ].map((p) => (
                        <div key={p.label} className="text-center">
                          <div
                            className="text-xs font-bold mb-0.5"
                            style={{ color: materialCategoryColors[material.category] }}
                          >
                            {p.val}
                          </div>
                          <div className="text-[9px] text-porcelain-inkbrown/45">{p.label}</div>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'recipes' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-porcelain-scroll/40 rounded-2xl p-4 md:p-6 border border-porcelain-crackle/30">
                  <h3 className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    <Layers size={18} className="text-porcelain-gold" />
                    名瓷配方一览
                  </h3>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {ceramicTypes.map((ceramic, idx) => (
                      <button
                        key={ceramic.id}
                        onClick={() => setSelectedCeramicType(ceramic)}
                        className={`w-full p-3 md:p-4 rounded-xl transition-all text-left flex items-center gap-3 ${
                          selectedCeramicType?.id === ceramic.id
                            ? 'bg-white shadow-md ring-2 ring-porcelain-gold'
                            : 'bg-porcelain-paper/60 hover:bg-white hover:shadow-sm'
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-lg shadow-inner flex-shrink-0 border-2 border-white/60"
                          style={{ backgroundColor: ceramic.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div
                            className="font-bold text-sm text-porcelain-inkbrown truncate"
                            style={{ fontFamily: '"Noto Serif SC", serif' }}
                          >
                            {ceramic.name}
                          </div>
                          <div className="text-[11px] text-porcelain-inkbrown/50">{ceramic.dynasty}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-porcelain-inkbrown/45">烧成温度</div>
                          <div className="text-sm font-bold text-porcelain-youlihong">{ceramic.firingTemperature}℃</div>
                        </div>
                        <ChevronRight size={16} className="text-porcelain-inkbrown/30 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {selectedCeramicType && (
                  <div className="bg-porcelain-scroll/40 rounded-2xl p-4 md:p-6 border border-porcelain-crackle/30">
                    <div className="flex items-start gap-4 mb-5">
                      <div
                        className="w-16 h-16 rounded-2xl shadow-lg flex-shrink-0 border-4 border-white"
                        style={{ backgroundColor: selectedCeramicType.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3
                            className="font-bold text-xl md:text-2xl text-porcelain-inkbrown truncate"
                            style={{ fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif' }}
                          >
                            {selectedCeramicType.name}
                          </h3>
                          <SealLabel text={selectedCeramicType.dynasty.split('，')[0]} size="sm" />
                        </div>
                        <p className="text-xs md:text-sm text-porcelain-inkbrown/70 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          {selectedCeramicType.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="flex flex-col items-center">
                        <CompositionPieChart composition={selectedCeramicType.composition} />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-bold text-porcelain-inkbrown/60 mb-2 uppercase tracking-wider">原料配比</h4>
                        {selectedCeramicType.composition.map((item) => {
                          const material = ceramicMaterials.find((m) => m.id === item.materialId);
                          if (!material) return null;
                          return (
                            <div key={item.materialId} className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-md shadow-inner flex-shrink-0 border border-white/50"
                                style={{ backgroundColor: material.color }}
                              />
                              <span
                                className="text-xs font-medium text-porcelain-inkbrown/80 flex-1"
                                style={{ fontFamily: '"Noto Serif SC", serif' }}
                              >
                                {material.chineseName}
                              </span>
                              <div className="w-24 h-2 bg-porcelain-scroll/60 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${item.ratio}%`, backgroundColor: material.color }}
                                />
                              </div>
                              <span className="text-xs font-bold w-10 text-right" style={{ color: materialCategoryColors[material.category] }}>
                                {item.ratio}%
                              </span>
                            </div>
                          );
                        })}
                        <div className="pt-2 mt-2 border-t border-porcelain-crackle/20">
                          <div className="flex items-center gap-2 text-xs text-porcelain-inkbrown/60">
                            <Flame size={12} />
                            <span>烧成气氛：{atmosphereOptions.find((a) => a.value === selectedCeramicType.atmosphere)?.label}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-porcelain-crackle/20 pt-4">
                      <h4 className="text-xs font-bold text-porcelain-inkbrown/60 mb-3 uppercase tracking-wider">物理性能</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { key: 'hardness', label: '硬度', icon: Gem, color: '#A83232' },
                          { key: 'whiteness', label: '白度', icon: Palette, color: '#C9A962' },
                          { key: 'translucency', label: '透光性', icon: Lightbulb, color: '#8BA888' },
                          { key: 'thermalStability', label: '热稳定', icon: ThermometerSun, color: '#7BA3A8' },
                          { key: 'glazeSmoothness', label: '釉面', icon: Droplets, color: '#2C3E50' },
                        ].map((p) => (
                          <div key={p.key} className="bg-porcelain-paper/60 rounded-xl p-3 text-center">
                            <div
                              className="w-8 h-8 rounded-lg mx-auto mb-1.5 flex items-center justify-center"
                              style={{ backgroundColor: p.color + '20', color: p.color }}
                            >
                              <p.icon size={14} strokeWidth={2} />
                            </div>
                            <div className="text-lg font-bold" style={{ color: p.color }}>
                              {selectedCeramicType.properties[p.key as keyof typeof selectedCeramicType.properties]}
                            </div>
                            <div className="text-[10px] text-porcelain-inkbrown/50">{p.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => handleCeramicTypeClick(selectedCeramicType)}
                        className="flex-1 py-2.5 bg-porcelain-scroll/60 hover:bg-porcelain-scroll text-porcelain-inkbrown rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        <Eye size={16} strokeWidth={1.8} />
                        查看详情
                      </button>
                      <button
                        onClick={() => loadPresetRecipe(selectedCeramicType)}
                        className="flex-1 py-2.5 bg-porcelain-gold hover:bg-porcelain-gold/90 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-md"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        <Zap size={16} strokeWidth={1.8} />
                        加载配方
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'experiment' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-porcelain-scroll/40 rounded-2xl p-4 md:p-6 border border-porcelain-crackle/30">
                  <h3 className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    <FlaskConical size={18} className="text-porcelain-gold" />
                    原料配比
                  </h3>
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
                    {ceramicMaterials.map((material) => {
                      const ratio = getMaterialRatio(material.id);
                      return (
                        <div key={material.id} className="bg-porcelain-paper/60 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-8 h-8 rounded-lg shadow-inner flex-shrink-0 border border-white/50"
                              style={{ backgroundColor: material.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <div
                                className="text-xs font-bold text-porcelain-inkbrown truncate"
                                style={{ fontFamily: '"Noto Serif SC", serif' }}
                              >
                                {material.chineseName}
                              </div>
                              <div className="text-[9px] text-porcelain-inkbrown/45">{materialCategoryLabels[material.category]}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateMaterialRatio(material.id, -5)}
                                disabled={ratio <= 0}
                                className="w-6 h-6 rounded-md bg-porcelain-scroll/60 hover:bg-porcelain-scroll disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                              >
                                <Minus size={12} strokeWidth={2.5} />
                              </button>
                              <span className="w-10 text-center text-sm font-bold" style={{ color: materialCategoryColors[material.category] }}>
                                {ratio}
                              </span>
                              <button
                                onClick={() => updateMaterialRatio(material.id, 5)}
                                disabled={ratio >= 80}
                                className="w-6 h-6 rounded-md bg-porcelain-gold/20 hover:bg-porcelain-gold/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-porcelain-gold"
                              >
                                <Plus size={12} strokeWidth={2.5} />
                              </button>
                            </div>
                          </div>
                          <div className="h-1.5 bg-porcelain-scroll/50 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{ width: `${ratio}%`, backgroundColor: material.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-porcelain-scroll/40 rounded-2xl p-4 md:p-6 border border-porcelain-crackle/30">
                  <h3 className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    <ThermometerSun size={18} className="text-porcelain-youlihong" />
                    烧成条件
                  </h3>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-porcelain-inkbrown/70" style={{ fontFamily: '"Noto Serif SC", serif' }}>烧成温度</span>
                      <span className="text-lg font-bold text-porcelain-youlihong">{experimentRecipe.firingTemperature}℃</span>
                    </div>
                    <input
                      type="range"
                      min="1100"
                      max="1400"
                      step="10"
                      value={experimentRecipe.firingTemperature}
                      onChange={(e) => setExperimentRecipe((prev) => ({ ...prev, firingTemperature: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-porcelain-scroll/60 rounded-full appearance-none cursor-pointer accent-porcelain-youlihong"
                    />
                    <div className="flex justify-between text-[10px] text-porcelain-inkbrown/45 mt-1">
                      <span>1100℃ 低温陶</span>
                      <span>1400℃ 高温瓷</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-xs text-porcelain-inkbrown/70 mb-2 block" style={{ fontFamily: '"Noto Serif SC", serif' }}>烧成气氛</span>
                    <div className="grid grid-cols-3 gap-2">
                      {atmosphereOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setExperimentRecipe((prev) => ({ ...prev, atmosphere: opt.value }))}
                          className={`p-3 rounded-xl text-center transition-all ${
                            experimentRecipe.atmosphere === opt.value
                              ? 'text-white shadow-md'
                              : 'bg-porcelain-paper/60 hover:bg-porcelain-paper text-porcelain-inkbrown/70'
                          }`}
                          style={{
                            backgroundColor: experimentRecipe.atmosphere === opt.value ? opt.color : undefined,
                          }}
                        >
                          <div className="text-xs font-bold mb-0.5" style={{ fontFamily: '"Noto Serif SC", serif' }}>{opt.label}</div>
                          <div className="text-[9px] opacity-80 leading-tight">{opt.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-porcelain-inkbrown/70" style={{ fontFamily: '"Noto Serif SC", serif' }}>总配比</span>
                      <span
                        className={`text-lg font-bold ${totalRatio < 80 ? 'text-red-500' : totalRatio > 120 ? 'text-red-500' : 'text-porcelain-gold'}`}
                      >
                        {totalRatio}%
                      </span>
                    </div>
                    <div className="h-3 bg-porcelain-scroll/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          totalRatio < 80 || totalRatio > 120 ? 'bg-red-500' : 'bg-porcelain-gold'
                        }`}
                        style={{ width: `${Math.min(100, (totalRatio / 100) * 100)}%` }}
                      />
                    </div>
                    {totalRatio < 80 && (
                      <p className="text-[10px] text-red-500 mt-1">⚠ 配比不足，建议总配比≥80%</p>
                    )}
                    {totalRatio > 120 && (
                      <p className="text-[10px] text-red-500 mt-1">⚠ 配比过高，建议总配比≤100%</p>
                    )}
                  </div>

                  <div className="flex items-center justify-center mb-6">
                    <CompositionPieChart
                      composition={experimentRecipe.materials.filter((m) => m.ratio > 0)}
                      size={200}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={resetExperiment}
                      className="flex-1 py-3 bg-porcelain-scroll/60 hover:bg-porcelain-scroll text-porcelain-inkbrown rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <RotateCcw size={16} strokeWidth={1.8} />
                      重置
                    </button>
                    <button
                      onClick={runExperiment}
                      disabled={isExperimenting || totalRatio === 0}
                      className="flex-1 py-3 bg-gradient-to-r from-porcelain-youlihong to-porcelain-gold text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      {isExperimenting ? (
                        <>
                          <Flame size={16} className="animate-pulse" strokeWidth={1.8} />
                          烧制中...
                        </>
                      ) : (
                        <>
                          <Zap size={16} strokeWidth={1.8} />
                          烧制实验
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-porcelain-scroll/40 rounded-2xl p-4 md:p-6 border border-porcelain-crackle/30">
                  <h3 className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    <Target size={18} className="text-porcelain-ji-blue" />
                    实验结果
                  </h3>

                  {isExperimenting ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="relative w-24 h-24 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-porcelain-gold/30" />
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-porcelain-gold animate-spin" />
                        <Flame size={32} className="absolute inset-0 m-auto text-porcelain-gold animate-pulse" />
                      </div>
                      <p className="text-sm text-porcelain-inkbrown/60" style={{ fontFamily: '"Noto Serif SC", serif' }}>窑火正旺，瓷胎正在烧结中...</p>
                      <p className="text-xs text-porcelain-inkbrown/40 mt-2">温度 {experimentRecipe.firingTemperature}℃ · {atmosphereOptions.find((a) => a.value === experimentRecipe.atmosphere)?.label}</p>
                    </div>
                  ) : experimentResult ? (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-16 h-16 rounded-2xl shadow-lg border-4 border-white flex-shrink-0"
                          style={{ backgroundColor: experimentResult.color }}
                        />
                        <div>
                          <div
                            className="text-2xl font-bold mb-1"
                            style={{ fontFamily: '"Ma Shan Zheng", serif', color: qualityGradeColors[experimentResult.qualityGrade] }}
                          >
                            {experimentResult.qualityGrade}
                          </div>
                          <p className="text-xs text-porcelain-inkbrown/60 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                            {experimentResult.description}
                          </p>
                        </div>
                      </div>

                      <div className="bg-porcelain-paper/60 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-porcelain-inkbrown/60 mb-3 uppercase tracking-wider">物理性能</h4>
                        <PropertyBar label="硬度" value={experimentResult.hardness} color="#A83232" icon={Gem} />
                        <PropertyBar label="透光性" value={experimentResult.translucency} color="#8BA888" icon={Lightbulb} />
                        <PropertyBar label="收缩率" value={experimentResult.shrinkage} color="#7BA3A8" icon={Box} />
                      </div>

                      <div className="bg-porcelain-paper/60 rounded-xl p-4">
                        <h4 className="text-xs font-bold text-porcelain-inkbrown/60 mb-3 uppercase tracking-wider">显微结构</h4>
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: '#2C3E5020', color: '#2C3E50' }}
                          >
                            <Atom size={18} strokeWidth={1.8} />
                          </div>
                          <div>
                            <div
                              className="font-bold text-porcelain-inkbrown"
                              style={{ fontFamily: '"Noto Serif SC", serif' }}
                            >
                              {microstructureLabels[experimentResult.microstructure]}
                            </div>
                            <div className="text-[10px] text-porcelain-inkbrown/45">Microstructure</div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          {[
                            { label: '晶相含量', value: experimentResult.crystalContent, color: '#2C3E50' },
                            { label: '玻璃相', value: experimentResult.glassPhase, color: '#C9A962' },
                            { label: '气孔率', value: experimentResult.porosity, color: '#A83232' },
                          ].map((p) => (
                            <div key={p.label} className="flex items-center gap-2">
                              <span className="text-xs text-porcelain-inkbrown/65 w-16">{p.label}</span>
                              <div className="flex-1 h-2 bg-porcelain-scroll/50 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ width: `${p.value}%`, backgroundColor: p.color }}
                                />
                              </div>
                              <span className="text-xs font-bold w-10 text-right" style={{ color: p.color }}>
                                {p.value.toFixed(1)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenDetail({
                          type: 'ceramic-experiment',
                          id: 'experiment_' + Date.now(),
                          title: '配方实验结果',
                          subtitle: `${experimentResult.qualityGrade} · ${experimentResult.hardness.toFixed(0)}硬度`,
                          description: experimentResult.description,
                          sections: [
                            { title: '配方组成', content: experimentRecipe.materials.filter(m => m.ratio > 0).map(m => {
                              const mat = ceramicMaterials.find(cm => cm.id === m.materialId);
                              return `${mat?.chineseName || m.materialId}：${m.ratio}%`;
                            }) },
                            { title: '烧成条件', content: [`温度：${experimentRecipe.firingTemperature}℃`, `气氛：${atmosphereOptions.find(a => a.value === experimentRecipe.atmosphere)?.label}`] },
                            { title: '性能指标', content: [
                              `硬度：${experimentResult.hardness.toFixed(1)}/100`,
                              `透光性：${experimentResult.translucency.toFixed(1)}/100`,
                              `收缩率：${experimentResult.shrinkage.toFixed(1)}/100`,
                            ] },
                            { title: '微观结构', content: [
                              `结构类型：${microstructureLabels[experimentResult.microstructure]}`,
                              `晶相含量：${experimentResult.crystalContent.toFixed(1)}%`,
                              `玻璃相：${experimentResult.glassPhase.toFixed(1)}%`,
                              `气孔率：${experimentResult.porosity.toFixed(1)}%`,
                            ] },
                          ],
                          color: qualityGradeColors[experimentResult.qualityGrade],
                          bgColor: experimentResult.color + '25',
                          imagePrompt: 'Ceramic sample cross section, showing ' + microstructureLabels[experimentResult.microstructure] + ', scientific visualization',
                        })}
                        className="w-full py-2.5 bg-porcelain-scroll/60 hover:bg-porcelain-scroll text-porcelain-inkbrown rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        <Eye size={16} strokeWidth={1.8} />
                        查看完整报告
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-20 h-20 rounded-full bg-porcelain-scroll/40 flex items-center justify-center mb-4">
                        <FlaskConical size={32} className="text-porcelain-inkbrown/30" strokeWidth={1.5} />
                      </div>
                      <p className="text-sm text-porcelain-inkbrown/50 mb-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>调整原料配比与烧成条件</p>
                      <p className="text-xs text-porcelain-inkbrown/30" style={{ fontFamily: '"Noto Serif SC", serif' }}>点击"烧制实验"查看结果</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'microscope' && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-porcelain-scroll/40 rounded-2xl p-4 md:p-6 border border-porcelain-crackle/30">
                  <h3 className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    <Microscope size={18} className="text-porcelain-gold" />
                    显微样本库
                  </h3>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                    {microscopeSamples.map((sample, idx) => (
                      <button
                        key={sample.id}
                        onClick={() => setSelectedMicroscopeSample(sample)}
                        className={`w-full p-3 md:p-4 rounded-xl transition-all text-left flex items-center gap-3 ${
                          selectedMicroscopeSample?.id === sample.id
                            ? 'bg-white shadow-md ring-2 ring-porcelain-gold'
                            : 'bg-porcelain-paper/60 hover:bg-white hover:shadow-sm'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-porcelain-inkbrown/10 flex items-center justify-center flex-shrink-0">
                          <Atom size={18} className="text-porcelain-inkbrown/60" strokeWidth={1.8} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className="font-bold text-sm text-porcelain-inkbrown truncate"
                            style={{ fontFamily: '"Noto Serif SC", serif' }}
                          >
                            {sample.name}
                          </div>
                          <div className="text-[11px] text-porcelain-inkbrown/50">
                            {sample.magnification}× 放大
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-porcelain-inkbrown/30 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {selectedMicroscopeSample && (
                  <div className="lg:col-span-2 bg-porcelain-scroll/40 rounded-2xl p-4 md:p-6 border border-porcelain-crackle/30">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0 flex justify-center">
                        <MicroscopeView sample={selectedMicroscopeSample} size={320} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-4">
                          <div>
                            <h3
                              className="font-bold text-xl text-porcelain-inkbrown mb-1"
                              style={{ fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif' }}
                            >
                              {selectedMicroscopeSample.name}
                            </h3>
                            <p className="text-xs text-porcelain-inkbrown/50">放大倍数：{selectedMicroscopeSample.magnification}×</p>
                          </div>
                        </div>

                        <p className="text-sm text-porcelain-inkbrown/75 leading-relaxed mb-5" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          {selectedMicroscopeSample.description}
                        </p>

                        <div className="bg-porcelain-paper/60 rounded-xl p-4 mb-5">
                          <h4 className="text-xs font-bold text-porcelain-inkbrown/60 mb-3 uppercase tracking-wider">显微特征</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedMicroscopeSample.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-porcelain-gold/15 text-porcelain-gold/90 text-xs font-medium rounded-lg"
                                style={{ fontFamily: '"Noto Serif SC", serif' }}
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => handleMicroscopeSampleClick(selectedMicroscopeSample)}
                          className="w-full py-2.5 bg-porcelain-scroll/60 hover:bg-porcelain-scroll text-porcelain-inkbrown rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          <Eye size={16} strokeWidth={1.8} />
                          查看详细报告
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}