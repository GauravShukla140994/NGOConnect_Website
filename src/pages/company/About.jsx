import { Link } from 'react-router-dom'
import CompanyLayout, { Section, List } from '../../components/company/CompanyLayout.jsx'

export default function About() {
  return (
    <CompanyLayout
      title="About RippleHub"
      subtitle="Connecting every helping hand with every cause — anywhere in the world."
    >
      <Section title="Why we exist">
        <p>
          Every day, people want to help — with their time, their skills, or their money — and
          every day, NGOs doing real work on the ground struggle to find them, verify them, and
          coordinate with them efficiently. RippleHub exists to close that gap: one platform where
          volunteers, NGOs, donors, and CSR partners can find each other and get things done.
        </p>
        <p>
          The name is deliberate. One small act of help ripples outward — a volunteer's afternoon
          becomes a completed project, a donor's contribution becomes a delivered outcome, an NGO's
          verified profile becomes trust a new supporter can rely on. RippleHub is the hub where
          those ripples start.
        </p>
      </Section>

      <Section title="What we do">
        <List
          items={[
            'Help volunteers discover and apply to real opportunities, track their hours, and build a verifiable record of impact.',
            'Give NGOs the tools to register, get verified, manage members, run projects, and report on outcomes.',
            'Make donating simple and accountable — secure payments, instant receipts, and 80G/12A documentation handled by the receiving Organisation.',
            'Bring communities together around causes, with posts, updates, and shared impact.',
            'Support volunteer and community safety, including an SOS emergency alert feature.',
          ]}
        />
      </Section>

      <Section title="How we operate">
        <p>
          RippleHub verifies every Organisation before it can raise funds or post opportunities on
          the Platform — registration documents are reviewed by our team, not just self-declared.
          We're building India-first, with support for UPI and India-specific compliance like 80G
          and 12A documentation, and designing for scale from day one.
        </p>
      </Section>

      <Section title="Get involved">
        <p>
          Want to volunteer, register your NGO, or support a cause? Download the app to get
          started. Interested in joining the team, or want to talk to us directly? Visit our{' '}
          <Link to="/careers" className="text-blue-300 underline underline-offset-2">
            Careers
          </Link>{' '}
          or{' '}
          <Link to="/contact" className="text-blue-300 underline underline-offset-2">
            Contact
          </Link>{' '}
          pages.
        </p>
      </Section>
    </CompanyLayout>
  )
}
