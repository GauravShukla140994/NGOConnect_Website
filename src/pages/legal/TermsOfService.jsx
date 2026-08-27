import LegalLayout, { Section, List } from '../../components/legal/LegalLayout.jsx'

export default function TermsOfService() {
  return (
    <LegalLayout title="Terms of Use" effectiveDate="22 August 2026">
      <Section title="1. Introduction">
        <p>
          These Terms of Use ("Terms") govern access to and use of the RippleHub website at{' '}
          <a href="https://www.ripplehub.app" className="text-blue-300 underline underline-offset-2">
            www.ripplehub.app
          </a>
          , mobile application and related services (collectively, the "Platform") operated by
          RippleHub Technologies, having its registered office at E-27, Industrial Area Chanalon,
          Tehsil Kharar, SAS Nagar, Punjab, 140103 ("RippleHub", "we", "us" or "our").
        </p>
        <p>
          The Platform is intended to facilitate connections and interaction between NGOs,
          volunteers, donors, communities and other users for social, charitable and
          community-oriented purposes.
        </p>
        <p>
          By accessing, registering with or using the Platform, you agree to be bound by these
          Terms, together with the{' '}
          <a href="/privacy" className="text-blue-300 underline underline-offset-2">
            Privacy Policy
          </a>
          ,{' '}
          <a href="/cookies" className="text-blue-300 underline underline-offset-2">
            Cookie Policy
          </a>
          , Community Guidelines, and other policies or rules published by RippleHub from time to
          time.
        </p>
        <p>
          If you do not agree to these Terms, you should not access or use the Platform. By
          accessing and using the Platform and Services, you agree to follow the terms of service,
          accept responsibility for your account activity, and consent to the Privacy Policy
          regarding data collection, and the same constitutes a binding legal agreement between you
          and RippleHub.
        </p>
      </Section>

      <Section title="2. Definitions">
        <p>For the purposes of these Terms:</p>
        <List
          items={[
            <>"Account" means an account created by a user for accessing or using features of the Platform.</>,
            <>"Community" means a group, forum, page or other user-created space on the Platform through which users may communicate, share content or participate in discussions around a particular subject, cause, location, organisation or interest.</>,
            <>"Content" means any text, photograph, image, video, audio, document, graphic, message, post, comment, review, profile information, link or other material submitted, uploaded, transmitted or otherwise made available through the Platform.</>,
            <>"NGO" means any non-profit institution and/or organisation and/or voluntary citizens' group organised independently of government control to serve a public or social purpose, whether incorporated as an NGO, NPO, Trust, Society, Section 8 Company, Foundation, Charity, Community-Based Organisation (CBO), Faith-Based Organisation (FBO), Religious Organisation or otherwise.</>,
            <>"Volunteer" means an individual who uses the Platform to identify, apply for or participate in volunteering or community activities.</>,
            <>"User" means any person who accesses, registers with or uses the Platform, including Volunteers, NGO representatives, Community administrators and other visitors.</>,
          ]}
        />
      </Section>

      <Section title="3. Eligibility">
        <List
          items={[
            'You may use the Platform only if you are legally capable of entering into a binding agreement under applicable law.',
            'Where a particular service or activity has a higher minimum age requirement, that requirement shall apply to such service or activity.',
            'Certain activities involving children or vulnerable persons may be subject to additional eligibility, safeguarding or verification requirements.',
            'If you are registering or acting on behalf of an NGO or other organisation, you represent that you have the necessary authority to do so.',
            'RippleHub may restrict or terminate an Account where it reasonably believes that the user does not satisfy applicable eligibility requirements.',
          ]}
        />
      </Section>

      <Section title="4. Nature of the Platform">
        <p>RippleHub is a technology platform intended to facilitate interaction between NGOs, Volunteers, Communities and other Users. RippleHub may provide functionality including:</p>
        <List
          items={[
            'NGO registration and verification;',
            'Volunteer registration and identity verification;',
            'volunteering opportunity listings;',
            'applications for volunteering opportunities;',
            'user profiles;',
            'Feed Posts;',
            'Community Posts;',
            'user-created Communities;',
            'messaging and communication features;',
            'SOS Alerts and related functionality;',
            'reporting and moderation mechanisms; and',
            'other services introduced from time to time.',
          ]}
        />
        <p>
          RippleHub is not itself an NGO, charity, employer, recruitment agency, volunteer
          organisation, travel agency, emergency service provider, medical provider, law-enforcement
          agency or governmental authority, unless expressly stated otherwise. RippleHub does not
          ordinarily organise, supervise, control or directly provide the volunteering activities
          listed by NGOs. Except where expressly agreed otherwise in writing, RippleHub is not a
          party to any arrangement, agreement or relationship entered into between an NGO and a
          Volunteer.
        </p>
        <p>
          RippleHub does not guarantee that any Volunteer will be accepted by an NGO or that any
          NGO will accept or retain a particular Volunteer. Similarly, RippleHub does not guarantee
          that any volunteering opportunity will remain available, proceed as advertised or result
          in any particular outcome.
        </p>
      </Section>

      <Section title="5. User accounts">
        <List
          items={[
            'Certain features of the Platform require registration and creation of an Account.',
            'You agree to provide accurate, current and complete information when creating and maintaining your Account.',
            'You are responsible for maintaining the confidentiality of your login credentials and for activity carried out through your Account.',
          ]}
        />
        <p>You must immediately notify RippleHub if you suspect:</p>
        <List
          items={[
            'unauthorised access;',
            'loss or theft of credentials;',
            'impersonation;',
            'compromise of your Account; or',
            'any other security incident affecting your Account.',
          ]}
        />
        <p>You must not:</p>
        <List
          items={[
            "create an Account using another person's identity;",
            'impersonate another individual or organisation;',
            'create an Account for an organisation without authority;',
            'maintain multiple fraudulent Accounts;',
            'provide false or misleading information; or',
            'permit another person to use your Account in violation of these Terms.',
          ]}
        />
        <p>RippleHub may require additional information or verification where reasonably necessary for security, fraud prevention, identity verification or compliance purposes.</p>
      </Section>

      <Section title="6. NGO registration and verification">
        <List
          items={[
            'NGOs may be required to submit organisational and registration documents before being permitted to use certain Platform features.',
          ]}
        />
        <p>Such information may include:</p>
        <List
          items={[
            'registration or incorporation documents;',
            'registration numbers;',
            'PAN and other tax registrations;',
            'FCRA registration or approval information, where applicable;',
            'details of trustees, directors, office bearers or authorised representatives;',
            'identity documents;',
            'authority documents; and',
            'other information reasonably required for verification.',
          ]}
        />
        <p>A person registering an NGO represents that:</p>
        <List
          items={[
            'the information supplied is accurate and complete;',
            'the documents submitted are genuine and unaltered;',
            'the person has authority to represent the organisation; and',
            "the organisation's activities are lawful.",
          ]}
        />
        <p>
          RippleHub may conduct documentary or other verification considered reasonably appropriate.
          Verification does not constitute accreditation, certification, endorsement,
          recommendation, guarantee of legitimacy, guarantee of financial integrity, guarantee of
          use of funds, guarantee of safety, or guarantee of future conduct.
        </p>
        <p>RippleHub may reject, suspend, restrict or terminate an NGO Account where:</p>
        <List
          items={[
            'information is incomplete or inaccurate;',
            'documents cannot reasonably be verified;',
            'the registering person lacks appropriate authority;',
            'fraudulent or unlawful conduct is suspected;',
            'the NGO or its representatives violate these Terms or other Platform policies; or',
            'RippleHub reasonably considers such action necessary for the protection of Users or the Platform.',
          ]}
        />
        <p>An NGO must promptly notify RippleHub of any material change to its registration status, authorised representatives or other information relevant to its verification.</p>
      </Section>

      <Section title="7. Volunteer registration and identity verification">
        <List
          items={[
            'Volunteers may initially register without identity verification.',
            'Certain volunteering opportunities or Platform features may require identity verification.',
            "Where verification is required, RippleHub may request a photograph and Government-issued identity documentation in accordance with its Privacy Policy and Volunteer Verification Policy.",
          ]}
        />
        <p>Acceptable documents may include, subject to applicable law and RippleHub's verification requirements:</p>
        <List
          items={[
            'Aadhaar/e-Aadhaar or legally permissible Aadhaar verification;',
            'driving licence;',
            'voter identity card;',
            'other Government-issued photo identification; and',
            'Government-issued identification issued by foreign jurisdictions.',
          ]}
        />
        <p>Users must not:</p>
        <List
          items={[
            "submit another person's identity document;",
            'alter or forge documents;',
            'misrepresent their identity;',
            'circumvent verification requirements; or',
            'assist another person in circumventing verification.',
          ]}
        />
        <p>
          Identity verification establishes only that RippleHub has been able to reasonably verify
          the identity represented by the submitted information. Identity verification is not a
          background check, criminal record check, character certificate, safety certification or
          endorsement of the Volunteer. RippleHub may withdraw or suspend verification where
          information is found to be inaccurate, fraudulent, outdated or unreliable.
        </p>
      </Section>

      <Section title="8. Volunteering opportunities">
        <List
          items={[
            'NGOs may publish volunteering opportunities, projects, events or other activities through the Platform.',
            'The NGO publishing an opportunity is responsible for the accuracy and completeness of information concerning that opportunity.',
          ]}
        />
        <p>Information concerning an opportunity may include:</p>
        <List
          items={[
            'description of activities;',
            'location;',
            'dates;',
            'eligibility requirements;',
            'skills required;',
            'time commitment;',
            'expenses;',
            'accommodation;',
            'safety requirements; and',
            'other relevant information.',
          ]}
        />
        <p>
          RippleHub does not guarantee the accuracy, completeness, availability, suitability or
          safety of any volunteering opportunity. The NGO is responsible for communicating any
          material requirements or risks associated with its activities. Acceptance of a Volunteer
          remains the decision of the relevant NGO.
        </p>
      </Section>

      <Section title="9. Relationship between NGOs and Volunteers">
        <p>Once a Volunteer applies to or is accepted by an NGO, the resulting relationship is between the Volunteer and the NGO. Unless expressly agreed otherwise, RippleHub is not responsible for:</p>
        <List
          items={[
            'supervision of Volunteers;',
            'working conditions;',
            'accommodation;',
            'transportation;',
            'travel arrangements;',
            'meals;',
            'expenses;',
            'insurance;',
            'remuneration or reimbursement;',
            'medical treatment;',
            'safety arrangements;',
            'disciplinary action; or',
            'termination of the volunteering arrangement.',
          ]}
        />
        <p>
          NGOs are responsible for ensuring that their volunteering activities comply with
          applicable laws and regulations, including applicable requirements concerning health,
          safety, safeguarding, employment, child protection and treatment of vulnerable persons.
          Volunteers are responsible for satisfying themselves that a particular opportunity is
          appropriate for them and for complying with the applicable requirements and instructions
          of the NGO.
        </p>
      </Section>

      <Section title="10. Volunteer safety and safeguarding">
        <p>
          Volunteering activities may involve physical, environmental, social or other risks. Users
          should exercise appropriate caution and conduct their own due diligence before
          participating in any activity. RippleHub does not guarantee that an NGO, location,
          activity or volunteering opportunity is safe or suitable for a particular individual.
        </p>
        <p>Users must immediately report suspected:</p>
        <List
          items={[
            'abuse;',
            'harassment;',
            'exploitation;',
            'violence;',
            'fraud;',
            'unsafe conditions;',
            'trafficking;',
            'discrimination; or',
            'other serious misconduct',
          ]}
        />
        <p>through the reporting mechanisms provided by RippleHub or to the appropriate authorities where necessary.</p>
        <p>
          Where activities involve children or vulnerable persons, NGOs and Volunteers must comply
          with applicable safeguarding and child-protection laws and must follow the rules and
          instructions of the relevant NGO. Users must not exploit their access to children or
          vulnerable persons obtained through the Platform.
        </p>
      </Section>

      <Section title="11. User profiles">
        <List
          items={[
            'Users may create profiles containing information about themselves, their interests, skills, experience, location and other information.',
            'Users are responsible for ensuring that information displayed on their profile is accurate and does not violate the rights of others.',
            'Certain profile information may be visible to other Users depending upon the functionality and privacy settings of the Platform.',
          ]}
        />
        <p>Users should not publish identity documents, passwords, financial information, confidential information, private contact information of another person, or other sensitive information through a public profile.</p>
        <p>RippleHub may remove or restrict profile information that violates these Terms, applicable law or Platform policies.</p>
      </Section>

      <Section title="12. Feed Posts and Community Posts">
        <List
          items={[
            'RippleHub may provide a Feed or Community feature through which Users may publish Posts, comments, photographs, videos, links and other Content.',
            'Users remain responsible for Content they publish.',
          ]}
        />
        <p>Users must ensure that their Content:</p>
        <List
          items={[
            'is accurate to the extent it purports to state facts;',
            "does not unlawfully infringe another person's rights;",
            'does not contain unlawful or fraudulent information;',
            'does not impersonate another person or organisation;',
            'does not contain malware or malicious code;',
            "does not unlawfully disclose another person's personal information;",
            'does not contain harassment, threats or abusive material;',
            'does not facilitate criminal or unlawful activity; and',
            'otherwise complies with these Terms and the Community Guidelines.',
          ]}
        />
        <p>Users must not use Feed Posts or Community Posts primarily for:</p>
        <List
          items={[
            'spam;',
            'unsolicited commercial solicitation;',
            'fraudulent fundraising;',
            'impersonation;',
            'misleading advertising;',
            'unlawful fundraising;',
            'recruitment for unlawful activities; or',
            'activities unrelated to the purpose of the relevant Community or Platform.',
          ]}
        />
        <p>RippleHub does not necessarily review or approve Content before it is published. Accordingly, RippleHub does not guarantee the accuracy, reliability or legality of User-generated Content.</p>
        <p>RippleHub may, in accordance with applicable law and its policies, review Content, remove Content, restrict Content, limit its visibility, suspend posting privileges, suspend or terminate Accounts, or take other appropriate action. Removal or restriction of Content does not necessarily mean that RippleHub endorses or agrees with the complaint concerning that Content.</p>
      </Section>

      <Section title="13. Communities">
        <List
          items={[
            'Users may be permitted to create Communities around particular causes, interests, locations, organisations or other subjects.',
            'The person creating a Community ("Community Administrator") is responsible for administering the Community in accordance with these Terms and the Community Guidelines.',
          ]}
        />
        <p>Community Administrators must not:</p>
        <List
          items={[
            'misrepresent the purpose or affiliation of the Community;',
            'represent themselves as acting for RippleHub without authorisation;',
            'use a Community to conduct unlawful activities;',
            'knowingly permit unlawful or abusive activity;',
            'misuse personal information of Community members;',
            'impersonate an NGO or other organisation; or',
            'use the Community for fraudulent fundraising.',
          ]}
        />
        <p>A Community Administrator may moderate Community activity using the tools provided by RippleHub. RippleHub may intervene in the operation of a Community where reasonably necessary for safety, compliance with law, prevention of abuse or fraud, protection of Users, enforcement of these Terms, or protection of the Platform.</p>
        <p>The existence of a Community on RippleHub does not constitute an endorsement or approval of its purpose, views, activities or members.</p>
      </Section>

      <Section title="14. Messaging and communication features">
        <List
          items={[
            'RippleHub may provide private or group messaging functionality enabling Users to communicate with one another.',
            'Users are responsible for their communications.',
          ]}
        />
        <p>Users must not use the messaging functionality to:</p>
        <List
          items={[
            'harass or threaten another person;',
            'send spam;',
            'solicit personal information unlawfully;',
            'distribute malware;',
            'engage in fraud;',
            'impersonate another person;',
            'distribute unlawful or abusive material; or',
            'facilitate any unlawful activity.',
          ]}
        />
        <p>
          Users should exercise caution when communicating with persons they do not know. RippleHub
          does not guarantee the identity, intentions or conduct of a person communicating through
          the Platform. RippleHub may investigate reported communications and may take appropriate
          action in accordance with applicable law and its policies. RippleHub may be required to
          preserve, disclose or provide access to information concerning communications where
          required by applicable law or lawful governmental or judicial direction.
        </p>
        <p>Users should not use RippleHub messaging as a substitute for emergency services or for transmission of information requiring guaranteed confidentiality or immediate delivery.</p>
      </Section>

      <Section title="15. SOS Alerts">
        <List
          items={[
            'RippleHub may provide an SOS Alert or similar emergency notification feature.',
            'An SOS Alert is intended to assist Users in notifying designated persons, Communities, NGOs or other Platform participants, depending upon the functionality available.',
            'SOS Alerts are not a substitute for police, ambulance, fire, medical, disaster-management or other emergency services.',
          ]}
        />
        <p>RippleHub does not guarantee:</p>
        <List
          items={[
            'that an SOS Alert will be transmitted successfully;',
            'that a recipient will receive or respond to an alert;',
            'that an emergency service will be contacted;',
            "that the user's location will be accurately determined;",
            'that the Platform will be continuously available; or',
            'that an SOS Alert will result in assistance.',
          ]}
        />
        <p>
          Users should contact the appropriate local emergency services directly where immediate
          assistance is required. Where an SOS feature uses location information, such information
          will be processed in accordance with the Privacy Policy and applicable permissions
          granted by the User.
        </p>
      </Section>

      <Section title="16. User-generated Content">
        <p>Users retain ownership of Content they lawfully own and submit to the Platform.</p>
        <p>
          By submitting Content to RippleHub, you grant RippleHub a non-exclusive, worldwide,
          royalty-free licence to host, store, reproduce, display, communicate, transmit,
          distribute and technically modify such Content to the extent reasonably necessary to
          operate the Platform, provide Platform functionality, display Content to intended Users,
          moderate or review Content, maintain backups, improve the Platform, and comply with legal
          obligations.
        </p>
        <p>The licence granted under this section shall continue for so long as reasonably necessary for the above purposes, subject to the deletion and retention provisions of the Privacy Policy.</p>
        <p>You represent that:</p>
        <List
          items={[
            'you own or have the necessary rights to submit the Content;',
            'the Content does not infringe third-party rights;',
            'you have obtained necessary permissions concerning persons appearing in the Content where required; and',
            'the Content does not otherwise violate these Terms.',
          ]}
        />
        <p>RippleHub does not claim ownership of User-generated Content merely because it is uploaded to the Platform.</p>
      </Section>

      <Section title="17. Prohibited activities">
        <p>Users must not use the Platform to:</p>
        <List
          items={[
            'commit, facilitate or promote unlawful activity;',
            'impersonate another person or organisation;',
            'create fraudulent accounts;',
            'submit forged or altered documents;',
            'misrepresent an NGO, organisation, project or volunteering opportunity;',
            'engage in fraud or financial misconduct;',
            'solicit money through fraudulent or misleading means;',
            'conduct unlawful fundraising;',
            'engage in harassment, stalking, threats or abuse;',
            'exploit children or vulnerable persons;',
            'engage in trafficking or exploitation;',
            'distribute malware or malicious software;',
            'interfere with the operation or security of the Platform;',
            "scrape or systematically harvest User information without authorisation;",
            'reverse engineer or attempt to obtain source code except where permitted by law;',
            'circumvent security, verification or access controls;',
            "use another person's Account without authorisation;",
            'distribute spam or unsolicited bulk communications;',
            'infringe copyright, trademark, privacy, publicity or other rights;',
            'upload sexually exploitative or unlawful content;',
            'promote terrorism or other unlawful violent activity;',
            'use the Platform to discriminate unlawfully;',
            'use the Platform to recruit or facilitate unlawful activities;',
            'misuse emergency or SOS functionality;',
            'falsely represent an affiliation with RippleHub; or',
            'otherwise misuse the Platform in a manner inconsistent with its intended purpose.',
          ]}
        />
      </Section>

      <Section title="18. Reporting and complaints">
        <p>Users may report Content, Accounts, Communities, NGOs or other activity that they believe:</p>
        <List
          items={[
            'violates these Terms;',
            'violates the Community Guidelines;',
            'is fraudulent;',
            'is unsafe;',
            'is abusive;',
            'infringes intellectual property rights; or',
            'violates applicable law.',
          ]}
        />
        <p>Reports may be submitted through the reporting tools provided on the Platform or by contacting RippleHub through the designated grievance mechanism. RippleHub may request additional information or evidence to assess a report.</p>
        <p>RippleHub may take such action as it considers appropriate, including removing Content, restricting access, issuing warnings, suspending Accounts, withdrawing verification, restricting Communities, terminating Accounts, or referring matters to appropriate authorities. RippleHub does not guarantee that every report will result in removal or other action.</p>
      </Section>

      <Section title="19. Content moderation">
        <p>RippleHub may employ human administrators, automated tools or a combination of both to moderate Content and Platform activity. Moderation may be undertaken to:</p>
        <List
          items={[
            'enforce these Terms;',
            'enforce the Community Guidelines;',
            'comply with law;',
            'respond to reports;',
            'prevent fraud and abuse;',
            'protect Users;',
            'protect children and vulnerable persons;',
            'maintain Platform security; and',
            'maintain the intended character of the Platform.',
          ]}
        />
        <p>
          RippleHub does not undertake to proactively review all Content. The absence of moderation
          or immediate removal of Content does not constitute approval or endorsement of that
          Content. RippleHub may make moderation decisions based on the information reasonably
          available to it and may revise decisions where additional information becomes available.
        </p>
        <p>
          <b>Government / court orders and takedown requests</b> — RippleHub may receive complaints,
          notices, court orders, governmental directions or requests from authorised law-enforcement
          or regulatory authorities concerning information made available through the Platform.
          Where RippleHub receives an order, notification or direction that is legally valid and
          applicable to the Platform, RippleHub may remove or disable access to the relevant
          information, Account, Community or other material within the period prescribed under
          applicable law. RippleHub may also take voluntary action to remove, restrict or disable
          access to Content where it reasonably believes that such Content violates these Terms, the
          Community Guidelines, applicable law, or poses a risk to Users, the Platform or third
          parties. Where required by applicable law, RippleHub may preserve relevant information and
          cooperate with competent governmental, law-enforcement, judicial or regulatory
          authorities. RippleHub may, where legally permitted, notify the affected User of a
          takedown or restriction and provide such User with an opportunity to contest or appeal the
          decision.
        </p>
      </Section>

      <Section title="20. Intellectual property">
        <List
          items={[
            'All rights in and to the Platform, including its software, design, layout, graphics, branding, logos, trademarks, text, databases and other proprietary material, are owned by or licensed to RippleHub unless expressly stated otherwise.',
            'Subject to these Terms, RippleHub grants Users a limited, non-exclusive, non-transferable and revocable right to access and use the Platform for its intended purposes.',
          ]}
        />
        <p>Users must not:</p>
        <List
          items={[
            'reproduce substantial portions of the Platform;',
            'commercially exploit the Platform without authorisation;',
            'copy or replicate its design;',
            'use RippleHub trademarks without permission;',
            'create derivative works from the Platform; or',
            'access the Platform for the purpose of building a competing service through unauthorised means.',
          ]}
        />
        <p>Nothing in these Terms transfers ownership of RippleHub's intellectual property to a User.</p>
      </Section>

      <Section title="21. Third-party services and links">
        <List
          items={[
            'The Platform may contain links to third-party websites, applications, services or resources.',
          ]}
        />
        <p>RippleHub does not control and is not responsible for third-party content, privacy practices, security, availability, terms of service, products or services, or representations made by third parties.</p>
        <p>Users access third-party services at their own risk and should review the applicable terms and privacy policies.</p>
      </Section>

      <Section title="22. International use">
        <List
          items={[
            'RippleHub may be accessible to Users in jurisdictions outside India.',
            'Users accessing the Platform from outside India are responsible for complying with laws applicable to them.',
          ]}
        />
        <p>Where volunteering involves travel or activity in another country, the User is solely responsible for determining and complying with applicable visa requirements, immigration requirements, travel restrictions, local laws, insurance requirements, health requirements, and other regulatory requirements.</p>
        <p>RippleHub does not provide immigration, visa, travel, medical, insurance or consular services unless expressly stated otherwise. An NGO or Volunteer must not use the Platform to facilitate an activity that is unlawful in the relevant jurisdiction.</p>
      </Section>

      <Section title="23. Payments and donations">
        <List
          items={[
            'RippleHub does not facilitate, handle or become involved in any way in any payments and/or donations to any NGO and/or Volunteer, however, may introduce payment, donation or other financial functionality in the future.',
            'Any such functionality may be subject to additional terms, verification requirements, payment-provider terms and applicable laws and regulations.',
            'Where donations or other payments involve NGOs operating in India, Users and NGOs may be required to comply with applicable requirements concerning charitable contributions, taxation, foreign contributions, anti-money laundering and payment processing.',
            'RippleHub may restrict or refuse transactions where required by law, regulatory requirements, payment-provider rules or its internal risk controls.',
            'The introduction of payment or donation functionality will not by itself constitute a representation that RippleHub is authorised to receive, hold, transfer or settle funds in every jurisdiction or for every purpose.',
            'Additional terms will be published before any payment functionality requiring such terms is made available.',
          ]}
        />
      </Section>

      <Section title="24. Privacy and personal data">
        <List
          items={[
            <>RippleHub's collection and processing of personal data is governed by the RippleHub{' '}
              <a href="/privacy" className="text-blue-300 underline underline-offset-2">Privacy Policy</a>.</>,
            'By using the Platform, Users acknowledge that personal data may be processed in accordance with that Privacy Policy and applicable law.',
            'Users must not upload, publish or transmit another person\'s personal data unless they have a lawful basis and appropriate authority to do so.',
          ]}
        />
        <p>Users must exercise particular caution before publishing information concerning children, vulnerable persons, beneficiaries of NGOs, health information, identity documents, financial information, or other sensitive or confidential information.</p>
        <p>RippleHub may process information concerning reports, moderation, verification and Platform activity for the purposes described in its Privacy Policy.</p>
      </Section>

      <Section title="25. Disclaimers">
        <p>To the maximum extent permitted by applicable law:</p>
        <p><b>25.1 Platform availability</b> — RippleHub does not guarantee that the Platform will always be available, operate without interruption, be error-free, be free from viruses or malicious code, or remain unchanged.</p>
        <p><b>25.2 Information</b> — RippleHub does not guarantee the accuracy, completeness, reliability or timeliness of information supplied by Users, NGOs or other third parties.</p>
        <p><b>25.3 NGOs</b> — Verification or listing of an NGO does not constitute endorsement or certification. RippleHub does not guarantee an NGO's legitimacy, financial practices, use of funds, management, staff, beneficiaries, activities, safety standards, or future conduct.</p>
        <p><b>25.4 Volunteers</b> — Identity verification does not constitute certification of a Volunteer. RippleHub does not guarantee a Volunteer's character, qualifications, competence, criminal history, intentions, suitability, or future conduct.</p>
        <p><b>25.5 Volunteering activities</b> — RippleHub does not guarantee the safety, suitability, availability or outcome of any volunteering activity.</p>
        <p><b>25.6 User Content</b> — RippleHub does not endorse User-generated Content merely because such Content is available through the Platform.</p>
        <p><b>25.7 Communications</b> — RippleHub does not guarantee that messages, notifications or other communications will be delivered immediately or successfully.</p>
        <p><b>25.8 SOS</b> — SOS functionality does not constitute emergency response services and should not be relied upon as the sole means of obtaining emergency assistance.</p>
      </Section>

      <Section title="26. Limitation of liability">
        <p>
          To the maximum extent permitted by applicable law, RippleHub, its directors, officers,
          employees, contractors, affiliates and service providers shall not be liable for any
          indirect, incidental, special, consequential or punitive loss or damage arising from or
          relating to use or inability to use the Platform, conduct of Users, conduct of NGOs,
          conduct of Volunteers, volunteering activities, User-generated Content, communications
          between Users, Community activity, third-party services, unauthorised access,
          interruption of services, or reliance upon information made available through the
          Platform.
        </p>
        <p>Nothing in these Terms excludes or limits liability to the extent that such exclusion or limitation is prohibited by applicable law.</p>
        <p>Subject to applicable law, RippleHub's aggregate liability arising out of or relating to the Platform shall be limited to the greater of (a) the amount actually paid by the User to RippleHub for use of the relevant service during the twelve (12) months preceding the event giving rise to the claim; or (b) INR 10,000.</p>
        <p>The limitations in this section shall apply regardless of the legal basis of the claim, including contract, tort, negligence or otherwise, subject to applicable law.</p>
      </Section>

      <Section title="27. Indemnification">
        <p>
          To the maximum extent permitted by applicable law, you agree to indemnify and hold
          harmless RippleHub, its directors, officers, employees, affiliates, contractors and
          service providers from claims, losses, liabilities, damages, costs and expenses arising
          out of or relating to:
        </p>
        <List
          items={[
            'your breach of these Terms;',
            'your violation of applicable law;',
            'your Content;',
            'your misuse of the Platform;',
            'fraudulent or misleading information supplied by you;',
            "infringement of another person's rights;",
            'your conduct towards another User;',
            'your conduct during a volunteering activity;',
            'your violation of safeguarding requirements; or',
            'your unauthorised use of the Platform.',
          ]}
        />
      </Section>

      <Section title="28. Suspension and termination">
        <p>RippleHub may suspend, restrict or terminate an Account where reasonably necessary, including where:</p>
        <List
          items={[
            'these Terms are violated;',
            'applicable law is violated;',
            'fraudulent activity is suspected;',
            'false information is supplied;',
            'verification requirements are not satisfied;',
            'the Account poses a safety or security risk;',
            'the Account is used for unlawful purposes;',
            'repeated complaints are received concerning the Account; or',
            'RippleHub reasonably considers such action necessary to protect Users or the Platform.',
          ]}
        />
        <p>RippleHub may remove or restrict access to Content independently of terminating the relevant Account.</p>
        <p>
          Where reasonably practicable and appropriate, RippleHub may provide notice or an
          opportunity to respond before taking action. However, RippleHub may take immediate action
          where necessary to protect Users, prevent fraud or abuse, comply with law, preserve
          evidence, or protect the security of the Platform.
        </p>
        <p>
          A User may discontinue use of the Platform at any time. Termination or deletion of an
          Account does not automatically result in immediate deletion of all information relating
          to the Account. Information may be retained in accordance with the Privacy Policy and
          applicable law.
        </p>
      </Section>

      <Section title="29. Effect of termination">
        <p>Upon termination: your right to use the relevant Platform features may cease; access to your Account may be disabled; Content may no longer be publicly available; certain information may be retained where required or permitted by law; and provisions which by their nature should survive termination shall continue to apply.</p>
        <p>These include provisions relating to intellectual property, disclaimers, limitation of liability, indemnification, dispute resolution, governing law, and data retention.</p>
      </Section>

      <Section title="30. Changes to the Platform">
        <p>RippleHub may modify, suspend or discontinue any part of the Platform, temporarily or permanently. This may include adding or removing features, modifying Communities, changing Feed functionality, modifying messaging functionality, modifying verification requirements, introducing or removing payment functionality, or changing the technical architecture of the Platform.</p>
        <p>RippleHub shall not be liable to Users solely because a particular feature is modified, suspended or discontinued, subject to applicable law.</p>
      </Section>

      <Section title="31. Changes to these Terms">
        <p>
          RippleHub may amend these Terms from time to time. The updated Terms will be published on
          the Platform with a revised effective date. Where changes are material, RippleHub may
          provide additional notice through the Platform or other reasonable means. Continued use
          of the Platform following the effective date of revised Terms constitutes acceptance of
          the revised Terms, subject to applicable law.
        </p>
      </Section>

      <Section title="32. Grievance redressal">
        <p>Users may submit complaints or grievances concerning Platform functionality, Content, Accounts, NGOs, Volunteers, Communities, privacy, identity verification, safety, unlawful activity, or other Platform-related matters.</p>
        <p>Complaints may be submitted through the reporting mechanisms available on the Platform or by contacting:</p>
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
        <p>RippleHub will address grievances in accordance with applicable law and its applicable policies and procedures.</p>
      </Section>

      <Section title="33. Intermediary status and legal compliance">
        <List
          items={[
            'To the extent RippleHub qualifies as an intermediary under applicable law, RippleHub will undertake the due diligence and other obligations applicable to it under such law.',
            'RippleHub may receive notices, complaints, legal orders or governmental directions concerning Content or Platform activity and may take action as required by applicable law.',
            'Users acknowledge that RippleHub may remove, restrict or disable access to Content or Accounts where required by law or where reasonably necessary to enforce these Terms and protect Users and the Platform.',
            'Nothing in these Terms is intended to limit any mandatory rights, protections or obligations applicable under law.',
          ]}
        />
      </Section>

      <Section title="34. Governing law and jurisdiction">
        <p>
          These Terms shall be governed by and interpreted in accordance with the laws of India.
          Subject to any mandatory rights available to Users under applicable law, the courts having
          jurisdiction at SAS Nagar (Mohali), Punjab, shall have jurisdiction over disputes arising
          out of or relating to these Terms or the Platform.
        </p>
      </Section>

      <Section title="35. Dispute resolution">
        <p>
          Before commencing formal proceedings, the parties should, where reasonably practicable,
          attempt to resolve disputes through good-faith communication and the grievance mechanism
          provided by RippleHub. Nothing in this section prevents a party from seeking urgent or
          interim relief from a court or authority having jurisdiction.
        </p>
      </Section>

      <Section title="36. Severability">
        <p>
          If any provision of these Terms is held to be invalid, illegal or unenforceable, that
          provision shall be modified or severed to the minimum extent necessary, and the remaining
          provisions shall continue in full force and effect.
        </p>
      </Section>

      <Section title="37. Waiver">
        <p>Failure by RippleHub to enforce any provision of these Terms shall not constitute a waiver of its right to enforce that provision subsequently.</p>
      </Section>

      <Section title="38. Assignment">
        <p>
          Users may not assign or transfer their rights or obligations under these Terms without the
          prior written consent of RippleHub. RippleHub may assign or transfer its rights and
          obligations in connection with a merger, acquisition, restructuring, sale of assets or
          similar transaction, subject to applicable law.
        </p>
      </Section>

      <Section title="39. Entire agreement">
        <p>
          These Terms, together with the Privacy Policy, Cookie Policy, Community Guidelines,
          Volunteer Verification Policy, NGO Verification Policy and any other terms expressly
          incorporated by reference, constitute the agreement governing your use of the Platform. If
          there is a conflict between these Terms and a feature-specific or transaction-specific
          agreement, the latter shall prevail to the extent of the conflict.
        </p>
      </Section>

      <Section title="40. Contact">
        <p>For questions concerning these Terms, please contact:</p>
        <p>
          RippleHub
          <br />
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
      </Section>
    </LegalLayout>
  )
}
