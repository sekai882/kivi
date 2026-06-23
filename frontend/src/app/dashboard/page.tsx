import { BackendStatus } from "@/components/BackendStatus";

export default function DashboardPage() {
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
                idx === 0
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
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Total de Mensajes Procesados</h3>
                <p className="text-3xl font-bold text-slate-100">124,592</p>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-emerald-400 font-medium">+12.5%</span>
                  <span className="text-slate-500 ml-2">vs último mes</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Negocios Activos (Tenants)</h3>
                <p className="text-3xl font-bold text-slate-100">48</p>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-emerald-400 font-medium">+4 nuevos</span>
                  <span className="text-slate-500 ml-2">esta semana</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Tiempo de Respuesta Promedio</h3>
                <p className="text-3xl font-bold text-slate-100">850<span className="text-xl text-slate-500 ml-1">ms</span></p>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-emerald-400 font-medium">-50ms</span>
                  <span className="text-slate-500 ml-2">mejoría reciente</span>
                </div>
              </div>
            </div>

            {/* Placeholder Content */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-300">Actividad en Tiempo Real</h2>
              <p className="text-slate-500 mt-2 max-w-md text-center">Aquí se mostrarán las interacciones de WhatsApp en vivo y las respuestas generadas por la Inteligencia Artificial.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
