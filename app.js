/* ===== núcleo ===== */
'use strict';
const $=(s,r)=>(r||document).querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const clamp=(v,a,b)=>Math.min(Math.max(v,a),b);
const rnd=n=>Math.floor(Math.random()*n);
const pick=a=>a[rnd(a.length)];
function shuf(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);const t=a[i];a[i]=a[j];a[j]=t}return a}
const KEY='ars_serp_v2';
function loadDB(){const def={v:2,player:'',char:'👦🏻',skin:{head:'#22c55e',body:'#86efac',pat:'solid',eyes:'cute',hat:'',trail:''},xp:0,rank:{},fam:'ALL',words:[],seen:false,set:{sound:true,voice:true,hint:true,speed:1,free:false,unlock:false}};
 try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&d.v===2){d.skin=Object.assign(def.skin,d.skin||{});d.set=Object.assign(def.set,d.set||{});return Object.assign(def,d)}}catch(e){}return def}
let DB=loadDB();
function save(){try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}}
let AC=null;
function tone(f,d,t,v,when){if(!DB.set.sound)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=t||'sine';o.frequency.value=f;o.connect(g);g.connect(AC.destination);const n=AC.currentTime+(when||0);g.gain.setValueAtTime(v||.08,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.start(n);o.stop(n+d)}catch(e){}}
let musT=null,musN=0;
function music(on){clearInterval(musT);musT=null;if(!on||!DB.set.sound)return;const P=[392,440,523,587,659,784,880];musT=setInterval(()=>{if(!DB.set.sound)return;const f=P[(musN*3+rnd(3))%P.length];musN++;tone(f,.5,'sine',.025);if(musN%4===0)tone(f/2,.8,'triangle',.02)},520)}
const LNAME={a:'á',e:'ê',i:'i',o:'ó',u:'u',b:'bê',c:'cê',d:'dê',f:'efe',g:'gê',h:'agá',j:'jota',k:'cá',l:'ele',m:'eme',n:'ene',p:'pê',q:'quê',r:'erre',s:'esse',t:'tê',v:'vê',w:'dáblio',x:'xis',y:'ípsilon',z:'zê'};
function sylSay(s){s=String(s).toLowerCase();const m=s.match(/^([^aeiouáéíóúâêôãõà]*)([aeiou])$/);if(m)return m[1]+{a:'á',e:'ê',i:'í',o:'ô',u:'ú'}[m[2]];return s}
let VOICE=null;
function speak(t){if(!DB.set.voice||!window.speechSynthesis)return;try{const s=window.speechSynthesis;s.cancel();const u=new SpeechSynthesisUtterance(String(t));u.lang='pt-BR';u.rate=.85;if(!VOICE){const vs=s.getVoices();VOICE=vs.find(v=>/pt-BR/i.test(v.lang))||vs.find(v=>/^pt/i.test(v.lang))||null}if(VOICE)u.voice=VOICE;s.speak(u)}catch(e){}}
const speakLetter=l=>speak(LNAME[String(l).toLowerCase()]||l);
const speakSyl=s=>speak(sylSay(s));
let toastT=0;
function toast(m,ms){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),ms||1800)}
const FSOK=!!(document.fullscreenEnabled||document.webkitFullscreenEnabled);
const isFS=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
function toggleFS(){try{const d=document,e=d.documentElement;if(isFS())(d.exitFullscreen||d.webkitExitFullscreen).call(d);else(e.requestFullscreen||e.webkitRequestFullscreen).call(e)}catch(x){}}

const Snd={};Object.assign(Snd,{
 eat(n){const b=[523,587,659,698,784,880,988,1047][Math.min(7,n||0)];tone(b,.12,'triangle',.1);tone(b*1.5,.14,'sine',.06,.05)},
 bad(){tone(180,.22,'sawtooth',.09);tone(130,.28,'square',.06,.08)},
 meh(){tone(330,.1,'triangle',.06)},
 power(){[659,880,1175].forEach((f,i)=>tone(f,.16,'triangle',.09,i*.07))},
 level(){[523,659,784,1047,1319].forEach((f,i)=>tone(f,.28,'triangle',.1,i*.1))},
 word(){[523,659,784,1047].forEach((f,i)=>tone(f,.22,'triangle',.1,i*.08))},
 boost(){tone(240,.08,'sawtooth',.03)},
 die(){[392,330,262,196].forEach((f,i)=>tone(f,.4,'sine',.09,i*.2))},
 kill(){tone(140,.2,'square',.08);tone(700,.12,'triangle',.08,.1)},
 ui(){tone(640,.06,'triangle',.07)}});

/* ===== dados pedagógicos ===== */
const VOW='AEIOU'.split('');
const CONS='BCDFGHJKLMNPQRSTVWXYZ'.split('');
const LET=VOW.concat(CONS);
const NUMS='0123456789'.split('');
const FAMS=['B','C','D','F','G','J','L','M','N','P','R','S','T','V','CH','LH','NH'];
function famSyls(f){return VOW.map(v=>f+v)}
const SYL_ALL=[].concat.apply([],FAMS.map(famSyls));
const NUMWORD=['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove'];
const WORDS='BOLA CASA GATO PATO SAPO LUA SOL MAR RIO UVA OVO BOI VACA FACA MESA SOFA DADO BOLO CAFE LEITE PAO MEL SAL LUZ FLOR PEIXE URSO LOBO LEAO MACACO ZEBRA COBRA JACARE TATU ARARA CAVALO GALO PINTO OVELHA BODE PORCO RATO COELHO TIGRE ONCA FADA BRUXA REI RAINHA CASTELO LIVRO LAPIS CANETA CADERNO BORRACHA ESCOLA AULA JOGO FESTA BALAO PIPA PIAO BONECA CARRO BICICLETA AVIAO BARCO TREM ONIBUS ESTRELA NUVEM CHUVA VENTO MONTE PRAIA AREIA FOLHA ARVORE FRUTA BANANA MACA PERA LARANJA MELAO MORANGO ABACAXI COCO TOMATE CENOURA BATATA MILHO ARROZ FEIJAO SOPA BOLACHA DOCE SUCO AGUA SAPATO MEIA BLUSA CAMISA CHAPEU LUVA MOCHILA PORTA JANELA CAMA TETO PAREDE JARDIM HORTA ABELHA FORMIGA BORBOLETA PASSARO CORUJA PATINHO MAMAE PAPAI VOVO TIO TIA AMIGO AMIGA BEBE DEDO MAO PE OLHO NARIZ BOCA DENTE ORELHA CABELO'.split(' ').filter(w=>w.length>=3&&w.length<=7);
const PALETTES=[['#22c55e','#86efac'],['#06b6d4','#a5f3fc'],['#3b82f6','#93c5fd'],['#8b5cf6','#c4b5fd'],['#ec4899','#f9a8d4'],['#ef4444','#fca5a5'],['#f97316','#fdba74'],['#eab308','#fde68a'],['#14b8a6','#99f6e4'],['#64748b','#cbd5e1'],['#f43f5e','#fecdd3'],['#a3e635','#ecfccb']];
const PATS=[['solid','Liso'],['stripes','Listras'],['rainbow','Arco-íris'],['dots','Bolinhas'],['fade','Degradê']];
const EYES=[['cute','Fofo'],['big','Grandes'],['glasses','Óculos'],['love','Apaixonado']];
const HATS=[['','Nenhum',0],['🎀','Laço',0],['🎓','Formando',100],['🎩','Cartola',300],['🤠','Cowboy',600],['👑','Coroa',1000],['⭐','Estrela',1600]];
const TRAILS=[['','Nenhum',0],['✨','Brilhos',0],['❤','Corações',200],['ABC','Letras',500],['🌈','Arco-íris',900]];
const STAGES=[[0,'Filhotinho'],[120,'Cobrinha'],[350,'Serpente'],[750,'Jiboia'],[1400,'Naja Real'],[2400,'Dragão do Saber']];
const MODES={
 letras:{name:'Caça-letras',icon:'🔤',color:'#22d3ee',desc:'Pegue só LETRAS. Cuidado com os números!'},
 vogal:{name:'Caça-vogal',icon:'A E',color:'#fb7185',desc:'Pegue só as VOGAIS: A E I O U.'},
 consoante:{name:'Caça-consoante',icon:'B C',color:'#60a5fa',desc:'Pegue só as CONSOANTES.'},
 silaba:{name:'Caça-sílaba',icon:'BA',color:'#f472b6',desc:'Pegue só SÍLABAS. Escolha a família!'},
 numero:{name:'Caça-número',icon:'123',color:'#facc15',desc:'Pegue só NÚMEROS. Cuidado com as letras!'},
 palavra:{name:'Monte a Palavra',icon:'🧩',color:'#34d399',desc:'Pegue as letras na ordem e forme a palavra!'},
 batalha:{name:'Serpentário',icon:'⚔️',color:'#f97316',desc:'Arena! Coma de tudo, cresça e não bata nas outras serpentes.'}};
const BOTNAMES=['Ana','Beto','Cacá','Duda','Enzo','Fabi','Gabi','Hugo','Isa','Léo','Malu','Nina','Otto','Pedro','Rafa','Sofia','Théo','Vivi','Zeca','Lia','Davi','Bia'];

/* ===== motor: arena estilo Slither, focada em alfabetização ===== */
const WR=2200,TAU=Math.PI*2;let G=null,fid=0;
const angd=(a,b)=>{let d=b-a;while(d>Math.PI)d-=TAU;while(d<-Math.PI)d+=TAU;return d};
const VCOL={A:['#fb7185','#e11d48'],E:['#fb923c','#ea580c'],I:['#facc15','#ca8a04'],O:['#f472b6','#db2777'],U:['#c084fc','#9333ea']};
const CCOLS=[['#22d3ee','#0e9fb5'],['#60a5fa','#2f6fe0'],['#34d399','#12a574'],['#2dd4bf','#0f9f90'],['#818cf8','#4f56e0'],['#38bdf8','#1c8bd0']];
function colFor(f){if(f.kind==='N')return['#fde047','#d97706'];if(f.kind==='S')return['#f9a8d4','#a855f7'];if(f.kind==='P')return['#fff','#a5b4fc'];
 const l=f.val;return VCOL[l]||CCOLS[(l.charCodeAt(0)*7)%CCOLS.length]}
