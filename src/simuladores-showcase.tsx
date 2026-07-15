import { createRoot } from "react-dom/client";
import { ClassroomRoleHero, type ClassroomRole } from "@/components/ui/classroom-role-hero";
import { SimulationShowcase } from "@/components/ui/simulation-showcase";
import "./simuladores-showcase.css";

const mount = document.getElementById("simuladores-showcase");

if (mount) {
  const roleById: Partial<Record<string, ClassroomRole>> = {
    "1": "student",
    "2": "teacher",
  };
  const classroomRole = roleById[mount.dataset.userRole ?? ""];

  createRoot(mount).render(
    <>
      <SimulationShowcase />
      {classroomRole && <ClassroomRoleHero role={classroomRole} />}
    </>,
  );
}
