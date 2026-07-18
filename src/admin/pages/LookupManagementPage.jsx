import { useEffect, useState } from 'react'
import * as lookupsApi from '../api/lookups'

export default function LookupManagementPage() {
  const [types, setTypes] = useState([])
  const [selectedType, setSelectedType] = useState(null)
  const [values, setValues] = useState([])
  const [loadingValues, setLoadingValues] = useState(false)
  const [addTypeOpen, setAddTypeOpen] = useState(false)
  const [addValueOpen, setAddValueOpen] = useState(false)
  const [newType, setNewType] = useState({ typeCode: '', typeName: '', description: '' })
  const [newValue, setNewValue] = useState({ valueCode: '', valueName: '', description: '', orderNo: 0, isDefault: false })

  function loadTypes(keepSelection = true) {
    lookupsApi.getLookupTypes().then((list) => {
      setTypes(list)
      if (!keepSelection || !selectedType) {
        if (list.length) setSelectedType(list[0])
      }
    }).catch(() => setTypes([]))
  }

  useEffect(() => { loadTypes(false) }, [])

  function loadValues(type) {
    if (!type) return
    setLoadingValues(true)
    lookupsApi.getLookupValues(type.lookupTypeId).then(setValues).catch(() => setValues([])).finally(() => setLoadingValues(false))
  }

  useEffect(() => { loadValues(selectedType) }, [selectedType])

  async function handleAddType(e) {
    e.preventDefault()
    await lookupsApi.addLookupType(newType)
    setAddTypeOpen(false)
    setNewType({ typeCode: '', typeName: '', description: '' })
    loadTypes()
  }

  async function handleAddValue(e) {
    e.preventDefault()
    await lookupsApi.addLookupValue({ ...newValue, lookupTypeId: selectedType.lookupTypeId })
    setAddValueOpen(false)
    setNewValue({ valueCode: '', valueName: '', description: '', orderNo: 0, isDefault: false })
    loadValues(selectedType)
  }

  async function toggleActive(v) {
    if (v.isSystemValue) return
    // SP returns IsDeleted, not IsActive — active means not deleted.
    await lookupsApi.setLookupValueActive(v.lookupValueId, v.isDeleted)
    loadValues(selectedType)
  }

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div className="card" style={{ width: 280, flexShrink: 0 }}>
        <div className="card-head"><div className="h3">Lookup types</div></div>
        <div>
          {types.map((t) => (
            <div
              key={t.lookupTypeId}
              className={`lk-type-row${selectedType?.lookupTypeId === t.lookupTypeId ? ' on' : ''}`}
              onClick={() => setSelectedType(t)}
            >
              <div className="h3" style={{ fontSize: 13, color: selectedType?.lookupTypeId === t.lookupTypeId ? 'var(--p)' : undefined }}>{t.typeCode}</div>
              <div className="xs">{t.description || ' '}</div>
            </div>
          ))}
          {types.length === 0 && <div className="xs" style={{ padding: 18 }}>No lookup types found.</div>}
        </div>
        <div style={{ padding: '12px 18px' }}>
          <button className="btn-o btn-sm" style={{ width: '100%' }} onClick={() => setAddTypeOpen((o) => !o)}>+ Add lookup type</button>
          {addTypeOpen && (
            <form onSubmit={handleAddType} style={{ marginTop: 10 }}>
              <div className="fl"><label>Type code</label><input className="fi" required value={newType.typeCode} onChange={(e) => setNewType({ ...newType, typeCode: e.target.value.toUpperCase() })} /></div>
              <div className="fl"><label>Type name</label><input className="fi" required value={newType.typeName} onChange={(e) => setNewType({ ...newType, typeName: e.target.value })} /></div>
              <div className="fl"><label>Description</label><input className="fi" value={newType.description} onChange={(e) => setNewType({ ...newType, description: e.target.value })} /></div>
              <button className="btn-p" type="submit">Save</button>
            </form>
          )}
        </div>
      </div>

      <div className="card" style={{ flex: 1 }}>
        <div className="card-head">
          <div className="h3">{selectedType ? `${selectedType.typeCode} — values` : 'Select a lookup type'}</div>
          {selectedType && <button className="btn-p btn-sm" style={{ width: 'auto' }} onClick={() => setAddValueOpen((o) => !o)}>+ Add value</button>}
        </div>

        {addValueOpen && selectedType && (
          <form onSubmit={handleAddValue} style={{ padding: '0 18px 14px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="fl" style={{ marginBottom: 0 }}><label>Value code</label><input className="fi" required value={newValue.valueCode} onChange={(e) => setNewValue({ ...newValue, valueCode: e.target.value.toUpperCase() })} /></div>
            <div className="fl" style={{ marginBottom: 0 }}><label>Value name</label><input className="fi" required value={newValue.valueName} onChange={(e) => setNewValue({ ...newValue, valueName: e.target.value })} /></div>
            <div className="fl" style={{ marginBottom: 0 }}><label>Order</label><input className="fi" type="number" style={{ width: 80 }} value={newValue.orderNo} onChange={(e) => setNewValue({ ...newValue, orderNo: Number(e.target.value) })} /></div>
            <button className="btn-p btn-sm" type="submit" style={{ width: 'auto' }}>Add</button>
          </form>
        )}

        {loadingValues ? (
          <div style={{ padding: 18 }} className="sm">Loading…</div>
        ) : (
          <table>
            <tbody>
              <tr><th>Order</th><th>Value code</th><th>Value name</th><th>Default</th><th>System</th><th>Active</th></tr>
              {values.map((v) => (
                <tr key={v.lookupValueId}>
                  <td className="sm">{v.orderNo}</td>
                  <td className="sm">{v.valueCode}</td>
                  <td>{v.valueName}</td>
                  <td className="sm">{v.isDefault ? '✓' : '—'}</td>
                  <td className="sm">{v.isSystemValue ? '🔒 System' : '—'}</td>
                  <td>
                    <div
                      title={v.isSystemValue ? 'System values cannot be deactivated' : undefined}
                      style={{
                        width: 34, height: 19, borderRadius: 10,
                        background: !v.isDeleted ? 'var(--p)' : '#D8D8E4',
                        position: 'relative',
                        cursor: v.isSystemValue ? 'not-allowed' : 'pointer',
                        opacity: v.isSystemValue ? 0.6 : 1,
                      }}
                      onClick={() => toggleActive(v)}
                    >
                      <div style={{ position: 'absolute', top: 2, left: !v.isDeleted ? 17 : 2, width: 15, height: 15, background: '#fff', borderRadius: '50%', transition: 'left .15s' }} />
                    </div>
                  </td>
                </tr>
              ))}
              {values.length === 0 && <tr><td colSpan={6} className="xs" style={{ padding: 18 }}>No values yet.</td></tr>}
            </tbody>
          </table>
        )}
        <div style={{ padding: '12px 18px' }} className="xs">IsSystemValue=1 rows can be reordered/renamed but never deleted — they're referenced by SP logic.</div>
      </div>
    </div>
  )
}
