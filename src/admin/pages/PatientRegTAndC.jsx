const TermsAndConditions = () => {
  return (
    <div className="terms-page">
      <style>{`
        .terms-page {
          max-width: 950px;
          margin: 0 auto;
          padding: 50px 25px;
          
          color: #333;
          line-height: 1.7;
        }

        .terms-page h1 {
          text-align: start;
          font-size: 28px;
          font-weight: 400;
          margin-bottom: 10px;
          color: #1a1a1a;
        }

        .terms-page .last-updated {
          text-align: start;
          font-size: 15px;
          color: #666;
          margin-bottom: 35px;
        }

        .terms-page h2 {
          font-size: 16px;
          font-weight: 400;
          color: #222;
          margin-top: 30px;
          margin-bottom: 10px;
        }

        .terms-page p {
          font-size: 16px;
          margin-bottom: 12px;
        }

        .terms-page ul {
          padding-left: 25px;
          margin-bottom: 10px;
        }

        .terms-page li {
          font-size: 16px;
          margin-bottom: 6px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .terms-page {
            padding: 30px 15px;
          }
          .terms-page h1 {
            font-size: 28px;
          }
          .terms-page h2 {
            font-size: 20px;
          }
          .terms-page p,
          .terms-page li {
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .terms-page {
            padding: 20px 10px;
          }
          .terms-page h1 {
            font-size: 24px;
          }
          .terms-page h2 {
            font-size: 18px;
          }
          .terms-page p,
          .terms-page li {
            font-size: 14px;
          }
        }
          .colored{
          color:#000;
          }
      `}</style>

      <h1>TERMS AND CONDITIONS</h1>
      <p className="last-updated">Last updated: 30 October 2025</p>

      <p>
        Please read these Terms and Conditions (“Terms”) carefully before using
        the Yodoc website, mobile application, and related services
        (collectively, the “Platform”).
      </p>
      <p>
        By accessing or using the Platform, you agree to be bound by these
        Terms. If you do not agree, you must not use the Platform.
      </p>

      <h2>1. Interpretation</h2>
      <p>In these Terms:</p>
      <ul>
        <li>
          “Yodoc”, “we”, “us”, or “our” refers to{" "}
          <span className="colored">Yodoc</span>, a company incorporated in
          England and Wales, with its registered office at{" "}
          <span className="colored">
            38f Chigwell Ln, Debden, Loughton IG10 3NY
          </span>
        </li>
        <li>
          “Platform” means the Yodoc website, mobile application, and related
          online services.
        </li>
        <li>
          “User”, “you”, or “your” means any person using the Platform,
          including patients, doctors, or other healthcare professionals.
        </li>
        <li>
          “Healthcare Provider” or “Doctor” means an independent medical
          professional or clinic registered on the Platform.
        </li>
        <li>
          “Consultation” means an appointment between a User and a Healthcare
          Provider, whether conducted virtually or in person.
        </li>
        <li>
          “Content” means all information, materials, and data made available on
          or through the Platform.
        </li>
      </ul>

      <h2>2. Nature of Services</h2>

      <p>
        2.1. Yodoc is a technology platform designed to connect Users with
        independent doctors, specialists, and healthcare providers for
        consultations.
      </p>

      <p>
        2.2. Yodoc does not provide medical advice, diagnosis, treatment, or
        clinical services of any kind.
      </p>

      <p>
        All healthcare services are provided solely by independent Healthcare
        Providers, who are individually responsible for their professional
        conduct and compliance with applicable laws and medical standards.
      </p>

      <p>2.3. By using Yodoc, you acknowledge that:</p>

      <ul>
        <li>
          Yodoc acts only as a facilitator of appointments and payments between
          you and the Healthcare Provider.
        </li>
        <li>
          Yodoc is not liable for the clinical outcome of any consultation or
          advice provided by a Healthcare Provider.
        </li>
        <li>
          Any contract for medical services is strictly between you and the
          Healthcare Provider.
        </li>
      </ul>

      <h2>3. Use of the Platform</h2>

      <p>
        3.1. Access to the Platform is permitted on a temporary basis. We
        reserve the right to withdraw or amend any part of the Platform without
        notice.
      </p>

      <p>
        3.2. You are responsible for ensuring that all persons accessing the
        Platform through your internet connection comply with these Terms.
      </p>

      <p>3.3. You must not misuse the Platform by:</p>

      <ul>
        <li>Introducing viruses, malware, or any harmful technology;</li>
        <li>
          Attempting unauthorised access to the Platform or related systems;
        </li>
        <li>Using the Platform for unlawful or unethical purposes.</li>
      </ul>

      <p>
        3.4. Yodoc reserves the right to suspend or terminate your access if you
        breach these Terms.
      </p>

      <h2>4. Booking and Consultations</h2>

      <p>4.1. The Platform allows Users to:</p>

      <ol>
        <li>Search and select a doctor or specialist;</li>
        <li>Enter required personal and medical details;</li>
        <li>Choose the mode of consultation (virtual or in-person); and</li>
        <li>Complete payment to confirm the appointment.</li>
      </ol>

      <p>
        4.2. Once a booking is confirmed, you will receive an appointment
        confirmation via email or SMS.
      </p>

      <p>
        4.3. For virtual consultations, the Platform may provide a secure video
        link or interface. You are responsible for ensuring a stable internet
        connection and appropriate privacy during the session.
      </p>

      <p>
        4.4. For in-person consultations, details of the clinic or practice will
        be provided after booking.
      </p>

      <h2>5. Payments and Fees</h2>

      <p>
        5.1. Yodoc facilitates payments on behalf of Healthcare Providers using
        secure third-party payment processors.
      </p>

      <p>
        5.2. When booking a consultation, you authorise Yodoc to collect the
        consultation fee and transfer it (less commission) to the respective
        Healthcare Provider after the appointment.
      </p>

      <p>
        5.3. All prices displayed on the Platform are provided by the Healthcare
        Provider. Yodoc does not determine medical fees.
      </p>

      <p>5.4. Cancellations and refunds:</p>
      <ul>
        <li>Cancellation policies are set by each Healthcare Provider.</li>
        <li>
          Refunds, if applicable, will be processed according to the provider’s
          policy.
        </li>
        <li>
          No-shows or late cancellations may result in forfeiture of fees.
        </li>
      </ul>

      <p>
        5.5. Yodoc is not responsible for disputes over fees, cancellations, or
        refunds between Users and Healthcare Providers.
      </p>

      <h2>6. No Medical Relationship</h2>
      <p>
        6.1. Use of the Platform does not create a doctor–patient relationship
        between you and Yodoc.
      </p>
      <p>
        6.2. Any medical advice, diagnosis, or treatment is delivered solely by
        the Healthcare Provider you consult with.
      </p>
      <p>
        6.3. You must not use the Platform for emergency medical needs. In a
        medical emergency, contact 999 or your local emergency service
        immediately.
      </p>

      <h2>7. Healthcare Provider Obligations</h2>
      <p>7.1. Healthcare Providers using the Platform must ensure that:</p>
      <ul>
        <li>
          They hold all necessary licences, qualifications, and insurance to
          practise;
        </li>
        <li>
          The information provided on their Yodoc profile is accurate and up to
          date; and
        </li>
        <li>
          They comply with applicable healthcare and data protection
          regulations.
        </li>
      </ul>
      <p>
        7.2. Yodoc does not independently verify the clinical qualifications of
        every Healthcare Provider but may conduct background checks where
        appropriate.
      </p>

      <h2>8. Content and Reviews</h2>
      <p>
        8.1. User-generated content (including reviews and ratings) must be
        honest, accurate, and comply with applicable laws.
      </p>

      <p>
        8.2. Yodoc reserves the right to remove any content that is false,
        defamatory, offensive, or misleading.
      </p>

      <p>
        8.3. By submitting content on the Platform, you grant Yodoc a
        non-exclusive, worldwide, royalty-free licence to use, reproduce, and
        display such content for operational and promotional purposes.
      </p>

      <h2>9. Intellectual Property</h2>
      <p>
        9.1. All intellectual property rights in the Platform and its Content
        are owned or licensed by Yodoc. All rights are reserved.
      </p>

      <p>
        9.2. You may not copy, distribute, or modify any part of the Platform
        without Yodoc’s prior written consent.
      </p>

      <h2>10. Limitation of Liability</h2>

      <p>
        10.1. Nothing in these Terms limits Yodoc’s liability for death or
        personal injury caused by negligence, or for fraud.
      </p>

      <p>10.2. To the fullest extent permitted by law:</p>
      <ul>
        <li>
          Yodoc provides the Platform “as is” without warranties of any kind;
        </li>
        <li>
          Yodoc shall not be liable for any indirect, consequential, or
          incidental damages; and
        </li>
        <li>Yodoc’s total aggregate liability shall not exceed £100.</li>
      </ul>

      <p>10.3. Yodoc is not liable for:</p>
      <ul>
        <li>The accuracy of information provided by Healthcare Providers;</li>
        <li>The quality or outcome of any consultation; or</li>
        <li>Any medical negligence or misconduct by Healthcare Providers.</li>
      </ul>

      <h2>11. Privacy and Data Protection</h2>
      <p>
        11.1. Yodoc collects and processes personal data in accordance with its
        Privacy Policy,available at <span className="colored">here.</span>
      </p>
      <p>11.2. By using the Platform, you consent to such processing.</p>

      <h2>12. Termination</h2>
      <div>
        <p>12.1 Yodoc may terminate your account if you breach these Terms.</p>
        <p>12.2 You may stop using the Platform anytime.</p>
        <p>
          12.3 Upon termination, all rights granted under these Terms cease
          immediately.
        </p>
      </div>

      <h2>13. Changes to These Terms</h2>
      <p>
        13.1 Yodoc may update these Terms from time to time. Updates will be
        effective once posted on the Platform.
      </p>
      <p>
        13.2 Continued use of the Platform after changes are posted constitutes
        your acceptance of the revised Terms.
      </p>

      <h2>14. Governing Law and Jurisdiction</h2>
      <p>
        These Terms and any dispute arising from them shall be governed by and
        construed in accordance with the laws of England and Wales, and subject
        to the exclusive jurisdiction of the courts of England and Wales.
      </p>

      <h2>15. Contact Us</h2>
      <p>
        For questions, feedback, or complaints, please contact us at:
        <br />
        Email:help@yodoc.co.uk
        <br />
        Address: 38f Chigwell Ln, Debden, Loughton IG10 3NY
      </p>
    </div>
  );
};

export default TermsAndConditions;
