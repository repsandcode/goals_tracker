from django.shortcuts import render, get_object_or_404

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import authenticate

from base.models import User, TopGoal, DailyGoal
from .serializers import UserSerializer, TopGoalSerializer, DailyGoalSerializer, LoginSerializer

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView



class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        # Assuming you have implemented your own authentication logic or using a third-party package
        # For example, using Django Simple JWT's built-in views
        # You can customize this based on your authentication method
        pass


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

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Your custom authentication logic here, for example:
        user = authenticate(username=serializer.validated_data['username'], password=serializer.validated_data['password'])

        if user is None:
            return Response({'error': 'Invalid credentials'}, status=400)

        response = super().post(request, *args, **kwargs)
        return response


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


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