(() => {
  const SIZE = 32;
  const PALETTE = ["#18242c","#394e5a","#718b91","#c5d5c9","#f2e9c9","#e7a85b","#d96c55","#a33f4d","#6d72b8","#5c9b82","#a4c66a","#f1c75b","#ffffff","#000000"];
  const PRESETS = {
    skin: ["#18242c","#6f3d31","#a96247","#d8916b","#f0bd93"],
    muscle: ["#18242c","#6d263a","#a33f4d","#d96c55","#f2a18b"],
    shadow: ["#18242c","#394e5a","#718b91","#c5d5c9","#f2e9c9"]
  };
  let canvas, ctx, pixels = [], undoStack = [], redoStack = [], color = PALETTE[6], tool = "pencil", grid = true, drawing = false, lastPoint = null;
  const el = () => document.getElementById("module-content");
  const clone = p => p.map(row => [...row]);
  function blank() { return Array.from({length:SIZE},()=>Array(SIZE).fill(null)); }
  function setStatus(msg) { const s=el()?.querySelector("[data-editor-status]"); if(s)s.textContent=msg; }
  function saveUndo() { undoStack.push(clone(pixels)); if(undoStack.length>40)undoStack.shift(); redoStack=[]; }
  function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const side = Math.max(320, Math.floor(rect.width));
    canvas.width = side*dpr; canvas.height = side*dpr;
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    draw();
  }
  function draw() {
    if (!ctx || !canvas) return;
    const side = canvas.width, cell = side/SIZE;
    ctx.clearRect(0,0,side,side);
    ctx.fillStyle="#e8ece4"; ctx.fillRect(0,0,side,side);
    for(let y=0;y<SIZE;y++) for(let x=0;x<SIZE;x++) {
      if(pixels[y][x]) { ctx.fillStyle=pixels[y][x]; ctx.fillRect(Math.floor(x*cell),Math.floor(y*cell),Math.ceil(cell),Math.ceil(cell)); }
    }
    if(grid) {
      ctx.beginPath(); ctx.strokeStyle="rgba(24,36,44,.18)"; ctx.lineWidth=Math.max(1,side/700);
      for(let i=0;i<=SIZE;i++){const p=Math.round(i*cell)+.5;ctx.moveTo(p,0);ctx.lineTo(p,side);ctx.moveTo(0,p);ctx.lineTo(side,p);}
      ctx.stroke();
    }
  }
  function pointFromEvent(e) {
    const r=canvas.getBoundingClientRect();
    return {x:Math.max(0,Math.min(SIZE-1,Math.floor((e.clientX-r.left)/r.width*SIZE))),y:Math.max(0,Math.min(SIZE-1,Math.floor((e.clientY-r.top)/r.height*SIZE)))};
  }
  function paintPoint(p) {
    if(!p)return;
    if(tool==="fill"){ floodFill(p.x,p.y,color); draw(); return; }
    pixels[p.y][p.x]=tool==="eraser"?null:color;
    draw();
  }
  function floodFill(x,y,newColor) {
    const old=pixels[y][x]; if(old===newColor)return;
    const stack=[[x,y]], seen=new Set();
    while(stack.length) {
      const [cx,cy]=stack.pop(), key=cy*SIZE+cx;
      if(cx<0||cy<0||cx>=SIZE||cy>=SIZE||seen.has(key)||pixels[cy][cx]!==old)continue;
      seen.add(key);pixels[cy][cx]=newColor;
      stack.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);
    }
  }
  function line(a,b) {
    let x0=a.x,y0=a.y,x1=b.x,y1=b.y,dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1,err=dx+dy;
    while(true){pixels[y0][x0]=tool==="eraser"?null:color;if(x0===x1&&y0===y1)break;const e2=2*err;if(e2>=dy){err+=dy;x0+=sx;}if(e2<=dx){err+=dx;y0+=sy;}}
  }
  function setTool(next) {
    tool=next;
    el()?.querySelectorAll("[data-editor-tool]").forEach(b=>b.classList.toggle("active",b.dataset.editorTool===tool));
    setStatus(`Herramienta activa: ${{pencil:"lápiz",eraser:"borrador",fill:"relleno"}[tool]}.`);
  }
  function render() {
    const mount=el();if(!mount)return;
    mount.hidden=false; pixels=blank();undoStack=[];redoStack=[];
    mount.innerHTML=`<section class="pixel-editor">
      <div class="editor-heading"><div><p class="eyebrow">TALLER CREATIVO // LIENZO 32 × 32</p><h3>PIXEL ART STUDIO</h3><p class="editor-lead">Dibuja una forma anatómica o diseña un sprite sencillo. Cada celda representa un píxel.</p></div><span class="editor-chip">32×32 PX</span></div>
      <div class="editor-layout">
        <div class="editor-canvas-wrap"><div class="canvas-topbar"><span>CANVAS_01.PXL</span><span data-editor-status aria-live="polite">Listo para dibujar.</span></div><canvas id="pixel-editor-canvas" width="512" height="512" aria-label="Lienzo de Pixel Art de 32 por 32 píxeles"></canvas><div class="canvas-bottom"><span>32 COL × 32 FILAS</span><span>EXPORTACIÓN PNG</span></div></div>
        <aside class="editor-controls">
          <div class="editor-panel"><p class="eyebrow">HERRAMIENTAS</p><div class="editor-tools"><button class="editor-tool active" data-editor-tool="pencil">✎ LÁPIZ</button><button class="editor-tool" data-editor-tool="eraser">⌫ BORRADOR</button><button class="editor-tool" data-editor-tool="fill">▧ RELLENO</button></div></div>
          <div class="editor-panel"><p class="eyebrow">PALETA</p><div class="editor-palette">${PALETTE.map((c,i)=>`<button class="palette-swatch ${c===color?"selected":""}" data-color="${c}" title="${c}" aria-label="Color ${c}" style="--swatch:${c}"></button>`).join("")}</div><label class="custom-color-label">COLOR PERSONALIZADO<input type="color" data-custom-color value="${color}"></label>
          <div class="preset-row"><button data-preset="skin">PIEL</button><button data-preset="muscle">MÚSCULO</button><button data-preset="shadow">SOMBRAS</button></div></div>
          <div class="editor-panel"><p class="eyebrow">LIENZO</p><label class="editor-check"><input type="checkbox" data-grid checked> Mostrar cuadrícula</label><div class="editor-actions"><button data-editor-undo>↶ DESHACER</button><button data-editor-redo>↷ REHACER</button><button data-editor-clear>✕ LIMPIAR</button></div></div>
          <div class="editor-panel"><p class="eyebrow">EXPORTAR</p><button class="pixel-button primary export-button" data-export-png>[ EXPORTAR PNG ]</button><button class="pixel-button export-button" data-export-json>[ GUARDAR PROYECTO JSON ]</button><label class="import-project">[ ABRIR PROYECTO JSON ]<input type="file" accept="application/json,.json" data-import-json></label></div>
        </aside>
      </div>
      <div class="editor-tip"><strong>CONSEJO DE PIXEL ART:</strong> empieza por la silueta, limita la paleta y agrupa las sombras para que el volumen se entienda incluso en tamaño pequeño.</div>
    </section>`;
    canvas=mount.querySelector("#pixel-editor-canvas");ctx=canvas.getContext("2d");
    resizeCanvas();
    canvas.addEventListener("pointerdown",e=>{e.preventDefault();canvas.setPointerCapture?.(e.pointerId);drawing=true;saveUndo();lastPoint=pointFromEvent(e);paintPoint(lastPoint);});
    canvas.addEventListener("pointermove",e=>{if(!drawing)return;const p=pointFromEvent(e);if(tool==="fill"){return;}if(lastPoint)line(lastPoint,p);lastPoint=p;draw();});
    const stop=()=>{drawing=false;lastPoint=null;};
    canvas.addEventListener("pointerup",stop);canvas.addEventListener("pointercancel",stop);canvas.addEventListener("pointerleave",e=>{if(e.buttons===0)stop();});
    mount.querySelectorAll("[data-editor-tool]").forEach(b=>b.addEventListener("click",()=>setTool(b.dataset.editorTool)));
    mount.querySelectorAll("[data-color]").forEach(b=>b.addEventListener("click",()=>setColor(b.dataset.color)));
    mount.querySelector("[data-custom-color]").addEventListener("input",e=>setColor(e.target.value));
    mount.querySelectorAll("[data-preset]").forEach(b=>b.addEventListener("click",()=>{const p=PRESETS[b.dataset.preset];mount.querySelectorAll("[data-color]").forEach((sw,i)=>{sw.style.opacity=p.includes(sw.dataset.color)?"1":".35";});setColor(p[2]);setStatus(`Paleta ${b.dataset.preset} seleccionada.`);}));
    mount.querySelector("[data-grid]").addEventListener("change",e=>{grid=e.target.checked;draw();});
    mount.querySelector("[data-editor-undo]").addEventListener("click",undo);
    mount.querySelector("[data-editor-redo]").addEventListener("click",redo);
    mount.querySelector("[data-editor-clear]").addEventListener("click",()=>{saveUndo();pixels=blank();draw();setStatus("Lienzo limpiado.");});
    mount.querySelector("[data-export-png]").addEventListener("click",exportPNG);
    mount.querySelector("[data-export-json]").addEventListener("click",exportJSON);
    mount.querySelector("[data-import-json]").addEventListener("change",importJSON);
    window.addEventListener("resize",resizeCanvas,{passive:true});
  }
  function setColor(c){color=c;el()?.querySelectorAll("[data-color]").forEach(b=>b.classList.toggle("selected",b.dataset.color===color));const input=el()?.querySelector("[data-custom-color]");if(input)input.value=color;setStatus(`Color seleccionado: ${color}.`);}
  function undo(){if(!undoStack.length){setStatus("No hay acciones para deshacer.");return;}redoStack.push(clone(pixels));pixels=undoStack.pop();draw();setStatus("Acción deshecha.");}
  function redo(){if(!redoStack.length){setStatus("No hay acciones para rehacer.");return;}undoStack.push(clone(pixels));pixels=redoStack.pop();draw();setStatus("Acción restaurada.");}
  function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function exportPNG(){
    const out=document.createElement("canvas");out.width=SIZE;out.height=SIZE;const c=out.getContext("2d");c.clearRect(0,0,SIZE,SIZE);
    for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++)if(pixels[y][x]){c.fillStyle=pixels[y][x];c.fillRect(x,y,1,1);}
    const scaled=document.createElement("canvas");scaled.width=SIZE*16;scaled.height=SIZE*16;const s=scaled.getContext("2d");s.imageSmoothingEnabled=false;s.drawImage(out,0,0,scaled.width,scaled.height);
    scaled.toBlob(blob=>{if(blob)download(blob,"pixel-anatomy-sprite.png");setStatus("PNG exportado a 512 × 512 píxeles.");},"image/png");
  }
  function exportJSON(){
    download(new Blob([JSON.stringify({app:"PIXEL ANATOMY LAB",version:"1.6",size:SIZE,pixels},null,2)],{type:"application/json"}),"pixel-anatomy-project.json");
    try {
      const count = Number(localStorage.getItem("pal-editor-json-exports") || 0);
      localStorage.setItem("pal-editor-json-exports", String(count + 1));
    } catch {}
    setStatus("Proyecto JSON exportado. El contador local se ha actualizado.");
  }
  function importJSON(e){
    const file=e.target.files?.[0];if(!file)return;
    const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result);if(data.size!==SIZE||!Array.isArray(data.pixels)||data.pixels.length!==SIZE||data.pixels.some(r=>!Array.isArray(r)||r.length!==SIZE))throw new Error("Formato no compatible");saveUndo();pixels=data.pixels.map(row=>row.map(v=>typeof v==="string"&&/^#[0-9a-f]{6}$/i.test(v)?v:null));draw();setStatus("Proyecto cargado correctamente.");}catch{setStatus("No se pudo abrir el archivo: formato inválido.");}};reader.readAsText(file);e.target.value="";
  }
  window.PixelEditor={open:render};
})();