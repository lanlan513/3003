import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, RotateCw, Play, Clock, Check, X, Sparkles, Info, Award, Lightbulb, ChevronRight } from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import SealLabel from '@/components/common/SealLabel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import {
  getRandomArtifact,
  shuffleFragments,
  calculatePlacementAccuracy,
  isPlacementCorrect,
  calculateRestorationScore,
  checkCollision,
  restorationTips,
} from '@/data/restoration';
import type {
  RestorationArtifact,
  RestorationFragment,
  PlacedFragment,
  RestorationScore,
  DetailData,
} from '@/types';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

type GameStage = 'ready' | 'playing' | 'finished';

interface FragmentState extends RestorationFragment {
  x: number;
  y: number;
  rotation: number;
  isPlaced: boolean;
  placementAccuracy?: number;
}

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const SNAP_THRESHOLD = 15;

export default function RestorationSection({ onOpenDetail }: Props) {
  const [stage, setStage] = useState<GameStage>('ready');
  const [artifact, setArtifact] = useState<RestorationArtifact | null>(null);
  const [fragments, setFragments] = useState<FragmentState[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [score, setScore] = useState<RestorationScore | null>(null);
  const [showOutline, setShowOutline] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % restorationTips.length);
    }, 6000);
    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    if (stage === 'playing') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [stage]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startGame = useCallback(() => {
    const newArtifact = getRandomArtifact();
    setArtifact(newArtifact);
    const shuffled = shuffleFragments(newArtifact.fragments, CANVAS_WIDTH, CANVAS_HEIGHT);
    setFragments(
      shuffled.map((f) => ({
        ...f,
        isPlaced: false,
      }))
    );
    setElapsedSeconds(0);
    setScore(null);
    setStage('playing');
  }, []);

  const resetGame = useCallback(() => {
    setStage('ready');
    setArtifact(null);
    setFragments([]);
    setElapsedSeconds(0);
    setScore(null);
  }, []);

  const getSvgPoint = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    const y = ((clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
    return { x, y };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, frag: FragmentState) => {
      if (stage !== 'playing' || frag.isPlaced) return;
      e.stopPropagation();

      const point = getSvgPoint(e.clientX, e.clientY);
      setDraggingId(frag.id);
      setDragOffset({ x: point.x - frag.x, y: point.y - frag.y });
      setIsDragging(true);
      (e.target as Element).setPointerCapture?.(e.pointerId);
    },
    [stage, getSvgPoint]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingId || stage !== 'playing') return;

      const point = getSvgPoint(e.clientX, e.clientY);
      const targetFrag = artifact?.fragments.find((f) => f.id === draggingId);

      setFragments((prev) =>
        prev.map((f) => {
          if (f.id !== draggingId) return f;
          let newX = point.x - dragOffset.x;
          let newY = point.y - dragOffset.y;

          if (targetFrag) {
            const dist = Math.sqrt(
              Math.pow(newX - targetFrag.targetX, 2) + Math.pow(newY - targetFrag.targetY, 2)
            );
            if (dist < SNAP_THRESHOLD) {
              newX = targetFrag.targetX;
              newY = targetFrag.targetY;
            }
          }

          newX = Math.max(f.width / 2, Math.min(CANVAS_WIDTH - f.width / 2, newX));
          newY = Math.max(f.height / 2, Math.min(CANVAS_HEIGHT - f.height / 2, newY));

          return { ...f, x: newX, y: newY };
        })
      );
    },
    [draggingId, dragOffset, artifact, stage, getSvgPoint]
  );

  const handlePointerUp = useCallback(() => {
    if (!draggingId || !artifact) {
      setDraggingId(null);
      setIsDragging(false);
      return;
    }

    const draggingFrag = fragments.find((f) => f.id === draggingId);
    const targetFrag = artifact.fragments.find((f) => f.id === draggingId);

    if (draggingFrag && targetFrag) {
      const accuracy = calculatePlacementAccuracy(
        draggingFrag.x,
        draggingFrag.y,
        draggingFrag.rotation,
        targetFrag.targetX,
        targetFrag.targetY,
        targetFrag.targetRotation
      );
      const correct = isPlacementCorrect(accuracy);

      if (correct) {
        setFragments((prev) =>
          prev.map((f) =>
            f.id === draggingId
              ? {
                  ...f,
                  x: targetFrag.targetX,
                  y: targetFrag.targetY,
                  rotation: targetFrag.targetRotation,
                  isPlaced: true,
                  placementAccuracy: accuracy,
                }
              : f
          )
        );
      }
    }

    setDraggingId(null);
    setIsDragging(false);
  }, [draggingId, fragments, artifact]);

  const rotateFragment = useCallback(
    (fragId: string, direction: 1 | -1) => {
      if (stage !== 'playing') return;

      setFragments((prev) =>
        prev.map((f) => {
          if (f.id !== fragId || f.isPlaced) return f;
          const newRotation = (f.rotation + direction * 15 + 360) % 360;

          const targetFrag = artifact?.fragments.find((t) => t.id === fragId);
          if (targetFrag) {
            const accuracy = calculatePlacementAccuracy(
              f.x,
              f.y,
              newRotation,
              targetFrag.targetX,
              targetFrag.targetY,
              targetFrag.targetRotation
            );
            if (isPlacementCorrect(accuracy)) {
              return {
                ...f,
                x: targetFrag.targetX,
                y: targetFrag.targetY,
                rotation: targetFrag.targetRotation,
                isPlaced: true,
                placementAccuracy: accuracy,
              };
            }
          }

          return { ...f, rotation: newRotation };
        })
      );
    },
    [stage, artifact]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stage !== 'playing') return;
      if (e.key === 'r' || e.key === 'R') {
        const target = fragments.find((f) => f.id === draggingId) ?? fragments.find((f) => !f.isPlaced);
        if (target && !target.isPlaced) {
          rotateFragment(target.id, 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, fragments, draggingId, rotateFragment]);

  useEffect(() => {
    if (stage !== 'playing' || fragments.length === 0) return;

    const allPlaced = fragments.every((f) => f.isPlaced);
    if (allPlaced && artifact) {
      const placedData: PlacedFragment[] = fragments.map((f) => ({
        id: f.id,
        x: f.x,
        y: f.y,
        rotation: f.rotation,
        isCorrect: f.isPlaced,
        placementAccuracy: f.placementAccuracy ?? 0,
      }));

      const result = calculateRestorationScore(placedData, fragments.length, elapsedSeconds);
      setScore(result);
      setStage('finished');
    }
  }, [fragments, stage, artifact, elapsedSeconds]);

  const handleViewDetail = () => {
    if (!artifact || !score) return;
    onOpenDetail({
      type: 'restoration',
      id: artifact.id,
      title: artifact.name,
      subtitle: `${artifact.era} · ${artifact.origin}`,
      description: artifact.description + '\n\n' + artifact.historicalValue,
      sections: [
        { title: '修复评级', content: [`${score.grade} · ${score.totalScore}分`, score.feedback] },
        { title: '修复工艺', content: artifact.repairMethods },
        ...artifact.knowledge.map((k) => ({ title: k.title, content: k.content })),
      ],
      color: artifact.accentColor,
      bgColor: artifact.baseColor + '40',
      imagePrompt: artifact.imagePrompt,
    });
  };

  const selectedFragment = fragments.find((f) => f.id === draggingId) ?? fragments.find((f) => !f.isPlaced);

  const difficultyStars = (level: number) =>
    Array.from({ length: 3 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < level ? 'text-porcelain-gold' : 'text-porcelain-crackle/50'}`}
      >
        ★
      </span>
    ));

  const gradeColors: Record<string, { bg: string; text: string; border: string }> = {
    '修复大师': { bg: '#FFF8E7', text: '#C9A962', border: '#C9A962' },
    '巧夺天工': { bg: '#FFF8E7', text: '#C97B48', border: '#C97B48' },
    '匠心独运': { bg: '#E8F0E8', text: '#8BA888', border: '#8BA888' },
    '初窥门径': { bg: '#E8F0F8', text: '#2C3E50', border: '#2C3E50' },
    '尚需努力': { bg: '#F8E8E8', text: '#A83232', border: '#A83232' },
  };

  return (
    <section id="restoration" className="section-padding bg-gradient-to-b from-porcelain-paper to-porcelain-scroll/40 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-porcelain-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-porcelain-celadon/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-8 relative">
        <SectionTitle
          tag="RESTORATION · 陆"
          title="修复工坊"
          subtitle='"补得天残归完璧，续将地脉补真空"。化身古陶瓷修复师，以手为媒、以心为契，将支离破碎的国宝重焕光彩'
        />

        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <div className="bg-porcelain-paper/80 rounded-2xl p-5 md:p-8 shadow-porcelain border border-porcelain-crackle/40 backdrop-blur-sm">
            <div className="flex items-start gap-3 mb-6">
              <SealLabel text="修" size="md" />
              <div>
                <h3
                  className="font-serif text-xl md:text-2xl font-bold text-porcelain-inkbrown mb-1"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  古陶瓷修复体验
                </h3>
                <p className="text-sm text-porcelain-inkbrown/65 leading-relaxed max-w-3xl" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  拖拽瓷器碎片至正确位置，旋转调整角度。当碎片接近目标位置时会自动吸附对齐。所有碎片归位后，将展示器物的完整信息与修复知识。
                </p>
              </div>
            </div>

            {stage === 'ready' && (
              <div className="animate-fade-in text-center py-12">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="restVaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E8E4D8" />
                        <stop offset="100%" stopColor="#D4C8A8" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 45 12 L 55 12 L 53 22 Q 70 28 66 55 Q 64 85 50 92 Q 36 85 34 55 Q 30 28 47 22 Z"
                      fill="none"
                      stroke="#C9A962"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                      className="animate-pulse"
                    />
                    <path d="M 45 12 L 55 12 L 54 25 L 48 22 Z" fill="url(#restVaseGrad)" transform="translate(-5, -3) rotate(-10, 50, 20)" />
                    <path d="M 50 22 Q 65 28 62 50 L 52 48 Z" fill="url(#restVaseGrad)" transform="translate(8, 2) rotate(8, 55, 35)" />
                    <path d="M 40 50 Q 38 75 50 88 L 58 70 Z" fill="url(#restVaseGrad)" transform="translate(3, 8)" />
                  </svg>
                </div>
                <h4
                  className="font-serif text-xl font-bold text-porcelain-inkbrown mb-3"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  准备好了吗？
                </h4>
                <p className="text-sm text-porcelain-inkbrown/60 mb-8 max-w-md mx-auto leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  系统将随机为您分配一件需要修复的珍贵古瓷。请仔细观察碎片特征，将它们一一归位，重现国宝风采。
                </p>
                <div className="flex items-center justify-center gap-2 mb-8 p-4 bg-porcelain-scroll/50 rounded-xl max-w-md mx-auto">
                  <Lightbulb size={18} className="text-porcelain-gold flex-shrink-0" />
                  <p className="text-xs text-porcelain-inkbrown/70 italic" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    "{restorationTips[currentTip]}"
                  </p>
                </div>
                <button
                  onClick={startGame}
                  className="px-10 py-3.5 bg-gradient-to-r from-porcelain-gold to-porcelain-gold/80 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  <Play size={20} />
                  开始修复
                </button>
              </div>
            )}

            {(stage === 'playing' || stage === 'finished') && artifact && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <SealLabel text={artifact.shape === 'vase' ? '瓶' : artifact.shape === 'bowl' ? '洗' : artifact.shape === 'jar' ? '俑' : artifact.shape === 'plate' ? '盘' : '壶'} size="sm" />
                      <div>
                        <h4
                          className="font-serif font-bold text-porcelain-inkbrown"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          {artifact.name}
                        </h4>
                        <p className="text-xs text-porcelain-inkbrown/55">
                          {artifact.era} · {artifact.origin} · 难度 {difficultyStars(artifact.difficulty)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-porcelain-scroll/60 rounded-lg">
                        <Clock size={14} className="text-porcelain-inkbrown/60" />
                        <span className="text-sm font-mono font-bold text-porcelain-inkbrown">
                          {formatTime(elapsedSeconds)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-porcelain-celadon/15 rounded-lg">
                        <Check size={14} className="text-porcelain-celadon" />
                        <span className="text-sm font-bold text-porcelain-celadon">
                          {fragments.filter((f) => f.isPlaced).length} / {fragments.length}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowOutline((v) => !v)}
                        className={`p-2 rounded-lg transition-colors ${showOutline ? 'bg-porcelain-ji-blue/15 text-porcelain-ji-blue' : 'bg-porcelain-crackle/30 text-porcelain-inkbrown/50'}`}
                        title={showOutline ? '隐藏轮廓' : '显示轮廓'}
                      >
                        <Info size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="relative bg-gradient-to-br from-porcelain-scroll/60 via-porcelain-paper to-porcelain-scroll/40 rounded-xl overflow-hidden border border-porcelain-crackle/40 shadow-inner">
                    <svg
                      ref={svgRef}
                      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
                      className="w-full h-auto touch-none select-none"
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerLeave={handlePointerUp}
                      onPointerCancel={handlePointerUp}
                    >
                      <defs>
                        <pattern id="canvasGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                          <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#D4C8A8" strokeWidth="0.5" opacity="0.3" />
                        </pattern>
                        <filter id="fragmentShadow">
                          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#3D2B1F" floodOpacity="0.25" />
                        </filter>
                        <filter id="placedGlow">
                          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#C9A962" floodOpacity="0.5" />
                        </filter>
                      </defs>

                      <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#canvasGrid)" />

                      {showOutline && (
                        <g transform="translate(50, 140) scale(3.2)" opacity={stage === 'finished' ? 0.3 : 0.4}>
                          <path
                            d={artifact.outlinePath}
                            fill="none"
                            stroke={artifact.accentColor}
                            strokeWidth="1.2"
                            strokeDasharray="6 4"
                          />
                        </g>
                      )}

                      {stage === 'finished' && artifact && (
                        <g transform="translate(50, 140) scale(3.2)" className="animate-fade-in">
                          <defs>
                            <linearGradient id={`finishedGrad-${artifact.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={artifact.baseColor} stopOpacity="0.9" />
                              <stop offset="100%" stopColor={artifact.baseColor} stopOpacity="0.7" />
                            </linearGradient>
                          </defs>
                          <path
                            d={artifact.outlinePath}
                            fill={`url(#finishedGrad-${artifact.id})`}
                            stroke={artifact.accentColor}
                            strokeWidth="0.8"
                            opacity="0.6"
                          />
                        </g>
                      )}

                      {fragments
                        .slice()
                        .sort((a, b) => {
                          if (a.isPlaced && !b.isPlaced) return -1;
                          if (!a.isPlaced && b.isPlaced) return 1;
                          if (a.id === draggingId) return 1;
                          return 0;
                        })
                        .map((frag) => (
                          <g
                            key={frag.id}
                            transform={`translate(${frag.x - 50}, ${frag.y - 50}) rotate(${frag.rotation}, 50, 50)`}
                            style={{
                              cursor: stage === 'playing' && !frag.isPlaced ? 'grab' : 'default',
                              touchAction: 'none',
                            }}
                            onPointerDown={(e) => handlePointerDown(e, frag)}
                          >
                            <g transform="translate(50, 50)">
                              <g transform={`translate(${-frag.width / 2}, ${-frag.height / 2})`}>
                                <path
                                  d={frag.pathData}
                                  fill={frag.color}
                                  stroke={frag.isPlaced ? artifact.accentColor : draggingId === frag.id ? '#C9A962' : '#8B7355'}
                                  strokeWidth={frag.isPlaced ? 1.5 : draggingId === frag.id ? 2.5 : 1.2}
                                  filter={frag.isPlaced ? 'url(#placedGlow)' : 'url(#fragmentShadow)'}
                                  opacity={frag.isPlaced ? 0.95 : draggingId === frag.id ? 1 : 0.92}
                                  className={draggingId === frag.id ? 'scale-[1.03]' : ''}
                                  style={{ transition: draggingId === frag.id ? 'none' : 'opacity 0.2s' }}
                                />
                                <path
                                  d={frag.pathData}
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="0.5"
                                  opacity="0.4"
                                  transform="translate(-0.5, -0.5)"
                                />
                              </g>
                            </g>
                          </g>
                        ))}
                    </svg>

                    {stage === 'finished' && score && (
                      <div className="absolute inset-0 bg-porcelain-inkbrown/40 backdrop-blur-[2px] flex items-center justify-center animate-fade-in">
                        <div className="bg-porcelain-paper rounded-2xl p-6 md:p-8 shadow-porcelain-lg max-w-sm mx-4 text-center animate-fade-in-up border border-porcelain-crackle/50">
                          <div
                            className="inline-block px-5 py-2 rounded-full text-base font-bold mb-4"
                            style={{
                              backgroundColor: gradeColors[score.grade].bg,
                              color: gradeColors[score.grade].text,
                              border: `2px solid ${gradeColors[score.grade].border}`,
                              fontFamily: '"Noto Serif SC", serif',
                            }}
                          >
                            <Award size={18} className="inline-block mr-1.5 -mt-0.5" />
                            {score.grade}
                          </div>
                          <div
                            className="font-serif text-4xl font-bold mb-2"
                            style={{ fontFamily: '"Noto Serif SC", serif', color: gradeColors[score.grade].text }}
                          >
                            {score.totalScore}
                            <span className="text-lg text-porcelain-inkbrown/40 ml-1">分</span>
                          </div>
                          <p className="text-sm text-porcelain-inkbrown/70 leading-relaxed mb-5" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                            "{score.feedback}"
                          </p>
                          <div className="grid grid-cols-3 gap-2 mb-5">
                            <div className="p-2 bg-porcelain-scroll/40 rounded-lg">
                              <div className="text-[10px] text-porcelain-inkbrown/50 mb-0.5">完整度</div>
                              <div className="text-sm font-bold text-porcelain-celadon">{score.completenessScore}</div>
                            </div>
                            <div className="p-2 bg-porcelain-scroll/40 rounded-lg">
                              <div className="text-[10px] text-porcelain-inkbrown/50 mb-0.5">精准度</div>
                              <div className="text-sm font-bold text-porcelain-ji-blue">{score.accuracyScore}</div>
                            </div>
                            <div className="p-2 bg-porcelain-scroll/40 rounded-lg">
                              <div className="text-[10px] text-porcelain-inkbrown/50 mb-0.5">速度</div>
                              <div className="text-sm font-bold text-porcelain-gold">{score.speedScore}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleViewDetail}
                              className="flex-1 px-4 py-2.5 bg-porcelain-gold/15 text-porcelain-gold rounded-lg font-bold text-sm hover:bg-porcelain-gold/25 transition-colors flex items-center justify-center gap-1.5"
                              style={{ fontFamily: '"Noto Serif SC", serif' }}
                            >
                              <Sparkles size={14} />
                              器物详情
                            </button>
                            <button
                              onClick={startGame}
                              className="flex-1 px-4 py-2.5 bg-porcelain-celadon/15 text-porcelain-celadon rounded-lg font-bold text-sm hover:bg-porcelain-celadon/25 transition-colors flex items-center justify-center gap-1.5"
                              style={{ fontFamily: '"Noto Serif SC", serif' }}
                            >
                              <ChevronRight size={14} />
                              再修一件
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-gradient-to-br from-porcelain-scroll/40 to-porcelain-paper rounded-xl p-5 border border-porcelain-crackle/30">
                    <h5
                      className="font-serif font-bold text-porcelain-inkbrown mb-3 flex items-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <span className="w-1.5 h-4 rounded-full bg-porcelain-youlihong" />
                      操作指南
                    </h5>
                    <ul className="space-y-2.5 text-xs text-porcelain-inkbrown/70" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-porcelain-gold/20 text-porcelain-gold flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">1</span>
                        <span>拖拽碎片至画布中对应位置，接近目标时会自动吸附</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-porcelain-gold/20 text-porcelain-gold flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">2</span>
                        <span>选中碎片后，可使用下方按钮或 R 键旋转调整角度</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-porcelain-gold/20 text-porcelain-gold flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">3</span>
                        <span>参考轮廓线和碎片形状特征，判断其在器物上的位置</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-porcelain-gold/20 text-porcelain-gold flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">4</span>
                        <span>碎片正确归位后会发出金色光芒并锁定</span>
                      </li>
                    </ul>
                  </div>

                  {stage === 'playing' && selectedFragment && !selectedFragment.isPlaced && (
                    <div className="bg-porcelain-paper rounded-xl p-5 border border-porcelain-crackle/30">
                      <div className="flex items-center justify-between mb-3">
                        <h5
                          className="font-serif font-bold text-porcelain-inkbrown flex items-center gap-2"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          <span className="w-1.5 h-4 rounded-full bg-porcelain-celadon" />
                          当前碎片
                        </h5>
                        <span className="text-[10px] px-2 py-0.5 bg-porcelain-crackle/30 rounded-full text-porcelain-inkbrown/60">
                          {selectedFragment.rotation}°
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => rotateFragment(selectedFragment.id, -1)}
                          className="w-12 h-12 rounded-full bg-porcelain-scroll/60 hover:bg-porcelain-gold/20 text-porcelain-inkbrown/70 hover:text-porcelain-gold flex items-center justify-center transition-all hover:scale-110"
                          title="逆时针旋转 15°"
                        >
                          <RotateCcw size={22} strokeWidth={1.8} />
                        </button>
                        <div className="w-20 h-20 bg-porcelain-scroll/40 rounded-xl flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-14 h-14">
                            <g transform={`translate(50, 50) rotate(${selectedFragment.rotation}) translate(${-selectedFragment.width / 2}, ${-selectedFragment.height / 2}) scale(${60 / Math.max(selectedFragment.width, selectedFragment.height)})`}>
                              <path
                                d={selectedFragment.pathData}
                                fill={selectedFragment.color}
                                stroke="#8B7355"
                                strokeWidth="1.5"
                              />
                            </g>
                          </svg>
                        </div>
                        <button
                          onClick={() => rotateFragment(selectedFragment.id, 1)}
                          className="w-12 h-12 rounded-full bg-porcelain-scroll/60 hover:bg-porcelain-gold/20 text-porcelain-inkbrown/70 hover:text-porcelain-gold flex items-center justify-center transition-all hover:scale-110"
                          title="顺时针旋转 15°"
                        >
                          <RotateCw size={22} strokeWidth={1.8} />
                        </button>
                      </div>
                      <p className="text-[10px] text-porcelain-inkbrown/40 text-center mt-3">
                        提示：按键盘 R 键顺时针旋转
                      </p>
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-porcelain-gold/8 to-porcelain-scroll/40 rounded-xl p-5 border border-porcelain-gold/20">
                    <h5
                      className="font-serif font-bold text-porcelain-gold mb-3 flex items-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <Lightbulb size={16} />
                      修复心法
                    </h5>
                    <p className="text-xs text-porcelain-inkbrown/70 italic leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      "{restorationTips[currentTip]}"
                    </p>
                  </div>

                  {stage === 'playing' && (
                    <button
                      onClick={resetGame}
                      className="w-full px-4 py-2.5 bg-porcelain-inkbrown/8 text-porcelain-inkbrown/60 rounded-xl font-medium text-sm hover:bg-porcelain-inkbrown/15 hover:text-porcelain-inkbrown transition-all flex items-center justify-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <X size={16} />
                      放弃修复
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
