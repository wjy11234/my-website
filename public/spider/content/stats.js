// 互动统计：持久化到 chrome.storage.local（防抖写入）
import { state } from "./state.js";
import { todayString } from "./utils.js";

export function persistStats() {
  state.statsPersistTimer = null;
  if (!state.stats) return;
  try {
    chrome.storage.local.set({ companionStats: state.stats });
  } catch (_) {}
}

export function schedulePersistStats() {
  if (state.statsPersistTimer) return;
  state.statsPersistTimer = window.setTimeout(persistStats, 1200);
}

export function bumpStat(key) {
  if (!state.stats) return;
  state.stats[key] = (state.stats[key] || 0) + 1;
  schedulePersistStats();
}

export async function initStats() {
  try {
    const { companionStats } = await chrome.storage.local.get("companionStats");
    state.stats = {
      firstDate: null,
      lastDate: null,
      days: 0,
      petCount: 0,
      feedCount: 0,
      clickCount: 0,
      ...(companionStats || {})
    };
    const today = todayString();
    if (state.stats.lastDate !== today) {
      state.stats.days += 1;
      state.stats.lastDate = today;
      if (!state.stats.firstDate) state.stats.firstDate = today;
      schedulePersistStats();
    }
  } catch (_) {
    state.stats = null;
  }
}
