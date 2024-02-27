from django.urls import path
from . import views

app_name = "goals_tracker"

urlpatterns = [
  # authentication
  path("login", views.login_view, name="login"),
  path("logout", views.logout_view, name="logout"),
  path("register", views.register, name="register"),  

  # dashboard
  path("", views.index, name="index"),
  # path("create-big-goal", views.create_biggoal, name="create_biggoal"),

  # big goal page
  # path("<str:biggoal>", views.biggoal, name="biggoal"),
  # path("<str:biggoal>/create-checkpoint-goals", views.create_checkpointgoal, name="create_checkpointgoal"),
  # path("<str:biggoal>/create-daily-systems", views.create_dailysystem, name="create_dailysystem"),
  # path("<str:biggoal>/create-anti-goals", views.create_antigoals, name="create_antigoals"),
]