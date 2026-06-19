import { useState, useCallback } from 'react';
import { Search, Eye, Lightbulb, Check, X, RotateCcw, Play, Award, BookOpen, ChevronRight, HelpCircle, Star } from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import SealLabel from '@/components/common/SealLabel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ceramicDetectiveCases, kilnOptions, dynastyOptions, difficultyLabels } from '@/data/ceramicDetective';
import type { CeramicCase, DetectiveState, DetailData } from '@/types';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

const clueTypeIcons: Record<string, JSX.Element> = {
  glaze: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2 L12 10 Q8 12 8 17 Q8 21 12 21 Q16 21 16 17 Q16 12 12 10"/>
      <path d="M12 5 Q13 7 12 9"/>
    </svg>
  ),
  pattern: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M4 4 L20 20"/>
      <path d="M20 4 L4 20"/>
      <circle cx="12" cy="12" r="8"/>
    </svg>
  ),
  shape: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M4 8 L20 8 L20 16 L4 16 Z"/>
      <path d="M4 8 Q12 4 20 8"/>
      <path d="M4 16 Q12 20 20 16"/>
    </svg>
  ),
  era: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="8"/>
      <path d="M12 6 L12 12 L16 14"/>
    </svg>
  ),
  base: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <ellipse cx="12" cy="18" rx="6" ry="2"/>
      <path d="M6 18 L6 10 Q6 6 12 6 Q18 6 18 10 L18 18"/>
    </svg>
  ),
  technique: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
};

const clueTypeLabels: Record<string, string> = {
  glaze: '釉色',
  pattern: '纹饰',
  shape: '器型',
  era: '年代',
  base: '底足',
  technique: '工艺',
};

const DifficultyStars = ({ level }: { level: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={14}
        fill={i <= level ? '#C9A962' : 'none'}
        className={i <= level ? 'text-porcelain-gold' : 'text-porcelain-crackle/40'}
      />
    ))}
  </div>
);

