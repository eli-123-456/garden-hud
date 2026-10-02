(function(){var e=`garden_hud_v1`,t={apiUrl:`https://api.deepseek.com/v1/chat/completions`,apiKey:``,apiModel:`deepseek-chat`,rules:`新植物的外观必须与森林、月光、藤蔓相关；能力不能是攻击性的；稀有度概率：普通60%、稀有30%、史诗10%。`};function n(){try{let n=localStorage.getItem(e);if(n){let e=JSON.parse(n);return{plants:e.plants||[],config:{...t,...e.config}}}}catch{}return{plants:[],config:{...t}}}function r(t){localStorage.setItem(e,JSON.stringify(t));try{let e=window.TavernHelper;e&&e.setVariables&&e.setVariables({type:`chat`,variables:{stat_data:{后花园植物库:t.plants}}})}catch(e){console.warn(`[繁育台] 写入 MVU 失败，可忽略：`,e)}}var i=n();function a(e){return String(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}function o(){let e=document.createElement(`div`);e.id=`garden-hud-ball`,e.textContent=`🌿`,e.style.cssText=`position:fixed;right:16px;bottom:120px;width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#4a7c59,#2d4a35);color:#fff;font-size:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:99999;box-shadow:0 4px 14px rgba(0,0,0,.35);user-select:none`,document.body.appendChild(e);let t=document.createElement(`div`);t.id=`garden-hud-panel`,t.style.cssText=`position:fixed;inset:0;background:#1e2a22;color:#e8f0e8;z-index:99998;display:none;flex-direction:column;font-family:serif;overflow:hidden`,t.innerHTML=`
        <div style="display:flex;gap:6px;padding:12px;background:#16201a;border-bottom:1px solid #3a5a44;flex-shrink:0">
            <button data-tab="breed" class="garden-tab" style="flex:1;padding:10px;border:none;border-radius:8px;background:#4a7c59;color:#fff;font-size:14px">繁育台</button>
            <button data-tab="lib"   class="garden-tab" style="flex:1;padding:10px;border:none;border-radius:8px;background:#2d3f33;color:#a8c8b0;font-size:14px">植物库</button>
            <button data-tab="cfg"   class="garden-tab" style="flex:1;padding:10px;border:none;border-radius:8px;background:#2d3f33;color:#a8c8b0;font-size:14px">设置</button>
            <button id="garden-close" style="padding:10px 14px;border:none;border-radius:8px;background:#5a2d2d;color:#fff;font-size:14px">✕</button>
        </div>

        <!-- 繁育台 -->
        <div id="garden-breed" style="flex:1;overflow:auto;padding:16px">
            <label style="display:block;margin-bottom:6px;color:#a8c8b0">父本</label>
            <input id="garden-p1" list="garden-p1-list" placeholder="选择或输入植物名" style="width:100%;padding:10px;border-radius:8px;border:1px solid #3a5a44;background:#16201a;color:#e8f0e8;font-size:15px;box-sizing:border-box;margin-bottom:12px">
            <datalist id="garden-p1-list"></datalist>

            <label style="display:block;margin-bottom:6px;color:#a8c8b0">母本</label>
            <input id="garden-p2" list="garden-p2-list" placeholder="选择或输入植物名" style="width:100%;padding:10px;border-radius:8px;border:1px solid #3a5a44;background:#16201a;color:#e8f0e8;font-size:15px;box-sizing:border-box;margin-bottom:12px">
            <datalist id="garden-p2-list"></datalist>

            <div id="env-block"></div>

            <button id="garden-breed-btn" style="width:100%;padding:14px;border:none;border-radius:10px;background:linear-gradient(135deg,#4a7c59,#2d4a35);color:#fff;font-size:16px;margin-top:8px">🌱 开始繁育</button>
            <div id="garden-result" style="margin-top:16px;display:none"></div>
        </div>

        <!-- 植物库 -->
        <div id="garden-lib" style="flex:1;overflow:auto;padding:16px;display:none"></div>

        <!-- 设置 -->
        <div id="garden-cfg" style="flex:1;overflow:auto;padding:16px;display:none">
            <label style="display:block;margin-bottom:6px;color:#a8c8b0">API URL</label>
            <input id="cfg-url" placeholder="https://api.deepseek.com/v1/chat/completions" style="width:100%;padding:10px;border-radius:8px;border:1px solid #3a5a44;background:#16201a;color:#e8f0e8;font-size:14px;box-sizing:border-box;margin-bottom:12px">

            <label style="display:block;margin-bottom:6px;color:#a8c8b0">API Key</label>
            <input id="cfg-key" type="password" placeholder="sk-..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #3a5a44;background:#16201a;color:#e8f0e8;font-size:14px;box-sizing:border-box;margin-bottom:12px">

            <label style="display:block;margin-bottom:6px;color:#a8c8b0">模型名</label>
            <input id="cfg-model" placeholder="deepseek-chat" style="width:100%;padding:10px;border-radius:8px;border:1px solid #3a5a44;background:#16201a;color:#e8f0e8;font-size:14px;box-sizing:border-box;margin-bottom:12px">

            <label style="display:block;margin-bottom:6px;color:#a8c8b0">生成规则（提示词，留空则用默认）</label>
            <textarea id="cfg-rules" rows="6" placeholder="在这里写下你对新植物的生成要求..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #3a5a44;background:#16201a;color:#e8f0e8;font-size:13px;box-sizing:border-box;margin-bottom:12px;resize:vertical"></textarea>

            <div style="display:flex;gap:8px">
                <button id="cfg-save" style="flex:1;padding:12px;border:none;border-radius:8px;background:#4a7c59;color:#fff;font-size:15px">保存设置</button>
                <button id="cfg-test" style="flex:1;padding:12px;border:none;border-radius:8px;background:#2d4a35;color:#a8c8b0;font-size:15px">测试连接</button>
            </div>
            <div id="cfg-status" style="margin-top:12px;font-size:13px;color:#8ab09a"></div>
        </div>
    `,document.body.appendChild(t);let n=[{id:`garden-temp`,label:`温度`,options:[`高温`,`常温`,`低温`]},{id:`garden-light`,label:`光照`,options:[`强光`,`正常`,`弱光`]},{id:`garden-humid`,label:`湿度`,options:[`潮湿`,`正常`,`干燥`]}],r=t.querySelector(`#env-block`);return n.forEach(e=>{let t=document.createElement(`div`);t.style.cssText=`margin-bottom:12px`,t.innerHTML=`<label style="display:block;margin-bottom:6px;color:#a8c8b0">${e.label}</label>`;let n=document.createElement(`div`);n.style.cssText=`display:flex;gap:6px`,e.options.forEach((t,r)=>{let i=document.createElement(`button`);i.type=`button`,i.className=`env-btn`,i.dataset.group=e.id,i.dataset.value=t,i.textContent=t,i.style.cssText=`flex:1;padding:8px;border:none;border-radius:6px;font-size:13px;background:${r===1?`#4a7c59`:`#2d3f33`};color:${r===1?`#fff`:`#a8c8b0`}`,n.appendChild(i)}),t.appendChild(n),r.appendChild(t)}),{panel:t,ball:e}}(function(){if(window.__garden_hud_loaded)return;window.__garden_hud_loaded=!0;let{panel:e,ball:n}=o();e.querySelectorAll(`.garden-tab`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.tab;e.querySelectorAll(`.garden-tab`).forEach(e=>{e.style.background=`#2d3f33`,e.style.color=`#a8c8b0`}),t.style.background=`#4a7c59`,t.style.color=`#fff`,[`breed`,`lib`,`cfg`].forEach(t=>{e.querySelector(`#garden-`+t).style.display=t===n?`block`:`none`}),n===`lib`&&l(),n===`cfg`&&u()})}),e.querySelectorAll(`.env-btn`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.group;e.querySelectorAll(`.env-btn[data-group="${n}"]`).forEach(e=>{e.style.background=`#2d3f33`,e.style.color=`#a8c8b0`}),t.style.background=`#4a7c59`,t.style.color=`#fff`})});function s(t){let n=e.querySelectorAll(`.env-btn[data-group="${t}"]`);for(let e=0;e<n.length;e++)if(n[e].style.background.includes(`74, 124, 89`))return n[e].dataset.value;return n[1]?n[1].dataset.value:`正常`}function c(){let t=i.plants.map(e=>e.name);[`garden-p1-list`,`garden-p2-list`].forEach(n=>{let r=e.querySelector(`#`+n);r.innerHTML=t.map(e=>`<option value="${a(e)}">`).join(``)})}function l(){let t=e.querySelector(`#garden-lib`);if(!i.plants.length){t.innerHTML=`<div style="text-align:center;color:#6a8a72;padding:40px 0">花园里还没有植物</div>`;return}t.innerHTML=i.plants.map((e,t)=>`
            <div style="background:#16201a;border:1px solid #3a5a44;border-radius:10px;padding:12px;margin-bottom:10px;position:relative">
                <div style="font-size:16px;color:#a8e0b8">#${t+1} ${a(e.name)}</div>
                <div style="font-size:13px;color:#8ab09a;margin-top:4px">稀有度：${a(e.rarity)}</div>
                <div style="font-size:13px;color:#8ab09a;margin-top:4px">环境：${a(e.temp)} / ${a(e.light)} / ${a(e.humid)}</div>
                <div style="font-size:13px;color:#c8d8c8;margin-top:6px">${a(e.appearance)}</div>
                <div style="font-size:13px;color:#a8c8b0;margin-top:4px">能力：${a(e.ability)}</div>
                <button data-del="${t}" style="position:absolute;top:8px;right:8px;padding:4px 8px;border:none;border-radius:4px;background:#5a2d2d;color:#fff;font-size:12px">删除</button>
            </div>
        `).join(``),t.querySelectorAll(`[data-del]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=parseInt(e.dataset.del);confirm(`确定删除这株植物？`)&&(i.plants.splice(t,1),r(i),l(),c())})})}function u(){e.querySelector(`#cfg-url`).value=i.config.apiUrl,e.querySelector(`#cfg-key`).value=i.config.apiKey,e.querySelector(`#cfg-model`).value=i.config.apiModel,e.querySelector(`#cfg-rules`).value=i.config.rules}function d(){i.config.apiUrl=e.querySelector(`#cfg-url`).value.trim(),i.config.apiKey=e.querySelector(`#cfg-key`).value.trim(),i.config.apiModel=e.querySelector(`#cfg-model`).value.trim(),i.config.rules=e.querySelector(`#cfg-rules`).value.trim()}e.querySelector(`#cfg-save`).addEventListener(`click`,()=>{d(),r(i);let t=e.querySelector(`#cfg-status`);t.style.color=`#a8e0b8`,t.textContent=`✅ 设置已保存`}),e.querySelector(`#cfg-test`).addEventListener(`click`,async()=>{d();let t=e.querySelector(`#cfg-status`);t.style.color=`#8ab09a`,t.textContent=`🔄 正在测试连接...`;try{let e=await fetch(i.config.apiUrl,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer `+i.config.apiKey},body:JSON.stringify({model:i.config.apiModel,messages:[{role:`user`,content:`回复"ok"两个字即可`}],max_tokens:5})});if(!e.ok)throw Error(`HTTP `+e.status);let n=await e.json();t.style.color=`#a8e0b8`,t.textContent=`✅ 连接成功：`+(n.choices?.[0]?.message?.content||`ok`)}catch(e){t.style.color=`#e0a0a0`,t.textContent=`❌ 连接失败：`+e.message}}),e.querySelector(`#garden-breed-btn`).addEventListener(`click`,async()=>{let n=e.querySelector(`#garden-p1`).value.trim(),o=e.querySelector(`#garden-p2`).value.trim();if(!n||!o){alert(`请填写父本和母本`);return}if(!i.config.apiKey){alert(`请先到「设置」页填写 API 信息`);return}let l={temp:s(`garden-temp`),light:s(`garden-light`),humid:s(`garden-humid`)},u=e.querySelector(`#garden-result`);u.style.display=`block`,u.innerHTML=`<div style="color:#a8c8b0;padding:12px;background:#16201a;border-radius:10px">🌱 繁育中，请稍候...</div>`;try{let e=i.config.rules||t.rules,s=`你是植物繁育系统。父本："${n}"，母本："${o}"。
繁育环境：温度=${l.temp}，光照=${l.light}，湿度=${l.humid}。
额外要求：${e}
环境条件必须影响新植物的外观和能力描述。
严格返回 JSON，不要任何其他文字：
{"name":"植物名","appearance":"外观描述","ability":"特殊能力","rarity":"普通或稀有或史诗"}`,d=await fetch(i.config.apiUrl,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer `+i.config.apiKey},body:JSON.stringify({model:i.config.apiModel,messages:[{role:`user`,content:s}],temperature:.9})});if(!d.ok)throw Error(`HTTP `+d.status);let f=(await d.json()).choices[0].message.content,p=f.match(/\{[\s\S]*\}/),m=JSON.parse(p?p[0]:f);m.temp=l.temp,m.light=l.light,m.humid=l.humid,i.plants.push(m),r(i),c(),u.innerHTML=`
                <div style="background:#16201a;border:1px solid #4a7c59;border-radius:10px;padding:14px">
                    <div style="color:#a8e0b8;font-size:18px;margin-bottom:8px">✨ 繁育成功：${a(m.name)}</div>
                    <div style="font-size:13px;color:#8ab09a">稀有度：${a(m.rarity)}</div>
                    <div style="font-size:13px;color:#8ab09a;margin-top:4px">环境：${a(m.temp)} / ${a(m.light)} / ${a(m.humid)}</div>
                    <div style="font-size:14px;color:#c8d8c8;margin-top:8px">${a(m.appearance)}</div>
                    <div style="font-size:14px;color:#a8c8b0;margin-top:6px">能力：${a(m.ability)}</div>
                </div>
            `}catch(e){u.innerHTML=`<div style="color:#e0a0a0;padding:12px;background:#16201a;border-radius:10px">❌ 繁育失败：${a(e.message)}</div>`}}),n.addEventListener(`click`,()=>{e.style.display=`flex`,c(),l(),u()}),e.querySelector(`#garden-close`).addEventListener(`click`,()=>{e.style.display=`none`}),r(i)})()})();