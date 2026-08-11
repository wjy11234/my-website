// 交互事件绑定：点击打招呼、连点受惊、双击爬丝、按住摸摸、拖拽荡秋千
import { state } from "./state.js";
import {
  DRAG_MAX_DOWN,
  DRAG_MAX_UP,
  DRAG_MAX_SIDE,
  COMBO_CLICK_COUNT,
  COMBO_CLICK_WINDOW,
  PET_HOLD_MS,
  CLIMB_DOUBLE_CLICK_WINDOW,
  CLIMB_CONFIRM_DELAY,
  SWING_WOW_DISTANCE,
  THREAD_REST_HEIGHT
} from "./constants.js";
import { BUBBLE_MESSAGES } from "./messages.js";
import { clamp, pickRandom } from "./utils.js";
import { bumpStat } from "./stats.js";
import {
  triggerLook,
  triggerScare,
  showBubble,
  wakeUp,
  spawnHearts,
  toggleClimb,
  animateSwingBack,
  cancelDragMotion,
  isMotionReduced,
  requestManualFeed
} from "./effects.js";

function trackComboClick() {
  const now = Date.now();
  state.clickTimes = state.clickTimes.filter((time) => now - time < COMBO_CLICK_WINDOW);
  state.clickTimes.push(now);
  if (state.clickTimes.length >= COMBO_CLICK_COUNT) {
    state.clickTimes = [];
    return true;
  }
  return false;
}

function clearDragStyles(spider, thread) {
  spider.classList.remove("is-dragging");
  thread.classList.remove("is-dragging");
  spider.style.translate = "";
  thread.style.height = "";
  thread.style.rotate = "";
}

function readTranslate(el) {
  const value = getComputedStyle(el).translate;
  if (!value || value === "none") return { x: 0, y: 0 };
  const parts = value.trim().split(/\s+/);
  return { x: parseFloat(parts[0]) || 0, y: parseFloat(parts[1]) || 0 };
}

function triggerPetting(spider, thread, pointerId) {
  state.dragState = null;
  state.suppressNextClick = true;
  if (spider.hasPointerCapture?.(pointerId)) {
    spider.releasePointerCapture(pointerId);
  }
  clearDragStyles(spider, thread);
  if (state.isSleeping) {
    wakeUp();
    return;
  }
  spawnHearts();
  showBubble(pickRandom(BUBBLE_MESSAGES.petting));
  bumpStat("petCount");
}

