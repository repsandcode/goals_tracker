import json

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.db import IntegrityError
from django.urls import reverse

from .models import User

@login_required
def index(request):  
    if request.user.is_authenticated:
        return render(request, "goals_tracker/index.html", {"first_name": request.user.first_name.capitalize()})
    else:
        return HttpResponseRedirect(reverse("goals_tracker:login"))


def login_view(request):
  if request.method == "POST":
    # Attempt to sign user in
    username = request.POST["username"]
    password = request.POST["password"]
    user = authenticate(request, username=username, password=password)
      
    # Check if authentication successful
    if user is not None:
      login(request, user)
      return HttpResponseRedirect(reverse("goals_tracker:index"))
    else:
      return render(request, "goals_tracker/login.html", {
        "message": "Invalid username and/or password."
      })
  else:
    return render(request, "goals_tracker/login.html")


def logout_view(request):
  logout(request)
  return HttpResponseRedirect(reverse("goals_tracker:login"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "goals_tracker/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "goals_tracker/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "goals_tracker/register.html")