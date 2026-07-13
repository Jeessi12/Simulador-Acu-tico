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
  const lastWheelTime = React.useRef(0);
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

  const onWheel = (event: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 400) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(delta) <= 20) return;
    delta > 0 ? handleNext() : handlePrev();
    lastWheelTime.current = now;
  };

  const onDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipe = Math.abs(info.offset.x) * info.velocity.x;
    if (swipe < -10000 || info.offset.x < -80) handleNext();
    if (swipe > 10000 || info.offset.x > 80) handlePrev();
  };

  return (
    <div
      className={cn(
        "focus-rail group relative flex h-[620px] w-full flex-col overflow-hidden rounded-[30px] border border-[#65c7dc]/30 bg-[#143a63] text-white shadow-2xl outline-none select-none",
        className,
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") handlePrev();
        if (event.key === "ArrowRight") handleNext();
      }}
      onWheel={onWheel}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Biodiversidad marina"
      tabIndex={0}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`background-${activeItem.id}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.42 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <img src={activeItem.imageSrc} alt="" className="h-full w-full scale-110 object-cover blur-3xl saturate-200" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#143a63] via-[#143a63]/65 to-[#2f7fc2]/15" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center px-4 md:px-8">
        <motion.div
          className="relative mx-auto flex h-[370px] w-full max-w-6xl cursor-grab items-center justify-center [perspective:1200px] active:cursor-grabbing"
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
                  "absolute aspect-[3/4] w-[220px] overflow-hidden rounded-2xl border border-[#65c7dc]/35 bg-[#143a63] shadow-2xl md:w-[290px]",
                  isCenter ? "z-20 shadow-[#35c5a6]/20" : "z-10",
                )}
                initial={false}
                animate={{
                  x: offset * 310,
                  z: -distance * 180,
                  scale: isCenter ? 1 : 0.85,
                  rotateY: offset * -20,
                  opacity: isCenter ? 1 : Math.max(0.1, 1 - distance * 0.45),
                  filter: `blur(${isCenter ? 0 : distance * 5}px) brightness(${isCenter ? 1 : 0.55})`,
                }}
                transition={{ default: BASE_SPRING, scale: TAP_SPRING }}
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => offset !== 0 && setActive((previous) => previous + offset)}
              >
                <img src={item.imageSrc} alt={item.title} draggable={false} className="pointer-events-none h-full w-full object-cover" />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#65c7dc]/20 to-transparent" />
                <span className="pointer-events-none absolute inset-0 bg-[#143a63]/10 mix-blend-multiply" />
              </motion.button>
            );
          })}
        </motion.div>

        <div className="mx-auto mt-7 flex w-full max-w-4xl flex-col items-center justify-between gap-5 md:flex-row">
          <div className="flex h-32 flex-1 flex-col items-center justify-center text-center md:items-start md:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {activeItem.meta && <span className="text-xs font-semibold uppercase tracking-[.14em] text-[#35c5a6]">{activeItem.meta}</span>}
                <h3 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{activeItem.title}</h3>
                {activeItem.description && <p className="max-w-md text-sm leading-6 text-[#d8f5fa]">{activeItem.description}</p>}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-[#143a63]/85 p-1 ring-1 ring-[#65c7dc]/30 backdrop-blur-md">
              <button type="button" onClick={handlePrev} className="rounded-full p-3 text-[#65c7dc] transition hover:bg-[#2f7fc2]/50 hover:text-white active:scale-95" aria-label="Biodiversidad anterior">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="min-w-[52px] text-center font-mono text-xs text-[#65c7dc]">{String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
              <button type="button" onClick={handleNext} className="rounded-full p-3 text-[#65c7dc] transition hover:bg-[#2f7fc2]/50 hover:text-white active:scale-95" aria-label="Biodiversidad siguiente">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            {activeItem.href && (
              <a href={activeItem.href} className="flex items-center gap-2 rounded-full bg-[#f7c65f] px-5 py-3 text-sm font-semibold text-[#143a63] transition-transform hover:scale-105 active:scale-95">
                Explorar <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
