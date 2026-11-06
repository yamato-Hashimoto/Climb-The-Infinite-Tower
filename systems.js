'use strict';
/* Expansion systems: expeditions, labyrinth, artifacts, crafting, contracts, codex, season journey. */
window.EXPANSION_DATA={
 artifacts:[
  {id:'sun',name:'太陽の聖杯',icon:'☀️',rarity:'SSR',desc:'攻撃力と獲得ゴールドを増加',atk:.05,gold:.08},
  {id:'moon',name:'月影の鏡',icon:'🌙',rarity:'SR',desc:'会心率とドロップ率を増加',crit:.02,drop:.04},
  {id:'wind',name:'疾風の羽根',icon:'🪽',rarity:'R',desc:'攻撃速度を増加',speed:.05},
  {id:'earth',name:'大地の心核',icon:'💚',rarity:'SR',desc:'最大HPと防御力を増加',hp:.08,def:.06},
  {id:'star',name:'星界の羅針盤',icon:'🧭',rarity:'SSR',desc:'放置報酬を増加',idle:.12},
  {id:'void',name:'虚無の王冠',icon:'👑',rarity:'UR',desc:'全能力を増加',all:.06}
 ],
 relics:[
  {id:'power',name:'猛攻のルーン',icon:'⚔️',desc:'迷宮中の攻撃力+20%',power:20},
  {id:'vital',name:'生命のルーン',icon:'❤️',desc:'迷宮中の最大HP+25%',power:25},
  {id:'critical',name:'狙撃のルーン',icon:'🎯',desc:'迷宮中の会心率+12%',power:12},
  {id:'fortune',name:'黄金のルーン',icon:'🪙',desc:'迷宮報酬+30%',power:30},
  {id:'haste',name:'加速のルーン',icon:'⏱️',desc:'迷宮中の攻撃速度+15%',power:15},
  {id:'revive',name:'不死鳥の羽',icon:'🔥',desc:'敗北時に一度だけ復活',power:1},
  {id:'execute',name:'処刑者の印',icon:'💀',desc:'HP20%以下の敵へ追加ダメージ',power:20},
  {id:'shield',name:'守護者の盾',icon:'🛡️',desc:'受けるダメージ-18%',power:18},
  {id:'combo',name:'連撃の書',icon:'📕',desc:'攻撃時10%で追加攻撃',power:10}
 ],
 expeditions:[
  {id:0,name:'草原の薬草採取',icon:'🌿',minutes:5,power:50,reward:{gold:400,stone:2},unlock:1},
  {id:1,name:'森の魔物調査',icon:'🌲',minutes:15,power:180,reward:{gold:1500,gems:20},unlock:10},
  {id:2,name:'洞窟の鉱石探索',icon:'⛏️',minutes:30,power:420,reward:{gold:4000,stone:8},unlock:20},
  {id:3,name:'砂漠の隊商護衛',icon:'🐪',minutes:60,power:900,reward:{gold:11000,gems:80},unlock:35},
  {id:4,name:'火山竜の追跡',icon:'🌋',minutes:120,power:1800,reward:{gold:26000,ticket:2},unlock:50},
  {id:5,name:'星界遺跡の発掘',icon:'🌌',minutes:240,power:4000,reward:{gold:70000,gems:260,artifact:1},unlock:80}
 ],
 contracts:[
  {id:'kill50',name:'討伐依頼',desc:'敵を50体倒す',key:'killsToday',target:50,reward:{gems:60}},
  {id:'floor10',name:'塔の踏破',desc:'10階進む',key:'floorsToday',target:10,reward:{gems:80}},
  {id:'gear5',name:'装備収集',desc:'装備を5個入手',key:'gearToday',target:5,reward:{stone:10}},
  {id:'boss3',name:'守護者狩り',desc:'ボスを3体倒す',key:'bossToday',target:3,reward:{ticket:1}},
  {id:'enhance5',name:'鍛冶修行',desc:'装備を5回強化',key:'enhanceToday',target:5,reward:{gems:70}},
  {id:'gacha3',name:'召喚研究',desc:'ガチャを3回引く',key:'gachaToday',target:3,reward:{gems:50}}
 ],
 seasonRewards:[
  {lv:1,free:{gold:500},premium:{gems:50}},{lv:2,free:{stone:3},premium:{ticket:1}},
  {lv:3,free:{gems:30},premium:{gold:2500}},{lv:4,free:{gold:1500},premium:{stone:8}},
  {lv:5,free:{ticket:1},premium:{gems:120}},{lv:6,free:{stone:5},premium:{gold:5000}},
  {lv:7,free:{gems:50},premium:{ticket:2}},{lv:8,free:{gold:3000},premium:{stone:12}},
  {lv:9,free:{ticket:1},premium:{gems:200}},{lv:10,free:{artifact:1},premium:{ticket:5}}
 ],
 forgeRecipes:[
  {id:'stone',name:'上質な強化石',icon:'💠',cost:{gold:800,stone:3},reward:{stone:5}},
  {id:'ticket',name:'召喚チケット',icon:'🎟️',cost:{gold:5000,stone:12},reward:{ticket:1}},
  {id:'gem',name:'磨かれたジェム',icon:'💎',cost:{gold:12000,stone:20},reward:{gems:100}},
  {id:'artifact',name:'神器の欠片',icon:'✨',cost:{gold:50000,stone:50},reward:{artifact:1}}
 ]
};
window.ExpansionSystems=class{
 constructor(state,api){this.S=state;this.api=api;this.initState();this.tickTimer=setInterval(()=>this.tick(),1000)}
 initState(){const S=this.S;S.expansion=Object.assign({artifacts:{},equippedArtifact:null,expeditions:[],labyrinth:{floor:0,hp:100,relics:[],active:false,seed:0,claimed:false},contractsClaimed:[],seasonXp:0,seasonClaimed:[],codex:{enemies:[],gear:[],heroes:[]},login:{last:'',streak:0,claimed:false},instantRewards:2,forgeCount:0,expeditionNotified:{}},S.expansion||{});S.daily=Object.assign({gearToday:0,bossToday:0},S.daily||{})}
 fmtReward(r){return Object.entries(r).map(([k,v])=>`${this.icon(k)}${v}`).join(' ')}
 icon(k){return({gold:'🪙',gems:'💎',stone:'💠',ticket:'🎟️',artifact:'✨'})[k]||'🎁'}
 grant(r){const S=this.S;for(const[k,v]of Object.entries(r)){if(k==='gold'||k==='gems')S[k]=(S[k]||0)+v;else if(k==='artifact'){for(let i=0;i<v;i++)this.dropArtifact()}else S.items[k]=(S.items[k]||0)+v}this.api.render();this.api.save()}
 dropArtifact(){const pool=EXPANSION_DATA.artifacts;const a=pool[Math.floor(Math.random()*pool.length)];this.S.expansion.artifacts[a.id]=(this.S.expansion.artifacts[a.id]||0)+1;this.api.toast(`神器獲得：${a.name}`)}
 record(type,id){const c=this.S.expansion.codex;if(!c[type].includes(id)){c[type].push(id);this.S.expansion.seasonXp+=10}}
 onKill(enemy){this.record('enemies',enemy.id);if(enemy.type==='ボス')this.S.daily.bossToday=(this.S.daily.bossToday||0)+1;this.S.expansion.seasonXp+=enemy.type==='ボス'?20:2}
 onGear(gearId){this.record('gear',gearId);this.S.daily.gearToday=(this.S.daily.gearToday||0)+1}
 onHero(heroId){this.record('heroes',heroId);this.S.expansion.seasonXp+=50}
 tick(){const now=Date.now();for(const e of this.S.expansion.expeditions){const key=e.id+'_'+e.ends;if(!e.claimed&&now>=e.ends&&!this.S.expansion.expeditionNotified[key]){e.done=true;this.S.expansion.expeditionNotified[key]=1;this.api.toast('遠征が完了しました');this.api.save()}}}
 loginCheck(){const d=new Date().toISOString().slice(0,10),L=this.S.expansion.login;if(L.last!==d){const y=new Date(Date.now()-86400000).toISOString().slice(0,10);L.streak=L.last===y?Math.min(7,L.streak+1):1;L.last=d;L.claimed=false}if(!L.claimed)this.showLogin()}
 showLogin(){const L=this.S.expansion.login,rewards=[100,150,250,400,600,900,1500];this.api.modal(`<h2>📅 ログインボーナス</h2><div class="login-grid">${rewards.map((v,i)=>`<div class="login-day ${i+1===L.streak?'today':''}"><b>${i+1}日目</b><span>🪙${v}</span></div>`).join('')}</div><button class="big-action" data-exp="claim-login">本日の報酬を受け取る</button>`)}
 claimLogin(){const L=this.S.expansion.login;if(L.claimed)return;const rewards=[100,150,250,400,600,900,1500];this.grant({gold:rewards[L.streak-1]});L.claimed=true;this.api.close();this.api.toast(`${L.streak}日目の報酬を獲得`)}
 menu(){this.api.modal(`<h2>冒険コンテンツ</h2><div class="system-grid"><button data-exp="expedition">🧭<b>遠征</b><small>時間で報酬を獲得</small></button><button data-exp="labyrinth">🌀<b>異界迷宮</b><small>遺物を選ぶ連戦</small></button><button data-exp="artifact">✨<b>神器</b><small>恒久能力を強化</small></button><button data-exp="forge">⚒️<b>鍛冶工房</b><small>素材を合成</small></button><button data-exp="contract">📜<b>冒険依頼</b><small>日替わり目標</small></button><button data-exp="season">🎫<b>シーズン</b><small>長期進行報酬</small></button><button data-exp="codex">📚<b>コレクション</b><small>発見率と報酬</small></button><button data-exp="instant">⏩<b>高速放置</b><small>2時間分を即獲得</small></button></div>`)}
 expedition(){const now=Date.now(),running=this.S.expansion.expeditions;this.api.modal(`<h2>🧭 遠征</h2><p>最大3件を同時進行できます。</p>${EXPANSION_DATA.expeditions.map(e=>{const run=running.find(x=>x.id===e.id&&!x.claimed),locked=this.S.maxFloor<e.unlock,remain=run?Math.max(0,Math.ceil((run.ends-now)/1000)):0;return `<div class="system-row ${locked?'locked':''}"><span>${e.icon}</span><div><b>${e.name}</b><small>${e.minutes}分 / 必要戦力${e.power} / ${this.fmtReward(e.reward)}</small></div>${run?`<button data-exp="claim-exp" data-id="${e.id}" ${remain>0?'disabled':''}>${remain>0?Math.ceil(remain/60)+'分':'受取'}</button>`:`<button data-exp="start-exp" data-id="${e.id}" ${locked||running.filter(x=>!x.claimed).length>=3?'disabled':''}>出発</button>`}</div>`}).join('')}`)}
 startExp(id){const e=EXPANSION_DATA.expeditions.find(x=>x.id===id);if(!e||this.S.maxFloor<e.unlock)return;this.S.expansion.expeditions.push({id,ends:Date.now()+e.minutes*60000,claimed:false});this.expedition();this.api.save()}
 claimExp(id){const r=this.S.expansion.expeditions.find(x=>x.id===id&&!x.claimed),e=EXPANSION_DATA.expeditions.find(x=>x.id===id);if(!r||Date.now()<r.ends)return;r.claimed=true;this.grant(e.reward);this.api.toast('遠征報酬を獲得');this.expedition()}
 labyrinth(){const L=this.S.expansion.labyrinth;if(!L.active)this.api.modal(`<h2>🌀 異界迷宮</h2><p>全12戦。勝利ごとに3つの遺物から1つを選択します。迷宮内の強化は挑戦終了時にリセットされます。</p><button class="big-action" data-exp="lab-start">迷宮へ挑戦</button>`);else this.labBattle()}
 labStart(){this.S.expansion.labyrinth={floor:1,hp:100,relics:[],active:true,seed:Date.now(),claimed:false};this.labBattle()}
 labBattle(){const L=this.S.expansion.labyrinth,enemyPower=Math.round(55*Math.pow(1.28,L.floor-1)),playerPower=this.api.power()*(1+L.relics.length*.08),chance=Math.min(.95,Math.max(.25,playerPower/(playerPower+enemyPower)));this.api.modal(`<h2>🌀 異界迷宮 ${L.floor}/12</h2><div class="lab-progress"><i style="width:${L.floor/12*100}%"></i></div><p>迷宮HP ${Math.round(L.hp)}%　遺物 ${L.relics.length}個</p><div class="lab-enemy">👹<b>迷宮の守護者</b><small>推奨戦力 ${enemyPower} / 勝率目安 ${Math.round(chance*100)}%</small></div><button class="big-action" data-exp="lab-fight">戦闘開始</button>`)}
 labFight(){const L=this.S.expansion.labyrinth,enemyPower=55*Math.pow(1.28,L.floor-1),chance=Math.min(.95,Math.max(.25,this.api.power()*(1+L.relics.length*.08)/(this.api.power()*(1+L.relics.length*.08)+enemyPower)));if(Math.random()>chance){L.hp-=28;if(L.hp<=0){L.active=false;this.api.toast('迷宮攻略失敗');this.api.close();return}this.api.toast('苦戦したが先へ進んだ')}if(L.floor>=12){const reward={gold:8000+this.S.maxFloor*300,gems:150,stone:20};L.active=false;this.grant(reward);this.api.modal(`<div class="reward-show"><div class="reward-icon">🏆</div><h2>迷宮制覇！</h2><p>${this.fmtReward(reward)}</p></div>`);return}this.relicChoice()}
 relicChoice(){const all=[...EXPANSION_DATA.relics].sort(()=>Math.random()-.5).slice(0,3);this.api.modal(`<h2>遺物を1つ選択</h2><div class="relic-grid">${all.map(r=>`<button data-exp="relic" data-id="${r.id}"><span>${r.icon}</span><b>${r.name}</b><small>${r.desc}</small></button>`).join('')}</div>`)}
 chooseRelic(id){const L=this.S.expansion.labyrinth;L.relics.push(id);L.floor++;this.labBattle()}
 artifacts(){const E=this.S.expansion;this.api.modal(`<h2>✨ 神器</h2><p>装備中の神器はメイン戦闘にも恒久効果を与えます。</p><div class="artifact-grid">${EXPANSION_DATA.artifacts.map(a=>{const lv=E.artifacts[a.id]||0,eq=E.equippedArtifact===a.id;return `<button class="artifact ${a.rarity} ${eq?'equipped':''} ${!lv?'locked':''}" data-exp="equip-artifact" data-id="${a.id}" ${!lv?'disabled':''}><span>${a.icon}</span><b>${a.name}</b><small>Lv.${lv} ${a.desc}</small></button>`}).join('')}</div>`)}
 equipArtifact(id){this.S.expansion.equippedArtifact=id;this.api.toast('神器を装備');this.artifacts();this.api.render()}
 forge(){this.api.modal(`<h2>⚒️ 鍛冶工房</h2>${EXPANSION_DATA.forgeRecipes.map(r=>`<div class="system-row"><span>${r.icon}</span><div><b>${r.name}</b><small>必要 ${this.fmtReward(r.cost)} → ${this.fmtReward(r.reward)}</small></div><button data-exp="craft" data-id="${r.id}">合成</button></div>`).join('')}`)}
 craft(id){const r=EXPANSION_DATA.forgeRecipes.find(x=>x.id===id);for(const[k,v]of Object.entries(r.cost)){const have=k==='gold'||k==='gems'?this.S[k]:this.S.items[k]||0;if(have<v)return this.api.toast('素材が足りません')}for(const[k,v]of Object.entries(r.cost)){if(k==='gold'||k==='gems')this.S[k]-=v;else this.S.items[k]-=v}this.grant(r.reward);this.S.expansion.forgeCount++;this.api.toast('合成に成功');this.forge()}
 contracts(){this.api.modal(`<div class="reward-header"><h2>📜 冒険依頼</h2><button class="claim-all-btn" data-exp="claim-all-contract">一括受取</button></div>${EXPANSION_DATA.contracts.map(c=>{const v=this.S.daily[c.key]||0,done=v>=c.target,claimed=this.S.expansion.contractsClaimed.includes(c.id);return `<div class="system-row"><span>${done?'✅':'📌'}</span><div><b>${c.name}</b><small>${c.desc} ${Math.min(v,c.target)}/${c.target}</small></div><button data-exp="claim-contract" data-id="${c.id}" ${!done||claimed?'disabled':''}>${claimed?'済':this.fmtReward(c.reward)}</button></div>`}).join('')}`)}
 claimContract(id){const c=EXPANSION_DATA.contracts.find(x=>x.id===id);if((this.S.daily[c.key]||0)<c.target||this.S.expansion.contractsClaimed.includes(id))return;this.S.expansion.contractsClaimed.push(id);this.grant(c.reward);this.contracts()}
 season(){const level=Math.min(10,1+Math.floor(this.S.expansion.seasonXp/100));this.api.modal(`<div class="reward-header"><h2>🎫 シーズンジャーニー</h2><button class="claim-all-btn" data-exp="claim-all-season">一括受取</button></div><p>シーズンLv.${level} / XP ${this.S.expansion.seasonXp%100}/100</p><div class="season-track">${EXPANSION_DATA.seasonRewards.map(r=>{const unlocked=level>=r.lv,claimed=this.S.expansion.seasonClaimed.includes(r.lv);return `<div class="season-node ${unlocked?'open':'locked'}"><b>Lv.${r.lv}</b><span>${this.fmtReward(r.free)}</span><button data-exp="claim-season" data-id="${r.lv}" ${!unlocked||claimed?'disabled':''}>${claimed?'済':'受取'}</button></div>`}).join('')}</div>`)}
 claimSeason(lv){if(this.S.expansion.seasonClaimed.includes(lv)||1+Math.floor(this.S.expansion.seasonXp/100)<lv)return;const r=EXPANSION_DATA.seasonRewards.find(x=>x.lv===lv);this.S.expansion.seasonClaimed.push(lv);this.grant(r.free);this.season()}
 codex(){const C=this.S.expansion.codex,counts=[['敵',C.enemies.length,120],['装備',C.gear.length,GAME_DATA.equipment.length],['キャラ',C.heroes.length,12]];this.api.modal(`<h2>📚 コレクション</h2>${counts.map(x=>`<div class="codex-row"><b>${x[0]}</b><div><i style="width:${x[1]/x[2]*100}%"></i></div><span>${x[1]}/${x[2]}</span></div>`).join('')}<p>新発見ごとにシーズンXPを獲得します。</p>`)}
 instant(){if(this.S.expansion.instantRewards<=0)return this.api.toast('本日の高速放置は使用済み');const gold=Math.round(this.api.power()*120);this.S.expansion.instantRewards--;this.grant({gold,stone:3});this.api.toast('2時間分の放置報酬を獲得')}
 claimAllContracts(){let merged={};let n=0;for(const c of EXPANSION_DATA.contracts){if((this.S.daily[c.key]||0)>=c.target&&!this.S.expansion.contractsClaimed.includes(c.id)){this.S.expansion.contractsClaimed.push(c.id);for(const[k,v]of Object.entries(c.reward))merged[k]=(merged[k]||0)+v;n++}}if(n){this.grant(merged);this.api.toast(`依頼報酬を${n}件一括受取`)}else this.api.toast('受取可能な報酬はありません');this.contracts()}
 claimAllSeason(){const level=Math.min(10,1+Math.floor(this.S.expansion.seasonXp/100));let merged={},n=0;for(const r of EXPANSION_DATA.seasonRewards){if(r.lv<=level&&!this.S.expansion.seasonClaimed.includes(r.lv)){this.S.expansion.seasonClaimed.push(r.lv);for(const[k,v]of Object.entries(r.free))merged[k]=(merged[k]||0)+v;n++}}if(n){this.grant(merged);this.api.toast(`シーズン報酬を${n}件一括受取`)}else this.api.toast('受取可能な報酬はありません');this.season()}
 handle(action,id){if(action==='menu')this.menu();if(action==='expedition')this.expedition();if(action==='start-exp')this.startExp(+id);if(action==='claim-exp')this.claimExp(+id);if(action==='labyrinth')this.labyrinth();if(action==='lab-start')this.labStart();if(action==='lab-fight')this.labFight();if(action==='relic')this.chooseRelic(id);if(action==='artifact')this.artifacts();if(action==='equip-artifact')this.equipArtifact(id);if(action==='forge')this.forge();if(action==='craft')this.craft(id);if(action==='contract')this.contracts();if(action==='claim-contract')this.claimContract(id);if(action==='claim-all-contract')this.claimAllContracts();if(action==='season')this.season();if(action==='claim-season')this.claimSeason(+id);if(action==='claim-all-season')this.claimAllSeason();if(action==='codex')this.codex();if(action==='instant')this.instant();if(action==='claim-login')this.claimLogin()}
};
