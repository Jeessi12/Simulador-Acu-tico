import { useEffect, useState, type CSSProperties } from "react";
import { Whale } from "./Whale";
import "./LoadingScreen.css";

export interface LoadingScreenProps {
  isLoading: boolean;
  progress?: number | null;
  label?: string;
  errorMessage?: string | null;
  className?: string;
}

export function LoadingScreen({
  isLoading,
  progress = 0,
  label = "Cargando simulación...",
  errorMessage = null,
  className = "",
}: LoadingScreenProps) {
  const [shouldRender, setShouldRender] = useState(isLoading);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let animationFrame = 0;
    let exitTimeout = 0;

    if (isLoading) {
      setShouldRender(true);
      animationFrame = window.requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      exitTimeout = window.setTimeout(() => setShouldRender(false), 420);
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(exitTimeout);
    };
  }, [isLoading]);

  if (!shouldRender) return null;

  const normalizedProgress = progress == null ? 0 : Math.min(1, Math.max(0, progress));
  const percentage = Math.round(normalizedProgress * 100);
  const progressStyle = { "--blueeco-progress": `${percentage}%` } as CSSProperties;
  const visibleClass = isVisible ? " blueeco-loading--visible" : "";

  return (
    <section
      className={`blueeco-loading${visibleClass}${className ? ` ${className}` : ""}`}
      role="status"
      aria-live="polite"
      aria-busy={isLoading}
      aria-label={errorMessage ?? label}
    >
      <div className="blueeco-loading__content">
        <div className="blueeco-loading__visual" aria-hidden="true">
          <div className="blueeco-loading__orbit">
            <div className="blueeco-loading__carrier">
              <div className="blueeco-loading__whale-position">
                <div className="blueeco-loading__whale-upright">
                  <Whale className="blueeco-loading__whale" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className={errorMessage ? "blueeco-loading__error" : undefined}>
          {errorMessage ?? label}
        </h2>

        <div
          className="blueeco-loading__progress"
          role="progressbar"
          aria-label="Progreso de carga de la simulación"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
          style={progressStyle}
        >
          <span />
        </div>
        <p className="blueeco-loading__percentage">{percentage}%</p>
      </div>
    </section>
  );
}
