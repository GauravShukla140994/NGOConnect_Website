import LegalLayout, { Section, List } from '../../components/legal/LegalLayout.jsx'

export default function SecurityPolicy() {
  return (
    <LegalLayout title="Security" effectiveDate="19 July 2026">
      <Section title="1. Our commitment">
        <p>
          RippleHub handles personal profiles, verification documents, and donation data for
          volunteers and NGOs across India. We design the Platform with a security-first approach —
          minimum data exposure, encryption by default, and least-privilege access — and this page
          summarises the practices behind that commitment.
        </p>
      </Section>

      <Section title="2. Encryption">
        <List
          items={[
            'All traffic between the app, website, and our servers is encrypted in transit using TLS.',
            'Sensitive documents (identity proofs, NGO registration certificates, donation receipts) are stored in a private cloud storage bucket with server-side AES-256 encryption at rest, and are never publicly accessible by URL.',
            'Access to a stored document requires a short-lived, individually generated link — not a permanent public address.',
          ]}
        />
      </Section>

      <Section title="3. Authentication and access control">
        <List
          items={[
            'Accounts are protected by OTP-based verification and short-lived access tokens (15 minutes) paired with rotating refresh tokens, so a leaked token has a limited window of use.',
            'Passwords, where used, are stored as salted cryptographic hashes — never in plain text.',
            'Administrative access to review Organisation documents or manage the Platform is restricted by role (Volunteer, Organisation Admin, Super Admin) and requires a separately issued, role-scoped credential.',
            'We limit concurrent active sessions per account and support remote sign-out.',
          ]}
        />
      </Section>

      <Section title="4. Infrastructure">
        <p>
          The Platform runs on reputable cloud infrastructure (Amazon Web Services for storage,
          Railway for application hosting) inside access-controlled environments. Configuration and
          credentials are managed outside of application code, and production systems are separated
          from development and staging environments.
        </p>
      </Section>

      <Section title="5. Payment security">
        <p>
          All donation and payment processing is handled directly by Razorpay, a PCI-DSS compliant
          payment processor. Card, UPI, and bank account details are entered directly into
          Razorpay's secure interface — RippleHub's servers never receive or store your full
          payment credentials.
        </p>
      </Section>

      <Section title="6. Monitoring and audit trails">
        <p>
          We maintain structured, correlated logs across our services and a dedicated audit trail
          that records key actions — such as document verification, Organisation approval, and
          account status changes — including who performed the action and when, to support
          accountability and incident investigation.
        </p>
      </Section>

      <Section title="7. Responsible disclosure">
        <p>
          If you believe you have found a security vulnerability on the Platform, please report it
          to{' '}
          <a href="mailto:security@ripplehub.app" className="text-blue-300 underline underline-offset-2">
            security@ripplehub.app
          </a>{' '}
          with enough detail for us to reproduce the issue. Please report privately and give us a
          reasonable opportunity to investigate and address the issue before any public disclosure.
          We do not authorise testing that degrades service, accesses another user's data, or
          involves social engineering of our staff or users.
        </p>
      </Section>

      <Section title="8. Incident response">
        <p>
          We maintain an internal process to investigate, contain, and remediate security incidents.
          Where an incident affects your personal data, we will notify affected users and relevant
          authorities as required by applicable law.
        </p>
      </Section>

      <Section title="9. Your part in staying secure">
        <List
          items={[
            'Use a strong, unique password or rely on OTP sign-in.',
            'Never share OTPs, passwords, or verification links with anyone, including someone claiming to be from RippleHub.',
            'Keep your app updated to receive the latest security fixes.',
            'Report suspicious activity on your account to us immediately.',
          ]}
        />
      </Section>

      <Section title="10. Updates to this page">
        <p>
          We review and update our security practices on an ongoing basis. This page reflects our
          practices as of the effective date above and may be revised as the Platform evolves.
        </p>
      </Section>
    </LegalLayout>
  )
}
