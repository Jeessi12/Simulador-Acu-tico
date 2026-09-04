import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/loading/LoadingScreen";

interface LoadingProgressDetail {
  current?: number;
  total?: number;
}

function SimulatorLoadingController() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleStart = () => {
      setErrorMessage(null);
      setProgress(null);
      setVisible(true);
    };
    const handleProgress = (event: Event) => {
      const { current = 0, total = 0 } = (event as CustomEvent<LoadingProgressDetail>).detail ?? {};
      setProgress(total > 0 ? current / total : null);
    };
    const handleReady = () => {
      setProgress(1);
      setVisible(false);
    };
    const handleError = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      setErrorMessage(detail?.message ?? "No se pudo iniciar la simulación.");
      setVisible(true);
    };

    window.addEventListener("blueeco:simulator-loading-start", handleStart);
    window.addEventListener("blueeco:simulator-loading-progress", handleProgress);
    window.addEventListener("blueeco:simulator-loading-ready", handleReady);
    window.addEventListener("blueeco:simulator-loading-error", handleError);
    return () => {
      window.removeEventListener("blueeco:simulator-loading-start", handleStart);
      window.removeEventListener("blueeco:simulator-loading-progress", handleProgress);
      window.removeEventListener("blueeco:simulator-loading-ready", handleReady);
      window.removeEventListener("blueeco:simulator-loading-error", handleError);
    };
  }, []);

  return <LoadingScreen isLoading={visible} progress={progress} errorMessage={errorMessage} />;
}

const mount = document.getElementById("simulator-loading-root");
if (mount) createRoot(mount).render(<SimulatorLoadingController />);
