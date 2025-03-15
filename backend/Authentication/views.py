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
    print(request.data)
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
        unique_id = mutable_data.get("unique_id")
        try:
            user = User.objects.get(unique_id=unique_id)
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
