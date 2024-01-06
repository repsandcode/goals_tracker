from rest_framework import serializers
from base.models import User, TopGoal, DailyGoal

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