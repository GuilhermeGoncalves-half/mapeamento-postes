// guarda IDs do backend
let posteEditandoId = null;
let posteExcluindoId = null;

// guarda o marker selecionado (pra editar depois)
let markerSelecionado = null;

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

function salvarObs() {
    const obs = document.getElementById('observacao-man').value;

    fetch(`/api/postes/obs/${posteEditandoId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            observacao: obs
        })
    })
    .then(res => res.json())
    .then(data => {
        fecharModal();
        location.reload();
    });
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