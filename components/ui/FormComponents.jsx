'use client';

// ─── KONSTANTA & OPSI DERINGKAS ──────────────────────────────────────────
const BSC = ['Financial', 'Customer', 'Internal Process', 'Learning & Growth'];
const TIPE = ['Leading', 'Lagging'];
const JENIS = ['Average', 'Sum', 'Take Last Known'];
const POLARITAS = ['Maximize', 'Minimize'];
const FREKUENSI = ['Monthly', 'Quarterly', 'Half Yearly', 'Yearly'];
const SATUAN = ['%', 'Rp', 'Unit', 'Orang', 'Hari', 'Jam', 'Kali', 'Dokumen', 'Lainnya'];
const VALIDITAS = [{ v: 'Activity', l: 'Activity (0 - 100)' }, { v: 'Proxy', l: 'Proxy (100 - 105)' }, { v: 'Exact', l: 'Exact (105 - 110)' }];
const BULAN = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agt', 'sep', 'okt', 'nov', 'des'].map(k => ({ k, l: k.toUpperCase() }));

// ─── KOMPONEN UI GLOBAL (SHARED) ─────────────────────────────────────────

// ✅ Base style untuk semua input agar warnanya seragam HITAM (#000)
const baseInput = { 
  width: '100%', padding: '10px 14px', border: '1.5px solid #e5eaf0', borderRadius: 8, 
  fontSize: 14, fontFamily: 'inherit', color: '#000', background: '#f8fafc', outline: 'none', transition: 'border-color 0.2s' 
};
const focus = e => e.target.style.borderColor = '#3b7dd8';
const blur  = e => e.target.style.borderColor = '#e5eaf0';

