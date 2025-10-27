const gallery = [
  { img:'images/descartes.jpg', name:'René Descartes', quote:'"Cogito, ergo sum"', text:'René Descartes menatapmu tajam. “Menurutmu, kebenaran berasal dari mana?”', music:'audio/descartes.wav', choices:[{text:'Dari kemampuan manusia berpikir.',reason:1},{text:'Dari wahyu dan kepercayaan pada Tuhan.',religious:1}]},
  { img:'images/locke.jpg', name:'John Locke', quote:'"Reason must be our last judge and guide in everything."', text:'John Locke berkata, “Pengalaman membentuk pengetahuan kita. Kamu setuju?”', music:'audio/locke.wav', choices:[{text:'Ya, semua berasal dari pengalaman manusia.',reason:1},{text:'Tidak, pengetahuan sejati datang dari iman.',religious:1}]},
  { img:'images/voltaire.jpg', name:'Voltaire', quote:'"Those who can make you believe absurdities can make you commit atrocities."', text:'Voltaire tersenyum sinis. “Agama sering mengekang pikiran. Apa pendapatmu?”', music:'audio/voltaire.wav', choices:[{text:'Kita harus bebas berpikir tanpa batasan agama.',reason:1},{text:'Agama tetap dibutuhkan sebagai panduan moral.',religious:1}]},
  { img:'images/pascal.jpg', name:'Blaise Pascal', quote:'"The heart has its reasons which reason knows nothing of."', text:'Blaise Pascal menunduk. “Akal manusia terbatas. Percaya pada Tuhan lebih penting.”', music:'audio/pascal.wav', choices:[{text:'Benar, hati memiliki alasannya sendiri.',religious:1},{text:'Tidak, akal adalah alat utama memahami dunia.',reason:1}]},
  { img:'images/kant.jpg', name:'Immanuel Kant', quote:'"Dare to know! Have the courage to use your own understanding."', text:'Immanuel Kant menatapmu penuh harap. “Beranilah berpikir sendiri. Sapere Aude!”', music:'audio/kant.wav', choices:[{text:'Aku akan berpikir dengan kebebasan.',reason:1},{text:'Namun aku tetap berpegang pada iman.',religious:1}]}
];

let index = 0, reasonScore = 0, religScore = 0;
const mainPortrait = document.getElementById('mainPortrait');
const miniPortrait = document.getElementById('miniPortrait');
const canvasName = document.getElementById('canvasName');
const canvasQuote = document.getElementById('canvasQuote');
const question = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const progress = document.getElementById('progress');
const resultOverlay = document.getElementById('resultOverlay');
const resultTitle = document.getElementById('resultTitle');
const resultDesc = document.getElementById('resultDesc');
const restartBtn = document.getElementById('restartBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const bgMusic = document.getElementById('bgMusic');

let autoTimer = null;

function render(i){
  const s = gallery[i];
  mainPortrait.style.opacity = 0;
  clearTimeout(autoTimer);

  setTimeout(()=>{
    mainPortrait.src = s.img;
    miniPortrait.src = s.img;
    canvasName.textContent = s.name;
    canvasQuote.textContent = s.quote;
    question.textContent = s.text;
    progress.textContent = `Scene ${i+1} / ${gallery.length}`;
    choicesEl.innerHTML = '';
    s.choices.forEach(c=>{
      const btn=document.createElement('div');
      btn.className='choice';
      btn.textContent=c.text;
      btn.onclick=()=>selectChoice(c);
      choicesEl.appendChild(btn);
    });

    // change music per scene (wav placeholders)
    bgMusic.src = s.music;
    bgMusic.currentTime = 0;
    bgMusic.play().catch(()=>{/* autoplay may be blocked */});

    mainPortrait.style.opacity = 1;
  },300);

  // automatically advance after 8 seconds (unless user answers earlier)
  autoTimer = setTimeout(()=>{
    if(index < gallery.length-1){
      index++;
      render(index);
    } else {
      finish();
    }
  }, 8000);
}

function selectChoice(choice){
  if(choice.reason) reasonScore++;
  if(choice.religious) religScore++;
  // immediate advance on choice
  if(index < gallery.length-1){
    index++;
    render(index);
  } else {
    finish();
  }
}

function finish(){
  clearTimeout(autoTimer);
  const total = reasonScore + religScore || 1;
  const rPct = Math.round((reasonScore / total) * 100);
  const gPct = Math.round((religScore / total) * 100);
  let title='', desc='';
  if(rPct > gPct + 10){ title='Filsuf Rasional'; desc=`Kamu condong pada akal dan rasio — percaya pada eksperimen dan kritik terhadap dogma. (${rPct}% vs ${gPct}%).`; }
  else if(gPct > rPct + 10){ title='Pemikir Religius'; desc=`Kamu condong pada iman dan tradisi — menempatkan wahyu sebagai sumber kebenaran. (${rPct}% vs ${gPct}%).`; }
  else { title='Pemikir Seimbang'; desc=`Kamu menggabungkan akal dan iman secara seimbang dalam memahami dunia. (${rPct}% vs ${gPct}%).`; }
  resultTitle.textContent = title;
  resultDesc.textContent = desc;
  resultOverlay.style.display = 'flex';
  bgMusic.pause();
}

restartBtn.onclick = ()=>location.reload();
prevBtn.onclick = ()=>{ if(index>0){ index--; render(index); } };
nextBtn.onclick = ()=>{ if(index<gallery.length-1){ index++; render(index); } };

// start
render(0);