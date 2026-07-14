// State variables for the demo
let error_estandar_dificultad = false;

const TUTOR_API_URL = "http://localhost:8001/api/tutor";

const COURSE_WEEKS = [
  {
    id: "semana-1",
    number: 1,
    title: "Probabilidad básica",
    status: "Completada",
    summary: "Conceptos iniciales de probabilidad, espacio muestral, eventos y operaciones.",
    theoryStatus: "Completada",
    recommendedExercises: 10,
    mainDifficulty: "Sin dificultad pendiente",
    groupSuggestion: "No requerido"
  },
  {
    id: "semana-2",
    number: 2,
    title: "Probabilidad condicional",
    status: "Refuerzo recomendado",
    summary: "Probabilidad condicional, independencia y regla del producto.",
    theoryStatus: "Refuerzo recomendado",
    recommendedExercises: 7,
    mainDifficulty: "Independencia vs probabilidad condicional",
    groupSuggestion: "Grupo de repaso sugerido"
  },
  {
    id: "semana-3",
    number: 3,
    title: "Variables aleatorias",
    status: "Completada",
    summary: "Definición de variable aleatoria, interpretación y ejemplos.",
    theoryStatus: "Completada",
    recommendedExercises: 6,
    mainDifficulty: "Sin dificultad pendiente",
    groupSuggestion: "No requerido"
  },
  {
    id: "semana-4",
    number: 4,
    title: "Variables aleatorias discretas",
    status: "En curso",
    summary: "Variable aleatoria discreta, función de probabilidad, función de distribución, esperanza, varianza y modelos discretos.",
    theoryStatus: "En progreso",
    recommendedExercises: 8,
    mainDifficulty: "Identificación de valores posibles",
    groupSuggestion: "jueves 18:00"
  }
];

function getSelectedWeekId() {
    return localStorage.getItem("juntos_selected_week") || "semana-4";
}

function setSelectedWeekId(weekId) {
    localStorage.setItem("juntos_selected_week", weekId);
}

function getSelectedWeek() {
    const selectedId = getSelectedWeekId();
    return COURSE_WEEKS.find(w => w.id === selectedId) || COURSE_WEEKS[3];
}

function updateSelectedWeekBadge() {
    const week = getSelectedWeek();
    const badge = document.getElementById("selected-week-badge");
    if (!badge) return;

    badge.innerHTML = `
        <div class="week-badge-label">Semana seleccionada</div>
        <select id="week-selector" class="week-selector">
            ${COURSE_WEEKS.map(w => `
                <option value="${w.id}" ${w.id === week.id ? "selected" : ""}>
                    Semana ${w.number} — ${w.title}
                </option>
            `).join("")}
        </select>
        <div class="week-badge-topic">${week.status}</div>
    `;

    const selector = document.getElementById("week-selector");

    if (selector) {
        selector.addEventListener("change", (e) => {
            setSelectedWeekId(e.target.value);
            updateSelectedWeekBadge();

            const activeItem = document.querySelector(".sidebar-menu li.active");
            const target = activeItem ? activeItem.dataset.target : "inicio";

            const mainContentArea = document.getElementById("main-content-area");
            const mainTitle = document.getElementById("main-title");
            const mainDesc = document.getElementById("main-desc");

            // IMPORTANTE:
            // Por ahora solo re-renderizar Inicio cuando cambia la semana.
            // No actualizar teoría, guía, diagnóstico ni grupos por semana.
            if (target === "inicio" && window.renderDemoSection) {
                window.renderDemoSection("inicio", "Inicio", mainContentArea, mainTitle, mainDesc);
            }
        });
    }
}

const REQUIRED_EXERCISES = [
    {
        id: "tp1-1",
        title: "Ejercicio 1",
        topic: "Variable aleatoria discreta",
        difficulty: "Baja",
        status: "Pendiente",
        statement: `Se lanza una moneda equilibrada 3 veces. Sea X la cantidad de caras obtenidas.\na) Definir el conjunto de valores posibles de X.\nb) Explicar por qué X es una variable aleatoria discreta.`,
        hint: "Pensá en todos los resultados posibles al lanzar 3 monedas y contá las caras en cada caso.",
        additionalRecommendation: "Ejercicios adicionales sobre identificación de valores posibles."
    },
    {
        id: "tp1-2",
        title: "Ejercicio 2",
        topic: "Función de probabilidad",
        difficulty: "Baja",
        status: "Pendiente",
        statement: "Sea X una variable aleatoria con función de probabilidad P(X=x) = kx para x = 1, 2, 3, 4. Calcular el valor de k.",
        hint: "Acordate que la suma de todas las probabilidades debe dar 1.",
        additionalRecommendation: "Ejercicios adicionales sobre función de probabilidad."
    },
    {
        id: "tp1-3",
        title: "Ejercicio 3",
        topic: "Función de distribución discreta",
        difficulty: "Media",
        status: "Pendiente",
        statement: "Dada la variable aleatoria X del ejercicio anterior, calcular su función de distribución acumulada F(x) para todo x.",
        hint: "F(x) = P(X <= x). Recordá que es una función escalonada.",
        additionalRecommendation: "Ejercicios adicionales sobre función de distribución."
    },
    {
        id: "tp1-4",
        title: "Ejercicio 4",
        topic: "Esperanza",
        difficulty: "Media",
        status: "Pendiente",
        statement: "Calcular la esperanza matemática E(X) de la variable aleatoria del Ejercicio 2.",
        hint: "E(X) = suma de x * P(X=x) para todos los x.",
        additionalRecommendation: "Ejercicios adicionales sobre esperanza matemática."
    },
    {
        id: "tp1-5",
        title: "Ejercicio 5",
        topic: "Varianza",
        difficulty: "Media",
        status: "Pendiente",
        statement: "Calcular la varianza V(X) de la variable aleatoria del Ejercicio 2.",
        hint: "V(X) = E(X^2) - (E(X))^2. Calculá primero E(X^2).",
        additionalRecommendation: "Ejercicios adicionales sobre varianza."
    },
    {
        id: "tp1-6",
        title: "Ejercicio 6",
        topic: "Bernoulli / Binomial",
        difficulty: "Media",
        status: "Pendiente",
        statement: "Un tirador tiene probabilidad 0.8 de dar en el blanco. Si realiza 5 tiros independientes, ¿cuál es la probabilidad de que acierte exactamente 3 veces?",
        hint: "Pensá si se cumplen las condiciones para una distribución Binomial. ¿Cuáles son los parámetros n y p?",
        additionalRecommendation: "Ejercicios adicionales sobre distribución Binomial."
    },
    {
        id: "tp1-7",
        title: "Ejercicio 7",
        topic: "Geométrica / Pascal",
        difficulty: "Alta",
        status: "Pendiente",
        statement: "El mismo tirador del ejercicio anterior sigue tirando hasta acertar por primera vez. ¿Cuál es la probabilidad de que necesite exactamente 3 tiros?",
        hint: "Esta es una distribución Geométrica. Representa la cantidad de fracasos antes del primer éxito (o tiros hasta el primer éxito).",
        additionalRecommendation: "Ejercicios adicionales sobre distribución Geométrica."
    },
    {
        id: "tp1-8",
        title: "Ejercicio 8",
        topic: "Poisson",
        difficulty: "Media",
        status: "Pendiente",
        statement: "El número de llamadas que recibe una central telefónica sigue una distribución de Poisson con un promedio de 3 llamadas por minuto. ¿Cuál es la probabilidad de recibir exactamente 5 llamadas en un minuto dado?",
        hint: "Usá la fórmula de la distribución de Poisson con lambda = 3.",
        additionalRecommendation: "Ejercicios adicionales sobre distribución de Poisson."
    }
];


