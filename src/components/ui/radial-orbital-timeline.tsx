"use client";

import { useEffect, useRef, useState, type ElementType, type MouseEvent } from "react";
import { ArrowRight, Link, MousePointer2, Waves, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({ timelineData }: RadialOrbitalTimelineProps) {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [radius, setRadius] = useState(180);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const updateRadius = () => {
      const widthRadius = root.clientWidth * 0.20;
      const heightRadius = root.clientHeight * 0.29;
      setRadius(Math.min(190, Math.max(86, Math.min(widthRadius, heightRadius))));
    };
    updateRadius();
    const observer = new ResizeObserver(updateRadius);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoRotate) return;
    const timer = window.setInterval(() => {
      setRotationAngle((angle) => Number(((angle + 0.22) % 360).toFixed(3)));
    }, 50);
    return () => window.clearInterval(timer);
  }, [autoRotate]);

  const getRelatedItems = (itemId: number) =>
    timelineData.find((item) => item.id === itemId)?.relatedIds ?? [];

  const closeItem = () => {
    setExpandedItem(null);
    setAutoRotate(true);
  };

  const toggleItem = (id: number) => {
    if (expandedItem === id) {
      closeItem();
      return;
    }

    const nodeIndex = timelineData.findIndex((item) => item.id === id);
    const targetAngle = (nodeIndex / timelineData.length) * 360;
    setRotationAngle(270 - targetAngle);
    setExpandedItem(id);
    setAutoRotate(false);
  };

  const handleContainerClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === containerRef.current || event.target === orbitRef.current) closeItem();
  };

  const getStatus = (status: TimelineItem["status"]) => {
    if (status === "completed") return { label: "CONSOLIDADO", classes: "border-[#35c5a6]/45 bg-[#dff7f1] text-[#116c60]" };
    if (status === "in-progress") return { label: "EN CURSO", classes: "border-[#65c7dc]/50 bg-[#e4f6fa] text-[#276784]" };
    return { label: "PRÓXIMO", classes: "border-[#65c7dc]/45 bg-[#e4f6fa] text-[#276784]" };
  };

  return (
    <div
      ref={containerRef}
      className="orbital-timeline-root timeline-orbit-stage relative flex h-[720px] w-full items-center justify-center overflow-hidden rounded-[42px] border border-white/40 bg-white/[0.08] text-white shadow-[0_34px_100px_rgba(0,45,80,.2),inset_0_1px_0_rgba(255,255,255,.5)] backdrop-blur-[9px] sm:h-[900px] xl:h-[940px]"
      onClick={handleContainerClick}
    >
      <div className="timeline-orbit-surface pointer-events-none absolute inset-[1px] rounded-[41px] bg-[radial-gradient(circle_at_50%_48%,rgba(215,251,255,.23),transparent_34%),linear-gradient(145deg,rgba(255,255,255,.16),rgba(255,255,255,.02))]" />
      <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

      <div className="timeline-orbit-toolbar absolute inset-x-5 top-5 z-20 flex items-center justify-between gap-3 sm:inset-x-8 sm:top-8">
        <div className="timeline-orbit-status flex items-center gap-2.5 rounded-full border border-white/60 bg-white/90 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#285a73] shadow-[0_10px_28px_rgba(0,55,90,.14)] backdrop-blur-md sm:text-xs">
          <span className={`h-2.5 w-2.5 rounded-full bg-[#35c5a6] shadow-[0_0_0_5px_rgba(53,197,166,.14)] ${autoRotate ? "animate-pulse" : ""}`} />
          {autoRotate ? "Órbita activa" : "Explorando hito"}
        </div>

        <div className="timeline-orbit-range hidden items-center gap-5 rounded-full border border-[#c9e8f2] bg-white/90 px-5 py-2.5 text-[11px] font-semibold tracking-[0.08em] text-[#164a73] shadow-[0_10px_28px_rgba(0,55,90,.12)] backdrop-blur-md sm:flex">
          <span className="font-bold text-[#9ff2df]">2008 — Actualidad</span>
          <span className="h-3 w-px bg-white/30" />
          <span className="flex items-center gap-1.5"><MousePointer2 size={12} /> Selecciona un hito</span>
        </div>
      </div>

      <div ref={orbitRef} className="timeline-orbit-canvas absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
        <div className="pointer-events-none absolute rounded-full border border-dashed border-white/45 shadow-[0_0_40px_rgba(101,199,220,.08)]" style={{ width: radius * 2, height: radius * 2 }} />
        <div className="pointer-events-none absolute rounded-full border border-[#8ce6dd]/30" style={{ width: radius * 2 + 62, height: radius * 2 + 62 }} />
        <div className="pointer-events-none absolute rounded-full border border-white/25" style={{ width: radius * 1.24, height: radius * 1.24 }} />

        {timelineData.map((item, index) => {
          const angle = ((index / timelineData.length) * 360 + rotationAngle) % 360;
          const isRelated = expandedItem !== null && getRelatedItems(expandedItem).includes(item.id);
          return (
            <div
              key={`spoke-${item.id}`}
              className="pointer-events-none absolute left-1/2 top-1/2 h-px origin-left bg-gradient-to-r from-[#72ddcf]/45 via-white/25 to-white/60 transition-all duration-700"
              style={{ width: radius, transform: `rotate(${angle}deg)`, opacity: isRelated ? 0.9 : 0.42 }}
            />
          );
        })}

        <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-[#55dbc4]/15 blur-3xl sm:h-80 sm:w-80" />
        <div className="timeline-orbit-center absolute z-10 flex h-28 w-28 items-center justify-center rounded-full border border-white/75 bg-white/85 shadow-[0_22px_65px_rgba(0,75,110,.26),0_0_0_15px_rgba(53,197,166,.14)] backdrop-blur-lg sm:h-36 sm:w-36">
          <div className="absolute inset-2.5 rounded-full border border-[#65c7dc]/50 bg-gradient-to-br from-[#eafffb]/95 via-white/75 to-[#aee3ef]/80" />
          <div className="relative flex flex-col items-center text-[#143a63]">
            <Waves size={26} className="mb-1.5 text-[#178e9b]" strokeWidth={1.8} />
            <span className="text-center text-[10px] font-extrabold uppercase leading-tight tracking-[0.2em] sm:text-xs">Los<br />Cóbanos</span>
          </div>
        </div>

        {timelineData.map((item, index) => {
          const angle = ((index / timelineData.length) * 360 + rotationAngle) % 360;
          const radian = (angle * Math.PI) / 180;
          const x = radius * Math.cos(radian);
          const y = radius * Math.sin(radian);
          const zIndex = expandedItem === item.id ? 200 : Math.round(100 + 40 * Math.sin(radian));
          const opacity = expandedItem === item.id ? 1 : Math.max(0.82, 0.92 + 0.08 * Math.sin(radian));
          const isExpanded = expandedItem === item.id;
          const isRelated = expandedItem !== null && getRelatedItems(expandedItem).includes(item.id);
          const status = getStatus(item.status);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="timeline-orbit-node absolute cursor-pointer transition-all duration-700"
              style={{ transform: `translate(${x}px, ${y}px)`, zIndex, opacity }}
              onClick={(event) => { event.stopPropagation(); toggleItem(item.id); }}
            >
              <div
                className={`absolute rounded-full border transition-all ${isRelated ? "animate-pulse border-[#82ead8]/60 bg-[#35c5a6]/25" : "border-white/25 bg-white/10"}`}
                style={{ width: item.energy * 0.28 + 64, height: item.energy * 0.28 + 64, inset: -(item.energy * 0.28 + 8) / 2 }}
              />
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-label={`${item.date}: ${item.title}`}
                className={`timeline-orbit-icon relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fe3ef] sm:h-16 sm:w-16 ${
                  isExpanded
                    ? "scale-125 border-white bg-[#7fe3ef] text-[#143a63] shadow-[0_0_0_7px_rgba(127,227,239,.18),0_12px_30px_rgba(0,65,95,.25)]"
                    : isRelated
                      ? "border-white bg-[#6ee0c9] text-[#143a63] shadow-[0_10px_28px_rgba(0,75,105,.2)]"
                      : "border-white/90 bg-white/95 text-[#2f7fc2] shadow-[0_14px_34px_rgba(0,65,95,.24)] backdrop-blur-md hover:-translate-y-1.5 hover:scale-110 hover:border-[#8ee8dc] hover:bg-white"
                }`}
              >
                <Icon size={24} strokeWidth={2} />
              </button>

              <div className={`timeline-orbit-label absolute left-1/2 top-20 w-40 -translate-x-1/2 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 text-center text-[#143a63] shadow-[0_14px_34px_rgba(0,65,95,.18)] backdrop-blur-md transition-all sm:w-48 ${isExpanded ? "pointer-events-none -translate-y-1 scale-95 opacity-0" : "opacity-100"}`}>
                <span className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#148b87] sm:text-[11px]">{item.date}</span>
                <span className="mt-1 block text-[11px] font-bold leading-snug sm:text-sm">{item.title}</span>
              </div>

              {isExpanded && (
                <Card className="orbital-detail-card absolute left-1/2 top-24 w-64 -translate-x-1/2 overflow-visible rounded-3xl border-white/85 bg-white/95 text-[#143a63] shadow-[0_32px_85px_rgba(0,55,85,.3)] backdrop-blur-xl sm:w-72">
                  <div className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-white/80" />
                  <div className="absolute inset-x-5 top-0 h-1 rounded-b-full bg-gradient-to-r from-[#2f7fc2] via-[#65c7dc] to-white" />
                  <CardHeader className="space-y-2 p-4 pb-3">
                    <div className="flex items-center justify-between gap-3">
                      <Badge className={`px-2.5 py-1.5 text-[10px] tracking-[0.12em] ${status.classes}`}>{status.label}</Badge>
                      <span className="text-sm font-bold text-[#2f7fc2]">{item.date}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5e7f92]">{item.category}</span>
                      <CardTitle className="mt-1.5 text-base leading-snug text-[#143a63] sm:text-lg">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs leading-relaxed text-[#42677e]">
                    <p>{item.content}</p>
                    <div className="mt-4 border-t border-[#65c7dc]/20 pt-3">
                      <div className="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-wider text-[#5e7f92]">
                        <span className="flex items-center"><Zap size={11} className="mr-1 text-[#2f7fc2]" />Impacto</span>
                        <span>{item.energy}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#2f7fc2]/30"><div className="h-full rounded-full bg-gradient-to-r from-[#2f7fc2] via-[#65c7dc] to-white" style={{ width: `${item.energy}%` }} /></div>
                    </div>

                    {item.relatedIds.length > 0 && (
                      <div className="mt-4 border-t border-[#65c7dc]/20 pt-3">
                        <div className="mb-2 flex items-center text-[10px] uppercase tracking-wider text-[#5e7f92]"><Link size={11} className="mr-1.5" />Hitos conectados</div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.relatedIds.map((relatedId) => {
                            const related = timelineData.find((candidate) => candidate.id === relatedId);
                            return (
                              <Button key={relatedId} variant="outline" size="sm" className="h-7 border-[#b7e4ed] bg-[#f5fbfd] px-2 text-[10px] text-[#276784] hover:bg-[#dff4fa] hover:text-[#143a63]" onClick={(event) => { event.stopPropagation(); toggleItem(relatedId); }}>
                                {related?.date}<ArrowRight size={10} className="ml-1" />
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>

      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/25 bg-[#0b5274]/40 px-4 py-2 text-center text-[10px] font-semibold text-white/90 shadow-sm backdrop-blur-md sm:hidden">Selecciona un hito para explorar.</p>
    </div>
  );
}
