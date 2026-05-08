from django.shortcuts import render
from .models import Poste
from django.http import JsonResponse
import json 
from django.views.decorators.csrf import csrf_exempt


def listar_postes(request):
    postes = list(Poste.objects.values())
    return JsonResponse(postes, safe=False)

@csrf_exempt
def criar_poste(request):
    if request.method =="POST":
        data = json.loads(request.body)
        
        nome = data["nome"],
        latitude = data["latitude"],
        longitude = data["longitude"],
        status = data["status"],
        obs = data["obs"],
        tipo = data["tipo"]

        # valida nome
        if not nome:

            return JsonResponse({
                'error': 'Nome obrigatório'
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

        poste = Poste.objects.create(
            nome=nome,
            latitude=latitude,
            longitude=longitude,
            status=status,
            obs=obs,
            tipo=tipo
        )

        return JsonResponse({"status": "ok"})
    
    return JsonResponse({"error": "Método nao permitido"}, status=405)

def map(request):
    return render(request, "core/map.html")

@csrf_exempt
def editar_poste(request, id):

    # só aceita PUT
    if request.method == 'PUT':

        try:
        # pega poste
            poste = Poste.objects.get(id=id)

        except:
        # verifica se existe
            if poste.DoesNotExist(): return JsonResponse({"error": "Poste não encontrado"}, status=404)

        # pega json enviado
        data = json.loads(request.body)

        nome = data["nome"],
        latitude = data["latitude"],
        longitude = data["longitude"],

        # validações
        if not nome:

            return JsonResponse({
                'error': 'Nome obrigatório'
            }, status=400)
        if not latitude:

            return JsonResponse({
                'error': 'Latitude obrigatório'
            }, status=400)
        
        if not longitude:

            return JsonResponse({
                'error': 'Longitude obrigatório'
            }, status=400)


        # atualiza campos
        poste.nome = data.get('nome')
        poste.latitude = data.get('latitude')
        poste.longitude = data.get('longitude')
        poste.status = data.get('status')
        poste.tipo = data.get('tipo')
        poste.obs = data.get('obs')

        # salva no banco
        poste.save()

        return JsonResponse({
            'message': 'Poste atualizado'
        })

    return JsonResponse({
        'error': 'Método inválido'
    }, status=400)
    
# Create your views here.
