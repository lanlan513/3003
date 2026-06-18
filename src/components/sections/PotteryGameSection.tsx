import { useState } from 'react';
import { Flame, Check, Sparkles, AlertTriangle, RotateCcw, Play } from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import SealLabel from '@/components/common/SealLabel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { clayTypes, formingMethods, firingTemperatures, firePottery } from '@/data/potteryGame';
import { craftData } from '@/data/crafts';
import type { ClayType, FormingMethod, FiringTemperature, PotteryResult, DetailData } from '@/types';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

const FormingIcon = ({ type, color = '#C9A962' }: { type: string; color?: string }) => {
  const icons: Record<string, JSX.Element> = {
    wheel: (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="9"/>
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 3 L12 5 M12 19 L12 21 M3 12 L5 12 M19 12 L21 12"/>
      </svg>
    ),
    pour: (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M7 3 L17 3 L15 13 L9 13 Z"/>
        <path d="M9 13 L7 21 L17 21 L15 13"/>
        <path d="M12 13 L12 21" opacity="0.5"/>
      </svg>
    ),
    hand: (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 3 L12 10"/>
        <path d="M8 5 L8 12"/>
        <path d="M16 5 L16 12"/>
        <path d="M5 8 L5 14"/>
        <path d="M19 8 L19 14"/>
        <path d="M5 14 Q5 20 12 21 Q19 20 19 14"/>
      </svg>
    ),
    mold: (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <path d="M4 10 L20 10"/>
        <path d="M10 10 L10 20" opacity="0.5"/>
        <path d="M14 10 L14 20" opacity="0.5"/>
        <path d="M7 4 L7 10" opacity="0.5"/>
        <path d="M17 4 L17 10" opacity="0.5"/>
      </svg>
    ),
    coil: (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 3 Q8 5 8 9 Q8 13 12 15 Q16 13 16 9 Q16 5 12 3"/>
        <path d="M12 15 Q8 17 8 21"/>
        <path d="M12 15 Q16 17 16 21"/>
      </svg>
    ),
  };
  return icons[type] || icons.wheel;
};

const ProgressBar = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div className="flex items-center gap-2">
    <span className="text-[10px] text-porcelain-inkbrown/60 w-12">{label}</span>
    <div className="flex-1 h-2 bg-porcelain-crackle/30 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
    <span className="text-[10px] font-bold text-porcelain-inkbrown/80 w-8">{value}</span>
  </div>
);

const KilnAnimation = ({ isFiring }: { isFiring: boolean }) => (
  <div className="relative w-48 h-48 mx-auto">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M20 30 L80 30 L80 90 L20 90 Z" fill="#5E4A3A" stroke="#3A2F24" strokeWidth="2"/>
      <rect x="35" y="50" width="30" height="35" fill="#2A1F15" rx="2"/>
      <rect x="40" y="55" width="20" height="25" fill={isFiring ? '#D4380D' : '#3A2F24'} rx="1"/>
      {isFiring && (
        <>
          <ellipse cx="50" cy="92" rx="3" ry="2" fill="#8B7355"/>
          <ellipse cx="50" cy="67" rx="8" ry="12" fill="#FF6B35" className="animate-pulse" opacity="0.8"/>
          <ellipse cx="50" cy="70" rx="5" ry="8" fill="#FFD93D" className="animate-pulse"/>
          <path d="M46 58 Q50 45 54 58" fill="#FFF5CC" className="animate-pulse"/>
          <circle cx="42" cy="35" r="1.5" fill="#8B7355" opacity="0.6"/>
          <circle cx="58" cy="33" r="1" fill="#8B7355" opacity="0.5"/>
          <circle cx="50" cy="28" r="1.2" fill="#8B7355" opacity="0.4"/>
        </>
      )}
    </svg>
    {isFiring && (
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-porcelain-youlihong font-bold animate-pulse">
        烈火燃烧中...
      </div>
    )}
  </div>
);

