// 共享可变状态：原 content.js 顶层的模块级变量集中在这里，各模块读写其属性
import { DEFAULT_SETTINGS } from "./constants.js";

export const state = {
  host: null,
  shadow: null,
  settings: { ...DEFAULT_SETTINGS },
  lookTimer: null,
  bubbleTimer: null,
  petTimer: null,
  climbTimer: null,
  bugTimer: null,
  sleepCheckTimer: null,
  sitReminderTimer: null,
  statsPersistTimer: null,
  clickTimes: [],
  dragState: null,
  suppressNextClick: false,
  lastClickAt: 0,
  isHiding: false,
  isSleeping: false,
  wokeUp: false,
  bugVisitsLeft: 0,
  isCatchingBug: false,
  isFeedRequestPending: false,
  activeHoliday: "",
  stats: null
};

export function clearTimers() {
  window.clearTimeout(state.lookTimer);
  window.clearTimeout(state.bubbleTimer);
  window.clearTimeout(state.petTimer);
  window.clearTimeout(state.climbTimer);
  window.clearTimeout(state.bugTimer);
  window.clearInterval(state.sleepCheckTimer);
  window.clearInterval(state.sitReminderTimer);
  state.lookTimer = null;
  state.bubbleTimer = null;
  state.petTimer = null;
  state.climbTimer = null;
  state.bugTimer = null;
  state.sleepCheckTimer = null;
  state.sitReminderTimer = null;
}

// 移除蛛蛛时把交互标志位一并归零
export function resetInteractionFlags() {
  state.clickTimes = [];
  state.dragState = null;
  state.suppressNextClick = false;
  state.lastClickAt = 0;
  state.isHiding = false;
  state.isSleeping = false;
  state.wokeUp = false;
  state.bugVisitsLeft = 0;
  state.isCatchingBug = false;
  state.isFeedRequestPending = false;
}
