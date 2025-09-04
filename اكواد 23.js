// تخزين بسيط محلي
const LS_ORDERS = 'jok_orders_v1';
const LS_DRIVERS = 'jok_drivers_v1';

const $ = (id) => document.getElementById(id);

function showTab(name){
  ['request','orders','drivers','about'].forEach(key=>{
    $('tab-'+key).hidden = key!==name;
  });
  if(name==='orders') renderOrders();
  if(name==='drivers') renderDrivers();
}

function renderDrivers(){
  const wrap = document.getElementById('driversWrap');
  const drivers = loadDrivers();
  const preferred = $('preferredDriver');
  preferred.innerHTML = '<option value="">— بدون —</option>';
  wrap.innerHTML = '';
  drivers.forEach(d=>{
    preferred.innerHTML += `<option value="${d.id}">${d.name} (${d.city})</option>`;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
        <div>
          <strong>${d.name}</strong>
          <div class="muted">${d.city} • ${d.vehicle} • تقييم ${d.rating}</div>
        </div>
        <button onclick="setPreferred('${d.id}')">تعيينه كمندوب مفضّل</button>
      </div>`;
    wrap.appendChild(card);
  });
}
