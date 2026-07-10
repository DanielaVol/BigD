
const TEACHER_WEEKS = [
  {
    id: "semana-1",
    number: 1,
    title: "Probabilidad básica",
    status: "Completada"
  },
  {
    id: "semana-2",
    number: 2,
    title: "Probabilidad condicional",
    status: "Refuerzo recomendado"
  },
  {
    id: "semana-3",
    number: 3,
    title: "Variables aleatorias",
    status: "Completada"
  },
  {
    id: "semana-4",
    number: 4,
    title: "Variables aleatorias discretas",
    status: "En curso"
  }
];

function getTeacherSelectedWeekId() {
    return localStorage.getItem("juntos_teacher_selected_week") || "semana-4";
}

function setTeacherSelectedWeekId(weekId) {
    localStorage.setItem("juntos_teacher_selected_week", weekId);
}

function getTeacherSelectedWeek() {
    const selectedId = getTeacherSelectedWeekId();
    return TEACHER_WEEKS.find(w => w.id === selectedId) || TEACHER_WEEKS[3];
}

function updateTeacherWeekBadge() {
    const week = getTeacherSelectedWeek();
    const badge = document.getElementById("teacher-week-badge");
    if (!badge) return;

    badge.innerHTML = `
        <div class="week-badge-label">Semana activa</div>
        <select id="teacher-week-selector" class="week-selector">
            ${TEACHER_WEEKS.map(w => `
                <option value="${w.id}" ${w.id === week.id ? "selected" : ""}>
                    Semana ${w.number} — ${w.title}
                </option>
            `).join("")}
        </select>
        <div class="week-badge-topic">${week.status}</div>
    `;

    const selector = document.getElementById("teacher-week-selector");

    if (selector) {
        selector.addEventListener("change", (e) => {
            setTeacherSelectedWeekId(e.target.value);
            updateTeacherWeekBadge();

            const activeItem = document.querySelector(".sidebar-menu li.active");
            if (activeItem) activeItem.click();
        });
    }
}