const PWR={freeze:['⏱️','Tempo congelado'],shield:['🛡️','Escudo'],turbo:['⚡','Turbo'],magnet:['🧲','Ímã'],double:['💎','Pontos ×1,5'],heart:['💛','+1 coração']};
const PW_TYPES=Object.keys(PWR),BOT_PW=['shield','turbo','heart'],PW_DUR=10,MINGAP=54;
/* ---------- regras: o ÚNICO lugar que decide certo/errado ---------- */
function judge(f){
 if(f.kind==='P')return'power';const m=G.mode;
 if(m==='batalha')return'ok';
 if(m==='letras')return f.kind==='L'?'ok':'bad';
 if(m==='vogal')return(f.kind==='L'&&VOW.indexOf(f.val)>=0)?'ok':'bad';
 if(m==='consoante')return(f.kind==='L'&&VOW.indexOf(f.val)<0)?'ok':'bad';
 if(m==='silaba')return f.kind==='S'?'ok':'bad';
 if(m==='numero')return f.kind==='N'?'ok':'bad';
 if(m==='palavra'){if(f.kind!=='L')return'bad';const w=G.word;if(f.val===w.w[w.i])return'ok';return w.w.indexOf(f.val)>=0?'meh':'bad'}
 return'bad'}
/* bots seguem o mesmo modo: querem peças certas, fogem das erradas */
function judgeBot(f){if(f.kind==='P')return BOT_PW.indexOf(f.val)>=0;if(G.mode==='batalha')return true;if(G.mode==='palavra')return f.kind==='L'&&G.word.w.indexOf(f.val)>=0;return judge(f)==='ok'}
function classOf(f){if(f.kind==='P')return'power';return judgeBot(f)?'ok':'bad'}
/* ---------- comidas ---------- */
function famPool(){const f=DB.fam;return f==='ALL'?SYL_ALL:famSyls(f)}
function rollClass(c){const m=G.mode,L=()=>({kind:'L',val:pick(LET)}),V=()=>({kind:'L',val:pick(VOW)}),C=()=>({kind:'L',val:pick(CONS)}),N=()=>({kind:'N',val:pick(NUMS)}),S=()=>({kind:'S',val:pick(famPool())});
 const ok=c==='ok';
 if(m==='letras')return ok?L():N();
 if(m==='vogal')return ok?V():C();
 if(m==='consoante')return ok?C():V();
 if(m==='silaba')return ok?S():L();
 if(m==='numero')return ok?N():L();
 if(m==='palavra'){const w=G.word.w;if(ok)return{kind:'L',val:(Math.random()<.35?w[G.word.i]:w[rnd(w.length)])};let x,k=0;do{x=pick(LET)}while(w.indexOf(x)>=0&&k++<40);return{kind:'L',val:x}}
 const r=Math.random();return r<.5?L():r<.75?N():S()}
function rollFood(){return rollClass(Math.random()<(G.mode==='batalha'?1:.55)?'ok':'bad')}
function mkFood(x,y,o){o=o||rollFood();return{id:++fid,kind:o.kind,val:o.val,x:x,y:y,r:15,ph:Math.random()*6,born:G?G.t:0}}
function randPos(minFromMe){for(let i=0;i<20;i++){const a=Math.random()*TAU,d=Math.sqrt(Math.random())*(WR-90);const x=Math.cos(a)*d,y=Math.sin(a)*d;if(!minFromMe||!G.me||Math.hypot(x-G.me.x,y-G.me.y)>minFromMe)return{x:x,y:y}}return{x:0,y:0}}
/* nenhuma peça nasce dentro de outra: distância mínima entre centros */
function freeAt(x,y,d){const d2=d*d;for(const f of G.foods){const dx=f.x-x;if(dx>d||dx<-d)continue;const dy=f.y-y;if(dx*dx+dy*dy<d2)return false}return true}
function placeFree(far,d,tries){for(let i=0;i<(tries||24);i++){const p=randPos(far);if(freeAt(p.x,p.y,d||MINGAP))return p}return null}
function spawnClass(c,far){const p=placeFree(far?460:0,MINGAP);if(!p)return;const f=mkFood(p.x,p.y,rollClass(c));f.born=G.t;G.foods.push(f)}
function spawnPower(){const p=placeFree(250,MINGAP+16);if(!p)return;const f=mkFood(p.x,p.y,{kind:'P',val:pick(PW_TYPES)});f.r=17;f.born=G.t;G.foods.push(f)}
function countP(){let n=0;for(const f of G.foods)if(f.kind==='P')n++;return n}
function ensureNeeded(){if(G.mode!=='palavra')return;const w=G.word,need=w.w[w.i];let n=0;for(const f of G.foods)if(f.kind==='L'&&f.val===need)n++;
 let tries=0;while(n<10&&tries++<300){const f=G.foods[rnd(G.foods.length)];if(f.kind==='P'||f.val===need)continue;if(Math.hypot(f.x-G.me.x,f.y-G.me.y)<380)continue;f.kind='L';f.val=need;n++}}
function nextWord(){const pool=(DB.words&&DB.words.length?DB.words:WORDS);let w,k=0;do{w=pick(pool)}while(G.word&&w===G.word.w&&pool.length>1&&k++<20);G.word={w:w,i:0};
 if(G.foods&&G.foods.length&&G.me)for(const f of G.foods){if(f.kind!=='L'||Math.hypot(f.x-G.me.x,f.y-G.me.y)<380)continue;const o=rollClass(Math.random()<.45?'ok':'bad');f.kind=o.kind;f.val=o.val}}
/* limpeza leve: a cada 3 acertos, uma peça errada some e renasce em outro ponto junto de uma peça certa nova */
function cleaner(){if(G.mode==='batalha')return;const me=G.me,cand=[];
 for(let i=0;i<G.foods.length;i++){const f=G.foods[i];if(classOf(f)!=='bad')continue;if(Math.hypot(f.x-me.x,f.y-me.y)>420)cand.push(i)}
 if(cand.length){const i=cand[rnd(cand.length)],f=G.foods[i];burst(f.x,f.y,'#a5b4fc',6);G.foods.splice(i,1)}
 spawnClass('bad',true);spawnClass('ok',true);
 if(G.foods.length>780){for(let i=G.foods.length-1;i>=0;i--){const f=G.foods[i];if(classOf(f)==='ok'&&Math.hypot(f.x-me.x,f.y-me.y)>600){G.foods.splice(i,1);break}}}}
/* mantém a quantidade de peças estável (as soltas por serpentes caídas contam) */
function trimFoods(){let extra=G.foods.length-800;if(extra<=0)return;const me=G.me;
 const idx=[];for(let i=0;i<G.foods.length;i++){const f=G.foods[i];if(f.kind==='P')continue;const d=Math.hypot(f.x-me.x,f.y-me.y);if(d>700)idx.push([d,i])}
 idx.sort((a,b)=>b[0]-a[0]);const rm=idx.slice(0,extra).map(x=>x[1]).sort((a,b)=>b-a);for(const i of rm)G.foods.splice(i,1)}
/* ---------- serpentes ---------- */
function initSegs(s){s.segs=[];for(let i=0;i<Math.floor(s.len);i++)s.segs.push({x:s.x-Math.cos(s.ang)*i*14,y:s.y-Math.sin(s.ang)*i*14})}
function mkSnake(o){const a=o.ang!==undefined?o.ang:Math.random()*TAU;const s={x:o.x,y:o.y,ang:a,tAng:a,len:o.len||14,segs:[],r:13,score:0,stage:0,boost:false,slow:false,energy:100,alive:true,skin:o.skin,name:o.name,bot:!!o.bot,think:0,pw:{},wob:Math.random()*6,hearts:3,saves:3,respawnAt:0,invul:0,dbl:[],aggr:Math.random()<.4,sloppy:0,wander:a};initSegs(s);return s}
function botSkin(){const p=pick(PALETTES);return{head:p[0],body:p[1],pat:pick(['solid','stripes','rainbow','dots','fade']),eyes:pick(['cute','big','love']),hat:Math.random()<.25?pick(['🎀','🎩','🤠','👑']):''}}
function radius(s){return 13+Math.min(13,(s.len-14)*.06)+s.stage*.7}
function spacing(s){return 6+s.r*.55}
function dblMult(s){const n=s.dbl.filter(t=>t>G.t).length;return Math.min(15,Math.pow(1.5,n))}
function moveSnake(s,dt){
 const turbo=s.pw.turbo>0,boosting=(s.boost&&(s.energy>3||turbo))||turbo;
 const base=150*(s.bot?1:DB.set.speed);let sp=base*(boosting?1.75:1);if(s.slow&&!turbo)sp*=.5;
 if(boosting&&!turbo){s.energy=Math.max(0,s.energy-34*dt);s.boostT=0}else{s.boostT=(s.boostT||0)+dt;if(s.boostT>.5)s.energy=Math.min(100,s.energy+18*dt)}
 const turn=Math.max(2.3,4.2-s.r*.05)*(s.slow?1.5:1);const d=angd(s.ang,s.tAng);s.ang+=clamp(d,-turn*dt,turn*dt);
 s.x+=Math.cos(s.ang)*sp*dt;s.y+=Math.sin(s.ang)*sp*dt;
 const dc=Math.hypot(s.x,s.y),lim=WR-s.r;if(dc>lim){s.x*=lim/dc;s.y*=lim/dc}
 s.r=radius(s);const sg=spacing(s);const want=Math.min(240,Math.max(8,Math.floor(s.len)));
 while(s.segs.length<want){const t=s.segs[s.segs.length-1]||{x:s.x,y:s.y};s.segs.push({x:t.x,y:t.y})}
 while(s.segs.length>want)s.segs.pop();
 let px=s.x,py=s.y;for(const q of s.segs){const dx=q.x-px,dy=q.y-py,dd=Math.hypot(dx,dy);if(dd>sg){q.x=px+dx/dd*sg;q.y=py+dy/dd*sg}px=q.x;py=q.y}
 for(const k in s.pw)if(s.pw[k]>0)s.pw[k]-=dt;
 s.boosting=boosting}
/* ---------- IA: planeja a rota, evita corpos, paredes e peças erradas ---------- */
function dangerAlong(b,ang,badNear,others){let danger=0;const ca=Math.cos(ang),sa=Math.sin(ang),prot=b.pw.shield>0||b.pw.turbo>0;
 for(let di=0;di<5;di++){const d=[34,70,108,150,205][di],px=b.x+ca*d,py=b.y+sa*d,w=5-di;
  const rc=Math.hypot(px,py);if(rc>WR-50)danger+=(rc>WR-18?8:3)*w/2;
  if(!prot)for(const o of others){const rr=o.r+b.r*.8+16;
   for(let i=(o===b?7:0);i<o.segs.length;i+=2){const q=o.segs[i];const dx=q.x-px,dy=q.y-py;if(dx*dx+dy*dy<rr*rr){danger+=w*2;break}}
   if(o!==b&&o.alive){const dx=o.x-px,dy=o.y-py,rh=(o.r+b.r)*1.5+12;if(dx*dx+dy*dy<rh*rh&&o.len>=b.len*.9)danger+=w*1.5}}
  if(!(b.sloppy>0))for(const f of badNear){const dx=f.x-px,dy=f.y-py,rr=f.r+b.r*.75+8;if(dx*dx+dy*dy<rr*rr)danger+=w*.9}}
 return danger}
