function activateTab(key) {
  const view = key === "home" ? "home" : (key === "atlas" ? "atlas" : "lessons");
  document.querySelectorAll(".view-panel").forEach(panel => panel.classList.toggle("is-current", panel.dataset.view === view));
  document.querySelectorAll("[data-tab]").forEach(tab => {
    const active = tab.dataset.tab === key;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  if (key !== "home" && key !== "atlas") {
    const card = document.querySelector(`[data-module="${key}"]`);
    if (card) card.classList.add("is-active");
  }
}
document.querySelectorAll("[data-tab]").forEach(tab => tab.addEventListener("click", () => {
  const key = tab.dataset.tab;
  activateTab(key);
  if (["lessons","quiz","editor","layers","progress"].includes(key)) {
    document.querySelector(`[data-module="${key}"]`)?.click();
  }
}));
document.querySelectorAll("[data-go-atlas]").forEach(button=>button.addEventListener("click",()=>activateTab("atlas")));
document.querySelectorAll(".module-card[data-module]").forEach(button=>button.addEventListener("click",()=>{
  activateTab(button.dataset.module);
}));
document.querySelectorAll("[data-module]").forEach(button=>button.addEventListener("click",()=>{
  const key=button.dataset.module;
  activateTab(key);
  const workspace=document.getElementById("workspace");
  const title=document.getElementById("workspace-title");
  const message=document.getElementById("workspace-message");
  const content=document.getElementById("module-content");
  if(key==="lessons"){
    title.textContent="LECCIONES ANATÓMICAS";
    message.textContent="Avanza por seis lecciones breves con conceptos, traducción a Pixel Art y una práctica guiada.";
    window.Lessons?.open();
  } else if(key==="quiz"){
    title.textContent="RETOS ANATÓMICOS";
    message.textContent="Pon a prueba tus conocimientos. Las preguntas se mezclan en cada intento y podrás revisar tus respuestas al finalizar.";
    window.Quiz?.open();
  } else if(key==="editor"){
    title.textContent="TALLER PIXEL ART";
    message.textContent="Dibuja directamente en el lienzo, prueba paletas y exporta tus sprites para tus proyectos.";
    window.PixelEditor?.open();
  } else if(key==="layers"){
    title.textContent="CAPAS ANATÓMICAS INTERACTIVAS";
    message.textContent="Compara las vistas del cuerpo, cambia la visibilidad de los grupos musculares y consulta fichas para traducir la anatomía a Pixel Art.";
    window.Layers?.open();
  } else if(key==="progress"){
    title.textContent="MI PROGRESO";
    message.textContent="Revisa tu avance estimado, los resultados registrados y la ruta sugerida para continuar aprendiendo.";
    window.Progress?.open();
  } else {
    const data=moduleMessages[key];
    if(!data)return;
    title.textContent=data[0];
    message.textContent=data[1];
    content.hidden=true;
    content.innerHTML="";
  }
  workspace.scrollIntoView({behavior:"smooth",block:"start"});
}));
