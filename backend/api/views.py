from rest_framework import viewsets, status, generics
from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView

from base.models import User, TopGoal, DailyGoal
from .serializers import UserSerializer, TopGoalSerializer, DailyGoalSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TopGoalListView(generics.ListAPIView):
    queryset = TopGoal.objects.all()
    serializer_class = TopGoalSerializer

class DailyGoalListView(generics.ListAPIView):
    queryset = DailyGoal.objects.all()
    serializer_class = DailyGoalSerializer