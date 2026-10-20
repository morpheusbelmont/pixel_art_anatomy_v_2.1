(() => {
  const mount = document.getElementById("module-content");
  if (!mount) return;

  const KEYS = {
    lessons: ["pal-lessons-done"],
    quiz: ["pal-quiz-history"],
    editor: ["pal-editor-json-exports"]
  };

  function readStored(keys) {
    for (const key of keys) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);
      } catch (_) {}
    }
    return null;
  }

  function collectProgress() {
    const lessonData = readStored(KEYS.lessons);
    const quizData = readStored(KEYS.quiz);
    const editorData = readStored(KEYS.editor);
    let lessonCount = 0;
    let lessonTotal = 6;

    if (Array.isArray(lessonData)) {
      lessonCount = lessonData.length;
    } else if (lessonData && typeof lessonData === "object") {
      const values = Object.values(lessonData);
      lessonCount = values.filter(x => x === true || x?.completed === true || x?.done === true || x?.status === "completed").length;
      lessonTotal = Math.max(lessonTotal, values.length);
    }

    const quizAttempts = Array.isArray(quizData) ? quizData : (quizData && Array.isArray(quizData.history) ? quizData.history : []);
    const scores = quizAttempts.map(x => Number(x?.score ?? x?.percent ?? x?.percentage)).filter(Number.isFinite);
    const bestScore = scores.length ? Math.max(...scores) : null;
    const latestScore = scores.length ? scores[scores.length - 1] : null;

    const projects = Number.isFinite(Number(editorData)) ? Number(editorData) : 0;

    return {
      lessonCount: Math.min(lessonCount, lessonTotal),
      lessonTotal,
      quizCount: quizAttempts.length,
      bestScore,
      latestScore,
      projects
    };
  }

  function scoreLabel(value) {
    if (value === null || value === undefined) return "—";
    return `${Math.round(value > 0 && value <= 1 ? value * 100 : value)}%`;
  }

  function render() {
    const p = collectProgress();
    const percent = Math.round((p.lessonCount / Math.max(1, p.lessonTotal)) * 100);
    mount.hidden = false;
    mount.innerHTML = `
      <section class="progress-app">
        <div class="progress-heading">
          <div><p class="eyebrow">MÓDULO 06 // SEGUIMIENTO DE APRENDIZAJE</p><h3>MI PROGRESO</h3><p class="progress-lead">Consulta tu avance en las lecciones, tus resultados de evaluación y los proyectos registrados por el laboratorio.</p></div>
          <span class="progress-chip">PERFIL LOCAL</span>
        </div>
        <div class="progress-stats">
          <article class="progress-stat"><span>LECCIONES COMPLETADAS</span><strong>${p.lessonCount}<small> / ${p.lessonTotal}</small></strong><div class="progress-track"><i style="width:${percent}%"></i></div><em>${percent}% de avance estimado</em></article>
          <article class="progress-stat"><span>INTENTOS DE RETOS</span><strong>${p.quizCount}</strong><em>Evaluaciones registradas en este navegador</em></article>
          <article class="progress-stat"><span>MEJOR RESULTADO</span><strong>${scoreLabel(p.bestScore)}</strong><em>Mejor puntuación disponible en el historial</em></article>
          <article class="progress-stat"><span>EXPORTACIONES JSON</span><strong>${p.projects}</strong><em>Proyectos exportados desde este navegador</em></article>
        </div>
        <div class="progress-columns">
          <article class="progress-panel"><p class="eyebrow">RUTA RECOMENDADA</p><h4>Tu siguiente paso</h4>
            <ol class="progress-roadmap">
              <li class="${p.lessonCount >= p.lessonTotal ? "is-done" : "is-next"}"><span>01</span><div><strong>Lecciones guiadas</strong><p>Estudia proporciones, torso, extremidades y traducción de anatomía a sprite.</p></div><b>${p.lessonCount >= p.lessonTotal ? "LISTO" : "CONTINUAR"}</b></li>
              <li class="${p.quizCount ? "is-done" : ""}"><span>02</span><div><strong>Retos anatómicos</strong><p>Comprueba conceptos y revisa las respuestas incorrectas.</p></div><b>${p.quizCount ? "INICIADO" : "PENDIENTE"}</b></li>
              <li class="${p.projects ? "is-done" : ""}"><span>03</span><div><strong>Taller Pixel Art</strong><p>Construye un sprite, experimenta con sombras y exporta el proyecto en JSON.</p></div><b>${p.projects ? "EXPORTADO" : "PENDIENTE"}</b></li>
            </ol>
          </article>
          <article class="progress-panel progress-note"><p class="eyebrow">NOTA DE PRIVACIDAD</p><h4>Datos en este dispositivo</h4><p>Este tablero intenta leer los registros guardados por los módulos en el navegador actual. No envía datos a un servidor ni sincroniza el progreso entre dispositivos.</p><p class="progress-muted">Las exportaciones JSON se cuentan cuando usas el botón de guardar proyecto. Los archivos PNG no se contabilizan.</p><button type="button" class="pixel-button" id="progress-refresh">[ ACTUALIZAR TABLERO ]</button></article>
        </div>
        <footer class="progress-footer">PIXEL ANATOMY LAB · DESARROLLADO POR LIC. CARLOS EDUARDO SEPÚLVEDA TORO</footer>
      </section>`;
    mount.querySelector("#progress-refresh").addEventListener("click", render);
  }

  window.Progress = { open: render };
})();
