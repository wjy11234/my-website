// 行为功能：张望、气泡、受惊、摸摸爱心、睡眠、爬丝、摆动回弹、小虫捕食、久坐提醒
import { state } from "./state.js";
import {
  THREAD_REST_HEIGHT,
  CLIMB_UP_DISTANCE,
  CLIMB_THREAD_HEIGHT,
  SIT_CHECK_INTERVAL,
  MANUAL_FEED_LIMIT,
  MANUAL_FEED_WINDOW_MS
} from "./constants.js";
import { BUBBLE_MESSAGES } from "./messages.js";
import { isLateNightHour, pickRandom } from "./utils.js";
import { bumpStat } from "./stats.js";

export function scheduleNextLook() {
  window.clearTimeout(state.lookTimer);
  if (!state.host || state.settings.calmMode || state.isSleeping || state.isHiding) return;

  const delay = 16000 + Math.round(Math.random() * 10000);
  state.lookTimer = window.setTimeout(() => {
    if (document.visibilityState === "visible") triggerLook();
    scheduleNextLook();
  }, delay);
}

export function triggerLook() {
  const spider = state.shadow?.querySelector(".spider");
  if (!spider || spider.classList.contains("is-looking") || state.isSleeping || state.isHiding) return;

  spider.classList.remove("is-looking");
  void spider.offsetWidth;
  spider.classList.add("is-looking");
}

export function pickBubbleMessage() {
  const now = new Date();
  const hour = now.getHours();
  const pool = [...BUBBLE_MESSAGES.anytime];

  if (hour >= 5 && hour < 11) {
    pool.push(...BUBBLE_MESSAGES.morning);
  } else if (hour >= 13 && hour < 18) {
    pool.push(...BUBBLE_MESSAGES.afternoon);
  } else if (hour >= 23 || hour < 5) {
    pool.push(...BUBBLE_MESSAGES.lateNight);
  }
  if (now.getDay() === 5 && hour >= 17) {
    pool.push(...BUBBLE_MESSAGES.fridayEvening);
  }
  if (state.activeHoliday && BUBBLE_MESSAGES.holiday[state.activeHoliday]) {
    pool.push(...BUBBLE_MESSAGES.holiday[state.activeHoliday]);
  }
  if (Array.isArray(state.settings.customMessages)) {
    pool.push(...state.settings.customMessages.filter((line) => typeof line === "string" && line.trim()));
  }

  // 亲密度：互动越多，解锁越贴心的文案
  const interactions = state.stats
    ? (state.stats.petCount || 0) + (state.stats.feedCount || 0) + (state.stats.clickCount || 0)
    : 0;
  if (interactions >= 20) pool.push(...BUBBLE_MESSAGES.intimacyWarm);
  if (interactions >= 60) pool.push(...BUBBLE_MESSAGES.intimacyClose);

  return pool[Math.floor(Math.random() * pool.length)];
}

export function showBubble(text) {
  const bubble = state.shadow?.querySelector(".bubble");
  if (!bubble) return;
  bubble.textContent = text || pickBubbleMessage();
  bubble.classList.add("is-visible");
  window.clearTimeout(state.bubbleTimer);
  state.bubbleTimer = window.setTimeout(() => bubble.classList.remove("is-visible"), 2600);
}

