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
  path("daily-systems", views.daily_systems, name="daily_systems"),
  path("big-goals", views.big_goals, name="big_goals"),
  path("create-big-goal", views.big_goals, name="create_big_goal"),
  path("delete-old-goal", views.big_goals, name='delete_old_goal'),
  path("get-user-data", views.get_user_data, name="get_user_data"),


  # big goal page
  path("big-goal/<str:title>", views.big_goal, name="big_goal"),
  path("big-goal/<str:title>/create-checkpoint-goal", views.checkpoint_goal, name="create_checkpoint_goal"),
  path("big-goal/<str:title>/create-daily-system", views.daily_system, name="create_daily_system"),
  path("big-goal/<str:title>/create-anti-goal", views.anti_goal, name="create_anti_goal"),


  # complete a daily action
  path("all-completed-daily-systems", views.all_completed_daily_systems, name="all_completed_daily_systems"),
  path("mark-complete-daily-system", views.mark_complete_daily_system, name="mark_complete_daily_system"),
  path("mark-incomplete-daily-system", views.mark_incomplete_daily_system, name="mark_incomplete_daily_system"),
]