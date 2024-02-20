from django.urls import path
from . import views

app_name = "goals_tracker"

urlpatterns = [
  # home
  path("<str:username>", views.index, name="index"),
  path("login", views.login_view, name="login"),
  path("logout", views.logout_view, name="logout"),
  path("register", views.register, name="register"),  

  # path("<str:username>/create-big-goal", views.create_biggoal, name="create_biggoal"),

  # big goal page
  # path("<str:username>/<str:biggoal>", views.biggoal, name="biggoal"),
  # path("<str:username>/<str:biggoal>/create-checkpoint-goals", views.create_checkpointgoal, name="create_checkpointgoal"),
  # path("<str:username>/<str:biggoal>/create-daily-systems", views.create_dailysystem, name="create_dailysystem"),
  # path("<str:username>/<str:biggoal>/create-anti-goals", views.create_antigoals, name="create_antigoals"),
]