export function isMotionReduced() {
  return state.settings.calmMode || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function triggerScare() {
  const spider = state.shadow?.querySelector(".spider");
  if (!spider) return;

  showBubble(pickRandom(BUBBLE_MESSAGES.scared));
  if (isMotionReduced()) return;

  spider.classList.remove("is-looking");
  spider.classList.remove("is-scared");
  void spider.offsetWidth;
  spider.classList.add("is-scared");
}

export function enterSleep() {
  if (state.isSleeping || !state.host) return;
  state.isSleeping = true;
  state.host.dataset.sleeping = "true";
  window.clearTimeout(state.lookTimer);
}

export function exitSleep() {
  if (!state.isSleeping || !state.host) return;
  state.isSleeping = false;
  state.host.dataset.sleeping = "false";
  scheduleNextLook();
}

export function wakeUp() {
  if (!state.isSleeping) return;
  state.wokeUp = true;
  exitSleep();
  showBubble(pickRandom(BUBBLE_MESSAGES.wake));
  triggerLook();
}

export function updateSleepState() {
  if (!state.host) return;
  if (isLateNightHour()) {
    if (!state.wokeUp && !state.isHiding) enterSleep();
  } else {
    state.wokeUp = false;
    exitSleep();
  }
}

export function spawnHearts() {
  const wrap = state.shadow?.querySelector(".pet-wrap");
  if (!wrap || isMotionReduced()) return;
  for (let i = 0; i < 3; i += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = "❤";
    heart.setAttribute("aria-hidden", "true");
    heart.style.left = `${24 + Math.round(Math.random() * 32)}px`;
    heart.style.animationDelay = `${i * 130}ms`;
    heart.addEventListener("animationend", () => heart.remove());
    wrap.appendChild(heart);
  }
}

export function toggleClimb() {
  const spider = state.shadow?.querySelector(".spider");
  const thread = state.shadow?.querySelector(".thread");
  if (!spider || !thread || !state.host || state.dragState) return;

  // 取消残留的回摆 WAAPI：双击时的轻微指针滑动（<4px，不算拖拽）会触发它，
  // 它比爬丝动画（820ms）长（1700ms），爬丝结束后会把蛛蛛拽回底部再跳回顶部
  cancelDragMotion(spider, thread);

  state.isHiding = !state.isHiding;
  state.host.dataset.hiding = String(state.isHiding);
  spider.classList.toggle("is-hiding", state.isHiding);
  thread.classList.toggle("is-hiding", state.isHiding);

  if (state.isHiding) {
    window.clearTimeout(state.lookTimer);
  } else {
    scheduleNextLook();
  }

  if (!isMotionReduced()) {
    const upY = `0 ${-CLIMB_UP_DISTANCE}px`;
    const easing = "cubic-bezier(.55, .06, .28, 1)";
    spider.animate(
      [{ translate: state.isHiding ? "0 0" : upY }, { translate: state.isHiding ? upY : "0 0" }],
      { duration: 820, easing }
    );
    thread.animate(
      [
        { height: `${state.isHiding ? THREAD_REST_HEIGHT : CLIMB_THREAD_HEIGHT}px` },
        { height: `${state.isHiding ? CLIMB_THREAD_HEIGHT : THREAD_REST_HEIGHT}px` }
      ],
      { duration: 820, easing }
    );
  }
  if (state.isHiding) {
    showBubble("我先躲一会儿，双击叫我下来");
  }
}

// 取消蛛蛛/蛛丝上的 WAAPI 位移动画（回弹、爬丝等），避免盖住拖拽时的内联样式
// CSSAnimation / CSSTransition 留给 class 控制，不在这里动
export function cancelDragMotion(spider, thread) {
  for (const el of [spider, thread]) {
    if (!el) continue;
    for (const anim of el.getAnimations()) {
      if (anim instanceof CSSAnimation || anim instanceof CSSTransition) continue;
      anim.cancel();
    }
  }
}

// 松手后的阻尼钟摆回弹：角度与丝长分别按指数衰减振荡回到静止值
// angle 沿用「蛛蛛位移方向」的约定（sin→水平位移）；丝线 rotate 方向与其相反，渲染时取负
export function animateSwingBack(spider, thread, dx, dy) {
  cancelDragMotion(spider, thread);

  const releaseLength = Math.hypot(THREAD_REST_HEIGHT + dy, dx);
  const releaseAngle = Math.atan2(dx, THREAD_REST_HEIGHT + dy);
  const duration = 1700;
  const steps = 30;
  const spiderFrames = [];
  const threadFrames = [];

  for (let i = 0; i <= steps; i += 1) {
    const t = (i / steps) * (duration / 1000);
    const isLast = i === steps;
    const angle = isLast ? 0 : releaseAngle * Math.exp(-2.1 * t) * Math.cos(11.5 * t);
    const length = isLast
      ? THREAD_REST_HEIGHT
      : THREAD_REST_HEIGHT + (releaseLength - THREAD_REST_HEIGHT) * Math.exp(-4.2 * t) * Math.cos(7.5 * t);
    spiderFrames.push({
      translate: `${(length * Math.sin(angle)).toFixed(2)}px ${(length * Math.cos(angle) - THREAD_REST_HEIGHT).toFixed(2)}px`
    });
    threadFrames.push({
      height: `${Math.max(length, 2).toFixed(2)}px`,
      rotate: `${(-angle).toFixed(4)}rad`
    });
  }

  spider.animate(spiderFrames, { duration, easing: "linear" });
  thread.animate(threadFrames, { duration, easing: "linear" });
}

export function scheduleBugVisit() {
  window.clearTimeout(state.bugTimer);
  if (!state.host || state.bugVisitsLeft <= 0) return;

  const delay = 40000 + Math.round(Math.random() * 50000);
  state.bugTimer = window.setTimeout(() => {
    const canRun =
      document.visibilityState === "visible" &&
      !state.isHiding &&
      !state.isSleeping &&
      !state.dragState &&
      !state.isCatchingBug &&
      !state.isFeedRequestPending &&
      !isMotionReduced();
    if (canRun) {
      state.bugVisitsLeft -= 1;
      runBugCatch();
    }
    scheduleBugVisit();
  }, delay);
}

// 悬停投喂小圆钮触发：复用捕食动画，10 分钟内最多投喂 3 次
export async function requestManualFeed() {
  if (!state.host) return { ok: false, reason: "notMounted" };
  if (state.isHiding) return { ok: false, reason: "hiding" };
  if (state.isCatchingBug || state.isFeedRequestPending || state.dragState) {
    return { ok: false, reason: "busy" };
  }

  const requestShadow = state.shadow;
  state.isFeedRequestPending = true;
  try {
    const now = Date.now();
    let recentFeeds = [];
    try {
      const saved = await chrome.storage.local.get("manualFeedHistory");
      if (Array.isArray(saved.manualFeedHistory)) {
        recentFeeds = saved.manualFeedHistory
          .map(Number)
          .filter(
            (timestamp) => Number.isFinite(timestamp) &&
              timestamp <= now &&
              now - timestamp < MANUAL_FEED_WINDOW_MS
          )
          .sort((a, b) => a - b);
      }
    } catch (_) {}

    if (recentFeeds.length >= MANUAL_FEED_LIMIT) {
      const remainingMs = MANUAL_FEED_WINDOW_MS - (now - recentFeeds[0]);
      return { ok: false, reason: "full", remainingMs };
    }

    // await 之后再确认一次，避免与自动捕食撞车
    if (!state.host || state.shadow !== requestShadow) return { ok: false, reason: "notMounted" };
    if (state.isHiding) return { ok: false, reason: "hiding" };
    if (state.isCatchingBug || state.dragState) return { ok: false, reason: "busy" };

    if (state.isSleeping) {
      state.wokeUp = true;
      exitSleep();
    }

    const started = runBugCatch();
    if (!started) return { ok: false, reason: "busy" };

    try {
      await chrome.storage.local.set({ manualFeedHistory: [...recentFeeds, now] });
    } catch (_) {}

    return { ok: true };
  } finally {
    if (state.shadow === requestShadow) state.isFeedRequestPending = false;
  }
}

function runBugCatch() {
  const shadow = state.shadow;
  const sky = shadow?.querySelector(".sky");
  const scene = shadow?.querySelector(".scene");
  const spider = shadow?.querySelector(".spider");
  if (!sky || !scene || !spider || state.isCatchingBug) return false;

  state.isCatchingBug = true;

  if (isMotionReduced()) {
    showBubble(pickRandom(BUBBLE_MESSAGES.fed));
    bumpStat("feedCount");
    state.isCatchingBug = false;
    return true;
  }

  const rect = scene.getBoundingClientRect();
  const targetX = rect.left + 47;
  const targetY = 152;
  const startX = state.settings.position === "left"
    ? Math.min(targetX + 380, window.innerWidth - 30)
    : Math.max(targetX - 380, 30);
  const startY = targetY - 60 - Math.random() * 80;

  const fly = document.createElement("div");
  fly.className = "fly";
  fly.setAttribute("aria-hidden", "true");
  sky.appendChild(fly);

  const midX = (startX + targetX) / 2;
  const flight = fly.animate(
    [
      { translate: `${startX}px ${startY}px`, opacity: 0 },
      { translate: `${startX * 0.88 + targetX * 0.12}px ${startY + 14}px`, opacity: 1, offset: 0.12 },
      { translate: `${midX}px ${startY - 24}px`, opacity: 1, offset: 0.5 },
      { translate: `${targetX}px ${targetY}px`, opacity: 1 }
    ],
    { duration: 2400, easing: "ease-in-out", fill: "forwards" }
  );

  const finishCatch = () => {
    if (state.shadow === shadow) state.isCatchingBug = false;
  };

  flight.finished
    .then(() => {
      if (state.shadow !== shadow) {
        fly.remove();
        finishCatch();
        return;
      }
      // 蛛蛛快速下窜一段捕住小虫
      const catchAnimation = spider.animate(
        [
          { translate: "0 0" },
          { translate: "0 30px", offset: 0.42 },
          { translate: "0 30px", offset: 0.58 },
          { translate: "0 0" }
        ],
        { duration: 520, easing: "ease-in-out" }
      );
      catchAnimation.finished.then(finishCatch, finishCatch);
      window.setTimeout(() => {
        fly.remove();
        if (state.shadow !== shadow) return;
        showBubble(pickRandom(BUBBLE_MESSAGES.fed));
        bumpStat("feedCount");
      }, 230);
    })
    .catch(() => {
      fly.remove();
      finishCatch();
    });

  return true;
}

function checkSitReminderNow() {
  if (!state.host || document.visibilityState !== "visible") return;
  try {
    chrome.runtime.sendMessage({ type: "spider:checkSitReminder" }, (response) => {
      if (chrome.runtime.lastError || !response?.remind) return;
      triggerSitReminder();
    });
  } catch (_) {}
}

function triggerSitReminder() {
  if (!state.host || state.isHiding) return;
  showBubble(pickRandom(BUBBLE_MESSAGES.sitReminder));
  const spider = state.shadow?.querySelector(".spider");
  if (!spider || isMotionReduced() || state.isSleeping) return;
  spider.classList.remove("is-nudging");
  void spider.offsetWidth;
  spider.classList.add("is-nudging");
}

export function stopSitReminderLoop() {
  window.clearInterval(state.sitReminderTimer);
  state.sitReminderTimer = null;
}

export function startSitReminderLoop() {
  stopSitReminderLoop();
  if (!state.host || !state.settings.sitReminder) return;
  checkSitReminderNow();
  state.sitReminderTimer = window.setInterval(checkSitReminderNow, SIT_CHECK_INTERVAL);
}
