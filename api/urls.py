from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.get_users),
    path('create/', views.create_user),
    path('delete/<int:pk>', views.delete_user),
    path('login/', views.login),
    path('projects/', views.get_projects_for_user),
]