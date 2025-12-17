import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// PUBLIC PAGES
import FirstLendingpage from "./pages/FirstLendingpage";
import SecondLendingpage from "./pages/SecondLendingpage";
import AllDoctorpage from "./pages/AllDoctorpage";
import DoctorDetailspage from "./pages/DoctorDetailspage";
import DoctorDetailspage2 from "./pages/DoctorDetailspage2";
import ConformBooking from "./pages/ConformBooking";
import CategoryDoctor from "./pages/CategoryDoctor";
import CategoryDoctorAll from "./pages/CategoryDoctorAll";
import Categorypage from "./pages/Categorypage";
import PersonalInformation from "./pages/PersonalInformation";
import InsuranceProvider from "./pages/InsuranceProvider";

// DOCTOR PAGES
import Dashboard from "./adminpage/sidebar/adminallpage/Dashboard";
import ProfileAdmin from "./adminpage/sidebar/adminallpage/Profileadmin";
import AvailabilitySchedule from "./adminpage/sidebar/adminallpage/AvailabilitySchedule";
import Patients from "./adminpage/sidebar/adminallpage/Patients";
import MyAppoinment from "./adminpage/sidebar/adminallpage/MyAppoinment";
import Prescriptions from "./adminpage/sidebar/adminallpage/Prescriptions";
import Messges from "./adminpage/sidebar/adminallpage/Message";
import EarningPayment from "./adminpage/sidebar/adminallpage/EarningPayment";
import Support from "./adminpage/sidebar/adminallpage/Support";

import PatientsDetails from "./adminpage/sidebar/adminallpage/PatientDetails";

// PATIENT PAGES
import DashboardPatient from "./adminpage/patientpage/patientsall/DashboardPatient";
import MyAppoinmentPatient from "./adminpage/patientpage/patientsall/MyAppointmentPatient";
import PrescriptionsPatient from "./adminpage/patientpage/patientsall/PrescriptionsPatient";
import ProfilePatient from "./adminpage/patientpage/patientsall/ProfilePatient";
import MyDoctors from "./adminpage/patientpage/patientsall/MyDoctor";
import MessagesPatient from "./adminpage/patientpage/patientsall/MessagePatient";
import SupportPatient from "./adminpage/patientpage/patientsall/SupportPatient";
import PaymentTreatments from "./adminpage/patientpage/patientsall/PaymentTreatments";
import MedicalRecord from "./adminpage/patientpage/patientsall/MedicalRecord";
import VoiceCall from "./pages/VoiceCall";
import AllDoctorpageinperson from "./pages/AllDoctorpageinperson";
import AllDoctorpagevideo from "./pages/AllDoctorpagevideo";
import AllDoctorcatsub from "./pages/AllDoctorcatsub";
import ContactPage from "./pages/ContactPage";
import AboutusPage from "./pages/AboutusPage";
import CategorypageDemo from "./pages/CategorypageDome";
import AllHospital from "./pages/AllHospital";
import AllPostcode from "./pages/AllPostcode";
import Blog from "./pages/Blog";
import CarriersPage from "./pages/CarriersPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import ReadHealthArticlePage from "./pages/ReadHealthArticlePage";
import YodocProfilePage from "./pages/YodocProfilePage";
import ForClinicPage from "./pages/ForClinicPage";
import YodocReachPage from "./pages/YodocReachPage";
import YoDocPrivacyPolicy from "./components/YoDocPrivacyPolicy";
import YoDocTermsPage from "./components/YoDocTermsPage";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from "./admin/auth/AdminLogin";
import AdminAllDoctors from "./admin/pages/AdminAllDoctors";
import AdminAllPatients from "./admin/pages/AdminAllPatients";
import EarningDashboardCharts from "./admin/pages/EarningDashboardCharts";
import YodocCharges from "./admin/pages/YodocCharges";
import AdminProfile from "./admin/pages/AdminProfile";
import DoctorProfile from "./admin/pages/DoctorProfile";
import PatientProfile from "./admin/pages/PatientProfile";
import AdminMessages from "./admin/pages/AdminMessages";
import AdminContactusPage from "./admin/pages/AdminContactusPage";

