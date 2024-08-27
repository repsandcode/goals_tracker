from django.contrib import admin
from .models import User, BigGoal, DailySystem, DailySystemCheckIn

admin.site.register(User)
admin.site.register(BigGoal)
admin.site.register(DailySystem)
admin.site.register(DailySystemCheckIn)
