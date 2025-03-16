# Generated by Django 5.1.7 on 2025-03-16 02:12

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Authentication", "0007_transaction"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="transaction",
            name="amount",
        ),
        migrations.RemoveField(
            model_name="transaction",
            name="created_at",
        ),
        migrations.RemoveField(
            model_name="transaction",
            name="order_id",
        ),
        migrations.RemoveField(
            model_name="transaction",
            name="payment_id",
        ),
        migrations.RemoveField(
            model_name="transaction",
            name="signature",
        ),
        migrations.AddField(
            model_name="transaction",
            name="exchange",
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name="transaction",
            name="price",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=15),
        ),
        migrations.AddField(
            model_name="transaction",
            name="quantity",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="transaction",
            name="stock_name",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="transaction",
            name="stock_symbol",
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AddField(
            model_name="transaction",
            name="transaction_type",
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AddField(
            model_name="transaction",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="transactions",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
