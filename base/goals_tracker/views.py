import json

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.db import IntegrityError
from django.urls import reverse

from .models import User, BigGoal, CheckpointGoal, DailySystems, AntiGoal


# BIG GOAL PAGE
def anti_goal(request):
   pass

def daily_system(request):
   pass

def checkpoint_goal(request):
   pass

def big_goal(request):
   pass


# HOME
def big_goals(request):
   # get all big goals
   if request.method == "GET":
        user = request.user

        # Retrieve all Big Goals of the user
        big_goals_queryset = BigGoal.objects.filter(user=user)

        # Serialize queryset into JSON format
        big_goals = []
        for big_goal in big_goals_queryset:
           data = {
              "id": big_goal.id,
              "title": big_goal.title,
              "description": big_goal.description,
              "deadline": big_goal.deadline,
           }
           big_goals.append(data)
        
        return JsonResponse({"big_goals": big_goals}, safe=False)

   # create a big goal
   if request.method == "POST":
      data = json.loads(request.body)
      print(data)

      # get contents from Big Goal Form
      title = data.get("title", "")
      deadline = data.get("deadline", "")
      description = data.get("description", "")

      # insert contents to the BigGoal Model
      big_goal = BigGoal(
         user = request.user,
         title = title,
         description = description,
         deadline = deadline,
      ) 
      big_goal.save()

      return JsonResponse({"message": "Big Goal created successfully."}, status=201)

def index(request):
    if request.user.is_authenticated:
        return render(request, "goals_tracker/index.html", {
           "username": request.user.username,
        })
    else:
        return HttpResponseRedirect(reverse("goals_tracker:login"))


# AUTHENTICATION
def logout_view(request):
  logout(request)
  return HttpResponseRedirect(reverse("goals_tracker:login"))

def login_view(request):
  if request.method == "POST":
    username = request.POST.get("username")
    password = request.POST.get("password")

    # Dictionary to hold error messages
    errors = {}

    # Check if username exists
    if not User.objects.filter(username=username).exists():
       errors["username"] = f"'{username}' does not exist."
      
    # authenticate user
    user = authenticate(request, username=username, password=password)

    # Check if authentication failed
    if user is None:
       errors["password"] = "Invalid password."

    # If there are errors, render the login page with error messages
    if errors:
       return render(request, "goals_tracker/login.html", {"errors": errors})
    # Login user if no auth is successful
    else:
      login(request, user)
      return HttpResponseRedirect(reverse("goals_tracker:index"))
  else:
    return render(request, "goals_tracker/login.html")

def register(request):
    if request.method == "POST":
        email = request.POST.get("email")
        username = request.POST.get("username")
        password = request.POST.get("password")
        confirmation = request.POST.get("confirmation")
        
        # Dictionary to hold error messages
        errors = {}

        # Check if email is taken
        if User.objects.filter(email=email).exists():
            errors["email"] = f"'{email}' is already in use."

        # Check if username is taken
        if User.objects.filter(username=username).exists():
            errors["username"] = f"'{username}' is already taken."

        # Check if password matches confirmation
        if password != confirmation:
            errors["password"] = "Passwords do not match."

        # If any errors exist, render the registration form with error messages
        if errors:
            return render(request, "goals_tracker/register.html", {"errors": errors})

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            login(request, user)
            return HttpResponseRedirect(reverse("goals_tracker:index"))
        except IntegrityError:
            # Database integrity error (e.g., username already exists)
            errors["message"] = "An error occurred. Please try again later."
            return render(request, "goals_tracker/register.html", {"errors": errors})
    else:
        return render(request, "goals_tracker/register.html")