import stripePromise from "./stripePromise";
import { Elements } from "@stripe/react-stripe-js";
import PaymentSuccessPage from "./components/PaymentSuccessPage";
import PaymentCancelPage from "./components/PaymentCancelPage";
import VideoCallDoctor from "./adminpage/sidebar/adminallpage/VideoCallDoctor";
import VideoCallPatient from "./adminpage/sidebar/adminallpage/VideoCallPatient";
import AllDoctorcatsubNew from "./pages/AllDoctorcatsubNew";
import DoctorTermsandCond from "./admin/pages/DoctorTermsandCond";
import DoctorPrivacyPolicy from "./admin/pages/DoctorPrivacyPolicy";
import PatientTermsandCond from "./admin/pages/PatientTermsandCond";
import PatientPrivacyPolicy from "./admin/pages/PatientPrivacyPolicy";
import PatientPersonalInfo from "./components/PatientPersonalInfo";
import AdminAllCategories from "./admin/pages/AdminAllCategories";
import CategoryPage from "./admin/pages/CategoryPage";
import TermsAndConditions from "./admin/pages/TermsAndConditions";
import AdminSubCatPage from "./admin/pages/AdminSubCatPage";
import ClinicPage from "./components/ClinicPage";
import ScrollToTop from "./components/ScrollToTop";
import PatientAppointmentDetailsPage from "./pages/PatientAppointmentDetailsPage";
import AllOnlineDoctor from "./pages/AllOnlineDoctor";
import DoctorPage from "./pages/DoctorPageNew";
import DoctorPageNewDetail from "./pages/DoctorPageNewDetail";
import AddClinics from "./pages/AddClinics";
import DoctorAvailability from "./pages/DoctorAvailability";
import YoDocRegistration from "./pages/YoDocRegistration";
import UpdateClinic from "./pages/UpdateClinic";
import AdminPaymentDetails from "./admin/pages/AdminPaymentDetails";
import DoctorPaymentDetails from "./admin/pages/DoctorPaymentDetails";
import PatientFaqs from "./pages/PatientFaqs";
import DoctorFaqs from "./pages/DoctorFaqs";
import AdminAllActivityLogs from "./admin/pages/AdminAllActivityLogs";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-doctors"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAllDoctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-all-activity-logs"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAllActivityLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-payment-details"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPaymentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-doctor-payment-details"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DoctorPaymentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-patients"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAllPatients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-earnings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EarningDashboardCharts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-yodocharges"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <YodocCharges />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-doctor-profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-patient-profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-contactus-requests"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminContactusPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-manage-category"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAllCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-add-category"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CategoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-category/details/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSubCatPage />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/admin-messages" element={<AdminMessages />} /> */}

        {/* Public routes */}
        <Route path="/" element={<FirstLendingpage />} />
        <Route path="/privacy-policy" element={<YoDocPrivacyPolicy />} />
        {/* <Route path="/terms-and-conditions" element={<YoDocTermsPage />} /> */}
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        <Route
          path="/admin/terms-and-conditions"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorTermsandCond />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Patient/terms-and-conditions"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientTermsandCond />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/privacy-policy"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientPrivacyPolicy />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/privacy-policy"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorPrivacyPolicy />
            </ProtectedRoute>
          }
        />
        <Route path="/landing" element={<SecondLendingpage />} />
        <Route path="/alldoctor" element={<AllDoctorpage />} />
        <Route path="/doctornewpage" element={<DoctorPage />} />
        <Route
          path="/doctornewdetailspage/:id"
          element={<DoctorPageNewDetail />}
        />

        <Route path="/allonlinedoctor" element={<AllOnlineDoctor />} />

        <Route path="/alldoctorinperson" element={<AllDoctorpageinperson />} />
        <Route path="/alldoctorvideo" element={<AllDoctorpagevideo />} />
        <Route path="/alldoctorcatsub" element={<AllDoctorcatsub />} />
        <Route path="/alldoctorsubcat" element={<AllDoctorcatsubNew />} />

        <Route path="/doctordetails/:id" element={<DoctorDetailspage />} />
        <Route
          path="/doctorinpersonpage/:id"
          element={<DoctorDetailspage2 />}
        />
        <Route path="/confirmbooking" element={<ConformBooking />} />
        <Route path="/categorydoctor" element={<CategoryDoctor />} />
        <Route path="/categorydoctorall" element={<CategoryDoctorAll />} />
        <Route path="/category" element={<Categorypage />} />
        <Route path="/demo" element={<CategorypageDemo />} />

        <Route
          path="/information"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <PersonalInformation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-information"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientPersonalInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/insurance"
          element={
            <Elements stripe={stripePromise}>
              <InsuranceProvider />
            </Elements>
          }
        />
        <Route path="/doctor-registration" element={<YoDocRegistration />} />

        <Route path="/success" element={<PaymentSuccessPage />} />
        <Route path="/cancel" element={<PaymentCancelPage />} />
        <Route path="/voicecall" element={<VoiceCall />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about-us" element={<AboutusPage />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/carrier" element={<CarriersPage />} />
        {/* <Route path="/privacy-policy" element={<PrivacyPolicyPage />} /> */}
        <Route path="/clinics" element={<ClinicPage />} />
        <Route
          path="/read-health-article"
          element={<ReadHealthArticlePage />}
        />
        <Route path="/yodo-profile" element={<YodocProfilePage />} />
        <Route path="/for-clinic" element={<ForClinicPage />} />
        <Route path="/yodoc-reach" element={<YodocReachPage />} />

        <Route path="/hospital" element={<AllHospital />} />
        <Route path="/postcode" element={<AllPostcode />} />

        {/* Doctor protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-clinic"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <AddClinics />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/admin/update-clinic/:clinic_id"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <UpdateClinic />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/admin/profilesetting"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <ProfileAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/schedule"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <AvailabilitySchedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dayschedule"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorAvailability />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <Patients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patients-details/:patient_id"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <PatientAppointmentDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patientsDetails/:apptid/:slotid"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <PatientsDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <MyAppoinment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/prescriptions"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <Prescriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <Messges />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <EarningPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/support"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <Support />
            </ProtectedRoute>
          }
        />
        <Route path="/doctor-faqs" element={<DoctorFaqs />} />
        <Route
          path="/admin/videocalldoctor/:appt_id/:slot_id/:id/:patient_id/:name"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <VideoCallDoctor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/videocallpatient/:appt_id/:slot_id/:id/:name"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <VideoCallPatient />
            </ProtectedRoute>
          }
        />

        {/* Patient protected routes */}
        <Route
          path="/dashboardpatient"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <DashboardPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <MyAppoinmentPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/prescriptions"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PrescriptionsPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <ProfilePatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/my-doctors"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <MyDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/messages"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <MessagesPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/support"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <SupportPatient />
            </ProtectedRoute>
          }
        />

        <Route path="/patient-faqs" element={<PatientFaqs />} />

        <Route
          path="/patient/payments"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PaymentTreatments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/insurance-records"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <MedicalRecord />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
