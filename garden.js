(function() {
    'use strict';

    const API_URL = 'https://api.deepseek.com/v1/chat/completions';
    const API_KEY = '你的API密钥';
    const API_MODEL = 'deepseek-chat';
    const EXTRA_RULES = '新植物的外观必须与森林、月光、藤蔓相关；能力不能是攻击性的；稀有度概率：普通60%、稀有30%、史诗10%。';

    function getPlants() {
        try {
            const raw = localStorage.getItem('garden_plants');
            return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
    }
    function savePlants(list) {
        localStorage.setItem('garden_plants', JSON.stringify(list));
    }

    function comboBox(id, label) {
        return '<div style="margin-bottom:12px"><label style="display:block;margin-bottom:6px;color:#a8c8b0">' + label + '</label><input id="' + id + '" list="' + id + '-list" placeholder="选择或输入植物名" style="width:100%;padding:10px;border-radius:8px;border:1px solid #3a5a44;background:#16201a;color:#e8f0e8;font-size:15px;box-sizing:border-box"><datalist id="' + id + '-list"></datalist></div>';
    }

    function envGroup(id, label, options) {
        var buttons = options.map(function(opt, i) {
            var active = i === 1 ? 'background:#4a7c59;color:#fff;' : 'background:#2d3f33;color:#a8c8b0;';
            return '<button type="button" class="env-btn" data-group="' + id + '" data-value="' + opt + '" style="flex:1;padding:8px;border:none;border-radius:6px;font-size:13px;' + active + '">' + opt + '</button>';
        }).join('');
        return '<div style="margin-bottom:12px"><label style="display:block;margin-bottom:6px;color:#a8c8b0">' + label + '</label><div style="display:flex;gap:6px">' + buttons + '</div></div>';
    }
  async function breedByAPI(p1, p2, env) {
    var prompt = '你是植物繁育系统。父本："' + p1 + '"，母本："' + p2 + '"。\n繁育环境：温度=' + env.temp + '，光照=' + env.light + '，湿度=' + env.humid + '。\n额外要求：' + EXTRA_RULES + '\n环境条件必须影响新植物的外观和能力描述。\n严格返回 JSON，不要任何其他文字：\n{"name":"植物名","appearance":"外观描述","ability":"特殊能力","rarity":"普通或稀有或史诗"}';
    var res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + API_KEY },
        body: JSON.stringify({ model: API_MODEL, messages: [{ role: 'user', content: prompt }], temperature: 0.9 })
    });
    var data = await res.json();
    var text = data.choices[0].message.content;
    var match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : text);
}

