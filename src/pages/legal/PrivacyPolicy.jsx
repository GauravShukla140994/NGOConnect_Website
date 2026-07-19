import LegalLayout, { Section, List } from '../../components/legal/LegalLayout.jsx'

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" effectiveDate="19 July 2026">
      <Section title="1. Who we are">
        <p>
          RippleHub ("RippleHub", "we", "us", "our") operates a platform that connects volunteers,
          non-governmental organisations ("NGOs" or "Organisations"), donors, and CSR partners —
          available through our mobile app and this website (together, the "Platform"). This
          Privacy Policy explains what personal data we collect, why we collect it, how we use it,
          and the choices you have.
        </p>
        <p>
          By creating an account or otherwise using the Platform, you agree to the collection and
          use of information as described in this policy. If you do not agree, please do not use
          the Platform.
        </p>
      </Section>

      <Section title="2. Information we collect">
        <p>What we collect depends on how you use the Platform:</p>
        <List
          items={[
            <>
              <b>Account information</b> — name, email address, mobile number, and password (stored
              as a salted hash, never in plain text) when you register or sign in via OTP.
            </>,
            <>
              <b>Profile information</b> — profile photo, date of birth, gender, city/state, skills,
              interests, and volunteering preferences you choose to add.
            </>,
            <>
              <b>Verification documents</b> — government ID, address proof, or other documents you
              upload to verify your identity, and NGO registration certificates, 80G/12A
              declarations, and similar documents an Organisation uploads to verify its status.
              These are stored in an access-controlled, encrypted private storage bucket and are
              never publicly browsable — only you, the relevant Organisation admins reviewing your
              application, and authorised RippleHub Super Admins can request a time-limited link to
              view them.
            </>,
            <>
              <b>Organisation information</b> — for NGO accounts: registration number, category,
              address, mission/vision statements, logo, and contact person details.
            </>,
            <>
              <b>Location data</b> — approximate location to show nearby volunteering opportunities,
              and precise, time-limited location data if you trigger or respond to an SOS emergency
              alert, or share live location during an active project session. You can decline
              location access; some features will not work without it.
            </>,
            <>
              <b>Donation and payment data</b> — the donation amount, campaign, and transaction
              status. Card, UPI, and bank details are entered directly into our payment processor's
              (Razorpay) secure interface — RippleHub does not receive or store your full card or
              bank account numbers.
            </>,
            <>
              <b>Content you create</b> — posts, comments, polls, community updates, and reports you
              submit within the Platform.
            </>,
            <>
              <b>Device and usage data</b> — device type, operating system, app version, IP address,
              crash logs, and general usage patterns, collected to keep the Platform reliable and
              secure.
            </>,
            <>
              <b>Push notification tokens</b> — a device identifier used to deliver notifications
              (e.g. project updates, SOS alerts) via Firebase Cloud Messaging.
            </>,
          ]}
        />
      </Section>

      <Section title="3. How we use your information">
        <List
          items={[
            'To create and manage your account, and verify your identity or your Organisation\'s registration status.',
            'To match volunteers with relevant opportunities and help Organisations manage applicants, attendance, and volunteer hours.',
            'To process donations, generate donation receipts, and support 80G tax-exemption documentation supplied by the receiving Organisation.',
            'To operate safety features, including the SOS emergency alert and live-location sharing with nearby responders.',
            'To send you service notifications, application/project updates, and — only with your consent where required — promotional communications.',
            'To detect, investigate, and prevent fraud, abuse, and violations of our Terms of Service.',
            'To comply with applicable law, respond to lawful requests, and enforce our agreements.',
          ]}
        />
      </Section>

      <Section title="4. How we share your information">
        <p>We do not sell your personal data. We share information only in these circumstances:</p>
        <List
          items={[
            <>
              <b>With Organisations you apply to or join</b> — your profile, application, and
              relevant verification status are visible to that Organisation's admins so they can
              review and manage your membership.
            </>,
            <>
              <b>With service providers</b> who process data on our behalf under contract, including
              Amazon Web Services (hosting and encrypted file storage), Razorpay (payment
              processing), Firebase (push notifications), and our SMS/OTP delivery provider. These
              providers are only permitted to use your data to provide the service to us.
            </>,
            <>
              <b>During an active SOS alert</b> — your live location and relevant profile details
              are shared with nearby verified responders and the relevant Organisation admins for
              the duration of the alert.
            </>,
            'When required by law, regulation, legal process, or a valid governmental request.',
            'In connection with a merger, acquisition, or sale of assets, subject to this policy continuing to apply to your data.',
          ]}
        />
      </Section>

      <Section title="5. Data retention">
        <p>
          We retain personal data for as long as your account is active and as needed to provide
          the Platform, comply with legal obligations (including tax and donation record-keeping
          requirements), resolve disputes, and enforce our agreements. When you delete your
          account, we deactivate it and remove or anonymise personal data within a reasonable
          period, except where retention is required by law (for example, donation and financial
          records).
        </p>
      </Section>

      <Section title="6. Your rights and choices">
        <List
          items={[
            'Access and update most of your profile information directly within the app.',
            'Request a copy of the personal data we hold about you.',
            'Request correction of inaccurate data, or deletion of your account and associated data, subject to legal retention requirements.',
            'Withdraw consent for location access or promotional communications at any time through your device or app settings.',
            'Object to certain processing, where applicable law grants you that right.',
          ]}
        />
        <p>
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:privacy@ripplehub.app" className="text-blue-300 underline underline-offset-2">
            privacy@ripplehub.app
          </a>
          . We may need to verify your identity before acting on a request.
        </p>
      </Section>

      <Section title="7. Children's privacy">
        <p>
          The Platform is intended for individuals aged 18 and above. We do not knowingly collect
          personal data from anyone under 18. If you believe a minor has provided us with personal
          data, please contact us and we will take steps to remove it.
        </p>
      </Section>

      <Section title="8. Data security">
        <p>
          We use encryption in transit and at rest, access-controlled private storage for sensitive
          documents, and role-based access controls to protect your data. Full details are in our{' '}
          <a href="/security" className="text-blue-300 underline underline-offset-2">
            Security Policy
          </a>
          .
        </p>
      </Section>

      <Section title="9. Cookies">
        <p>
          Our website uses a limited set of cookies, described in our{' '}
          <a href="/cookies" className="text-blue-300 underline underline-offset-2">
            Cookie Policy
          </a>
          .
        </p>
      </Section>

      <Section title="10. International data transfers">
        <p>
          RippleHub is an India-first platform and primarily stores and processes data in India.
          Where a service provider processes data outside India, we require appropriate
          contractual and technical safeguards to protect it.
        </p>
      </Section>

      <Section title="11. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify you of material
          changes through the app or by email, and update the "Effective date" above.
        </p>
      </Section>

      <Section title="12. Contact us">
        <p>
          Questions about this policy or your data can be sent to{' '}
          <a href="mailto:privacy@ripplehub.app" className="text-blue-300 underline underline-offset-2">
            privacy@ripplehub.app
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  )
}
