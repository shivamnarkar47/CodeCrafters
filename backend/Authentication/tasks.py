# tasks.py
import random
import json
from decimal import Decimal
from celery import shared_task
from django.utils import timezone
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import MarketPrice

@shared_task
def update_market_prices():
    # List of symbols to track
    symbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "NFLX"]
    benchmark_names = ["Nifty 50", "Nifty Bank", "Sensex", "Midcap 100", "Smallcap 100"]
    
    updated_prices = []
    
    for symbol in symbols:
        # Get the last price or create initial price
        last_price = MarketPrice.objects.filter(symbol=symbol).order_by('-timestamp').first()
        
        if last_price:
            # Update existing price with small random movement
            change_percent = random.uniform(-0.005, 0.005)  # -0.5% to +0.5%
            new_price = max(0.01, last_price.current_price * (1 + Decimal(str(change_percent))))
            
            # Ensure day_high and day_low are respected
            day_high = max(last_price.day_high, new_price)
            day_low = min(last_price.day_low, new_price)
            
            market_price = MarketPrice(
                symbol=symbol,
                current_price=new_price.quantize(Decimal('0.01')),
                open_price=last_price.open_price,
                day_high=day_high.quantize(Decimal('0.01')),
                day_low=day_low.quantize(Decimal('0.01')),
                close_price=last_price.close_price,
                buy_price=(new_price * Decimal('1.001')).quantize(Decimal('0.01')),  # +0.1%
                sell_price=(new_price * Decimal('0.999')).quantize(Decimal('0.01')),  # -0.1%
                benchmark_name=last_price.benchmark_name
            )
        else:
            # Create initial price
            base_price = Decimal(str(random.uniform(100, 3000)))
            market_price = MarketPrice(
                symbol=symbol,
                current_price=base_price.quantize(Decimal('0.01')),
                open_price=base_price.quantize(Decimal('0.01')),
                day_high=base_price.quantize(Decimal('0.01')),
                day_low=base_price.quantize(Decimal('0.01')),
                close_price=base_price.quantize(Decimal('0.01')),
                buy_price=(base_price * Decimal('1.001')).quantize(Decimal('0.01')),
                sell_price=(base_price * Decimal('0.999')).quantize(Decimal('0.01')),
                benchmark_name=random.choice(benchmark_names)
            )
        
        market_price.save()
        
        # Prepare data for websocket
        updated_prices.append({
            'symbol': market_price.symbol,
            'current_price': str(market_price.current_price),
            'open_price': str(market_price.open_price),
            'day_high': str(market_price.day_high),
            'day_low': str(market_price.day_low),
            'buy_price': str(market_price.buy_price),
            'sell_price': str(market_price.sell_price),
            'benchmark_name': market_price.benchmark_name,
            'timestamp': market_price.timestamp.isoformat()
        })
    
    # Broadcast updates via WebSockets
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'market_updates',
        {
            'type': 'market_update',
            'message': json.dumps(updated_prices)
        }
    )
    
    return f"Updated prices for {len(updated_prices)} symbols"