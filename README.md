# JUNTOS

JUNTOS es un prototipo de plataforma educativa con IA para acompañamiento personalizado en materias universitarias iniciales.

El sistema está pensado para dos perfiles:

- **Estudiante**: recibe teoría guiada, ayuda en ejercicios, diagnóstico personalizado, recomendaciones de práctica y sugerencias de grupos de estudio.
- **Docente**: visualiza alertas tempranas, dificultades frecuentes, seguimiento de estudiantes, grupos sugeridos y asistencia para planificar la semana.

La demo está enfocada en la materia **Probabilidad y Estadística**, especialmente en la unidad **Variables aleatorias discretas**.

---

## 1. Funcionalidades principales

### Vista estudiante

La vista estudiante permite:

- ver el resumen de la semana;
- acceder al material de la materia;
- recorrer teoría guiada con IA;
- resolver ejercicios obligatorios;
- subir una resolución escrita de un ejercicio;
- consultar dudas al tutor IA;
- recibir pistas sin obtener la respuesta directa;
- ver diagnóstico personalizado;
- recibir ejercicios adicionales recomendados;
- sumarse a grupos de estudio.

### Vista docente

La vista docente permite:

- ver un dashboard de avance de la comisión;
- detectar estudiantes en riesgo;
- ver dificultades frecuentes;
- consultar ejercicios problemáticos;
- recibir recomendaciones de JUNTOS para la próxima clase;
- configurar una semana con objetivos, materiales y directivas pedagógicas;
- revisar estudiantes individualmente;
- ver grupos de estudio sugeridos;
- consultar a JUNTOS sobre decisiones docentes.

---

## 2. Tecnologías utilizadas

### Frontend

- HTML
- CSS
- JavaScript
- Nginx como servidor estático dentro de Docker

### Backend

- Python 3.12
- FastAPI
- Uvicorn
- Google GenAI
- Pydantic
- pypdf

### Infraestructura

- Docker
- Docker Compose

---

## 3. Estructura del proyecto

```text
BigD/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env
│   └── app/
│       ├── __init__.py
│       └── main.py
├── frontend/
│   ├── index.html
│   ├── estudiante.html
│   ├── docente.html
│   ├── styles.css
│   ├── script.js
│   ├── app-layout.js
│   ├── student-demo.js
│   └── teacher-demo.js
└── material_demo/
    └── distribuciones_discretas/
        ├── instrucciones_tutor.md
        ├── apuntes/
        │   ├── apunteprobabilidad_discretas.pdf
        │   ├── Esperanza VA discretas.pdf
        │   └── probabilidad_distribuciones.pdf
        └── ejercicios/
            ├── TP1.pdf
            ├── rtasP1.pdf
            ├── ejercicios_adicionales_variables_discretas.pdf
            └── ejercicios_examenes_variables_discretas.pdf
```

---

## 4. Requisitos previos

Antes de correr el proyecto, instalar:

- Git
- Docker
- Docker Compose

En Windows se recomienda instalar **Docker Desktop**.

Para verificar que Docker está instalado:

```bash
docker --version
docker compose version
```

---

## 5. Clonar el repositorio

```bash
git clone https://github.com/DanielaVol/BigD.git
cd BigD
```

---

## 6. Configurar variables de entorno

El backend necesita una clave de API para usar Gemini.

Crear el archivo:

```text
backend/.env
```

Con este contenido:

```env
GEMINI_API_KEY=TU_API_KEY_DE_GEMINI
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_FALLBACK_MODEL=gemini-2.5-flash
```

Reemplazar:

```text
TU_API_KEY_DE_GEMINI
```

por una clave válida.

Importante: no subir el archivo `.env` al repositorio.

Si no se cuenta con una API key válida, la interfaz puede cargarse igual, pero las funciones que llaman al tutor IA del backend no van a responder correctamente.

---

## 7. Ejecutar el proyecto con Docker

Desde la raíz del proyecto:

```bash
docker compose up --build
```

Esto levanta dos servicios:

- `juntos-backend`
- `juntos-frontend`

El frontend queda disponible en:

```text
http://localhost:8080
```

El backend queda disponible en:

```text
http://localhost:8001
```

---

## 8. Acceder a la aplicación

Abrir en el navegador:

```text
http://localhost:8080
```

No abrir los archivos directamente con `file:///`, porque la demo necesita ejecutarse desde el servidor web de Docker.

---

## 9. Usuarios de demo

La demo tiene dos usuarios precargados.

### Estudiante

```text
ana.torres@fiuba.edu.ar
```

Este usuario redirige a:

```text
estudiante.html
```

### Docente

```text
mariana.lopez@fiuba.edu.ar
```

Este usuario redirige a:

```text
docente.html
```

No hace falta contraseña para la demo. El login valida solo el email.

---

## 10. Verificar que el backend funciona

Con los contenedores levantados, abrir:

```text
http://localhost:8001/api/health
```

La respuesta debería mostrar información del servicio, por ejemplo:

```json
{
  "ok": true,
  "service": "JUNTOS Backend IA",
  "model": "...",
  "has_api_key": true,
  "material_root": "...",
  "corpus_chunks": 43
}
```

