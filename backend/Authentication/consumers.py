# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MarketUpdateConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            'market_updates',
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            'market_updates',
            self.channel_name
        )

    async def market_update(self, event):
        message = event['message']
        await self.send(text_data=message)