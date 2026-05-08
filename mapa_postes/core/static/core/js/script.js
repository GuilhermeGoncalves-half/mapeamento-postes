var map = L.map('map', {
    minZoom: 13,
    maxZoom: 18
}).setView([-22.4735, -46.6317], 16);

let modoCriacao = false;
let latSelecionado = null;
let lngSelecionado = null;

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

fetch('api/postes/')
.then(res => res.json())
.then(data => {
    data.forEach(p =>{
        L.marker([p.latitude, p.longitude])
        .addTo(map)
        .bindPopup(p.nome)
    });
});

setTimeout(() => {
  map.invalidateSize();
}, 100);

function abrirModal() {
  document.getElementById('modal').style.display = 'block';
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
  modoCriacao = false;
  document.getElementById('map').style.cursor = 'default'
}

function ativarModoCriacao() {
  modoCriacao = true;
  document.getElementById('info').innerText =
    "Clique no mapa para posicionar o poste";

  document.getElementById('map').style.cursor = 'crosshair';
}

map.on('click', function(e){
    if (!modoCriacao) return;

    latSelecionado = e.latlng.lat;
    lngSelecionado = e.latlng.lng;

    abrirModal();
});

function salvarPoste() {
  const nome = document.getElementById('nome').value;

  fetch('/api/postes/criar/', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      nome: nome,
      latitude: latSelecionado,
      longitude: lngSelecionado
    })
  })
  .then(() => location.reload());
}

        