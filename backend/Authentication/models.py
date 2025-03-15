from django.db import models
import uuid
from django.utils import timezone
from .managers import CustomUserManager
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    unique_id = models.UUIDField(primary_key=True,default=uuid.uuid4, editable=False)
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

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        db_table = 'User'

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
