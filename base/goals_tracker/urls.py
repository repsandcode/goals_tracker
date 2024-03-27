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
  # path("<str:biggoal>/create-checkpoint-goals", views.create_checkpointgoal, name="create_checkpointgoal"),
  # path("<str:biggoal>/create-daily-systems", views.create_dailysystem, name="create_dailysystem"),
  # path("<str:biggoal>/create-anti-goals", views.create_antigoals, name="create_antigoals"),
]