import React, { use, useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Select from "react-select";
import Navbar from "../Navbar";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
import "react-calendar/dist/Calendar.css";
import Config from "../../../config";
import imageone from "../../../assets/admin/Group 1324.png";
import imagetwo from "../../../assets/admin/Rectangle 2388.png";
import imagetree from "../../../assets/admin/9112769_clinic_medical_solid_icon 1.png";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";
const EarningPayment = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  const DoctorID = userData?.id;

  const [data, setData] = useState({
    monthly_data: {},
    users: [],
    doctors: [],
  });

  const [selectedMonth, setSelectedMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (!userData?.id || userData.role !== "doctor") return;

    axios
      .get(`${Config.BASE_URL}/api/monthly-spent`, {
        params: { doctor_id: userData.id },
      })
      .then((response) => {
        const res = response.data || {};
        const monthlyArray = res.monthly_data || [];

        // Convert array to object with month as key
        const monthMap = {};
        monthlyArray.forEach((item) => {
          monthMap[item.month] = item;
        });

        const currentMonthKey = new Date().toISOString().slice(0, 7);

        // Get all months >= current month and sort them
        const sortedKeys = Object.keys(monthMap)
          .filter((m) => m >= currentMonthKey)
          .sort();

        // Set state
        setData({
          monthly_data: monthMap,
          users: res.users || [],
          doctors: res.doctors || [],
        });

        setPatients(res.users || []);
        setAvailableMonths(sortedKeys);

        // Set default selected month
        setSelectedMonth(sortedKeys[0] || currentMonthKey);
      });
  }, []);

  // Get data for selected month
  const monthly = data?.monthly_data?.[selectedMonth] || {
    video: 0,
    "In-Person": 0,
    total: 0,
    percentages: {
      video: "0%",
      "In-Person": "0%",
    },
  };

  const chartData = {
    labels: ["Video", "In-Person"],
    datasets: [
      {
        data: [monthly.video, monthly["In-Person"]],
        backgroundColor: ["#407bff", "#70EFCD"],
        hoverOffset: 10,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label;
            const value = tooltipItem.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
    cutout: "70%",
  };

  const [clinics, setClinics] = useState([]); // clinics list from API
  const [loading, setLoading] = useState(true); // optional loader
  const [error, setError] = useState(null); // optional error handler
  const [inPersonFees, setInPersonFees] = useState([]);
  const [PaymentData, setPaymentData] = useState([]);
  const [yodocchargePersent, setYocdocChargePersent] = useState("");
  useEffect(() => {
    Allclinic();
    Alldoctor();
    BankDataDetails();
    AllPayment();
  }, []);

  const Allclinic = () => {
    axios
      .get(`${Config.BASE_URL}/api/doctor-fees/by-doctor/${DoctorID}`)
      .then((res) => {
        setInPersonFees(res.data.fees.inPerson || []);
      })
      .catch((error) => console.error(error));
  };

  const AllPayment = () => {
    axios
      .get(`${Config.BASE_URL}/api/orders/user/${DoctorID}`)
      .then((res) => {
        console.log("res of payment:-", res.data);
        setPaymentData(res.data || []);
      })
      .catch((error) => console.error(error));
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const itemsPerPage = 5;

  // Filter data based on created_at
  const filteredData = PaymentData?.filter((item) => {
    if (!fromDate && !toDate) return true;

    const itemDate = new Date(item.created_at);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    if (from && to) return itemDate >= from && itemDate <= to;
    if (from) return itemDate >= from;
    if (to) return itemDate <= to;
    return true;
  });

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const currentData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const [virtualData, setVirtualData] = useState([]);
  const Alldoctor = () => {
    axios
      .get(`${Config.BASE_URL}/api/doctor/${DoctorID}`)
      .then((res) => {
        setYocdocChargePersent(
          res.data?.data?.yodoc_charges[0]?.charge_amount || "null"
        );
        setVirtualData(res.data?.data?.doctor?.fees?.virtual[0] || "null");
        console.log(
          "res.data?.data?.doctor?.virtual[0] ",
          res.data?.data?.doctor?.fees?.virtual[0]
        );
      })
      .catch((error) => console.error(error));
  };
  const [clinicdata, setClinicsdata] = useState([]);

  useEffect(() => {
    axios
      .get(`${Config.BASE_URL}/api/clinics/by-doctor/${userData.id}`)
      .then((resp) => {
        if (resp.data.success) {
          const options = resp.data.data.map((clinic) => ({
            value: clinic.name,
            label: clinic.name,
            address: clinic.address,
            postal_code: clinic.city,
          }));
          setClinicsdata(options);
        }
      })
      .catch((error) => console.error("Error fetching clinics:", error));
  }, []);

  const [forms, setForms] = useState([
    {
      clinic: "",
      consultationFees: "",
      yodocCharges: "",
      doctorReceives: "",
      address: "",
      postcode: "",
    },
  ]);

  const handleChange = (index, field, value) => {
    const updatedForms = [...forms];
    updatedForms[index][field] = value;

    if (field === "consultationFees") {
      const fee = parseFloat(value) || 0;
      const yodocCharge = ((fee * yodocchargePersent) / 100).toFixed(2);
      const doctorReceives = (fee - yodocCharge).toFixed(2);

      updatedForms[index]["yodocCharges"] = yodocCharge;
      updatedForms[index]["doctorReceives"] = doctorReceives;
    }

    setForms(updatedForms);
  };

  console.log("formdata:-", forms);

  const addForm = () => {
    setForms((prev) => [
      ...prev,
      {
        clinic: "",
        consultationFees: "",
        yodocCharges: "",
        doctorReceives: "",
        address: "",
        postcode: "",
      },
    ]);
  };

  const removeForm = (indexToRemove) => {
    setForms((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async () => {
    const isValid = forms.some(
      (form) =>
        form.clinic?.trim() &&
        form.address?.trim() &&
        form.consultationFees &&
        !isNaN(Number(form.consultationFees)) &&
        Number(form.consultationFees) > 0
    );

    if (!isValid) {
      toast.error("Please fill in at least one complete clinic entry.");
      return;
    }

    try {
      const payload = {
        doctor_id: DoctorID,
        fee_type: "inPerson",
        clinics: forms.map((form) => {
          const consultationFees = Number(form.consultationFees) || 0;
          const yodocCharge = (
            (consultationFees * yodocchargePersent) /
            100
          ).toFixed(2);
          const doctorReceives = (consultationFees - yodocCharge).toFixed(2);

          return {
            clinic_name: form.clinic,
            address: form.address,
            postcode: form.postcode,
            amount: consultationFees,
            yodoc_charge: yodocCharge,
            deductions_fees: doctorReceives,
            currency: "£",
            description: "General consult",
            effective_date: new Date().toISOString().split("T")[0],
            status: true,
          };
        }),
      };

      await axios.post(`${Config.BASE_URL}/api/doctor-fees/inperson`, payload);

      toast.success("Saved successfully!");
      Allclinic();
      setForms([
        {
          clinic: "",
          consultationFees: "",
          yodocCharges: "",
          doctorReceives: "",
          address: "",
          postcode: "",
        },
      ]);
    } catch (error) {
      console.error("Error posting data:", error);
      toast.error(
        error.response.data.message ||
          "Error saving fees. Check console for details."
      );
    }
  };

  const [consultationFees, setConsultationFees] = useState(0);
  const [virtualFeeId, setVirtualFeeId] = useState(null); // for PUT update

  // Load existing fee from API
  useEffect(() => {
    if (virtualData && virtualData.amount) {
      setConsultationFees(parseFloat(virtualData.amount));
      setVirtualFeeId(virtualData.id); // assign ID for PUT
    }
  }, [virtualData]);

  // Charges calculation
  const yodocCharge = (
    (parseFloat(consultationFees) || 0) *
    (yodocchargePersent / 100)
  ).toFixed(2);
  const totalAmount = (
    (parseFloat(consultationFees) || 0) - parseFloat(yodocCharge)
  ).toFixed(2);

  // Submit handler
  const handleSaveVirtual = async () => {
    try {
      const payload = {
        doctor_id: DoctorID,
        fee_type: "virtual",
        amount: consultationFees,
        currency: "£",
        description: "Video consult",
        yodoc_charge: yodocCharge,
        deductions_fees: totalAmount,
        effective_date: new Date().toISOString().split("T")[0],
        status: true,
      };

      await axios.post(`${Config.BASE_URL}/api/doctor-fees/virtual`, payload);
      toast.success("Virtual fees saved successfully!");
    } catch (error) {
      console.error("Error saving virtual fees:", error);
      toast.error("Error saving virtual fees.");
    }
  };

  const [bankDetails, setBankDetails] = useState({
    user_id: DoctorID,
    account_holder_name: "",
    bank_name: "",
    account_number: "",
    sort_code: "",
    iban: "",
    swift_bic: "", // Use correct key as per backend
  });

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "user_id",
      "account_holder_name",
      "bank_name",
      "account_number",
      "sort_code",
    ];
    const missing = requiredFields.find((field) => !bankDetails[field]);

    if (missing) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://api.yodoc.co.uk/api/bank-details/store",
        bankDetails
      );
      toast.success("Bank details saved successfully!");
      BankDataDetails();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to save bank details."
      );
    }
  };

  const [bankData, setBankData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // useEffect(() => {
  //   axios
  //     .get(`https://api.yodoc.co.uk/api/bank-details?user_id=${DoctorID}`)
  //     .then((res) => {
  //       if (res.data.success && res.data.data) {
  //         setBankData(res.data.data);
  //       } else {
  //         setBankData(null);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching bank data", err);
  //       setBankData(null);
  //     });
  // }, [DoctorID]);

  const BankDataDetails = () => {
    axios
      .get(`https://api.yodoc.co.uk/api/bank-details?user_id=${DoctorID}`)
      .then((res) => {
        if (res.data.success && res.data.data) {
          setBankData(res.data.data);
        } else {
          setBankData(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching bank data", err);
        setBankData(null);
      });
  };

  const [deleteLoading, setDeleteLoading] = useState(false);
  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      // Optional: call your API to delete the record
      await axios.delete(`${Config.BASE_URL}/api/doctor-fees/${id}`);

      // Remove from local state

      toast.success("Clinic deleted successfully");
      Allclinic();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete clinic");
    } finally {
      setDeleteLoading(false);
    }
  };

  const [show, setShow] = useState(false);

  return (
    <>
      <Toaster />

      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 content-area">
          <Navbar />
          <div className=" bgcolor  p-3">
            <div className="d-flex align-item-center justify-content-between">
              <h3>Earning & Payment</h3>
              <button
                onClick={() => setShow((prev) => !prev)} // ✅ toggle true/false each click
                className="btn btn-primary mb-3"
              >
                {show ? "Hide Consultation Fees" : "Add Consultation Fees"}
              </button>
            </div>

            <div className="row">
              <div className="col-lg-12">
                {show && (
                  <>
                    <div className="card p-4 mb-4 ">
                      <h5>Your Virtual Consultation Fee/Charges</h5>
                      <p>
                        {" "}
                        As a practitioner, you can set your own consultation
                        fee. Please note that a fixed platform service fee of{" "}
                        <br />
                        £5 will be added on top of your fee, which the patient
                        will see as the total payable amount during booking.
                      </p>

                      <div className="form-row">
                        <div className="form-group col-md-4">
                          <label>Video Consultation Fees</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">GBP</span>
                            </div>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              // min="0"
                              value={consultationFees}
                              onChange={(e) =>
                                setConsultationFees(e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="form-group col-md-4">
                          <label>Yodoc Charges ({yodocchargePersent}%)</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">GBP</span>
                            </div>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={`- ${yodocCharge}`}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="form-group col-md-4">
                          <label>Total </label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">GBP</span>
                            </div>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={totalAmount}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="text-right mt-3">
                        <button
                          className="btn btn-primary"
                          onClick={handleSaveVirtual}
                          disabled={
                            isNaN(consultationFees) || consultationFees <= 0
                          }
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    <div className="card p-4 mb-4 ">
                      <div className="d-flex align-item-center justify-content-between">
                        <h5>In–Person/Hospital Fees</h5>
                        {/* <button
                          onClick={() => navigate("/admin/add-clinic")}
                          className="btn btn-primary"
                        >
                          Add Hospital
                        </button> */}
                      </div>

                      {forms.map((form, index) => (
                        <div
                          className="form-row align-items-end mb-3"
                          key={index}
                        >
                          {/* <div className="form-group col-md-4">
                        <label>Clinic/Hospital Name</label>
                        <input
                          className="form-control custom-placeholder"
                          value={form.clinic}
                          onChange={(e) =>
                            handleChange(index, "clinic", e.target.value)
                          }
                          placeholder="clinic/hospital"
                        />
                      </div> */}
                          <div className="form-group col-md-4">
                            <label>Hospital Name</label>
                            <Select
                              options={clinicdata}
                              value={
                                clinicdata.find(
                                  (option) => option.value === form.clinic
                                ) || null
                              }
                              onChange={(selectedOption) => {
                                if (selectedOption) {
                                  handleChange(
                                    index,
                                    "clinic",
                                    selectedOption.value
                                  );
                                  handleChange(
                                    index,
                                    "address",
                                    selectedOption.address || ""
                                  );
                                  handleChange(
                                    index,
                                    "postcode",
                                    selectedOption.postal_code || ""
                                  );
                                } else {
                                  handleChange(index, "clinic", "");
                                  handleChange(index, "address", "");
                                  handleChange(index, "postcode", "");
                                }
                              }}
                              placeholder="Select Hospital"
                              isSearchable
                              components={{
                                IndicatorSeparator: () => null,
                              }}
                            />
                          </div>

                          <div className="form-group col-md-4">
                            <label>Hospital Address</label>
                            <input
                              className="form-control custom-placeholder"
                              value={form.address}
                              onChange={(e) =>
                                handleChange(index, "address", e.target.value)
                              }
                              placeholder="address"
                              disabled={!form.clinic} // ⛔ disabled until a clinic is selected
                            />
                          </div>

                          <div className="form-group col-md-4">
                            <label>Area Name</label>
                            <input
                              className="form-control custom-placeholder"
                              value={form.postcode}
                              onChange={(e) =>
                                handleChange(index, "postcode", e.target.value)
                              }
                              placeholder="area name"
                              disabled={!form.clinic}
                            />
                          </div>

                          <div className="form-group col-md-4">
                            <label>Your Consultation Fees</label>
                            <div className="input-group">
                              <span className="input-group-text">£</span>
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                min="0"
                                value={form.consultationFees}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "consultationFees",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div className="form-group col-md-4">
                            <label>Yodoc Charges ({yodocchargePersent}%)</label>

                            <div className="input-group">
                              <span className="input-group-text">£</span>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={`-${form.yodocCharges}`}
                                readOnly
                              />
                            </div>
                          </div>

                          <div className="form-group col-md-3">
                            <label>Total</label>

                            <div className="input-group">
                              <span className="input-group-text">£</span>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={form.doctorReceives}
                                readOnly
                              />
                            </div>
                          </div>

                          {forms.length > 1 && (
                            <div className="form-group col-md-1 text-center">
                              <button
                                className="btn btn-danger"
                                onClick={() => removeForm(index)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="form-group text-right mt-3">
                        {/* <button
                          className="btn btn-secondary mr-2"
                          onClick={addForm}
                        >
                          Add More
                        </button> */}
                        <button
                          disabled={clinicdata.length === 0}
                          className="btn btn-primary"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                      </div>

                      {/* <table className="table clinic-table mt-4">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Clinic Name</th>
                        <th>Address</th>
                        <th>Aria/Branch Name</th>
                        <th>Your charges</th>
                        <th>You Receive</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inPersonFees.map((fee, index) => (
                        <tr key={fee.id}>
                          <td>{index + 1}</td>
                          <td>{fee.clinic_name}</td>

                          <td>
                            {fee.address?.split(" ").slice(0, 2).join(" ")}
                          </td>

                          <td>{fee.postcode}</td>
                          <td>
                            {fee.currency} {Number(fee.amount).toFixed(2)}
                          </td>
                          <td>
                            {fee.currency}{" "}
                            {Number(fee.deductions_fees).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table> */}

                      <div>
                        <div
                          className="tab-pane fade show active"
                          id="pills-all"
                          role="tabpanel"
                        >
                          <div className="table-responsive">
                            <table className="table table-striped custom-table approvedtable">
                              <thead>
                                <tr>
                                  <th>No</th>
                                  <th>Hospital Name</th>
                                  <th>Address</th>
                                  <th>Aria/Branch Name</th>
                                  <th>Your charges</th>
                                  <th>You Receive</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {inPersonFees.length > 0 ? (
                                  inPersonFees.map((fee, index) => (
                                    <tr key={fee.id}>
                                      <td>{index + 1}</td>
                                      <td>{fee.clinic_name}</td>
                                      <td>
                                        {fee.address
                                          ?.split(" ")
                                          .slice(0, 2)
                                          .join(" ")}
                                      </td>
                                      <td>{fee.postcode}</td>
                                      <td>
                                        {fee.currency}{" "}
                                        {Number(fee.amount).toFixed(2)}
                                      </td>
                                      <td>
                                        {fee.currency}{" "}
                                        {Number(fee.deductions_fees).toFixed(2)}
                                      </td>
                                      <td>
                                        <FaTrash
                                          style={{
                                            cursor: deleteLoading
                                              ? "not-allowed"
                                              : "pointer",
                                            color: "red",
                                            opacity: deleteLoading ? 0.5 : 1,
                                          }}
                                          onClick={() => {
                                            if (deleteLoading) return; // prevent multiple clicks
                                            if (
                                              window.confirm(
                                                "Are you sure you want to delete this clinic?"
                                              )
                                            ) {
                                              handleDelete(fee.id);
                                            }
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={6} className="text-center">
                                      No records found
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <style>
                        {`


                      .approvedtable tbody tr td:first-child {
                        border-top-left-radius: 20px;
                        border-bottom-left-radius: 20px;
                      }
                      .approvedtable tbody tr td:last-child {
                        border-top-right-radius: 20px;
                        border-bottom-right-radius: 20px;
                      }
                              
                      @media (min-width: 900px) and (max-width: 1370px) {
                        .approvedtable,
                        .approvedtable thead th,
                        .approvedtable tbody td,
                        .approvedtable button,
                        .approvedtable .btn {
                          font-size: 14px !important;
                          padding: 8px 10px; /* reduce cell padding */x
                        }

                        .approvedtable .avatar {
                          width: 25px;
                          height: 25px;
                        }

                        .approvedtable .btn {
                          font-size: 11px !important;
                          padding: 5px 6px;
                        }
                      }

                          .nav-pills .nav-link {
                            border-radius: 10px;
                            padding: 10px 25px;
                            font-weight: 600;
                            color: #000;
                            // background: #f1f1f1;
                            margin-right: 10px;
                          }

                          .nav-pills .nav-link.active {
                            background-color: #4c6be9;
                            color: white;
                          }

                          .custom-table {
                            background-color: white;
                            border-radius: 12px;
                            overflow: hidden;
                            // box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
                          }

                          .custom-table thead {
                            
                            font-weight: 600;
                          }

                          .custom-table td,
                          .custom-table th {
                            vertical-align: middle;
                            padding: 15px;
                          }

                          .d-flex.align-items-center {
                            display: flex;
                            align-items: center;
                          }

                      .custom-table thead th {
                        background-color: transparent !important;
                        font-size: 16px;
                        font-weight: 600;
                        color: #3a3a3a;
                        border-bottom: none;
                      }

                      .approved-row {
                        background-color: #f1faf4 !important;
                        border-radius: 20px;
                        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
                      }

                      .approved-row td {
                        vertical-align: middle;
                        border: none;
                        padding: 20px;
                      }

                      /* Table general transparency */
                      table {
                        background-color: transparent !important;
                        border-collapse: separate;
                        border-spacing: 0 2px;
                      }

                      .gray-bg {
                        background-color: #3d3d3d;
                      }


                      .custom-card {
                        border-radius: 15px;
                        background-color: #ffffff;
                        border: none;
                        transition: all 0.3s ease-in-out;
                      }

                      .custom-card:hover {
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                      }

                      .custom-card .card-title {
                        // font-size: 16px;
                        font-weight: 500;
                        margin-bottom: 0;
                      }

                      .content-area {
                        width: 100%;
                      }
                   `}
                      </style>
                    </div>

                    <div className="card p-4 mb-4 shadow-sm">
                      <h3>Add Your UK Bank Details</h3>
                      <p>
                        To receive your consultation payments, please provide
                        your UK bank account details below. This information is
                        securely stored and used only for processing payouts by
                        our platform.
                      </p>
                      <form onSubmit={handleBankSubmit}>
                        <div className="row mt-5">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">
                              Account Holder Name *
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="account_holder_name"
                              value={bankDetails.account_holder_name}
                              onChange={handleBankChange}
                              required
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="form-label">Bank Name *</label>
                            <input
                              type="text"
                              className="form-control"
                              name="bank_name"
                              value={bankDetails.bank_name}
                              onChange={handleBankChange}
                              required
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="form-label">
                              Account Number *
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="account_number"
                              value={bankDetails.account_number}
                              onChange={handleBankChange}
                              required
                            />
                          </div>

                          <div className="col-md-6 mb-3">
                            <label className="form-label">Sort Code *</label>
                            <input
                              type="text"
                              className="form-control"
                              name="sort_code"
                              value={bankDetails.sort_code}
                              onChange={handleBankChange}
                              required
                            />
                          </div>

                          {/* <div className="col-md-6 mb-3">
                        <label className="form-label">IBAN</label>
                        <input
                          type="text"
                          className="form-control"
                          name="iban"
                          value={bankDetails.iban}
                          onChange={handleBankChange}
                        />
                      </div> */}

                          {/* <div className="col-md-6 mb-3">
                        <label className="form-label">SWIFT / BIC</label>
                        <input
                          type="text"
                          className="form-control"
                          name="swift_bic"
                          value={bankDetails.swift_bic}
                          onChange={handleBankChange}
                        />
                      </div> */}
                        </div>

                        <div className="form-group text-right mt-3">
                          <button
                            type="submit"
                            className="btn btn-primary mt-2"
                          >
                            Add Card
                          </button>
                        </div>
                      </form>
                    </div>
                  </>
                )}
                {/* Payments Table */}
                <div className="card p-3">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
                    <h5 className="mb-2 mb-md-0">Payments</h5>
                    <div className="d-flex flex-column flex-md-row  align-items-center gap-2 ">
                      <input
                        type="date"
                        className="form-control"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                      to
                      <input
                        type="date"
                        className="form-control"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-borderless align-middle custom-table approvedtable">
                      <thead className="thead-light">
                        <tr>
                          <th>Patient Name</th>

                          <th>Order No.</th>
                          <th>Transaction No.</th>
                          <th>Payment Type</th>

                          {/* <th>Consultations</th> */}
                          {/* <th>Status</th> */}
                          {/* <th>Date Proceed</th> */}
                          <th>Amount</th>
                          <th>Payment Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData && currentData.length > 0 ? (
                          currentData.map((item, index) => (
                            <tr key={index}>
                              <td>
                                {item?.user
                                  ? `${item.user.firstname || ""} ${
                                      item.user.lastname || ""
                                    }`
                                  : "N/A"}
                              </td>
                              <td>{item.order_id}</td>
                              <td>{item.transaction_id}</td>
                              <td>{item.payment_type}</td>
                              <td>{item.amount}</td>
                              <td>
                                {item.created_at
                                  ? new Date(
                                      item.created_at
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "N/A"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center text-muted">
                              No data found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination */}
                  {PaymentData && PaymentData.length > itemsPerPage && (
                    <nav>
                      <ul className="pagination justify-content-center mt-3">
                        {[...Array(totalPages)].map((_, idx) => (
                          <li
                            key={idx}
                            className={`page-item ${
                              currentPage === idx + 1 ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(idx + 1)}
                            >
                              {idx + 1}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
                </div>
              </div>
              {/* <div className="col-md-4">
                <div className="card spend-summary-card shadow-sm p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">All Appointments</h6>
                  </div>

                  <div className="text-center">
                    
                    <div
                      style={{
                        width: 280,
                        height: 280,
                        position: "relative",
                        margin: "0 auto",
                      }}
                    >
                      <Doughnut data={chartData} options={chartOptions} />

                      
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          textAlign: "center",
                          lineHeight: "1.4",
                        }}
                      >
                        Total
                        <br />£{monthly.total}
                      </div>
                    </div>
                  </div>

                  <h6 className="mt-4">Completed Appointments</h6>
                  {patients && patients.length > 0
                    ? patients
                        .slice(0, 5)
                        .reverse()
                        .map((user) => (
                          <div
                            key={user.id}
                            className="completed-appointment mt-2 d-flex align-items-center"
                          >
                            <div className="row w-100 align-items-center">
                              <div className="col-lg-2">
                                <div className="icon blue-bg me-3">
                                  <img src={imagetree} alt="tree" />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <p className="mb-0 fw-bold">
                                  {user.firstname} {user.lastname || ""}
                                </p>
                                <small>
                                  
                                  {user.mobile_number}
                                </small>
                              </div>

                              
                              <div className="col-lg-3 text-end ms-auto">
                                <p className="mb-0 fw-bold"></p>
                              </div>
                            </div>
                          </div>
                        ))
                    : 
                      Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className="completed-appointment mt-2 d-flex align-items-center"
                        >
                          <div className="row w-100 align-items-center">
                            <div className="col-lg-2">
                              <div className="icon blue-bg me-3">
                                <img src={imagetree} alt="tree" />
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <p className="mb-0 fw-bold">
                                <img src={imageone} alt="one" />
                              </p>
                            </div>

                          
                            <div className="col-lg-3 text-end ms-auto">
                              <p className="mb-0 fw-bold">
                                <img src={imagetwo} alt="two" />
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div> */}
            </div>
            <br />
            <h6>Copyright © 2025 Yodoc UK All Rights Reserved.</h6>
          </div>
        </div>
      </div>

      <style>
        {`

          @media (min-width: 900px) and (max-width: 1370px) {
            .approvedtable,
  .approvedtable thead th,
  .approvedtable tbody td,
  .approvedtable button,
  .approvedtable .btn {
    font-size: 10px !important;
    padding: 4px 6px; /* reduce cell padding */
  }

  .approvedtable .avatar {
    width: 25px;
    height: 25px;
  }

  .approvedtable .btn {
    font-size: 11px !important;
    padding: 2px 6px;
  }
        }


.custom-table thead th {
  font-weight: 600;
  color: #888;
  background-color: #fff;
  padding: 12px;
}

.custom-table tbody td {
  padding: 14px 12px;
  vertical-align: middle;
  font-size: 14px;
  color: #333;
}

.custom-table tbody tr:not(:last-child) {
  border-bottom: 1px solid #fff;
}

.card {
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  background-color: white;
  border: none;
}
        
        .bank-card {
  background-color: #f9f9f9;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: 0.3s;
}

.bank-card.filled {
  background-color: #eaf3fb;
}

.bank-card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-icon {
  flex-shrink: 0;
}

.card-text-area {
  flex-grow: 1;
  padding: 0 20px;
  font-size:20px;
  text-align: left;
}

.bank-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.bank-subtext {
  font-size: 14px;
  color: #555;
  margin: 0;
}

.right-arrow {
  flex-shrink: 0;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  background: white;
  padding: 20px 30px;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
}

.clinic-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.clinic-table thead {
  background-color: #eaf3fb;
  font-weight: 600;
}

.clinic-table th,
.clinic-table td {
  padding: 12px 16px;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #f1f1f1;
}

.clinic-table tbody tr:last-child td {
  border-bottom: none;
}

.clinic-table td span {
  font-weight: 500;
  color: #555;
}


.bgcolor {
  background-color: #f9f9f9;
  border-radius: 10px;
}

.card {
  background: #fff;
  border: none;
  border-radius: 12px;
}

.price-label {
  font-size: 20px;
  background: #f0f4f8;
  padding: 8px 20px;
  border-radius: 8px;
  display: inline-block;
}

.badge-box {
  background: #eaf0f6;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  min-width: 220px;
}

.badge-box span {
  margin-left: auto;
  font-weight: bold;
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
  background: conic-gradient(
    #4a6cf7 65%,
    #2c2c2c 0 100%
  );
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

export default EarningPayment;
