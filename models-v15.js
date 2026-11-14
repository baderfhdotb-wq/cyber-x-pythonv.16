/* CYBERNEX V15 — self-contained interactive WebGL models, no external network */
import * as THREE from './vendor/three.module.js';
const specs=[
 {id:'cyber',title:'درع الحماية التفاعلي',hint:'اسحب المجسم لتدويره، واضغط على القفل لفتحه وإغلاقه.',action:'افتح / أغلق القفل',info:'القفل يرمز إلى حماية البيانات. استخدم كلمات مرور قوية والمصادقة متعددة العوامل.'},
 {id:'python',title:'مختبر Python ثلاثي الأبعاد',hint:'اسحب لتدوير اللابتوب، واضغط تشغيل لمشاهدة نتيجة الكود.',action:'شغّل الكود',info:'هذا مثال تعليمي يحاكي print(2 + 3)، وليس مفسر Python كاملاً.'},
 {id:'software',title:'ابنِ التطبيق خطوة بخطوة',hint:'اسحب لتدوير الواجهة، واضغط التالي لتجميع مراحل التطبيق.',action:'المرحلة التالية',info:'مراحل تطوير البرمجيات: المتطلبات ← التصميم ← البرمجة ← الاختبار ← النشر.'}
];
const holders=new Map();const phases=['المتطلبات','التصميم','البرمجة','الاختبار','النشر'];
const reduced=()=>window.cxPrefs?.motion==='off'||matchMedia('(prefers-reduced-motion: reduce)').matches;
const color=(hex)=>new THREE.Color(hex);
function makeModel(spec){
 const panel=document.createElement('section');panel.className='cx15-panel';panel.id='cx15-'+spec.id;
 panel.innerHTML=`<div class="cx15-head"><div><span class="cx15-kicker">INTERACTIVE 3D / CYBERNEX 15</span><h2>${spec.title}</h2><p>${spec.hint}</p></div><span class="cx15-live">● تفاعلي</span></div><div class="cx15-layout"><div class="cx15-stage"><div class="cx15-stage-glow"></div><div class="cx15-canvas" role="img" aria-label="مجسم ثلاثي الأبعاد تفاعلي: ${spec.title}"></div><div class="cx15-grab">↔ اسحب للتدوير</div></div><div class="cx15-side"><div class="cx15-readout" aria-live="polite">${spec.info}</div><button class="cx15-action" type="button">${spec.action}</button><button class="cx15-reset" type="button">↻ إعادة ضبط المجسم</button><span class="cx15-help">يمكن التحكم بالمجسم باللمس أو الماوس</span></div></div>`;
 const host=document.querySelector('.'+spec.id+'page');if(!host)return;
 const hero=host.querySelector('.hero');(hero||host).insertAdjacentElement('afterend',panel);
 const stage=panel.querySelector('.cx15-canvas');const button=panel.querySelector('.cx15-action'),readout=panel.querySelector('.cx15-readout');
 let renderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch(e){stage.textContent='هذا المتصفح لا يدعم عرض 3D. بقية الموقع تعمل بشكل طبيعي.';button.disabled=true;return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0,0);stage.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(0,1.2,9.8);
 scene.add(new THREE.AmbientLight(0xffffff,1.65));const key=new THREE.PointLight(spec.id==='python'?0xffd06d:spec.id==='software'?0xb6a3ff:0x56e9e4,95,35);key.position.set(-3,5,6);scene.add(key);const fill=new THREE.PointLight(0xffffff,45,30);fill.position.set(4,-2,4);scene.add(fill);
 const group=new THREE.Group();scene.add(group);
 const mat=(c,metal=.3)=>new THREE.MeshStandardMaterial({color:c,metalness:metal,roughness:.24});
 const add=(geo,m,x=0,y=0,z=0,parent=group)=>{const mesh=new THREE.Mesh(geo,m);mesh.position.set(x,y,z);parent.add(mesh);return mesh};
 const box=(w,h,d,m,x=0,y=0,z=0,parent=group)=>add(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent);
 const ring=(radius,tube,m,x,y,z)=>add(new THREE.TorusGeometry(radius,tube,12,80),m,x,y,z);
 const cyan=mat('#63e8df',.7),dark=mat('#14293d',.75),silver=mat('#d7e7f3',.85),gold=mat('#ffd36f',.5),purple=mat('#bdaaff',.6);
 let step=0,lockShackle,screen,terminal,tiles=[];
 if(spec.id==='cyber'){
  const plate=box(2.8,3.1,.35,dark,0,-.2,0);plate.rotation.z=Math.PI/4;
  const outline=box(2.95,3.25,.13,cyan,0,-.2,-.24);outline.rotation.z=Math.PI/4;
  const body=box(2.05,1.65,.65,silver,0,-.75,.6);body.geometry.computeVertexNormals();
  lockShackle=new THREE.Group();group.add(lockShackle);const tor=add(new THREE.TorusGeometry(.68,.19,16,55,Math.PI),silver,0,.2,.6,lockShackle);tor.rotation.z=Math.PI;
  box(.38,.68,.38,silver,-.68,-.12,.6,lockShackle);box(.38,.68,.38,silver,.68,-.12,.6,lockShackle);
  add(new THREE.CylinderGeometry(.18,.18,.12,32),dark,0,-.67,.97);add(new THREE.ConeGeometry(.12,.38,24),dark,0,-.98,.97);
  ring(2.5,.025,cyan,0,0,-1);ring(3.05,.012,gold,0,0,-1.2);
 }else if(spec.id==='python'){
  const base=box(4.1,.2,2.65,silver,0,-1.5,1.0);base.rotation.x=.12;
  for(let row=0;row<4;row++)for(let col=0;col<10;col++)box(.3,.025,.29,dark,-1.65+col*.36,-1.365,-.05+row*.43);
  const lid=new THREE.Group();group.add(lid);lid.position.set(0,-.3,-.45);lid.rotation.x=-.12;
  box(4.1,2.65,.19,silver,0,.35,-.25,lid);screen=box(3.72,2.3,.03,dark,0,.38,-.13,lid);
  const rows=[3.0,2.5,2.8,1.8];rows.forEach((w,i)=>box(w,.1,.035,i===1?gold:cyan,-.25-(3-w)/2,1.25-i*.47,-.08,lid));
  terminal=box(3.4,.42,.05,mat('#2a4a60'),0,-.42,-.07,lid);terminal.visible=false;
  const py1=box(.65,.65,.25,gold,1.5,1.6,.5);py1.rotation.z=.3;const py2=box(.65,.65,.25,cyan,-1.4,1.8,.6);py2.rotation.z=-.3;
 }else{
  const frame=box(3.6,3.8,.28,silver,0,0,0);frame.rotation.y=-.16;
  const back=box(3.25,3.43,.3,dark,0,0,.22);back.rotation.y=-.16;
  const tileData=[[-.9,1.25,1.1,.3],[-.9,.7,2.3,.4],[-.9,.1,2.3,.4],[-.9,-.5,1.0,.55],[.55,-.5,1.0,.55],[-.9,-1.2,2.3,.35]];
  tileData.forEach(([x,y,w,h],i)=>{const mesh=box(w,h,.15,i%3===0?purple:i%3===1?cyan:gold,x+w/2-.15,y,.55);mesh.position.z+=.04;tiles.push(mesh)});
  for(let i=0;i<5;i++){const dot=add(new THREE.SphereGeometry(.08,16,12),i%2?gold:cyan,-1.35+i*.67,-2.25,.3);dot.userData.dot=true}
 }
 function update(){if(spec.id==='cyber'){lockShackle.position.y=step? .75:0;lockShackle.rotation.z=step?-.22:0;readout.textContent=step?'القفل مفتوح: حماية الحساب لا تعتمد على كلمة المرور وحدها. فعّل المصادقة متعددة العوامل.':spec.info}
 if(spec.id==='python'){terminal.visible=!!step;readout.textContent=step?'تم تنفيذ المثال: print(2 + 3) ← الناتج 5 ✓':spec.info;button.textContent=step?'أعد التشغيل':'شغّل الكود'}
 if(spec.id==='software'){tiles.forEach((tile,i)=>{tile.position.z=step>=Math.ceil((i+1)*5/tiles.length)? .6:1.3;tile.visible=step>=Math.ceil((i+1)*5/tiles.length)});readout.textContent=step?`المرحلة ${step} من 5: ${phases[step-1]} — ${step===5?'التطبيق جاهز للتجربة!':'تابع حتى اكتمال بناء التطبيق.'}`:spec.info;button.textContent=step===5?'أعد البناء':'المرحلة التالية'}}
 button.addEventListener('click',()=>{step=spec.id==='software'?(step+1)%6:1-step;update()});panel.querySelector('.cx15-reset').addEventListener('click',()=>{step=0;group.rotation.set(0,0,0);update()});update();
 let dragging=false,lastX=0,lastY=0,rotX=0,rotY=0;
 renderer.domElement.style.touchAction='pan-y';renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
 renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;rotY+=(e.clientX-lastX)*.008;rotX=Math.max(-.45,Math.min(.45,rotX+(e.clientY-lastY)*.005));lastX=e.clientX;lastY=e.clientY;group.rotation.y=rotY;group.rotation.x=rotX});renderer.domElement.addEventListener('pointerup',()=>dragging=false);renderer.domElement.addEventListener('pointercancel',()=>dragging=false);
 const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};new ResizeObserver(resize).observe(stage);resize();
 holders.set(spec.id,{panel,scene,camera,renderer,group,resize});
}
specs.forEach(makeModel);
let frame=0,clock=0;function animate(t){requestAnimationFrame(animate);if(document.hidden)return;if(t-clock<33)return;clock=t;const active=document.body.dataset.view==='world'?document.body.dataset.world:null;holders.forEach((obj,id)=>{if(!obj.panel.getClientRects().length||!obj.panel.closest('body'))return;const rect=obj.panel.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;if(!reduced()&&!document.body.classList.contains('cx-no-bg'))obj.group.position.y=Math.sin(t*.00065)*.09;else obj.group.position.y=0;obj.renderer.render(obj.scene,obj.camera)});frame++}requestAnimationFrame(animate);
