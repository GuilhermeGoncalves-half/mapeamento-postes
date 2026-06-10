// variável global do mapa (precisa ser global pra usar em outras funções)
let map;

// array pra guardar todos os markers (útil depois pra manipular)
let markers = [];

// guarda coordenadas clicadas no mapa
let latSelecionado = null;
let lngSelecionado = null;

// função chamada automaticamente pelo Google Maps (via callback no script)
function initMap() {

  // define ponto inicial do mapa (São Paulo)
  const center = { lat: -23.55, lng: -46.63 };

  // cria o mapa na div #map
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,        // nível de zoom
    center: center,  // centro do mapa
  });

  // evento de clique no mapa
  map.addListener("click", (e) => {

    scaledSize: new google.maps.Size(24, 24) // 🔽 tamanho

    // só funciona se estiver no modo criação
    if (!modoCriacao) return;

    // pega latitude e longitude do clique
    latSelecionado = e.latLng.lat();
    lngSelecionado = e.latLng.lng();

    // preenche os inputs do formulário
    document.getElementById('latitude').value = latSelecionado;
    document.getElementById('longitude').value = lngSelecionado;

    // abre modal de criação
    abrirModal();
  });

  // carrega os postes do backend
  carregarPostes();
}



function carregarPostes() {

  // chama sua API Django
  fetch('/api/postes/')
    .then(res => res.json())
    .then(data => {

      // percorre todos os postes retornados
      data.forEach(p => {

        // cria marker no mapa
        const marker = new google.maps.Marker({
          position: { lat: p.latitude, lng: p.longitude }, // posição
          map: map, // em qual mapa vai aparecer
          icon: pegarIcone(p.status) // ícone baseado no status
        });

        // cria popup (InfoWindow)
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <b>ID: ${p.id}</b><br>
            Status: ${p.status}
          `
        });

        // evento de clique no marker
        marker.addListener("click", () => {

          modoEdicao = true;

          if (modoExclusao){
            modoEdicao = false;
          }

          // abre o popup
          infoWindow.open(map, marker);

          // modo edicao
          if (modoEdicao) {

            // salva marker selecionado
            markerSelecionado = marker;

            // salva ID do poste
            posteEditandoId = p.id;

            // preenche formulário com dados atuais
            document.getElementById('latitude-edit').value = p.latitude || '';
            document.getElementById('longitude-edit').value = p.longitude || '';
            document.getElementById('status-edit').value = p.status || '';
            document.getElementById('tipo-edit').value = p.tipo || '';
            document.getElementById('observacao-edit').value = p.obs || '';

            // abre modal de edição
            abrirModalEdit();
          }

          // modo exclusao
          if (modoExclusao) {

            // salva ID do poste
            posteExcluindoId = p.id;

            // abre modal de confirmação
            abrirModalExclusao();
          }
        });

        // guarda marker no array
        markers.push(marker);
      });

    });
}