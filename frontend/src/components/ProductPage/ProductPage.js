import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from "../Utils/Hooks";
import './ProductPage.css';

export function ProductPage({ isAdmin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, cartProductIds, updateCartStatus, error } = useProduct(id);

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  if (!product) {
    return <p>...</p>;
  }

  const handleEdit = () => {
    navigate(`/edit-product/${id}`);
  };

  const isInCart = cartProductIds.has(product.id);

  return (
    <div className="product-page">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h2>{product.name}</h2>
        <p className="product-price">{product.price}$</p>
        <p className="product-category">Категория: {product.category}</p>
        <p className="product-description">{product.description}</p>
        {isInCart ? (
          <button
          className="product-del-button"
          onClick={(e) => updateCartStatus(product, false, e)}
          >
          Добавлено в корзину
          </button>
        ) : (
          <button
            className="product-add-button"
            onClick={(e) => updateCartStatus(product, true, e)}
          >
            В корзину
          </button>
        )}
        {isAdmin && (
          <button className="edit-button" onClick={handleEdit}>Редактировать</button>
        )}
      </div>
    </div>
  );
}
