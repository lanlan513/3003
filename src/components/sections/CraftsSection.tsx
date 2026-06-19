import { useState } from 'react';
import { Pickaxe, Flame, Wind, Brush, Eye, Info, Network } from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import SealLabel from '@/components/common/SealLabel';
import KnowledgeGraph from '@/components/common/KnowledgeGraph';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { craftData } from '@/data/crafts';
import type { CraftStep, GlazeColor, DetailData } from '@/types';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

const stepIcons: Record<string, JSX.Element> = {
  pickaxe: <Pickaxe size={20} strokeWidth={1.8} />,
  knead: <Wind size={20} strokeWidth={1.8} />,
  wheel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="9"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 3 L12 5 M12 19 L12 21 M3 12 L5 12 M19 12 L21 12"/>
    </svg>
  ),
  carve: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  glaze: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2 L12 10 Q8 12 8 17 Q8 21 12 21 Q16 21 16 17 Q16 12 12 10"/>
      <path d="M12 5 Q13 7 12 9"/>
    </svg>
  ),
  brush: <Brush size={20} strokeWidth={1.8} />,
  kiln: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M5 8 L19 8 L19 20 L5 20 Z"/>
      <path d="M9 8 L9 4 L15 4 L15 8"/>
      <path d="M9 14 L15 14"/>
      <rect x="10" y="16" width="4" height="4" rx="0.5"/>
    </svg>
  ),
  fire: <Flame size={20} strokeWidth={1.8} />,
  inspect: <Eye size={20} strokeWidth={1.8} />,
};

