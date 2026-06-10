let modoExclusao = false; // quando true → pode excluir poste
let modoCriacao = false;  // quando true → pode criar poste
let modoEdicao = false;   // quando true → pode editar poste

function ativarModoCriacao() {

  modoCriacao = true;
  modoEdicao = false;
  modoExclusao = false;

  document.getElementById('info').innerText =
    'Clique no mapa para criar um poste';

  // muda cursor pra cruz (UX melhor)
  document.getElementById('map').style.cursor = 'crosshair';
}

function ativarModoEdicao() {

  modoEdicao = true;
  modoCriacao = false;
  modoExclusao = false;

  document.getElementById('info').innerText =
    'Clique em um poste para editar';
}

function ativarModoExclusao() {

  modoExclusao = true;
  modoCriacao = false;
  modoEdicao = false;

  document.getElementById('info').innerText =
    'Clique em um poste para excluir';
}

// atualiza texto quando nenhum modo está ativo
function verificacao() {

  if (!modoEdicao && !modoCriacao && !modoExclusao) {
    document.getElementById('info').innerText =
      'Nenhuma ação selecionada';
  }
}