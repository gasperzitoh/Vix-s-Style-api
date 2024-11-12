// src/app/products/page.js
"use client";
import { useState, useEffect } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", size: "", tags: "", description: "", imageUrl: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSaveProduct = async () => {
    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/products?id=${editId}` : "/api/products";

    const productData = {
      name: form.name,
      size: form.size,
      tags: form.tags,
      description: form.description,
      image: form.imageUrl,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error("Failed to save product");

      setForm({ name: "", size: "", tags: "", description: "", imageUrl: "" });
      setEditId(null);
      setIsEditing(false);
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const res = await fetch(`/api/products?id=${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      fetchProducts();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar producto: " + error.message);
    }
  };

  const startEditing = (product) => {
    setForm({ 
      name: product.name, 
      size: product.size, 
      tags: product.tags, 
      description: product.description, 
      imageUrl: product.image 
    });
    setIsEditing(true);
    setEditId(product.id);
    setShowModal(true);
  };

  return (
    <div className="container">
      <h1 className="title">Vix's Style Bazar</h1>
      
      <button onClick={() => setShowModal(true)} className="add-button">Add New Product</button>
      
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="modal-title">{isEditing ? "Edit Product" : "Add Product"}</h2>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="input-field" />
            <input name="size" value={form.size} onChange={handleChange} placeholder="Size" className="input-field" />
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="input-field" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="textarea-field"></textarea>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Image URL" className="input-field" />
            <button onClick={handleSaveProduct} className="save-button">
              {isEditing ? "Update Product" : "Add Product"}
            </button>
            <button onClick={() => setShowModal(false)} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}

      <div className="product-catalog">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.image && <img src={product.image} alt={product.name} className="product-image" />}
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price}</p>
              <p className="product-size">{product.size}</p>
              <p className="product-tags">Tags: {product.tags}</p>
              <p className="product-description">{product.description}</p>
              <div className="product-actions">
                <button onClick={() => startEditing(product)} className="edit-button">Edit</button>
                <button onClick={() => handleDeleteProduct(product.id)} className="delete-button">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
