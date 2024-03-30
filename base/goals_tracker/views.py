import json

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.db import IntegrityError
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta, datetime

from .models import User, BigGoal, CheckpointGoal, DailySystem, AntiGoal


# BIG GOAL PAGE
def anti_goal(request):
   pass

def daily_system(request):
   pass

def checkpoint_goal(request):
   pass

def big_goal(request, title):
   if request.method == "GET":
      original_title = title.replace('-', ' ')

      # Retrieve the Big Goal
      big_goal = get_object_or_404(BigGoal, user=request.user, title=original_title)
      # Serialize Big Goal query into JSON format
      big_goal_data = big_goal.serialize()

      # Create timeline
      start_date = datetime.strptime(big_goal_data["start"], "%Y-%m-%d")
      end_date = datetime.strptime(big_goal_data["deadline"], "%Y-%m-%d")
      all_dates = []
      for i in range((end_date - start_date).days + 1):
         current_date = start_date + timedelta(days=i)
         if current_date.day == 1:
            all_dates.append(current_date.strftime('%m %a %d'))
         else:
            all_dates.append(current_date.strftime('%a %d'))
      timeline = {
         "start": start_date.strftime('%B %d, %Y'),
         "deadline": end_date.strftime('%B %d, %Y'),
         "all_dates": all_dates,
      }
      
      # Retrieve related Checkpoint Goals
      checkpoint_goals = CheckpointGoal.objects.filter(big_goal=big_goal)
      checkpoint_goals_data = []
      for cp_goal in checkpoint_goals:
         data = cp_goal.serialize()
         checkpoint_goals_data.append(data)

      # Retrieve related Daily Systems
      daily_systems = DailySystem.objects.filter(big_goal=big_goal)
      daily_systems_data = []
      for system in daily_systems:
         data = system.serialize()
         daily_systems_data.append(data)

      # Retrieve related Anti-Goals
      anti_goals = AntiGoal.objects.filter(big_goal=big_goal)
      anti_goals_data = []
      for anti_goal in anti_goals:
         data = anti_goal.serialize()
         anti_goals_data.append(data)

      return render(request, "goals_tracker/big_goal_page.html", {
         "title_unedited": title,
         "title": original_title,
         "big_goal": big_goal_data,
         "timeline": timeline,
         "checkpoint_goals": checkpoint_goals_data.reverse(),
         "daily_systems": daily_systems_data.reverse(),
         "anti_goals": anti_goals_data.reverse(),
      })


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
           data = big_goal.serialize()
           big_goals.append(data)
        
        big_goals.reverse()

        return JsonResponse(big_goals, safe=False)

   # create a big goal
   if request.method == "POST":
      data = json.loads(request.body)
      print(data)

      # get contents from Big Goal Form
      title = data.get("title", "")
      start = data.get("start", "")
      deadline = data.get("deadline", "")
      description = data.get("description", "")

      # insert contents to the BigGoal Model
      big_goal = BigGoal(
         user = request.user,
         title = title,
         description = description,
         start = start,
         deadline = deadline,
      ) 
      big_goal.save()

      return JsonResponse({"message": "Big Goal created successfully."}, status=201)

   # delete old big goal
   if request.method == "DELETE":
        data = json.loads(request.body)

        # get contents from Big Goal Form
        title = data.get("title", "")
        start = data.get("start", "")
        deadline = data.get("deadline", "")
        description = data.get("description", "")

        old_goal = BigGoal.objects.filter(user=request.user, title=title, description=description, start=start, deadline=deadline)

        old_goal.delete()

        return JsonResponse({'message': f"{old_goal} deleted successfully"})

def index(request):
    if request.user.is_authenticated:
        return render(request, "goals_tracker/home_page.html", {
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