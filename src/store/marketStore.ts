import { create } from 'zustand';
import type {
  MarketStore,
  MarketItem,
  InventoryItem,
  Transaction,
  MarketEvent,
  MarketRarity,
} from '../types';
import {
  generateMarketItems,
  generateMarketEvent,
  getAuthenticateResult,
  shopUpgradeCosts,
  shopCapacityByLevel,
  shopExhibitSlotsByLevel,
  shopReputationBonusByLevel,
  rarityConfig,
} from '../data/market';

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const initialState = {
  capital: 100000,
  reputation: 50,
  day: 1,
  inventory: [],
  transactions: [],
  activeEvents: [],
  marketItems: generateMarketItems(8),
  lastUpdateTime: Date.now(),
  shopLevel: 1,
  shopName: '雅瓷斋',
  totalProfit: 0,
  totalExhibitions: 0,
  totalSales: 0,
  totalPurchases: 0,
};

const getCurrentPriceMultiplier = (
  item: MarketItem,
  events: MarketEvent[]
): number => {
  let multiplier = 1;

  for (const event of events) {
    const periodMatch = event.affectedPeriods.length === 0 || event.affectedPeriods.includes(item.period);
    const categoryMatch = event.affectedCategories.length === 0 || event.affectedCategories.includes(item.category);

    if (periodMatch && categoryMatch) {
      multiplier *= event.priceMultiplier;
    }
  }

  return multiplier;
};

const calculateCurrentMarketPrice = (item: MarketItem, events: MarketEvent[]): number => {
  const baseMultiplier = getCurrentPriceMultiplier(item, events);
  return Math.round(item.baseValue * (1 + item.priceChangePercent / 100) * baseMultiplier);
};

const calculateSellPrice = (inventoryItem: InventoryItem, events: MarketEvent[]): number => {
  const basePrice = calculateCurrentMarketPrice(inventoryItem.item, events);
  
  const authBonus = inventoryItem.isAuthenticated ? 1.2 : 1;
  const reputationBonus = 1 + (shopReputationBonusByLevel[1] - 1);
  
  const randomFactor = 0.9 + Math.random() * 0.2;
  
  return Math.round(basePrice * authBonus * reputationBonus * randomFactor);
};

