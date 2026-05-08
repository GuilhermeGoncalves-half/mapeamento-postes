from django.urls import path
from . import views

urlpatterns = [
    path('postes/', views.listar_postes),
    path('postes/criar/', views.criar_poste),
    path('api/postes/<int:id>/',views.editar_poste),
]