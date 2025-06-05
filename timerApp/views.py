from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout as auth_logout

# Create your views here.
def register(request):
    return render(request, "timerApp/register.html")

def login(request):
    return render(request, "timerApp/login.html")

@login_required
def logout(request):
    auth_logout(request)
    return redirect("logoutpage")

@login_required
def index(request):
    return render(request, "timerApp/index.html")