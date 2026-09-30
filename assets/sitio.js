
(function(){
'use strict';
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const $=(s)=>document.querySelector(s);
const products=$('.products'), hero=$('.hero-art'), story=$('.story'), storyPhoto=$('.story-photo'), progress=$('.progress');
let ticking=false;
function draw(){const y=window.scrollY;const height=document.documentElement.scrollHeight-window.innerHeight;progress.style.transform='scaleX('+(height?y/height:0)+')';if(!reduced.matches){hero.style.transform='translateY('+Math.min(y*.13,120)+'px) scale('+(1+Math.min(y/6000,.12))+')';const r=story.getBoundingClientRect();const t=Math.max(0,Math.min(1,-r.top/window.innerHeight));storyPhoto.style.transform='scale('+(1+t*.13)+') translateY('+(-t*20)+'px)';}ticking=false;}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(draw);ticking=true;}},{passive:true});draw();
$('#next').addEventListener('click',()=>products.scrollBy({left:products.clientWidth*.7,behavior:reduced.matches?'instant':'smooth'}));
$('#prev').addEventListener('click',()=>products.scrollBy({left:-products.clientWidth*.7,behavior:reduced.matches?'instant':'smooth'}));
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('.product').forEach(card=>card.hidden=button.dataset.filter!=='todos'&&card.dataset.category!==button.dataset.filter);products.scrollLeft=0;}));
const data={fruta:{name:'Frutos rojos',image:'frutos-rojos.jpg',description:'Crema suave, bizcocho delicado y la frescura de los frutos rojos. Una invitación a disfrutar sin apuro.'},chocolate:{name:'Chocolate intenso',image:'chocolate.jpg',description:'Ganache brillante y chocolate con carácter. Para quienes creen que un buen antojo siempre lleva cacao.'},pistacho:{name:'Un toque de pistacho',image:'pistacho.jpg',description:'Crema de pistacho y una base delicadamente crujiente. Un pequeño placer para regalarte.'}};
const dialog=$('#product-dialog');let selected='fruta',trigger=null,toastTimer;
function notify(text){const toast=$('.toast');toast.textContent=text;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),3500);}
document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.product;trigger=button;const item=data[selected];$('#dialog-title').textContent=item.name;$('#dialog-description').textContent=item.description;$('.dialog-image').src='assets/'+item.image;$('.dialog-image').alt=item.name+', detalle de la delicia';$('.save').textContent='Guardar mi favorito ♡';dialog.showModal();}));
$('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>trigger&&trigger.focus());
$('.save').addEventListener('click',()=>{try{localStorage.setItem('mon-reve-favorito',selected);$('.save').textContent='Favorito guardado ♥';notify('¡Qué rico! Tu favorito quedó guardado.');}catch(e){notify('Tu favorito: '+data[selected].name+'.');}});
const cursor=$('.cursor');if(window.matchMedia('(pointer:fine)').matches&&!reduced.matches){cursor.style.display='block';let x=-100,y=-100,tx=-100,ty=-100;document.addEventListener('pointermove',event=>{tx=event.clientX;ty=event.clientY;});function move(){x+=(tx-x)*.2;y+=(ty-y)*.2;cursor.style.left=x+'px';cursor.style.top=y+'px';requestAnimationFrame(move);}move();document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('pointerenter',()=>cursor.classList.add('over'));el.addEventListener('pointerleave',()=>cursor.classList.remove('over'));});}
reduced.addEventListener('change',()=>{if(reduced.matches){hero.style.transform='none';storyPhoto.style.transform='none';cursor.style.display='none';}draw();});
})();

