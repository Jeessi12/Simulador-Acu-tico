import * as React from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FlaskConical,
  Search,
  SlidersHorizontal,
  Sparkles,
  Waves,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FADE_UP_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 150, damping: 20 },
  },
};

const STAGGER_CONTAINER_VARIANTS: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

type SimulationCategory = "equilibrio" | "impacto";

interface Simulation {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
  imagePosition?: string;
  category: SimulationCategory;
  categoryLabel: string;
  level: string;
  duration: string;
  variables: string;
  accent: "reef" | "chain" | "impact";
  facts: string[];
  searchTerms: string;
}

const SIMULATIONS: Simulation[] = [
  {
    id: 1,
    eyebrow: "Equilibrio natural",
    title: "Arrecife de Los Cóbanos",
    description:
      "Explora un arrecife saludable y reconoce las condiciones que permiten que sus especies prosperen.",
    imageUrl: "../public/media/backgrounds/Arrecife-de-los-cobanos.png",
    category: "equilibrio",
    categoryLabel: "Equilibrio",
    level: "Inicial",
    duration: "8–12 min",
    variables: "4 variables",
    accent: "reef",
    facts: [
      "Observa al pez ángel real, la tortuga carey y otras especies del arrecife.",
      "Compara temperatura, salinidad, oxígeno disuelto y salud ambiental.",
      "Identifica qué condiciones mantienen estable un ecosistema marino.",
    ],
    searchTerms: "arrecife los cobanos equilibrio ecosistema saludable inicial",
  },
  {
    id: 2,
    eyebrow: "Dinámica de poblaciones",
    title: "Cadena alimenticia",
    description:
      "Ajusta poblaciones y descubre cómo una pequeña variación puede recorrer toda la red trófica.",
    imageUrl: "../public/media/backgrounds/Cadena-alimenticia.png",
    imagePosition: "center 44%",
    category: "equilibrio",
    categoryLabel: "Equilibrio",
    level: "Intermedio",
    duration: "12–18 min",
    variables: "7 variables",
    accent: "chain",
    facts: [
      "Trabaja con depredadores, presas y organismos de distintos niveles tróficos.",
      "Modifica poblaciones y condiciones del agua para comparar resultados.",
      "Analiza capacidad de carga, supervivencia y equilibrio alimenticio.",
    ],
    searchTerms: "cadena alimenticia poblaciones red trofica especies intermedio",
  },
  {
    id: 3,
    eyebrow: "Presión ambiental",
    title: "Contaminación marina",
    description:
      "Comprueba cómo la contaminación modifica el oxígeno, el estrés y el bienestar de la vida marina.",
    imageUrl: "../public/media/backgrounds/Contaminacion.png",
    imagePosition: "center 48%",
    category: "impacto",
    categoryLabel: "Impacto",
    level: "Avanzado",
    duration: "10–15 min",
    variables: "3 variables",
    accent: "impact",
    facts: [
      "Observa la respuesta de especies sensibles a la presión ambiental.",
      "Aumenta gradualmente la contaminación y revisa los indicadores del agua.",
      "Compara un ambiente sano con uno sometido a un impacto acumulativo.",
    ],
    searchTerms: "contaminacion marina impacto oxigeno salud ambiente avanzado",
  },
];

