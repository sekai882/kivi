"use client";

import { useState, useRef, useCallback } from "react";
import { BackendStatus } from "@/components/BackendStatus";

type UploadStatus = "idle" | "loading" | "success" | "error";

const ACCEPTED_EXTENSIONS = [".pdf", ".txt", ".xlsx", ".csv"];
const MOCK_TENANT_ID = "00000000-0000-0000-0000-000000000000";

export default function KnowledgeBasePage() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setStatus("error");
      setMessage(`Extensión no permitida: ${ext}. Acepta: ${ACCEPTED_EXTENSIONS.join(", ")}`);
      return false;
    }
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setStatus("idle");
      setMessage("");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setStatus("loading");
    setMessage("Fragmentando documento y generando embeddings vectoriales en la nube...");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("tenant_id", MOCK_TENANT_ID);

      const res = await fetch("http://localhost:8000/api/v1/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setStatus("success");
        setMessage(data.message || "Documento procesado y vectorizado exitosamente.");
        setSelectedFile(null);
      } else {
        const errorData = await res.json().catch(() => null);
        setStatus("error");
        setMessage(errorData?.detail || `Error del servidor: ${res.status}`);
      }
    } catch (err) {
      setStatus("error");
      setMessage("No se pudo conectar con el backend. Verifica que el servidor esté activo.");
    }
  };

  const resetState = () => {
    setStatus("idle");
    setMessage("");
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            KIVI
          </span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { label: "Inicio", href: "/dashboard" },
            { label: "Bases de Conocimiento (PDFs)", href: "/dashboard/knowledge-base" },
            { label: "Historial de Chats", href: "/dashboard/conversations" },
            { label: "Configuración", href: "#" },
          ].map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                idx === 1
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
              JM
            </div>
            <div>
              <p className="text-sm font-medium">Josue Mullo</p>
              <p className="text-xs text-slate-500">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-slate-900/50 border-b border-slate-800 backdrop-blur-sm">
          <h1 className="text-lg font-semibold">Base de Conocimientos</h1>
          <BackendStatus />
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Page Header */}
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Base de Conocimientos Vectorial</h2>
              <p className="text-slate-400 mt-2">
                Sube archivos PDF, Excel o Texto para entrenar el contexto semántico de tu agente de IA.
              </p>
            </div>

            {/* Status Banners */}
            {status === "success" && (
              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-5 py-4 rounded-xl animate-in">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">{message}</span>
                </div>
                <button onClick={resetState} className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">Cerrar</button>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 text-red-300 px-5 py-4 rounded-xl">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">{message}</span>
                </div>
                <button onClick={resetState} className="text-red-400 hover:text-red-300 text-sm font-medium">Cerrar</button>
              </div>
            )}

            {/* Dropzone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                isDragging
                  ? "border-emerald-400 bg-emerald-500/5 shadow-lg shadow-emerald-500/10"
                  : status === "loading"
                  ? "border-slate-700 bg-slate-900/50 pointer-events-none"
                  : "border-slate-700 bg-slate-900/30 hover:border-emerald-500/50 hover:bg-slate-900/60"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_EXTENSIONS.join(",")}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />

              {status === "loading" ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin"></div>
                  </div>
                  <p className="text-emerald-400 font-medium">{message}</p>
                  <p className="text-slate-500 text-sm">Esto puede tomar unos segundos dependiendo del tamaño del documento...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  {/* Cloud Upload Icon */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                    isDragging ? "bg-emerald-500/20" : "bg-slate-800"
                  }`}>
                    <svg className={`w-8 h-8 transition-colors ${isDragging ? "text-emerald-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>

                  {selectedFile ? (
                    <>
                      <div className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 flex items-center space-x-3">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-slate-200 font-medium">{selectedFile.name}</span>
                        <span className="text-xs text-slate-500">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <p className="text-slate-500 text-sm">Haz clic en &quot;Procesar Documento&quot; para iniciar la vectorización.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-300 font-medium">
                        {isDragging ? "Suelta el archivo aquí" : "Arrastra y suelta un archivo aquí"}
                      </p>
                      <p className="text-slate-500 text-sm">
                        o haz clic para seleccionar un archivo desde tu equipo
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        {ACCEPTED_EXTENSIONS.map((ext) => (
                          <span key={ext} className="text-xs px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-400">
                            {ext}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Upload Button */}
            {selectedFile && status !== "loading" && (
              <div className="flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:brightness-110 transition-all duration-200"
                >
                  Procesar Documento
                </button>
              </div>
            )}

            {/* Info Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">¿Cómo funciona el pipeline de vectorización?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { step: "1", title: "Fragmentación", desc: "El documento se divide en chunks de texto optimizados para búsqueda semántica." },
                  { step: "2", title: "Vectorización", desc: "Cada fragmento se convierte en un embedding de 1536 dimensiones usando OpenAI." },
                  { step: "3", title: "Almacenamiento", desc: "Los vectores se persisten en Supabase con pgvector, indexados por negocio (tenant)." },
                ].map((item) => (
                  <div key={item.step} className="flex items-start space-x-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-emerald-400">{item.step}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
