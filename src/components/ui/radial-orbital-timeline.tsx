"use client";

import { useEffect, useRef, useState, type ElementType, type MouseEvent } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
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
  const [radius, setRadius] = useState(220);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const updateRadius = () => setRadius(Math.min(220, Math.max(92, root.clientWidth * 0.27)));
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
    if (status === "completed") return { label: "CONSOLIDADO", classes: "border-[#35c5a6]/70 bg-[#35c5a6]/15 text-[#baf3e7]" };
    if (status === "in-progress") return { label: "EN CURSO", classes: "border-[#f7c65f]/70 bg-[#f7c65f]/15 text-[#ffe8b5]" };
    return { label: "PRÓXIMO", classes: "border-[#65c7dc]/40 bg-[#2f7fc2]/20 text-[#d8f5fa]" };
  };

  return (
    <div
      ref={containerRef}
      className="orbital-timeline-root relative flex h-[680px] w-full items-center justify-center overflow-hidden rounded-[32px] bg-[#143a63] text-white sm:h-[720px]"
      onClick={handleContainerClick}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(53,197,166,0.24),transparent_28%),radial-gradient(circle_at_15%_15%,rgba(101,199,220,0.20),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(101,199,220,.9)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-[#65c7dc]/30 bg-[#143a63]/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d8f5fa]/80 backdrop-blur-md sm:left-8 sm:top-8">
        <span className={`h-2 w-2 rounded-full bg-[#35c5a6] ${autoRotate ? "animate-pulse" : ""}`} />
        {autoRotate ? "Órbita activa" : "Explorando hito"}
      </div>

      <div ref={orbitRef} className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
        <div className="absolute h-20 w-20 rounded-full bg-gradient-to-br from-[#65c7dc] via-[#35c5a6] to-[#2f7fc2] shadow-[0_0_60px_rgba(53,197,166,.45)] sm:h-24 sm:w-24">
          <div className="absolute inset-[-18px] rounded-full border border-[#65c7dc]/30 animate-ping" />
          <div className="absolute inset-3 rounded-full border border-[#d8f5fa]/50 bg-[#d8f5fa]/20 backdrop-blur-md" />
          <div className="absolute inset-0 flex items-center justify-center text-center text-[9px] font-bold uppercase tracking-[0.16em] text-[#143a63] sm:text-[10px]">Los<br />Cóbanos</div>
        </div>

        <div className="absolute rounded-full border border-dashed border-[#65c7dc]/30" style={{ width: radius * 2, height: radius * 2 }} />
        <div className="absolute rounded-full border border-[#2f7fc2]/30" style={{ width: radius * 2 + 44, height: radius * 2 + 44 }} />

        {timelineData.map((item, index) => {
          const angle = ((index / timelineData.length) * 360 + rotationAngle) % 360;
          const radian = (angle * Math.PI) / 180;
          const x = radius * Math.cos(radian);
          const y = radius * Math.sin(radian);
          const zIndex = expandedItem === item.id ? 200 : Math.round(100 + 40 * Math.sin(radian));
          const opacity = expandedItem === item.id ? 1 : Math.max(0.55, 0.72 + 0.28 * Math.sin(radian));
          const isExpanded = expandedItem === item.id;
          const isRelated = expandedItem !== null && getRelatedItems(expandedItem).includes(item.id);
          const status = getStatus(item.status);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="absolute cursor-pointer transition-all duration-700"
              style={{ transform: `translate(${x}px, ${y}px)`, zIndex, opacity }}
              onClick={(event) => { event.stopPropagation(); toggleItem(item.id); }}
            >
              <div
                className={`absolute rounded-full transition-all ${isRelated ? "animate-pulse bg-[#35c5a6]/25" : "bg-[#65c7dc]/10"}`}
                style={{ width: item.energy * 0.35 + 42, height: item.energy * 0.35 + 42, inset: -(item.energy * 0.35 + 2) / 2 }}
              />
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-label={`${item.date}: ${item.title}`}
                className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7c65f] ${
                  isExpanded
                    ? "scale-150 border-[#f7c65f] bg-[#f7c65f] text-[#143a63] shadow-[0_0_28px_rgba(247,198,95,.45)]"
                    : isRelated
                      ? "border-[#35c5a6] bg-[#35c5a6] text-[#143a63]"
                      : "border-[#65c7dc]/60 bg-[#143a63] text-white hover:border-[#f7c65f] hover:bg-[#2f7fc2]"
                }`}
              >
                <Icon size={18} strokeWidth={2} />
              </button>

              <div className={`absolute left-1/2 top-14 w-28 -translate-x-1/2 text-center transition-all sm:w-40 ${isExpanded ? "scale-110 text-white" : "text-white/70"}`}>
                <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#f7c65f]">{item.date}</span>
                <span className="mt-0.5 block text-[11px] font-semibold sm:text-xs">{item.title}</span>
              </div>

              {isExpanded && (
                <Card className="orbital-detail-card absolute left-1/2 top-24 w-64 -translate-x-1/2 overflow-visible border-[#65c7dc]/30 bg-[#143a63]/95 text-white shadow-[0_24px_70px_rgba(20,58,99,.55)] backdrop-blur-lg sm:w-72">
                  <div className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-[#65c7dc]/60" />
                  <CardHeader className="space-y-3 p-5 pb-3">
                    <div className="flex items-center justify-between gap-3">
                      <Badge className={`px-2 py-1 text-[9px] tracking-[0.12em] ${status.classes}`}>{status.label}</Badge>
                      <span className="text-xs font-semibold text-[#f7c65f]">{item.date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.16em] text-white/45">{item.category}</span>
                      <CardTitle className="mt-1 text-base leading-snug text-white">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 text-xs leading-relaxed text-white/75">
                    <p>{item.content}</p>
                    <div className="mt-4 border-t border-[#65c7dc]/20 pt-3">
                      <div className="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-wider text-white/60">
                        <span className="flex items-center"><Zap size={11} className="mr-1 text-[#f7c65f]" />Impacto</span>
                        <span>{item.energy}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#2f7fc2]/30"><div className="h-full rounded-full bg-gradient-to-r from-[#2f7fc2] via-[#35c5a6] to-[#f7c65f]" style={{ width: `${item.energy}%` }} /></div>
                    </div>

                    {item.relatedIds.length > 0 && (
                      <div className="mt-4 border-t border-[#65c7dc]/20 pt-3">
                        <div className="mb-2 flex items-center text-[10px] uppercase tracking-wider text-white/50"><Link size={11} className="mr-1.5" />Hitos conectados</div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.relatedIds.map((relatedId) => {
                            const related = timelineData.find((candidate) => candidate.id === relatedId);
                            return (
                              <Button key={relatedId} variant="outline" size="sm" className="h-7 px-2 text-[10px] text-white/75 hover:text-white" onClick={(event) => { event.stopPropagation(); toggleItem(relatedId); }}>
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

      <p className="absolute bottom-5 left-1/2 w-full -translate-x-1/2 px-6 text-center text-[11px] text-white/45 sm:bottom-7">Selecciona un hito para detener la órbita y explorar sus conexiones.</p>
    </div>
  );
}
