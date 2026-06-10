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