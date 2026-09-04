import { createRoot } from "react-dom/client";
import { Fish, Leaf, Mountain, ShieldCheck, Turtle } from "lucide-react";
import RadialOrbitalTimeline, { type TimelineItem } from "@/components/ui/radial-orbital-timeline";
import { FocusRail, type FocusRailItem } from "@/components/ui/focus-rail";
import "./recursos-timeline.css";

const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Creación del Área Natural",
    date: "2008",
    content: "Declaración oficial de Los Cóbanos como área protegida de El Salvador.",
    category: "Protección territorial",
    icon: Mountain,
    relatedIds: [2],
    status: "completed",
    energy: 100,
  },
  {
    id: 2,
    title: "Gestión territorial",
    date: "2009",
    content: "Se fortalece la gestión marina costera y la conservación de playas, arrecifes y especies asociadas.",
    category: "Gestión costera",
    icon: ShieldCheck,
    relatedIds: [1, 3],
    status: "completed",
    energy: 92,
  },
  {
    id: 3,
    title: "Monitoreo de Arrecifes",
    date: "2013",
    content: "Inicio de los programas de monitoreo comunitario de corales y peces del arrecife.",
    category: "Investigación marina",
    icon: Fish,
    relatedIds: [2, 4],
    status: "completed",
    energy: 84,
  },
  {
    id: 4,
    title: "Protección de Tortugas",
    date: "2018",
    content: "Implementación de viveros y patrullajes para proteger las tortugas marinas.",
    category: "Conservación de especies",
    icon: Turtle,
    relatedIds: [3, 5],
    status: "completed",
    energy: 76,
  },
  {
    id: 5,
    title: "Conservación participativa",
    date: "Actualidad",
    content: "Los Cóbanos se mantiene como laboratorio natural para aprender sobre arrecifes y ecosistemas.",
    category: "Participación comunitaria",
    icon: Leaf,
    relatedIds: [4, 1],
    status: "in-progress",
    energy: 68,
  },
];

const mount = document.getElementById("recursos-orbital-timeline");
if (mount) createRoot(mount).render(<RadialOrbitalTimeline timelineData={timelineData} />);

const biodiversityItems: FocusRailItem[] = [
  {
    id: "reef-fish",
    title: "Peces de Arrecife",
    description: "Peces ángel, cirujanos y otras especies mantienen el equilibrio del arrecife de Los Cóbanos.",
    meta: "24 especies • Especies clave",
    imageSrc: "../public/media/Species/recurpeces.webp",
    href: "especies.php",
  },
  {
    id: "invertebrates",
    title: "Invertebrados",
    description: "Estrellas, moluscos, nudibranquios y organismos del fondo marino reciclan nutrientes.",
    meta: "31 registros • Diversidad",
    imageSrc: "../public/media/Species/recurestrella.png",
    href: "especies.php",
  },
  {
    id: "turtles",
    title: "Tortugas Marinas",
    description: "La tortuga carey, verde y otras especies encuentran alimento y refugio en estas aguas.",
    meta: "4 especies • Protección",
    imageSrc: "../public/media/Species/recurtortuga.png",
    href: "especies.php",
  },
  {
    id: "seagrass",
    title: "Pastos Marinos",
    description: "Hábitats esenciales para la alimentación, el crecimiento de juveniles y la salud costera.",
    meta: "3 biomas • Hábitats",
    imageSrc: "../public/media/Species/recurpasto.webp",
    href: "especies.php",
  },
  {
    id: "rays",
    title: "Rayas del Pacífico",
    description: "Las mantarrayas recorren las aguas abiertas y conectan distintos ambientes del ecosistema marino.",
    meta: "Nueva colección • Vida pelágica",
    imageSrc: "../public/media/Species/recurraya.png",
    href: "especies.php",
  },
];

const focusRailMount = document.getElementById("recursos-focus-rail");
if (focusRailMount) {
  createRoot(focusRailMount).render(
    <FocusRail items={biodiversityItems} initialIndex={1} loop autoPlay={false} />,
  );
}
