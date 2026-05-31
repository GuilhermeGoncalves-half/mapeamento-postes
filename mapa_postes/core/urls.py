from django.urls import path
from . import views

urlpatterns = [
    path('postes/', views.listar_postes),
    path('postes/criar/', views.criar_poste),
    path('postes/editar/<int:id>/',views.editar_poste),
    path('postes/excluir/<int:id>/', views.excluir_poste),
    path('postes/editar/obs/<int:id>/', views.obs_poste),
]