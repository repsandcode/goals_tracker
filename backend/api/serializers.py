from rest_framework import serializers
from base.models import User, TopGoal, DailyGoal
from django.contrib.auth.hashers import make_password
from rest_framework.validators import UniqueValidator

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255, required=True)
    password = serializers.CharField(max_length=128, write_only=True, required=True)

class UserSerializer(serializers.ModelSerializer):
  username = serializers.CharField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())],
            min_length=5,
            max_length=20
            )
  password = serializers.CharField(
            required=True,
            max_length=256,
            write_only=True  # Make sure password is write-only
            )
  email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
  first_name = serializers.CharField(max_length=30, required=True)
  last_name = serializers.CharField(max_length=30, required=True)
  
  class Meta:
    model = User
    fields = "__all__"
  
  def create(self, validated_data):
    user = User.objects.create_user(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password'],
            username=validated_data['username'],
          )
    return user

class TopGoalSerializer(serializers.ModelSerializer):
  class Meta:
    model = TopGoal
    fields = '__all__'

class DailyGoalSerializer(serializers.ModelSerializer):
  class Meta:
    model = DailyGoal
    fields = '__all__'