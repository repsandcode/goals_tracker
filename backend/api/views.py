from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from base.models import User, TopGoal, DailyGoal
from .serializers import UserSerializer, TopGoalSerializer, DailyGoalSerializer

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TopGoalViewSet(ModelViewSet):
    queryset = TopGoal.objects.all()
    serializer_class = TopGoalSerializer

class DailyGoalViewSet(ModelViewSet):
    queryset = DailyGoal.objects.all()
    serializer_class = DailyGoalSerializer