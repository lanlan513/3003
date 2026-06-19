import { useState, useMemo, useRef } from 'react';
import {
  Wind, Flame, Brush, Eye, Trash2, Play, RotateCcw, Sparkles,
  ChevronUp, ChevronDown, GripVertical, AlertTriangle, Info, X, ArrowRight, AlertCircle, CheckCircle2
} from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import SealLabel from '@/components/common/SealLabel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { processSteps, getCategoryLabel, simulateProcess, getDefaultFlow, validateProcess } from '@/data/processEditor';
import { craftData } from '@/data/crafts';
import type { ProcessStep, ProcessNode, ProcessEditorResult, ProcessCategory, DetailData, ProcessValidationIssue } from '@/types';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

const StepIcon = ({ icon, color, size = 20 }: { icon: string; color: string; size?: number }) => {
  const icons: Record<string, JSX.Element> = {
    knead: <Wind size={size} strokeWidth={1.8} />,
    wheel: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3 L12 5 M12 19 L12 21 M3 12 L5 12 M19 12 L21 12" />
      </svg>
    ),
    carve: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    glaze: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }}>
        <path d="M12 2 L12 10 Q8 12 8 17 Q8 21 12 21 Q16 21 16 17 Q16 12 12 10" />
        <path d="M12 5 Q13 7 12 9" />
      </svg>
    ),
    brush: <Brush size={size} strokeWidth={1.8} />,
    kiln: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }}>
        <path d="M5 8 L19 8 L19 20 L5 20 Z" />
        <path d="M9 8 L9 4 L15 4 L15 8" />
        <path d="M9 14 L15 14" />
        <rect x="10" y="16" width="4" height="4" rx="0.5" />
      </svg>
    ),
    fire: <Flame size={size} strokeWidth={1.8} />,
    inspect: <Eye size={size} strokeWidth={1.8} />,
  };
  return (
    <span style={{ color }}>
      {icons[icon] || icons.knead}
    </span>
  );
};

const categories: ProcessCategory[] = ['preparation', 'forming', 'decoration', 'glazing', 'firing', 'finishing'];

const gradeColors: Record<string, { bg: string; text: string; border: string }> = {
  '精品': { bg: '#FFF8E7', text: '#C9A962', border: '#C9A962' },
  '佳品': { bg: '#E8F0E8', text: '#8BA888', border: '#8BA888' },
  '合格品': { bg: '#E8F0F8', text: '#2C3E50', border: '#2C3E50' },
  '次品': { bg: '#FFF0E8', text: '#C97B48', border: '#C97B48' },
  '废品': { bg: '#F8E8E8', text: '#A83232', border: '#A83232' },
};

const ResultVase = ({ result }: { result: ProcessEditorResult }) => (
  <div className="relative w-40 h-48 mx-auto">
    <svg viewBox="0 0 100 120" className="w-full h-full">
      <defs>
        <linearGradient id="editorVaseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={result.finalAppearance.secondaryColor} />
          <stop offset="50%" stopColor={result.finalAppearance.primaryColor} />
          <stop offset="100%" stopColor={result.finalAppearance.primaryColor} />
        </linearGradient>
        <radialGradient id="editorVaseShine" cx="30%" cy="30%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity={result.finalAppearance.glossiness / 200} />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M32 8 L68 8 L64 28 Q82 38 76 65 Q74 95 50 100 Q26 95 24 65 Q18 38 36 28 Z"
        fill="url(#editorVaseGradient)"
        stroke={result.finalAppearance.primaryColor}
        strokeWidth="1"
      />
      <path
        d="M32 8 L68 8 L64 28 Q82 38 76 65 Q74 95 50 100 Q26 95 24 65 Q18 38 36 28 Z"
        fill="url(#editorVaseShine)"
      />
      {result.flaws.some(f => f.severity === 'major' || f.severity === 'fatal') && (
        <>
          <path d="M45 75 L48 85 L46 95" fill="none" stroke="#3A2F24" strokeWidth="1" opacity="0.6" />
          <path d="M55 70 L53 80 L56 90" fill="none" stroke="#3A2F24" strokeWidth="0.8" opacity="0.5" />
        </>
      )}
      {result.finalAppearance.pattern !== '素面无纹' && (
        <path d="M28 50 Q50 45 72 50" fill="none" stroke="white" strokeWidth="0.8" opacity="0.4" />
      )}
    </svg>
  </div>
);

