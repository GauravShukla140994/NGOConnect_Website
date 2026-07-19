import LegalLayout, { Section, List } from '../../components/legal/LegalLayout.jsx'

export default function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service" effectiveDate="19 July 2026">
      <Section title="1. Acceptance of these terms">
        <p>
          These Terms of Service ("Terms") govern your access to and use of RippleHub's mobile app
          and website (together, the "Platform"), operated by RippleHub Technologies ("RippleHub",
          "we", "us"). By creating an account or using the Platform, you agree to be bound by these
          Terms and our{' '}
          <a href="/privacy" className="text-blue-300 underline underline-offset-2">
            Privacy Policy
          </a>
          . If you do not agree, do not use the Platform.
        </p>
      </Section>

      <Section title="2. Who can use RippleHub">
        <p>
          You must be at least 18 years old and able to form a legally binding contract to create
          an account. By registering, you confirm the information you provide is accurate and that
          you meet this requirement.
        </p>
      </Section>

      <Section title="3. Accounts and roles">
        <p>The Platform supports several account types, each with its own responsibilities:</p>
        <List
          items={[
            <>
              <b>Volunteers</b> — individuals who discover and apply to opportunities, join
              Organisations, and track their volunteering impact.
            </>,
            <>
              <b>Organisations (NGOs)</b> — entities that register on the Platform, submit
              verification documents, post volunteering opportunities and projects, and manage
              members and donations.
            </>,
            <>
              <b>Donors</b> — individuals or entities who contribute financially to a registered
              Organisation's campaigns.
            </>,
            <>
              <b>Administrators</b> — RippleHub Super Admins who review Organisation registrations,
              verify documents, and moderate the Platform.
            </>,
          ]}
        />
        <p>
          You are responsible for maintaining the confidentiality of your login credentials and for
          all activity under your account. Notify us immediately of any unauthorised use.
        </p>
      </Section>

      <Section title="4. Organisation registration and verification">
        <p>
          Organisations must submit accurate registration details and supporting documents (such as
          a registration certificate) for review. RippleHub reserves the right to approve, reject,
          suspend, or request additional information for any Organisation at its discretion.
          Approval indicates that submitted documents were reviewed — it is not a certification,
          endorsement, or guarantee of an Organisation's legitimacy, tax status, or activities.
          Donors and volunteers should exercise their own judgement.
        </p>
      </Section>

      <Section title="5. Volunteering and projects">
        <p>
          RippleHub is a discovery and coordination platform. Volunteering arrangements are between
          you and the Organisation you engage with — RippleHub is not a party to that relationship,
          does not employ volunteers, and is not responsible for the conduct, safety practices, or
          commitments of any Organisation or volunteer. Volunteer hours, certificates, and impact
          scores shown on the Platform are based on data reported by Organisations and are provided
          for informational purposes only.
        </p>
      </Section>

      <Section title="6. Community content and conduct">
        <p>
          You are responsible for content you post (updates, comments, polls, reports). You agree
          not to post content that is unlawful, harassing, defamatory, fraudulent, or that
          infringes another person's rights. We may remove content or suspend accounts that violate
          these Terms, and we provide reporting tools to flag content for review.
        </p>
      </Section>

      <Section title="7. Donations and payments">
        <List
          items={[
            'Donations are processed by our third-party payment processor, Razorpay. RippleHub does not store your full card or bank account details.',
            'Donation receipts, including any 80G tax-exemption certificate, are issued based on information and eligibility declared by the receiving Organisation. RippleHub does not independently verify or guarantee an Organisation\'s tax-exemption status.',
            'Refund requests are subject to the receiving Organisation\'s own refund policy and applicable payment processor rules; contact the Organisation or our support team to initiate a request.',
            'Recurring donations can be managed or cancelled at any time from your donation history.',
          ]}
        />
      </Section>

      <Section title="8. Emergency SOS feature">
        <p>
          The Platform includes an SOS feature that shares your live location with nearby verified
          responders and relevant Organisation admins during an emergency you initiate.{' '}
          <b>
            This feature is a best-effort community safety tool and is not a substitute for
            contacting local emergency services (police, ambulance, fire).
          </b>{' '}
          RippleHub does not guarantee response time, responder availability, or resolution of any
          emergency, and is not liable for outcomes arising from use or non-use of this feature. In
          a genuine emergency, always contact your local emergency number first.
        </p>
      </Section>

      <Section title="9. Intellectual property">
        <p>
          The Platform, including its design, branding, and underlying software, is owned by
          RippleHub or its licensors and protected by applicable intellectual property laws. You
          retain ownership of content you post, but grant RippleHub a non-exclusive, worldwide,
          royalty-free licence to host, display, and distribute that content as necessary to
          operate the Platform.
        </p>
      </Section>

      <Section title="10. Prohibited conduct">
        <List
          items={[
            'Impersonating another person or entity, or misrepresenting your affiliation with an Organisation.',
            'Uploading false, fraudulent, or misleading verification documents.',
            'Using the Platform to solicit donations outside of a properly registered and verified Organisation.',
            'Attempting to access another user\'s account, or interfering with the security or operation of the Platform.',
            'Using automated tools to scrape or access the Platform without our written permission.',
          ]}
        />
      </Section>

      <Section title="11. Suspension and termination">
        <p>
          We may suspend or terminate your access to the Platform, with or without notice, if we
          reasonably believe you have violated these Terms, engaged in fraudulent or harmful
          conduct, or if required by law. You may stop using the Platform and request account
          deletion at any time.
        </p>
      </Section>

      <Section title="12. Disclaimers and limitation of liability">
        <p>
          The Platform is provided "as is" and "as available" without warranties of any kind, to
          the fullest extent permitted by law. RippleHub is not liable for the acts or omissions of
          Organisations, volunteers, or donors, or for any indirect, incidental, or consequential
          damages arising from your use of the Platform, to the maximum extent permitted by
          applicable law.
        </p>
      </Section>

      <Section title="13. Indemnification">
        <p>
          You agree to indemnify and hold RippleHub harmless from any claims, damages, or expenses
          arising from your use of the Platform, your content, or your violation of these Terms.
        </p>
      </Section>

      <Section title="14. Governing law">
        <p>
          These Terms are governed by the laws of India, without regard to conflict-of-law
          principles. Any dispute arising under these Terms will be subject to the exclusive
          jurisdiction of the courts of India.
        </p>
      </Section>

      <Section title="15. Changes to these terms">
        <p>
          We may update these Terms from time to time. Continued use of the Platform after changes
          take effect constitutes acceptance of the updated Terms.
        </p>
      </Section>

      <Section title="16. Contact us">
        <p>
          Questions about these Terms can be sent to{' '}
          <a href="mailto:contact@ripplehub.app" className="text-blue-300 underline underline-offset-2">
            contact@ripplehub.app
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  )
}
