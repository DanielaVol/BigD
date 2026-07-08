import os
import re
import time
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from pydantic import BaseModel
from pypdf import PdfReader


app = FastAPI(title="JUNTOS Backend IA")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "null",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")
GEMINI_FALLBACK_MODEL = os.getenv("GEMINI_FALLBACK_MODEL", "gemini-2.5-flash-lite")

MATERIAL_ROOT = Path(
    os.getenv(
        "MATERIAL_ROOT",
        "/code/material_demo/distribuciones_discretas"
    )
)

CORPUS_FILES = [
    {
        "path": "instrucciones_tutor.md",
        "tipo": "instrucciones",
        "uso": "Reglas pedagógicas y uso de materiales",
    },
    {
        "path": "apuntes/apunteprobabilidad_discretas.pdf",
        "tipo": "teoria",
        "uso": "Teoría base de variables aleatorias discretas",
    },
    {
        "path": "apuntes/Esperanza VA discretas.pdf",
        "tipo": "teoria",
        "uso": "Esperanza y varianza de variables aleatorias discretas",
    },
    {
        "path": "apuntes/probabilidad_distribuciones.pdf",
        "tipo": "teoria",
        "uso": "Distribuciones discretas",
    },
    {
        "path": "ejercicios/TP1.pdf",
        "tipo": "obligatorios",
        "uso": "Ejercicios obligatorios del TP1",
    },
    {
        "path": "ejercicios/rtasP1.pdf",
        "tipo": "respuestas",
        "uso": "Respuestas para corrección y feedback",
    },
    {
        "path": "ejercicios/ejercicios_adicionales_variables_discretas.pdf",
        "tipo": "adicionales",
        "uso": "Ejercicios adicionales de refuerzo",
    },
    {
        "path": "ejercicios/ejercicios_examenes_variables_discretas.pdf",
        "tipo": "parciales",
        "uso": "Ejercicios de parciales para grupos de estudio y práctica integradora",
    },
]

corpus_chunks = []


class TutorRequest(BaseModel):
    studentName: Optional[str] = "Ana Torres"
    currentTopic: Optional[str] = "Distribuciones discretas de probabilidad"
    currentBlock: Optional[str] = "Teoría guiada"
    question: str

def extract_pdf_text(file_path: Path) -> str:
    reader = PdfReader(str(file_path))
    pages_text = []

    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""

        if text.strip():
            pages_text.append(f"\n[Página {page_number}]\n{text}")

    return "\n".join(pages_text)


def extract_text_file(file_path: Path) -> str:
    return file_path.read_text(encoding="utf-8")


def split_text_into_chunks(text: str, max_chars: int = 1800):
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

    chunks = []
    current = ""

    for paragraph in paragraphs:
        if len(current) + len(paragraph) > max_chars:
            if current.strip():
                chunks.append(current.strip())

            current = paragraph
        else:
            current += "\n\n" + paragraph

    if current.strip():
        chunks.append(current.strip())

    return chunks


def load_corpus():
    global corpus_chunks

    corpus_chunks = []

    for item in CORPUS_FILES:
        file_path = MATERIAL_ROOT / item["path"]

        if not file_path.exists():
            print(f"[WARN] No se encontró el archivo del corpus: {file_path}")
            continue

        print(f"[INFO] Cargando corpus: {file_path}")

        try:
            if file_path.suffix.lower() == ".pdf":
                text = extract_pdf_text(file_path)
            else:
                text = extract_text_file(file_path)

            chunks = split_text_into_chunks(text)

            for i, chunk in enumerate(chunks, start=1):
                corpus_chunks.append(
                    {
                        "archivo": file_path.name,
                        "tipo": item["tipo"],
                        "uso": item["uso"],
                        "chunk": i,
                        "texto": chunk,
                    }
                )

        except Exception as exc:
            print(f"[ERROR] No se pudo leer {file_path}: {exc}")

    print(f"[INFO] Fragmentos cargados en corpus: {len(corpus_chunks)}")


def normalize_words(text: str):
    return set(
        word.lower()
        for word in re.findall(r"[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9]+", text)
        if len(word) > 2
    )


def score_chunk(query_words, chunk):
    chunk_words = normalize_words(
        f"{chunk['archivo']} {chunk['tipo']} {chunk['uso']} {chunk['texto']}"
    )

    return len(query_words.intersection(chunk_words))


def select_relevant_context(req, max_chunks: int = 8) -> str:
    query_text = f"{req.currentTopic} {req.currentBlock} {req.question}"
    query_words = normalize_words(query_text)

    selected = []

    # Las instrucciones pedagógicas siempre entran.
    for chunk in corpus_chunks:
        if chunk["tipo"] == "instrucciones":
            selected.append((1000, chunk))

    question_lower = req.question.lower()
    block_lower = (req.currentBlock or "").lower()

    preferred_types = set()

    if any(word in question_lower for word in ["explic", "teoría", "tema", "concepto", "qué es"]):
        preferred_types.add("teoria")

    if any(word in question_lower for word in ["resolver", "ejercicio", "tp1", "obligatorio"]):
        preferred_types.add("obligatorios")

    if any(word in question_lower for word in ["correg", "respuesta", "resultado", "feedback"]):
        preferred_types.add("respuestas")
        preferred_types.add("obligatorios")

    if any(word in question_lower for word in ["más ejercicios", "refuerzo", "flojo", "dificultad", "adicional"]):
        preferred_types.add("adicionales")

    if any(word in question_lower for word in ["grupo", "parcial", "examen", "integrador"]):
        preferred_types.add("parciales")

    if "teoría" in block_lower:
        preferred_types.add("teoria")

    for chunk in corpus_chunks:
        base_score = score_chunk(query_words, chunk)

        if chunk["tipo"] in preferred_types:
            base_score += 20

        if base_score > 0:
            selected.append((base_score, chunk))

    selected = sorted(selected, key=lambda x: x[0], reverse=True)

    unique = []
    seen = set()

    for score, chunk in selected:
        key = (chunk["archivo"], chunk["chunk"])

        if key not in seen:
            unique.append(chunk)
            seen.add(key)

        if len(unique) >= max_chunks:
            break

    context_parts = []

    for chunk in unique:
        context_parts.append(
            f"""
[Archivo: {chunk['archivo']} | Tipo: {chunk['tipo']} | Uso: {chunk['uso']} | Fragmento: {chunk['chunk']}]

{chunk['texto']}
"""
        )

    return "\n\n".join(context_parts)

