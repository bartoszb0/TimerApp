from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.get_users),
    path('create/', views.create_user),
    path('delete/<int:pk>/', views.delete_user),
    path('login/', views.login),
    path('projects/', views.get_projects_for_user),
    path('projects/create/', views.create_project),
    path('projects/delete/<int:pk>/', views.delete_project),
    path('projects/patch/color/<int:pk>/', views.update_color),
]