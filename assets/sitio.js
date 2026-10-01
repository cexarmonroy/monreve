(function(){
'use strict';
var progress=document.querySelector('.progress');
var ticking=false;
function draw(){
  var h=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.transform='scaleX('+(h>0?window.scrollY/h:0)+')';
  ticking=false;
}
window.addEventListener('scroll',function(){if(!ticking){requestAnimationFrame(draw);ticking=true;}},{passive:true});
draw();

/* Filtro de la carta: sin JavaScript se ven todos los productos */
var buttons=document.querySelectorAll('[data-filter]');
var cards=document.querySelectorAll('.product');
function show(cat){
  buttons.forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.filter===cat));});
  cards.forEach(function(c){c.hidden=c.dataset.category!==cat;});
}
buttons.forEach(function(b){b.addEventListener('click',function(){show(b.dataset.filter);});});
if(buttons.length)show(buttons[0].dataset.filter);
})();
