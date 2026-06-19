import { useState, useCallback, useMemo } from 'react';
import {
  AlertTriangle,
  Flame,
  Truck,
  Swords,
  Waves,
  Shield,
  ShieldCheck,
  Package,
  Wrench,
  Thermometer,
  Castle,
  ArrowRightCircle,
  Ship,
  Cloud,
  Handshake,
  Warehouse,
  Route,
  Coins,
  History,
  BarChart3,
  TrendingDown,
  TrendingUp,
  Check,
  X,
  Play,
  ChevronRight,
  Sparkles,
  Target,
  Zap,
  Clock,
  FileText,
  RotateCcw,
  PieChart,
  Award,
  AlertOctagon,
  BookOpen,
} from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import SealLabel from '@/components/common/SealLabel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useDisasterStore } from '@/store/disasterStore';
import {
  disasterTypeNames,
  severityNames,
  severityColors,
} from '@/data/disaster';
import type { DetailData, MitigationStrategy, DisasterHistoryRecord } from '@/types';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

const iconMap: Record<string, JSX.Element> = {
  flame: <Flame size={24} strokeWidth={1.8} />,
  truck: <Truck size={24} strokeWidth={1.8} />,
  swords: <Swords size={24} strokeWidth={1.8} />,
  waves: <Waves size={24} strokeWidth={1.8} />,
  wrench: <Wrench size={20} strokeWidth={1.8} />,
  thermometer: <Thermometer size={20} strokeWidth={1.8} />,
  shield: <Shield size={20} strokeWidth={1.8} />,
  'shield-check': <ShieldCheck size={20} strokeWidth={1.8} />,
  package: <Package size={20} strokeWidth={1.8} />,
  route: <Route size={20} strokeWidth={1.8} />,
  castle: <Castle size={20} strokeWidth={1.8} />,
  'arrow-right-circle': <ArrowRightCircle size={20} strokeWidth={1.8} />,
  ship: <Ship size={20} strokeWidth={1.8} />,
  cloud: <Cloud size={20} strokeWidth={1.8} />,
  handshake: <Handshake size={20} strokeWidth={1.8} />,
  warehouse: <Warehouse size={20} strokeWidth={1.8} />,
};

