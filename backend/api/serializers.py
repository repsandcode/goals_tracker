from rest_framework import serializers
from base.models import User, TopGoal, DailyGoal
from django.contrib.auth.hashers import make_password

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255, required=True)
    password = serializers.CharField(max_length=128, write_only=True, required=True)

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = '__all__'

class TopGoalSerializer(serializers.ModelSerializer):
  class Meta:
    model = TopGoal
    fields = '__all__'

class DailyGoalSerializer(serializers.ModelSerializer):
  class Meta:
    model = DailyGoal
    fields = '__all__'