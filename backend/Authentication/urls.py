from django.urls import path
from .views import *

app_name = "Authentication"

urlpatterns = [
    path("register/", register, name="register"),
    path("login/", login_view, name="login"),
    path("profile/", get_profile_view, name="get_profile_view"),
    path("stocks/buy/", BuyStockAPIView.as_view(), name="buy-stock"),
    path("stocks/sell/", SellStockAPIView.as_view(), name="sell-stock"),
    path("portfolio/", PortfolioAPIView.as_view(), name="get-portfolio"),
    path("favorites/", FavoriteListCreateView.as_view(), name="favorites"),
    path("get_transactions/", get_transactions, name="get-transactions"),
    path("transactions/", TransactionListCreateView, name="transactions"),
    path("upi/", UPIintegration, name="UPIintegration"),
    path('api/grid-trading/bot/', GridTradingBotAPIView.as_view(), name='grid-trading-bot'),
    path('get-report/', PortfolioExcelReportView.as_view(), name='get-report'),
    path('api/grid-trading/bot/<str:stock_symbol>/', GridTradingBotDetailAPIView.as_view(), name='grid-trading-bot-detail'),
]