const ResultVase = ({ result }: { result: PotteryResult }) => (
  <div className="relative w-48 h-56 mx-auto">
    <svg viewBox="0 0 100 120" className="w-full h-full">
      <defs>
        <linearGradient id="vaseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={result.finalAppearance.secondaryColor}/>
          <stop offset="50%" stopColor={result.finalAppearance.primaryColor}/>
          <stop offset="100%" stopColor={result.finalAppearance.primaryColor}/>
        </linearGradient>
        <radialGradient id="vaseShine" cx="30%" cy="30%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <path
        d="M32 8 L68 8 L64 28 Q82 38 76 65 Q74 95 50 100 Q26 95 24 65 Q18 38 36 28 Z"
        fill="url(#vaseGradient)"
        stroke={result.finalAppearance.primaryColor}
        strokeWidth="1"
      />
      <path
        d="M32 8 L68 8 L64 28 Q82 38 76 65 Q74 95 50 100 Q26 95 24 65 Q18 38 36 28 Z"
        fill="url(#vaseShine)"
      />
      <path d="M30 45 Q50 40 70 45" fill="none" stroke="white" strokeWidth="0.8" opacity="0.3"/>
      <path d="M28 65 Q50 60 72 65" fill="none" stroke="white" strokeWidth="0.6" opacity="0.2"/>
      {result.flaws.some(f => f.severity === 'major' || f.severity === 'fatal') && (
        <>
          <path d="M45 75 L48 85 L46 95" fill="none" stroke="#3A2F24" strokeWidth="1" opacity="0.6"/>
          <path d="M55 70 L53 80 L56 90" fill="none" stroke="#3A2F24" strokeWidth="0.8" opacity="0.5"/>
        </>
      )}
    </svg>
  </div>
);

