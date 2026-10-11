import React, { useState, useEffect, useRef } from "react";
import {
  FolderOpen,
  UploadCloud,
  Check,
  Search,
  X,
  Loader2,
  HardDrive,
  FileImage,
  RefreshCw,
  Sparkles,
  AlertCircle
} from "lucide-react";
import {
  MatchedDownloadImage,
  getStoredDownloadsDirectoryHandle,
  saveDownloadsDirectoryHandle,
  scanDirectoryForMatchingImages,
  requestDownloadsDirectoryPicker,
  filterMatchingFiles
} from "../utils/downloadsDirectoryHelper";
import { formatBytes } from "../utils/localImageStorage";

interface DownloadsImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleTitle: string;
  onSelectImageFile: (file: File) => Promise<void>;
  onOpenManualFileInput: () => void;
}

export function DownloadsImagePickerModal({
  isOpen,
  onClose,
  articleTitle,
  onSelectImageFile,
  onOpenManualFileInput
}: DownloadsImagePickerModalProps) {
  const [searchTerm, setSearchTerm] = useState(articleTitle || "");
  const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [matchedImages, setMatchedImages] = useState<MatchedDownloadImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [needsPermissionGrant, setNeedsPermissionGrant] = useState(false);

  const fallbackFolderInputRef = useRef<HTMLInputElement>(null);

  // Sync search term with article title when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm(articleTitle || "");
      setSelectedImageId(null);
      setErrorMsg(null);
      checkAndScanStoredDirectory(articleTitle || "");
    }
  }, [isOpen, articleTitle]);

  // Clean up blob preview URLs when unmounting or changing matches
  useEffect(() => {
    return () => {
      matchedImages.forEach((img) => {
        if (img.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
  }, [matchedImages]);

  // Check if we already have a saved Downloads folder handle in IndexedDB
  const checkAndScanStoredDirectory = async (query: string) => {
    if (typeof window === "undefined" || !("showDirectoryPicker" in window)) {
      setHasScanned(false);
      return;
    }

    try {
      const handle = await getStoredDownloadsDirectoryHandle();
      if (handle) {
        setDirHandle(handle);
        // @ts-ignore
        const perm = await handle.queryPermission({ mode: "read" });
        if (perm === "granted") {
          setNeedsPermissionGrant(false);
          await performScan(handle, query);
        } else {
          setNeedsPermissionGrant(true);
        }
      } else {
        setDirHandle(null);
        setNeedsPermissionGrant(false);
      }
    } catch (err) {
      console.warn("Error comprobando directorio guardado:", err);
    }
  };

  // Perform directory scan
  const performScan = async (handle: FileSystemDirectoryHandle, query: string) => {
    setIsScanning(true);
    setErrorMsg(null);
    try {
      const results = await scanDirectoryForMatchingImages(handle, query);
      setMatchedImages(results);
      setHasScanned(true);
      if (results.length > 0) {
        setSelectedImageId(results[0].id);
      }
    } catch (err: any) {
      console.error("Error durante el escaneo:", err);
      setErrorMsg("No se pudo acceder a la carpeta. Es posible que los permisos hayan expirado.");
      setNeedsPermissionGrant(true);
    } finally {
      setIsScanning(false);
    }
  };

  // User clicks "Escanear carpeta Descargas" / requests folder access
  const handleConnectAndScan = async () => {
    setErrorMsg(null);
    setIsScanning(true);
    try {
      let handle = dirHandle;

      // If we have handle but need permission
      if (handle && needsPermissionGrant) {
        // @ts-ignore
        const req = await handle.requestPermission({ mode: "read" });
        if (req === "granted") {
          setNeedsPermissionGrant(false);
          await performScan(handle, searchTerm);
          return;
        }
      }

      // Pick folder directly starting in downloads
      handle = await requestDownloadsDirectoryPicker();
      if (handle) {
        setDirHandle(handle);
        setNeedsPermissionGrant(false);
        await performScan(handle, searchTerm);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Error al conectar carpeta:", err);
        setErrorMsg("No se pudo acceder a la carpeta de Descargas.");
      }
    } finally {
      setIsScanning(false);
    }
  };

  // Handle re-scanning with current search term
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dirHandle && !needsPermissionGrant) {
      performScan(dirHandle, searchTerm);
    } else {
      handleConnectAndScan();
    }
  };

  // Upload the chosen image
  const handleConfirmSelect = async (img: MatchedDownloadImage) => {
    setSelectedImageId(img.id);
    setIsUploading(true);
    try {
      await onSelectImageFile(img.file);
      onClose();
    } catch (err: any) {
      console.error("Error subiendo imagen seleccionada:", err);
      setErrorMsg("Hubo un error al subir la imagen seleccionada.");
    } finally {
      setIsUploading(false);
    }
  };

  // Fallback for browsers without File System Access API
  const handleFallbackFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const results = filterMatchingFiles(e.target.files, searchTerm);
      setMatchedImages(results);
      setHasScanned(true);
      if (results.length > 0) {
        setSelectedImageId(results[0].id);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-[#0c1322] border border-[#1e2e4a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* HEADER */}
        <div className="p-4 sm:px-6 border-b border-[#1e2e4a] bg-[#0f172a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-950/80 border border-sky-500/40 text-sky-400">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-base sm:text-lg text-foreground flex items-center gap-2">
                <span>Buscar en tu carpeta Descargas</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  Subir desde PC
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Busca automáticamente imágenes con el nombre del artículo para que elijas cuál subir.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* SEARCH & CONTROLS BAR */}
        <div className="p-4 sm:px-6 border-b border-[#1e2e4a] bg-[#09101d] space-y-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre o palabras clave de la imagen..."
                className="w-full h-10 pl-9 pr-8 bg-[#040811] border border-[#1e2e4a] rounded-xl text-foreground text-xs focus:outline-none focus:border-sky-400 transition-all font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isScanning}
              className="px-4 h-10 bg-sky-500 hover:bg-sky-400 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-sky-500/20 flex items-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {isScanning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>Buscar</span>
            </button>
          </form>

          {/* Quick status bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground/80">Artículo:</span>
              <span className="px-2 py-0.5 rounded-md bg-[#132034] text-sky-300 font-mono text-[11px] border border-[#233857]">
                {articleTitle || "Sin título"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleConnectAndScan}
                className="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
              >
                <FolderOpen className="h-3.5 w-3.5" />
                <span>{dirHandle ? "Cambiar carpeta vinculada" : "Vincular carpeta Descargas"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenManualFileInput();
                }}
                className="text-stone-400 hover:text-stone-200 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <FileImage className="h-3.5 w-3.5" />
                <span>Elegir otro archivo manualmente</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-[300px]">
          {/* STATE 1: SCANNING IN PROGRESS */}
          {isScanning && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <div className="relative">
                <Loader2 className="h-10 w-10 text-sky-400 animate-spin" />
                <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <p className="font-heading font-bold text-sm text-foreground">
                Escaneando tu carpeta Descargas...
              </p>
              <p className="text-xs text-muted-foreground max-w-sm">
                Buscando archivos de imagen que contengan &quot;{searchTerm}&quot; en el nombre.
              </p>
            </div>
          )}

          {/* STATE 2: NO DIRECTORY CONNECTED YET */}
          {!isScanning && !dirHandle && !hasScanned && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
              <div className="p-4 rounded-2xl bg-sky-950/50 border border-sky-500/30 text-sky-400">
                <FolderOpen className="h-10 w-10" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-foreground">
                  Conecta tu carpeta Descargas
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Permite que Dragopedia busque automáticamente en tu carpeta de Descargas todas las imágenes guardadas para &quot;{searchTerm}&quot;. Solo necesitas autorizarlo una vez.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full pt-2">
                <button
                  type="button"
                  onClick={handleConnectAndScan}
                  className="flex-1 px-4 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>Buscar en Descargas</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenManualFileInput();
                  }}
                  className="px-4 py-3 bg-[#132034] hover:bg-[#1a2c47] border border-[#233857] text-stone-200 font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileImage className="h-4 w-4" />
                  <span>Subir archivo individual</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE 3: PERMISSION NEEDS TO BE GRANTED AGAIN */}
          {!isScanning && dirHandle && needsPermissionGrant && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
              <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/30 text-amber-400">
                <FolderOpen className="h-10 w-10" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-foreground">
                  Permitir lectura de la carpeta Descargas
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Por seguridad, el navegador requiere que confirmes el permiso para leer la carpeta de Descargas y buscar las imágenes de &quot;{searchTerm}&quot;.
                </p>
              </div>

              <button
                type="button"
                onClick={handleConnectAndScan}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Autorizar y buscar imágenes</span>
              </button>
            </div>
          )}

          {/* STATE 4: SCAN COMPLETED WITH MATCHES FOUND */}
          {!isScanning && hasScanned && matchedImages.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    {matchedImages.length}
                  </span>
                  <span className="font-heading font-bold text-xs sm:text-sm text-foreground">
                    Imágenes coincidentes encontradas en Descargas:
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground hidden sm:inline">
                  Haz clic en una imagen para seleccionarla y subirla
                </span>
              </div>

              {/* GRID OF MATCHED IMAGES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {matchedImages.map((img) => {
                  const isSelected = selectedImageId === img.id;
                  const dateStr = new Date(img.lastModified).toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit"
                  });

                  return (
                    <div
                      key={img.id}
                      onClick={() => setSelectedImageId(img.id)}
                      className={`group relative rounded-xl border p-2.5 flex flex-col transition-all cursor-pointer ${
                        isSelected
                          ? "border-sky-400 bg-[#10233d] shadow-lg shadow-sky-500/10 ring-2 ring-sky-400/50"
                          : "border-[#1e2e4a] bg-[#080e1b] hover:border-sky-500/50 hover:bg-[#0c1626]"
                      }`}
                    >
                      {/* Image Preview Box */}
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/60 border border-border/30 flex items-center justify-center">
                        <img
                          src={img.previewUrl}
                          alt={img.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Score badge */}
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[9px] font-mono text-sky-300 border border-sky-500/40 font-bold">
                          {img.score === 100 ? "Coincidencia exacta" : `Relevancia: ${img.score}%`}
                        </div>

                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shadow-md">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Info & action */}
                      <div className="mt-2.5 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <p
                            className="font-medium text-xs text-foreground truncate group-hover:text-sky-300 transition-colors"
                            title={img.name}
                          >
                            {img.name}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-0.5">
                            <span>{formatBytes(img.size)}</span>
                            <span>{dateStr}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmSelect(img);
                          }}
                          disabled={isUploading}
                          className={`w-full py-2 rounded-lg font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                            isSelected
                              ? "bg-sky-500 hover:bg-sky-400 text-slate-950"
                              : "bg-[#132238] hover:bg-sky-500 text-sky-200 hover:text-slate-950 border border-[#233957]"
                          }`}
                        >
                          {isUploading && isSelected ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span>Subiendo a GitHub...</span>
                            </>
                          ) : (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>Elegir esta imagen</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STATE 5: SCAN COMPLETED BUT NO MATCHES FOUND */}
          {!isScanning && hasScanned && matchedImages.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-400">
                <FileImage className="h-10 w-10" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-foreground">
                  No se encontraron imágenes con ese nombre
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  No se encontraron archivos en Descargas que contengan &quot;<strong className="text-foreground">{searchTerm}</strong>&quot;.
                </p>
              </div>

              <div className="w-full space-y-2 pt-2">
                <p className="text-[11px] text-muted-foreground">
                  💡 Puedes probar buscando con otra palabra en la barra superior, o seleccionar cualquier archivo de tu ordenador:
                </p>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenManualFileInput();
                  }}
                  className="w-full py-3 bg-[#132034] hover:bg-[#1a2c47] border border-[#233857] text-sky-300 font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Elegir otro archivo manualmente desde PC</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3.5 sm:px-6 border-t border-[#1e2e4a] bg-[#09101d] flex items-center justify-between">
          <div className="text-[11px] text-muted-foreground">
            {matchedImages.length > 0
              ? `${matchedImages.length} resultado(s) encontrado(s)`
              : "Buscador de Descargas"}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              Cancelar
            </button>

            {matchedImages.length > 0 && selectedImageId && (
              <button
                type="button"
                onClick={() => {
                  const found = matchedImages.find((i) => i.id === selectedImageId);
                  if (found) handleConfirmSelect(found);
                }}
                disabled={isUploading}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-sky-500/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Subiendo a GitHub...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Subir imagen elegida</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hidden input for folder fallback */}
      <input
        ref={fallbackFolderInputRef}
        type="file"
        // @ts-ignore
        webkitdirectory="true"
        directory="true"
        multiple
        className="hidden"
        onChange={handleFallbackFolderUpload}
      />
    </div>
  );
}
