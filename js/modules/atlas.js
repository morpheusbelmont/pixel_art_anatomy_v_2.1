(() => {
  const mount = document.getElementById("atlas-mount");
  if (!mount) return;

  const fields = {
    name: document.getElementById("muscle-name"),
    region: document.getElementById("muscle-region"),
    fn: document.getElementById("muscle-function"),
    art: document.getElementById("muscle-art")
  };
  const status = document.getElementById("atlas-status");
  const viewButtons = [...document.querySelectorAll("[data-atlas-view]")];
  let gender = "male", view = "front", showMuscles = false;

  const labels = { front: "FRONTAL", back: "POSTERIOR", side: "LATERAL", iso: "ISOMÉTRICA" };
  const spriteMap = {
    male: { front: "assets/anatomy/human-male-front.png", back: "assets/anatomy/human-male-back.png", side: "assets/anatomy/human-male-side.png", iso: "assets/anatomy/human-male-iso.png" },
    female: { front: "assets/anatomy/human-female-front.png", back: "assets/anatomy/human-female-back.png", side: "assets/anatomy/human-female-side.png", iso: "assets/anatomy/human-female-iso.png" }
  };
  const muscleMap = {
    male: { front: "assets/muscles/male-front-muscles.png", back: "assets/muscles/male-back-muscles.png" },
    female: { front: "assets/muscles/female-front-muscles.png", back: "assets/muscles/female-back-muscles.png" }
  };
  const muscleInfo = {
    front: {name:"Pectoral mayor", region:"Torso · anterior", fn:"Aduce y rota internamente el brazo; participa en movimientos de empuje.", art:"Simplifica los pectorales como masas grandes y simétricas; separa ambos lados con una sombra central."},
    back: {name:"Dorsal ancho", region:"Torso · posterior", fn:"Extiende y aproxima el brazo al tronco; define parte de la silueta de la espalda.", art:"Construye la espalda con dos masas amplias que convergen hacia la cintura."},
    side: {name:"Deltoides", region:"Hombro · lateral", fn:"Rodea la articulación del hombro y contribuye a elevar el brazo.", art:"Dibuja el hombro como una masa redondeada y conecta el brazo con transiciones claras."},
    iso: {name:"Volumen corporal", region:"Vista tridimensional", fn:"La perspectiva permite estudiar la orientación del torso, pelvis y extremidades.", art:"Compara los planos visibles y refuerza el volumen con contraste de luces y sombras."}
  };

  function safeImage(path, alt, cls) {
    return `<img class="${cls}" src="${path}" alt="${alt}" draggable="false">`;
  }
  function render() {
    const info = muscleInfo[view];
    const basePath = spriteMap[gender][view];
    const supportsMuscle = view === "front" || view === "back";
    const overlayPath = supportsMuscle ? muscleMap[gender][view] : null;

    mount.innerHTML = `
      <div class="character-controls" role="group" aria-label="Controles del modelo">
        <div class="character-control-group">
          <button type="button" class="pixel-button ${gender==="male"?"is-active":""}" data-gender="male" aria-pressed="${gender==="male"}">MASCULINO</button>
          <button type="button" class="pixel-button ${gender==="female"?"is-active":""}" data-gender="female" aria-pressed="${gender==="female"}">FEMENINO</button>
        </div>
        <label class="character-overlay-toggle"><input type="checkbox" data-show-muscles ${showMuscles?"checked":""} ${supportsMuscle?"":"disabled"}> Mostrar referencia muscular</label>
      </div>
      <div class="character-stage">
        <div class="character-pixel-stack ${showMuscles && supportsMuscle ? "muscles-visible" : ""}" data-sprite-stage>
          ${safeImage(basePath, `Modelo ${gender==="male"?"masculino":"femenino"} vista ${labels[view].toLowerCase()}`, "character-base")}
          ${showMuscles && supportsMuscle ? safeImage(overlayPath, "Referencia muscular", "character-muscles") : ""}
        </div>
      </div>
      <p class="character-caption">${gender==="male"?"MODELO MASCULINO":"MODELO FEMENINO"} / ${labels[view]} / SPRITE ORIGINAL</p>
      <p class="character-note">${supportsMuscle ? "Activa la referencia muscular para consultar la distribución general de masas." : "La capa muscular está disponible en las vistas frontal y posterior."}</p>`;

    mount.querySelectorAll("[data-gender]").forEach(btn => btn.addEventListener("click", () => {
      gender = btn.dataset.gender; render();
    }));
    mount.querySelector("[data-show-muscles]").addEventListener("change", e => {
      showMuscles = e.target.checked; render();
    });

    // Fallback if a sprite file path is missing: use a clear diagnostic, never a broken-image icon.
    const baseImg = mount.querySelector(".character-base");
    baseImg.addEventListener("error", () => {
      baseImg.alt = "No se pudo cargar el sprite: " + basePath;
      baseImg.style.display = "none";
      const stage = mount.querySelector("[data-sprite-stage]");
      stage.innerHTML = `<div class="sprite-error">No se encontró el archivo:<br><code>${basePath}</code><br>Comprueba la carpeta assets del proyecto.</div>`;
      if (status) status.textContent = "ERROR DE CARGA";
    }, { once: true });

    const overlayImg = mount.querySelector(".character-muscles");
    if (overlayImg) {
      overlayImg.addEventListener("error", () => {
        overlayImg.remove();
        if (status) status.textContent = "REFERENCIA MUSCULAR NO DISPONIBLE";
      }, { once: true });
    }

    status.textContent = `SPRITE ${gender.toUpperCase()} // ${labels[view]}`;
    viewButtons.forEach(btn => {
      const active = btn.dataset.atlasView === view || (view==="iso" && btn.dataset.atlasView==="isometric");
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    fields.name.textContent = info.name;
    fields.region.textContent = info.region;
    fields.fn.textContent = info.fn;
    fields.art.textContent = info.art;
  }

  viewButtons.forEach(btn => btn.addEventListener("click", () => {
    view = btn.dataset.atlasView === "isometric" ? "iso" : btn.dataset.atlasView;
    showMuscles = false; // avoid stale overlay on every view change
    render();
  }));
  render();
})();