export const useMarketStore = create<MarketStore>((set, get) => ({
  ...initialState,

  buyItem: (itemId: string): boolean => {
    const state = get();
    const item = state.marketItems.find((i) => i.id === itemId);

    if (!item) return false;

    const currentPrice = calculateCurrentMarketPrice(item, state.activeEvents);

    if (state.capital < currentPrice) return false;

    const capacity = shopCapacityByLevel[state.shopLevel - 1];
    if (state.inventory.length >= capacity) return false;

    const inventoryItem: InventoryItem = {
      id: generateId(),
      itemId: item.id,
      item: { ...item, currentMarketPrice: currentPrice },
      purchasePrice: currentPrice,
      purchaseTime: Date.now(),
      isAuthenticated: false,
      isExhibited: false,
      totalEarnings: 0,
    };

    const transaction: Transaction = {
      id: generateId(),
      type: 'buy',
      itemId: item.id,
      itemName: item.name,
      amount: currentPrice,
      timestamp: Date.now(),
    };

    set((state) => ({
      capital: state.capital - currentPrice,
      inventory: [...state.inventory, inventoryItem],
      transactions: [transaction, ...state.transactions],
      marketItems: state.marketItems.filter((i) => i.id !== itemId),
      totalPurchases: state.totalPurchases + 1,
    }));

    return true;
  },

  sellItem: (inventoryId: string, price: number): boolean => {
    const state = get();
    const inventoryItem = state.inventory.find((i) => i.id === inventoryId);

    if (!inventoryItem || inventoryItem.isExhibited) return false;

    const profit = price - inventoryItem.purchasePrice;

    const transaction: Transaction = {
      id: generateId(),
      type: 'sell',
      itemId: inventoryItem.itemId,
      itemName: inventoryItem.item.name,
      amount: price,
      timestamp: Date.now(),
      note: profit >= 0 ? `盈利 ¥${profit.toLocaleString()}` : `亏损 ¥${Math.abs(profit).toLocaleString()}`,
    };

    const reputationChange = profit > 0 ? 2 : profit < -inventoryItem.purchasePrice * 0.5 ? -2 : 0;

    set((state) => ({
      capital: state.capital + price,
      inventory: state.inventory.filter((i) => i.id !== inventoryId),
      transactions: [transaction, ...state.transactions],
      reputation: Math.max(0, Math.min(100, state.reputation + reputationChange)),
      totalProfit: state.totalProfit + profit,
      totalSales: state.totalSales + 1,
    }));

    return true;
  },

  authenticateItem: (inventoryId: string): { success: boolean; isAuthentic: boolean; note?: string } => {
    const state = get();
    const inventoryItem = state.inventory.find((i) => i.id === inventoryId);

    if (!inventoryItem || inventoryItem.isAuthenticated) {
      return { success: false, isAuthentic: false };
    }

    const authCost = Math.round(inventoryItem.purchasePrice * 0.05);

    if (state.capital < authCost) {
      return { success: false, isAuthentic: false, note: '资金不足，无法支付鉴定费用' };
    }

    const isActuallyAuthentic = inventoryItem.item.authentication !== 'forgery';
    const result = getAuthenticateResult(isActuallyAuthentic);

    const updatedItem: InventoryItem = {
      ...inventoryItem,
      isAuthenticated: true,
      item: {
        ...inventoryItem.item,
        authentication: result.isAuthentic ? 'authentic' : 'forgery',
        authenticationNotes: result.note,
      },
    };

    set((state) => ({
      capital: state.capital - authCost,
      inventory: state.inventory.map((i) => (i.id === inventoryId ? updatedItem : i)),
      reputation: result.isAuthentic
        ? Math.min(100, state.reputation + 3)
        : Math.max(0, state.reputation - 1),
    }));

    return result;
  },

  startExhibition: (inventoryId: string): boolean => {
    const state = get();
    const inventoryItem = state.inventory.find((i) => i.id === inventoryId);

    if (!inventoryItem || inventoryItem.isExhibited) return false;

    const exhibitSlots = shopExhibitSlotsByLevel[state.shopLevel - 1];
    const currentlyExhibited = state.inventory.filter((i) => i.isExhibited).length;

    if (currentlyExhibited >= exhibitSlots) return false;

    if (!inventoryItem.isAuthenticated) return false;
    if (inventoryItem.item.authentication !== 'authentic') return false;

    const updatedItem: InventoryItem = {
      ...inventoryItem,
      isExhibited: true,
      exhibitEndTime: Date.now() + inventoryItem.item.exhibitDuration * 24 * 60 * 60 * 1000,
    };

    set((state) => ({
      inventory: state.inventory.map((i) => (i.id === inventoryId ? updatedItem : i)),
    }));

    return true;
  },

  endExhibition: (inventoryId: string): number => {
    const state = get();
    const inventoryItem = state.inventory.find((i) => i.id === inventoryId);

    if (!inventoryItem || !inventoryItem.isExhibited) return 0;

    const income = Math.round(
      inventoryItem.item.exhibitIncome *
      shopReputationBonusByLevel[state.shopLevel - 1]
    );

    const updatedItem: InventoryItem = {
      ...inventoryItem,
      isExhibited: false,
      exhibitEndTime: undefined,
      totalEarnings: inventoryItem.totalEarnings + income,
    };

    const transaction: Transaction = {
      id: generateId(),
      type: 'exhibit',
      itemId: inventoryItem.itemId,
      itemName: inventoryItem.item.name,
      amount: income,
      timestamp: Date.now(),
      note: '展出收益',
    };

    set((state) => ({
      capital: state.capital + income,
      inventory: state.inventory.map((i) => (i.id === inventoryId ? updatedItem : i)),
      transactions: [transaction, ...state.transactions],
      reputation: Math.min(100, state.reputation + 1),
      totalProfit: state.totalProfit + income,
      totalExhibitions: state.totalExhibitions + 1,
    }));

    return income;
  },

  advanceDay: (): void => {
    const state = get();
    const newDay = state.day + 1;

    let updatedInventory = [...state.inventory];
    let exhibitionIncome = 0;
    let reputationGain = 0;

    for (let i = 0; i < updatedInventory.length; i++) {
      const item = updatedInventory[i];
      if (item.isExhibited && item.exhibitEndTime && Date.now() >= item.exhibitEndTime) {
        const income = Math.round(
          item.item.exhibitIncome *
          shopReputationBonusByLevel[state.shopLevel - 1]
        );
        exhibitionIncome += income;

        const transaction: Transaction = {
          id: generateId(),
          type: 'exhibit',
          itemId: item.itemId,
          itemName: item.item.name,
          amount: income,
          timestamp: Date.now(),
          note: '展出收益',
        };

        updatedInventory[i] = {
          ...item,
          isExhibited: false,
          exhibitEndTime: undefined,
          totalEarnings: item.totalEarnings + income,
        };

        set((state) => ({
          transactions: [transaction, ...state.transactions],
          totalExhibitions: state.totalExhibitions + 1,
        }));

        reputationGain += 1;
      }
    }

    const rarityBonus: Record<MarketRarity, number> = {
      common: 1,
      uncommon: 1.2,
      rare: 1.5,
      epic: 2,
      legendary: 5,
    };

    const dailyReputation = updatedInventory
      .filter((i) => i.isAuthenticated && i.item.authentication === 'authentic')
      .reduce((sum, item) => sum + rarityBonus[item.item.rarity], 0);

    reputationGain += Math.round(dailyReputation * 0.1);

    const updatedEvents = state.activeEvents.filter(
      (event) => Date.now() < event.startTime + event.duration * 24 * 60 * 60 * 1000
    );

    const newEvent = generateMarketEvent();
    if (newEvent) {
      updatedEvents.push(newEvent);
    }

    let refreshCount = 2;
    let updatedMarketItems = state.marketItems.map((item) => {
      const change = (Math.random() - 0.5) * 20;
      const newChangePercent = Math.round((item.priceChangePercent + change) * 100) / 100;
      const clampedChange = Math.max(-30, Math.min(30, newChangePercent));

      let newTrend: 'rising' | 'stable' | 'falling' = 'stable';
      if (clampedChange > 3) newTrend = 'rising';
      else if (clampedChange < -3) newTrend = 'falling';

      return {
        ...item,
        priceChangePercent: clampedChange,
        priceTrend: newTrend,
        currentMarketPrice: calculateCurrentMarketPrice(
          { ...item, priceChangePercent: clampedChange },
          updatedEvents
        ),
      };
    });

    const maxItems = 8;
    while (updatedMarketItems.length < maxItems) {
      const newItems = generateMarketItems(refreshCount);
      for (const newItem of newItems) {
        if (!updatedMarketItems.find((i) => i.name === newItem.name) && updatedMarketItems.length < maxItems) {
          updatedMarketItems.push(newItem);
        }
      }
      refreshCount = Math.max(1, refreshCount - 1);
    }

    set((state) => ({
      day: newDay,
      inventory: updatedInventory,
      capital: state.capital + exhibitionIncome,
      totalProfit: state.totalProfit + exhibitionIncome,
      reputation: Math.min(100, state.reputation + reputationGain),
      activeEvents: updatedEvents,
      marketItems: updatedMarketItems,
      lastUpdateTime: Date.now(),
    }));
  },

  updateMarketPrices: (): void => {
    const state = get();

    const updatedMarketItems = state.marketItems.map((item) => ({
      ...item,
      currentMarketPrice: calculateCurrentMarketPrice(item, state.activeEvents),
    }));

    set({ marketItems: updatedMarketItems });
  },

  generateMarketEvent: (): MarketEvent | null => {
    const event = generateMarketEvent();
    if (event) {
      set((state) => ({
        activeEvents: [...state.activeEvents, event],
      }));
    }
    return event;
  },

  refreshMarketItems: (): void => {
    const state = get();
    const newItems = generateMarketItems(4);

    let updatedItems = [...state.marketItems];
    const itemsToRemove = Math.min(3, updatedItems.length);
    
    for (let i = 0; i < itemsToRemove; i++) {
      if (updatedItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * updatedItems.length);
        updatedItems.splice(randomIndex, 1);
      }
    }

    for (const newItem of newItems) {
      if (!updatedItems.find((i) => i.name === newItem.name) && updatedItems.length < 10) {
        updatedItems.push(newItem);
      }
    }

    set({ marketItems: updatedItems });
  },

  resetMarket: (): void => {
    set({
      ...initialState,
      marketItems: generateMarketItems(8),
    });
  },

  upgradeShop: (): boolean => {
    const state = get();

    if (state.shopLevel >= shopUpgradeCosts.length) return false;

    const cost = shopUpgradeCosts[state.shopLevel];
    if (state.capital < cost) return false;

    if (state.reputation < state.shopLevel * 20) return false;

    set((state) => ({
      capital: state.capital - cost,
      shopLevel: state.shopLevel + 1,
      reputation: Math.min(100, state.reputation + 5),
    }));

    return true;
  },
}));

export {
  calculateCurrentMarketPrice,
  calculateSellPrice,
  getCurrentPriceMultiplier,
};
