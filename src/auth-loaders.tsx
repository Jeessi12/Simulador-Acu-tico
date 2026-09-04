import { createRoot } from "react-dom/client"

import { WaveLoader } from "@/components/ui/wave-loader"
import "./auth-loaders.css"

document.querySelectorAll<HTMLElement>("[data-wave-loader]").forEach((mount) => {
  const message = mount.dataset.waveLoader || "Procesando..."
  const form = mount.closest<HTMLFormElement>("form")
  const button = mount.closest<HTMLButtonElement>("button")

  createRoot(mount).render(
    <WaveLoader
      bars={5}
      message={message}
      messagePlacement="right"
      className="h-4 w-2 rounded-[1px] bg-white"
    />,
  )

  form?.addEventListener("submit", (event) => {
    // Espera a que las validaciones existentes puedan cancelar el envio.
    queueMicrotask(() => {
      if (event.defaultPrevented || !button) return

      button.dataset.loading = "true"
      button.disabled = true
      button.setAttribute("aria-busy", "true")
    })
  })
})
