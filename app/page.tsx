'use client'

import { useState } from 'react'

// ─── ROSTER ──────────────────────────────────────────────────────────────────
const ROSTER = {
  s1: [
    {id:'kw', name:'Kyle Wong',       role:'LEAD', shift:1, pod:'P4'},
    {id:'ah', name:'Alan Ho',         role:'LEAD', shift:1, pod:'P4'},
    {id:'mr', name:'Marcio Ramirez',  role:'DC',   shift:1, pod:'P1'},
    {id:'ta', name:'Togiva Ama',      role:'DC',   shift:1, pod:'P1'},
    {id:'lp', name:'LaQuon Parker',   role:'DC',   shift:1, pod:'P2'},
    {id:'qf', name:'Quincy Freeman',  role:'DC',   shift:1, pod:'P2'},
    {id:'ks', name:'Keyshawn',        role:'DC',   shift:1, pod:'P3'},
    {id:'am', name:'Ashley Miller',   role:'DC',   shift:1, pod:'P3'},
    {id:'ht', name:'Huiying Tan',     role:'DA',   shift:1, pod:null},
    {id:'sw', name:'Sang Woo',        role:'DA',   shift:1, pod:null},
  ],
  s2: [
    {id:'dg',  name:'David Grande',     role:'LEAD', shift:2, pod:'PD'},
    {id:'kn',  name:'Kyria Nelum',      role:'DC',   shift:2, pod:'PA'},
    {id:'eb',  name:'Ethan Baltazar',   role:'DC',   shift:2, pod:'PA'},
    {id:'fl',  name:'Flora Li',         role:'DC',   shift:2, pod:'PB'},
    {id:'ab',  name:'Andrew Bremond',   role:'DC',   shift:2, pod:'PB'},
    {id:'ms',  name:'Michael Soebroto', role:'DC',   shift:2, pod:'PC'},
    {id:'lv',  name:'Lavanya',          role:'DC',   shift:2, pod:'PC'},
    {id:'lf',  name:'Lucca F',          role:'DC',   shift:2, pod:'PD'},
    {id:'tc',  name:'Tracy Corleone',   role:'DA',   shift:2, pod:null},
    {id:'as2', name:'Aarushi Sharma',   role:'DA',   shift:2, pod:null},
  ]
}

// ─── STATION DEFINITIONS ──────────────────────────────────────────────────────
const STATION_INFO: Record<string,{label:string,task:string,dot:string,min:number}> = {
  ymc7: {label:'YMC 7', task:'Tshirt Fold Teleop',  dot:'#a78bfa', min:2},
  ymc1: {label:'YMC 1', task:'Policy Eval (Asana)', dot:'#4f9eff', min:2},
  ymc2: {label:'YMC 2', task:'LEGO Stacking',       dot:'#f59e0b', min:2},
  ymc3: {label:'YMC 3', task:'Tote Stack HITL',     dot:'#2dd4bf', min:2},
  ymc4: {label:'YMC 4', task:'Pill Bottle Ext',     dot:'#f472b6', min:2},
  uc1:  {label:'UMI C1',task:'Pill Bottle Scan',    dot:'#7dd3fc', min:1},
  uc2:  {label:'UMI C2',task:'Fish Picking Demo',   dot:'#86efac', min:1},
  g1:   {label:'G1',    task:'Robot Collection',    dot:'#22c55e', min:2},
}

