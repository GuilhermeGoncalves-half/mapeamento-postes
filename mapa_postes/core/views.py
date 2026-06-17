from django.shortcuts import render
from .models import Poste, ObservacaoManutencao
from django.http import JsonResponse
import json 
from django.views.decorators.csrf import csrf_exempt

def validacao(request):
        
        # variável para puxar os dados HTML
        data = json.loads(request.body)
        
        # atribuindo variáveis aos dados
        latitude = data["latitude"]
        longitude = data["longitude"]
        status = data["status"]
        tipo = data["tipo"]
        
        # valida status
        if not status:

            return JsonResponse({
            "error": "Status obrigatório"
            }, status=400)
            
        # valida tipo
        if not tipo:

            return JsonResponse({
            "error": "Tipo obrigatório"
            }, status=400)

        # valida latitude
        if latitude is None:

            return JsonResponse({
                'error': 'Latitude obrigatória'
            }, status=400)

        # valida longitude
        if longitude is None:

            return JsonResponse({
                'error': 'Longitude obrigatória'
            }, status=400)
        
        # verifica se é float
        try:
            latitude = float(data.get("latitude"))
        except(TypeError, ValueError):
            return JsonResponse({
                "error": "Latitude inválida"
            })
        try:
            longitude = float(data.get("longitude"))
        except(TypeError, ValueError):
            return JsonResponse({
                "error": "Longitude inválida"
            })
        
        # verifica se a latitude pode ser real
        
        if latitude < -90 or latitude > 90:
            return JsonResponse({
                "error": "Latitude deve estar entre -90 e 90"
            },status=400)
        
        # verifica se a longitude pode ser real
        if longitude < -180 or longitude > 180:
            return JsonResponse({
                "error": "Longitude deve estar entre -180 e 180"
            },status=400)


def listar_postes(request):
    postes = list(Poste.objects.values())
    return JsonResponse(postes, safe=False)

@csrf_exempt
def criar_poste(request):
    if request.method =="POST":

        # validação de erros
        erro = validacao(request)

        if erro:
            return erro

        # variável para puxar os dados HTML
        data = json.loads(request.body)
        
        # atribuindo variáveis aos dados
        latitude = data["latitude"]
        longitude = data["longitude"]
        status = data["status"]
        tipo = data["tipo"]

        # cria o poste
        poste = Poste.objects.create(
            latitude=latitude,
            longitude=longitude,
            status=status,
            tipo=tipo
        )

        return JsonResponse({"status": "Criado com sucesso!"})
    
    return JsonResponse({"error": "Método nao permitido"}, status=405)

def map(request):
    return render(request, "core/map.html")

@csrf_exempt
def editar_poste(request, id):

    # só aceita PUT
    if request.method == 'PUT':

        # validação de erros
        erro = validacao(request)

        if erro:
            return erro

        try:
        # pega poste
            poste = Poste.objects.get(id=id)

        except:
        # verifica se existe
            if poste.DoesNotExist: 
                return JsonResponse({
                    "error": "Poste não encontrado"
                }, status=404)
            

        # pega json enviado
        data = json.loads(request.body)

        # atualiza campos
        poste.latitude = data.get('latitude')
        poste.longitude = data.get('longitude')
        poste.status = data.get('status')
        poste.tipo = data.get('tipo')

        # salva no banco
        poste.save()

        return JsonResponse({
            'status': 'Poste atualizado'
        })

    return JsonResponse({
        'error': 'Método inválido'
    }, status=400)

@csrf_exempt
def obs_poste(request, id):
    if request.method != "POST":
        return JsonResponse(
            {"error": "Método não permitido"},
            status=405
        )

    try:
        poste = Poste.objects.get(id=id)
    except Poste.DoesNotExist:
        return JsonResponse(
            {"error": "Poste não encontrado"},
            status=404
        )

    data = json.loads(request.body)

    observacao = data.get("observacao")

    if not observacao:
        return JsonResponse(
            {"error": "Observação obrigatória"},
            status=400
        )

    ObservacaoManutencao.objects.create(
        poste=poste,
        observacao=observacao
    )

    return JsonResponse({
        "status": "Observação salva com sucesso"
    })

@csrf_exempt
def excluir_poste(request, id):
    if request.method == "DELETE":
        
        try:
        # pega poste
            poste = Poste.objects.get(id=id)

        except:
        # verifica se existe
            if poste.DoesNotExist: 
                return JsonResponse({
                    "error": "Poste não encontrado"
                }, status=404)
            
        poste.delete()

        return JsonResponse({"status": "Poste excluido!"},status=200)
    
    return JsonResponse({"error": "Método não permitido"}, status=405)
    

    
# Create your views here.
