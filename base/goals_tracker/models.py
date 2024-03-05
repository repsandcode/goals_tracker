from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
  bio = models.TextField(blank=True)
  points = models.IntegerField(default=0)
  
  def __str__(self):
    return self.username

class BaseModel(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)

    class Meta:
        abstract = True

class BigGoal(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    deadline = models.DateField()

    def __str__(self):
        return self.title

class CheckpointGoal(BaseModel):
    big_goal = models.ForeignKey(BigGoal, on_delete=models.CASCADE)
    deadline = models.DateField()

    def __str__(self):
        return self.title

class DailySystems(models.Model):
    big_goal = models.ForeignKey(BigGoal, on_delete=models.CASCADE)
    action = models.CharField(max_length=300)

    def __str__(self):
        return self.action

class DailySystemCheckIn(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    daily_system = models.ForeignKey('DailySystems', on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'daily_system', 'date')

    def __str__(self):
        return f"{self.user.username}'s check-in for {self.daily_system.action} on {self.date}"
    
class AntiGoal(models.Model):
    big_goal = models.ForeignKey(BigGoal, on_delete=models.CASCADE)
    description = models.TextField()

    def __str__(self):
        return self.description