// ─── DAILY ROTATION TABLES ───────────────────────────────────────────────────
// Each pod rotates to a different station every day.
// After 8 days every pair has touched every station.
// dayIndex = (dayOfYear) % 8  → always deterministic, no DB needed.
//
// 1ST SHIFT ROTATION (pods: P1 P2 P3 P4)
// Block 1 (7:30-9:30) + Block 3 (1:00-3:00) shown per day
// During overlap (10-12) all stations active — pairs assigned to their
// Block 1 station until lunch, then Block 3 station post-lunch.
//
// Format: { P1: [block1_station, block3_station], P2: [...], ... }
const ROTATION_S1: Record<string,{[pod:string]:[string,string]}>= {
  '0': { P1:['ymc7','ymc3'], P2:['ymc1','ymc4'], P3:['ymc2','uc1'],  P4:['g1','g1']  },
  '1': { P1:['ymc1','ymc4'], P2:['ymc2','uc1'],  P3:['g1','g1'],    P4:['ymc7','ymc3'] },
  '2': { P1:['ymc2','uc1'],  P2:['g1','g1'],    P3:['ymc7','ymc3'], P4:['ymc1','ymc4'] },
  '3': { P1:['g1','g1'],    P2:['ymc7','ymc3'], P3:['ymc1','ymc4'], P4:['ymc2','uc1']  },
  '4': { P1:['ymc3','ymc7'], P2:['ymc4','ymc1'], P3:['uc1','ymc2'],  P4:['g1','g1']  },
  '5': { P1:['ymc4','ymc1'], P2:['uc1','ymc2'],  P3:['g1','g1'],    P4:['ymc3','ymc7'] },
  '6': { P1:['uc1','ymc2'],  P2:['g1','g1'],    P3:['ymc3','ymc7'], P4:['ymc4','ymc1'] },
  '7': { P1:['g1','g1'],    P2:['ymc3','ymc7'], P3:['ymc4','ymc1'], P4:['uc1','ymc2']  },
}

// 2ND SHIFT ROTATION (pods: PA PB PC PD)
const ROTATION_S2: Record<string,{[pod:string]:[string,string]}>= {
  '0': { PA:['ymc7','ymc4'], PB:['ymc3','ymc1'], PC:['ymc4','g1'],  PD:['ymc1','ymc7'] },
  '1': { PA:['ymc3','ymc1'], PB:['ymc4','g1'],  PC:['ymc1','ymc7'], PD:['ymc7','ymc4'] },
  '2': { PA:['ymc4','g1'],  PB:['ymc1','ymc7'], PC:['ymc7','ymc4'], PD:['ymc3','ymc1'] },
  '3': { PA:['ymc1','ymc7'], PB:['ymc7','ymc4'], PC:['ymc3','ymc1'], PD:['ymc4','g1']  },
  '4': { PA:['ymc2','uc1'],  PB:['g1','ymc3'],  PC:['uc1','ymc2'],  PD:['g1','ymc4']  },
  '5': { PA:['g1','ymc3'],  PB:['uc1','ymc2'],  PC:['g1','ymc4'],   PD:['ymc2','uc1']  },
  '6': { PA:['uc1','ymc2'],  PB:['g1','ymc4'],  PC:['ymc2','uc1'],  PD:['g1','ymc3']  },
  '7': { PA:['g1','ymc4'],  PB:['ymc2','uc1'],  PC:['g1','ymc3'],   PD:['uc1','ymc2']  },
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getDayIndex(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  return dayOfYear % 8
}

function getDayName(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday:'long', month:'short', day:'numeric'
  })
}

function getTodayAssignments(shift: 1|2) {
  const idx = String(getDayIndex())
  const rotation = shift === 1 ? ROTATION_S1[idx] : ROTATION_S2[idx]
  // Build a map: station_id -> [pairMembers]
  const assignments: Record<string, {members: typeof ROSTER.s1, block: number}[]> = {}

  Object.entries(rotation).forEach(([pod, [block1, block3]]) => {
    const members = ROSTER[`s${shift}` as 's1'|'s2'].filter(m => m.pod === pod)
    ;[block1, block3].forEach((stId, blockIdx) => {
      if (!assignments[stId]) assignments[stId] = []
      assignments[stId].push({ members, block: blockIdx + 1 })
    })
  })
  return assignments
}

