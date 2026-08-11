// 通用工具：日期/节日判定与数学小助手
import { SPRING_FESTIVAL_DAYS } from "./constants.js";

export function todayString(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function detectHoliday(now = new Date()) {
  const monthDay = `${now.getMonth() + 1}/${now.getDate()}`;
  if (monthDay === "1/1") return "newYear";
  if (monthDay === "10/31") return "halloween";
  if (monthDay === "12/24" || monthDay === "12/25") return "christmas";

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (SPRING_FESTIVAL_DAYS.has(todayString(now)) || SPRING_FESTIVAL_DAYS.has(todayString(tomorrow))) {
    return "springFestival";
  }
  return "";
}

export function isLateNightHour(hour = new Date().getHours()) {
  return hour >= 23 || hour < 5;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