export function bindInteractions(shadow) {
  const spider = shadow.querySelector(".spider");
  const thread = shadow.querySelector(".thread");

  spider.addEventListener("animationend", () => {
    spider.classList.remove("is-looking");
    spider.classList.remove("is-scared");
    spider.classList.remove("is-stretching");
    spider.classList.remove("is-nudging");
  });

  thread.addEventListener("animationend", (event) => {
    if (event.animationName === "thread-drop") thread.classList.add("has-dropped");
  });

  spider.addEventListener("click", () => {
    if (state.suppressNextClick) {
      state.suppressNextClick = false;
      return;
    }

    if (trackComboClick()) {
      window.clearTimeout(state.climbTimer);
      state.climbTimer = null;
      triggerScare();
      return;
    }

    // 双击检测：第二次点击后延迟确认，若继续连点则取消爬丝（把机会留给受惊彩蛋）
    const now = Date.now();
    if (state.climbTimer) {
      window.clearTimeout(state.climbTimer);
      state.climbTimer = null;
    } else if (now - state.lastClickAt < CLIMB_DOUBLE_CLICK_WINDOW) {
      state.climbTimer = window.setTimeout(() => {
        state.climbTimer = null;
        toggleClimb();
      }, CLIMB_CONFIRM_DELAY);
    }
    state.lastClickAt = now;

    if (state.isSleeping) {
      wakeUp();
      return;
    }
    if (state.isHiding) return;
    triggerLook();
    showBubble();
    bumpStat("clickCount");
  });

  spider.addEventListener("mouseenter", triggerLook);
  shadow.querySelector(".close").addEventListener("click", toggleClimb);

  // 悬停显现的投喂小圆钮：复用捕食动画；吃饱后提示稍后再喂
  shadow.querySelector(".feed").addEventListener("click", async () => {
    const result = await requestManualFeed();
    if (result?.reason === "full") {
      showBubble(pickRandom(BUBBLE_MESSAGES.full));
    } else if (result?.reason === "busy") {
      showBubble("这只小虫还没吃完呢");
    }
  });

  spider.addEventListener("pointerdown", (event) => {
    const isBusy = state.isHiding || state.isCatchingBug || state.isFeedRequestPending;
    if (event.button !== 0 || isBusy) return;

    // 回弹 WAAPI 会盖住内联 translate；先读当前视觉位移再取消，避免第二次拖动「不跟手」
    const offset = readTranslate(spider);
    cancelDragMotion(spider, thread);
    spider.classList.remove("is-scared");

    const length = Math.hypot(THREAD_REST_HEIGHT + offset.y, offset.x);
    const angle = Math.atan2(-offset.x, THREAD_REST_HEIGHT + offset.y);
    spider.style.translate = `${offset.x}px ${offset.y}px`;
    thread.style.height = `${length}px`;
    thread.style.rotate = `${angle}rad`;

    state.dragState = {
      // start* 是「位移为 0 时」对应的指针坐标，便于用 client - start 得到蛛蛛位移
      startX: event.clientX - offset.x,
      startY: event.clientY - offset.y,
      // 按下点，用于判断是否真的拖动（避免半空抓住时被已有位移误判）
      originX: event.clientX,
      originY: event.clientY,
      dx: offset.x,
      dy: offset.y,
      moved: false
    };
    spider.setPointerCapture(event.pointerId);

    // 按住不动超过阈值视为「摸摸」，取消本次拖拽
    window.clearTimeout(state.petTimer);
    state.petTimer = window.setTimeout(() => {
      if (!state.dragState || state.dragState.moved) return;
      triggerPetting(spider, thread, event.pointerId);
    }, PET_HOLD_MS);
  });

  spider.addEventListener("pointermove", (event) => {
    if (!state.dragState) return;
    const dx = clamp(event.clientX - state.dragState.startX, -DRAG_MAX_SIDE, DRAG_MAX_SIDE);
    const dy = clamp(event.clientY - state.dragState.startY, -DRAG_MAX_UP, DRAG_MAX_DOWN);
    state.dragState.dx = dx;
    state.dragState.dy = dy;
    if (Math.hypot(event.clientX - state.dragState.originX, event.clientY - state.dragState.originY) > 4) {
      state.dragState.moved = true;
      window.clearTimeout(state.petTimer);
    }

    // 蛛丝顶端固定在原位，底端跟着蛛蛛：长度和角度随拖拽实时变化
    // 注意 rotate 正角度（顺时针）会让丝线底端向左摆，与蛛蛛位移方向相反，故角度取 -dx
    const length = Math.hypot(THREAD_REST_HEIGHT + dy, dx);
    const angle = Math.atan2(-dx, THREAD_REST_HEIGHT + dy);
    spider.classList.add("is-dragging");
    thread.classList.add("is-dragging");
    spider.style.translate = `${dx}px ${dy}px`;
    thread.style.height = `${length}px`;
    thread.style.rotate = `${angle}rad`;
  });

  function finishDrag(event) {
    window.clearTimeout(state.petTimer);
    if (!state.dragState) return;
    const { dx, dy, moved } = state.dragState;
    state.dragState = null;
    if (spider.hasPointerCapture(event.pointerId)) {
      spider.releasePointerCapture(event.pointerId);
    }
    clearDragStyles(spider, thread);

    // 未拖动：若按下时正处于回弹位移中，从当前位置继续摆回静止
    if (!moved) {
      if ((dx || dy) && !isMotionReduced()) {
        animateSwingBack(spider, thread, dx, dy);
      }
      return;
    }
    state.suppressNextClick = true;
    if (!isMotionReduced()) {
      animateSwingBack(spider, thread, dx, dy);
    }
    if (Math.hypot(dx, dy) > SWING_WOW_DISTANCE) {
      showBubble(pickRandom(BUBBLE_MESSAGES.wow));
    }
  }

  spider.addEventListener("pointerup", finishDrag);
  spider.addEventListener("pointercancel", finishDrag);
}