const COLORS: Record<string,string[]> = {
  LEAD:['#E6F1FB','#0C447C'],
  DC:  ['#EAF3DE','#3B6D11'],
  DA:  ['#F1EFE8','#5F5E5A'],
}

const BLOCK_TIMES_S1 = ['7:30–9:30 AM', '1:00–3:00 PM']
const BLOCK_TIMES_S2 = ['10:30 AM–12:30 PM', '2:00–4:00 PM + 4:00–6:00 PM']

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [absent,      setAbsent]      = useState<Set<string>>(new Set(['gr']))
  const [shift,       setShift]       = useState<1|2>(1)
  const [tab,         setTab]         = useState<'schedule'|'roster'|'rotation'>('schedule')
  const [selectedUser,setSelectedUser]= useState<string|null>(null)
  const [loggedIn,    setLoggedIn]    = useState(false)

  const pool = ROSTER[`s${shift}` as 's1'|'s2']
  const dayIdx = getDayIndex()
  const rotation = shift === 1 ? ROTATION_S1[String(dayIdx)] : ROTATION_S2[String(dayIdx)]

  const toggle = (id: string) => {
    const next = new Set(absent)
    next.has(id) ? next.delete(id) : next.add(id)
    setAbsent(next)
  }

  const currentUser = selectedUser ? [...ROSTER.s1,...ROSTER.s2].find(m => m.id === selectedUser) : null
  const presentDCs  = pool.filter(m => m.role==='DC' && !absent.has(m.id)).length
  const absentDCs   = pool.filter(m => m.role==='DC' &&  absent.has(m.id)).length

  // Build today's schedule for display
  const todaySchedule = Object.entries(rotation).map(([pod, [block1, block3]]) => {
    const members = pool.filter(m => m.pod === pod && !absent.has(m.id))
    const allPod  = pool.filter(m => m.pod === pod)
    const b1info  = STATION_INFO[block1]
    const b3info  = STATION_INFO[block3]
    return { pod, members, allPod, block1, block3, b1info, b3info }
  })

  // ── LOGIN SCREEN ────────────────────────────────────────────────────────────
  if (!loggedIn) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',
      minHeight:'100vh',flexDirection:'column',fontFamily:'system-ui',
      background:'#f9fafb',padding:'20px'}}>
      <div style={{background:'white',padding:'32px',borderRadius:'16px',
        border:'1px solid #e5e7eb',width:'100%',maxWidth:'380px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'20px'}}>
          <div style={{width:'8px',height:'8px',borderRadius:'50%',
            background:'#22c55e',boxShadow:'0 0 6px #22c55e'}}/>
          <div>
            <div style={{fontSize:'20px',fontWeight:'700'}}>Data Engine</div>
            <div style={{fontSize:'11px',color:'#9ca3af',fontFamily:'monospace'}}>
              {getDayName()} · Day {dayIdx+1} of 8-day rotation
            </div>
          </div>
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
                background:  shift===s ? '#eff6ff'  : 'white',
                color:       shift===s ? '#1d4ed8'  : '#374151'}}>
              {s===1 ? '1st Shift · 7AM' : '2nd Shift · 10AM'}
            </button>
          ))}
        </div>

        <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
          textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>
          Your name
        </div>
        <select value={selectedUser||''} onChange={e => setSelectedUser(e.target.value)}
          style={{width:'100%',padding:'10px 12px',borderRadius:'8px',
            border:'1px solid #e5e7eb',fontSize:'13px',marginBottom:'12px',
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
          Cutoff: {shift===1 ? '6:30 AM' : '9:30 AM'} · Mark absent before this time
        </div>

        <button onClick={() => selectedUser && setLoggedIn(true)}
          disabled={!selectedUser}
          style={{width:'100%',padding:'11px',borderRadius:'8px',
            background: selectedUser ? '#3b82f6' : '#e5e7eb',
            color:      selectedUser ? 'white'   : '#9ca3af',
            border:'none',fontSize:'14px',fontWeight:'600',
            cursor: selectedUser ? 'pointer' : 'default'}}>
          Sign in →
        </button>
      </div>
    </div>
  )

  // ── MAIN APP ────────────────────────────────────────────────────────────────
  return (
    <div style={{fontFamily:'system-ui',background:'#f9fafb',
      minHeight:'100vh',padding:'16px',maxWidth:'860px',margin:'0 auto'}}>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',
        justifyContent:'space-between',marginBottom:'12px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={{width:'8px',height:'8px',borderRadius:'50%',
            background:'#22c55e',boxShadow:'0 0 6px #22c55e'}}/>
          <span style={{fontWeight:'700',fontSize:'15px'}}>Data Engine</span>
          <span style={{fontSize:'11px',color:'#9ca3af',fontFamily:'monospace'}}>
            {getDayName()} · rotation day {dayIdx+1}/8
          </span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <span style={{fontSize:'12px',fontWeight:'500'}}>{currentUser?.name}</span>
          <button onClick={() => setLoggedIn(false)}
            style={{padding:'5px 10px',border:'1px solid #e5e7eb',
              borderRadius:'6px',fontSize:'11px',cursor:'pointer',background:'white'}}>
            sign out
          </button>
        </div>
      </div>

      {/* Shift toggle — leads only */}
      {currentUser?.role === 'LEAD' && (
        <div style={{display:'flex',gap:'6px',marginBottom:'12px'}}>
          {[1,2].map(s => (
            <button key={s} onClick={() => setShift(s as 1|2)}
              style={{padding:'7px 16px',borderRadius:'8px',cursor:'pointer',
                border:'1px solid',fontWeight:'600',fontSize:'12px',
                borderColor: shift===s ? '#3b82f6' : '#e5e7eb',
                background:  shift===s ? '#eff6ff'  : 'white',
                color:       shift===s ? '#1d4ed8'  : '#374151'}}>
              {s===1 ? '1st Shift' : '2nd Shift'}
            </button>
          ))}
        </div>
      )}

      {/* My status — DCs */}
      {currentUser?.role === 'DC' && (
        <div style={{background:'white',borderRadius:'12px',
          border:`1px solid ${absent.has(currentUser.id)?'#fca5a5':'#86efac'}`,
          padding:'14px',marginBottom:'12px'}}>
          <div style={{display:'flex',alignItems:'center',
            justifyContent:'space-between',marginBottom:'10px'}}>
            <div>
              <div style={{fontWeight:'600'}}>{currentUser.name}</div>
              <div style={{fontSize:'11px',color:'#6b7280',fontFamily:'monospace'}}>
                {currentUser.role} · Shift {currentUser.shift} · {currentUser.pod}
              </div>
            </div>
            <span style={{padding:'3px 10px',borderRadius:'99px',fontSize:'10px',
              fontWeight:'700',fontFamily:'monospace',
              background: absent.has(currentUser.id) ? '#fee2e2':'#dcfce7',
              color:      absent.has(currentUser.id) ? '#dc2626':'#16a34a'}}>
              {absent.has(currentUser.id) ? 'ABSENT' : 'PRESENT'}
            </span>
          </div>
          {/* Show today's stations for this DC */}
          {currentUser.pod && rotation[currentUser.pod] && (
            <div style={{display:'flex',gap:'8px',marginBottom:'10px',flexWrap:'wrap'}}>
              {rotation[currentUser.pod].map((stId, bi) => {
                const info = STATION_INFO[stId]
                const times = shift===1 ? BLOCK_TIMES_S1 : BLOCK_TIMES_S2
                return (
                  <div key={bi} style={{flex:1,minWidth:'140px',
                    padding:'8px 12px',borderRadius:'8px',
                    background:'#f9fafb',border:'1px solid #e5e7eb'}}>
                    <div style={{fontSize:'9px',color:'#9ca3af',fontFamily:'monospace',
                      textTransform:'uppercase',marginBottom:'2px'}}>
                      Block {bi+1} · {times[bi]}
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                      <div style={{width:'8px',height:'8px',borderRadius:'50%',
                        background:info.dot,flexShrink:0}}/>
                      <div>
                        <div style={{fontSize:'13px',fontWeight:'700'}}>{info.label}</div>
                        <div style={{fontSize:'10px',color:'#6b7280'}}>{info.task}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <button onClick={() => toggle(currentUser.id)}
            style={{width:'100%',padding:'9px',borderRadius:'8px',
              border:'1px solid',fontWeight:'600',fontSize:'13px',cursor:'pointer',
              borderColor: absent.has(currentUser.id) ? '#86efac':'#fca5a5',
              background:  absent.has(currentUser.id) ? '#f0fdf4':'#fef2f2',
              color:       absent.has(currentUser.id) ? '#16a34a':'#dc2626'}}>
            {absent.has(currentUser.id) ? '↩ Mark myself PRESENT' : 'I will be OUT today'}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div style={{display:'flex',gap:'4px',background:'#f3f4f6',padding:'4px',
        borderRadius:'8px',marginBottom:'12px'}}>
        {(['schedule','roster','rotation'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{flex:1,padding:'7px',borderRadius:'6px',cursor:'pointer',
              fontSize:'11px',fontWeight:'600',textTransform:'uppercase',
              letterSpacing:'0.05em',border:'none',
              background: tab===t ? 'white':'transparent',
              color:      tab===t ? '#111827':'#6b7280'}}>
            {t}
          </button>
        ))}
      </div>

      {/* ── SCHEDULE TAB ──────────────────────────────────────────────────────── */}
      {tab === 'schedule' && (
        <>
          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',
            gap:'8px',marginBottom:'12px'}}>
            {[
              {label:'DCs Present', value:presentDCs, color:'#16a34a'},
              {label:'DCs Absent',  value:absentDCs,  color:absentDCs>0?'#dc2626':'#9ca3af'},
              {label:'Rotation Day',value:`${dayIdx+1}/8`, color:'#7c3aed'},
            ].map(s => (
              <div key={s.label} style={{background:'white',borderRadius:'10px',
                padding:'12px',textAlign:'center',border:'1px solid #e5e7eb'}}>
                <div style={{fontSize:'22px',fontWeight:'700',color:s.color}}>
                  {s.value}
                </div>
                <div style={{fontSize:'10px',color:'#9ca3af',
                  textTransform:'uppercase',letterSpacing:'0.06em',marginTop:'2px'}}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Today's pair assignments */}
          <div style={{background:'white',borderRadius:'12px',
            border:'1px solid #e5e7eb',padding:'16px',marginBottom:'12px'}}>
            <div style={{display:'flex',alignItems:'center',
              justifyContent:'space-between',marginBottom:'14px'}}>
              <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
                textTransform:'uppercase',letterSpacing:'0.08em'}}>
                Today's station assignments · pairs stay 2 hrs per block
              </div>
              <div style={{fontSize:'11px',color:'#7c3aed',fontFamily:'monospace',
                fontWeight:'600'}}>
                Day {dayIdx+1} of 8
              </div>
            </div>

            {todaySchedule.map(({pod, members, allPod, block1, block3, b1info, b3info}) => {
              const absentHere = allPod.filter(m => absent.has(m.id))
              const short = members.length < 2
              const times1 = shift===1 ? BLOCK_TIMES_S1[0] : BLOCK_TIMES_S2[0]
              const times2 = shift===1 ? BLOCK_TIMES_S1[1] : BLOCK_TIMES_S2[1]
              return (
                <div key={pod} style={{padding:'12px 0',
                  borderBottom:'1px solid #f3f4f6'}}>
                  <div style={{display:'flex',alignItems:'center',
                    gap:'8px',marginBottom:'8px'}}>
                    <span style={{fontSize:'11px',fontWeight:'700',
                      fontFamily:'monospace',color:'#6b7280',
                      background:'#f3f4f6',padding:'2px 8px',borderRadius:'4px'}}>
                      {pod}
                    </span>
                    <div style={{display:'flex',gap:'4px'}}>
                      {members.map(m => (
                        <span key={m.id} style={{padding:'3px 8px',
                          borderRadius:'99px',fontSize:'11px',fontWeight:'500',
                          background:'#f0fdf4',color:'#16a34a',
                          border:'1px solid #86efac'}}>
                          {m.name.split(' ')[0]}
                        </span>
                      ))}
                      {absentHere.map(m => (
                        <span key={m.id} style={{padding:'3px 8px',
                          borderRadius:'99px',fontSize:'11px',
                          background:'#fef2f2',color:'#dc2626',
                          border:'1px solid #fca5a5',
                          textDecoration:'line-through',opacity:0.6}}>
                          {m.name.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                    {short && (
                      <span style={{marginLeft:'auto',padding:'2px 8px',
                        borderRadius:'99px',fontSize:'10px',fontWeight:'700',
                        fontFamily:'monospace',background:'#fee2e2',color:'#dc2626'}}>
                        SOLO — reassign
                      </span>
                    )}
                  </div>

                  {/* Two blocks side by side */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>
                    {[[block1,b1info,times1],[block3,b3info,times2]].map(([stId, info, time], bi) => {
                      const st = info as typeof b1info
                      return (
                        <div key={bi as number} style={{padding:'8px 10px',
                          borderRadius:'8px',background:'#fafafa',
                          border:'1px solid #e5e7eb'}}>
                          <div style={{fontSize:'9px',color:'#9ca3af',
                            fontFamily:'monospace',marginBottom:'4px'}}>
                            Block {(bi as number)+1} · {time as string}
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                            <div style={{width:'8px',height:'8px',borderRadius:'50%',
                              background:st.dot,flexShrink:0}}/>
                            <div>
                              <div style={{fontSize:'12px',fontWeight:'700'}}>
                                {st.label}
                              </div>
                              <div style={{fontSize:'10px',color:'#6b7280'}}>
                                {st.task}
                              </div>
                            </div>
                          </div>
                          <div style={{fontSize:'9px',color:'#9ca3af',
                            fontFamily:'monospace',marginTop:'4px'}}>
                            A(0-18m)→B(18-36m) repeating
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* ── ROSTER TAB ────────────────────────────────────────────────────────── */}
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
              <div style={{fontSize:'10px',color:'#9ca3af',textTransform:'uppercase',
                letterSpacing:'0.08em',marginBottom:'6px'}}>{role}s</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                {pool.filter(m => m.role===role).map(m => {
                  const out = absent.has(m.id)
                  const isLead = currentUser?.role === 'LEAD'
                  return (
                    <div key={m.id} onClick={() => isLead && toggle(m.id)}
                      style={{display:'flex',alignItems:'center',gap:'6px',
                        padding:'6px 10px',borderRadius:'8px',
                        border:`1px solid ${out?'#fca5a5':'#e5e7eb'}`,
                        background: out?'#fef2f2':'#f9fafb',
                        cursor: isLead?'pointer':'default'}}>
                      <div style={{width:'24px',height:'24px',borderRadius:'50%',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:'9px',fontWeight:'700',
                        background:COLORS[role][0],color:COLORS[role][1]}}>
                        {m.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div style={{fontSize:'12px',fontWeight:'600',
                          textDecoration:out?'line-through':'none',
                          opacity:out?0.5:1}}>
                          {m.name}
                        </div>
                        <div style={{fontSize:'10px',color:'#9ca3af'}}>
                          {m.pod||role}
                        </div>
                      </div>
                      <span style={{padding:'2px 6px',borderRadius:'99px',
                        fontSize:'9px',fontWeight:'700',fontFamily:'monospace',
                        background:out?'#fee2e2':'#dcfce7',
                        color:out?'#dc2626':'#16a34a',marginLeft:'4px'}}>
                        {out?'OUT':'IN'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ROTATION TAB ──────────────────────────────────────────────────────── */}
      {tab === 'rotation' && (
        <div>
          <div style={{background:'white',borderRadius:'12px',
            border:'1px solid #e5e7eb',padding:'16px',marginBottom:'12px'}}>
            <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
              textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'4px'}}>
              8-day station rotation · Shift {shift}
            </div>
            <div style={{fontSize:'12px',color:'#6b7280',marginBottom:'14px'}}>
              Every pair visits every station within 8 working days.
              Rotation advances automatically each day — no manual updates needed.
            </div>

            {/* Rotation grid */}
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',
                fontSize:'11px',fontFamily:'monospace'}}>
                <thead>
                  <tr style={{background:'#f9fafb'}}>
                    <th style={{padding:'8px',textAlign:'left',
                      border:'1px solid #e5e7eb',color:'#6b7280'}}>Day</th>
                    {(shift===1
                      ? ['P1\nMarcio+Togiva','P2\nLaQuon+Quincy','P3\nKeyshawn+Ashley','P4\nKyle+Alan']
                      : ['PA\nKyria+Ethan','PB\nFlora+Andrew','PC\nMichael+Lavanya','PD\nDavid+Lucca']
                    ).map((h,i) => (
                      <th key={i} style={{padding:'8px',textAlign:'center',
                        border:'1px solid #e5e7eb',color:'#374151',
                        whiteSpace:'pre-line',lineHeight:1.4}}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({length:8},(_,i) => {
                    const rot = shift===1 ? ROTATION_S1[String(i)] : ROTATION_S2[String(i)]
                    const pods = shift===1 ? ['P1','P2','P3','P4'] : ['PA','PB','PC','PD']
                    const isToday = i === dayIdx
                    return (
                      <tr key={i} style={{
                        background: isToday ? '#eff6ff' : i%2===0 ? '#ffffff':'#f9fafb'
                      }}>
                        <td style={{padding:'8px',border:'1px solid #e5e7eb',
                          fontWeight: isToday ? '700':'400',
                          color: isToday ? '#1d4ed8':'#374151'}}>
                          Day {i+1} {isToday ? '← today':''}
                        </td>
                        {pods.map(pod => {
                          const [b1,b3] = rot[pod]
                          const i1 = STATION_INFO[b1]
                          const i3 = STATION_INFO[b3]
                          return (
                            <td key={pod} style={{padding:'6px 8px',
                              border:'1px solid #e5e7eb',textAlign:'center'}}>
                              <div style={{display:'flex',flexDirection:'column',gap:'3px'}}>
                                <span style={{padding:'2px 6px',borderRadius:'4px',
                                  background:`${i1.dot}22`,color:i1.dot,
                                  fontWeight:'600',fontSize:'10px'}}>
                                  {i1.label}
                                </span>
                                <span style={{fontSize:'9px',color:'#9ca3af'}}>→</span>
                                <span style={{padding:'2px 6px',borderRadius:'4px',
                                  background:`${i3.dot}22`,color:i3.dot,
                                  fontWeight:'600',fontSize:'10px'}}>
                                  {i3.label}
                                </span>
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{padding:'12px 16px',background:'#eff6ff',borderRadius:'10px',
            border:'1px solid #bfdbfe',fontSize:'12px',color:'#1e40af'}}>
            <strong>How it works:</strong> The app checks today's date and automatically
            assigns each pair to their station for the day. No one needs to update anything —
            it advances on its own every midnight. After 8 days every pair has worked
            every station at least once.
          </div>
        </div>
      )}
    </div>
  )
}
