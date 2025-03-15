# routing.py
from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/market/', consumers.MarketUpdateConsumer.as_asgi()),
]