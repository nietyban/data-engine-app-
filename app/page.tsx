'use client'

import { useState } from 'react'

const ROSTER = {
  s1: [
    {id:'kw',name:'Kyle Wong',role:'LEAD',shift:1,pod:'P4'},
    {id:'ah',name:'Alan Ho',role:'LEAD',shift:1,pod:'P4'},
    {id:'mr',name:'Marcio Ramirez',role:'DC',shift:1,pod:'P1'},
    {id:'ta',name:'Togiva Ama',role:'DC',shift:1,pod:'P1'},
    {id:'lp',name:'LaQuon Parker',role:'DC',shift:1,pod:'P2'},
    {id:'qf',name:'Quincy Freeman',role:'DC',shift:1,pod:'P2'},
    {id:'ks',name:'Keyshawn',role:'DC',shift:1,pod:'P3'},
    {id:'am',name:'Ashley Miller',role:'DC',shift:1,pod:'P3'},
    {id:'ht',name:'Huiying Tan',role:'DA',shift:1,pod:null},
    {id:'sw',name:'Sang Woo',role:'DA',shift:1,pod:null},
  ],
  s2: [
    {id:'dg',name:'David Grande',role:'LEAD',shift:2,pod:'PD'},
    {id:'kn',name:'Kyria Nelum',role:'DC',shift:2,pod:'PA'},
    {id:'eb',name:'Ethan Baltazar',role:'DC',shift:2,pod:'PA'},
    {id:'fl',name:'Flora Li',role:'DC',shift:2,pod:'PB'},
    {id:'ab',name:'Andrew Bremond',role:'DC',shift:2,pod:'PB'},
    {id:'ms',name:'Michael Soebroto',role:'DC',shift:2,pod:'PC'},
    {id:'lv',name:'Lavanya',role:'DC',shift:2,pod:'PC'},
    {id:'lf',name:'Lucca F',role:'DC',shift:2,pod:'PD'},
    {id:'tc',name:'Tracy Corleone',role:'DA',shift:2,pod:null},
    {id:'as2',name:'Aarushi Sharma',role:'DA',shift:2,pod:null},
  ]
}

const STATIONS = {
  s1: [
    {id:'ymc7',label:'YMC 7',task:'Tshirt Fold Teleop',pods:['P1','P2'],min:2},
    {id:'ymc1',label:'YMC 1',task:'Policy Eval',pods:['P4','P2'],min:2},
    {id:'ymc2',label:'YMC 2',task:'LEGO Stacking',pods:['P3','P1'],min:2},
    {id:'ymc3',label:'YMC 3',task:'Tote Stack HITL',pods:['P2','P4'],min:2},
    {id:'ymc4',label:'YMC 4',task:'Pill Bottle Ext',pods:['P4','P3'],min:2},
    {id:'uc1',label:'UMI C1',task:'Pill Bottle Scan',pods:['P3'],min:1},
    {id:'uc2',label:'UMI C2',task:'Fish Picking',pods:['P2'],min:1},
    {id:'g1',label:'G1',task:'Robot Collection',pods:['P4','P3'],min:2},
  ],
  s2: [
    {id:'ymc7',label:'YMC 7',task:'Tshirt Fold Teleop',pods:['PA','PB'],min:2},
    {id:'ymc1',label:'YMC 1',task:'Policy Eval',pods:['PD','PC'],min:2},
    {id:'ymc2',label:'YMC 2',task:'LEGO Stacking',pods:['PB','PA'],min:2},
    {id:'ymc3',label:'YMC 3',task:'Tote Stack HITL',pods:['PB','PA'],min:2},
    {id:'ymc4',label:'YMC 4',task:'Pill Bottle Ext',pods:['PC','PD'],min:2},
    {id:'uc1',label:'UMI C1',task:'Pill Bottle Scan',pods:['PA'],min:1},
    {id:'uc2',label:'UMI C2',task:'Fish Picking',pods:['PB'],min:1},
    {id:'g1',label:'G1',task:'Robot Collection',pods:['PD','PC'],min:2},
  ]
}

const COLORS: Record<string,string[]> = {
  LEAD:['#E6F1FB','#0C447C'],
  DC:['#EAF3DE','#3B6D11'],
  DA:['#F1EFE8','#5F5E5A'],
}

