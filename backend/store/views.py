from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User

from .models import Category, Product, Cart, InCartProduct
from .serializers import CategorySerializer, ProductSerializer, CartSerializer, InCartProductSerializer


class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {"error": "Username и password обязательны."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Такой username уже есть."},
                status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password)
        user.save()

        Cart.objects.create(user=user)
        return Response({"message": "Пользователь успешно зарегистрирован."})


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        #return Cart.objects.filter()
        return Cart.objects.filter(user=self.request.user)


class InCartProductViewSet(viewsets.ModelViewSet):
    queryset = InCartProduct.objects.all()
    serializer_class = InCartProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        # return InCartProduct.objects
        return InCartProduct.objects.filter(cart__user=self.request.user)

    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product')
        cart_id = request.data.get('cart')
        quantity = request.data.get('quantity', 1)

        cart = Cart.objects.get(id=cart_id)
        product = Product.objects.get(id=product_id)
        incart_product = InCartProduct.objects.filter(cart=cart, product=product).first()

        if incart_product:
            incart_product.quantity += quantity
            incart_product.save()
            return Response(InCartProductSerializer(incart_product).data)
        else:
            new_incart_product = InCartProduct.objects.create(cart=cart, product=product, quantity=quantity)
            return Response(InCartProductSerializer(new_incart_product).data)
