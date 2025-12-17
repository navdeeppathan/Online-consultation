import React, { useEffect, useState } from "react";
import { Form, Button, Table, Badge, Modal } from "react-bootstrap";
import "react-calendar/dist/Calendar.css";

import male from "../../assets/images/male.png";
import female from "../../assets/images/Female2.png";
import axios from "axios";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import toast, { Toaster } from "react-hot-toast";
import AdminSidebar from "../utils/AdminSidebar";
import AdminNavbar from "../utils/AdminNavbar";
import Config from "../../config";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminProfile = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [userData, setUserData] = useState(user);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile_number: "",
    address: "",
    profile_image: "",
    gender: "",
    nationality: "",
    date_of_birth: "",
    aboutus: "",
    imageFile: null, // actual File object
  });

  // Populate formData when component mounts or userData changes
  useEffect(() => {
    setFormData({
      firstname: userData.firstname || "",
      lastname: userData.lastname || "",
      email: userData.email || "",
      mobile_number: userData.mobile_number || "",
      address: userData.address || "",
      profile_image: userData.profile_image || "",
      gender: userData.gender || "",
      nationality: userData.nationality || "",
      date_of_birth: userData.date_of_birth || "",
      aboutus: userData.aboutus || "",
      imageFile: null,
    });
  }, [userData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        profile_image: URL.createObjectURL(file),
      }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("firstname", formData.firstname);
      payload.append("lastname", formData.lastname);
      payload.append("email", formData.email);
      payload.append("mobile_number", formData.mobile_number);
      payload.append("address", formData.address);
      payload.append("gender", formData.gender);
      payload.append("nationality", formData.nationality);
      payload.append("date_of_birth", formData.date_of_birth);
      payload.append("aboutus", formData.aboutus);
      if (formData.imageFile) {
        payload.append("profile_image", formData.imageFile);
      }

      await axios.post(
        `${Config.BASE_URL}/api/profile/update/${userData.id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update error", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <>
      <Toaster />
      <div className="d-flex bgcolor">
        <AdminSidebar />
        <div className="flex-grow-1 content-area">
          <AdminNavbar />
          <div className="bgcolor p-4 mb-5">
            <div className="row">
              <div className="col-12">
                <div className="profile-card p-4 shadow-sm rounded bg-white">
                  <div className="position-relative mb-4">
                    <div className="row align-items-center">
                      <div className="col-lg-2 text-center mb-2 position-relative">
                        <img
                          src={
                            formData.profile_image
                              ? formData.profile_image.startsWith("blob:")
                                ? formData.profile_image
                                : `${Config.BASE_URL}/${formData.profile_image}`
                              : formData.gender === "Female"
                              ? female
                              : male
                          }
                          alt="Profile"
                          className="profile-img rounded-circle"
                          style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "contain",
                            border: "4px solid #007bff",
                          }}
                        />
                        <label
                          htmlFor="profileImageInput"
                          className="editicon"
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            background: "#fff",
                            borderRadius: "50%",
                            padding: "4px",
                            cursor: "pointer",
                          }}
                        >
                          <i className="fa fa-pencil-alt"></i>
                        </label>
                        <input
                          id="profileImageInput"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                        />
                      </div>
                      <div className="col-lg-3 doctorname">
                        <h3 className="mt-3 doctorname">
                          {formData.firstname} {formData.lastname}
                        </h3>
                        <div>
                          {JSON.parse(
                            userData.professional_registration
                              ?.specialization || "[]"
                          ).join(", ")}
                        </div>
                      </div>
                    </div>
                    <Form onSubmit={handleUpdate} className="mt-4">
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.firstname}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstname: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.lastname}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastname: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.mobile_number}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mobile_number: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <Button type="submit" className="save-btn">
                        Save Changes
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <h6>Copyright © 2025 Yodoc UK All Rights Reserved.</h6>
          </div>
        </div>
      </div>

      <style>
        {`
@media (min-width: 900px) and (max-width: 1370px) {
  .doctorname {
    font-size: 15px;
  }
  .editicon {
    margin-right: -10px;
  }
}

@media (min-width: 1536px) and (max-width: 1600px) {
  .editicon {
    margin-right: 10px;
  }
}

.documentimg {
  width: 200px;
  height: 200px;
}

.documentsurl {
  background-color: #E0EAF3;
  border-radius: 15px;
  padding: 10px;
}

.save-btn-container {
  display: flex;
  justify-content: flex-end;
}

.save-btn {
  background-color: #4d6aff;
  color: white;
  padding: 10px 24px;
  border-radius: 24px;
  border: 2px solid #4d6aff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
}

.profile-card {
  background-color: #fff;
  border-radius: 16px;
}

.section-heading {
  border-bottom: 2px solid #eee;
  padding-bottom: 6px;
  margin-bottom: 20px;
  color: #333;
}

.spend-summary-card {
  border-radius: 20px;
  background-color: #fff;
  border: none;
}

.donut-chart {
  position: relative;
  width: 130px;
  height: 130px;
  margin: 0 auto;
  border-radius: 50%;
  background: conic-gradient(#4a6cf7 65%, #2c2c2c 0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.total-amount {
  font-weight: bold;
  font-size: 20px;
  position: absolute;
  color: #000;
}

.donut-label {
  position: absolute;
  right: -10px;
  top: 40%;
  background: #2c2c2c;
  color: #fff;
  font-size: 10px;
  padding: 3px 7px;
  border-radius: 5px;
}

.dot {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: inline-block;
}

.blue-dot {
  background-color: #4a6cf7;
}

.black-dot {
  background-color: #2c2c2c;
}

.completed-appointment {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.completed-appointment:last-child {
  border-bottom: none;
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 18px;
}

.blue-bg {
  background-color: #4a6cf7;
}

.gray-bg {
  background-color: #3d3d3d;
}
        `}
      </style>
    </>
  );
};

export default AdminProfile;
