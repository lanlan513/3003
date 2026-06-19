import { useState, useMemo, useCallback } from 'react';
import {
  ShoppingBag,
  Coins,
  Star,
  TrendingUp,
  TrendingDown,
  Search,
  Eye,
  DollarSign,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  X,
  AlertTriangle,
  Trophy,
  Package,
  History,
  Store,
  Sparkles,
  Clock,
  Zap,
  RotateCcw,
  ChevronRight,
  Info,
} from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import SealLabel from '@/components/common/SealLabel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useMarketStore, calculateCurrentMarketPrice, calculateSellPrice } from '@/store/marketStore';
import {
  rarityConfig,
  conditionConfig,
  periodConfig,
  categoryConfig,
  shopUpgradeCosts,
  shopCapacityByLevel,
  shopExhibitSlotsByLevel,
  formatMoney,
} from '@/data/market';
import type { MarketItem, InventoryItem, DetailData, TransactionType } from '@/types';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

type TabType = 'market' | 'inventory' | 'transactions' | 'shop';

const MarketSection = ({ onOpenDetail }: Props) => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);
  const [activeTab, setActiveTab] = useState<TabType>('market');
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [selectedInventory, setSelectedInventory] = useState<InventoryItem | null>(null);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [showAuthenticateResult, setShowAuthenticateResult] = useState<{ success: boolean; isAuthentic: boolean; note?: string } | null>(null);

  const {
    capital,
    reputation,
    day,
    inventory,
    transactions,
    activeEvents,
    marketItems,
    shopLevel,
    shopName,
    totalProfit,
    totalExhibitions,
    totalSales,
    totalPurchases,
    buyItem,
    sellItem,
    authenticateItem,
    startExhibition,
    endExhibition,
    advanceDay,
    refreshMarketItems,
    resetMarket,
    upgradeShop,
  } = useMarketStore();

  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleBuy = useCallback((item: MarketItem) => {
    const currentPrice = calculateCurrentMarketPrice(item, activeEvents);
    if (capital < currentPrice) {
      showNotification('error', '资金不足，无法购买此藏品');
      return;
    }

    const capacity = shopCapacityByLevel[shopLevel - 1];
    if (inventory.length >= capacity) {
      showNotification('error', '库房已满，请先升级店铺或出售藏品');
      return;
    }

    const success = buyItem(item.id);
    if (success) {
      showNotification('success', `成功购入 ${item.name}，花费 ${formatMoney(currentPrice)}`);
      setSelectedItem(null);
    }
  }, [capital, inventory.length, shopLevel, activeEvents, buyItem, showNotification]);

  const handleSell = useCallback(() => {
    if (!selectedInventory) return;
    
    if (sellPrice <= 0) {
      showNotification('error', '请输入有效售价');
      return;
    }

    const success = sellItem(selectedInventory.id, sellPrice);
    if (success) {
      const profit = sellPrice - selectedInventory.purchasePrice;
      showNotification(
        'success',
        `成功出售 ${selectedInventory.item.name}，${profit >= 0 ? '盈利' : '亏损'} ${formatMoney(Math.abs(profit))}`
      );
      setSelectedInventory(null);
      setSellPrice(0);
    }
  }, [selectedInventory, sellPrice, sellItem, showNotification]);

  const handleAuthenticate = useCallback((inventoryId: string) => {
    const result = authenticateItem(inventoryId);
    if (!result.success && result.note) {
      showNotification('error', result.note);
      return;
    }
    setShowAuthenticateResult(result);
  }, [authenticateItem, showNotification]);

  const handleStartExhibition = useCallback((inventoryId: string) => {
    const success = startExhibition(inventoryId);
    if (success) {
      showNotification('success', '展品已上架，静待宾客光临');
    } else {
      const item = inventory.find((i) => i.id === inventoryId);
      if (item && !item.isAuthenticated) {
        showNotification('error', '请先鉴定藏品真伪');
      } else if (item && item.item.authentication !== 'authentic') {
        showNotification('error', '赝品不可展出');
      } else {
        const exhibitSlots = shopExhibitSlotsByLevel[shopLevel - 1];
        const currentlyExhibited = inventory.filter((i) => i.isExhibited).length;
        if (currentlyExhibited >= exhibitSlots) {
          showNotification('error', '展位已满，请升级店铺或结束其他展出');
        }
      }
    }
  }, [startExhibition, inventory, shopLevel, showNotification]);

  const handleEndExhibition = useCallback((inventoryId: string) => {
    const income = endExhibition(inventoryId);
    if (income > 0) {
      showNotification('success', `展出结束，获得收益 ${formatMoney(income)}`);
    }
  }, [endExhibition, showNotification]);

  const handleAdvanceDay = useCallback(() => {
    advanceDay();
    showNotification('info', '新的一天开始了，市场行情有所变化');
  }, [advanceDay, showNotification]);

  const handleReset = useCallback(() => {
    if (confirm('确定要重新开始吗？所有进度将被清空。')) {
      resetMarket();
      showNotification('info', '游戏已重置，祝您财源广进！');
    }
  }, [resetMarket, showNotification]);

  const handleUpgrade = useCallback(() => {
    if (shopLevel >= shopUpgradeCosts.length) {
      showNotification('info', '店铺已达最高等级');
      return;
    }

    const cost = shopUpgradeCosts[shopLevel];
    const requiredRep = shopLevel * 20;

    if (capital < cost) {
      showNotification('error', `升级需要 ${formatMoney(cost)}，资金不足`);
      return;
    }

    if (reputation < requiredRep) {
      showNotification('error', `升级需要声望 ${requiredRep}，当前 ${reputation}`);
      return;
    }

    const success = upgradeShop();
    if (success) {
      showNotification('success', `店铺升级成功！当前等级 ${shopLevel + 1}`);
    }
  }, [shopLevel, capital, reputation, upgradeShop, showNotification]);

  const handleViewDetail = useCallback((item: MarketItem, source: 'market' | 'inventory') => {
    const currentPrice = source === 'market' 
      ? calculateCurrentMarketPrice(item, activeEvents)
      : item.currentMarketPrice;

    onOpenDetail({
      type: 'market-item',
      id: item.id,
      title: item.name,
      subtitle: `${item.periodName}·${item.kiln}`,
      description: item.description + '\n\n' + item.historicalSignificance,
      sections: [
        { title: '基本信息', content: [
          `年代：${item.periodName}`,
          `窑口：${item.kiln}`,
          `器型：${item.categoryName}`,
          `品相：${conditionConfig[item.condition].name}`,
          `稀有度：${rarityConfig[item.rarity].name}`,
        ]},
        { title: '藏品特征', content: item.features },
        { title: '市场行情', content: [
          `基准价值：${formatMoney(item.baseValue)}`,
          `当前市价：${formatMoney(currentPrice)}`,
          `价格趋势：${item.priceTrend === 'rising' ? '上涨' : item.priceTrend === 'falling' ? '下跌' : '平稳'} ${Math.abs(item.priceChangePercent).toFixed(1)}%`,
          `每日展出收益：${formatMoney(item.exhibitIncome)}`,
        ]},
        { title: '鉴定状态', content: [
          item.authentication === 'authentic' ? '✓ 已鉴定为真品' :
          item.authentication === 'forgery' ? '✗ 已鉴定为赝品' : '? 尚未鉴定',
        ]},
      ],
      color: item.color,
      bgColor: `${item.color}15`,
      imagePrompt: item.imagePrompt,
    });
  }, [activeEvents, onOpenDetail]);

  const displayedMarketItems = useMemo(() => {
    return marketItems.slice(0, 8);
  }, [marketItems]);

  const exhibitedItems = useMemo(() => {
    return inventory.filter((i) => i.isExhibited);
  }, [inventory]);

  const nonExhibitedItems = useMemo(() => {
    return inventory.filter((i) => !i.isExhibited);
  }, [inventory]);

  const tabs: { id: TabType; label: string; icon: JSX.Element }[] = [
    { id: 'market', label: '淘宝市场', icon: <ShoppingBag size={16} /> },
    { id: 'inventory', label: '我的库房', icon: <Package size={16} /> },
    { id: 'transactions', label: '交易记录', icon: <History size={16} /> },
    { id: 'shop', label: '店铺管理', icon: <Store size={16} /> },
  ];

  const transactionTypeConfig: Record<TransactionType, { label: string; color: string; icon: JSX.Element }> = {
    buy: { label: '购入', color: '#A83232', icon: <ArrowDownRight size={12} /> },
    sell: { label: '售出', color: '#2E8B57', icon: <ArrowUpRight size={12} /> },
    exhibit: { label: '展出', color: '#C9A962', icon: <Eye size={12} /> },
  };

  const RarityBadge = ({ rarity }: { rarity: MarketItem['rarity'] }) => {
    const config = rarityConfig[rarity];
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold"
        style={{ backgroundColor: `${config.color}20`, color: config.color }}
      >
        {config.name}
      </span>
    );
  };

  const PriceTrendBadge = ({ trend, change }: { trend: MarketItem['priceTrend']; change: number }) => {
    const config = {
      rising: { icon: <TrendingUp size={12} />, color: '#2E8B57', bg: '#2E8B5715' },
      stable: { icon: <Clock size={12} />, color: '#708090', bg: '#70809015' },
      falling: { icon: <TrendingDown size={12} />, color: '#A83232', bg: '#A8323215' },
    }[trend];

    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.icon}
        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
      </span>
    );
  };

  const ItemCard = ({ item, onClick, isSelected }: { item: MarketItem; onClick: () => void; isSelected?: boolean }) => {
    const currentPrice = calculateCurrentMarketPrice(item, activeEvents);
    
    return (
      <button
        onClick={onClick}
        className={`relative text-left p-4 rounded-xl border-2 transition-all duration-300 ${
          isSelected
            ? 'border-porcelain-gold bg-porcelain-gold/10 shadow-lg scale-[1.02]'
            : 'border-porcelain-crackle/30 bg-porcelain-paper hover:border-porcelain-gold/50 hover:-translate-y-0.5'
        }`}
      >
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-16 h-16 rounded-xl flex-shrink-0 shadow-inner"
            style={{
              background: `linear-gradient(135deg, ${item.color}40, ${item.color})`,
              boxShadow: `inset 0 2px 8px rgba(255,255,255,0.3), inset 0 -2px 8px rgba(0,0,0,0.1)`,
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h5
                className="font-serif font-bold text-porcelain-inkbrown text-sm truncate"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                {item.name}
              </h5>
              {isSelected && <Check size={14} className="text-porcelain-gold flex-shrink-0" />}
            </div>
            <p className="text-[10px] text-porcelain-inkbrown/50 mb-2">
              {item.periodName}·{item.kiln}
            </p>
            <div className="flex gap-1.5 flex-wrap">
              <RarityBadge rarity={item.rarity} />
              <PriceTrendBadge trend={item.priceTrend} change={item.priceChangePercent} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-porcelain-crackle/20">
          <span className="text-[10px] text-porcelain-inkbrown/50">市价</span>
          <span
            className="font-bold text-sm"
            style={{ color: capital >= currentPrice ? '#2E8B57' : '#A83232' }}
          >
            {formatMoney(currentPrice)}
          </span>
        </div>
      </button>
    );
  };

  const InventoryCard = ({ item, onClick, isSelected }: { item: InventoryItem; onClick: () => void; isSelected?: boolean }) => {
    const marketValue = calculateSellPrice(item, activeEvents);
    const profit = marketValue - item.purchasePrice;
    
    return (
      <button
        onClick={onClick}
        className={`relative text-left p-4 rounded-xl border-2 transition-all duration-300 ${
          isSelected
            ? 'border-porcelain-gold bg-porcelain-gold/10 shadow-lg'
            : item.isExhibited
            ? 'border-porcelain-celadon/50 bg-porcelain-celadon/5'
            : 'border-porcelain-crackle/30 bg-porcelain-paper hover:border-porcelain-gold/50'
        }`}
      >
        {item.isExhibited && (
          <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-porcelain-celadon text-white text-[9px] font-bold flex items-center gap-1">
            <Eye size={10} />
            展出中
          </div>
        )}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-14 h-14 rounded-xl flex-shrink-0 shadow-inner"
            style={{
              background: `linear-gradient(135deg, ${item.item.color}40, ${item.item.color})`,
              boxShadow: `inset 0 2px 8px rgba(255,255,255,0.3), inset 0 -2px 8px rgba(0,0,0,0.1)`,
            }}
          />
          <div className="flex-1 min-w-0">
            <h5
              className="font-serif font-bold text-porcelain-inkbrown text-sm mb-1"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              {item.item.name}
            </h5>
            <div className="flex gap-1.5 flex-wrap mb-2">
              <RarityBadge rarity={item.item.rarity} />
              {item.isAuthenticated ? (
                item.item.authentication === 'authentic' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-porcelain-celadon/20 text-porcelain-celadon">
                    <Check size={10} />
                    真品
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-porcelain-youlihong/20 text-porcelain-youlihong">
                    <X size={10} />
                    赝品
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-porcelain-inkbrown/10 text-porcelain-inkbrown/60">
                  <Search size={10} />
                  待鉴定
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-1 text-[10px]">
          <div className="flex justify-between">
            <span className="text-porcelain-inkbrown/50">购入价</span>
            <span className="text-porcelain-inkbrown/70">{formatMoney(item.purchasePrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-porcelain-inkbrown/50">估值</span>
            <span style={{ color: profit >= 0 ? '#2E8B57' : '#A83232' }}>
              {formatMoney(marketValue)}
            </span>
          </div>
          {item.totalEarnings > 0 && (
            <div className="flex justify-between">
              <span className="text-porcelain-inkbrown/50">累计收益</span>
              <span className="text-porcelain-celadon">+{formatMoney(item.totalEarnings)}</span>
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <section id="market" className="section-padding bg-gradient-to-b from-porcelain-gold/5 to-porcelain-paper relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-porcelain-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-porcelain-celadon/5 rounded-full blur-3xl" />

      {notification && (
        <div
          className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg animate-fade-in flex items-center gap-2 ${
            notification.type === 'success' ? 'bg-porcelain-celadon text-white' :
            notification.type === 'error' ? 'bg-porcelain-youlihong text-white' :
            'bg-porcelain-ji-blue text-white'
          }`}
        >
          {notification.type === 'success' && <Check size={18} />}
          {notification.type === 'error' && <X size={18} />}
          {notification.type === 'info' && <Info size={18} />}
          <span style={{ fontFamily: '"Noto Serif SC", serif' }}>{notification.message}</span>
        </div>
      )}

      {showAuthenticateResult && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAuthenticateResult(null)}>
          <div
            className="bg-porcelain-paper rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  showAuthenticateResult.isAuthentic ? 'bg-porcelain-celadon/20' : 'bg-porcelain-youlihong/20'
                }`}
              >
                {showAuthenticateResult.isAuthentic ? (
                  <Check size={32} className="text-porcelain-celadon" />
                ) : (
                  <X size={32} className="text-porcelain-youlihong" />
                )}
              </div>
              <h4
                className="font-serif text-xl font-bold mb-2"
                style={{
                  fontFamily: '"Noto Serif SC", serif',
                  color: showAuthenticateResult.isAuthentic ? '#2E8B57' : '#A83232',
                }}
              >
                {showAuthenticateResult.isAuthentic ? '鉴定结果：真品' : '鉴定结果：赝品'}
              </h4>
              {showAuthenticateResult.note && (
                <p
                  className="text-sm text-porcelain-inkbrown/70 leading-relaxed"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  {showAuthenticateResult.note}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowAuthenticateResult(null)}
              className="w-full py-2.5 bg-porcelain-ji-blue text-white rounded-xl font-bold hover:bg-porcelain-ji-blue/90 transition-colors"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              我知道了
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 md:px-8 relative">
        <SectionTitle
          tag="MARKET · 柒"
          title="瓷市经营"
          subtitle='"世间珍玩，聚散有时"。经营你的古陶瓷店铺，慧眼识宝，低买高卖，成为一代瓷商传奇'
        />

        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <div className="bg-porcelain-paper/80 rounded-2xl p-5 md:p-8 shadow-porcelain border border-porcelain-crackle/40 backdrop-blur-sm">
            <div className="flex items-start gap-3 mb-6">
              <SealLabel text="商" size="md" />
              <div className="flex-1">
                <h3
                  className="font-serif text-xl md:text-2xl font-bold text-porcelain-inkbrown mb-1"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  {shopName}
                </h3>
                <p
                  className="text-sm text-porcelain-inkbrown/65 leading-relaxed"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  低买高卖，慧眼识珍。在变幻莫测的古董市场中积累财富与声望，成为陶瓷收藏界的巨擘。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-gradient-to-br from-porcelain-gold/10 to-porcelain-gold/5 rounded-xl p-4 border border-porcelain-gold/20">
                <div className="flex items-center gap-2 mb-2">
                  <Coins size={18} className="text-porcelain-gold" />
                  <span className="text-xs text-porcelain-inkbrown/60">流动资金</span>
                </div>
                <p
                  className="font-bold text-lg text-porcelain-gold"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  {formatMoney(capital)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-porcelain-celadon/10 to-porcelain-celadon/5 rounded-xl p-4 border border-porcelain-celadon/20">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={18} className="text-porcelain-celadon" />
                  <span className="text-xs text-porcelain-inkbrown/60">店铺声望</span>
                </div>
                <p
                  className="font-bold text-lg text-porcelain-celadon"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  {reputation}/100
                </p>
              </div>
              <div className="bg-gradient-to-br from-porcelain-ji-blue/10 to-porcelain-ji-blue/5 rounded-xl p-4 border border-porcelain-ji-blue/20">
                <div className="flex items-center gap-2 mb-2">
                  <Store size={18} className="text-porcelain-ji-blue" />
                  <span className="text-xs text-porcelain-inkbrown/60">店铺等级</span>
                </div>
                <p
                  className="font-bold text-lg text-porcelain-ji-blue"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  Lv.{shopLevel}
                </p>
              </div>
              <div className="bg-gradient-to-br from-porcelain-youlihong/10 to-porcelain-youlihong/5 rounded-xl p-4 border border-porcelain-youlihong/20">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={18} className="text-porcelain-youlihong" />
                  <span className="text-xs text-porcelain-inkbrown/60">经营天数</span>
                </div>
                <p
                  className="font-bold text-lg text-porcelain-youlihong"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  第 {day} 天
                </p>
              </div>
            </div>

            {activeEvents.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-porcelain-scroll/30 border border-porcelain-crackle/30">
                <h5
                  className="font-serif text-sm font-bold text-porcelain-inkbrown mb-3 flex items-center gap-2"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  <Zap size={16} className="text-porcelain-gold" />
                  市场动态
                </h5>
                <div className="space-y-2">
                  {activeEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`flex items-start gap-2 p-3 rounded-lg ${
                        event.type === 'positive' ? 'bg-porcelain-celadon/10' :
                        event.type === 'negative' ? 'bg-porcelain-youlihong/10' : 'bg-porcelain-inkbrown/5'
                      }`}
                    >
                      <span
                        className={`text-lg ${
                          event.type === 'positive' ? 'text-porcelain-celadon' :
                          event.type === 'negative' ? 'text-porcelain-youlihong' : 'text-porcelain-inkbrown/60'
                        }`}
                      >
                        {event.type === 'positive' ? '↑' : event.type === 'negative' ? '↓' : '○'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-bold text-porcelain-inkbrown"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          {event.name}
                        </p>
                        <p
                          className="text-xs text-porcelain-inkbrown/60"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          {event.description}
                        </p>
                        <p className="text-[10px] text-porcelain-inkbrown/40 mt-1">
                          持续 {event.duration} 天 · 价格影响 ×{event.priceMultiplier}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-porcelain-ji-blue text-white shadow-md'
                      : 'bg-porcelain-inkbrown/5 text-porcelain-inkbrown/60 hover:bg-porcelain-inkbrown/10'
                  }`}
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'market' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h4
                      className="font-serif text-lg font-bold text-porcelain-inkbrown flex items-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <span className="w-2 h-2 rounded-full bg-porcelain-gold animate-pulse" />
                      今日市场
                    </h4>
                    <button
                      onClick={refreshMarketItems}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-porcelain-inkbrown/5 text-porcelain-inkbrown/60 text-xs hover:bg-porcelain-inkbrown/10 transition-colors"
                    >
                      <RefreshCw size={12} />
                      刷新市场
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {displayedMarketItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        onClick={() => {
                          setSelectedItem(item);
                          setSelectedInventory(null);
                        }}
                        isSelected={selectedItem?.id === item.id}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-porcelain-scroll/40 to-porcelain-paper rounded-xl p-5 border border-porcelain-crackle/30">
                  {selectedItem ? (
                    <div className="animate-fade-in">
                      <div
                        className="w-full aspect-square rounded-2xl mb-4 shadow-xl"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, ${selectedItem.color}40, ${selectedItem.color}), ${selectedItem.color}`,
                          boxShadow: `0 20px 60px ${selectedItem.color}30, inset 0 4px 16px rgba(255,255,255,0.3), inset 0 -4px 16px rgba(0,0,0,0.15)`,
                        }}
                      />
                      <h4
                        className="font-serif text-lg font-bold text-porcelain-inkbrown mb-2"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        {selectedItem.name}
                      </h4>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <RarityBadge rarity={selectedItem.rarity} />
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold"
                          style={{ backgroundColor: `${periodConfig[selectedItem.period].color}20`, color: periodConfig[selectedItem.period].color }}
                        >
                          {selectedItem.periodName}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-porcelain-inkbrown/10 text-porcelain-inkbrown/60">
                          {categoryConfig[selectedItem.category].name}
                        </span>
                      </div>
                      <p
                        className="text-sm text-porcelain-inkbrown/70 leading-relaxed mb-4"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        {selectedItem.description}
                      </p>
                      <div className="p-3 rounded-lg bg-porcelain-paper mb-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-porcelain-inkbrown/50">窑口</span>
                          <span className="text-porcelain-inkbrown">{selectedItem.kiln}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-porcelain-inkbrown/50">品相</span>
                          <span className="text-porcelain-inkbrown">{conditionConfig[selectedItem.condition].name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-porcelain-inkbrown/50">日展收益</span>
                          <span className="text-porcelain-celadon">{formatMoney(selectedItem.exhibitIncome)}</span>
                        </div>
                      </div>
                      <div className="text-center mb-4">
                        <p className="text-xs text-porcelain-inkbrown/50 mb-1">当前市价</p>
                        <p
                          className="font-bold text-2xl"
                          style={{
                            color: calculateCurrentMarketPrice(selectedItem, activeEvents) <= capital ? '#2E8B57' : '#A83232',
                            fontFamily: '"Noto Serif SC", serif',
                          }}
                        >
                          {formatMoney(calculateCurrentMarketPrice(selectedItem, activeEvents))}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetail(selectedItem, 'market')}
                          className="flex-1 py-2.5 bg-porcelain-inkbrown/10 text-porcelain-inkbrown/70 rounded-xl font-bold text-sm hover:bg-porcelain-inkbrown/15 transition-colors flex items-center justify-center gap-1.5"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          <Info size={14} />
                          详情
                        </button>
                        <button
                          onClick={() => handleBuy(selectedItem)}
                          disabled={calculateCurrentMarketPrice(selectedItem, activeEvents) > capital}
                          className="flex-1 py-2.5 bg-porcelain-celadon text-white rounded-xl font-bold text-sm hover:bg-porcelain-celadon/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          <ShoppingBag size={14} />
                          购入
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                      <div className="w-20 h-20 rounded-full bg-porcelain-crackle/20 flex items-center justify-center mb-4">
                        <Sparkles size={32} className="text-porcelain-gold/50" />
                      </div>
                      <p
                        className="text-sm text-porcelain-inkbrown/50"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        点击左侧藏品查看详情
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {exhibitedItems.length > 0 && (
                    <div className="mb-6">
                      <h4
                        className="font-serif text-lg font-bold text-porcelain-inkbrown mb-3 flex items-center gap-2"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        <Eye size={18} className="text-porcelain-celadon" />
                        正在展出 ({exhibitedItems.length}/{shopExhibitSlotsByLevel[shopLevel - 1]})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {exhibitedItems.map((item) => (
                          <InventoryCard
                            key={item.id}
                            item={item}
                            onClick={() => {
                              setSelectedInventory(item);
                              setSelectedItem(null);
                              setSellPrice(calculateSellPrice(item, activeEvents));
                            }}
                            isSelected={selectedInventory?.id === item.id}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <h4
                    className="font-serif text-lg font-bold text-porcelain-inkbrown mb-3 flex items-center gap-2"
                    style={{ fontFamily: '"Noto Serif SC", serif' }}
                  >
                    <Package size={18} className="text-porcelain-ji-blue" />
                    库房藏品 ({nonExhibitedItems.length}/{shopCapacityByLevel[shopLevel - 1]})
                  </h4>
                  {nonExhibitedItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {nonExhibitedItems.map((item) => (
                        <InventoryCard
                          key={item.id}
                          item={item}
                          onClick={() => {
                            setSelectedInventory(item);
                            setSelectedItem(null);
                            setSellPrice(calculateSellPrice(item, activeEvents));
                          }}
                          isSelected={selectedInventory?.id === item.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-porcelain-scroll/20 rounded-xl">
                      <Package size={48} className="mx-auto mb-3 text-porcelain-inkbrown/30" />
                      <p
                        className="text-sm text-porcelain-inkbrown/50"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        库房空空如也，去市场淘宝吧
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-porcelain-scroll/40 to-porcelain-paper rounded-xl p-5 border border-porcelain-crackle/30">
                  {selectedInventory ? (
                    <div className="animate-fade-in">
                      <div
                        className="w-full aspect-square rounded-2xl mb-4 shadow-xl"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, ${selectedInventory.item.color}40, ${selectedInventory.item.color}), ${selectedInventory.item.color}`,
                          boxShadow: `0 20px 60px ${selectedInventory.item.color}30, inset 0 4px 16px rgba(255,255,255,0.3), inset 0 -4px 16px rgba(0,0,0,0.15)`,
                        }}
                      />
                      <h4
                        className="font-serif text-lg font-bold text-porcelain-inkbrown mb-2"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        {selectedInventory.item.name}
                      </h4>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <RarityBadge rarity={selectedInventory.item.rarity} />
                        {selectedInventory.isAuthenticated ? (
                          selectedInventory.item.authentication === 'authentic' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-porcelain-celadon/20 text-porcelain-celadon">
                              <Check size={10} />
                              真品
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-porcelain-youlihong/20 text-porcelain-youlihong">
                              <X size={10} />
                              赝品
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-porcelain-inkbrown/10 text-porcelain-inkbrown/60">
                            <Search size={10} />
                            待鉴定
                          </span>
                        )}
                      </div>
                      <div className="p-3 rounded-lg bg-porcelain-paper mb-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-porcelain-inkbrown/50">购入价</span>
                          <span className="text-porcelain-inkbrown">{formatMoney(selectedInventory.purchasePrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-porcelain-inkbrown/50">当前估值</span>
                          <span style={{ color: calculateSellPrice(selectedInventory, activeEvents) >= selectedInventory.purchasePrice ? '#2E8B57' : '#A83232' }}>
                            {formatMoney(calculateSellPrice(selectedInventory, activeEvents))}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-porcelain-inkbrown/50">预计盈亏</span>
                          <span style={{ color: calculateSellPrice(selectedInventory, activeEvents) - selectedInventory.purchasePrice >= 0 ? '#2E8B57' : '#A83232' }}>
                            {calculateSellPrice(selectedInventory, activeEvents) - selectedInventory.purchasePrice >= 0 ? '+' : ''}
                            {formatMoney(calculateSellPrice(selectedInventory, activeEvents) - selectedInventory.purchasePrice)}
                          </span>
                        </div>
                        {selectedInventory.totalEarnings > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-porcelain-inkbrown/50">累计收益</span>
                            <span className="text-porcelain-celadon">+{formatMoney(selectedInventory.totalEarnings)}</span>
                          </div>
                        )}
                      </div>

                      {!selectedInventory.isAuthenticated && (
                        <button
                          onClick={() => handleAuthenticate(selectedInventory.id)}
                          className="w-full py-2.5 bg-porcelain-gold/15 text-porcelain-gold rounded-xl font-bold text-sm mb-2 hover:bg-porcelain-gold/25 transition-colors flex items-center justify-center gap-1.5"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          <Search size={14} />
                          鉴定真伪（{formatMoney(Math.round(selectedInventory.purchasePrice * 0.05))}）
                        </button>
                      )}

                      {selectedInventory.isAuthenticated && selectedInventory.item.authentication === 'authentic' && !selectedInventory.isExhibited && (
                        <button
                          onClick={() => handleStartExhibition(selectedInventory.id)}
                          className="w-full py-2.5 bg-porcelain-celadon/15 text-porcelain-celadon rounded-xl font-bold text-sm mb-2 hover:bg-porcelain-celadon/25 transition-colors flex items-center justify-center gap-1.5"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          <Eye size={14} />
                          开始展出（{formatMoney(selectedInventory.item.exhibitIncome)}/天）
                        </button>
                      )}

                      {selectedInventory.isExhibited && (
                        <button
                          onClick={() => handleEndExhibition(selectedInventory.id)}
                          className="w-full py-2.5 bg-porcelain-youlihong/15 text-porcelain-youlihong rounded-xl font-bold text-sm mb-2 hover:bg-porcelain-youlihong/25 transition-colors flex items-center justify-center gap-1.5"
                          style={{ fontFamily: '"Noto Serif SC", serif' }}
                        >
                          <X size={14} />
                          结束展出
                        </button>
                      )}

                      {!selectedInventory.isExhibited && (
                        <div className="space-y-3">
                          <div className="p-3 rounded-lg bg-porcelain-paper">
                            <label className="text-xs text-porcelain-inkbrown/50 mb-1 block">出售定价</label>
                            <input
                              type="number"
                              value={sellPrice}
                              onChange={(e) => setSellPrice(Number(e.target.value))}
                              className="w-full bg-transparent border-none outline-none text-porcelain-inkbrown font-bold text-lg"
                              style={{ fontFamily: '"Noto Serif SC", serif' }}
                            />
                            <div className="flex gap-2 mt-2">
                              {[0.9, 1.0, 1.1, 1.2].map((multiplier) => (
                                <button
                                  key={multiplier}
                                  onClick={() => setSellPrice(Math.round(calculateSellPrice(selectedInventory, activeEvents) * multiplier))}
                                  className="flex-1 py-1 text-[10px] rounded bg-porcelain-inkbrown/5 text-porcelain-inkbrown/60 hover:bg-porcelain-inkbrown/10 transition-colors"
                                >
                                  {multiplier === 0.9 ? '九折' : multiplier === 1.0 ? '估值' : multiplier === 1.1 ? '溢价10%' : '溢价20%'}
                                </button>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={handleSell}
                            disabled={sellPrice <= 0}
                            className="w-full py-2.5 bg-porcelain-celadon text-white rounded-xl font-bold text-sm hover:bg-porcelain-celadon/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                            style={{ fontFamily: '"Noto Serif SC", serif' }}
                          >
                            <DollarSign size={14} />
                            确认出售
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => handleViewDetail(selectedInventory.item, 'inventory')}
                        className="w-full py-2.5 bg-porcelain-inkbrown/10 text-porcelain-inkbrown/70 rounded-xl font-bold text-sm mt-2 hover:bg-porcelain-inkbrown/15 transition-colors flex items-center justify-center gap-1.5"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        <Info size={14} />
                        查看详情
                      </button>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                      <div className="w-20 h-20 rounded-full bg-porcelain-crackle/20 flex items-center justify-center mb-4">
                        <Package size={32} className="text-porcelain-inkbrown/30" />
                      </div>
                      <p
                        className="text-sm text-porcelain-inkbrown/50"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        选择一件藏品进行操作
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="p-4 rounded-xl bg-porcelain-scroll/30 text-center">
                    <p className="text-xs text-porcelain-inkbrown/50 mb-1">总购入</p>
                    <p className="font-bold text-lg text-porcelain-ji-blue" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      {totalPurchases} 件
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-porcelain-scroll/30 text-center">
                    <p className="text-xs text-porcelain-inkbrown/50 mb-1">总售出</p>
                    <p className="font-bold text-lg text-porcelain-celadon" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      {totalSales} 件
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-porcelain-scroll/30 text-center">
                    <p className="text-xs text-porcelain-inkbrown/50 mb-1">展出次数</p>
                    <p className="font-bold text-lg text-porcelain-gold" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      {totalExhibitions} 次
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-porcelain-scroll/30 text-center">
                    <p className="text-xs text-porcelain-inkbrown/50 mb-1">累计盈亏</p>
                    <p
                      className="font-bold text-lg"
                      style={{
                        color: totalProfit >= 0 ? '#2E8B57' : '#A83232',
                        fontFamily: '"Noto Serif SC", serif',
                      }}
                    >
                      {totalProfit >= 0 ? '+' : ''}{formatMoney(totalProfit)}
                    </p>
                  </div>
                </div>

                {transactions.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {transactions.map((tx) => {
                      const config = transactionTypeConfig[tx.type];
                      return (
                        <div
                          key={tx.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-porcelain-paper hover:bg-porcelain-scroll/20 transition-colors"
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${config.color}15` }}
                          >
                            <span style={{ color: config.color }}>{config.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className="font-bold text-sm text-porcelain-inkbrown truncate"
                                style={{ fontFamily: '"Noto Serif SC", serif' }}
                              >
                                {tx.itemName}
                              </span>
                              <span
                                className="font-bold text-sm flex-shrink-0 ml-2"
                                style={{ color: tx.type === 'buy' ? '#A83232' : '#2E8B57' }}
                              >
                                {tx.type === 'buy' ? '-' : '+'}{formatMoney(tx.amount)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className="text-[10px] px-2 py-0.5 rounded"
                                style={{ backgroundColor: `${config.color}15`, color: config.color }}
                              >
                                {config.label}
                              </span>
                              {tx.note && (
                                <span className="text-[10px] text-porcelain-inkbrown/50 truncate">{tx.note}</span>
                              )}
                              <span className="text-[10px] text-porcelain-inkbrown/40 ml-auto flex-shrink-0">
                                第 {Math.ceil((tx.timestamp - Date.now() + day * 86400000) / 86400000)} 天
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-porcelain-scroll/20 rounded-xl">
                    <History size={48} className="mx-auto mb-3 text-porcelain-inkbrown/30" />
                    <p
                      className="text-sm text-porcelain-inkbrown/50"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      暂无交易记录
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shop' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-porcelain-gold/10 to-porcelain-paper border border-porcelain-gold/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-porcelain-gold/20 flex items-center justify-center">
                      <Trophy size={28} className="text-porcelain-gold" />
                    </div>
                    <div>
                      <h4
                        className="font-serif text-xl font-bold text-porcelain-inkbrown"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        {shopName}
                      </h4>
                      <p className="text-sm text-porcelain-inkbrown/60">等级 {shopLevel} / {shopUpgradeCosts.length}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-porcelain-inkbrown/60">库房容量</span>
                        <span className="text-porcelain-inkbrown font-bold">
                          {inventory.length} / {shopCapacityByLevel[shopLevel - 1]}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-porcelain-crackle/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-porcelain-ji-blue rounded-full transition-all"
                          style={{ width: `${(inventory.length / shopCapacityByLevel[shopLevel - 1]) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-porcelain-inkbrown/60">展出场位</span>
                        <span className="text-porcelain-inkbrown font-bold">
                          {exhibitedItems.length} / {shopExhibitSlotsByLevel[shopLevel - 1]}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-porcelain-crackle/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-porcelain-celadon rounded-full transition-all"
                          style={{ width: `${(exhibitedItems.length / shopExhibitSlotsByLevel[shopLevel - 1]) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-porcelain-inkbrown/60">店铺声望</span>
                        <span className="text-porcelain-inkbrown font-bold">{reputation} / 100</span>
                      </div>
                      <div className="w-full h-2 bg-porcelain-crackle/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-porcelain-gold rounded-full transition-all"
                          style={{ width: `${reputation}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {shopLevel < shopUpgradeCosts.length ? (
                    <div className="p-4 rounded-xl bg-porcelain-paper">
                      <h5
                        className="font-serif font-bold text-porcelain-inkbrown mb-3"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        升级至 Lv.{shopLevel + 1}
                      </h5>
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-porcelain-inkbrown/60">升级费用</span>
                          <span style={{ color: capital >= shopUpgradeCosts[shopLevel] ? '#2E8B57' : '#A83232' }}>
                            {formatMoney(shopUpgradeCosts[shopLevel])}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-porcelain-inkbrown/60">所需声望</span>
                          <span style={{ color: reputation >= shopLevel * 20 ? '#2E8B57' : '#A83232' }}>
                            {shopLevel * 20}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-porcelain-inkbrown/60">库房扩容</span>
                          <span className="text-porcelain-celadon">
                            {shopCapacityByLevel[shopLevel - 1]} → {shopCapacityByLevel[shopLevel]}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-porcelain-inkbrown/60">展位增加</span>
                          <span className="text-porcelain-celadon">
                            {shopExhibitSlotsByLevel[shopLevel - 1]} → {shopExhibitSlotsByLevel[shopLevel]}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={handleUpgrade}
                        disabled={capital < shopUpgradeCosts[shopLevel] || reputation < shopLevel * 20}
                        className="w-full py-2.5 bg-porcelain-gold text-white rounded-xl font-bold text-sm hover:bg-porcelain-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        <ArrowUpRight size={14} />
                        升级店铺
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-porcelain-gold/10 text-center">
                      <Trophy size={32} className="mx-auto mb-2 text-porcelain-gold" />
                      <p
                        className="font-bold text-porcelain-gold"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        店铺已达最高等级
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-porcelain-ji-blue/10 to-porcelain-paper border border-porcelain-ji-blue/20">
                    <h4
                      className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <Calendar size={20} className="text-porcelain-ji-blue" />
                      时间控制
                    </h4>
                    <p
                      className="text-sm text-porcelain-inkbrown/60 mb-4 leading-relaxed"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      点击"下一天"推进时间，市场行情会发生变化，展出的藏品会产生收益，新的藏品会出现在市场中。
                    </p>
                    <button
                      onClick={handleAdvanceDay}
                      className="w-full py-3 bg-porcelain-ji-blue text-white rounded-xl font-bold hover:bg-porcelain-ji-blue/90 transition-colors flex items-center justify-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <ChevronRight size={18} />
                      下一天
                    </button>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-br from-porcelain-youlihong/10 to-porcelain-paper border border-porcelain-youlihong/20">
                    <h4
                      className="font-serif text-lg font-bold text-porcelain-inkbrown mb-4 flex items-center gap-2"
                      style={{ fontFamily: '"Noto Serif SC", serif' }}
                    >
                      <AlertTriangle size={20} className="text-porcelain-youlihong" />
                      经营提示
                    </h4>
                    <ul className="space-y-2 text-sm text-porcelain-inkbrown/70" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      <li className="flex items-start gap-2">
                        <span className="text-porcelain-gold">•</span>
                        关注市场动态，抓住热点行情低买高卖
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-porcelain-gold">•</span>
                        购入后先鉴定真伪，赝品难以高价出售
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-porcelain-gold">•</span>
                        真品可以展出获得持续收益
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-porcelain-gold">•</span>
                        提升店铺等级可扩充库房和展位
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-porcelain-gold">•</span>
                        稀有度越高的藏品，展出收益越高
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-porcelain-gold">•</span>
                        小心市场中的赝品，谨慎高价购入
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full py-2.5 bg-porcelain-inkbrown/10 text-porcelain-inkbrown/60 rounded-xl font-bold text-sm hover:bg-porcelain-inkbrown/15 transition-colors flex items-center justify-center gap-1.5"
                    style={{ fontFamily: '"Noto Serif SC", serif' }}
                  >
                    <RotateCcw size={14} />
                    重新开始
                  </button>
                </div>
              </div>
            )}

            {activeTab !== 'shop' && (
              <div className="mt-6 pt-6 border-t border-porcelain-crackle/20 flex justify-between items-center">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl border border-porcelain-crackle/40 text-porcelain-inkbrown/60 text-sm hover:border-porcelain-inkbrown/30 hover:text-porcelain-inkbrown transition-all flex items-center gap-1.5"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  <RotateCcw size={14} />
                  重置游戏
                </button>
                <button
                  onClick={handleAdvanceDay}
                  className="px-6 py-2.5 bg-porcelain-ji-blue text-white rounded-xl font-bold text-sm hover:bg-porcelain-ji-blue/90 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                  style={{ fontFamily: '"Noto Serif SC", serif' }}
                >
                  <ChevronRight size={16} />
                  下一天
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketSection;
