# Generated by Django 5.1.7 on 2025-03-15 13:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "Authentication",
            "0002_marketindex_portfolio_stockprice_stocktransaction_and_more",
        ),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="wallet",
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
