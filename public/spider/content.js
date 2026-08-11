// 入口：以 ES Module 动态加载主模块（模块文件须列在 manifest 的 web_accessible_resources 中）
// 功能实现按职责拆在 content/ 目录下，这里只做加载
import(chrome.runtime.getURL("content/main.js")).catch(() => {});
