import json

from collections import defaultdict
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.db import IntegrityError
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta, datetime, date
import json

from .models import User, BigGoal, DailySystem, DailySystemCheckIn

# GLOBAL FUNCTION
def all_completed_daily_systems(request):
   completed_daily_systems = DailySystemCheckIn.objects.filter(user=request.user)

   completed_daily_systems_data = defaultdict(lambda: defaultdict(list))

   for completed in completed_daily_systems:
      data = completed.serialize()
      date = data.get('date').strftime('%a-%b-%d-%Y')  # Get date first
      big_goal = data.get('big_goal')
      daily_system = data.get('daily_system')

      if daily_system not in completed_daily_systems_data[date][big_goal]:
         completed_daily_systems_data[date][big_goal].append(daily_system)

   completed_daily_systems_data = {date: dict(goals) for date, goals in completed_daily_systems_data.items()}

   return JsonResponse(completed_daily_systems_data, safe=False) 

def mark_incomplete_daily_system(request):
   try:
      data = json.loads(request.body)
      big_goal_title = data.get("bigGoal")
      daily_system_action = data.get("dailySystem")
      date_str = data.get("date")

      if not all([big_goal_title, daily_system_action, date_str]):
          return JsonResponse({"message": "Missing required fields"}, status=400) 
      
      print(big_goal_title, daily_system_action, date_str)
      
      parsed_date = datetime.strptime(date_str, "%a-%b-%d-%Y").date()
      big_goal_obj = get_object_or_404(BigGoal, user=request.user, title=big_goal_title)
      daily_system_obj = get_object_or_404(DailySystem, big_goal=big_goal_obj, action=daily_system_action)
      daily_system_checkins = DailySystemCheckIn.objects.filter(user=request.user, big_goal=big_goal_obj, daily_system=daily_system_obj, date=parsed_date)

      for checkin in daily_system_checkins:
         checkin.delete()

      return JsonResponse({"message": f"All {daily_system_action} entries for {parsed_date} deleted"}, status=201)
   
   except ValueError:
      return JsonResponse({"message": "Invalid date format"}, status=400)
   except Exception as e:
      return JsonResponse({'message': f'An error occurred: {str(e)}'}, status=500)

def mark_complete_daily_system(request):
   try:
      data = json.loads(request.body)
      big_goal_title = data.get("bigGoal")
      daily_system_action = data.get("dailySystem")
      date_str = data.get("date")

      if not all([big_goal_title, daily_system_action, date_str]):
         return JsonResponse({"message": "Missing required fields"}, status=400)
      
      parsed_date = datetime.strptime(date_str, "%a-%b-%d-%Y").date()
      big_goal_obj = get_object_or_404(BigGoal, user=request.user, title=big_goal_title)
      daily_system_obj = get_object_or_404(DailySystem, big_goal=big_goal_obj, action=daily_system_action)

      # Check if DailySystemCheckIn already exists for the given date
      existing_checkin = DailySystemCheckIn.objects.filter(user=request.user,
                                                              big_goal=big_goal_obj,
                                                              daily_system=daily_system_obj,
                                                              date=parsed_date).exists()
      if existing_checkin:
         return JsonResponse({"message": f"{daily_system_action} already completed at {parsed_date}"}, status=400)

      # Create and save DailySystemCheckIn
      daily_system_checkin = DailySystemCheckIn(
         user=request.user,
         big_goal=big_goal_obj,
         daily_system=daily_system_obj,
         date=parsed_date,
      )
      daily_system_checkin.save()

      return JsonResponse({"message": f"{daily_system_action} completed at {parsed_date}"}, status=201)
   except ValueError:
      return JsonResponse({"message": "Invalid date format"}, status=400)
   except Exception as e:
      return JsonResponse({'message': f'An error occurred: {str(e)}'}, status=500)

def big_goal_data(request, title):
   original_title = title.replace('-', ' ')

   # Big Goal
   big_goal = get_object_or_404(BigGoal, user=request.user, title=original_title)
   big_goal_data = big_goal.serialize()

   # Completed Daily Systems
   completed_daily_systems_content = all_completed_daily_systems(request).content.decode('utf-8')
   completed_daily_systems_data = json.loads(completed_daily_systems_content)
 
   # Retrieve related Daily Systems
   daily_systems = DailySystem.objects.filter(big_goal=big_goal)
   daily_systems_data = []
   daily_systems_actions = ''
   for system in daily_systems:
      data = system.serialize()
      daily_systems_actions += data["action"] + ","
      daily_systems_data.append(data)

   # Create timeline
   start_date = datetime.strptime(big_goal_data["start"], "%Y-%m-%d")
   end_date = datetime.strptime(big_goal_data["deadline"], "%Y-%m-%d")
   all_dates = []

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
            if goal in completed_on_date and action in completed_on_date.get(goal):
               current_date_data["actions"].append(action)
        
      all_dates.append(current_date_data)

   timeline = {
      "start": start_date.strftime('%B %d, %Y'),
      "deadline": end_date.strftime('%B %d, %Y'),
      "all_dates": all_dates,
   }

   # Calculate percentage completion
   total_days = (end_date - start_date).days
   days_elapsed = (date.today() - start_date.date()).days
   percentage_completion = round(max(0, min((days_elapsed / total_days) * 100, 100)), 1)

   return {
      "title_unedited": title,
      "big_goal": big_goal_data,
      "timeline": timeline,
      "daily_systems": daily_systems_data,
      "actions": daily_systems_actions,
      "percentage_completion": percentage_completion,
   }


# BIG GOAL PAGE
def daily_system(request, title):
   # delete daily system
   if request.method == "DELETE":
      data = json.loads(request.body)

      id = int(data.get("id", 0))
      big_goal = data.get("big_goal", "")
      action = data.get("action", "")

      print(data)

      try: 
         big_goal_instance = get_object_or_404(BigGoal, user=request.user, title=big_goal)
         daily_system = get_object_or_404(DailySystem, id=id, big_goal=big_goal_instance, action=action)
         daily_system.delete()
         return JsonResponse({'message': 'Daily System deleted successfully'})
      except Http404:
         return JsonResponse({'message': 'Daily System not found'}, status=404)
      except Exception as e:
         return JsonResponse({'message': f'An error occurred: {str(e)}'}, status=500)


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
def get_user_data(request):
   if request.method == "GET":
      return JsonResponse(user_data(request), status=201) 

def user_data(request):
   user = request.user
   user_obj = get_object_or_404(User, username=user.username)

   # Serialize only necessary user data
   return {
        'id': user_obj.id,
        'username': user_obj.username,
        'first_name': user_obj.first_name,
        'last_name': user_obj.last_name,
        'email': user_obj.email,
    }

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

        completed_daily_systems_content = all_completed_daily_systems(request).content.decode('utf-8')
        completed_daily_systems_data = json.loads(completed_daily_systems_content)
        today = date.today().strftime('%a-%b-%d-%Y')
        completed_today = completed_daily_systems_data.get(today, {})

        print(completed_today)

        # Serialize queryset into JSON format
        daily_systems = []
        for action in container:
           data = action.serialize()
           big_goal = data["big_goal"]
           action = data["action"]

           print(completed_today.get(big_goal))

           big_goal_in_completed_today = completed_today.get(big_goal, {})
           action_in_completed_today = big_goal_in_completed_today and action in big_goal_in_completed_today

           if completed_today and action_in_completed_today:
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
        home_page = user_data(request)
        return render(request, "goals_tracker/home_page.html", home_page)
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

        # Validate email format
        try:
            validate_email(email)
        except ValidationError:
            errors["email"] = "Invalid email format."

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