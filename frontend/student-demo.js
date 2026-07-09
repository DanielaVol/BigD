// State variables for the demo
let error_estandar_dificultad = false;

const TUTOR_API_URL = "http://localhost:8001/api/tutor";

const REQUIRED_EXERCISES = [
    {
      id: "tp1-2-2",
      title: "Ejercicio 2.2",
      topic: "Función de distribución discreta",
      difficulty: "Baja",
      status: "Pendiente",
      statement: "Sea X una variable aleatoria con función de probabilidad P(X=x) = kx para x = 1, 2, 3, 4. Calcular el valor de k y la función de distribución.",
      hint: "Primero identificá qué valores puede tomar la variable. Acordate que la suma de las probabilidades debe ser 1."
    },
    {
      id: "tp1-2-3",
      title: "Ejercicio 2.3",
      topic: "Función de probabilidad / extracciones",
      difficulty: "Media",
      status: "Pendiente",
      statement: "De una urna con 5 bolas rojas y 3 azules se extraen 2 bolas. Sea X = cantidad de bolas rojas extraídas. Hallar la función de probabilidad de X.",
      hint: "Pensá si las extracciones son con o sin reposición. ¿Qué valores puede tomar X?"
    },
    {
      id: "tp1-2-4",
      title: "Ejercicio 2.4",
      topic: "Geométrica / Pascal",
      difficulty: "Media",
      status: "Pendiente",
      statement: "Un tirador tiene probabilidad 0.8 de dar en el blanco. ¿Cuál es la probabilidad de que necesite exactamente 3 tiros para acertar 2 veces?",
      hint: "Esta es una distribución de Pascal (o binomial negativa). ¿Cuáles son los parámetros?"
    }
];

const RECOMMENDED_EXERCISE = {
    id: "rec-valores-posibles",
    title: "Ejercicio recomendado",
    topic: "Variable aleatoria discreta",
    difficulty: "Baja",
    status: "Recomendado",
    statement: "Se lanza una moneda dos veces. Sea X = cantidad de caras obtenidas.\n1. ¿Qué valores puede tomar X?\n2. ¿Por qué X es discreta?",
    hint: "Listá todos los resultados posibles: CC, CS, SC y SS. Después contá cuántas caras hay en cada caso."
};

// Expose a global rendering function to hook into app-layout.js
window.renderDemoSection = function(target, sectionName, mainContentArea, mainTitle, mainDesc) {
    if (!mainContentArea || !mainTitle || !mainDesc) return false;

    // We only override specific sections, others can fallback to default placeholder
    if (['inicio', 'material', 'guia', 'diagnostico', 'grupos', 'consultas'].includes(target)) {
        renderSectionContent(target, sectionName, mainContentArea, mainTitle, mainDesc);
        return true;
    }
    return false;
};

function renderSectionContent(target, sectionName, mainContentArea, mainTitle, mainDesc) {
    // Clear and set basic title/desc
    mainTitle.textContent = sectionName;
    mainDesc.textContent = '';

    switch (target) {
        case 'inicio':
            renderInicio(mainContentArea, mainTitle, mainDesc);
            break;
        case 'material':
            renderTeoriaGuiada(mainContentArea, mainTitle, mainDesc);
            break;
        case 'guia':
            renderGuiaEjercicios(mainContentArea, mainTitle, mainDesc);
            break;
        case 'diagnostico':
            renderDiagnostico(mainContentArea, mainTitle, mainDesc);
            break;
        case 'grupos':
            renderGrupos(mainContentArea, mainTitle, mainDesc);
            break;
    }
}

// Function to trigger sidebar clicks programmatically
function clickSidebarMenu(targetName) {
    const items = document.querySelectorAll('.sidebar-menu li');
    items.forEach(item => {
        if (item.dataset.target === targetName) {
            item.click();
        }
    });
}

function renderInicio(mainContentArea, mainTitle, mainDesc) {
    mainTitle.textContent = "Panel de práctica";
    mainDesc.innerHTML = `Hola, Ana Torres. Esta semana vamos a trabajar Intervalos de confianza.<br><br>Antes de resolver la guía, JUNTOS te propone repasar los conceptos clave con explicaciones breves, ejemplos y preguntas de comprensión.`;

    mainContentArea.innerHTML = `
        <div class="cards-grid">
            <div class="stat-card">
                <div class="stat-card-title">Semana actual</div>
                <div class="stat-card-value">Semana 4</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-title">Tema actual</div>
                <div class="stat-card-value" style="font-size: 1.2rem;">Intervalos de confianza</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-title">Estado de teoría</div>
                <div class="stat-card-value">En progreso</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-title">Ejercicios recomendados</div>
                <div class="stat-card-value">8</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-title">Dificultad detectada</div>
                <div class="stat-card-value" style="font-size: 1.1rem; color: #e74c3c;">Error estándar</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-title">Grupo sugerido</div>
                <div class="stat-card-value" style="font-size: 1.2rem;">jueves 18:00</div>
            </div>
        </div>
        <div style="margin-top: 30px;">
            <button id="btn-comenzar-teoria" class="demo-btn primary">Comenzar teoría guiada</button>
        </div>
    `;



    document.getElementById('btn-comenzar-teoria').addEventListener('click', () => {
        clickSidebarMenu('material');
    });
}

