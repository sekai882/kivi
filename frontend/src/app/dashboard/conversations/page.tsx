import { BackendStatus } from "@/components/BackendStatus";

export default function ConversationsPage() {
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
                idx === 2
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
          <h1 className="text-lg font-semibold">Panel de Control</h1>
          <BackendStatus />
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6 flex flex-col h-full min-h-[600px]">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Historial de Interacciones IA</h2>
              <p className="text-slate-400 mt-2">Monitorea en tiempo real los mensajes recibidos por WhatsApp y las respuestas autónomas generadas por el motor RAG.</p>
            </div>

            <div className="flex-1 flex overflow-hidden bg-slate-900 border border-slate-800 rounded-xl shadow-lg">
              {/* Left Column: Chat List */}
              <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-900">
                <div className="p-4 border-b border-slate-800 bg-slate-900/80">
                  <h3 className="font-semibold text-slate-300">Chats Recientes</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {/* Chat Item 1 (Selected) */}
                  <div className="p-4 border-b border-slate-800 bg-slate-800/60 cursor-pointer border-l-2 border-l-emerald-500">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-200">+593 99 999 9999</span>
                      <span className="text-xs text-slate-500">10:45 AM</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="flex w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-xs text-emerald-400 font-medium">Activo - Atendido por IA</span>
                    </div>
                  </div>
                  {/* Chat Item 2 */}
                  <div className="p-4 border-b border-slate-800 hover:bg-slate-800/30 cursor-pointer transition-colors border-l-2 border-l-transparent">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-300">+593 98 765 4321</span>
                      <span className="text-xs text-slate-500">09:12 AM</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="flex w-2 h-2 rounded-full bg-slate-500"></span>
                      <span className="text-xs text-slate-400 font-medium">Cerrado</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Chat Bubbles */}
              <div className="flex-1 flex flex-col bg-slate-950/50">
                <div className="p-4 border-b border-slate-800 bg-slate-900">
                  <h3 className="font-semibold text-slate-200">+593 99 999 9999</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Client Message */}
                  <div className="flex justify-end">
                    <div className="bg-slate-700 text-slate-100 p-4 rounded-t-2xl rounded-bl-2xl max-w-[75%] shadow-sm">
                      <p className="text-sm">¿Hola, atienden los domingos y aceptan tarjeta de crédito?</p>
                      <span className="text-[10px] text-slate-400 mt-2 block text-right">10:45 AM</span>
                    </div>
                  </div>

                  {/* AI Message */}
                  <div className="flex justify-start">
                    <div className="bg-emerald-900/30 border border-emerald-500/20 text-slate-100 p-4 rounded-t-2xl rounded-br-2xl max-w-[75%] shadow-sm">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          RAG Context Loaded
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        ¡Hola! Sí, según la base de conocimientos del negocio, atendemos los domingos de 10:00 AM a 4:00 PM y aceptamos todas las tarjetas de crédito/débito.
                      </p>
                      <span className="text-[10px] text-emerald-500/60 mt-2 block">10:45 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
