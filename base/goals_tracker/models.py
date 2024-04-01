from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date

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
    start = models.DateField(default=date.today)
    deadline = models.DateField()

    def __str__(self):
        return self.title
    
    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "title": self.title,
            "description": self.description,
            "start": self.start.strftime("%Y-%m-%d"),
            "deadline": self.deadline.strftime("%Y-%m-%d"),
        }

class CheckpointGoal(BaseModel):
    big_goal = models.ForeignKey(BigGoal, on_delete=models.CASCADE)
    date = models.DateField(default=date.today)

    def __str__(self):
        return self.title
    
    def serialize(self):
        return {
            "id": self.id,
            "big_goal": self.big_goal.title,
            "title": self.title,
            "description": self.description,
            "date": self.date,
        }

class DailySystem(models.Model):
    big_goal = models.ForeignKey(BigGoal, on_delete=models.CASCADE)
    action = models.CharField(max_length=300)

    def __str__(self):
        return self.action

    def serialize(self):
        return {
            "id": self.id,
            "big_goal": self.big_goal.title,
            "action": self.action,
        }

class DailySystemCheckIn(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    daily_system = models.ForeignKey(DailySystem, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'daily_system', 'date')

    def __str__(self):
        return f"{self.user.username}'s check-in for {self.daily_system.action} on {self.date}"
    
    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "daily_system": self.daily_system.action,
            "date": self.date,
        }
    
class AntiGoal(models.Model):
    big_goal = models.ForeignKey(BigGoal, on_delete=models.CASCADE)
    description = models.TextField()

    def __str__(self):
        return self.description
    
    def serialize(self):
        return {
            "id": self.id,
            "big_goal": self.big_goal.title,
            "description": self.description,
        }