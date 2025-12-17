import React, { useEffect, useRef, useState } from "react";
import bgImage from "../assets/images/Background.png";
import sectionbg from "../assets/images/innerpagebanner.png";
import searchicon from "../assets/images/searchicon.png";
import locationicon from "../assets/images/locationicon.png";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Config from "../config";
import toast, { Toaster } from "react-hot-toast";
import HeaderTwo from "../components/Headertwo";
import CircularProgress from "@mui/material/CircularProgress";
import AvailabilityConsultatonboard from "../adminpage/sidebar/adminallpage/AvailabilityConsultantonboard";
import { Editor } from "primereact/editor";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
const steps = [
  "Personal Information",
  "Professional Registration",
  "Qualifications",
  "Insurance Information",
  "Declarations & Consent",
];

const PersonalInformation = () => {
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);
  const [loading5, setLoading5] = useState(false);
  const [loading6, setLoading6] = useState(false);

  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("user")); // Convert string to object
  const userId = userData?.id;
  const Authtoken = localStorage.getItem("authToken");

  console.log("User ID:", userId, Authtoken);

  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  useEffect(() => {
    fetchProfileData();
    fetchDrDataCategory();
    AllDoctorStepData();
  }, [userId]);

  const [nationalities, setNationalities] = useState([]);
  const [cities, setCities] = useState([]);
  const [counties, setCounties] = useState([]);
  //countries
  useEffect(() => {
    // Call your Laravel API
    axios
      .get(`${Config.BASE_URL}/api/countries`) // replace with your actual URL
      .then((response) => {
        // Transform the data to fit react-select
        const options = response.data?.data.map((country) => ({
          value: country.country_name, // or country.name if you prefer
          label: country.country_name, // assuming your API returns country_name
        }));
        setNationalities(options);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  //cities
  useEffect(() => {
    // Fetch cities from API
    axios
      .get(`${Config.BASE_URL}/api/cities`)
      .then((response) => {
        // Transform API data for react-select
        const cityOptions = response.data?.data.map((item) => ({
          value: item.city_name,
          label: item.city_name,
        }));
        setCities(cityOptions);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
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

  const AllDoctorStepData = async () => {
    try {
      const response = await axios.get(
        `${Config.BASE_URL}/api/doctor_data/${userId}`
      );
      console.log("AllDoctorStepData", response.data?.data);
      const Alldata = response.data?.data;
      setFormData({
        full_name: Alldata.personal_information.full_name,
        date_of_birth: Alldata.personal_information.date_of_birth,
        gender: Alldata.personal_information.gender,
        nationality: Alldata.personal_information?.nationality,
        contact_number: Alldata.personal_information?.contact_number,
        email: Alldata.personal_information?.email,
        home_address: Alldata.personal_information?.home_address,
        languages: Alldata.personal_information?.languages
          ? JSON.parse(Alldata.personal_information?.languages)
          : [],
        city: Alldata.personal_information?.city,
        county: Alldata.personal_information?.county,
        postcode: Alldata.personal_information?.postcode,
        user_id: userId,
      });

      const specializationArray = (
        Alldata.professional_registration.specialization || []
      ).map((s) => ({
        value: s,
        label: s,
      }));

      const subCategoryArray = (
        Alldata.professional_registration.sub_category || []
      ).map((s) => ({
        value: s,
        label: s,
      }));

      setFormData1({
        user_id: userId,
        gmc_registration_number:
          Alldata.professional_registration.gmc_registration_number || "",
        gmc_registration_date:
          Alldata.professional_registration.gmc_registration_date || "",
        license_to_practice:
          Alldata.professional_registration.license_to_practice === "1"
            ? "yes"
            : "no",
        revalidation_date:
          Alldata.professional_registration.revalidation_date || "",
        // specialization: Alldata.professional_registration.specialization || "",
        // sub_category: Alldata.professional_registration.sub_category || "",
        specialization: specializationArray,
        sub_category: subCategoryArray,
        years_of_experience:
          Alldata.professional_registration.years_of_experience || "",
      });
      if (Alldata.qualifications?.length) {
        setQualifications(
          Alldata.qualifications.map((q) => ({
            degree: q.degree || "",
            institution: q.institution || "",
            country: q.country || "",
            year_completed: q.year_completed || "",
          }))
        );
      }

      const existingDocuments = {};
      Alldata.documents?.forEach((doc) => {
        existingDocuments[doc.document_type] = {
          file_path: doc.file_path,
          file_name: doc.file_path.split("/").pop(),
        };
      });

      setDocuments(existingDocuments);

      if (Alldata.employment_status) {
        setPreviousRoles(Alldata.employment_status.previous_roles || "");
        setNiNumber(Alldata.employment_status.national_insurance_number || "");
        setWorkStatus(Alldata.employment_status.work_status_uk || "UK Citizen");
        setRightToWork(Alldata.employment_status.right_to_work_uk === "1"); // true/false
      }

      if (Alldata.availability?.length) {
        setAvailability((prev) =>
          prev.map((slot) => {
            const match = Alldata.availability.find((a) => a.day === slot.day);
            if (match) {
              const [startHour, startMinute] = match.start_time.split(":");
              const [endHour, endMinute] = match.end_time.split(":");

              const to12Hour = (hour24) => {
                let hour = parseInt(hour24, 10);
                let period = hour >= 12 ? "PM" : "AM";
                if (hour > 12) hour -= 12;
                if (hour === 0) hour = 12;
                return { hour: hour.toString(), period };
              };
              const { hour: sh, period: sp } = to12Hour(startHour);
              const { hour: eh, period: ep } = to12Hour(endHour);

              return {
                ...slot,
                selected: true,
                startHour: sh,
                startMinute,
                startPeriod: sp,
                endHour: eh,
                endMinute,
                endPeriod: ep,
              };
            }
            return slot;
          })
        );

        // Consultation modes
        if (Alldata.availability[0]?.consultation_modes) {
          const modes = Alldata.availability[0].consultation_modes;
          setConsultModes({
            Virtual: modes.includes("virtual"),
            Phone: modes.includes("phone"),
            "In-Person": modes.includes("in-person"),
          });
        }

        // Preferred languages
        if (Alldata.availability[0]?.preferred_languages) {
          const selected = Alldata.availability[0].preferred_languages
            .map((lang) => languageOptions.find((opt) => opt.value === lang))
            .filter(Boolean); // make sure they exist
          setSelectedLanguages(selected);
        }
      }
      if (Alldata.declaration) {
        setConsents([
          Alldata.declaration.confirm_truth === "1",
          Alldata.declaration.consent_verify === "1",
          Alldata.declaration.consent_gdpr === "1",
          Alldata.declaration.insurance_valid === "1",
          Alldata.declaration.agree_gmc === "1",
        ]);
      }

      // setCategory(response.data);
    } catch (error) {
      console.error(
        "Error fetching category data:",
        error.response?.data || error.message
      );
    }
  };

  const [formData, setFormData] = useState({
    full_name: userData.firstname + " " + userData.lastname,
    date_of_birth: "",
    gender: "",
    nationality: "",
    contact_number: userData.mobile_number,
    email: userData.email,
    home_address: "",
    aboutus: userData.aboutus,
    user_id: userId,
    city: "",
    county: "",
    postcode: "",
    languages: [],

    //for insurance
    hasInsurance: false, // Yes/No radio → boolean
    insurer: "", // Insurer name (AXA, Bupa, etc.)
    policyNumber: "", // Policy number
    authCode: "",
    insurance_card_file_1: null,
  });
  const [allCategory, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // selected specialization

  const [formData1, setFormData1] = useState({
    user_id: userId,
    gmc_registration_number: "",
    gmc_registration_date: "",
    license_to_practice: "", // yes or no
    revalidation_date: "",
    specialization: [],
    sub_category: [],
    years_of_experience: "",
  });
  const fetchDrDataCategory = async () => {
    try {
      // const response = await axios.get(
      //   `${Config.BASE_URL}/api/allcategories_with_sub`
      // );
      const response = await axios.get(`${Config.BASE_URL}/api/specialties`);
      console.log("categories:-----", response.data);
      setCategory(response.data?.data);
    } catch (error) {
      console.error(
        "Error fetching category data:",
        error.response?.data || error.message
      );
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(
        `${Config.BASE_URL}/api/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${Authtoken}`,
          },
        }
      );

      console.log("Profile Data:", response.data);

      // Access the step value
      const step = response.data.step;
      console.log("User Step:", step);

      setActiveIndex(Number(step));

      // Mark previous steps as completed
      const completed = Array.from({ length: Number(step) }, (_, i) => i);
      setCompletedSteps(completed);
    } catch (error) {
      console.error(
        "Error fetching profile data:",
        error.response?.data || error.message
      );
    }
  };

  // const handleChange = (e) => {
  //   const { id, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [id]: value,
  //   }));
  // };

  const handleChange = (e, customId = null) => {
    if (e && e.target) {
      // For normal inputs
      const { id, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    } else {
      // For react-select
      setFormData((prevData) => ({
        ...prevData,
        [customId]: e.value,
      }));
    }
  };

  // const handleChange1 = (e) => {
  //   const { name, value } = e.target;

  //   setFormData1((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));

  //   if (name === "specialization") {
  //     setSelectedCategory(value); // update selected category
  //     setFormData1((prev) => ({
  //       ...prev,
  //       sub_category: "", // reset sub_category when category changes
  //     }));
  //   }
  // };

  const handleChange1 = (e) => {
    const { name, options, type, value } = e.target;

    if (type === "select-multiple") {
      const selectedValues = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);

      setFormData1((prev) => ({
        ...prev,
        [name]: selectedValues,
      }));
    } else {
      setFormData1((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const [availableLanguages, setAvailableLanguages] = useState([]);

  useEffect(() => {
    axios
      .get(`${Config.BASE_URL}/api/languages`)
      .then((res) => {
        if (res.data.status && Array.isArray(res.data.data)) {
          // convert API data to ["English", "Hindi", "French", ...]
          const langs = res.data.data.map((item) => item.language_name);
          setAvailableLanguages(langs);
        }
      })
      .catch((err) => console.error("Error fetching languages:", err));
  }, []);

  // Convert language list into react-select option format
  const languageOptions2 = availableLanguages.map((lang) => ({
    value: lang,
    label: lang,
  }));

  const handleEditorChange = (e) => {
    setFormData({ ...formData, aboutus: e.htmlValue });
  };
  const handleLanguageChange = (selectedOptions) => {
    const selectedLanguages = selectedOptions
      ? selectedOptions.map((opt) => opt.value)
      : [];
    setFormData({ ...formData, languages: selectedLanguages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      //  Submit personal-info data
      const personalInfoRes = await axios.post(
        `${Config.BASE_URL}/api/personal-info`,
        formData
      );

      //  Submit profile data
      const profileRes = await axios.post(
        `${Config.BASE_URL}/api/profile/update/${userData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      //  Show success toast
      toast.success("Personal info submitted successfully");

      //  Mark current step as completed
      setCompletedSteps((prev) => [...prev, activeIndex]);

      //  Move to next step if available
      if (activeIndex < steps.length - 1) {
        setActiveIndex((prev) => prev + 1);
      }

      //  Debug data
      console.log("PersonalInfo response:", personalInfoRes.data);
      console.log("Profile update response:", profileRes.data);
    } catch (err) {
      //  Handle errors
      const errorMsg = err.response?.data?.message || "Something went wrong";
      console.error("Error submitting personal info:", err); // <-- helpful for debugging
      toast.error(errorMsg);
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    setLoading1(true);
    try {
      await axios.post(
        `${Config.BASE_URL}/api/professional-registration`,
        formData1
      );
      toast.success("Professional registration saved!");

      setCompletedSteps([...completedSteps, activeIndex]);

      // Move to the next step automatically
      if (activeIndex < steps.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading1(false); // ✅ stop loading
    }
  };

  const [qualifications, setQualifications] = useState([
    { degree: "", institution: "", country: "", year_completed: "" },
  ]);

  const fileInputRefs = useRef({});
  const [documents, setDocuments] = useState({});
  const labels = [
    "Medical Degree",
    "GMC Certificate",
    "Proof of Identity",
    "DBS Certificate",
  ];
  //  "Medical Indemnity Insurance",

  const handleChange3 = (index, e) => {
    const { name, value } = e.target;
    const updated = [...qualifications];
    updated[index][name] = value;
    setQualifications(updated);
  };

  const handleAddMore = () => {
    setQualifications([
      ...qualifications,
      { degree: "", institution: "", country: "", year_completed: "" },
    ]);
  };

  const handleDelete = (index) => {
    const updated = [...qualifications];
    updated.splice(index, 1);
    setQualifications(updated);
  };

  const handleFileChange = (e, label) => {
    const file = e.target.files[0];
    setDocuments((prev) => ({
      ...prev,
      [label]: {
        ...prev[label],
        file_path: null, // reset file_path
        file_name: file.name,
        file: file,
      },
    }));
  };

  const handleSubmit3 = async () => {
    try {
      setLoading2(true);

      if (
        qualifications.some(
          (qualification) => !qualification.degree || !qualification.country
        )
      ) {
        toast.error("Please fill all required fields.");
        setLoading2(false);
        return;
      }

      const res = await axios.post(
        `${Config.BASE_URL}/api/user-qualification`,
        {
          user_id: userId,
          qualifications, // send the array
        }
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading2(false); // ✅ stop loading
    }
  };

  const handleUploadAll = async () => {
    try {
      setLoading3(true);

      if (
        !documents["GMC Certificate"]?.file &&
        !documents["GMC Certificate"]?.file_path
      ) {
        toast.error("Please upload GMC Certificate (mandatory)");
        setLoading3(false);
        return;
      }

      if (
        !documents["Proof of Identity"]?.file &&
        !documents["Proof of Identity"]?.file_path
      ) {
        toast.error("Please upload Proof of Identity (mandatory)");
        setLoading3(false);
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];

      for (const [label, docData] of Object.entries(documents)) {
        if (docData.file && !allowedTypes.includes(docData.file.type)) {
          toast.error(`${label} must be a PDF, JPG, JPEG, or PNG file`);
          setLoading3(false);
          return; // stop the upload entirely
        }
      }

      const uploadPromises = Object.entries(documents).map(
        async ([label, docData]) => {
          if (docData.file) {
            const formData = new FormData();
            formData.append("user_id", userId);
            formData.append("document_type", label);
            formData.append("file", docData.file);
            const res = await axios.post(
              `${Config.BASE_URL}/api/user-document`,
              formData
            );

            // after successful upload, merge the new file_path
            return {
              label,
              file_path: res.data.data.file_path,
              file_name: res.data.data.file_path.split("/").pop(),
            };
          }
          return null;
        }
      );

      const uploaded = (await Promise.all(uploadPromises)).filter(Boolean);

      if (uploaded.length) {
        setDocuments((prev) => {
          const newDocs = { ...prev };
          uploaded.forEach((doc) => {
            newDocs[doc.label] = {
              file_path: doc.file_path,
              file_name: doc.file_name,
            };
          });
          return newDocs;
        });

        setCompletedSteps((prev) => [...prev, activeIndex]);
        if (activeIndex < steps.length - 1) {
          setActiveIndex(activeIndex + 1);
        }
        toast.success("All documents uploaded successfully!");
      } else {
        setCompletedSteps((prev) => [...prev, activeIndex]);
        if (activeIndex < steps.length - 1) {
          setActiveIndex(activeIndex + 1);
        }
        // toast.error("No new files selected to upload");
      }
    } catch (err) {
      // console.log(err);
      toast.error(err.response?.data?.message || "One or more uploads failed");
    } finally {
      setLoading3(false); // ✅ stop loading
    }
  };

  const [previousRoles, setPreviousRoles] = useState("");
  const [niNumber, setNiNumber] = useState("");
  const [workStatus, setWorkStatus] = useState("UK Citizen");
  const [rightToWork, setRightToWork] = useState(true); // default true

  const handleSubmit4 = async () => {
    try {
      setLoading4(true);

      const payload = {
        user_id: userId,
        previous_roles: previousRoles,
        national_insurance_number: niNumber,
        work_status_uk: workStatus,
        right_to_work_uk: rightToWork,
      };

      const res = await axios.post(
        `${Config.BASE_URL}/api/employment-status`,
        payload
      );

      // 2️⃣ Insurance payload (only if hasInsurance is true)
      if (formData.hasInsurance) {
        const insurancePayload = new FormData();
        insurancePayload.append("user_id", userId);
        insurancePayload.append("insurance_provider", formData.insurer);
        insurancePayload.append("policy_number", formData.policyNumber);
        insurancePayload.append("verification_code", formData.authCode);
        insurancePayload.append(
          "policy_verification",
          formData.hasInsurance === true ? 1 : 0
        );

        if (formData.insurance_card_file_1) {
          insurancePayload.append(
            "insurance_card_file_1",
            formData.insurance_card_file_1
          );
        }

        const insuranceRes = await axios.post(
          `${Config.BASE_URL}/api/insurance`,
          insurancePayload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        toast.success(insuranceRes.data.message || "Insurance saved");
      }
      toast.success(res.data.message || "Employment status saved");

      setCompletedSteps([...completedSteps, activeIndex]);

      // Move to the next step automatically
      if (activeIndex < steps.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setLoading4(false); // ✅ stop loading
    }
  };

  const today = new Date();
  const [availability, setAvailability] = useState(
    Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      return {
        id: i,
        day: dayName,
        date: date.toISOString().slice(0, 10),
        startHour: "",
        startMinute: "",
        startPeriod: "AM",
        endHour: "",
        endMinute: "",
        endPeriod: "AM",
        selected: false,
      };
    })
  );
  const updateTime = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  // const [timeSlots, setTimeSlots] = useState(
  //   days.reduce((acc, day) => {
  //     acc[day] = { hour: "", minute: "", period: "AM", selected: false };
  //     return acc;
  //   }, {})
  // );

  const [consultModes, setConsultModes] = useState({
    Virtual: true,
    Phone: false,
    "In-Person": false,
  });

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "Punjabi", label: "Punjabi" },
    { value: "Spanish", label: "Spanish" },
    { value: "Urdu", label: "Urdu" },
    { value: "Gujarati", label: "Gujarati" },
    { value: "Tamil", label: "Tamil" },
    { value: "Bengali", label: "Bengali" },
  ];

  const [selectedLanguages, setSelectedLanguages] = useState([]);

  // const handleTimeChange = (day, field, value) => {
  //   setTimeSlots((prev) => ({
  //     ...prev,
  //     [day]: { ...prev[day], [field]: value },
  //   }));
  // };

  // const toggleDay = (day) => {
  //   setTimeSlots((prev) => ({
  //     ...prev,
  //     [day]: { ...prev[day], selected: !prev[day].selected },
  //   }));
  // };

  const toggleConsultMode = (mode) => {
    setConsultModes((prev) => ({ ...prev, [mode]: !prev[mode] }));
  };

  const getNextDateForDay = (targetDay) => {
    const dayToIndex = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const today = new Date();
    const todayIndex = today.getDay();
    const targetIndex = dayToIndex[targetDay];

    // diff to next occurrence of targetDay
    let diff = targetIndex - todayIndex;
    if (diff < 0) diff += 7; // next week if day already passed
    // if diff === 0 and you want *this week*'s date (today), leave as 0.
    // if you want NEXT week even if it's today, uncomment next line:
    // if (diff === 0) diff = 7;

    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + diff);

    return nextDate.toISOString().split("T")[0]; // yyyy-mm-dd
  };

  const buildAvailabilityPayload = () => {
    const to24Hour = (hour, period) => {
      let h = parseInt(hour, 10);
      if (period === "PM" && h < 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      return h.toString().padStart(2, "0");
    };

    return availability
      .filter((slot) => slot.selected)
      .map((slot) => {
        const start_time = `${to24Hour(
          slot.startHour,
          slot.startPeriod
        )}:${slot.startMinute.padStart(2, "0")}:00`;
        const end_time = `${to24Hour(
          slot.endHour,
          slot.endPeriod
        )}:${slot.endMinute.padStart(2, "0")}:00`;

        return {
          user_id: userId.toString(),
          day: slot.day,
          date: getNextDateForDay(slot.day),
          start_time,
          end_time,
          consultation_modes: Object.entries(consultModes)
            .filter(([_, checked]) => checked)
            .map(([mode]) => mode.toLowerCase()),
          preferred_languages: selectedLanguages.map((lang) => lang.value),
        };
      });
  };

  const handleSubmit5 = async () => {
    const payload = buildAvailabilityPayload();
    console.log(payload);
    setLoading5(true);

    try {
      await axios.post(`${Config.BASE_URL}/api/doctor_availability`, payload);
      setCompletedSteps([...completedSteps, activeIndex]);
      setActiveIndex(activeIndex + 1);
      toast.success("Availability saved successfully!");
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error("Something went wrong!");
    } finally {
      setLoading5(false); // ✅ stop loading
    }
  };

  const consentList = [
    "I confirm that all information provided is true and accurate to the best of my knowledge.",
    "I give consent for Yodoc to verify my credentials and contact my references.",
    "I consent to my data being processed in accordance with the UK GDPR and the Data Protection Act 2018.",
    "I have valid medical indemnity insurance covering online consultations.",
    "I agree to abide by the General Medical Council (GMC) Good Medical Practice guidelines.",
  ];

  const [consents, setConsents] = useState(
    Array(consentList.length).fill(false)
  );

  const toggleConsent = (index) => {
    setConsents((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const allConsentsChecked = consents.every(Boolean); // ✅ Enable Save only when all checked

  const handleSubmit6 = async () => {
    try {
      setLoading6(true);

      const data = {
        user_id: userId,
        confirm_truth: consents[0],
        consent_verify: consents[1],
        consent_gdpr: consents[2],
        insurance_valid: consents[3],
        agree_gmc: consents[4],
      };
      const response = await axios.post(
        `${Config.BASE_URL}/api/declarations`,
        data
      );

      setCompletedSteps([...completedSteps, activeIndex]);
      setActiveIndex(activeIndex + 1);

      toast.success(response.data.message || "Consent submitted successfully!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || String(error);
      toast.error(errorMessage);
    } finally {
      setLoading6(false); // ✅ stop loading
    }
  };

  // Safely check each value — fallback to empty string
  const isStep0Complete =
    (formData.full_name || "").trim() !== "" &&
    (formData.date_of_birth || "").trim() !== "" &&
    (formData.gender || "").trim() !== "" &&
    (formData.nationality || "").trim() !== "" &&
    (formData.contact_number || "").trim() !== "" &&
    (formData.email || "").trim() !== "" &&
    (formData.home_address || "").trim() !== "" &&
    (formData.city || "").trim() !== "" &&
    // (formData.county || "").trim() !== "" &&
    (formData.postcode || "").trim() !== "";

  const todaydate = new Date().toISOString().split("T")[0];

  // Safe validation
  // const isValidAndFilled =
  //   (formData1.gmc_registration_number || "").trim() !== "" &&
  //   (formData1.gmc_registration_date || "") <= todaydate &&
  //   (formData1.license_to_practice || "").trim() !== "" &&
  //   (formData1.revalidation_date || "") >= todaydate &&
  //   (formData1.specialization || "").trim() !== "" &&
  //   (formData1.years_of_experience || "").trim() !== "";
  const isValidAndFilled =
    (formData1.gmc_registration_number || "").trim() !== "" &&
    (formData1.gmc_registration_date || "") <= todaydate &&
    (formData1.license_to_practice || "").trim() !== "" &&
    (formData1.revalidation_date || "") >= todaydate &&
    Array.isArray(formData1.specialization) &&
    formData1.specialization.length > 0 &&
    // Array.isArray(formData1.sub_category) &&
    // formData1.sub_category.length > 0 &&
    (formData1.years_of_experience || "").trim() !== "";

  // ✅ Ensure no null errors
  const canProceedEmployment =
    // (previousRoles || "").trim() !== "" &&
    // (niNumber || "").trim() !== "" &&
    (workStatus || "").trim() !== "" &&
    rightToWork === true &&
    (formData.hasInsurance == false ||
      ((formData.insurer || "").trim() !== "" &&
        (formData.policyNumber || "").trim() !== ""));
  // &&
  // (formData.authCode || "").trim() !== ""

  const canProceedAvailability = (() => {
    // check if at least one day is selected
    const anySelected = availability.some((slot) => slot.selected);
    if (!anySelected) return false;

    // check each selected day must have complete time
    for (const slot of availability) {
      if (slot.selected) {
        if (
          !slot.startHour ||
          !slot.startMinute ||
          !slot.endHour ||
          !slot.endMinute
        ) {
          return false;
        }
      }
    }

    // check at least one consultation mode is checked
    const anyModeChecked = Object.values(consultModes).some(Boolean);
    if (!anyModeChecked) return false;

    // check at least one language selected
    if (selectedLanguages.length === 0) return false;

    return true;
  })();
  const get18YearsAgoDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split("T")[0];
  };

  const generateYearsFrom1900 = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };

  const clearTimes = (s) => ({
    ...s,
    selected: false,
    startHour: "",
    startMinute: "",
    startPeriod: "AM",
    endHour: "",
    endMinute: "",
    endPeriod: "AM",
  });

  const handleDayChange = (index, isChecked) => {
    setAvailability((prev) =>
      prev.map((s, i) =>
        i === index ? (isChecked ? { ...s, selected: true } : clearTimes(s)) : s
      )
    );
  };

  // console.log("availabilityavailability", formData.aboutus);

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
              Register Now, Upload
              <br />
              Your Documents, and Start Consulting
              <br />
              with Patients Online.
            </h1>
          </div>
        </div>

        <div className="container mt-4">
          <h2>Personal Information</h2>
          <div className="row">
            {/* Sidebar */}
            <div className="col-md-4 mt-4">
              <div
                className="nav flex-column nav-pills step-nav backcolortab"
                role="tablist"
                aria-orientation="vertical"
              >
                {steps.map((label, index) => {
                  const isActive = index === activeIndex;
                  const isCompleted = completedSteps.includes(index);

                  return (
                    <div
                      key={index}
                      className={`nav-link step-link ${
                        isActive ? "active" : ""
                      }`}
                      onClick={() => {
                        // Only allow going to completed steps
                        if (isCompleted) {
                          setActiveIndex(index);
                        }
                      }}
                      style={{
                        cursor: isCompleted ? "pointer" : "not-allowed",
                        opacity: isCompleted ? 1 : 0.6,
                      }}
                    >
                      <span
                        className={`step-circle ${
                          isActive ? "active-step" : ""
                        } ${isCompleted ? "completed-step" : ""}`}
                      >
                        {isCompleted ? "✓" : index + 1}
                      </span>
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="col-md-8 mt-4">
              <div className="tab-content textshowtab">
                {activeIndex === 0 && (
                  <div className="tab-pane fade show active p-3">
                    <h4 className="mb-3">{steps[0]}</h4>
                    {/* <form> */}
                    {/* <form onSubmit={handleSubmit}> */}
                    <div className="row">
                      <div className="form-group col-md-6">
                        <label htmlFor="full_name" className="font-weight-bold">
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control custom-placeholder"
                          id="full_name"
                          placeholder="Enter full name"
                          value={formData.full_name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <label
                          htmlFor="date_of_birth"
                          className="font-weight-bold"
                        >
                          Date of Birth <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                          max={get18YearsAgoDate()}
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <label htmlFor="gender" className="font-weight-bold">
                          Gender <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control custom-placeholder"
                          id="gender"
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* <div className="form-group col-md-6">
                        <label
                          htmlFor="nationality"
                          className="font-weight-bold"
                        >
                          Nationality <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="nationality"
                          placeholder="Enter nationality"
                          value={formData.nationality}
                          onChange={handleChange}
                        />
                      </div> */}

                      <div className="form-group col-md-6">
                        <label
                          htmlFor="nationality"
                          className="font-weight-bold"
                        >
                          Nationality <span className="text-danger">*</span>
                        </label>
                        <Select
                          id="nationality"
                          options={nationalities}
                          value={nationalities.find(
                            (option) => option.value === formData.nationality
                          )}
                          onChange={(selected) =>
                            handleChange(selected, "nationality")
                          }
                          placeholder="Select or type nationality..."
                          isSearchable
                          components={{
                            IndicatorSeparator: () => null,
                          }}
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <label
                          htmlFor="contact_number"
                          className="font-weight-bold"
                        >
                          Contact Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          className="form-control custom-placeholder"
                          id="contact_number"
                          placeholder="Enter contact number"
                          value={formData.contact_number}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <label htmlFor="email" className="font-weight-bold">
                          Email Address <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          disabled
                          className="form-control custom-placeholder"
                          id="email"
                          placeholder="Enter email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className=" mt-3">
                        <h5 className="mb-3">Address in the UK</h5>

                        {/* Address */}
                        <div className="form-group ">
                          <label
                            htmlFor="home_address"
                            className="font-weight-bold"
                          >
                            Address <span className="text-danger">*</span>
                          </label>
                          <textarea
                            className="form-control custom-placeholder"
                            id="home_address"
                            rows="3"
                            placeholder="Enter home address"
                            value={formData.home_address}
                            onChange={handleChange}
                          ></textarea>
                        </div>

                        <div className="row">
                          {/* <div className="col-md-6 mb-3">
                            <label className="form-label font-weight-bold">
                              Town/City <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select"
                              id="city"
                              value={formData.city}
                              onChange={handleChange}
                            >
                              <option value="">Select town/city</option>
                              <option value="london">London</option>
                              <option value="manchester">Manchester</option>
                              <option value="birmingham">Birmingham</option>
                            </select>
                          </div> */}
                          <div className="col-md-6 mb-3">
                            <label className="form-label font-weight-bold">
                              Town/City <span className="text-danger">*</span>
                            </label>
                            <Select
                              id="city"
                              options={cities}
                              value={cities.find(
                                (c) => c.value === formData.city
                              )}
                              onChange={(selected) =>
                                handleChange(selected, "city")
                              }
                              placeholder="Select town/city..."
                              isSearchable
                              components={{ IndicatorSeparator: () => null }}
                            />
                          </div>

                          {/* <div className="col-md-6 mb-3">
                            <label className="form-label font-weight-bold">
                              County
                            </label>
                            <select
                              className="form-select"
                              id="county"
                              value={formData.county}
                              onChange={handleChange}
                            >
                              <option value="">Select county</option>
                              <option value="greater-london">
                                Greater London
                              </option>
                              <option value="greater-manchester">
                                Greater Manchester
                              </option>
                              <option value="west-midlands">
                                West Midlands
                              </option>
                            </select>
                          </div> */}
                          <div className="col-md-6 mb-3">
                            <label className="form-label font-weight-bold">
                              County
                            </label>
                            <Select
                              id="county"
                              options={counties}
                              value={counties.find(
                                (c) => c.value === formData.county
                              )}
                              onChange={(selected) =>
                                handleChange(selected, "county")
                              }
                              placeholder="Select county..."
                              isSearchable
                              components={{ IndicatorSeparator: () => null }}
                            />
                          </div>
                        </div>

                        {/* Postcode */}
                        <div className="row">
                          <div className="col-md-6 mb-3 ">
                            <label
                              htmlFor="postcode"
                              className="font-weight-bold"
                            >
                              Postcode <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control custom-placeholder"
                              id="postcode"
                              name="postcode"
                              placeholder="Enter postcode"
                              value={formData.postcode}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="font-weight-bold">
                              Languages <span className="text-danger">*</span>
                            </label>
                            <Select
                              isMulti
                              name="languages"
                              options={languageOptions2}
                              value={languageOptions2.filter((option) =>
                                formData?.languages?.includes(option.value)
                              )}
                              onChange={handleLanguageChange}
                              isSearchable
                              components={{ IndicatorSeparator: () => null }}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              placeholder="Select languages..."
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group col-md-12">
                        <label htmlFor="aboutus" className="font-weight-bold">
                          My Profile
                        </label>
                        {/* <textarea
                          className="form-control custom-placeholder"
                          id="aboutus"
                          rows="4"
                          placeholder="Enter description about yourself"
                          value={formData.aboutus}
                          onChange={handleChange}
                        ></textarea> */}
                        <Editor
                          id="aboutus"
                          value={formData.aboutus}
                          onTextChange={handleEditorChange}
                          style={{ height: "300px", backgroundColor: "white" }}
                          placeholder="Enter description about yourself"
                        />
                      </div>

                      {/* <div className="form-group col-md-12">
                          <button
                            type="submit"
                            className="btn btn-primary flex-end"
                          >
                            Submit
                          </button>
                        </div> */}

                      <div className="d-flex justify-content-end mt-4">
                        {/* {isStep0Complete && ( */}
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={handleSubmit}
                          disabled={!isStep0Complete || loading}
                        >
                          {loading ? (
                            <>
                              <CircularProgress
                                size={20}
                                color="inherit"
                                className="me-2"
                              />
                              Submitting...
                            </>
                          ) : (
                            "Next »"
                          )}
                          {/* Next » */}
                        </button>
                        {/* )} */}
                      </div>
                    </div>
                    {/* </form> */}
                    {/* </form> */}
                  </div>
                )}

                {activeIndex === 1 && (
                  <div className="tab-pane fade show active p-3">
                    <h4>{steps[1]}</h4>

                    {/* <form onSubmit={handleSubmit1}> */}
                    <div className="row">
                      {/* GMC Registration Number */}
                      <div className="form-group col-md-6">
                        <label className="font-weight-bold">
                          GMC Registration Number{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text custom-placeholder"
                          className="form-control"
                          name="gmc_registration_number"
                          placeholder="Enter GMC Registration Number"
                          value={formData1.gmc_registration_number}
                          onChange={handleChange1}
                        />
                      </div>

                      {/* Date of GMC Registration */}
                      <div className="form-group col-md-6">
                        <label className="font-weight-bold">
                          Date of GMC Registration{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="gmc_registration_date"
                          value={formData1.gmc_registration_date}
                          onChange={handleChange1}
                        />
                        {formData1.gmc_registration_date &&
                          formData1.gmc_registration_date > todaydate && (
                            <small className="text-danger">
                              GMC registration date cannot be in the future.
                            </small>
                          )}
                      </div>

                      {/* Revalidation Date */}
                      <div className="form-group col-md-6">
                        <label className="font-weight-bold">
                          Revalidation Date{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name="revalidation_date"
                          value={formData1.revalidation_date}
                          onChange={handleChange1}
                        />
                        {formData1.revalidation_date &&
                          formData1.revalidation_date < todaydate && (
                            <small className="text-danger">
                              Revalidation date cannot be in the past.
                            </small>
                          )}
                      </div>

                      {/* Years of Experience */}
                      <div className="form-group col-md-6">
                        <label className="font-weight-bold">
                          Years of Experience{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="years_of_experience"
                          value={formData1.years_of_experience}
                          onChange={handleChange1}
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <label className="fw-semibold">
                          Specialization <span className="text-danger">*</span>
                        </label>
                        <Select
                          isMulti
                          name="specialization"
                          options={allCategory.map((cat) => ({
                            value: cat.name,
                            label: cat.name,
                          }))}
                          /* Convert array of objects → array of strings */
                          value={formData1.specialization.map((s) => ({
                            value: s,
                            label: s,
                          }))}
                          onChange={(selected) =>
                            setFormData1((prev) => ({
                              ...prev,
                              specialization: selected
                                ? selected.map((s) => s.value)
                                : [],
                              sub_category: [], // reset when specialization changes
                            }))
                          }
                        />
                      </div>

                      {/* Sub Category */}
                      {/* <div className="form-group col-md-6">
                        <label className="fw-semibold">Sub-Category</label>
                        <Select
                          isMulti
                          name="sub_category"
                          options={allCategory
                            .filter((cat) =>
                              formData1.specialization.includes(cat.name)
                            )
                            .flatMap((cat) =>
                              cat.subCat?.map((sub) => ({
                                value: sub.name,
                                label: sub.name,
                              }))
                            )}
                          
                          value={formData1.sub_category.map((s) => ({
                            value: s,
                            label: s,
                          }))}
                          onChange={(selected) =>
                            setFormData1((prev) => ({
                              ...prev,
                              sub_category: selected
                                ? selected.map((s) => s.value)
                                : [],
                            }))
                          }
                          isDisabled={formData1.specialization.length === 0}
                        />
                      </div> */}

                      {/* License to Practice */}
                      <div className="form-group col-md-6">
                        <label className="font-weight-bold">
                          Are you allow to do private practice?
                          <span className="text-danger">*</span>
                        </label>
                        <br />
                        <div className="form-check form-check-inline mx-2">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="license_to_practice"
                            value="1"
                            checked={formData1.license_to_practice === "1"}
                            onChange={handleChange1}
                          />
                          <label className="form-check-label">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="license_to_practice"
                            value="0"
                            checked={formData1.license_to_practice === "0"}
                            onChange={handleChange1}
                          />
                          <label className="form-check-label">No</label>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setActiveIndex((prev) => prev - 1)}
                        disabled={activeIndex === 0}
                      >
                        « Previous
                      </button>

                      {/* {isValidAndFilled && ( */}
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={handleSubmit1}
                        disabled={!isValidAndFilled || loading1}
                      >
                        {loading1 ? (
                          <>
                            <CircularProgress
                              size={20}
                              color="inherit"
                              className="me-2"
                            />
                            Submitting...
                          </>
                        ) : (
                          "Next »"
                        )}
                        {/* Next » */}
                      </button>
                      {/* )} */}
                    </div>
                    {/* </form> */}
                  </div>
                )}

                {activeIndex === 2 && (
                  <div className="tab-pane fade show active p-3">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4>{steps[2]}</h4>
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={handleAddMore}
                      >
                        Add More
                      </button>
                    </div>
                    <div className="">
                      {qualifications.map((q, index) => (
                        <div className="qualification-box p-3 mb-4" key={index}>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Qualification {index + 1}</h5>
                            {index > 0 && (
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(index)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="bi bi-trash"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-7z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2H6.118A1.5 1.5 0 0 1 7.5 0h1a1.5 1.5 0 0 1 1.382 1H13.5a1 1 0 0 1 1 1zm-3 1H4v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4z"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>

                          <div className="row">
                            <div className="col-md-4 mb-3">
                              <label>
                                Degree/Qualification{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                name="degree"
                                className="form-control"
                                value={q.degree}
                                onChange={(e) => handleChange3(index, e)}
                              />
                            </div>

                            <div className="col-md-4 mb-3">
                              <label>
                                Institution{" "}
                                {/* <span className="text-danger">*</span> */}
                              </label>
                              <input
                                name="institution"
                                className="form-control"
                                value={q.institution}
                                onChange={(e) => handleChange3(index, e)}
                              />
                            </div>

                            <div className="col-md-4 mb-3">
                              <label>
                                Country <span className="text-danger">*</span>
                              </label>
                              <input
                                name="country"
                                className="form-control"
                                value={q.country}
                                onChange={(e) => handleChange3(index, e)}
                              />
                            </div>

                            {/* <div className="col-md-6 mb-3">
                              <label>
                                Year Completed{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <select
                                name="year_completed"
                                className="form-control custom-select-scroll"
                                value={q.year_completed}
                                onChange={(e) => handleChange3(index, e)}
                              >
                                <option value="">Select Year</option>
                                {generateYearsFrom1900().map((year) => (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                ))}
                              </select>
                            </div> */}
                          </div>
                        </div>
                      ))}

                      <div className="mb-3">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleSubmit3}
                          disabled={loading2}
                        >
                          {loading2 ? (
                            <>
                              <CircularProgress
                                size={20}
                                color="inherit"
                                className="me-2"
                              />
                              Submitting...
                            </>
                          ) : (
                            "Save Qualifications"
                          )}
                          {/* Save Qualifications */}
                        </button>
                      </div>
                    </div>

                    {/* {labels.map((label) => (
                      <div className="upload-box mb-3" key={label}>
                        <span className="d-block mb-2 fw-bold">{label}</span>

                        
                        {documents[label]?.file_name && (
                          <div className="upload-box uploaded mb-2">
                            <a
                              href={`${Config.BASE_URL}/${documents[label].file_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {documents[label].file_name}
                            </a>
                          </div>
                        )}

                        <input
                          type="file"
                          ref={(el) => (fileInputRefs.current[label] = el)}
                          style={{ display: "none" }}
                          className="form-control"
                          onChange={(e) => handleFileChange(e, label)}
                        />

                        <button
                          type="button"
                          className="upload-btn btn btn-outline-primary me-2"
                          onClick={() => fileInputRefs.current[label].click()}
                        >
                          {documents[label]?.file_name ? "Replace" : "Upload"}
                        </button>
                      </div>
                    ))} */}

                    {labels.map((label) => (
                      <div className="mb-4" key={label}>
                        <div className="upload-box">
                          <span className="d-block mb-2 fw-bold">
                            {label}
                            {label === "GMC Certificate" && (
                              <span className="text-danger"> *</span>
                            )}
                            {label === "Proof of Identity" && (
                              <span className="text-danger"> *</span>
                            )}
                          </span>

                          {/* Show file_name if already uploaded */}
                          {documents[label]?.file_name && (
                            <div className="upload-box uploaded mb-2">
                              <a
                                href={`${Config.BASE_URL}/${documents[label].file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {documents[label].file_name}
                              </a>
                            </div>
                          )}

                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            ref={(el) => (fileInputRefs.current[label] = el)}
                            style={{ display: "none" }}
                            className="form-control"
                            onChange={(e) => handleFileChange(e, label)}
                          />

                          <button
                            type="button"
                            className="upload-btn btn btn-outline-primary me-2"
                            onClick={() => fileInputRefs.current[label].click()}
                          >
                            {documents[label]?.file_name ? "Replace" : "Upload"}
                          </button>
                        </div>
                        <div
                          className={`form-text  ${
                            label === "GMC Certificate" ||
                            label === "Proof of Identity"
                              ? "text-danger"
                              : "text-muted"
                          }  mt-1`}
                        >
                          {label === "GMC Certificate" ||
                          label === "Proof of Identity"
                            ? "This document is mandatory"
                            : "This document is optional and can be uploaded later"}
                        </div>
                      </div>
                    ))}

                    <div className="d-flex justify-content-between mt-4">
                      {/* Previous Button */}
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setActiveIndex((prev) => prev - 1)}
                        disabled={activeIndex === 0}
                      >
                        « Previous
                      </button>

                      {/* Next Button */}
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleUploadAll}
                        disabled={
                          Object.keys(documents).length === 0 || loading3
                        }
                      >
                        {loading3 ? (
                          <>
                            <CircularProgress
                              size={20}
                              color="inherit"
                              className="me-2"
                            />
                            Submitting...
                          </>
                        ) : (
                          "Next »"
                        )}

                        {/* Next » */}
                      </button>
                    </div>

                    {/* {labels.map((label) => (
                        <div className="mb-3" key={label}>
                          <label>{label}</label>
                          <input
                            type="file"
                            className="form-control"
                            onChange={(e) => handleFileChange(e, label)}
                          />
                          <button
                            className="btn btn-secondary mt-2"
                            onClick={() => handleUpload(label)}
                          >
                            Upload
                          </button>
                        </div>
                      ))} */}
                  </div>
                )}

                {activeIndex === 3 && (
                  <div className="tab-pane fade show active p-3">
                    <h4>{steps[3]}</h4>
                    {/* <h5 className="mb-3">Current Employer</h5> */}
                    <div className="mt-3">
                      <div className="row">
                        {/* Work Status Dropdown */}

                        {/* Right to Work Radio Buttons */}
                        {/* <div className="col-md-6 mb-3">
                          <label>
                            Do you have the right to work in the UK?
                          </label>
                          <div className="d-flex gap-3">
                            {["Yes", "No"].map((option) => (
                              <div className="form-check" key={option}>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="rightToWork"
                                  id={`rightToWork-${option}`}
                                  value={option}
                                  checked={rightToWork === (option === "Yes")}
                                  onChange={() =>
                                    setRightToWork(option === "Yes")
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`rightToWork-${option}`}
                                >
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div> */}
                        <div>
                          <InsuranceSection
                            formData={formData}
                            setFormData={setFormData}
                            userId={userId}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      {/* <div className="col-md-6 mb-3">
                        <label>
                          Previous Roles
                         
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter previous roles"
                          value={previousRoles}
                          onChange={(e) => setPreviousRoles(e.target.value)}
                        />
                      </div> */}
                      {/* <div className="col-md-6 mb-3">
                        <label>
                          National Insurance Number:{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter NI number"
                          value={niNumber}
                          onChange={(e) => setNiNumber(e.target.value)}
                        />
                      </div> */}
                      {/* <div className="col-md-6 mb-3">
                        <label htmlFor="workStatus">
                          Work Status in the UK
                        </label>
                        <select
                          id="workStatus"
                          className="form-select"
                          value={workStatus}
                          onChange={(e) => setWorkStatus(e.target.value)}
                        >
                          <option value="">Select work status</option>
                          <option value="UK Citizen">UK Citizen</option>
                          <option value="Indefinite Leave to Remain">
                            Indefinite Leave to Remain
                          </option>
                          <option value="Work Visa">Work Visa</option>
                          <option value="Other">Other</option>
                        </select>
                      </div> */}
                    </div>

                    {/* <div className="mt-3">
                      <label className="section-label">
                        Work Status in the UK
                      </label>
                      <div className="radio-group">
                        {[
                          "UK Citizen",
                          "Indefinite Leave to Remain",
                          "Work Visa",
                          "Other",
                        ].map((status) => (
                          <label className="radio-label" key={status}>
                            <input
                              type="radio"
                              name="workStatus"
                              value={status}
                              checked={workStatus === status}
                              onChange={() => setWorkStatus(status)}
                            />
                            {status}
                          </label>
                        ))}
                      </div>
                    </div> */}

                    {/* <div className="mt-3">
                      <label className="section-label">
                        Do you have the right to work in the UK?
                      </label>
                      <div className="radio-group">
                        {["Yes", "No"].map((option) => (
                          <label className="radio-label" key={option}>
                            <input
                              type="radio"
                              name="rightToWork"
                              value={option}
                              checked={rightToWork === (option === "Yes")}
                              onChange={() => setRightToWork(option === "Yes")}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div> */}

                    <div className="mt-3">
                      <div className="row">
                        {/* Work Status Dropdown */}

                        {/* Right to Work Radio Buttons */}
                        {/* <div className="col-md-6 mb-3">
                          <label>
                            Do you have the right to work in the UK?
                          </label>
                          <div className="d-flex gap-3">
                            {["Yes", "No"].map((option) => (
                              <div className="form-check" key={option}>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="rightToWork"
                                  id={`rightToWork-${option}`}
                                  value={option}
                                  checked={rightToWork === (option === "Yes")}
                                  onChange={() =>
                                    setRightToWork(option === "Yes")
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`rightToWork-${option}`}
                                >
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div> */}
                        {/* <div>
                          <InsuranceSection
                            formData={formData}
                            setFormData={setFormData}
                            userId={userId}
                          />
                        </div> */}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      {/* Previous Button */}
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setActiveIndex((prev) => prev - 1)}
                        disabled={activeIndex === 0}
                      >
                        « Previous
                      </button>

                      {/* Next Button */}
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSubmit4}
                        disabled={!canProceedEmployment || loading4} // ✅ disable if false
                      >
                        {loading4 ? (
                          <>
                            <CircularProgress
                              size={20}
                              color="inherit"
                              className="me-2"
                            />
                            Submitting...
                          </>
                        ) : (
                          "Next »"
                        )}
                        {/* Next » */}
                      </button>
                    </div>
                  </div>
                )}

                {/* {activeIndex === 4 && (
                  <div className="tab-pane fade show active p-3">
                    <h4>{steps[4]}</h4>
                    <label className="section-label">
                      Available Days/Times{" "}
                      <span className="text-danger">*</span>
                    </label>
                    {availability.map((slot, index) => (
                      <div key={index} className="day-row mb-3">
                        <label>
                          <input
                            // type="radio"
                            // checked={slot.selected}
                            // onChange={() => {
                            //   const updated = [...availability];
                            //   updated[index].selected =
                            //     !updated[index].selected;
                            //   setAvailability(updated);
                            // }}
                            id={`day-${slot.id ?? index}`}
                            type="checkbox" // ✅ must be checkbox
                            checked={Boolean(slot.selected)} // ✅ ensure boolean
                            onChange={(e) =>
                              handleDayChange(index, e.target.checked)
                            } // ✅
                          />{" "}
                          {slot.day}
                        </label>

                        {slot.selected && (
                          <>
                            <div className="time-inputs">
                              <input
                                type="number"
                                placeholder="HH"
                                value={slot.startHour}
                                className="time-box"
                                min="1"
                                max="12"
                                onInput={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (val > 12) e.target.value = 12;
                                  if (val < 1) e.target.value = 1;
                                }}
                                onChange={(e) =>
                                  updateTime(index, "startHour", e.target.value)
                                }
                              />
                              :
                              <input
                                type="number"
                                placeholder="MM"
                                value={slot.startMinute}
                                className="time-box"
                                min="0"
                                max="59"
                                onInput={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (val > 59) e.target.value = 59;
                                  if (val < 0 || isNaN(val)) e.target.value = 0;
                                }}
                                onChange={(e) =>
                                  updateTime(
                                    index,
                                    "startMinute",
                                    e.target.value
                                  )
                                }
                              />
                              <div className="ampm-toggle">
                                <button
                                  type="button"
                                  className={
                                    slot.startPeriod === "AM" ? "active" : ""
                                  }
                                  onClick={() =>
                                    updateTime(index, "startPeriod", "AM")
                                  }
                                >
                                  AM
                                </button>
                                <button
                                  type="button"
                                  className={
                                    slot.startPeriod === "PM" ? "active" : ""
                                  }
                                  onClick={() =>
                                    updateTime(index, "startPeriod", "PM")
                                  }
                                >
                                  PM
                                </button>
                              </div>
                            </div>
                            to
                            <div className="time-inputs">
                              <input
                                type="number"
                                placeholder="HH"
                                value={slot.endHour}
                                className="time-box"
                                min="1"
                                max="12"
                                onInput={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (val > 12) e.target.value = 12;
                                  if (val < 1) e.target.value = 1;
                                }}
                                onChange={(e) =>
                                  updateTime(index, "endHour", e.target.value)
                                }
                              />
                              :
                              <input
                                type="number"
                                placeholder="MM"
                                value={slot.endMinute}
                                className="time-box"
                                min="0"
                                max="59"
                                onInput={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (val > 59) e.target.value = 59;
                                  if (val < 0 || isNaN(val)) e.target.value = 0;
                                }}
                                onChange={(e) =>
                                  updateTime(index, "endMinute", e.target.value)
                                }
                              />
                              <div className="ampm-toggle">
                                <button
                                  type="button"
                                  className={
                                    slot.endPeriod === "AM" ? "active" : ""
                                  }
                                  onClick={() =>
                                    updateTime(index, "endPeriod", "AM")
                                  }
                                >
                                  AM
                                </button>
                                <button
                                  type="button"
                                  className={
                                    slot.endPeriod === "PM" ? "active" : ""
                                  }
                                  onClick={() =>
                                    updateTime(index, "endPeriod", "PM")
                                  }
                                >
                                  PM
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}

                    <div className="section mt-4">
                      <label className="section-label">
                        Preferred Mode of Consultation:
                      </label>
                      <div className="checkbox-group">
                        {Object.keys(consultModes).map((mode) => (
                          <label key={mode} className="checkbox-label mr-3">
                            <input
                              type="checkbox"
                              checked={consultModes[mode]}
                              onChange={() => toggleConsultMode(mode)}
                            />
                            {mode}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="section mt-4">
                      <label className="section-label">
                        Preferred Languages Spoken{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <Select
                        isMulti
                        options={languageOptions}
                        value={selectedLanguages}
                        onChange={(selected) => setSelectedLanguages(selected)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    </div>
                    

                    <div className="d-flex justify-content-between mt-4">
                      
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setActiveIndex((prev) => prev - 1)}
                        disabled={activeIndex === 0}
                      >
                        « Previous
                      </button>

                      
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSubmit5}
                        disabled={!canProceedAvailability || loading5}
                      >
                        {loading5 ? (
                          <>
                            <CircularProgress
                              size={20}
                              color="inherit"
                              className="me-2"
                            />
                            Submitting...
                          </>
                        ) : (
                          "Next »"
                        )}
                        
                      </button>
                    </div>
                  </div>
                )} */}

                {activeIndex === 4 && (
                  <div className="tab-pane fade show active p-3">
                    <h4 className="mb-3">{steps[4]} </h4>

                    <div className="consent-list">
                      {consentList.map((text, idx) => (
                        <label
                          key={idx}
                          className="consent-item"
                          style={{ display: "block", marginBottom: "10px" }}
                        >
                          <input
                            type="checkbox"
                            checked={consents[idx]}
                            onChange={() => toggleConsent(idx)}
                            style={{ marginRight: "8px" }}
                          />
                          {text} <span className="text-danger">*</span>
                        </label>
                      ))}
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      {/* Previous Button */}
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setActiveIndex((prev) => prev - 1)}
                        disabled={activeIndex === 0}
                      >
                        « Previous
                      </button>

                      {/* Next Button */}
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSubmit6}
                        disabled={!allConsentsChecked || loading6}
                      >
                        {loading6 ? (
                          <>
                            <CircularProgress
                              size={20}
                              color="inherit"
                              className="me-2"
                            />
                            Submitting...
                          </>
                        ) : (
                          "Save"
                        )}
                        {/* Save */}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* <div className="save-btn-container">
                  <button className="save-btn">Save</button>
                </div> */}
            </div>
          </div>

          {/* <div className="container mb-5 mt-4">
            <div className="row">
              <div className="col-md-4"></div>
              <div className="col-md-8">
                <div className="thankdata">
                  <h4 className="font-weight-bold">
                    Thank you for registering!
                  </h4>
                  <p>
                    Once submitted, our onboarding team will review your
                    application and <br />
                    contact you within 3–5 working days.
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <Footer />
      </div>

      <style>
        {`


.qualification-box {
  border: 1px solid #ddd;
  border-radius: 10px;
  // background-color: #f9f9f9;
  // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
 
  
}


.custom-select-scroll {
  max-height: 100px;
  overflow-y: auto;
}

.consent-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.consent-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: #4d6aff;
  margin-top: 2px;
}

.save-btn-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

.save-btn {
  background-color: #4d6aff;
  color: white;
  padding: 10px 24px;
  border-radius: 24px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
}

.save-btn:hover {
  background-color: #3c54d1;
}

.day-row {
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #e1e4eb;
  border-radius: 8px;
  padding: 10px 20px;
  margin-bottom: 10px;
  justify-content: space-between;
}

.day-row.active {
  border-color: #4d6aff;
}

.day-radio {
  display: flex;
  align-items: center;
  font-weight: 500;
  gap: 10px;
}

input[type="radio"] {
  accent-color: #4d6aff;
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-box {
  width: 50px;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  text-align: center;
}

.ampm-toggle {
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
}

.ampm-toggle button {
  padding: 5px 10px;
  background: #f0f0f0;
  border: none;
  cursor: pointer;
  color: #666;
  font-weight: 500;
}

.ampm-toggle .active {
  background-color: #4d6aff;
  color: #fff;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
}

input[type="checkbox"] {
  accent-color: #4d6aff;
}



.section-label {
  font-weight: 600;
  margin-bottom: 10px;
  display: block;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 400;
  font-size: 15px;
}

input[type="radio"] {
  accent-color: #4d6aff;
  width: 18px;
  height: 18px;
}


.form-control {
  border-radius: 6px;
}

.add-more {
  text-align: center;
  color: #7f7f7f;
  margin-top: 10px;
  margin-bottom: 20px;
}

.upload-box {
  background-color: #f7f9fb;
  border: 1px solid #dfe3e8;
  border-radius: 6px;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.upload-box.uploaded {
  background-color: #f0f4ff;
}

.upload-box a {
  margin-left: 5px;
  color: #1a73e8;
  text-decoration: underline;
  word-break: break-all;
  flex: 1;
}

.upload-box .blue-text {
  color: #1a73e8;
  margin-right: 5px;
}

.upload-btn {
  background-color: #4d6aff;
  color: #fff;
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.upload-btn:disabled {
  background-color: #e3eafc;
  color: #7f7f7f;
  cursor: not-allowed;
}




/* sidebartab start*/

.thankdata {
  background-color: #F7F9FC;
  min-height: 200px;
  border-radius: 20px;
  margin: auto;
  display: flex;
  justify-content: center; 
  align-items: center;     
  text-align: center;     
  padding: 20px;
  flex-direction: column;  
}

 .step-link.active {
  background-color: transparent !important;
  color: #333 !important;
  box-shadow: none;
}
          .textshowtab {
            background-color: #F7F9FC;
            padding: 10px;
            min-height: 300px;
            border-radius: 20px;

          }

          .backcolortab {
            background-color: #F7F9FC;
            padding: 10px;
            border-radius: 20px;
          }

          .step-nav .step-link {
            display: flex;
            align-items: center;
            font-weight: 500;
            color: #333;
            margin-bottom: 2rem;
            position: relative;
            padding-left: 2rem;
            cursor: pointer;
          }

          .step-circle {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #f2f2f2;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: #333;
            margin-right: 10px;
            z-index: 1;
            transition: all 0.3s ease;
          }

          .step-circle.active-step {
            background-color: #4be0b4;
            color: white;
            font-size: 18px;
          }
            .step-circle.completed-step {
             background-color: #4be0b4;
            color: white;
            font-size: 18px;
            }

          .step-link:not(:last-child)::after {
            content: "";
            position: absolute;
            left: 47px;
            top: 35px;
            width: 2px;
            height: 50px;
            background-color: #ddd;
            z-index: 0;
          }

          .step-link.active {
            font-weight: 500;
          }
/* sidebarend*/


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


            /* Base styles */


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

const InsuranceSection = ({ formData, setFormData, userId }) => {
  // Fetch insurance data for the user
  useEffect(() => {
    const fetchInsurance = async () => {
      try {
        const res = await axios.get(
          `${Config.BASE_URL}/api/insurance/getbyUser/${userId}`
        );
        const data = res.data?.data?.[0];
        if (data) {
          setFormData((prev) => ({
            ...prev,
            hasInsurance: !!data.policy_verification,
            insurer: data.insurance_provider ?? "",
            policyNumber: data.policy_number ?? "",
            authCode: data.verification_code ?? "",
            insurance_card_file_1: null, // keep null until user uploads new file
          }));
        }
      } catch (err) {
        console.error("Error fetching insurance data:", err);
      }
    };

    fetchInsurance();
  }, [setFormData, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="mb-3">
        <label className="form-label">
          Do you have insurance to conduct private practice?
          <span className="text-danger">*</span>
        </label>
        <div className="d-flex gap-3">
          {["Yes", "No"].map((option) => {
            const value = option === "Yes";
            return (
              <div className="form-check" key={option}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="hasInsurance"
                  id={`hasInsurance-${option}`}
                  value={value}
                  checked={formData.hasInsurance === value}
                  onChange={() => {
                    setFormData((prev) => ({
                      ...prev,
                      hasInsurance: value,
                      ...(value === false && {
                        insurer: "",
                        policyNumber: "",
                        authCode: "",
                        insurance_card_file_1: null,
                      }),
                    }));
                    if (!value) {
                      toast.error(
                        "Admin will contact you regarding insurance."
                      );
                    }
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor={`hasInsurance-${option}`}
                >
                  {option}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {formData.hasInsurance === true && (
        <>
          <div className="mb-3">
            <label className="form-label">
              Insurer <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="insurer"
              className="form-control custom-placeholder"
              placeholder="Enter insurer name"
              value={formData.insurer || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              Policy number<span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="policyNumber"
              className="form-control custom-placeholder"
              placeholder="Enter policy number"
              value={formData.policyNumber || ""}
              onChange={handleChange}
            />
          </div>

          {/* <div className="mb-3">
            <label className="form-label">Claim code</label>
            <input
              type="text"
              name="authCode"
              className="form-control"
              placeholder="Enter claim code"
              value={formData.authCode || ""}
              onChange={handleChange}
            />
          </div> */}

          {/* Upload section */}
          <div className="d-flex align-items-center justify-content-between border rounded p-2">
            <div>
              <strong>Medical Indemnity Insurance</strong> &nbsp; - &nbsp;
              {formData.insurance_card_file_1 ? (
                <a
                  href={URL.createObjectURL(formData.insurance_card_file_1)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formData.insurance_card_file_1.name}
                </a>
              ) : (
                <span>No file uploaded</span>
              )}
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: "none" }}
                id="insuranceUpload"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData((prev) => ({
                      ...prev,
                      insurance_card_file_1: file,
                    }));
                  }
                }}
              />
            </div>
            <div>
              <label
                htmlFor="insuranceUpload"
                className="btn btn-primary mt-2 me-2"
              >
                Upload
              </label>
            </div>
          </div>
        </>
      )}

      {formData.hasInsurance === false && (
        <div className="mt-4">
          <h2 className="text-danger " style={{ fontSize: "12px" }}>
            ( Admin will contact you regarding insurance. Continue and complete
            your profile )
          </h2>
        </div>
      )}
    </>
  );
};

export default PersonalInformation;