function getExerciseStatuses() {
    const statuses = localStorage.getItem('juntos_exercise_status');
    return statuses ? JSON.parse(statuses) : {};
}

function setExerciseStatus(exerciseId, status) {
    const statuses = getExerciseStatuses();
    statuses[exerciseId] = status;
    localStorage.setItem('juntos_exercise_status', JSON.stringify(statuses));
}

function getExerciseStatus(exerciseId) {
    const statuses = getExerciseStatuses();
    return statuses[exerciseId] || "pendiente";
}

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
        updateSelectedWeekBadge();
        return true;
    }
    return false;
};

// Update badge on load
document.addEventListener('DOMContentLoaded', () => {
    updateSelectedWeekBadge();
});

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
        case 'consultas':
            renderConsultas(mainContentArea, mainTitle, mainDesc);
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
    updateSelectedWeekBadge();
    const week = getSelectedWeek();

    mainTitle.textContent = "Panel de cursada";
    mainDesc.innerHTML = `Hola, Ana Torres. Este es tu resumen de la semana seleccionada.`;

    let demoNote = '';
    if (week.id !== "semana-4") {
        demoNote = `
            <div class="week-demo-note">
                En este prototipo, la demo interactiva completa está implementada para Semana 4. Las semanas anteriores se muestran como ejemplo de navegación del producto.
            </div>
        `;
    }

    mainContentArea.innerHTML = `
        ${demoNote}
        <div class="cards-grid">
            <div class="stat-card">
                <div class="stat-card-title">Semana seleccionada</div>
                <div class="stat-card-value">Semana ${week.number}</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-title">Tema</div>
                <div class="stat-card-value" style="font-size: 1.2rem;">${week.title}</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-title">Estado de teoría</div>
                <div class="stat-card-value" style="font-size: 1.2rem;">${week.theoryStatus}</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-title">Ejercicios recomendados</div>
                <div class="stat-card-value">${week.recommendedExercises}</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-title">Dificultad detectada</div>
                <div class="stat-card-value" style="font-size: 1.1rem;">${week.mainDifficulty}</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-title">Grupo sugerido</div>
                <div class="stat-card-value" style="font-size: 1.2rem;">${week.groupSuggestion}</div>
            </div>
        </div>

        <div class="week-summary-card mt-20">
            <h3>Resumen de la semana</h3>
            <p>${week.summary}</p>
            <div style="margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                <button id="btn-ir-teoria" class="demo-btn primary">Continuar teoría guiada</button>
                <button id="btn-ir-guia" class="demo-btn">Ver guía de ejercicios</button>
                <button id="btn-ir-diag" class="demo-btn">Ver diagnóstico</button>
            </div>
        </div>
    `;

    document.getElementById('btn-ir-teoria').addEventListener('click', () => {
        clickSidebarMenu('material');
    });

    document.getElementById('btn-ir-guia').addEventListener('click', () => {
        clickSidebarMenu('guia');
    });

    document.getElementById('btn-ir-diag').addEventListener('click', () => {
        clickSidebarMenu('diagnostico');
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
    const currentWeek = getSelectedWeek();

    if (currentWeek.id === "semana-4") {
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
    } else {
        mainTitle.textContent = `Material de la materia — Semana ${currentWeek.number}`;
        mainDesc.textContent = currentWeek.title;

        mainContentArea.innerHTML = `
            <div class="diagnostico-section">
                <h3>${currentWeek.title}</h3>
                <p>En una versión completa, JUNTOS mostraría la teoría guiada de esta semana, usando el material de la cátedra y el diagnóstico del estudiante.</p>

                <div style="margin-top: 15px; background: white; padding: 15px; border-radius: 6px; border-left: 4px solid var(--accent-color);">
                    <strong>Resumen de la semana:</strong><br>
                    ${currentWeek.summary}
                </div>

                <div style="margin-top: 30px;">
                    <button id="btn-volver-semana4-teoria" class="demo-btn primary">Volver a Semana 4 para ver demo funcional</button>
                </div>
            </div>
        `;

        document.getElementById('btn-volver-semana4-teoria').addEventListener('click', () => {
            setSelectedWeekId("semana-4");
            clickSidebarMenu('material');
        });
    }
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
    const currentWeek = getSelectedWeek();

    if (currentWeek.id === "semana-4") {
        mainTitle.textContent = "Guía de ejercicios";
        mainDesc.textContent = "Ejercicios obligatorios del TP1 y práctica recomendada";

        const state = loadTheoryState();

        // Prototipo: Mostramos siempre la recomendación estática solicitada
        let recommendedHtml = `
            <div class="recommended-practice-card" style="background-color: #f9fbfc; border: 1px solid #d0d7de; padding: 20px; border-radius: 8px;">
                <h3 class="exercise-section-title" style="margin-top: 0; color: #1a4f8b;">Práctica recomendada para Ana</h3>
                <p>JUNTOS detectó que conviene reforzar:</p>
                <ul style="margin-top: 5px; margin-bottom: 15px; padding-left: 20px;">
                    <li>identificación de valores posibles;</li>
                    <li>diferencia entre variable aleatoria y valores posibles.</li>
                </ul>
                <p style="margin-bottom: 15px;">Antes de avanzar con el TP1, se recomienda resolver un ejercicio tipo.</p>

                <div style="background-color: white; border-left: 4px solid #1a4f8b; padding: 10px 15px; margin-bottom: 15px;">
                    <strong>Ejercicio recomendado:</strong><br>
                    Se lanza una moneda dos veces. Sea X = cantidad de caras obtenidas.<br>
                    Indicá qué valores puede tomar X y por qué es discreta.
                </div>

                <button id="btn-resolve-recommended" class="demo-btn primary">Resolver ejercicio recomendado</button>
            </div>
        `;

                let requiredHtml = REQUIRED_EXERCISES.map((ex, index) => {
            const currentStatus = getExerciseStatus(ex.id);
            let statusTag = '';
            let statusDisplay = currentStatus;

            if (currentStatus === 'pendiente') {
                statusTag = '<span class="tag status-pendiente">Pendiente</span>';
                statusDisplay = 'Pendiente';
            } else if (currentStatus === 'resuelto') {
                statusTag = '<span class="tag status-resuelto">Resuelto</span>';
                statusDisplay = 'Resuelto';
            } else if (currentStatus === 'en_revision') {
                statusTag = '<span class="tag status-en_revision">En revisión</span>';
                statusDisplay = 'En revisión';
            } else if (currentStatus === 'requiere_refuerzo') {
                statusTag = '<span class="tag status-requiere_refuerzo">Requiere refuerzo</span>';
                statusDisplay = 'Requiere refuerzo';
            } else {
                statusTag = `<span class="tag status-pendiente">${currentStatus}</span>`;
            }

            return `
                <div class="exercise-card">
                    <div class="exercise-card-header">
                        <strong>${ex.title}</strong>
                    </div>
                    <div class="exercise-meta">
                        Tema: ${ex.topic} <br>
                        Estado: ${statusTag}
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

        document.getElementById('btn-resolve-recommended').addEventListener('click', () => {
            openExerciseResolver(mainContentArea, mainTitle, mainDesc, RECOMMENDED_EXERCISE);
        });

        document.querySelectorAll('.btn-resolve-required').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                openExerciseResolver(mainContentArea, mainTitle, mainDesc, REQUIRED_EXERCISES[index]);
            });
        });
    } else {
        mainTitle.textContent = `Guía de ejercicios — Semana ${currentWeek.number}`;
        mainDesc.textContent = currentWeek.title;

        let recommendationContent = "Esta sección mostraría los ejercicios de la semana seleccionada y recomendaciones personalizadas según el diagnóstico.";
        if (currentWeek.id === "semana-3") {
            recommendationContent += "<br><br><strong>Ejemplo de recomendación:</strong><br>Repasar la diferencia entre resultado del experimento y variable aleatoria.";
        }

        mainContentArea.innerHTML = `
            <div class="diagnostico-section">
                <h3>${currentWeek.title}</h3>

                <div style="margin-top: 15px; background: white; padding: 15px; border-radius: 6px; border-left: 4px solid var(--accent-color);">
                    <p>${recommendationContent}</p>
                </div>

                <div style="margin-top: 30px;">
                    <button id="btn-volver-semana4-guia" class="demo-btn primary">Volver a Semana 4 para ver demo funcional</button>
                </div>
            </div>
        `;

        document.getElementById('btn-volver-semana4-guia').addEventListener('click', () => {
            setSelectedWeekId("semana-4");
            clickSidebarMenu('guia');
        });
    }
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
                <div class="exercise-meta">Tema: ${exercise.topic}</div>
            </div>

            <div class="mt-20">
                <strong>Enunciado:</strong>
                <div class="exercise-statement-box mt-10">
                    <p>${exercise.statement.replace(/\n/g, '<br>')}</p>
                </div>
            </div>

            <div class="mt-20">
                <strong>Tu resolución:</strong>
                <p style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">Subí una foto, PDF o archivo con tu resolución escrita.</p>

                <div class="resolution-upload-card" id="upload-container-${exercise.id}">
                    <input type="file" id="resolution-file-${exercise.id}" accept=".pdf,.jpg,.jpeg,.png" style="display: none;">
                    <button class="demo-btn secondary" onclick="document.getElementById('resolution-file-${exercise.id}').click()">
                        Seleccionar archivo
                    </button>
                    <p style="font-size: 0.8rem; color: #888; margin-top: 10px;">Archivos aceptados: PDF, JPG, PNG.</p>
                </div>

                <div id="uploaded-file-container-${exercise.id}" class="hidden">
                    <div class="uploaded-file-card">
                        <span style="font-size: 1.5rem;">📄</span>
                        <div>
                            <strong>Archivo cargado:</strong><br>
                            <span id="uploaded-file-name-${exercise.id}"></span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="exercise-chat-container mt-20">
                <strong>Chat con JUNTOS:</strong>
                <div id="exercise-chat-messages-${exercise.id}" style="max-height: 400px; overflow-y: auto; margin-top: 15px; margin-bottom: 15px; padding-right: 10px;">
                    <!-- Chat messages will be rendered here -->
                </div>

                <div class="chat-input-row mt-10">
                    <textarea id="exercise-chat-input-${exercise.id}" class="resolucion-textarea" rows="3" placeholder="Escribí una duda, pedí una pista o contale a JUNTOS qué parte no entendés..."></textarea>
                </div>

                <div class="exercise-chat-actions">
                    <button id="btn-enviar-${exercise.id}" class="demo-btn primary">Enviar al tutor</button>
                    <button id="btn-pista-${exercise.id}" class="demo-btn secondary">Pedir pista</button>
                    <button id="btn-volver-guia-${exercise.id}" class="demo-btn secondary">Volver a guía</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById(`btn-volver-guia-${exercise.id}`).addEventListener('click', () => {
        renderGuiaEjercicios(mainContentArea, mainTitle, mainDesc);
    });

    document.getElementById(`btn-pista-${exercise.id}`).addEventListener('click', () => {
        const input = document.getElementById(`exercise-chat-input-${exercise.id}`);
        input.value = "Necesito una pista para empezar.";
    });

    // File upload handler
    const fileInput = document.getElementById(`resolution-file-${exercise.id}`);
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            document.getElementById(`upload-container-${exercise.id}`).classList.add('hidden');

            const uploadedContainer = document.getElementById(`uploaded-file-container-${exercise.id}`);
            uploadedContainer.classList.remove('hidden');
            document.getElementById(`uploaded-file-name-${exercise.id}`).textContent = fileName;

            // Add file message to chat state
            addExerciseChatMessage(exercise.id, {
                sender: "Ana",
                text: `Ana subió una resolución escrita: ${fileName}`,
                type: "message",
                is_file: true
            });
            renderExerciseChat(exercise.id, exercise, mainContentArea, mainTitle, mainDesc);
        }
    });

    // Send button handler
    document.getElementById(`btn-enviar-${exercise.id}`).addEventListener('click', async () => {
        const input = document.getElementById(`exercise-chat-input-${exercise.id}`);
        const text = input.value.trim();

        let uploadedFileName = null;

        const uploadedNameEl = document.getElementById(`uploaded-file-name-${exercise.id}`);
        if (uploadedNameEl && uploadedNameEl.textContent.trim()) {
            uploadedFileName = uploadedNameEl.textContent.trim();
        }

        const fileInputElem = document.getElementById(`resolution-file-${exercise.id}`);
        if (!uploadedFileName && fileInputElem.files && fileInputElem.files.length > 0) {
            uploadedFileName = fileInputElem.files[0].name;
        }

        if (!text && !uploadedFileName) return;

        if (text) {
            addExerciseChatMessage(exercise.id, {
                sender: "Ana",
                text: text,
                type: "message"
            });
        }

        input.value = "";
        renderExerciseChat(exercise.id, exercise, mainContentArea, mainTitle, mainDesc);

        if (fileInputElem.files && fileInputElem.files.length > 0) {
            fileInputElem.value = '';
        }

        addExerciseChatMessage(exercise.id, {
            sender: "JUNTOS",
            text: "Estoy revisando tu consulta sobre este ejercicio...",
            type: "message",
            temporary: true
        });

        renderExerciseChat(exercise.id, exercise, mainContentArea, mainTitle, mainDesc);

        try {
            const aiResponse = await buildExerciseTutorReply(exercise, text, uploadedFileName);

            let chat = getExerciseChat(exercise.id);
            chat = chat.filter(msg => !msg.temporary);
            saveExerciseChat(exercise.id, chat);

            if (aiResponse.statusUpdate) {
                setExerciseStatus(exercise.id, aiResponse.statusUpdate);
            }

            addExerciseChatMessage(exercise.id, {
                sender: "JUNTOS",
                text: aiResponse.message,
                type: aiResponse.type || "message",
                extra: aiResponse.extra || null
            });

            renderExerciseChat(exercise.id, exercise, mainContentArea, mainTitle, mainDesc);

        } catch (error) {
            console.error(error);

            let chat = getExerciseChat(exercise.id);
            chat = chat.filter(msg => !msg.temporary);
            saveExerciseChat(exercise.id, chat);

            addExerciseChatMessage(exercise.id, {
                sender: "JUNTOS",
                text: `No pude consultar al tutor IA en este momento. Como pista para este ejercicio: ${exercise.hint || "identificá primero la variable, sus valores posibles y qué te pide calcular."}`,
                type: "message"
            });

            renderExerciseChat(exercise.id, exercise, mainContentArea, mainTitle, mainDesc);
        }
    });

    // Initial chat render
    renderExerciseChat(exercise.id, exercise, mainContentArea, mainTitle, mainDesc);
}

function getExerciseChat(exerciseId) {
    const chatKey = `juntos_exercise_chat_${exerciseId}`;
    const chatStr = localStorage.getItem(chatKey);
    if (chatStr) {
        return JSON.parse(chatStr);
    }

    // Default initial message
    return [
        {
            sender: "JUNTOS",
            text: "Subí tu resolución escrita o contame en qué paso te trabaste. Voy a ayudarte a revisar el procedimiento sin darte la respuesta directa.",
            type: "message"
        }
    ];
}

function saveExerciseChat(exerciseId, chat) {
    const chatKey = `juntos_exercise_chat_${exerciseId}`;
    localStorage.setItem(chatKey, JSON.stringify(chat));
}

function addExerciseChatMessage(exerciseId, message) {
    const chat = getExerciseChat(exerciseId);
    chat.push(message);
    saveExerciseChat(exerciseId, chat);
}

function renderExerciseChat(exerciseId, exercise, mainContentArea, mainTitle, mainDesc) {
    const container = document.getElementById(`exercise-chat-messages-${exerciseId}`);
    if (!container) return;

    const chat = getExerciseChat(exerciseId);
    let html = "";

    chat.forEach((msg, idx) => {
        const msgClass = msg.sender === "JUNTOS" ? "bot" : "user";

        let contentHtml = msg.text.replace(/\n/g, '<br>');

        if (msg.type === "feedback") {
            contentHtml = `
                <div class="exercise-chat-feedback">
                    ${contentHtml}
                </div>
            `;
        }

        if (msg.extra && msg.extra.additionalExercise) {
            contentHtml += `
                <div class="additional-exercise-card">
                    <h4>Ejercicio adicional recomendado</h4>
                    <p><strong>Tema:</strong> valores posibles de una variable discreta</p>
                    <p><strong>Objetivo:</strong> reforzar identificación del conjunto de valores posibles.</p>
                    <div style="background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 4px;">
                        <strong>Enunciado:</strong><br>
                        Se lanza un dado dos veces. Sea X = cantidad de veces que sale un número par.<br>
                        Indicá qué valores puede tomar X.
                    </div>
                    <button class="demo-btn small-btn btn-additional-ex" data-id="${exerciseId}" data-msg-idx="${idx}">Resolver ejercicio adicional</button>
                </div>
            `;
        }

        if (msg.extra && msg.extra.groupSuggestion) {
            contentHtml += `
                <div class="group-suggestion-card">
                    <button class="demo-btn primary btn-join-group" data-id="${exerciseId}" data-msg-idx="${idx}">Unirme al grupo</button>
                </div>
            `;
        }

        if (msg.extra && msg.extra.nextExercise) {
             contentHtml += `
                 <button class="demo-btn small-btn btn-next-ex mt-10" data-id="${exerciseId}" data-msg-idx="${idx}">Resolver siguiente ejercicio</button>
             `;
        }

        html += `
            <div class="exercise-chat-message ${msgClass}">
                <strong>${msg.sender}:</strong><br>
                ${contentHtml}
            </div>
        `;
    });

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;

    // Add event listeners for dynamic buttons inside chat
    document.querySelectorAll('.btn-additional-ex').forEach(btn => {
        btn.addEventListener('click', () => {
             const addEx = {
                id: "add-1",
                title: "Ejercicio Adicional",
                topic: "Variable aleatoria discreta",
                difficulty: "Baja",
                status: "Pendiente",
                statement: "Se lanza un dado dos veces. Sea X = cantidad de veces que sale un número par.\nIndicá qué valores puede tomar X.",
                hint: "Contá cuántos pares pueden salir en 2 lanzamientos."
            };
            renderResolverEjercicio(mainContentArea, mainTitle, mainDesc, addEx);
        });
    });

    document.querySelectorAll('.btn-join-group').forEach(btn => {
        btn.addEventListener('click', () => {
            const state = getJoinedStudyGroupState();
            state.joined = true;
            state.groupId = "grupo-valores-posibles";
            state.joinedAt = new Date().toISOString();
            state.meetingStatus = "preparacion";
            saveJoinedStudyGroupState(state);
            clickSidebarMenu('grupos');
        });
    });

    document.querySelectorAll('.btn-next-ex').forEach(btn => {
        btn.addEventListener('click', () => {
            renderGuiaEjercicios(mainContentArea, mainTitle, mainDesc);
        });
    });
}

async function buildExerciseTutorReply(exercise, userText, uploadedFileName) {
    const chatHistory = getExerciseChat(exercise.id)
        .slice(-6)
        .map(msg => `${msg.sender}: ${msg.text}`)
        .join("\n");

    const prompt = `
Sos JUNTOS, un tutor educativo de Probabilidad y Estadística.

Estás ayudando a Ana a resolver un ejercicio obligatorio de la semana 4: Variables aleatorias discretas.

No estás en teoría guiada general. Estás dentro de la pantalla Resolver ejercicio.

Ejercicio seleccionado:
${exercise.title}

Tema:
${exercise.topic}

Dificultad:
${exercise.difficulty}

Enunciado:
${exercise.statement}

Pista docente disponible:
${exercise.hint || "No hay pista cargada."}

Archivo subido:
${uploadedFileName ? `Ana subió una resolución escrita llamada ${uploadedFileName}. En este prototipo no podés leer el contenido real del archivo, pero podés pedirle que describa el paso donde tiene dudas o usar su mensaje escrito para orientarla.` : "Ana todavía no subió archivo o está haciendo una consulta escrita."}

Historial reciente del chat:
${chatHistory}

Mensaje actual de Ana:
${userText || "(Ana no escribió texto adicional.)"}

Reglas:
1. Respondé específicamente sobre este ejercicio y este enunciado.
2. No des la respuesta final completa.
3. No resuelvas todo el ejercicio de punta a punta.
4. Orientá con preguntas, pistas y explicación del error.
5. Si Ana pregunta “cómo empiezo”, ayudala a identificar qué representa la variable y qué datos tiene.
6. Si Ana pregunta por fórmulas, explicá cuál corresponde y por qué, sin hacer todo el cálculo final.
7. Si Ana parece confundida, señalá el concepto que conviene revisar.
8. Si Ana subió archivo pero no escribió una duda concreta, decile que en el prototipo no podés leer todo el archivo y pedile que te indique qué paso quiere revisar.
9. Si hay una dificultad clara, sugerí un ejercicio adicional del mismo tipo.
10. Si la respuesta parece bien encaminada, decile que está bien orientada y proponé el siguiente paso.
11. Escribí en español claro.
12. No uses HTML.
13. No uses Markdown excesivo.
`;

    try {
        const response = await fetch(TUTOR_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                studentName: "Ana Torres",
                currentTopic: exercise.topic,
                currentBlock: "Resolución guiada de ejercicio",
                question: prompt
            })
        });

        const data = await response.json();

        if (response.ok) {
            return {
                message: data.answer,
                type: "message",
                statusUpdate: "en_revision",
                extra: null
            };
        }
        throw new Error("Backend no devolvió ok");
    } catch (e) {
        return {
            message: `Estoy teniendo una demora para consultar al tutor IA, pero puedo ayudarte con una pista sobre este ejercicio.

Este ejercicio trata sobre ${exercise.topic}.

Enunciado:
${exercise.statement}

Para avanzar, revisá primero esto:
${exercise.hint || "Identificá qué representa la variable, qué valores puede tomar y qué te pide calcular."}`,
            type: "message",
            statusUpdate: "en_revision",
            extra: null
        };
    }
}

function renderDiagnostico(mainContentArea, mainTitle, mainDesc) {
    mainTitle.textContent = `Mi diagnóstico — Semana 4`;
    mainDesc.textContent = "Variables aleatorias discretas";

    const state = loadTheoryState();

    let stateGeneral = "En proceso";
    if (state.completedTopics.length > 0 || state.understoodTopics.length > 0) {
        stateGeneral = state.weakTopics.length > 0 ? "En proceso" : "Avanzado";
    }

    let difficultyHtml = "";
    let recommendationHtml = "Resolver un ejercicio tipo sobre valores posibles antes de avanzar al TP1.";
    let evidenceHtml = "Respondió 1 y 2 cuando también era posible 0.";

    if (state.detectedDifficulties && state.detectedDifficulties.length > 0) {
        const latestDiff = state.detectedDifficulties[state.detectedDifficulties.length - 1];
        difficultyHtml = latestDiff.difficulty;
        evidenceHtml = latestDiff.evidence;
        recommendationHtml = latestDiff.recommendation;
    } else {
        difficultyHtml = "No identifica todos los valores posibles";
    }

    mainContentArea.innerHTML = `
        <div class="diagnostico-container" style="max-width: 800px;">
            <div style="background-color: white; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">

                <div style="padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0;">Estado de la semana</h3>
                    <span class="tag" style="background-color: #e3f2fd; color: #1565c0; font-weight: bold;">${stateGeneral}</span>
                </div>

                <div style="padding: 20px; border-bottom: 1px solid #eee; background-color: #fdf3f4;">
                    <h4 style="margin-top: 0; color: #d32f2f;">Dificultad principal detectada</h4>
                    <p style="font-size: 1.1rem; font-weight: bold; margin-bottom: 5px;">${difficultyHtml}</p>
                    <p style="color: #666; margin-top: 0; font-size: 0.95rem;"><strong>Evidencia:</strong> ${evidenceHtml}</p>
                </div>

                <div style="padding: 20px; border-bottom: 1px solid #eee; background-color: #e8f5e9;">
                    <h4 style="margin-top: 0; color: #2e7d32;">Recomendación de JUNTOS</h4>
                    <p style="margin-bottom: 0;">${recommendationHtml}</p>
                </div>

                <div style="padding: 20px;">
                    <h4 style="margin-top: 0;">Próximos pasos sugeridos:</h4>
                    <ol style="margin-bottom: 0; padding-left: 20px;">
                        <li style="margin-bottom: 8px;">Repasar el ejemplo de moneda dos veces.</li>
                        <li style="margin-bottom: 8px;">Resolver el ejercicio recomendado en la Guía.</li>
                        <li>Volver a intentar un ejercicio obligatorio.</li>
                    </ol>
                </div>
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

function getJoinedStudyGroupState() {
    const raw = localStorage.getItem("juntos_joined_study_group");

    if (!raw) {
        // Migrate old state if exists
        const oldJoined = localStorage.getItem("juntos_joined_group") === "true";
        if (oldJoined) {
            const migratedState = {
                joined: true,
                groupId: "grupo-valores-posibles",
                meetingStatus: "preparacion",
                preparationCompleted: false,
                preparationText: "",
                meetingCompleted: false,
                reflectionCompleted: false,
                reflection: null
            };
            saveJoinedStudyGroupState(migratedState);
            return migratedState;
        }

        return {
            joined: false,
            groupId: null,
            meetingStatus: "not_joined",
            preparationCompleted: false,
            preparationText: "",
            meetingCompleted: false,
            reflectionCompleted: false,
            reflection: null
        };
    }

    try {
        return JSON.parse(raw);
    } catch {
        return {
            joined: false,
            groupId: null,
            meetingStatus: "not_joined",
            preparationCompleted: false,
            preparationText: "",
            meetingCompleted: false,
            reflectionCompleted: false,
            reflection: null
        };
    }
}

function saveJoinedStudyGroupState(state) {
    localStorage.setItem(
        "juntos_joined_study_group",
        JSON.stringify(state)
    );
}

function renderGrupos(mainContentArea, mainTitle, mainDesc) {
    const currentWeek = getSelectedWeek();
    mainTitle.textContent = `Grupos de estudio — Semana ${currentWeek.number}`;
    mainDesc.textContent = "Grupos sugeridos según tu desempeño";

    const state = getJoinedStudyGroupState();

    if (currentWeek.id !== 'semana-4') {
        mainContentArea.innerHTML = `
            <div class="grupo-card">
                <h3>${currentWeek.title}</h3>
                <p>En una versión completa, JUNTOS recomendaría grupos de estudio para esta semana según tu desempeño.</p>
                <div style="margin-top: 30px;">
                    <button id="btn-volver-semana4-grupos" class="demo-btn">Volver a Semana 4 para ver demo funcional</button>
                </div>
            </div>
        `;
        document.getElementById('btn-volver-semana4-grupos').addEventListener('click', () => {
            setSelectedWeekId("semana-4");
            clickSidebarMenu('grupos');
        });
        return;
    }

    if (!state.joined) {
        // ESTADO 1 — ANTES DE UNIRSE
        mainContentArea.innerHTML = `
            <div class="study-group-suggestion-card">
                <h3>Grupo sugerido para vos</h3>

                <div class="group-meeting-meta">
                    <div><strong>Tema:</strong> Valores posibles de variables aleatorias discretas</div>
                    <div><strong>Fecha:</strong> Jueves 18:00</div>
                    <div><strong>Duración:</strong> 40 minutos</div>
                    <div><strong>Modalidad:</strong> Encuentro presencial en la facultad</div>
                </div>

                <p style="margin-bottom: 15px;"><strong>Motivo de la recomendación:</strong><br>
                JUNTOS detectó que todavía necesitás reforzar cómo identificar todos los valores posibles de una variable de conteo, especialmente cuándo puede aparecer el valor 0.</p>

                <p style="margin-bottom: 15px;"><strong>Objetivo del grupo:</strong><br>
                Aprender a definir correctamente una variable aleatoria discreta y justificar todos sus valores posibles.</p>

                <p><strong>Integrantes y Roles:</strong></p>
                <ul class="group-member-list">
                    <li>
                        <strong>Ana Torres</strong>
                        <span class="group-member-role">Rol: Refuerzo conceptual</span>
                        Objetivo individual: reconocer todos los valores posibles de X.
                    </li>
                    <li>
                        <strong>Martín López</strong>
                        <span class="group-member-role">Rol: Refuerzo práctico</span>
                        Objetivo individual: pasar de los valores posibles a una tabla de probabilidades.
                    </li>
                    <li>
                        <strong>Sofía Díaz</strong>
                        <span class="group-member-role">Rol: Refuerzo de modelos</span>
                        Objetivo individual: reconocer cuándo corresponde usar Binomial.
                    </li>
                    <li>
                        <strong>Camila Ruiz</strong>
                        <span class="group-member-role">Rol: Apoyo par</span>
                        Objetivo individual: ayudar a revisar procedimientos sin dar respuestas.
                    </li>
                </ul>
            </div>

            <div class="study-group-suggestion-card">
                <h3>¿Por qué este grupo puede ayudarte?</h3>
                <p style="margin-bottom: 20px;">Los integrantes fueron seleccionados porque presentan dificultades relacionadas o porque pueden actuar como apoyo. Cada persona tendrá una responsabilidad concreta para evitar que una sola resuelva todo el ejercicio.</p>

                <div style="display: flex; gap: 10px;">
                    <button id="btn-unirse-grupo" class="demo-btn primary">Unirme al grupo</button>
                    <button id="btn-rechazar-grupo" class="demo-btn">Ahora no</button>
                </div>

                <div id="msg-unirse-grupo" class="success-msg hidden mt-10" style="padding: 10px; background-color: #e8f5e9; border-left: 4px solid var(--accent-color); border-radius: 4px; color: #1b5e20;">
                    Ya sos parte del grupo.
                </div>
            </div>
        `;

        document.getElementById('btn-unirse-grupo').addEventListener('click', function() {
            document.getElementById('btn-unirse-grupo').classList.add('hidden');
            document.getElementById('btn-rechazar-grupo').classList.add('hidden');
            document.getElementById('msg-unirse-grupo').classList.remove('hidden');

            setTimeout(() => {
                state.joined = true;
                state.groupId = "grupo-valores-posibles";
                state.joinedAt = new Date().toISOString();
                state.meetingStatus = "preparacion";
                saveJoinedStudyGroupState(state);
                renderGrupos(mainContentArea, mainTitle, mainDesc);
            }, 1000);
        });

        document.getElementById('btn-rechazar-grupo').addEventListener('click', function() {
            clickSidebarMenu('inicio');
        });

    } else {
        // ESTADO 2 — DESPUÉS DE UNIRSE

        let prepSectionHTML = "";
        if (!state.preparationCompleted) {
            prepSectionHTML = `
                <div class="group-preparation-card">
                    <h3>Antes de reunirte</h3>
                    <p style="margin-bottom: 15px;">Esta preparación debería llevarte entre 5 y 10 minutos. No hace falta resolver el ejercicio completo.</p>

                    <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; border-left: 4px solid #ccc; margin-bottom: 15px;">
                        <strong>Actividad previa:</strong><br>
                        Se lanzan dos monedas y X representa la cantidad de caras obtenidas.<br><br>
                        <strong>Responder:</strong><br>
                        1. ¿Qué representa X?<br>
                        2. ¿Puede X valer 0? ¿Por qué?<br>
                        3. ¿Cuáles son todos los valores posibles?<br>
                        4. ¿Qué parte te genera más duda?
                    </div>

                    <textarea id="study-group-preparation" rows="4" style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;" placeholder="Escribí una respuesta breve para llevar al grupo..."></textarea>

                    <button id="btn-guardar-preparacion" class="demo-btn primary">Guardar mi preparación</button>
                </div>
            `;
        } else {
            prepSectionHTML = `
                <div class="group-preparation-card" style="background-color: #e8f5e9; border: 1px solid #c8e6c9;">
                    <h3 style="color: #1b5e20;">Preparación completada</h3>
                    <p style="margin-bottom: 15px;">Preparación guardada. Esta respuesta te servirá como punto de partida durante la reunión.</p>

                    <div style="background: white; padding: 15px; border-radius: 4px; border: 1px solid #ccc; margin-bottom: 15px;">
                        <strong>Tu respuesta:</strong><br>
                        ${escapeHtml(state.preparationText).replace(/\\n/g, "<br>")}
                    </div>

                    <div style="background: #e8f4f8; padding: 15px; border-radius: 4px; border-left: 4px solid var(--accent-color);">
                        <strong>Orientación de JUNTOS:</strong><br>
                        Durante el encuentro, compará tu lista de valores posibles con la de los demás y fijate si todos consideraron el caso en que no aparece ninguna cara.
                    </div>
                </div>
            `;
        }

        let resultSectionHTML = "";
        if (state.reflectionCompleted && state.reflection) {
            let feedbackMsg = "";
            let btnMsg = "";
            let actionFn = "";

            if (state.reflection.understanding === "lo-entiendo") {
                feedbackMsg = "Completaste el encuentro y manifestaste que comprendés mejor el tema. JUNTOS te recomienda volver a intentar el ejercicio obligatorio sobre valores posibles.";
                btnMsg = "Ir a la guía de ejercicios";
                actionFn = "clickSidebarMenu('guia')";
            } else if (state.reflection.understanding === "necesito-practica") {
                feedbackMsg = "El grupo ayudó parcialmente, pero todavía necesitás práctica. JUNTOS te recomienda resolver un ejercicio adicional antes de continuar.";
                btnMsg = "Ver ejercicio recomendado";
                actionFn = "clickSidebarMenu('guia')";
            } else {
                feedbackMsg = "El encuentro no alcanzó para resolver la dificultad. JUNTOS registrará que necesitás otra intervención y te recomienda realizar una consulta al docente.";
                btnMsg = "Ir a Consultas";
                actionFn = "clickSidebarMenu('consultas')";
            }

            resultSectionHTML = `
                <div class="group-result-card" style="background-color: #e8f4f8; border: 1px solid #b3e5fc;">
                    <h3>Resultado del encuentro</h3>
                    <p style="margin-bottom: 15px;">${feedbackMsg}</p>
                    <p style="font-size: 0.85rem; color: #666; margin-bottom: 15px; font-style: italic;">En una versión completa, esta información actualizaría tu diagnóstico y el dashboard docente.</p>
                    <button onclick="${actionFn}" class="demo-btn primary">${btnMsg}</button>
                </div>
            `;
        }

        mainContentArea.innerHTML = `
            <div class="study-group-joined-card">
                <h3>Ya sos parte del grupo</h3>
                <div class="group-meeting-meta">
                    <div><strong>Grupo:</strong> Valores posibles de variables aleatorias discretas</div>
                    <div><strong>Próximo encuentro:</strong> Jueves 18:00</div>
                    <div><strong>Modalidad:</strong> Presencial — Biblioteca de la facultad</div>
                    <div><strong>Estado:</strong> ${state.reflectionCompleted ? 'Completado' : (state.preparationCompleted ? 'Reunión pendiente' : 'Preparación previa')}</div>
                </div>
            </div>

            <div class="study-group-progress">
                <div class="study-group-step study-group-step-completed">1. Inscripción</div>
                <div class="study-group-step ${!state.preparationCompleted ? 'study-group-step-current' : 'study-group-step-completed'}">2. Preparación individual</div>
                <div class="study-group-step ${state.preparationCompleted && !state.reflectionCompleted ? 'study-group-step-current' : (state.reflectionCompleted ? 'study-group-step-completed' : '')}">3. Reunión grupal</div>
                <div class="study-group-step ${state.reflectionCompleted ? 'study-group-step-completed' : ''}">4. Cierre y reflexión</div>
            </div>

            <div class="student-group-role-card">
                <h3>Tu rol en el encuentro</h3>
                <p><strong>Tu rol:</strong> Refuerzo conceptual</p>
                <p><strong>Tu objetivo:</strong> Al finalizar el encuentro deberías poder identificar todos los valores posibles de una variable de conteo y justificar cuándo puede tomar el valor 0.</p>
                <p style="margin-top: 10px;"><strong>Tu responsabilidad durante la reunión:</strong></p>
                <ul style="margin-left: 20px; margin-bottom: 10px;">
                    <li>explicar con tus palabras qué representa la variable X;</li>
                    <li>proponer los valores posibles antes de mirar la respuesta de otros;</li>
                    <li>preguntar cuando no entiendas un paso;</li>
                    <li>explicar al final qué error corregiste.</li>
                </ul>
                <p style="font-size: 0.85rem; font-style: italic; color: #666;">Nota: Tu rol no es una etiqueta fija. Describe qué necesitás trabajar en este encuentro.</p>
            </div>

            ${prepSectionHTML}

            <div class="group-agenda-card">
                <h3>Agenda sugerida por JUNTOS</h3>
                <p style="margin-bottom: 15px;"><strong>Duración total:</strong> 40 minutos</p>

                <div class="group-agenda-item">
                    <strong>1. Presentación rápida — 5 minutos</strong><br>
                    Cada integrante explica qué parte del tema le cuesta o qué pudo resolver.
                </div>
                <div class="group-agenda-item">
                    <strong>2. Comparación de respuestas — 10 minutos</strong><br>
                    Cada integrante muestra los valores posibles que identificó en la actividad previa.
                </div>
                <div class="group-agenda-item">
                    <strong>3. Resolución colaborativa — 15 minutos</strong><br>
                    Resolver dos ejercicios sin que una sola persona haga todo.
                </div>
                <div class="group-agenda-item">
                    <strong>4. Explicación por roles — 5 minutos</strong><br>
                    Cada integrante explica una parte:
                    <ul style="margin-left: 20px;">
                        <li>definir el experimento;</li>
                        <li>definir X;</li>
                        <li>listar valores posibles;</li>
                        <li>verificar si aparece el valor 0.</li>
                    </ul>
                </div>
                <div class="group-agenda-item">
                    <strong>5. Cierre — 5 minutos</strong><br>
                    Cada integrante dice qué entendió y qué duda le queda.
                </div>
            </div>

            <div class="group-rules-card">
                <h3>Reglas para trabajar</h3>
                <ul style="margin-left: 20px;">
                    <li>Todos deben explicar al menos una parte.</li>
                    <li>El estudiante de apoyo no debe dar directamente la respuesta.</li>
                    <li>Antes de corregir a alguien, preguntar cómo llegó a esa conclusión.</li>
                    <li>Si no hay acuerdo, consultar el material de la cátedra.</li>
                    <li>Registrar las dudas que el grupo no pudo resolver.</li>
                    <li>No usar la IA para obtener la solución completa durante la reunión.</li>
                </ul>
            </div>

            <div class="group-activity-card">
                <h3>Actividad principal</h3>

                <div style="margin-bottom: 15px;">
                    <strong>Ejercicio 1:</strong><br>
                    Se lanzan tres monedas. X es la cantidad de caras obtenidas.<br>
                    El grupo debe:
                    <ul style="margin-left: 20px;">
                        <li>definir el experimento;</li>
                        <li>definir la variable X;</li>
                        <li>listar todos sus valores posibles;</li>
                        <li>justificar si X puede valer 0;</li>
                        <li>comparar las respuestas individuales.</li>
                    </ul>
                </div>

                <div style="margin-bottom: 15px;">
                    <strong>Ejercicio 2:</strong><br>
                    En una hora, X representa la cantidad de consultas recibidas por una mesa de ayuda.<br>
                    El grupo debe:
                    <ul style="margin-left: 20px;">
                        <li>decidir si X es discreta;</li>
                        <li>proponer valores posibles;</li>
                        <li>explicar por qué el valor 0 debe considerarse;</li>
                        <li>relacionarlo con un modelo de conteo.</li>
                    </ul>
                </div>

                <div style="background: #fff3e0; padding: 15px; border-radius: 4px; border-left: 4px solid #ffb74d;">
                    <strong>Producto esperado:</strong><br>
                    Al finalizar, el grupo debe tener:
                    <ul style="margin-left: 20px;">
                        <li>una definición clara de cada variable;</li>
                        <li>la lista completa de valores posibles;</li>
                        <li>una explicación del caso X = 0;</li>
                        <li>una duda pendiente, si todavía existe.</li>
                    </ul>
                </div>
            </div>

            <div class="group-materials-card">
                <h3>Materiales para la reunión</h3>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="demo-btn small-btn" onclick="clickSidebarMenu('material')">Ver apunte sobre variables aleatorias discretas</button>
                    <button class="demo-btn small-btn" onclick="clickSidebarMenu('material')">Ver ejemplo de variable de conteo</button>
                    <button class="demo-btn small-btn" onclick="clickSidebarMenu('guia')">Abrir ejercicios adicionales</button>
                    <button class="demo-btn small-btn" onclick="clickSidebarMenu('diagnostico')">Revisar mi diagnóstico</button>
                </div>
            </div>

            ${!state.reflectionCompleted ? `
            <div class="group-reflection-card" id="reflection-card-container">
                <h3>Registrar el encuentro</h3>

                <button id="btn-mostrar-cierre" class="demo-btn primary">Ya tuvimos la reunión</button>

                <div id="study-group-reflection-form" style="display: none; margin-top: 20px;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 5px;">1. ¿Pudieron realizar la actividad?</label>
                        <select id="ref-activity" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                            <option value="">Seleccionar...</option>
                            <option value="completa">Sí, completa</option>
                            <option value="parcial">Parcialmente</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 5px;">2. ¿Participaron todos?</label>
                        <select id="ref-participation" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                            <option value="">Seleccionar...</option>
                            <option value="si">Sí</option>
                            <option value="parcial">Parcialmente</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 5px;">3. ¿Qué concepto trabajaron?</label>
                        <textarea id="ref-concept" rows="2" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;"></textarea>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 5px;">4. ¿Qué duda quedó pendiente?</label>
                        <textarea id="ref-pending" rows="2" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;"></textarea>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 5px;">5. ¿Cómo te sentís ahora con el tema?</label>
                        <select id="ref-understanding" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                            <option value="">Seleccionar...</option>
                            <option value="lo-entiendo">Lo entiendo mejor</option>
                            <option value="necesito-practica">Todavía necesito práctica</option>
                            <option value="no-entiendo">Sigo sin entenderlo</option>
                        </select>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 5px;">6. ¿Te resultó útil el grupo?</label>
                        <select id="ref-usefulness" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                            <option value="">Seleccionar...</option>
                            <option value="si">Sí</option>
                            <option value="mas-o-menos">Más o menos</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <button id="btn-guardar-cierre" class="demo-btn primary">Guardar cierre del encuentro</button>
                </div>
            </div>
            ` : resultSectionHTML}

            <p class="group-privacy-note">Después del encuentro, el docente podrá ver si el grupo se reunió, qué actividad realizó y qué dificultades siguen pendientes. No verá conversaciones privadas entre estudiantes.</p>
        `;

        if (!state.preparationCompleted) {
            document.getElementById('btn-guardar-preparacion')?.addEventListener('click', function() {
                const textarea = document.getElementById("study-group-preparation");
                state.preparationCompleted = true;
                state.preparationText = textarea ? textarea.value.trim() : "";
                state.meetingStatus = "reunion_pendiente";
                saveJoinedStudyGroupState(state);
                renderGrupos(mainContentArea, mainTitle, mainDesc);
            });
        }

        if (!state.reflectionCompleted) {
            document.getElementById('btn-mostrar-cierre')?.addEventListener('click', function() {
                document.getElementById('btn-mostrar-cierre').style.display = 'none';
                document.getElementById('study-group-reflection-form').style.display = 'block';
            });

            document.getElementById('btn-guardar-cierre')?.addEventListener('click', function() {
                state.meetingCompleted = true;
                state.reflectionCompleted = true;
                state.meetingStatus = "completado";
                state.reflection = {
                    activityCompleted: document.getElementById("ref-activity")?.value || "",
                    participation: document.getElementById("ref-participation")?.value || "",
                    conceptWorked: document.getElementById("ref-concept")?.value || "",
                    pendingQuestion: document.getElementById("ref-pending")?.value || "",
                    understanding: document.getElementById("ref-understanding")?.value || "",
                    usefulness: document.getElementById("ref-usefulness")?.value || "",
                    completedAt: new Date().toISOString()
                };
                saveJoinedStudyGroupState(state);
                renderGrupos(mainContentArea, mainTitle, mainDesc);
            });
        }

    }
}
function renderConsultas(mainContentArea, mainTitle, mainDesc) {
    const currentWeek = getSelectedWeek();
    mainTitle.textContent = `Consultas — Semana ${currentWeek.number}`;
    mainDesc.textContent = currentWeek.title;

    if (currentWeek.id === "semana-4") {
        mainContentArea.innerHTML = `
            <div class="diagnostico-section">
                <h3>${currentWeek.title}</h3>
                <p>Podés hacer consultas sobre la teoría, ejercicios o dudas de esta semana.</p>
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <button id="btn-consulta-teoria" class="demo-btn primary">Ir a teoría guiada</button>
                    <button id="btn-consulta-guia" class="demo-btn">Ver guía de ejercicios</button>
                </div>
            </div>
        `;

        document.getElementById('btn-consulta-teoria').addEventListener('click', () => {
            clickSidebarMenu('material');
        });

        document.getElementById('btn-consulta-guia').addEventListener('click', () => {
            clickSidebarMenu('guia');
        });
    } else {
        mainContentArea.innerHTML = `
            <div class="diagnostico-section">
                <h3>${currentWeek.title}</h3>
                <p>En una versión completa, JUNTOS permitiría consultar sobre esta semana usando el material de la cátedra.</p>
                <div style="margin-top: 30px;">
                    <button id="btn-volver-semana4-consultas" class="demo-btn primary">Volver a Semana 4 para ver demo funcional</button>
                </div>
            </div>
        `;

        document.getElementById('btn-volver-semana4-consultas').addEventListener('click', () => {
            setSelectedWeekId("semana-4");
            clickSidebarMenu('consultas');
        });
    }
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