from rest_framework.routers import DefaultRouter
from api.urls import post_router
from django.urls import path, include

router = DefaultRouter()

#Users
router.registry.extend(post_router.registry)

urlpatterns = [
  path('/users', include(router.urls))
]
