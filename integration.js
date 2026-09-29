/* GitHub Pages integration: only public report data is fetched by the browser. */
(function () {
  'use strict';
  const state={rx:{folder:'data',runs:[],selected:0,report:null},dx:{folder:'dnl',runs:[],selected:0,report:null}};
  let generation=0;
  function safeURL(value){try{const u=new URL(value,location.href);return /^https?:$/.test(u.protocol)?u.href:'#';}catch{return '#';}}
  function articles(){return state[CUR].report?.articles||[];}
  function normal(a){return {title:a.title||a.headline||'',summary:a.summary||'',source:a.source_name||a.company||a.source_type||'',date:a.date||'',url:a.link||a.url||'',hot:a.hot||'',type:a.news_type||''};}
  function rows(list){return list.map(normal).map(a=>'<article class="news"><div class="m"><span class="pill '+(a.hot==='HOT'?'p-r':'')+'">'+esc(a.hot||a.source)+'</span><span>'+esc(a.type)+' · '+esc(a.date)+'</span></div><h4>'+esc(a.title)+'</h4><p>'+esc(a.summary)+'</p><div class="m">'+esc(a.source)+'</div>'+(a.url?'<a href="'+esc(safeURL(a.url))+'" target="_blank" rel="noopener noreferrer">Read source ↗</a>':'')+'</article>').join('');}
  function controls(){const s=state[CUR];return '<div class="chips"><label>Report date <select id="report-date" class="chip">'+s.runs.map((r,i)=>'<option value="'+i+'" '+(i===s.selected?'selected':'')+'>'+esc(r.date)+(s.folder==='dnl'?' · '+esc(r.file.slice(15,21)):'')+' ('+r.count+')</option>').join('')+'</select></label><input class="chip" id="search-news" placeholder="Search headlines, companies, summaries" aria-label="Search news"><button class="chip" id="refresh-news">Refresh</button></div>';}
  function download(){const s=state[CUR],r=s.runs[s.selected];return r?.excel?'<a class="chip" download href="'+esc(s.folder+'/'+r.excel)+'">Download Excel ↓</a>':'';}
  R.news=function(){const s=state[CUR];return head(CUR==='rx'?'News Radar':'DNL Automation','Results from your existing tools · '+CL[CUR].name)+'<div class="card" style="margin-bottom:16px"><b>Latest available report: '+esc(s.runs[0]?.date||'No published run')+'</b><p>This viewer refreshes from your existing tools approximately every three hours.</p></div>'+controls()+download()+'<div id="news-status" role="status" style="margin:12px 0">Loading reports…</div><div id="news-results"></div>';};
  function paint(){const s=state[CUR],q=($('search-news')?.value||'').toLowerCase();const list=articles().filter(a=>JSON.stringify(a).toLowerCase().includes(q));$('news-results').innerHTML=rows(list);$('news-status').textContent=s.error||(!s.runs.length?'No published output yet. No retained report is available from the existing tool yet.':list.length+' matching articles'+(s.report?.source_conclusion && s.report.source_conclusion!=='success'?' · Source workflow status: '+s.report.source_conclusion+'. This report may be partial.':''));}
  async function fetchJSON(path){const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw new Error('Could not load '+path+' (HTTP '+r.status+').');return r.json();}
  async function loadReport(){const key=CUR,s=state[key],token=++generation;s.error='';s.report=null;try{if(s.runs.length)s.report=await fetchJSON(s.folder+'/'+s.runs[s.selected].file);}catch(e){s.error=e.message+' Click Refresh to retry.';}if(token===generation&&CUR===key&&VIEW==='news')paint();}
  async function loadIndex(){const key=CUR,s=state[key];s.error='';try{const result=await fetchJSON(s.folder+'/index.json');s.runs=result.runs;s.selected=Math.min(s.selected,Math.max(0,s.runs.length-1));}catch(e){s.error=e.message+' Serve this site through GitHub Pages, not by double-clicking the HTML file.';}if(CUR!==key||VIEW!=='news')return;open_('news');}
  after.news=function(){const s=state[CUR];$('report-date').onchange=function(){s.selected=Number(this.value);loadReport();};$('search-news').oninput=paint;$('refresh-news').onclick=loadIndex;if(s.error){paint();return;}loadReport();};
  R.letter=function(){return head('Newsletter Report','Selected published run. Open Daily News Alerts to choose a different report date.')+download()+'<div style="margin:16px 0"><button class="sm" onclick="window.print()">Print / save PDF</button></div>'+ (articles().length?rows(articles()):'<div class="card">Open Daily News Alerts to load a report first. No sample stories are shown.</div>');};
  // Keep the supplied prototype layouts, but clearly distinguish them from pipeline output.
  Object.keys(R).filter(k=>!['news','letter'].includes(k)).forEach(k=>{const original=R[k];R[k]=function(){if(k==='month'||k==='bot')return head(k==='bot'?'Research Bot':'Monthly Report','Not connected')+'<div class="card">This module needs its own reporting or AI backend. News Radar and DNL Automation are connected in Daily News Alerts.</div>';return '<div class="card" style="margin-bottom:16px;border-color:#b8860b"><b>Illustrative layout — not generated from current pipeline results.</b></div>'+original();};delete after[k];});
  // The original demo login is not access control. This distribution is explicitly public.
  $('login').remove();USER={email:'Public report viewer',clients:['rx','dx']};CUR='rx';
  $('app').classList.remove('hid');$('who').textContent='Public workspace · no sign-in protection';$('out').remove();
  $('csel').innerHTML='<option value="rx">RxBenefits · News Radar</option><option value="dx">Immunodiagnostics · DNL</option>';
  $('csel').onchange=function(){CUR=this.value;open_('news');loadIndex();};
  const oldBuild=buildNav;buildNav=function(){oldBuild();const badge=document.querySelector('.ni .n');if(badge)badge.textContent=state[CUR].runs[0]?.count||0;};
  open_('news');loadIndex();
})();
