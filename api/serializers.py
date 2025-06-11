from rest_framework import serializers
from .models import User, Project, Entry

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
    

class RegisterSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'password_confirmation']

    def validate(self, data):
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError("Passwords do not mach")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirmation')
        password = validated_data.pop('password')
        user = User(username=validated_data.pop('username'))
        user.set_password(password)
        user.save()
        return user
    

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'color']

    def create(self, validated_data):
        user = self.context['request'].user
        return Project.objects.create(user=user, **validated_data)
    

class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = '__all__'