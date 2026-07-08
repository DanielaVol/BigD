import os
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from pydantic import BaseModel


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
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")


class TutorRequest(BaseModel):
    studentName: Optional[str] = "Ana Torres"
    currentTopic: Optional[str] = "Distribuciones discretas de probabilidad"
    currentBlock: Optional[str] = "Teoría guiada"
    question: str


def build_prompt(req: TutorRequest) -> str:
    return f"""
Sos JUNTOS, un tutor educativo de la materia Probabilidad y Estadística.

Estás acompañando a {req.studentName}.

Tema actual:
{req.currentTopic}

Bloque actual:
{req.currentBlock}

Tu tarea:
- Explicar de forma clara y didáctica.
- Responder como tutor universitario.
- No digas que sos Gemini, ChatGPT ni un modelo de IA.
- No des respuestas larguísimas.
- Si el estudiante está confundido, explicá paso a paso.
- Cerrá con una mini pregunta para verificar comprensión cuando corresponda.

Pregunta del estudiante:
{req.question}
"""


@app.get("/api/health")
def health():
    return {
        "ok": True,
        "service": "JUNTOS Backend IA",
        "model": GEMINI_MODEL,
        "has_api_key": GEMINI_API_KEY is not None,
    }


@app.post("/api/tutor")
def tutor(req: TutorRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Falta GEMINI_API_KEY. Revisá backend/.env.",
        )

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)

        prompt = build_prompt(req)

        interaction = client.interactions.create(
            model=GEMINI_MODEL,
            input=prompt,
        )

        return {
            "ok": True,
            "answer": interaction.output_text,
        }

    except Exception as exc:
        print(f"[ERROR] Gemini falló: {exc}")

        raise HTTPException(
            status_code=500,
            detail="No se pudo obtener respuesta del tutor IA.",
        )