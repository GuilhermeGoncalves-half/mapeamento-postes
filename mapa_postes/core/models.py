from django.db import models

class Poste(models.Model):
    nome = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=11)
    obs = models.CharField(max_length=150)
    tipo = models.CharField(max_length=20)

    def __str__(self):
        return self.nome
    
    
# Create your models here.
