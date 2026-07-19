import LegalLayout, { Section, List } from '../../components/legal/LegalLayout.jsx'

export default function CookiePolicy() {
  return (
    <LegalLayout title="Cookie Policy" effectiveDate="19 July 2026">
      <Section title="1. What are cookies">
        <p>
          Cookies are small text files placed on your device when you visit a website. They help a
          site remember information about your visit, like your session or preferences, and can
          make it easier to use the site on a return visit.
        </p>
      </Section>

      <Section title="2. How we use cookies">
        <p>
          Our website currently uses a minimal set of cookies, limited to what is necessary to
          operate it securely:
        </p>
        <List
          items={[
            <>
              <b>Essential cookies</b> — used to keep you signed in to the Super Admin panel and to
              protect the Platform against cross-site request forgery. The Platform cannot function
              properly without these.
            </>,
            <>
              <b>Preference cookies</b> — used to remember basic display preferences, where
              applicable.
            </>,
          ]}
        />
        <p>
          We do not currently use advertising or cross-site tracking cookies. If we introduce
          analytics or marketing cookies in the future, we will update this policy and, where
          required by law, ask for your consent before setting them.
        </p>
      </Section>

      <Section title="3. Cookies used within the mobile app">
        <p>
          Our mobile app does not use browser cookies. It uses comparable local mechanisms (such as
          securely stored access tokens and device identifiers for push notifications) to keep you
          signed in and deliver notifications — these are covered by our{' '}
          <a href="/privacy" className="text-blue-300 underline underline-offset-2">
            Privacy Policy
          </a>{' '}
          rather than this Cookie Policy.
        </p>
      </Section>

      <Section title="4. Third-party cookies">
        <p>
          Pages that embed third-party content (for example, an embedded payment checkout) may set
          their own cookies, governed by that third party's own policy. We encourage you to review
          the relevant third party's cookie and privacy policy for details.
        </p>
      </Section>

      <Section title="5. Managing cookies">
        <p>
          Most browsers let you view, delete, and block cookies through their settings. Blocking
          essential cookies may prevent parts of the website, such as the Super Admin panel, from
          working correctly.
        </p>
      </Section>

      <Section title="6. Changes to this policy">
        <p>
          We may update this Cookie Policy as the Platform evolves. Material changes will be
          reflected by updating the effective date above.
        </p>
      </Section>

      <Section title="7. Contact us">
        <p>
          Questions about this policy can be sent to{' '}
          <a href="mailto:privacy@ripplehub.app" className="text-blue-300 underline underline-offset-2">
            privacy@ripplehub.app
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  )
}
