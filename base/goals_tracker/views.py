import json

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.db import IntegrityError
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta, datetime, date

from .models import User, BigGoal, CheckpointGoal, DailySystem, AntiGoal, DailySystemCheckIn

# GLOBAL FUNCTION
def all_completed_daily_systems(request):
   completed_daily_systems = DailySystemCheckIn.objects.filter(user=request.user)

   completed_daily_systems_data = {}

   for completed in completed_daily_systems:
      data = completed.serialize()
      date = data.get('date').strftime('%a-%b-%d-%Y')  # Get date first
      big_goal = data.get('big_goal')
      daily_system = data.get('daily_system')

      if date in completed_daily_systems_data:
         if big_goal not in completed_daily_systems_data[date]:
            completed_daily_systems_data[date][big_goal] = {}
         if daily_system not in completed_daily_systems_data[date][big_goal]:
            completed_daily_systems_data[date][big_goal] = daily_system
      else:
         completed_daily_systems_data[date] = {big_goal: daily_system}

   return JsonResponse(completed_daily_systems_data, safe=False) 

def complete_daily_system(request):
   data = json.loads(request.body)

   # get contents from Checkpoint Goal Form submission
   big_goal = data.get("bigGoal", "")
   daily_system = data.get("dailySystem", "")
   date = data.get("date", "")
   parsed_date = datetime.strptime(date, "%a-%b-%d-%Y").date()

   big_goal_obj = get_object_or_404(BigGoal, user=request.user, title=big_goal)
   daily_system_obj = get_object_or_404(DailySystem, big_goal=big_goal_obj, action=daily_system)

   try:
      daily_system_checkin = DailySystemCheckIn(
         user = request.user,
         big_goal = big_goal_obj,
         daily_system = daily_system_obj,
         date = parsed_date,
      )
      daily_system_checkin.save()
      return JsonResponse({"message": f"{daily_system} completed at {parsed_date}"}, status=201)
   except Exception as e:
      print(e)
      return JsonResponse({'message': f'An error occurred: {str(e)}'}, status=500)

def big_goal_data(request, title):
   original_title = title.replace('-', ' ')

   # Retrieve the Big Goal
   big_goal = get_object_or_404(BigGoal, user=request.user, title=original_title)
   # Serialize Big Goal query into JSON format
   big_goal_data = big_goal.serialize()
   
   # Retrieve related Daily Systems
   daily_systems = DailySystem.objects.filter(big_goal=big_goal)
   daily_systems_data = []
   for system in daily_systems:
      data = system.serialize()
      daily_systems_data.append(data)
      
   # Retrieve related Checkpoint Goals
   checkpoint_goals = CheckpointGoal.objects.filter(big_goal=big_goal)
   checkpoint_goals_data = []
   for cp_goal in checkpoint_goals:
      data = cp_goal.serialize()
      checkpoint_goals_data.append(data)

   # Retrieve related Anti-Goals
   anti_goals = AntiGoal.objects.filter(big_goal=big_goal)
   anti_goals_data = []
   for anti_goal in anti_goals:
      data = anti_goal.serialize()
      anti_goals_data.append(data)
      

   # Create timeline
   start_date = datetime.strptime(big_goal_data["start"], "%Y-%m-%d")
   end_date = datetime.strptime(big_goal_data["deadline"], "%Y-%m-%d")
   all_dates = []
   
   completed_daily_systems_content = all_completed_daily_systems(request).content.decode('utf-8')
   completed_daily_systems_data = json.loads(completed_daily_systems_content)

   for i in range((end_date - start_date).days + 1):
      current_date = (start_date + timedelta(days=i)).strftime('%a-%b-%d-%Y')
      current_date_data = {
         "current": current_date,
         "actions": [],
      }

      if current_date in completed_daily_systems_data:
         completed_on_date = completed_daily_systems_data[current_date]
         
         for daily in daily_systems_data:
           goal = daily["big_goal"]
           action = daily["action"]
           if goal in completed_on_date and completed_on_date.get(goal) == action:
              current_date_data["actions"].append(action)
      
      all_dates.append(current_date_data)

   timeline = {
      "start": start_date.strftime('%B %d, %Y'),
      "deadline": end_date.strftime('%B %d, %Y'),
      "all_dates": all_dates,
   }

   return {
      "title_unedited": title,
      "big_goal": big_goal_data,
      "timeline": timeline,
      "checkpoint_goals": checkpoint_goals_data,
      "daily_systems": daily_systems_data,
      "anti_goals": anti_goals_data,
   }