export default function CraftsSection({ onOpenDetail }: Props) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedGlaze, setSelectedGlaze] = useState<GlazeColor | null>(craftData.glazes[0]);
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);

  const handleStepClick = (step: CraftStep) => {
    setActiveStep(step.step);
    onOpenDetail({
      type: 'craft',
      id: step.id,
      title: `第${step.step}步 · ${step.title}`,
      subtitle: craftData.name,
      description: step.description + '\n\n' + step.details,
      sections: [
        { title: '技术要点', content: [step.details] },
        { title: '匠人经验', content: [step.tips] },
      ],
      color: '#C9A962',
      bgColor: '#F8F1DD',
      imagePrompt: 'Traditional Chinese porcelain making process, showing ' + step.title + ', craftsman hands working, Jingdezhen workshop atmosphere, warm lighting',
    });
  };

  const handleGlazeClick = (glaze: GlazeColor) => {
    setSelectedGlaze(glaze);
  };

  const activeStepData = craftData.steps.find((s) => s.step === activeStep);

  return (
    <section id="crafts" className="section-padding bg-porcelain-paper relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-porcelain-scroll/60 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative">
        <SectionTitle
          tag="CRAFTS · 肆"
          title="烧制工艺"
          subtitle='"过手七十二，方克成器"。从采石到出窑，每一道工序都是匠心与火的艺术，千年传承不息'
        />

        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <div className="bg-porcelain-scroll/50 rounded-2xl p-5 md:p-8 mb-12 shadow-porcelain border border-porcelain-crackle/40">
            <div className="flex items-start gap-3 mb-6">
              <SealLabel text="技" size="md" />
              <div>
                <h3
                  className="font-serif text-xl md:text-2xl font-bold text-porcelain-inkbrown mb-1"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  {craftData.name}
                </h3>
                <p className="text-sm text-porcelain-inkbrown/65 leading-relaxed max-w-3xl" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  {craftData.description}
                </p>
              </div>
            </div>

            <div className="relative mb-10 mt-10">
              <div className="hidden md:block absolute top-[34px] left-12 right-12 h-1 bg-gradient-to-r from-porcelain-celadon/40 via-porcelain-gold/60 to-porcelain-youlihong/40 rounded-full" />

              <div className="grid grid-cols-3 md:grid-cols-9 gap-3 md:gap-2">
                {craftData.steps.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step)}
                    className={`group relative flex flex-col items-center transition-all duration-300 ${
                      isVisible ? 'animate-fade-in-up' : ''
                    }`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div
                      className={`relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                        activeStep === step.step
                          ? 'bg-porcelain-youlihong border-porcelain-youlihong text-white scale-110 shadow-lg animate-glow-pulse'
                          : 'bg-porcelain-paper border-porcelain-crackle/50 text-porcelain-inkbrown/60 hover:border-porcelain-gold hover:text-porcelain-gold hover:scale-105'
                      }`}
                    >
                      <div className="transform">{stepIcons[step.icon]}</div>
                      {activeStep === step.step && (
                        <div className="absolute -bottom-1 w-6 h-6 rounded-full bg-porcelain-paper flex items-center justify-center border-2 border-porcelain-youlihong text-porcelain-youlihong text-[10px] font-bold" style={{ transform: 'translateY(50%)' }}>
                          {step.step}
                        </div>
                      )}
                    </div>
                    <div
                      className={`mt-3 md:mt-4 text-center transition-colors ${
                        activeStep === step.step ? 'text-porcelain-youlihong' : 'text-porcelain-inkbrown/65 group-hover:text-porcelain-inkbrown'
                      }`}
                    >
                      <div
                        className="font-serif text-xs md:text-sm font-bold whitespace-nowrap"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        {step.title}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {activeStepData && (
              <div
                key={activeStepData.id}
                className="grid grid-cols-1 md:grid-cols-5 gap-6 bg-porcelain-paper rounded-xl p-5 md:p-6 border border-porcelain-crackle/30 animate-fade-in"
              >
                <div className="md:col-span-2 flex items-center justify-center bg-gradient-to-br from-porcelain-scroll/60 to-porcelain-gold/10 rounded-xl p-6">
                  <div
                    className={`w-28 h-28 rounded-2xl flex items-center justify-center transition-all ${
                      activeStep === craftData.steps.length
                        ? 'text-porcelain-youlihong'
                        : activeStep > craftData.steps.length / 2
                        ? 'text-porcelain-celadon'
                        : 'text-porcelain-ji-blue'
                    }`}
                    style={{
                      backgroundColor: activeStep === craftData.steps.length
                        ? '#A8323220'
                        : activeStep > craftData.steps.length / 2
                        ? '#8BA88820'
                        : '#2C3E5015',
                    }}
                  >
                    <div className="scale-[2.5]">{stepIcons[activeStepData.icon]}</div>
                  </div>
                </div>

                <div className="md:col-span-3">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                      style={{
                        backgroundColor: activeStep === craftData.steps.length
                          ? '#A83232'
                          : activeStep > craftData.steps.length / 2
                          ? '#8BA888'
                          : '#2C3E50',
                      }}
                    >
                      {activeStepData.step}
                    </span>
                    <div>
                      <h4
                        className="font-serif text-xl font-bold text-porcelain-inkbrown"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        {activeStepData.title}
                      </h4>
                      <p className="text-xs text-porcelain-inkbrown/55">{activeStepData.description}</p>
                    </div>
                  </div>

                  <p className="text-sm text-porcelain-inkbrown/75 leading-relaxed mb-4 line-clamp-3" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    {activeStepData.details}
                  </p>

                  <div className="flex gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-porcelain-gold/15 text-porcelain-gold/90 text-xs font-medium">
                      <Info size={12} strokeWidth={2} />
                      匠人经验
                    </span>
                    <p className="text-xs text-porcelain-inkbrown/70 leading-relaxed flex-1 min-w-[200px] italic" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      "{activeStepData.tips}"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="w-12 h-px bg-porcelain-youlihong/50" />
            <h3
              className="font-serif text-xl md:text-2xl font-bold text-porcelain-inkbrown flex items-center gap-2"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              <span className="w-3 h-3 rounded-full bg-porcelain-youlihong shadow-seal" />
              釉色图谱
              <span className="w-3 h-3 rounded-full bg-porcelain-celadon shadow-md" />
            </h3>
            <span className="w-12 h-px bg-porcelain-celadon/50" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4 mb-6">
            {craftData.glazes.map((glaze, idx) => (
              <button
                key={glaze.name}
                onClick={() => handleGlazeClick(glaze)}
                className={`group relative flex flex-col items-center transition-all duration-300 porcelain-card p-3 overflow-hidden ${
                  selectedGlaze?.name === glaze.name
                    ? 'ring-2 ring-offset-2 scale-105 shadow-porcelain-lg'
                    : 'hover:-translate-y-1'
                } ${isVisible ? 'animate-fade-in-up' : ''}`}
                style={{
                  animationDelay: `${idx * 0.05}s`,
                  boxShadow: selectedGlaze?.name === glaze.name
                    ? `0 0 0 2px ${glaze.color}, 0 0 0 4px #FAF7F0, 0 12px 40px rgba(44, 62, 80, 0.18)`
                    : undefined,
                }}
              >
                <div
                  className={`w-full aspect-square rounded-lg mb-3 shadow-inner transition-transform duration-500 group-hover:scale-105 ${
                    selectedGlaze?.name === glaze.name ? 'animate-glow-pulse' : ''
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${glaze.lightColor}, ${glaze.color})`,
                    boxShadow: `inset 0 2px 8px rgba(255,255,255,0.3), inset 0 -2px 8px rgba(0,0,0,0.1)`,
                  }}
                />
                <div
                  className="font-serif text-sm font-bold"
                  style={{ fontFamily: '"Noto Serif SC", serif', color: glaze.color }}
                >
                  {glaze.name}
                </div>
                <div className="text-[10px] text-porcelain-inkbrown/50 mt-0.5">
                  {glaze.era.split('，')[0]}
                </div>
              </button>
            ))}
          </div>

          {selectedGlaze && (
            <div
              key={selectedGlaze.name}
              className="bg-porcelain-scroll/40 rounded-xl p-5 md:p-6 border border-porcelain-crackle/40 grid grid-cols-1 md:grid-cols-6 gap-6 animate-fade-in"
            >
              <div className="md:col-span-2 flex items-center justify-center">
                <div
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full shadow-2xl"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${selectedGlaze.lightColor}ff, ${selectedGlaze.color}), ${selectedGlaze.color}`,
                    boxShadow: `0 20px 60px ${selectedGlaze.color}50, inset 0 4px 16px rgba(255,255,255,0.4), inset 0 -4px 16px rgba(0,0,0,0.15)`,
                  }}
                />
              </div>
              <div className="md:col-span-4">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h4
                    className="font-serif text-2xl md:text-3xl font-bold"
                    style={{ fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif', color: selectedGlaze.color }}
                  >
                    {selectedGlaze.name}
                  </h4>
                  <SealLabel text="釉" size="sm" />
                  <span className="text-xs text-porcelain-inkbrown/55">{selectedGlaze.era}</span>
                </div>
                <p className="text-sm md:text-base text-porcelain-inkbrown/80 leading-relaxed mb-4" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  {selectedGlaze.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-porcelain-paper border border-porcelain-crackle/40 text-xs text-porcelain-inkbrown/70">
                    <span
                      className="w-3 h-3 rounded-full shadow-inner"
                      style={{ backgroundColor: selectedGlaze.color }}
                    />
                    配方：{selectedGlaze.formula.split('，')[0]}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-16 mb-6 flex items-center justify-center gap-3">
          <span className="w-12 h-px bg-porcelain-gold/50" />
          <h3
            className="font-serif text-xl md:text-2xl font-bold text-porcelain-inkbrown flex items-center gap-2"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            <Network size={22} className="text-porcelain-gold" />
            陶瓷知识关系图谱
            <span className="w-3 h-3 rounded-full bg-porcelain-gold shadow-md" />
          </h3>
          <span className="w-12 h-px bg-porcelain-youlihong/50" />
        </div>

        <div
          className={`reveal ${isVisible ? 'is-visible' : ''} bg-porcelain-scroll/30 rounded-2xl p-4 md:p-6 border border-porcelain-crackle/40 shadow-porcelain`}
        >
          <div className="flex items-start gap-3 mb-4">
            <SealLabel text="络" size="md" />
            <div>
              <h4
                className="font-serif text-lg md:text-xl font-bold text-porcelain-inkbrown mb-1"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                中华陶瓷知识网络
              </h4>
              <p className="text-sm text-porcelain-inkbrown/65 leading-relaxed max-w-3xl" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                朝代、窑口、工艺、纹样、器型、釉色——六维知识交织成网。点击任意节点探索关联，跟随推荐路径穿越千年陶瓷文明。
              </p>
            </div>
          </div>
          <KnowledgeGraph onOpenDetail={onOpenDetail} />
        </div>
      </div>
    </section>
  );
}
