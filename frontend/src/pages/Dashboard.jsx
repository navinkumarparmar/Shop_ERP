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
  const [showAddShopForm, setShowAddShopForm] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [message, setMessage] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch user and shops
  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchData = async () => {
      try {
        const userRes = await axios.get("/auth/getOne", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);

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
        const res = await axios.put(`/products/${editProduct._id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedProducts = selectedShop.products.map((p) =>
            p._id === editProduct._id ? res.data.data : p
          );
          const updatedShop = { ...selectedShop, products: updatedProducts };
          setSelectedShop(updatedShop);

          // Update shops array
          setShops(shops.map((s) => (s._id === updatedShop._id ? updatedShop : s)));
        showMsg("Product updated successfully!");
      } else {
        const res = await axios.post(
          `/products/${selectedShop._id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
       const updatedShop = {
    ...selectedShop,
    products: [...(selectedShop.products || []), res.data.data],
  };
  setSelectedShop(updatedShop);

  // Update shops array
  setShops(shops.map((s) => (s._id === updatedShop._id ? updatedShop : s)));

  showMsg("Product added successfully!");
      }
      setShowAddProductForm(false);
      setEditProduct(null);
      e.target.reset();
    } catch (err) {
      console.error(err);
      showMsg("Failed to add/update product", "error");
    }
  };

  // Add Shop
  const handleAddShop = async (e) => {
    e.preventDefault();
    try {
      const shopName = e.target.name.value;
      const res = await axios.post(
        "/shops",
        { name: shopName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShops([...shops, res.data.data]);
      setShowAddShopForm(false);
      showMsg("Shop added successfully!");
      e.target.reset();
    } catch (err) {
      console.error(err);
      showMsg("Failed to add shop", "error");
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
          <div className="shops-header">
            <h3>Your Shops</h3>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddShopForm(true)}
            >
              Add Shop
            </button>
          </div>

          {showAddShopForm && (
            <div className="inline-product-form">
              <form onSubmit={handleAddShop}>
                <input name="name" placeholder="Shop Name" required />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" className="btn btn-success">
                    Add Shop
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddShopForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="shops-list">
            {shops.map((shop) => (
              <div
                key={shop._id}
                className={`shop-card ${
                  selectedShop?._id === shop._id ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedShop(shop);
                  setShowAddProductForm(false);
                  setEditProduct(null);
                }}
              >
                <h4>{shop.name}</h4>
              </div>
            ))}
          </div>

          {selectedShop && (
            <div className="products-section">
              <h4>Products in {selectedShop.name}</h4>

              <div className="products-grid">
                {selectedShop.products?.length ? (
                  selectedShop.products.map((prod) => (
                    <div key={prod._id} className="product-card">
                      <h5>{prod.name}</h5>
                      <p>Category: {prod.category}</p>
                      <p>Price: ₹{prod.price}</p>
                      <div className="product-actions">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => {
                            setEditProduct(prod);
                            setShowAddProductForm(true);
                          }}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={async () => {
                            if (!window.confirm(`Delete ${prod.name}?`)) return;
                            try {
                              await axios.delete(`/products/${prod._id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              const updatedProducts = selectedShop.products.filter(
                                (p) => p._id !== prod._id
                              );
                              const updatedShop = { ...selectedShop, products: updatedProducts };
                              setSelectedShop(updatedShop);
                              // Update shops array
                              setShops(shops.map((s) => (s._id === updatedShop._id ? updatedShop : s)));

                              showMsg("Product deleted!");
                            } catch (err) {
                              console.error(err);
                              showMsg("Failed to delete", "error");
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No products yet.</p>
                )}
              </div>

              {showAddProductForm && (
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
                          setShowAddProductForm(false);
                          setEditProduct(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {!showAddProductForm && (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddProductForm(true)}
                >
                  Add Product to {selectedShop.name}
                </button>
              )}
            </div>
          )}
        </div>
      );
    }
    if (activeView === "shop-management") {
  return (
    <div className="shop-management">
      <div className="shops-header">
        <h3>Manage All Shops</h3>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddShopForm(true)}
        >
          Add Shop
        </button>
      </div>

      {showAddShopForm && (
        <div className="inline-product-form">
          <form onSubmit={handleAddShop}>
            <input name="name" placeholder="Shop Name" required />
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn btn-success">
                Add Shop
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddShopForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="shops-list">
        {shops.length ? (
          shops.map((shop) => (
            <div key={shop._id} className="shop-card">
              <h4>{shop.name}</h4>
              <div className="shop-actions">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => {
                    const newName = prompt("Enter new name", shop.name);
                    if (!newName) return;
                    axios
                      .put(`/shops/${shop._id}`, { name: newName }, {
                        headers: { Authorization: `Bearer ${token}` },
                      })
                      .then((res) => {
                        setShops(
                          shops.map((s) =>
                            s._id === shop._id ? res.data.data : s
                          )
                        );
                        showMsg("Shop updated successfully!");
                      })
                      .catch(() => showMsg("Update failed", "error"));
                  }}
                >
                  Update
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    if (!window.confirm(`Delete ${shop.name}?`)) return;
                    axios
                      .delete(`/shops/${shop._id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                      })
                      .then(() => {
                        setShops(shops.filter((s) => s._id !== shop._id));
                        showMsg("Shop deleted!");
                      })
                      .catch(() => showMsg("Delete failed", "error"));
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No shops yet.</p>
        )}
      </div>
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
          <li onClick={() => setActiveView("shops")}>Product Managment</li>
          <li onClick={() => setActiveView("shop-management")}>Shop Management</li>
          
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
