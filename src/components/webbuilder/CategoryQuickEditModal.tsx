import React, { useState, useEffect } from "react";
import { useCategories } from "../../context/CategoryContext";
import { useVisualEditor } from "../../context/VisualEditorContext";
import { AVAILABLE_ICONS, ICON_MAP } from "../../utils/categoryHelper";
import { 
  X, Check, Trash2, Palette, Sparkles, AlertCircle, 
  ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, SlidersHorizontal, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CategoryQuickEditModalProps {
  category: any | null;
  onClose: () => void;
}

export function CategoryQuickEditModal({ category, onClose }: CategoryQuickEditModalProps) {
  const { 
    updateCategory, 
    deleteCategory, 
    mergedCategories, 
    moveCategory, 
    moveCategoryToPosition 
  } = useCategories();
  const { showToast } = useVisualEditor();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState("#c8a96e");
  const [iconName, setIconName] = useState("BookOpen");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDesc(category.description || category.desc || "");
      setColor(category.color || "#c8a96e");
      setIconName(category.iconName || "BookOpen");
      setShowDeleteConfirm(false);
    }
  }, [category]);

  if (!category) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("El nombre de la categoría no puede estar vacío.", "warning");
      return;
    }
    setIsSaving(true);
    try {
      await updateCategory(category.id, name.trim(), desc.trim(), color, iconName);
      showToast(`Categoría "${name}" guardada con éxito.`, "success");
      onClose();
    } catch (err: any) {
      showToast("Error al guardar categoría: " + (err.message || err), "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(category.id);
      showToast(`Categoría "${category.name}" eliminada.`, "info");
      onClose();
    } catch (err: any) {
      showToast("Error al eliminar categoría: " + (err.message || err), "error");
    }
  };

  const SelectedIcon = ICON_MAP[iconName] || ICON_MAP.BookOpen;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden z-10"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2.5">
            <div 
              className="h-8 w-8 rounded-lg flex items-center justify-center border shadow-inner"
              style={{ backgroundColor: `${color}20`, borderColor: `${color}40` }}
            >
              <SelectedIcon className="h-4.5 w-4.5" style={{ color }} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-foreground">
                Editar Categoría
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Personaliza el nombre, icono y color
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Nombre de la Categoría
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Criaturas Místicas"
              className="w-full text-xs p-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-foreground font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Descripción / Resumen
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Breve explicación sobre qué artículos van en esta categoría..."
              rows={2}
              className="w-full text-xs p-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-foreground leading-relaxed resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-primary" />
                Color Distintivo
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-8 w-12 rounded cursor-pointer border border-border bg-background p-0.5"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full text-xs p-1.5 rounded-lg bg-background border border-border font-mono text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Icono Visual
              </label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-background border border-border focus:border-primary focus:outline-none text-foreground cursor-pointer"
              >
                {AVAILABLE_ICONS.map((ic) => (
                  <option key={ic.name} value={ic.name}>
                    {ic.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Posición cósmica y Reordenación */}
          {(() => {
            const currentIndex = mergedCategories.findIndex(
              (c) =>
                c.id === category.id ||
                c.slug === category.slug ||
                c.name.toLowerCase() === (category.name || "").toLowerCase()
            );

            if (currentIndex === -1) return null;

            return (
              <div className="p-3 bg-secondary/25 border border-border/70 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-bold text-foreground">
                      Posición en el Menú y Portada
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 border border-primary/25 text-primary font-bold">
                      #{currentIndex + 1} de {mergedCategories.length}
                    </span>
                    {category.isCustom ? (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/30">
                        Personalizada
                      </span>
                    ) : (
                      <span className="text-[9px] font-medium uppercase px-1.5 py-0.5 rounded bg-secondary/80 text-muted-foreground border border-border/40">
                        Fija
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[10.5px] text-muted-foreground leading-relaxed">
                  Puedes colocar libremente esta categoría personalizada antes que las fijas (ej. antes de <em>Personajes</em> o <em>Lugares</em>):
                </p>

                <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground">Ir a posición:</span>
                    <select
                      value={currentIndex}
                      onChange={async (e) => {
                        const newTarget = Number(e.target.value);
                        await moveCategoryToPosition(category.id, newTarget);
                        showToast(`Categoría movida a la posición #${newTarget + 1}.`, "info");
                      }}
                      className="h-7 text-xs font-mono px-2 rounded-md bg-background border border-border text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {mergedCategories.map((_, pIdx) => (
                        <option key={pIdx} value={pIdx}>
                          Pos #{pIdx + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center bg-background rounded-lg p-0.5 border border-border">
                    <button
                      type="button"
                      onClick={async () => {
                        await moveCategory(category.id, "top");
                        showToast(`"${name}" colocada en el primer lugar absoluto.`, "success");
                      }}
                      disabled={currentIndex === 0}
                      className="px-2 py-1 text-[10px] font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded disabled:opacity-20 transition-colors flex items-center gap-1"
                      title="Mover al primer lugar absoluto"
                    >
                      <ChevronsUp className="h-3 w-3" />
                      <span>Primera</span>
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await moveCategory(category.id, "up");
                        showToast(`"${name}" subida una posición.`, "info");
                      }}
                      disabled={currentIndex === 0}
                      className="px-2 py-1 text-[10px] font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded disabled:opacity-20 transition-colors flex items-center gap-1"
                      title="Subir una posición"
                    >
                      <ChevronUp className="h-3 w-3" />
                      <span>Subir</span>
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await moveCategory(category.id, "down");
                        showToast(`"${name}" bajada una posición.`, "info");
                      }}
                      disabled={currentIndex === mergedCategories.length - 1}
                      className="px-2 py-1 text-[10px] font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded disabled:opacity-20 transition-colors flex items-center gap-1"
                      title="Bajar una posición"
                    >
                      <ChevronDown className="h-3 w-3" />
                      <span>Bajar</span>
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await moveCategory(category.id, "bottom");
                        showToast(`"${name}" colocada en el último lugar.`, "success");
                      }}
                      disabled={currentIndex === mergedCategories.length - 1}
                      className="px-2 py-1 text-[10px] font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded disabled:opacity-20 transition-colors flex items-center gap-1"
                      title="Mover al último lugar"
                    >
                      <ChevronsDown className="h-3 w-3" />
                      <span>Última</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Eliminar
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-rose-400">¿Confirmar?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-2 py-1 text-[10px] font-bold bg-rose-500 text-white rounded hover:bg-rose-600"
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2 py-1 text-[10px] bg-secondary text-foreground rounded hover:bg-secondary/80"
                >
                  No
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/60 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