export default function DisasterSection({ onOpenDetail }: Props) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);
  const [activeView, setActiveView] = useState<'overview' | 'history'>('overview');

  const {
    phase,
    activeDisaster,
    history,
    disasterFund,
    totalDisastersExperienced,
    currentReport,
    inventoryValue,
    inventoryCount,
    availableStrategies,
    triggerRandomDisaster,
    selectStrategy,
    deselectStrategy,
    resolveDisaster,
    generateReport,
    resetDisaster,
    closeReport,
    addToFund,
  } = useDisasterStore();

  const applicableStrategies = useMemo(() => {
    if (!activeDisaster) return [];
    return availableStrategies.filter((s) =>
      s.applicableDisasters.includes(activeDisaster.event.type)
    );
  }, [activeDisaster, availableStrategies]);

  const selectedStrategyObjects = useMemo(() => {
    if (!activeDisaster) return [];
    return activeDisaster.selectedStrategies
      .map((id) => availableStrategies.find((s) => s.id === id))
      .filter(Boolean) as MitigationStrategy[];
  }, [activeDisaster, availableStrategies]);

  const totalStrategyCost = useMemo(() => {
    return selectedStrategyObjects.reduce((sum, s) => sum + s.cost, 0);
  }, [selectedStrategyObjects]);

  const damageReduction = useMemo(() => {
    if (!activeDisaster) return 0;
    const baseDamage = activeDisaster.event.baseDamage;
    const actualDamage = activeDisaster.actualDamage;
    if (baseDamage === 0) return 0;
    return Math.round(((baseDamage - actualDamage) / baseDamage) * 100);
  }, [activeDisaster]);

  const handleTrigger = useCallback(() => {
    triggerRandomDisaster();
  }, [triggerRandomDisaster]);

  const handleSelectStrategy = useCallback(
    (strategyId: string) => {
      const strategy = availableStrategies.find((s) => s.id === strategyId);
      if (!strategy) return;

      if (activeDisaster?.selectedStrategies.includes(strategyId)) {
        deselectStrategy(strategyId);
      } else {
        if (totalStrategyCost + strategy.cost > disasterFund) {
          return;
        }
        selectStrategy(strategyId);
      }
    },
    [activeDisaster, availableStrategies, totalStrategyCost, disasterFund, selectStrategy, deselectStrategy]
  );

  const handleStartResponding = useCallback(() => {
    if (phase === 'triggered') {
      useDisasterStore.setState({ phase: 'responding' });
    }
  }, [phase]);

  const handleResolve = useCallback(() => {
    resolveDisaster();
  }, [resolveDisaster]);

  const handleReset = useCallback(() => {
    resetDisaster();
  }, [resetDisaster]);

  const handleAddFund = useCallback(() => {
    addToFund(20000);
  }, [addToFund]);

  const handleViewReport = useCallback(() => {
    generateReport();
  }, [generateReport]);

  const handleCloseReport = useCallback(() => {
    closeReport();
  }, [closeReport]);

  const handleViewHistoryRecord = useCallback(
    (record: DisasterHistoryRecord) => {
      onOpenDetail({
        type: 'disaster-record',
        id: record.id,
        title: `${record.event.name} · ${severityNames[record.event.severity]}`,
        subtitle: disasterTypeNames[record.event.type],
        description: record.event.description + '\n\n' + record.event.historicalReference,
        sections: [
          {
            title: '损失详情',
            content: [
              `损失点数：${record.finalDamage}`,
              `损失藏品：${record.itemsLost} 件`,
              `挽救藏品：${record.itemsSaved} 件`,
              `经济损失：¥${record.totalValueLost.toLocaleString()}`,
            ],
          },
          {
            title: '采用策略',
            content: record.selectedStrategies.length > 0
              ? record.selectedStrategies.map(
                  (id) => availableStrategies.find((s) => s.id === id)?.name || id
                )
              : ['未采取任何减灾措施'],
          },
        ],
        color: record.event.color,
        bgColor: '#FAF7F0',
        imagePrompt: record.event.imagePrompt,
      });
    },
    [onOpenDetail, availableStrategies]
  );

  const formatMoney = (value: number): string => {
    if (value >= 10000) {
      return `¥${(value / 10000).toFixed(1)}万`;
    }
    return `¥${value.toLocaleString()}`;
  };

  const renderIdleView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-porcelain-paper rounded-xl p-4 border border-porcelain-crackle/30 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-porcelain-gold/20 flex items-center justify-center">
              <Coins size={16} className="text-porcelain-gold" />
            </div>
            <span className="text-xs text-porcelain-inkbrown/60">防灾基金</span>
          </div>
          <div className="font-serif text-xl font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            {formatMoney(disasterFund)}
          </div>
        </div>

        <div className="bg-porcelain-paper rounded-xl p-4 border border-porcelain-crackle/30 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-porcelain-celadon/20 flex items-center justify-center">
              <Package size={16} className="text-porcelain-celadon" />
            </div>
            <span className="text-xs text-porcelain-inkbrown/60">藏品数量</span>
          </div>
          <div className="font-serif text-xl font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            {inventoryCount} 件
          </div>
        </div>

        <div className="bg-porcelain-paper rounded-xl p-4 border border-porcelain-crackle/30 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-porcelain-youlihong/20 flex items-center justify-center">
              <TrendingDown size={16} className="text-porcelain-youlihong" />
            </div>
            <span className="text-xs text-porcelain-inkbrown/60">藏品价值</span>
          </div>
          <div className="font-serif text-xl font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            {formatMoney(inventoryValue)}
          </div>
        </div>

        <div className="bg-porcelain-paper rounded-xl p-4 border border-porcelain-crackle/30 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-porcelain-ji-blue/20 flex items-center justify-center">
              <History size={16} className="text-porcelain-ji-blue" />
            </div>
            <span className="text-xs text-porcelain-inkbrown/60">经历灾难</span>
          </div>
          <div className="font-serif text-xl font-bold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
            {totalDisastersExperienced} 次
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-porcelain-scroll/50 to-porcelain-paper rounded-2xl p-6 md:p-8 border border-porcelain-crackle/40 shadow-porcelain">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <SealLabel text="灾" size="md" />
              <h3
                className="font-serif text-2xl font-bold text-porcelain-inkbrown"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                陶瓷灾难事件模拟
              </h3>
            </div>
            <p
              className="text-sm text-porcelain-inkbrown/70 leading-relaxed mb-6"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              千年陶瓷史，亦是一部灾难史。窑炉爆裂、运输损毁、战争劫掠、沉船海底——
              每一件流传至今的瓷器，都历经了无数风险。体验历史上的陶瓷灾难，
              运用策略减少损失，感悟文明传承的不易。
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleTrigger}
                className="inline-flex items-center gap-2 px-6 py-3 bg-porcelain-youlihong text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                <Zap size={18} />
                触发随机灾难
              </button>
              <button
                onClick={handleAddFund}
                className="inline-flex items-center gap-2 px-5 py-3 bg-porcelain-gold/20 text-porcelain-gold rounded-xl font-medium hover:bg-porcelain-gold/30 transition-all duration-300"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                <Coins size={18} />
                追加防灾金
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:w-64">
            {(['kiln_explosion', 'transport_damage', 'war_looting', 'shipwreck'] as const).map((type) => (
              <div
                key={type}
                className="bg-porcelain-paper rounded-xl p-3 border border-porcelain-crackle/30 text-center"
              >
                <div
                  className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2"
                  style={{ backgroundColor: type === 'kiln_explosion' ? '#A8323220' : type === 'transport_damage' ? '#C9A96220' : type === 'war_looting' ? '#8B000020' : '#2C3E5020' }}
                >
                  {type === 'kiln_explosion' && <Flame size={24} style={{ color: '#A83232' }} />}
                  {type === 'transport_damage' && <Truck size={24} style={{ color: '#C9A962' }} />}
                  {type === 'war_looting' && <Swords size={24} style={{ color: '#8B0000' }} />}
                  {type === 'shipwreck' && <Waves size={24} style={{ color: '#2C3E50' }} />}
                </div>
                <div
                  className="text-sm font-bold"
                  style={{ fontFamily: '"Noto Serif SC", serif', color: type === 'kiln_explosion' ? '#A83232' : type === 'transport_damage' ? '#C9A962' : type === 'war_looting' ? '#8B0000' : '#2C3E50' }}
                >
                  {disasterTypeNames[type]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveView('overview')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeView === 'overview'
              ? 'bg-porcelain-ji-blue text-white shadow-md'
              : 'bg-porcelain-paper text-porcelain-inkbrown/70 hover:bg-porcelain-scroll/50'
          }`}
          style={{ fontFamily: '"Noto Serif SC", serif' }}
        >
          <span className="flex items-center gap-2">
            <BarChart3 size={16} />
            减灾策略
          </span>
        </button>
        <button
          onClick={() => setActiveView('history')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeView === 'history'
              ? 'bg-porcelain-ji-blue text-white shadow-md'
              : 'bg-porcelain-paper text-porcelain-inkbrown/70 hover:bg-porcelain-scroll/50'
          }`}
          style={{ fontFamily: '"Noto Serif SC", serif' }}
        >
          <span className="flex items-center gap-2">
            <History size={16} />
            历史记录
            {history.length > 0 && (
              <span className="bg-porcelain-youlihong/20 text-porcelain-youlihong text-xs px-2 py-0.5 rounded-full">
                {history.length}
              </span>
            )}
          </span>
        </button>
      </div>

      {activeView === 'overview' && (
        <div className="bg-porcelain-scroll/30 rounded-2xl p-5 md:p-6 border border-porcelain-crackle/40">
          <h4
            className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            <ShieldCheck size={20} className="text-porcelain-celadon" />
            可用减灾策略
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {availableStrategies.map((strategy, idx) => (
              <div
                key={strategy.id}
                className={`bg-porcelain-paper rounded-xl p-4 border transition-all duration-300 hover:shadow-md ${
                  isVisible ? 'animate-fade-in-up' : ''
                }`}
                style={{
                  animationDelay: `${idx * 0.03}s`,
                  borderColor: strategy.color + '30',
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: strategy.color + '20', color: strategy.color }}
                  >
                    {iconMap[strategy.icon] || <Shield size={20} />}
                  </div>
                  <div>
                    <h5
                      className="font-serif font-bold text-porcelain-inkbrown"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      {strategy.name}
                    </h5>
                    <div className="text-xs text-porcelain-gold font-medium">
                      ¥{strategy.cost.toLocaleString()}
                    </div>
                  </div>
                </div>
                <p
                  className="text-xs text-porcelain-inkbrown/65 leading-relaxed mb-3"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  {strategy.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-porcelain-inkbrown/50">效果：</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: i < Math.ceil(strategy.effectiveness / 20)
                              ? strategy.color
                              : '#D4C8A850',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs font-medium" style={{ color: strategy.color }}>
                    {strategy.effectiveness}%
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {strategy.applicableDisasters.map((d) => (
                    <span
                      key={d}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-porcelain-crackle/30 text-porcelain-inkbrown/60"
                    >
                      {disasterTypeNames[d]}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'history' && (
        <div className="bg-porcelain-scroll/30 rounded-2xl p-5 md:p-6 border border-porcelain-crackle/40">
          <div className="flex items-center justify-between mb-4">
            <h4
              className="font-serif text-lg font-bold text-porcelain-inkbrown flex items-center gap-2"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              <FileText size={20} className="text-porcelain-gold" />
              灾难历史记录
            </h4>
            {history.length > 0 && (
              <button
                onClick={handleViewReport}
                className="inline-flex items-center gap-2 px-4 py-2 bg-porcelain-gold/20 text-porcelain-gold rounded-lg text-sm font-medium hover:bg-porcelain-gold/30 transition-all"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                <BarChart3 size={16} />
                生成分析报告
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-porcelain-crackle/30 flex items-center justify-center">
                <History size={32} className="text-porcelain-inkbrown/30" />
              </div>
              <p
                className="text-porcelain-inkbrown/50"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                暂无灾难记录
              </p>
              <p
                className="text-sm text-porcelain-inkbrown/40 mt-1"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                点击"触发随机灾难"开始体验
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {history.map((record, idx) => (
                <div
                  key={record.id}
                  onClick={() => handleViewHistoryRecord(record)}
                  className={`bg-porcelain-paper rounded-xl p-4 border border-porcelain-crackle/30 cursor-pointer hover:shadow-md transition-all ${
                    isVisible ? 'animate-fade-in-up' : ''
                  }`}
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: record.event.color + '20', color: record.event.color }}
                    >
                      {iconMap[record.event.icon] || <AlertTriangle size={24} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5
                          className="font-serif font-bold text-porcelain-inkbrown truncate"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          {record.event.name}
                        </h5>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                          style={{ backgroundColor: severityColors[record.event.severity] + '20', color: severityColors[record.event.severity] }}
                        >
                          {severityNames[record.event.severity]}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-porcelain-inkbrown/60">
                        <span>{disasterTypeNames[record.event.type]}</span>
                        <span>第 {record.dayNumber} 次</span>
                        <span className="text-porcelain-youlihong">
                          损失 {record.itemsLost} 件
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-porcelain-inkbrown/30 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderTriggeredView = () => {
    if (!activeDisaster) return null;
    const event = activeDisaster.event;

    return (
      <div className="space-y-6">
        <div
          className="relative overflow-hidden rounded-2xl p-6 md:p-8 border-2 animate-pulse"
          style={{
            backgroundColor: event.color + '10',
            borderColor: event.color + '40',
          }}
        >
          <div className="absolute top-4 right-4">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: severityColors[event.severity] }}
            >
              {severityNames[event.severity]}
            </span>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: event.color, color: 'white' }}
            >
              {iconMap[event.icon] || <AlertTriangle size={32} />}
            </div>
            <div>
              <div className="text-xs text-porcelain-inkbrown/60 mb-1">
                {disasterTypeNames[event.type]}
              </div>
              <h3
                className="font-serif text-2xl md:text-3xl font-bold mb-2"
                style={{ fontFamily: '"Noto Serif SC", serif', color: event.color }}
              >
                {event.name}
              </h3>
              <p
                className="text-sm text-porcelain-inkbrown/75 leading-relaxed max-w-xl"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                {event.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-porcelain-paper/60 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-porcelain-youlihong mb-1">
                {event.baseDamage}
              </div>
              <div className="text-xs text-porcelain-inkbrown/60">基础损失点数</div>
            </div>
            <div className="bg-porcelain-paper/60 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-porcelain-ji-blue mb-1">
                {event.affectedItems}
              </div>
              <div className="text-xs text-porcelain-inkbrown/60">受影响藏品</div>
            </div>
            <div className="bg-porcelain-paper/60 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-porcelain-gold mb-1">
                {event.duration}天
              </div>
              <div className="text-xs text-porcelain-inkbrown/60">持续时间</div>
            </div>
          </div>

          <div className="bg-porcelain-paper/80 backdrop-blur rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="text-porcelain-gold" size={16} />
              <span
                className="text-sm font-bold text-porcelain-inkbrown"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                史书记载
              </span>
            </div>
            <p
              className="text-sm text-porcelain-inkbrown/70 leading-relaxed italic"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              "{event.historicalReference}"
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleStartResponding}
              className="inline-flex items-center gap-2 px-8 py-3 bg-porcelain-gold text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              <ShieldCheck size={20} />
              采取应对措施
            </button>
            <button
              onClick={handleResolve}
              className="inline-flex items-center gap-2 px-6 py-3 bg-porcelain-paper border border-porcelain-crackle/50 text-porcelain-inkbrown/70 rounded-xl font-medium hover:bg-porcelain-scroll/50 transition-all"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              <X size={18} />
              不采取措施
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderRespondingView = () => {
    if (!activeDisaster) return null;
    const event = activeDisaster.event;

    return (
      <div className="space-y-6">
        <div
          className="rounded-2xl p-5 md:p-6 border-2"
          style={{ backgroundColor: event.color + '10', borderColor: event.color + '40' }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: event.color, color: 'white' }}
              >
                {iconMap[event.icon] || <AlertTriangle size={24} />}
              </div>
              <div>
                <h3
                  className="font-serif text-xl font-bold"
                  style={{ fontFamily: '"Noto Serif SC", serif', color: event.color }}
                >
                  {event.name}
                </h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: severityColors[event.severity] + '20', color: severityColors[event.severity] }}
                >
                  {severityNames[event.severity]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-sm text-porcelain-inkbrown/60 mb-1">基础损失</div>
                <div className="font-bold text-porcelain-youlihong line-through text-lg">
                  {event.baseDamage}
                </div>
              </div>
              <div className="text-porcelain-gold">
                <TrendingDown size={24} />
              </div>
              <div className="text-center">
                <div className="text-sm text-porcelain-inkbrown/60 mb-1">预计损失</div>
                <div className="font-bold text-porcelain-celadon text-xl">
                  {activeDisaster.actualDamage}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-porcelain-inkbrown/60 mb-1">减免比例</div>
                <div className="font-bold text-porcelain-celadon text-lg">
                  {damageReduction}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-porcelain-paper rounded-xl p-4 border border-porcelain-crackle/30">
            <div className="flex items-center gap-2 mb-2">
              <Coins size={18} className="text-porcelain-gold" />
              <span className="text-sm text-porcelain-inkbrown/70">可用防灾金</span>
            </div>
            <div
              className="font-serif text-xl font-bold text-porcelain-gold"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              {formatMoney(disasterFund)}
            </div>
          </div>
          <div className="bg-porcelain-paper rounded-xl p-4 border border-porcelain-crackle/30">
            <div className="flex items-center gap-2 mb-2">
              <Target size={18} className="text-porcelain-celadon" />
              <span className="text-sm text-porcelain-inkbrown/70">已投入策略</span>
            </div>
            <div
              className="font-serif text-xl font-bold text-porcelain-celadon"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              {selectedStrategyObjects.length} 项
            </div>
          </div>
          <div className="bg-porcelain-paper rounded-xl p-4 border border-porcelain-crackle/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-porcelain-youlihong" />
              <span className="text-sm text-porcelain-inkbrown/70">策略花费</span>
            </div>
            <div
              className="font-serif text-xl font-bold text-porcelain-youlihong"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              {formatMoney(totalStrategyCost)}
            </div>
          </div>
        </div>

        <div className="bg-porcelain-scroll/30 rounded-2xl p-5 md:p-6 border border-porcelain-crackle/40">
          <h4
            className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            <Shield size={20} className="text-porcelain-ji-blue" />
            选择减灾策略
            <span className="text-sm font-normal text-porcelain-inkbrown/50">
              （可多选，效果叠加，但最高减免85%）
            </span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {applicableStrategies.map((strategy) => {
              const isSelected = activeDisaster.selectedStrategies.includes(strategy.id);
              const canAfford = totalStrategyCost - (isSelected ? strategy.cost : 0) + strategy.cost <= disasterFund;

              return (
                <button
                  key={strategy.id}
                  onClick={() => handleSelectStrategy(strategy.id)}
                  disabled={!isSelected && !canAfford}
                  className={`relative text-left bg-porcelain-paper rounded-xl p-4 border-2 transition-all duration-300 ${
                    isSelected
                      ? 'shadow-lg scale-[1.02]'
                      : canAfford
                      ? 'hover:shadow-md hover:scale-[1.01]'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{
                    borderColor: isSelected ? strategy.color : 'transparent',
                    backgroundColor: isSelected ? strategy.color + '08' : undefined,
                  }}
                >
                  {isSelected && (
                    <div
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: strategy.color }}
                    >
                      <Check size={16} />
                    </div>
                  )}

                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: strategy.color + '20', color: strategy.color }}
                    >
                      {iconMap[strategy.icon] || <Shield size={20} />}
                    </div>
                    <div>
                      <h5
                        className="font-serif font-bold text-porcelain-inkbrown"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        {strategy.name}
                      </h5>
                      <div className="text-xs font-medium" style={{ color: strategy.color }}>
                        ¥{strategy.cost.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <p
                    className="text-xs text-porcelain-inkbrown/65 leading-relaxed mb-3"
                    style={{ fontFamily: '"Noto Serif SC", serif' }}
                  >
                    {strategy.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-porcelain-inkbrown/50">减灾效果</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-porcelain-crackle/30 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${strategy.effectiveness}%`,
                            backgroundColor: strategy.color,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold" style={{ color: strategy.color }}>
                        {strategy.effectiveness}%
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleResolve}
            className="inline-flex items-center gap-2 px-8 py-3 bg-porcelain-youlihong text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            <Play size={20} />
            确认并结算损失
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-porcelain-paper border border-porcelain-crackle/50 text-porcelain-inkbrown/70 rounded-xl font-medium hover:bg-porcelain-scroll/50 transition-all"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            <X size={18} />
            取消
          </button>
        </div>
      </div>
    );
  };

  const renderReportView = () => {
    if (!currentReport && history.length === 0) return null;
    const report = currentReport || generateReport();

    const worstEvent = report.worstEvent;
    const bestStrategyName =
      availableStrategies.find((s) => s.id === report.bestStrategy)?.name || '风险共担';

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-porcelain-gold/20 flex items-center justify-center">
              <BarChart3 size={20} className="text-porcelain-gold" />
            </div>
            <h3
              className="font-serif text-2xl md:text-3xl font-bold text-porcelain-inkbrown"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              灾难历史分析报告
            </h3>
          </div>
          <p
            className="text-porcelain-inkbrown/60 text-sm"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            基于 {report.totalEvents} 次灾难事件的数据分析
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-porcelain-paper rounded-xl p-5 border border-porcelain-crackle/30 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-porcelain-youlihong/20 flex items-center justify-center">
              <AlertOctagon size={24} className="text-porcelain-youlihong" />
            </div>
            <div
              className="font-serif text-3xl font-bold text-porcelain-youlihong mb-1"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              {report.totalEvents}
            </div>
            <div className="text-xs text-porcelain-inkbrown/60">总灾难次数</div>
          </div>

          <div className="bg-porcelain-paper rounded-xl p-5 border border-porcelain-crackle/30 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-porcelain-ji-blue/20 flex items-center justify-center">
              <TrendingDown size={24} className="text-porcelain-ji-blue" />
            </div>
            <div
              className="font-serif text-3xl font-bold text-porcelain-ji-blue mb-1"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              {report.totalItemsLost}
            </div>
            <div className="text-xs text-porcelain-inkbrown/60">损失藏品总数</div>
          </div>

          <div className="bg-porcelain-paper rounded-xl p-5 border border-porcelain-crackle/30 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-porcelain-celadon/20 flex items-center justify-center">
              <TrendingUp size={24} className="text-porcelain-celadon" />
            </div>
            <div
              className="font-serif text-3xl font-bold text-porcelain-celadon mb-1"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              {Math.round(report.survivalRate)}%
            </div>
            <div className="text-xs text-porcelain-inkbrown/60">藏品保存率</div>
          </div>

          <div className="bg-porcelain-paper rounded-xl p-5 border border-porcelain-crackle/30 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-porcelain-gold/20 flex items-center justify-center">
              <Coins size={24} className="text-porcelain-gold" />
            </div>
            <div
              className="font-serif text-3xl font-bold text-porcelain-gold mb-1"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              {formatMoney(report.totalValueLost)}
            </div>
            <div className="text-xs text-porcelain-inkbrown/60">累计经济损失</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-porcelain-scroll/40 rounded-2xl p-5 border border-porcelain-crackle/40">
            <h4
              className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              <PieChart size={20} className="text-porcelain-ji-blue" />
              灾难类型分布
            </h4>
            <div className="space-y-3">
              {(Object.entries(report.eventsByType) as [keyof typeof report.eventsByType, number][]).map(
                ([type, count]) => {
                  const percentage = report.totalEvents > 0 ? (count / report.totalEvents) * 100 : 0;
                  const typeColor =
                    type === 'kiln_explosion'
                      ? '#A83232'
                      : type === 'transport_damage'
                      ? '#C9A962'
                      : type === 'war_looting'
                      ? '#8B0000'
                      : '#2C3E50';

                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-porcelain-inkbrown/80" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          {disasterTypeNames[type]}
                        </span>
                        <span className="text-sm font-bold" style={{ color: typeColor }}>
                          {count} 次 ({Math.round(percentage)}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-porcelain-crackle/30 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%`, backgroundColor: typeColor }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div className="bg-porcelain-scroll/40 rounded-2xl p-5 border border-porcelain-crackle/40">
            <h4
              className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              <Award size={20} className="text-porcelain-gold" />
              关键数据
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-porcelain-paper rounded-lg">
                <span className="text-sm text-porcelain-inkbrown/70" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  平均每次损失
                </span>
                <span className="font-bold text-porcelain-youlihong">
                  {report.averageDamagePerEvent} 点
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-porcelain-paper rounded-lg">
                <span className="text-sm text-porcelain-inkbrown/70" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  最常见灾难类型
                </span>
                <span
                  className="font-bold"
                  style={{
                    color:
                      report.mostCommonType === 'kiln_explosion'
                        ? '#A83232'
                        : report.mostCommonType === 'transport_damage'
                        ? '#C9A962'
                        : report.mostCommonType === 'war_looting'
                        ? '#8B0000'
                        : '#2C3E50',
                  }}
                >
                  {disasterTypeNames[report.mostCommonType]}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-porcelain-paper rounded-lg">
                <span className="text-sm text-porcelain-inkbrown/70" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  最佳减灾策略
                </span>
                <span className="font-bold text-porcelain-celadon">
                  {bestStrategyName}
                </span>
              </div>
              {worstEvent && (
                <div className="flex items-center justify-between p-3 bg-porcelain-paper rounded-lg">
                  <span className="text-sm text-porcelain-inkbrown/70" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    最严重灾难
                  </span>
                  <span className="font-bold text-porcelain-youlihong">
                    {worstEvent.event.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-porcelain-gold/10 to-porcelain-celadon/10 rounded-2xl p-5 md:p-6 border border-porcelain-gold/30">
          <h4
            className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            <Sparkles size={20} className="text-porcelain-gold" />
            分析洞察
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.insights.map((insight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 bg-porcelain-paper/80 backdrop-blur rounded-xl"
              >
                <div className="w-6 h-6 rounded-full bg-porcelain-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-porcelain-gold">{idx + 1}</span>
                </div>
                <p
                  className="text-sm text-porcelain-inkbrown/80 leading-relaxed"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center pt-4">
          <button
            onClick={handleCloseReport}
            className="inline-flex items-center gap-2 px-8 py-3 bg-porcelain-ji-blue text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            <RotateCcw size={20} />
            继续模拟
          </button>
          <button
            onClick={handleTrigger}
            className="inline-flex items-center gap-2 px-6 py-3 bg-porcelain-paper border border-porcelain-crackle/50 text-porcelain-inkbrown/70 rounded-xl font-medium hover:bg-porcelain-scroll/50 transition-all"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            <Zap size={18} />
            再来一次
          </button>
        </div>
      </div>
    );
  };

  return (
    <section
      id="disaster"
      className="section-padding bg-porcelain-glaze relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-porcelain-paper to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative">
        <SectionTitle
          tag="DISASTER · 拾柒"
          title="灾难事件"
          subtitle='"水火兵燹，舟车劳顿，瓷器传世之难，难于上青天。"体验陶瓷文明的风险与韧性，以史为鉴，防患未然'
        />

        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          {phase === 'idle' && renderIdleView()}
          {phase === 'triggered' && renderTriggeredView()}
          {phase === 'responding' && renderRespondingView()}
          {(phase === 'report' || currentReport) && renderReportView()}
        </div>
      </div>
    </section>
  );
}