export default function PotteryGameSection({ onOpenDetail }: Props) {
  const [step, setStep] = useState<number>(0);
  const [selectedClay, setSelectedClay] = useState<ClayType | null>(null);
  const [selectedForming, setSelectedForming] = useState<FormingMethod | null>(null);
  const [selectedGlaze, setSelectedGlaze] = useState(craftData.glazes[0]);
  const [selectedTemp, setSelectedTemp] = useState<FiringTemperature | null>(null);
  const [isFiring, setIsFiring] = useState(false);
  const [result, setResult] = useState<PotteryResult | null>(null);
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);

  const steps = ['选泥料', '选成型', '选釉色', '定温度', '入窑烧'];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleFire = async () => {
    setIsFiring(true);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 3000));

    const potteryResult = firePottery({
      clay: selectedClay,
      formingMethod: selectedForming,
      glaze: selectedGlaze,
      temperature: selectedTemp,
    });

    setResult(potteryResult);
    setIsFiring(false);
  };

  const handleReset = () => {
    setStep(0);
    setSelectedClay(null);
    setSelectedForming(null);
    setSelectedGlaze(craftData.glazes[0]);
    setSelectedTemp(null);
    setResult(null);
    setIsFiring(false);
  };

  const handleViewDetail = () => {
    if (!result) return;
    onOpenDetail({
      type: 'pottery-result',
      id: result.id,
      title: `${result.qualityGrade}·${selectedGlaze?.name || ''}瓷`,
      subtitle: `评分 ${result.overallScore} 分`,
      description: result.story + '\n\n' + result.historicalReference,
      sections: [
        { title: '釉色效果', content: [result.glazeEffect] },
        { title: '色彩描述', content: [result.colorDescription] },
        { title: '器型品质', content: [result.shapeQuality] },
        { title: '独特性', content: [result.uniqueness] },
        { title: '工艺参数', content: result.features },
        ...(result.flaws.length > 0 ? [{
          title: '瑕疵记录',
          content: result.flaws.map(f => `${f.name}：${f.description}（${f.severity === 'minor' ? '轻微' : f.severity === 'major' ? '严重' : '致命'}）`)
        }] : []),
      ],
      color: result.overallScore >= 75 ? '#C9A962' : result.overallScore >= 60 ? '#8BA888' : '#A83232',
      bgColor: result.overallScore >= 75 ? '#F8F1DD' : result.overallScore >= 60 ? '#E6F0E6' : '#F8E6E6',
      imagePrompt: result.imagePrompt,
    });
  };

  const canProceed = () => {
    switch (step) {
      case 0: return selectedClay !== null;
      case 1: return selectedForming !== null;
      case 2: return selectedGlaze !== null;
      case 3: return selectedTemp !== null;
      default: return true;
    }
  };

  const gradeColors: Record<string, { bg: string; text: string; border: string }> = {
    '精品': { bg: '#FFF8E7', text: '#C9A962', border: '#C9A962' },
    '佳品': { bg: '#E8F0E8', text: '#8BA888', border: '#8BA888' },
    '合格品': { bg: '#E8F0F8', text: '#2C3E50', border: '#2C3E50' },
    '次品': { bg: '#FFF0E8', text: '#C97B48', border: '#C97B48' },
    '废品': { bg: '#F8E8E8', text: '#A83232', border: '#A83232' },
  };

  return (
    <section id="pottery-game" className="section-padding bg-gradient-to-b from-porcelain-scroll/30 to-porcelain-paper relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-porcelain-youlihong/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-porcelain-celadon/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-8 relative">
        <SectionTitle
          tag="SIMULATION · 伍"
          title="瓷火模拟"
          subtitle='"入窑一色，出窑万彩"。体验千年制瓷工艺，选择泥料、成型、釉色与温度，烧制属于你的专属瓷器'
        />

        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <div className="bg-porcelain-paper/80 rounded-2xl p-5 md:p-8 shadow-porcelain border border-porcelain-crackle/40 backdrop-blur-sm">
            <div className="flex items-start gap-3 mb-6">
              <SealLabel text="烧" size="md" />
              <div>
                <h3
                  className="font-serif text-xl md:text-2xl font-bold text-porcelain-inkbrown mb-1"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  陶瓷烧制模拟器
                </h3>
                <p className="text-sm text-porcelain-inkbrown/65 leading-relaxed max-w-3xl" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  选择不同的工艺参数，体验"一烧二装三土"的制瓷奥秘。温度、气氛、釉料的细微变化，都可能带来截然不同的结果，这就是火的艺术。
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {steps.map((s, idx) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      idx === step
                        ? 'bg-porcelain-youlihong text-white scale-110 shadow-lg'
                        : idx < step
                        ? 'bg-porcelain-celadon text-white'
                        : 'bg-porcelain-crackle/30 text-porcelain-inkbrown/40'
                    }`}
                  >
                    {idx < step ? <Check size={16} strokeWidth={2.5} /> : idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-8 md:w-16 h-0.5 mx-1 transition-colors duration-300 ${
                      idx < step ? 'bg-porcelain-celadon' : 'bg-porcelain-crackle/30'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="min-h-[400px]">
                {step === 0 && (
                  <div className="animate-fade-in">
                    <h4
                      className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <span className="w-2 h-2 rounded-full bg-porcelain-gold" />
                      第一步 · 选择泥料
                    </h4>
                    <div className="space-y-3">
                      {clayTypes.map((clay) => (
                        <button
                          key={clay.id}
                          onClick={() => setSelectedClay(clay)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedClay?.id === clay.id
                              ? 'border-porcelain-gold bg-porcelain-gold/10 shadow-md'
                              : 'border-porcelain-crackle/30 bg-porcelain-paper hover:border-porcelain-gold/50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-14 h-14 rounded-xl shadow-inner flex-shrink-0"
                              style={{
                                background: `linear-gradient(135deg, ${clay.color}ee, ${clay.color})`,
                                boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.3), inset 0 -2px 8px rgba(0,0,0,0.1)',
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span
                                  className="font-serif font-bold text-porcelain-inkbrown"
                                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                                >
                                  {clay.name}
                                </span>
                                {selectedClay?.id === clay.id && (
                                  <Check size={16} className="text-porcelain-gold flex-shrink-0" strokeWidth={2.5} />
                                )}
                              </div>
                              <p className="text-xs text-porcelain-inkbrown/65 line-clamp-1 mb-2">{clay.description}</p>
                              <div className="flex gap-3 flex-wrap">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-porcelain-inkbrown/5 text-porcelain-inkbrown/60">
                                  白度 {clay.properties.whiteness}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-porcelain-inkbrown/5 text-porcelain-inkbrown/60">
                                  可塑性 {clay.properties.plasticity}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-porcelain-inkbrown/5 text-porcelain-inkbrown/60">
                                  {clay.properties.firingRange[0]}-{clay.properties.firingRange[1]}°C
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="animate-fade-in">
                    <h4
                      className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <span className="w-2 h-2 rounded-full bg-porcelain-gold" />
                      第二步 · 选择成型方式
                    </h4>
                    <div className="space-y-3">
                      {formingMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedForming(method)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedForming?.id === method.id
                              ? 'border-porcelain-gold bg-porcelain-gold/10 shadow-md'
                              : 'border-porcelain-crackle/30 bg-porcelain-paper hover:border-porcelain-gold/50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-porcelain-scroll/50 flex items-center justify-center flex-shrink-0">
                              <FormingIcon type={method.icon} color={selectedForming?.id === method.id ? '#C9A962' : '#8BA888'} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span
                                  className="font-serif font-bold text-porcelain-inkbrown"
                                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                                >
                                  {method.name}
                                </span>
                                {selectedForming?.id === method.id && (
                                  <Check size={16} className="text-porcelain-gold flex-shrink-0" strokeWidth={2.5} />
                                )}
                              </div>
                              <p className="text-xs text-porcelain-inkbrown/65 line-clamp-1 mb-2">{method.description}</p>
                              <div className="flex gap-2 flex-wrap">
                                {method.typicalShapes.slice(0, 3).map((shape) => (
                                  <span key={shape} className="text-[10px] px-2 py-0.5 rounded bg-porcelain-celadon/10 text-porcelain-celadon">
                                    {shape}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          {selectedForming?.id === method.id && (
                            <div className="mt-3 pt-3 border-t border-porcelain-crackle/20 space-y-1.5">
                              <ProgressBar value={method.properties.regularity} label="规整度" color="#2C3E50" />
                              <ProgressBar value={method.properties.artistry} label="艺术性" color="#A83232" />
                              <ProgressBar value={method.properties.uniqueness} label="独特性" color="#C9A962" />
                              <ProgressBar value={method.properties.difficulty} label="难度" color="#8BA888" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-fade-in">
                    <h4
                      className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <span className="w-2 h-2 rounded-full bg-porcelain-gold" />
                      第三步 · 选择釉色
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {craftData.glazes.map((glaze) => (
                        <button
                          key={glaze.name}
                          onClick={() => setSelectedGlaze(glaze)}
                          className={`group relative flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300 ${
                            selectedGlaze?.name === glaze.name
                              ? 'border-porcelain-gold bg-porcelain-gold/10 shadow-md scale-105'
                              : 'border-porcelain-crackle/30 bg-porcelain-paper hover:border-porcelain-gold/50 hover:-translate-y-0.5'
                          }`}
                        >
                          <div
                            className="w-12 h-12 rounded-full mb-2 shadow-inner transition-transform group-hover:scale-110"
                            style={{
                              background: `linear-gradient(135deg, ${glaze.lightColor}, ${glaze.color})`,
                              boxShadow: `inset 0 2px 8px rgba(255,255,255,0.3), inset 0 -2px 8px rgba(0,0,0,0.15)`,
                            }}
                          />
                          <span
                            className="font-serif text-xs font-bold"
                            style={{ fontFamily: '"Noto Serif SC", serif', color: glaze.color }}
                          >
                            {glaze.name}
                          </span>
                          <span className="text-[9px] text-porcelain-inkbrown/50 mt-0.5">
                            {glaze.era.split('，')[0]}
                          </span>
                          {selectedGlaze?.name === glaze.name && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-porcelain-gold text-white flex items-center justify-center">
                              <Check size={12} strokeWidth={2.5} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    {selectedGlaze && (
                      <div className="mt-4 p-4 rounded-xl bg-porcelain-scroll/30 border border-porcelain-crackle/30">
                        <p className="text-sm text-porcelain-inkbrown/75 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          {selectedGlaze.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="animate-fade-in">
                    <h4
                      className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <span className="w-2 h-2 rounded-full bg-porcelain-gold" />
                      第四步 · 确定烧制温度
                    </h4>
                    <div className="space-y-3">
                      {firingTemperatures.map((temp) => (
                        <button
                          key={temp.id}
                          onClick={() => setSelectedTemp(temp)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedTemp?.id === temp.id
                              ? 'border-porcelain-gold bg-porcelain-gold/10 shadow-md'
                              : 'border-porcelain-crackle/30 bg-porcelain-paper hover:border-porcelain-gold/50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${temp.color}20` }}
                            >
                              <Flame size={24} style={{ color: temp.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="font-serif font-bold text-porcelain-inkbrown"
                                    style={{ fontFamily: '"Noto Serif SC", serif' }}
                                  >
                                    {temp.name}
                                  </span>
                                  <span className="text-xs font-bold" style={{ color: temp.color }}>
                                    {temp.range[0]}-{temp.range[1]}°C
                                  </span>
                                </div>
                                {selectedTemp?.id === temp.id && (
                                  <Check size={16} className="text-porcelain-gold flex-shrink-0" strokeWidth={2.5} />
                                )}
                              </div>
                              <p className="text-xs text-porcelain-inkbrown/65 line-clamp-1 mb-2">{temp.description}</p>
                              {selectedClay && (
                                <span className={`text-[10px] px-2 py-0.5 rounded ${
                                  temp.range[0] >= selectedClay.properties.firingRange[0] &&
                                  temp.range[1] <= selectedClay.properties.firingRange[1]
                                    ? 'bg-porcelain-celadon/15 text-porcelain-celadon'
                                    : 'bg-porcelain-youlihong/15 text-porcelain-youlihong'
                                }`}>
                                  {temp.range[0] >= selectedClay.properties.firingRange[0] &&
                                   temp.range[1] <= selectedClay.properties.firingRange[1]
                                    ? '✓ 匹配泥料烧成温度'
                                    : '⚠ 温度不匹配，风险较高'}
                                </span>
                              )}
                            </div>
                          </div>
                          {selectedTemp?.id === temp.id && (
                            <div className="mt-3 pt-3 border-t border-porcelain-crackle/20 space-y-1.5">
                              <ProgressBar value={temp.properties.porcelainization} label="瓷化度" color="#2C3E50" />
                              <ProgressBar value={temp.properties.hardness} label="硬度" color="#8BA888" />
                              <ProgressBar value={temp.properties.glazeVibrancy} label="釉色鲜艳" color="#C9A962" />
                              <ProgressBar value={temp.properties.riskFactor} label="风险" color="#A83232" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="animate-fade-in text-center">
                    <h4
                      className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center justify-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <span className="w-2 h-2 rounded-full bg-porcelain-youlihong animate-pulse" />
                      第五步 · 入窑烧制
                      <span className="w-2 h-2 rounded-full bg-porcelain-youlihong animate-pulse" />
                    </h4>

                    <div className="bg-gradient-to-br from-porcelain-scroll/50 to-porcelain-paper rounded-xl p-6 mb-6">
                      <h5
                        className="font-serif font-bold text-porcelain-inkbrown mb-4"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        您的烧制方案
                      </h5>
                      <div className="grid grid-cols-2 gap-3 text-left">
                        <div className="p-3 bg-porcelain-paper rounded-lg">
                          <span className="text-[10px] text-porcelain-inkbrown/50">泥料</span>
                          <p className="font-serif text-sm font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                            {selectedClay?.name}
                          </p>
                        </div>
                        <div className="p-3 bg-porcelain-paper rounded-lg">
                          <span className="text-[10px] text-porcelain-inkbrown/50">成型</span>
                          <p className="font-serif text-sm font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                            {selectedForming?.name}
                          </p>
                        </div>
                        <div className="p-3 bg-porcelain-paper rounded-lg">
                          <span className="text-[10px] text-porcelain-inkbrown/50">釉色</span>
                          <p
                            className="font-serif text-sm font-bold"
                            style={{ fontFamily: '"Noto Serif SC", serif', color: selectedGlaze?.color }}
                          >
                            {selectedGlaze?.name}
                          </p>
                        </div>
                        <div className="p-3 bg-porcelain-paper rounded-lg">
                          <span className="text-[10px] text-porcelain-inkbrown/50">温度</span>
                          <p
                            className="font-serif text-sm font-bold"
                            style={{ fontFamily: '"Noto Serif SC", serif', color: selectedTemp?.color }}
                          >
                            {selectedTemp?.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <KilnAnimation isFiring={isFiring} />

                    {!result && !isFiring && (
                      <button
                        onClick={handleFire}
                        className="mt-4 px-8 py-3 bg-gradient-to-r from-porcelain-youlihong to-porcelain-youlihong/80 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
                      >
                        <Flame size={18} className="animate-pulse" />
                        <span style={{ fontFamily: '"Noto Serif SC", serif' }}>点火入窑</span>
                        <Play size={16} />
                      </button>
                    )}

                    {isFiring && (
                      <div className="mt-4">
                        <div className="w-full h-2 bg-porcelain-crackle/30 rounded-full overflow-hidden mb-2">
                          <div className="h-full bg-gradient-to-r from-porcelain-youlihong to-porcelain-gold rounded-full animate-pulse" style={{ width: '100%' }} />
                        </div>
                        <p className="text-sm text-porcelain-inkbrown/60" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          三天三夜，烈火淬炼...
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-porcelain-scroll/40 to-porcelain-paper rounded-xl p-6 border border-porcelain-crackle/30">
                {!result ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    {step === 0 && (
                      <>
                        <div className="w-24 h-24 rounded-full bg-porcelain-crackle/20 flex items-center justify-center mb-4">
                          <svg viewBox="0 0 100 100" className="w-14 h-14">
                            <circle cx="50" cy="50" r="40" fill="#F5F1E8" stroke="#C4A484" strokeWidth="2"/>
                            <path d="M30 30 Q50 20 70 30 Q70 50 50 55 Q30 50 30 30" fill="#E8E4D8"/>
                          </svg>
                        </div>
                        <h5
                          className="font-serif text-lg font-bold text-porcelain-inkbrown mb-2"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          选料如选骨
                        </h5>
                        <p className="text-sm text-porcelain-inkbrown/60 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          "一土二窑"，优质的瓷土是好瓷的基础。不同的泥料决定了瓷器的胎质、白度和透光度。
                        </p>
                      </>
                    )}
                    {step === 1 && (
                      <>
                        <div className="w-24 h-24 rounded-full bg-porcelain-crackle/20 flex items-center justify-center mb-4">
                          <FormingIcon type={selectedForming?.icon || 'wheel'} color="#8BA888" />
                        </div>
                        <h5
                          className="font-serif text-lg font-bold text-porcelain-inkbrown mb-2"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          成型如造形
                        </h5>
                        <p className="text-sm text-porcelain-inkbrown/60 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          或拉坯、或捏塑、或注浆，不同的成型方式赋予器物不同的灵魂。手工之美，在于独一无二。
                        </p>
                        {selectedForming && (
                          <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {selectedForming.typicalShapes.map((shape) => (
                              <span key={shape} className="px-3 py-1 rounded-full bg-porcelain-celadon/15 text-porcelain-celadon text-xs">
                                {shape}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    {step === 2 && selectedGlaze && (
                      <>
                        <div
                          className="w-28 h-28 rounded-full shadow-2xl mb-4"
                          style={{
                            background: `radial-gradient(circle at 30% 30%, ${selectedGlaze.lightColor}ff, ${selectedGlaze.color}), ${selectedGlaze.color}`,
                            boxShadow: `0 20px 60px ${selectedGlaze.color}40, inset 0 4px 16px rgba(255,255,255,0.4), inset 0 -4px 16px rgba(0,0,0,0.15)`,
                          }}
                        />
                        <h5
                          className="font-serif text-lg font-bold mb-2"
                          style={{ fontFamily: '"Noto Serif SC", serif', color: selectedGlaze.color }}
                        >
                          {selectedGlaze.name}
                        </h5>
                        <p className="text-sm text-porcelain-inkbrown/60 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          {selectedGlaze.description.split('。')[0]}。
                        </p>
                        <p className="text-xs text-porcelain-inkbrown/50 mt-2">{selectedGlaze.era}</p>
                      </>
                    )}
                    {step === 3 && selectedTemp && (
                      <>
                        <div
                          className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                          style={{ backgroundColor: `${selectedTemp.color}15` }}
                        >
                          <Flame size={40} style={{ color: selectedTemp.color }} className="animate-pulse" />
                        </div>
                        <h5
                          className="font-serif text-lg font-bold mb-2"
                          style={{ fontFamily: '"Noto Serif SC", serif', color: selectedTemp.color }}
                        >
                          {selectedTemp.name} · {selectedTemp.range[0]}-{selectedTemp.range[1]}°C
                        </h5>
                        <p className="text-sm text-porcelain-inkbrown/60 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          {selectedTemp.description}
                        </p>
                        <div className="mt-4 text-xs text-porcelain-inkbrown/50 flex items-center justify-center gap-1">
                          <AlertTriangle size={12} />
                          <span>风险系数：{selectedTemp.properties.riskFactor}%</span>
                        </div>
                      </>
                    )}
                    {step === 4 && !result && (
                      <>
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-porcelain-gold/20 to-porcelain-youlihong/20 flex items-center justify-center mb-4">
                          <Sparkles size={40} className="text-porcelain-gold" />
                        </div>
                        <h5
                          className="font-serif text-lg font-bold text-porcelain-inkbrown mb-2"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          万事俱备，只欠东风
                        </h5>
                        <p className="text-sm text-porcelain-inkbrown/60 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          点击"点火入窑"，让烈火检验您的匠心。三分人力七分火，期待奇迹的诞生！
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <div className="text-center mb-4">
                      <div
                        className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-3"
                        style={{
                          backgroundColor: gradeColors[result.qualityGrade].bg,
                          color: gradeColors[result.qualityGrade].text,
                          border: `2px solid ${gradeColors[result.qualityGrade].border}`,
                          fontFamily: '"Noto Serif SC", serif',
                        }}
                      >
                        {result.qualityGrade} · {result.overallScore} 分
                      </div>
                    </div>

                    <ResultVase result={result} />

                    <div className="text-center mb-4">
                      <p className="text-sm text-porcelain-inkbrown/75 leading-relaxed mb-3" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                        {result.story}
                      </p>
                      <p className="text-xs text-porcelain-inkbrown/50 italic" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                        "{result.historicalReference}"
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      {result.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-porcelain-inkbrown/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-porcelain-gold" />
                          <span style={{ fontFamily: '"Noto Serif SC", serif' }}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {result.flaws.length > 0 && (
                      <div className="p-3 rounded-lg bg-porcelain-youlihong/10 border border-porcelain-youlihong/20 mb-4">
                        <div className="flex items-center gap-1.5 mb-2">
                          <AlertTriangle size={12} className="text-porcelain-youlihong" />
                          <span className="text-xs font-bold text-porcelain-youlihong">瑕疵记录</span>
                        </div>
                        <div className="space-y-1">
                          {result.flaws.map((flaw, idx) => (
                            <div key={idx} className="text-[11px] text-porcelain-inkbrown/65 flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                flaw.severity === 'minor' ? 'bg-porcelain-gold' :
                                flaw.severity === 'major' ? 'bg-porcelain-youlihong/70' : 'bg-porcelain-youlihong'
                              }`} />
                              <span>{flaw.name}：{flaw.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleViewDetail}
                        className="flex-1 px-4 py-2.5 bg-porcelain-gold/15 text-porcelain-gold rounded-lg font-bold text-sm hover:bg-porcelain-gold/25 transition-colors flex items-center justify-center gap-1.5"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        <Sparkles size={14} />
                        查看详情
                      </button>
                      <button
                        onClick={handleReset}
                        className="flex-1 px-4 py-2.5 bg-porcelain-inkbrown/10 text-porcelain-inkbrown/75 rounded-lg font-bold text-sm hover:bg-porcelain-inkbrown/15 transition-colors flex items-center justify-center gap-1.5"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        <RotateCcw size={14} />
                        再来一窑
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-porcelain-crackle/20">
              <button
                onClick={handlePrev}
                disabled={step === 0 || isFiring}
                className="px-6 py-2.5 rounded-xl border-2 border-porcelain-crackle/40 text-porcelain-inkbrown/65 font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-porcelain-inkbrown/30 hover:text-porcelain-inkbrown transition-all"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                上一步
              </button>
              <div className="text-xs text-porcelain-inkbrown/40 flex items-center">
                第 {step + 1} / {steps.length} 步
              </div>
              {step < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed() || isFiring}
                  className="px-6 py-2.5 rounded-xl bg-porcelain-ji-blue text-white font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-porcelain-ji-blue/90 transition-all shadow-md hover:shadow-lg"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  下一步
                </button>
              ) : (
                <div className="w-20" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
