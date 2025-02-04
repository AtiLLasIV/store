from django.contrib import admin

from .models import Category, Product, Cart, InCartProduct

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(InCartProduct)
