from django.urls import path
from . import views

app_name = "goals_tracker"

urlpatterns = [
  # authentication
  path("login", views.login_view, name="login"),
  path("logout", views.logout_view, name="logout"),
  path("register", views.register, name="register"),  

  # home
  path("", views.index, name="index"),
  path("big-goals", views.big_goals, name="big_goals"),
  path("create-big-goal", views.big_goals, name="create_big_goal"),
  path('delete-old-goal', views.big_goals, name='delete_old_goal'),


  # big goal page
  path("big-goal/<str:title>", views.big_goal, name="big_goal"),
  path("big-goal/<str:title>/create-checkpoint-goal", views.checkpoint_goal, name="create_checkpoint_goal"),
  path("big-goal/<str:title>/create-daily-system", views.daily_system, name="create_daily_system"),
  # path("<str:biggoal>/create-anti-goals", views.create_antigoals, name="create_antigoals"),
]