from django.db import models

class CapturedImage(models.Model):
    image = models.TextField()
    timestamp = models.DateTimeField()
