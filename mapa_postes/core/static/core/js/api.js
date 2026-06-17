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

async function salvarObs() {
    const obs = document.getElementById('observacao-man').value;

    try {
    const response = await fetch(`/api/postes/obs/${posteEditandoId}/`, {
      method: 'POST',
      headers: 
      { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        "observacao-man": obs
    })
    });

    const result = await response.json();

    // se der erro
    if (!response.ok) {
      document.getElementById('erro').innerText = result.error;
      return;
    }

    // sucesso
    alert('Observação da manutenção criada com sucesso');

    await salvarEdicao();

    // recarrega página (pode melhorar depois)
    location.reload();
}
    catch(error){
      document.getElementById('erro').innerText =
      'Erro ao conectar com o servidor';
    }
  
}

async function salvarEdicao() {

  const dados = {
    latitude: document.getElementById('latitude-edit').value,
    longitude: document.getElementById('longitude-edit').value,
    status: document.getElementById('status-edit').value,
    tipo: document.getElementById('tipo-edit').value,
  };

  const response = await fetch(
    `/api/postes/editar/${posteEditandoId}/`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }
  );

  if(dados.status === 'manutencao'){
    document.getElementById('modal-edit').style.display = 'none';
    abrirModalObs();
    return;
  }

  fecharModal();
  return response;
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