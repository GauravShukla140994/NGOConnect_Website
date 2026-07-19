import CompanyLayout, { Section, ContactCard } from '../../components/company/CompanyLayout.jsx'

export default function Press() {
  return (
    <CompanyLayout
      title="Press"
      subtitle="Resources for journalists and media covering RippleHub."
    >
      <Section title="About RippleHub">
        <p className="glass rounded-2xl px-6 py-5 text-white/80">
          RippleHub is a platform connecting volunteers, NGOs, donors, and CSR partners in one
          place — helping people find verified causes to support with their time, skills, or
          money, and helping NGOs manage volunteers, projects, and donations with accountability
          built in. RippleHub is building India-first, with support for UPI payments and 80G/12A
          donation documentation.
        </p>
        <p className="mt-3 text-sm text-white/40">
          Feel free to quote the paragraph above when describing RippleHub.
        </p>
      </Section>

      <Section title="Brand assets">
        <p>
          A downloadable press kit with logos and brand assets isn't published yet — reach out
          below and we'll send what you need directly.
        </p>
      </Section>

      <Section title="Media inquiries">
        <ContactCard
          label="Press contact"
          email="contact@ripplehub.app"
          note="For interview requests, data/impact figures, or anything else press-related."
        />
      </Section>
    </CompanyLayout>
  )
}