window.renderTeacherSection = function(target, sectionName, mainContentArea, mainTitle, mainDesc) {
    updateTeacherWeekBadge();
    if (!mainContentArea || !mainTitle || !mainDesc) return false;

    const week = getTeacherSelectedWeek();
    let weekContextHtml = '';
    if (week.id !== 'semana-4' && (target === 'dashboard' || target === 'consultas' || target === 'grupos')) {
        weekContextHtml = `
            <div class="teacher-week-context">
                <div style="font-weight: 500;">Semana activa: Semana ${week.number} — ${week.title} (Estado: ${week.status})</div>
                <div style="font-size: 0.9rem; margin-top: 5px;">En este prototipo, la demo completa está cargada para Semana 4. La selección de semana muestra cómo el sistema permitiría revisar otras semanas.</div>
            </div>
        `;
    }

    if (target === 'dashboard') {
        mainTitle.textContent = "Dashboard docente";
        mainDesc.innerHTML = "Semana 4 &mdash; Variables aleatorias discretas";

        mainContentArea.innerHTML = `
            <div class="teacher-dashboard">
                ${weekContextHtml}
                <section class="teacher-section">
                    <h2>1. Resumen ejecutivo</h2>
                    <div class="cards-grid teacher-summary-grid">
                        <div class="stat-card">
                            <div class="stat-card-title">Estudiantes activos</div>
                            <div class="stat-card-value">83</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-title">En riesgo</div>
                            <div class="stat-card-value risk-high">14</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-title">Tema con mayor dificultad</div>
                            <div class="stat-card-value" style="font-size: 1.1rem;">Función de distribución discreta</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-title">Ejercicio más problemático</div>
                            <div class="stat-card-value" style="font-size: 1.2rem;">Ejercicio 3</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-title">Intervenciones sugeridas</div>
                            <div class="stat-card-value">4</div>
                        </div>
                    </div>
                </section>

                <section class="teacher-section">
                    <h2>2. Alertas tempranas</h2>
                    <div class="cards-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
                        <div class="stat-card teacher-alert-card risk-medium">
                            <h3>Ana Torres</h3>
                            <p><strong>Riesgo:</strong> medio</p>
                            <p><strong>Motivo:</strong>
                                <ul>
                                    <li>dificultad repetida en identificación de valores posibles;</li>
                                    <li>todavía no resolvió ejercicios obligatorios;</li>
                                    <li>pidió ayuda varias veces en el mismo concepto.</li>
                                </ul>
                            </p>
                            <p><strong>Acción sugerida:</strong> Recomendar ejercicio adicional y grupo de estudio.</p>
                            <div class="card-actions">
                                <button class="btn btn-secondary btn-sm" onclick="showStudentDetail('Ana Torres')">Ver detalle</button>
                                <button class="btn btn-primary btn-sm">Enviar mensaje</button>
                            </div>
                        </div>

                        <div class="stat-card teacher-alert-card risk-high">
                            <h3>Diego Pérez</h3>
                            <p><strong>Riesgo:</strong> alto</p>
                            <p><strong>Motivo:</strong>
                                <ul>
                                    <li>7 días sin actividad;</li>
                                    <li>no inició la guía;</li>
                                    <li>diagnóstico pendiente.</li>
                                </ul>
                            </p>
                            <p><strong>Acción sugerida:</strong> Enviar mensaje de recuperación.</p>
                            <div class="card-actions">
                                <button class="btn btn-secondary btn-sm" onclick="showStudentDetail('Diego Pérez')">Ver detalle</button>
                                <button class="btn btn-primary btn-sm">Enviar mensaje</button>
                            </div>
                        </div>

                        <div class="stat-card teacher-alert-card risk-low">
                            <h3>Camila Ruiz</h3>
                            <p><strong>Riesgo:</strong> bajo</p>
                            <p><strong>Motivo:</strong>
                                <ul>
                                    <li>resolvió correctamente ejercicios 1 y 2;</li>
                                    <li>puede ayudar en grupo de estudio.</li>
                                </ul>
                            </p>
                            <p><strong>Acción sugerida:</strong> Invitar como apoyo en grupo.</p>
                            <div class="card-actions">
                                <button class="btn btn-secondary btn-sm" onclick="showStudentDetail('Camila Ruiz')">Ver detalle</button>
                                <button class="btn btn-primary btn-sm">Invitar a grupo</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="teacher-section">
                    <h2>3. Dificultades frecuentes del curso</h2>
                    <ul class="teacher-list">
                        <li><strong>No identifican todos los valores posibles</strong> &mdash; 18 estudiantes</li>
                        <li><strong>Confunden función de probabilidad con función de distribución</strong> &mdash; 15 estudiantes</li>
                        <li><strong>Omiten el valor 0 en variables de conteo</strong> &mdash; 11 estudiantes</li>
                        <li><strong>No reconocen cuándo usar Binomial</strong> &mdash; 9 estudiantes</li>
                    </ul>
                </section>

                <section class="teacher-section">
                    <h2>4. Ejercicios problemáticos</h2>
                    <div class="cards-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
                        <div class="stat-card teacher-card">
                            <h3>Ejercicio 3 &mdash; Función de distribución discreta</h3>
                            <p class="risk-high">42% con errores</p>
                            <p><strong>Error frecuente:</strong> no acumulan probabilidades</p>
                        </div>
                        <div class="stat-card teacher-card">
                            <h3>Ejercicio 6 &mdash; Binomial</h3>
                            <p class="risk-medium">31% con errores</p>
                            <p><strong>Error frecuente:</strong> no identifican n y p</p>
                        </div>
                        <div class="stat-card teacher-card">
                            <h3>Ejercicio 8 &mdash; Poisson</h3>
                            <p class="risk-medium">27% con errores</p>
                            <p><strong>Error frecuente:</strong> confunden promedio λ con probabilidad</p>
                        </div>
                    </div>
                </section>

                <section class="teacher-section">
                    <h2>5. Recomendaciones de JUNTOS para la próxima clase</h2>
                    <div class="teacher-recommendation-card">
                        <h3>Recomendaciones de JUNTOS</h3>
                        <ol>
                            <li><strong>Dedicar 10 minutos a repasar función de distribución acumulada.</strong><br>Motivo: 15 estudiantes confunden P(X=x) con P(X≤x).</li>
                            <li><strong>Resolver en clase un ejemplo de variable que incluye el valor 0.</strong><br>Motivo: 11 estudiantes omitieron el 0 en variables de conteo.</li>
                            <li><strong>Activar grupo de estudio sobre valores posibles.</strong><br>Motivo: hay 6 estudiantes con dificultad similar y 3 estudiantes que ya resolvieron bien.</li>
                            <li><strong>Enviar mensaje de recuperación a estudiantes sin actividad.</strong><br>Motivo: 5 estudiantes no ingresan hace más de una semana.</li>
                        </ol>
                    </div>
                </section>

                <section class="teacher-section">
                    <h2>6. Grupos sugeridos</h2>
                    <div class="stat-card teacher-card group-teacher-card">
                        <h3>Grupo 1 &mdash; Valores posibles de variables discretas</h3>
                        <ul>
                            <li>Ana Torres &mdash; Refuerzo conceptual</li>
                            <li>Martín López &mdash; Refuerzo práctico</li>
                            <li>Sofía Díaz &mdash; Refuerzo de modelos</li>
                            <li>Camila Ruiz &mdash; Apoyo par</li>
                            <li>Diego Pérez &mdash; Recuperación guiada</li>
                        </ul>
                        <p style="margin-top: 15px;"><strong>Actividad sugerida:</strong> Resolver ejercicios de conteo y comparar valores posibles.</p>
                        <button class="btn btn-primary btn-sm" style="margin-top: 10px;" onclick="alert('Grupo creado para la Semana 4. En una versión completa, JUNTOS enviaría la invitación a los estudiantes.')">Crear grupo</button>
                    </div>
                </section>

                <section class="teacher-section">
                    <h2>7. Vista rápida de estudiantes</h2>
                    <div class="table-responsive">
                        <table class="teacher-table">
                            <thead>
                                <tr>
                                    <th>Estudiante</th>
                                    <th>Estado</th>
                                    <th>Dificultad principal</th>
                                    <th>Acción sugerida</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Ana Torres</td>
                                    <td><span class="badge risk-medium-bg">Medio</span></td>
                                    <td>Valores posibles</td>
                                    <td>Ejercicio adicional + grupo</td>
                                    <td><button class="btn btn-secondary btn-sm" onclick="showStudentDetail('Ana Torres')">Ver detalle</button></td>
                                </tr>
                                <tr>
                                    <td>Diego Pérez</td>
                                    <td><span class="badge risk-high-bg">Alto</span></td>
                                    <td>Sin actividad</td>
                                    <td>Mensaje de recuperación</td>
                                    <td><button class="btn btn-secondary btn-sm" onclick="showStudentDetail('Diego Pérez')">Ver detalle</button></td>
                                </tr>
                                <tr>
                                    <td>Camila Ruiz</td>
                                    <td><span class="badge risk-low-bg">Bajo</span></td>
                                    <td>Sin dificultad crítica</td>
                                    <td>Invitar a grupo</td>
                                    <td><button class="btn btn-secondary btn-sm" onclick="showStudentDetail('Camila Ruiz')">Ver detalle</button></td>
                                </tr>
                                <tr>
                                    <td>Martín López</td>
                                    <td><span class="badge risk-medium-bg">Medio</span></td>
                                    <td>Función de distribución</td>
                                    <td>Repaso guiado</td>
                                    <td><button class="btn btn-secondary btn-sm" onclick="showStudentDetail('Martín López')">Ver detalle</button></td>
                                </tr>
                                <tr>
                                    <td>Sofía Díaz</td>
                                    <td><span class="badge risk-medium-bg">Medio</span></td>
                                    <td>Binomial</td>
                                    <td>Reforzar parámetros n y p</td>
                                    <td><button class="btn btn-secondary btn-sm" onclick="showStudentDetail('Sofía Díaz')">Ver detalle</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        `;
        return true;
    }

    if (target === 'configurar') {
        mainTitle.textContent = "Configurar semana con IA";
        mainDesc.textContent = "Cargá materiales y objetivos, y JUNTOS armará la planificación de la semana.";

        mainContentArea.innerHTML = `
            <div class="teacher-dashboard">
                <section class="teacher-section">
                    <h2>A. Carga de información</h2>
                    <form class="teacher-form" onsubmit="event.preventDefault();">
                        <div class="teacher-form-group">
                            <label>Semana</label>
                            <input type="text" class="input-field" value="Semana 5" placeholder="Ej: Semana 5">
                        </div>
                        <div class="teacher-form-group">
                            <label>Tema de la semana</label>
                            <input type="text" class="input-field" value="Variables aleatorias continuas" placeholder="Ej: Variables aleatorias continuas">
                        </div>
                        <div class="teacher-form-group">
                            <label>Objetivos de aprendizaje</label>
                            <textarea class="input-field" rows="3" placeholder="Que los estudiantes comprendan la diferencia entre variable discreta y continua, función de densidad, probabilidad como área, función de distribución, esperanza y varianza.">Que los estudiantes comprendan la diferencia entre variable discreta y continua, función de densidad, probabilidad como área, función de distribución, esperanza y varianza.</textarea>
                        </div>
                        <div class="teacher-form-group">
                            <label>Conceptos importantes</label>
                            <textarea class="input-field" rows="3" placeholder="variable aleatoria continua; función de densidad; probabilidad como área; función de distribución; P(X=a)=0; esperanza; varianza.">variable aleatoria continua; función de densidad; probabilidad como área; función de distribución; P(X=a)=0; esperanza; varianza.</textarea>
                        </div>
                        <div class="teacher-form-group">
                            <label>Ejercicios obligatorios</label>
                            <textarea class="input-field" rows="2" placeholder="Ejercicios 1, 2, 3 y 4 del TP2.">Ejercicios 1, 2, 3 y 4 del TP2.</textarea>
                        </div>
                        <div class="teacher-form-group">
                            <label>Ejercicios adicionales de refuerzo</label>
                            <textarea class="input-field" rows="2" placeholder="Ejercicios A, B y C para reforzar densidad, función de distribución e integrales.">Ejercicios A, B y C para reforzar densidad, función de distribución e integrales.</textarea>
                        </div>
                        <div class="teacher-form-group">
                            <label>Errores frecuentes esperados</label>
                            <textarea class="input-field" rows="3" placeholder="Confundir f(x) con P(X=x). Pensar que la probabilidad puntual puede ser positiva. No interpretar el área bajo la curva. Usar fórmulas de variables discretas en variables continuas.">Confundir f(x) con P(X=x). Pensar que la probabilidad puntual puede ser positiva. No interpretar el área bajo la curva. Usar fórmulas de variables discretas en variables continuas.</textarea>
                        </div>
                        <div class="teacher-form-group">
                            <label>Directivas para el tutor IA</label>
                            <textarea class="input-field" rows="4" placeholder="No dar la respuesta final. Dar pistas progresivas. Si el alumno confunde densidad con probabilidad, explicar con área. Si no puede plantear la integral, ayudar a identificar los límites. Recomendar ejercicios adicionales si repite errores.">No dar la respuesta final. Dar pistas progresivas. Si el alumno confunde densidad con probabilidad, explicar con área. Si no puede plantear la integral, ayudar a identificar los límites. Recomendar ejercicios adicionales si repite errores.</textarea>
                        </div>
                    </form>
                </section>

                <section class="teacher-section">
                    <h2>B. Materiales de la semana</h2>
                    <div class="cards-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">

                        <div class="stat-card material-upload-card">
                            <h4>Apunte teórico</h4>
                            <p class="file-status risk-medium">Pendiente</p>
                            <input type="file" id="file-teoria" style="display:none;" onchange="handleSimulatedUpload(this, 'teoria-status')">
                            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('file-teoria').click()">Subir archivo</button>
                            <div id="teoria-status" class="loaded-file-badge"></div>
                        </div>

                        <div class="stat-card material-upload-card">
                            <h4>Guía obligatoria</h4>
                            <p class="file-status risk-medium">Pendiente</p>
                            <input type="file" id="file-guia" style="display:none;" onchange="handleSimulatedUpload(this, 'guia-status')">
                            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('file-guia').click()">Subir archivo</button>
                            <div id="guia-status" class="loaded-file-badge"></div>
                        </div>

                        <div class="stat-card material-upload-card">
                            <h4>Respuestas docentes</h4>
                            <p class="file-status risk-low">Opcional</p>
                            <input type="file" id="file-resp" style="display:none;" onchange="handleSimulatedUpload(this, 'resp-status')">
                            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('file-resp').click()">Subir archivo</button>
                            <div id="resp-status" class="loaded-file-badge"></div>
                        </div>

                        <div class="stat-card material-upload-card">
                            <h4>Ejercicios adicionales</h4>
                            <p class="file-status risk-low">Opcional</p>
                            <input type="file" id="file-add" style="display:none;" onchange="handleSimulatedUpload(this, 'add-status')">
                            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('file-add').click()">Subir archivo</button>
                            <div id="add-status" class="loaded-file-badge"></div>
                        </div>

                    </div>
                </section>

                <section class="teacher-section" style="text-align: center; margin-top: 30px;">
                    <button class="btn btn-primary" style="font-size: 1.1rem; padding: 15px 30px;" onclick="showAIGeneration()">Generar planificación con IA</button>
                </section>

                <div id="ai-plan-result" style="display: none; margin-top: 30px;">
                    <section class="teacher-section">
                        <div class="ai-plan-card">
                            <h2 style="color: var(--primary-color);">JUNTOS generó la configuración pedagógica de la semana</h2>

                            <div class="plan-content" style="text-align: left; margin-top: 20px;">
                                <h3>Plan pedagógico de la semana</h3>
                                <p><strong>Objetivo general:</strong> Que el estudiante comprenda que en variables continuas la probabilidad se calcula sobre intervalos y no en puntos aislados.</p>

                                <h4>Conceptos centrales:</h4>
                                <ol>
                                    <li>Diferencia entre variable discreta y continua.</li>
                                    <li>Función de densidad.</li>
                                    <li>Probabilidad como área.</li>
                                    <li>Función de distribución acumulada.</li>
                                    <li>Esperanza y varianza.</li>
                                </ol>

                                <h4>Errores esperados:</h4>
                                <ul>
                                    <li>Confundir f(x) con P(X=x).</li>
                                    <li>Pensar que P(X=a) puede ser positiva.</li>
                                    <li>No interpretar el área bajo la curva.</li>
                                    <li>Usar fórmulas de variables discretas.</li>
                                </ul>

                                <h4>Reglas para el tutor IA:</h4>
                                <ul>
                                    <li>No dar respuestas finales.</li>
                                    <li>Primero pedir que identifique qué representa la variable.</li>
                                    <li>Si confunde densidad con probabilidad, explicar que la probabilidad se calcula como área.</li>
                                    <li>Si se traba con integrales, ofrecer una pista paso a paso.</li>
                                    <li>Recomendar ejercicios adicionales si repite el error.</li>
                                </ul>

                                <h4>Ejercicios obligatorios:</h4>
                                <ul>
                                    <li>Ejercicio 1: densidad y constante de normalización.</li>
                                    <li>Ejercicio 2: cálculo de probabilidades por intervalos.</li>
                                    <li>Ejercicio 3: función de distribución.</li>
                                    <li>Ejercicio 4: esperanza.</li>
                                </ul>

                                <h4>Ejercicios de refuerzo:</h4>
                                <ul>
                                    <li>Si falla en densidad: adicional A.</li>
                                    <li>Si falla en distribución acumulada: adicional B.</li>
                                    <li>Si falla en esperanza: adicional C.</li>
                                </ul>

                                <h4>Recomendaciones para el docente:</h4>
                                <ul>
                                    <li>Comenzar la clase comparando variable discreta y continua.</li>
                                    <li>Mostrar visualmente que la probabilidad en un punto es cero.</li>
                                    <li>Resolver un ejemplo de área bajo la curva antes de pasar a integrales más largas.</li>
                                </ul>
                            </div>

                            <div class="card-actions" style="margin-top: 30px; justify-content: center; gap: 15px;">
                                <button class="btn btn-primary" onclick="alert('Configuración aprobada. En una versión completa, estas pautas alimentarían la teoría guiada, la corrección de ejercicios, el diagnóstico y las recomendaciones de la semana.')">Aprobar configuración</button>
                                <button class="btn btn-secondary">Editar directivas</button>
                                <button class="btn btn-secondary">Guardar como borrador</button>
                            </div>
                        </div>
                    </section>
                </div>

            </div>
        `;

        return true;
    }

    if (target === 'estudiantes') {
        mainTitle.textContent = "Seguimiento de estudiantes";
        mainDesc.textContent = "Monitoreo individual del progreso y dificultades en la semana activa.";

        mainContentArea.innerHTML = `
            <div class="teacher-dashboard">
                <section class="teacher-section">
                    <div class="table-responsive">
                        <table class="teacher-table">
                            <thead>
                                <tr>
                                    <th>Estudiante</th>
                                    <th>Última actividad</th>
                                    <th>Estado</th>
                                    <th>Dificultad principal</th>
                                    <th>Ejercicios resueltos</th>
                                    <th>Acción sugerida</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Ana Torres</td>
                                    <td>Hoy</td>
                                    <td><span class="badge risk-medium-bg">Riesgo medio</span></td>
                                    <td>Valores posibles</td>
                                    <td>1/8</td>
                                    <td>Recomendar refuerzo</td>
                                    <td><button class="btn btn-secondary btn-sm" onclick="showStudentDetail('Ana Torres')">Ver detalle</button></td>
                                </tr>
                                <tr>
                                    <td>Diego Pérez</td>
                                    <td>Hace 7 días</td>
                                    <td><span class="badge risk-high-bg">Riesgo alto</span></td>
                                    <td>Sin actividad</td>
                                    <td>0/8</td>
                                    <td>Enviar mensaje</td>
                                    <td><button class="btn btn-secondary btn-sm" onclick="showStudentDetail('Diego Pérez')">Ver detalle</button></td>
                                </tr>
                                <tr>
                                    <td>Camila Ruiz</td>
                                    <td>Hoy</td>
                                    <td><span class="badge risk-low-bg">Bajo</span></td>
                                    <td>Sin dificultad crítica</td>
                                    <td>3/8</td>
                                    <td>Invitar como apoyo</td>
                                    <td><button class="btn btn-secondary btn-sm" onclick="showStudentDetail('Camila Ruiz')">Ver detalle</button></td>
                                </tr>
                                <tr>
                                    <td>Martín López</td>
                                    <td>Ayer</td>
                                    <td><span class="badge risk-medium-bg">Medio</span></td>
                                    <td>Función de distribución</td>
                                    <td>1/8</td>
                                    <td>Repaso guiado</td>
                                    <td><button class="btn btn-secondary btn-sm" onclick="showStudentDetail('Martín López')">Ver detalle</button></td>
                                </tr>
                                <tr>
                                    <td>Sofía Díaz</td>
                                    <td>Hoy</td>
                                    <td><span class="badge risk-medium-bg">Medio</span></td>
                                    <td>Binomial</td>
                                    <td>2/8</td>
                                    <td>Reforzar n y p</td>
                                    <td><button class="btn btn-secondary btn-sm" onclick="showStudentDetail('Sofía Díaz')">Ver detalle</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <div id="student-detail-card" style="display:none; margin-top: 20px;">
                    <div class="stat-card teacher-card" style="border-left: 4px solid var(--primary-color);">
                        <h3 id="student-detail-name">Detalle de estudiante</h3>
                        <p><strong>Tema actual:</strong> Variables aleatorias discretas.</p>
                        <p><strong>Dificultad principal:</strong> identificación de valores posibles.</p>
                        <p><strong>Evidencia:</strong> omitió el valor 0 en ejercicio de conteo.</p>
                        <p><strong>Recomendación de JUNTOS:</strong> ejercicio adicional + grupo de estudio.</p>
                        <p><strong>Última interacción:</strong> consulta en Resolver ejercicio.</p>
                        <div class="card-actions" style="margin-top: 15px;">
                            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('student-detail-card').style.display='none'">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return true;
    }

    if (target === 'grupos') {
        mainTitle.textContent = "Grupos sugeridos";
        mainDesc.textContent = "Agrupaciones sugeridas por JUNTOS basadas en dificultades complementarias.";

        mainContentArea.innerHTML = `
            <div class="teacher-dashboard">
                ${weekContextHtml}
                <section class="teacher-section">
                    <div class="cards-grid" style="grid-template-columns: 1fr;">

                        <div class="stat-card teacher-card">
                            <h3 style="color: var(--primary-color); border-bottom: 1px solid #eee; padding-bottom: 10px;">Grupo A &mdash; Valores posibles de variables discretas</h3>

                            <div style="margin-top: 15px; overflow-x: auto;">
                                <table class="group-role-table" style="width:100%; border-collapse:collapse; text-align:left;">
                                    <thead>
                                        <tr style="border-bottom: 2px solid #ddd;">
                                            <th style="padding:8px;">Estudiante</th>
                                            <th style="padding:8px;">Rol</th>
                                            <th style="padding:8px;">Motivo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style="border-bottom: 1px solid #eee;">
                                            <td style="padding:8px;">Ana Torres</td>
                                            <td style="padding:8px;"><span class="role-badge role-refuerzo">Refuerzo conceptual</span></td>
                                            <td style="padding:8px;">Omite valores posibles, especialmente el 0.</td>
                                        </tr>
                                        <tr style="border-bottom: 1px solid #eee;">
                                            <td style="padding:8px;">Martín López</td>
                                            <td style="padding:8px;"><span class="role-badge role-refuerzo">Refuerzo práctico</span></td>
                                            <td style="padding:8px;">Dificultad al pasar de valores posibles a función de distribución.</td>
                                        </tr>
                                        <tr style="border-bottom: 1px solid #eee;">
                                            <td style="padding:8px;">Sofía Díaz</td>
                                            <td style="padding:8px;"><span class="role-badge role-refuerzo">Refuerzo de modelos</span></td>
                                            <td style="padding:8px;">Confunde cuándo usar Binomial.</td>
                                        </tr>
                                        <tr style="border-bottom: 1px solid #eee;">
                                            <td style="padding:8px;">Camila Ruiz</td>
                                            <td style="padding:8px;"><span class="role-badge role-apoyo">Apoyo par</span></td>
                                            <td style="padding:8px;">Resolución correcta en ejercicios 1 y 2.</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:8px;">Diego Pérez</td>
                                            <td style="padding:8px;"><span class="role-badge role-recuperacion">Recuperación guiada</span></td>
                                            <td style="padding:8px;">Baja actividad, conviene integrarlo al trabajo grupal.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div style="margin-top: 15px;">
                                <p><strong>Actividad sugerida:</strong> Resolver ejercicios de conteo y comparar valores posibles.</p>
                                <p style="margin-top: 5px;"><strong>Producto del grupo:</strong> Cada estudiante debe explicar un paso:</p>
                                <ul style="margin-top: 5px; padding-left: 20px;">
                                    <li>listar resultados;</li>
                                    <li>definir X;</li>
                                    <li>armar valores posibles;</li>
                                    <li>revisar si aparece 0;</li>
                                    <li>explicar el criterio usado.</li>
                                </ul>
                            </div>

                            <div class="card-actions" style="margin-top: 20px;">
                                <button class="btn btn-primary" onclick="alert('Grupo creado para la semana. En una versión completa, JUNTOS enviaría invitaciones y propondría una actividad guiada.')">Crear grupo</button>
                            </div>
                        </div>

                        <div class="stat-card teacher-card">
                            <h3 style="color: var(--primary-color); border-bottom: 1px solid #eee; padding-bottom: 10px;">Grupo B &mdash; Función de distribución acumulada</h3>

                            <div style="margin-top: 15px; overflow-x: auto;">
                                <table class="group-role-table" style="width:100%; border-collapse:collapse; text-align:left;">
                                    <thead>
                                        <tr style="border-bottom: 2px solid #ddd;">
                                            <th style="padding:8px;">Estudiante</th>
                                            <th style="padding:8px;">Rol</th>
                                            <th style="padding:8px;">Motivo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style="border-bottom: 1px solid #eee;">
                                            <td style="padding:8px;">Lucas Fernández</td>
                                            <td style="padding:8px;"><span class="role-badge role-refuerzo">Refuerzo conceptual</span></td>
                                            <td style="padding:8px;">Confunde P(X=x) con P(X≤x).</td>
                                        </tr>
                                        <tr style="border-bottom: 1px solid #eee;">
                                            <td style="padding:8px;">Paula Gómez</td>
                                            <td style="padding:8px;"><span class="role-badge role-refuerzo">Refuerzo práctico</span></td>
                                            <td style="padding:8px;">No acumula probabilidades.</td>
                                        </tr>
                                        <tr style="border-bottom: 1px solid #eee;">
                                            <td style="padding:8px;">Juan Méndez</td>
                                            <td style="padding:8px;"><span class="role-badge role-refuerzo">Refuerzo práctico</span></td>
                                            <td style="padding:8px;">Construye F(x) incompleta.</td>
                                        </tr>
                                        <tr style="border-bottom: 1px solid #eee;">
                                            <td style="padding:8px;">Camila Ruiz</td>
                                            <td style="padding:8px;"><span class="role-badge role-apoyo">Apoyo par</span></td>
                                            <td style="padding:8px;">Puede ayudar a verificar acumulaciones.</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:8px;">Ana Torres</td>
                                            <td style="padding:8px;"><span class="role-badge role-opcional">Participación opcional</span></td>
                                            <td style="padding:8px;">Puede reforzar conexión entre valores posibles y F(x).</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div style="margin-top: 15px;">
                                <p><strong>Actividad:</strong> Construir F(x) paso a paso a partir de una tabla de probabilidades.</p>
                            </div>

                            <div class="card-actions" style="margin-top: 20px;">
                                <button class="btn btn-primary" onclick="alert('Grupo creado para la semana. En una versión completa, JUNTOS enviaría invitaciones y propondría una actividad guiada.')">Crear grupo</button>
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        `;
        return true;
    }

    if (target === 'material') {
        mainTitle.textContent = "Material cargado";
        mainDesc.textContent = "Recursos disponibles para la Semana 4 y cómo los utiliza la IA.";

        mainContentArea.innerHTML = `
            <div class="teacher-dashboard">
                <section class="teacher-section">
                    <div class="cards-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">

                        <div class="stat-card teacher-card">
                            <h3>Apunte de variables aleatorias discretas</h3>
                            <p><strong>Estado:</strong> <span class="file-status risk-low" style="color: var(--success-color);">cargado</span></p>
                            <p><strong>Uso:</strong> teoría guiada</p>
                        </div>

                        <div class="stat-card teacher-card">
                            <h3>TP1 &mdash; Ejercicios obligatorios</h3>
                            <p><strong>Estado:</strong> <span class="file-status risk-low" style="color: var(--success-color);">cargado</span></p>
                            <p><strong>Uso:</strong> práctica obligatoria</p>
                        </div>

                        <div class="stat-card teacher-card">
                            <h3>Respuestas TP1</h3>
                            <p><strong>Estado:</strong> <span class="file-status risk-low" style="color: var(--success-color);">cargado</span></p>
                            <p><strong>Uso:</strong> corrección y feedback</p>
                        </div>

                        <div class="stat-card teacher-card">
                            <h3>Ejercicios adicionales</h3>
                            <p><strong>Estado:</strong> <span class="file-status risk-low" style="color: var(--success-color);">cargado</span></p>
                            <p><strong>Uso:</strong> refuerzo personalizado</p>
                        </div>

                        <div class="stat-card teacher-card">
                            <h3>Ejercicios de parciales</h3>
                            <p><strong>Estado:</strong> <span class="file-status risk-low" style="color: var(--success-color);">cargado</span></p>
                            <p><strong>Uso:</strong> práctica integradora y grupos</p>
                        </div>

                    </div>
                </section>

                <section class="teacher-section">
                    <div class="stat-card teacher-card" style="background-color: var(--card-bg);">
                        <h3 style="color: var(--primary-color);">Cómo usa JUNTOS este material</h3>
                        <ul>
                            <li>Usa el apunte para explicar teoría.</li>
                            <li>Usa el TP1 como práctica obligatoria.</li>
                            <li>Usa respuestas docentes para orientar feedback sin dar soluciones completas.</li>
                            <li>Usa ejercicios adicionales cuando detecta dificultad.</li>
                            <li>Usa ejercicios de parciales para grupos de estudio o preparación integradora.</li>
                        </ul>
                    </div>
                </section>
            </div>
        `;
        return true;
    }

    if (target === 'consultas') {
        mainTitle.textContent = "Consultas docentes";
        mainDesc.textContent = "Consultá a JUNTOS sobre el avance de la semana, dificultades frecuentes y decisiones pedagógicas sugeridas.";

        mainContentArea.innerHTML = `
            <div class="teacher-dashboard">
                ${weekContextHtml}
                <section class="teacher-section">
                    <div class="teacher-query-context-card stat-card">
                        <h3 style="margin-top:0;">Semana activa: Semana 4 — Variables aleatorias discretas</h3>
                        <p><strong>Datos considerados por JUNTOS:</strong></p>
                        <ul style="margin-bottom:0; padding-left:20px; font-size:0.95rem;">
                            <li>actividad de estudiantes;</li>
                            <li>teoría guiada;</li>
                            <li>consultas en resolución de ejercicios;</li>
                            <li>ejercicios obligatorios;</li>
                            <li>dificultades detectadas;</li>
                            <li>grupos sugeridos;</li>
                            <li>material cargado por la cátedra.</li>
                        </ul>
                    </div>
                </section>

                <section class="teacher-section">
                    <div class="teacher-query-box">
                        <textarea id="teacher-ai-query" class="input-field" rows="4" placeholder="Preguntale a JUNTOS sobre el avance del curso, dificultades frecuentes, planificación de la próxima clase o estudiantes que requieren seguimiento..."></textarea>

                        <div class="teacher-query-categories" style="margin-top: 20px;">
                            <div class="teacher-query-category">
                                <h4>Categoría: Próxima clase</h4>
                                <div class="quick-queries" style="display: flex; flex-wrap: wrap; gap: 8px;">
                                    <button class="btn btn-secondary btn-sm" onclick="simulateTeacherQuery('¿Qué debería repasar en la próxima clase?')">¿Qué debería repasar en la próxima clase?</button>
                                    <button class="btn btn-secondary btn-sm" onclick="simulateTeacherQuery('¿Cómo reordenaría la explicación de la semana?')">¿Cómo reordenaría la explicación de la semana?</button>
                                    <button class="btn btn-secondary btn-sm" onclick="simulateTeacherQuery('¿Qué ejemplo conviene resolver en vivo?')">¿Qué ejemplo conviene resolver en vivo?</button>
                                </div>
                            </div>

                            <div class="teacher-query-category" style="margin-top: 15px;">
                                <h4>Categoría: Seguimiento de estudiantes</h4>
                                <div class="quick-queries" style="display: flex; flex-wrap: wrap; gap: 8px;">
                                    <button class="btn btn-secondary btn-sm" onclick="simulateTeacherQuery('¿Qué estudiantes necesitan seguimiento?')">¿Qué estudiantes necesitan seguimiento?</button>
                                    <button class="btn btn-secondary btn-sm" onclick="simulateTeacherQuery('¿Qué estudiantes están en riesgo alto?')">¿Qué estudiantes están en riesgo alto?</button>
                                    <button class="btn btn-secondary btn-sm" onclick="simulateTeacherQuery('¿Qué estudiantes pueden ayudar a otros?')">¿Qué estudiantes pueden ayudar a otros?</button>
                                </div>
                            </div>

                            <div class="teacher-query-category" style="margin-top: 15px;">
                                <h4>Categoría: Ejercicios y práctica</h4>
                                <div class="quick-queries" style="display: flex; flex-wrap: wrap; gap: 8px;">
                                    <button class="btn btn-secondary btn-sm" onclick="simulateTeacherQuery('¿Qué ejercicio resultó más difícil?')">¿Qué ejercicio resultó más difícil?</button>
                                    <button class="btn btn-secondary btn-sm" onclick="simulateTeacherQuery('¿Qué errores se repiten en la guía?')">¿Qué errores se repiten en la guía?</button>
                                    <button class="btn btn-secondary btn-sm" onclick="simulateTeacherQuery('¿Qué ejercicios adicionales conviene recomendar?')">¿Qué ejercicios adicionales conviene recomendar?</button>
                                </div>
                            </div>

                            <div class="teacher-query-category" style="margin-top: 15px;">
                                <h4>Categoría: Grupos de estudio</h4>
                                <div class="quick-queries" style="display: flex; flex-wrap: wrap; gap: 8px;">
                                    <button class="btn btn-secondary btn-sm" onclick="simulateTeacherQuery('¿Qué grupo de estudio conviene crear?')">¿Qué grupo de estudio conviene crear?</button>
                                    <button class="btn btn-secondary btn-sm" onclick="simulateTeacherQuery('¿Qué rol tendría cada estudiante en el grupo?')">¿Qué rol tendría cada estudiante en el grupo?</button>
                                    <button class="btn btn-secondary btn-sm" onclick="simulateTeacherQuery('¿Qué actividad debería hacer cada grupo?')">¿Qué actividad debería hacer cada grupo?</button>
                                </div>
                            </div>
                        </div>

                        <div style="margin-top: 25px; text-align: right;">
                            <button class="btn btn-primary" onclick="simulateTeacherQuery(document.getElementById('teacher-ai-query').value)">Consultar a JUNTOS</button>
                        </div>
                    </div>
                </section>

                <section id="teacher-response-section" class="teacher-section" style="display:none;">
                    <div id="teacher-query-response"></div>
                </section>
            </div>
        `;
        return true;
    }

    return false;
};

// Global helper functions for the simulated interactions
window.handleSimulatedUpload = function(inputElement, statusElementId) {
    if (inputElement.files && inputElement.files[0]) {
        const fileName = inputElement.files[0].name;
        const statusElement = document.getElementById(statusElementId);
        statusElement.innerHTML = `<span style="color: var(--success-color); font-weight: 500;">Archivo cargado para la demo: ${fileName}</span>`;

        const parent = statusElement.parentElement;
        const statusP = parent.querySelector('.file-status');
        if(statusP) {
            statusP.textContent = "Cargado";
            statusP.className = "file-status risk-low";
        }
    }
};

window.showAIGeneration = function() {
    const el = document.getElementById('ai-plan-result');
    if (el) {
        el.style.display = 'block';
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
    }
};

window.showStudentDetail = function(name) {
    const nameEl = document.getElementById('student-detail-name');
    const cardEl = document.getElementById('student-detail-card');
    if (nameEl && cardEl) {
        nameEl.textContent = "Detalle de " + name;
        cardEl.style.display = 'block';
        setTimeout(() => cardEl.scrollIntoView({ behavior: 'smooth' }), 100);
    }
};

window.simulateTeacherQuery = function(query) {
    if (!query || query.trim() === '') return;

    document.getElementById('teacher-ai-query').value = query;

    const responseEl = document.getElementById('teacher-query-response');
    let htmlContent = '';

    if (query.includes('repasar') || query.includes('próxima clase')) {
        htmlContent = `
            <div class="teacher-response-card">
                <div class="teacher-response-section-title">Consulta:</div>
                <p>${query}</p>

                <div class="teacher-response-section-title">Síntesis de JUNTOS:</div>
                <p>Conviene dedicar los primeros 10 minutos a función de distribución acumulada y luego reforzar variables de conteo que pueden tomar valor 0.</p>

                <div class="teacher-response-section-title">Evidencia:</div>
                <ul class="teacher-evidence-list">
                    <li>15 estudiantes confundieron P(X=x) con P(X≤x).</li>
                    <li>11 estudiantes omitieron el valor 0 en variables de conteo.</li>
                    <li>El Ejercicio 3 concentró el mayor porcentaje de errores.</li>
                </ul>

                <div class="teacher-action-box">
                    <strong style="display:block; margin-bottom:5px;">Acción sugerida:</strong>
                    Resolver en clase un ejemplo corto donde primero se construya la función de probabilidad y luego la función de distribución acumulada.
                </div>

                <div class="teacher-next-step-box">
                    <strong style="display:block; margin-bottom:5px;">Próximo paso:</strong>
                    Activar un ejercicio adicional para estudiantes con dificultad y crear un grupo de estudio sobre valores posibles.
                </div>
            </div>
        `;
    } else if (query.includes('rol tendría cada estudiante')) {
        htmlContent = `
            <div class="teacher-response-card">
                <div class="teacher-response-section-title">Consulta:</div>
                <p>${query}</p>

                <div class="teacher-response-section-title">Síntesis de JUNTOS:</div>
                <p>El grupo debería combinar estudiantes con dificultad en valores posibles con estudiantes que ya resolvieron correctamente ejercicios de conteo.</p>

                <div class="teacher-response-section-title">Roles sugeridos:</div>
                <ul class="teacher-evidence-list" style="list-style:none; padding-left:0;">
                    <li><strong>Ana Torres:</strong> estudiante en refuerzo. Debe practicar identificación de valores posibles.</li>
                    <li><strong>Martín López:</strong> estudiante en refuerzo. Debe trabajar función de distribución desde una tabla.</li>
                    <li><strong>Sofía Díaz:</strong> estudiante en refuerzo. Debe revisar parámetros de modelos discretos.</li>
                    <li><strong>Camila Ruiz:</strong> apoyo par. Puede ayudar a revisar procedimientos sin dar respuestas.</li>
                    <li><strong>Diego Pérez:</strong> recuperación guiada. Conviene integrarlo para reactivar participación.</li>
                </ul>

                <div class="teacher-action-box">
                    <strong style="display:block; margin-bottom:5px;">Acción sugerida:</strong>
                    Crear grupo con una actividad breve: listar resultados posibles, construir X y comparar respuestas.
                </div>
            </div>
        `;
    } else {
        htmlContent = `
            <div class="teacher-response-card">
                <div class="teacher-response-section-title">Consulta:</div>
                <p>${query}</p>

                <div class="teacher-response-section-title">Síntesis de JUNTOS:</div>
                <p>En base al análisis de esta semana, los estudiantes están avanzando bien en teoría pero encuentran dificultades prácticas en ejercicios de conteo y acumulación.</p>

                <div class="teacher-action-box">
                    <strong style="display:block; margin-bottom:5px;">Acción sugerida:</strong>
                    (Esta es una respuesta genérica de la demo. Probá con las consultas rápidas para ver ejemplos completos).
                </div>
            </div>
        `;
    }

    responseEl.innerHTML = htmlContent;

    const responseSection = document.getElementById('teacher-response-section');
    if (responseSection) {
        responseSection.style.display = 'block';
        setTimeout(() => responseSection.scrollIntoView({ behavior: 'smooth' }), 100);
    }
};