export default function CeramicDetectiveSection({ onOpenDetail }: Props) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);
  
  const [state, setState] = useState<DetectiveState>({
    currentCase: null,
    phase: 'intro',
    revealedClues: [],
    guessKiln: '',
    guessDynasty: '',
    score: 0,
    totalCases: 0,
    correctCases: 0,
    showHint: false,
  });

  const startNewCase = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * ceramicDetectiveCases.length);
    const selectedCase = ceramicDetectiveCases[randomIndex];
    
    setState((prev) => ({
      ...prev,
      currentCase: selectedCase,
      phase: 'investigating',
      revealedClues: [],
      guessKiln: '',
      guessDynasty: '',
      showHint: false,
    }));
  }, []);

  const revealClue = useCallback((index: number) => {
    setState((prev) => {
      if (prev.revealedClues.includes(index)) return prev;
      return {
        ...prev,
        revealedClues: [...prev.revealedClues, index],
      };
    });
  }, []);

  const startGuessing = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: 'guessing',
    }));
  }, []);

  const submitGuess = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: 'result',
      totalCases: prev.totalCases + 1,
      correctCases: prev.correctCases + (
        prev.guessKiln === prev.currentCase?.kiln && 
        prev.guessDynasty === prev.currentCase?.dynasty ? 1 : 0
      ),
      score: prev.score + Math.max(0, 100 - prev.revealedClues.length * 15) * (
        prev.guessKiln === prev.currentCase?.kiln && 
        prev.guessDynasty === prev.currentCase?.dynasty ? 1 : 0
      ),
    }));
  }, []);

  const toggleHint = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showHint: !prev.showHint,
    }));
  }, []);

  const handleOpenKnowledge = useCallback((title: string, content: string, color: string) => {
    onOpenDetail({
      type: 'detective-knowledge',
      id: `knowledge-${Date.now()}`,
      title,
      subtitle: '陶瓷鉴定知识',
      description: content,
      sections: [
        { title: '知识要点', content: [content] },
      ],
      color,
      bgColor: '#FAF7F0',
      imagePrompt: 'Ancient Chinese ceramic knowledge illustration, traditional scroll painting style, elegant scholarly atmosphere',
    });
  }, [onOpenDetail]);

  const handleOpenCaseAnalysis = useCallback((caseData: CeramicCase) => {
    onOpenDetail({
      type: 'detective-case',
      id: caseData.id,
      title: `${caseData.name} · 完整解析`,
      subtitle: `${caseData.dynasty} · ${caseData.kiln}`,
      description: `这件${caseData.dynasty}${caseData.kiln}${caseData.name}是中国陶瓷史上的经典之作。`,
      sections: [
        { title: '推理过程', content: caseData.analysis.reasoning },
        { title: '关键证据', content: caseData.analysis.keyEvidence },
        { title: '常见误区', content: caseData.analysis.commonMistakes },
      ],
      color: caseData.color,
      bgColor: '#FAF7F0',
      imagePrompt: caseData.imagePrompt,
    });
  }, [onOpenDetail]);

  const calculateScore = () => {
    if (!state.currentCase) return { kilnCorrect: false, dynastyCorrect: false, score: 0 };
    const kilnCorrect = state.guessKiln === state.currentCase.kiln;
    const dynastyCorrect = state.guessDynasty === state.currentCase.dynasty;
    const baseScore = Math.max(0, 100 - state.revealedClues.length * 15);
    const score = (kilnCorrect && dynastyCorrect) ? baseScore : 0;
    return { kilnCorrect, dynastyCorrect, score };
  };

  const { ref: introRef, isVisible: introVisible } = useScrollAnimation<HTMLDivElement>(0.1);
  const { ref: gameRef, isVisible: gameVisible } = useScrollAnimation<HTMLDivElement>(0.1);

  return (
    <section id="detective" className="section-padding bg-gradient-to-b from-porcelain-paper to-porcelain-scroll/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-porcelain-gold/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-porcelain-youlihong/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative">
        <SectionTitle
          tag="DETECTIVE · 玖"
          title="陶瓷侦探"
          subtitle='"观其釉色，辨其胎质，审其纹饰，察其款识"。化身陶瓷侦探，从蛛丝马迹中推断文物的前世今生，在推理中学习陶瓷鉴定知识。'
        />

        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          {state.phase === 'intro' && (
            <div ref={introRef} className={`reveal ${introVisible ? 'is-visible' : ''}`}>
              <div className="bg-porcelain-scroll/50 rounded-2xl p-6 md:p-10 shadow-porcelain border border-porcelain-crackle/40 max-w-4xl mx-auto">
                <div className="flex items-start gap-4 mb-8">
                  <SealLabel text="探" size="lg" />
                  <div>
                    <h2
                      className="font-serif text-2xl md:text-3xl font-bold text-porcelain-inkbrown mb-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      欢迎来到陶瓷侦探学院
                    </h2>
                    <p className="text-sm md:text-base text-porcelain-inkbrown/70 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      在这里，你将化身一名陶瓷鉴定专家。系统会随机生成一件"未知来源"的陶瓷，
                      你需要通过观察釉色、纹饰、器型、底足等线索，逐步分析并推断其所属窑口和时代。
                      每揭示一条线索，你的最终得分就会相应减少。挑战自己，用最少的线索揭开真相！
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-porcelain-paper rounded-xl p-5 border border-porcelain-crackle/30">
                    <div className="w-12 h-12 rounded-full bg-porcelain-celadon/20 flex items-center justify-center mb-3 text-porcelain-celadon">
                      <Search size={24} />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-porcelain-inkbrown mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      发现线索
                    </h3>
                    <p className="text-xs text-porcelain-inkbrown/65 leading-relaxed">
                      从釉色、纹饰、器型、底足、工艺等多个维度观察文物，收集关键线索。
                    </p>
                  </div>

                  <div className="bg-porcelain-paper rounded-xl p-5 border border-porcelain-crackle/30">
                    <div className="w-12 h-12 rounded-full bg-porcelain-gold/20 flex items-center justify-center mb-3 text-porcelain-gold">
                      <Lightbulb size={24} />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-porcelain-inkbrown mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      推理判断
                    </h3>
                    <p className="text-xs text-porcelain-inkbrown/65 leading-relaxed">
                      综合分析收集到的线索，运用你的陶瓷知识，推断文物的窑口和年代。
                    </p>
                  </div>

                  <div className="bg-porcelain-paper rounded-xl p-5 border border-porcelain-crackle/30">
                    <div className="w-12 h-12 rounded-full bg-porcelain-youlihong/20 flex items-center justify-center mb-3 text-porcelain-youlihong">
                      <BookOpen size={24} />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-porcelain-inkbrown mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      学习知识
                    </h3>
                    <p className="text-xs text-porcelain-inkbrown/65 leading-relaxed">
                      推理结束后，系统将给出完整的解析过程和相关知识点，在游戏中学习。
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={startNewCase}
                    className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-porcelain-youlihong to-porcelain-gold text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <Play size={20} />
                    开始侦探之旅
                  </button>

                  {state.totalCases > 0 && (
                    <div className="flex items-center gap-6 text-sm text-porcelain-inkbrown/65">
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-porcelain-gold" />
                        <span>总分：{state.score}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check size={16} className="text-porcelain-celadon" />
                        <span>正确率：{state.totalCases > 0 ? Math.round((state.correctCases / state.totalCases) * 100) : 0}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {(state.phase === 'investigating' || state.phase === 'guessing' || state.phase === 'result') && state.currentCase && (
            <div ref={gameRef} className={`reveal ${gameVisible ? 'is-visible' : ''}`}>
              <div className="bg-porcelain-scroll/50 rounded-2xl p-5 md:p-8 shadow-porcelain border border-porcelain-crackle/40">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <SealLabel text="案" size="md" />
                    <div>
                      <h3
                        className="font-serif text-xl md:text-2xl font-bold text-porcelain-inkbrown"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        神秘陶瓷鉴定案
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <DifficultyStars level={state.currentCase.difficulty} />
                        <span className="text-xs text-porcelain-inkbrown/55">
                          难度：{difficultyLabels[state.currentCase.difficulty]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-sm text-porcelain-inkbrown/65">
                      已揭示线索：<span className="font-bold text-porcelain-gold">{state.revealedClues.length}</span> / {state.currentCase.clues.length}
                    </div>
                    <button
                      onClick={toggleHint}
                      className="p-2 rounded-lg bg-porcelain-paper border border-porcelain-crackle/30 text-porcelain-inkbrown/60 hover:text-porcelain-gold hover:border-porcelain-gold/50 transition-all"
                      title="显示提示"
                    >
                      <HelpCircle size={18} />
                    </button>
                  </div>
                </div>

                {state.showHint && (
                  <div className="mb-6 p-4 bg-porcelain-gold/10 border border-porcelain-gold/30 rounded-xl animate-fade-in">
                    <div className="flex items-start gap-2">
                      <Lightbulb size={18} className="text-porcelain-gold flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-porcelain-inkbrown/80" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                        <strong>鉴定要点提示：</strong>陶瓷鉴定应遵循"由远及近"的原则——先看整体造型风格，再看釉色特征，
                        再看纹饰工艺，最后看底足款识。记住每个窑口的典型特征和时代风格，综合判断最为可靠。
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div
                    className="aspect-square rounded-2xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${state.currentCase.color}20, ${state.currentCase.color}40), linear-gradient(135deg, #FAF7F0, #F5F1E8)`,
                    }}
                  >
                    <div
                      className="w-3/4 h-3/4 rounded-full shadow-2xl transition-all duration-1000"
                      style={{
                        background: `radial-gradient(circle at 35% 30%, ${state.currentCase.color}aa, ${state.currentCase.color})`,
                        boxShadow: `0 30px 80px ${state.currentCase.color}50, inset 0 8px 32px rgba(255,255,255,0.35), inset 0 -8px 32px rgba(0,0,0,0.15)`,
                      }}
                    />
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                      <span className="inline-block px-3 py-1 bg-porcelain-paper/90 rounded-full text-xs text-porcelain-inkbrown/60 backdrop-blur-sm">
                        {state.phase === 'result' ? state.currentCase.name : '??? 未知陶瓷'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4
                      className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <Eye size={18} className="text-porcelain-celadon" />
                      线索收集
                      <span className="text-xs font-normal text-porcelain-inkbrown/55 ml-auto">
                        点击卡片揭示线索
                      </span>
                    </h4>

                    {state.currentCase.clues.map((clue, index) => {
                      const isRevealed = state.revealedClues.includes(index);
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            if (!isRevealed && state.phase === 'investigating') {
                              revealClue(index);
                            }
                          }}
                          disabled={state.phase !== 'investigating' || isRevealed}
                          className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                            isRevealed
                              ? 'bg-porcelain-paper border-porcelain-crackle/40'
                              : 'bg-porcelain-paper/50 border-porcelain-crackle/20 hover:bg-porcelain-paper hover:border-porcelain-gold/50 cursor-pointer'
                          } ${state.phase !== 'investigating' && !isRevealed ? 'opacity-50' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                isRevealed ? 'text-white' : 'text-porcelain-inkbrown/40 bg-porcelain-crackle/20'
                              }`}
                              style={isRevealed ? { backgroundColor: state.currentCase.color } : {}}
                            >
                              {clueTypeIcons[clue.type]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-porcelain-crackle/20 text-porcelain-inkbrown/60">
                                  {clueTypeLabels[clue.type]}
                                </span>
                                <DifficultyStars level={clue.difficulty} />
                              </div>
                              <h5 className="font-serif font-bold text-porcelain-inkbrown text-sm" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                                {clue.title}
                              </h5>
                              {isRevealed ? (
                                <p className="text-xs text-porcelain-inkbrown/70 mt-2 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                                  {clue.description}
                                </p>
                              ) : (
                                <p className="text-xs text-porcelain-inkbrown/40 mt-2 italic">
                                  点击揭示此线索...
                                </p>
                              )}
                              {isRevealed && (
                                <div className="mt-2 pt-2 border-t border-porcelain-crackle/20">
                                  <p className="text-xs text-porcelain-gold/80" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                                    💡 {clue.hint}
                                  </p>
                                </div>
                              )}
                            </div>
                            {!isRevealed && (
                              <ChevronRight size={18} className="text-porcelain-crackle/40 flex-shrink-0 mt-3" />
                            )}
                            {isRevealed && (
                              <Check size={18} className="text-porcelain-celadon flex-shrink-0 mt-3" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {state.phase === 'investigating' && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-porcelain-crackle/30">
                    <div className="text-sm text-porcelain-inkbrown/60">
                      {state.revealedClues.length === 0 && (
                        <span>先收集一些线索，再开始推理吧！</span>
                      )}
                      {state.revealedClues.length > 0 && state.revealedClues.length < state.currentCase.clues.length && (
                        <span>已收集 {state.revealedClues.length} 条线索，可以开始推理了，或者继续收集更多线索。</span>
                      )}
                      {state.revealedClues.length === state.currentCase.clues.length && (
                        <span className="text-porcelain-gold">所有线索已收集，开始你的推理吧！</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setState((prev) => ({ ...prev, phase: 'intro' }))}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-porcelain-crackle/30 text-porcelain-inkbrown/70 hover:border-porcelain-inkbrown/30 hover:text-porcelain-inkbrown transition-all text-sm"
                      >
                        <RotateCcw size={16} />
                        换一个
                      </button>
                      <button
                        onClick={startGuessing}
                        disabled={state.revealedClues.length === 0}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-porcelain-celadon text-white font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <Search size={18} />
                        开始推理
                      </button>
                    </div>
                  </div>
                )}

                {state.phase === 'guessing' && (
                  <div className="pt-4 border-t border-porcelain-crackle/30 animate-fade-in">
                    <h4
                      className="font-serif text-xl font-bold text-porcelain-inkbrown mb-6 flex items-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <Lightbulb size={20} className="text-porcelain-gold" />
                      请给出你的判断
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-bold text-porcelain-inkbrown mb-3" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          所属窑口
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {kilnOptions.map((kiln) => (
                            <button
                              key={kiln}
                              onClick={() => setState((prev) => ({ ...prev, guessKiln: kiln }))}
                              className={`py-2 px-3 rounded-lg text-sm border transition-all ${
                                state.guessKiln === kiln
                                  ? 'bg-porcelain-celadon text-white border-porcelain-celadon shadow-md'
                                  : 'bg-porcelain-paper text-porcelain-inkbrown/70 border-porcelain-crackle/30 hover:border-porcelain-celadon/50'
                              }`}
                            >
                              {kiln}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-porcelain-inkbrown mb-3" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          所属年代
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {dynastyOptions.map((dynasty) => (
                            <button
                              key={dynasty}
                              onClick={() => setState((prev) => ({ ...prev, guessDynasty: dynasty }))}
                              className={`py-2 px-3 rounded-lg text-sm border transition-all ${
                                state.guessDynasty === dynasty
                                  ? 'bg-porcelain-youlihong text-white border-porcelain-youlihong shadow-md'
                                  : 'bg-porcelain-paper text-porcelain-inkbrown/70 border-porcelain-crackle/30 hover:border-porcelain-youlihong/50'
                              }`}
                            >
                              {dynasty}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-porcelain-inkbrown/60">
                        {state.guessKiln && state.guessDynasty ? (
                          <span>你判断这是：<strong className="text-porcelain-inkbrown">{state.guessDynasty} {state.guessKiln}</strong></span>
                        ) : (
                          <span>请选择窑口和年代</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setState((prev) => ({ ...prev, phase: 'investigating' }))}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-porcelain-crackle/30 text-porcelain-inkbrown/70 hover:border-porcelain-inkbrown/30 hover:text-porcelain-inkbrown transition-all text-sm"
                        >
                          返回查看线索
                        </button>
                        <button
                          onClick={submitGuess}
                          disabled={!state.guessKiln || !state.guessDynasty}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-porcelain-gold to-porcelain-gold text-white font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          <Check size={18} />
                          提交答案
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {state.phase === 'result' && (
                  <div className="pt-4 border-t border-porcelain-crackle/30 animate-fade-in">
                    {(() => {
                      const { kilnCorrect, dynastyCorrect, score } = calculateScore();
                      const allCorrect = kilnCorrect && dynastyCorrect;

                      return (
                        <>
                          <div className={`text-center mb-8 p-6 rounded-2xl ${
                            allCorrect 
                              ? 'bg-gradient-to-r from-porcelain-celadon/20 to-porcelain-gold/20 border border-porcelain-celadon/40'
                              : 'bg-gradient-to-r from-porcelain-youlihong/10 to-porcelain-gold/10 border border-porcelain-youlihong/30'
                          }`}>
                            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                              allCorrect ? 'bg-porcelain-celadon text-white' : 'bg-porcelain-youlihong text-white'
                            }`}>
                              {allCorrect ? <Award size={40} /> : <X size={40} />}
                            </div>
                            <h3
                              className={`font-serif text-2xl md:text-3xl font-bold mb-2 ${
                                allCorrect ? 'text-porcelain-celadon' : 'text-porcelain-youlihong'
                              }`}
                              style={{ fontFamily: '"Noto Serif SC", serif' }}
                            >
                              {allCorrect ? '鉴定正确！' : '鉴定有误'}
                            </h3>
                            <p className="text-porcelain-inkbrown/70 mb-3" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                              {allCorrect 
                                ? `太棒了！你只用了 ${state.revealedClues.length} 条线索就找到了真相！`
                                : '别灰心，学习完整解析过程，下次一定能答对！'
                              }
                            </p>
                            <div className="flex items-center justify-center gap-6 text-lg font-bold">
                              <div>
                                <span className="text-porcelain-inkbrown/50 text-sm">窑口</span>
                                <div className="flex items-center gap-2">
                                  {kilnCorrect ? (
                                    <Check size={18} className="text-porcelain-celadon" />
                                  ) : (
                                    <X size={18} className="text-porcelain-youlihong" />
                                  )}
                                  <span className={kilnCorrect ? 'text-porcelain-celadon' : 'text-porcelain-youlihong'}>
                                    {state.currentCase.kiln}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <span className="text-porcelain-inkbrown/50 text-sm">年代</span>
                                <div className="flex items-center gap-2">
                                  {dynastyCorrect ? (
                                    <Check size={18} className="text-porcelain-celadon" />
                                  ) : (
                                    <X size={18} className="text-porcelain-youlihong" />
                                  )}
                                  <span className={dynastyCorrect ? 'text-porcelain-celadon' : 'text-porcelain-youlihong'}>
                                    {state.currentCase.dynasty}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <span className="text-porcelain-inkbrown/50 text-sm">得分</span>
                                <div className="text-porcelain-gold text-2xl">
                                  +{score}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mb-6">
                            <h4
                              className="font-serif text-xl font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2"
                              style={{ fontFamily: '"Noto Serif SC", serif' }}
                            >
                              <BookOpen size={20} className="text-porcelain-gold" />
                              文物档案
                            </h4>
                            <div
                              className="p-5 rounded-xl border"
                              style={{
                                backgroundColor: `${state.currentCase.color}08`,
                                borderColor: `${state.currentCase.color}30`,
                              }}
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h5
                                    className="font-serif text-xl font-bold mb-2"
                                    style={{ fontFamily: '"Noto Serif SC", serif', color: state.currentCase.color }}
                                  >
                                    {state.currentCase.name}
                                  </h5>
                                  <p className="text-sm text-porcelain-inkbrown/70 mb-3" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                                    {state.currentCase.dynasty} · {state.currentCase.period} · {state.currentCase.kiln}
                                  </p>
                                  <button
                                    onClick={() => handleOpenCaseAnalysis(state.currentCase)}
                                    className="text-sm text-porcelain-gold hover:underline flex items-center gap-1"
                                  >
                                    查看完整解析 <ChevronRight size={14} />
                                  </button>
                                </div>
                                <div>
                                  <h6 className="text-sm font-bold text-porcelain-inkbrown mb-2">关键特征</h6>
                                  <div className="flex flex-wrap gap-2">
                                    {state.currentCase.analysis.keyEvidence.slice(0, 4).map((evidence, i) => (
                                      <span
                                        key={i}
                                        className="inline-block px-3 py-1 rounded-full text-xs"
                                        style={{
                                          backgroundColor: `${state.currentCase.color}15`,
                                          color: state.currentCase.color,
                                        }}
                                      >
                                        {evidence.split('：')[0]}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mb-6">
                            <h4
                              className="font-serif text-xl font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2"
                              style={{ fontFamily: '"Noto Serif SC", serif' }}
                            >
                              <Lightbulb size={20} className="text-porcelain-gold" />
                              相关知识点
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {state.currentCase.knowledge.map((item, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleOpenKnowledge(item.title, item.content, state.currentCase.color)}
                                  className="text-left p-4 bg-porcelain-paper rounded-xl border border-porcelain-crackle/30 hover:border-porcelain-gold/50 hover:shadow-md transition-all group"
                                >
                                  <h5
                                    className="font-serif font-bold mb-2 group-hover:text-porcelain-gold transition-colors"
                                    style={{ fontFamily: '"Noto Serif SC", serif' }}
                                  >
                                    {item.title}
                                  </h5>
                                  <p className="text-xs text-porcelain-inkbrown/60 line-clamp-2 leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                                    {item.content}
                                  </p>
                                  <div className="mt-2 text-xs text-porcelain-gold flex items-center gap-1">
                                    点击学习 <ChevronRight size={12} />
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-porcelain-crackle/30">
                            <div className="flex items-center gap-6 text-sm text-porcelain-inkbrown/60">
                              <div className="flex items-center gap-2">
                                <Award size={16} className="text-porcelain-gold" />
                                <span>累计得分：<strong className="text-porcelain-gold">{state.score}</strong></span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Check size={16} className="text-porcelain-celadon" />
                                <span>正确：{state.correctCases} / {state.totalCases}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setState((prev) => ({ ...prev, phase: 'intro' }))}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-porcelain-crackle/30 text-porcelain-inkbrown/70 hover:border-porcelain-inkbrown/30 hover:text-porcelain-inkbrown transition-all text-sm"
                              >
                                返回首页
                              </button>
                              <button
                                onClick={startNewCase}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-porcelain-celadon to-porcelain-gold text-white font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                              >
                                <Play size={18} />
                                下一案
                              </button>
                            </div>
                          </div>
                        </>
                      );
                    })()}
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
