from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Define related_name for groups field
    groups = models.ManyToManyField('auth.Group', related_name="user_groups_%(class)s")
    
    # Define related_name for user_permissions field
    user_permissions = models.ManyToManyField('auth.Permission', related_name="user_permissions_set_%(class)s")

    bio = models.TextField(blank=True)
    points = models.IntegerField(default=0)

    def __str__(self):
        return self.username