export default function Home() {
  const [absent, setAbsent] = useState<Set<string>>(new Set(['gr']))
  const [shift, setShift] = useState<1|2>(1)
  const [tab, setTab] = useState<'schedule'|'roster'>('schedule')
  const [selectedUser, setSelectedUser] = useState<string|null>(null)
  const [loggedIn, setLoggedIn] = useState(false)

  const pool = ROSTER[`s${shift}` as 's1'|'s2']
  const stations = STATIONS[`s${shift}` as 's1'|'s2']

  const getPresent = (pod: string) =>
    pool.filter(m => m.pod === pod && !absent.has(m.id))

  const toggle = (id: string) => {
    const next = new Set(absent)
    next.has(id) ? next.delete(id) : next.add(id)
    setAbsent(next)
  }

  const presentDCs = pool.filter(m => m.role==='DC' && !absent.has(m.id)).length
  const absentDCs  = pool.filter(m => m.role==='DC' &&  absent.has(m.id)).length
  const alerts     = stations.filter(st =>
    st.pods.reduce((a,p) => a + getPresent(p).length, 0) < st.min
  )

  const currentUser = selectedUser ? pool.find(m => m.id === selectedUser) : null

  if (!loggedIn) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',
      minHeight:'100vh',flexDirection:'column',gap:'16px',
      fontFamily:'system-ui',background:'#f9fafb',padding:'20px'}}>
      <div style={{background:'white',padding:'32px',borderRadius:'16px',
        border:'1px solid #e5e7eb',width:'100%',maxWidth:'380px'}}>
        <div style={{fontSize:'22px',fontWeight:'700',marginBottom:'4px'}}>
          Data Engine
        </div>
        <div style={{fontSize:'13px',color:'#6b7280',marginBottom:'24px',
          fontFamily:'monospace'}}>
          real-time shift scheduler
        </div>
        <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
          textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>
          Select your shift
        </div>
        <div style={{display:'flex',gap:'8px',marginBottom:'16px'}}>
          {[1,2].map(s => (
            <button key={s} onClick={() => setShift(s as 1|2)}
              style={{flex:1,padding:'10px',borderRadius:'8px',cursor:'pointer',
                border:'1px solid',fontWeight:'600',fontSize:'13px',
                borderColor: shift===s ? '#3b82f6' : '#e5e7eb',
                background: shift===s ? '#eff6ff' : 'white',
                color: shift===s ? '#1d4ed8' : '#374151'}}>
              {s===1 ? '1st Shift\n7AM' : '2nd Shift\n10AM'}
            </button>
          ))}
        </div>
        <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
          textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>
          Your name
        </div>
        <select value={selectedUser||''} onChange={e => setSelectedUser(e.target.value)}
          style={{width:'100%',padding:'10px 12px',borderRadius:'8px',
            border:'1px solid #e5e7eb',fontSize:'13px',marginBottom:'16px',
            background:'white',cursor:'pointer'}}>
          <option value=''>— select your name —</option>
          {ROSTER[`s${shift}` as 's1'|'s2'].map(p => (
            <option key={p.id} value={p.id}>
              {p.name} · {p.role}{p.pod ? ' · '+p.pod : ''}
            </option>
          ))}
        </select>
        <div style={{padding:'10px 14px',background:'#fffbeb',borderRadius:'8px',
          border:'1px solid #fde68a',fontSize:'12px',color:'#92400e',
          fontFamily:'monospace',marginBottom:'16px'}}>
          Cutoff: {shift===1 ? '6:30 AM' : '9:30 AM'} — mark absent before this time
        </div>
        <button onClick={() => selectedUser && setLoggedIn(true)}
          disabled={!selectedUser}
          style={{width:'100%',padding:'11px',borderRadius:'8px',
            background: selectedUser ? '#3b82f6' : '#e5e7eb',
            color: selectedUser ? 'white' : '#9ca3af',
            border:'none',fontSize:'14px',fontWeight:'600',
            cursor: selectedUser ? 'pointer' : 'default'}}>
          Sign in →
        </button>
      </div>
    </div>
  )

  return (
    <div style={{fontFamily:'system-ui',background:'#f9fafb',
      minHeight:'100vh',padding:'16px',maxWidth:'800px',margin:'0 auto'}}>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',
        justifyContent:'space-between',marginBottom:'16px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={{width:'8px',height:'8px',borderRadius:'50%',
            background:'#22c55e',boxShadow:'0 0 6px #22c55e'}}/>
          <span style={{fontWeight:'700',fontSize:'16px'}}>Data Engine</span>
          <span style={{fontSize:'11px',color:'#9ca3af',fontFamily:'monospace'}}>
            live
          </span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <span style={{fontSize:'13px',fontWeight:'500'}}>
            {currentUser?.name}
          </span>
          <button onClick={() => setLoggedIn(false)}
            style={{padding:'5px 10px',border:'1px solid #e5e7eb',
              borderRadius:'6px',fontSize:'12px',cursor:'pointer',
              background:'white'}}>
            sign out
          </button>
        </div>
      </div>

      {/* Shift toggle — leads only */}
      {currentUser?.role === 'LEAD' && (
        <div style={{display:'flex',gap:'6px',marginBottom:'14px'}}>
          {[1,2].map(s => (
            <button key={s} onClick={() => setShift(s as 1|2)}
              style={{padding:'7px 16px',borderRadius:'8px',cursor:'pointer',
                border:'1px solid',fontWeight:'600',fontSize:'12px',
                borderColor: shift===s ? '#3b82f6' : '#e5e7eb',
                background: shift===s ? '#eff6ff' : 'white',
                color: shift===s ? '#1d4ed8' : '#374151'}}>
              {s===1 ? '1st Shift' : '2nd Shift'}
            </button>
          ))}
        </div>
      )}

      {/* My status — DCs only */}
      {currentUser?.role === 'DC' && (
        <div style={{background:'white',borderRadius:'12px',
          border:`1px solid ${absent.has(currentUser.id) ? '#fca5a5' : '#86efac'}`,
          padding:'16px',marginBottom:'12px'}}>
          <div style={{display:'flex',alignItems:'center',
            justifyContent:'space-between',marginBottom:'12px'}}>
            <div>
              <div style={{fontWeight:'600'}}>{currentUser.name}</div>
              <div style={{fontSize:'12px',color:'#6b7280',fontFamily:'monospace'}}>
                {currentUser.role} · Shift {currentUser.shift} · {currentUser.pod}
              </div>
            </div>
            <span style={{padding:'3px 10px',borderRadius:'99px',fontSize:'11px',
              fontWeight:'700',fontFamily:'monospace',
              background: absent.has(currentUser.id) ? '#fee2e2' : '#dcfce7',
              color: absent.has(currentUser.id) ? '#dc2626' : '#16a34a'}}>
              {absent.has(currentUser.id) ? 'ABSENT' : 'PRESENT'}
            </span>
          </div>
          <button onClick={() => toggle(currentUser.id)}
            style={{width:'100%',padding:'10px',borderRadius:'8px',
              border:'1px solid',fontWeight:'600',fontSize:'13px',cursor:'pointer',
              borderColor: absent.has(currentUser.id) ? '#86efac' : '#fca5a5',
              background: absent.has(currentUser.id) ? '#f0fdf4' : '#fef2f2',
              color: absent.has(currentUser.id) ? '#16a34a' : '#dc2626'}}>
            {absent.has(currentUser.id)
              ? '↩ Mark myself PRESENT'
              : 'I will be OUT today'}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{display:'flex',gap:'4px',background:'#f3f4f6',padding:'4px',
        borderRadius:'8px',marginBottom:'14px'}}>
        {(['schedule','roster'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{flex:1,padding:'7px',borderRadius:'6px',cursor:'pointer',
              fontSize:'11px',fontWeight:'600',textTransform:'uppercase',
              letterSpacing:'0.05em',border:'none',
              background: tab===t ? 'white' : 'transparent',
              color: tab===t ? '#111827' : '#6b7280'}}>
            {t}
          </button>
        ))}
      </div>

      {/* Schedule tab */}
      {tab === 'schedule' && (
        <>
          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',
            gap:'8px',marginBottom:'12px'}}>
            {[
              {label:'Present',value:presentDCs,color:'#16a34a'},
              {label:'Absent', value:absentDCs, color: absentDCs>0?'#dc2626':'#9ca3af'},
              {label:'Stations',value:stations.length,color:'#2563eb'},
            ].map(s => (
              <div key={s.label} style={{background:'white',borderRadius:'10px',
                padding:'12px',textAlign:'center',border:'1px solid #e5e7eb'}}>
                <div style={{fontSize:'26px',fontWeight:'700',color:s.color}}>
                  {s.value}
                </div>
                <div style={{fontSize:'10px',color:'#9ca3af',
                  textTransform:'uppercase',letterSpacing:'0.06em',marginTop:'2px'}}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Alerts */}
          {alerts.length === 0
            ? <div style={{padding:'10px 14px',background:'#f0fdf4',
                borderRadius:'8px',border:'1px solid #86efac',fontSize:'12px',
                color:'#16a34a',fontFamily:'monospace',marginBottom:'12px'}}>
                ✓ All stations staffed — no action needed
              </div>
            : alerts.map(st => (
                <div key={st.id} style={{padding:'10px 14px',background:'#fef2f2',
                  borderRadius:'8px',border:'1px solid #fca5a5',fontSize:'12px',
                  color:'#dc2626',fontFamily:'monospace',marginBottom:'6px'}}>
                  ⚠ {st.label} ({st.task}) — understaffed. Lead: reassign.
                </div>
              ))
          }

          {/* Station grid */}
          <div style={{background:'white',borderRadius:'12px',
            border:'1px solid #e5e7eb',padding:'16px'}}>
            <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
              textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'12px'}}>
              Live assignments · 18-min sessions · 2-hr blocks
            </div>
            {stations.map(st => {
              const members = st.pods.flatMap(pod => getPresent(pod))
              const short = members.length < st.min
              return (
                <div key={st.id} style={{display:'grid',
                  gridTemplateColumns:'150px 1fr 44px',gap:'8px',
                  alignItems:'center',padding:'8px 0',
                  borderBottom:'1px solid #f3f4f6'}}>
                  <div>
                    <div style={{fontSize:'12px',fontWeight:'600'}}>
                      {st.label}
                    </div>
                    <div style={{fontSize:'10px',color:'#9ca3af',marginTop:'1px'}}>
                      {st.task}
                    </div>
                  </div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'4px'}}>
                    {members.length
                      ? members.map(m => (
                          <span key={m.id} style={{padding:'3px 8px',
                            borderRadius:'99px',fontSize:'11px',
                            background:'#f0fdf4',color:'#16a34a',
                            border:'1px solid #86efac'}}>
                            {m.name.split(' ')[0]}
                          </span>
                        ))
                      : <span style={{fontSize:'11px',color:'#dc2626',
                          fontStyle:'italic'}}>
                          unassigned
                        </span>
                    }
                  </div>
                  <div style={{textAlign:'right'}}>
                    <span style={{padding:'2px 8px',borderRadius:'99px',
                      fontSize:'10px',fontWeight:'700',fontFamily:'monospace',
                      background: short ? '#fee2e2' : '#dcfce7',
                      color: short ? '#dc2626' : '#16a34a'}}>
                      {short ? 'LOW' : 'OK'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Roster tab */}
      {tab === 'roster' && (
        <div style={{background:'white',borderRadius:'12px',
          border:'1px solid #e5e7eb',padding:'16px'}}>
          <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
            textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'12px'}}>
            Shift {shift} roster
            {currentUser?.role==='LEAD' && ' · tap to toggle absence'}
          </div>
          {(['LEAD','DC','DA'] as const).map(role => (
            <div key={role} style={{marginBottom:'14px'}}>
              <div style={{fontSize:'10px',color:'#9ca3af',
                textTransform:'uppercase',letterSpacing:'0.08em',
                marginBottom:'6px'}}>{role}s</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                {pool.filter(m => m.role===role).map(m => {
                  const out = absent.has(m.id)
                  const isLead = currentUser?.role === 'LEAD'
                  return (
                    <div key={m.id}
                      onClick={() => isLead && toggle(m.id)}
                      style={{display:'flex',alignItems:'center',gap:'6px',
                        padding:'6px 10px',borderRadius:'8px',
                        border:`1px solid ${out ? '#fca5a5' : '#e5e7eb'}`,
                        background: out ? '#fef2f2' : '#f9fafb',
                        cursor: isLead ? 'pointer' : 'default'}}>
                      <div style={{width:'24px',height:'24px',borderRadius:'50%',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:'9px',fontWeight:'700',
                        background: COLORS[role][0],
                        color: COLORS[role][1]}}>
                        {m.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div style={{fontSize:'12px',fontWeight:'600',
                          textDecoration: out ? 'line-through' : 'none',
                          opacity: out ? 0.5 : 1}}>
                          {m.name}
                        </div>
                        <div style={{fontSize:'10px',color:'#9ca3af'}}>
                          {m.pod || role}
                        </div>
                      </div>
                      <span style={{padding:'2px 6px',borderRadius:'99px',
                        fontSize:'9px',fontWeight:'700',fontFamily:'monospace',
                        background: out ? '#fee2e2' : '#dcfce7',
                        color: out ? '#dc2626' : '#16a34a',marginLeft:'4px'}}>
                        {out ? 'OUT' : 'IN'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
