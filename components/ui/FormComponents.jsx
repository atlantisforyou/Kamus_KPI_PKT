'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const BSC = ['Financial', 'Customer', 'Internal Process', 'Learning & Growth'];
const TIPE = ['Leading', 'Lagging'];
const JENIS = ['Average', 'Sum', 'Take Last Known'];
const POLARITAS = ['Maximize', 'Minimize'];
const FREKUENSI = ['Monthly', 'Quarterly', 'Half Yearly', 'Yearly'];
const SATUAN = ['%', 'Rp', 'Unit', 'Orang', 'Hari', 'Jam', 'Kali', 'Dokumen', 'Lainnya'];
const VALIDITAS = [{ v: 'Activity', l: 'Activity (0 - 100)' }, { v: 'Proxy', l: 'Proxy (100 - 105)' }, { v: 'Exact', l: 'Exact (105 - 110)' }];
const BULAN = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agt', 'sep', 'okt', 'nov', 'des'].map(k => ({ k, l: k.toUpperCase() }));

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
    <option value="">- Kosongkan -</option>
    {options.map(o => <option key={o.v || o} value={o.v || o}>{o.l || o}</option>)}
  </select>
);

// KOMPONEN AUTOCOMPLETE SASARAN KHUSUS
export function AutocompleteSasaran({ value, onChange }) {
  const [query, setQuery] = useState(value || '');
  const [pilihan, setPilihan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bukaDropdown, setBukaDropdown] = useState(false);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  const handleKetik = async (e) => {
    const teks = e.target.value;
    setQuery(teks);
    onChange(teks);

    if (teks.length >= 3) {
      setLoading(true);
      try {
        const res = await fetch(`/api/kamus?type=sasaran&q=${encodeURIComponent(teks)}`);
        const data = await res.json();
        setPilihan(data);
        setBukaDropdown(true);
      } catch (error) {
        console.error("Gagal cari sasaran:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setBukaDropdown(false);
      setPilihan([]);
    }
  };

  const handlePilih = (teksSasaran) => {
    setQuery(teksSasaran);
    onChange(teksSasaran);
    setBukaDropdown(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={query}
        onChange={handleKetik}
        placeholder="Ketik untuk mencari sasaran strategis..."
        style={baseInput}
        onFocus={(e) => {
          focus(e);
          if (query.length >= 3 && pilihan.length > 0) setBukaDropdown(true);
        }}
        onBlur={(e) => {
          blur(e);
          setBukaDropdown(false);
        }}
      />
      
      {loading && <div style={{ position: 'absolute', right: 14, top: 12, fontSize: 12, color: '#7a8b9a' }}>Mencari...</div>}

      {bukaDropdown && pilihan.length > 0 && (
      <ul style={{
            position: 'absolute', zIndex: 50, width: '100%', background: '#fff', 
            border: '1.5px solid #e5eaf0', borderRadius: 8, marginTop: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: 250, overflowY: 'auto',
            listStyle: 'none', padding: 0
          }}>
          {pilihan.map((item, index) => (
            <li 
              key={item.id ? item.id : `sasaran-${index}`} 
              onMouseDown={() => handlePilih(item.sasaran)}
              style={{ padding: '10px 14px', borderBottom: '1px solid #f0f4f8', cursor: 'pointer', fontSize: 13 }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
            >
              <div style={{ fontWeight: 700, color: '#3b7dd8', marginBottom: 4, fontSize: 11, textTransform: 'uppercase' }}>
                {item.bidang}
              </div>
              <div style={{ color: '#374151', lineHeight: 1.4 }}>{item.sasaran}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function RichTextEditor({ value, onChange, placeholder }) {
  return (
    <div style={{ border: '1.5px solid #e5eaf0', borderRadius: 8, overflow: 'hidden' }}>
      <Editor
        tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@7/tinymce.min.js"
        
        licenseKey="gpl"
        
        value={value || ''}
        onEditorChange={(content) => onChange({ target: { value: content } })}
        init={{
          height: 350,
          menubar: 'file edit view insert format tools table help',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'table | removeformat | help',
          content_style: 'body { font-family: "Plus Jakarta Sans", Helvetica, Arial, sans-serif; font-size:14px; }',
          placeholder: placeholder || "Ketik teks, masukkan tabel, atau formula di sini..."
        }}
      />
    </div>
  );
}

// KOMPONEN AUTOCOMPLETE NAMA KPI KHUSUS (AUTO-FILL) DARI ACUAN VP
export function AutocompleteNamaKPI({ value, onChange, onAutoFill }) {
  const [query, setQuery] = useState(value || '');
  const [pilihan, setPilihan] = useState([]);
  const [bukaDropdown, setBukaDropdown] = useState(false);
  const [masterData, setMasterData] = useState([]);

  useEffect(() => {
    const fetchMaster = async () => {
      try {
        const currentYear = new Date().getFullYear().toString();
        const res = await fetch(`/api/kamus?type=acuan_vp`);
        
        const responseJson = await res.json();
        setMasterData(responseJson.data || []); 
      } catch (error) {
        console.error("Gagal load master KPI dari VP:", error);
      }
    };
    fetchMaster();
  }, []);

  const handleKetik = (e) => {
    const teks = e.target.value;
    setQuery(teks);
    onChange(e);
    if (teks.length >= 2) {
      const filter = masterData.filter(kpi => 
        kpi.nama_kpi && kpi.nama_kpi.toLowerCase().includes(teks.toLowerCase())
      );
      setPilihan(filter);
      setBukaDropdown(true);
    } else {
      setBukaDropdown(false);
    }
  };

  const handlePilih = (kpiData) => {
    setQuery(kpiData.nama_kpi);
    setBukaDropdown(false);
    
    onChange({ target: { value: kpiData.nama_kpi } });
    
    if (onAutoFill) {
      onAutoFill(kpiData);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={query}
        onChange={handleKetik}
        placeholder="Cari referensi KPI dari VP, atau ketik baru..."
        style={baseInput}
        onFocus={(e) => {
          focus(e);
          if (query.length >= 2 && pilihan.length > 0) {
              setBukaDropdown(true);
          } else if (query.length === 0 && masterData.length > 0) {
              setPilihan(masterData);
              setBukaDropdown(true);
          }
        }}
        onBlur={(e) => {
          blur(e);
          setTimeout(() => setBukaDropdown(false), 200); 
        }}
      />
      {bukaDropdown && pilihan.length > 0 && (
        <ul style={{
          position: 'absolute', zIndex: 50, width: '100%', background: '#fff',
          border: '1.5px solid #e5eaf0', borderRadius: 8, marginTop: 4,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: 250, overflowY: 'auto',
          listStyle: 'none', padding: 0
        }}>
          {pilihan.map((item, idx) => (
            <li
              key={idx}
              onMouseDown={() => handlePilih(item)}
              style={{ padding: '10px 14px', borderBottom: '1px solid #f0f4f8', cursor: 'pointer', fontSize: 13 }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
            >
              <div style={{ color: '#374151', fontWeight: 600 }}>{item.nama_kpi}</div>
              <div style={{ fontSize: 11, color: '#7a8b9a', marginTop: 2 }}>
                Acuan dari: {item.pembuat_nama}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// FORM INFORMASI DASAR
export function InformasiDasarForm({ form, set, handleAutoFill }) {
  return (
    <SectionCard title="Informasi Dasar & Strategis">
      <FieldRow label="Perspektif Balanced Scorecard" req>
        <SelectInput value={form.perspektif_bsc} onChange={set('perspektif_bsc')} placeholder="Pilih Perspektif..." options={BSC} />
      </FieldRow>
      
      <FieldRow label="Sasaran Strategis">
        <AutocompleteSasaran value={form.sasaran_strategis} onChange={set('sasaran_strategis')} />
      </FieldRow>
      
      <FieldRow label="Nama KPI" req>
          <AutocompleteNamaKPI 
            value={form.nama_kpi} 
            onChange={set('nama_kpi')} 
            onAutoFill={handleAutoFill}
          />
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

// KOMPONEN FORMULA BUILDER BERBASIS BLOK/CHIP
export function FormulaInput({ value, onChange, placeholder }) {
  const [angka, setAngka] = useState('');

  const tokens = value ? value.split(' ').filter(t => t.trim() !== '') : [];

  const handleAdd = (token) => {
    const newTokens = [...tokens, token];
    onChange({ target: { value: newTokens.join(' ') } });
  };

  const handleRemove = (index) => {
    const newTokens = tokens.filter((_, i) => i !== index);
    onChange({ target: { value: newTokens.join(' ') } });
  };

  const handleAngkaSubmit = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (angka.trim()) {
        handleAdd(angka.trim());
        setAngka('');
      }
    } 
    else if (e.key === 'Backspace' && angka === '' && tokens.length > 0) {
      handleRemove(tokens.length - 1);
    }
  };

  const isOperator = (t) => ['+', '-', '*', '/', '(', ')'].includes(t);
  const isVariable = (t) => ['Aktual', 'Target', 'Bobot', 'Realisasi'].includes(t);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      
      <div 
        style={{
          ...baseInput,
          minHeight: '52px',
          height: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px'
        }}
        onClick={() => document.getElementById('formula-angka-input').focus()}
      >
        {tokens.length === 0 && !angka && (
          <span style={{ color: '#9ca3af', fontSize: 14 }}>{placeholder || 'Mulai susun formula dari tombol di bawah...'}</span>
        )}
        
        {tokens.map((token, idx) => (
          <div
            key={idx}
            onClick={(e) => { e.stopPropagation(); handleRemove(idx); }}
            title="Klik untuk menghapus"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isVariable(token) ? '#eff6ff' : isOperator(token) ? '#f3f4f6' : '#ecfdf5',
              color: isVariable(token) ? '#3b7dd8' : isOperator(token) ? '#374151' : '#059669',
              border: `1px solid ${isVariable(token) ? '#bfdbfe' : isOperator(token) ? '#d1d5db' : '#a7f3d0'}`,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = 0.8}
            onMouseOut={(e) => e.currentTarget.style.opacity = 1}
          >
            {token}
            <span style={{ fontSize: '10px', opacity: 0.5 }}>✕</span>
          </div>
        ))}
        
        <input
          id="formula-angka-input"
          type="text"
          value={angka}
          onChange={(e) => setAngka(e.target.value)}
          onKeyDown={handleAngkaSubmit}
          placeholder={tokens.length > 0 ? "" : "atau ketik angka..."}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            flex: 1,
            minWidth: '100px',
            fontSize: '14px',
            color: '#000',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div style={{ 
        display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '12px', 
        background: '#f8fafc', borderRadius: '8px', border: '1.5px solid #e5eaf0',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#7a8b9a', marginRight: 4 }}>Variabel:</span>
          {['Aktual', 'Target', 'Bobot', 'Realisasi'].map(v => (
            <button
              key={v}
              onClick={(e) => { e.preventDefault(); handleAdd(v); }}
              style={{ padding: '6px 12px', background: '#eff6ff', color: '#3b7dd8', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >{v}</button>
          ))}
        </div>

        <div style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px' }} />

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#7a8b9a', marginRight: 4 }}>Operator:</span>
          {['+', '-', '*', '/', '(', ')'].map(o => (
            <button
              key={o}
              onClick={(e) => { e.preventDefault(); handleAdd(o); }}
              style={{ padding: '6px 12px', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
            >{o}</button>
          ))}
        </div>
        
        <button
          onClick={(e) => { e.preventDefault(); onChange({ target: { value: '' } }); setAngka(''); }}
          style={{ padding: '6px 12px', background: '#fff5f5', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginLeft: 'auto' }}
        >
          Bersihkan
        </button>
      </div>

      <p style={{fontSize: '12px', color: '#7a8b9a', marginTop: '-4px'}}>
        *Klik tombol variabel/operator untuk menyusun formula. Ketik angka di dalam kotak lalu tekan <b>Enter</b> atau <b>Spasi</b>. Klik pada blok untuk menghapusnya.
      </p>
    </div>
  );
}

// FORM KARAKTERISTIK KPI
export function KarakteristikKPIForm({ form, set }) {
  return (
    <SectionCard title="Karakteristik KPI">
      <FieldRow label="Tipe KPI">
        <SelectInput value={form.tipe_kpi} onChange={set('tipe_kpi')} placeholder="Pilih Tipe..." options={TIPE} />
      </FieldRow>
      <FieldRow label="Formula Penilaian">
        <RichTextEditor 
          value={form.formula_penilaian} 
          onChange={set('formula_penilaian')} 
          placeholder="Ketik formula penilaian, masukkan tabel, atau format teks di sini..." 
        />
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

// FORM TARGET & VALIDASI
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
            <input type="number" value={form.target_tahunan || ''} readOnly={true} placeholder="0.00" style={baseInput} onFocus={focus} onBlur={blur} />
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