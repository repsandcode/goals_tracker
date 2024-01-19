from django.shortcuts import render, get_object_or_404

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import authenticate

from base.models import User, TopGoal, DailyGoal
from .serializers import UserSerializer, TopGoalSerializer, DailyGoalSerializer, LoginSerializer

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

import jwt
from decouple import config


class RegisterView(APIView):
    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        
        # Customizing error messages based on validation errors
        errors = serializer.errors
        response_data = {}

        print(errors)

        if 'email' in errors:
            email_error_code = errors['email'][0].code
            
            if email_error_code == 'unique':
                response_data['email'] = ["Email already exists."]
            else:
                response_data['email'] = errors['email'][0]
        
        if 'username' in errors:
            username_error_code = errors['username'][0].code
            if username_error_code == 'unique':
                response_data['username'] = ["Username already exists."]
            else:
                response_data['username'] = errors['username'][0]

        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


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

    # @action(detail=True, methods=['get'])
    # def user_details(self, request):
    #     # Get the user from the request
    #     user = self.request.user

    #     # Serialize the user data and return it in the response
    #     serializer = UserSerializer(user)

    #     return Response(serializer.data)


class TopGoalViewSet(ModelViewSet):
    queryset = TopGoal.objects.all()
    serializer_class = TopGoalSerializer

    def get_queryset(self):
        # Get the user from the request
        user = self.request.user

        # Filter the queryset based on the user
        queryset = TopGoal.objects.filter(user=user)

        return queryset
    
    def create(self, request, *args, **kwargs):
        # Get the user from the request
        user = request.user

        # Validate and serialize the incoming data
        serializer = TopGoalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save the new goal with the user
        serializer.save(user=user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DailyGoalViewSet(ModelViewSet):
    queryset = DailyGoal.objects.all()
    serializer_class = DailyGoalSerializer

    def get_queryset(self):
        # Get the user from the request
        user = self.request.user

        # Filter the queryset based on the user
        queryset = DailyGoal.objects.filter(user=user)

        return queryset