function aiThink(b,dt){b.think-=dt;b.sloppy-=dt;if(b.think>0)return;b.think=.09+Math.random()*.1;
 if(Math.random()<.025)b.sloppy=.6;/* às vezes descuida e pode errar */
 const others=G.snakes.filter(o=>o.alive);
 const badNear=[];for(const f of G.foods){const dx=f.x-b.x,dy=f.y-b.y;if(dx>240||dx<-240||dy>240||dy<-240)continue;if(f.kind!=='P'&&!judgeBot(f))badNear.push(f)}
 let desired=null,tgtDist=1e9,hunting=false;
 /* caça: serpentes grandes tentam cortar o caminho das menores */
 if(b.aggr){for(const o of others){if(o===b||o.len*1.2>b.len)continue;const dx=o.x-b.x,dy=o.y-b.y,d=Math.hypot(dx,dy);if(d<430&&d<tgtDist){const lead=Math.min(240,d*.7);desired=Math.atan2(o.y+Math.sin(o.ang)*lead-b.y,o.x+Math.cos(o.ang)*lead-b.x);tgtDist=d;hunting=true}}}
 if(!hunting){let best=null,bd=1e12;
  for(const f of G.foods){const dx=f.x-b.x,dy=f.y-b.y,d=dx*dx+dy*dy;if(d>620*620||d>=bd)continue;if(!judgeBot(f))continue;
   let bad=false;for(const o of others){if(o===b)continue;const h=Math.hypot(o.x-f.x,o.y-f.y);if(h<o.r+60&&o.len>b.len)bad=true;if(bad)break}if(bad)continue;best=f;bd=d}
  if(best){desired=Math.atan2(best.y-b.y,best.x-b.x);tgtDist=Math.sqrt(bd)}}
 if(desired===null){b.wander+=(Math.random()-.5)*.9;if(Math.hypot(b.x,b.y)>WR*.7)b.wander=Math.atan2(-b.y,-b.x)+(Math.random()-.5)*.8;desired=b.wander}
 let bestA=b.ang,bs=-1e9;
 for(const off of[0,.28,-.28,.6,-.6,.95,-.95,1.4,-1.4,2,-2.6]){const a=b.ang+off,dg=dangerAlong(b,a,badNear,others),al=Math.cos(angd(a,desired));const sc=-dg*3+al*2.2-Math.abs(off)*.12;if(sc>bs){bs=sc;bestA=a}}
 b.tAng=bestA;
 b.boost=!!(desired!==null&&tgtDist<230&&b.energy>45&&Math.random()<.18)||(hunting&&tgtDist<300&&b.energy>50)}
/* ---------- início ---------- */
function startGame(mode){
 if(G&&G.raf)cancelAnimationFrame(G.raf);
 G={mode:mode,foods:[],snakes:[],parts:[],floats:[],t:0,over:false,paused:false,streak:0,best:0,correct:0,wrong:0,words:0,kills:0,shake:0,flash:0,won:false,endless:false,freeze:0,saved:false,
  input:{ang:-Math.PI/2,boost:false,slow:false,kb:0,joy:null},cam:{x:0,y:0,z:1},last:performance.now(),lbT:0,mapT:0,trT:0,pwT:2,banner:null,spoke:0};
 const cv=$('#cv');G.cv=cv;G.ctx=cv.getContext('2d');
 if(mode==='palavra')nextWord();
 const skin=DB.skin;G.me=mkSnake({x:0,y:0,skin:skin,name:DB.player||'Você',ang:-Math.PI/2});G.me.isMe=true;G.snakes.push(G.me);
 const nb=5;for(let i=0;i<nb;i++)addBot();
 G.t=-99;const N=700;for(let i=0;i<N;i++){const p=placeFree(i<30?260:0,MINGAP,12);if(!p)continue;G.foods.push(mkFood(p.x,p.y))}
 for(let i=0;i<8;i++)spawnPower();G.t=0;
 ensureNeeded();bindInput();fit();hud();updateLB();G.raf=requestAnimationFrame(loop);music(true)}
function addBot(){const used=new Set(G.snakes.map(s=>s.name));let n,k=0;do{n=pick(BOTNAMES)}while(used.has(n)&&k++<40);
 const p=safeSpot();const b=mkSnake({x:p.x,y:p.y,skin:botSkin(),name:n,bot:true,len:10+rnd(14)});b.invul=G.t+2;G.snakes.push(b);return b}
function safeSpot(){let best=null,bd=-1;for(let k=0;k<14;k++){const p=randPos(0);if(Math.hypot(p.x,p.y)>WR*.85)continue;let m=1e9;for(const s of G.snakes){if(!s.alive)continue;for(let i=0;i<s.segs.length;i+=4){const d=Math.hypot(s.segs[i].x-p.x,s.segs[i].y-p.y);if(d<m)m=d}const dh=Math.hypot(s.x-p.x,s.y-p.y);if(dh<m)m=dh}
  if(m>bd){bd=m;best=p}}return best||{x:0,y:0}}
function respawn(s){const p=safeSpot();s.x=p.x;s.y=p.y;s.ang=s.tAng=s.wander=Math.random()*TAU;s.len=14;s.r=13;initSegs(s);s.hearts=3;s.alive=true;s.invul=G.t+3;s.pw={};s.dbl=[];s.energy=100;s.respawnAt=0;s.sloppy=0;
 if(s.isMe){G.input.ang=s.ang;G.cam.x=s.x;G.cam.y=s.y;G.streak=0;hud();banner('Voltou! Boa sorte 🐍')}}
/* ---------- laço ---------- */
function loop(now){if(!G)return;G.raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-G.last)/1000);G.last=now;
 if(!G.paused&&!G.over)update(dt);else stepFx(dt);draw()}
function stepFx(dt){for(const p of G.parts){p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt}G.parts=G.parts.filter(p=>p.t<p.life);
 for(const f of G.floats)f.t+=dt;G.floats=G.floats.filter(f=>f.t<1.2);G.shake=Math.max(0,G.shake-dt*3);G.flash=Math.max(0,G.flash-dt*2)}
function update(dt){G.t+=dt;const me=G.me,inp=G.input;
 if(inp.kb&&me.alive){inp.ang+=inp.kb*3.4*dt}
 me.tAng=inp.ang;me.boost=inp.boost;me.slow=inp.slow;
 const frozen=G.freeze>0;if(frozen)G.freeze=Math.max(0,G.freeze-dt);
 for(const s of G.snakes.slice()){
  if(!s.alive){if(s.respawnAt&&G.t>=s.respawnAt)respawn(s);continue}
  if(s.bot){if(frozen)continue;aiThink(s,dt)}
  moveSnake(s,dt)}
 /* ímã: só atrai peças certas */
 for(const s of G.snakes){if(!s.alive||!(s.pw.magnet>0))continue;for(const f of G.foods){const dx=s.x-f.x,dy=s.y-f.y,d=Math.hypot(dx,dy);if(d<300&&d>1&&(f.kind==='P'||(s.isMe?judge(f)!=='bad':judgeBot(f)))){const v=420*dt;f.x+=dx/d*v;f.y+=dy/d*v}}}
 /* coleta */
 for(const s of G.snakes.slice()){if(!s.alive||(s.bot&&frozen))continue;const rr=s.r+(s.isMe?24:16);
  for(let i=G.foods.length-1;i>=0;i--){const f=G.foods[i];const dx=f.x-s.x,dy=f.y-s.y;if(dx>rr+30||dx<-rr-30||dy>rr+30||dy<-rr-30)continue;const d2=dx*dx+dy*dy;
   const good=s.isMe?(()=>{const j=judge(f);return j==='ok'||j==='power'})():judgeBot(f);
   const lim=good?rr+f.r*.4:(s.r*.6+f.r*.5);/* certas: área generosa · erradas: só se a cabeça realmente encostar */
   if(d2<lim*lim){if(s.isMe)eatMe(f,i);else eatBot(s,f,i,good);if(!s.alive)break}}}
 collisions();
 G.pwT-=dt;if(G.pwT<=0){G.pwT=3+Math.random()*4;if(countP()<9)spawnPower();trimFoods()}
 G.trT-=dt;if(G.trT<=0&&DB.skin.trail&&me.alive){G.trT=me.boosting?.05:.16;const t=me.segs[Math.min(3,me.segs.length-1)];G.parts.push({x:t.x,y:t.y,vx:(Math.random()-.5)*30,vy:(Math.random()-.5)*30,t:0,life:.9,ch:DB.skin.trail==='ABC'?pick(LET):DB.skin.trail,col:'#fff',r:me.r})}
 if(me.alive&&me.boosting&&Math.random()<.5){const t=me.segs[me.segs.length-1];G.parts.push({x:t.x,y:t.y,vx:(Math.random()-.5)*60,vy:(Math.random()-.5)*60,t:0,life:.4,col:me.skin.head,r:3+Math.random()*3})}
 stepFx(dt);
 const W=G.W,H=G.H;const zb=Math.min(W,H)/(W<H?520:600);const zt=zb/(1+Math.max(0,me.len-14)*.0035+me.stage*.02);G.cam.z+=(zt-G.cam.z)*Math.min(1,dt*3);if(me.alive){G.cam.x+=(me.x-G.cam.x)*Math.min(1,dt*9);G.cam.y+=(me.y-G.cam.y)*Math.min(1,dt*9)}
 G.lbT-=dt;if(G.lbT<=0){G.lbT=.6;updateLB()}
 G.mapT-=dt;if(G.mapT<=0){G.mapT=.15;drawMap()}
 const en=$('#hEn');if(en)en.style.width=me.energy+'%';
 const rs=$('#rsp');if(rs){if(!me.alive&&!G.over){const n=Math.max(0,Math.ceil(me.respawnAt-G.t));rs.style.display='block';rs.innerHTML='💥 Você caiu!<br><b>Renascendo em '+n+'s</b><small>'+(G.endless?'':'Saves restantes: '+me.saves)+'</small>'}else rs.style.display='none'}}
/* ---------- coleta do jogador ---------- */
function addScore(pts){const me=G.me;const m=dblMult(me);const v=Math.round(pts*m);me.score+=v;return v}
function wrongHit(s,f){/* peça errada: tira 1 coração (3 por save) */
 if(s.isMe&&DB.set.free)return;s.hearts--;s.len=Math.max(8,s.len-2.5);
 if(s.hearts<=0)loseSave(s,null,'hearts')}
