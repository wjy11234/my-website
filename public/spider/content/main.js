// 主编排：挂载/移除蛛蛛、应用设置、消息监听与启动入场
import { HOST_ID, DEFAULT_SETTINGS } from "./constants.js";
import { state, clearTimers, resetInteractionFlags } from "./state.js";
import { persistStats, initStats } from "./stats.js";
import { buildShadowHTML } from "./styles.js";
import { detectHoliday, isLateNightHour } from "./utils.js";
import {
  scheduleNextLook,
  triggerLook,
  enterSleep,
  updateSleepState,
  scheduleBugVisit,
  startSitReminderLoop
} from "./effects.js";
import { bindInteractions } from "./interactions.js";

function removeCompanion() {
  clearTimers();
  if (state.statsPersistTimer) {
    window.clearTimeout(state.statsPersistTimer);
    persistStats();
  }
  resetInteractionFlags();
  state.host?.remove();
  state.host = null;
  state.shadow = null;
}

function applySettings(nextSettings) {
  state.settings = { ...DEFAULT_SETTINGS, ...nextSettings };
  if (!state.host) return;

  state.host.dataset.calm = String(state.settings.calmMode);
  state.host.dataset.size = state.settings.size;
  state.host.dataset.position = state.settings.position;
  if (state.settings.calmMode) {
    window.clearTimeout(state.lookTimer);
  } else {
    scheduleNextLook();
  }
  startSitReminderLoop();
}

function mountCompanion(nextSettings, { manual = false } = {}) {
  if (state.host) {
    state.host.hidden = false;
    triggerLook();
    return;
  }

  state.settings = { ...DEFAULT_SETTINGS, ...nextSettings };
  state.activeHoliday = detectHoliday();
  const host = document.createElement("div");
  host.id = HOST_ID;
  host.dataset.calm = String(state.settings.calmMode);
  host.dataset.size = state.settings.size;
  host.dataset.position = state.settings.position;
  host.dataset.sleeping = "false";
  host.dataset.hiding = "false";
  host.dataset.holiday = state.activeHoliday;
  host.setAttribute("aria-live", "polite");
  state.host = host;
  state.shadow = host.attachShadow({ mode: "open" });

  const spriteUrl = chrome.runtime.getURL("assets/spider-sprite.png");
  state.shadow.innerHTML = buildShadowHTML(spriteUrl);

  (document.documentElement || document.body).appendChild(host);

  initStats();
  bindInteractions(state.shadow);

  const hour = new Date().getHours();
  if (isLateNightHour(hour)) enterSleep();
  state.sleepCheckTimer = window.setInterval(updateSleepState, 60000);

  if (!state.settings.calmMode && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if (!state.isSleeping) {
      const isMorning = hour >= 5 && hour < 11;
      if (isMorning && !manual) {
        // 早晨入场：落定后先伸个懒腰再张望
        window.setTimeout(() => {
          state.shadow?.querySelector(".spider")?.classList.add("is-stretching");
        }, 1550);
      }
      window.setTimeout(triggerLook, manual ? 100 : isMorning ? 3100 : 1450);
      scheduleNextLook();
    }
    state.bugVisitsLeft = 1 + (Math.random() < 0.5 ? 1 : 0);
    scheduleBugVisit();
  }
  startSitReminderLoop();
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "spider:showNow") {
    chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS)).then((saved) => {
      const nextSettings = { ...DEFAULT_SETTINGS, ...saved, enabled: true };
      mountCompanion(nextSettings, { manual: true });
      sendResponse({ ok: true });
    });
    return true;
  }

  if (message?.type === "spider:hideNow") {
    removeCompanion();
    sendResponse({ ok: true });
  }
  return undefined;
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") return;
  const nextSettings = { ...state.settings };
  let hasSettingsChange = false;
  for (const [key, value] of Object.entries(changes)) {
    if (!(key in DEFAULT_SETTINGS)) continue;
    nextSettings[key] = value.newValue;
    hasSettingsChange = true;
  }
  if (!hasSettingsChange) return;

  if (!nextSettings.enabled) {
    removeCompanion();
    state.settings = nextSettings;
    return;
  }
  applySettings(nextSettings);
});

chrome.runtime.sendMessage({ type: "spider:claimEntrance" }, (response) => {
  if (chrome.runtime.lastError || !response?.show) return;
  mountCompanion(response.settings);
});