# BIG GOAL PAGE
def anti_goal(request, title):
   # create daily system
   if request.method == "POST":
      data = json.loads(request.body)
      print(data)
      print(title)

      # get contents from Daily System Form submission
      big_goal = data.get("bigGoal", "")
      description = data.get("description", "")

      big_goal = get_object_or_404(BigGoal, user=request.user, title=big_goal)

      # insert contents to the DailySystem Model
      anti_goal = AntiGoal(
         big_goal = big_goal,
         description = description,
      ) 
      anti_goal.save()

      return JsonResponse({"message": "Anti Goal created successfully."}, status=201)

def checkpoint_goal(request, title):
   # create checkpoint goal
   if request.method == "POST":
      data = json.loads(request.body)
      print(data)
      print(title)

      # get contents from Checkpoint Goal Form submission
      big_goal = data.get("bigGoal", "")
      cp_goal = data.get("checkpointGoal", "")
      description = data.get("description", "")
      date = data.get("date", "")

      big_goal = get_object_or_404(BigGoal, user=request.user, title=big_goal)

      # insert contents to the CheckpointGoal Model
      checkpoint_goal = CheckpointGoal(
         big_goal = big_goal,
         title = cp_goal,
         description = description,
         date = date,
      )
      checkpoint_goal.save()

      return JsonResponse({"message": "Checkpoint Goal created successfully."}, status=201)

def daily_system(request, title):
   # create daily system
   if request.method == "POST":
      data = json.loads(request.body)
      print(data)
      print(title)

      # get contents from Daily System Form submission
      big_goal = data.get("bigGoal", "")
      action = data.get("action", "")

      big_goal = get_object_or_404(BigGoal, user=request.user, title=big_goal)

      # insert contents to the DailySystem Model
      daily_system = DailySystem(
         big_goal = big_goal,
         action = action,
      ) 
      daily_system.save()

      return JsonResponse({"message": "Daily System created successfully."}, status=201)

def big_goal(request, title):
   if request.method == "GET":
      big_goal_page = big_goal_data(request, title)

      return render(request, "goals_tracker/big_goal_page.html", big_goal_page)


# HOME
def user_data(request):
   user = request.user
   user_obj = get_object_or_404(User, username=user.username)

   # Serialize only necessary user data
   user_data = {
        'id': user_obj.id,
        'username': user_obj.username,
        'first_name': user_obj.first_name,
        'last_name': user_obj.last_name,
        'email': user_obj.email,
    }
   
   return JsonResponse(user_data, status=201) 

def daily_systems(request):
   # get all daily systems
   if request.method == "GET":
        user = request.user

        container = []
        # Retrieve all Big Goals of the user
        big_goals_queryset = BigGoal.objects.filter(user=user).order_by("-start")
        for big_goal in big_goals_queryset:
           deadline = big_goal.deadline
           if deadline > date.today():
            # Retrieve all Daily Systems of the user
            big_goal_actions = DailySystem.objects.filter(big_goal=big_goal)

            for action in big_goal_actions:
               container.append(action)

        container.reverse()

        completed_daily_systems_content = all_completed_daily_systems(request).content.decode('utf-8')
        completed_daily_systems_data = json.loads(completed_daily_systems_content)
        today = date.today().strftime('%a-%b-%d-%Y')
        completed_today = 0

        if today in completed_daily_systems_data:
           completed_today = completed_daily_systems_data[today]

        # Serialize queryset into JSON format
        daily_systems = []
        for action in container:
           data = action.serialize()
           big_goal = data["big_goal"]
           action = data["action"]

           if completed_today and completed_today.get(big_goal) == action:
              data["completed"] = True
           else:
              data["completed"] = False

           daily_systems.append(data)

        return JsonResponse(daily_systems, safe=False) 

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
           big_goal = big_goal_data(request, data["title"])
           big_goals.append(big_goal)
        
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

        print(data)

        try: 
            old_goal = get_object_or_404(BigGoal, user=request.user, title=title, description=description, start=start, deadline=deadline)
            old_goal.delete()
            return JsonResponse({'message': 'Old goal deleted successfully'})
        except Http404:
            return JsonResponse({'message': 'Old goal not found'}, status=404)
        except Exception as e:
            return JsonResponse({'message': f'An error occurred: {str(e)}'}, status=500)

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