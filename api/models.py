from django.db import models
from django.contrib.auth.models import AbstractUser
from colorfield.fields import ColorField

# Create your models here.
class User(AbstractUser):
    pass

class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=16)
    color = ColorField(default='#D6D6D6')
    totalTime = models.TimeField(null=True) #uzywac datetime w pythonie do obslugiwania czasu