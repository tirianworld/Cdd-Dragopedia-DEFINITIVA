import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, ChevronRight, Eye, Plus, Trash2, MoveLeft, MoveRight, 
  Image as ImageIcon, Sparkles, Sliders, Check, X, Layers
} from "lucide-react";
import type { InfoboxImageItem } from "../types";
import { getSafeImageUrl, handleImageErrorWithFallback, isBlockedGeoImage } from "../utils/imageUrl";

interface InfoboxImageGalleryProps {
  images: InfoboxImageItem[];
  articleTitle: string;
  themeColor?: string;
  isVisualEditMode?: boolean;
  onImagesChange?: (newImages: InfoboxImageItem[]) => void;
  onImageClick?: (item: { url: string; alt: string; caption?: string }) => void;
  onRemoveMainImage?: () => void;
}

export function InfoboxImageGallery({
  images,
  articleTitle,
  themeColor = "#bafafd",
  isVisualEditMode = false,
  onImagesChange,
  onImageClick,
  onRemoveMainImage,
}: InfoboxImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isManaging, setIsManaging] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageLabel, setNewImageLabel] = useState("");
  const [newImageCaption, setNewImageCaption] = useState("");

  // Ensure activeIndex stays within bounds
  useEffect(() => {
    if (activeIndex >= images.length && images.length > 0) {
      setActiveIndex(images.length - 1);
    }
  }, [images.length, activeIndex]);

  const activeImage = images[activeIndex] || images[0] || null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim() || !onImagesChange) return;

    const newItem: InfoboxImageItem = {
      id: `img-${Date.now()}`,
      url: newImageUrl.trim(),
      label: newImageLabel.trim() || `Imagen ${images.length + 1}`,
      caption: newImageCaption.trim() || "",
      position_x: 50,
      position_y: 50,
    };

    const updated = [...images, newItem];
    onImagesChange(updated);
    setNewImageUrl("");
    setNewImageLabel("");
    setNewImageCaption("");
    setActiveIndex(updated.length - 1);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (!onImagesChange) return;
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onImagesChange(updated);
    if (activeIndex >= updated.length) {
      setActiveIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    if (!onImagesChange || toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onImagesChange(updated);
    setActiveIndex(toIndex);
  };

  const handleUpdateItem = (index: number, patch: Partial<InfoboxImageItem>) => {
    if (!onImagesChange) return;
    const updated = images.map((img, idx) => (idx === index ? { ...img, ...patch } : img));
    onImagesChange(updated);
  };

  // If no images exist and not in visual editor mode
  if (images.length === 0 && !isVisualEditMode) {
    return (
      <div className="p-8 text-center bg-secondary/15 border-b border-border flex flex-col items-center justify-center gap-2">
        <ImageIcon className="h-10 w-10 text-muted-foreground/45" />
        <span className="text-[10px] uppercase font-bold text-muted-foreground">
          Registro de Ilustración Vacío
        </span>
      </div>
    );
  }

  return (
    <div className="w-full border-b border-border flex flex-col bg-card/60">
      {/* Tab navigation pills if 2 or more images */}
      {images.length > 1 && (
        <div className="flex items-center gap-1.5 p-2 bg-secondary/35 border-b border-border overflow-x-auto scrollbar-none">
          {images.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#14282c] text-[#bafafd] border border-[#bafafd]/50 shadow-xs"
                    : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                }`}
              >
                <span className="truncate max-w-[130px]">
                  {item.label || `Imagen ${idx + 1}`}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bafafd] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main image viewport */}
      {activeImage && activeImage.url ? (
        <div
          onClick={() => {
            if (onImageClick) {
              onImageClick({
                url: getSafeImageUrl(activeImage.url),
                alt: `${articleTitle} - ${activeImage.label || ""}`,
                caption: activeImage.caption || activeImage.label || articleTitle,
              });
            }
          }}
          className="w-full h-64 sm:h-72 border-b border-border/80 overflow-hidden relative cursor-pointer group bg-black/30"
          title="Haz clic para ampliar la imagen"
        >
          <img
            src={getSafeImageUrl(activeImage.url)}
            alt={activeImage.label || articleTitle}
            referrerPolicy="no-referrer"
            onError={(e) => handleImageErrorWithFallback(e, activeImage.url)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            style={{
              objectPosition: `${activeImage.position_x ?? 50}% ${activeImage.position_y ?? 50}%`,
            }}
          />

          {/* Previous / Next buttons for multiple images */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md z-20"
                aria-label="Imagen anterior"
                title="Imagen anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md z-20"
                aria-label="Imagen siguiente"
                title="Imagen siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Badge indicator in top-left showing index */}
          {images.length > 1 && (
            <div className="absolute top-2 left-2 z-10">
              <span className="px-2 py-0.5 rounded-md bg-black/75 text-[10px] font-mono font-bold text-white/90 backdrop-blur-sm border border-white/15">
                {activeIndex + 1} / {images.length}
              </span>
            </div>
          )}

          {/* "Ampliar" label in top-right */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <span className="px-2.5 py-1 rounded bg-black/75 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm flex items-center gap-1 border border-white/20">
              <Eye className="h-3 w-3" /> Ampliar
            </span>
          </div>

          {/* Bottom caption overlay if present */}
          {activeImage.caption && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-2.5 pt-6 text-center">
              <p className="text-xs text-slate-200 line-clamp-2 italic drop-shadow-sm">
                {activeImage.caption}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-secondary/15 border-b border-border flex flex-col items-center justify-center gap-2">
          <ImageIcon className="h-10 w-10 text-muted-foreground/45" />
          <span className="text-[10px] uppercase font-bold text-muted-foreground">
            Sin imagen en la ficha
          </span>
        </div>
      )}

      {/* Visual Editor Management HUD */}
      {isVisualEditMode && (
        <div className="p-3 bg-[#0d161c] border-t border-border flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#bafafd]">
              <Layers className="w-4 h-4" />
              <span>Imágenes de la Ficha ({images.length})</span>
            </div>
            <button
              type="button"
              onClick={() => setIsManaging(!isManaging)}
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-secondary/70 hover:bg-secondary text-foreground border border-border flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isManaging ? "Ocultar Gestor" : "Gestionar / Añadir"}</span>
            </button>
          </div>

          {/* Expanded Management Drawer */}
          {isManaging && (
            <div className="flex flex-col gap-3 pt-2 border-t border-border/60">
              {/* Form to add a new image */}
              <form onSubmit={handleAddImage} className="flex flex-col gap-2 p-2.5 rounded-lg bg-[#142129] border border-[#213542]">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-primary" /> Añadir otra imagen a la ficha:
                </span>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="URL de la imagen (ej: /images/... o https://...)"
                  className="w-full h-8 px-2.5 text-xs bg-[#0b1216] border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newImageLabel}
                    onChange={(e) => setNewImageLabel(e.target.value)}
                    placeholder="Pestaña (ej: Ascendido, Armadura...)"
                    className="h-8 px-2.5 text-xs bg-[#0b1216] border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={newImageCaption}
                    onChange={(e) => setNewImageCaption(e.target.value)}
                    placeholder="Pie de foto opcional"
                    className="h-8 px-2.5 text-xs bg-[#0b1216] border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newImageUrl.trim()}
                  className="w-full py-1.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Añadir Imagen
                </button>
              </form>

              {/* List of current images with reorder, rename, delete */}
              {images.length > 0 && (
                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Imágenes configuradas:
                  </span>
                  {images.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs ${
                        idx === activeIndex
                          ? "bg-[#16272e] border-[#bafafd]/40 text-white"
                          : "bg-[#111a20] border-border/70 text-slate-300"
                      }`}
                    >
                      {/* Thumbnail preview */}
                      <img
                        src={getSafeImageUrl(item.url)}
                        alt={item.label}
                        className="w-10 h-10 rounded object-cover border border-border/80 shrink-0"
                        onError={(e) => handleImageErrorWithFallback(e, item.url)}
                      />

                      {/* Inputs for label and focal point */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <input
                          type="text"
                          value={item.label || ""}
                          onChange={(e) => handleUpdateItem(idx, { label: e.target.value })}
                          placeholder={`Pestaña ${idx + 1}`}
                          className="h-6 px-1.5 text-xs bg-[#0a1014] border border-border rounded text-white font-medium"
                        />
                        <input
                          type="text"
                          value={item.caption || ""}
                          onChange={(e) => handleUpdateItem(idx, { caption: e.target.value })}
                          placeholder="Pie de foto"
                          className="h-5 px-1.5 text-[11px] bg-[#0a1014] border border-border/60 rounded text-slate-300"
                        />
                      </div>

                      {/* Controls: Reorder & Delete */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, idx - 1)}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-secondary text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Mover a la izquierda"
                        >
                          <MoveLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, idx + 1)}
                          disabled={idx === images.length - 1}
                          className="p-1 rounded hover:bg-secondary text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                          title="Mover a la derecha"
                        >
                          <MoveRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 rounded hover:bg-rose-950/60 text-rose-400 hover:text-rose-200 cursor-pointer"
                          title="Eliminar esta imagen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
