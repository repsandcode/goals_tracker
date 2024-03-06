from django.contrib import admin
from .models import User, BigGoal, CheckpointGoal, DailySystem, DailySystemCheckIn, AntiGoal

admin.site.register(User)
admin.site.register(BigGoal)
admin.site.register(CheckpointGoal)
admin.site.register(DailySystem)
admin.site.register(DailySystemCheckIn)
admin.site.register(AntiGoal)
