import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, GraduationCap, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ClassroomRole = "student" | "teacher";

interface ClassroomRoleHeroProps {
  role: ClassroomRole;
  className?: string;
}

const CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.14 },
  },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 145, damping: 20 },
  },
};

const BACK_CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, x: 54, rotate: 8 },
  show: {
    opacity: 1,
    x: 0,
    rotate: 8,
    transition: { duration: 0.72, ease: "easeOut" },
  },
};

const FRONT_CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, x: 54, rotate: -7 },
  show: {
    opacity: 1,
    x: 0,
    rotate: -7,
    transition: { duration: 0.72, delay: 0.12, ease: "easeOut" },
  },
};

const ROLE_CONTENT = {
  student: {
    kicker: "Tu próxima clase está a un código",
    title: (
      <>
        Aprende en equipo. <em>Únete a tu clase.</em>
      </>
    ),
    description:
      "Ingresa el código de 6 caracteres que te compartió tu docente y encuentra tus simulaciones, tareas y avances en un solo lugar.",
    buttonText: "Unirme a una clase",
    buttonLink: "asignaciones.php#unirse-clase",
    roleImage: "../public/media/Web/estudiante.png",
    roleImageAlt: "Ilustración del perfil de estudiante de BlueEcoSim",
    simulationImage: "../public/media/backgrounds/Arrecife-de-los-cobanos.png",
    simulationImageAlt: "Escenario marino de una simulación de BlueEcoSim",
    Icon: GraduationCap,
  },
  teacher: {
    kicker: "De la simulación al aula",
    title: (
      <>
        Convierte cada experiencia en <em>una clase.</em>
      </>
    ),
    description:
      "Crea un espacio, invita a tus estudiantes y asigna simulaciones para acompañar su aprendizaje y revisar su progreso.",
    buttonText: "Crear una clase",
    buttonLink: "espacios.php#crear-clase",
    roleImage: "../public/media/Web/docente.png",
    roleImageAlt: "Ilustración del perfil de docente de BlueEcoSim",
    simulationImage: "../public/media/backgrounds/Contaminacion.png",
    simulationImageAlt: "Escenario de contaminación marina de BlueEcoSim",
    Icon: School,
  },
} satisfies Record<ClassroomRole, {
  kicker: string;
  title: React.ReactNode;
  description: string;
  buttonText: string;
  buttonLink: string;
  roleImage: string;
  roleImageAlt: string;
  simulationImage: string;
  simulationImageAlt: string;
  Icon: React.ComponentType<{ "aria-hidden"?: boolean }>;
}>;

export function ClassroomRoleHero({ role, className }: ClassroomRoleHeroProps) {
  const content = ROLE_CONTENT[role];
  const Icon = content.Icon;

  return (
    <motion.section
      id="classroomNextStep"
      className={cn("role-classroom-hero", `is-${role}`, className)}
      aria-labelledby="classroomNextStepTitle"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.22 }}
      variants={CONTAINER_VARIANTS}
    >
      <div className="role-classroom-grid" aria-hidden="true" />
      <div className="role-classroom-wash" aria-hidden="true" />

      <div className="role-classroom-inner">
        <div className="role-classroom-copy">
          <motion.span className="role-classroom-kicker" variants={ITEM_VARIANTS}>
            <Icon aria-hidden={true} />
            {content.kicker}
          </motion.span>
          <motion.h2 id="classroomNextStepTitle" variants={ITEM_VARIANTS}>
            {content.title}
          </motion.h2>
          <motion.p variants={ITEM_VARIANTS}>{content.description}</motion.p>
          <motion.div className="role-classroom-action" variants={ITEM_VARIANTS}>
            <Button asChild className="role-classroom-button">
              <a href={content.buttonLink}>
                {content.buttonText}
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
          </motion.div>
        </div>

        <motion.div className="role-classroom-visual" variants={CONTAINER_VARIANTS} aria-hidden="true">
          <motion.figure
            className="role-classroom-card role-classroom-card--back"
            variants={BACK_CARD_VARIANTS}
            whileHover={{ y: -10, rotate: 5, transition: { duration: 0.25 } }}
          >
            <img src={content.simulationImage} alt={content.simulationImageAlt} />
            <span>Simulaciones interactivas</span>
          </motion.figure>
          <motion.figure
            className="role-classroom-card role-classroom-card--front"
            variants={FRONT_CARD_VARIANTS}
            whileHover={{ y: -10, rotate: -3, transition: { duration: 0.25 } }}
          >
            <img className="role-classroom-avatar" src={content.roleImage} alt={content.roleImageAlt} />
            <span>{role === "student" ? "Mi espacio de clase" : "Mi aula virtual"}</span>
          </motion.figure>
        </motion.div>
      </div>
    </motion.section>
  );
}
