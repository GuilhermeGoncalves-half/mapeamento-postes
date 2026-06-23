from django.db import models

class Poste(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=11)
    tipo = models.CharField(max_length=20)

    def __str__(self):
        return self.nome
    
class ObservacaoManutencao(models.Model):
    poste = models.ForeignKey(
        Poste,
        on_delete=models.CASCADE,
        related_name='observacoes'
    )

    observacao = models.TextField()

    criado_em = models.DateTimeField(auto_now_add=True)
    
    
# Create your models here.
