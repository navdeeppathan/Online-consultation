import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Config from "../../config";
import AdminSidebar from "../utils/AdminSidebar";
import AdminNavbar from "../utils/AdminNavbar";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");

  const [parentId, setParentId] = useState("");
  const [subcategories, setSubcategories] = useState([
    { name: "", description: "" },
  ]);

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/allcategories`);
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create Category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${Config.BASE_URL}/api/categories`, {
        name: catName,
        description: catDesc,
      });
      setCatName("");
      setCatDesc("");
      fetchCategories();
      alert("Category created successfully!");
    } catch (error) {
      alert("Error creating category");
      console.error(error);
    }
  };

  // Add new subcategory row
  const handleAddSubcategory = () => {
    setSubcategories([...subcategories, { name: "", description: "" }]);
  };

  // Delete subcategory row
  const handleDeleteSubcategory = (index) => {
    const updated = subcategories.filter((_, i) => i !== index);
    setSubcategories(
      updated.length ? updated : [{ name: "", description: "" }]
    );
  };

  // Handle subcategory input change
  const handleSubcategoryChange = (index, field, value) => {
    const updated = [...subcategories];
    updated[index][field] = value;
    setSubcategories(updated);
  };

  // Submit all subcategories
  const handleSubCategorySubmit = async (e) => {
    e.preventDefault();
    if (!parentId) {
      alert("Please select a parent category.");
      return;
    }
    try {
      // Submit each subcategory individually
      for (const subcat of subcategories) {
        if (subcat.name.trim() === "") continue; // skip empty names
        await axios.post(`${Config.BASE_URL}/api/categories`, {
          name: subcat.name,
          description: subcat.description,
          parent_id: parentId,
        });
      }
      setSubcategories([{ name: "", description: "" }]);
      setParentId("");
      fetchCategories();
      alert("Subcategories created successfully!");
    } catch (error) {
      alert("Error creating subcategories");
      console.error(error);
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 content-area">
        <AdminNavbar />

        <div className="bgcolor p-4">
          <div className="container mt-5">
            <h2 className="mb-4">Category Management</h2>

            {/* Create Category */}
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                Create Category
              </div>
              <div className="card-body">
                <form onSubmit={handleCategorySubmit}>
                  <div className="mb-3">
                    <label className="form-label">Category Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      required
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
                  <button type="submit" className="btn btn-success">
                    Create Category
                  </button>
                </form>
              </div>
            </div>

            {/* Create Subcategories */}
            <div className="card">
              <div className="card-header bg-secondary text-white">
                Create Subcategories
              </div>
              <div className="card-body">
                <form onSubmit={handleSubCategorySubmit}>
                  <div className="mb-3">
                    <label className="form-label">Parent Category</label>
                    <select
                      className="form-select"
                      value={parentId}
                      onChange={(e) => setParentId(e.target.value)}
                      required
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {subcategories.map((subcat, index) => (
                    <div
                      key={index}
                      className="border p-3 mb-3 position-relative"
                    >
                      <div className="mb-2">
                        <label className="form-label">Subcategory Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={subcat.name}
                          onChange={(e) =>
                            handleSubcategoryChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          value={subcat.description}
                          onChange={(e) =>
                            handleSubcategoryChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        ></textarea>
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger position-absolute"
                        style={{ top: "10px", right: "10px" }}
                        onClick={() => handleDeleteSubcategory(index)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-info mb-3"
                    onClick={handleAddSubcategory}
                  >
                    Add More
                  </button>

                  <br />
                  <button type="submit" className="btn btn-warning">
                    Create Subcategories
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