const FieldRow = ({ label, req, children }) => (
  <div style={{ display: 'flex', gap: 24, marginBottom: 24, alignItems: 'flex-start' }}>
    <div style={{ width: 200, flexShrink: 0, paddingTop: 10 }}>
      <label style={{ fontSize: 14, fontWeight: 600, color: '#000' }}>
        {label}{req && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
    </div>
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

export const SectionCard = ({ title, children }) => (
  <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', marginBottom: 20, overflow: 'hidden' }}>
    <div style={{ padding: '18px 28px', borderBottom: '1px solid #f0f4f8' }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#000' }}>{title}</h2>
    </div>
    <div style={{ padding: '24px 28px' }}>{children}</div>
  </div>
);

export const TextInput = ({ value, onChange, placeholder, style, ...rest }) => (
  <input type="text" value={value || ''} onChange={onChange} placeholder={placeholder} style={{...baseInput, ...style}} onFocus={focus} onBlur={blur} {...rest} />
);

export const TextArea = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea value={value || ''} onChange={onChange} placeholder={placeholder} rows={rows} style={{ ...baseInput, resize: 'vertical', lineHeight: 1.6 }} onFocus={focus} onBlur={blur} />
);

export const SelectInput = ({ value, onChange, placeholder, options }) => (
  <select value={value || ''} onChange={onChange} style={{ ...baseInput, color: value ? '#000' : '#6b7280', cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
    <option value="" disabled>{placeholder}</option>
    {options.map(o => <option key={o.v || o} value={o.v || o}>{o.l || o}</option>)}
  </select>
);

// ─── 1. FORM INFORMASI DASAR ────────────────────────────────────────────
export function InformasiDasarForm({ form, set }) {
  return (
    <SectionCard title="Informasi Dasar & Strategis">
      <FieldRow label="Perspektif Balanced Scorecard" req>
        <SelectInput value={form.perspektif_bsc} onChange={set('perspektif_bsc')} placeholder="Pilih Perspektif..." options={BSC} />
      </FieldRow>
      <FieldRow label="Sasaran Strategis">
        <TextInput value={form.sasaran_strategis} onChange={set('sasaran_strategis')} placeholder="Ketik Sasaran Strategis..." />
      </FieldRow>
      <FieldRow label="Nama KPI" req>
        <TextInput value={form.nama_kpi} onChange={set('nama_kpi')} placeholder="Contoh: Akurasi Laporan Keuangan" />
      </FieldRow>
      <FieldRow label="Definisi KPI" req>
        <TextArea value={form.definisi_kpi} onChange={set('definisi_kpi')} placeholder="Jelaskan apa yang diukur oleh KPI ini..." />
      </FieldRow>
      <FieldRow label="Tujuan KPI">
        <TextArea value={form.tujuan_kpi} onChange={set('tujuan_kpi')} placeholder="Tujuan dan goal dari KPI ini..." rows={3} />
      </FieldRow>
    </SectionCard>
  );
}

// ─── 2. FORM KARAKTERISTIK KPI ──────────────────────────────────────────
export function KarakteristikKPIForm({ form, set }) {
  return (
    <SectionCard title="Karakteristik KPI">
      <FieldRow label="Tipe KPI">
        <SelectInput value={form.tipe_kpi} onChange={set('tipe_kpi')} placeholder="Pilih Tipe..." options={TIPE} />
      </FieldRow>
      <FieldRow label="Formula Penilaian">
        <TextArea value={form.formula_penilaian} onChange={set('formula_penilaian')} placeholder="Ketik formula penilaian di sini..." rows={3} />
      </FieldRow>
      <FieldRow label="Jenis, Polaritas & Frekuensi">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {[['Jenis Pengukuran', 'jenis_pengukuran', JENIS], ['Polaritas', 'polaritas', POLARITAS], ['Frekuensi', 'frekuensi', FREKUENSI]].map(([l, k, o]) => (
            <div key={k}>
              <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#7a8b9a', marginBottom: 6, textTransform: 'uppercase' }}>{l}</span>
              <SelectInput value={form[k]} onChange={set(k)} placeholder="-Pilih-" options={o} />
            </div>
          ))}
        </div>
      </FieldRow>
    </SectionCard>
  );
}

// ─── 3. FORM TARGET & VALIDASI ──────────────────────────────────────────
export function TargetValidasiForm({ form, set }) {
  return (
    <SectionCard title="Target & Validasi">
      <FieldRow label="Target Bulanan">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {BULAN.map(b => (
            <div key={b.k} style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e5eaf0', borderRadius: 8, overflow: 'hidden', background: '#f8fafc' }}>
              <span style={{ padding: '9px 10px', background: '#f0f4f8', fontSize: 11, fontWeight: 700, color: '#000', borderRight: '1px solid #e5eaf0' }}>{b.l}</span>
              <input type="number" placeholder="0" value={form[`target_${b.k}`] || ''} onChange={set(`target_${b.k}`)} style={{ flex: 1, border: 'none', outline: 'none', padding: '9px 8px', fontSize: 13, fontFamily: 'inherit', color: '#000', background: 'transparent', width: 0 }} />
            </div>
          ))}
        </div>
      </FieldRow>

      <FieldRow label="Target Tahunan & Sumber">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#7a8b9a', marginBottom: 6, textTransform: 'uppercase' }}>Target Tahunan (Total)</span>
            <input type="number" value={form.target_tahunan || ''} onChange={set('target_tahunan')} placeholder="0.00" style={baseInput} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#7a8b9a', marginBottom: 6, textTransform: 'uppercase' }}>Sumber Data</span>
            <TextInput value={form.sumber_data} onChange={set('sumber_data')} placeholder="Ketik sumber data..." />
          </div>
        </div>
      </FieldRow>

      <FieldRow label="Satuan">
        <div style={{ maxWidth: 240 }}>
          <SelectInput value={form.satuan} onChange={set('satuan')} placeholder="-Pilih Satuan-" options={SATUAN} />
        </div>
      </FieldRow>

      <FieldRow label="Validitas">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <SelectInput value={form.validitas} onChange={set('validitas')} placeholder="-Pilih Validitas-" options={VALIDITAS} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: '#000', fontWeight: 600 }}>Max</span>
            <input type="number" value={form.nilai_maksimum || ''} onChange={set('nilai_maksimum')} placeholder="Nilai maksimum" style={{...baseInput, flex: 1}} onFocus={focus} onBlur={blur} />
          </div>
        </div>
        {form.validitas && (
          <p style={{ fontSize: 12, color: '#000', marginTop: 6 }}>
            Rentang nilai: Activity 0–100 · Proxy 100–105 · Exact 105–110
          </p>
        )}
      </FieldRow>
    </SectionCard>
  );
}