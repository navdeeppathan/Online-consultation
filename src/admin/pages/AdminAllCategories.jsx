import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Config from "../../config";
import AdminSidebar from "../utils/AdminSidebar";
import AdminNavbar from "../utils/AdminNavbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminAllCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 8;

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/allcategories`);

      if (res.data.success) {
        setCategories(res.data.data);
        console.log("categories fetched:", res.data.data);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleStatus = async (cat) => {
    setStatusLoading((prev) => [...prev, cat.id]);
    const newStatus = cat.status === 0 ? 1 : 0;
    try {
      await axios.post(`${Config.BASE_URL}/api/update-category-status`, {
        category_id: cat.id,
        status: newStatus,
      });
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, status: newStatus } : c))
      );
      toast.success(
        `Category "${cat.name}" is now ${
          newStatus === 0 ? "Active" : "Inactive"
        }`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setStatusLoading((prev) => prev.filter((id) => id !== cat.id));
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * categoriesPerPage;
  const indexOfFirst = indexOfLast - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum);
  };

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

  const handleDelete = async (catId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${Config.BASE_URL}/api/categories/${catId}`
        );

        if (res.data.success) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message || "Failed to delete category");
        }
      } catch (error) {
        console.error(
          "Delete category error:",
          error.response?.data || error.message
        );
        toast.error("Something went wrong while deleting category");
      }
    }
  };

  return (
    <>
      <style jsx>{`
        .header-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 12px 24px;
          border-radius: 25px;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 14px;
          backdrop-filter: blur(10px);
        }

        .header-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
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
          padding: 18px 20px;
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

        .status-badge-active {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
          border-radius: 25px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge-inactive {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          background: linear-gradient(135deg, #f56565, #e53e3e);
          color: white;
          border-radius: 25px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .custom-switch {
          position: relative;
          width: 60px;
          height: 30px;
        }

        .custom-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #f56565, #e53e3e);
          transition: 0.4s;
          border-radius: 30px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        input:checked + .slider {
          background: linear-gradient(135deg, #48bb78, #38a169);
        }

        input:checked + .slider:before {
          transform: translateX(30px);
        }
        .action-btn {
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 14px;
          min-width: 40px;
        }

        .action-btn-view {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .action-btn-view:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .action-btn-edit {
          background: linear-gradient(135deg, #48bb78, #38a169);
        }

        .action-btn-edit:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(72, 187, 120, 0.4);
        }

        .action-btn-delete {
          background: linear-gradient(135deg, #f56565, #e53e3e);
        }

        .action-btn-delete:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(245, 101, 101, 0.4);
        }

        .subcategory-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .subcategory-item {
          background: linear-gradient(90deg, #f7fafc, #edf2f7);
          padding: 8px 12px;
          margin: 4px 0;
          border-radius: 20px;
          font-size: 13px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .subcategory-status {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: 600;
        }

        .subcategory-status.active {
          background: #c6f6d5;
          color: #22543d;
        }

        .subcategory-status.inactive {
          background: #fed7d7;
          color: #742a2a;
        }

        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          border-radius: 12px;
          color: white;
          margin-bottom: 30px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .pagination-container {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin-top: 20px;
        }

        .pagination-btn {
          border: none;
          padding: 10px 15px;
          margin: 0 2px;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .pagination-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .pagination-btn:not(.active) {
          background: #f7fafc;
          color: #4a5568;
        }

        .pagination-btn:not(.active):hover {
          background: #e2e8f0;
          transform: translateY(-1px);
        }

        .loading-spinner {
          background: white;
          padding: 60px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="d-flex">
        <AdminSidebar />
        <div className="flex-grow-1 content-area">
          <AdminNavbar />

          <div className="bgcolor p-4">
            <div className="page-header d-flex justify-content-between align-items-center">
              <div>
                <h3 className="mb-0">All Categories</h3>
                <p className="mb-0 mt-2 opacity-75">
                  Manage and monitor all your categories
                </p>
              </div>
              <button
                onClick={() => navigate("/admin-add-category")}
                className="header-btn"
              >
                <i className="fas fa-plus me-2"></i>
                Add Category
              </button>
            </div>

            {loading ? (
              <div className="d-flex justify-content-center align-items-center loading-spinner">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table stylish-table">
                    <thead>
                      <tr>
                        <th>Category Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Tab</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCategories.map((cat) => (
                        <tr key={cat.id}>
                          <td>
                            <div className="fw-bold text-dark">{cat.name}</div>
                          </td>
                          <td>
                            <div className="text-muted">
                              {cat.description
                                ? cat.description
                                    .split(" ")
                                    .slice(0, 5)
                                    .join(" ") +
                                  (cat.description.split(" ").length > 5
                                    ? "..."
                                    : "")
                                : ""}
                            </div>
                          </td>
                          <td>
                            <label className="custom-switch">
                              <input
                                type="checkbox"
                                checked={cat.status === 1}
                                onChange={() => toggleStatus(cat)}
                                disabled={statusLoading.includes(cat.id)}
                              />
                              <span className="slider"></span>
                            </label>
                          </td>
                          <td>
                            <div className="fw-bold text-dark">
                              {cat.status === 1 ? "GP Service" : "SP Service"}
                            </div>
                          </td>

                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="action-btn action-btn-view"
                                onClick={() =>
                                  navigate(`/admin-category/details/${cat.id}`)
                                }
                                title="View Details"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                className="action-btn action-btn-edit"
                                onClick={() => handleEditClick(cat)}
                                title="Edit Category"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="action-btn action-btn-delete"
                                onClick={() => handleDelete(cat.id)}
                                title="Delete Category"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Enhanced Pagination */}
                <div className="d-flex justify-content-center">
                  <div className="pagination-container">
                    <button
                      className="pagination-btn me-2"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        className={`pagination-btn ${
                          currentPage === i + 1 ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className="pagination-btn ms-2"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <>
          {/* Black semi-transparent background */}
          <div
            className="modal-backdrop fade show"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          ></div>

          {/* Centered modal */}
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Category</h5>
                  <button
                    type="button"
                    className="close btn"
                    onClick={() => setShowModal(false)}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={catDesc}
                      onChange={(e) => setCatDesc(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saveloading}
                  >
                    {saveloading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminAllCategories;
