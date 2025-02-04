import { useNavigate } from "react-router-dom";
import { useMainFunc } from "../Utils/Hooks";

export function Main() {
  const {
    filteredProducts,
    selectedCategory,
    cartProductIds,
    filterByCategory,
    updateCartStatus,
  } = useMainFunc();

  const navigate = useNavigate();


  const openProductPage = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="homepage">
      <div className="categories">
        <div className="categories-card">
          <div className="categories-buttons">
            {[
              "Категория 1",
              "Категория 2",
              "Категория 3",
              "Категория 4",
              "Категория 5",
              "Категория 6",
              "Категория 7",
              "Категория 8",
            ].map((category) => (
              <button
                key={category}
                onClick={() => filterByCategory(category)}
                className={
                  selectedCategory === category
                    ? "categories-button-clicked"
                    : "categories-button"
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => openProductPage(product.id)}
              style={{ cursor: "pointer" }}
            >
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.price}$</p>
              {!cartProductIds.has(product.id) ? (
                <button
                  className="main-add-button"
                  onClick={(e) => updateCartStatus(product, true, e)}
                >
                  В корзину
                </button>
              ) : (
                <button
                  className="main-del-button"
                  onClick={(e) => updateCartStatus(product, false, e)}
                >
                  Добавлено в корзину
                </button>
              )}
            </div>
          ))
        ) : (
          <p>Товары не найдены</p>
        )}
      </div>
    </div>
  );
}
