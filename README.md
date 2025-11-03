# ⛽ GasLow

GasLow es una aplicación web que permite **buscar gasolineras cercanas y comparar precios de combustible** en toda España.  
El usuario puede filtrar gasolineras por municipio o buscar las más cercanas dentro de un **radio de 1 a 20 km** desde su ubicación actual, mostrando los resultados **ordenados de menor a mayor precio**.

---

## 🚀 Características

- 🔎 Búsqueda por **municipio y tipo de combustible**
- 📍 Búsqueda por **radio geográfico (1 a 20 km)**
- 💰 Resultados **ordenados de menor a mayor precio**
- 🗺️ Visualización en mapa con **Leaflet**
- 📸 Enlace directo a **Google Maps** de cada gasolinera
- 🧠 Backend en **Node.js + Express + MongoDB**
- ⚛️ Frontend en **React**

---

## 🧩 Estructura del proyecto

GasLow/
├── GasLow/ → Frontend (React)
├── GasLowBack/ → Backend (Node.js / Express)
└── README.md


---

## ⚙️ Requisitos previos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [MongoDB](https://www.mongodb.com/try/download/community)
- Una cuenta de Google Cloud para obtener tu propia **API key de Google Maps**

---

## 🔧 Configuración del entorno

1. Clona este repositorio:

   ```bash
   git clone https://github.com/tu-usuario/gaslow.git
   cd gaslow
Instala las dependencias del frontend y del backend:

bash
Copiar código
cd GasLow
npm install
cd ../GasLowBack
npm install
Crea un archivo .env dentro de la carpeta GasLowBack/ con el siguiente contenido:

env
Copiar código
GOOGLE_MAPS_API_KEY="TU_API_KEY_DE_GOOGLE_MAPS"
MONGODB_URI="mongodb://localhost:27017/gasLow"
DB_NAME="gasLow"
⚠️ Nota:

Usa tu propia base de datos MongoDB (puede ser local o en MongoDB Atlas).

Sustituye "TU_API_KEY_DE_GOOGLE_MAPS" por tu clave personal de Google Cloud Platform.

🗄️ Inicialización de la base de datos
La primera vez que ejecutes el backend, se conectará automáticamente a la API oficial del Ministerio de Industria y cargará los datos actualizados de todas las gasolineras.
No es necesario importar nada manualmente.

▶️ Ejecución del proyecto
1. Inicia el backend
Desde la carpeta GasLowBack:

bash
Copiar código
npm start
El servidor se ejecutará por defecto en http://localhost:3000

2. Inicia el frontend
Desde la carpeta GasLow:

bash
Copiar código
npm run dev
La aplicación estará disponible en http://localhost:5173

🧭 Uso
Al abrir la app, puedes:

Introducir un municipio y tipo de combustible para ver las gasolineras ordenadas por precio.

O usar tu ubicación actual y definir un radio (1–20 km) para ver las más cercanas.

Cada gasolinera muestra:

Nombre y dirección

Precio del combustible seleccionado

Un botón que te lleva directamente a Google Maps

En la vista de mapa puedes:

Ver todas las gasolineras del resultado

Centrarte en una gasolinera específica

Ver tu ubicación y el radio de búsqueda

🧠 Tecnologías principales
Frontend:

React + Vite

Leaflet + React-Leaflet
 
Backend:

Node.js + Express

MongoDB 

node-cron (para actualizar los datos periódicamente)

  Licencia
Este proyecto se distribuye bajo la licencia MIT.
Puedes usarlo, modificarlo y distribuirlo libremente citando la fuente.

👨‍💻 Autor
Desarrollado por Alberto Collantes Sánchez
💬 Contacto: collantessanchezalberto@gmail.com

  Futuras actualizaciones e ideas se pueden ver en el notas.txt de la raíz del proyecto
