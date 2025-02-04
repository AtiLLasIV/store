import { useCartFunc } from "../Utils/Hooks";

export function Cart() {
  const { cartProducts, delFromCart, error } = useCartFunc();

  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className="cartpage">
      <div className="cart-list">
        {cartProducts.length > 0 ? (
          cartProducts.map((product) => (
            <div key={product.id} className="product-card_cart">
              <div className="info_cart">
                <p className="category">{product.category}</p>
                <p className="description">{product.description}</p>
              </div>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.price}$</p>
                <button className="cart-del-button" onClick={() => delFromCart(product)}>
                  Убрать из корзины
                </button>
            </div>
          ))
        ) : (
          <p>В корзине пока нет товаров</p>
        )}
      </div>
    </div>
  );
}