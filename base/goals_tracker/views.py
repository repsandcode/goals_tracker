import json

from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse

# Create your views here.
def index(request, username):
  return render(request, "goals_tracker/index.html", {
    "username": username.capitalize()
  })


def login(request):
  if request.method == "POST":
    # Attempt to sign user in
    username = request.POST["username"]
    password = request.POST["password"]
    user = authenticate(request, username=username, password=password)
      
    # Check if authentication successful
    if user is not None:
      login(request, user)
      return HttpResponseRedirect(reverse("index"))
    else:
      return render(request, "goals_tracker/login.html", {
        "message": "Invalid username and/or password."
      })
  else:
    return render(request, "goals_tracker/login.html")


def logout(request):
  logout(request)
  return HttpResponseRedirect(reverse("login"))