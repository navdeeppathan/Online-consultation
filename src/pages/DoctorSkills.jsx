import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Config from "../config";
import { CircularProgress } from "@mui/material";

const DoctorSkills = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const doctorId = user.id;
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    skill_name: "",
    proficiency_level: "",
    description: "",
    years_of_experience: "",
  });
  const [editSkill, setEditSkill] = useState(null);

  const apiUrl = `${Config.BASE_URL}/api/skills`;

  // Fetch all skills of this doctor
  const fetchSkills = async () => {
    try {
      const res = await axios.get(`${apiUrl}?doctor_id=${doctorId}`);
      setSkills(res.data.data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  useEffect(() => {
    if (doctorId) fetchSkills();
  }, [doctorId]);

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);

  // Add skill
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(apiUrl, { doctor_id: doctorId, ...formData });
      fetchSkills();
      setFormData({
        skill_name: "",
        proficiency_level: "",
        description: "",
        years_of_experience: "",
      });
    } catch (error) {
      console.error("Error adding skill:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update skill
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`${apiUrl}/${editSkill.id}`, editSkill);
      fetchSkills();
      setEditSkill(null);
    } catch (error) {
      console.error("Error updating skill:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete skill
  const handleDelete = async (id) => {
    if (window.confirm("Delete this skill?")) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        fetchSkills();
      } catch (error) {
        console.error("Error deleting skill:", error);
      }
    }
  };

  return (
    <div className="container">
      {/* <h3 className="text-center mb-4 text-primary">Doctor Skill Management</h3> */}

      {/* Skill Form */}
      <div className="card shadow-sm mb-4">
        <div
          className={`card-header text-white ${
            editSkill ? "bg-warning" : "bg-primary"
          }`}
        >
          <h5 className="mb-0">{editSkill ? "Edit Skill" : "Add Skill"}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={editSkill ? handleUpdate : handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Skill Name</label>
                <input
                  type="text"
                  name="skill_name"
                  className="form-control"
                  required
                  value={editSkill ? editSkill.skill_name : formData.skill_name}
                  onChange={(e) =>
                    editSkill
                      ? setEditSkill({
                          ...editSkill,
                          skill_name: e.target.value,
                        })
                      : handleChange(e)
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Proficiency Level</label>
                <select
                  name="proficiency_level"
                  className="form-select"
                  value={
                    editSkill
                      ? editSkill.proficiency_level
                      : formData.proficiency_level
                  }
                  onChange={(e) =>
                    editSkill
                      ? setEditSkill({
                          ...editSkill,
                          proficiency_level: e.target.value,
                        })
                      : handleChange(e)
                  }
                >
                  <option value="">Select</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Years of Experience</label>
                <input
                  type="number"
                  name="years_of_experience"
                  className="form-control"
                  value={
                    editSkill
                      ? editSkill.years_of_experience
                      : formData.years_of_experience
                  }
                  onChange={(e) =>
                    editSkill
                      ? setEditSkill({
                          ...editSkill,
                          years_of_experience: e.target.value,
                        })
                      : handleChange(e)
                  }
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={
                    editSkill ? editSkill.description : formData.description
                  }
                  onChange={(e) =>
                    editSkill
                      ? setEditSkill({
                          ...editSkill,
                          description: e.target.value,
                        })
                      : handleChange(e)
                  }
                ></textarea>
              </div>

              <div className="col-12 text-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn ${
                    editSkill ? "btn-warning" : "btn-success"
                  } px-4`}
                >
                  {loading && <CircularProgress size={20} color="inherit" />}
                  {editSkill ? "Update Skill" : "Add Skill"}
                </button>
                {editSkill && (
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => setEditSkill(null)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Skills Cards */}
      <div className="row">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <div className="col-md-4 mb-4" key={skill.id}>
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title text-primary">
                    {skill.skill_name}
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {skill.proficiency_level || "N/A"}
                  </h6>
                  <p className="card-text small text-secondary">
                    {skill.description || "No description provided"}
                  </p>
                  <p className="mb-2">
                    <strong>Experience:</strong>{" "}
                    {skill.years_of_experience || 0} years
                  </p>
                </div>
                <div className="card-footer bg-light text-end">
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => setEditSkill(skill)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(skill.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No skills added yet.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorSkills;
