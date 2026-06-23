# KIVI Light

KIVI es una plataforma SaaS distribuida y multitenant diseñada para automatizar la atención al cliente a través de WhatsApp utilizando Inteligencia Artificial y arquitecturas basadas en RAG (Retrieval-Augmented Generation). 

Esta arquitectura monorrepo está dividida en dos componentes principales:
- **Backend:** Desarrollado con FastAPI (Python), enfocado en alta concurrencia, procesamiento asíncrono e integración con APIs externas (Meta, OpenAI, Supabase).
- **Frontend:** Construido con Next.js 14 y Tailwind CSS, ofreciendo un panel de control corporativo moderno para la gestión de negocios y monitoreo de la IA.

## Prerrequisitos

Antes de iniciar, asegúrate de tener instaladas las siguientes herramientas en tu entorno de desarrollo:

- [Python 3.12+](https://www.python.org/downloads/)
- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (para la infraestructura de soporte)
- [Git](https://git-scm.com/)

---

## Instrucciones de Configuración Local

Sigue los pasos a continuación para levantar el proyecto KIVI completo en tu entorno de desarrollo local.

### 1. Clonar el repositorio

```bash
git clone https://github.com/sekai882/kivi.git
cd kivi
```

### 2. Levantar la infraestructura compartida

Inicia los contenedores base (como Redis para caché y colas) utilizando Docker Compose:

```bash
docker-compose up -d
```

### 3. Configuración del Backend (FastAPI)

Navega a la carpeta del backend y configura el entorno de Python:

```bash
cd backend

# Crear entorno virtual
python -m venv .venv

# Activar el entorno virtual
# En Windows:
.venv\Scripts\activate
# En Linux/macOS:
source .venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

Antes de ejecutar el servidor, asegúrate de configurar las variables de entorno (ver la tabla más abajo). Luego, inicializa el servidor en el puerto `8000`:

```bash
uvicorn src.main:app --reload --port 8000
```

El servidor estará disponible en `http://localhost:8000`.

### 4. Configuración del Frontend (Next.js)

Abre una nueva terminal, navega a la carpeta del frontend y ejecuta los siguientes comandos:

```bash
cd frontend

# Instalar los paquetes y dependencias de Node
npm install

# Iniciar el entorno de desarrollo
npm run dev
```

El panel de control estará disponible en `http://localhost:3000`.

---

## Configuración de Variables de Entorno

En el directorio `backend/`, copia el archivo de ejemplo y crea tu propio `.env`:

```bash
cp .env.example .env
```

Configura las variables dentro de `.env` de acuerdo a la siguiente tabla:

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | String de conexión a Supabase (Pooler/Transaccional) para manejar conexiones escalables. |
| `DIRECT_URL` | String de conexión directa a Supabase (usada para migraciones de BD). |
| `META_VERIFY_TOKEN` | Token secreto utilizado para que Meta verifique tu endpoint de Webhook. |
| `META_APP_SECRET` | Secreto de la aplicación en Meta, usado para validar la firma (`X-Hub-Signature-256`) de los payloads. |
| `OPENAI_API_KEY` | Clave de acceso a la API de OpenAI (requerida para los modelos `text-embedding-3-small` y `gpt-4o-mini`). |

Una vez configurado todo esto, KIVI estará completamente operativo y listo para recibir webhooks de WhatsApp, procesar documentos vectoriales en Supabase y desplegar respuestas inteligentes a los usuarios. ¡Happy coding!
