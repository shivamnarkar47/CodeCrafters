from django.db import models
from django.utils import timezone
import uuid
from .managers import CustomUserManager
from django.contrib.auth.models import AbstractUser
from django.db.models import Sum, F, Avg
from django.db.models.functions import Cast
import numpy as np
from decimal import Decimal


class User(AbstractUser):
    unique_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=255, blank=True, null=True)
    full_name = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    phone_no = models.CharField(max_length=10, blank=True, null=True)
    profile_pic = models.TextField(blank=True, null=True)
    age = models.IntegerField(default=0, blank=True, null=True)
    gender = models.CharField(max_length=255, blank=True, null=True)
    dob = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    bank_name = models.TextField(blank=True, null=True)
    bank_acc_no = models.TextField(blank=True, null=True)
    pan_no = models.CharField(max_length=255, blank=True, null=True)
    trading_acc_no = models.TextField(blank=True, null=True)
    dp_name = models.CharField(max_length=255, blank=True, null=True)
    depository_name = models.CharField(max_length=255, blank=True, null=True)
    dp_id = models.CharField(max_length=255, blank=True, null=True)
    dp_acc_no = models.CharField(max_length=255, blank=True, null=True)
    poa = models.TextField(blank=True, null=True)
    wallet = models.IntegerField(default=0, null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        db_table = "User"

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class MarketIndex(models.Model):
    date = models.DateField(unique=True)
    value = models.DecimalField(max_digits=14, decimal_places=2)
    percent_change = models.DecimalField(
        max_digits=10, decimal_places=4, null=True, blank=True
    )

    def save(self, *args, **kwargs):
        if not self.percent_change:
            try:
                previous = (
                    MarketIndex.objects.filter(date__lt=self.date)
                    .order_by("-date")
                    .first()
                )
                if previous:
                    self.percent_change = (
                        (self.value - previous.value) / previous.value
                    ) * 100
            except Exception:
                pass
        super().save(*args, **kwargs)

    class Meta:
        db_table = "MarketIndex"
        ordering = ["-date"]


class StockPrice(models.Model):
    stock_symbol = models.CharField(max_length=20)
    date = models.DateField()
    closing_price = models.DecimalField(max_digits=14, decimal_places=2)
    percent_change = models.DecimalField(
        max_digits=10, decimal_places=4, null=True, blank=True
    )

    def save(self, *args, **kwargs):
        if not self.percent_change:
            try:
                previous = (
                    StockPrice.objects.filter(
                        stock_symbol=self.stock_symbol, date__lt=self.date
                    )
                    .order_by("-date")
                    .first()
                )
                if previous:
                    self.percent_change = (
                        (self.closing_price - previous.closing_price)
                        / previous.closing_price
                    ) * 100
            except Exception:
                pass
        super().save(*args, **kwargs)

    class Meta:
        db_table = "StockPrice"
        unique_together = ("stock_symbol", "date")
        ordering = ["-date"]


class Portfolio(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="portfolio")
    total_value = models.DecimalField(max_digits=14, decimal_places=2, default=0.00)
    beta = models.FloatField(default=1.0)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email}'s Portfolio - Beta: {self.beta}"

    def update_beta(self):
        positions = StockPosition.objects.filter(user=self.user, quantity__gt=0)

        if not positions.exists():
            self.beta = 1.0
            self.save()
            return

        total_value = 0
        weighted_beta_sum = 0

        for position in positions:
            latest_price = (
                StockPrice.objects.filter(stock_symbol=position.stock_symbol)
                .order_by("-date")
                .first()
            )
            if not latest_price:
                current_price = position.average_price
            else:
                current_price = latest_price.closing_price

            position_value = Decimal(position.quantity) * current_price

            position_beta = position.calculate_beta()

            weighted_beta = float(position_value) * position_beta

            total_value += position_value
            weighted_beta_sum += weighted_beta

        self.beta = weighted_beta_sum / float(total_value)

        self.total_value = total_value
        self.save()

    class Meta:
        db_table = "Portfolio"

