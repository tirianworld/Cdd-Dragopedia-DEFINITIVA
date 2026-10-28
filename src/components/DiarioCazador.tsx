import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export function DiarioCazador() {
  const navigate = useNavigate();
  const [loadingWeb, setLoadingWeb] = useState(true);

  // Background sync on load to keep cache warm
  useEffect(() => {
    fetch("/api/hunter-journal/monsters?refresh=true").catch(() => {});
  }, []);

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] min-h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden bg-background text-foreground font-sans">
      {/* Botón flotante accesible de volver a la Dragopedia */}
      <button
        type="button"
        onClick={handleBack}
        className="fixed top-16 right-4 z-40 h-8 w-8 flex items-center justify-center rounded-lg bg-card/90 hover:bg-card border border-border/80 hover:border-primary/60 text-foreground hover:text-primary shadow-md backdrop-blur-md transition-all cursor-pointer"
        title="Volver a la Dragopedia"
        aria-label="Volver a la Dragopedia"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      {loadingWeb && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/95 backdrop-blur-sm z-20">
          <div className="relative flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border border-primary/25 animate-ping" />
            <Loader2 className="h-8 w-8 animate-spin text-primary absolute" />
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-heading tracking-widest text-primary uppercase font-bold"
          >
            Cargando Diario del Cazador...
          </motion.span>
          <p className="text-xs text-muted-foreground font-sans">
            Sincronizando bestiario y compendio de criaturas...
          </p>
        </div>
      )}
      <iframe
        src="https://dragopedia-diario-del-cazador.ai.studio"
        title="Diario del Cazador"
        className="w-full h-full border-0 block"
        allow="fullscreen; clipboard-write; accelerometer; gyroscope"
        onLoad={() => setLoadingWeb(false)}
        referrerPolicy="no-referrer"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
}
