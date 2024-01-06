from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserListView, TopGoalListView, DailyGoalListView

# post_router = DefaultRouter()
# post_router.register(r'users/', UserViewSet)

urlpatterns = [
  path('users/', UserListView.as_view(), name='user-list'),
  path('top-goals/', TopGoalListView.as_view(), name='top-goal-list'),
  path('daily-goals/', DailyGoalListView.as_view(), name='daily-goal-list'),
]
