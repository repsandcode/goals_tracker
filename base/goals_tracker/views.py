import json

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse

# Create your views here.
def index(request, username):
  if request.user.is_authenticated:
    return render(request, "goals_tracker/index.html", {
      "username": username.capitalize()
    })
  else:
    return HttpResponseRedirect(reverse("goals_tracker:login"))


def login_view(request):
  # If user is already authenticated, redirect to index page
  if request.user.is_authenticated:
    return HttpResponseRedirect(reverse("goals_tracker:index"))
    
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