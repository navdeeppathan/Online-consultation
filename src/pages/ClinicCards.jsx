import React, { useEffect, useState } from "react";
import axios from "axios";
// adjust your import path
import "bootstrap/dist/css/bootstrap.min.css";

import Config from "../config";
import { FaEdit, FaTrash } from "react-icons/fa";
import UpdateClinic from "./UpdateClinic";
import toast from "react-hot-toast";

const ClinicCards = () => {
  const [clinics, setClinics] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get(`${Config.BASE_URL}/api/clinics/by-doctor/${userData.id}`)
      .then((resp) => {
        if (resp.data.success) {
          setClinics(resp.data.data);
          console.log("resp.data of clinics:-", resp.data.data);
        }
      })
      .catch((error) => console.error("Error fetching clinics:", error));
  }, [userData.id]);

  // Dynamic column width
  const getColClass = () => {
    if (clinics.length === 1) return "col-12";
    if (clinics.length === 2) return "col-md-6 col-12";
    return "col-lg-4 col-md-6 col-12";
  };

  const [deleteLoading, setDeleteLoading] = useState(false);
  // Delete function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this clinic?")) return;

    try {
      setDeleteLoading(true);
      await axios.delete(`${Config.BASE_URL}/api/clinics/${id}`);
      setClinics((prev) => prev.filter((clinic) => clinic.id !== id));
      toast.success("Clinic deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete clinic");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (id) => {
    // Redirect to edit page or open modal
    console.log("Edit clinic", id);
  };

  const [editingClinicId, setEditingClinicId] = useState(null);

  return (
    <div className="container py-4">
      <div className="row g-4">
        {!editingClinicId &&
          clinics.map((clinic) => (
            <div className={getColClass()} key={clinic.id}>
              <div className="card clinic-card shadow-sm h-100">
                <img
                  src={`${Config.BASE_URL}/${clinic.clinic_logo}`}
                  className="card-img-top clinic-logo"
                  alt={clinic.name}
                />
                <div className="d-flex justify-content-end p-2 gap-2">
                  <FaEdit
                    style={{ cursor: "pointer", color: "#1976d2" }}
                    onClick={() => setEditingClinicId(clinic.id)}
                  />
                  <FaTrash
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleDelete(clinic.id)}
                    disabled={deleteLoading}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{clinic.name}</h5>
                  <p className="card-text text-muted">{clinic.address}</p>

                  <div className="clinic-info">
                    <p>
                      <strong>City:</strong> {clinic.city}
                    </p>
                    <p>
                      <strong>Country:</strong> {clinic.country}
                    </p>
                    <p>
                      <strong>Phone:</strong> {clinic.phone}
                    </p>
                    <p>
                      <strong>Email:</strong> {clinic.email}
                    </p>
                  </div>

                  <div className="clinic-hours mt-3">
                    <h6 className="fw-bold">Clinic Hours</h6>
                    <p>Mon: {clinic.monday_hours}</p>
                    <p>Tue: {clinic.tuesday_hours}</p>
                    <p>Wed: {clinic.wednesday_hours}</p>
                    <p>Thu: {clinic.thursday_hours}</p>
                    <p>Fri: {clinic.friday_hours}</p>
                    <p>Sat: {clinic.saturday_hours}</p>
                    <p>Sun: {clinic.sunday_hours}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {editingClinicId && (
          <UpdateClinic
            clinic_id={editingClinicId}
            setEditingClinicId={setEditingClinicId}
          />
        )}
      </div>

      <style>{`
      .clinic-card {
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.clinic-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.clinic-logo {
  width: 100%;
  height: 180px;
  object-fit: contain;
  background-color: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  border-radius: 12px;

}

.card-body p {
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.clinic-info {
  font-size: 0.9rem;
}

.clinic-hours {
  background: #f9f9f9;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
}

.card-footer a {
  text-decoration: none;
  font-weight: 500;
}

@media (max-width: 767px) {
  .clinic-logo {
    height: 150px;
  }
}

      `}</style>
    </div>
  );
};

export default ClinicCards;
