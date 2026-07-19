import CompanyLayout, { Section, ContactCard } from '../../components/company/CompanyLayout.jsx'

export default function Contact() {
  return (
    <CompanyLayout
      title="Contact us"
      subtitle="Pick whichever fits best — we'll get back to you as soon as we can."
    >
      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          <ContactCard
            label="General inquiries"
            email="contact@ripplehub.app"
            note="Questions about the Platform, partnerships, or anything else."
          />
          <ContactCard
            label="NGO registration & support"
            email="contact@ripplehub.app"
            note="Registering your Organisation or getting help as an NGO admin."
          />
          <ContactCard
            label="Careers"
            email="contact@ripplehub.app"
            note="Interested in joining the team."
          />
          <ContactCard
            label="Press"
            email="contact@ripplehub.app"
            note="Media and journalist inquiries."
          />
          <ContactCard
            label="Privacy & data"
            email="contact@ripplehub.app"
            note="Questions about your data or our Privacy Policy."
          />
          <ContactCard
            label="Security"
            email="contact@ripplehub.app"
            note="Report a vulnerability or security concern."
          />
        </div>
      </Section>
    </CompanyLayout>
  )
}