var ball = document.createElement('div');
ball.id = 'garden-hud-ball';
ball.textContent = '🌿';
Object.assign(ball.style, { position: 'fixed', right: '16px', bottom: '120px', width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg,#4a7c59,#2d4a35)', color: '#fff', fontSize: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: '99999', boxShadow: '0 4px 14px rgba(0,0,0,.35)' });
document.body.appendChild(ball);

var panel = document.createElement('div');
panel.id = 'garden-hud-panel';
Object.assign(panel.style, { position: 'fixed', inset: '0', background: '#1e2a22', color: '#e8f0e8', zIndex: '99998', display: 'none', flexDirection: 'column', fontFamily: 'serif' });
  panel.innerHTML = '<div style="display:flex;gap:8px;padding:14px;background:#16201a;border-bottom:1px solid #3a5a44"><button data-tab="breed" class="garden-tab" style="flex:1;padding:10px;border:none;border-radius:8px;background:#4a7c59;color:#fff;font-size:15px">繁育台</button><button data-tab="lib" class="garden-tab" style="flex:1;padding:10px;border:none;border-radius:8px;background:#2d3f33;color:#a8c8b0;font-size:15px">植物库</button><button id="garden-close" style="padding:10px 14px;border:none;border-radius:8px;background:#5a2d2d;color:#fff;font-size:15px">✕</button></div><div id="garden-breed" style="flex:1;overflow:auto;padding:16px">' + comboBox('garden-p1', '父本') + comboBox('garden-p2', '母本') + envGroup('garden-temp', '温度', ['高温', '常温', '低温']) + envGroup('garden-light', '光照', ['强光', '正常', '弱光']) + envGroup('garden-humid', '湿度', ['潮湿', '正常', '干燥']) + '<button id="garden-breed-btn" style="width:100%;padding:14px;border:none;border-radius:10px;background:linear-gradient(135deg,#4a7c59,#2d4a35);color:#fff;font-size:16px;margin-top:8px">🌱 开始繁育</button><div id="garden-result" style="margin-top:16px;padding:12px;border-radius:10px;background:#16201a;border:1px solid #3a5a44;display:none"></div></div><div id="garden-lib" style="flex:1;overflow:auto;padding:16px;display:none"></div>';
document.body.appendChild(panel);

function refreshOptions() {
    var plants = getPlants();
    var names = plants.map(function(p) { return p.name; });
    ['garden-p1-list', 'garden-p2-list'].forEach(function(id) {
        var dl = panel.querySelector('#' + id);
        dl.innerHTML = names.map(function(n) { return '<option value="' + n + '">'; }).join('');
    });
}

function renderLibrary() {
    var lib = panel.querySelector('#garden-lib');
    var plants = getPlants();
    if (!plants.length) { lib.innerHTML = '<div style="text-align:center;color:#6a8a72;padding:40px 0">花园里还没有植物</div>'; return; }
    lib.innerHTML = plants.map(function(p) {
        return '<div style="background:#16201a;border:1px solid #3a5a44;border-radius:10px;padding:12px;margin-bottom:10px"><div style="font-size:16px;color:#a8e0b8">' + p.name + '</div><div style="font-size:13px;color:#8ab09a;margin-top:4px">稀有度：' + p.rarity + '</div><div style="font-size:13px;color:#8ab09a;margin-top:4px">繁育环境：' + (p.temp || '未知') + ' / ' + (p.light || '未知') + ' / ' + (p.humid || '未知') + '</div><div style="font-size:13px;color:#c8d8c8;margin-top:6px">' + (p.appearance || '') + '</div><div style="font-size:13px;color:#a8c8b0;margin-top:4px">能力：' + (p.ability || '') + '</div></div>';
    }).join('');
}
  ball.addEventListener('click', function() { panel.style.display = 'flex'; refreshOptions(); renderLibrary(); });
    panel.querySelector('#garden-close').addEventListener('click', function() { panel.style.display = 'none'; });
    panel.querySelectorAll('.garden-tab').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var tab = btn.dataset.tab;
            panel.querySelectorAll('.garden-tab').forEach(function(b) { b.style.background = '#2d3f33'; b.style.color = '#a8c8b0'; });
            btn.style.background = '#4a7c59'; btn.style.color = '#fff';
            panel.querySelector('#garden-breed').style.display = tab === 'breed' ? 'block' : 'none';
            panel.querySelector('#garden-lib').style.display = tab === 'lib' ? 'block' : 'none';
            if (tab === 'lib') renderLibrary();
        });
    });
    panel.querySelectorAll('.env-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var group = btn.dataset.group;
            panel.querySelectorAll('.env-btn[data-group="' + group + '"]').forEach(function(b) { b.style.background = '#2d3f33'; b.style.color = '#a8c8b0'; });
            btn.style.background = '#4a7c59'; btn.style.color = '#fff';
        });
    });
    panel.querySelector('#garden-breed-btn').addEventListener('click', async function() {
        var p1 = panel.querySelector('#garden-p1').value.trim();
        var p2 = panel.querySelector('#garden-p2').value.trim();
        if (!p1 || !p2) { alert('请填写父本和母本'); return; }
        function getEnv(group) {
            var all = panel.querySelectorAll('.env-btn[data-group="' + group + '"]');
            for (var i = 0; i < all.length; i++) { if (all[i].style.background.indexOf('74, 124, 89') !== -1) return all[i].dataset.value; }
            return all[1] ? all[1].dataset.value : '正常';
        }
        var env = { temp: getEnv('garden-temp'), light: getEnv('garden-light'), humid: getEnv('garden-humid') };
        var result = panel.querySelector('#garden-result');
        result.style.display = 'block'; result.textContent = '🌱 繁育中...';
        try {
            var plant = await breedByAPI(p1, p2, env);
            plant.temp = env.temp; plant.light = env.light; plant.humid = env.humid;
            var list = getPlants(); list.push(plant); savePlants(list); refreshOptions();
            result.innerHTML = '<div style="color:#a8e0b8;font-size:16px">✨ ' + plant.name + '</div><div style="font-size:13px;color:#8ab09a;margin-top:4px">稀有度：' + plant.rarity + '</div><div style="font-size:13px;color:#8ab09a;margin-top:4px">环境：' + plant.temp + ' / ' + plant.light + ' / ' + plant.humid + '</div><div style="font-size:13px;color:#c8d8c8;margin-top:6px">' + (plant.appearance || '') + '</div><div style="font-size:13px;color:#a8c8b0;margin-top:4px">能力：' + (plant.ability || '') + '</div>';
        } catch (e) { result.innerHTML = '<span style="color:#e0a0a0">繁育失败：' + e.message + '</span>'; }
    });
})();
