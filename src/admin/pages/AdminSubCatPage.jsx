import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Config from "../../config";
import AdminSidebar from "../utils/AdminSidebar";
import AdminNavbar from "../utils/AdminNavbar";

const AdminSubCatPage = () => {
  const { id } = useParams(); // get category id from URL
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${Config.BASE_URL}/api/categoriesby_id`, {
          params: { id },
        });
        if (res.data.success) {
          setCategory(res.data.data);
          setSubcategories(res.data.data.subCat || []);
        } else {
          toast.error(res.data.message || "Category not found");
          navigate("/categories"); // fallback to list
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
        navigate("/categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, navigate]);

  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [saveloading, setSaveLoading] = useState(false);

  const handleEditClick = (cat) => {
    setSelectedCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: catName,
        description: catDesc,
      };

      setSaveLoading(true);
      const res = await axios.put(
        `${Config.BASE_URL}/api/categories/${selectedCategory.id}`,
        payload
      );

      console.log("Updated Category:", res.data);
      setShowModal(false);
    } catch (error) {
      console.error(
        "Error updating category:",
        error.response?.data || error.message
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (sub) => {
    if (window.confirm(`Are you sure to delete subcategory: ${sub.name}?`)) {
      try {
        const res = await axios.delete(
          `${Config.BASE_URL}/api/categories/${sub.id}`
        );
        if (res.data.success) {
          toast.success(res.data.message);
          setSubcategories((prev) => prev.filter((s) => s.id !== sub.id));
        } else {
          toast.error(res.data.message || "Failed to delete");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    }
  };

  if (loading) {
    return (
      <>
        <style jsx>{`
          .loading-container {
            min-height: 500px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 12px;
            margin: 20px;
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid #e2e8f0;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </>
    );
  }

  if (!category) return null;

  return (
    <>
      <style jsx>{`
        .subcategory-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 30px;
          //   background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
        }

        .category-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          border-radius: 15px;
          color: white;
          margin-bottom: 30px;
          box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
          position: relative;
          overflow: hidden;
        }

        .category-header::before {
          content: "";
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 50%
          );
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
          }
        }

        .category-title {
          font-size: 2.5rem;
          font-weight: 500;
          margin-bottom: 10px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .category-desc {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0;
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 8px 16px;
          border-radius: 20px;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 14px;
          backdrop-filter: blur(10px);
          position: absolute;
          top: 20px;
          left: 20px;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          color: white;
        }

        .subcategories-section {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .section-title {
          font-size: 1.8rem;
          font-weight: 500;
          color: #2d3748;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .add-subcategory-btn {
          background: linear-gradient(135deg, #48bb78, #38a169);
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .add-subcategory-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4);
          color: white;
        }

        .stylish-table {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: none;
          background: white;
        }

        .stylish-table thead th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          padding: 20px;
          border: none;
          font-size: 14px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .stylish-table tbody tr {
          transition: all 0.3s ease;
          border: none;
        }

        .stylish-table tbody tr:hover {
          background: linear-gradient(90deg, #f8faff 0%, #e8f2ff 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .stylish-table tbody td {
          padding: 20px;
          border: none;
          border-bottom: 1px solid #f0f4f8;
          vertical-align: middle;
          color: #4a5568;
          font-weight: 500;
        }

        .stylish-table tbody tr:last-child td {
          border-bottom: none;
        }

        .subcategory-name {
          font-weight: 500;
          color: #2d3748;
          font-size: 16px;
        }

        .subcategory-desc {
          color: #718096;
          font-size: 14px;
          line-height: 1.5;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .edit-btn {
          background: linear-gradient(135deg, #48bb78, #38a169);
        }

        .edit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(72, 187, 120, 0.4);
          color: white;
        }

        .delete-btn {
          background: linear-gradient(135deg, #f56565, #e53e3e);
        }

        .delete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(245, 101, 101, 0.4);
          color: white;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%);
          border-radius: 12px;
          margin-top: 20px;
        }

        .empty-state-icon {
          font-size: 4rem;
          color: #cbd5e0;
          margin-bottom: 20px;
        }

        .empty-state-text {
          font-size: 1.2rem;
          color: #718096;
          margin-bottom: 20px;
        }

        .create-first-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .create-first-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          color: white;
        }
      `}</style>
      <div className="d-flex">
        <AdminSidebar />
        <div className="flex-grow-1 content-area">
          <AdminNavbar />

          <div className="bgcolor p-4"></div>
          <div className="subcategory-container">
            <div className="category-header">
              {/* <button
                className="back-btn"
                onClick={() => navigate("/categories")}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back
              </button> */}
              <div>
                <h1 className="category-title">{category.name}</h1>
                <p className="category-desc">{category.description}</p>
              </div>
            </div>

            <div className="subcategories-section">
              <div className="section-title">
                <span>
                  <i className="fas fa-list-ul me-3"></i>
                  Subcategories
                </span>
                <button className="add-subcategory-btn">
                  <i className="fas fa-plus me-2"></i>
                  Add Subcategory
                </button>
              </div>

              {subcategories.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <i className="fas fa-folder-open"></i>
                  </div>
                  <div className="empty-state-text">
                    No subcategories found for this category
                  </div>
                  <button className="create-first-btn">
                    <i className="fas fa-plus me-2"></i>
                    Create First Subcategory
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table stylish-table">
                    <thead>
                      <tr>
                        <th>Subcategory Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subcategories.map((sub) => (
                        <tr key={sub.id}>
                          <td>
                            <div className="subcategory-name">{sub.name}</div>
                          </td>
                          <td>
                            <div className="subcategory-desc">
                              {sub.description}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-btn edit-btn"
                                onClick={() => handleEditClick(sub)}
                                title="Edit Subcategory"
                              >
                                <i className="fas fa-edit me-1"></i>
                                Edit
                              </button>
                              <button
                                className="action-btn delete-btn"
                                onClick={() => handleDelete(sub)}
                                title="Delete Subcategory"
                              >
                                <i className="fas fa-trash me-1"></i>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSubCatPage;