class StockPosition(models.Model):
    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="stock_positions"
    )
    stock_symbol = models.CharField(max_length=20)
    stock_name = models.CharField(max_length=255, blank=True, null=True)
    quantity = models.PositiveIntegerField(default=0)
    average_price = models.DecimalField(max_digits=10, decimal_places=2)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.stock_symbol}: {self.quantity} shares"

    def calculate_beta(self, lookback_days=252):
        stock_changes = list(
            StockPrice.objects.filter(stock_symbol=self.stock_symbol)
            .order_by("-date")[:lookback_days]
            .values_list("percent_change", flat=True)
        )

        market_changes = list(
            MarketIndex.objects.all()
            .order_by("-date")[:lookback_days]
            .values_list("percent_change", flat=True)
        )

        min_length = min(len(stock_changes), len(market_changes))
        if min_length < 30:
            return 1.0
        stock_changes = stock_changes[:min_length]
        market_changes = market_changes[:min_length]

        stock_array = np.array([float(x or 0) for x in stock_changes])
        market_array = np.array([float(x or 0) for x in market_changes])

        covariance = np.cov(stock_array, market_array)[0, 1]
        market_variance = np.var(market_array)

        if market_variance == 0:
            return 1.0

        beta = covariance / market_variance
        return beta

    class Meta:
        db_table = "StockPosition"
        unique_together = ("user", "stock_symbol")

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    stock_symbol = models.CharField(max_length=255, blank=True, null=True)
    stock_name = models.CharField(max_length=255, blank=True, null=True)
    exchange = models.CharField(max_length=255, blank=True, null=True)
    high_24h = models.IntegerField(default=0, null=True, blank=True)
    low_24h = models.IntegerField(default=0, null=True, blank=True)
    added_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.stock_symbol}"

    class Meta:
        db_table = "Favorite"
        # unique_together = ("user", "stock_symbol")

class Transaction(models.Model):
    payment_id = models.CharField(max_length=200, verbose_name="Payment ID")
    order_id = models.CharField(max_length=200, verbose_name="Order ID")
    signature = models.CharField(
        max_length=500, verbose_name="Signature", blank=True, null=True
    )
    amount = models.IntegerField(verbose_name="Amount")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)

class StockTransaction(models.Model):
    TRANSACTION_TYPES = (
        ("BUY", "Buy"),
        ("SELL", "Sell"),
    )

    ORDER_STATUS = (
        ("PENDING", "Pending"),
        ("EXECUTED", "Executed"),
        ("CANCELED", "Canceled"),
        ("PARTIALLY_EXECUTED", "Partially Executed"),
    )

    transaction_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="stock_transactions"
    )

    stock_symbol = models.CharField(max_length=20)
    stock_name = models.CharField(max_length=255, blank=True, null=True)
    exchange = models.CharField(max_length=50, blank=True, null=True)

    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    quantity = models.PositiveIntegerField()
    price_per_share = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=14, decimal_places=2)

    order_date = models.DateTimeField(default=timezone.now)
    execution_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default="PENDING")

    brokerage_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    taxes = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    other_charges = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    order_id = models.CharField(max_length=100, null=True, blank=True)
    broker_reference = models.CharField(max_length=100, null=True, blank=True)

    notes = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.transaction_type} {self.quantity} {self.stock_symbol} @ {self.price_per_share}"

    def save(self, *args, **kwargs):
        if not self.total_amount:
            self.total_amount = self.quantity * self.price_per_share

        is_new = self.pk is None

        super().save(*args, **kwargs)

        if self.status == "EXECUTED":
            self.update_portfolio()

            if is_new and self.execution_date:
                price_date = self.execution_date.date()
            else:
                price_date = timezone.now().date()

            existing_price = StockPrice.objects.filter(
                stock_symbol=self.stock_symbol, date=price_date
            ).first()

            if not existing_price:
                StockPrice.objects.create(
                    stock_symbol=self.stock_symbol,
                    date=price_date,
                    closing_price=self.price_per_share,
                )

    def update_portfolio(self):
        portfolio, created = Portfolio.objects.get_or_create(user=self.user)

        position, created = StockPosition.objects.get_or_create(
            user=self.user,
            stock_symbol=self.stock_symbol,
            defaults={
                "stock_name": self.stock_name,
                "quantity": 0,
                "average_price": 0,
            },
        )
        if self.transaction_type == "BUY":
            total_cost = (
                position.quantity * position.average_price
            ) + self.total_amount
            new_quantity = position.quantity + self.quantity
            if new_quantity > 0:
                position.average_price = total_cost / new_quantity
            position.quantity = new_quantity
        elif self.transaction_type == "SELL":
            position.quantity = max(0, position.quantity - self.quantity)
        position.save()
        portfolio.update_beta()

    class Meta:
        db_table = "StockTransaction"
        ordering = ["-order_date"]

class MarketPrice(models.Model):
    symbol = models.CharField(max_length=20, db_index=True)
    current_price = models.DecimalField(max_digits=12, decimal_places=2)
    open_price = models.DecimalField(max_digits=12, decimal_places=2)
    day_high = models.DecimalField(max_digits=12, decimal_places=2)
    day_low = models.DecimalField(max_digits=12, decimal_places=2)
    close_price = models.DecimalField(max_digits=12, decimal_places=2)
    buy_price = models.DecimalField(max_digits=12, decimal_places=2)
    sell_price = models.DecimalField(max_digits=12, decimal_places=2)
    benchmark_name = models.CharField(max_length=50, null=True, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        indexes = [
            models.Index(fields=['symbol', 'timestamp']),
        ]

    def __str__(self):
        return f"{self.symbol} - {self.current_price} ({self.timestamp})"
