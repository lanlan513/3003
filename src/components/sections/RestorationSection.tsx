import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, RotateCw, Play, Clock, Check, X, Sparkles, Info, Award, Lightbulb, ChevronRight, AlertCircle } from 'lucide-react';
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
  canvasToLocal,
  localToCanvas,
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
const SNAP_THRESHOLD_LOCAL = 10;

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
  const [collisionFlash, setCollisionFlash] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const collisionFlashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    const shuffled = shuffleFragments(
      newArtifact.fragments,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      newArtifact.displayTransform
    );
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
    setDraggingId(null);
    setCollisionFlash(null);
  }, []);

  const getSvgPoint = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    const y = ((clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
    return { x, y };
  }, []);

  const getPlacedFragments = useCallback((currentFragments: FragmentState[]) => {
    return currentFragments.filter((f) => f.isPlaced);
  }, []);

  const triggerCollisionFlash = useCallback((id: string) => {
    setCollisionFlash(id);
    if (collisionFlashTimerRef.current) {
      clearTimeout(collisionFlashTimerRef.current);
    }
    collisionFlashTimerRef.current = setTimeout(() => {
      setCollisionFlash((cur) => (cur === id ? null : cur));
    }, 350);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, frag: FragmentState) => {
      if (stage !== 'playing' || frag.isPlaced) return;
      e.stopPropagation();

      const point = getSvgPoint(e.clientX, e.clientY);
      setDraggingId(frag.id);
      setDragOffset({ x: point.x - frag.x, y: point.y - frag.y });
      (e.target as Element).setPointerCapture?.(e.pointerId);
    },
    [stage, getSvgPoint]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingId || stage !== 'playing' || !artifact) return;

      const point = getSvgPoint(e.clientX, e.clientY);
      const transform = artifact.displayTransform;
      const targetFrag = artifact.fragments.find((f) => f.id === draggingId);

      setFragments((prev) => {
        const draggingFrag = prev.find((f) => f.id === draggingId);
        if (!draggingFrag) return prev;

        let newCanvasX = point.x - dragOffset.x;
        let newCanvasY = point.y - dragOffset.y;

        newCanvasX = Math.max(30, Math.min(CANVAS_WIDTH - 30, newCanvasX));
        newCanvasY = Math.max(30, Math.min(CANVAS_HEIGHT - 30, newCanvasY));

        const localPos = canvasToLocal(newCanvasX, newCanvasY, transform);
        let finalLocalX = localPos.x;
        let finalLocalY = localPos.y;
        let snapped = false;

        if (targetFrag) {
          const dist = Math.sqrt(
            Math.pow(localPos.x - targetFrag.targetX, 2) +
              Math.pow(localPos.y - targetFrag.targetY, 2)
          );
          if (dist < SNAP_THRESHOLD_LOCAL) {
            finalLocalX = targetFrag.targetX;
            finalLocalY = targetFrag.targetY;
            snapped = true;
          }
        }

        const finalCanvas = snapped
          ? localToCanvas(targetFrag!.targetX, targetFrag!.targetY, transform)
          : { x: newCanvasX, y: newCanvasY };

        const testFragmentAABB = {
          x: finalCanvas.x,
          y: finalCanvas.y,
          width: draggingFrag.width * transform.scale,
          height: draggingFrag.height * transform.scale,
          rotation: draggingFrag.rotation,
          scale: 1,
        };

        const collides = prev.some((other) => {
          if (other.id === draggingId || !other.isPlaced) return false;
          const otherAABB = {
            x: other.x,
            y: other.y,
            width: other.width * transform.scale,
            height: other.height * transform.scale,
            rotation: other.rotation,
            scale: 1,
          };
          return checkCollision(testFragmentAABB, otherAABB);
        });

        if (collides && !snapped) {
          triggerCollisionFlash(draggingId);
          return prev;
        }
        if (collides && snapped) {
          triggerCollisionFlash(draggingId);
        }

        return prev.map((f) =>
          f.id === draggingId
            ? { ...f, x: finalCanvas.x, y: finalCanvas.y }
            : f
        );
      });
    },
    [draggingId, dragOffset, artifact, stage, getSvgPoint, triggerCollisionFlash]
  );

  const handlePointerUp = useCallback(() => {
    if (!draggingId || !artifact) {
      setDraggingId(null);
      return;
    }

    const transform = artifact.displayTransform;

    setFragments((prev) => {
      const draggingFrag = prev.find((f) => f.id === draggingId);
      const targetFrag = artifact.fragments.find((f) => f.id === draggingId);
      if (!draggingFrag || !targetFrag) return prev;

      const localPos = canvasToLocal(draggingFrag.x, draggingFrag.y, transform);
      const accuracy = calculatePlacementAccuracy(
        localPos.x,
        localPos.y,
        draggingFrag.rotation,
        targetFrag.targetX,
        targetFrag.targetY,
        targetFrag.targetRotation
      );
      const correct = isPlacementCorrect(accuracy);

      if (!correct) {
        setDraggingId(null);
        return prev;
      }

      const targetCanvas = localToCanvas(targetFrag.targetX, targetFrag.targetY, transform);
      const placedCandidate = {
        x: targetCanvas.x,
        y: targetCanvas.y,
        width: draggingFrag.width * transform.scale,
        height: draggingFrag.height * transform.scale,
        rotation: targetFrag.targetRotation,
        scale: 1,
      };

      const hasCollision = getPlacedFragments(prev).some((p) => {
        const placedAABB = {
          x: p.x,
          y: p.y,
          width: p.width * transform.scale,
          height: p.height * transform.scale,
          rotation: p.rotation,
          scale: 1,
        };
        return checkCollision(placedCandidate, placedAABB);
      });

      if (hasCollision) {
        triggerCollisionFlash(draggingId);
        setDraggingId(null);
        return prev;
      }

      setDraggingId(null);
      return prev.map((f) =>
        f.id === draggingId
          ? {
              ...f,
              x: targetCanvas.x,
              y: targetCanvas.y,
              rotation: targetFrag.targetRotation,
              isPlaced: true,
              placementAccuracy: accuracy,
            }
          : f
      );
    });
  }, [draggingId, artifact, getPlacedFragments, triggerCollisionFlash]);

  const rotateFragment = useCallback(
    (fragId: string, direction: 1 | -1) => {
      if (stage !== 'playing' || !artifact) return;

      setFragments((prev) => {
        const targetFrag = artifact.fragments.find((t) => t.id === fragId);
        const transform = artifact.displayTransform;
        const frag = prev.find((f) => f.id === fragId);
        if (!frag || frag.isPlaced) return prev;

        const newRotation = (frag.rotation + direction * 15 + 360) % 360;

        if (targetFrag) {
          const localPos = canvasToLocal(frag.x, frag.y, transform);
          const accuracy = calculatePlacementAccuracy(
            localPos.x,
            localPos.y,
            newRotation,
            targetFrag.targetX,
            targetFrag.targetY,
            targetFrag.targetRotation
          );
          if (isPlacementCorrect(accuracy)) {
            const targetCanvas = localToCanvas(targetFrag.targetX, targetFrag.targetY, transform);
            const placedCandidate = {
              x: targetCanvas.x,
              y: targetCanvas.y,
              width: frag.width * transform.scale,
              height: frag.height * transform.scale,
              rotation: targetFrag.targetRotation,
              scale: 1,
            };
            const hasCollision = getPlacedFragments(prev).some((p) => {
              const placedAABB = {
                x: p.x,
                y: p.y,
                width: p.width * transform.scale,
                height: p.height * transform.scale,
                rotation: p.rotation,
                scale: 1,
              };
              return checkCollision(placedCandidate, placedAABB);
            });
            if (!hasCollision) {
              return prev.map((f) =>
                f.id === fragId
                  ? {
                      ...f,
                      x: targetCanvas.x,
                      y: targetCanvas.y,
                      rotation: targetFrag.targetRotation,
                      isPlaced: true,
                      placementAccuracy: accuracy,
                    }
                  : f
              );
            } else {
              triggerCollisionFlash(fragId);
            }
          }
        }

        return prev.map((f) => (f.id === fragId ? { ...f, rotation: newRotation } : f));
      });
    },
    [stage, artifact, getPlacedFragments, triggerCollisionFlash]
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
    if (stage !== 'playing' || fragments.length === 0 || !artifact) return;

    const allPlaced = fragments.every((f) => f.isPlaced);
    if (allPlaced) {
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
      setTimeout(() => setStage('finished'), 500);
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

  const outlineTransform = artifact
    ? `translate(${artifact.displayTransform.offsetX}, ${artifact.displayTransform.offsetY}) scale(${artifact.displayTransform.scale})`
    : '';

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
                  拖拽瓷器碎片至画面虚线轮廓中的对应位置，接近目标时会自动吸附。正确归位后碎片会锁定并发出金色光晕。所有碎片归位后，将展示器物的完整信息与修复知识。
                </p>
              </div>
            </div>

            {stage === 'ready' && (
              <div className="animate-fade-in text-center py-12">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="restVaseGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E8E4D8" />
                        <stop offset="100%" stopColor="#D4C8A8" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 47 10 L 57 10 L 55 22 Q 72 28 68 56 Q 66 88 50 95 Q 34 88 32 56 Q 28 28 45 22 Z"
                      fill="none"
                      stroke="#C9A962"
                      strokeWidth="2.2"
                      strokeDasharray="5 3"
                      className="animate-pulse"
                    />
                    <path d="M 47 10 L 57 10 L 56 25 L 50 22 Z" fill="url(#restVaseGrad2)" transform="translate(-5, -3) rotate(-10, 50, 20)" />
                    <path d="M 50 22 Q 68 28 64 52 L 54 50 Z" fill="url(#restVaseGrad2)" transform="translate(8, 2) rotate(8, 55, 35)" />
                    <path d="M 40 50 Q 38 76 50 90 L 58 72 Z" fill="url(#restVaseGrad2)" transform="translate(3, 8)" />
                  </svg>
                </div>
                <h4
                  className="font-serif text-xl font-bold text-porcelain-inkbrown mb-3"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  准备好了吗？
                </h4>
                <p className="text-sm text-porcelain-inkbrown/60 mb-8 max-w-md mx-auto leading-relaxed" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  系统将随机为您分配一件需要修复的珍贵古瓷。请参考中央的轮廓提示，仔细观察碎片特征，将它们一一归位，重现国宝风采。
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
                      <SealLabel
                        text={
                          artifact.shape === 'vase'
                            ? '瓶'
                            : artifact.shape === 'bowl'
                            ? '洗'
                            : artifact.shape === 'jar'
                            ? '俑'
                            : artifact.shape === 'plate'
                            ? '盘'
                            : '壶'
                        }
                        size="sm"
                      />
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
                    <div className="flex items-center gap-3">
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
                        className={`p-2 rounded-lg transition-colors ${
                          showOutline
                            ? 'bg-porcelain-ji-blue/15 text-porcelain-ji-blue'
                            : 'bg-porcelain-crackle/30 text-porcelain-inkbrown/50'
                        }`}
                        title={showOutline ? '隐藏轮廓提示' : '显示轮廓提示'}
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
                        <pattern id="canvasGrid2" width="25" height="25" patternUnits="userSpaceOnUse">
                          <path
                            d="M 25 0 L 0 0 0 25"
                            fill="none"
                            stroke="#D4C8A8"
                            strokeWidth="0.5"
                            opacity="0.3"
                          />
                        </pattern>
                        <filter id="fragmentShadow2">
                          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#3D2B1F" floodOpacity="0.25" />
                        </filter>
                        <filter id="placedGlow2">
                          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#C9A962" floodOpacity="0.6" />
                        </filter>
                        <filter id="collisionShake">
                          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#A83232" floodOpacity="0.7" />
                        </filter>
                      </defs>

                      <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#canvasGrid2)" />

                      <g transform={outlineTransform}>
                        {showOutline && (
                          <path
                            d={artifact.outlinePath}
                            fill={artifact.baseColor}
                            fillOpacity={stage === 'finished' ? '0.55' : '0.12'}
                            stroke={artifact.accentColor}
                            strokeWidth={stage === 'finished' ? 0.6 : 1.2}
                            strokeDasharray={stage === 'finished' ? '0' : '6 4'}
                            className={stage === 'finished' ? 'animate-fade-in' : ''}
                          />
                        )}

                        {fragments
                          .slice()
                          .sort((a, b) => {
                            if (a.isPlaced && !b.isPlaced) return -1;
                            if (!a.isPlaced && b.isPlaced) return 1;
                            if (a.id === draggingId) return 1;
                            return 0;
                          })
                          .map((frag) => {
                            const fragLocal = canvasToLocal(frag.x, frag.y, artifact.displayTransform);
                            const isFlash = collisionFlash === frag.id;
                            return (
                              <g
                                key={frag.id}
                                style={{
                                  cursor: stage === 'playing' && !frag.isPlaced ? 'grab' : 'default',
                                  touchAction: 'none',
                                }}
                              >
                                <g
                                  transform={`translate(${fragLocal.x}, ${fragLocal.y}) rotate(${frag.rotation})`}
                                  onPointerDown={(e) => handlePointerDown(e, frag)}
                                >
                                  <path
                                    d={frag.pathData}
                                    fill={frag.color}
                                    stroke={
                                      frag.isPlaced
                                        ? artifact.accentColor
                                        : isFlash
                                        ? '#A83232'
                                        : draggingId === frag.id
                                        ? '#C9A962'
                                        : '#8B7355'
                                    }
                                    strokeWidth={
                                      frag.isPlaced ? 0.5 : isFlash ? 1.5 : draggingId === frag.id ? 1.2 : 0.7
                                    }
                                    filter={
                                      isFlash
                                        ? 'url(#collisionShake)'
                                        : frag.isPlaced
                                        ? 'url(#placedGlow2)'
                                        : 'url(#fragmentShadow2)'
                                    }
                                    opacity={frag.isPlaced ? 0.97 : draggingId === frag.id ? 1 : 0.93}
                                    style={{
                                      transition:
                                        draggingId === frag.id || isFlash ? 'none' : 'opacity 0.18s',
                                    }}
                                  />
                                  <path
                                    d={frag.pathData}
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="0.3"
                                    opacity="0.45"
                                    transform="translate(-0.25, -0.25)"
                                  />
                                </g>
                              </g>
                            );
                          })}
                      </g>
                    </svg>

                    {collisionFlash && (
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-porcelain-youlihong/95 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg animate-fade-in z-10">
                        <AlertCircle size={14} />
                        碎片重叠，请调整位置
                      </div>
                    )}

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
                            style={{
                              fontFamily: '"Noto Serif SC", serif',
                              color: gradeColors[score.grade].text,
                            }}
                          >
                            {score.totalScore}
                            <span className="text-lg text-porcelain-inkbrown/40 ml-1">分</span>
                          </div>
                          <p
                            className="text-sm text-porcelain-inkbrown/70 leading-relaxed mb-5"
                            style={{ fontFamily: '"Noto Serif SC", serif' }}
                          >
                            "{score.feedback}"
                          </p>
                          <div className="grid grid-cols-3 gap-2 mb-5">
                            <div className="p-2.5 bg-porcelain-scroll/40 rounded-lg">
                              <div className="text-[10px] text-porcelain-inkbrown/50 mb-0.5">完整度</div>
                              <div className="text-sm font-bold text-porcelain-celadon">{score.completenessScore}</div>
                            </div>
                            <div className="p-2.5 bg-porcelain-scroll/40 rounded-lg">
                              <div className="text-[10px] text-porcelain-inkbrown/50 mb-0.5">精准度</div>
                              <div className="text-sm font-bold text-porcelain-ji-blue">{score.accuracyScore}</div>
                            </div>
                            <div className="p-2.5 bg-porcelain-scroll/40 rounded-lg">
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
                        <span className="w-4 h-4 rounded-full bg-porcelain-gold/20 text-porcelain-gold flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                          1
                        </span>
                        <span>观察中央虚线轮廓，判断每个碎片在器物上的对应位置</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-porcelain-gold/20 text-porcelain-gold flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                          2
                        </span>
                        <span>拖拽碎片向目标位置靠近，接近时会自动吸附对齐</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-porcelain-gold/20 text-porcelain-gold flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                          3
                        </span>
                        <span>使用下方按钮或按 R 键旋转碎片，调整到正确角度</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-porcelain-gold/20 text-porcelain-gold flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                          4
                        </span>
                        <span>碎片不能重叠，发生碰撞时会红色高亮提示</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-porcelain-gold/20 text-porcelain-gold flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                          5
                        </span>
                        <span>正确归位后碎片会发出金色光芒并锁定位置</span>
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
                          <svg viewBox="-40 -40 80 80" className="w-16 h-16">
                            <g transform={`rotate(${selectedFragment.rotation})`}>
                              <path
                                d={selectedFragment.pathData}
                                fill={selectedFragment.color}
                                stroke="#8B7355"
                                strokeWidth="1.2"
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
                      <p className="text-[10px] text-porcelain-inkbrown/40 text-center mt-3">提示：按键盘 R 键快速顺时针旋转</p>
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
                    <p
                      className="text-xs text-porcelain-inkbrown/70 italic leading-relaxed"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
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
