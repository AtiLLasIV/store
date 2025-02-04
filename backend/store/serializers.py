from rest_framework import serializers
from .models import Category, Product, Cart, InCartProduct


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()

    class Meta:
        model = Product
        fields = '__all__'


class InCartProductSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    cart = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all())

    class Meta:
        model = InCartProduct
        fields = '__all__'


class CartSerializer(serializers.ModelSerializer):
    incart_products = InCartProductSerializer(many=True)

    class Meta:
        model = Cart
        fields = '__all__'

