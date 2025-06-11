from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login as auth_login
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from .models import User, Project, Entry
from .serializers import UserSerializer, RegisterSerializer, ProjectSerializer, EntrySerializer
from django.views.decorators.csrf import csrf_exempt

import datetime
from django.utils.dateparse import parse_datetime


@api_view(["GET"])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE'])
def delete_user(request, pk):
    user = get_object_or_404(User, pk=pk)
    
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@csrf_exempt
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)

    if user is not None:
        auth_login(request, user)
        return Response({"message": "Logged in"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_projects_for_user(request):
    user = request.user
    try:
        projects = Project.objects.filter(user=user)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    serializer = ProjectSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_project(request, pk):
    project = get_object_or_404(Project, pk=pk)
    
    if project.user != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN)
    else:
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_color(request, pk):
    project = get_object_or_404(Project, pk=pk)

    if project.user != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN)


    serializer = ProjectSerializer(project, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def project_entry(request, projectID):
    project = get_object_or_404(Project, pk=projectID)

    if project.user != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    if request.method == 'POST':
    
        dateData = request.data['date']
        date = parse_datetime(dateData)

        timeData = request.data['time']
        hours, minutes, seconds = timeData.split(':')
        time = datetime.time(int(hours), int(minutes), int(seconds))

        dateAndTime = {
            'date': date,
            'time': time,
        }

        serializer = EntrySerializer(data=dateAndTime, context={'project': project})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) # also update TotalTime of project
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'GET': # either get riod of this or change URL name so its not create when you want to get
        entry = Entry.objects.filter(project=project)
        serializer = EntrySerializer(entry, many=True)
        return Response(serializer.data)

    

@api_view(['GET'])
def all_entry(request):
    entry = Entry.objects.all()
    serializer = EntrySerializer(entry, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)