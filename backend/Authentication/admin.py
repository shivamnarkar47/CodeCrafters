from django.contrib import admin
from .models import *

admin.site.register(User)
admin.site.register(MarketIndex)
admin.site.register(StockPrice)
admin.site.register(Portfolio)
admin.site.register(StockTransaction)
# admin.site.register(MarketIndex)
admin.site.register(MarketPrice)
