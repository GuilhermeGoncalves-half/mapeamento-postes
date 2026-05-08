from django.db import models

class Poste(models.Model):
    nome = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.nome
    
    
# Create your models here.
