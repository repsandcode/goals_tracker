from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    bio = models.TextField(max_length=500, blank=True, null=True)
    birth_date = models.DateField(null=True, blank=True)
    score = models.IntegerField(default=0)

    def __str__(self):
       return f"User {self.id}: {self.username}"

class TopGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="goals")
    name = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    start_date = models.DateField(auto_now=False, auto_now_add=False)
    end_date = models.DateField(auto_now=False, auto_now_add=False)
    completed = models.BooleanField(default=False)

    def complete(self):
        self.completed = True
        self.save()

    def __str__(self):
        return f"[{self.user.username}] {self.name} (Top Goal {self.id}) - {self.start_date} to {self.end_date}"
    
class DailyGoal(models.Model):
    top_goal = models.ForeignKey(TopGoal, on_delete=models.CASCADE, related_name="daily_goals")
    name = models.TextField()
    completed = models.BooleanField(default=False)
    start_time = models.TimeField(auto_now=False, auto_now_add=False)
    end_time = models.TimeField(auto_now=False, auto_now_add=False)

    def complete(self):
        self.completed = True
        self.save()

    def __str__(self):
        return f"[{self.top_goal.user.username}] {self.name} (Daily Goal {self.id}) - {self.start_time} to {self.end_time} -> {self.top_goal.name} (Top Goal {self.top_goal.id})"