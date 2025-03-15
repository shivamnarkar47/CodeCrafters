# Generated by Django 5.1.7 on 2025-03-15 12:45

import django.db.models.deletion
import django.utils.timezone
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Authentication', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='MarketIndex',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(unique=True)),
                ('value', models.DecimalField(decimal_places=2, max_digits=14)),
                ('percent_change', models.DecimalField(blank=True, decimal_places=4, max_digits=10, null=True)),
            ],
            options={
                'db_table': 'MarketIndex',
                'ordering': ['-date'],
            },
        ),
        migrations.CreateModel(
            name='Portfolio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_value', models.DecimalField(decimal_places=2, default=0.0, max_digits=14)),
                ('beta', models.FloatField(default=1.0)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='portfolio', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'Portfolio',
            },
        ),
        migrations.CreateModel(
            name='StockPrice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('stock_symbol', models.CharField(max_length=20)),
                ('date', models.DateField()),
                ('closing_price', models.DecimalField(decimal_places=2, max_digits=14)),
                ('percent_change', models.DecimalField(blank=True, decimal_places=4, max_digits=10, null=True)),
            ],
            options={
                'db_table': 'StockPrice',
                'ordering': ['-date'],
                'unique_together': {('stock_symbol', 'date')},
            },
        ),
        migrations.CreateModel(
            name='StockTransaction',
            fields=[
                ('transaction_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('stock_symbol', models.CharField(max_length=20)),
                ('stock_name', models.CharField(blank=True, max_length=255, null=True)),
                ('exchange', models.CharField(blank=True, max_length=50, null=True)),
                ('transaction_type', models.CharField(choices=[('BUY', 'Buy'), ('SELL', 'Sell')], max_length=10)),
                ('quantity', models.PositiveIntegerField()),
                ('price_per_share', models.DecimalField(decimal_places=2, max_digits=10)),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=14)),
                ('order_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('execution_date', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('EXECUTED', 'Executed'), ('CANCELED', 'Canceled'), ('PARTIALLY_EXECUTED', 'Partially Executed')], default='PENDING', max_length=20)),
                ('brokerage_fee', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('taxes', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('other_charges', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('order_id', models.CharField(blank=True, max_length=100, null=True)),
                ('broker_reference', models.CharField(blank=True, max_length=100, null=True)),
                ('notes', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stock_transactions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'StockTransaction',
                'ordering': ['-order_date'],
            },
        ),
        migrations.CreateModel(
            name='StockPosition',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('stock_symbol', models.CharField(max_length=20)),
                ('stock_name', models.CharField(blank=True, max_length=255, null=True)),
                ('quantity', models.PositiveIntegerField(default=0)),
                ('average_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stock_positions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'StockPosition',
                'unique_together': {('user', 'stock_symbol')},
            },
        ),
    ]
