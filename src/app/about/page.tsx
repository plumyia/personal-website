"use client";

import { motion } from "framer-motion";
import { aboutData } from "@/lib/data";
import RotatingText from "@/components/ui/rotating-text";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-20 pb-28 sm:px-8">

      {/* ── Title ── */}
      <motion.h1
        className="text-center font-display text-[clamp(28px,4vw,40px)] font-semibold tracking-tight text-text-primary"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        关于我
      </motion.h1>

      {/* ── Pull quote + style tags — magazine layout ── */}
      <motion.div
        className="mt-10 flex items-start justify-between gap-8"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
      >
        {/* Style tags — vertical, left side */}
        <div className="flex flex-col gap-2 pt-2">
          {aboutData.styles.map((s, i) => (
            <span
              key={s}
              className="whitespace-nowrap font-display text-[17px] text-text-secondary"
            >
              <span className="text-accent/60">#</span>{s}{" "}
              <span className="text-text-tertiary">{aboutData.stylesEN[i]}</span>
            </span>
          ))}
        </div>

        {/* Pull quote — right side */}
        <blockquote className="max-w-lg text-right">
          <p className="font-display text-[clamp(18px,2.5vw,24px)] leading-relaxed tracking-tight text-text-primary">
            从品牌文案到品牌市场<br />
            <motion.span layout transition={{ type: "spring", damping: 25, stiffness: 300 }}>
              我不断{" "}
              <RotatingText
                texts={["扩展创想", "沟通", "行动"]}
                rotationInterval={1800}
                staggerDuration={0.03}
                staggerFrom="first"
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                mainClassName="text-accent font-semibold inline-block overflow-hidden rounded bg-accent/10 px-1.5"
              />
            </motion.span>
            <br />
            让创想变成实际
          </p>
        </blockquote>
      </motion.div>

      {/* ── Languages — centered ── */}
      <motion.div
        className="mt-20 text-center"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
      >
        <h2 className="font-display text-[18px] font-semibold tracking-tight text-text-primary">
          语言能力
          <span className="ml-2 text-[11px] font-medium uppercase tracking-[0.12em] text-text-tertiary">
            Languages
          </span>
        </h2>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {aboutData.languages.map((lang) => (
            <div
              key={lang.name}
              className="flex items-center gap-3 rounded-full border border-border bg-bg-secondary px-5 py-2.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-display text-[14px] text-text-primary">
                {lang.nameCN}
              </span>
              <span className="text-[12px] text-text-tertiary">
                {lang.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Capabilities — alternating magazine blocks with curved connectors ── */}
      <div className="mt-20 space-y-2">
        {aboutData.capabilities.map((cap, i) => {
          const isEven = i % 2 === 0;
          const details: Record<string, string[]> = {
            内容策划: ["品牌文案撰写", "社媒内容规划", "产品卖点提炼"],
            品牌活动: ["创意方案策划", "视觉与物料统筹", "现场执行管理", "跨界合作对接"],
            社媒传播: ["KOL 筛选与投放管理", "信息流投放策略", "UGC 活动策划"],
            数据复盘: ["销售数据追踪分析", "社媒数据汇总", "结案报告输出", "优化策略建议"],
          };
          const items = details[cap.title] || [];
          return (
            <motion.div
              key={cap.title}
              className={(i === 1 || i >= 2) ? "-mt-4" : ""}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div
                className={isEven ? "ml-6 max-w-xl" : "mr-6 ml-auto max-w-md text-right"}
              >
                {/* Accent line */}
                <div
                  className={
                    isEven
                      ? "mb-4 h-0.5 w-12 bg-accent/40"
                      : "mb-4 ml-auto h-0.5 w-12 bg-accent/40"
                  }
                />
                <h3 className="font-display text-[22px] font-semibold tracking-tight text-text-primary">
                  {cap.title}
                </h3>
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-text-tertiary">
                  {cap.titleEN}
                </span>
                <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
                  {cap.description}
                </p>
                {/* Detail items — plain text */}
                {items.length > 0 && (
                  <p className="mt-4 text-[13px] leading-relaxed text-text-tertiary">
                    {items.join(" / ")}
                  </p>
                )}
              </div>

              {/* Curved dashed connector — flowing from title to title */}
              {i < aboutData.capabilities.length - 1 && (
                <div className={`my-1 h-24 w-full ${i === 0 ? "mt-4" : ""}${i === 1 || i === 2 ? " mt-6" : ""}`}>
                  <svg
                    className="h-full w-full overflow-visible"
                    viewBox="0 0 800 96"
                  >
                    <path
                      d={
                        isEven
                          // 左 → 右：S 形，居中
                          ? "M 280 0 C 180 64, 620 32, 520 96"
                          // 右 → 左：S 形反向
                          : "M 520 0 C 620 64, 180 32, 280 96"
                      }
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="5 6"
                      className="text-accent/35"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="22"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </svg>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── Aside note — centered, casual tone ── */}
      <motion.aside
        className="relative mt-28 text-center"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Drift triangle in margin */}
        <span className="absolute -left-4 top-0 text-[20px] text-accent/20 animate-drift-triangle select-none">
          ▲
        </span>
        <p className="font-display text-[17px] leading-relaxed italic text-text-primary">
          <span className="mr-1.5 text-accent/60">✦</span>
          爱好：搜集美丽的东西，看动物类影片…
        </p>
      </motion.aside>

      {/* ── Resume — fixed bottom-right corner ── */}
      <motion.a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-hover fixed bottom-14 right-20 z-40 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-bg-primary/90 px-5 py-2.5 text-[14px] text-accent shadow-sm backdrop-blur transition-all duration-300 hover:bg-accent hover:text-white"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
      >
        Resume
        <span className="text-[11px]">↗</span>
      </motion.a>

      {/* ── Contact — centered, prominent close ── */}
      <motion.div
        className="relative mt-24 text-center"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Large faint diamond watermark */}
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] text-accent/[0.04] select-none pointer-events-none">
          ◆
        </span>
        <span className="mb-5 inline-block text-[24px] text-accent/30">—</span>
        <p className="font-display text-[18px] tracking-tight text-text-primary">
          欢迎与我联系
        </p>
        <a
          href="mailto:546097747@qq.com"
          className="mt-3 inline-block text-[15px] text-accent underline underline-offset-4 decoration-accent/40 transition-colors hover:text-accent-hover hover:decoration-accent"
        >
          546097747@qq.com
        </a>
      </motion.div>
    </div>
  );
}
