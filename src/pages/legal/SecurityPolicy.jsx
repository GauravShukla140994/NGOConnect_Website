import LegalLayout, { Section, List } from '../../components/legal/LegalLayout.jsx'

export default function SecurityPolicy() {
  return (
    <LegalLayout title="Security Policy" effectiveDate="27 August 2026">
      <Section title="1. Introduction">
        <p>
          This Security Policy ("Security Policy") describes the measures and practices adopted by
          RippleHub Technologies, having its registered office at E-27, Industrial Area Chanalon,
          Tehsil Kharar, SAS Nagar, Punjab, 140103 ("RippleHub", "we", "us" or "our"), to protect
          information processed
          through the RippleHub website, mobile application and related services (collectively, the
          "Platform").
        </p>
        <p>
          RippleHub recognises that the Platform may process personal information, identity
          documents, NGO documentation, communications and other information requiring appropriate
          security safeguards.
        </p>
        <p>
          This Security Policy should be read together with the{' '}
          <a href="/privacy" className="text-blue-300 underline underline-offset-2">
            RippleHub Privacy Policy
          </a>
          ,{' '}
          <a href="/terms" className="text-blue-300 underline underline-offset-2">
            Terms of Use
          </a>
          ,{' '}
          <a href="/cookies" className="text-blue-300 underline underline-offset-2">
            Cookie Policy
          </a>{' '}
          and other applicable Platform policies.
        </p>
      </Section>

      <Section title="2. Our approach to information security">
        <p>RippleHub seeks to maintain appropriate technical and organisational safeguards designed to protect information against:</p>
        <List
          items={[
            'unauthorised access;',
            'unauthorised disclosure;',
            'unauthorised alteration;',
            'accidental loss;',
            'destruction;',
            'misuse; and',
            'other unlawful or unauthorised processing.',
          ]}
        />
        <p>
          Security measures are implemented having regard to the nature of the information, the
          risks associated with its processing, the functionality of the Platform and applicable
          legal and regulatory requirements.
        </p>
      </Section>

      <Section title="3. Information covered by this policy">
        <p>The security measures described in this Policy may apply to information including:</p>
        <List
          items={[
            'Account information;',
            'Volunteer profiles;',
            'identity verification information;',
            'Government-issued identity documents;',
            'NGO registration and verification documents;',
            'photographs;',
            'communications;',
            'Feed Posts;',
            'Community Posts;',
            'messages;',
            'SOS-related information;',
            'technical and device information;',
            'authentication information;',
            'Platform activity and logs; and',
            'other information processed in connection with the Platform.',
          ]}
        />
        <p>Different categories of information may be subject to different security controls depending upon their nature and sensitivity.</p>
      </Section>

      <Section title="4. Data storage and infrastructure">
        <p>
          RippleHub uses third-party infrastructure and technology service providers to operate the
          Platform. The Platform's hosting and infrastructure may include services provided by
          Hostinger and other service providers engaged from time to time. RippleHub may store or
          process information using cloud-based or other electronic infrastructure. Where
          third-party infrastructure is used, RippleHub seeks to use providers and configurations
          that provide appropriate security measures having regard to the nature of the services
          being provided.
        </p>
        <p>
          Information may be processed or accessed in jurisdictions other than the country in which
          a User is located, subject to applicable law and the terms of the Privacy Policy.
        </p>
      </Section>

      <Section title="5. Identity document security">
        <p>
          RippleHub may collect identity documents from Volunteers for identity verification and
          organisational documentation from NGOs for verification purposes. Because such
          information may be particularly sensitive, RippleHub seeks to apply additional safeguards
          to such information, including:
        </p>
        <List
          items={[
            'restricted access;',
            'access only for authorised personnel or systems having a legitimate operational need;',
            'secure transmission;',
            'secure electronic storage;',
            'authentication and access controls;',
            'logging and monitoring where appropriate; and',
            'appropriate retention and deletion controls.',
          ]}
        />
        <p>
          RippleHub will seek to minimise the collection and retention of identity information to
          what is reasonably necessary for the applicable verification purpose. Where Aadhaar
          information is involved, RippleHub will implement verification and handling practices
          consistent with applicable Aadhaar-related laws, regulations and requirements.
        </p>
      </Section>

      <Section title="6. Access control">
        <p>Access to information processed through the Platform is restricted according to operational requirements. RippleHub may implement measures including:</p>
        <List
          items={[
            'account authentication;',
            'password controls;',
            'role-based or need-based access;',
            'administrative access restrictions;',
            'restricted access to identity documents;',
            'access logging;',
            'periodic review of access permissions; and',
            'removal of access when personnel or service providers no longer require it.',
          ]}
        />
        <p>RippleHub seeks to ensure that Users, employees, contractors and service providers are provided access only to information reasonably necessary for their authorised functions.</p>
      </Section>

      <Section title="7. Account security">
        <p>Users are responsible for maintaining the security of their own Accounts. Users should:</p>
        <List
          items={[
            'use strong and unique passwords;',
            'avoid sharing login credentials;',
            'log out of shared or public devices;',
            'keep devices and operating systems reasonably updated;',
            'avoid providing passwords or authentication information to others; and',
            'promptly report suspected unauthorised access.',
          ]}
        />
        <p>RippleHub will not normally ask Users to disclose their passwords through unsolicited communications.</p>
      </Section>

      <Section title="8. Encryption and secure transmission">
        <p>
          RippleHub seeks to use appropriate security technologies to protect information during
          transmission and storage, including encryption or equivalent safeguards where reasonably
          appropriate. The Platform may use secure communication protocols to protect information
          transmitted between a User's device and RippleHub's systems. The precise security
          technologies and configurations used by RippleHub may change as the Platform and its
          infrastructure develop.
        </p>
      </Section>

      <Section title="9. Application and system security">
        <p>RippleHub seeks to incorporate reasonable security practices into the development and operation of the Platform. Depending upon the nature of the Platform and its infrastructure, these may include:</p>
        <List
          items={[
            'secure software development practices;',
            'access controls;',
            'authentication mechanisms;',
            'vulnerability identification and remediation;',
            'software and infrastructure updates;',
            'logging and monitoring;',
            'backup and recovery mechanisms;',
            'security testing; and',
            'incident-response procedures.',
          ]}
        />
        <p>RippleHub may periodically review its systems and security practices and implement improvements where reasonably necessary.</p>
      </Section>

      <Section title="10. Administrative access">
        <p>Certain RippleHub personnel or authorised service providers may require administrative access to Platform systems. Such access may be used for purposes including:</p>
        <List
          items={[
            'maintaining the Platform;',
            'providing technical support;',
            'investigating security incidents;',
            'investigating reports and complaints;',
            'moderating Content;',
            'preventing fraud and abuse;',
            'resolving technical problems; and',
            'complying with legal obligations.',
          ]}
        />
        <p>Administrative access is intended to be limited to authorised persons and appropriate purposes.</p>
      </Section>

      <Section title="11. Content, messaging and community security">
        <p>RippleHub provides Feed Posts, Communities, messaging and other user-interaction features. RippleHub may use a combination of user reports, administrative review, automated security mechanisms, moderation tools, and other reasonable measures to identify and address abusive, fraudulent, malicious or unlawful activity. RippleHub does not guarantee that all inappropriate or malicious Content will be detected or removed immediately.</p>
        <p>Users should report suspected account compromise, fraud, phishing, malware, harassment, impersonation, threats, unlawful Content, or other security concerns through the Platform's reporting mechanisms.</p>
      </Section>

      <Section title="12. Security of SOS and location information">
        <p>
          Where the Platform provides SOS functionality or processes location information,
          RippleHub applies appropriate security measures to such information having regard to its
          nature. However, Users acknowledge that communications networks may fail, location
          information may be inaccurate, devices may be unavailable or compromised, and an SOS
          notification may not reach its intended recipient. SOS functionality is not a substitute
          for contacting appropriate emergency services.
        </p>
      </Section>

      <Section title="13. Third-party service providers">
        <p>RippleHub may engage third-party providers to support hosting, data storage, analytics, communications, security, infrastructure, technical support, and other Platform functions. RippleHub seeks to engage service providers that maintain appropriate security measures and may impose contractual or other requirements concerning information security where reasonably appropriate. Third-party services may be subject to their own security practices and terms.</p>
      </Section>

      <Section title="14. Security incidents and data breaches">
        <p>RippleHub maintains processes for responding to suspected or confirmed security incidents. Depending upon the nature and severity of an incident, RippleHub may:</p>
        <List
          items={[
            'identify and assess the incident;',
            'take steps to contain or mitigate the incident;',
            'investigate the cause and scope;',
            'restore affected systems where appropriate;',
            'implement remedial measures;',
            'preserve relevant evidence;',
            'notify affected Users where required or appropriate; and',
            'notify governmental, regulatory or other authorities where required by applicable law.',
          ]}
        />
        <p>RippleHub will comply with applicable legal requirements concerning personal data breaches and security incidents.</p>
      </Section>

      <Section title="15. User responsibility for security">
        <p>Security of the Platform is a shared responsibility. Users must not:</p>
        <List
          items={[
            'attempt to circumvent Platform security;',
            "access another User's Account without authorisation;",
            'obtain information through unauthorised means;',
            'introduce malware or malicious code;',
            'attempt to interfere with Platform infrastructure;',
            'conduct unauthorised penetration testing;',
            'scrape restricted information;',
            'exploit vulnerabilities for malicious purposes; or',
            'assist another person in carrying out any such activity.',
          ]}
        />
        <p>Users should also exercise caution when sharing information with other Users, NGOs or third parties.</p>
      </Section>

      <Section title="16. Vulnerability disclosure">
        <p>RippleHub encourages responsible reporting of security vulnerabilities. If you believe you have discovered a security vulnerability affecting the Platform, you should report it to RippleHub through:</p>
        <p>
          Email:{' '}
          <a href="mailto:contact@ripplehub.app" className="text-blue-300 underline underline-offset-2">
            contact@ripplehub.app
          </a>
        </p>
        <p>A vulnerability report should, where possible, include:</p>
        <List
          items={[
            'a description of the suspected vulnerability;',
            'the affected Platform feature or system;',
            'steps reasonably necessary to reproduce the issue;',
            'potential impact; and',
            'relevant technical information.',
          ]}
        />
        <p>Users must not exploit a vulnerability beyond what is reasonably necessary to demonstrate the issue. Users must not:</p>
        <List
          items={[
            "access or download another person's information;",
            'modify or delete information;',
            'disrupt Platform services;',
            'conduct denial-of-service attacks;',
            'use social engineering against RippleHub personnel or Users; or',
            'publicly disclose a vulnerability before allowing RippleHub a reasonable opportunity to investigate and address it.',
          ]}
        />
        <p>RippleHub may investigate reported vulnerabilities and take such action as it considers appropriate.</p>
      </Section>

      <Section title="17. Backups and business continuity">
        <p>
          RippleHub may maintain backups and recovery mechanisms intended to support restoration of
          Platform services and information following technical failures, security incidents or
          other disruptions. Backups may contain information that has been deleted from the live
          Platform and may therefore be retained for a limited period consistent with operational
          and security requirements. Backup retention and restoration practices may vary depending
          upon the type of information and the systems involved.
        </p>
      </Section>

      <Section title="18. Data retention and secure disposal">
        <p>
          Information will be retained in accordance with the RippleHub{' '}
          <a href="/privacy" className="text-blue-300 underline underline-offset-2">
            Privacy Policy
          </a>{' '}
          and applicable law. When information is no longer required, RippleHub will seek to delete
          it, anonymise it, or securely dispose of it, as reasonably appropriate. Certain
          information, including identity verification and activity records, may be retained for
          the periods specified in the Privacy Policy for legal, security, fraud-prevention,
          dispute-resolution or other legitimate purposes.
        </p>
      </Section>

      <Section title="19. Employee and contractor responsibilities">
        <p>Where employees, contractors or service providers have access to information processed by RippleHub, RippleHub may require them to:</p>
        <List
          items={[
            'maintain confidentiality;',
            'use information only for authorised purposes;',
            'comply with applicable security procedures;',
            'maintain appropriate authentication practices; and',
            'report suspected security incidents.',
          ]}
        />
        <p>Access may be restricted or withdrawn where it is no longer required.</p>
      </Section>

      <Section title="20. Security limitations">
        <p>While RippleHub takes reasonable measures to protect information, no electronic system, transmission method, device, server or storage environment can be guaranteed to be completely secure. Accordingly, RippleHub does not guarantee that:</p>
        <List
          items={[
            'the Platform will be completely free from security vulnerabilities;',
            'information will never be accessed without authorisation;',
            'the Platform will never experience a security incident;',
            'communications will always be secure; or',
            'information transmitted through the Internet will never be intercepted.',
          ]}
        />
        <p>Users should therefore exercise appropriate caution when using the Platform.</p>
      </Section>

      <Section title="21. Reporting security concerns">
        <p>Users should promptly report suspected security incidents, including:</p>
        <List
          items={[
            'unauthorised access to an Account;',
            'suspected identity theft;',
            'exposure of identity documents;',
            'suspicious messages or links;',
            'phishing attempts;',
            'malware;',
            'fraudulent activity;',
            'unauthorised disclosure of personal information; or',
            'other security concerns.',
          ]}
        />
        <p>
          Reports may be made through the Platform's reporting mechanisms or by contacting our
          Grievance Officer / Data Protection Contact:
        </p>
        <p>
          Mr. Amit Sharma
          <br />
          Email:{' '}
          <a href="mailto:contact@ripplehub.app" className="text-blue-300 underline underline-offset-2">
            contact@ripplehub.app
          </a>
        </p>
        <p>Security vulnerabilities may additionally be reported through the dedicated security contact specified in Section 16 above.</p>
      </Section>

      <Section title="22. Changes to this Security Policy">
        <p>
          RippleHub may update this Security Policy from time to time to reflect changes to the
          Platform, changes to infrastructure, changes to security practices, new technologies,
          changes in applicable law, or evolving security risks. The updated Policy will be
          published on the Platform together with the revised effective date above.
        </p>
      </Section>

      <Section title="23. Contact">
        <p>For general security or privacy concerns:</p>
        <p>
          RippleHub Technologies
          <br />
          Address: E-27, Industrial Area Chanalon, Tehsil Kharar, SAS Nagar, Punjab, 140103
          <br />
          Grievance Officer / Data Protection Contact: Mr. Amit Sharma
          <br />
          Email:{' '}
          <a href="mailto:contact@ripplehub.app" className="text-blue-300 underline underline-offset-2">
            contact@ripplehub.app
          </a>
        </p>
        <p>
          For responsible disclosure of technical vulnerabilities:
          <br />
          Email:{' '}
          <a href="mailto:contact@ripplehub.app" className="text-blue-300 underline underline-offset-2">
            contact@ripplehub.app
          </a>
        </p>
      </Section>
    </LegalLayout>
  )
}
