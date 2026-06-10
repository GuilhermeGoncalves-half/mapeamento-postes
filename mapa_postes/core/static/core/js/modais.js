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
  document.getElementById('modal-obs').style.display = 'none';

  // desativa todos os modos
  modoCriacao = false;
  modoEdicao = false;
  modoExclusao = false;

  // volta cursor normal
  document.getElementById('map').style.cursor = 'default';

  verificacao();
}