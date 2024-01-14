from django.shortcuts import render, get_object_or_404

from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from base.models import User, TopGoal, DailyGoal
from .serializers import UserSerializer, TopGoalSerializer, DailyGoalSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView




class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def list(self, request):
        serializer = UserSerializer(self.queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        item = get_object_or_404(self.queryset, pk=pk)
        serializer = UserSerializer(item)
        return Response(serializer.data)


class TopGoalViewSet(ModelViewSet):
    queryset = TopGoal.objects.all()
    serializer_class = TopGoalSerializer
    
    def list(self, request):
        user = request.user
        user_top_goals = user.goals.all()
        serializer = TopGoalSerializer(user_top_goals, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        item = get_object_or_404(self.queryset, pk=pk)
        serializer = TopGoalSerializer(item)
        return Response(serializer.data)



class DailyGoalViewSet(ModelViewSet):
    queryset = DailyGoal.objects.all()
    serializer_class = DailyGoalSerializer
    
    def list(self, request):
        serializer = DailyGoalSerializer(self.queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        item = get_object_or_404(self.queryset, pk=pk)
        serializer = DailyGoalSerializer(item)
        return Response(serializer.data)