function eatMe(f,i){const me=G.me,j=judge(f);
 if(j==='power'){G.foods.splice(i,1);applyPower(me,f.val);Snd.power();floatAt(me.x,me.y-me.r-24,PWR[f.val][0]+' '+PWR[f.val][1],'#fff');burst(f.x,f.y,'#fff',12);hud();return}
 const cls=classOf(f);
 if(j==='meh'){G.foods.splice(i,1);spawnClass(cls,true);Snd.meh();floatAt(f.x,f.y-20,'ainda não 🙂','#fde68a');return}
 if(j==='ok'){G.foods.splice(i,1);spawnClass(cls,true);G.streak++;G.best=Math.max(G.best,G.streak);G.correct++;
  const combo=Math.min(4,1+Math.floor(G.streak/6));const base=(G.mode==='palavra'||G.mode==='silaba')?15:10;const pts=addScore(base*combo);me.len+=(f.kind==='S'?1.8:1.2);
  Snd.eat(Math.min(7,G.streak%8));floatAt(f.x,f.y-18,'+'+pts+(combo>1?' ×'+combo:''),combo>1?'#fde68a':'#bbf7d0');burst(f.x,f.y,colFor(f)[0],9);sayFood(f);
  if(G.mode==='palavra'){const w=G.word;w.i++;if(w.i>=w.w.length){addScore(50);me.len+=3;G.words++;Snd.word();floatAt(me.x,me.y-me.r-30,w.w+' ✓','#fde68a');G.flash=.6;speak(w.w.toLowerCase());nextWord()}ensureNeeded()}
  if(G.correct%3===0)cleaner();
  checkStage();hud();return}
 /* errado */
 G.foods.splice(i,1);spawnClass('bad',true);G.wrong++;G.streak=0;Snd.bad();G.shake=.5;
 burst(f.x,f.y,'#ef4444',10);floatAt(f.x,f.y-20,'✗ '+hintFor(),'#fca5a5');
 wrongHit(me,f);hud()}
function hintFor(){const m=G.mode;return m==='letras'?'só letras':m==='vogal'?'só vogais':m==='consoante'?'só consoantes':m==='silaba'?'só sílabas':m==='numero'?'só números':'outra letra'}
function sayFood(f){const t=performance.now();if(t-G.spoke<380)return;G.spoke=t;
 if(f.kind==='L')speakLetter(f.val);else if(f.kind==='N')speak(NUMWORD[+f.val]);else if(f.kind==='S')speak(sylSay(f.val))}
function eatBot(s,f,i,good){G.foods.splice(i,1);
 if(f.kind==='P'){applyPower(s,f.val);spawnPower();return}
 spawnClass(classOf(f),true);
 if(good){s.score+=10;s.len+=f.kind==='S'?1.4:.9;return}
 burst(f.x,f.y,'#ef4444',6);wrongHit(s,f)}
function applyPower(s,t){
 if(t==='freeze'){if(s.isMe){G.freeze=PW_DUR}return}
 if(t==='heart'){s.hearts=Math.min(3,s.hearts+1);return}
 if(t==='double'){if(s.isMe)s.dbl.push(G.t+PW_DUR);return}
 s.pw[t]=PW_DUR}
function checkStage(){const me=G.me;let st=0;for(let i=0;i<STAGES.length;i++)if(me.score>=STAGES[i][0])st=i;
 if(st>me.stage){me.stage=st;me.hearts=3;Snd.level();G.flash=.8;banner('Nível '+(st+1)+': '+STAGES[st][1]+'!');confetti();speak('Parabéns! Você evoluiu');hud()}}
function banner(t){G.banner={t:t,at:G.t};const b=$('#banner');if(b){b.textContent=t;b.classList.remove('on');void b.offsetWidth;b.classList.add('on')}}
function floatAt(x,y,text,col){G.floats.push({x:x,y:y,text:text,col:col,t:0})}
function burst(x,y,col,n){for(let i=0;i<n;i++){const a=Math.random()*TAU,sp=40+Math.random()*140;G.parts.push({x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,t:0,life:.4+Math.random()*.4,col:col,r:2+Math.random()*3})}}
/* ---------- colisões entre serpentes (todos os modos) ---------- */
function collisions(){
 for(const a of G.snakes){if(!a.alive||a.pw.shield>0||a.pw.turbo>0||a.invul>G.t)continue;if(a.isMe&&DB.set.free)continue;if(a.bot&&G.freeze>0)continue;
  for(const b of G.snakes){if(b===a||!b.alive)continue;
   const dh=Math.hypot(a.x-b.x,a.y-b.y);if(dh>b.segs.length*spacing(b)+80)continue;
   let hit=false;for(let i=2;i<b.segs.length;i++){const q=b.segs[i];const dx=a.x-q.x,dy=a.y-q.y,rr=a.r*.7+b.r*.8;if(dx*dx+dy*dy<rr*rr){hit=true;break}}
   if(!hit&&dh<(a.r+b.r)*.7&&(a.len<b.len||(a.len===b.len&&a.isMe)))hit=true;
   if(hit){loseSave(a,b,'crash');break}}}}
/* derrota de um "save": solta as partes (peças do modo) e renasce em 10 s, ou é eliminada */
function dropParts(s){const n=clamp(Math.floor(s.len*.7),6,70);const cnt=s.segs.length;if(!cnt)return;
 for(let k=0;k<n;k++){const q=s.segs[Math.floor(k*(cnt-1)/Math.max(1,n-1))];
  for(let t=0;t<6;t++){const x=q.x+(Math.random()-.5)*36,y=q.y+(Math.random()-.5)*36;if(Math.hypot(x,y)>WR-30||!freeAt(x,y,40))continue;const f=mkFood(x,y,G.mode==='batalha'?rollFood():rollClass('ok'));f.born=G.t;G.foods.push(f);break}}}
function loseSave(s,by,why){if(!s.alive||G.over)return;s.alive=false;dropParts(s);burst(s.x,s.y,s.skin.head,26);Snd.kill();
 if(!G.endless)s.saves--;
 if(by&&by.isMe){G.kills++;by.score+=Math.round(50*dblMult(by));floatAt(s.x,s.y-20,'+50 💥','#fde68a');checkStage();hud()}
 if(s.isMe){G.shake=1;G.streak=0;
  if(s.saves<=0&&!G.endless){hud();endGame(why==='hearts'?'Acabaram os corações e os 3 saves':'Acabaram os 3 saves');return}
  s.respawnAt=G.t+10;hud();return}
 if(s.saves<=0&&!G.endless){const i=G.snakes.indexOf(s);if(i>=0)G.snakes.splice(i,1);checkWin();return}
 s.respawnAt=G.t+10}
function checkWin(){if(G.won||G.over)return;if(G.snakes.some(s=>s.bot))return;G.won=true;G.paused=true;Snd.level();confetti();G.me.hearts=3;UI.victory()}
/* ---------- fim ---------- */
function saveRun(){if(!G||G.saved)return;G.saved=true;const sc=G.me.score;DB.xp+=sc;
 if(sc>0&&!DB.set.free){const r=DB.rank[G.mode]=DB.rank[G.mode]||[];r.push({n:DB.player,c:DB.char,s:sc,d:new Date().toLocaleDateString('pt-BR')});r.sort((a,b)=>b.s-a.s);DB.rank[G.mode]=r.slice(0,10)}save()}
function endGame(reason){if(!G||G.over)return;G.over=true;music(false);Snd.die();G.reason=reason;saveRun();setTimeout(()=>UI.over(),500)}
function continueEndless(){if(!G)return;G.endless=true;G.won=true;G.paused=false;G.last=performance.now();const nb=5;for(let i=0;i<nb;i++)addBot();hud()}
function stopGame(){if(G){cancelAnimationFrame(G.raf);G=null}music(false)}
function pauseGame(){if(!G||G.over||G.paused)return;G.paused=true;UI.pauseModal()}
function resumeGame(){if(G){G.paused=false;G.last=performance.now()}}
/* ---------- entrada ---------- */
function bindInput(){const cv=G.cv,I=G.input;
 const toAng=(e)=>{const r=cv.getBoundingClientRect();return Math.atan2(e.clientY-r.top-r.height/2,e.clientX-r.left-r.width/2)};
 cv.onpointerdown=e=>{if(G.paused||G.over)return;try{cv.setPointerCapture(e.pointerId)}catch(_){}
  if(e.pointerType==='mouse'){I.ang=toAng(e);if(e.button===0)I.boost=true;I.kb=0}else{const r=cv.getBoundingClientRect();I.joy={ox:e.clientX-r.left,oy:e.clientY-r.top,x:e.clientX-r.left,y:e.clientY-r.top,id:e.pointerId}}};
 cv.onpointermove=e=>{if(G.paused||G.over)return;if(e.pointerType==='mouse'){I.ang=toAng(e);I.kb=0}else if(I.joy&&I.joy.id===e.pointerId){const r=cv.getBoundingClientRect();I.joy.x=e.clientX-r.left;I.joy.y=e.clientY-r.top;
  const dx=I.joy.x-I.joy.ox,dy=I.joy.y-I.joy.oy;if(Math.hypot(dx,dy)>10)I.ang=Math.atan2(dy,dx);
  const d=Math.hypot(dx,dy);if(d>70){I.joy.ox=I.joy.x-dx/d*70;I.joy.oy=I.joy.y-dy/d*70}}};
 const up=e=>{if(e.pointerType==='mouse'){if(e.button===0)I.boost=false}else if(I.joy&&I.joy.id===e.pointerId)I.joy=null};
 cv.onpointerup=up;cv.onpointercancel=up;cv.oncontextmenu=e=>e.preventDefault()}
function fit(){if(!G||!G.cv)return;const r=G.cv.getBoundingClientRect();const dpr=Math.min(2,window.devicePixelRatio||1);G.W=r.width;G.H=r.height;G.dpr=dpr;G.cv.width=Math.round(r.width*dpr);G.cv.height=Math.round(r.height*dpr)}
window.addEventListener('resize',()=>{try{fit()}catch(e){}});
window.addEventListener('keydown',e=>{if(!G||!$('#cv'))return;if(/^(INPUT|TEXTAREA|SELECT)$/.test((e.target||{}).tagName))return;const I=G.input;
 if(e.key==='Escape'){e.preventDefault();if(G.paused&&document.querySelector('.modal.pz'))ACT.resume();else pauseGame();return}
 if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A'){I.kb=-1;e.preventDefault()}else if(e.key==='ArrowRight'||e.key==='d'||e.key==='D'){I.kb=1;e.preventDefault()}
 else if(e.key===' '||e.key==='Shift'||e.key==='ArrowUp'){I.boost=true;e.preventDefault()}
 else if(e.key==='Control'){I.slow=true}
 else if(e.key==='p'||e.key==='P')pauseGame()});
