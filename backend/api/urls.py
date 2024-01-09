from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, TopGoalViewSet, DailyGoalViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'topgoals', TopGoalViewSet)
router.register(r'dailygoals', DailyGoalViewSet)

urlpatterns = [
  path('', include(router.urls)),
]
