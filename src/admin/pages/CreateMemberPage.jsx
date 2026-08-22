import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as membersApi from '../api/members'
import * as orgsApi from '../api/orgs'
import * as lookupsApi from '../api/lookups'

// Proactive Member + Organisation onboarding wizard — lets Super Admin create a
// user's profile and associate/create an organisation for them BEFORE they've
// ever opened the app, then hands back a secure share link. Backs
// POST /api/v1/superadmin/members (SuperAdmin_CreateMemberWithOrg).
//
// Duplicate email/mobile is a HARD REJECT server-side, not a silent merge —
// the API returns a clear validation error and this page just surfaces it.

const STEPS = ['Member', 'Organisation', 'Role', 'Review']
const ROLES = [
  ['FOUNDER', 'Founder — full org ownership'],
  ['ADMIN', 'Admin — manage projects, members, org profile'],
  ['MODERATOR', 'Moderator — manage community posts'],
  ['MEMBER', 'Member / Volunteer — standard membership'],
]

async function findLookup(typeCode) {
  const types = await lookupsApi.getLookupTypes()
  const type = types.find((t) => t.typeCode === typeCode)
  if (!type) return []
  return lookupsApi.getLookupValues(type.lookupTypeId)
}

export default function CreateMemberPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [result, setResult] = useState(null) // set on success -> shows Section 6

  const [genders, setGenders] = useState([])
  const [orgTypes, setOrgTypes] = useState([])
  const [orgOptions, setOrgOptions] = useState([])

  // Step 1 — Member
  const [member, setMember] = useState({
    firstName: '', lastName: '', email: '', mobile: '', countryCode: '+91',
    genderLkpId: '', dateOfBirth: '', profilePhoto: '',
    addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'India',
  })

  // Step 2 — Organisation
  const [orgMode, setOrgMode] = useState('EXISTING') // 'NEW' | 'EXISTING'
  const [existingOrgId, setExistingOrgId] = useState('')
  const [org, setOrg] = useState({
    orgName: '', orgTypeLkpId: '', regNumber: '', category: '',
    about: '', mission: '', vision: '', logoUrl: '',
    contactEmail: '', contactPhone: '', website: '',
    orgAddressLine1: '', orgAddressLine2: '', orgCity: '', orgState: '', orgPincode: '', orgCountry: 'India',
  })

  // Step 3 — Role
  const [roleCode, setRoleCode] = useState('ADMIN')

  useEffect(() => {
    findLookup('GENDER').then(setGenders).catch(() => setGenders([]))
    findLookup('ORG_TYPE').then(setOrgTypes).catch(() => setOrgTypes([]))
    orgsApi.getOrgsByStatus('APPROVED')
      .then((list) => setOrgOptions(list.map((o) => ({ value: o.orgId, label: o.orgName }))))
      .catch(() => setOrgOptions([]))
  }, [])

  function updateMember(field, value) { setMember((m) => ({ ...m, [field]: value })) }
  function updateOrg(field, value) { setOrg((o) => ({ ...o, [field]: value })) }

  function validateStep1() {
    if (!member.email.trim() && !member.mobile.trim()) return 'Provide at least an email address or a mobile number.'
    return ''
  }
  function validateStep2() {
    if (orgMode === 'EXISTING' && !existingOrgId) return 'Select an existing organisation.'
    if (orgMode === 'NEW') {
      if (!org.orgName.trim()) return 'Organisation name is required.'
      if (!org.regNumber.trim()) return 'Registration number is required.'
      if (!org.orgTypeLkpId) return 'Organisation type is required.'
    }
    return ''
  }

  function goNext() {
    const validationErr = step === 1 ? validateStep1() : step === 2 ? validateStep2() : ''
    if (validationErr) { setErr(validationErr); return }
    setErr('')
    setStep((s) => s + 1)
  }

  async function handleSubmit() {
    setSaving(true)
    setErr('')
    try {
      const payload = {
        firstName: member.firstName || null,
        lastName: member.lastName || null,
        email: member.email || null,
        mobile: member.mobile || null,
        countryCode: member.countryCode || '+91',
        genderLkpId: member.genderLkpId ? Number(member.genderLkpId) : null,
        dateOfBirth: member.dateOfBirth || null,
        profilePhoto: member.profilePhoto || null,
        addressLine1: member.addressLine1 || null,
        addressLine2: member.addressLine2 || null,
        city: member.city || null,
        state: member.state || null,
        pincode: member.pincode || null,
        country: member.country || null,

        orgMode,
        existingOrgId: orgMode === 'EXISTING' ? Number(existingOrgId) : null,

        orgName: orgMode === 'NEW' ? org.orgName : null,
        orgTypeLkpId: orgMode === 'NEW' && org.orgTypeLkpId ? Number(org.orgTypeLkpId) : null,
        regNumber: orgMode === 'NEW' ? org.regNumber : null,
        category: orgMode === 'NEW' ? (org.category || null) : null,
        about: orgMode === 'NEW' ? (org.about || null) : null,
        mission: orgMode === 'NEW' ? (org.mission || null) : null,
        vision: orgMode === 'NEW' ? (org.vision || null) : null,
        logoUrl: orgMode === 'NEW' ? (org.logoUrl || null) : null,
        contactEmail: orgMode === 'NEW' ? (org.contactEmail || null) : null,
        contactPhone: orgMode === 'NEW' ? (org.contactPhone || null) : null,
        website: orgMode === 'NEW' ? (org.website || null) : null,
        orgAddressLine1: orgMode === 'NEW' ? (org.orgAddressLine1 || null) : null,
        orgAddressLine2: orgMode === 'NEW' ? (org.orgAddressLine2 || null) : null,
        orgCity: orgMode === 'NEW' ? (org.orgCity || null) : null,
        orgState: orgMode === 'NEW' ? (org.orgState || null) : null,
        orgPincode: orgMode === 'NEW' ? (org.orgPincode || null) : null,
        orgCountry: orgMode === 'NEW' ? (org.orgCountry || null) : null,

        roleCode,
      }

      const res = await membersApi.createMemberWithOrg(payload)
      if (res?.isSuccess === 1) {
        setResult(res.data)
        setStep(5) // Section 6 — success screen
      } else {
        setErr(res?.message || 'Could not create the member. Please review the details and try again.')
      }
    } catch (e) {
      setErr(e?.response?.data?.message || 'Could not create the member. Please review the details and try again.')
    } finally {
      setSaving(false)
    }
  }

  function copyLink() {
    if (result?.orgShareUrl) navigator.clipboard?.writeText(result.orgShareUrl).catch(() => {})
  }
  async function shareLink() {
    if (!result?.orgShareUrl) return
    if (navigator.share) {
      try { await navigator.share({ title: 'RippleHub Organisation Profile', url: result.orgShareUrl }) } catch { /* user cancelled */ }
    } else {
      copyLink()
    }
  }

  const roleLabel = ROLES.find(([code]) => code === roleCode)?.[1] || roleCode
  const orgLabel = orgMode === 'NEW' ? org.orgName : (orgOptions.find((o) => o.value === Number(existingOrgId))?.label || '—')

  return (
    <div className="card">
      <div className="card-head">
        <div className="h3">Create member</div>
        <button className="btn-o btn-sm" onClick={() => navigate('/admin/members')}>Back to members</button>
      </div>

      {step <= 4 && (
        <div className="tabs">
          {STEPS.map((label, i) => (
            <div key={label} className={`tab${step === i + 1 ? ' on' : ''}`}
                 style={{ cursor: i + 1 < step ? 'pointer' : 'default' }}
                 onClick={() => { if (i + 1 < step) setStep(i + 1) }}>
              {i + 1}. {label}
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: 18 }}>
        {err && <div className="xs" style={{ color: '#C0392B', marginBottom: 12 }}>{err}</div>}

        {/* ── Step 1: Member ── */}
        {step === 1 && (
          <>
            <div className="xs" style={{ marginBottom: 12 }}>At least one of Email or Mobile is required.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input className="fi" placeholder="First name" value={member.firstName} onChange={(e) => updateMember('firstName', e.target.value)} />
              <input className="fi" placeholder="Last name" value={member.lastName} onChange={(e) => updateMember('lastName', e.target.value)} />
              <input className="fi" placeholder="Email address" type="email" value={member.email} onChange={(e) => updateMember('email', e.target.value)} />
              <input className="fi" placeholder="Mobile number" value={member.mobile} onChange={(e) => updateMember('mobile', e.target.value)} />
              <select className="fi" value={member.genderLkpId} onChange={(e) => updateMember('genderLkpId', e.target.value)}>
                <option value="">Gender (optional)</option>
                {genders.map((g) => <option key={g.lookupValueId} value={g.lookupValueId}>{g.valueName}</option>)}
              </select>
              <input className="fi" type="date" placeholder="Date of birth" value={member.dateOfBirth} onChange={(e) => updateMember('dateOfBirth', e.target.value)} />
              <input className="fi" placeholder="Address line 1" value={member.addressLine1} onChange={(e) => updateMember('addressLine1', e.target.value)} style={{ gridColumn: '1 / -1' }} />
              <input className="fi" placeholder="Address line 2" value={member.addressLine2} onChange={(e) => updateMember('addressLine2', e.target.value)} style={{ gridColumn: '1 / -1' }} />
              <input className="fi" placeholder="City" value={member.city} onChange={(e) => updateMember('city', e.target.value)} />
              <input className="fi" placeholder="State" value={member.state} onChange={(e) => updateMember('state', e.target.value)} />
              <input className="fi" placeholder="PIN / ZIP code" value={member.pincode} onChange={(e) => updateMember('pincode', e.target.value)} />
              <input className="fi" placeholder="Country" value={member.country} onChange={(e) => updateMember('country', e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
              <button className="btn-p" style={{ width: 'auto', padding: '10px 22px' }} onClick={goNext}>Next: Organisation →</button>
            </div>
          </>
        )}

        {/* ── Step 2: Organisation ── */}
        {step === 2 && (
          <>
            <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" checked={orgMode === 'EXISTING'} onChange={() => setOrgMode('EXISTING')} /> Associate existing organisation
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" checked={orgMode === 'NEW'} onChange={() => setOrgMode('NEW')} /> Create new organisation
              </label>
            </div>

            {orgMode === 'EXISTING' ? (
              <select className="fi" value={existingOrgId} onChange={(e) => setExistingOrgId(e.target.value)}>
                <option value="">Select an organisation…</option>
                {orgOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input className="fi" placeholder="Organisation name *" value={org.orgName} onChange={(e) => updateOrg('orgName', e.target.value)} />
                <select className="fi" value={org.orgTypeLkpId} onChange={(e) => updateOrg('orgTypeLkpId', e.target.value)}>
                  <option value="">Organisation type *</option>
                  {orgTypes.map((t) => <option key={t.lookupValueId} value={t.lookupValueId}>{t.valueName}</option>)}
                </select>
                <input className="fi" placeholder="Registration number *" value={org.regNumber} onChange={(e) => updateOrg('regNumber', e.target.value)} />
                <input className="fi" placeholder="Category" value={org.category} onChange={(e) => updateOrg('category', e.target.value)} />
                <input className="fi" placeholder="Contact email" value={org.contactEmail} onChange={(e) => updateOrg('contactEmail', e.target.value)} />
                <input className="fi" placeholder="Contact phone" value={org.contactPhone} onChange={(e) => updateOrg('contactPhone', e.target.value)} />
                <input className="fi" placeholder="Website" value={org.website} onChange={(e) => updateOrg('website', e.target.value)} style={{ gridColumn: '1 / -1' }} />
                <input className="fi" placeholder="Logo URL" value={org.logoUrl} onChange={(e) => updateOrg('logoUrl', e.target.value)} style={{ gridColumn: '1 / -1' }} />
                <textarea className="fi" placeholder="About" value={org.about} onChange={(e) => updateOrg('about', e.target.value)} style={{ gridColumn: '1 / -1', minHeight: 60 }} />
                <textarea className="fi" placeholder="Mission" value={org.mission} onChange={(e) => updateOrg('mission', e.target.value)} style={{ gridColumn: '1 / -1', minHeight: 50 }} />
                <textarea className="fi" placeholder="Vision" value={org.vision} onChange={(e) => updateOrg('vision', e.target.value)} style={{ gridColumn: '1 / -1', minHeight: 50 }} />
                <input className="fi" placeholder="Address line 1" value={org.orgAddressLine1} onChange={(e) => updateOrg('orgAddressLine1', e.target.value)} style={{ gridColumn: '1 / -1' }} />
                <input className="fi" placeholder="Address line 2" value={org.orgAddressLine2} onChange={(e) => updateOrg('orgAddressLine2', e.target.value)} style={{ gridColumn: '1 / -1' }} />
                <input className="fi" placeholder="City" value={org.orgCity} onChange={(e) => updateOrg('orgCity', e.target.value)} />
                <input className="fi" placeholder="State" value={org.orgState} onChange={(e) => updateOrg('orgState', e.target.value)} />
                <input className="fi" placeholder="PIN / ZIP code" value={org.orgPincode} onChange={(e) => updateOrg('orgPincode', e.target.value)} />
                <input className="fi" placeholder="Country" value={org.orgCountry} onChange={(e) => updateOrg('orgCountry', e.target.value)} />
                <div className="xs" style={{ gridColumn: '1 / -1' }}>
                  Registration/verification documents can be uploaded from the organisation's detail drawer after creation.
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
              <button className="btn-o" style={{ width: 'auto', padding: '10px 22px' }} onClick={() => setStep(1)}>← Back</button>
              <button className="btn-p" style={{ width: 'auto', padding: '10px 22px' }} onClick={goNext}>Next: Role →</button>
            </div>
          </>
        )}

        {/* ── Step 3: Role ── */}
        {step === 3 && (
          <>
            <div className="xs" style={{ marginBottom: 12 }}>Permissions are applied automatically based on the selected role.</div>
            {ROLES.map(([code, label]) => (
              <label key={code} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 0', cursor: 'pointer', borderBottom: '1px solid var(--bd, #EEEEF2)' }}>
                <input type="radio" checked={roleCode === code} onChange={() => setRoleCode(code)} />
                <span className="sm">{label}</span>
              </label>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
              <button className="btn-o" style={{ width: 'auto', padding: '10px 22px' }} onClick={() => setStep(2)}>← Back</button>
              <button className="btn-p" style={{ width: 'auto', padding: '10px 22px' }} onClick={goNext}>Next: Review →</button>
            </div>
          </>
        )}

        {/* ── Step 4: Review & Create ── */}
        {step === 4 && (
          <>
            <div className="slab">Member</div>
            <div className="sm">{[member.firstName, member.lastName].filter(Boolean).join(' ') || '—'}</div>
            <div className="xs">{member.email || '—'} {member.mobile ? `· ${member.countryCode} ${member.mobile}` : ''}</div>

            <div className="slab" style={{ marginTop: 14 }}>Organisation</div>
            <div className="sm">{orgLabel || '—'} {orgMode === 'NEW' && <span className="xs">(new)</span>}</div>

            <div className="slab" style={{ marginTop: 14 }}>Role</div>
            <div className="sm">{roleLabel}</div>

            <div className="slab" style={{ marginTop: 14 }}>Account status</div>
            <div className="xs">Account will be created and made available for login via OTP immediately. No password is required — RippleHub uses OTP-only authentication.</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
              <button className="btn-o" style={{ width: 'auto', padding: '10px 22px' }} onClick={() => setStep(3)}>← Back</button>
              <button className="btn-p" style={{ width: 'auto', padding: '10px 22px' }} disabled={saving} onClick={handleSubmit}>
                {saving ? 'Creating…' : 'Create member'}
              </button>
            </div>
          </>
        )}

        {/* ── Step 5 (Section 6): Success ── */}
        {step === 5 && result && (
          <>
            <div className="h3" style={{ marginBottom: 4 }}>✅ Member created successfully</div>
            <div className="sm" style={{ marginBottom: 14 }}>
              {[member.firstName, member.lastName].filter(Boolean).join(' ') || 'Member'} has been added to {orgLabel}.
            </div>

            <div className="xs">Email / Mobile</div>
            <div className="sm" style={{ marginBottom: 10 }}>{member.email || '—'} {member.mobile ? `· ${member.countryCode} ${member.mobile}` : ''}</div>

            <div className="xs">Organisation role</div>
            <div className="sm" style={{ marginBottom: 10 }}>{roleLabel}</div>

            <div className="xs">Secure organisation profile link</div>
            <div className="fi" style={{ wordBreak: 'break-all', marginBottom: 10 }}>{result.orgShareUrl}</div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-o btn-sm" onClick={copyLink}>Copy link</button>
              <button className="btn-p" style={{ width: 'auto' }} onClick={shareLink}>Share link</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
              <button className="btn-o" style={{ width: 'auto', padding: '10px 22px' }} onClick={() => navigate('/admin/members')}>Done</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
