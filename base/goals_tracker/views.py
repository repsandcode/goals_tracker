from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request, name):
  return render(request, "goals_tracker/index.html", {
    "name": name.capitalize()
  })