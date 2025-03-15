from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import authenticate
from .models import *


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "first_name",
            "last_name",
            "phone_no",
            "profile_pic",
            "bank_name",
            "pan_no",
            "age",
            "gender",
            "dob",
            "address",
        ]

    def create(self, validated_data):
        email = validated_data.get("email")
        password = validated_data.get("password")
        phone_no = validated_data.get("phone_no")
        first_name = validated_data.get("first_name")
        last_name = validated_data.get("last_name")
        bank_name = validated_data.get("bank_name")
        pan_no = validated_data.get("pan_no")
        age = validated_data.get("age")
        dob = validated_data.get("dob")
        gender = validated_data.get("gender")
        address = validated_data.get("address")
        profile_pic = validated_data.get("profile_pic")
        if not email:
            raise ValueError(_("The Email must be set"))
        User = get_user_model()
        user = User(
            email=email,
            username=email,
            first_name=first_name,
            last_name=last_name,
            phone_no=phone_no,
            bank_name=bank_name,
            pan_no=pan_no,
            age=age,
            dob=dob,
            gender=gender,
            address=address,
            profile_pic=profile_pic,
        )
        user.set_password(password)
        user.is_active = True
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")
        if email and password:
            user = authenticate(
                request=self.context.get("request"), email=email, password=password
            )
            if user is not None:
                if user.is_active:
                    return user
                else:
                    raise ValidationError("User account is not active.")
            else:
                raise ValidationError("Invalid credentials. Please try again.")
        raise ValidationError("Both email and password are required.")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "full_name",
            "email",
            "phone_no",
            "profile_pic",
            "age",
            "gender",
            "dob",
            "address",
            "bank_name",
            "bank_acc_no",
            "pan_no",
            "trading_acc_no",
            "dp_name",
            "depository_name",
            "dp_id",
            "dp_acc_no",
            "poa",
        ]


class StockTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockTransaction
        fields = [
            "transaction_id",
            "stock_symbol",
            "stock_name",
            "transaction_type",
            "quantity",
            "price_per_share",
            "total_amount",
            "status",
            "order_date",
            "execution_date",
            "brokerage_fee",
            "taxes",
            "other_charges",
        ]


class StockPositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockPosition
        fields = ["stock_symbol", "stock_name", "quantity", "average_price"]


class PortfolioSerializer(serializers.ModelSerializer):
    positions = StockPositionSerializer(
        many=True, read_only=True, source="user.stock_positions"
    )

    class Meta:
        model = Portfolio
        fields = ["beta", "total_value", "last_updated", "positions"]

class StockTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockTransaction
        fields = "__all__"

class FavoriteSerializer(serializers.ModelSerializer):
    stock_symbol = serializers.CharField(source="stock.stock_symbol", read_only=True)
    stock_name = serializers.CharField(source="stock.stock_name", read_only=True)

    class Meta:
        model = Favorite
        fields = ["id", "stock_symbol", "stock_name", "added_on"]
