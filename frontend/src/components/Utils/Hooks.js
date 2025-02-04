import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchProductsBackend,
  fetchProductBackend,
  addProductBackend,
  updateProductBackend,
  deleteProductBackend,
  fetchCart,
  addToCart,
  delFromCart,
} from "./Api";

export const useMainFunc = () => {
  const [products, setProducts] = useState([]);
  const [categoriedProducts, setCategoriedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cartProductIds, setCartProductIds] = useState(new Set());

  const loadProducts_backend = async () => {
    try {
      const data = await fetchProductsBackend();
      setProducts(data);
      setCategoriedProducts(data);
    } catch (e) {}
  };

  const loadCart_backend = async () => {
    try {
      const cartResponse = await fetchCart();
      const cartItems = cartResponse[0]?.incart_products || [];
      const cartIds = new Set(cartItems.map((item) => item.product));
      setCartProductIds(cartIds);
    } catch (e) {}
  };

  useEffect(() => {
    loadProducts_backend();
    loadCart_backend();
  }, []);

  const filterByCategory = (category) => {
    if (selectedCategory === category) {
      setCategoriedProducts(products);
      setSelectedCategory(null);
    } else {
      setCategoriedProducts(products.filter((product) => product.category === category));
      setSelectedCategory(category);
    }
  };
  const updateCartStatus_backend = async (product, inCart, event) => {
    event?.stopPropagation();
    try {
      if (inCart) {
        await addToCart(product.id);
        setCartProductIds((prev) => new Set(prev).add(product.id));
      } else {
        await delFromCart(product.id);
        setCartProductIds((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.delete(product.id);
          return updatedSet;
        });
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadProducts_backend();
    loadCart_backend();
  }, []);

  return {
    products,
    filteredProducts: categoriedProducts,
    selectedCategory,
    cartProductIds,
    filterByCategory,
    updateCartStatus: updateCartStatus_backend,
  };
};

export const useCartFunc = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [error, setError] = useState(null);

  const loadCartFromBackend = async () => {
    try {
      const cartResponse = await fetchCart();
      const cartItems = cartResponse[0]?.incart_products || [];

      const productsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          try {
            const productDetails = await fetchProductBackend(item.product);
            return { ...productDetails, quantity: item.quantity };
          } catch {
            return null;
          }
        })
      );

      setCartProducts(productsWithDetails);
    } catch (err) {
      setError(err.message || "Ошибка при загрузке корзины");
    }
  };

  const delFromCartFunc = async (product) => {
    try {
      await delFromCart(product.id);
      setCartProducts((prevCart) =>
        prevCart.filter((item) => item.id !== product.id)
      );
    } catch (err) {
      setError(err.message || "Ошибка при удалении из корзины");
    }
  };

  useEffect(() => {
    loadCartFromBackend();
  }, []);

  return {
    cartProducts,
    delFromCart: delFromCartFunc,
    error,
  };
};

export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [cartProductIds, setCartProductIds] = useState(new Set());
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductBackend(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || "Ошибка при загрузке товара");
      }
    };

    const loadCart = async () => {
      try {
        const cartResponse = await fetchCart();
        const cartItems = cartResponse[0]?.incart_products || [];
        const cartIds = new Set(cartItems.map((item) => item.product));
        setCartProductIds(cartIds);
      } catch (err) {
        setError(err.message || "Ошибка при загрузке корзины");
      }
    };

    loadProduct();
    loadCart();
  }, [id]);

  const updateCartStatus = async (product, inCart, event) => {
    event?.stopPropagation();
    try {
      if (inCart) {
        await addToCart(product.id);
        setCartProductIds((prev) => new Set(prev).add(product.id));
      } else {
        await delFromCart(product.id);
        setCartProductIds((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.delete(product.id);
          return updatedSet;
        });
      }
    } catch (err) {
      setError("Ошибка при обновлении статуса корзины");
    }
  };

  return {
    product,
    setProduct,
    cartProductIds,
    updateCartStatus,
    error,
  };
};

export const useProductHandlers = (id, product, setProduct) => {
  const navigate = useNavigate();
  const { updateProduct, deleteProduct } = useProductActions();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
  const { files } = event.target;
  if (files.length > 0) {
    setProduct((prevProduct) => ({
      ...prevProduct,
      image: files[0],
    }));
  }
};

  const handleSave = async () => {
    try {
      await updateProduct(id, product);
      navigate("/main");
    } catch (err) {
      console.error("Ошибка сохранения товара:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(id);
      navigate("/main");
    } catch (err) {
      console.error("Ошибка удаления товара:", err);
    }
  };

  return {
    handleInputChange,
    handleFileChange,
    handleSave,
    handleDelete,
  };
};

export const useProductActions = () => {
  const addEmptyProductToDB = async () => {
    try {
      const newProduct = {
        name: "Новый товар",
        description: "",
        price: 0,
        image: null,
        category: null,
      };
      const createdProduct = await addProductBackend(newProduct);
      alert("Товар создан")
      return createdProduct;
    } catch (e) {}
};

  const updateProductAction = async (id, updatedProduct) => {
    try {
      await updateProductBackend(id, updatedProduct);
    } catch (error) {
      console.error("Ошибка при обновлении товара:", error.message);
      throw error;
    }
  };

  const deleteProductAction = async (id) => {
    try {
      await deleteProductBackend(id);
      alert("Товар удален")
    } catch (error) {
      console.error("Ошибка при удалении товара:", error.message);
      throw error;
    }
  };

  return {
    addEmptyProductToDB,
    updateProduct: updateProductAction,
    deleteProduct: deleteProductAction,
  };
};