def build_prompt(req: TutorRequest, context: str) -> str:
    return f"""
Sos JUNTOS, un tutor educativo de la materia Probabilidad y Estadística.

Estás acompañando a {req.studentName}.

Tema actual:
{req.currentTopic}

Bloque actual:
{req.currentBlock}

Material relevante disponible:
{context}

Tu tarea:
- Usar los apuntes como fuente principal para explicar teoría.
- No limitarte a repetir el apunte.
- Explicar de manera pedagógica, clara y completa.
- Enseñar de forma interactiva: un tema por vez.
- No explicar toda la unidad junta.
- Hacer preguntas de comprensión al estudiante.
- Esperar la respuesta del estudiante antes de avanzar.
- Proponer ejercicios tipo simples durante la teoría guiada.
- No usar los ejercicios obligatorios del TP1 como primera práctica de teoría.
- Usar TP1 como ejercicios obligatorios solo en la sección de práctica.
- Usar rtasP1 para corregir o validar respuestas, no para mostrar la solución completa de entrada.
- Usar ejercicios adicionales si detectás dificultad.
- Usar ejercicios de exámenes o parciales para grupos de estudio o práctica integradora.
- Dar pistas progresivas antes de resolver todo.
- Detectar dificultades conceptuales.
- No des respuestas larguísimas.
- No uses Markdown excesivo.
- No uses blockquotes con >.
- No uses separadores tipo ---.
- Usá títulos simples y párrafos claros.
- Escribí en español claro.
- No digas que sos Gemini, ChatGPT ni un modelo de IA.

Pregunta del estudiante:
{req.question}
"""

@app.on_event("startup")
def startup_event():
    load_corpus()

@app.get("/api/health")
def health():
    return {
        "ok": True,
        "service": "JUNTOS Backend IA",
        "model": GEMINI_MODEL,
        "has_api_key": GEMINI_API_KEY is not None,
        "material_root": str(MATERIAL_ROOT),
        "corpus_chunks": len(corpus_chunks),
        "files_configured": [item["path"] for item in CORPUS_FILES],
    }
def generate_with_retry(client, prompt: str):
    models_to_try = []

    if GEMINI_MODEL:
        models_to_try.append(GEMINI_MODEL)

    if GEMINI_FALLBACK_MODEL and GEMINI_FALLBACK_MODEL not in models_to_try:
        models_to_try.append(GEMINI_FALLBACK_MODEL)

    last_error = None

    for model_name in models_to_try:
        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                )

                return response.text, model_name

            except Exception as exc:
                last_error = exc
                error_text = str(exc)

                is_temporary_error = (
                    "503" in error_text
                    or "UNAVAILABLE" in error_text
                    or "high demand" in error_text
                    or "temporarily" in error_text.lower()
                )

                print(
                    f"[WARN] Falló Gemini con modelo {model_name}, "
                    f"intento {attempt + 1}/3: {type(exc).__name__}: {exc}"
                )

                if not is_temporary_error:
                    break

                time.sleep(1.5 * (attempt + 1))

    raise last_error

def build_local_fallback_answer(req: TutorRequest) -> str:
    topic = (req.currentTopic or "variable aleatoria discreta").strip()

    return f"""
{{
  "message": "Estoy teniendo una demora temporal para consultar el servicio de IA, pero podemos seguir con la clase. Sigamos con el tema actual: {topic}. Si la respuesta anterior no quedó clara, podemos volver al ejemplo y revisarlo paso a paso.",
  "conceptStatus": "in_progress",
  "mode": "question",
  "currentTopic": "{topic}",
  "nextPrompt": "¿Querés que retomemos el último ejemplo o preferís que lo explique con otro caso más simple?",
  "completedTopic": false,
  "diagnosis": {{
    "difficultyDetected": true,
    "difficulty": "dificultad de conexión al responder",
    "evidence": "se activó el fallback local por fallo en API",
    "severity": "media",
    "status": "en proceso",
    "recommendation": "reintentar conexión en unos minutos"
  }},
  "recommendation": {{
    "type": "refuerzo",
    "text": "Intentar responder nuevamente la pregunta anterior."
  }}
}}
"""


@app.post("/api/tutor")
def tutor(req: TutorRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Falta GEMINI_API_KEY. Revisá backend/.env.",
        )

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)

        context = select_relevant_context(req)
        prompt = build_prompt(req, context)

        answer, model_used = generate_with_retry(client, prompt)

        return {
            "ok": True,
            "answer": answer,
            "chunks_loaded": len(corpus_chunks),
            "model_used": model_used,
        }

    except Exception as exc:
        print(f"[ERROR] Gemini falló definitivamente: {type(exc).__name__}: {exc}")

        fallback_answer = build_local_fallback_answer(req)

        return {
            "ok": True,
            "answer": fallback_answer,
            "chunks_loaded": len(corpus_chunks),
            "model_used": "local_fallback",
            "warning": "Gemini no respondió. Se usó fallback local para mantener la demo activa.",
        }