const EffectBar = ({ value, label, color, max = 100 }: { value: number; label: string; color: string; max?: number }) => {
  const displayValue = Math.max(0, Math.min(max, value + (max === 100 ? 20 : 0)));
  const pct = (displayValue / max) * 100;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-porcelain-inkbrown/60 w-14 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-porcelain-crackle/30 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] font-bold text-porcelain-inkbrown/70 w-8 text-right">
        {value > 0 ? '+' : ''}{Math.round(value)}
      </span>
    </div>
  );
};

export default function ProcessEditorSection({ onOpenDetail }: Props) {
  const [nodes, setNodes] = useState<ProcessNode[]>(getDefaultFlow());
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<ProcessEditorResult | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<ProcessCategory>>(
    new Set(['preparation', 'forming', 'decoration'])
  );
  const dragData = useRef<{ stepId: string; from: 'palette' | 'canvas' } | null>(null);
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);

  const selectedGlaze = craftData.glazes[0];

  const sortedNodes = useMemo(() => [...nodes].sort((a, b) => a.order - b.order), [nodes]);

  const validation = useMemo(() => validateProcess(nodes), [nodes]);

  const issuesByStepId = useMemo(() => {
    const map = new Map<string, ProcessValidationIssue[]>();
    validation.issues.forEach(issue => {
      if (issue.stepId) {
        const existing = map.get(issue.stepId) || [];
        existing.push(issue);
        map.set(issue.stepId, existing);
      }
    });
    return map;
  }, [validation.issues]);

  const selectedNode = useMemo(
    () => nodes.find(n => n.instanceId === selectedInstanceId) || null,
    [nodes, selectedInstanceId]
  );
  const selectedStep = useMemo(
    () => (selectedNode ? processSteps.find(s => s.id === selectedNode.stepId) : null),
    [selectedNode]
  );

  const toggleCategory = (cat: ProcessCategory) => {
    const next = new Set(expandedCategories);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setExpandedCategories(next);
  };

  const addStep = (step: ProcessStep) => {
    const existingCount = nodes.filter(n => n.stepId === step.id).length;
    if (!step.repeatable && existingCount >= 1) return;

    const maxOrder = nodes.length > 0 ? Math.max(...nodes.map(n => n.order)) : -1;
    const newNode: ProcessNode = {
      instanceId: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      stepId: step.id,
      order: maxOrder + 1,
      intensity: 100,
    };
    setNodes([...nodes, newNode]);
    setSelectedInstanceId(newNode.instanceId);
  };

  const removeNode = (instanceId: string) => {
    setNodes(prev => {
      const removed = prev.find(n => n.instanceId === instanceId);
      if (!removed) return prev;
      return prev
        .filter(n => n.instanceId !== instanceId)
        .map(n => (n.order > removed.order ? { ...n, order: n.order - 1 } : n));
    });
    if (selectedInstanceId === instanceId) setSelectedInstanceId(null);
  };

  const moveNode = (instanceId: string, direction: -1 | 1) => {
    setNodes(prev => {
      const node = prev.find(n => n.instanceId === instanceId);
      if (!node) return prev;
      const targetOrder = node.order + direction;
      if (targetOrder < 0 || targetOrder >= prev.length) return prev;
      const swapped = prev.find(n => n.order === targetOrder);
      if (!swapped) return prev;
      return prev.map(n => {
        if (n.instanceId === instanceId) return { ...n, order: targetOrder };
        if (n.instanceId === swapped.instanceId) return { ...n, order: node.order };
        return n;
      });
    });
  };

  const updateIntensity = (instanceId: string, intensity: number) => {
    setNodes(prev => prev.map(n => (n.instanceId === instanceId ? { ...n, intensity } : n)));
  };

  const handleReset = () => {
    setNodes(getDefaultFlow());
    setResult(null);
    setSelectedInstanceId(null);
    setIsSimulating(false);
  };

  const handleSimulate = async () => {
    if (nodes.length === 0) return;
    setIsSimulating(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const r = simulateProcess(nodes, '#FAF7F0', selectedGlaze.color);
    setResult(r);
    setIsSimulating(false);
  };

  const handleDragStart = (e: React.DragEvent, stepId: string, from: 'palette' | 'canvas') => {
    dragData.current = { stepId, from };
    e.dataTransfer.effectAllowed = 'copyMove';
    if (from === 'canvas') {
      e.dataTransfer.setData('text/plain', stepId);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnCanvas = (e: React.DragEvent, targetOrder?: number) => {
    e.preventDefault();
    if (!dragData.current) return;

    if (dragData.current.from === 'palette') {
      const step = processSteps.find(s => s.id === dragData.current!.stepId);
      if (!step) return;

      const existingCount = nodes.filter(n => n.stepId === step.id).length;
      if (!step.repeatable && existingCount >= 1) {
        dragData.current = null;
        return;
      }

      setNodes(prev => {
        const insertOrder = targetOrder !== undefined ? targetOrder : prev.length;
        const adjusted = prev
          .filter(n => n.order >= insertOrder)
          .map(n => ({ ...n, order: n.order + 1 }));
        const others = prev.filter(n => n.order < insertOrder);
        const newNode: ProcessNode = {
          instanceId: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          stepId: step.id,
          order: insertOrder,
          intensity: 100,
        };
        return [...others, newNode, ...adjusted];
      });
    } else if (dragData.current.from === 'canvas') {
      const movingInstanceId = e.dataTransfer.getData('text/plain');
      if (!movingInstanceId || targetOrder === undefined) {
        dragData.current = null;
        return;
      }
      setNodes(prev => {
        const moving = prev.find(n => n.instanceId === movingInstanceId);
        if (!moving) return prev;
        const fromOrder = moving.order;
        const toOrder = Math.max(0, Math.min(prev.length - 1, targetOrder));
        if (fromOrder === toOrder) return prev;

        return prev.map(n => {
          if (n.instanceId === movingInstanceId) return { ...n, order: toOrder };
          if (fromOrder < toOrder && n.order > fromOrder && n.order <= toOrder) {
            return { ...n, order: n.order - 1 };
          }
          if (fromOrder > toOrder && n.order >= toOrder && n.order < fromOrder) {
            return { ...n, order: n.order + 1 };
          }
          return n;
        });
      });
    }
    dragData.current = null;
  };

  const handleViewDetail = () => {
    if (!result) return;
    const penaltySection = result.orderPenalty > 0 || result.dependencyPenalty > 0 ? [{
      title: '流程扣分',
      content: [
        result.orderPenalty > 0 ? `工序顺序错误：-${result.orderPenalty}分` : null,
        result.dependencyPenalty > 0 ? `依赖缺失/工序重复：-${result.dependencyPenalty}分` : null,
      ].filter(Boolean) as string[],
    }] : [];
    const issuesSection = result.validationIssues.length > 0 ? [{
      title: '流程问题明细',
      content: result.validationIssues.map((issue, i) => `${issue.severity === 'error' ? '⚠ 错误' : '⚡ 警告'}：${issue.message}`),
    }] : [];
    onOpenDetail({
      type: 'pottery-result',
      id: result.id,
      title: `${result.qualityGrade}·工艺组合`,
      subtitle: `评分 ${result.overallScore} 分 · ${result.stepsCount}道工序`,
      description: result.story,
      sections: [
        { title: '工艺流程', content: [`共${result.stepsCount}道工序：${sortedNodes.map(n => processSteps.find(s => s.id === n.stepId)?.name).filter(Boolean).join(' → ')}`] },
        { title: '成品描述', content: [result.description, `釉色效果：${result.finalAppearance.texture}，${result.finalAppearance.pattern}`] },
        { title: '工艺参数', content: result.features },
        ...penaltySection,
        ...issuesSection,
        ...(result.flaws.length > 0 ? [{
          title: '瑕疵记录',
          content: result.flaws.map(f => `${f.name}：${f.description}（${f.severity === 'minor' ? '轻微' : f.severity === 'major' ? '严重' : '致命'}）`)
        }] : []),
      ],
      color: result.overallScore >= 75 ? '#C9A962' : result.overallScore >= 60 ? '#8BA888' : '#A83232',
      bgColor: result.overallScore >= 75 ? '#F8F1DD' : result.overallScore >= 60 ? '#E6F0E6' : '#F8E6E6',
      imagePrompt: `A beautiful Chinese ceramic vase with ${result.finalAppearance.pattern} pattern, ${result.finalAppearance.texture} texture, primary color ${result.finalAppearance.primaryColor}, Jingdezhen porcelain style, museum quality, elegant composition`,
    });
  };

  const renderPalette = () => (
    <div className="bg-porcelain-paper/60 rounded-xl border border-porcelain-crackle/30 overflow-hidden">
      <div className="px-4 py-3 bg-porcelain-scroll/50 border-b border-porcelain-crackle/30">
        <h4 className="font-serif text-sm font-bold text-porcelain-inkbrown flex items-center gap-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
          <Sparkles size={14} className="text-porcelain-gold" />
          工艺步骤库
        </h4>
        <p className="text-[10px] text-porcelain-inkbrown/55 mt-1">拖拽或点击添加到流程</p>
      </div>
      <div className="max-h-[520px] overflow-y-auto">
        {categories.map(cat => {
          const catSteps = processSteps.filter(s => s.category === cat);
          const isOpen = expandedCategories.has(cat);
          return (
            <div key={cat} className="border-b border-porcelain-crackle/20 last:border-b-0">
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-porcelain-scroll/30 transition-colors"
              >
                <span className="text-xs font-bold text-porcelain-inkbrown/75" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  {getCategoryLabel(cat)}
                  <span className="ml-1.5 text-porcelain-inkbrown/40 font-normal">({catSteps.length})</span>
                </span>
                {isOpen ? <ChevronUp size={14} className="text-porcelain-inkbrown/40" /> : <ChevronDown size={14} className="text-porcelain-inkbrown/40" />}
              </button>
              {isOpen && (
                <div className="px-2 pb-3 space-y-1.5">
                  {catSteps.map(step => {
                    const usedCount = nodes.filter(n => n.stepId === step.id).length;
                    const disabled = !step.repeatable && usedCount >= 1;
                    return (
                      <div
                        key={step.id}
                        draggable={!disabled}
                        onDragStart={(e) => !disabled && handleDragStart(e, step.id, 'palette')}
                        onClick={() => !disabled && addStep(step)}
                        className={`group p-2.5 rounded-lg border transition-all duration-200 ${
                          disabled
                            ? 'border-porcelain-crackle/20 bg-porcelain-crackle/10 opacity-50 cursor-not-allowed'
                            : 'border-porcelain-crackle/25 bg-porcelain-paper hover:border-porcelain-gold/50 hover:bg-porcelain-gold/5 cursor-grab active:cursor-grabbing hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${step.color}15` }}
                          >
                            <StepIcon icon={step.icon} color={step.color} size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                                {step.name}
                              </span>
                              {!step.repeatable && usedCount >= 1 && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-porcelain-crackle/30 text-porcelain-inkbrown/50">已添加</span>
                              )}
                            </div>
                            <p className="text-[10px] text-porcelain-inkbrown/55 mt-0.5 line-clamp-1">
                              {step.shortDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCanvas = () => (
    <div
      className="bg-porcelain-scroll/30 rounded-xl border border-porcelain-crackle/30 relative min-h-[520px] flex flex-col"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDropOnCanvas(e)}
    >
      <div className="px-4 py-3 bg-porcelain-paper/60 border-b border-porcelain-crackle/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="font-serif text-sm font-bold text-porcelain-inkbrown flex items-center gap-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            <span className={`w-2 h-2 rounded-full ${validation.issues.length > 0 ? 'bg-porcelain-youlihong animate-pulse' : 'bg-porcelain-gold'}`} />
            工艺流程编辑
            <span className="ml-1 text-xs font-normal text-porcelain-inkbrown/50">({nodes.length}步)</span>
          </h4>
          {validation.issues.length > 0 ? (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-porcelain-youlihong/10 border border-porcelain-youlihong/30">
              <AlertCircle size={13} className="text-porcelain-youlihong" />
              <span className="text-[10px] font-bold text-porcelain-youlihong" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                {validation.issues.length}处问题
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-porcelain-gold/10 border border-porcelain-gold/30">
              <CheckCircle2 size={13} className="text-porcelain-gold" />
              <span className="text-[10px] font-bold text-porcelain-gold" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                流程合理
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-porcelain-inkbrown/50 hover:bg-porcelain-crackle/20 hover:text-porcelain-inkbrown/75 transition-colors"
            title="重置流程"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {nodes.length === 0 ? (
          <div
            className="h-full min-h-[380px] flex flex-col items-center justify-center text-center border-2 border-dashed border-porcelain-crackle/40 rounded-xl"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropOnCanvas(e, 0)}
          >
            <div className="w-16 h-16 rounded-full bg-porcelain-crackle/20 flex items-center justify-center mb-3">
              <Sparkles size={28} className="text-porcelain-gold/60" />
            </div>
            <p className="text-sm text-porcelain-inkbrown/50" style={{ fontFamily: '"Noto Serif SC", serif' }}>
              从左侧拖拽工艺步骤
            </p>
            <p className="text-xs text-porcelain-inkbrown/40 mt-1">或点击步骤添加到此区域</p>
          </div>
        ) : (
          <div className="relative">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              {sortedNodes.slice(0, -1).map((_, i) => {
                const y1 = 50 + i * 92 + 72;
                const y2 = 50 + (i + 1) * 92;
                return (
                  <g key={i}>
                    <line x1="50%" y1={y1} x2="50%" y2={y2} stroke="#C9A962" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
                    <polygon points={`50%,${y2} 46%,${y2 - 8} 54%,${y2 - 8}`} fill="#C9A962" opacity="0.6" />
                  </g>
                );
              })}
            </svg>

            <div className="relative space-y-5" style={{ zIndex: 1 }}>
              {sortedNodes.map((node, idx) => {
                const step = processSteps.find(s => s.id === node.stepId);
                if (!step) return null;
                const isSelected = selectedInstanceId === node.instanceId;
                return (
                  <div key={node.instanceId}>
                    {idx > 0 && (
                      <div
                        className="h-5 flex items-center justify-center -my-2.5 relative z-10"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropOnCanvas(e, idx)}
                      >
                        <div className="w-full h-full" />
                      </div>
                    )}
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, node.instanceId, 'canvas')}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnCanvas(e, idx)}
                      onClick={() => setSelectedInstanceId(node.instanceId)}
                      className={`group relative bg-porcelain-paper rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-porcelain-gold shadow-lg scale-[1.01]'
                          : issuesByStepId.get(step.id)?.some(i => i.severity === 'error')
                            ? 'border-porcelain-youlihong/70'
                            : issuesByStepId.get(step.id)?.length
                              ? 'border-porcelain-gold/70'
                              : 'border-porcelain-crackle/40 hover:border-porcelain-crackle/60 hover:shadow-md'
                      }`}
                    >
                      {issuesByStepId.get(step.id) && (
                        <div className="absolute -top-1.5 -right-1.5 z-10">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shadow-md ${
                              issuesByStepId.get(step.id)!.some(i => i.severity === 'error')
                                ? 'bg-porcelain-youlihong'
                                : 'bg-porcelain-gold'
                            }`}
                          >
                            <AlertTriangle size={10} className="text-white" />
                          </div>
                        </div>
                      )}
                      <div className="p-3.5">
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center relative ${
                                isSelected ? 'ring-2 ring-porcelain-gold/30' : ''
                              } ${issuesByStepId.get(step.id)?.some(i => i.severity === 'error') ? 'ring-2 ring-porcelain-youlihong/50' : ''}`}
                              style={{ backgroundColor: `${step.color}18` }}
                            >
                              <StepIcon icon={step.icon} color={step.color} size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-porcelain-inkbrown/40">
                              #{idx + 1}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                                  {step.name}
                                </span>
                                <span
                                  className="text-[9px] px-1.5 py-0.5 rounded"
                                  style={{ backgroundColor: `${step.color}15`, color: step.color }}
                                >
                                  {getCategoryLabel(step.category)}
                                </span>
                              </div>
                              <span className="text-[10px] text-porcelain-inkbrown/40">{step.duration}</span>
                            </div>
                            {issuesByStepId.get(step.id) && (
                              <div className="mb-1 space-y-0.5">
                                {issuesByStepId.get(step.id)!.slice(0, 1).map((issue, i) => (
                                  <div key={i} className={`text-[10px] flex items-center gap-1 ${
                                    issue.severity === 'error' ? 'text-porcelain-youlihong' : 'text-porcelain-gold'
                                  }`}>
                                    <AlertCircle size={10} />
                                    <span className="truncate">{issue.message}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            <p className="text-[11px] text-porcelain-inkbrown/60 line-clamp-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                              {step.shortDescription}
                            </p>

                            {isSelected && (
                              <div className="mt-3 pt-3 border-t border-porcelain-crackle/30 space-y-2 animate-fade-in">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-porcelain-inkbrown/55 w-12">强度</span>
                                  <input
                                    type="range"
                                    min={30}
                                    max={100}
                                    value={node.intensity}
                                    onChange={(e) => updateIntensity(node.instanceId, parseInt(e.target.value))}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-1 h-1.5 accent-porcelain-gold"
                                  />
                                  <span className="text-[10px] font-bold text-porcelain-gold w-8 text-right">{node.intensity}%</span>
                                </div>
                                <div className="grid grid-cols-4 gap-1.5">
                                  <EffectBar value={step.effect.qualityBonus * (node.intensity / 100)} label="品质" color="#2C3E50" max={40} />
                                </div>
                                <div className="grid grid-cols-4 gap-1.5">
                                  <EffectBar value={step.effect.artistryBonus * (node.intensity / 100)} label="艺术" color="#A83232" max={40} />
                                </div>
                                <div className="grid grid-cols-4 gap-1.5">
                                  <EffectBar value={step.effect.uniquenessBonus * (node.intensity / 100)} label="独特" color="#C9A962" max={40} />
                                </div>
                                <div className="grid grid-cols-4 gap-1.5">
                                  <EffectBar value={step.effect.riskFactor * (node.intensity / 100)} label="风险" color="#C97B48" max={50} />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); moveNode(node.instanceId, -1); }}
                              disabled={idx === 0}
                              className="p-1 rounded text-porcelain-inkbrown/40 hover:text-porcelain-inkbrown/70 hover:bg-porcelain-crackle/20 disabled:opacity-30"
                            >
                              <ChevronUp size={14} />
                            </button>
                            <GripVertical size={14} className="text-porcelain-crackle/60 cursor-grab" />
                            <button
                              onClick={(e) => { e.stopPropagation(); moveNode(node.instanceId, 1); }}
                              disabled={idx === sortedNodes.length - 1}
                              className="p-1 rounded text-porcelain-inkbrown/40 hover:text-porcelain-inkbrown/70 hover:bg-porcelain-crackle/20 disabled:opacity-30"
                            >
                              <ChevronDown size={14} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeNode(node.instanceId); }}
                              className="p-1 rounded text-porcelain-youlihong/50 hover:text-porcelain-youlihong hover:bg-porcelain-youlihong/10 mt-1"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 bg-porcelain-paper/60 border-t border-porcelain-crackle/30">
        <button
          onClick={handleSimulate}
          disabled={nodes.length === 0 || isSimulating}
          className="w-full py-2.5 bg-gradient-to-r from-porcelain-youlihong to-porcelain-youlihong/80 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          style={{ fontFamily: '"Noto Serif SC", serif' }}
        >
          {isSimulating ? (
            <>
              <Flame size={16} className="animate-pulse" />
              烈火淬炼中...
            </>
          ) : (
            <>
              <Play size={16} />
              模拟烧制结果
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="bg-porcelain-paper/60 rounded-xl border border-porcelain-crackle/30 flex flex-col min-h-[520px]">
      <div className="px-4 py-3 bg-porcelain-scroll/50 border-b border-porcelain-crackle/30">
        <h4 className="font-serif text-sm font-bold text-porcelain-inkbrown flex items-center gap-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
          <Sparkles size={14} className="text-porcelain-gold" />
          烧制结果预览
        </h4>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {!result && !isSimulating && (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-full bg-porcelain-crackle/20 flex items-center justify-center mb-3">
              <Flame size={28} className="text-porcelain-youlihong/40" />
            </div>
            <p className="text-sm text-porcelain-inkbrown/50" style={{ fontFamily: '"Noto Serif SC", serif' }}>
              设计工艺流程
            </p>
            <p className="text-xs text-porcelain-inkbrown/40 mt-1">点击"模拟烧制结果"查看成品</p>

            {selectedStep && (
              <div className="mt-6 p-4 bg-porcelain-scroll/30 rounded-xl border border-porcelain-crackle/30 text-left w-full max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${selectedStep.color}15` }}
                  >
                    <StepIcon icon={selectedStep.icon} color={selectedStep.color} size={16} />
                  </div>
                  <span className="text-sm font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    {selectedStep.name}
                  </span>
                </div>
                <p className="text-[11px] text-porcelain-inkbrown/65 leading-relaxed mb-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  {selectedStep.description}
                </p>
                <div className="flex items-start gap-1.5 pt-2 border-t border-porcelain-crackle/20">
                  <Info size={11} className="text-porcelain-gold flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-porcelain-gold/85 italic" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    "{selectedStep.tips}"
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {isSimulating && (
          <div className="h-full flex flex-col items-center justify-center py-12">
            <div className="relative w-24 h-24 mb-4">
              <div className="absolute inset-0 rounded-full bg-porcelain-youlihong/20 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-porcelain-gold/30 to-porcelain-youlihong/30 flex items-center justify-center">
                <Flame size={32} className="text-porcelain-youlihong animate-pulse" />
              </div>
            </div>
            <p className="text-sm font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
              窑火正旺
            </p>
            <p className="text-xs text-porcelain-inkbrown/50 mt-1">三天三夜，烈火淬炼...</p>
            <div className="w-48 h-1.5 bg-porcelain-crackle/30 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-porcelain-gold to-porcelain-youlihong rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        )}

        {result && !isSimulating && (
          <div className="animate-fade-in">
            <div className="text-center mb-4">
              <div
                className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-2"
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

            <div className="grid grid-cols-2 gap-2 mt-4 mb-4">
              <div className="p-2.5 bg-porcelain-paper rounded-lg">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: result.finalAppearance.primaryColor }} />
                  <span className="text-[10px] text-porcelain-inkbrown/50">主色调</span>
                </div>
                <p className="text-xs font-bold text-porcelain-inkbrown truncate">{result.finalAppearance.texture}</p>
              </div>
              <div className="p-2.5 bg-porcelain-paper rounded-lg">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: result.finalAppearance.secondaryColor }} />
                  <span className="text-[10px] text-porcelain-inkbrown/50">光泽度</span>
                </div>
                <p className="text-xs font-bold text-porcelain-inkbrown truncate">{result.finalAppearance.glossiness}%</p>
              </div>
              <div className="p-2.5 bg-porcelain-paper rounded-lg col-span-2">
                <span className="text-[10px] text-porcelain-inkbrown/50">纹饰效果</span>
                <p className="text-xs font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  {result.finalAppearance.pattern}
                </p>
              </div>
            </div>

            <p className="text-xs text-porcelain-inkbrown/70 leading-relaxed mb-4 text-center" style={{ fontFamily: '"Noto Serif SC", serif' }}>
              {result.story}
            </p>

            <div className="space-y-1.5 mb-4">
              <EffectBar value={result.totalEffects.qualityBonus} label="品质加分" color="#2C3E50" />
              <EffectBar value={result.totalEffects.artistryBonus} label="艺术加分" color="#A83232" />
              <EffectBar value={result.totalEffects.uniquenessBonus} label="独特加分" color="#C9A962" />
              <EffectBar value={result.totalEffects.riskFactor} label="风险系数" color="#C97B48" max={100} />
            </div>

            {(result.orderPenalty > 0 || result.dependencyPenalty > 0) && (
              <div className="p-3 rounded-lg bg-porcelain-youlihong/10 border border-porcelain-youlihong/20 mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertCircle size={12} className="text-porcelain-youlihong flex-shrink-0" />
                  <span className="text-[11px] font-bold text-porcelain-youlihong">流程问题扣分</span>
                </div>
                <div className="space-y-1">
                  {result.orderPenalty > 0 && (
                    <div className="text-[10px] text-porcelain-inkbrown/65 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <ArrowRight size={10} />
                        工序顺序错误
                      </span>
                      <span className="font-bold text-porcelain-youlihong">-{result.orderPenalty}分</span>
                    </div>
                  )}
                  {result.dependencyPenalty > 0 && (
                    <div className="text-[10px] text-porcelain-inkbrown/65 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <AlertTriangle size={10} />
                        依赖缺失/工序重复
                      </span>
                      <span className="font-bold text-porcelain-youlihong">-{result.dependencyPenalty}分</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {result.validationIssues.length > 0 && (
              <div className="p-3 rounded-lg bg-porcelain-crackle/10 border border-porcelain-crackle/30 mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Info size={12} className="text-porcelain-inkbrown/70 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-porcelain-inkbrown/80">流程问题明细</span>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {result.validationIssues.map((issue, i) => (
                    <div key={i} className={`text-[10px] flex items-start gap-1.5 ${
                      issue.severity === 'error' ? 'text-porcelain-youlihong' : 'text-porcelain-gold'
                    }`}>
                      {issue.severity === 'error' ? (
                        <AlertCircle size={10} className="flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle size={10} className="flex-shrink-0 mt-0.5" />
                      )}
                      <span>{issue.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.features.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {result.features.map((f, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-porcelain-gold/15 text-porcelain-gold">
                    {f}
                  </span>
                ))}
              </div>
            )}

            {result.flaws.length > 0 && (
              <div className="p-3 rounded-lg bg-porcelain-youlihong/10 border border-porcelain-youlihong/20 mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle size={12} className="text-porcelain-youlihong flex-shrink-0" />
                  <span className="text-[11px] font-bold text-porcelain-youlihong">瑕疵记录</span>
                </div>
                <div className="space-y-1">
                  {result.flaws.map((flaw, i) => (
                    <div key={i} className="text-[10px] text-porcelain-inkbrown/65 flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
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
                className="flex-1 px-3 py-2 bg-porcelain-gold/15 text-porcelain-gold rounded-lg font-bold text-xs hover:bg-porcelain-gold/25 transition-colors flex items-center justify-center gap-1.5"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                <Sparkles size={12} />
                查看详情
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-3 py-2 bg-porcelain-inkbrown/10 text-porcelain-inkbrown/75 rounded-lg font-bold text-xs hover:bg-porcelain-inkbrown/15 transition-colors flex items-center justify-center gap-1.5"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                <RotateCcw size={12} />
                重新设计
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section id="process-editor" className="section-padding bg-gradient-to-b from-porcelain-paper to-porcelain-scroll/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-porcelain-celadon/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-porcelain-gold/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-8 relative">
        <SectionTitle
          tag="PROCESS EDITOR · 肆-B"
          title="工艺编辑器"
          subtitle='"过手七十二，方克成器"。自由组合练泥、拉坯、刻花、施釉、烧制等工序，设计你的专属制瓷流程，系统模拟最终成品效果'
        />

        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <div className="bg-porcelain-scroll/30 rounded-2xl p-4 md:p-6 shadow-porcelain border border-porcelain-crackle/40">
            <div className="flex items-start gap-3 mb-5">
              <SealLabel text="编" size="md" />
              <div>
                <h3
                  className="font-serif text-xl md:text-2xl font-bold text-porcelain-inkbrown mb-1"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  陶瓷工艺流程编辑器
                </h3>
                <p className="text-sm text-porcelain-inkbrown/65 leading-relaxed max-w-3xl" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  从左侧工艺库拖拽步骤到中间画布，调整顺序和强度，系统会根据您的工艺流程自动模拟烧制结果。不同的工序组合、强度设置都会影响最终作品的品质、釉色和独特性。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-3">
                {renderPalette()}
              </div>
              <div className="lg:col-span-5">
                {renderCanvas()}
              </div>
              <div className="lg:col-span-4">
                {renderResult()}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-porcelain-crackle/20 flex flex-wrap gap-4 justify-center">
              {[
                { label: '备料', color: '#C4A484', desc: '练泥陈腐，打好基础' },
                { label: '成型', color: '#2C3E50', desc: '拉坯捏塑，赋予器形' },
                { label: '装饰', color: '#8BA888', desc: '刻花绘画，锦上添花' },
                { label: '施釉', color: '#7BA3A8', desc: '蘸浇刷吹，釉色天成' },
                { label: '烧制', color: '#A83232', desc: '柴火气氧，火中取宝' },
                { label: '收尾', color: '#C9A962', desc: '粉彩描金，甄选佳器' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold" style={{ color: item.color, fontFamily: '"Noto Serif SC", serif' }}>
                    {item.label}
                  </span>
                  <span className="text-[10px] text-porcelain-inkbrown/50">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