const THEORY_TOPICS = [
    "variable aleatoria discreta",
    "función de probabilidad",
    "función de distribución discreta",
    "esperanza",
    "varianza",
    "Bernoulli",
    "Binomial",
    "Geométrica",
    "Pascal",
    "Hipergeométrica",
    "Poisson",
    "Multinomial",
    "variables discretas conjuntas",
    "distribuciones condicionales discretas",
    "procesos de Poisson básicos"
];

function getInitialTheoryState() {
    return {
        currentTopicIndex: 0,
        currentTopic: THEORY_TOPICS[0],
        completedTopics: [],
        weakTopics: [],
        understoodTopics: [],
        detectedDifficulties: [],
        recommendations: [],
        conversation: [],
        lastInteraction: "",
        lastDiagnosisUpdate: null,
        mode: "intro"
    };
}

function loadTheoryState() {
    const saved = localStorage.getItem('juntos_theory_state');

    let state = saved ? JSON.parse(saved) : getInitialTheoryState();

    if (!state.completedTopics) state.completedTopics = [];
    if (!state.weakTopics) state.weakTopics = [];
    if (!state.understoodTopics) state.understoodTopics = [];
    if (!state.detectedDifficulties) state.detectedDifficulties = [];
    if (!state.recommendations) state.recommendations = [];
    if (!state.conversation) state.conversation = [];
    if (!state.currentTopic) state.currentTopic = THEORY_TOPICS[state.currentTopicIndex || 0];
    if (!state.mode) state.mode = "intro";
    if (!state.lastDiagnosisUpdate) state.lastDiagnosisUpdate = null;

    return state;
}

function saveTheoryState(state) {
    localStorage.setItem('juntos_theory_state', JSON.stringify(state));
}

function upsertDetectedDifficulty(state, diagnosis, topic) {
    if (!diagnosis || !diagnosis.difficultyDetected) return;

    const difficulty = {
        topic: topic,
        difficulty: diagnosis.difficulty || "dificultad no especificada",
        evidence: diagnosis.evidence || "",
        severity: diagnosis.severity || "media",
        status: diagnosis.status || "en proceso",
        recommendation: diagnosis.recommendation || "",
        updatedAt: new Date().toISOString()
    };

    const existingIndex = state.detectedDifficulties.findIndex(d =>
        d.topic === difficulty.topic && d.difficulty === difficulty.difficulty
    );

    if (existingIndex >= 0) {
        state.detectedDifficulties[existingIndex] = {
            ...state.detectedDifficulties[existingIndex],
            ...difficulty
        };
    } else {
        state.detectedDifficulties.push(difficulty);
    }

    if (!state.weakTopics.includes(topic)) {
        state.weakTopics.push(topic);
    }

    state.lastDiagnosisUpdate = {
        topic: difficulty.topic,
        difficulty: difficulty.difficulty,
        severity: difficulty.severity,
        updatedAt: difficulty.updatedAt
    };
}

function addRecommendation(state, recommendation, topic) {
    if (!recommendation || !recommendation.text) return;

    const item = {
        topic: topic,
        type: recommendation.type || "refuerzo",
        text: recommendation.text,
        updatedAt: new Date().toISOString()
    };

    const exists = state.recommendations.some(r =>
        r.topic === item.topic && r.text === item.text
    );

    if (!exists) {
        state.recommendations.push(item);
    }
}

function renderTeoriaGuiada(mainContentArea, mainTitle, mainDesc) {
    mainTitle.textContent = "Teoría guiada: Variables aleatorias discretas";
    mainDesc.textContent = "Unidad 2 - Explicación paso a paso con JUNTOS";

    mainContentArea.innerHTML = `
        <div class="interactive-theory-container">
            <div class="theory-progress-container">
                <span class="section-kicker">Progreso de la semana</span>
                <div class="theory-progress" id="theory-progress-chips">
                    <!-- Chips will be generated here -->
                </div>
            </div>

            <div class="lesson-flow" id="lesson-flow-container">
                <!-- Conversation flow will be generated here -->
            </div>

            <div class="lesson-input-panel">
                <textarea id="lesson-textarea" class="lesson-textarea" rows="2" placeholder="Escribí tu respuesta o duda acá..."></textarea>
                <button id="btn-lesson-send" class="demo-btn primary">Enviar</button>
            </div>

            <div class="lesson-actions" id="lesson-actions-container">
                <!-- Contextual action buttons will go here -->
            </div>
        </div>
    `;

    renderTheoryState();
}

