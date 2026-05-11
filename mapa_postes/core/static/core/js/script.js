// cria o mapa
var map = L.map('map', {
    minZoom: 13,
    maxZoom: 18
}).setView([-22.4735, -46.6317], 16);

// controla modos
let modoExclusao = false;
let modoCriacao = false;
let modoEdicao = false;

// guarda coordenadas
let latSelecionado = null;
let lngSelecionado = null;

// guarda id do poste editando
let posteEditandoId = null;

//guarda id do poste excluindo
let posteExcluindoId = null;

// guarda marker selecionado
let markerSelecionado = null;

// ícone ativo
const iconeAtivo = L.icon({

    iconUrl: '/static/core/img/poste.png',

    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// ícone manutenção
const iconeManutencao = L.icon({

    iconUrl: '/static/core/img/poste-amarelo.svg',

    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// ícone desativado
const iconeDesativado = L.icon({

    iconUrl: '/static/core/img/poste-vermelho.svg',

    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// escolhe ícone pelo status
function pegarIcone(status){

    if(status === 'ativo'){
        return iconeAtivo;
    }

    if(status === 'manutencao'){
        return iconeManutencao;
    }

    if(status === 'desativado'){
        return iconeDesativado;
    }

    // padrão
    return iconeAtivo;
}

// mapa base
L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// busca postes
fetch('api/postes/')

.then(res => res.json())

.then(data => {

    // percorre postes
    data.forEach(p => {

        // cria marker
        const marker = L.marker(
            [p.latitude, p.longitude],
        {
            icon: pegarIcone(p.status)
        })

        // adiciona no mapa
        .addTo(map)

        // popup
        .bindPopup(`
            <b>ID: ${p.id}</b><br>
            Status: ${p.status}
        `);

        // click no marker
        marker.on('click', () => {

            // só no modo edição ou exclusão
            if (!modoEdicao && !modoExclusao) return;

            if (modoEdicao){
            
            // salva marker
            markerSelecionado = marker;

            // salva id
            posteEditandoId = p.id;

            // preenche latitude
            document.getElementById(
                'latitude-edit'
            ).value = p.latitude || '';

            // preenche longitude
            document.getElementById(
                'longitude-edit'
            ).value = p.longitude || '';

            // preenche status
            document.getElementById(
                'status-edit'
            ).value = p.status || '';

            // preenche tipo
            document.getElementById(
                'tipo-edit'
            ).value = p.tipo || '';

            // preenche observação
            document.getElementById(
                'observacao-edit'
            ).value = p.obs || '';

            // abre modal
            abrirModalEdit();

            }

            if (modoExclusao){

            // salva id
            posteExcluindoId = p.id;

            // abre modal
            abrirModalExclusao();
            }
        });

    });

});

// corrige tamanho mapa
setTimeout(() => {
    map.invalidateSize();
}, 100);

// abre modal criar
function abrirModal() {

    document.getElementById(
        'modal'
    ).style.display = 'block';
}

// abre modal editar
function abrirModalEdit() {

    document.getElementById(
        'modal-edit'
    ).style.display = 'block';
}

// abre modal excluir
function abrirModalExclusao() {

    document.getElementById(
        'modal-delete'
    ).style.display = 'block';
}

// fecha modais
function fecharModal() {

    document.getElementById(
        'modal'
    ).style.display = 'none';

    document.getElementById(
        'modal-edit'
    ).style.display = 'none';
    document.getElementById(
        'modal-delete'
    ).style.display = 'none';

    // desativa modos
    modoCriacao = false;
    modoEdicao = false;
    modoExclusao = false;

    // cursor normal
    document.getElementById(
        'map'
    ).style.cursor = 'default';

    // verifica ações
    verificacao();
}

// ativa criação
function ativarModoCriacao() {

    modoCriacao = true;
    modoEdicao = false;

    document.getElementById(
        'info'
    ).innerText =
    'Clique no mapa para criar um poste';

    document.getElementById(
        'map'
    ).style.cursor = 'crosshair';
}

// verifica ações
function verificacao(){

    if(
        modoEdicao === false &&
        modoCriacao === false
    ){

        document.getElementById(
            'info'
        ).innerText =
        'Nenhuma ação selecionada';
    }
}

// ativa edição
function ativarModoEdicao() {

    modoEdicao = true;
    modoCriacao = false;

    document.getElementById(
        'info'
    ).innerText =
    'Clique em um poste para editar';
}

// ativa exclusao
function ativarModoExclusao(){

    modoExclusao = true;
    modoEdicao = false;
    modoCriacao = false;

    document.getElementById(
        'info'
    ).innerText =
    'Clique em um poste para excluir';

}

// click mapa
map.on('click', function(e) {

    // só no modo criação
    if (!modoCriacao) return;

    // salva coordenadas
    latSelecionado = e.latlng.lat;
    lngSelecionado = e.latlng.lng;

    // preenche latitude
    document.getElementById(
        'latitude'
    ).value = latSelecionado;

    // preenche longitude
    document.getElementById(
        'longitude'
    ).value = lngSelecionado;

    // abre modal
    abrirModal();
});

// salva poste
async function salvarPoste() {

    // monta objeto
    const dados = {

        latitude:
        document.getElementById(
            'latitude'
        ).value,

        longitude:
        document.getElementById(
            'longitude'
        ).value,

        status:
        document.getElementById(
            'status'
        ).value,

        tipo:
        document.getElementById(
            'tipo'
        ).value,

        obs:
        document.getElementById(
            'observacao'
        ).value
    };

    try {

        // envia api
        const response = await fetch('/api/postes/criar/', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(dados)
        })

        // pega resposta json
        const result = await response.json()

        // verifica erro
        if (!response.ok) {

            document.getElementById('erro').innerText = result.error

            return
        }

        // sucesso
        alert('Poste criado com sucesso')

        location.reload()

    } catch (error) {

        document.getElementById('erro').innerText =
            'Erro ao conectar com o servidor'

        console.error(error)
    }
}

// salva edição
function salvarEdicao() {

    // monta objeto
    const dados = {

        latitude:
        document.getElementById(
            'latitude-edit'
        ).value,

        longitude:
        document.getElementById(
            'longitude-edit'
        ).value,

        status:
        document.getElementById(
            'status-edit'
        ).value,

        tipo:
        document.getElementById(
            'tipo-edit'
        ).value,

        obs:
        document.getElementById(
            'observacao-edit'
        ).value
    };

    // envia atualização
    fetch(`/api/postes/editar/${posteEditandoId}/`, {

        method: 'PUT',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(dados)
    })

    .then(() => {

        // atualiza popup
        markerSelecionado.bindPopup(`
            <b>${dados.nome}</b><br>
            Status: ${dados.status}
        `);

        // atualiza posição
        markerSelecionado.setLatLng([
            dados.latitude,
            dados.longitude
        ]);

        // atualiza ícone
        markerSelecionado.setIcon(
            pegarIcone(dados.status)
        );

        // fecha modal
        fecharModal();
    });
}

async function excluirPoste(){

    // envia exclusão
    try{

        // envia api
        const response = await fetch(`/api/postes/excluir/${posteExcluindoId}/`,
            {
            method: 'DELETE'
            }
        )

        //recebe o resultado
        const result = await response.json()

        // erro
        if(!response.ok){

            // mostra o erro
            document.getElementById('erro').innerText = result.error

            return
        }

        //sucesso
        alert(result.status)

        //recarrega o mapa
        location.reload()

    } catch (error){

        return console.log(error)

    }
    } 