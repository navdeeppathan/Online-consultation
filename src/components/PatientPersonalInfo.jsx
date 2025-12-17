import React, { useEffect, useRef, useState } from "react";
import bgImage from "../assets/images/Background.png";
import sectionbg from "../assets/images/innerpagebanner.png";
import Select from "react-select";

import Footer from "../components/Footer";
import axios from "axios";
import { IconButton, TextField, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
// import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Config from "../config";
import toast, { Toaster } from "react-hot-toast";
import HeaderTwo from "../components/Headertwo";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import "bootstrap/dist/css/bootstrap.min.css";
import CircularProgress from "@mui/material/CircularProgress";
import useFetchApi from "./useFetchApi";
import { Modal, Spinner } from "react-bootstrap";

const steps = [
  "Personal Information",
  "Professional Registration",
  "Qualifications",
  "Employment & Work Status",

  "Declarations & Consent",
];

const PatientPersonalInfo = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await axios.get(
          `${Config.BASE_URL}/api/profile/${userData?.id}`
        );
        const profile = res.data;
        console.log("profiledata:-", profile);

        if (profile?.role !== "patient") {
          localStorage.clear();
          navigate("/", { replace: true }); // replace prevents back navigation
        } else if (profile?.step === "5" && profile?.isResidence === 1) {
          navigate("/dashboardpatient", { replace: true });
        } else if (profile?.step === "3" && profile?.isResidence === 0) {
          navigate("/dashboardpatient", { replace: true });
        } else {
          navigate("/patient-information", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        localStorage.clear();
        navigate("/", { replace: true });
      }
    };

    checkProfile();
  }, []);

  return (
    <>
      <Toaster />

      <div
        className="backgroundimage"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          minHeight: "100%",
        }}
      >
        <HeaderTwo />
        <div className="">
          <div
            className="section-container"
            style={{
              backgroundImage: `url(${sectionbg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100%",
            }}
          >
            <h1 className="headingtext">
              For accurate treatment and
              <br />
              observation, please fill in your details
              <br />
              and book your slot.
            </h1>
          </div>
        </div>

        <div className="">
          <PatientRegistrationForm userData={userData} />
        </div>

        <Footer />
      </div>

      <style>
        {`

.my-heading {
 
  font-weight: 600;
  font-size: 24px;
  line-height: 42px;
  letter-spacing: 0;
  color: #464646;
}

.my-title {
  
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0;
  color: #464646;
}

.my-text-danger {

  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: #ff0000; /* danger red */
  margin-left: 2px;
}



/* Hide the default radio input */
.custom-radio-label input[type="radio"] {
  display: none;
}

/* Custom radio outer circle */
.custom-radio {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
  cursor: pointer;
  vertical-align: middle;
  transition: border 0.2s ease;
}

/* Inner filled circle when checked */
.custom-radio-label input[type="radio"]:checked + .custom-radio::after {
  content: "";
  width: 10px;   /* same width and height for perfect circle */
  height: 10px;
  background-color: #4169e1; /* Blue fill */
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* center it perfectly */
}



/* Container wrapper */
.search-box {
  display: flex;
  justify-content: center;
  padding: 0 20px;
  margin-top: 30px;
}

/* Search group containing location + input + button */
.search-input-group {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  padding: 2px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  max-width: 700px;
  width: 100%;
  gap: 10px;
}

/* Location block */
.location {
  display: flex;
  align-items: center;
  // background-color: #e0eaf3;
  background-color: #F5FAFF;

  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  white-space: nowrap;
}

.location img {
  height: 18px;
  margin-right: 6px;
}

/* Input field */
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 10px;
  min-width: 100px;
}

/* Search button */
.search-button {
  background-color: #22d3aa;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button img {
  height: 16px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .search-box {
    padding: 0 10px;
  }

  .search-input-group {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .location,
  .search-input,
  .search-button {
    width: 100%;
  }

  .search-input {
    font-size: 14px;
  }

  .search-button {
    justify-content: center;
  }

  .headingtext {
    font-size: 22px;
    line-height: 32px;
    text-align: center;
  }
}


.section-container {

  padding: 80px 20px;
  // border-radius: 20px;
  // margin-top: 20px;
  text-align: center;
// background: linear-gradient(to right,rgb(210, 234, 247) , #badcf0 )
}

.headingtext {
  font-size: 36px;
  font-weight: 600;
  color: #333;
  line-height: 48px;
  margin-bottom: 20px;
}

.highlight-number {
  color: blue;
  font-weight: 500;
}




/* Responsive styles */
@media (max-width: 768px) {
  .headingtext {
    font-size: 22px;
    line-height: 32px;
  }

  
}

            `}
      </style>
    </>
  );
};

const PatientRegistrationForm = ({ userData }) => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const ukCodes = [
    { value: "020", label: "020" },
    { value: "0113", label: "0113" },
    { value: "0114", label: "0114" },
    { value: "0115", label: "0115" },
    { value: "0116", label: "0116" },
    { value: "0117", label: "0117" },
    { value: "0118", label: "0118" },
    { value: "0121", label: "0121" },
    { value: "0131", label: "0131" },
    { value: "0141", label: "0141" },
    { value: "0151", label: "0151" },
    { value: "0161", label: "0161" },
    { value: "0191", label: "0191" },
    { value: "01792", label: "01792" },
    { value: "01865", label: "01865" },
    { value: "01902", label: "01902" },
    { value: "028", label: "028" },
    { value: "029", label: "029" },
    { value: "01273", label: "01273" },
    { value: "01274", label: "01274" },
  ];

  const [selectedCode, setSelectedCode] = useState(ukCodes[0]);

  // adjust as per your form
  const [formData, setFormData] = useState({
    residency: "", // Step 1

    title: "", // Step 2 - dropdown value
    otherTitle: "", // Step 2 - only if "Other" is selected
    firstName: "", // Step 2
    middleName: "", // Step 2
    lastName: "", // Step 2
    dob: "", // Step 2

    telephone: "", // Step 3
    mobile: "", // Step 3
    email: "", // Step 3
    address: "",
    postcode: "",
    county: "",

    city: "", // Step 3

    // Step 4 (Medical Info)
    nhsNumber: "",
    gpSurgeryName: "",
    gpSurgeryAddress: "",

    // Step 5 (Pharmacy Info)
    pharmacyName: "",
    pharmacyEmail: "",
    pharmacyAddress: "",

    // Step 6
    conditions: [
      { id: null, condition_name: "" }, // instead of just ""
    ],

    medications: [
      { id: null, medication_name: "" }, // instead of just ""
    ],

    // Step 7

    language: "",
    interpreter: "",

    //4-visitor
    // Visit Information
    purpose: "", // radio (Holiday, Business, Other)
    date_of_entry: "", // date input
    duration: "", // dropdown (1 week, 2 weeks, etc.)
  });

  const [cities, setCities] = useState([]);
  const [counties, setCounties] = useState([]);

  useEffect(() => {
    axios
      .get(`${Config.BASE_URL}/api/cities`)
      .then((response) => {
        const cityOptions = response.data?.data.map((item) => ({
          value: item.city_name,
          label: item.city_name,
        }));
        setCities(cityOptions);
      })
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  // Fetch counties
  useEffect(() => {
    axios
      .get(`${Config.BASE_URL}/api/counties`)
      .then((res) => {
        const countyOptions = res.data?.data.map((item) => ({
          value: item.county_name,
          label: item.county_name,
        }));
        setCounties(countyOptions);
      })
      .catch((err) => console.error("Error fetching counties:", err));
  }, []);

  let totalSteps = 5;
  totalSteps = formData.residency === "visitor" ? 5 : 3;

  const { data: profile, loading } = useFetchApi("profile", userData?.id);
  const { data: profile2 } = useFetchApi("medical-info", userData?.id);
  const { data: profile3 } = useFetchApi("conditions", userData?.id);
  const { data: profile4 } = useFetchApi("medications", userData?.id);
  const { data: profile5 } = useFetchApi("visits", userData?.id);

  console.log("profile", profile5);

  // Prefill from API
  useEffect(() => {
    if (profile || profile2) {
      setFormData({
        residency: profile.isResidence === 0 ? "resident" : "visitor",
        // Step 2
        title: profile.title || "",
        firstName: profile.firstname || "",
        middleName: profile.middlename || "",
        lastName: profile.lastname || "",
        dob: profile.date_of_birth || "",
        // Step 3
        telephone: profile.telephone_number || "",
        mobile: profile.mobile_number || "",
        email: profile.email || "",
        address: profile.address || "",
        postcode: profile.postcode || "",
        county: profile.county || "",
        city: profile.city || "",
        // Step 4
        nhsNumber: profile2?.data?.nhs_num || "",
        gpSurgeryName: profile2?.data?.gp_surgery_name || "",
        gpSurgeryAddress: profile2?.data?.gp_surgery_address || "",

        // Step 5
        pharmacyName: profile2?.data?.pharmacy_name || "",
        pharmacyEmail: profile2?.data?.pharmacy_email || "",
        pharmacyAddress: profile2?.data?.pharmacy_address || "",

        // Step 6
        conditions: profile3?.data.map((condition) => ({
          id: condition.id,
          condition_name: condition.condition_name,
        })),
        medications: profile4?.data.map((medication) => ({
          id: medication.id,
          medication_name: medication.medication_name,
        })),

        // Step 7
        language: profile2?.data?.language || "",
        interpreter: profile2?.data?.interpreter || "",

        //ster4-visitor
        // Visit Information
        purpose: profile5?.data?.purpose || "", // radio (Holiday, Business, Other)
        date_of_entry: profile5?.data?.date_of_entry || "", // date input
        duration: profile5?.data?.duration || "", // dropdown (1 week, 2 weeks, etc.)
      });
      setStep(Number(profile?.step) || 1);
    }
  }, [profile]);

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleNext = async () => {
    // Step 1 submit logic
    if (step === 1) {
      setLoading2(true);
      try {
        const payload = {
          isResidence: formData.residency === "resident" ? 0 : 1,
          step: "1",
        };

        await axios.post(
          `${Config.BASE_URL}/api/profile/update/${userData.id}`,
          payload
        );

        console.log("Residency updated:", payload);
      } catch (error) {
        console.error("Error saving residency:", error);
        toast.error("Failed to save residency");
        return; // stop going to next step if API fails
      } finally {
        setLoading2(false);
      }
    }

    // Step 2 submit logic (Personal Info)
    if (step === 2) {
      if (!formData.title) {
        toast.error("Title is required");
        return;
      }
      if (!formData.firstName) {
        toast.error("First name is required");
        return;
      }
      if (!formData.lastName) {
        toast.error("Last name is required");
        return;
      }
      if (!formData.dob) {
        toast.error("Date of birth is required");
        return;
      }

      setLoading2(true);
      try {
        const payload = {
          title:
            formData.title === "Other" ? formData.otherTitle : formData.title,
          firstname: formData.firstName,
          middlename: formData.middleName,
          lastname: formData.lastName,
          date_of_birth: formData.dob,
          step: "2",
        };

        await axios.post(
          `${Config.BASE_URL}/api/profile/update/${userData.id}`,
          payload
        );

        toast.success("Personal info updated successfully");
        console.log("Personal info updated:", payload);
      } catch (error) {
        console.error("Error saving personal info:", error);
        toast.error("Failed to save personal info");
        return; // stop going to next step if API fails
      } finally {
        setLoading2(false);
      }
    }

    if (step === 3) {
      if (formData.residency === "resident") {
        if (!formData.mobile) {
          toast.error("Mobile number is required");
          return;
        }
        if (!formData.email) {
          toast.error("Email is required");
          return;
        }
        if (!formData.address) {
          toast.error("Address is required");
          return;
        }
        if (!formData.city) {
          toast.error("City is required");
          return;
        }
        if (!formData.postcode) {
          toast.error("Postcode is required");
          return;
        }

        setLoading2(true);
        try {
          const payload = {
            telephone_number: `${selectedCode.value} ${formData.telephone}`,
            mobile_number: formData.mobile,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            postcode: formData.postcode,
            county: formData.county,
            country: "United Kingdom",
            step: "3",
          };

          console.log("payload:-", payload);

          await axios.post(
            `${Config.BASE_URL}/api/profile/update/${userData.id}`,
            payload
          );

          toast.success("Contact info updated successfully");
          console.log("Contact info updated:", payload);
          navigate("/dashboardpatient");
        } catch (error) {
          console.error("Error saving contact info:", error);
          toast.error("Failed to save contact info");
          return;
        } finally {
          setLoading2(false);
        }
      }

      if (formData.residency === "visitor") {
        if (!formData.mobile) {
          toast.error("Mobile number is required");
          return;
        }
        if (!formData.email) {
          toast.error("Email is required");
          return;
        }

        setLoading2(true);
        try {
          const payload = {
            telephone_number: formData.telephone,
            mobile_number: formData.mobile,
            email: formData.email,
            step: "3",
          };

          await axios.post(
            `${Config.BASE_URL}/api/profile/update/${userData.id}`,
            payload
          );

          toast.success("Contact info updated successfully");
          console.log("Contact info updated:", payload);
        } catch (error) {
          console.error("Error saving contact info:", error);
          toast.error("Failed to save contact info");
          return;
        } finally {
          setLoading2(false);
        }
      }
    }

    // Step 4 submit logic (Medical Information)
    if (step === 4) {
      if (formData.residency === "resident") {
        try {
          if (!formData.nhsNumber) {
            toast.error("NHS number is required");
            return;
          }

          if (!formData.gpSurgeryName) {
            toast.error("GP surgery name is required");
            return;
          }

          if (!formData.gpSurgeryAddress) {
            toast.error("GP surgery address is required");
            return;
          }

          setLoading2(true);
          const payload = {
            user_id: userData.id,
            nhs_num: formData.nhsNumber,
            gp_surgery_name: formData.gpSurgeryName,
            gp_surgery_address: formData.gpSurgeryAddress,
          };

          const stepPayload = {
            step: "4",
          };

          if (profile2?.data?.id) {
            await axios.put(
              `${Config.BASE_URL}/api/medical-info/${profile2?.data?.id}`,
              payload
            );
          } else {
            await axios.post(`${Config.BASE_URL}/api/medical-info`, payload);
          }

          await axios.post(
            `${Config.BASE_URL}/api/profile/update/${userData.id}`,
            stepPayload
          );

          toast.success("Medical info saved successfully");
          console.log("Medical info updated:", payload);
        } catch (error) {
          console.error("Error saving medical info:", error);
          toast.error("Failed to save medical info");
          return;
        } finally {
          setLoading2(false);
        }
      }
      if (formData.residency == "visitor") {
        if (!formData.date_of_entry) {
          toast.error("Date of entry is required");
          return;
        }
        if (!formData.purpose) {
          toast.error("Purpose is required");
          return;
        }
        if (!formData.duration) {
          toast.error("Duration is required");
          return;
        }
        if (!formData.address) {
          toast.error("Address is required");
          return;
        }
        if (!formData.city) {
          toast.error("City is required");
          return;
        }
        if (!formData.postcode) {
          toast.error("Postcode is required");
          return;
        }

        try {
          setLoading2(true);
          const payload = {
            user_id: userData.id,
            date_of_entry: formData.date_of_entry,
            purpose: formData.purpose,
            duration: formData.duration,
          };

          const stepPayload = {
            address: formData.address,
            city: formData.city,
            postcode: formData.postcode,
            county: formData.county,
            step: "4",
          };

          if (profile5?.data?.id) {
            await axios.put(
              `${Config.BASE_URL}/api/visits/${profile5?.data?.id}`,
              payload
            );
          } else {
            await axios.post(`${Config.BASE_URL}/api/visits`, payload);
          }

          await axios.post(
            `${Config.BASE_URL}/api/profile/update/${userData.id}`,
            stepPayload
          );

          toast.success("Visiting info saved successfully");
          console.log("Visiting info updated:", payload);
        } catch (error) {
          console.error("Error visiting info:", error);
          toast.error("Failed to save visiting info");
          return;
        } finally {
          setLoading2(false);
        }
      }
    }

    // Step 5 submit logic (Pharmacy Info)
    if (step === 5) {
      if (formData.residency === "resident") {
        try {
          setLoading2(true);
          const payload = {
            pharmacy_name: formData.pharmacyName,
            pharmacy_email: formData.pharmacyEmail,
            pharmacy_address: formData.pharmacyAddress,
            user_id: userData.id,
          };

          const stepPayload = {
            step: "5",
          };

          if (profile2?.data?.id) {
            await axios.put(
              `${Config.BASE_URL}/api/medical-info/${profile2?.data?.id}`,
              payload
            );
          } else {
            await axios.post(`${Config.BASE_URL}/api/medical-info`, payload);
          }

          await axios.post(
            `${Config.BASE_URL}/api/profile/update/${userData.id}`,
            stepPayload
          );

          toast.success("Pharmacy info saved successfully");
          navigate("/dashboardpatient");

          console.log("Pharmacy info updated:", payload);
        } catch (error) {
          console.error("Error saving pharmacy info:", error);
          toast.error("Failed to save pharmacy info");
          return;
        } finally {
          setLoading2(false);
        }
      }

      if (formData.residency == "visitor") {
        if (!formData.gpSurgeryName) {
          toast.error("GP surgery name is required");
          return;
        }
        if (!formData.gpSurgeryAddress) {
          toast.error("GP surgery address is required");
          return;
        }
        try {
          setLoading2(true);
          const payload = {
            user_id: userData.id,

            gp_surgery_name: formData.gpSurgeryName,
            gp_surgery_address: formData.gpSurgeryAddress,
          };

          const stepPayload = {
            step: "5",
          };

          if (profile2?.data?.id) {
            await axios.put(
              `${Config.BASE_URL}/api/medical-info/${profile2?.data?.id}`,
              payload
            );
          } else {
            await axios.post(`${Config.BASE_URL}/api/medical-info`, payload);
          }

          await axios.post(
            `${Config.BASE_URL}/api/profile/update/${userData.id}`,
            stepPayload
          );

          toast.success("Medical info saved successfully");
          console.log("Medical info updated:", payload);
          navigate("/dashboardpatient");
        } catch (error) {
          console.error("Error saving medical info:", error);
          toast.error("Failed to save medical info");
          return;
        } finally {
          setLoading2(false);
        }
      }
    }

    // Step 6 submit logic (Health Background)
    if (step === 6) {
      if (formData.residency === "resident") {
        if (
          formData.conditions.some((c) => c.condition_name.trim() === "") ||
          formData.medications.some((c) => c.medication_name.trim() === "")
        ) {
          toast.error("Atleast one condition or medication is required");
          return;
        }

        setLoading2(true);
        try {
          const payload = {
            conditions: formData.conditions
              .filter((c) => c.condition_name.trim() !== "")
              .map((c) => ({
                id: c.id ?? null, // include id for updates
                user_id: userData.id,
                condition_name: c.condition_name,
              })),
          };

          const medicationPayload = {
            medications: formData.medications
              .filter((c) => c.medication_name.trim() !== "")
              .map((c) => ({
                id: c.id ?? null, // include id for updates
                user_id: userData.id,
                medication_name: c.medication_name,
              })),
          };

          const stepPayload = {
            step: "6",
          };

          await axios.post(`${Config.BASE_URL}/api/conditions`, payload);

          await axios.post(
            `${Config.BASE_URL}/api/medications`,
            medicationPayload
          );

          await axios.post(
            `${Config.BASE_URL}/api/profile/update/${userData.id}`,
            stepPayload
          );
          console.log("Conditions submitted:", payload);
          toast.success("Conditions & medications saved successfully");
          navigate("/dashboardpatient");
        } catch (error) {
          console.error("Error saving conditions:", error);
          toast.error("Failed to save diagnosed conditions");
        } finally {
          setLoading2(false);
        }
      }

      if (formData.residency == "visitor") {
        try {
          setLoading2(true);
          const payload = {
            pharmacy_name: formData.pharmacyName,
            pharmacy_email: formData.pharmacyEmail,
            pharmacy_address: formData.pharmacyAddress,
            user_id: userData.id,
          };

          const stepPayload = {
            step: "6",
          };

          if (profile2?.data?.id) {
            await axios.put(
              `${Config.BASE_URL}/api/medical-info/${profile2?.data?.id}`,
              payload
            );
          } else {
            await axios.post(`${Config.BASE_URL}/api/medical-info`, payload);
          }

          await axios.post(
            `${Config.BASE_URL}/api/profile/update/${userData.id}`,
            stepPayload
          );

          toast.success("Pharmacy info saved successfully");

          console.log("Pharmacy info updated:", payload);
        } catch (error) {
          console.error("Error saving pharmacy info:", error);
          toast.error("Failed to save pharmacy info");
          return;
        } finally {
          setLoading2(false);
        }
      }
    }

    // if (step === 7) {
    //   // if (formData.residency === "resident") {
    //   //   if (formData.interpreter === "yes" && !formData.language) {
    //   //     toast.error("Please fill all required fields");
    //   //     return;
    //   //   }
    //   //   try {
    //   //     setLoading2(true);

    //   //     const payload = {
    //   //       language: formData.interpreter === "yes" ? formData.language : null,
    //   //       interpreter: formData.interpreter,
    //   //       user_id: userData.id,
    //   //     };

    //   //     const stepPayload = {
    //   //       step: "7",
    //   //     };

    //   //     if (profile2?.data?.id) {
    //   //       await axios.put(
    //   //         `${Config.BASE_URL}/api/medical-info/${profile2?.data?.id}`,
    //   //         payload
    //   //       );
    //   //     } else {
    //   //       await axios.post(`${Config.BASE_URL}/api/medical-info`, payload);
    //   //     }

    //   //     await axios.post(
    //   //       `${Config.BASE_URL}/api/profile/update/${userData.id}`,
    //   //       stepPayload
    //   //     );

    //   //     toast.success("Language support info saved successfully");
    //   //     navigate("/dashboardpatient");
    //   //     console.log("Language support updated:", payload);
    //   //   } catch (error) {
    //   //     console.error("Error saving language support info:", error);
    //   //     toast.error("Failed to save language support info");
    //   //     return;
    //   //   } finally {
    //   //     setLoading2(false);
    //   //   }
    //   // }
    //   if (formData.residency == "visitor") {
    //     if (
    //       formData.conditions.some((c) => c.condition_name.trim() === "") ||
    //       formData.medications.some((c) => c.medication_name.trim() === "")
    //     ) {
    //       toast.error("Atleast one condition or medication is required");
    //       return;
    //     }

    //     setLoading2(true);
    //     try {
    //       const payload = {
    //         conditions: formData.conditions
    //           .filter((c) => c.condition_name.trim() !== "")
    //           .map((c) => ({
    //             id: c.id ?? null, // include id for updates
    //             user_id: userData.id,
    //             condition_name: c.condition_name,
    //           })),
    //       };

    //       const medicationPayload = {
    //         medications: formData.medications
    //           .filter((c) => c.medication_name.trim() !== "")
    //           .map((c) => ({
    //             id: c.id ?? null, // include id for updates
    //             user_id: userData.id,
    //             medication_name: c.medication_name,
    //           })),
    //       };

    //       const stepPayload = {
    //         step: "7",
    //       };

    //       await axios.post(`${Config.BASE_URL}/api/conditions`, payload);

    //       await axios.post(
    //         `${Config.BASE_URL}/api/medications`,
    //         medicationPayload
    //       );

    //       await axios.post(
    //         `${Config.BASE_URL}/api/profile/update/${userData.id}`,
    //         stepPayload
    //       );
    //       console.log("Conditions submitted:", payload);
    //       toast.success("Conditions & medications saved successfully");
    //       navigate("/dashboardpatient");
    //     } catch (error) {
    //       console.error("Error saving conditions:", error);
    //       toast.error("Failed to save diagnosed conditions");
    //     } finally {
    //       setLoading2(false);
    //     }
    //   }
    // }

    // Normal step navigation
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // final step submit logic
      console.log("Final submit with:", formData);
    }
  };

  const [lastLoad, setLastLoad] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.residency === "resident") {
      if (
        formData.conditions.some((c) => c.condition_name.trim() === "") ||
        formData.medications.some((c) => c.medication_name.trim() === "")
      ) {
        toast.error("Atleast one condition or medication is required");
        return;
      }

      setLastLoad(true);
      try {
        const payload = {
          conditions: formData.conditions
            .filter((c) => c.condition_name.trim() !== "")
            .map((c) => ({
              id: c.id ?? null, // include id for updates
              user_id: userData.id,
              condition_name: c.condition_name,
            })),
        };

        const medicationPayload = {
          medications: formData.medications
            .filter((c) => c.medication_name.trim() !== "")
            .map((c) => ({
              id: c.id ?? null, // include id for updates
              user_id: userData.id,
              medication_name: c.medication_name,
            })),
        };

        // const stepPayload = {
        //   step: "6",
        // };

        await axios.post(`${Config.BASE_URL}/api/conditions`, payload);

        await axios.post(
          `${Config.BASE_URL}/api/medications`,
          medicationPayload
        );

        // await axios.post(
        //   `${Config.BASE_URL}/api/profile/update/${userData.id}`,
        //   stepPayload
        // );
        console.log("Conditions submitted:", payload);
        toast.success("Conditions & medications saved successfully");
        // navigate("/dashboardpatient");
        handleClose();
      } catch (error) {
        console.error("Error saving conditions:", error);
        toast.error("Failed to save diagnosed conditions");
      } finally {
        setLastLoad(false);
      }
    }

    if (formData.residency == "visitor") {
      if (
        formData.conditions.some((c) => c.condition_name.trim() === "") ||
        formData.medications.some((c) => c.medication_name.trim() === "")
      ) {
        toast.error("Atleast one condition or medication is required");
        return;
      }

      setLastLoad(true);
      try {
        const payload = {
          conditions: formData.conditions
            .filter((c) => c.condition_name.trim() !== "")
            .map((c) => ({
              id: c.id ?? null, // include id for updates
              user_id: userData.id,
              condition_name: c.condition_name,
            })),
        };

        const medicationPayload = {
          medications: formData.medications
            .filter((c) => c.medication_name.trim() !== "")
            .map((c) => ({
              id: c.id ?? null, // include id for updates
              user_id: userData.id,
              medication_name: c.medication_name,
            })),
        };

        // const stepPayload = {
        //   step: "7",
        // };

        await axios.post(`${Config.BASE_URL}/api/conditions`, payload);

        await axios.post(
          `${Config.BASE_URL}/api/medications`,
          medicationPayload
        );

        // await axios.post(
        //   `${Config.BASE_URL}/api/profile/update/${userData.id}`,
        //   stepPayload
        // );
        console.log("Conditions submitted:", payload);
        toast.success("Conditions & medications saved successfully");
        // navigate("/dashboardpatient");
        handleClose();
      } catch (error) {
        console.error("Error saving conditions:", error);
        toast.error("Failed to save diagnosed conditions");
      } finally {
        setLastLoad(false);
      }
    }
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="container d-flex justify-content-center align-items-center my-4 pb-4">
      <div
        className="card w-100"
        style={{
          maxWidth: "859px",
          padding: "30px",
          borderRadius: "20px",
          border: "none",
          backgroundColor: "#FFFFFF",
        }}
      >
        <h4
          style={{
            fontWeight: 600,
            fontSize: "26px",
            textAlign: "center",
            color: "#464646",
          }}
          className="mb-4"
        >
          Patient Registration Form
        </h4>

        {/* Progress Bar */}
        <div
          className="progress mb-4 position-relative"
          style={{
            height: "15px",
            borderRadius: "10px",
            backgroundColor: "#F1F1F1",
            display: "flex", // ✅ use flex so they sit side by side
            overflow: "hidden",
          }}
        >
          {/* Completed steps (dark) */}
          <div
            style={{
              flex: step - 1,
              backgroundColor: "#70EFCD",
              transition: "flex 0.3s ease",
            }}
          ></div>

          {/* Current step (light) */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#E4F7F2",
              transition: "flex 0.3s ease",
            }}
          ></div>

          {/* Remaining steps (gray) */}
          <div
            style={{
              flex: totalSteps - step,
              backgroundColor: "#F1F1F1",
              transition: "flex 0.3s ease",
            }}
          ></div>

          {/* Step dividers */}
          {Array.from({ length: totalSteps - 1 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${((i + 1) / totalSteps) * 100}%`,
                width: "1px",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              }}
            ></div>
          ))}
        </div>

        <div className="mt-4 mb-4">
          {/* Step 1 */}
          {step === 1 && (
            <div className="text-center">
              <h5 className="mb-5 my-heading">Choose one option:</h5>
              <div className="d-flex justify-content-center gap-4">
                <div className="form-check">
                  <label className="custom-radio-label">
                    <input
                      type="radio"
                      name="residency"
                      value="resident"
                      checked={formData.residency === "resident"}
                      onChange={(e) =>
                        setFormData({ ...formData, residency: e.target.value })
                      }
                    />
                    <span className="custom-radio"></span>
                    Resident in the UK
                  </label>
                </div>

                <div className="form-check">
                  <label className="custom-radio-label">
                    <input
                      type="radio"
                      name="residency"
                      value="visitor"
                      checked={formData.residency === "visitor"}
                      onChange={(e) =>
                        setFormData({ ...formData, residency: e.target.value })
                      }
                    />
                    <span className="custom-radio"></span>
                    Visitor{" "}
                    <span className="text-muted">(Vacation / Business)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {formData.residency == "resident" && (
            <>
              {/* Step 2 Example */}
              {step === 2 && (
                <div>
                  <h2 className="text-center mb-4 my-heading">
                    Personal Information
                  </h2>

                  <div className="row ">
                    {/* Title Dropdown */}
                    <div className="col-md-4 mb-4">
                      <label className="my-title">
                        Title
                        <span className="my-text-danger">*</span>
                      </label>

                      <select
                        className="form-select"
                        value={formData.title || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      >
                        <option value="">Select Title</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                        <option value="Master">Master</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* If "Other" is selected */}
                    {formData.title === "Other" && (
                      <div className="col-md-8 mb-4">
                        <label className="form-label my-title">
                          Other Title
                        </label>
                        <input
                          type="text"
                          className="form-control custom-placeholder"
                          placeholder="Enter your title"
                          value={formData.otherTitle || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              otherTitle: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>

                  {/* Name Fields */}
                  <div className="row">
                    <div className="col-md-4 mb-4">
                      <label className="my-title">
                        First Name
                        <span className="my-text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control custom-placeholder"
                        placeholder="First Name"
                        value={formData.firstName || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-md-4 mb-4">
                      <label className="form-label my-title">Middle Name</label>
                      <input
                        type="text"
                        className="form-control custom-placeholder"
                        placeholder="Middle Name"
                        value={formData.middleName || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            middleName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-md-4 mb-4">
                      <label className="my-title">
                        Last Name
                        <span className="my-text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control custom-placeholder"
                        placeholder="Last Name"
                        value={formData.lastName || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="row">
                    <div className="col-md-4 mb-4">
                      <label className="form-label my-title">
                        Date of Birth
                        <span className="my-text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.dob || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, dob: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 Example */}
              {step === 3 && (
                <div>
                  {/* Section Title */}
                  <h4 className="mb-4 text-center my-heading">
                    Address & Contact Details
                  </h4>

                  <div className="container">
                    {/* Telephone + Mobile */}
                    <div className="row mb-3">
                      {/* Home Telephone Number */}
                      <div className="col-md-6">
                        <label className="form-label my-title">
                          Home Telephone Number
                        </label>
                        <div className="row">
                          {/* <div className="col-4">
                            <input
                              type="text"
                              className="form-control"
                              value="020"
                              disabled
                            />
                          </div> */}
                          <div className="col-4">
                            <Select
                              options={ukCodes}
                              value={selectedCode}
                              onChange={(selectedOption) =>
                                setSelectedCode(selectedOption)
                              }
                              placeholder="Select Code"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  borderColor: "#ced4da",
                                  minHeight: "30px",
                                  fontSize: "14px",
                                }),
                                option: (base, state) => ({
                                  ...base,
                                  backgroundColor: state.isSelected
                                    ? "#4C6BE9"
                                    : state.isFocused
                                    ? "#eef1ff"
                                    : "white",
                                  color: state.isSelected ? "white" : "#000",
                                }),
                              }}
                              components={{
                                IndicatorSeparator: () => null, // removes vertical line
                              }}
                            />
                          </div>
                          <div className="col-8">
                            <input
                              type="text"
                              className="form-control custom-placeholder"
                              placeholder="Tel Number"
                              value={formData.telephone}
                              maxLength={10}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  telephone: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Mobile Number */}
                      <div className="col-md-6">
                        <label className="form-label my-title">
                          Mobile Number <span className="text-danger">*</span>
                        </label>
                        <div className="row">
                          <div className="col-4">
                            <input
                              type="text"
                              className="form-control"
                              value="+44"
                              disabled
                            />
                          </div>
                          <div className="col-8">
                            <input
                              type="text"
                              className="form-control custom-placeholder"
                              placeholder="Mobile Number"
                              value={formData.mobile}
                              maxLength={10}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  mobile: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="row mb-3">
                      <div className="col-12">
                        <label className="form-label my-title">
                          Email Address <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control custom-placeholder"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className=" my-4">
                      <h5
                        style={{
                          fontWeight: 700,
                          fontSize: "18px",
                          lineHeight: "20px",
                          letterSpacing: "0",
                          color: "#464646",
                        }}
                        className="mb-3"
                      >
                        Address in the UK
                      </h5>

                      {/* Address */}
                      <div className="row mb-3">
                        <div className="col-12">
                          <label className="form-label my-title">
                            Address <span className="text-danger">*</span>
                          </label>
                          <textarea
                            className="form-control custom-placeholder"
                            placeholder="Address in the UK"
                            rows={3} // adjust height as needed
                            value={formData.address}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                address: e.target.value,
                              })
                            }
                          ></textarea>
                        </div>
                      </div>

                      {/* Town/City & County */}
                      <div className="row">
                        {/* <div className="col-md-6 mb-3">
                          <label className="form-label my-title">
                            Town/City<span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select custom-placeholder"
                            value={formData.city}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                city: e.target.value,
                              })
                            }
                          >
                            <option value="" disabled>
                              Select Town/City
                            </option>
                            <option value="London">London</option>
                            <option value="Manchester">Manchester</option>
                            <option value="Birmingham">Birmingham</option>
                          </select>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label my-title">County</label>
                          <select
                            className="form-select custom-placeholder"
                            value={formData.county}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                county: e.target.value,
                              })
                            }
                          >
                            <option value="" disabled>
                              Select County
                            </option>
                            <option value="Essex">Essex</option>
                            <option value="Kent">Kent</option>
                            <option value="Surrey">Surrey</option>
                          </select>
                        </div> */}

                        <div className="col-md-4 mb-3">
                          <label className="form-label my-title">
                            Town/City <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={cities}
                            value={
                              cities.find((c) => c.value === formData.city) ||
                              null
                            }
                            onChange={(selectedOption) =>
                              setFormData({
                                ...formData,
                                city: selectedOption?.value || "",
                              })
                            }
                            placeholder="Select Town/City"
                            isClearable
                            components={{
                              IndicatorSeparator: () => null, // removes vertical line
                            }}
                          />
                        </div>

                        <div className="col-md-4 mb-3">
                          <label className="form-label my-title">County</label>
                          <Select
                            options={counties}
                            value={
                              counties.find(
                                (c) => c.value === formData.county
                              ) || null
                            }
                            onChange={(selectedOption) =>
                              setFormData({
                                ...formData,
                                county: selectedOption?.value || "",
                              })
                            }
                            placeholder="Select County"
                            isClearable
                            components={{
                              IndicatorSeparator: () => null, // removes vertical line
                            }}
                          />
                        </div>
                        {/* Postcode */}
                        <div className="col-md-4  mb-3 ">
                          <label className="form-label my-title">
                            Postcode <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control custom-placeholder"
                            placeholder="Enter postcode"
                            value={formData.postcode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                postcode: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* {step === 4 && (
                <div>
                  <h4 className="mb-4 text-center my-heading">
                    Medical Information
                  </h4>

                  <div className="container">
                  
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label my-title">
                          NHS Number
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control custom-placeholder"
                          placeholder="NHS Number"
                          value={formData.nhsNumber}
                          maxLength={10}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nhsNumber: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label my-title">
                          GP Surgery Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control custom-placeholder"
                          placeholder="GP Surgery Name"
                          value={formData.gpSurgeryName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              gpSurgeryName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                   
                    <div className="row mb-3">
                      <div className="col-12">
                        <label className="form-label my-title">
                          GP Surgery Address{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control custom-placeholder"
                          placeholder="GP Surgery Address"
                          value={formData.gpSurgeryAddress}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              gpSurgeryAddress: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )} */}

              {/* {step === 5 && (
                <div>
                  <h4 className="mb-4 text-center my-heading">
                    Pharmacy Details{" "}
                    <span className="text-muted" style={{ fontWeight: "400" }}>
                      (For Prescriptions)
                    </span>
                  </h4>

                  <div className="container">
                 
                    <div className="row mb-3">
                      <div className="col-12">
                        <label className="form-label my-title">
                          Pharmacy Name
                        </label>
                        <input
                          type="text"
                          className="form-control custom-placeholder"
                          placeholder="Pharmacy Name"
                          value={formData.pharmacyName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pharmacyName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-12">
                        <label className="form-label my-title">
                          Pharmacy Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control custom-placeholder"
                          placeholder="Pharmacy Email Address"
                          value={formData.pharmacyEmail}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pharmacyEmail: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                  
                    <div className="row mb-3">
                      <div className="col-12">
                        <label className="form-label my-title">
                          Pharmacy Address
                        </label>
                        <input
                          type="text"
                          className="form-control custom-placeholder"
                          placeholder="Pharmacy Address"
                          value={formData.pharmacyAddress}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pharmacyAddress: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleShow();
                    }}
                    className="text-primary"
                  >
                    Current Medications If any ↗
                  </a>
                  <Modal show={show} onHide={handleClose} size="lg" centered>
                    <Modal.Header closeButton>
                      <Modal.Title>Current Medications</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Step6HealthBackground
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        onClick={handleSubmit}
                        style={{
                          backgroundColor: "#007bff", 
                          borderColor: "#007bff",
                          color: "#fff",
                        }}
                        disabled={lastLoad}
                      >
                        {lastLoad && (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        )}
                        Submit
                      </Button>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              )} */}

              {/* {step == 6 && (
                <>
                  <Step6HealthBackground
                    formData={formData}
                    setFormData={setFormData}
                  />
                </>
              )} */}

              {/* {step === 7 && (
                <div style={{ marginTop: "30px" }}>
                 
                  <h5 className="mb-4 text-center my-heading">
                    Language Support
                  </h5>

                 
                  <p className=" my-title">
                    Do you need a language interpreter?
                  </p>

                 
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <label>
                      <input
                        type="radio"
                        name="interpreter"
                        value="yes"
                        checked={formData.interpreter === "yes"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            interpreter: e.target.value,
                          })
                        }
                      />{" "}
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="interpreter"
                        value="no"
                        checked={formData.interpreter === "no"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            interpreter: e.target.value,
                          })
                        }
                      />{" "}
                      No
                    </label>
                  </div>

                  
                  {formData.interpreter === "yes" && (
                    <div>
                      <label style={{ display: "block", marginBottom: "5px" }}>
                        Select Language <span style={{ color: "red" }}>*</span>
                      </label>
                      <select
                        className="form-control"
                        value={formData.language || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, language: e.target.value })
                        }
                      >
                        <option value="">-- Select Language --</option>
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="hindi">Hindi</option>
                       
                      </select>
                    </div>
                  )}
                </div>
              )} */}
            </>
          )}

          {formData.residency == "visitor" && (
            <>
              {step === 2 && (
                <div>
                  <h2 className="text-center mb-4 my-heading">
                    Personal Information
                  </h2>

                  <div className="row ">
                    {/* Title Dropdown */}
                    <div className="col-md-4 mb-4">
                      <label className="my-title">
                        Title
                        <span className="my-text-danger">*</span>
                      </label>

                      <select
                        className="form-select"
                        value={formData.title || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      >
                        <option value="">Select Title</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                        <option value="Master">Master</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* If "Other" is selected */}
                    {formData.title === "Other" && (
                      <div className="col-md-8 mb-4">
                        <label className="form-label my-title">
                          Other Title
                        </label>
                        <input
                          type="text"
                          className="form-control custom-placeholder"
                          placeholder="Enter your title"
                          value={formData.otherTitle || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              otherTitle: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>

                  {/* Name Fields */}
                  <div className="row">
                    <div className="col-md-4 mb-4">
                      <label className="my-title">
                        First Name
                        <span className="my-text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control custom-placeholder"
                        placeholder="First Name"
                        value={formData.firstName || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-md-4 mb-4">
                      <label className="form-label my-title">Middle Name</label>
                      <input
                        type="text"
                        className="form-control custom-placeholder"
                        placeholder="Middle Name"
                        value={formData.middleName || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            middleName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-md-4 mb-4">
                      <label className="my-title">
                        Last Name
                        <span className="my-text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control custom-placeholder"
                        placeholder="Last Name"
                        value={formData.lastName || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="row">
                    <div className="col-md-4 mb-4">
                      <label className="form-label my-title">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.dob || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, dob: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 Example */}
              {step === 3 && (
                <div>
                  {/* Section Title */}
                  <h4 className="mb-4 text-center my-heading">
                    Contact Details
                  </h4>

                  <div className="container">
                    {/* Telephone + Mobile */}
                    <div className="row mb-3">
                      {/* Mobile Number */}
                      <div className="col-md-12">
                        <label className="form-label my-title">
                          Mobile Number <span className="text-danger">*</span>
                        </label>
                        <div className="row">
                          <div className="col-3">
                            <input
                              type="text"
                              className="form-control"
                              value="+44"
                              disabled
                            />
                          </div>
                          <div className="col-9">
                            <input
                              type="text"
                              className="form-control custom-placeholder"
                              placeholder="Mobile Number"
                              value={formData.mobile}
                              maxLength={10}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  mobile: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="row mb-3">
                      <div className="col-12">
                        <label className="form-label my-title">
                          Email Address <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control custom-placeholder"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  {/* Section Title */}
                  <h4 className="mb-4 text-center my-heading">
                    Visit Information
                  </h4>

                  <div className="container">
                    {/* Purpose of Visit */}
                    {/* Purpose of Visit */}
                    <div className="row mb-3">
                      <div className="col-12">
                        <label className="form-label my-title">
                          Purpose of Visit{" "}
                          <span className=" my-text-danger">*</span>
                        </label>
                        <div className="d-flex gap-4">
                          {["Holiday", "Business", "Other"].map((option) => (
                            <label
                              key={option}
                              className="d-flex custom-radio-label align-items-center gap-2"
                            >
                              <input
                                type="radio"
                                name="purpose"
                                value={option}
                                checked={formData.purpose === option}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    purpose: e.target.value,
                                  })
                                }
                              />
                              <span className="custom-radio"></span>
                              {option}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Date of Entry + Duration */}
                    <div className="row mb-3">
                      {/* Date of Entry */}
                      <div className="col-md-6">
                        <label className="form-label my-title">
                          Date of Entry in the UK{" "}
                          <span className="my-text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control custom-placeholder"
                          value={formData.date_of_entry}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              date_of_entry: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Duration */}
                      <div className="col-md-6">
                        <label className="form-label my-title">
                          Duration of Visit{" "}
                          <span className="my-text-danger">*</span>
                        </label>
                        <select
                          className="form-select custom-placeholder"
                          value={formData.duration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              duration: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Duration</option>
                          <option value="1 Week">1 Week</option>
                          <option value="2 Weeks">2 Weeks</option>
                          <option value="3 Weeks">3 Weeks</option>
                          <option value="1 Month">1 Month</option>
                          <option value="2 Months">2 Months</option>
                          <option value="3 Months">3 Months</option>
                        </select>
                      </div>
                    </div>

                    <div className=" my-4">
                      <h5
                        style={{
                          fontWeight: 700,
                          fontSize: "18px",
                          lineHeight: "20px",
                          letterSpacing: "0",
                          color: "#464646",
                        }}
                        className="mb-3"
                      >
                        Current Address
                      </h5>

                      {/* Address */}
                      <div className="row mb-3">
                        <div className="col-12">
                          <label className="form-label my-title">
                            Address <span className="text-danger">*</span>
                          </label>
                          <textarea
                            className="form-control custom-placeholder"
                            placeholder="Address in the UK"
                            rows={3} // adjust height as needed
                            value={formData.address}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                address: e.target.value,
                              })
                            }
                          ></textarea>
                        </div>
                      </div>

                      {/* Town/City & County */}
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label my-title">
                            Town/City <span className="text-danger">*</span>
                          </label>
                          <Select
                            options={cities}
                            value={
                              cities.find((c) => c.value === formData.city) ||
                              null
                            }
                            onChange={(selectedOption) =>
                              setFormData({
                                ...formData,
                                city: selectedOption?.value || "",
                              })
                            }
                            placeholder="Select Town/City"
                            isClearable
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label my-title">County</label>
                          <Select
                            options={counties}
                            value={
                              counties.find(
                                (c) => c.value === formData.county
                              ) || null
                            }
                            onChange={(selectedOption) =>
                              setFormData({
                                ...formData,
                                county: selectedOption?.value || "",
                              })
                            }
                            placeholder="Select County"
                            isClearable
                          />
                        </div>
                      </div>

                      {/* Postcode */}
                      <div className="mb-3 ">
                        <label className="form-label my-title">
                          Postcode <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control custom-placeholder"
                          placeholder="Enter postcode"
                          value={formData.postcode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              postcode: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h4 className="mb-4 text-center my-heading">
                    Healthcare Information
                  </h4>

                  <div className="container">
                    {/* NHS Number + GP Surgery Name */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label my-title">
                          Closest GP Name
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control custom-placeholder"
                          placeholder="GP Surgery Name"
                          value={formData.gpSurgeryName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              gpSurgeryName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* GP Surgery Address */}
                    <div className="row mb-3">
                      <div className="col-12">
                        <label className="form-label my-title">
                          GP Surgery Address{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control custom-placeholder"
                          placeholder="GP Surgery Address"
                          value={formData.gpSurgeryAddress}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              gpSurgeryAddress: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleShow();
                      }}
                      className="text-primary"
                    >
                      Current Medications If any ↗
                    </a>
                    <Modal show={show} onHide={handleClose} size="lg" centered>
                      <Modal.Header closeButton>
                        <Modal.Title>Current Medications</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Step6HealthBackground
                          formData={formData}
                          setFormData={setFormData}
                        />
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          onClick={handleSubmit}
                          style={{
                            backgroundColor: "#007bff", // Bootstrap primary blue
                            borderColor: "#007bff",
                            color: "#fff",
                          }}
                          disabled={lastLoad}
                        >
                          {lastLoad && (
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          )}
                          Submit
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div>
                  <h4 className="mb-4 text-center my-heading">
                    Pharmacy Details{" "}
                    <span className="text-muted" style={{ fontWeight: "400" }}>
                      (For Prescriptions)
                    </span>
                  </h4>

                  <div className="container">
                    {/* Pharmacy Name */}
                    <div className="row mb-3">
                      <div className="col-12">
                        <label className="form-label my-title">
                          Pharmacy Name
                        </label>
                        <input
                          type="text"
                          className="form-control custom-placeholder"
                          placeholder="Pharmacy Name"
                          value={formData.pharmacyName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pharmacyName: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Pharmacy Email */}
                    <div className="row mb-3">
                      <div className="col-12">
                        <label className="form-label my-title">
                          Pharmacy Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control custom-placeholder"
                          placeholder="Pharmacy Email Address"
                          value={formData.pharmacyEmail}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pharmacyEmail: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Pharmacy Address */}
                    <div className="row mb-3">
                      <div className="col-12">
                        <label className="form-label my-title">
                          Pharmacy Address
                        </label>
                        <input
                          type="text"
                          className="form-control custom-placeholder"
                          placeholder="Pharmacy Address"
                          value={formData.pharmacyAddress}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              pharmacyAddress: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step == 7 && (
                <>
                  <Step6HealthBackground
                    formData={formData}
                    setFormData={setFormData}
                  />
                </>
              )}
            </>
          )}
        </div>

        <div className="d-flex justify-content-between mt-5">
          {/* Previous Button */}
          <button
            className="btn"
            style={{
              borderRadius: "999px",
              border: "1px solid #3366FF",
              backgroundColor: "transparent",
              color: "#3366FF",
              padding: "8px 20px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            disabled={step === 1}
            onClick={handlePrevious}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 14 }} /> Previous
          </button>

          {/* Next / Submit Button */}
          <button
            className="btn"
            style={{
              borderRadius: "999px",
              backgroundColor: loading ? "#99BBFF" : "#3366FF",
              color: "#fff",
              padding: "8px 20px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: "none",
            }}
            onClick={handleNext}
            disabled={(step === 1 && !formData.residency) || loading2} // require residency at step 1
          >
            {loading2 ? (
              <CircularProgress size={18} sx={{ color: "#fff" }} />
            ) : step === totalSteps ? (
              "Submit"
            ) : (
              <>
                Next <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Step6HealthBackground = ({ formData, setFormData }) => {
  // Ensure at least one field exists
  const conditions = formData.conditions?.length
    ? formData.conditions
    : [{ id: null, condition_name: "" }];
  const medications = formData.medications?.length
    ? formData.medications
    : [{ id: null, medication_name: "" }];

  const handleConditionChange = (index, value) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], condition_name: value };
    setFormData({ ...formData, conditions: updated });
  };

  const handleMedicationChange = (index, value) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], medication_name: value };
    setFormData({ ...formData, medications: updated });
  };

  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...conditions, { id: null, condition_name: "" }],
    });
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...medications, { id: null, medication_name: "" }],
    });
  };

  const deleteCondition = async (index) => {
    const conditionToDelete = conditions[index];

    if (conditionToDelete?.id) {
      try {
        await axios.delete(
          `${Config.BASE_URL}/api/conditions/${conditionToDelete.id}`
        );
      } catch (error) {
        console.error("Failed to delete condition", error);
      }
    }

    const updated = conditions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      conditions:
        updated.length > 0 ? updated : [{ id: null, condition_name: "" }],
    });
  };

  const deleteMedication = async (index) => {
    const medicationToDelete = medications[index];

    if (medicationToDelete?.id) {
      try {
        await axios.delete(
          `${Config.BASE_URL}/api/medications/${medicationToDelete.id}`
        );
      } catch (error) {
        console.error("Failed to delete medication", error);
      }
    }

    const updated = medications.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      medications:
        updated.length > 0 ? updated : [{ id: null, medication_name: "" }],
    });
  };

  return (
    <div className="step-container">
      <h4 className="text-center my-heading mb-4">Health Condition</h4>

      {/* Diagnosed Conditions */}
      <div className="mb-4">
        <label className="form-label my-title fw-bold">
          Precondition Health
        </label>
        {conditions.map((condition, index) => (
          <div
            key={index}
            className="d-flex align-items-center mb-2"
            style={{ gap: "10px" }}
          >
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              value={condition.condition_name || ""}
              onChange={(e) => handleConditionChange(index, e.target.value)}
              placeholder="Enter condition"
            />
            <IconButton
              color="error"
              onClick={() => deleteCondition(index)}
              disabled={conditions.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <Button
            variant="text"
            onClick={addCondition}
            startIcon={
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>+</span>
            }
            sx={{
              borderRadius: "999px",
              border: "1px solid #E0E0E0",
              mt: 1,
              px: 2,
              textTransform: "none",
            }}
          >
            Add More
          </Button>
        </div>
      </div>

      {/* Current Medications */}
      <div className="mb-4">
        <label className="form-label my-title fw-bold">
          Current Medications If any
        </label>
        {medications.map((medication, index) => (
          <div
            key={index}
            className="d-flex align-items-center mb-2"
            style={{ gap: "10px" }}
          >
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              value={medication.medication_name || ""}
              onChange={(e) => handleMedicationChange(index, e.target.value)}
              placeholder="Enter medication"
            />
            <IconButton
              color="error"
              onClick={() => deleteMedication(index)}
              disabled={medications.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <Button
            variant="text"
            onClick={addMedication}
            startIcon={
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>+</span>
            }
            sx={{
              borderRadius: "999px",
              border: "1px solid #E0E0E0",
              mt: 1,
              px: 2,
              textTransform: "none",
            }}
          >
            Add More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientPersonalInfo;
