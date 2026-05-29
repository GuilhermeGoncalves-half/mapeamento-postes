// ==========================
// 🌍 MAPA GLOBAL
// ==========================

// variável global do mapa (precisa ser global pra usar em outras funções)
let map;

// array pra guardar todos os markers (útil depois pra manipular)
let markers = [];


// ==========================
// 🎮 MODOS (controle de ação)
// ==========================

let modoExclusao = false; // quando true → pode excluir poste
let modoCriacao = false;  // quando true → pode criar poste
let modoEdicao = false;   // quando true → pode editar poste


// ==========================
// 📍 ESTADOS
// ==========================

// guarda coordenadas clicadas no mapa
let latSelecionado = null;
let lngSelecionado = null;

// guarda IDs do backend
let posteEditandoId = null;
let posteExcluindoId = null;

// guarda o marker selecionado (pra editar depois)
let markerSelecionado = null;


// ==========================
// 🎨 ÍCONES
// ==========================

// função que escolhe o ícone com base no status do poste
function pegarIcone(status) {

  // se estiver ativo → ícone padrão
  if (status === 'ativo') return '/static/core/img/poste.png';

  // se estiver em manutenção → amarelo
  if (status === 'manutencao') return '/static/core/img/poste-amarelo.svg';

  // se estiver desativado → vermelho
  if (status === 'desativado') return '/static/core/img/poste-vermelho.svg';

  // fallback (caso venha algo inesperado)
  return '/static/core/img/poste.png';
}


// ==========================
// 🚀 INIT MAP
// ==========================

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


// ==========================
// 📡 CARREGAR POSTES
// ==========================

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

// abre modal de criação
function abrirModal() {
  document.getElementById('modal').style.display = 'block';
}

// abre modal de edição
function abrirModalEdit() {
  document.getElementById('modal-edit').style.display = 'block';
}

// abre modal de exclusão
function abrirModalExclusao() {
  document.getElementById('modal-delete').style.display = 'block';
}

// abre modal de observação da manutenção
function abrirModalObs() {
  document.getElementById('modal-obs').style.display = 'block';
}

// fecha todos os modais
function fecharModal() {

  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-edit').style.display = 'none';
  document.getElementById('modal-delete').style.display = 'none';
  document.getElementById('modal-obs').style.dispay = 'none';

  // desativa todos os modos
  modoCriacao = false;
  modoEdicao = false;
  modoExclusao = false;

  // volta cursor normal
  document.getElementById('map').style.cursor = 'default';

  verificacao();
}

function ativarModoCriacao() {

  modoCriacao = true;
  modoEdicao = false;
  modoExclusao = false;
  modoObs = false;

  document.getElementById('info').innerText =
    'Clique no mapa para criar um poste';

  // muda cursor pra cruz (UX melhor)
  document.getElementById('map').style.cursor = 'crosshair';
}

function ativarModoEdicao() {

  modoEdicao = true;
  modoCriacao = false;
  modoExclusao = false;
  modoObs = false

  document.getElementById('info').innerText =
    'Clique em um poste para editar';
}

function ativarModoExclusao() {

  modoExclusao = true;
  modoCriacao = false;
  modoEdicao = false;
  modoObs = false;

  document.getElementById('info').innerText =
    'Clique em um poste para excluir';
}

// atualiza texto quando nenhum modo está ativo
function verificacao() {

  if (!modoEdicao && !modoCriacao && !modoExclusao && !modoObs) {
    document.getElementById('info').innerText =
      'Nenhuma ação selecionada';
  }
}

async function salvarPoste() {

  // monta objeto com dados do formulário
  const dados = {
    latitude: document.getElementById('latitude').value,
    longitude: document.getElementById('longitude').value,
    status: document.getElementById('status').value,
    tipo: document.getElementById('tipo').value,
    obs: document.getElementById('observacao').value
  };

  try {

    // envia pro backend (Django)
    const response = await fetch('/api/postes/criar/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    const result = await response.json();

    // se der erro
    if (!response.ok) {
      document.getElementById('erro').innerText = result.error;
      return;
    }

    // sucesso
    alert('Poste criado com sucesso');

    // recarrega página (pode melhorar depois)
    location.reload();

  } catch (error) {

    document.getElementById('erro').innerText =
      'Erro ao conectar com o servidor';
  }
}

function salvarEdicao() {

  const dados = {
    latitude: document.getElementById('latitude-edit').value,
    longitude: document.getElementById('longitude-edit').value,
    status: document.getElementById('status-edit').value,
    tipo: document.getElementById('tipo-edit').value,
    obs: document.getElementById('observacao-edit').value
  };

  if(dados.status === 'manutencao'){
      document.getElementById('modal-edit').style.display = 'none';
      abrirModalObs();
      return;
  };

  fetch(`/api/postes/editar/${posteEditandoId}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  .then(() => {

    // atualiza posição do marker no mapa
    markerSelecionado.setPosition({
      lat: parseFloat(dados.latitude),
      lng: parseFloat(dados.longitude)
    });

    // atualiza ícone
    markerSelecionado.setIcon(pegarIcone(dados.status));

    fecharModal();
  });
}

async function excluirPoste() {

  try {

    const response = await fetch(`/api/postes/excluir/${posteExcluindoId}/`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (!response.ok) {
      document.getElementById('erro').innerText = result.error;
      return;
    }

    alert(result.status);

    // recarrega página
    location.reload();

  } catch (error) {
    console.log(error);
  }
}
