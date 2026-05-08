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

        poste = Poste.objects.create(
            nome = data["nome"],
            latitude = data["latitude"],
            longitude = data["longitude"]
        )

        return JsonResponse({"status": "ok"})
    
    return JsonResponse({"error": "Método nao permitido"}, status=405)

def map(request):
    return render(request, "core/map.html")
    
# Create your views here.
