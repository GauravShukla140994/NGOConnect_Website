import LegalLayout, { Section, List } from '../../components/legal/LegalLayout.jsx'

export default function CookiePolicy() {
  return (
    <LegalLayout title="Cookie Policy" effectiveDate="19 August 2026">
      <Section title="1. Introduction">
        <p>
          This Cookie Policy explains how RippleHub Technologies, having its registered office at
          E-27, Industrial Area Chanalon, Tehsil Kharar, SAS Nagar, Punjab, 140103 ("RippleHub",
          "we", "us" or "our"), uses
          cookies and similar technologies when you access or use the RippleHub website at{' '}
          <a href="https://www.ripplehub.app" className="text-blue-300 underline underline-offset-2">
            www.ripplehub.app
          </a>
          , mobile application and related services (collectively, the "Platform").
        </p>
        <p>
          This Cookie Policy should be read together with the{' '}
          <a href="/privacy" className="text-blue-300 underline underline-offset-2">
            RippleHub Privacy Policy
          </a>{' '}
          and the{' '}
          <a href="/terms" className="text-blue-300 underline underline-offset-2">
            Terms of Use
          </a>{' '}
          applicable to the Platform.
        </p>
        <p>
          By continuing to use the Platform, you acknowledge the use of cookies and similar
          technologies as described in this Cookie Policy, subject to any consent requirements
          applicable to you and the choices made through the Platform's cookie or privacy settings.
        </p>
      </Section>

      <Section title="2. What are cookies?">
        <p>
          Cookies are small text files or similar data files that may be placed on your device when
          you visit a website. Cookies allow a website to recognise a particular device or browser
          and may be used to:
        </p>
        <List
          items={[
            'enable the website to function properly;',
            'maintain login sessions;',
            'remember user preferences;',
            'improve security;',
            'understand how users interact with the Platform; and',
            'analyse and improve the performance of the Platform.',
          ]}
        />
        <p>
          Similar technologies, including pixels, tags, local storage and device identifiers, may
          also be used for substantially similar purposes. References to "cookies" in this Policy
          include such similar technologies where applicable.
        </p>
      </Section>

      <Section title="3. Types of cookies we may use">
        <p>
          Depending upon the features and configuration of the Platform, RippleHub may use the
          following categories of cookies.
        </p>
        <p><b>3.1 Strictly necessary cookies</b></p>
        <p>
          These cookies are necessary for the operation, security and basic functionality of the
          Platform. They may be used to:
        </p>
        <List
          items={[
            'enable account login and authentication;',
            'maintain user sessions;',
            'protect accounts and prevent unauthorised access;',
            'maintain security;',
            'remember essential technical settings;',
            'detect and prevent fraudulent or abusive activity; and',
            'enable core Platform functionality.',
          ]}
        />
        <p>
          These cookies generally cannot be disabled through the Platform without affecting the
          functionality or security of the Platform.
        </p>
        <p><b>3.2 Functionality and preference cookies</b></p>
        <p>
          These cookies may be used to remember choices made by users and improve their experience.
          For example, they may remember language preferences, region or location preferences,
          display preferences, selected settings, or other preferences necessary to provide a more
          personalised experience. Where applicable law requires consent for such cookies, they
          will only be used following the user's consent.
        </p>
        <p><b>3.3 Analytics and performance cookies</b></p>
        <p>
          RippleHub may use analytics cookies and similar technologies to understand how visitors
          use the Platform. For this purpose, RippleHub currently uses Google Analytics. Analytics
          information may help us understand how users reach the Platform, which pages or features
          are used, how long users interact with particular features, how users navigate through
          the Platform, technical or performance issues, and how the Platform may be improved.
          Analytics cookies are not intended to provide RippleHub with information such as the
          contents of a user's private communications or identity documents. Where consent is
          required under applicable law, analytics cookies will be activated only after the
          relevant consent has been obtained.
        </p>
        <p><b>3.4 Other cookies and similar technologies</b></p>
        <p>
          As the Platform develops, RippleHub may introduce additional functionality, services or
          third-party tools that use cookies or similar technologies, such as security and
          fraud-prevention technologies, embedded content, social media functionality,
          communication tools, or performance monitoring tools. Where required, the applicable
          cookie or privacy settings will be updated to reflect such technologies.
        </p>
      </Section>

      <Section title="4. First-party and third-party cookies">
        <p>
          Cookies may be placed directly by RippleHub ("first-party cookies") or by third-party
          service providers whose services are integrated into the Platform ("third-party
          cookies"). Third parties may include service providers supporting analytics, hosting and
          infrastructure, security, communications, embedded content, and other Platform
          functionality. Third-party providers may process information collected through their
          technologies in accordance with their own privacy policies and applicable terms. For
          example, RippleHub uses Google Analytics for analytics purposes. Users should review
          Google's applicable privacy documentation for further information concerning the
          processing carried out by Google.
        </p>
      </Section>

      <Section title="5. Google Analytics">
        <p>
          RippleHub uses Google Analytics to understand how users interact with the Platform and to
          improve its performance and functionality. Google Analytics may use cookies and similar
          technologies to collect information concerning user interactions with the Platform.
          Depending upon the configuration adopted by RippleHub and the user's consent choices,
          Google Analytics may process information relating to device and browser characteristics,
          pages and features accessed, approximate location, interaction and usage information,
          session information, and other technical or analytical information. RippleHub may use
          Google's available consent-management functionality to ensure that relevant analytics
          technologies respond to users' consent choices.
        </p>
      </Section>

      <Section title="6. Cookie consent and your choices">
        <p>
          Where applicable law requires consent for the use of non-essential cookies, RippleHub
          will seek the user's consent before activating such cookies. Users may be provided with
          options to accept optional cookies, reject optional cookies, or manage cookie preferences
          by category. Users may change or withdraw their cookie preferences through the
          cookie-management mechanism made available on the Platform, where available. Refusing or
          withdrawing consent for certain cookies should not prevent access to the Platform's basic
          services, although certain features or functionality may be affected. RippleHub will not
          treat the refusal of optional cookies as a refusal of strictly necessary cookies required
          for the operation and security of the Platform.
        </p>
      </Section>

      <Section title="7. Browser controls">
        <p>
          Most modern web browsers allow users to view cookies stored on their device, delete
          existing cookies, block cookies, restrict third-party cookies, or receive notifications
          when cookies are being placed. Users may therefore use their browser settings to control
          or delete cookies. Disabling strictly necessary cookies may, however, affect the
          operation, security or functionality of the Platform.
        </p>
      </Section>

      <Section title="8. Cookie duration">
        <p>
          Cookies may be either Session Cookies, which are generally deleted when the browsing
          session ends, or Persistent Cookies, which remain on the device for a specified period or
          until deleted by the user. The duration of individual cookies may vary depending upon
          their purpose, technical configuration and the service provider placing them. RippleHub
          may modify cookie duration where reasonably necessary for security, functionality,
          analytics or other legitimate Platform requirements.
        </p>
      </Section>

      <Section title="9. Cookies and personal data">
        <p>
          Certain cookie information may constitute or be associated with personal data, depending
          upon the information collected and the applicable law. Where cookies involve personal
          data, such information will be processed in accordance with the RippleHub Privacy Policy
          and applicable data protection laws. The use of cookies does not permit RippleHub to
          access information stored on a user's device that is unrelated to the Platform's
          operation or the purposes described in this Cookie Policy.
        </p>
      </Section>

      <Section title="10. International users">
        <p>
          RippleHub intends to operate internationally and may therefore be accessed by users
          located in different jurisdictions. Different jurisdictions may impose different
          requirements concerning cookies, tracking technologies and consent. RippleHub may
          implement additional cookie controls, consent mechanisms or restrictions for users in
          jurisdictions where such measures are required by applicable law.
        </p>
      </Section>

      <Section title="11. Changes to this Cookie Policy">
        <p>
          RippleHub may update this Cookie Policy from time to time to reflect changes to the
          Platform, changes to the cookies and technologies used, changes to third-party service
          providers, changes in applicable law or regulatory requirements, or changes in our
          privacy and security practices. The updated Cookie Policy will be published on the
          Platform together with the revised effective date above.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          For questions or concerns regarding this Cookie Policy or the use of cookies on the
          Platform, you may contact our Grievance Officer / Data Protection Contact:
        </p>
        <p>
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
