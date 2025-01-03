from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date

class User(AbstractUser):
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
            "title": self.title,
            "user": self.user.username,
            "description": self.description,
            "start": self.start.strftime("%Y-%m-%d"),
            "deadline": self.deadline.strftime("%Y-%m-%d"),
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
    big_goal = models.ForeignKey(BigGoal, on_delete=models.CASCADE, default="")
    daily_system = models.ForeignKey(DailySystem, on_delete=models.CASCADE)
    date = models.DateField()

    def __str__(self):
        return f"{self.user.username}'s check-in for {self.daily_system.action} on {self.date}"
    
    def serialize(self):
        return {
            "user": self.user.username,
            "big_goal": self.big_goal.title,
            "daily_system": self.daily_system.action,
            "date": self.date,
        }
    