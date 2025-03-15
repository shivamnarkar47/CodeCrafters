from django.urls import path
from .views import *

app_name = 'Authentication'

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('profile/', get_profile_view, name='get_profile_view'),
]
