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
    totalTime = models.TimeField(null=True) # zrobid default datetime.time(0, 0, 0)

class Entry(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='entries')
    date = models.DateTimeField()
    time = models.TimeField()