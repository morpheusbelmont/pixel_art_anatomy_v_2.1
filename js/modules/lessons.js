(() => {
  const lessons = [
    {
      id: "proportion",
      number: "01",
      title: "PROPORCIÓN Y SILUETA",
      level: "FUNDAMENTOS",
      duration: "8 MIN",
      objective: "Construir una figura legible antes de añadir músculos o detalles.",
      concepts: [
        ["Línea de acción", "Marca primero la dirección general del cuerpo. Una curva sencilla puede comunicar peso, equilibrio o movimiento."],
        ["Masa antes que detalle", "Bloquea cabeza, caja torácica y pelvis como volúmenes grandes. Conecta esas masas con el eje de la columna."],
        ["Silueta legible", "Comprueba la figura en negro sólido. Si la pose no se entiende sin detalles internos, simplifica la postura."]
      ],
      pixel: "Usa bloques grandes de 2–4 píxeles para las masas principales. Evita el ruido de píxeles aislados en el contorno.",
      exercise: "Dibuja tres poses con solo 5 masas: cabeza, torso, pelvis y dos grupos de extremidades. La pose debe reconocerse en miniatura."
    },
    {
      id: "torso",
      number: "02",
      title: "TORAX, ABDOMEN Y ESPALDA",
      level: "VOLUMEN CENTRAL",
      duration: "10 MIN",
      objective: "Leer el torso como una caja torácica y una pelvis conectadas por una zona flexible.",
      concepts: [
        ["Pectorales", "Cubren la parte superior frontal del tórax. Su forma cambia con la posición de los brazos y la perspectiva."],
        ["Abdominales y oblicuos", "Los rectos abdominales se organizan en segmentos; los oblicuos envuelven los laterales y ayudan a girar el tronco."],
        ["Trapecio y dorsal ancho", "En la espalda, el trapecio conecta cuello y hombros; el dorsal ancho aporta una gran masa lateral hacia la cintura."]
      ],
      pixel: "Agrupa el torso en tres valores: base, sombra lateral y luz. Dibuja los segmentos abdominales con moderación: no todos los cuerpos muestran el mismo relieve.",
      exercise: "Haz una vista frontal y una posterior del torso. Mantén alineados hombros, caja torácica y pelvis, pero cambia los grupos musculares visibles."
    },
    {
      id: "arms",
      number: "03",
      title: "HOMBROS Y BRAZOS",
      level: "EXTREMIDADES SUPERIORES",
      duration: "9 MIN",
      objective: "Distinguir las masas del hombro, brazo y antebrazo sin convertirlos en cilindros rígidos.",
      concepts: [
        ["Deltoides", "Envuelve la articulación del hombro y crea una transición entre el torso y el brazo."],
        ["Bíceps y tríceps", "El bíceps destaca en la parte anterior del brazo; el tríceps ocupa gran parte de la zona posterior."],
        ["Antebrazo", "Se estrecha y ensancha según los músculos, tendones y la rotación de la mano. Evita tratarlo como un tubo uniforme."]
      ],
      pixel: "Usa una silueta angular y una sombra que siga el volumen. Coloca el contraste en los cambios de plano, no en cada borde anatómico.",
      exercise: "Crea dos sprites del mismo personaje: brazo flexionado y brazo extendido. Conserva el tamaño de hombro y ajusta la silueta del bíceps y antebrazo."
    },
    {
      id: "pelvis-legs",
      number: "04",
      title: "PELVIS Y PIERNAS",
      level: "SOPORTE Y MOVIMIENTO",
      duration: "10 MIN",
      objective: "Representar apoyo, peso y dirección de las piernas a partir de la pelvis.",
      concepts: [
        ["Glúteos", "Forman el volumen posterior de la pelvis y cambian de forma según la flexión de cadera y el apoyo."],
        ["Cuádriceps e isquiotibiales", "El cuádriceps domina la zona anterior del muslo; los isquiotibiales se ubican detrás y participan en la flexión de rodilla."],
        ["Pantorrilla y tibial anterior", "La pantorrilla define buena parte del contorno posterior; la zona anterior de la pierna es más estrecha y ósea."]
      ],
      pixel: "No dibujes ambas piernas idénticas cuando la pose tenga peso. Una pierna de apoyo suele verse más estable y la otra puede relajarse o avanzar.",
      exercise: "Dibuja una pose de pie y una caminando. Señala la pierna de apoyo y comprueba que la pelvis se incline de forma coherente."
    },
    {
      id: "head-neck",
      number: "05",
      title: "CABEZA Y CUELLO",
      level: "IDENTIDAD Y CONEXIÓN",
      duration: "7 MIN",
      objective: "Conectar la cabeza con el torso y mantener su orientación en distintas vistas.",
      concepts: [
        ["Masa craneal y mandíbula", "Empieza con un volumen simple y añade el plano facial. La mandíbula cambia la lectura de edad, carácter y ángulo."],
        ["Masetero", "Se sitúa en el lateral de la mandíbula y puede sugerirse con un plano de sombra, sin marcarlo como un músculo aislado en todos los personajes."],
        ["Cuello", "Conecta la base del cráneo con el tórax. Su inclinación ayuda a comunicar mirada, esfuerzo y dirección del movimiento."]
      ],
      pixel: "En sprites pequeños, prioriza orientación de cabeza, línea de ojos y silueta de mandíbula. Los músculos del cuello pueden resolverse con uno o dos planos.",
      exercise: "Dibuja una misma cabeza en vista frontal, tres cuartos y perfil. Conserva la escala y cambia mandíbula, nariz y ubicación de los rasgos."
    },
    {
      id: "pixel-translation",
      number: "06",
      title: "DE LA ANATOMÍA AL SPRITE",
      level: "SÍNTESIS VISUAL",
      duration: "12 MIN",
      objective: "Traducir referencias anatómicas en formas de píxel claras y consistentes.",
      concepts: [
        ["Agrupación", "Cada bloque de píxeles debe reforzar silueta, plano o detalle. Elimina píxeles decorativos que no aporten lectura."],
        ["Paleta de valores", "Trabaja con tres o cuatro valores por material antes de añadir colores extra. Separa luz, base y sombra."],
        ["Consistencia", "Mantén una escala de píxel, grosor de contorno y lógica de iluminación comunes entre todas las partes del personaje."]
      ],
      pixel: "Reduce la referencia al tamaño final del sprite. Si el músculo deja de leerse, representa su volumen mediante la silueta o una sombra más amplia.",
      exercise: "Crea un sprite de cuerpo completo con una paleta limitada. Exporta o captura una versión con contorno y otra sin contorno para comparar la lectura del volumen."
    }
  ];

  const readDone = () => {
    try { return JSON.parse(localStorage.getItem("pal-lessons-done") || "[]"); }
    catch { return []; }
  };
  let done = readDone();
  let current = 0;

  function save() {
    try { localStorage.setItem("pal-lessons-done", JSON.stringify(done)); } catch {}
  }
  function esc(value) {
    return String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
  }
  function renderList() {
    const mount = document.getElementById("module-content");
    if (!mount) return;
    const percent = Math.round(done.length / lessons.length * 100);
    mount.hidden = false;
    mount.innerHTML = `
      <div class="lesson-progress"><div><span>RUTA DE LECCIONES</span><strong>${done.length}/${lessons.length} COMPLETADAS</strong></div><div class="lesson-progress-track"><span style="width:${percent}%"></span></div></div>
      <div class="lesson-grid">${lessons.map((l,i)=>`
        <button class="lesson-card ${i===current?"is-selected":""}" data-lesson-index="${i}" aria-pressed="${i===current}">
          <span class="lesson-card-top">${l.number} / ${l.level}</span><strong>${l.title}</strong><span class="lesson-card-bottom">${l.duration} ${done.includes(l.id)?" · ✓ COMPLETADA":" · ABRIR LECCIÓN"}</span>
        </button>`).join("")}</div>
      ${renderDetail(lessons[current])}`;
    mount.querySelectorAll("[data-lesson-index]").forEach(btn => btn.addEventListener("click", () => {
      current = Number(btn.dataset.lessonIndex);
      renderList();
      mount.querySelector("#lesson-detail")?.scrollIntoView({behavior:"smooth",block:"nearest"});
    }));
    mount.querySelector("[data-mark-lesson]")?.addEventListener("click", () => {
      const id = lessons[current].id;
      if (!done.includes(id)) done.push(id);
      save();
      renderList();
    });
    mount.querySelector("[data-next-lesson]")?.addEventListener("click", () => {
      current = (current + 1) % lessons.length;
      renderList();
      mount.querySelector("#lesson-detail")?.scrollIntoView({behavior:"smooth",block:"nearest"});
    });
  }
  function renderDetail(l) {
    return `<article id="lesson-detail" class="lesson-detail">
      <div class="lesson-detail-heading"><div><p class="eyebrow">LECCIÓN ${l.number} // ${l.level}</p><h3>${l.title}</h3></div><span class="lesson-duration">${l.duration}</span></div>
      <p class="lesson-objective"><strong>OBJETIVO:</strong> ${l.objective}</p>
      <div class="lesson-reference"><div class="lesson-reference-heading"><span class="eyebrow">REFERENCIA VISUAL / PIXEL ART</span><span>FIG. 001</span></div><img src="assets/anatomy/human-male-front.png" alt="Personaje masculino en pixel art para estudiar proporciones y grupos musculares"><p>Observa la silueta general, la proporción de las masas y la separación entre extremidades. Usa esta figura como referencia para tu ejercicio.</p></div>
      <div class="lesson-concepts">${l.concepts.map((c,i)=>`<section class="concept-card"><span class="concept-number">0${i+1}</span><div><h4>${c[0]}</h4><p>${c[1]}</p></div></section>`).join("")}</div>
      <div class="lesson-pixel-tip"><p class="eyebrow">TRADUCCIÓN A PIXEL ART</p><p>${l.pixel}</p></div>
      <div class="lesson-exercise"><p class="eyebrow">PRÁCTICA GUIADA</p><p>${l.exercise}</p></div>
      <div class="lesson-actions"><button class="pixel-button primary" data-mark-lesson>${done.includes(l.id)?"[ LECCIÓN COMPLETADA ✓ ]":"[ MARCAR COMO COMPLETADA ]"}</button><button class="pixel-button" data-next-lesson>[ SIGUIENTE LECCIÓN → ]</button></div>
    </article>`;
  }
  window.Lessons = {
    open() { current = 0; renderList(); },
    getProgress() { return {completed: done.length, total: lessons.length, percent: Math.round(done.length / lessons.length * 100)}; },
    reset() { done = []; save(); renderList(); }
  };
})();