function renderTheoryState() {
    const state = loadTheoryState();
    const progressContainer = document.getElementById("theory-progress-chips");
    const flowContainer = document.getElementById("lesson-flow-container");
    const actionsContainer = document.getElementById("lesson-actions-container");

    if (!progressContainer || !flowContainer || !actionsContainer) return;

    // Render Progress Chips
    progressContainer.innerHTML = THEORY_TOPICS.map((topic, index) => {
        let chipClass = "topic-chip";
        if (state.currentTopicIndex === index) chipClass += " active";
        if (state.completedTopics.includes(topic)) chipClass += " completed";
        if (state.weakTopics.includes(topic)) chipClass += " weak";

        return `<span class="${chipClass}">[${index + 1} ${topic}]</span>`;
    }).join("");

    // Render Conversation
    flowContainer.innerHTML = "";
    if (state.conversation.length === 0) {
        // First time initialization
        const initialTopicsList = THEORY_TOPICS
            .map((t, i) => `${i + 1}. ${t}`)
            .join("\n");

        const initialMessage = `Hola Ana. Esta semana vamos a trabajar estos temas:

        ${initialTopicsList}

        ¿Querés que empecemos?`;
                state.conversation.push({ sender: "JUNTOS", text: initialMessage });
                saveTheoryState(state);
    }

    state.conversation.forEach(msg => {
        if (msg.sender === "DIAGNOSTICO") {
            const diagnosisHtml = `
            <div class="diagnosis-inline-card">
              <div class="diagnosis-label">Diagnóstico actualizado</div>
              <div><strong>Tema:</strong> ${msg.topic || state.currentTopic}</div>
              <div><strong>Dificultad detectada:</strong> ${msg.diagnosis ? msg.diagnosis.difficulty : 'Dificultad no especificada'}</div>
              <div><strong>Recomendación:</strong> ${msg.diagnosis ? msg.diagnosis.recommendation : 'No hay recomendación'}</div>
            </div>
            `;
            flowContainer.insertAdjacentHTML("beforeend", diagnosisHtml);
        } else {
            const msgClass = msg.sender === "JUNTOS" ? "bot" : "user";
            const msgHtml = `<div class="lesson-message ${msgClass}">
                <strong>${msg.sender}:</strong>
                <div class="lesson-message-content">${formatTutorText(msg.text)}</div>
            </div>`;
            flowContainer.insertAdjacentHTML("beforeend", msgHtml);
        }
    });

    // Scroll to bottom
    flowContainer.scrollTop = flowContainer.scrollHeight;

    // Render Actions based on state mode
    actionsContainer.innerHTML = "";
    let actions = [];
    if (state.mode === "intro") {
        actions = [
            { text: "Empezar", onClick: () => sendInteractiveTheoryMessage("Sí, quiero empezar.") },
            { text: "Repasar anterior", onClick: () => sendInteractiveTheoryMessage("Quiero repasar la semana pasada.") },
            { text: "Elegir otro tema", onClick: () => sendInteractiveTheoryMessage("Quiero empezar por otro tema.") }
        ];
    } else {
        actions = [
            { text: "Hacer ejercicio juntos", onClick: () => sendInteractiveTheoryMessage("Quiero hacer un ejercicio juntos sobre este tema.") },
            { text: "Explicamelo de otra forma", onClick: () => sendInteractiveTheoryMessage("No lo entendí, explicamelo de otra forma.") },
            { text: "Avanzar", onClick: () => sendInteractiveTheoryMessage("Quiero avanzar al siguiente tema.") }
        ];
    }

    actions.forEach(action => {
        const btn = document.createElement("button");
        btn.className = "demo-btn small-btn";
        btn.textContent = action.text;
        btn.addEventListener("click", action.onClick);
        actionsContainer.appendChild(btn);
    });

    // Setup send button
    const sendBtn = document.getElementById("btn-lesson-send");
    const textarea = document.getElementById("lesson-textarea");

    // Remove old listeners to avoid duplicates if re-rendered
    const newSendBtn = sendBtn.cloneNode(true);
    sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);

    newSendBtn.addEventListener("click", () => {
        const text = textarea.value.trim();
        if (text) {
            textarea.value = "";
            sendInteractiveTheoryMessage(text);
        }
    });
}