window.addEventListener('keyup',e=>{if(!G)return;const I=G.input;if((e.key==='ArrowLeft'||e.key==='a'||e.key==='A')&&I.kb<0)I.kb=0;if((e.key==='ArrowRight'||e.key==='d'||e.key==='D')&&I.kb>0)I.kb=0;if(e.key===' '||e.key==='Shift'||e.key==='ArrowUp')I.boost=false;if(e.key==='Control')I.slow=false});
window.addEventListener('blur',()=>{if(G){G.input.boost=false;G.input.slow=false}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGame()});

/* ===== desenho e HUD ===== */
function hexRGB(h){h=h.replace('#','');return[parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)]}
function mixCol(a,b,k){const x=hexRGB(a),y=hexRGB(b);return'rgb('+Math.round(x[0]+(y[0]-x[0])*k)+','+Math.round(x[1]+(y[1]-x[1])*k)+','+Math.round(x[2]+(y[2]-x[2])*k)+')'}
function rrect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function drawFood(ctx,f,t){const c=colFor(f),pul=(1+.07*Math.sin(t*3+f.ph))*Math.min(1,.15+(t-f.born)*4),r=f.r*pul;
 ctx.save();ctx.translate(f.x,f.y);
 ctx.globalAlpha=.2;ctx.fillStyle=c[0];ctx.beginPath();ctx.arc(0,0,r*1.7,0,TAU);ctx.fill();ctx.globalAlpha=1;
 if(f.kind==='L'||f.kind==='P'){const g=ctx.createLinearGradient(0,-r,0,r);g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle='rgba(255,255,255,.75)';ctx.stroke()}
 else if(f.kind==='N'){ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;ctx.lineTo(Math.cos(a)*r*1.12,Math.sin(a)*r*1.12)}ctx.closePath();const g=ctx.createLinearGradient(0,-r,0,r);g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);ctx.fillStyle=g;ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle='#fff7d6';ctx.stroke()}
 else{const w=r*3.1,h=r*1.9;rrect(ctx,-w/2,-h/2,w,h,h/2);const g=ctx.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);ctx.fillStyle=g;ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle='rgba(255,255,255,.8)';ctx.stroke()}
 ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.ellipse(-r*.3,-r*.45,r*.38,r*.18,-.5,0,TAU);ctx.fill();
 ctx.textAlign='center';ctx.textBaseline='middle';
 if(f.kind==='P'){ctx.font=(r*1.3)+'px serif';ctx.fillText(PWR[f.val][0],0,2)}
 else{ctx.font='700 '+Math.round(r*(f.kind==='S'?1.05:1.2))+'px Fredoka,system-ui,sans-serif';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.35)';ctx.strokeText(f.val,0,1.5);ctx.fillStyle='#fff';ctx.fillText(f.val,0,1.5)}
 ctx.restore()}
