import { create } from 'zustand';
import type {
  DisasterStore,
  DisasterEvent,
  MitigationStrategy,
  DisasterHistoryRecord,
} from '../types';
import {
  generateDisasterEvent,
  calculateActualDamage,
  generateDisasterReport,
  mitigationStrategies,
} from '../data/disaster';

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const initialState = {
  phase: 'idle' as const,
  activeDisaster: null,
  history: [],
  availableStrategies: mitigationStrategies,
  disasterFund: 50000,
  totalDisastersExperienced: 0,
  currentReport: null,
  inventoryValue: 200000,
  inventoryCount: 50,
};

export const useDisasterStore = create<DisasterStore>((set, get) => ({
  ...initialState,

  triggerRandomDisaster: (): DisasterEvent | null => {
    const state = get();
    if (state.phase !== 'idle') return null;

    const event = generateDisasterEvent();

    set({
      phase: 'triggered',
      activeDisaster: {
        event,
        startTime: Date.now(),
        selectedStrategies: [],
        actualDamage: event.baseDamage,
        resolvedItems: 0,
        totalItems: Math.min(state.inventoryCount, event.affectedItems),
        isResolved: false,
      },
    });

    return event;
  },

  selectStrategy: (strategyId: string): boolean => {
    const state = get();
    if (!state.activeDisaster || state.phase !== 'responding') {
      if (state.phase === 'triggered') {
        set({ phase: 'responding' });
      } else {
        return false;
      }
    }

    const strategy = state.availableStrategies.find((s) => s.id === strategyId);
    if (!strategy) return false;

    const active = state.activeDisaster!;
    if (active.selectedStrategies.includes(strategyId)) return false;

    const selected = active.selectedStrategies.map((id) =>
      state.availableStrategies.find((s) => s.id === id)!
    );
    const totalCost = selected.reduce((sum, s) => sum + s.cost, 0) + strategy.cost;

    if (totalCost > state.disasterFund) return false;

    const updatedStrategies = [...active.selectedStrategies, strategyId];
    const selectedObjs = updatedStrategies.map((id) =>
      state.availableStrategies.find((s) => s.id === id)!
    );

    const damageCalc = calculateActualDamage(
      active.event,
      selectedObjs,
      state.inventoryCount,
      state.inventoryValue
    );

    set((state) => ({
      activeDisaster: {
        ...state.activeDisaster!,
        selectedStrategies: updatedStrategies,
        actualDamage: damageCalc.actualDamage,
      },
    }));

    return true;
  },

  deselectStrategy: (strategyId: string): boolean => {
    const state = get();
    if (!state.activeDisaster || state.phase !== 'responding') return false;

    const active = state.activeDisaster;
    if (!active.selectedStrategies.includes(strategyId)) return false;

    const updatedStrategies = active.selectedStrategies.filter((id) => id !== strategyId);
    const selectedObjs = updatedStrategies.map((id) =>
      state.availableStrategies.find((s) => s.id === id)!
    );

    const damageCalc = calculateActualDamage(
      active.event,
      selectedObjs,
      state.inventoryCount,
      state.inventoryValue
    );

    set((state) => ({
      activeDisaster: {
        ...state.activeDisaster!,
        selectedStrategies: updatedStrategies,
        actualDamage: damageCalc.actualDamage,
      },
    }));

    return true;
  },

  resolveDisaster: (): DisasterHistoryRecord | null => {
    const state = get();
    if (!state.activeDisaster) return null;

    const active = state.activeDisaster;
    const selectedStrategies = active.selectedStrategies.map((id) =>
      state.availableStrategies.find((s) => s.id === id)!
    );

    const damageCalc = calculateActualDamage(
      active.event,
      selectedStrategies,
      state.inventoryCount,
      state.inventoryValue
    );

    const totalCost = selectedStrategies.reduce((sum, s) => sum + s.cost, 0);

    const record: DisasterHistoryRecord = {
      id: generateId(),
      event: active.event,
      selectedStrategies: active.selectedStrategies,
      finalDamage: damageCalc.actualDamage,
      itemsLost: damageCalc.itemsLost,
      itemsSaved: damageCalc.itemsSaved,
      totalValueLost: damageCalc.totalValueLost,
      timestamp: Date.now(),
      dayNumber: state.totalDisastersExperienced + 1,
      severityRating: damageCalc.severityRating,
    };

    set((state) => ({
      phase: 'report',
      activeDisaster: {
        ...state.activeDisaster!,
        isResolved: true,
        actualDamage: damageCalc.actualDamage,
        resolvedItems: damageCalc.itemsSaved,
      },
      history: [record, ...state.history],
      disasterFund: state.disasterFund - totalCost,
      totalDisastersExperienced: state.totalDisastersExperienced + 1,
      inventoryCount: Math.max(0, state.inventoryCount - damageCalc.itemsLost),
      inventoryValue: Math.max(0, state.inventoryValue - damageCalc.totalValueLost),
      currentReport: generateDisasterReport([record, ...state.history]),
    }));

    return record;
  },

  generateReport: () => {
    const state = get();
    const report = generateDisasterReport(state.history);
    set({ currentReport: report, phase: 'report' });
    return report;
  },

  addToFund: (amount: number): boolean => {
    if (amount <= 0) return false;
    set((state) => ({
      disasterFund: state.disasterFund + amount,
    }));
    return true;
  },

  resetDisaster: (): void => {
    set({
      phase: 'idle',
      activeDisaster: null,
      currentReport: null,
    });
  },

  setInventoryValue: (value: number, count: number): void => {
    set({
      inventoryValue: value,
      inventoryCount: count,
    });
  },

  closeReport: (): void => {
    set({
      phase: 'idle',
      currentReport: null,
    });
  },
}));

export { mitigationStrategies } from '../data/disaster';
