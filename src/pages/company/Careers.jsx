import CompanyLayout, { Section, List, ContactCard } from '../../components/company/CompanyLayout.jsx'

export default function Careers() {
  return (
    <CompanyLayout
      title="Careers"
      subtitle="We're building the infrastructure for social impact in India. It's early — which means there's a lot of room to shape what comes next."
    >
      <Section title="Working at RippleHub">
        <p>
          We're a small, early-stage team building a platform that NGOs, volunteers, and donors
          actually rely on. That means we care about getting the fundamentals right — reliability,
          trust, and doing right by the people using the Platform — over moving fast and breaking
          things.
        </p>
      </Section>

      <Section title="What we look for">
        <List
          items={[
            'Ownership — you follow things through, not just the interesting parts of them.',
            'Craft — you care about the quality of what you ship, not just that it ships.',
            'Judgement — you can operate with limited direction and ask good questions when you can\'t.',
            'Genuine interest in the mission — this platform only matters if it helps real NGOs and real volunteers.',
          ]}
        />
      </Section>

      <Section title="Open roles">
        <p>
          We don't have specific open positions listed right now. As the team grows, roles will be
          posted here. If you'd like to be considered for future opportunities in engineering,
          product, or operations, we'd still like to hear from you.
        </p>
        <ContactCard
          label="Get in touch"
          email="contact@ripplehub.app"
          note="Tell us a bit about yourself and what you're interested in working on."
        />
      </Section>
    </CompanyLayout>
  )
}
