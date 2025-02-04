import { useParams } from "react-router-dom";
import { useProduct, useProductHandlers } from "../Utils/Hooks";
import "./EditProductPage.css";

export function EditProductPage() {
  const { id } = useParams();
  const { product, setProduct } = useProduct(id);
  const { handleInputChange, handleFileChange, handleSave, handleDelete } = useProductHandlers(
    id,
    product,
    setProduct
  );

  if (!product) return <p>...</p>;

  return (
    <div className="edit-product-page">
      <h2>Редактировать товар</h2>
      <label>
        Название:
        <input
          type="text"
          name="name"
          value={product.name || ""}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Цена:
        <input
          type="number"
          name="price"
          value={product.price || ""}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Описание:
        <textarea
          name="description"
          value={product.description || ""}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Изображение:
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
        />
      </label>
      <button className="save-button" onClick={handleSave}>
        Сохранить
      </button>
      <button className="delete-button" onClick={handleDelete}>
        Удалить товар
      </button>
    </div>
  );
}
