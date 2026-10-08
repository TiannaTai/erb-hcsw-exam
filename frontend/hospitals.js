(async function(){
  const hospitals = await fetch('../data/hospitals.json').then(r => r.json());
  const regionSelect = document.getElementById('regionFilter');
  const keywordInput = document.getElementById('keyword');
  const hospitalList = document.getElementById('hospitalList');
  const searchBtn = document.getElementById('searchBtn');

  const regions = Array.from(new Set(hospitals.map(h => h.region))).sort();
  regions.forEach(region => {
    const option = document.createElement('option');
    option.value = region;
    option.textContent = region;
    regionSelect.appendChild(option);
  });

  const map = L.map('map').setView([23.7, 121], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  let markers = [];

  function renderList(items) {
    hospitalList.innerHTML = '';
    items.forEach(h => {
      const div = document.createElement('div');
      div.className = 'hospital-item';
      div.innerHTML = `
        <strong>${h.name}</strong> <small>(${h.region})</small><br>
        <span>${h.specialty}</span><br>
        <span>關聯題目：${(h.linked_questions || []).join(', ') || '無'}</span><br>
        <a href="./quiz.html">前往題庫</a>
      `;
      hospitalList.appendChild(div);
    });
  }

  function renderMarkers(items) {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    items.forEach(h => {
      if (typeof h.lat !== 'number' || typeof h.lng !== 'number') return;
      const marker = L.marker([h.lat, h.lng]).addTo(map);
      marker.bindPopup(`
        <strong>${h.name}</strong><br>
        ${h.specialty}<br>
        ${h.region}<br>
        關聯題目：${(h.linked_questions || []).join(', ') || '無'}
      `);
      markers.push(marker);
    });

    if (items.length) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.3));
    }
  }

  function applyFilter() {
    const region = regionSelect.value;
    const keyword = keywordInput.value.trim().toLowerCase();

    const filtered = hospitals.filter(h => {
      const matchRegion = region === 'all' || h.region === region;
      const searchText = [h.name, h.specialty, h.region, ...(h.related_terms || [])].join(' ').toLowerCase();
      const matchKeyword = !keyword || searchText.includes(keyword);
      return matchRegion && matchKeyword;
    });

    renderList(filtered);
    renderMarkers(filtered);
  }

  searchBtn.onclick = applyFilter;
  regionSelect.onchange = applyFilter;
  keywordInput.onkeydown = (e) => {
    if (e.key === 'Enter') applyFilter();
  };

  applyFilter();
})();
