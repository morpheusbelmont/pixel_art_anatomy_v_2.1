window.Layers = { open: initLayers };
function initLayers() {
  const mount = document.getElementById("module-content");
  if (!mount) return;

  const muscles = window.MUSCLE_DATA || {};
  const views = [
    ["front", "FRONTAL"],
    ["back", "POSTERIOR"],
    ["side", "LATERAL"],
    ["isometric", "ISOMÉTRICA"]
  ];
  const state = { view: "front", muscles: true, volume: true, outline: true, selected: "deltoid" };

  function muscleButtons() {
    return Object.entries(muscles).map(([id, item]) =>
      `<button class="layer-muscle" data-layer-muscle="${id}" type="button">${item.name}</button>`
    ).join("");
  }

  mount.hidden = false;
  mount.innerHTML = `
    <section class="layers-app">
      <div class="layers-toolbar">
        <div>
          <p class="eyebrow">MÓDULO 05 // OBSERVACIÓN POR CAPAS</p>
          <h3>ESTUDIO DE PLANOS MUSCULARES</h3>
          <p class="layers-lead">Activa o desactiva recursos visuales para estudiar la silueta, las masas musculares y el volumen antes de construir un sprite.</p>
        </div>
        <span class="layers-badge">MODO ESTUDIO</span>
      </div>
      <div class="layers-view-buttons" role="group" aria-label="Vista anatómica">
        ${views.map(([id, label]) => `<button class="pixel-button ${id === state.view ? "is-active" : ""}" data-layer-view="${id}" aria-pressed="${id === state.view}">[ ${label} ]</button>`).join("")}
      </div>
      <div class="layers-layout">
        <div class="layers-figure-panel">
          <div class="layers-figure-header"><span>REFERENCIA / ${state.view.toUpperCase()}</span><span id="layers-live-status">CAPAS ACTIVAS</span></div>
          <div class="layers-figure" id="layers-figure"><p class="atlas-loading">CARGANDO REFERENCIA...</p></div>
          <p class="layers-note">Las ilustraciones son esquemáticas y sirven como apoyo para el dibujo, no como atlas clínico detallado.</p>
        </div>
        <aside class="layers-controls">
          <p class="eyebrow">VISIBILIDAD</p>
          <label class="layer-toggle"><input type="checkbox" data-layer-toggle="muscles" checked><span><strong>Masas musculares</strong><small>Mostrar u ocultar los grupos señalados.</small></span></label>
          <label class="layer-toggle"><input type="checkbox" data-layer-toggle="volume" checked><span><strong>Contraste de volumen</strong><small>Refuerza la lectura de luces y sombras.</small></span></label>
          <label class="layer-toggle"><input type="checkbox" data-layer-toggle="outline" checked><span><strong>Contorno</strong><small>Destaca el borde de la figura.</small></span></label>
          <div class="layers-tip"><strong>OBJETIVO DE DIBUJO</strong><p id="layers-tip-text">Construye primero la silueta. Después separa las masas grandes y añade solo las sombras necesarias para que el volumen se lea a tamaño pequeño.</p></div>
        </aside>
      </div>
      <div class="layers-library">
        <div class="layers-library-heading"><div><p class="eyebrow">BIBLIOTECA DE REFERENCIA</p><h3>SELECCIONA UN GRUPO MUSCULAR</h3></div><span>${Object.keys(muscles).length} FICHAS</span></div>
        <div class="layers-muscle-grid">${muscleButtons()}</div>
        <article class="layers-detail" aria-live="polite">
          <div><p class="eyebrow">FICHA SELECCIONADA</p><h4 id="layers-muscle-name">Deltoides</h4><p id="layers-muscle-region">Hombro</p></div>
          <div><strong>FUNCIÓN GENERAL</strong><p id="layers-muscle-function"></p></div>
          <div><strong>TRADUCCIÓN A PIXEL ART</strong><p id="layers-muscle-art"></p></div>
        </article>
      </div>
    </section>`;

  const figure = mount.querySelector("#layers-figure");
  const liveStatus = mount.querySelector("#layers-live-status");

  function updateVisuals() {
    const svg = figure.querySelector("svg");
    if (!svg) return;
    svg.classList.toggle("layer-hide-muscles", !state.muscles);
    svg.classList.toggle("layer-volume-off", !state.volume);
    svg.classList.toggle("layer-outline-off", !state.outline);
    liveStatus.textContent = `${state.muscles ? "MÚSCULOS ON" : "MÚSCULOS OFF"} / ${state.volume ? "VOLUMEN ON" : "VOLUMEN OFF"}`;
  }

  function selectMuscle(id) {
    const item = muscles[id];
    if (!item) return;
    state.selected = id;
    mount.querySelectorAll("[data-layer-muscle]").forEach(button => {
      button.classList.toggle("is-selected", button.dataset.layerMuscle === id);
      button.setAttribute("aria-pressed", String(button.dataset.layerMuscle === id));
    });
    mount.querySelector("#layers-muscle-name").textContent = item.name;
    mount.querySelector("#layers-muscle-region").textContent = item.region;
    mount.querySelector("#layers-muscle-function").textContent = item.function;
    mount.querySelector("#layers-muscle-art").textContent = item.art;
    const svg = figure.querySelector("svg");
    svg?.querySelectorAll("[data-muscle]").forEach(zone => {
      zone.classList.toggle("layer-selected", zone.dataset.muscle === id);
      zone.setAttribute("aria-pressed", String(zone.dataset.muscle === id));
    });
  }

  async function loadView(view) {
    state.view = view;
    figure.innerHTML = '<p class="atlas-loading">CARGANDO REFERENCIA PIXEL...</p>';
    mount.querySelectorAll("[data-layer-view]").forEach(button => {
      const active = button.dataset.layerView === view;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    try {
      const response = await fetch(`assets/anatomy/${view === "isometric" ? "isometric" : view}.svg`);
      if (!response.ok) throw new Error("No se pudo cargar SVG");
      figure.innerHTML = await response.text();
      figure.querySelectorAll("[data-muscle]").forEach(zone => {
        zone.addEventListener("click", () => selectMuscle(zone.dataset.muscle));
        zone.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectMuscle(zone.dataset.muscle);
          }
        });
      });
      updateVisuals();
      selectMuscle(state.selected);
    } catch {
      figure.innerHTML = '<p class="atlas-loading">No se pudo cargar la referencia. Abre la app mediante GitHub Pages o un servidor local.</p>';
      liveStatus.textContent = "ERROR DE CARGA";
    }
  }

  mount.querySelectorAll("[data-layer-view]").forEach(button =>
    button.addEventListener("click", () => loadView(button.dataset.layerView))
  );
  mount.querySelectorAll("[data-layer-toggle]").forEach(input =>
    input.addEventListener("change", () => {
      state[input.dataset.layerToggle] = input.checked;
      updateVisuals();
    })
  );
  mount.querySelectorAll("[data-layer-muscle]").forEach(button =>
    button.addEventListener("click", () => selectMuscle(button.dataset.layerMuscle))
  );

  selectMuscle(state.selected);
  loadView(state.view);
}