type Filter = "all" | SimulationCategory;

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function SimulationShowcase() {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [selected, setSelected] = React.useState<Simulation | null>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const lastFocusedRef = React.useRef<HTMLElement | null>(null);

  const visibleSimulations = React.useMemo(() => {
    const normalizedQuery = normalizeText(query);
    return SIMULATIONS.filter((simulation) => {
      const matchesFilter = filter === "all" || simulation.category === filter;
      const matchesQuery =
        !normalizedQuery ||
        normalizeText(
          `${simulation.title} ${simulation.eyebrow} ${simulation.description} ${simulation.searchTerms}`,
        ).includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const closeModal = React.useCallback(() => setSelected(null), []);

  React.useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  React.useEffect(() => {
    if (!selected) return;

    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeRef.current?.focus());

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
      window.requestAnimationFrame(() => lastFocusedRef.current?.focus());
    };
  }, [closeModal, selected]);

  const openModal = (simulation: Simulation, trigger: HTMLElement) => {
    lastFocusedRef.current = trigger;
    setSelected(simulation);
  };

  return (
    <motion.section
      id="simulatorLibrary"
      className="simulation-showcase"
      aria-labelledby="simulationShowcaseTitle"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={STAGGER_CONTAINER_VARIANTS}
    >
      <div className="showcase-heading">
        <motion.div className="showcase-copy" variants={FADE_UP_VARIANTS}>
          <span className="showcase-kicker">
            <Sparkles aria-hidden="true" /> Biblioteca de experiencias
          </span>
          <h2 id="simulationShowcaseTitle">
            Elige una simulación y <em>pon el océano a prueba.</em>
          </h2>
          <p>
            Cada escenario responde en tiempo real para que observes relaciones, formules hipótesis y
            vuelvas a experimentar.
          </p>
        </motion.div>

        <motion.div className="showcase-controls" variants={FADE_UP_VARIANTS}>
          <label className="showcase-search" htmlFor="simulatorSearch">
            <Search aria-hidden="true" />
            <input
              ref={searchRef}
              id="simulatorSearch"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar una experiencia..."
              autoComplete="off"
            />
            <kbd>Ctrl K</kbd>
          </label>
          <div className="showcase-filters" aria-label="Filtrar simulaciones">
            {([
              ["all", "Todas"],
              ["equilibrio", "Equilibrio"],
              ["impacto", "Impacto"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={cn("showcase-filter", filter === value && "is-active")}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div className="showcase-grid" variants={STAGGER_CONTAINER_VARIANTS}>
        <AnimatePresence mode="popLayout">
          {visibleSimulations.map((simulation) => (
            <motion.article
              key={simulation.id}
              layout
              variants={FADE_UP_VARIANTS}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              className={cn("showcase-card-wrap", `is-${simulation.accent}`)}
            >
              <button
                type="button"
                className="showcase-card-button"
                aria-label={`Conocer la simulación ${simulation.title}`}
                onClick={(event) => openModal(simulation, event.currentTarget)}
              />
              <Card className="showcase-card">
                <div className="showcase-media">
                  <img
                    src={simulation.imageUrl}
                    alt=""
                    style={{ objectPosition: simulation.imagePosition }}
                    loading="lazy"
                  />
                  <span className="showcase-media-shade" aria-hidden="true" />
                  <span className="showcase-number" aria-hidden="true">
                    {String(simulation.id).padStart(2, "0")}
                  </span>
                  <span className="showcase-level">
                    <span aria-hidden="true" /> Nivel {simulation.level.toLowerCase()}
                  </span>
                </div>

                <div className="showcase-card-content">
                  <span className="showcase-card-eyebrow">{simulation.eyebrow}</span>
                  <div className="showcase-title-row">
                    <h3>{simulation.title}</h3>
                    <span className="showcase-arrow" aria-hidden="true">
                      <ArrowRight />
                    </span>
                  </div>
                  <p>{simulation.description}</p>
                  <div className="showcase-card-meta">
                    <span>
                      <Clock3 aria-hidden="true" /> {simulation.duration}
                    </span>
                    <span>
                      <SlidersHorizontal aria-hidden="true" /> {simulation.variables}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {visibleSimulations.length === 0 && (
        <motion.div className="showcase-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Search aria-hidden="true" />
          <h3>No encontramos esa simulación</h3>
          <p>Prueba con “arrecife”, “poblaciones” o “contaminación”.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
              searchRef.current?.focus();
            }}
          >
            Ver todas
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            className="showcase-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="showcaseModalTitle"
            aria-describedby="showcaseModalDescription"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeModal();
            }}
          >
            <motion.div
              className={cn("showcase-modal-panel", `is-${selected.accent}`)}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <button
                ref={closeRef}
                className="showcase-modal-close"
                type="button"
                aria-label="Cerrar ventana"
                onClick={closeModal}
              >
                <X aria-hidden="true" />
              </button>

              <div className="showcase-modal-visual">
                <img src={selected.imageUrl} alt="" style={{ objectPosition: selected.imagePosition }} />
                <span>{selected.categoryLabel}</span>
                <div>
                  {selected.accent === "impact" ? (
                    <FlaskConical aria-hidden="true" />
                  ) : (
                    <Waves aria-hidden="true" />
                  )}
                  <small>Experiencia {String(selected.id).padStart(2, "0")}</small>
                </div>
              </div>

              <div className="showcase-modal-content">
                <span className="showcase-card-eyebrow">{selected.eyebrow}</span>
                <h2 id="showcaseModalTitle">{selected.title}</h2>
                <p id="showcaseModalDescription">{selected.description}</p>
                <div className="showcase-modal-facts">
                  {selected.facts.map((fact) => (
                    <div key={fact}>
                      <CheckCircle2 aria-hidden="true" />
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
                <div className="showcase-modal-actions">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Seguir explorando
                  </Button>
                  <Button asChild>
                    <a href={`simulador.php?id=${selected.id}&start=1`}>
                      Iniciar simulación <ArrowRight aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
