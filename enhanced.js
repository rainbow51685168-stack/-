
/* ToolVerse 擴充功能：保留 main.js 原有搜尋與預覽邏輯 */
const tv = id => document.getElementById(id);
const tvEscape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const editorial = {
 'Midjourney':'編輯觀察草稿：可比較藝術風格與中文提示詞的理解情況；建議使用中、英文相同指令各測試一次。',
 'Adobe Firefly':'編輯觀察草稿：適合觀察與 Adobe 工作流程的整合程度，並比較修圖功能的操作步驟。',
 'Nano Banana':'編輯觀察草稿：可測試對話式修改是否容易上手，並觀察多次修改時的畫面一致性。',
 'Recraft':'編輯觀察草稿：可測試向量圖與品牌素材的生成品質，尤其是圖形邊緣與版型。'
};
const scoreDefaults = { 'Midjourney':[3,5,3,3,1], 'Adobe Firefly':[4,4,4,3,3], 'Nano Banana':[5,4,5,5,4], 'Recraft':[4,4,4,3,3] };
const scoreNames = ['易用性','生成品質','中文支援','性價比','免費額度'];
function scoresFor(tool) { return scoreDefaults[tool.name] || [3,3,3,3,3]; }
function updatePreviewExtras(tool) {
  const values=scoresFor(tool), avg=(values.reduce((a,b)=>a+b,0)/5).toFixed(1);
  tv('previewCustomScore').innerHTML='<p class="tv-score">'+avg+' / 5.0 <small>（示範分數）</small></p>'+scoreNames.map((name,i)=>'<div class="tv-score-row"><span>'+name+'</span><span>'+values[i]+' / 5</span></div>').join('');
  const action = tool.category==='圖片生成'?'輸入圖片描述並設定風格':tool.category==='影片生成'?'輸入腳本或上傳參考圖片':'輸入主題、歌詞或聲音需求';
  tv('previewSteps').innerHTML=['開啟官方網站並註冊或登入',action,'預覽結果、調整設定並確認下載與授權'].map(t=>'<li>'+t+'</li>').join('');
  tv('previewEditorial').textContent=editorial[tool.name] || '編輯觀察草稿：建議實際測試操作流程、中文理解與免費額度，再補上自己的使用心得。';
}
const originalOpenPreview = openPreview;
openPreview = function(tool) { originalOpenPreview(tool); updatePreviewExtras(tool); };

function getVotes(){ try { return JSON.parse(localStorage.getItem('tvVotes')||'{}')||{}; } catch(e){return {};} }
function addVotes() {
  document.querySelectorAll('.tool-card').forEach(card=>{
    const name=card.querySelector('.card-name')?.textContent;
    const tool=tools.find(t=>t.name===name); if(!tool || card.querySelector('.tv-vote')) return;
    const b=document.createElement('button'); b.type='button'; b.className='tv-vote';
    const votes=getVotes(); b.textContent='👍 推薦 · '+(votes[tool.id]?1:0)+' 票（本機）';
    b.addEventListener('click',e=>{e.stopPropagation(); const v=getVotes(); v[tool.id]=!v[tool.id]; try{localStorage.setItem('tvVotes',JSON.stringify(v));}catch(e){} b.textContent='👍 推薦 · '+(v[tool.id]?1:0)+' 票（本機）'; });
    card.appendChild(b);
    const note=document.createElement('p');note.className='tv-card-note';note.textContent=editorial[name]||'編輯評論待補：試用後記錄優點、限制與推薦情境。';card.insertBefore(note,b);
    const s=scoresFor(tool);const avg=(s.reduce((a,b)=>a+b,0)/5).toFixed(1);
    const score=document.createElement('p');score.className='tv-card-score';score.textContent='ToolVerse 示範評分 '+avg+'/5';card.insertBefore(score,note);
  });
}
const originalRenderCards=renderCards;
renderCards=function(){originalRenderCards();addVotes();};
addVotes();

