from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from .models import *
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    user_serializer = RegisterSerializer(data=request.data)
    if user_serializer.is_valid():
        user = user_serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)
    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login View
@api_view(['POST'])
@csrf_exempt
@permission_classes([AllowAny])
def login_view(request):
    if request.method == 'POST':
        mutable_data = request.data
        unique_id = mutable_data.get('unique_id')
        try:
            user = User.objects.get(unique_id=unique_id)
        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        mutable_data['email'] = user.email
        serializer = LoginSerializer(data=mutable_data, context={'request': request})

        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            response = {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile_view(request):
    try :
        user_id = request.user.unique_id
        try:
            userprofile = User.objects.get(unique_id=user_id)
        except User.DoesNotExist:
            return Response({'message': 'User Profile does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(userprofile)
        return Response(serializer.data,status=status.HTTP_200_OK)
    except User.DoesNotExist :
        return Response('No Profile Found', status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)