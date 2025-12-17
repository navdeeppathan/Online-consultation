import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/images/Logo.png";

// YoDoc Terms & Conditions React page (no Tailwind).
// Fully responsive for all screen sizes.

export default function YoDocTermsPage() {
  useEffect(() => {
    const id = "yodoc-terms-styles";
    if (document.getElementById(id)) return;
    const css = `
      .yodoc-container {
        font-family: Inter, Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial;
        color: #0b1220;
        line-height: 1.6;
        padding: 20px;
        display: flex;
        justify-content: center;
        background: #f6f8fb;
      }

      .yodoc-inner {
        width: 100%;
        max-width: 1000px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 6px 22px rgba(11,18,32,0.06);
        padding: 32px;
      }

      .yodoc-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
      .yodoc-title { margin: 0; font-size: 26px; font-weight: 500; color: #07112a; }
      .yodoc-meta { color: #556; font-size: 14px; margin-top: 6px; }

      .yodoc-actions { display:flex; gap:10px; flex-wrap: wrap; }
      .yodoc-btn { background: #0b5fff; color: white; border: none; padding: 10px 14px; border-radius: 8px; cursor:pointer; font-weight:600; }
      .yodoc-btn.ghost { background: transparent; color:#0b5fff; border: 1px solid rgba(11,95,255,0.12); }

      .yodoc-toc { margin-top: 18px; padding: 16px; border-radius: 8px; background: #fbfdff; border: 1px solid #eef4ff; overflow-x: auto; }
      .yodoc-toc h3 { margin: 0 0 8px 0; font-size: 15px; }
      .yodoc-toc ul { margin: 0; padding-left: 18px; }
      .yodoc-toc a { color: #0b5fff; text-decoration: none; }
      .yodoc-toc a:hover { text-decoration: underline; }

      section.yodoc-section { margin-top: 22px; }
      section.yodoc-section h4 { margin: 0 0 10px 0; font-size: 18px; }
      section.yodoc-section p, section.yodoc-section li { color: #253243; font-size: 15px; }

      .muted { color: #6b778a; font-size: 14px; }
      .contact { margin-top: 24px; padding: 14px; background: #f8fbff; border-radius: 8px; border: 1px solid #e9f2ff; }

      footer.yodoc-footer { margin-top: 28px; font-size: 13px; color: #6b778a; text-align:center; }

      @media (max-width: 1024px) {
        .yodoc-inner { padding: 24px; }
        .yodoc-title { font-size: 22px; }
      }

      @media (max-width: 768px) {
        .yodoc-inner { padding: 20px; }
        .yodoc-title { font-size: 20px; }
        .yodoc-actions { width: 100%; justify-content: flex-start; }
        .yodoc-btn { flex: 1; text-align: center; }
      }

      @media (max-width: 480px) {
        .yodoc-inner { padding: 16px; }
        .yodoc-title { font-size: 18px; }
        section.yodoc-section h4 { font-size: 16px; }
        section.yodoc-section p, section.yodoc-section li { font-size: 14px; }
        .yodoc-toc { font-size: 14px; }
      }

      @media print {
        body * { visibility: hidden; }
        .yodoc-container, .yodoc-container * { visibility: visible; }
        .yodoc-container { position: absolute; left: 0; top: 0; width: 100%; }
        .yodoc-actions { display:none; }
      }
    `;

    const style = document.createElement("style");
    style.id = id;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }, []);

  const handlePrint = () => window.print();
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const navigate = useNavigate();

  return (
    <div className="yodoc-container">
      <div className="yodoc-inner" role="main">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "40px",
            // optional horizontal padding
          }}
        >
          {/* Logo */}
          <a className="navbar-brand">
            <Link to="/">
              <img src={Logo} alt="Logo" className="logocss" />
            </Link>
          </a>

          {/* Button */}
          {/* <button
            style={{
              padding: "5px 10px",
              backgroundColor: "#207EB1",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#105a8b")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#207EB1")}
            onClick={() => navigate("/")}
          >
            Back to Yodoc
          </button> */}
        </div>
        <header className="yodoc-header">
          <div>
            <h1 className="yodoc-title">YoDoc – Terms and Conditions</h1>
            <div className="yodoc-meta">
              Effective Date: <strong>01-09-2025</strong>
            </div>
          </div>
          {/* <div className="yodoc-actions">
            <button className="yodoc-btn" onClick={handlePrint}>
              Print / Save PDF
            </button>
            <button
              className="yodoc-btn ghost"
              onClick={() => scrollTo("contact")}
            >
              Contact
            </button>
          </div> */}
        </header>

        <div className="yodoc-toc">
          <h3>Table of Contents</h3>
          <ul>
            <li>
              <a href="#definitions">1. Definitions</a>
            </li>
            <li>
              <a href="#acceptance">2. Acceptance of Terms</a>
            </li>
            <li>
              <a href="#platformuse">3. Platform Use</a>
            </li>
            <li>
              <a href="#appointments">
                4. Appointment Booking and Cancellation
              </a>
            </li>
            <li>
              <a href="#payments">5. Payments and Refunds</a>
            </li>
            <li>
              <a href="#doctor">6. Doctor Responsibilities</a>
            </li>
            <li>
              <a href="#patient">7. Patient Responsibilities</a>
            </li>
            <li>
              <a href="#telemedicine">8. Telemedicine Disclaimer</a>
            </li>
            <li>
              <a href="#security">9. Platform Security and Data Privacy</a>
            </li>
            <li>
              <a href="#prohibited">10. Prohibited Activities</a>
            </li>
            <li>
              <a href="#liability">11. Limitation of Liability</a>
            </li>
            <li>
              <a href="#indemnification">12. Indemnification</a>
            </li>
            <li>
              <a href="#termination">13. Termination</a>
            </li>
            <li>
              <a href="#law">14. Governing Law</a>
            </li>
            <li>
              <a href="#misc">15. Miscellaneous</a>
            </li>
            <li>
              <a href="#contact">Contact Information</a>
            </li>
          </ul>
        </div>

        {/* Sections */}
        <section className="yodoc-section" id="definitions">
          <h4>1. Definitions</h4>
          <p>
            <strong>User / Patient:</strong> Any individual using the Platform
            to search, book, or access medical services.
          </p>
          <p>
            <strong>Doctor / Clinic:</strong> Healthcare providers registered on
            YoDoc offering services via the Platform.
          </p>
          <p>
            <strong>Appointment:</strong> A scheduled consultation between a
            Patient and a Doctor via
            {/* in-person,  */}
            telemedicine, or other means facilitated by YoDoc.
          </p>
          <p>
            <strong>Services:</strong> Booking, teleconsultation, payment
            processing, notifications, and related services offered via YoDoc.
          </p>
        </section>

        <section className="yodoc-section" id="acceptance">
          <h4>2. Acceptance of Terms</h4>
          <p>
            By registering or using the Platform, you acknowledge that you have
            read, understood, and agree to be bound by these T&C, including any
            amendments or updates. YoDoc may update these terms at any time;
            continued use constitutes acceptance of the changes.
          </p>
        </section>

        <section className="yodoc-section" id="platformuse">
          <h4>3. Platform Use</h4>
          <ul>
            <li>
              YoDoc provides a platform to search, compare, and book
              appointments with Doctors.
            </li>
            <li>
              YoDoc does not provide medical advice, diagnosis, or treatment.
              All medical services are provided solely by the registered Doctor.
            </li>
            <li>
              Users must provide accurate personal information for registration
              and appointment booking.
            </li>
            <li>
              You must be at least 18 years old or have parental/guardian
              consent to use the Platform.
            </li>
          </ul>
        </section>

        <section className="yodoc-section" id="appointments">
          <h4>4. Appointment Booking and Cancellation</h4>
          <ul>
            <li>
              Appointment availability is subject to the Doctor’s schedule.
            </li>
            <li>
              YoDoc confirms appointments on behalf of the Doctor but cannot
              guarantee availability in case of Doctor unavailability.
            </li>
            <li>
              Patients may cancel or reschedule appointments subject to the
              Doctor’s policies. YoDoc is not liable for fees or penalties
              charged by Doctors for cancellation.
            </li>
            <li>
              Doctors may cancel appointments due to emergencies. YoDoc will
              notify Patients promptly but is not responsible for inconvenience
              or damages.
            </li>
          </ul>
        </section>

        <section className="yodoc-section" id="payments">
          <h4>5. Payments and Refunds</h4>
          <ul>
            <li>
              Payment for appointments may be collected through the Platform or
              directly by the Doctor.
            </li>
            <li>YoDoc may charge service fees as disclosed at checkout.</li>
            <li>
              Refunds are subject to the Doctor’s policy. YoDoc will facilitate
              refunds where applicable but is not liable for disputes over fees
              between Patients and Doctors.
            </li>
            <li>
              All payments are processed securely; however, YoDoc is not
              responsible for payment failures due to technical or banking
              errors beyond our control.
            </li>
          </ul>
        </section>

        <section className="yodoc-section" id="doctor">
          <h4>6. Doctor Responsibilities</h4>
          <ul>
            <li>
              Doctors must be fully licensed and authorized to practice in their
              jurisdiction.
            </li>
            <li>
              Doctors are responsible for patient care, medical advice,
              treatment, and follow-ups.
            </li>
            <li>
              Doctors must update availability regularly to avoid appointment
              conflicts.
            </li>
            <li>
              Doctors must comply with all applicable medical regulations
              including telemedicine and patient confidentiality laws.
            </li>
            <li>
              Doctors must maintain professional behavior; YoDoc reserves the
              right to suspend or terminate any Doctor violating these terms.
            </li>
          </ul>
        </section>

        <section className="yodoc-section" id="patient">
          <h4>7. Patient Responsibilities</h4>
          <ul>
            <li>
              Patients must provide accurate medical history and information to
              Doctors.
            </li>
            <li>
              Patients must attend appointments punctually or follow the
              Doctor’s cancellation/rescheduling policy.
            </li>
            <li>
              Patients must follow Doctor’s medical instructions; YoDoc is not
              responsible for treatment outcomes.
            </li>
            <li>
              Patients must not misuse the Platform for fraudulent activity,
              harassment, or sharing illegal content.
            </li>
          </ul>
        </section>

        <section className="yodoc-section" id="telemedicine">
          <h4>8. Telemedicine / Online Consultation Disclaimer</h4>
          <ul>
            <li>
              Telemedicine consultations are subject to local regulations; YoDoc
              acts only as a facilitator.
            </li>
            <li>
              YoDoc is not responsible for misdiagnosis, treatment errors, or
              delays in care.
            </li>
            <li>
              YoDoc is not responsible for technical issues such as poor
              internet connection, software glitches, or device failures.
            </li>
            <li>
              Patients should seek emergency medical attention for urgent
              conditions; online consultation does not replace emergency care.
            </li>
          </ul>
        </section>

        <section className="yodoc-section" id="security">
          <h4>9. Platform Security and Data Privacy</h4>
          <ul>
            <li>
              YoDoc uses reasonable technical measures to protect user data.
            </li>
            <li>
              Personal and medical data may be shared with the Doctor strictly
              for appointment and treatment purposes.
            </li>
            <li>
              Users must not share login credentials. YoDoc is not liable for
              unauthorized access due to user negligence.
            </li>
            <li>
              Data processing is subject to our Privacy Policy, incorporated
              into these T&C.
            </li>
          </ul>
        </section>

        <section className="yodoc-section" id="prohibited">
          <h4>10. Prohibited Activities</h4>
          <ul>
            <li>Impersonate other users or doctors</li>
            <li>Send spam or unsolicited communications</li>
            <li>
              Access the system for unauthorized purposes (hacking, scraping,
              etc.)
            </li>
            <li>Violate local laws or medical regulations</li>
          </ul>
          <p>
            YoDoc reserves the right to block or terminate accounts involved in
            prohibited activities.
          </p>
        </section>

        <section className="yodoc-section" id="liability">
          <h4>11. Limitation of Liability</h4>
          <p>
            YoDoc is a platform provider only; we are not liable for medical
            malpractice, negligence, or treatment outcomes.
          </p>
          <ul>
            <li>Appointment cancellations by Doctors</li>
            <li>Payment disputes</li>
            <li>Technical failures, interruptions, or data loss</li>
          </ul>
          <p>
            To the maximum extent permitted by law, YoDoc’s total liability is
            limited to the fees paid by the Patient for the appointment booked
            via the Platform.
          </p>
        </section>

        <section className="yodoc-section" id="indemnification">
          <h4>12. Indemnification</h4>
          <p>
            You agree to indemnify and hold harmless YoDoc, its officers,
            employees, and affiliates against any claims, damages, or
            liabilities arising from your use of the Platform, violation of
            these T&C, or negligence.
          </p>
        </section>

        <section className="yodoc-section" id="termination">
          <h4>13. Termination</h4>
          <ul>
            <li>Suspend or terminate your account for violation of T&C.</li>
            <li>
              Restrict access for Doctors who fail to meet professional or
              operational standards.
            </li>
            <li>
              Remove any content deemed inappropriate, illegal, or misleading.
            </li>
          </ul>
        </section>

        <section className="yodoc-section" id="law">
          <h4>14. Governing Law</h4>
          <p>
            These Terms and Conditions are governed by the laws of United
            Kingdom. Any disputes shall be resolved in the competent courts of
            [Insert Jurisdiction].
          </p>
        </section>

        <section className="yodoc-section" id="misc">
          <h4>15. Miscellaneous</h4>
          <ul>
            <li>
              These T&C, along with the Privacy Policy and any other agreements,
              constitute the entire agreement.
            </li>
            <li>
              If any provision is found invalid, the remainder will continue in
              full force.
            </li>
            <li>
              YoDoc may update these T&C at any time, with the latest version
              effective upon posting on the Platform.
            </li>
          </ul>
        </section>

        {/* Contact Section */}
        <section className="yodoc-section contact" id="contact">
          <h4>Contact Information</h4>
          <p>Email: info@yodoc.co.uk</p>
          <p>Address: London, UK</p>
          <p>Phone: +44 - 7879 175585</p>
        </section>

        <footer className="yodoc-footer">
          <p className="muted">
            © {new Date().getFullYear()} YoDoc. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
