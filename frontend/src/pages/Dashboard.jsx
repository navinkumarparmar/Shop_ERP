// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [shops, setShops] = useState([]);
  const [activeView, setActiveView] = useState("home");
  const [selectedShop, setSelectedShop] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [message, setMessage] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch user and shops on mount
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await axios.get("/auth/getOne", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);

        // Fetch only current user's shops
        const shopRes = await axios.get("/shops/myshops", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShops(shopRes.data.data || []);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchData();
  }, [token, navigate]);

  // Show toast messages
  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Add / Update Product
  const handleAddUpdateProduct = async (e) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      category: e.target.category.value,
      price: Number(e.target.price.value),
    };

    try {
      if (editProduct) {
        // Update product
        const res = await axios.put(`/products/${editProduct._id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedProducts = selectedShop.products.map((p) =>
          p._id === editProduct._id ? res.data.data : p
        );
        setSelectedShop({ ...selectedShop, products: updatedProducts });
        showMsg("Product updated successfully!");
      } else {
        // Add product
        const res = await axios.post(
          `/products/${selectedShop._id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSelectedShop({
          ...selectedShop,
          products: [...(selectedShop.products || []), res.data.data],
        });
        showMsg("Product added successfully!");
      }

      setShowAddForm(false);
      setEditProduct(null);
      e.target.reset();
    } catch (err) {
      console.error(err);
      showMsg("Failed to add/update product", "error");
    }
  };

  const renderContent = () => {
    if (activeView === "home") {
      return (
        <>
          <div className="cards-container">
            <div className="card summary-card">
              <h4>Total Shops</h4>
              <p>{shops.length}</p>
            </div>
            <div className="card summary-card">
              <h4>Total Products</h4>
              <p>
                {shops.reduce(
                  (acc, shop) => acc + (shop.products?.length || 0),
                  0
                )}
              </p>
            </div>
          </div>
          <div className="action-buttons">
            <button
              className="btn btn-primary"
              onClick={() => setActiveView("profile")}
            >
              Go to Profile
            </button>
            <button
              className="btn btn-success"
              onClick={() => setActiveView("shops")}
            >
              Manage Shops
            </button>
          </div>
        </>
      );
    }

    if (activeView === "shops") {
      return (
        <div className="shops-view">
          <h3>Your Shops</h3>
          <div className="shops-list">
            {shops.map((shop) => (
              <div
                key={shop._id}
                className={`shop-card ${
                  selectedShop?._id === shop._id ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedShop(shop);
                  setShowAddForm(false);
                  setEditProduct(null);
                }}
              >
                <h4>{shop.name}</h4>
              </div>
            ))}
          </div>

          {selectedShop && (
            <div className="products-list">
              <h4>Products in {selectedShop.name}</h4>
              <div className="products-grid">
                {selectedShop.products?.length ? (
                  selectedShop.products.map((prod) => (
                    <div key={prod._id} className="product-card">
                      <h5>{prod.name}</h5>
                      <p>Category: {prod.category}</p>
                      <p>Price: ${prod.price}</p>
                      <div className="product-actions">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => {
                            setEditProduct(prod);
                            setShowAddForm(true);
                          }}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={async () => {
                            const confirmDelete = window.confirm(
                              `Are you sure you want to delete ${prod.name}?`
                            );
                            if (!confirmDelete) return;

                            try {
                              await axios.delete(`/products/${prod._id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              setSelectedShop({
                                ...selectedShop,
                                products: (selectedShop.products || []).filter(
                                  (p) => p._id !== prod._id
                                ),
                              });
                              showMsg("Product deleted successfully!");
                            } catch (err) {
                              console.error(err);
                              showMsg("Failed to delete product", "error");
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No products available.</p>
                )}
              </div>

              {!showAddForm && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditProduct(null);
                    setShowAddForm(true);
                  }}
                >
                  Add Product to {selectedShop.name}
                </button>
              )}

              {showAddForm && (
                <div className="inline-product-form">
                  <form onSubmit={handleAddUpdateProduct}>
                    <input
                      name="name"
                      defaultValue={editProduct?.name || ""}
                      placeholder="Product Name"
                      required
                    />
                    <input
                      name="category"
                      defaultValue={editProduct?.category || ""}
                      placeholder="Category"
                      required
                    />
                    <input
                      name="price"
                      type="number"
                      defaultValue={editProduct?.price || ""}
                      placeholder="Price"
                      required
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button type="submit" className="btn btn-success">
                        {editProduct ? "Update" : "Add"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowAddForm(false);
                          setEditProduct(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    if (activeView === "profile") {
      return (
        <div>
          <h3>Your Profile</h3>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      );
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="sidebar">
        <h2 className="sidebar-logo">Shop ERP</h2>
        <ul>
          <li onClick={() => setActiveView("home")}>Home</li>
          <li onClick={() => setActiveView("profile")}>Profile</li>
          <li onClick={() => setActiveView("shops")}>Shops</li>
          <li
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login", { replace: true });
            }}
          >
            Logout
          </li>
        </ul>
      </div>

      <div className="main-content">
        {message && (
          <div
            className={`toast-message ${
              message.type === "success" ? "success" : "error"
            }`}
          >
            {message.text}
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
}
