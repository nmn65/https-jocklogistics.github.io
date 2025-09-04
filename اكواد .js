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

function seedDrivers(){
  const sample = [
    {id:'d1', name:'سعود الدوسري', city:'الرياض', rating:4.8, vehicle:'دراجة نارية'},
    {id:'d2', name:'محمد البلوي', city:'تبوك', rating:4.6, vehicle:'سيارة سيدان'},
    {id:'d3', name:'أحمد الحربي', city:'جدة', rating:4.7, vehicle:'ونيت'},
  ];
  localStorage.setItem(LS_DRIVERS, JSON.stringify(sample));
}

function loadDrivers(){
  let arr = JSON.parse(localStorage.getItem(LS_DRIVERS) || 'null');
  if(!arr){ seedDrivers(); arr = JSON.parse(localStorage.getItem(LS_DRIVERS)); }
  return arr;
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

function setPreferred(id){
  $('preferredDriver').value = id;
  alert('تم تعيين المندوب المفضّل للطلب الحالي ✅');
}

function loadOrders(){
  return JSON.parse(localStorage.getItem(LS_ORDERS) || '[]');
}

function saveOrders(arr){
  localStorage.setItem(LS_ORDERS, JSON.stringify(arr));
}

function submitOrder(){
  const pickup = $('pickup').value.trim();
  const dropoff = $('dropoff').value.trim();
  if(!pickup || !dropoff){
    alert('رجاءً أكمل حقول الاستلام والتسليم.');
    return;
  }
  const order = {
    id: 'O' + Date.now(),
    pickup, dropoff,
    notes: $('notes').value.trim(),
    preferredDriver: $('preferredDriver').value || null,
    payment: $('payment').value,
    serviceType: $('serviceType').value,
    when: $('when').value || null,
    status: 'قيد المراجعة',
    createdAt: new Date().toISOString()
  };
  const orders = loadOrders();
  orders.unshift(order);
  saveOrders(orders);
  clearForm();
  renderOrders();
  showTab('orders');
}

function clearForm(){
  ['pickup','dropoff','notes','when'].forEach(id=>$(id).value='');
  $('preferredDriver').value='';
  $('payment').value='card';
  $('serviceType').value='personal';
}

function renderOrders(){
  const list = $('ordersList');
  const orders = loadOrders();
  if(!orders.length){
    list.innerHTML = '<li class="empty">لا توجد طلبات بعد.</li>';
    return;
  }
  list.innerHTML = orders.map(o=>`
    <li>
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:center">
        <div>
          <strong>${o.pickup} → ${o.dropoff}</strong>
          <div class="muted">
            نوع: ${translateService(o.serviceType)} • دفع: ${o.payment==='card'?'إلكتروني':'نقدي'}
            ${o.preferredDriver?`• مندوب مفضّل: ${driverName(o.preferredDriver)}`:''}
          </div>
          <div class="muted">الحالة: ${o.status} • ${new Date(o.createdAt).toLocaleString('ar-SA')}</div>
          ${o.notes?`<div style="margin-top:6px">${o.notes}</div>`:''}
        </div>
        <button onclick="updateStatus('${o.id}')">تحديث الحالة</button>
      </div>
    </li>
  `).join('');
}

function translateService(v){
  return {personal:'توصيل شخصي',store:'من متجر',ride:'توصيل ركاب',custom:'طلب مخصص'}[v] || v;
}

function driverName(id){
  const d = loadDrivers().find(x=>x.id===id);
  return d? d.name : '—';
}

function updateStatus(id){
  const orders = loadOrders();
  const i = orders.findIndex(o=>o.id===id);
  if(i<0) return;
  const next = prompt('اكتب الحالة الجديدة (مثال: قيد التنفيذ / تم الاستلام / مكتمل):', orders[i].status);
  if(next){
    orders[i].status = next.trim();
    saveOrders(orders);
    renderOrders();
  }
}

// init
renderDrivers();
showTab('request');
