window.renderTeacherSection = function(target, sectionName, mainContentArea, mainTitle, mainDesc) {
    if (!mainContentArea || !mainTitle || !mainDesc) return false;

    if (target === 'dashboard') {
        mainTitle.textContent = "Dashboard docente";
        mainDesc.innerHTML = "Semana 4 &mdash; Variables aleatorias discretas";

        mainContentArea.innerHTML = `
            <div class="teacher-dashboard">
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
                        <p><strong>Estudiantes con dificultad:</strong> Ana Torres, Martín López, Sofía Díaz</p>
                        <p><strong>Estudiantes de apoyo:</strong> Camila Ruiz, Diego Pérez</p>
                        <p><strong>Actividad sugerida:</strong> Resolver ejercicios de conteo y comparar valores posibles.</p>
                        <button class="btn btn-primary btn-sm" onclick="alert('Grupo creado para la Semana 4. En una versión completa, JUNTOS enviaría la invitación a los estudiantes.')">Crear grupo</button>
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
        mainTitle.textContent = "Grupos sugeridos por JUNTOS";
        mainDesc.textContent = "JUNTOS agrupa estudiantes con dificultades similares junto a pares que pueden ayudarlos.";

        mainContentArea.innerHTML = `
            <div class="teacher-dashboard">
                <section class="teacher-section">
                    <div class="cards-grid" style="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));">

                        <div class="stat-card teacher-card group-teacher-card">
                            <h3>Grupo A &mdash; Valores posibles de variables discretas</h3>
                            <p><strong>Motivo:</strong> 6 estudiantes presentan errores similares.</p>
                            <div style="margin-top: 15px;">
                                <p><strong>Estudiantes:</strong></p>
                                <ul>
                                    <li>Ana Torres</li>
                                    <li>Martín López</li>
                                    <li>Sofía Díaz</li>
                                </ul>
                            </div>
                            <div style="margin-top: 15px;">
                                <p><strong>Apoyos sugeridos:</strong></p>
                                <ul>
                                    <li>Camila Ruiz</li>
                                    <li>Diego Pérez</li>
                                </ul>
                            </div>
                            <div style="margin-top: 15px;">
                                <p><strong>Actividad:</strong> Resolver ejercicios de conteo y comparar valores posibles.</p>
                            </div>
                            <div class="card-actions" style="margin-top: 20px;">
                                <button class="btn btn-primary" onclick="alert('Grupo creado para la semana. En una versión completa, JUNTOS enviaría invitaciones y propondría una actividad guiada.')">Crear grupo</button>
                            </div>
                        </div>

                        <div class="stat-card teacher-card group-teacher-card">
                            <h3>Grupo B &mdash; Función de distribución acumulada</h3>
                            <p><strong>Motivo:</strong> 15 estudiantes confunden P(X=x) con P(X≤x).</p>
                            <div style="margin-top: 15px;">
                                <p><strong>Estudiantes:</strong></p>
                                <ul>
                                    <li>Lucas Fernández</li>
                                    <li>Paula Gómez</li>
                                    <li>Juan Méndez</li>
                                </ul>
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
        mainDesc.textContent = "Interactuá con JUNTOS para obtener insights sobre el progreso de tus estudiantes.";

        mainContentArea.innerHTML = `
            <div class="teacher-dashboard">
                <section class="teacher-section">
                    <div class="teacher-query-box">
                        <textarea id="teacher-ai-query" class="input-field" rows="4" placeholder="Preguntale a JUNTOS sobre el avance del curso, dificultades frecuentes o planificación de la próxima clase..."></textarea>

                        <div class="quick-queries" style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 10px;">
                            <button class="btn btn-secondary btn-sm" onclick="simulateTeacherQuery('¿Qué debería repasar en la próxima clase?')">¿Qué debería repasar en la próxima clase?</button>
                            <button class="btn btn-secondary btn-sm" onclick="simulateTeacherQuery('¿Qué estudiantes necesitan seguimiento?')">¿Qué estudiantes necesitan seguimiento?</button>
                            <button class="btn btn-secondary btn-sm" onclick="simulateTeacherQuery('¿Qué ejercicio resultó más difícil?')">¿Qué ejercicio resultó más difícil?</button>
                            <button class="btn btn-secondary btn-sm" onclick="simulateTeacherQuery('¿Qué grupo de estudio conviene crear?')">¿Qué grupo de estudio conviene crear?</button>
                        </div>

                        <div style="margin-top: 20px; text-align: right;">
                            <button class="btn btn-primary" onclick="simulateTeacherQuery(document.getElementById('teacher-ai-query').value)">Consultar a JUNTOS</button>
                        </div>
                    </div>
                </section>

                <section id="teacher-response-section" class="teacher-section" style="display:none;">
                    <div class="teacher-response-card stat-card" style="border-top: 4px solid var(--primary-color);">
                        <p><strong>Consulta:</strong> <span id="teacher-query-display"></span></p>
                        <hr style="margin: 15px 0; border: 0; border-top: 1px solid var(--border-color);">
                        <p><strong>Respuesta de JUNTOS:</strong></p>
                        <p id="teacher-query-response"></p>
                    </div>
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
    document.getElementById('teacher-query-display').textContent = query;

    const responseEl = document.getElementById('teacher-query-response');

    if (query.includes('repasar') || query.includes('próxima clase')) {
        responseEl.textContent = "Conviene dedicar los primeros minutos a función de distribución acumulada. Es el tema con mayor cantidad de errores en la semana. En particular, varios estudiantes confunden P(X=x) con P(X≤x). También conviene reforzar variables de conteo que pueden tomar el valor 0.";
    } else if (query.includes('estudiantes necesitan')) {
        responseEl.textContent = "Ana Torres y Diego Pérez. Ana tiene dificultad repetida en valores posibles. Diego lleva 7 días sin actividad y no inició la guía. Te sugiero enviar un mensaje de recuperación a Diego.";
    } else if (query.includes('ejercicio resultó más difícil')) {
        responseEl.textContent = "El Ejercicio 3 (Función de distribución discreta). El 42% de los estudiantes que lo intentaron cometieron el error de no acumular las probabilidades correctamente.";
    } else if (query.includes('grupo de estudio conviene')) {
        responseEl.textContent = "Sugiero crear el Grupo 1 (Valores posibles de variables discretas) con Ana Torres, Martín López y Sofía Díaz. Podés incluir a Camila Ruiz y Diego Pérez (que ya resolvieron esto bien) como apoyo.";
    } else {
        responseEl.textContent = "En base al análisis de esta semana, los estudiantes están avanzando bien en teoría pero encuentran dificultades prácticas en ejercicios de conteo y acumulación. (Esta es una respuesta genérica de la demo).";
    }

    const responseSection = document.getElementById('teacher-response-section');
    if (responseSection) {
        responseSection.style.display = 'block';
        setTimeout(() => responseSection.scrollIntoView({ behavior: 'smooth' }), 100);
    }
};