tv('navExplore').addEventListener('click',e=>{e.preventDefault();closePreview();tv('explore').scrollIntoView({behavior:'smooth'});});
tv('featureTabs').addEventListener('click',e=>{
 const b=e.target.closest('[data-panel]');if(!b)return;
 document.querySelectorAll('.tv-tab').forEach(x=>x.classList.toggle('tv-active',x===b));
 document.querySelectorAll('.tv-panel').forEach(x=>x.classList.toggle('is-hidden',x.id!==b.dataset.panel));
});
function priceNumber(tool){const m=tool.price.match(/\$([\d.]+)/);return m?Number(m[1]):0;}
tv('quizForm').addEventListener('submit',e=>{
 e.preventDefault();const cat=tv('quizUse').value,budget=tv('quizBudget').value,skill=tv('quizSkill').value;
 const candidates=tools.filter(t=>t.category===cat).filter(t=>budget==='any'||(budget==='free'?t.priceTag==='免費':priceNumber(t)<=10));
 candidates.sort((a,b)=> (skill==='beginner'?(a.priceTag==='免費'?-3:0)-(b.priceTag==='免費'?-3:0):0) || priceNumber(a)-priceNumber(b));
 tv('quizResult').innerHTML=candidates.length?'<h4>推薦先試試</h4>'+candidates.slice(0,3).map(t=>'<p><strong>'+tvEscape(t.name)+'</strong> — '+tvEscape(t.desc)+'（'+tvEscape(t.price)+'）</p>').join(''):'<p>目前沒有符合預算的同類工具，可以放寬預算再試一次。</p>';
});
const scenarios=[['我想做 YouTube 封面','Midjourney + Recraft','先探索視覺風格，再調整文字排版與品牌元素。'],['我想替報告配背景音樂','SOUNDRAW + Suno','先決定情緒、長度與用途，下載前確認授權。'],['我想做短影音','Pika + Kling AI','用簡短腳本測試動態與鏡頭一致性。'],['我想做虛擬講者影片','HeyGen','測試人物口型、語音與字幕品質。']];
tv('scenarioCards').innerHTML=scenarios.map(s=>'<article class="tv-mini-card"><h4>'+s[0]+'</h4><p><strong>'+s[1]+'</strong></p><p>'+s[2]+'</p></article>').join('');
const comparisons=[['Midjourney','待實測','待實測','原資料：付費','藝術視覺'],['Adobe Firefly','待實測','待實測','原資料：免費試用','Adobe 設計流程'],['Nano Banana','待實測','待實測','原資料：免費','入門與對話式修圖'],['Recraft','待實測','待實測','原資料：免費試用','品牌圖形／插畫']];
tv('compareRows').innerHTML=comparisons.map(r=>'<tr>'+r.map(v=>'<td>'+v+'</td>').join('')+'</tr>').join('');
const maxPrice=Math.max(...tools.map(priceNumber),1);
tv('priceChart').innerHTML=tools.map(t=>'<div class="tv-price-row"><span>'+tvEscape(t.name)+'</span><div class="tv-price-track"><div class="tv-price-fill" style="width:'+(priceNumber(t)/maxPrice*100)+'%"></div></div><strong>'+(priceNumber(t)?'$'+priceNumber(t):'免費')+'</strong></div>').join('');
tv('costForm').addEventListener('submit',e=>{
 e.preventDefault();const im=Math.max(0,Number(tv('imageCount').value)||0),vi=Math.max(0,Number(tv('videoCount').value)||0);
 const image=tools.filter(t=>t.category==='圖片生成').sort((a,b)=>priceNumber(a)-priceNumber(b))[0];
 const video=tools.filter(t=>t.category==='影片生成').sort((a,b)=>priceNumber(a)-priceNumber(b))[0];
 tv('costResult').textContent='需求：每月 '+im+' 張圖片、'+vi+' 支影片。以網站現有起價資料來看，圖片類最低起價為 '+image.name+'（'+image.price+'），影片類最低起價為 '+video.name+'（'+video.price+'）。但是否足夠生成這個數量，仍需查詢各工具的點數及額度。';
});
const prompts=[['圖片','YouTube 封面','Create a cinematic YouTube thumbnail about a future city, strong focal point, purple-pink lighting, clean composition, space for headline, 16:9.'],['圖片','品牌插畫','Minimal vector illustration of a friendly robot in a creative studio, pastel lilac and blush pink palette, simple geometric shapes, no text.'],['影片','產品短片','Create a 6-second product reveal with a slow camera push-in, soft studio lighting, clean background, smooth motion, no text overlays.'],['音樂','報告背景音樂','Create calm instrumental background music for a student presentation, warm piano, subtle ambient textures, no vocals, unobtrusive mood.']];
tv('promptCards').innerHTML=prompts.map((p,i)=>'<article class="tv-mini-card"><small>'+p[0]+'</small><h4>'+p[1]+'</h4><p class="tv-prompt">'+tvEscape(p[2])+'</p><button type="button" class="tv-secondary tv-copy" data-index="'+i+'">複製 Prompt</button></article>').join('');
tv('promptCards').addEventListener('click',async e=>{const b=e.target.closest('.tv-copy');if(!b)return;const value=prompts[Number(b.dataset.index)][2];try{await navigator.clipboard.writeText(value);b.textContent='已複製 ✓';}catch(err){const area=document.createElement('textarea');area.value=value;document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();b.textContent='已複製 ✓';}});
tv('licenseRows').innerHTML=tools.map(t=>'<tr><td>'+tvEscape(t.name)+'</td><td><a href="'+encodeURI(t.officialUrl)+'" target="_blank" rel="noopener noreferrer">查看官方網站 ↗</a></td><td>待查核官方條款</td><td>待查核方案限制</td></tr>').join('');
// 將自己的生成作品加入此陣列，例如 {file:'images/my-art.jpg',tool:'Midjourney',prompt:'...' }
const galleryItems=[];
tv('galleryCards').innerHTML=galleryItems.length?galleryItems.map(x=>'<article class="tv-mini-card"><img class="tv-gallery-image" src="'+tvEscape(x.file)+'" alt="作品"><h4>'+tvEscape(x.tool)+'</h4><p>'+tvEscape(x.prompt)+'</p></article>').join(''):'<article class="tv-mini-card"><h4>尚未上傳作品</h4><p>完成實際生成後，在 enhanced.js 加入圖片路徑、工具名稱和使用的 Prompt。</p></article>';
tv('wishForm').addEventListener('submit',e=>{e.preventDefault();const title=tv('wishTitle').value.trim(),detail=tv('wishText').value.trim();if(!title)return;try{const items=JSON.parse(localStorage.getItem('tvWishes')||'[]');items.push({title,detail});localStorage.setItem('tvWishes',JSON.stringify(items));tv('wishThanks').textContent='感謝你的建議！已儲存在這台瀏覽器。';}catch(err){tv('wishThanks').textContent='感謝你的建議！目前瀏覽器無法儲存資料。';}tv('wishForm').reset();});
