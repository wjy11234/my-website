// Shadow DOM 模板：样式按约定内联在模板字符串中，不外置 css（内容脚本无法方便地加载外部样式）
import { THREAD_REST_HEIGHT, CLIMB_UP_DISTANCE, CLIMB_THREAD_HEIGHT } from "./constants.js";

export function buildShadowHTML(spriteUrl) {
  return `
      <style>
        :host {
          all: initial;
          position: fixed;
          inset: 0;
          z-index: 2147483646;
          pointer-events: none;
          color-scheme: light;
          --sprite-url: url("${spriteUrl}");
          --pet-scale: .9;
        }

        :host([data-size="small"]) { --pet-scale: .72; }

        .sky {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .fly {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          font-size: 13px;
          line-height: 1;
        }

        .fly::before {
          content: "🪰";
        }

        .scene {
          position: absolute;
          top: 0;
          left: clamp(90px, 82vw, calc(100vw - 72px));
          width: 96px;
          height: 173px;
          transform: translateX(-50%);
          filter: drop-shadow(0 4px 4px rgba(18, 24, 38, .14));
        }

        :host([data-position="left"]) .scene {
          left: clamp(72px, 18vw, calc(100vw - 90px));
        }

        .thread {
          position: absolute;
          top: -2px;
          left: 47px;
          width: 2px;
          height: ${THREAD_REST_HEIGHT}px;
          overflow: hidden;
          transform-origin: top;
          animation: thread-drop 1500ms cubic-bezier(.2, .75, .2, 1) both,
                     gentle-sway 7s ease-in-out 2s infinite;
        }

        .thread.has-dropped {
          animation: gentle-sway 7s ease-in-out 2s infinite;
        }

        .thread.is-dragging {
          animation: none;
        }

        .thread.is-hiding {
          height: ${CLIMB_THREAD_HEIGHT}px;
        }

        .thread::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 2px;
          background: linear-gradient(90deg, rgba(71, 82, 103, .68), rgba(255, 255, 255, .94));
          box-shadow: 0 0 2px rgba(33, 45, 68, .24);
        }

        .pet-wrap {
          position: absolute;
          top: 38px;
          left: 7px;
          width: 82px;
          height: 124px;
          transform-origin: 41px 0;
          animation: pet-drop 1500ms cubic-bezier(.16, .78, .25, 1.08) both,
                     gentle-sway 7s ease-in-out 2s infinite,
                     pet-bob 4.6s ease-in-out 1.8s infinite;
          pointer-events: none;
        }

        .spider {
          width: 82px;
          height: 124px;
          border: 0;
          padding: 0;
          margin: 0;
          appearance: none;
          background-color: transparent;
          background-image: var(--sprite-url);
          background-repeat: no-repeat;
          background-position: 0 0;
          background-size: 6314px 124px;
          image-rendering: pixelated;
          transform: scale(var(--pet-scale));
          transform-origin: top center;
          cursor: grab;
          pointer-events: auto;
          outline: none;
          touch-action: none;
        }

        .spider.is-dragging {
          cursor: grabbing;
        }

        .spider.is-looking {
          animation: look-around 6160ms steps(76, end) both;
        }

        .spider.is-scared {
          animation: pet-scare 720ms ease-in-out both;
        }

        .spider.is-stretching {
          animation: pet-stretch 1200ms ease-in-out both;
        }

        .spider.is-nudging {
          animation: pet-nudge 900ms ease-in-out both;
        }

        .spider.is-hiding {
          translate: 0 ${-CLIMB_UP_DISTANCE}px;
        }

        .spider:focus-visible {
          border-radius: 12px;
          outline: 3px solid rgba(255, 80, 76, .34);
          outline-offset: -7px;
        }

        .deco {
          position: absolute;
          display: none;
          pointer-events: none;
        }

        :host([data-holiday="halloween"]) .deco {
          display: block;
          top: 1px;
          left: 41px;
          width: 18px;
          height: 13px;
          transform: translateX(-50%);
          border-radius: 50% 50% 44% 44%;
          background: radial-gradient(circle at 50% 62%, #f2842d, #d96a16);
          box-shadow: inset 0 -2px 3px rgba(122, 52, 4, .4);
        }

        :host([data-holiday="halloween"]) .deco::after {
          content: "";
          position: absolute;
          top: -4px;
          left: 50%;
          width: 3px;
          height: 5px;
          margin-left: -1.5px;
          border-radius: 2px;
          background: #4d7a2d;
        }

        :host([data-holiday="christmas"]) .deco {
          display: block;
          top: -9px;
          left: 41px;
          width: 0;
          height: 0;
          transform: translateX(-50%) rotate(-12deg);
          border-left: 9px solid transparent;
          border-right: 9px solid transparent;
          border-bottom: 15px solid #e0413c;
        }

        :host([data-holiday="christmas"]) .deco::before {
          content: "";
          position: absolute;
          top: 13px;
          left: -10px;
          width: 20px;
          height: 4px;
          border-radius: 3px;
          background: #fff;
        }

        :host([data-holiday="christmas"]) .deco::after {
          content: "";
          position: absolute;
          top: -4px;
          left: -3.5px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 2px rgba(31, 39, 55, .18);
        }

        :host([data-holiday="springFestival"]) .deco,
        :host([data-holiday="newYear"]) .deco {
          display: block;
          top: 24px;
          left: -9px;
          width: 12px;
          height: 14px;
          border-radius: 6px / 7px;
          background: linear-gradient(#e8453f, #c02f2a);
          box-shadow: inset 0 0 3px rgba(255, 214, 120, .55);
        }

        :host([data-holiday="springFestival"]) .deco::before,
        :host([data-holiday="newYear"]) .deco::before {
          content: "";
          position: absolute;
          top: -4px;
          left: 50%;
          width: 2px;
          height: 4px;
          margin-left: -1px;
          background: #e5b93c;
        }

        :host([data-holiday="springFestival"]) .deco::after,
        :host([data-holiday="newYear"]) .deco::after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 50%;
          width: 2px;
          height: 5px;
          margin-left: -1px;
          background: #e5b93c;
        }

        .zzz {
          position: absolute;
          top: -6px;
          right: -4px;
          width: 24px;
          height: 30px;
          display: none;
          pointer-events: none;
        }

        :host([data-sleeping="true"]) .zzz { display: block; }

        .zzz span {
          position: absolute;
          right: 6px;
          bottom: 0;
          opacity: 0;
          color: #8d94a6;
          font: 700 11px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          animation: zzz-float 2.7s ease-in infinite;
        }

        .zzz span:nth-child(2) {
          right: 13px;
          font-size: 9px;
          animation-delay: .9s;
        }

        .zzz span:nth-child(3) {
          right: 0;
          font-size: 8px;
          animation-delay: 1.8s;
        }

        .heart {
          position: absolute;
          top: 4px;
          opacity: 0;
          color: #ef6b66;
          font-size: 12px;
          pointer-events: none;
          animation: heart-float 950ms ease-out both;
        }

        .close {
          position: absolute;
          top: 2px;
          right: -3px;
          width: 23px;
          height: 23px;
          border: 1px solid rgba(27, 34, 49, .10);
          border-radius: 999px;
          padding: 0 0 2px;
          opacity: 0;
          color: #596172;
          background: rgba(255, 255, 255, .94);
          box-shadow: 0 4px 12px rgba(22, 27, 36, .12);
          font: 17px/20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          cursor: pointer;
          pointer-events: auto;
          transform: scale(.86);
          transition: opacity 160ms ease, transform 160ms ease;
        }

        .feed {
          position: absolute;
          top: 26px;
          left: -5px;
          display: grid;
          width: 23px;
          height: 23px;
          place-items: center;
          border: 1px solid rgba(27, 34, 49, .10);
          border-radius: 999px;
          padding: 0;
          opacity: 0;
          background: rgba(255, 255, 255, .94);
          box-shadow: 0 4px 12px rgba(22, 27, 36, .12);
          font-size: 12px;
          line-height: 1;
          cursor: pointer;
          pointer-events: none;
          transform: scale(.86);
          transition: opacity 160ms ease, transform 160ms ease;
        }

        :host([data-position="left"]) .feed {
          left: auto;
          right: -5px;
        }

        .pet-wrap:hover .close,
        .close:focus-visible {
          opacity: 1;
          transform: scale(1);
        }

        .pet-wrap:hover .feed,
        .feed:focus-visible {
          opacity: 1;
          pointer-events: auto;
          transform: scale(1);
        }

        :host([data-hiding="true"]) .close,
        :host([data-hiding="true"]) .feed,
        .spider.is-dragging ~ .feed {
          opacity: 0 !important;
          pointer-events: none;
        }

        .close:focus-visible,
        .feed:focus-visible {
          outline: 2px solid #ff5b55;
          outline-offset: 2px;
        }

        .bubble {
          position: absolute;
          top: 86px;
          right: 59px;
          width: max-content;
          max-width: 150px;
          border: 1px solid rgba(31, 39, 55, .08);
          border-radius: 13px 13px 4px 13px;
          padding: 7px 10px;
          opacity: 0;
          color: #303747;
          background: rgba(255, 255, 255, .96);
          box-shadow: 0 8px 24px rgba(31, 39, 55, .12);
          font: 12px/1.35 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
          letter-spacing: .02em;
          transform: translate(5px, 4px) scale(.96);
          transform-origin: bottom right;
          transition: opacity 180ms ease, transform 180ms ease;
          pointer-events: none;
        }

        :host([data-position="left"]) .bubble {
          right: auto;
          left: 59px;
          border-radius: 13px 13px 13px 4px;
          transform: translate(-5px, 4px) scale(.96);
          transform-origin: bottom left;
        }

        .bubble.is-visible {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        @keyframes pet-drop {
          0% { transform: translateY(-178px); }
          76% { transform: translateY(5px); }
          100% { transform: translateY(0); }
        }

        @keyframes thread-drop {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }

        @keyframes gentle-sway {
          0%, 100% { rotate: -2.4deg; }
          50% { rotate: 2.4deg; }
        }

        @keyframes pet-bob {
          0%, 100% { translate: 0 0; }
          35% { translate: 0 3px; }
          70% { translate: 0 -2px; }
        }

        @keyframes look-around {
          from { background-position: 0 0; }
          to { background-position: -6232px 0; }
        }

        @keyframes pet-scare {
          0% { translate: 0 0; }
          28% { translate: 0 -36px; }
          52% { translate: 0 -36px; }
          100% { translate: 0 0; }
        }

        @keyframes pet-stretch {
          0%, 100% { transform: scale(var(--pet-scale)); }
          32% { transform: scale(calc(var(--pet-scale) * 1.06), calc(var(--pet-scale) * .88)); }
          68% { transform: scale(calc(var(--pet-scale) * .95), calc(var(--pet-scale) * 1.09)); }
        }

        @keyframes pet-nudge {
          0%, 100% { transform: scale(var(--pet-scale)) rotate(0deg); }
          20% { transform: scale(var(--pet-scale)) rotate(-6deg); }
          50% { transform: scale(var(--pet-scale)) rotate(6deg); }
          80% { transform: scale(var(--pet-scale)) rotate(-3deg); }
        }

        @keyframes zzz-float {
          0% { opacity: 0; translate: 0 0; }
          18% { opacity: .9; }
          100% { opacity: 0; translate: 7px -26px; }
        }

        @keyframes heart-float {
          0% { opacity: 0; translate: 0 6px; scale: .6; }
          25% { opacity: 1; }
          100% { opacity: 0; translate: 0 -22px; scale: 1.05; }
        }

        :host([data-calm="true"]) .thread,
        :host([data-calm="true"]) .pet-wrap {
          animation-duration: 1ms;
          animation-iteration-count: 1;
        }

        :host([data-calm="true"]) .spider.is-looking,
        :host([data-calm="true"]) .spider.is-scared,
        :host([data-calm="true"]) .spider.is-stretching,
        :host([data-calm="true"]) .spider.is-nudging {
          animation: none;
        }

        :host([data-calm="true"]) .zzz span {
          animation: none;
          opacity: .7;
        }

        :host([data-calm="true"]) .feed {
          transition: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .thread,
          .pet-wrap,
          .spider.is-looking,
          .spider.is-scared,
          .spider.is-stretching,
          .spider.is-nudging {
            animation: none !important;
          }

          .zzz span {
            animation: none !important;
            opacity: .7;
          }

          .feed {
            transition: none !important;
          }
        }
      </style>
      <div class="sky" aria-hidden="true"></div>
      <div class="scene">
        <div class="thread" aria-hidden="true"></div>
        <div class="pet-wrap">
          <button class="spider" type="button" aria-label="蛛蛛正在陪伴你：点击打招呼，按住摸摸它，拖拽荡秋千，双击收起或放下它"><span class="deco" aria-hidden="true"></span></button>
          <div class="zzz" aria-hidden="true"><span>Z</span><span>Z</span><span>Z</span></div>
          <button class="close" type="button" aria-label="收起蛛蛛到蛛丝顶端" title="收起到顶部">×</button>
          <button class="feed" type="button" aria-label="投喂一只小虫给蛛蛛" title="投喂小虫">🪰</button>
          <div class="bubble" role="status">今天也一起认真冲呀</div>
        </div>
      </div>
    `;
}