async function sendInteractiveTheoryMessage(userText) {
    const state = loadTheoryState();

    // Add user message to conversation
    state.conversation.push({ sender: "Ana", text: userText });
    state.lastInteraction = userText;
    saveTheoryState(state);

    // Optimistic render
    renderTheoryState();

    const flowContainer = document.getElementById("lesson-flow-container");
    if (flowContainer) {
        flowContainer.insertAdjacentHTML("beforeend", `<div class="lesson-message bot loading-msg"><strong>JUNTOS:</strong><br><em>Escribiendo...</em></div>`);
        flowContainer.scrollTop = flowContainer.scrollHeight;
    }

    try {
       const lastBotMessage = [...state.conversation]
            .reverse()
            .find(msg => msg.sender === "JUNTOS")?.text || "";

        const recentConversation = state.conversation
            .slice(-8)
            .map(msg => `${msg.sender}: ${msg.text}`)
            .join("\n\n");

        const systemPrompt = `
        Sos JUNTOS, un tutor educativo que guía a Ana paso a paso en la unidad Variables aleatorias discretas.

        No estás empezando una conversación nueva. Tenés que continuar desde el intercambio anterior.

        Estado actual de la lección:
        - Tema actual: ${state.currentTopic}
        - Modo actual: ${state.mode}
        - Temas entendidos: ${state.understoodTopics.join(", ") || "ninguno"}
        - Temas flojos: ${state.weakTopics.join(", ") || "ninguno"}
        - Temas completados: ${state.completedTopics.join(", ") || "ninguno"}

        Último mensaje de JUNTOS:
        ${lastBotMessage}

        Conversación reciente:
        ${recentConversation}

        Respuesta actual de Ana:
        ${userText}

        Reglas de comportamiento:
        1. Además de responderle a Ana, analizá si su respuesta muestra comprensión, confusión o dificultad.
        2. No marques dificultad ante cualquier error mínimo. Solo si hay una confusión conceptual o una respuesta incompleta relevante.
        3. Si Ana responde parcialmente bien, marcá conceptStatus como "in_progress".
        4. Si Ana entiende el concepto, marcá conceptStatus como "understood".
        5. Si Ana muestra confusión repetida o importante, marcá conceptStatus como "weak".
        6. Si detectás dificultad, completá diagnosis.difficultyDetected = true.
        7. Si no detectás dificultad, devolvé diagnosis.difficultyDetected = false.
        8. La dificultad debe ser concreta, por ejemplo:
           - "no identifica todos los valores posibles";
           - "confunde variable aleatoria con resultado del experimento";
           - "confunde variable discreta con continua";
           - "omite el valor 0 en variables de conteo";
           - "no distingue función de probabilidad y función de distribución";
           - "confunde Binomial con Poisson";
           - "no identifica parámetros n y p";
           - "no interpreta esperanza como promedio teórico".
        9. No vuelvas a empezar la explicación desde cero si Ana solo respondió una pregunta. Continuá desde la última pregunta de JUNTOS.
        10. No saludes con "Hola Ana" en cada respuesta. Solo saludá al inicio de la clase.
        11. No uses HTML. No escribas <br>, <strong>, <em> ni etiquetas.
        12. No uses Markdown excesivo.
        13. Usá texto claro, párrafos cortos y alguna lista breve si ayuda.
        14. Hacé una sola pregunta al final.
        15. No avances al siguiente tema hasta que el tema actual esté razonablemente entendido.
        16. No uses ejercicios obligatorios del TP1 en teoría guiada; usá ejercicios tipo simples.

        Devolvé SOLO un JSON válido, sin texto antes ni después, con esta estructura:

        {
          "message": "Respuesta pedagógica para Ana, sin HTML",
          "conceptStatus": "understood" | "weak" | "in_progress",
          "mode": "intro" | "explanation" | "question" | "guided_exercise" | "ready_next",
          "currentTopic": "${state.currentTopic}",
          "nextPrompt": "Una sola pregunta o propuesta concreta para Ana",
          "completedTopic": true | false,
          "diagnosis": {
            "difficultyDetected": true,
            "difficulty": "no identifica todos los valores posibles",
            "evidence": "respondió 1 y 2 cuando también era posible 0",
            "severity": "baja" | "media" | "alta",
            "status": "en proceso",
            "recommendation": "hacer un ejercicio tipo más sobre valores posibles"
          },
          "recommendation": {
            "type": "refuerzo" | "practica" | "avance",
            "text": "Resolver ejercicios tipo sobre valores posibles antes de avanzar al TP1"
          }
        }
        `;

        const response = await fetch(TUTOR_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                studentName: "Ana Torres",
                currentTopic: state.currentTopic,
                currentBlock: "Teoría guiada interactiva - " + state.currentTopic,
                question: systemPrompt 
            })
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
            throw new Error(data.detail || "No se pudo obtener respuesta del tutor.");
        }

        let aiMessageText = "";

        try {
            // Intenta extraer JSON si el AI devuelve con blockquotes
            let rawAnswer = data.answer.trim();

            rawAnswer = rawAnswer
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/```$/i, "")
                .trim();

            const firstBrace = rawAnswer.indexOf("{");
            const lastBrace = rawAnswer.lastIndexOf("}");

            if (firstBrace !== -1 && lastBrace !== -1) {
                rawAnswer = rawAnswer.slice(firstBrace, lastBrace + 1);
            }

            const aiData = JSON.parse(rawAnswer);



            aiMessageText = aiData.message || "";

            if (aiData.nextPrompt) {
                aiMessageText += `\n\n${aiData.nextPrompt}`;
            }

            // Update state from AI data
            if (aiData.mode) state.mode = aiData.mode;

            if (aiData.conceptStatus === "understood" && !state.understoodTopics.includes(state.currentTopic)) {
                state.understoodTopics.push(state.currentTopic);
                state.weakTopics = state.weakTopics.filter(t => t !== state.currentTopic);
            } else if (aiData.conceptStatus === "weak" && !state.weakTopics.includes(state.currentTopic)) {
                state.weakTopics.push(state.currentTopic);
            }

            upsertDetectedDifficulty(state, aiData.diagnosis, state.currentTopic);
            addRecommendation(state, aiData.recommendation, state.currentTopic);

            if (aiData.diagnosis && aiData.diagnosis.difficultyDetected === true) {
                state.conversation.push({
                    sender: "DIAGNOSTICO",
                    text: "Diagnóstico actualizado",
                    diagnosis: aiData.diagnosis,
                    topic: state.currentTopic
                });
            }

            if (aiData.completedTopic && !state.completedTopics.includes(state.currentTopic)) {
                state.completedTopics.push(state.currentTopic);
                // Try to advance index automatically if appropriate
                if (state.currentTopicIndex < THEORY_TOPICS.length - 1) {
                    state.currentTopicIndex++;
                    state.currentTopic = THEORY_TOPICS[state.currentTopicIndex];
                }
            }

        } catch (parseError) {
            // Fallback si no es JSON
            console.warn("No se pudo parsear como JSON, usando respuesta directa.", parseError);
            aiMessageText = data.answer;
            // Basic heuristic to advance mode
            state.mode = "explanation";
        }

        // Remove loading
        document.querySelectorAll(".loading-msg").forEach(e => e.remove());

        // Add AI message to conversation
        state.conversation.push({ sender: "JUNTOS", text: aiMessageText });
        saveTheoryState(state);

        // Final render
        renderTheoryState();

    } catch (error) {
        console.error(error);
        document.querySelectorAll(".loading-msg").forEach(e => e.remove());
        state.conversation.push({
            sender: "JUNTOS",
            text: "Estoy teniendo una demora temporal para responder. Probá de nuevo en unos segundos. Si querés, mientras tanto podemos seguir con el ejemplo anterior paso a paso."
        });
        saveTheoryState(state);
        renderTheoryState();
    }
}
function renderGuiaEjercicios(mainContentArea, mainTitle, mainDesc) {
    mainTitle.textContent = "Guía de ejercicios";
    mainDesc.textContent = "Ejercicios obligatorios del TP1 y práctica recomendada";

    const state = loadTheoryState();
    const hasRecommendations = (state.detectedDifficulties && state.detectedDifficulties.length > 0) ||
                               (state.recommendations && state.recommendations.length > 0);

    let recommendedHtml = '';
    if (hasRecommendations) {
        let diffsText = state.detectedDifficulties.map(d => d.difficulty).join(", ");
        recommendedHtml = `
            <div class="recommended-practice-card">
                <h3 class="exercise-section-title">Práctica recomendada para Ana</h3>
                <p>JUNTOS detectó que conviene reforzar: <strong>${diffsText || 'conceptos en proceso'}</strong></p>
                <button id="btn-resolve-recommended" class="demo-btn primary mt-10">Resolver ejercicio recomendado</button>
            </div>
        `;
    } else {
        recommendedHtml = `
            <div class="recommended-practice-card">
                <h3 class="exercise-section-title">Práctica recomendada para Ana</h3>
                <p>Todavía no hay recomendaciones específicas. Avanzá con la teoría guiada para que JUNTOS pueda personalizar tu práctica.</p>
            </div>
        `;
    }

    let requiredHtml = REQUIRED_EXERCISES.map((ex, index) => {
        let statusTag = '';
        if (ex.status === 'Pendiente') statusTag = '<span class="tag tag-pend">Pendiente</span>';
        else if (ex.status === 'Resuelto') statusTag = '<span class="tag tag-res">Resuelto</span>';
        else statusTag = `<span class="tag">${ex.status}</span>`;

        return `
            <div class="exercise-card">
                <div class="exercise-card-header">
                    <strong>${ex.title}</strong>
                    ${statusTag}
                </div>
                <div class="exercise-meta">
                    Tema: ${ex.topic} | Dificultad: ${ex.difficulty}
                </div>
                <div class="exercise-actions mt-10">
                    <button class="demo-btn small-btn btn-resolve-required" data-index="${index}">Resolver ejercicio</button>
                </div>
            </div>
        `;
    }).join('');

    mainContentArea.innerHTML = `
        ${recommendedHtml}
        <h3 class="exercise-section-title mt-20">Ejercicios obligatorios del TP1</h3>
        <div class="ejercicio-list">
            ${requiredHtml}
        </div>
    `;

    if (hasRecommendations) {
        document.getElementById('btn-resolve-recommended').addEventListener('click', () => {
            openExerciseResolver(mainContentArea, mainTitle, mainDesc, RECOMMENDED_EXERCISE);
        });
    }

    document.querySelectorAll('.btn-resolve-required').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            openExerciseResolver(mainContentArea, mainTitle, mainDesc, REQUIRED_EXERCISES[index]);
        });
    });
}

function openExerciseResolver(mainContentArea, mainTitle, mainDesc, exercise) {
    renderResolverEjercicio(mainContentArea, mainTitle, mainDesc, exercise);
}

function renderResolverEjercicio(mainContentArea, mainTitle, mainDesc, exercise = null) {
    mainTitle.textContent = "Resolver ejercicio";

    if (!exercise) {
        // Fallback or default exercise if none provided
        exercise = REQUIRED_EXERCISES[0];
    }

    mainDesc.textContent = `${exercise.title} - Tema: ${exercise.topic}`;

    mainContentArea.innerHTML = `
        <div class="resolver-container resolver-card">
            <div class="resolver-header">
                <h3>${exercise.title}</h3>
            </div>
            <div class="enunciado-box">
                <p>${exercise.statement.replace(/\n/g, '<br>')}</p>
            </div>
            <textarea id="resolucion-text" class="resolucion-textarea" rows="6" placeholder="Escribí tu resolución acá..."></textarea>
            <div class="resolver-actions mt-10">
                <button id="btn-pista" class="demo-btn secondary">Pedir pista</button>
                <button id="btn-enviar" class="demo-btn primary">Enviar resolución</button>
                <button id="btn-volver-guia" class="demo-btn secondary back-to-guide-btn">Volver a guía</button>
            </div>
            <div id="pista-msg" class="pista-msg hidden mt-10">
                ${exercise.hint}
            </div>
            <div id="feedback-resolucion" class="mt-20 feedback-ai-card"></div>
        </div>
    `;

    document.getElementById('btn-volver-guia').addEventListener('click', () => {
        renderGuiaEjercicios(mainContentArea, mainTitle, mainDesc);
    });

    document.getElementById('btn-pista').addEventListener('click', () => {
        document.getElementById('pista-msg').classList.remove('hidden');
    });

    document.getElementById('btn-enviar').addEventListener('click', () => {
        const text = document.getElementById('resolucion-text').value.toLowerCase();
        const feedbackContainer = document.getElementById('feedback-resolucion');

        // Simulated AI Feedback
        feedbackContainer.innerHTML = `
            <div class="feedback-card" style="background-color: #eef2f5; border-left: 4px solid var(--accent-color);">
                <h4>Feedback de JUNTOS</h4>
                <p><strong>Lo que hiciste bien:</strong> Planteaste bien la idea general de los valores.</p>
                <p><strong>Punto a revisar:</strong> Fijate si no te falta algún valor posible (por ejemplo, el 0).</p>
                <p><strong>Dificultad detectada:</strong> No identifica todos los valores posibles.</p>
                <p><strong>Próximo paso recomendado:</strong> Revisá tu respuesta y agregá el valor faltante antes de continuar.</p>
            </div>
        `;
    });
}

function renderDiagnostico(mainContentArea, mainTitle, mainDesc) {
    mainTitle.textContent = "Mi diagnóstico";
    mainDesc.textContent = "Resumen de Ana Torres";

    const state = loadTheoryState();

    let stateGeneral = "Pendiente";
    if (state.completedTopics.length > 0 || state.understoodTopics.length > 0) {
        stateGeneral = state.weakTopics.length > 0 ? "En proceso" : "Avanzado";
    }

    let understoodHtml = state.understoodTopics.length > 0
        ? state.understoodTopics.map(t => `<li>${t}</li>`).join("")
        : "<li>Todavía no hay temas marcados como entendidos.</li>";

    let difficultiesHtml = "";
    if (state.detectedDifficulties && state.detectedDifficulties.length > 0) {
        difficultiesHtml = state.detectedDifficulties.map(d => `
            <div class="difficulty-item">
                <p><strong>Dificultad en ${d.topic}:</strong> ${d.difficulty}</p>
                <p><em>Evidencia:</em> ${d.evidence}</p>
                <p><em>Recomendación:</em> ${d.recommendation}</p>
            </div>
        `).join("");
    } else {
        difficultiesHtml = "<p>Todavía no hay dificultades detectadas. A medida que interactúes con la teoría guiada, JUNTOS va a actualizar este diagnóstico.</p>";
    }

    let tableRows = THEORY_TOPICS.map(topic => {
        let status = "Pendiente";
        let statusClass = "status-pending";
        let observation = "Todavía no iniciado";

        if (state.understoodTopics.includes(topic)) {
            status = "Entendido";
            statusClass = "status-understood";
            observation = "Fortaleza";
        } else if (state.weakTopics.includes(topic)) {
            status = "En proceso";
            statusClass = "status-weak";
            const diff = state.detectedDifficulties.find(d => d.topic === topic);
            observation = diff ? "Dificultad detectada" : "Necesita refuerzo";
        } else if (state.completedTopics.includes(topic)) {
            status = "Completado";
            statusClass = "status-understood";
            observation = "Finalizado";
        } else if (state.currentTopic === topic) {
            status = "En progreso";
            statusClass = "status-pending";
            observation = "Tema actual";
        }

        return `
            <tr>
                <td>${topic}</td>
                <td><span class="status-pill ${statusClass}">${status}</span></td>
                <td>${observation}</td>
            </tr>
        `;
    }).join("");

    mainContentArea.innerHTML = `
        <div class="diagnostico-container">
            <div class="diagnostico-summary-grid">
                <div class="diagnostico-card">
                    <h4>Estado general</h4>
                    <p class="diagnostico-status">${stateGeneral}</p>
                </div>
                <div class="diagnostico-card">
                    <h4>Tema actual</h4>
                    <p class="diagnostico-status" style="font-size: 1.2rem; text-transform: capitalize;">${state.currentTopic}</p>
                </div>
            </div>

            <div class="diagnostico-section mt-20">
                <h3>Fortalezas detectadas</h3>
                <ul class="strength-list">
                    ${understoodHtml}
                </ul>
            </div>

            <div class="diagnostico-section mt-20">
                <h3>Dificultades detectadas</h3>
                <div class="difficulty-list">
                    ${difficultiesHtml}
                </div>
            </div>

            <div class="diagnostico-section mt-20">
                <h3>Resumen de temas</h3>
                <table class="topic-status-table mt-10">
                    <thead>
                        <tr>
                            <th>Tema</th>
                            <th>Estado</th>
                            <th>Observación</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderPractica(mainContentArea, mainTitle, mainDesc) {
    mainTitle.textContent = "Práctica recomendada para Ana";
    mainDesc.textContent = "Ejercicios sugeridos antes de pasar al TP1";

    const state = loadTheoryState();

    let difficultiesHtml = "";
    if (state.detectedDifficulties && state.detectedDifficulties.length > 0) {
        difficultiesHtml = state.detectedDifficulties.map(d => `<li>${d.difficulty}</li>`).join("");
    }

    let recsHtml = "";
    if (state.recommendations && state.recommendations.length > 0) {
        recsHtml = state.recommendations.map((r, i) => `
            <div class="recommendation-item">
                <h5>${i + 1}. Ejercicio sugerido (${r.type})</h5>
                <p>${r.text}</p>
            </div>
        `).join("");
    }

    if (difficultiesHtml || recsHtml) {
        mainContentArea.innerHTML = `
            <div class="practice-recommendation-card">
                <div class="diagnostico-section">
                    <h3>JUNTOS detectó que conviene reforzar:</h3>
                    <ul>
                        ${difficultiesHtml || "<li>Ciertos conceptos en proceso</li>"}
                    </ul>
                </div>

                <div class="diagnostico-section mt-20">
                    <h3>Antes de pasar al TP1, se recomienda:</h3>
                    <div class="recommendation-list mt-10">
                        ${recsHtml || "<p>Repasar los temas en progreso.</p>"}
                    </div>
                </div>
            </div>
        `;
    } else {
        mainContentArea.innerHTML = `
            <div class="practice-recommendation-card">
                <p>Todavía no hay recomendaciones específicas. Avanzá con la teoría guiada para que JUNTOS pueda personalizar tu práctica.</p>
            </div>
        `;
    }
}

function renderGrupos(mainContentArea, mainTitle, mainDesc) {
    mainTitle.textContent = "Grupos de estudio";
    mainDesc.textContent = "Grupos sugeridos según tu desempeño";

    mainContentArea.innerHTML = `
        <div class="grupo-card">
            <h3>Grupo: Intervalos para medias</h3>
            <p><strong>Motivo:</strong> Ana tuvo dificultad en error estándar y margen de error. Este grupo trabaja esos temas con ejercicios similares.</p>
            <p><strong>Horario:</strong> Jueves 18:00</p>
            <p><strong>Compañeros:</strong></p>
            <ul>
                <li>Diego Pérez: también necesita reforzar error estándar</li>
                <li>Camila Ruiz: resolvió bien error estándar y puede explicar</li>
                <li>Martín Gómez: tiene dificultad en interpretación</li>
                <li>Ana Torres: recomendada para practicar cálculo e interpretación</li>
            </ul>
            <button id="btn-unirse-grupo" class="demo-btn primary mt-10">Unirme al grupo</button>
            <div id="msg-unirse-grupo" class="success-msg hidden mt-10">Te sumaste al grupo de estudio. JUNTOS va a sugerirles ejercicios de error estándar e intervalos para medias.</div>
        </div>
    `;

    document.getElementById('btn-unirse-grupo').addEventListener('click', function() {
        document.getElementById('msg-unirse-grupo').classList.remove('hidden');
        this.style.display = 'none';
    });
}


function addTutorChat(mainContentArea) {
    mainContentArea.insertAdjacentHTML("beforeend", `
        <div class="tutor-chat-card mt-20">
            <h3>Preguntale a JUNTOS</h3>
            <p class="chat-helper-text">
                Podés preguntarle dudas sobre distribuciones discretas, Binomial, Poisson, esperanza, varianza o ejercicios.
            </p>

            <div id="tutor-chat-messages" class="tutor-chat-messages">
                <div class="chat-message bot">
                    <strong>JUNTOS:</strong>
                    Hola Ana. Estoy para ayudarte con Distribuciones discretas. Podés preguntarme una duda o pedirme que resolvamos un ejemplo paso a paso.
                </div>
            </div>

            <div class="quick-actions">
                <button class="demo-btn small-btn tutor-quick" data-question="No entiendo cuando uso Binomial y cuando uso Poisson">
                    Binomial vs Poisson
                </button>
                <button class="demo-btn small-btn tutor-quick" data-question="Explicame esperanza de una variable aleatoria discreta con un ejemplo">
                    Esperanza
                </button>
                <button class="demo-btn small-btn tutor-quick" data-question="Dame un ejemplo guiado de distribucion Binomial">
                    Ejemplo Binomial
                </button>
            </div>

            <div class="chat-input-row mt-10">
                <textarea id="tutor-question" rows="3" placeholder="Escribí tu duda acá..."></textarea>
                <button id="btn-tutor-send" class="demo-btn primary">Enviar</button>
            </div>

            <div id="tutor-loading" class="hidden mt-10">
                JUNTOS está pensando...
            </div>
        </div>
    `);

    setupTutorChat();
}


function setupTutorChat() {
    const sendBtn = document.getElementById("btn-tutor-send");
    const questionInput = document.getElementById("tutor-question");
    const quickButtons = document.querySelectorAll(".tutor-quick");

    if (!sendBtn || !questionInput) return;

    sendBtn.addEventListener("click", () => {
        const question = questionInput.value.trim();
        if (!question) return;

        sendTutorQuestion(question);
        questionInput.value = "";
    });

    quickButtons.forEach(button => {
        button.addEventListener("click", () => {
            const question = button.dataset.question;
            sendTutorQuestion(question);
        });
    });
}


function appendTutorMessage(sender, text) {
    const messages = document.getElementById("tutor-chat-messages");
    if (!messages) return;

    const messageClass = sender === "Ana" ? "user" : "bot";

    // Usar la lógica nueva de formateo
    let formattedText = "";
    if (sender === "Ana") {
        formattedText = escapeHtml(text).replace(/\n/g, "<br>");
    } else {
        formattedText = formatTutorText(text);
    }

    const div = document.createElement("div");
    div.className = `chat-message ${messageClass}`;
    div.innerHTML = `<strong>${sender}:</strong><br>${formattedText}`;

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}


async function loadInitialGuidedTheory() {
    const theoryContent = document.getElementById("guided-theory-content");
    if (!theoryContent) return;

    theoryContent.innerHTML = `
        <div class="loading-card" id="initial-loading">
            <div class="spinner"></div>
            <p>JUNTOS está preparando la explicación inicial...</p>
        </div>
    `;

    try {
        const response = await fetch(TUTOR_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                studentName: "Ana Torres",
                currentTopic: "Variables aleatorias discretas",
                currentBlock: "Teoría guiada inicial",
                question: "Iniciá la teoría guiada de la unidad Variables aleatorias discretas. Explicá de manera pedagógica, clara y completa. No esperes una pregunta del alumno para empezar. Organizá la explicación en subtemas. Para cada subtema explicá la idea, agregá un ejemplo práctico y hacé una pregunta breve al alumno. No uses Markdown excesivo. No uses blockquotes. No uses separadores tipo ---."
            })
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
            throw new Error(data.detail || "Error obteniendo la explicación inicial.");
        }

        theoryContent.innerHTML = `
            <div class="theory-response">
                ${formatTutorText(data.answer)}
            </div>
            <div class="theory-actions">
                <button id="btn-reexplicar" class="demo-btn small-btn tutor-quick">Reexplicar desde el inicio</button>
                <button id="btn-ir-ejercicios" class="demo-btn primary">Ir a ejercicios obligatorios</button>
            </div>
        `;

        document.getElementById("btn-reexplicar").addEventListener("click", () => {
            loadInitialGuidedTheory();
        });

        document.getElementById("btn-ir-ejercicios").addEventListener("click", () => {
            clickSidebarMenu('guia');
        });

    } catch (error) {
        console.error(error);
        theoryContent.innerHTML = `
            <div class="feedback-msg" style="color: red; text-align: center; margin-top: 20px;">
                <p>No se pudo conectar con el tutor IA.</p>
                <button onclick="loadInitialGuidedTheory()" class="demo-btn mt-10">Reintentar</button>
            </div>
        `;
    }
}

