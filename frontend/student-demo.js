// State variables for the demo
let error_estandar_dificultad = false;

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
    mainTitle.textContent = "Teoría guiada: Intervalos de confianza";
    mainDesc.textContent = "Basado en: C08 Intervalos de Confianza.pdf";

    // Setup HTML for blocks. Block 1 is visible, others hidden.
    mainContentArea.innerHTML = `
        <div id="teoria-container">
            <!-- Bloque 1 -->
            <div class="teoria-bloque" id="bloque-1">
                <h3>¿Qué es estimar un parámetro?</h3>
                <p>En muchos problemas no conocemos un valor poblacional, como la media real de una población. Entonces usamos una muestra para estimarlo.</p>
                <div class="pregunta-box">
                    <p><strong>¿Qué valor suele calcularse a partir de una muestra?</strong></p>
                    <label><input type="radio" name="p1" value="A"> A. Parámetro poblacional</label><br>
                    <label><input type="radio" name="p1" value="B"> B. Estimador</label><br>
                    <label><input type="radio" name="p1" value="C"> C. Nivel de confianza</label><br>
                    <label><input type="radio" name="p1" value="D"> D. Tabla normal</label><br>
                    <button class="demo-btn small-btn mt-10" id="btn-p1">Responder</button>
                    <div id="feedback-p1" class="feedback-msg"></div>
                </div>
            </div>

            <!-- Bloque 2 -->
            <div class="teoria-bloque hidden" id="bloque-2">
                <h3>¿Qué es un intervalo de confianza?</h3>
                <p>Un intervalo de confianza da un rango plausible de valores para un parámetro poblacional, construido a partir de una muestra y un nivel de confianza.</p>
                <div class="pregunta-box">
                    <p><strong>¿Qué representa un intervalo de confianza?</strong></p>
                    <label><input type="radio" name="p2" value="A"> A. Un único valor exacto del parámetro</label><br>
                    <label><input type="radio" name="p2" value="B"> B. Un rango plausible para el parámetro</label><br>
                    <label><input type="radio" name="p2" value="C"> C. El tamaño de la muestra</label><br>
                    <label><input type="radio" name="p2" value="D"> D. La cantidad de errores del ejercicio</label><br>
                    <button class="demo-btn small-btn mt-10" id="btn-p2">Responder</button>
                    <div id="feedback-p2" class="feedback-msg"></div>
                </div>
            </div>

            <!-- Bloque 3 -->
            <div class="teoria-bloque hidden" id="bloque-3">
                <h3>Desvío estándar vs error estándar</h3>
                <p>El desvío estándar mide variabilidad de los datos. El error estándar mide variabilidad del estimador, por ejemplo de la media muestral. Para una media, se calcula como s / √n.</p>
                <div class="pregunta-box">
                    <p><strong>Si s = 12 y n = 36, ¿cuál es el error estándar?</strong></p>
                    <label><input type="radio" name="p3" value="A"> A. 12</label><br>
                    <label><input type="radio" name="p3" value="B"> B. 36</label><br>
                    <label><input type="radio" name="p3" value="C"> C. 12 / √36 = 2</label><br>
                    <label><input type="radio" name="p3" value="D"> D. 1.96 × 12</label><br>
                    <button class="demo-btn small-btn mt-10" id="btn-p3">Responder</button>
                    <div id="feedback-p3" class="feedback-msg"></div>
                </div>
            </div>

            <!-- Bloque 4 -->
            <div class="teoria-bloque hidden" id="bloque-4">
                <h3>Margen de error</h3>
                <p>El margen de error se calcula multiplicando el valor crítico por el error estándar.</p>
                <div class="pregunta-box">
                    <p><strong>Para un intervalo al 95%, si el valor crítico es 1.96 y el error estándar es 2, ¿cuál es el margen de error?</strong></p>
                    <label><input type="radio" name="p4" value="A"> A. 1.96</label><br>
                    <label><input type="radio" name="p4" value="B"> B. 2</label><br>
                    <label><input type="radio" name="p4" value="C"> C. 3.92</label><br>
                    <label><input type="radio" name="p4" value="D"> D. 12</label><br>
                    <button class="demo-btn small-btn mt-10" id="btn-p4">Responder</button>
                    <div id="feedback-p4" class="feedback-msg"></div>
                </div>
            </div>

            <!-- Bloque 5 -->
            <div class="teoria-bloque hidden" id="bloque-5">
                <h3>Interpretación</h3>
                <p>Un intervalo de confianza no significa que haya 95% de probabilidad de que el parámetro esté en ese intervalo particular. Significa que el procedimiento usado para construir intervalos captura el parámetro en el 95% de las muestras, bajo ciertas condiciones.</p>
                <div class="pregunta-box">
                    <p><strong>¿Cuál interpretación es más adecuada?</strong></p>
                    <label><input type="radio" name="p5" value="A"> A. La media poblacional seguro está en el intervalo</label><br>
                    <label><input type="radio" name="p5" value="B"> B. El intervalo contiene el 95% de los datos</label><br>
                    <label><input type="radio" name="p5" value="C"> C. Con 95% de confianza, estimamos que la media poblacional está en ese rango</label><br>
                    <label><input type="radio" name="p5" value="D"> D. El 95% de los alumnos está dentro del intervalo</label><br>
                    <button class="demo-btn small-btn mt-10" id="btn-p5">Responder</button>
                    <div id="feedback-p5" class="feedback-msg"></div>
                </div>
            </div>

            <!-- Ejemplo guiado -->
            <div class="teoria-bloque hidden" id="bloque-ejemplo">
                <h3>Ejemplo guiado</h3>
                <div class="ejemplo-box">
                    <p><strong>Ejercicio:</strong> Una muestra de 36 estudiantes tiene media 72 y desvío estándar 12. Construir un intervalo de confianza del 95% para la media poblacional.</p>
                    <p><strong>Datos:</strong><br>n = 36<br>media muestral = 72<br>s = 12<br>nivel de confianza = 95%</p>
                    <p><strong>Paso 1:</strong> Identificar que se quiere estimar la media poblacional.</p>
                    <p><strong>Paso 2:</strong> Calcular el error estándar:<br>s / √n = 12 / √36 = 2</p>
                    <p><strong>Paso 3:</strong> Usar valor crítico 1.96.</p>
                    <p><strong>Paso 4:</strong> Calcular margen de error:<br>1.96 × 2 = 3.92</p>
                    <p><strong>Paso 5:</strong> Construir intervalo:<br>72 ± 3.92 = [68.08 ; 75.92]</p>
                    <p><strong>Interpretación:</strong> Con un 95% de confianza, se estima que la media poblacional se encuentra entre 68.08 y 75.92.</p>
                </div>
                <p style="margin-top: 15px;">Ya completaste la teoría necesaria para empezar la práctica. JUNTOS te recomienda comenzar con ejercicios centrados en error estándar e intervalos para medias.</p>
                <button id="btn-ir-ejercicios" class="demo-btn primary mt-10">Ir a ejercicios recomendados</button>
            </div>
        </div>
    `;

    // Logic for blocks
    const setupBlock = (btnId, radioName, correctVal, nextBlockId, errorMsg) => {
        const btn = document.getElementById(btnId);
        btn.addEventListener('click', () => {
            const selected = document.querySelector(`input[name="${radioName}"]:checked`);
            const feedback = document.getElementById(`feedback-${radioName}`);

            if (!selected) return;

            if (selected.value === correctVal) {
                feedback.innerHTML = '<span style="color: green;">¡Correcto!</span>';
                setTimeout(() => {
                    document.getElementById(nextBlockId).classList.remove('hidden');
                }, 1000);
            } else {
                if (radioName === 'p3') error_estandar_dificultad = true;
                feedback.innerHTML = `<span style="color: red;">${errorMsg}</span>`;
            }
        });
    };

    setupBlock('btn-p1', 'p1', 'B', 'bloque-2', 'Un estimador se calcula con datos muestrales y se usa para aproximar un parámetro poblacional.');
    setupBlock('btn-p2', 'p2', 'B', 'bloque-3', 'Pensá de nuevo. El intervalo da un rango de valores donde creemos que está el parámetro.');
    setupBlock('btn-p3', 'p3', 'C', 'bloque-4', 'Acá aparece una confusión común: usar el desvío estándar como si fuera el error estándar. El desvío estándar describe la variabilidad de los datos; el error estándar describe la variabilidad de la media muestral.');
    setupBlock('btn-p4', 'p4', 'C', 'bloque-5', 'Revisá el cálculo. Es 1.96 por 2.');
    setupBlock('btn-p5', 'p5', 'C', 'bloque-ejemplo', 'Recordá que la confianza es sobre el procedimiento, y nos da un rango de estimación.');

    document.getElementById('btn-ir-ejercicios').addEventListener('click', () => {
        clickSidebarMenu('guia');
    });
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
