import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

import Config from "../config";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const UpdateClinic = ({ clinic_id, setEditingClinicId }) => {
  const navigate = useNavigate();
  const userdata = JSON.parse(localStorage.getItem("user"));

  const [clinic, setClinic] = useState({
    doctor_id: userdata.id,
    name: "",
    address: "",
    city: "",
    map_link: "",
    country: "",
    postal_code: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: "",
    enquire_link: "",
    clinic_logo: null,
    monday_hours: "",
    tuesday_hours: "",
    wednesday_hours: "",
    thursday_hours: "",
    friday_hours: "",
    saturday_hours: "",
    sunday_hours: "",
  });

  const [hours, setHours] = useState({
    monday: { start: "", end: "", enquire: false },
    tuesday: { start: "", end: "", enquire: false },
    wednesday: { start: "", end: "", enquire: false },
    thursday: { start: "", end: "", enquire: false },
    friday: { start: "", end: "", enquire: false },
    saturday: { start: "", end: "", enquire: false },
    sunday: { start: "", end: "", enquire: false },
  });

  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cities
  useEffect(() => {
    axios
      .get(`${Config.BASE_URL}/api/cities`)
      .then((res) => {
        const cityOptions = res.data?.data.map((c) => ({
          value: c.city_name,
          label: c.city_name,
        }));
        setCities(cityOptions);
      })
      .catch(console.error);
  }, []);

  // Fetch countries
  useEffect(() => {
    axios
      .get(`${Config.BASE_URL}/api/countries`)
      .then((res) => {
        const countryOptions = res.data.data.map((c) => c.country_name.trim());
        setCountries(countryOptions);
      })
      .catch(console.error);
  }, []);

  // Fetch existing clinic data
  useEffect(() => {
    axios
      .get(`${Config.BASE_URL}/api/clinics/${clinic_id}`)
      .then((resp) => {
        if (resp.data.success) {
          const data = resp.data.data;
          setClinic({
            ...clinic,
            ...data,
            clinic_logo: null, // Keep logo input empty
          });

          console.log("clinicdata:-", data);

          // Set hours
          const h = {};
          [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ].forEach((day) => {
            const dayVal = data[`${day}_hours`];
            if (dayVal === "unavailable") {
              h[day] = { start: "", end: "", enquire: true };
            } else if (dayVal && dayVal.includes("-")) {
              const [start, end] = dayVal.split("-");
              h[day] = { start: start.trim(), end: end.trim(), enquire: false };
            } else {
              h[day] = { start: "", end: "", enquire: false };
            }
          });
          setHours(h);
        }
      })
      .catch(console.error);
  }, [clinic_id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setClinic({
      ...clinic,
      [name]: files ? files[0] : value,
    });
  };

  const handleHourChange = (day, type, value) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: value },
    }));
  };

  const handleEnquireToggle = (day) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], enquire: !prev[day].enquire, start: "", end: "" },
    }));
  };

  const handleCityChange = (selectedOption) => {
    setClinic((prev) => ({
      ...prev,
      city: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleCountryChange = (selectedOption) => {
    setClinic((prev) => ({
      ...prev,
      country: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate hours
    for (let day of Object.keys(hours)) {
      const h = hours[day];
      if (!h.enquire && (!h.start || !h.end)) {
        toast.error(`Please enter start and end time for ${day}`);
        return;
      }
    }

    // Merge hours into clinic object
    const finalClinic = { ...clinic };

    console.log("finalclinic:-", finalClinic);
    Object.keys(hours).forEach((day) => {
      finalClinic[`${day}_hours`] = hours[day].enquire
        ? "unavailable"
        : `${hours[day].start}-${hours[day].end}`;
    });

    const formData = new FormData();

    formData.append("doctor_id", finalClinic.doctor_id);
    formData.append("name", finalClinic.name);
    formData.append("address", finalClinic.address || "");
    formData.append("city", finalClinic.city || "");

    formData.append("country", finalClinic.country || "");

    formData.append("phone", finalClinic.phone || "");
    formData.append("email", finalClinic.email || "");
    formData.append("map_link", finalClinic.map_link || "");
    formData.append("enquire_link", finalClinic.enquire_link || "");

    formData.append("monday_hours", finalClinic.monday_hours || "");
    formData.append("tuesday_hours", finalClinic.tuesday_hours || "");
    formData.append("wednesday_hours", finalClinic.wednesday_hours || "");
    formData.append("thursday_hours", finalClinic.thursday_hours || "");
    formData.append("friday_hours", finalClinic.friday_hours || "");
    formData.append("saturday_hours", finalClinic.saturday_hours || "");
    formData.append("sunday_hours", finalClinic.sunday_hours || "");

    // Only append file if it exists
    if (finalClinic.clinic_logo) {
      formData.append("clinic_logo", finalClinic.clinic_logo);
    }

    try {
      setLoading(true);
      await axios.post(
        `${Config.BASE_URL}/api/clinics/update/${clinic_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Clinic updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error updating clinic");
    } finally {
      setLoading(false);
    }
  };

  const countryOptions = countries.map((c) => ({ value: c, label: c }));

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Update Clinic</h5>
          </div>
          <div className="card-body">
            <div className="row">
              {/* Clinic Name */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Clinic Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={clinic.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={clinic.email}
                  onChange={handleChange}
                />
              </div>

              {/* Phone */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={clinic.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Logo */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Clinic Logo</label>
                <input
                  type="file"
                  className="form-control"
                  name="clinic_logo"
                  accept="image/*"
                  onChange={handleChange}
                />
                {clinic.clinic_logo && !clinic.clinic_logo.name && (
                  <img
                    src={`${Config.BASE_URL}/${clinic.clinic_logo}`}
                    alt="Clinic Logo"
                    className="mt-2"
                    style={{ width: "100px" }}
                  />
                )}
              </div>

              {/* Address */}
              <div className="col-md-12 mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  name="address"
                  rows="2"
                  value={clinic.address}
                  onChange={handleChange}
                />
              </div>

              {/* City */}
              <div className="col-md-6 mb-3">
                <label className="form-label">City</label>
                <Select
                  options={cities}
                  value={cities.find((c) => c.value === clinic.city) || null}
                  onChange={handleCityChange}
                  isClearable
                  components={{ IndicatorSeparator: () => null }}
                />
              </div>

              {/* Country */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Country</label>
                <Select
                  options={countryOptions}
                  value={
                    countryOptions.find((c) => c.value === clinic.country) ||
                    null
                  }
                  onChange={handleCountryChange}
                  isClearable
                  components={{ IndicatorSeparator: () => null }}
                />
              </div>

              {/* Map Link */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Map Address Link</label>
                <input
                  type="text"
                  className="form-control"
                  name="map_link"
                  value={clinic.map_link}
                  onChange={handleChange}
                />
              </div>

              {/* Working Hours */}
              <h6 className="mt-4 mb-3">Working Hours (24-hour)</h6>
              {Object.keys(hours).map((day) => (
                <div className="col-md-6 mb-3" key={day}>
                  <label className="form-label text-capitalize">
                    {day}{" "}
                    <input
                      type="checkbox"
                      checked={hours[day].enquire}
                      onChange={() => handleEnquireToggle(day)}
                      className="ms-2 me-1"
                    />
                    Unavailable
                  </label>

                  {!hours[day].enquire && (
                    <div className="d-flex gap-2">
                      <input
                        type="time"
                        className="form-control"
                        value={hours[day].start}
                        onChange={(e) =>
                          handleHourChange(day, "start", e.target.value)
                        }
                      />
                      <span className="align-self-center">to</span>
                      <input
                        type="time"
                        className="form-control"
                        value={hours[day].end}
                        onChange={(e) =>
                          handleHourChange(day, "end", e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Enquire Link */}
              {/* <div className="col-md-6 mb-3">
                <label className="form-label">Enquire Link</label>
                <input
                  type="text"
                  className="form-control"
                  name="enquire_link"
                  value={clinic.enquire_link}
                  onChange={handleChange}
                />
              </div> */}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => setEditingClinicId(null)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update Clinic"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateClinic;