function drawSnake(ctx,s,t,pv){const sk=s.skin,segs=s.segs,n=segs.length,r=s.r;
 if(s.pw&&s.pw.shield>0){ctx.strokeStyle='rgba(125,211,252,.7)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(s.x,s.y,r*2.1,0,TAU);ctx.stroke()}
 if(s.boosting){ctx.globalAlpha=.25;ctx.fillStyle=sk.head;for(let i=0;i<n;i+=3){ctx.beginPath();ctx.arc(segs[i].x,segs[i].y,r*1.5*(1-i/n*.5),0,TAU);ctx.fill()}ctx.globalAlpha=1}
 else if(s.stage>=2){ctx.globalAlpha=.12+.04*s.stage;ctx.fillStyle=sk.head;for(let i=0;i<n;i+=4){ctx.beginPath();ctx.arc(segs[i].x,segs[i].y,r*1.45,0,TAU);ctx.fill()}ctx.globalAlpha=1}
 ctx.lineWidth=2;ctx.strokeStyle='rgba(0,0,0,.28)';
 for(let i=n-1;i>=0;i--){const q=segs[i],k=i/Math.max(1,n-1),rr=r*(1-.32*k);let col;
  switch(sk.pat){case'stripes':col=(Math.floor(i/3)%2)?sk.body:sk.head;break;case'rainbow':col='hsl('+Math.round((i*14+t*60)%360)+',80%,62%)';break;case'fade':col=mixCol(sk.head,sk.body,k);break;default:col=sk.body}
  ctx.fillStyle=col;ctx.beginPath();ctx.arc(q.x,q.y,rr,0,TAU);ctx.fill();ctx.stroke();
  if(sk.pat==='dots'&&i%3===0){ctx.fillStyle=sk.head;ctx.beginPath();ctx.arc(q.x,q.y,rr*.42,0,TAU);ctx.fill()}
  if(i%2===0){ctx.fillStyle='rgba(255,255,255,.18)';ctx.beginPath();ctx.arc(q.x-rr*.25,q.y-rr*.3,rr*.4,0,TAU);ctx.fill()}}
 /* cabeça */
 const ca=Math.cos(s.ang),sa=Math.sin(s.ang);
 if(Math.sin(t*5+s.wob)>.7){ctx.strokeStyle='#ef4444';ctx.lineWidth=3;ctx.lineCap='round';const tx=s.x+ca*r*1.6,ty=s.y+sa*r*1.6;ctx.beginPath();ctx.moveTo(s.x+ca*r,s.y+sa*r);ctx.lineTo(tx,ty);ctx.moveTo(tx,ty);ctx.lineTo(tx+Math.cos(s.ang+.5)*r*.4,ty+Math.sin(s.ang+.5)*r*.4);ctx.moveTo(tx,ty);ctx.lineTo(tx+Math.cos(s.ang-.5)*r*.4,ty+Math.sin(s.ang-.5)*r*.4);ctx.stroke()}
 ctx.lineWidth=2.5;ctx.strokeStyle='rgba(255,255,255,.7)';ctx.fillStyle=sk.head;ctx.beginPath();ctx.arc(s.x,s.y,r*1.1,0,TAU);ctx.fill();ctx.stroke();
 const px=-sa,py=ca,ey=sk.eyes;
 for(const sd of[-1,1]){const ex=s.x+ca*r*.38+px*sd*r*.52,ey2=s.y+sa*r*.38+py*sd*r*.52;
  if(ey==='glasses'){ctx.fillStyle='#111827';ctx.beginPath();ctx.arc(ex,ey2,r*.5,0,TAU);ctx.fill();ctx.fillStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.arc(ex-r*.15,ey2-r*.15,r*.13,0,TAU);ctx.fill()}
  else if(ey==='love'){ctx.font=(r*1.1)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ec4899';ctx.fillText('♥',ex,ey2)}
  else{const er=ey==='big'?r*.56:r*.42;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ex,ey2,er,0,TAU);ctx.fill();ctx.fillStyle='#111827';ctx.beginPath();ctx.arc(ex+ca*er*.35,ey2+sa*er*.35,er*.5,0,TAU);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ex+ca*er*.35-er*.15,ey2+sa*er*.35-er*.2,er*.16,0,TAU);ctx.fill()}}
 if(ey==='glasses'){ctx.strokeStyle='#111827';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(s.x+ca*r*.38+px*r*.1,s.y+sa*r*.38+py*r*.1);ctx.lineTo(s.x+ca*r*.38-px*r*.1,s.y+sa*r*.38-py*r*.1);ctx.stroke()}
 if(sk.hat){ctx.font=Math.round(r*2.1)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(sk.hat,s.x,s.y-r*1.15)}
 if(s.stage>=3&&!sk.hat){ctx.font=Math.round(r*1.8)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('👑',s.x,s.y-r*1.2)}
 if(!pv&&s.name){const fs=Math.max(13,15/G.cam.z*.8);ctx.font='600 '+fs+'px Fredoka,sans-serif';ctx.textAlign='center';ctx.textBaseline='bottom';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.6)';const ny=s.y-r*2.6-(sk.hat||s.stage>=3?r*.4:0);ctx.strokeText(s.name,s.x,ny);ctx.fillStyle=s.isMe?'#fde68a':'#fff';ctx.fillText(s.name,s.x,ny)}}
function draw(){const ctx=G.ctx,W=G.W,H=G.H,dpr=G.dpr,c=G.cam,z=c.z,t=G.t,me=G.me;if(!ctx||!W)return;
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#06050e';ctx.fillRect(0,0,W,H);
 const sh=G.shake*9;ctx.setTransform(dpr*z,0,0,dpr*z,dpr*(W/2-c.x*z+(Math.random()-.5)*sh),dpr*(H/2-c.y*z+(Math.random()-.5)*sh));
 const vx0=c.x-W/2/z-60,vx1=c.x+W/2/z+60,vy0=c.y-H/2/z-60,vy1=c.y+H/2/z+60;
 /* arena */
 const ag=ctx.createRadialGradient(0,0,0,0,0,WR);ag.addColorStop(0,'#1b1740');ag.addColorStop(1,'#120f2e');ctx.fillStyle=ag;ctx.beginPath();ctx.arc(0,0,WR,0,TAU);ctx.fill();
 const gs=96;ctx.fillStyle='rgba(167,139,250,.22)';for(let x=Math.floor(vx0/gs)*gs;x<vx1;x+=gs)for(let y=Math.floor(vy0/gs)*gs;y<vy1;y+=gs){if(x*x+y*y<WR*WR){ctx.beginPath();ctx.arc(x,y,2.6,0,TAU);ctx.fill()}}
 /* comidas */
 for(const f of G.foods){if(f.x<vx0||f.x>vx1||f.y<vy0||f.y>vy1)continue;drawFood(ctx,f,t)}
 /* dica */
 if(DB.set.hint&&!G.over&&G.mode!=='batalha'){let best=null,bd=1e12;for(const f of G.foods){if(f.kind==='P')continue;if(judge(f)!=='ok')continue;const dx=f.x-me.x,dy=f.y-me.y,d=dx*dx+dy*dy;if(d<bd){bd=d;best=f}}
  if(best&&bd>260*260){const a=Math.atan2(best.y-me.y,best.x-me.x),rr=me.r+60;ctx.save();ctx.translate(me.x+Math.cos(a)*rr,me.y+Math.sin(a)*rr);ctx.rotate(a);ctx.globalAlpha=.55+.3*Math.sin(t*6);ctx.fillStyle='#fde68a';ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-8,-12);ctx.lineTo(-3,0);ctx.lineTo(-8,12);ctx.closePath();ctx.fill();ctx.restore()}}
 /* serpentes */
 const order=G.snakes.slice().sort((a,b)=>a.len-b.len);
 for(const s of order){if(!s.alive)continue;const rr=s.segs.length*spacing(s)+60;if(s.x<vx0-rr||s.x>vx1+rr||s.y<vy0-rr||s.y>vy1+rr)continue;if(s.invul>G.t){ctx.globalAlpha=.45+.35*Math.sin(t*14)}drawSnake(ctx,s,t);ctx.globalAlpha=1;
  if(s.bot&&G.freeze>0){ctx.fillStyle='rgba(125,211,252,.45)';for(let i=0;i<s.segs.length;i+=2){ctx.beginPath();ctx.arc(s.segs[i].x,s.segs[i].y,s.r*1.05,0,TAU);ctx.fill()}ctx.font=Math.round(s.r*2)+'px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('❄️',s.x,s.y)}}
 /* partículas */
 for(const p of G.parts){const a=Math.max(0,1-p.t/p.life);ctx.globalAlpha=a;if(p.ch){ctx.font='700 '+Math.round(p.r*1.2)+'px Fredoka,serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=['#fde68a','#a5f3fc','#f9a8d4','#bbf7d0'][Math.floor(p.x+p.y)&3];ctx.fillText(p.ch,p.x,p.y)}else{ctx.fillStyle=p.col;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,TAU);ctx.fill()}}ctx.globalAlpha=1;
 /* borda da arena */
 ctx.lineWidth=14;ctx.strokeStyle='rgba(244,63,94,.85)';ctx.beginPath();ctx.arc(0,0,WR+7,0,TAU);ctx.stroke();ctx.lineWidth=40;ctx.strokeStyle='rgba(244,63,94,.18)';ctx.beginPath();ctx.arc(0,0,WR+20,0,TAU);ctx.stroke();
 /* textos flutuantes */
 ctx.font='700 '+Math.max(20,22/z*.8)+'px Fredoka,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
 for(const f of G.floats){ctx.globalAlpha=Math.min(1,(1.2-f.t)*1.6);const y=f.y-f.t*50;ctx.lineWidth=4;ctx.strokeStyle='rgba(0,0,0,.65)';ctx.strokeText(f.text,f.x,y);ctx.fillStyle=f.col;ctx.fillText(f.text,f.x,y)}ctx.globalAlpha=1;
 /* tela: efeitos */
 ctx.setTransform(dpr,0,0,dpr,0,0);
 if(G.flash>0){ctx.fillStyle='rgba(255,255,255,'+G.flash*.2+')';ctx.fillRect(0,0,W,H)}
 if(G.freeze>0){ctx.fillStyle='rgba(125,211,252,'+Math.min(.12,G.freeze*.04)+')';ctx.fillRect(0,0,W,H)}
 const J=G.input.joy;if(J){ctx.globalAlpha=.35;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(J.ox,J.oy,52,0,TAU);ctx.fill();ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(J.x,J.y,24,0,TAU);ctx.fill();ctx.globalAlpha=1}}
function drawMap(){const cv=$('#mm');if(!cv||!G)return;const x=cv.getContext('2d'),S=cv.width,R=S/2-3;x.clearRect(0,0,S,S);
 x.fillStyle='rgba(10,8,30,.7)';x.beginPath();x.arc(S/2,S/2,R+2,0,TAU);x.fill();x.strokeStyle='rgba(244,63,94,.8)';x.lineWidth=2;x.stroke();
 for(const s of G.snakes){if(!s.alive)continue;x.fillStyle=s.isMe?'#fff':s.skin.head;x.beginPath();x.arc(S/2+s.x/WR*R,S/2+s.y/WR*R,s.isMe?4:2.4,0,TAU);x.fill()}}
function stageName(s){return STAGES[s.stage][1]}
function updateLB(){const el=$('#lb');if(!el||!G)return;const arr=G.snakes.slice().sort((a,b)=>b.score-a.score);
 let h='<b class="lbt">🏆 Placar</b>';arr.slice(0,5).forEach((s,i)=>{h+='<div class="lbr'+(s.isMe?' me':'')+(s.alive?'':' dead')+'"><span>'+(i+1)+'. '+esc(s.name)+(s.alive?'':' ☠')+'</span><em>'+s.score+'</em></div>'});
 const mi=arr.indexOf(G.me);if(mi>=5)h+='<div class="lbr me"><span>'+(mi+1)+'. '+esc(G.me.name)+'</span><em>'+G.me.score+'</em></div>';el.innerHTML=h;
 const pw=$('#pws');if(pw){let t='';for(const k in G.me.pw)if(G.me.pw[k]>0)t+='<span>'+PWR[k][0]+' '+Math.ceil(G.me.pw[k])+'s</span>';if(G.freeze>0)t+='<span>⏱️ '+Math.ceil(G.freeze)+'s</span>';const dm=dblMult(G.me);if(dm>1){const ex=Math.max.apply(null,G.me.dbl.filter(x=>x>G.t));t+='<span>💎 ×'+String(Math.round(dm*100)/100).replace('.',',')+' '+Math.ceil(ex-G.t)+'s</span>'}pw.innerHTML=t}}
const SH=(c,t)=>'<i class="sh '+c+'">'+t+'</i>';
function objective(){const m=G.mode;
 if(m==='letras')return'Pegue '+SH('c','A')+SH('c','B')+' <b>LETRAS</b> · evite '+SH('h','7')+' números';
 if(m==='vogal')return'Pegue <b>VOGAIS</b> '+'AEIOU'.split('').map(x=>SH('c',x)).join('')+' · evite consoantes';
 if(m==='consoante')return'Pegue <b>CONSOANTES</b> '+SH('c','B')+SH('c','M')+SH('c','T')+' · evite vogais';
 if(m==='silaba')return'Pegue <b>SÍLABAS</b> '+SH('p',DB.fam==='ALL'?'BA':DB.fam+'A')+SH('p',DB.fam==='ALL'?'ME':DB.fam+'O')+' · evite letras soltas';
 if(m==='numero')return'Pegue <b>NÚMEROS</b> '+SH('h','1')+SH('h','2')+' · evite letras';
 if(m==='palavra'){const w=G.word;return'Monte a palavra, na ordem: <span class="wsl">'+w.w.split('').map((c,i)=>'<i class="'+(i<w.i?'on':i===w.i?'cur':'')+'">'+(i<w.i?c:i===w.i?c:'_')+'</i>').join('')+'</span>'}
 return'Coma de tudo! Cuidado com os <b>corpos</b> das outras serpentes.'}
function hud(){if(!G)return;const me=G.me;const s=$('#hScore');if(s)s.textContent=me.score;
 const lv=$('#hLives');if(lv){let h='';if(DB.set.free)h='<span class="kl">∞ modo livre</span>';else{for(let i=0;i<3;i++)h+='<span class="'+(i<me.hearts?'':'off')+'">❤</span>';h+='<span class="sv">💾 '+(G.endless?'∞':me.saves)+'</span>'}if(G.mode!=='palavra'||true)h+='<span class="kl">💥 '+G.kills+'</span>';lv.innerHTML=h}
 const o=$('#hObj');if(o)o.innerHTML=objective();
 const nx=STAGES[Math.min(STAGES.length-1,me.stage+1)][0],pv=STAGES[me.stage][0];const pct=me.stage>=STAGES.length-1?100:clamp((me.score-pv)/(nx-pv)*100,0,100);
 const sb=$('#hStage');if(sb)sb.innerHTML='<span>Nv '+(me.stage+1)+' · '+STAGES[me.stage][1]+'</span><div class="bar"><i style="width:'+pct+'%"></i></div>'}

/* ===== interface ===== */
const UI={};
const PAL=[['#fb7185','#e11d48'],['#fb923c','#ea580c'],['#facc15','#ca8a04'],['#34d399','#12a574'],['#22d3ee','#0e9fb5'],['#60a5fa','#2f6fe0'],['#a78bfa','#7c3aed'],['#f472b6','#db2777']];
const app=()=>$('#app');
function modal(html,cls){const m=document.createElement('div');m.className='modal';m.innerHTML='<div class="mcard '+(cls||'')+'">'+html+'</div>';document.body.appendChild(m);return m}
function closeModals(){document.querySelectorAll('.modal').forEach(m=>m.remove());stopPrev()}
function closeTop(){const a=document.querySelectorAll('.modal');if(a.length)a[a.length-1].remove();stopPrev()}
function rainbow(t){let i=0;return t.split('').map(ch=>ch===' '?'<span class="sp0"></span>':'<span style="--i:'+(i)+';--c:'+PAL[(i++)%PAL.length][0]+'">'+esc(ch)+'</span>').join('')}
const fsBtn=()=>FSOK?'<button class="icon" data-act="fs" aria-label="Tela cheia">⛶</button>':'';
function confetti(){const w=document.createElement('div');w.className='cfw';
 for(let i=0;i<70;i++){const c=document.createElement('i');c.className='cf';c.style.left=Math.random()*100+'%';c.style.background=PAL[i%PAL.length][0];c.style.animationDelay=Math.random()*.6+'s';c.style.animationDuration=1.8+Math.random()*1.6+'s';c.style.setProperty('--r',(Math.random()*720-360)+'deg');c.style.setProperty('--x',(Math.random()*160-80)+'px');w.appendChild(c)}
 document.body.appendChild(w);setTimeout(()=>w.remove(),4200)}
const CHARS=['👦🏻','👧🏻','👦🏽','👧🏽','👦🏿','👧🏿','🧒🏼'];
const unl=x=>DB.set.unlock||DB.xp>=x;
/* ---------- inicial ---------- */
UI.welcome=function(){stopGame();closeModals();document.body.classList.remove('playing');document.body.classList.add('cred');UI.scr='welcome';
 app().innerHTML='<div class="scr welcome"><div class="wrap"><div class="top" style="justify-content:flex-end">'+fsBtn()+'<button class="icon" data-act="settings" aria-label="Configurações">⚙️</button></div>'
 +'<div class="logo"><img src="logo.png" alt="Serpenteando a Alfabetização" class="logoimg"><div class="slither"><canvas id="pvw" width="360" height="90"></canvas></div></div>'
 +'<p class="sub">Cresça sua serpente aprendendo letras, sílabas e palavras!</p>'
 +'<label class="fld namef"><span>Qual é o seu nome?</span><input type="text" id="nm" maxlength="14" placeholder="Digite seu nome" autocomplete="off" value="'+esc(DB.player||'')+'"></label>'
 +'<div class="chars">'+CHARS.map(c=>'<button class="chr'+(c===DB.char?' on':'')+'" data-act="char" data-c="'+c+'">'+c+'</button>').join('')+'</div>'
 +'<button class="btn primary jogar" data-act="start">▶ JOGAR</button>'
 +'<div class="row sec"><button class="btn" data-act="custom">🎨 Personalizar</button><button class="btn" data-act="rank">🏆 Ranking</button><button class="btn" data-act="prof">👩‍🏫 Professor</button></div></div></div>';
 startPrev('#pvw')};
/* prévia animada da serpente */
let prevT=0,prevRaf=0;
function stopPrev(){if(prevRaf&&!$('#pvw')&&!$('#pvc')){cancelAnimationFrame(prevRaf);prevRaf=0}}
function startPrev(sel){cancelAnimationFrame(prevRaf);const cv=$(sel);if(!cv)return;const ctx=cv.getContext('2d');
 const f=t=>{const c=$(sel);if(!c){prevRaf=0;return}prevRaf=requestAnimationFrame(f);const W=c.width,H=c.height;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,W,H);
  const tt=t/1000,segs=[];const n=15,r=H*.17;for(let i=0;i<n;i++){const x=W*.78-i*r*.9;segs.push({x:x,y:H/2+Math.sin(tt*3-i*.45)*H*.17})}
  const fake={x:segs[0].x+r*.9,y:segs[0].y,ang:Math.cos(tt*3)*.25,segs:segs,r:r,stage:0,skin:DB.skin,pw:{},boosting:false,wob:0};drawSnake(ctx,fake,tt,true)};
 prevRaf=requestAnimationFrame(f)}
UI.start=function(){const i=$('#nm');const v=(i.value||'').trim().slice(0,14);if(!v){i.classList.remove('shake');void i.offsetWidth;i.classList.add('shake');i.focus();toast('Digite seu nome 🙂');return}
 DB.player=v;save();speak('Olá '+v);UI.modes()};
/* ---------- modos ---------- */
UI.modes=function(){stopGame();closeModals();document.body.classList.remove('playing');document.body.classList.add('cred');UI.scr='modes';
 const best=m=>{const r=DB.rank[m];return r&&r.length?r[0].s:0};
 app().innerHTML='<div class="scr"><div class="wrap"><div class="top"><button class="icon" data-act="welcome" aria-label="Voltar">←</button><button class="pill" data-act="welcome"><span class="av">'+DB.char+'</span>'+esc(DB.player)+'</button><span style="flex:1"></span>'+fsBtn()+'<button class="icon" data-act="settings" aria-label="Configurações">⚙️</button></div>'
 +'<h1 class="rainbow big2">'+rainbow('Escolha o jogo')+'</h1><p class="sub">Toque em um modo para começar</p><div class="cards">'
 +Object.keys(MODES).map(k=>{const M=MODES[k];return'<button class="modeCard" style="--mc:'+M.color+'" data-act="play" data-m="'+k+'"><div class="mIco'+(M.icon.length>2?' sm':'')+'">'+M.icon+'</div><b>'+M.name+'</b><span>'+M.desc+'</span><div class="prog">🏆 Recorde: '+best(k)+'</div></button>'}).join('')
 +'</div><div class="sect">Família das sílabas (Caça-sílaba)</div><div class="tg">'+['ALL'].concat(FAMS).map(f=>'<button class="'+(DB.fam===f?'on':'')+'" data-act="fam" data-f="'+f+'">'+(f==='ALL'?'Todas':f)+'</button>').join('')+'</div></div></div>'};
UI.play=function(m){if(!DB.player){toast('Digite seu nome primeiro');return UI.welcome()}closeModals();UI.mode=m;UI.scr='game';
 document.body.classList.add('playing');document.body.classList.remove('cred');
 app().innerHTML='<div id="game"><canvas id="cv"></canvas><div class="ghud"><div class="hl"><div class="hbtns"><button class="gb" data-act="quit" aria-label="Sair">✕</button><button class="gb" data-act="pause" aria-label="Pausar">❚❚</button><button class="gb" data-act="help" aria-label="Ajuda">?</button></div><div id="hLives" class="hearts"></div><div id="pws"></div></div>'
 +'<div class="hc"><small>PONTOS</small><b id="hScore">0</b></div><div id="lb" class="lb"></div></div>'
 +'<div id="hObj" class="obj"></div><div id="banner" class="banner"></div><div id="rsp" class="rsp"></div><div class="hb"><div id="hStage" class="stg"></div><div class="en"><i id="hEn"></i></div></div><canvas id="mm" width="96" height="96"></canvas><button class="boostb" id="bbtn" aria-label="Turbo">⚡</button></div>';
 const b=$('#bbtn');b.onpointerdown=e=>{e.preventDefault();if(G)G.input.boost=true;try{b.setPointerCapture(e.pointerId)}catch(_){}};b.onpointerup=b.onpointercancel=()=>{if(G)G.input.boost=false};
 startGame(m);if(!DB.seen){DB.seen=true;save();setTimeout(()=>{if(G&&!G.over&&!G.paused)UI.help()},300)}};
const HELP={letras:'Pegue as <b>letras</b> (bolinhas). Os <b>números</b> (hexágonos dourados) são armadilha!',vogal:'Pegue só as <b>vogais</b> A E I O U. Consoantes tiram uma vida.',consoante:'Pegue só as <b>consoantes</b>. Vogais tiram uma vida.',silaba:'Pegue só as <b>sílabas</b> (pílulas rosa). Letras soltas tiram uma vida.',numero:'Pegue só os <b>números</b> (hexágonos dourados). Letras tiram uma vida.',palavra:'Pegue as letras <b>na ordem</b> da palavra. Letra da palavra fora de hora vale “ainda não”; letra que não é da palavra tira uma vida.',batalha:'Arena! Coma de tudo e cresça. Se sua cabeça tocar o <b>corpo</b> de outra serpente, você perde. Faça as outras baterem em você!'};
UI.help=function(){if(!G)return;const was=G.paused;if(!G.over)G.paused=true;
 const m=modal('<div class="big">🐍</div><h2>'+MODES[G.mode].name+'</h2><div class="how"><p>'+HELP[G.mode]+'</p><p><b>Mouse:</b> a serpente segue o cursor.</p><p><b>Celular:</b> arraste o dedo para guiar · botão ⚡ = dash.</p><p><b>Teclado:</b> ← → (ou A D) viram.</p><p><b>Clique esquerdo/Espaço</b> = dash · <b>Ctrl</b> = devagar para manobrar · <b>Esc</b> = pausa.</p><p>Você tem <b>3 saves</b> com <b>3 corações</b> cada. Peça errada tira um coração; bater em outra serpente derruba o save. Você renasce em 10s e as peças dela viram comida!</p><p>Power-ups: ⏱️ congela as outras · 🛡️ escudo · ⚡ turbo+imune · 🧲 ímã · 💎 pontos ×1,5 (acumula até ×15) · 💛 coração.</p></div><button class="btn primary" data-act="closehelp">Entendi!</button>');m.dataset.res=was?'0':'1'};
UI.pauseModal=function(){const m=modal('<div class="big">⏸</div><h2>Pausado</h2><button class="btn primary" data-act="resume">▶ Continuar (Esc)</button><button class="btn" data-act="restart">↺ Reiniciar</button><button class="btn" data-act="settings">⚙️ Configurações</button><button class="btn" data-act="help">? Como jogar</button><button class="btn danger" data-act="menu">Sair para o menu (salva)</button>');m.classList.add('pz')};
UI.victory=function(){const me=G.me,nm=Object.keys(MODES),nx=nm[(nm.indexOf(G.mode)+1)%nm.length];
 modal('<div class="big">🏆</div><h2>Você venceu o modo!</h2><p>Todas as outras serpentes foram eliminadas. Você é o campeão de <b>'+MODES[G.mode].name+'</b>!</p><div class="stat"><div><b>'+me.score+'</b><span>PONTOS</span></div><div><b>'+G.kills+'</b><span>DERROTAS</span></div><div><b>'+me.saves+'</b><span>SAVES</span></div></div><button class="btn primary" data-act="contwin">∞ Continuar jogando</button><button class="btn" data-act="nextmode">Próximo modo: '+MODES[nx].name+' ▶</button><button class="btn" data-act="menu">Menu</button>');speak('Parabéns! Você venceu')};
UI.over=function(){if(!G)return;const me=G.me,tot=G.correct+G.wrong,acc=tot?Math.round(G.correct/tot*100):0;confetti();
 const bt=DB.rank[G.mode]&&DB.rank[G.mode][0]&&DB.rank[G.mode][0].s===me.score&&me.score>0;
 modal('<div class="big">'+'💔'+'</div><h2>'+esc(G.reason||'Fim de jogo')+'</h2>'+(bt?'<p style="color:#fde68a;font-weight:700">🏆 Novo recorde!</p>':'')
 +'<div class="stat"><div><b>'+me.score+'</b><span>PONTOS</span></div><div><b>'+(me.stage+1)+'</b><span>NÍVEL</span></div><div><b>'+G.correct+'</b><span>ACERTOS</span></div>'
 +'<div><b>'+acc+'%</b><span>PRECISÃO</span></div><div><b>'+G.best+'</b><span>MELHOR SEQ.</span></div><div><b>'+(G.mode==='palavra'?G.words:G.kills)+'</b><span>'+(G.mode==='palavra'?'PALAVRAS':'DERROTAS')+'</span></div>'+'</div>'
 +'<button class="btn primary" data-act="restart">↺ Jogar este modo de novo</button><button class="btn" data-act="menu">Escolher outro modo</button><button class="btn" data-act="rank">🏆 Ranking</button>')};
/* ---------- ranking ---------- */
UI.rank=function(m){m=m||UI.rm||'letras';UI.rm=m;closeModals();
 const r=DB.rank[m]||[];
 const mm=modal('<h2>🏆 Ranking</h2><div class="tg" style="justify-content:center;margin-bottom:10px">'+Object.keys(MODES).map(k=>'<button class="'+(k===m?'on':'')+'" data-act="rankm" data-m="'+k+'" style="font-size:14px">'+MODES[k].name+'</button>').join('')+'</div>'
 +'<ol class="rl">'+(r.length?r.map((e,i)=>'<li><span>'+(i+1)+'. '+esc(e.c||'🐍')+' '+esc(e.n)+'</span><b>'+e.s+'</b><small>'+esc(e.d||'')+'</small></li>').join(''):'<li style="justify-content:center;color:var(--mut)">Nenhuma pontuação ainda.</li>')+'</ol><button class="btn" data-act="close">Fechar</button>','left')};
/* ---------- personalizar ---------- */
UI.custom=function(){closeModals();const s=DB.skin;
 const chip=(a,k,v,l,on,lock)=>'<button class="'+(on?'on':'')+(lock?' lock':'')+'" data-act="sk" data-k="'+k+'" data-v="'+esc(v)+'">'+l+(lock?' 🔒':'')+'</button>';
 modal('<h2>🎨 Minha serpente</h2><canvas id="pvc" width="320" height="100" class="pvc"></canvas>'
 +'<div class="sect" style="margin-top:6px">Cores</div><div class="sw2">'+PALETTES.map((p,i)=>'<button class="swc'+(s.head===p[0]?' on':'')+'" style="background:linear-gradient(135deg,'+p[0]+','+p[1]+')" data-act="pal" data-i="'+i+'"></button>').join('')+'</div>'
 +'<div class="row" style="margin-top:8px"><label class="fld" style="margin:0"><span>Cabeça</span><input type="color" id="chd" value="'+s.head+'" class="cin"></label><label class="fld" style="margin:0"><span>Corpo</span><input type="color" id="cbd" value="'+s.body+'" class="cin"></label></div>'
 +'<div class="sect">Padrão</div><div class="tg">'+PATS.map(p=>chip(0,'pat',p[0],p[1],s.pat===p[0])).join('')+'</div>'
 +'<div class="sect">Olhos</div><div class="tg">'+EYES.map(p=>chip(0,'eyes',p[0],p[1],s.eyes===p[0])).join('')+'</div>'
 +'<div class="sect">Acessório</div><div class="tg">'+HATS.map(p=>chip(0,'hat',p[0],(p[0]||'')+' '+p[1],s.hat===p[0],!unl(p[2]))).join('')+'</div>'
 +'<div class="sect">Rastro</div><div class="tg">'+TRAILS.map(p=>chip(0,'trail',p[0],(p[0]==='ABC'?'🔤':p[0])+' '+p[1],s.trail===p[0],!unl(p[2]))).join('')+'</div>'
 +'<p class="sub" style="font-size:12px;margin-top:10px">⭐ Seus pontos somados: <b>'+DB.xp+'</b> — jogue para liberar acessórios!</p><button class="btn primary" data-act="close">Pronto</button>','left');
 const h=$('#chd'),b=$('#cbd');h.oninput=()=>{DB.skin.head=h.value;save()};b.oninput=()=>{DB.skin.body=b.value;save()};startPrev('#pvc')};
/* ---------- configurações ---------- */
UI.settings=function(){const inGame=!!(UI.scr==='game'&&G);if(!inGame)closeModals();const old=document.querySelector('.modal.set');if(old)old.remove();const s=DB.set;
 const m=modal('<h2>⚙️ Configurações</h2>'
 +(FSOK?'<div class="sw"><span>⛶ Tela cheia</span><button class="'+(isFS()?'on':'')+'" data-act="fs2" aria-label="Tela cheia"></button></div>':'')
 +'<div class="sw"><span>🔊 Som</span><button class="'+(s.sound?'on':'')+'" data-act="sw" data-k="sound" aria-label="Som"></button></div>'
 +'<div class="sw"><span>🗣️ Voz</span><button class="'+(s.voice?'on':'')+'" data-act="sw" data-k="voice" aria-label="Voz"></button></div>'
 +'<div class="sw"><span>🧭 Seta de dica</span><button class="'+(s.hint?'on':'')+'" data-act="sw" data-k="hint" aria-label="Dica"></button></div>'
 +'<div class="sect" style="margin:12px 0 6px">Velocidade da serpente</div><div class="tg">'+[[.8,'Calma'],[1,'Normal'],[1.25,'Rápida']].map(x=>'<button class="'+(s.speed===x[0]?'on':'')+'" data-act="spd" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>'
 +'<div class="row" style="margin-top:16px"><button class="btn primary" data-act="savecfg">💾 Salvar</button><button class="btn danger" data-act="exitcfg">'+(inGame?'Sair':UI.scr==='welcome'?'Fechar':'Sair')+'</button></div>','left');m.classList.add('set')};
/* ---------- professor ---------- */
UI.prof=function(){closeModals();const m=modal('<h2>👩‍🏫 Professor</h2><p>Digite a senha do professor.</p><input type="password" id="pw" placeholder="Senha" autocomplete="off"><div class="row" style="margin-top:14px"><button class="btn primary" data-act="pinok">Entrar</button><button class="btn" data-act="close">Cancelar</button></div>');m.classList.add('pin');setTimeout(()=>{const i=$('#pw');i&&i.focus()},60)};
UI.profPanel=function(){closeModals();const s=DB.set;
 modal('<h2>👩‍🏫 Painel do Professor</h2>'
 +'<div class="sw"><span>🕊️ Modo livre<br><small style="color:var(--mut)">Sem vidas perdidas e sem ranking</small></span><button class="'+(s.free?'on':'')+'" data-act="sw2" data-k="free"></button></div>'
 +'<div class="sw"><span>🔓 Liberar acessórios e rastros</span><button class="'+(s.unlock?'on':'')+'" data-act="sw2" data-k="unlock"></button></div>'
 +'<label class="fld"><span>Palavras da turma (uma por linha — usadas em “Monte a Palavra”)</span><textarea id="wl" placeholder="BOLA&#10;CASA&#10;GATO">'+esc((DB.words||[]).join('\n'))+'</textarea><small>Deixe vazio para usar a lista padrão. Use 3 a 8 letras.</small></label>'
 +'<div class="row" style="margin-top:12px"><button class="btn primary" data-act="savew">💾 Salvar palavras</button><button class="btn danger" data-act="clrank">Limpar ranking</button></div><button class="btn" data-act="close">Fechar</button>','left')};
/* ---------- ações ---------- */
const ACT={
 welcome(){UI.welcome()},start(){UI.start()},modes(){UI.modes()},fs(){toggleFS();setTimeout(()=>{if(document.querySelector('.modal.set'))UI.settings()},250)},fs2(){toggleFS();setTimeout(UI.settings,300)},
 settings(){UI.settings()},custom(){UI.custom()},rank(){UI.rank()},rankm(d){UI.rank(d.m)},prof(){UI.prof()},close(){closeTop()},
 char(d){DB.char=d.c;save();document.querySelectorAll('.chr').forEach(b=>b.classList.toggle('on',b.dataset.c===d.c))},
 play(d){const i=$('#nm');UI.play(d.m)},fam(d){DB.fam=d.f;save();UI.modes()},
 sk(d){const lockMap={hat:HATS,trail:TRAILS};if(lockMap[d.k]){const x=lockMap[d.k].find(z=>z[0]===d.v);if(x&&!unl(x[2]))return toast('Faltam '+(x[2]-DB.xp)+' pontos para liberar 🔒')}DB.skin[d.k]=d.v;save();UI.custom()},
 pal(d){const p=PALETTES[+d.i];DB.skin.head=p[0];DB.skin.body=p[1];save();UI.custom()},
 quit(){pauseGame()},pause(){pauseGame()},help(){UI.help()},
 closehelp(){const m=document.querySelector('.modal');const res=m&&m.dataset.res==='1';closeTop();if(res&&!document.querySelector('.modal')&&G&&!G.over)resumeGame()},
 resume(){closeModals();resumeGame()},
 restart(){saveRun();closeModals();UI.play(UI.mode)},
 menu(){saveRun();closeModals();UI.modes()},
 contwin(){closeModals();continueEndless()},
 nextmode(){const nm=Object.keys(MODES),nx=nm[(nm.indexOf(UI.mode)+1)%nm.length];saveRun();closeModals();UI.play(nx)},
 sw(d){DB.set[d.k]=!DB.set[d.k];save();UI.settings()},spd(d){DB.set.speed=+d.v;save();UI.settings()},
 sw2(d){DB.set[d.k]=!DB.set[d.k];save();UI.profPanel()},
 pinok(){const i=$('#pw');if(i.value==='prof123'||i.value==='941587'){UI.profPanel()}else{i.classList.remove('shake');void i.offsetWidth;i.classList.add('shake');i.value=''}},
 savew(){const l=($('#wl').value||'').split('\n').map(w=>w.trim().toUpperCase().normalize('NFD').replace(/[^A-Z]/g,'')).filter(w=>w.length>=3&&w.length<=8);DB.words=Array.from(new Set(l));save();toast(DB.words.length?DB.words.length+' palavras salvas ✓':'Lista padrão restaurada ✓')},
 clrank(){DB.rank={};save();toast('Ranking limpo ✓')},
 savecfg(){save();toast('Configurações salvas ✓');closeTop()},
 exitcfg(){save();closeModals();if(UI.scr==='game'&&G){if(G.paused&&!G.over)UI.pauseModal()}else if(UI.scr==='welcome'){}else UI.welcome()}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=ACT[b.dataset.act];if(a){Snd.ui();a(b.dataset)}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'){const t=e.target;if(t&&t.id==='nm')UI.start();else if(t&&t.id==='pw')ACT.pinok()}});

/* ===== fundo animado ===== */
function bgFX(){const cv=document.createElement('canvas');cv.id='bg';document.body.insertBefore(cv,document.body.firstChild);
 const x=cv.getContext('2d');let W=0,H=0,dpr=1;const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 const TX='ABCDEFGHIJLMNOPQRSTUVXZ0123456789'.split('').concat(['BA','CA','LE','MO','TU','PI','NHA','FA','VE','LI','GO','🐍']);let P=[],S=[];
 function init(){dpr=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';
  const n=Math.max(14,Math.min(34,Math.round(W*H/32000)));P=[];for(let i=0;i<n;i++)P.push(mk(true));S=[];for(let i=0;i<50;i++)S.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+.4,p:Math.random()*6.28})}
 function mk(r){return{x:Math.random()*W,y:r?Math.random()*H:H+60,v:.25+Math.random()*.6,s:26+Math.random()*44,ch:TX[Math.floor(Math.random()*TX.length)],rot:(Math.random()-.5)*.8,vr:(Math.random()-.5)*.006,c:PAL[Math.floor(Math.random()*PAL.length)][0],a:.12+Math.random()*.16,ph:Math.random()*6.28}}
 let last=0;function frame(t){requestAnimationFrame(frame);if(document.hidden||t-last<33||document.body.classList.contains('playing'))return;last=t;
  x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);S.forEach(s=>{x.globalAlpha=.25+.5*Math.abs(Math.sin(t/900+s.p));x.fillStyle='#fff';x.beginPath();x.arc(s.x,s.y,s.r,0,6.28);x.fill()});
  x.textAlign='center';x.textBaseline='middle';
  P.forEach((p,i)=>{if(!reduce){p.y-=p.v;p.rot+=p.vr}if(p.y<-70)P[i]=mk(false);x.save();x.translate(p.x+Math.sin(t/1500+p.ph)*14,p.y);x.rotate(p.rot);x.globalAlpha=p.a;x.fillStyle=p.c;x.shadowColor=p.c;x.shadowBlur=18;x.font='700 '+p.s+'px Fredoka,system-ui,sans-serif';x.fillText(p.ch,0,0);x.restore()})}
 init();addEventListener('resize',init);requestAnimationFrame(frame)}

bgFX();UI.welcome();
if('serviceWorker' in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));

