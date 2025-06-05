from django.urls import path

from . import views

urlpatterns = [
    path("login", views.login, name="loginpage"),
    path("register", views.register, name="registerpage"),
    path("logout", views.logout, name="logoutpage"),
    path("", views.index, name="homepage"),
]