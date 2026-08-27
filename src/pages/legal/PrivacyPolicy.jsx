import LegalLayout, { Section, List } from '../../components/legal/LegalLayout.jsx'

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" effectiveDate="19 August 2026">
      <Section title="1. Introduction">
        <p>
          This Privacy Policy ("Privacy Policy") explains how RippleHub Technologies, having its
          registered office at E-27, Industrial Area Chanalon, Tehsil Kharar, SAS Nagar, Punjab,
          140103 ("RippleHub",
          "we", "us" or "our"), collects, uses, stores, processes and protects personal information
          relating to users of the RippleHub website (
          <a href="https://www.ripplehub.app" className="text-blue-300 underline underline-offset-2">
            www.ripplehub.app
          </a>
          ), mobile application and related services (collectively, the "Platform").
        </p>
        <p>
          This Privacy Policy should be read together with the{' '}
          <a href="/cookies" className="text-blue-300 underline underline-offset-2">
            RippleHub Cookie Policy
          </a>{' '}
          and the{' '}
          <a href="/terms" className="text-blue-300 underline underline-offset-2">
            Terms of Use
          </a>{' '}
          applicable to the Platform.
        </p>
        <p>
          RippleHub is a social impact platform intended to connect NGOs, volunteers, donors and
          communities, and facilitates the discovery of volunteering opportunities, interaction
          between users and NGOs, and related services offered through the Platform.
        </p>
        <p>
          By accessing or using the Platform, you acknowledge that you have read and understood
          this Privacy Policy. We are committed to processing personal data responsibly,
          transparently and in accordance with applicable data protection and privacy laws.
        </p>
      </Section>

      <Section title="2. Applicability">
        <p>This Privacy Policy applies to personal data collected through:</p>
        <List
          items={[
            'the RippleHub website;',
            'the RippleHub mobile application;',
            'registration and onboarding processes;',
            'NGO and volunteer verification processes;',
            'communications between users and RippleHub;',
            'participation in volunteering opportunities; and',
            'other services or features, including but not limited to Feed Posts, community posts, profile, SOS Alerts, etc. made available through the Platform.',
          ]}
        />
        <p>
          This Privacy Policy applies to volunteers, NGO representatives, visitors, registered
          users and other persons whose personal data is provided to RippleHub. For clarification
          of doubts, the term "NGO" used above and elsewhere in this policy includes any non-profit
          institution and/or organisation and/or voluntary citizens' group organized independently
          of government control to serve a public or social purpose, whether incorporated as an
          NGO, NPO, Trust, Society, Section 8 Company, Foundation, Charity, Community-Based
          Organisation (CBO), Faith-Based Organisation (FBO), or Religious Organisation.
        </p>
      </Section>

      <Section title="3. Information we collect">
        <p>Depending upon how you use the Platform, we may collect the following categories of information.</p>
        <p><b>3.1 Account and registration information</b></p>
        <p>When you create an account, we may collect:</p>
        <List
          items={[
            'full name;',
            'email address;',
            'mobile telephone number;',
            'username;',
            'password or authentication credentials;',
            'date of birth or age, where required;',
            'location or city;',
            'profile photograph; and',
            'other information voluntarily provided by you.',
          ]}
        />
        <p><b>3.2 Volunteer information</b></p>
        <p>If you register as a volunteer or apply for volunteering opportunities, we may collect information such as:</p>
        <List
          items={[
            'educational and professional qualifications;',
            'skills and areas of expertise;',
            'areas of interest;',
            'volunteering preferences;',
            'availability;',
            'geographical preferences;',
            'previous volunteering experience;',
            'profile information;',
            'information contained in applications submitted to NGOs; and',
            'communications or other information voluntarily provided by you.',
          ]}
        />
        <p><b>3.3 Identity verification information</b></p>
        <p>
          A volunteer may be required to undergo identity verification before applying for or
          participating in certain volunteering opportunities. For this purpose, RippleHub may
          collect, subject to applicable law:
        </p>
        <List
          items={[
            'photograph;',
            'Aadhaar/e-Aadhaar or other Aadhaar-related verification information, where legally permissible;',
            'driving licence;',
            'voter identity card;',
            'other Government-issued identity documents containing a photograph;',
            'Government-issued identity or residence documents issued in other jurisdictions;',
            'document number and relevant identifying information;',
            'date of birth;',
            'address or other information appearing on the identity document; and',
            'information concerning the status or outcome of identity verification.',
          ]}
        />
        <p>
          RippleHub will collect only such information as is reasonably required for the applicable
          verification purpose. Where Aadhaar is used, RippleHub may adopt masked Aadhaar, offline
          verification or other legally permissible methods of verification instead of collecting
          or retaining the full Aadhaar number, where practicable. RippleHub does not intend
          identity verification to constitute a certification or guarantee of a person's character,
          conduct, competence, criminal record, suitability or fitness for any particular
          volunteering activity.
        </p>
        <p><b>3.4 NGO information</b></p>
        <p>NGOs seeking to register on RippleHub may be required to provide information including:</p>
        <List
          items={[
            'name of the NGO;',
            'registration/incorporation details;',
            'registration certificate;',
            'PAN and other applicable tax registration details;',
            'FCRA registration/approval details, where applicable;',
            'registered office and contact details;',
            'website and social media information;',
            'details of directors, trustees, office bearers or authorised representatives;',
            'identity and contact information of the person registering the NGO;',
            'documents establishing the authority of such person to act on behalf of the NGO; and',
            'other documents reasonably required for verification.',
          ]}
        />
        <p><b>3.5 Communications and user content</b></p>
        <p>We may collect information contained in messages, enquiries, complaints, applications, feedback, reviews, reports, photographs, documents, and other material voluntarily submitted through the Platform.</p>
        <p><b>3.6 Technical and device information</b></p>
        <p>
          When you access the Platform, we may automatically collect certain technical information
          (subject to user permissions for internet, camera, notifications and location), including:
        </p>
        <List
          items={[
            'IP address;',
            'browser type;',
            'device type;',
            'operating system;',
            'device identifiers;',
            'approximate location;',
            'date and time of access;',
            'pages or features accessed;',
            'referring URLs;',
            'crash and diagnostic information; and',
            'log information.',
          ]}
        />
        <p><b>3.7 Cookies and similar technologies</b></p>
        <p>
          We use cookies and similar technologies to operate, secure, analyse and improve the
          Platform. Further information is provided in our{' '}
          <a href="/cookies" className="text-blue-300 underline underline-offset-2">
            Cookie Policy
          </a>
          .
        </p>
      </Section>

      <Section title="4. How we use the information we collect">
        <p>We may process personal data for the following purposes:</p>
        <p><b>4.1 Providing the Platform</b></p>
        <List
          items={[
            'creating and maintaining user accounts;',
            'providing Platform functionality;',
            'facilitating communication between users and NGOs;',
            'connecting volunteers with suitable volunteering opportunities;',
            'processing applications; and',
            'providing customer support.',
          ]}
        />
        <p><b>4.2 Verification</b></p>
        <p>We may use personal data and documents to:</p>
        <List
          items={[
            'verify the identity of volunteers;',
            'verify the registration status of NGOs;',
            'verify the authority of persons representing NGOs;',
            'prevent impersonation and fraudulent accounts;',
            'maintain the integrity and security of the Platform; and',
            'conduct re-verification where reasonably necessary.',
          ]}
        />
        <p><b>4.3 Safety, security and fraud prevention</b></p>
        <p>We may process information to:</p>
        <List
          items={[
            'detect and prevent fraud;',
            'investigate misuse of the Platform;',
            'prevent unauthorised access;',
            'investigate complaints and reports;',
            'protect users and NGOs;',
            'enforce our Terms of Use and other policies; and',
            'maintain the security and integrity of the Platform.',
          ]}
        />
        <p><b>4.4 Legal and regulatory compliance</b></p>
        <p>We may process and retain information where necessary to:</p>
        <List
          items={[
            'comply with applicable law;',
            'respond to lawful requests from governmental or regulatory authorities;',
            'establish, exercise or defend legal claims;',
            'maintain records required by law; and',
            'investigate suspected unlawful activity.',
          ]}
        />
        <p><b>4.5 Analytics and improvement</b></p>
        <p>
          We may use information to understand how users interact with the Platform and to improve
          its functionality, performance and user experience. We may use Google Analytics and
          similar services for these purposes.
        </p>
      </Section>

      <Section title="5. Basis for processing">
        <p>
          RippleHub will process personal data only for lawful and specified purposes and in
          accordance with applicable data protection laws. Depending upon the circumstances and
          applicable law, processing may be based upon:
        </p>
        <List
          items={[
            'consent provided by the user;',
            'provision and administration of services requested by the user;',
            'compliance with applicable legal obligations;',
            'prevention of fraud, misuse or security incidents;',
            "protection of the rights and interests of RippleHub, its users and other persons; or",
            'other lawful grounds recognised under applicable law.',
          ]}
        />
        <p>
          Where processing is based on consent, users may withdraw consent in accordance with
          applicable law. Withdrawal of consent may affect our ability to provide certain services
          or features for which the relevant information is necessary.
        </p>
      </Section>

      <Section title="6. Identity verification">
        <p>
          Certain volunteering opportunities may require a volunteer to verify their identity.
          Identity verification may involve submission of a photograph and an acceptable
          Government-issued identity document. RippleHub may accept, subject to applicable law and
          its verification requirements:
        </p>
        <List
          items={[
            'Aadhaar/e-Aadhaar or legally permissible Aadhaar verification;',
            'driving licence;',
            'voter identity card;',
            'other Government-issued photo identity documents;',
            'Government-issued identity documents issued by foreign jurisdictions; and',
            'other documents specifically approved by RippleHub.',
          ]}
        />
        <p>
          RippleHub may reject documents that are expired, illegible, incomplete, altered,
          inconsistent with the information provided by the user or otherwise incapable of
          reasonably establishing identity.
        </p>
        <p>
          Identity verification is intended only to establish that the person submitting the
          information is reasonably identifiable as the person represented by the submitted
          documentation. Verification does not constitute a background check, a criminal record
          check, a certification of character, an endorsement of the individual, a guarantee of
          safety, a guarantee of qualifications or competence, or a guarantee of suitability for
          any particular volunteering opportunity.
        </p>
        <p>
          RippleHub may suspend or withdraw a verification status where information is found to be
          inaccurate, fraudulent, outdated or otherwise unreliable.
        </p>
      </Section>

      <Section title="7. NGO verification">
        <p>
          NGOs may be required to submit registration and organisational documents before being
          permitted to access certain Platform features. RippleHub may review registration
          documents, tax and regulatory registrations, details of office bearers or trustees,
          identity of authorised representatives, documents establishing authority to represent the
          NGO, and other information reasonably necessary for onboarding.
        </p>
        <p>RippleHub may reject, suspend or terminate an NGO account where:</p>
        <List
          items={[
            'required information is not provided;',
            'documents cannot reasonably be verified;',
            'information appears inaccurate or misleading;',
            'the person registering the account cannot establish appropriate authority;',
            'fraudulent or unlawful activity is suspected;',
            'unlawful activities are found to have been carried out by any admin or member of an organisation, such as fraud, financial misconduct, misuse of funds, harassment, identity theft, forgery, illegal fundraising, or any other activity that violates applicable laws or regulations; or',
            'the NGO otherwise violates applicable Platform policies.',
          ]}
        />
        <p>
          Verification of an NGO does not constitute accreditation, certification, endorsement,
          recommendation or guarantee by RippleHub regarding the NGO, its activities, management,
          financial affairs, beneficiaries, employees, volunteers or future conduct. Users are
          encouraged to conduct their own due diligence before engaging with any NGO or
          participating in any activity.
        </p>
      </Section>

      <Section title="8. Sharing of personal information">
        <p>
          We may share personal data with the following categories of recipients where reasonably
          necessary and permitted by applicable law:
        </p>
        <p><b>8.1 NGOs and volunteers</b></p>
        <p>
          Certain profile and application information may be shared with an NGO when a volunteer
          applies for an opportunity or otherwise interacts with that NGO. Similarly, information
          concerning an NGO may be made available to volunteers and other users as part of the
          Platform's functionality.
        </p>
        <p><b>8.2 Service providers</b></p>
        <p>We may engage third-party service providers for services including:</p>
        <List
          items={[
            'cloud hosting;',
            'data storage (using Amazon Web Services, with hosting assumed to be located in India);',
            'website and application infrastructure;',
            'analytics;',
            'communications;',
            'cybersecurity;',
            'technical support; and',
            'other services necessary to operate the Platform.',
          ]}
        />
        <p>Our current hosting provider is Hostinger, with hosting assumed to be located in India.</p>
        <p><b>8.3 Legal and regulatory authorities</b></p>
        <p>
          We may disclose information where required or permitted by applicable law, legal process,
          court order or governmental or regulatory request.
        </p>
        <p><b>8.4 Corporate transactions</b></p>
        <p>
          Personal data may be transferred as part of a merger, acquisition, restructuring, sale of
          assets, financing or similar corporate transaction, subject to applicable law.
        </p>
      </Section>

      <Section title="9. Google Analytics">
        <p>
          RippleHub uses Google Analytics to understand how visitors use the Platform and to
          improve its performance and functionality. Google Analytics may collect information
          concerning your interaction with the Platform, including technical information, device
          information and usage information. The use of cookies and similar technologies is
          further explained in our{' '}
          <a href="/cookies" className="text-blue-300 underline underline-offset-2">
            Cookie Policy
          </a>
          . Users may also use available browser or device controls to manage cookies and tracking
          technologies.
        </p>
      </Section>

      <Section title="10. International data transfers">
        <p>
          RippleHub intends to make its services available internationally. Accordingly, personal
          data may be accessed, processed or stored in jurisdictions other than the country in
          which the user resides, subject to applicable law. Where required, RippleHub will
          implement appropriate safeguards and contractual or other measures for international
          transfers of personal data.
        </p>
      </Section>

      <Section title="11. Data security">
        <p>RippleHub takes reasonable technical and organisational measures to protect personal data against:</p>
        <List
          items={[
            'unauthorised access;',
            'unauthorised disclosure;',
            'alteration;',
            'loss;',
            'destruction; and',
            'other forms of unlawful or unauthorised processing.',
          ]}
        />
        <p>Such measures may include encryption, access controls, authentication mechanisms, secure storage, logging and monitoring, restricted employee access, security testing, and incident response procedures.</p>
        <p>
          Access to identity documents and other sensitive information will be restricted to
          authorised personnel and systems having a legitimate need for such access. However, no
          electronic transmission or storage system can be guaranteed to be completely secure.
          Further details are available in our{' '}
          <a href="/security" className="text-blue-300 underline underline-offset-2">
            Security Policy
          </a>
          .
        </p>
      </Section>

      <Section title="12. Data retention">
        <p>
          RippleHub will retain personal data only for as long as reasonably necessary for the
          purposes for which it was collected, including providing the Platform, maintaining
          account records, identity and NGO verification, preventing fraud and misuse, resolving
          disputes, maintaining security, complying with legal and regulatory obligations, and
          establishing, exercising or defending legal claims.
        </p>
        <p>
          Where an account is deleted, RippleHub may retain certain information notwithstanding
          deletion of the account where retention is reasonably necessary for legal, regulatory,
          security, fraud-prevention, dispute-resolution or other legitimate purposes.
        </p>
        <p>
          Identity verification records and relevant activity records may be retained for a minimum
          period of four (4) years following account deletion or the relevant activity, where
          reasonably required for the purposes described above. Certain records may be retained for
          a longer period where required or permitted by applicable law or where reasonably
          necessary for the purposes described in this Privacy Policy.
        </p>
        <p>Where information is no longer required, RippleHub will take reasonable steps to delete, anonymise or securely dispose of it.</p>
      </Section>

      <Section title="13. Account deletion">
        <p>
          Users may request deletion of their RippleHub account through the mechanisms made
          available on the Platform or by contacting RippleHub. RippleHub may also suspend or
          terminate accounts where the user violates applicable laws or Platform policies,
          fraudulent or abusive conduct is suspected, information submitted is materially false or
          misleading, the account poses a security or safety risk, or other circumstances described
          in the Terms of Use arise.
        </p>
        <p>
          Deletion of an account does not necessarily result in immediate deletion of all
          information associated with that account. Certain information, including identity
          verification records and activity records, may be retained for the period described in
          this Privacy Policy.
        </p>
      </Section>

      <Section title="14. User rights">
        <p>Subject to applicable law, users may have rights concerning their personal data, including rights to:</p>
        <List
          items={[
            'access information concerning their personal data;',
            'request correction of inaccurate or incomplete information;',
            'request deletion of personal data in appropriate circumstances;',
            'withdraw consent where processing is based on consent;',
            'raise grievances concerning processing of personal data; and',
            'exercise other rights available under applicable law.',
          ]}
        />
        <p>
          Requests may be made using the contact details provided in Section 19 below. Some
          requests may be subject to legal, security or other applicable limitations.
        </p>
      </Section>

      <Section title="15. Children's data">
        <p>
          The Platform is not intended to be used by children below the minimum age permitted under
          applicable law without the required consent or authorisation. Where applicable law
          requires parental or lawful guardian consent for processing a child's personal data,
          RippleHub will implement appropriate mechanisms for obtaining and verifying such consent.
          RippleHub may restrict or suspend accounts where it reasonably believes that information
          has been provided in violation of applicable age requirements.
        </p>
      </Section>

      <Section title="16. Third-party websites and services">
        <p>
          The Platform may contain links to third-party websites, services or applications.
          RippleHub does not control the privacy practices of such third parties. Users should
          review the applicable privacy policies of third-party websites and services before
          providing personal information to them.
        </p>
      </Section>

      <Section title="17. Data breaches and security incidents">
        <p>In the event of a personal data breach or other security incident, RippleHub will take reasonable steps to:</p>
        <List
          items={[
            'contain and investigate the incident;',
            'assess the nature and extent of the incident;',
            'take remedial measures;',
            'comply with applicable notification requirements; and',
            'notify affected individuals or relevant authorities where required by applicable law.',
          ]}
        />
      </Section>

      <Section title="18. Changes to this Privacy Policy">
        <p>
          RippleHub may update this Privacy Policy from time to time to reflect changes in the
          Platform, our data processing practices, applicable law, regulatory requirements, or
          security practices. The updated version will be published on the Platform with the
          revised effective date above. Where required by applicable law, RippleHub will provide
          additional notice or obtain consent before implementing material changes.
        </p>
      </Section>

      <Section title="19. Grievance and privacy contact">
        <p>
          For questions, requests or grievances relating to personal data or this Privacy Policy,
          users may contact:
        </p>
        <p>
          Grievance Officer / Data Protection Contact:
          <br />
          Mr. Amit Sharma
          <br />
          Email:{' '}
          <a href="mailto:contact@ripplehub.app" className="text-blue-300 underline underline-offset-2">
            contact@ripplehub.app
          </a>
          <br />
          Address: E-27, Industrial Area Chanalon, Tehsil Kharar, SAS Nagar, Punjab, 140103
        </p>
        <p>Users may contact the above representative regarding access or correction requests, deletion requests, withdrawal of consent, privacy concerns, identity verification concerns, data security concerns, or complaints regarding processing of personal data.</p>
      </Section>

      <Section title="20. Governing law">
        <p>
          This Privacy Policy shall be governed by and interpreted in accordance with the laws of
          India, subject to any mandatory privacy or data protection rights that may apply to users
          under the laws of their respective jurisdictions.
        </p>
      </Section>
    </LegalLayout>
  )
}
