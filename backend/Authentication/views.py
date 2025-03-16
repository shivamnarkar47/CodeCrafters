from rest_framework.decorators import api_view, permission_classes, APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from .models import *
import json


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    # print(request.data)
    user_serializer = RegisterSerializer(data=request.data)
    if user_serializer.is_valid():
        user = user_serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {"refresh": str(refresh), "access": str(refresh.access_token)},
            status=status.HTTP_201_CREATED,
        )
    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login View
@api_view(["POST"])
@csrf_exempt
@permission_classes([AllowAny])
def login_view(request):
    if request.method == "POST":
        mutable_data = request.data
        email = mutable_data.get("email")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "User with this email does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        mutable_data["email"] = user.email
        serializer = LoginSerializer(data=mutable_data, context={"request": request})

        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            response = {"refresh": str(refresh), "access": str(refresh.access_token)}
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(
        {"message": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED
    )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_transactions(request):
    try:
        user_id = request.user.unique_id
        try:
            userprofile = User.objects.get(unique_id=user_id)
        except User.DoesNotExist:
            return Response(
                {"message": "User Profile does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        transactions = StockTransaction.objects.filter(user=userprofile)
        serializer = StockTransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except StockTransaction.DoesNotExist:
        return Response("No Transaction Found", status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile_view(request):
    try:
        user_id = request.user.unique_id
        try:
            userprofile = User.objects.get(unique_id=user_id)
        except User.DoesNotExist:
            return Response(
                {"message": "User Profile does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = UserSerializer(userprofile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response("No Profile Found", status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class BuyStockAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        stock_symbol = request.data.get("stock_symbol")
        stock_name = request.data.get("stock_name", "")
        exchange = request.data.get("exchange", "")
        quantity = request.data.get("quantity")
        price_per_share = request.data.get("price_per_share")
        brokerage_fee = request.data.get("brokerage_fee", 0)
        taxes = request.data.get("taxes", 0)
        other_charges = request.data.get("other_charges", 0)

        if not all([stock_symbol, quantity, price_per_share]):
            return Response(
                {"error": "stock_symbol, quantity, and price_per_share are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            quantity = int(quantity)
            price_per_share = Decimal(str(price_per_share))
            brokerage_fee = Decimal(str(brokerage_fee))
            taxes = Decimal(str(taxes))
            other_charges = Decimal(str(other_charges))

            from django.db import transaction

            with transaction.atomic():
                if quantity <= 0:
                    return Response(
                        {"error": "Quantity must be greater than zero"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if price_per_share <= 0:
                    return Response(
                        {"error": "Price per share must be greater than zero"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                total_amount = (
                    (quantity * price_per_share) + brokerage_fee + taxes + other_charges
                )
                user_wallet = request.user
                if user_wallet.wallet < total_amount:
                    return Response(
                        {"error": "You don't have enough money to buy!!"},
                        status=status.HTTP_406_NOT_ACCEPTABLE,
                    )
                transaction = StockTransaction(
                    transaction_id=uuid.uuid4(),
                    user=request.user,
                    stock_symbol=stock_symbol.upper(),
                    stock_name=stock_name,
                    exchange=exchange,
                    transaction_type="BUY",
                    quantity=quantity,
                    price_per_share=price_per_share,
                    total_amount=total_amount,
                    brokerage_fee=brokerage_fee,
                    taxes=taxes,
                    other_charges=other_charges,
                    status="EXECUTED",
                    execution_date=timezone.now(),
                )
                transaction.save()
                user_wallet.wallet -= total_amount
                user_wallet.save()
                portfolio = Portfolio.objects.get(user=request.user)
                position = StockPosition.objects.filter(
                    user=request.user, stock_symbol=stock_symbol.upper()
                ).first()

                return Response(
                    {
                        "message": "Stock purchase successful",
                        "transaction": StockTransactionSerializer(transaction).data,
                        "portfolio": {
                            "beta": portfolio.beta,
                            "total_value": str(portfolio.total_value),
                            "position": (
                                {
                                    "stock_symbol": position.stock_symbol,
                                    "quantity": position.quantity,
                                    "average_price": str(position.average_price),
                                }
                                if position
                                else None
                            ),
                        },
                    },
                    status=status.HTTP_201_CREATED,
                )

        except ValueError as e:
            return Response(
                {"error": f"Invalid value: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SellStockAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        stock_symbol = request.data.get("stock_symbol")
        quantity = request.data.get("quantity")
        price_per_share = request.data.get("price_per_share")
        brokerage_fee = request.data.get("brokerage_fee", 0)
        taxes = request.data.get("taxes", 0)
        other_charges = request.data.get("other_charges", 0)

        if not all([stock_symbol, quantity, price_per_share]):
            return Response(
                {"error": "stock_symbol, quantity, and price_per_share are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            stock_symbol = stock_symbol.upper()
            quantity = int(quantity)
            price_per_share = Decimal(str(price_per_share))
            brokerage_fee = Decimal(str(brokerage_fee))
            taxes = Decimal(str(taxes))
            other_charges = Decimal(str(other_charges))

            from django.db import transaction

            with transaction.atomic():
                if quantity <= 0:
                    return Response(
                        {"error": "Quantity must be greater than zero"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                if price_per_share <= 0:
                    return Response(
                        {"error": "Price per share must be greater than zero"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                position = StockPosition.objects.filter(
                    user=request.user, stock_symbol=stock_symbol
                ).first()

                if not position or position.quantity < quantity:
                    return Response(
                        {
                            "error": f"Insufficient shares. You have {position.quantity if position else 0} shares of {stock_symbol}."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                total_amount = (
                    (quantity * price_per_share) - brokerage_fee - taxes - other_charges
                )
                user_wallet = request.user
                transaction = StockTransaction(
                    transaction_id=uuid.uuid4(),
                    user=request.user,
                    stock_symbol=stock_symbol,
                    stock_name=position.stock_name,
                    transaction_type="SELL",
                    quantity=quantity,
                    price_per_share=price_per_share,
                    total_amount=total_amount,
                    brokerage_fee=brokerage_fee,
                    taxes=taxes,
                    other_charges=other_charges,
                    status="EXECUTED",
                    execution_date=timezone.now(),
                )
                transaction.save()
                user_wallet.wallet += total_amount
                user_wallet.save()

                portfolio = Portfolio.objects.get(user=request.user)
                position = StockPosition.objects.filter(
                    user=request.user, stock_symbol=stock_symbol
                ).first()

                return Response(
                    {
                        "message": "Stock sale successful",
                        "transaction": StockTransactionSerializer(transaction).data,
                        "portfolio": {
                            "beta": portfolio.beta,
                            "total_value": str(portfolio.total_value),
                            "position": (
                                {
                                    "stock_symbol": position.stock_symbol,
                                    "quantity": position.quantity,
                                    "average_price": str(position.average_price),
                                }
                                if position and position.quantity > 0
                                else None
                            ),
                        },
                    },
                    status=status.HTTP_201_CREATED,
                )
        except ValueError as e:
            return Response(
                {"error": f"Invalid value: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class PortfolioAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            portfolio, created = Portfolio.objects.get_or_create(user=request.user)
            if created or portfolio.last_updated < timezone.now() - timezone.timedelta(
                days=1
            ):
                portfolio.update_beta()

            positions = StockPosition.objects.filter(user=request.user, quantity__gt=0)

            return Response(
                {
                    "portfolio": {
                        "wallet_balance": request.user.wallet,
                        "beta": portfolio.beta,
                        "asset_value": str(portfolio.total_value),
                        "last_updated": portfolio.last_updated,
                    },
                    "positions": [
                        {
                            "stock_symbol": position.stock_symbol,
                            "stock_name": position.stock_name,
                            "quantity": position.quantity,
                            "average_price": str(position.average_price),
                            "current_value": str(
                                position.quantity * position.average_price
                            ),
                        }
                        for position in positions
                    ],
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
import uuid
import time
import threading
from django.utils import timezone
from django.db import transaction

class GridTradingAutobot:
    def __init__(self, user, stock_symbol, min_price, max_price, grid_count, investment, 
                 stock_name="", exchange="", brokerage_fee=0, taxes=0, other_charges=0):
        self.user = user
        self.stock_symbol = stock_symbol.upper()
        self.min_price = Decimal(str(min_price))
        self.max_price = Decimal(str(max_price))
        self.grid_count = int(grid_count)
        self.investment = Decimal(str(investment))
        self.stock_name = stock_name
        self.exchange = exchange
        self.brokerage_fee = Decimal(str(brokerage_fee))
        self.taxes = Decimal(str(taxes))
        self.other_charges = Decimal(str(other_charges))
        
        self.grid_size = (self.max_price - self.min_price) / self.grid_count
        self.shares_per_grid = self.investment / (self.grid_count * self.max_price)
        self.shares_per_grid = int(self.shares_per_grid)
        
        self.is_running = False
        self.thread = None
        self.grid_levels = []
        self.buy_orders = []
        self.sell_orders = []
        
    def setup_grid(self):
        self.grid_levels = []
        for i in range(self.grid_count + 1):
            price = self.min_price + (i * self.grid_size)
            self.grid_levels.append(price)
            
        self.buy_orders = self.grid_levels[:-1]
        
        self.sell_orders = []
        
    def get_current_price(self):
        try:
            # Get the latest price from the database
            latest_price = MarketPrice.objects.filter(
                symbol=self.stock_symbol
            ).order_by('-timestamp').first()
            
            if latest_price:
                return latest_price.current_price
        except Exception as e:
            print(f"Error fetching price: {str(e)}")

    
    def execute_buy(self, price):
        quantity = self.shares_per_grid
        total_amount = (quantity * price) + self.brokerage_fee + self.taxes + self.other_charges
        
        if self.user.wallet < total_amount:
            return False, "Insufficient funds"
        
        with transaction.atomic():
            transaction_obj = StockTransaction(
                transaction_id=uuid.uuid4(),
                user=self.user,
                stock_symbol=self.stock_symbol,
                stock_name=self.stock_name,
                exchange=self.exchange,
                transaction_type="BUY",
                quantity=quantity,
                price_per_share=price,
                total_amount=total_amount,
                brokerage_fee=self.brokerage_fee,
                taxes=self.taxes,
                other_charges=self.other_charges,
                status="EXECUTED",
                execution_date=timezone.now(),
            )
            transaction_obj.save()
            
            self.user.wallet -= total_amount
            self.user.save()
            
            next_grid_price = price + self.grid_size
            if next_grid_price <= self.max_price:
                self.sell_orders.append(next_grid_price)
            
        return True, transaction_obj
    
    def execute_sell(self, price):
        quantity = self.shares_per_grid
        
        position = StockPosition.objects.filter(
            user=self.user, stock_symbol=self.stock_symbol
        ).first()
        
        if not position or position.quantity < quantity:
            return False, "Insufficient shares"
        
        total_amount = (quantity * price) - self.brokerage_fee - self.taxes - self.other_charges
        
        with transaction.atomic():
            transaction_obj = StockTransaction(
                transaction_id=uuid.uuid4(),
                user=self.user,
                stock_symbol=self.stock_symbol,
                stock_name=position.stock_name,
                exchange=self.exchange,
                transaction_type="SELL",
                quantity=quantity,
                price_per_share=price,
                total_amount=total_amount,
                brokerage_fee=self.brokerage_fee,
                taxes=self.taxes,
                other_charges=self.other_charges,
                status="EXECUTED",
                execution_date=timezone.now(),
            )
            transaction_obj.save()
            
            self.user.wallet += total_amount
            self.user.save()
            
            prev_grid_price = price - self.grid_size
            if prev_grid_price >= self.min_price:
                self.buy_orders.append(prev_grid_price)
            
        return True, transaction_obj
    
    def run(self):
        self.is_running = True
        while self.is_running:
            try:
                current_price = self.get_current_price()
                
                buy_orders_to_execute = [price for price in self.buy_orders if current_price <= price]
                for price in buy_orders_to_execute:
                    success, result = self.execute_buy(price)
                    if success:
                        self.buy_orders.remove(price)
                
                sell_orders_to_execute = [price for price in self.sell_orders if current_price >= price]
                for price in sell_orders_to_execute:
                    success, result = self.execute_sell(price)
                    if success:
                        self.sell_orders.remove(price)
                
                time.sleep(30) 
                
            except Exception as e:
                print(f"Error in grid trading bot: {str(e)}")
                time.sleep(60) 
    
    def start(self):
        if not self.is_running:
            self.setup_grid()
            self.thread = threading.Thread(target=self.run)
            self.thread.daemon = True
            self.thread.start()
            return True
        return False
    
    def stop(self):
        if self.is_running:
            self.is_running = False
            if self.thread:
                self.thread.join(timeout=2)
            return True
        return False
    
    def get_status(self):
        return {
            "is_running": self.is_running,
            "stock_symbol": self.stock_symbol,
            "min_price": str(self.min_price),
            "max_price": str(self.max_price),
            "grid_count": self.grid_count,
            "investment": str(self.investment),
            "grid_size": str(self.grid_size),
            "shares_per_grid": self.shares_per_grid,
            "buy_orders": [str(price) for price in self.buy_orders],
            "sell_orders": [str(price) for price in self.sell_orders]
        }

active_bots = {}


class GridTradingBotAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Create and start a new grid trading bot"""
        stock_symbol = request.data.get("stock_symbol")
        min_price = request.data.get("min_price")
        max_price = request.data.get("max_price")
        grid_count = request.data.get("grid_count")
        investment = request.data.get("investment")
        stock_name = request.data.get("stock_name", "")
        exchange = request.data.get("exchange", "")
        brokerage_fee = request.data.get("brokerage_fee", 0)
        taxes = request.data.get("taxes", 0)
        other_charges = request.data.get("other_charges", 0)
        
        if not all([stock_symbol, min_price, max_price, grid_count, investment]):
            return Response(
                {"error": "stock_symbol, min_price, max_price, grid_count, and investment are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            min_price = Decimal(str(min_price))
            max_price = Decimal(str(max_price))
            grid_count = int(grid_count)
            investment = Decimal(str(investment))
            
            if min_price >= max_price:
                return Response(
                    {"error": "min_price must be less than max_price"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            if grid_count <= 0:
                return Response(
                    {"error": "grid_count must be greater than zero"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            if investment <= 0:
                return Response(
                    {"error": "investment must be greater than zero"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if request.user.wallet < investment:
                return Response(
                    {"error": "Insufficient funds for the investment amount"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            bot_key = f"{request.user.unique_id}_{stock_symbol}"
            
            if bot_key in active_bots:
                active_bots[bot_key].stop()
            
            bot = GridTradingAutobot(
                user=request.user,
                stock_symbol=stock_symbol,
                min_price=min_price,
                max_price=max_price,
                grid_count=grid_count,
                investment=investment,
                stock_name=stock_name,
                exchange=exchange,
                brokerage_fee=brokerage_fee,
                taxes=taxes,
                other_charges=other_charges
            )
            
            success = bot.start()
            if success:
                active_bots[bot_key] = bot
                return Response(
                    {
                        "message": "Grid trading bot started successfully",
                        "status": bot.get_status()
                    },
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {"error": "Failed to start the grid trading bot"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except ValueError as e:
            return Response(
                {"error": f"Invalid value: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get(self, request):
        user_bots = {}
        for key, bot in active_bots.items():
            if key.startswith(f"{request.user.unique_id}_"):
                user_bots[bot.stock_symbol] = bot.get_status()
        
        return Response(
            {"active_bots": user_bots},
            status=status.HTTP_200_OK
        )


class GridTradingBotDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, stock_symbol):
        bot_key = f"{request.user.unique_id}_{stock_symbol.upper()}"
        if bot_key in active_bots:
            return Response(
                active_bots[bot_key].get_status(),
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": f"No active bot found for {stock_symbol}"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def delete(self, request, stock_symbol):
        bot_key = f"{request.user.unique_id}_{stock_symbol.upper()}"
        if bot_key in active_bots:
            success = active_bots[bot_key].stop()
            if success:
                del active_bots[bot_key]
                return Response(
                    {"message": f"Grid trading bot for {stock_symbol} stopped successfully"},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": f"Failed to stop the grid trading bot for {stock_symbol}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(
                {"error": f"No active bot found for {stock_symbol}"},
                status=status.HTTP_404_NOT_FOUND
            )
        
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Favorite, StockPosition
from .serializers import FavoriteSerializer

class FavoriteListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def delete(self, request, *args, **kwargs):
        stock_symbol = request.data.get("stock_symbol")
        favorite = Favorite.objects.get(user=request.user,stock_symbol=stock_symbol)
        favorite.delete()
        return Response({"message": "Removed from Favorite."}, status=status.HTTP_200_OK)
    
    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)

    def post(self, request):
        stock_symbol = request.data.get("stock_symbol")
        stock_name = request.data.get("stock_name", "")
        exchange = request.data.get("exchange", "")
        high_24h = request.data.get("high_24h", None)
        low_24h = request.data.get("low_24h", None)

        if not stock_symbol:
            return Response({"error": "Stock symbol is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure stock is not already favorited
        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            stock_symbol=stock_symbol,
            defaults={
                "stock_name": stock_name,
                "exchange": exchange,
                "high_24h": high_24h,
                "low_24h": low_24h,
            }
        )

        if not created:
            return Response({"message": "Stock is already in favorites."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = FavoriteSerializer(favorite)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MarketPriceAPIView(APIView):
    def get(self, request, symbol=None):
        if symbol:
            # Get latest price for a specific symbol
            price = MarketPrice.objects.filter(symbol=symbol.upper()).order_by('-timestamp').first()
            if price:
                return Response(MarketPriceSerializer(price).data)
            return Response({"error": "Symbol not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Get latest prices for all symbols
            symbols = MarketPrice.objects.values('symbol').distinct()
            latest_prices = []
            
            for item in symbols:
                symbol = item['symbol']
                price = MarketPrice.objects.filter(symbol=symbol).order_by('-timestamp').first()
                if price:
                    latest_prices.append(MarketPriceSerializer(price).data)
                    
            return Response(latest_prices)

@api_view(["POST"])
def UPIintegration(request):
    try:
        transaction_serializer = RazorPaySerializer(data=request.data)
        if transaction_serializer.is_valid():
            rz_client.verify_payment(
                payment_id=transaction_serializer.validated_data["payment_id"],
                order_id=transaction_serializer.validated_data["order_id"],
                signature=transaction_serializer.validated_data["signature"],
            )
            transaction_serializer.save()
            response = {
                "status_code": status.HTTP_201_CREATED,
                "message": "Transaction Created Successfully",
                "data": transaction_serializer.data,
            }
            return Response(response, status=status.HTTP_201_CREATED)
        else:
            return Response(
                transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        return Response(e, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_wallet(request):
    try:
        wallet = request.user.wallet
        return Response({"wallet": wallet}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_wallet(request):
    try:
        amount = request.data.get("amount")
        if not amount:
            return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        amount = Decimal(str(amount))
        if amount <= 0:
            return Response({"error": "Amount must be greater than zero"}, status=status.HTTP_400_BAD_REQUEST)
        
        request.user.wallet += amount
        request.user.save()
        
        return Response({"message": "Amount added to wallet successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

    
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import pandas as pd
import matplotlib.pyplot as plt
import io
import numpy as np
from datetime import datetime, timedelta
from xlsxwriter.utility import xl_rowcol_to_cell
from django.db.models import Sum, F, Value, DecimalField
from django.db.models.functions import Coalesce

from .models import (
    User, Portfolio, StockPosition, StockPrice, 
    StockTransaction, MarketIndex, MarketPrice
)


import io
import pandas as pd
import datetime
from datetime import timedelta
from django.http import HttpResponse
from django.utils.timezone import now
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from xlsxwriter.utility import xl_col_to_name
from .models import Portfolio, StockPosition, StockPrice, StockTransaction  # Update with actual app name

class PortfolioExcelReportView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        output = io.BytesIO()
        writer = pd.ExcelWriter(output, engine='xlsxwriter')
        workbook = writer.book
        
        header_format = workbook.add_format({'bold': True, 'text_wrap': True, 'valign': 'top', 'bg_color': '#D9E1F2', 'border': 1})
        money_format = workbook.add_format({'num_format': '#,##0.00'})
        percent_format = workbook.add_format({'num_format': '0.00%'})
        date_format = workbook.add_format({'num_format': 'yyyy-mm-dd'})
        
        self._create_portfolio_summary(user, writer, workbook, header_format, money_format, percent_format)
        self._create_stock_positions(user, writer, workbook, header_format, money_format, percent_format)
        self._create_transaction_history(user, writer, workbook, header_format, money_format, date_format)
        self._create_performance_charts(user, writer, workbook, header_format, money_format, percent_format)
        
        writer.close()
        output.seek(0)
        filename = f"Portfolio_Report_{user.email}_{now().strftime('%Y%m%d')}.xlsx"
        
        response = HttpResponse(output, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
    
    def _create_portfolio_summary(self, user, writer, workbook, header_format, money_format, percent_format):
        portfolio, _ = Portfolio.objects.get_or_create(user=user)
        positions = StockPosition.objects.filter(user=user, quantity__gt=0)
        total_invested = sum(pos.quantity * pos.average_price for pos in positions)
        position_values = []
        for position in positions:
            latest_price = StockPrice.objects.filter(stock_symbol=position.stock_symbol).order_by('-date').first()
            current_price = latest_price.closing_price if latest_price else position.average_price
            position_values.append(position.quantity * current_price)
        total_current_value = sum(position_values)
        gain_loss = total_current_value - total_invested
        gain_loss_percent = (gain_loss / total_invested) if total_invested > 0 else 0
        summary_data = {'Metric': ['Total Portfolio Value', 'Total Invested', 'Unrealized Gain/Loss', 'Gain/Loss Percentage', 'Portfolio Beta'],
                        'Value': [total_current_value, total_invested, gain_loss, gain_loss_percent, portfolio.beta]}
        df_summary = pd.DataFrame(summary_data)
        sheet_name = 'Portfolio Summary'
        
        df_summary.to_excel(writer, sheet_name=sheet_name, index=False)
        worksheet = writer.sheets[sheet_name]
        worksheet.set_column('A:A', 25)
        worksheet.set_column('B:B', 15, money_format)
        worksheet.write(3, 1, gain_loss_percent, percent_format)
        
    def _create_stock_positions(self, user, writer, workbook, header_format, money_format, percent_format):
        positions = StockPosition.objects.filter(user=user, quantity__gt=0)
        position_data = []
        for position in positions:
            latest_price = StockPrice.objects.filter(stock_symbol=position.stock_symbol).order_by('-date').first()
            current_price = latest_price.closing_price if latest_price else position.average_price
            current_value = position.quantity * current_price
            cost_basis = position.quantity * position.average_price
            gain_loss = current_value - cost_basis
            gain_loss_percent = (gain_loss / cost_basis) if cost_basis > 0 else 0
            position_data.append({'Symbol': position.stock_symbol, 'Name': position.stock_name, 'Quantity': position.quantity,
                                  'Average Cost': float(position.average_price), 'Current Price': float(current_price),
                                  'Current Value': float(current_value), 'Cost Basis': float(cost_basis),
                                  'Gain/Loss': float(gain_loss), 'Gain/Loss %': gain_loss_percent, 'Beta': position.calculate_beta()})
        df_positions = pd.DataFrame(position_data) if position_data else pd.DataFrame(
            columns=['Symbol', 'Name', 'Quantity', 'Average Cost', 'Current Price', 'Current Value', 'Cost Basis', 'Gain/Loss', 'Gain/Loss %', 'Beta'])
        sheet_name = 'Stock Positions'
        df_positions.to_excel(writer, sheet_name=sheet_name, index=False)
        worksheet = writer.sheets[sheet_name]
        worksheet.set_column('A:A', 8)
        worksheet.set_column('B:B', 20)
        worksheet.set_column('C:C', 10)
        worksheet.set_column('D:J', 12)
        
    def _create_transaction_history(self, user, writer, workbook, header_format, money_format, date_format):
        transactions = StockTransaction.objects.filter(user=user).order_by('-order_date')

        transaction_data = []
        for txn in transactions:
            txn_date = txn.execution_date if txn.execution_date else txn.order_date
            transaction_data.append({
                'Date': txn_date.date() if txn_date else None,  # Extract only the date
                'Time': txn_date.time() if txn_date else None,  # Extract only the time
                'Symbol': txn.stock_symbol,
                'Type': txn.transaction_type,
                'Quantity': txn.quantity,
                'Price': float(txn.price_per_share),
                'Total Amount': float(txn.total_amount),
                'Status': txn.status,
                'Fees': float(txn.brokerage_fee + txn.taxes + txn.other_charges)
            })

        df_transactions = pd.DataFrame(transaction_data) if transaction_data else pd.DataFrame(
            columns=['Date', 'Time', 'Symbol', 'Type', 'Quantity', 'Price', 'Total Amount', 'Status', 'Fees'])

        # Write to Excel
        sheet_name = 'Transaction History'
        df_transactions.to_excel(writer, sheet_name=sheet_name, index=False)

        # Get the worksheet object
        worksheet = writer.sheets[sheet_name]

        # Set column widths
        worksheet.set_column('A:A', 12, date_format)  # Date
        worksheet.set_column('B:B', 12)  # Time
        worksheet.set_column('C:C', 8)  # Symbol
        worksheet.set_column('D:D', 8)  # Type
        worksheet.set_column('E:E', 10)  # Quantity
        worksheet.set_column('F:H', 12, money_format)  # Price, Total Amount, Fees

        # Apply header format
        for col_num, value in enumerate(df_transactions.columns.values):
            worksheet.write(0, col_num, value, header_format)

        
    def _create_performance_charts(self, user, writer, workbook, header_format, money_format, percent_format):
        sheet_name = 'Performance'
        worksheet = workbook.add_worksheet(sheet_name)
        transactions = StockTransaction.objects.filter(user=user, status='EXECUTED').order_by('execution_date')
        if not transactions.exists():
            worksheet.write('A1', 'No performance data available', header_format)
            return
        
        # Format dates as strings in a consistent format
        formatted_dates = ['Date']
        for txn in transactions:
            formatted_dates.append(txn.execution_date.date().strftime('%Y-%m-%d'))
        
        values = ['Portfolio Value']
        for txn in transactions:
            values.append(txn.quantity * txn.price_per_share)
        
        worksheet.write_column('A1', formatted_dates)
        worksheet.write_column('B1', values)
        
        chart = workbook.add_chart({'type': 'line'})
        chart.add_series({
            'name': 'Portfolio Value',
            'categories': f'={sheet_name}!$A$2:$A${len(formatted_dates) - 1 + 1}',
            'values': f'={sheet_name}!$B$2:$B${len(values) - 1 + 1}',
            'line': {'color': 'blue'}
        })
        
        chart.set_title({'name': 'Portfolio Performance Over Time'})
        chart.set_x_axis({'name': 'Date'})
        chart.set_y_axis({'name': 'Portfolio Value', 'num_format': '$#,##0.00'})
        worksheet.insert_chart('D2', chart)
        
        worksheet.set_column('A:A', 15, header_format)
        worksheet.set_column('B:B', 20, money_format)