async function sendTutorQuestion(question) {
    const loading = document.getElementById("tutor-loading");

    appendTutorMessage("Ana", question);

    if (loading) {
        loading.classList.remove("hidden");
    }

    try {
        const response = await fetch(TUTOR_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                studentName: "Ana Torres",
                currentTopic: "Distribuciones discretas de probabilidad",
                currentBlock: "Teoría guiada",
                question: question
            })
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
            throw new Error(data.detail || "No se pudo obtener respuesta del tutor.");
        }

        appendTutorMessage("JUNTOS", data.answer);

    } catch (error) {
        console.error(error);

        appendTutorMessage(
            "JUNTOS",
            "No pude conectarme con el tutor IA. Revisá que el backend esté corriendo en http://localhost:8001."
        );
    } finally {
        if (loading) {
            loading.classList.add("hidden");
        }
    }
}

function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatTutorText(text) {
    if (!text) return "";

    text = text
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/?strong>/gi, "**")
        .replace(/<\/?em>/gi, "*")
        .replace(/<\/?p>/gi, "\n");
    let html = escapeHtml(text);

    // Títulos
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Negritas
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Listas desordenadas con * o -
    html = html.replace(/^\s*[\*\-] (.*$)/gim, '<ul><li>$1</li></ul>');
    html = html.replace(/<\/ul>\n<ul>/g, '\n');

    // Listas ordenadas
    html = html.replace(/^\s*\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');
    html = html.replace(/<\/ol>\n<ol>/g, '\n');

    // Eliminar blockquotes (escaped as &gt;)
    html = html.replace(/^&gt; (.*$)/gim, '$1');

    // Eliminar separadores ---
    html = html.replace(/^---$/gim, '');

    // Saltos de párrafo
    html = html.replace(/\n\n+/g, '</p><p>');

    // Código inline
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Envolver todo en párrafos inicial y final
    html = '<p>' + html + '</p>';

    // Limpieza final de párrafos vacíos o redundantes generados
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p><\/p>/g, '');

    return html;
}