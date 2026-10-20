(() => {
  const questions = [
    {id:1,type:"single",topic:"Proporción",question:"¿Qué conviene establecer antes de dibujar detalles musculares?",options:["Textura de piel","Silueta y masas principales","Brillos de los ojos","Contorno de cada dedo"],answer:[1],feedback:"Primero se construyen la línea de acción y las masas principales; los detalles vienen después."},
    {id:2,type:"single",topic:"Torso",question:"¿Dónde se ubican principalmente los músculos pectorales?",options:["En la parte anterior del tórax","En la pantorrilla","En la zona posterior del muslo","En la nuca"],answer:[0],feedback:"Los pectorales cubren buena parte de la zona anterior del tórax."},
    {id:3,type:"multi",topic:"Torso",question:"Selecciona los grupos musculares relacionados con el torso.",options:["Pectorales","Oblicuos","Trapecio","Tibial anterior"],answer:[0,1,2],feedback:"Pectorales, oblicuos y trapecio se estudian en el torso; el tibial anterior está en la parte frontal de la pierna."},
    {id:4,type:"single",topic:"Brazos",question:"¿Qué músculo ocupa gran parte de la zona posterior del brazo?",options:["Bíceps","Tríceps","Masetero","Glúteo"],answer:[1],feedback:"El tríceps se encuentra en la zona posterior del brazo."},
    {id:5,type:"single",topic:"Brazos",question:"¿Qué estructura envuelve la articulación del hombro y conecta visualmente torso y brazo?",options:["Deltoides","Recto abdominal","Isquiotibiales","Gemelos"],answer:[0],feedback:"El deltoides rodea la articulación del hombro y define su transición con el brazo."},
    {id:6,type:"multi",topic:"Piernas",question:"¿Cuáles son grupos musculares de la región de la pierna o muslo?",options:["Cuádriceps","Isquiotibiales","Pantorrilla","Dorsal ancho"],answer:[0,1,2],feedback:"Cuádriceps, isquiotibiales y pantorrilla pertenecen a las regiones de la extremidad inferior."},
    {id:7,type:"single",topic:"Espalda",question:"¿Cuál de estos músculos aporta una gran masa lateral en la espalda hacia la cintura?",options:["Dorsal ancho","Masetero","Bíceps","Tibial anterior"],answer:[0],feedback:"El dorsal ancho es una masa amplia de la espalda que se extiende hacia la zona de la cintura."},
    {id:8,type:"single",topic:"Pixel Art",question:"En un sprite pequeño, ¿qué ayuda más a comunicar el volumen muscular?",options:["Muchos píxeles aislados","Silueta clara y sombras agrupadas","Añadir todos los colores posibles","Un contorno idéntico en todas las partes"],answer:[1],feedback:"Una silueta clara y grupos de sombra consistentes suelen leerse mejor que el ruido de píxeles."},
    {id:9,type:"multi",topic:"Pixel Art",question:"¿Qué prácticas ayudan a mantener coherencia visual en un sprite?",options:["Paleta limitada","Iluminación consistente","Escala de píxel coherente","Cambiar el tamaño de píxel sin motivo"],answer:[0,1,2],feedback:"La paleta, la luz y la escala deben seguir una lógica compartida."},
    {id:10,type:"single",topic:"Cabeza y cuello",question:"¿Dónde se encuentra el masetero?",options:["En la mandíbula, hacia el lateral de la cara","En la parte frontal del muslo","En la espalda baja","En el antebrazo"],answer:[0],feedback:"El masetero se ubica en el lateral de la mandíbula y participa en la masticación."},
    {id:11,type:"single",topic:"Proporción",question:"Si la pose no se entiende cuando se rellena la figura de negro, ¿qué conviene hacer?",options:["Añadir detalles de piel","Simplificar y corregir la silueta","Aumentar la cantidad de colores","Dibujar primero las uñas"],answer:[1],feedback:"La prueba de silueta permite comprobar si la pose se entiende sin depender de detalles internos."},
    {id:12,type:"multi",topic:"Torso",question:"¿Qué afirmaciones sobre el torso son correctas?",options:["La caja torácica y la pelvis son masas distintas","Los oblicuos se sitúan en los laterales del abdomen","La postura puede cambiar la forma visible del torso","Todos los cuerpos muestran abdominales idénticos"],answer:[0,1,2],feedback:"El torso se construye con masas conectadas; la postura y la anatomía individual cambian su apariencia."},
    {id:13,type:"single",topic:"Piernas",question:"¿Qué grupo muscular domina la región anterior del muslo?",options:["Isquiotibiales","Cuádriceps","Trapecio","Tríceps"],answer:[1],feedback:"El cuádriceps ocupa la zona anterior del muslo."},
    {id:14,type:"single",topic:"Espalda",question:"¿Cuál es una función útil de la prueba de silueta en diseño de personajes?",options:["Medir el peso real del personaje","Comprobar la legibilidad de la pose","Elegir automáticamente la anatomía correcta","Sustituir todas las referencias"],answer:[1],feedback:"La prueba de silueta ayuda a valorar la lectura general de la pose."},
    {id:15,type:"multi",topic:"Atlas",question:"Al estudiar una región muscular, ¿qué información conviene relacionar?",options:["Ubicación","Función general","Cómo simplificar su volumen en píxeles","El nombre de la marca del monitor"],answer:[0,1,2],feedback:"Relaciona ubicación, función y representación visual para convertir observación anatómica en decisiones gráficas."}
  ];

  let deck = [];
  let index = 0;
  let answers = {};
  let submitted = false;
  let lastResult = null;

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function getHistory() {
    try { return JSON.parse(localStorage.getItem("pal-quiz-history") || "[]"); } catch { return []; }
  }
  function saveHistory(result) {
    const history = getHistory();
    history.unshift({...result, date: new Date().toISOString()});
    try { localStorage.setItem("pal-quiz-history", JSON.stringify(history.slice(0,20))); } catch {}
  }
  function open() {
    deck = shuffle(questions);
    index = 0; answers = {}; submitted = false; lastResult = null;
    renderIntro();
  }
  function mount() {
    return document.getElementById("module-content");
  }
  function renderIntro() {
    const el = mount(); if (!el) return;
    el.hidden = false;
    const history = getHistory();
    const best = history.reduce((m,x)=>Math.max(m,x.percent||0),0);
    el.innerHTML = `<section class="quiz-intro">
      <p class="eyebrow">MODO EVALUACIÓN // BANCO DE 15 PREGUNTAS</p>
      <h3>RETO ANATÓMICO</h3>
      <p>Comprueba lo aprendido sobre proporciones, grupos musculares y su traducción al Pixel Art.</p>
      <div class="quiz-stats"><div><strong>15</strong><span>PREGUNTAS</span></div><div><strong>2</strong><span>TIPOS DE RESPUESTA</span></div><div><strong>${best}%</strong><span>MEJOR RESULTADO</span></div></div>
      <ul><li>Hay preguntas de selección única y selección múltiple.</li><li>La retroalimentación aparece después de enviar cada respuesta.</li><li>Al terminar verás tu puntuación y podrás revisar los errores.</li><li>Las preguntas se presentan en orden aleatorio en cada intento.</li></ul>
      <button class="pixel-button primary" data-quiz-start>[ INICIAR RETO ]</button>
    </section>`;
    el.querySelector("[data-quiz-start]").addEventListener("click", renderQuestion);
  }
  function renderQuestion() {
    const el = mount(); if (!el) return;
    const q = deck[index];
    const chosen = answers[q.id] || [];
    const progress = Math.round(index / deck.length * 100);
    el.hidden = false;
    el.innerHTML = `<div class="quiz-topline"><span>RETO ${String(index+1).padStart(2,"0")} / ${deck.length}</span><span>${escapeHtml(q.topic.toUpperCase())}</span></div>
      <div class="quiz-progress"><span style="width:${progress}%"></span></div>
      <section class="quiz-question"><p class="eyebrow">${q.type==="multi"?"SELECCIÓN MÚLTIPLE · ELIGE TODAS LAS CORRECTAS":"SELECCIÓN ÚNICA · ELIGE UNA RESPUESTA"}</p>
      <h3>${escapeHtml(q.question)}</h3>
      <div class="quiz-options">${q.options.map((opt,i)=>`<label class="quiz-option ${chosen.includes(i)?"is-chosen":""}"><input type="${q.type==="multi"?"checkbox":"radio"}" name="question-${q.id}" value="${i}" ${chosen.includes(i)?"checked":""}><span class="quiz-option-letter">${String.fromCharCode(65+i)}</span><span>${escapeHtml(opt)}</span></label>`).join("")}</div>
      <p class="quiz-validation" data-quiz-validation aria-live="polite"></p>
      ${submitted?`<div class="quiz-feedback ${isCorrect(q,chosen)?"correct":"incorrect"}"><strong>${isCorrect(q,chosen)?"¡CORRECTO!":"REPASEMOS"}</strong><p>${escapeHtml(q.feedback)}</p></div>`:""}
      <div class="quiz-actions">${submitted?`<button class="pixel-button primary" data-quiz-next>${index===deck.length-1?"[ VER RESULTADOS ]":"[ SIGUIENTE → ]"}</button>`:`<button class="pixel-button primary" data-quiz-submit>[ COMPROBAR RESPUESTA ]</button>`}</div>
      </section>`;
    el.querySelectorAll("input").forEach(input => input.addEventListener("change", () => {
      let values = [...el.querySelectorAll("input:checked")].map(n=>Number(n.value));
      if (q.type==="single") values = [Number(input.value)];
      answers[q.id] = values;
      renderQuestionKeepFocus();
    }));
    el.querySelector("[data-quiz-submit]")?.addEventListener("click", () => {
      if (!(answers[q.id]||[]).length) {
        el.querySelector("[data-quiz-validation]").textContent = "Selecciona una respuesta antes de continuar.";
        return;
      }
      submitted = true;
      renderQuestion();
    });
    el.querySelector("[data-quiz-next]")?.addEventListener("click", () => {
      if (index < deck.length-1) { index++; submitted=false; renderQuestion(); }
      else renderResults();
    });
  }
  function renderQuestionKeepFocus() {
    // Re-render current question so selected styles stay synchronized.
    renderQuestion();
  }
  function isCorrect(q, selected) {
    const a=[...selected].sort((x,y)=>x-y), b=[...q.answer].sort((x,y)=>x-y);
    return a.length===b.length && a.every((v,i)=>v===b[i]);
  }
  function renderResults() {
    const el = mount(); if (!el) return;
    let correct=0;
    deck.forEach(q=>{ if(isCorrect(q,answers[q.id]||[])) correct++; });
    const percent=Math.round(correct/deck.length*100);
    const result={correct,total:deck.length,percent};
    lastResult=result; saveHistory(result);
    const wrong=deck.filter(q=>!isCorrect(q,answers[q.id]||[]));
    el.innerHTML=`<section class="quiz-results">
      <p class="eyebrow">RESULTADO DEL RETO</p><h3>${percent>=80?"¡EXCELENTE TRABAJO!":percent>=60?"BUEN AVANCE":"SIGUE PRACTICANDO"}</h3>
      <div class="quiz-score"><strong>${percent}%</strong><span>${correct} DE ${deck.length} RESPUESTAS CORRECTAS</span></div>
      <div class="quiz-score-track"><span style="width:${percent}%"></span></div>
      <p>${percent>=80?"Tienes una buena base para aplicar estos conceptos al diseño de personajes.":percent>=60?"Vas construyendo una base. Repasa los temas donde tuviste errores y vuelve a intentarlo.":"Vuelve a las lecciones y al atlas antes de realizar otro intento."}</p>
      <div class="quiz-result-actions"><button class="pixel-button primary" data-quiz-retry>[ REPETIR RETO ]</button><button class="pixel-button" data-quiz-review>[ REVISAR RESPUESTAS ]</button></div>
      <div class="quiz-review" hidden>${wrong.length?wrong.map(q=>`<article class="quiz-review-item"><strong>${escapeHtml(q.question)}</strong><p>Tu respuesta: ${escapeHtml((answers[q.id]||[]).map(i=>q.options[i]).join(", ")||"Sin respuesta")}</p><p>Respuesta correcta: ${escapeHtml(q.answer.map(i=>q.options[i]).join(", "))}</p><small>${escapeHtml(q.feedback)}</small></article>`).join(""):"<p>¡Perfecto! Respondiste correctamente todas las preguntas.</p>"}</div>
      </section>`;
    el.querySelector("[data-quiz-retry]").addEventListener("click",open);
    el.querySelector("[data-quiz-review]").addEventListener("click",e=>{
      const review=el.querySelector(".quiz-review"); review.hidden=!review.hidden;
      e.currentTarget.textContent=review.hidden?"[ REVISAR RESPUESTAS ]":"[ OCULTAR REVISIÓN ]";
    });
  }
  window.Quiz = {open, getHistory};
})();