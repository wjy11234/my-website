// 常量与默认设置：集中存放各模块共用的配置，避免循环依赖
export const HOST_ID = "spider-companion-extension-host";

export const DEFAULT_SETTINGS = {
  enabled: true,
  entranceMode: "oncePerSession",
  calmMode: false,
  size: "standard",
  position: "right",
  sitReminder: false,
  customMessages: []
};

export const THREAD_REST_HEIGHT = 48;
export const DRAG_MAX_DOWN = 130;
export const DRAG_MAX_UP = 30;
export const DRAG_MAX_SIDE = 150;
export const COMBO_CLICK_COUNT = 5;
export const COMBO_CLICK_WINDOW = 2000;
export const PET_HOLD_MS = 600;
export const CLIMB_DOUBLE_CLICK_WINDOW = 300;
export const CLIMB_CONFIRM_DELAY = 350;
export const CLIMB_UP_DISTANCE = 110;
export const CLIMB_THREAD_HEIGHT = 6;
export const SWING_WOW_DISTANCE = 100;
export const SIT_CHECK_INTERVAL = 5 * 60 * 1000;
export const MANUAL_FEED_LIMIT = 3;
export const MANUAL_FEED_WINDOW_MS = 10 * 60 * 1000;

// 春节（正月初一）的公历日期查表，含前一天除夕
export const SPRING_FESTIVAL_DAYS = new Set([
  "2026-02-17",
  "2027-02-06",
  "2028-01-26",
  "2029-02-13",
  "2030-02-03"
]);
