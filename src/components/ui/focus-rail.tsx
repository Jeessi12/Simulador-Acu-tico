import * as React from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type FocusRailItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc: string;
  href?: string;
  meta?: string;
};

type FocusRailProps = {
  items: FocusRailItem[];
  initialIndex?: number;
  loop?: boolean;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
};

const BASE_SPRING = { type: "spring", stiffness: 300, damping: 30, mass: 1 } as const;
const TAP_SPRING = { type: "spring", stiffness: 450, damping: 18, mass: 1 } as const;

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

export function FocusRail({
  items,
  initialIndex = 0,
  loop = true,
  autoPlay = false,
  interval = 4000,
  className,
}: FocusRailProps) {
  const [active, setActive] = React.useState(initialIndex);
  const [isHovering, setIsHovering] = React.useState(false);
  const count = items.length;

  if (!count) return null;

  const activeIndex = wrap(0, count, active);
  const activeItem = items[activeIndex];

  const handlePrev = React.useCallback(() => {
    if (!loop && activeIndex === 0) return;
    setActive((previous) => previous - 1);
  }, [activeIndex, loop]);

  const handleNext = React.useCallback(() => {
    if (!loop && activeIndex === count - 1) return;
    setActive((previous) => previous + 1);
  }, [activeIndex, count, loop]);

  React.useEffect(() => {
    if (!autoPlay || isHovering) return;
    const timer = window.setInterval(handleNext, interval);
    return () => window.clearInterval(timer);
  }, [autoPlay, handleNext, interval, isHovering]);

  const onDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipe = Math.abs(info.offset.x) * info.velocity.x;
    if (swipe < -10000 || info.offset.x < -80) handleNext();
    if (swipe > 10000 || info.offset.x > 80) handlePrev();
  };

  return (
    <div
      className={cn(
        "focus-rail biodiversity-focus-rail group relative flex h-[520px] w-full flex-col overflow-hidden border border-transparent bg-transparent text-white shadow-none outline-none select-none sm:h-[560px]",
        className,
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") handlePrev();
        if (event.key === "ArrowRight") handleNext();
      }}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Biodiversidad marina"
      tabIndex={0}
    >
      <div className="focus-rail-shell relative z-10 flex flex-1 flex-col justify-center px-4 md:px-10">
        <motion.div
          className="focus-rail-stage relative mx-auto flex h-[300px] w-full max-w-7xl cursor-grab items-center justify-center [perspective:1400px] active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
        >
          {[-2, -1, 0, 1, 2].map((offset) => {
            const absoluteIndex = active + offset;
            if (!loop && (absoluteIndex < 0 || absoluteIndex >= count)) return null;
            const item = items[wrap(0, count, absoluteIndex)];
            const distance = Math.abs(offset);
            const isCenter = offset === 0;

            return (
              <motion.button
                type="button"
                key={`${absoluteIndex}-${item.id}`}
                aria-label={isCenter ? `${item.title}, elemento activo` : `Mostrar ${item.title}`}
                className={cn(
                  "focus-rail-card absolute aspect-[3/4] w-[185px] overflow-hidden rounded-[22px] border border-white bg-white shadow-[0_22px_50px_rgba(37,108,142,.22)] md:w-[235px]",
                  isCenter ? "is-center z-20 ring-4 ring-white/80 shadow-[0_28px_70px_rgba(37,108,142,.3)]" : "is-side z-10",
                )}
                initial={false}
                animate={{
                  x: offset * 260,
                  z: -distance * 190,
                  scale: isCenter ? 1 : 0.86,
                  rotateY: offset * -18,
                  opacity: isCenter ? 1 : Math.max(0.22, 1 - distance * 0.36),
                  filter: `blur(${isCenter ? 0 : distance * 3}px) brightness(${isCenter ? 1 : 0.86})`,
                }}
                transition={{ default: BASE_SPRING, scale: TAP_SPRING }}
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => offset !== 0 && setActive((previous) => previous + offset)}
              >
                <img src={item.imageSrc} alt={item.title} draggable={false} className="pointer-events-none h-full w-full object-cover" />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#b7e4ed]/50" />
              </motion.button>
            );
          })}

          <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={handlePrev} className="focus-rail-side-button focus-rail-side-prev" aria-label="Biodiversidad anterior">
            <ChevronLeft aria-hidden="true" />
          </button>
          <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={handleNext} className="focus-rail-side-button focus-rail-side-next" aria-label="Biodiversidad siguiente">
            <ChevronRight aria-hidden="true" />
          </button>
        </motion.div>

        <div className="focus-rail-footer mx-auto mt-5 flex w-full max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="focus-rail-info flex h-24 flex-1 flex-col items-center justify-center text-center md:items-start md:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className="focus-rail-copy space-y-2"
              >
                {activeItem.meta && <span className="focus-rail-meta text-xs font-semibold uppercase tracking-[.14em] text-[#7ff0d8] [text-shadow:0_2px_8px_rgba(0,35,70,.55)]">{activeItem.meta}</span>}
                <h3 className="focus-rail-title text-2xl font-bold tracking-tight text-white [text-shadow:0_3px_14px_rgba(0,35,70,.45)] md:text-3xl">{activeItem.title}</h3>
                {activeItem.description && <p className="focus-rail-description max-w-xl text-sm leading-6 text-white/85 [text-shadow:0_2px_8px_rgba(0,35,70,.5)] md:text-base md:leading-7">{activeItem.description}</p>}
                {activeItem.href && (
                  <a href={activeItem.href} className="focus-rail-explore inline-flex items-center gap-2 rounded-full bg-[#7fe3ef] px-5 py-3 text-sm font-semibold text-[#143a63] transition-transform hover:scale-105 active:scale-95">
                    Explorar <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="focus-rail-bottom-controls flex items-center gap-3">
            <div className="focus-rail-nav flex items-center gap-1 rounded-full p-1.5 backdrop-blur-md">
              <button type="button" onClick={handlePrev} className="focus-rail-nav-button rounded-full p-3 transition active:scale-95" aria-label="Biodiversidad anterior">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="focus-rail-nav-count min-w-[58px] text-center font-mono text-xs font-semibold">{String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
              <button type="button" onClick={handleNext} className="focus-rail-nav-button rounded-full p-3 transition active:scale-95" aria-label="Biodiversidad siguiente">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
