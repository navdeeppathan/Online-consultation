import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";
import Navbar from "../../adminpage/sidebar/Navbar";
import Sidebar from "../../adminpage/sidebar/Sidebar";

export default function DoctorPrivacyPolicy() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 content-area">
        <Navbar />
        <div className=" bgcolor  p-3">
          <div className="yp-container" role="main">
            <h1 className="yp-title">Privacy Policy</h1>
            <p className="yp-last-updated">Last updated: 30 October 2025</p>

            {/* 1. INTRODUCTION */}
            <section className="intro-section">
              <h2>1. Introduction</h2>
              <p>
                This Privacy Notice explains how Yodoc (“Yodoc”, “we”, “us”, or
                “our”) collects, uses, stores, and shares your personal
                information when you use our platform, which includes:
              </p>
              <ul>
                <li>Our website and web applications;</li>
                <li>Our mobile applications; and</li>
                <li>
                  Associated online services, including appointment booking and
                  doctor review features.
                </li>
              </ul>
              <p>
                Yodoc provides an online platform that allows patients to find,
                review, and book appointments with healthcare professionals
                (“the Yodoc Platform”).
              </p>
              <p>
                We do not provide medical services ourselves. All consultations
                and healthcare services are delivered by independent, registered
                medical professionals.
              </p>
              <p>
                This notice applies to both patients and healthcare
                professionals who use our platform.
              </p>

              <style jsx>{`
                .intro-section {
                  color: #000;

                  margin: 0 auto;
                  padding: 20px;

                  line-height: 1.6;
                }

                h2 {
                  font-size: 16px;
                  font-weight: 400;
                  margin-bottom: 16px;
                }

                p {
                  font-size: 15px;
                  margin-bottom: 14px;
                }

                ul {
                  list-style-type: disc;
                  margin: 10px 0 18px 25px;
                  padding: 0;
                }

                li {
                  font-size: 15px;
                  margin-bottom: 10px;
                }
              `}</style>
            </section>

            <section className="imp-section">
              <h2>2. Important Information and Who We Are</h2>

              <p>Data Controller:</p>
              <p>Yodoc — registered in England and Wales</p>

              <p>
                Registered address:{" "}
                <span>38f Chigwell Ln, Debden, Loughton IG10 3NY</span>
              </p>

              <p>
                Company number: <span> 01234 440530</span>
              </p>

              <p>Contact:</p>

              <ul>
                <li>
                  Data Protection Officer (DPO):{" "}
                  <a href="mailto:dpo@yodoc.co.uk">dpo@yodoc.co.uk</a>
                </li>
                <li>
                  General enquiries:{" "}
                  <a href="mailto:help@yodoc.co.uk">help@yodoc.co.uk</a>
                </li>
              </ul>

              <p>Supervisory Authority:</p>
              <p>
                You may contact the Information Commissioner’s Office (ICO)
                regarding any data protection concerns.
              </p>
              <p>
                We review this policy regularly. Updates will appear on this
                page and, where appropriate, be notified to you directly.
              </p>

              <style>{`
        .imp-section {
         
          line-height: 1.7;
          color: #000;
          padding: 20px;
          
        }

        .imp-section h2 {
          font-size: 16px;
          font-weight: 400;
          margin-bottom: 10px;
        }

        .imp-section p {
          margin: 6px 0;
        }

        .imp-section ul {
          list-style-type: disc;
         
          margin-top: 6px;
          margin-bottom: 10px;
        }

        .imp-section a {
          color: #000;
          text-decoration: none;
        }

        .imp-section a:hover {
          text-decoration: underline;
        }

        .highlight {
          color: #000;
        }
      `}</style>
            </section>

            <section className="data-section">
              <h2>3. The Data We Collect</h2>

              <h3>3.1 Patients</h3>
              <p>We may collect the following data:</p>
              <ul>
                <li>
                  Identity Data:{" "}
                  <span className="highlight">
                    Name, date of birth, gender.
                  </span>
                </li>
                <li>Contact Data: Email address, phone number.</li>
                <li>
                  Appointment Data: Booked doctor, date/time, clinic location,
                  consultation type.
                </li>
                <li>
                  Health Data (limited): Information necessary to arrange or
                  confirm your appointment.
                </li>
                <li>Review Data: Feedback, ratings, and comments.</li>
                <li>
                  Technical Data: Device identifiers, IP address, browser type,
                  cookies, and analytics data.
                </li>
                <li>
                  Marketing Preferences: Communication and opt-in choices.
                </li>
              </ul>

              <h3>3.2 Healthcare Professionals</h3>
              <p>
                We collect limited professional data to display your profile:
              </p>
              <ul>
                <li>
                  Identity and Registration Data:{" "}
                  <span className="highlight">
                    Name, title, GMC or relevant registration details.
                  </span>
                </li>
                <li>
                  Practice and Contact Data: Clinic address, phone, and email.
                </li>
                <li>
                  Professional Profile Data: Qualifications, specialties,
                  experience.
                </li>
                <li>Review Data: Feedback from verified patients.</li>
                <li>Technical Data: Device and analytics data.</li>
                <li>Marketing Preferences: Communication choices.</li>
              </ul>

              <style>{`
        .data-section {
          
          line-height: 1.7;
          color: #000;
          padding: 20px;
        }

        .data-section h2 {
          font-size: 16px;
          font-weight: 400;
          margin-bottom: 10px;
        }

        .data-section h3 {
          font-size: 1.1rem;
          font-weight: 400;
          margin-top: 20px;
          margin-bottom: 8px;
        }

        .data-section p {
          margin: 6px 0 8px 0;
        }

        .data-section ul {
          list-style-type: disc;
          
          margin-bottom: 10px;
        }

        .data-section li {
          margin-bottom: 8px;
        }

        .highlight {
          color: #000;
        }
      `}</style>
            </section>

            <section className="collect-section">
              <h2>4. How We Collect Your Data</h2>

              <p>We collect data:</p>

              <ul>
                <li>
                  Directly from you: through registration, bookings, or reviews.
                </li>
                <li>Automatically: through cookies and analytics.</li>
                <li>
                  From healthcare professionals: to confirm appointments or
                  respond to feedback.
                </li>
              </ul>

              <style>{`
        .collect-section {
         
          line-height: 1.7;
          color: #000;
          padding: 20px;
        }

        .collect-section h2 {
          font-size: 16px;
          font-weight: 400;
          margin-bottom: 16px;
        }

        .collect-section p {
          margin: 8px 0;
        }

        .collect-section ul {
          list-style-type: disc;
         
          margin-top: 8px;
        }

        .collect-section li {
          margin-bottom: 8px;
        }
      `}</style>
            </section>

            <section className="use-section">
              <h2>5. How We Use Your Data</h2>

              <p>We use your information to:</p>

              <ul>
                <li>
                  Manage appointment bookings and confirmations (Contract);
                </li>
                <li>
                  Share booking details with the chosen healthcare provider{" "}
                  (Explicit Consent);
                </li>
                <li>
                  Publish and verify patient reviews (Legitimate Interests);
                </li>
                <li>
                  Send reminders, updates, and service communications{" "}
                  (Contract);
                </li>
                <li>
                  Improve and personalise our platform (Legitimate Interests);
                </li>
                <li>
                  Send marketing communications (only with Consent, or under the
                  soft opt-in rule for existing users) .
                </li>
              </ul>

              <p className="note">
                When you book an appointment, your details (including relevant
                health data) are securely shared with your chosen healthcare
                professional or clinic. Once shared, that provider becomes the
                data controller for your consultation data. Please review their
                privacy policy for further information.
              </p>

              <style>{`
        .use-section {
          
          line-height: 1.7;
          color: #000;
          padding: 20px;
        }

        .use-section h2 {
          font-size: 16px;
          font-weight: 400;
          margin-bottom: 14px;
        }

        .use-section p {
          margin: 8px 0;
        }

        .use-section ul {
          list-style-type: disc;
          padding-left: 20px;
          margin: 10px 0 15px 0;
        }

        .use-section li {
          margin-bottom: 8px;
        }

        .note {
          margin-top: 20px;
          line-height: 1.8;
        }
      `}</style>
            </section>

            <section className="payment-section">
              <h2>6. Payment Information</h2>

              <p>
                Yodoc uses trusted third-party payment processors to manage all
                card payments securely.
              </p>

              <p>
                We do not collect, store, or process your full card details.
              </p>

              <p>
                When you make a payment, your card information is transmitted
                directly to our payment partner, such as Stripe, PayPal, or
                another PCI DSS–compliant provider, in an encrypted and secure
                manner.
              </p>

              <p>
                We only receive a transaction reference or token for
                record-keeping and reconciliation purposes.
              </p>

              <p>
                We may retain limited payment information (e.g. transaction
                date, amount, booking ID) to:
              </p>

              <ul>
                <li>Confirm successful payments or refunds (Contract);</li>
                <li>Prevent fraud (Legitimate Interests);</li>
                <li>
                  Comply with accounting and legal obligations (Legal
                  Obligation).
                </li>
              </ul>
              <p>
                Our payment partners process card data in full compliance with
                the Payment Card Industry Data Security Standard (PCI DSS).
              </p>

              <style>{`
        .payment-section {
          
          line-height: 1.7;
          color: #000;
          padding: 20px;
        }

        .payment-section h2 {
          font-size: 16px;
          font-weight: 400;
          margin-bottom: 14px;
        }

        .payment-section p {
          margin: 8px 0;
        }

        .payment-section ul {
          list-style-type: disc;
         
          margin-top: 10px;
        }

        .payment-section li {
          margin-bottom: 8px;
        }
      `}</style>
            </section>
            <section className="share-section">
              <h2>7. Sharing Your Data</h2>

              <p>We only share your personal data:</p>

              <ul>
                <li>With doctors or clinics you book appointments with;</li>
                <li>
                  With service providers who operate parts of our platform
                  (hosting, payments, analytics);
                </li>
                <li>With professional advisers, if required by law;</li>
                <li>To comply with legal or regulatory obligations.</li>
              </ul>

              <p>
                All third parties are bound by confidentiality and data
                protection agreements.
              </p>

              <p>
                We do not sell or rent your data to third parties for marketing.
              </p>

              <h2>8. International Transfers</h2>

              <p>
                Where data is transferred outside the UK or EEA, we ensure it is
                protected by appropriate safeguards such as Standard Contractual
                Clauses or adequacy decisions under UK GDPR.
              </p>

              <style>{`
        .share-section {
          
          line-height: 1.7;
          color: #000;
          padding: 20px;
        }

        .share-section h2 {
          font-size: 16px;
          font-weight: 400;
          margin-top: 20px;
          margin-bottom: 10px;
        }

        .share-section p {
          margin: 8px 0;
        }

        .share-section ul {
          list-style-type: disc;
          padding-left: 20px;
          margin: 8px 0 15px 0;
        }

        .share-section li {
          margin-bottom: 8px;
        }
      `}</style>
            </section>
            <section className="data-retention-section">
              <h2>9. Data Retention</h2>

              <p>
                We retain personal data only as long as necessary for its
                purpose or to meet legal obligations.
              </p>

              <table className="retention-table">
                <thead>
                  <tr>
                    <th>Data Type</th>
                    <th>Retention Period</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Booking records</td>
                    <td>7 years</td>
                  </tr>
                  <tr>
                    <td>Transaction data</td>
                    <td>7 years</td>
                  </tr>
                  <tr>
                    <td>Reviews</td>
                    <td>Indefinitely (anonymised)</td>
                  </tr>
                  <tr>
                    <td>Technical logs</td>
                    <td>90 days</td>
                  </tr>
                  <tr>
                    <td>Marketing preferences</td>
                    <td>Until withdrawn + 3 years suppression</td>
                  </tr>
                  <tr>
                    <td>Professional profiles</td>
                    <td>Active account + 7 years</td>
                  </tr>
                </tbody>
              </table>

              <style>{`
          .data-retention-section {
            
            line-height: 1.7;
            color: #000;
            padding: 20px;
          }

          .data-retention-section h2 {
            font-size: 16px;
            font-weight: 400;
            margin-bottom: 10px;
          }

          .data-retention-section p {
            margin-bottom: 20px;
          }

          .retention-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }

          .retention-table th {
            text-align: left;
            font-weight: 400;
            padding: 10px 5px;
            border-bottom: 1px solid #ccc;
          }

          .retention-table td {
            padding: 10px 5px;
            vertical-align: top;
          }

          .retention-table tr:not(:last-child) td {
            border-bottom: 1px solid #eee;
          }
        `}</style>
            </section>
            <section className="rights-cookies-contact">
              {/* Section 10 */}
              <h2>10. Your Rights</h2>
              <p>Under UK GDPR, you have the right to:</p>
              <ul>
                <li>Access your personal data;</li>
                <li>Request correction or deletion;</li>
                <li>Restrict or object to processing;</li>
                <li>Withdraw consent at any time;</li>
                <li>Request data portability.</li>
              </ul>
              <p>
                To exercise these rights, contact{" "}
                <a href="mailto:dpo@yodoc.co.uk">dpo@yodoc.co.uk</a>.
              </p>
              <p>We will respond within one month.</p>

              {/* Section 11 */}
              <h2>11. Cookies</h2>
              <p>
                We use cookies and similar technologies to improve your browsing
                experience and analyse platform usage.
              </p>

              {/* Section 12 */}
              <h2>12. Contact</h2>
              <p>
                Data Protection Officer:{" "}
                <a href="mailto:dpo@yodoc.co.uk">dpo@yodoc.co.uk</a>
              </p>

              <p className="contact-footer">
                General enquiries:{" "}
                <a href="mailto:help@yodoc.co.uk">help@yodoc.co.uk</a>
                <br />
                Postal Address:{" "}
                <span>38f Chigwell Ln, Debden, Loughton IG10 3NY</span>
              </p>

              <style>{`
        .rights-cookies-contact {
          
          color: #000;
          line-height: 1.7;
          padding: 20px;
        }

        .rights-cookies-contact h2 {
          font-size: 16px;
          font-weight: 400;
          margin-top: 25px;
          margin-bottom: 10px;
        }

        .rights-cookies-contact ul {
          margin: 10px 0 20px 25px;
          padding: 0;
        }

        .rights-cookies-contact li {
          margin-bottom: 8px;
        }

        .rights-cookies-contact a {
          color: #000;
          text-decoration: none;
        }

        .rights-cookies-contact a:hover {
          text-decoration: underline;
        }

        .contact-footer {
          margin-top: 20px;
          color: #000;
        }
      `}</style>
            </section>
            <section className="updates-policy">
              {/* Section 13 */}
              <h2>13. Updates to This Policy</h2>
              <p>We may update this Privacy Policy from time to time.</p>
              <p>
                The most recent version will always be available on our website.
              </p>
              <p>
                Significant changes will be communicated to you directly, where
                appropriate.
              </p>

              <style>{`
        .updates-policy {
          
          color: #000;
          line-height: 1.7;
          padding: 20px;
        }

        .updates-policy h2 {
          font-size: 16px;
          font-weight: 400;
          margin-bottom: 10px;
        }

        .updates-policy p {
          margin-bottom: 10px;
        }

        .legal-title {
          color: #000;
          font-weight: bold;
          margin-top: 25px;
          margin-bottom: 10px;
        }

        .legal-list {
          margin: 0 0 20px 25px;
          padding: 0;
          color: #000;
        }

        .legal-list li {
          margin-bottom: 8px;
        }
      `}</style>
            </section>
            <style>
              {`
        .yp-container {
 
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #fff;
}

section {
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.retention-table {
  display: block;
  overflow-x: auto;
  white-space: nowrap;
}

.yp-title {
  text-align: start;
  font-size: 28px;
  font-weight: 400;
  margin-bottom: 10px;
  padding:0px 20px;

}

.yp-last-updated {
  text-align: start;
  color: gray;
  margin-bottom: 30px;
  font-size: 0.9rem;
  padding:0px 20px;
}


        `}
            </style>
          </div>
        </div>
      </div>
    </div>
  );
}
