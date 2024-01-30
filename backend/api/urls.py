from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, TopGoalViewSet, DailyGoalViewSet, MyTokenObtainPairView, RegisterView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'top', TopGoalViewSet)
router.register(r'daily', DailyGoalViewSet)

urlpatterns = [
  path('', include(router.urls)),
  path('register/', RegisterView.as_view(), name='register'),

  path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
  path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
