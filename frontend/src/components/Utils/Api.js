export async function apiService(path, params = {}, useAuth = true) {
  const access = window.localStorage.getItem('ACCESS')

  const { headers = {}, ...otherParams } = params

  if (access && useAuth) {
    headers['Authorization'] = `Bearer ${access}`
  }

  const response = await fetch(`http://localhost:8000/api/${path}`, {
    headers,
    ...otherParams,
  })

  let data
  try {
    data = await response.json()
  } catch {}
  if (!response.ok) {
    throw new Error(data.error || 'Ошибка при выполнении запроса');
  }
  return data;
}

export const fetchProductsBackend = async () => {
  return apiService("products/", { method: "GET" });
};

export const fetchProductBackend = async (id) => {
  return apiService(`products/${id}/`, { method: "GET" });
};

export const addProductBackend = async (product) => {
  const formData = new FormData();

  for (const key in product) {
    if (product[key] !== null && product[key] !== undefined) {
      formData.append(key, product[key]);
    }
  }

  return apiService("products/", {
    method: "POST",
    body: formData,
  });
};

export const updateProductBackend = async (id, updatedProduct) => {
  const formData = new FormData();

  for (const key in updatedProduct) {
    if (updatedProduct[key]) {
      formData.append(key, updatedProduct[key]);
    }
  }

  return apiService(`products/${id}/`, {
    method: "PUT",
    body: formData,
  });
};

export const deleteProductBackend = async (id) => {
  return apiService(`products/${id}/`, { method: "DELETE" });
};

export const fetchCart = async () => {
  return apiService("carts/", { method: "GET" });
};

export const addToCart = async (productId) => {
  try {
    const cartResponse = await apiService("carts/", { method: "GET" });
    const cart = cartResponse[0];

    const newInCartProduct = {
      product: productId,
      cart: cart.id,
      quantity: 1,
    };

    return apiService("incartproducts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newInCartProduct),
    });
  } catch (e) {}
};

export const delFromCart = async (productId) => {
  try {
    const cartResponse = await apiService("carts/", { method: "GET" });
    const cart = cartResponse[0];

    const inCartProducts = await apiService("incartproducts/", { method: "GET" });
    const productToDel = inCartProducts.find(
      (item) => item.product === productId && item.cart === cart.id
    );

    return apiService(`incartproducts/${productToDel.id}/`, { method: "DELETE" });
  } catch (e) {}
};
