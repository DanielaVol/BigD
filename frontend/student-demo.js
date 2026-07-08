// State variables for the demo
let error_estandar_dificultad = false;

const TUTOR_API_URL = "http://localhost:8001/api/tutor";

// Expose a global rendering function to hook into app-layout.js
window.renderDemoSection = function(target, sectionName, mainContentArea, mainTitle, mainDesc) {
    if (!mainContentArea || !mainTitle || !mainDesc) return false;

    // We only override specific sections, others can fallback to default placeholder
    if (['inicio', 'material', 'guia', 'resolver', 'diagnostico', 'grupos'].includes(target)) {
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
        case 'resolver':
            renderResolverEjercicio(mainContentArea, mainTitle, mainDesc);
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

function renderTeoriaGuiada(mainContentArea, mainTitle, mainDesc) {
    mainTitle.textContent = "Teoría guiada: Variables aleatorias discretas";
    mainDesc.textContent = "Unidad 2 - Explicación paso a paso con JUNTOS";

    mainContentArea.innerHTML = `
        <div class="guided-theory-layout">
            <div class="theory-card">
                <div class="theory-header">
                    <span class="section-kicker">Material de la materia</span>
                    <h2>Variables aleatorias discretas</h2>
                </div>
                <div id="guided-theory-content" class="guided-theory-content">
                    <!-- The dynamic theory response will be injected here -->
                </div>
            </div>
            <div id="theory-chat-container">
                <!-- The tutor chat will be injected here -->
            </div>
        </div>
    `;

    const chatContainer = document.getElementById("theory-chat-container");
    addTutorChat(chatContainer);

    // Automatically load the theory without waiting for a user prompt
    loadInitialGuidedTheory();
}

function renderGuiaEjercicios(mainContentArea, mainTitle, mainDesc) {
    mainTitle.textContent = "Guía de ejercicios";
    mainDesc.textContent = "Tema: Intervalos de confianza";

    const ej4Status = error_estandar_dificultad ? '<span class="tag tag-recom">Recomendado</span>' : '<span class="tag tag-pend">Pendiente</span>';
    const ej5Status = '<span class="tag tag-pend">Pendiente</span>';

    mainContentArea.innerHTML = `
        <div class="ejercicio-list">
            <div class="ej-item"><strong>Ejercicio 1:</strong> Tema: Interpretación de intervalos | Dificultad: Baja | <span class="tag tag-res">Resuelto</span></div>
            <div class="ej-item"><strong>Ejercicio 2:</strong> Tema: Media con sigma conocido | Dificultad: Baja | <span class="tag tag-res">Resuelto</span></div>
            <div class="ej-item"><strong>Ejercicio 3:</strong> Tema: Media con desvío muestral | Dificultad: Media | <span class="tag tag-res">Resuelto</span></div>
            <div class="ej-item highlight-ej"><strong>Ejercicio 4:</strong> Tema: Error estándar | Dificultad: Media | ${ej4Status}</div>
            <div class="ej-item highlight-ej">
                <strong>Ejercicio 5:</strong> Tema: Intervalo para media | Dificultad: Media | ${ej5Status}
                <br><button id="btn-resolver-5" class="demo-btn small-btn mt-10">Resolver ejercicio</button>
            </div>
            <div class="ej-item"><strong>Ejercicio 6:</strong> Tema: Intervalo para proporción | Dificultad: Media | <span class="tag tag-pend">Pendiente</span></div>
            <div class="ej-item"><strong>Ejercicio 7:</strong> Tema: Comparación de intervalos | Dificultad: Alta | <span class="tag tag-block">Bloqueado hasta reforzar error estándar</span></div>
            <div class="ej-item"><strong>Ejercicio 8:</strong> Tema: Tamaño muestral | Dificultad: Alta | <span class="tag tag-pend">Pendiente</span></div>
        </div>
    `;

    document.getElementById('btn-resolver-5').addEventListener('click', () => {
        clickSidebarMenu('resolver');
    });
}

function renderResolverEjercicio(mainContentArea, mainTitle, mainDesc) {
    mainTitle.textContent = "Resolver ejercicio";
    mainDesc.textContent = "Ejercicio 5";

    mainContentArea.innerHTML = `
        <div class="resolver-container">
            <div class="enunciado-box">
                <p>Una muestra de 36 estudiantes tiene media 72 y desvío estándar 12. Construir un intervalo de confianza del 95% para la media poblacional.</p>
            </div>
            <textarea id="resolucion-text" class="resolucion-textarea" rows="6" placeholder="Escribí tu resolución acá..."></textarea>
            <div class="resolver-actions mt-10">
                <button id="btn-pista" class="demo-btn secondary">Pedir pista</button>
                <button id="btn-enviar" class="demo-btn primary">Enviar resolución</button>
            </div>
            <div id="pista-msg" class="pista-msg hidden mt-10">
                Antes de calcular el margen de error, revisá si tenés que usar el desvío estándar directamente o el error estándar de la media.
            </div>
            <div id="feedback-resolucion" class="mt-20"></div>
        </div>
    `;

    document.getElementById('btn-pista').addEventListener('click', () => {
        document.getElementById('pista-msg').classList.remove('hidden');
    });

    document.getElementById('btn-enviar').addEventListener('click', () => {
        const text = document.getElementById('resolucion-text').value.toLowerCase();
        const feedbackContainer = document.getElementById('feedback-resolucion');

        // Condiciones de error
        const hasError = /1\.96 \* 12|1\.96 x 12|1\.96 × 12|72 ± 23\.52|desvío estándar(?!.*error estándar)/.test(text);

        // Condiciones de acierto
        const hasSuccess = /error estándar|12 \/ √36|12 \/ sqrt\(36\)|margen 3\.92|\[68\.08 ; 75\.92\]/.test(text);

        if (hasError && !hasSuccess) {
            error_estandar_dificultad = true;
            feedbackContainer.innerHTML = `
                <div class="feedback-card error-card">
                    <h4>Feedback personalizado de JUNTOS</h4>
                    <p><strong>Estado:</strong> Resolución en revisión</p>
                    <p><strong>Lo que hiciste bien:</strong> Identificaste correctamente que se trata de un intervalo de confianza para una media y usaste el valor crítico 1.96 para un nivel de confianza del 95%.</p>
                    <p><strong>Punto a revisar:</strong> En este ejercicio no corresponde multiplicar 1.96 por el desvío estándar directamente. Primero tenés que calcular el error estándar de la media.</p>
                    <p><strong>Explicación:</strong> El desvío estándar mide variabilidad de los datos. El error estándar mide variabilidad de la media muestral. Para una media, se calcula como s / √n.<br>
                    En este caso:<br>
                    s = 12<br>
                    n = 36<br>
                    √n = 6<br>
                    error estándar = 12 / 6 = 2</p>
                    <p><strong>Próximo paso:</strong> Recalculá el margen de error usando 2 en lugar de 12.</p>
                    <p><em>Actualizar diagnóstico: Tema flojo detectado: error estándar.</em></p>
                    <p><strong>Recomendación:</strong> Antes de avanzar a intervalos para proporciones, resolvé el ejercicio 4 y reintentá el ejercicio 5.</p>
                    <div class="grupo-estudio-sug">
                        <h5>Este tema te está costando. Hay un grupo de estudio esta semana para practicar error estándar e intervalos para medias.</h5>
                        <p>Grupo: Intervalos para medias<br>Horario: jueves 18:00<br>Participantes sugeridos: Ana Torres, Diego Pérez, Camila Ruiz, Martín Gómez</p>
                        <button id="btn-unirse-resolver" class="demo-btn primary">Quiero unirme</button>
                        <div id="msg-unirse-resolver" class="success-msg hidden">Te sumamos al grupo de estudio de Intervalos para medias. Vas a practicar ejercicios similares con compañeros que están trabajando el mismo tema.</div>
                    </div>
                </div>
            `;
            document.getElementById('btn-unirse-resolver').addEventListener('click', function() {
                document.getElementById('msg-unirse-resolver').classList.remove('hidden');
                this.style.display = 'none';
            });
        } else if (hasSuccess) {
            feedbackContainer.innerHTML = `
                <div class="feedback-card success-card">
                    <h4>Estado: Resolución correcta</h4>
                    <p><strong>Mensaje:</strong> La resolución identifica correctamente el error estándar, calcula el margen de error y construye el intervalo de confianza. Ahora podés avanzar a intervalos para proporciones.</p>
                    <p><em>Actualizar diagnóstico: Error estándar: en mejora | Construcción del intervalo: bien</em></p>
                </div>
            `;
        } else {
            feedbackContainer.innerHTML = '<p>Intenta ser más específico en tu resolución. Mostrá tus cálculos para el error estándar y margen de error.</p>';
        }
    });
}

function renderDiagnostico(mainContentArea, mainTitle, mainDesc) {
    mainTitle.textContent = "Mi diagnóstico";
    mainDesc.textContent = "Diagnóstico personalizado de Ana";

    mainContentArea.innerHTML = `
        <div class="diagnostico-container">
            <table class="diagnostico-table">
                <tr><th>Tema</th><th>Estado</th></tr>
                <tr><td>Interpretación de intervalos</td><td>Bien</td></tr>
                <tr><td>Valor crítico</td><td>Bien</td></tr>
                <tr><td>Error estándar</td><td><span style="color: #e74c3c; font-weight: bold;">Reforzar</span></td></tr>
                <tr><td>Margen de error</td><td>En proceso</td></tr>
                <tr><td>Construcción del intervalo</td><td>En proceso</td></tr>
                <tr><td>Intervalo para proporción</td><td>Pendiente</td></tr>
            </table>
            <div class="recomendacion-box mt-20">
                <p><strong>Recomendación:</strong> Tu principal dificultad esta semana está en distinguir desvío estándar de error estándar. Te recomendamos resolver el ejercicio 4, reintentar el ejercicio 5 y sumarte al grupo de estudio del jueves.</p>
            </div>
        </div>
    `;
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