Si `has_api_key` aparece en `false`, revisar el archivo:

```text
backend/.env
```

---

## 11. Material utilizado por la IA

El backend carga material desde:

```text
material_demo/distribuciones_discretas/
```

Ese material se usa para construir el contexto del tutor IA.

La carpeta incluye:

```text
instrucciones_tutor.md
apuntes/
ejercicios/
```

El backend lee archivos PDF y Markdown, extrae texto y lo divide en fragmentos para responder preguntas de los estudiantes.

---

## 12. Endpoints principales del backend

### Health check

```http
GET /api/health
```

Sirve para verificar que el backend esté activo y que haya cargado el material.

---

### Tutor IA

```http
POST /api/tutor
```

Recibe una consulta del estudiante y devuelve una respuesta generada con IA.

Ejemplo de body:

```json
{
  "studentName": "Ana Torres",
  "currentTopic": "Variable aleatoria discreta",
  "currentBlock": "Teoría guiada",
  "question": "No entiendo qué valores puede tomar X."
}
```

---

## 13. Detener el proyecto

Para detener los contenedores:

```bash
docker compose down
```

Para reconstruir desde cero:

```bash
docker compose down
docker compose up --build --force-recreate
```

---

## 14. Limpiar historial local de la demo

La demo guarda estado en `localStorage`, por ejemplo:

- usuario logueado;
- semana seleccionada;
- avance de teoría;
- diagnóstico;
- chats de ejercicios;
- estado de ejercicios;
- grupo de estudio.

Para borrar todo el historial desde la consola del navegador:

```javascript
localStorage.clear();
location.reload();
```

Para borrar solo datos de ejercicios:

```javascript
Object.keys(localStorage)
  .filter(k => k.startsWith("juntos_exercise_chat_"))
  .forEach(k => localStorage.removeItem(k));

location.reload();
```

---

## 15. Problemas frecuentes

### El frontend no carga

Verificar que Docker esté corriendo y que el contenedor frontend esté activo:

```bash
docker ps
```

Luego entrar a:

```text
http://localhost:8080
```

---

### El backend no responde

Verificar logs:

```bash
docker compose logs backend
```

También revisar:

```text
http://localhost:8001/api/health
```

---

### Aparece error por falta de API key

Revisar que exista:

```text
backend/.env
```

y que tenga:

```env
GEMINI_API_KEY=...
```

Luego reiniciar:

```bash
docker compose down
docker compose up --build
```

---

### El navegador muestra una versión vieja

Forzar recarga:

```text
Ctrl + F5
```

o:

```text
Ctrl + Shift + R
```

También se puede borrar el estado local desde la consola:

```javascript
localStorage.clear();
location.reload();
```

---

### Cambié archivos pero no veo cambios

Reiniciar los contenedores:

```bash
docker compose down
docker compose up --build --force-recreate
```

---

### El tutor IA responde con error o no responde

Revisar:

1. Que el backend esté activo:

```text
http://localhost:8001/api/health
```

2. Que `backend/.env` tenga una API key válida:

```env
GEMINI_API_KEY=...
```

3. Que el contenedor backend haya cargado los archivos del material:

```bash
docker compose logs backend
```

En los logs debería aparecer la carga de archivos desde:

```text
material_demo/distribuciones_discretas/
```

---

## 16. Estado del prototipo

Este proyecto es una demo funcional, no un sistema productivo completo.

Algunas partes están simuladas para mostrar el flujo del producto:

- usuarios precargados;
- datos del dashboard docente;
- grupos sugeridos;
- seguimiento docente;
- carga visual de algunos materiales;
- respuestas simuladas en ciertas secciones docentes.

La parte de tutor IA del estudiante sí se conecta al backend y utiliza el material cargado en `material_demo`.

---

## 17. Próximas mejoras posibles

- Procesar resoluciones escritas con OCR o visión.
- Agregar administración de cursos, comisiones y semanas.
- Desplegar en un servidor cloud.

---

## 18. Resumen conceptual

JUNTOS busca mostrar cómo la IA puede acompañar la cursada desde dos lados.

Para el estudiante:

```text
explica → pregunta → diagnostica → recomienda → acompaña
```

Para el docente:

```text
resume → detecta patrones → alerta → recomienda intervenciones → ayuda a planificar
```

La idea central es que la IA no reemplace al docente, sino que ayude a escalar el acompañamiento personalizado en cursos numerosos.

---

## 19. Instalación rápida

Resumen de comandos:

```bash
git clone https://github.com/DanielaVol/BigD.git
cd BigD
```

Crear `backend/.env`:

```env
GEMINI_API_KEY=TU_API_KEY_DE_GEMINI
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_FALLBACK_MODEL=gemini-2.5-flash
```

Levantar el proyecto:

```bash
docker compose up --build
```

Abrir:

```text
http://localhost:8080
```

Ingresar como estudiante:

```text
ana.torres@fiuba.edu.ar
```

o como docente:

```text
mariana.lopez@fiuba.edu.ar
```