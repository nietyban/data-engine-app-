'use client'

import { useState, useEffect } from 'react'

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

const STATION_INFO: Record<string,{label:string,task:string,dot:string}> = {
  ymc7: {label:'YMC 7', task:'Tshirt Fold Teleop',  dot:'#a78bfa'},
  ymc1: {label:'YMC 1', task:'Policy Eval (Asana)', dot:'#4f9eff'},
  ymc2: {label:'YMC 2', task:'LEGO Stacking',       dot:'#f59e0b'},
  ymc3: {label:'YMC 3', task:'Tote Stack HITL',     dot:'#2dd4bf'},
  ymc4: {label:'YMC 4', task:'Pill Bottle Ext',     dot:'#f472b6'},
  uc1:  {label:'UMI C1',task:'Pill Bottle Scan',    dot:'#7dd3fc'},
  uc2:  {label:'UMI C2',task:'Fish Picking Demo',   dot:'#86efac'},
  g1:   {label:'G1',    task:'Robot Collection',    dot:'#22c55e'},
}

// ─── 1ST SHIFT SCHEDULE ───────────────────────────────────────────────────────
// 7:00–9:00   BLOCK 1 (2 hrs) — all pairs
// 9:00–11:00  BLOCK 2 (2 hrs) — all pairs
// 11:00–12:00 LUNCH A (P1+P4/Kyle) out | P2+P3 cover Station C
// 12:00–1:00  LUNCH B (P2+P3/Alan) out | P1+P4 cover Station C
// 1:00–3:00   BLOCK 4 (2 hrs) — all pairs
// Total per person: 2+2+1+2 = 7 hrs across 4 stations ✅
//
// LUNCH GROUPS:
// Lunch A (11-12): Kyle + P1 (Marcio,Togiva) + P2 (LaQuon,Quincy) → actually:
// Per original rules: Lunch A = Kyle + Marcio, Togiva, LaQuon
//                     Lunch B = Alan + Quincy, Keyshawn, Ashley
// So lunch cover pods:
//   11-12: P3(Keyshawn+Ashley) + P4(Alan) cover while P1+P2-LaQuon+Kyle lunch
//   12-1:  P1(Marcio+Togiva) + P4(Kyle) cover while P3+P2-Quincy+Alan lunch

// 8-day rotation: each pod gets 4 different stations per day
// Format: { pod: [block1, block2, lunchCover, block4] }
const ROTATION_S1: Record<string,{[pod:string]:[string,string,string,string]}> = {
  '0': { P1:['ymc7','ymc1','ymc3','ymc4'], P2:['ymc1','ymc2','ymc4','g1'],   P3:['ymc2','ymc3','ymc7','ymc1'], P4:['g1','ymc4','ymc2','ymc3']  },
  '1': { P1:['ymc1','ymc2','ymc4','g1'],   P2:['ymc2','ymc3','g1','ymc7'],   P3:['ymc3','ymc4','ymc1','ymc2'], P4:['ymc7','g1','ymc3','ymc4']  },
  '2': { P1:['ymc2','ymc3','g1','ymc7'],   P2:['ymc3','ymc4','ymc7','ymc1'], P3:['ymc4','g1','ymc2','ymc3'],  P4:['ymc1','ymc7','ymc4','g1']  },
  '3': { P1:['ymc3','ymc4','ymc7','ymc1'], P2:['ymc4','g1','ymc1','ymc2'],   P3:['g1','ymc7','ymc3','ymc4'],  P4:['ymc2','ymc1','g1','ymc7']  },
  '4': { P1:['ymc4','g1','ymc1','ymc2'],   P2:['g1','ymc7','ymc2','ymc3'],   P3:['ymc7','ymc1','ymc4','g1'],  P4:['ymc3','ymc2','ymc1','ymc4'] },
  '5': { P1:['g1','ymc7','ymc2','ymc3'],   P2:['ymc7','ymc1','ymc3','ymc4'], P3:['ymc1','ymc2','g1','ymc7'],  P4:['ymc4','ymc3','ymc2','ymc1'] },
  '6': { P1:['ymc7','ymc4','ymc1','g1'],   P2:['ymc1','g1','ymc4','ymc7'],   P3:['ymc2','ymc1','ymc3','ymc4'], P4:['g1','ymc2','g1','ymc3']    },
  '7': { P1:['ymc4','ymc7','g1','ymc2'],   P2:['g1','ymc2','ymc7','ymc1'],   P3:['ymc1','ymc4','ymc2','g1'],  P4:['ymc2','ymc3','ymc4','ymc7'] },
}

// Lunch A pods (out 11-12): P1 + Kyle(P4)   → covered by P2, P3
// Lunch B pods (out 12-1):  P2 + Alan(P4)   → covered by P1, P3
// P3 covers BOTH lunch hours (they eat... when? P3 eats with Alan's group)
// Actually per original rules:
//   Lunch A (11-12): Kyle + Marcio(P1), Togiva(P1), LaQuon(P2) → 4 people out
//   Lunch B (12-1):  Alan + Quincy(P2), Keyshawn(P3), Ashley(P3) → 4 people out
// So:
//   11-12 COVER: Quincy(P2), Keyshawn(P3), Ashley(P3), Alan = 4 people working
//   12-1  COVER: Marcio(P1), Togiva(P1), LaQuon(P2), Kyle = 4 people working

// Lunch cover station per pod per day
const LUNCH_COVER_S1: Record<string,{[pod:string]:string}> = {
  '0': { P1:'ymc3', P2:'ymc4', P3:'ymc7', P4:'ymc2' },
  '1': { P1:'ymc4', P2:'g1',   P3:'ymc1', P4:'ymc3' },
  '2': { P1:'g1',   P2:'ymc7', P3:'ymc2', P4:'ymc4' },
  '3': { P1:'ymc7', P2:'ymc1', P3:'ymc3', P4:'g1'   },
  '4': { P1:'ymc1', P2:'ymc2', P3:'ymc4', P4:'ymc7' },
  '5': { P1:'ymc2', P2:'ymc3', P3:'g1',   P4:'ymc1' },
  '6': { P1:'ymc1', P2:'ymc4', P3:'ymc3', P4:'g1'   },
  '7': { P1:'g1',   P2:'ymc7', P3:'ymc2', P4:'ymc4' },
}

// ─── 2ND SHIFT SCHEDULE ───────────────────────────────────────────────────────
// 10:00–12:00  BLOCK 1 (2 hrs) — all pairs
// 12:00–2:00   BLOCK 2 (2 hrs) — all pairs
// 1:00–2:00    LUNCH C (all 2nd shift, cuts into Block 2)
// 2:00–4:00    BLOCK 3 (2 hrs) — all pairs
// 4:00–6:00    BLOCK 4 (2 hrs) — all pairs
// Total: 2+1(pre-lunch)+2+2 = 7 hrs ✅ (lunch is 1hr within Block 2)
//
// Actually cleaner:
// 10:00–12:00  BLOCK 1 (2 hrs)
// 12:00–1:00   BLOCK 2 first half (1 hr)
// 1:00–2:00    LUNCH C
// 2:00–3:00    BLOCK 2 second half / BLOCK 3 start (treat as new station)
// 2:00–4:00    BLOCK 3 (2 hrs) — new station after lunch
// 4:00–6:00    BLOCK 4 (2 hrs)
// = 2 + 2 + 2 + 1(pre-lunch) = 7 hrs... let's simplify:
// 10:00–12:00  BLOCK 1 (2 hrs)
// 12:00–2:00   BLOCK 2 (2 hrs, lunch 1-2 cuts it — they do 1 hr pre-lunch)
// 2:00–4:00    BLOCK 3 (2 hrs)
// 4:00–6:00    BLOCK 4 (2 hrs)
// Each person: 2 + 1 (pre-lunch) + 2 + 2 = 7 hrs ✅

const ROTATION_S2: Record<string,{[pod:string]:[string,string,string,string]}> = {
  '0': { PA:['ymc7','ymc3','ymc4','ymc1'], PB:['ymc3','ymc4','ymc1','g1'],   PC:['ymc4','ymc1','g1','ymc7'],  PD:['ymc1','g1','ymc7','ymc3']  },
  '1': { PA:['ymc3','ymc4','ymc1','g1'],   PB:['ymc4','ymc1','g1','ymc7'],   PC:['ymc1','g1','ymc7','ymc3'],  PD:['g1','ymc7','ymc3','ymc4']  },
  '2': { PA:['ymc4','ymc1','g1','ymc7'],   PB:['ymc1','g1','ymc7','ymc3'],   PC:['g1','ymc7','ymc3','ymc4'],  PD:['ymc7','ymc3','ymc4','ymc1'] },
  '3': { PA:['ymc1','g1','ymc7','ymc3'],   PB:['g1','ymc7','ymc3','ymc4'],   PC:['ymc7','ymc3','ymc4','ymc1'], PD:['ymc3','ymc4','ymc1','g1']  },
  '4': { PA:['ymc2','uc1','ymc3','ymc4'],  PB:['uc1','ymc2','ymc4','ymc1'],  PC:['ymc3','ymc4','ymc2','uc1'],  PD:['ymc4','ymc3','uc1','ymc2'] },
  '5': { PA:['uc1','ymc2','ymc4','ymc3'],  PB:['ymc2','uc1','ymc3','ymc4'],  PC:['ymc4','ymc3','uc1','ymc2'],  PD:['ymc3','ymc4','ymc2','uc1'] },
  '6': { PA:['ymc7','ymc2','uc1','ymc3'],  PB:['ymc3','uc1','ymc2','ymc4'],  PC:['ymc4','ymc7','ymc3','uc1'],  PD:['uc1','ymc3','ymc7','ymc2'] },
  '7': { PA:['ymc4','ymc3','ymc7','uc1'],  PB:['ymc7','ymc4','uc1','ymc3'],  PC:['uc1','ymc2','ymc4','ymc7'],  PD:['ymc2','uc1','ymc3','ymc4'] },
}

// ─── TIME CONSTANTS ───────────────────────────────────────────────────────────
// 1st shift block starts (minutes since midnight)
const S1_BLOCKS = [
  { name:'Block 1', start:7*60,    end:9*60,    durationHrs:2, label:'7:00 – 9:00 AM'   },
  { name:'Block 2', start:9*60,    end:11*60,   durationHrs:2, label:'9:00 – 11:00 AM'  },
  { name:'Lunch A', start:11*60,   end:12*60,   durationHrs:1, label:'11:00 AM – 12:00 PM', isLunch:true, lunchGroup:'A' },
  { name:'Lunch B', start:12*60,   end:13*60,   durationHrs:1, label:'12:00 – 1:00 PM',    isLunch:true, lunchGroup:'B' },
  { name:'Block 4', start:13*60,   end:15*60,   durationHrs:2, label:'1:00 – 3:00 PM'   },
]

// 2nd shift block starts
const S2_BLOCKS = [
  { name:'Block 1', start:10*60,   end:12*60,   durationHrs:2, label:'10:00 AM – 12:00 PM' },
  { name:'Block 2', start:12*60,   end:13*60,   durationHrs:1, label:'12:00 – 1:00 PM (pre-lunch)' },
  { name:'Lunch C', start:13*60,   end:14*60,   durationHrs:1, label:'1:00 – 2:00 PM', isLunch:true, lunchGroup:'C' },
  { name:'Block 3', start:14*60,   end:16*60,   durationHrs:2, label:'2:00 – 4:00 PM'   },
  { name:'Block 4', start:16*60,   end:18*60,   durationHrs:2, label:'4:00 – 6:00 PM'   },
]

// Pods that lunch at each slot
// Lunch A (11-12): Kyle(P4) + Marcio(P1) + Togiva(P1) + LaQuon(P2)
//   = pods P1 partially, P2 partially, P4 partially
// Lunch B (12-1): Alan(P4) + Quincy(P2) + Keyshawn(P3) + Ashley(P3)
const LUNCH_A_MEMBERS = ['kw','mr','ta','lp'] // Kyle, Marcio, Togiva, LaQuon
const LUNCH_B_MEMBERS = ['ah','qf','ks','am'] // Alan, Quincy, Keyshawn, Ashley
const LUNCH_C_PODS    = ['PA','PB','PC','PD']  // all 2nd shift

function getDayIndex() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000)
  return dayOfYear % 8
}

function getNowMin() {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

function getClockTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour:'2-digit', minute:'2-digit', second:'2-digit'
  })
}

function getCalendarDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday:'long', year:'numeric', month:'long', day:'numeric'
  })
}

function formatMin(m: number) {
  const h = Math.floor(m/60)
  const min = m % 60
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h-12 : h===0 ? 12 : h
  return `${hour}:${min.toString().padStart(2,'0')} ${ampm}`
}

// Build session rows for a block
function buildSessions(personA: string, personB: string, blockStartMin: number, durationHrs: number) {
  const SESSION = 18
  const totalSessions = Math.floor((durationHrs * 60) / SESSION)
  return Array.from({length: totalSessions}, (_, i) => {
    const startMin = blockStartMin + i * SESSION
    const endMin   = startMin + SESSION
    const isPerson = i % 2 === 0 ? 'A' : 'B'
    const person   = isPerson === 'A' ? personA : personB
    return { session:i+1, person, isPerson, startMin, endMin,
             startTime: formatMin(startMin), endTime: formatMin(endMin) }
  })
}

// Check if now is in alert/warning territory for a block
function getBlockAlert(blockStartMin: number, blockDurHrs: number, nextStation: string|null) {
  const nowMin = getNowMin()
  const blockEndMin = blockStartMin + blockDurHrs * 60
  const elapsed = nowMin - blockStartMin
  const remaining = blockEndMin - nowMin
  if (elapsed < 0 || elapsed >= blockDurHrs * 60) return null
  return {
    elapsed,
    remaining,
    sessionIndex: Math.floor(elapsed / 18),
    personTurn: Math.floor(elapsed / 18) % 2,
    isWarning: remaining <= 10 && remaining > 6 && !!nextStation,
    isAlert:   remaining <= 6 && !!nextStation,
    nextStation,
  }
}

const COLORS: Record<string,string[]> = {
  LEAD:['#E6F1FB','#0C447C'],
  DC:  ['#EAF3DE','#3B6D11'],
  DA:  ['#F1EFE8','#5F5E5A'],
}

export default function Home() {
  const [absent,       setAbsent]       = useState<Set<string>>(new Set(['gr']))
  const [shift,        setShift]        = useState<1|2>(1)
  const [tab,          setTab]          = useState<'schedule'|'roster'|'rotation'>('schedule')
  const [selectedUser, setSelectedUser] = useState<string|null>(null)
  const [loggedIn,     setLoggedIn]     = useState(false)
  const [clock,        setClock]        = useState(getClockTime())
  const [nowMin,       setNowMin]       = useState(getNowMin())

  useEffect(() => {
    const t = setInterval(() => {
      setClock(getClockTime())
      setNowMin(getNowMin())
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const pool    = ROSTER[`s${shift}` as 's1'|'s2']
  const dayIdx  = getDayIndex()
  const dayIdxStr = String(dayIdx)
  const rotation  = shift===1 ? ROTATION_S1[dayIdxStr] : ROTATION_S2[dayIdxStr]
  const lunchCover = shift===1 ? LUNCH_COVER_S1[dayIdxStr] : null
  const blocks    = shift===1 ? S1_BLOCKS : S2_BLOCKS

  const toggle = (id: string) => {
    const next = new Set(absent)
    next.has(id) ? next.delete(id) : next.add(id)
    setAbsent(next)
  }

  const currentUser = selectedUser
    ? [...ROSTER.s1,...ROSTER.s2].find(m => m.id === selectedUser)
    : null
  const presentDCs = pool.filter(m => m.role==='DC' && !absent.has(m.id)).length
  const absentDCs  = pool.filter(m => m.role==='DC' &&  absent.has(m.id)).length

  // Determine current block for a pod
  function getCurrentBlockForPod(pod: string) {
    const podStations = rotation?.[pod] // [b1, b2, lunchCover, b4]
    if (!podStations) return null
    const dataBlocks = shift===1
      ? [
          { idx:0, startMin:7*60,  durHrs:2, nextSt:podStations[1] },
          { idx:1, startMin:9*60,  durHrs:2, nextSt:lunchCover?.[pod]||null },
          { idx:2, startMin:12*60, durHrs:1, nextSt:podStations[3] }, // lunch cover B slot
          { idx:3, startMin:13*60, durHrs:2, nextSt:null },
        ]
      : [
          { idx:0, startMin:10*60, durHrs:2, nextSt:podStations[1] },
          { idx:1, startMin:12*60, durHrs:1, nextSt:podStations[2] },
          { idx:2, startMin:14*60, durHrs:2, nextSt:podStations[3] },
          { idx:3, startMin:16*60, durHrs:2, nextSt:null },
        ]
    for (const b of dataBlocks) {
      const alert = getBlockAlert(b.startMin, b.durHrs, b.nextSt)
      if (alert) return { ...b, alert }
    }
    return null
  }

  const myPod = currentUser?.pod
  const myCurrentBlock = myPod ? getCurrentBlockForPod(myPod) : null
  const globalAlert = myCurrentBlock?.alert?.isAlert
  const globalWarn  = myCurrentBlock?.alert?.isWarning

  // Build full day schedule for display
  const pods = shift===1 ? ['P1','P2','P3','P4'] : ['PA','PB','PC','PD']
  const todayRows = pods.map(pod => {
    const podStations = rotation?.[pod] as [string,string,string,string] | undefined
    if (!podStations) return null
    const members = pool.filter(m => m.pod===pod && !absent.has(m.id))
    const allPod  = pool.filter(m => m.pod===pod)
    const personA = members[0]?.name.split(' ')[0] ?? '?'
    const personB = members[1]?.name.split(' ')[0] ?? '(solo)'
    const curBlock = getCurrentBlockForPod(pod)

    // Is this pod on lunch A or B?
    const podMemberIds = allPod.map(m => m.id)
    const onLunchA = podMemberIds.some(id => LUNCH_A_MEMBERS.includes(id))
    const onLunchB = podMemberIds.some(id => LUNCH_B_MEMBERS.includes(id))

    return { pod, members, allPod, podStations, personA, personB,
             curBlock, onLunchA, onLunchB }
  }).filter(Boolean)

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  if (!loggedIn) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',
      minHeight:'100vh',flexDirection:'column',fontFamily:'system-ui',
      background:'#f0f4ff',padding:'20px'}}>
      <div style={{background:'white',padding:'32px',borderRadius:'16px',
        boxShadow:'0 4px 24px rgba(0,0,0,0.08)',width:'100%',maxWidth:'400px'}}>
        <div style={{textAlign:'center',marginBottom:'24px'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
            <div style={{width:'10px',height:'10px',borderRadius:'50%',
              background:'#22c55e',boxShadow:'0 0 8px #22c55e'}}/>
            <span style={{fontSize:'22px',fontWeight:'800',letterSpacing:'-0.02em'}}>
              Data Engine
            </span>
          </div>
          <div style={{fontSize:'14px',fontWeight:'600',color:'#374151'}}>{getCalendarDate()}</div>
          <div style={{fontSize:'12px',color:'#9ca3af',fontFamily:'monospace',marginTop:'2px'}}>
            {clock} · Rotation Day {dayIdx+1}/8
          </div>
        </div>

        <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
          textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>Your shift</div>
        <div style={{display:'flex',gap:'8px',marginBottom:'16px'}}>
          {[1,2].map(s => (
            <button key={s} onClick={() => setShift(s as 1|2)}
              style={{flex:1,padding:'10px',borderRadius:'10px',cursor:'pointer',
                border:'2px solid',fontWeight:'700',fontSize:'13px',
                borderColor:shift===s?'#3b82f6':'#e5e7eb',
                background:shift===s?'#eff6ff':'white',
                color:shift===s?'#1d4ed8':'#374151'}}>
              {s===1?'1st Shift · 7AM–3PM':'2nd Shift · 10AM–6PM'}
            </button>
          ))}
        </div>

        <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
          textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>Your name</div>
        <select value={selectedUser||''} onChange={e => setSelectedUser(e.target.value)}
          style={{width:'100%',padding:'11px 12px',borderRadius:'10px',
            border:'1px solid #e5e7eb',fontSize:'13px',marginBottom:'12px',
            background:'white',cursor:'pointer'}}>
          <option value=''>— select your name —</option>
          {pool.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} · {p.role}{p.pod?' · '+p.pod:''}
            </option>
          ))}
        </select>

        <div style={{padding:'10px 14px',background:'#fffbeb',borderRadius:'8px',
          border:'1px solid #fde68a',fontSize:'12px',color:'#92400e',
          fontFamily:'monospace',marginBottom:'16px',display:'flex',gap:'8px'}}>
          <span>⏰</span>
          <div>
            <div style={{fontWeight:'700'}}>Cutoff: {shift===1?'6:30 AM':'9:30 AM'}</div>
            <div>Mark absent before this time if you can't make it</div>
          </div>
        </div>

        <button onClick={() => selectedUser && setLoggedIn(true)}
          disabled={!selectedUser}
          style={{width:'100%',padding:'13px',borderRadius:'10px',
            background:selectedUser?'#3b82f6':'#e5e7eb',
            color:selectedUser?'white':'#9ca3af',
            border:'none',fontSize:'15px',fontWeight:'700',
            cursor:selectedUser?'pointer':'default'}}>
          Sign in →
        </button>
      </div>
    </div>
  )

  return (
    <div style={{fontFamily:'system-ui',background:'#f9fafb',
      minHeight:'100vh',padding:'16px',maxWidth:'960px',margin:'0 auto'}}>

      {/* 6-MIN ALERT */}
      {globalAlert && myCurrentBlock?.alert?.nextStation && (
        <div style={{position:'fixed',top:0,left:0,right:0,zIndex:999,
          background:'#dc2626',color:'white',padding:'14px 20px',
          display:'flex',alignItems:'center',gap:'12px',
          boxShadow:'0 4px 20px rgba(220,38,38,0.5)',
          animation:'pulse 1s ease-in-out infinite'}}>
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.8}}`}</style>
          <span style={{fontSize:'28px'}}>🚨</span>
          <div style={{flex:1}}>
            <div style={{fontSize:'16px',fontWeight:'800'}}>6 MINUTES — BEGIN TRANSITION NOW</div>
            <div style={{fontSize:'13px',opacity:0.9,marginTop:'2px'}}>
              Move to&nbsp;
              <strong>{STATION_INFO[myCurrentBlock.alert.nextStation].label}</strong>
              &nbsp;—&nbsp;{STATION_INFO[myCurrentBlock.alert.nextStation].task}
            </div>
          </div>
          <div style={{fontSize:'40px',fontWeight:'800',fontFamily:'monospace'}}>6 MIN</div>
        </div>
      )}

      {/* 10-MIN WARNING */}
      {globalWarn && myCurrentBlock?.alert?.nextStation && !globalAlert && (
        <div style={{background:'#f59e0b',color:'white',padding:'10px 16px',
          borderRadius:'10px',marginBottom:'12px',display:'flex',
          alignItems:'center',gap:'10px',boxShadow:'0 2px 8px rgba(245,158,11,0.4)'}}>
          <span style={{fontSize:'20px'}}>⚠️</span>
          <div>
            <div style={{fontWeight:'700',fontSize:'14px'}}>
              {myCurrentBlock.alert.remaining} minutes remaining in this block
            </div>
            <div style={{fontSize:'12px',opacity:0.9}}>
              Next →&nbsp;
              <strong>{STATION_INFO[myCurrentBlock.alert.nextStation].label}</strong>
              &nbsp;({STATION_INFO[myCurrentBlock.alert.nextStation].task})
              &nbsp;· Start wrapping up now
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
        marginBottom:'8px',marginTop:globalAlert?'64px':'0'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={{width:'8px',height:'8px',borderRadius:'50%',
            background:'#22c55e',boxShadow:'0 0 6px #22c55e'}}/>
          <span style={{fontWeight:'800',fontSize:'15px'}}>Data Engine</span>
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

      {/* DATE + CLOCK BAR */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'8px 14px',background:'white',borderRadius:'8px',
        border:'1px solid #e5e7eb',marginBottom:'12px'}}>
        <div style={{fontSize:'13px',fontWeight:'600',color:'#374151'}}>{getCalendarDate()}</div>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <span style={{fontSize:'11px',color:'#6b7280',fontFamily:'monospace'}}>
            Rotation Day {dayIdx+1}/8
          </span>
          <span style={{fontSize:'13px',fontWeight:'700',fontFamily:'monospace',
            color:'#1d4ed8',background:'#eff6ff',padding:'3px 10px',borderRadius:'6px'}}>
            {clock}
          </span>
        </div>
      </div>

      {/* SHIFT TOGGLE — leads */}
      {currentUser?.role==='LEAD' && (
        <div style={{display:'flex',gap:'6px',marginBottom:'12px'}}>
          {[1,2].map(s => (
            <button key={s} onClick={() => setShift(s as 1|2)}
              style={{padding:'7px 16px',borderRadius:'8px',cursor:'pointer',
                border:'1px solid',fontWeight:'600',fontSize:'12px',
                borderColor:shift===s?'#3b82f6':'#e5e7eb',
                background:shift===s?'#eff6ff':'white',
                color:shift===s?'#1d4ed8':'#374151'}}>
              {s===1?'1st Shift · 7AM–3PM':'2nd Shift · 10AM–6PM'}
            </button>
          ))}
        </div>
      )}

      {/* MY STATUS CARD — DCs */}
      {currentUser?.role==='DC' && myPod && rotation?.[myPod] && (
        <div style={{background:'white',borderRadius:'12px',
          border:`2px solid ${absent.has(currentUser.id)?'#fca5a5':'#86efac'}`,
          padding:'14px',marginBottom:'12px'}}>
          <div style={{display:'flex',alignItems:'center',
            justifyContent:'space-between',marginBottom:'10px'}}>
            <div>
              <div style={{fontWeight:'700',fontSize:'15px'}}>{currentUser.name}</div>
              <div style={{fontSize:'11px',color:'#6b7280',fontFamily:'monospace'}}>
                {currentUser.role} · Shift {currentUser.shift} · Pod {myPod}
              </div>
            </div>
            <span style={{padding:'4px 12px',borderRadius:'99px',fontSize:'11px',
              fontWeight:'700',fontFamily:'monospace',
              background:absent.has(currentUser.id)?'#fee2e2':'#dcfce7',
              color:absent.has(currentUser.id)?'#dc2626':'#16a34a'}}>
              {absent.has(currentUser.id)?'ABSENT':'PRESENT'}
            </span>
          </div>

          {/* 4 station cards for today */}
          <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
            textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'8px'}}>
            Today's 4 station rotations · 7 hrs total collection
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'6px',marginBottom:'10px'}}>
            {(rotation[myPod] as string[]).map((stId, bi) => {
              const info = STATION_INFO[stId]
              const blockTimes = shift===1
                ? ['7:00–9:00 AM','9:00–11:00 AM','11AM–1PM (cover)','1:00–3:00 PM']
                : ['10:00–12:00 PM','12:00–1:00 PM','2:00–4:00 PM','4:00–6:00 PM']
              const isActive = myCurrentBlock?.idx === bi
              const isLunchCover = shift===1 && bi===2
              return (
                <div key={bi} style={{padding:'8px',borderRadius:'8px',
                  background:isActive?`${info.dot}18`:'#f9fafb',
                  border:`1.5px solid ${isActive?info.dot:'#e5e7eb'}`,
                  textAlign:'center'}}>
                  <div style={{fontSize:'9px',color:isActive?info.dot:'#9ca3af',
                    fontFamily:'monospace',fontWeight:'600',marginBottom:'3px'}}>
                    {isLunchCover?'LUNCH COVER':(`BLOCK ${bi+1}`)}
                    {isActive?' ✓':''}
                  </div>
                  <div style={{width:'8px',height:'8px',borderRadius:'50%',
                    background:info.dot,margin:'0 auto 3px'}}/>
                  <div style={{fontSize:'11px',fontWeight:'800'}}>{info.label}</div>
                  <div style={{fontSize:'9px',color:'#6b7280',marginTop:'1px'}}>{info.task}</div>
                  <div style={{fontSize:'8px',color:'#9ca3af',fontFamily:'monospace',
                    marginTop:'3px'}}>{blockTimes[bi]}</div>
                </div>
              )
            })}
          </div>

          {/* Current block status */}
          {myCurrentBlock && (
            <div style={{padding:'8px 12px',background:'#f0fdf4',borderRadius:'8px',
              border:'1px solid #86efac',marginBottom:'10px',fontSize:'12px'}}>
              <strong style={{color:'#16a34a'}}>Now active:</strong>&nbsp;
              {STATION_INFO[rotation[myPod][myCurrentBlock.idx]].label}&nbsp;·&nbsp;
              Session {myCurrentBlock.alert!.sessionIndex+1}&nbsp;·&nbsp;
              {myCurrentBlock.alert!.personTurn===0?'Person A':'Person B'} on station&nbsp;·&nbsp;
              {myCurrentBlock.alert!.remaining} min remaining
            </div>
          )}

          <button onClick={() => toggle(currentUser.id)}
            style={{width:'100%',padding:'10px',borderRadius:'8px',
              border:'1px solid',fontWeight:'600',fontSize:'13px',cursor:'pointer',
              borderColor:absent.has(currentUser.id)?'#86efac':'#fca5a5',
              background:absent.has(currentUser.id)?'#f0fdf4':'#fef2f2',
              color:absent.has(currentUser.id)?'#16a34a':'#dc2626'}}>
            {absent.has(currentUser.id)?'↩ Mark myself PRESENT':'I will be OUT today'}
          </button>
        </div>
      )}

      {/* TABS */}
      <div style={{display:'flex',gap:'4px',background:'#f3f4f6',padding:'4px',
        borderRadius:'8px',marginBottom:'12px'}}>
        {(['schedule','roster','rotation'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{flex:1,padding:'7px',borderRadius:'6px',cursor:'pointer',
              fontSize:'11px',fontWeight:'600',textTransform:'uppercase',
              letterSpacing:'0.05em',border:'none',
              background:tab===t?'white':'transparent',
              color:tab===t?'#111827':'#6b7280'}}>
            {t}
          </button>
        ))}
      </div>

      {/* ── SCHEDULE TAB ────────────────────────────────────────────────────── */}
      {tab==='schedule' && (
        <>
          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',
            gap:'8px',marginBottom:'12px'}}>
            {[
              {label:'DCs Present',value:presentDCs,color:'#16a34a'},
              {label:'DCs Absent', value:absentDCs, color:absentDCs>0?'#dc2626':'#9ca3af'},
              {label:'Rotation',   value:`Day ${dayIdx+1}/8`,color:'#7c3aed'},
            ].map(s => (
              <div key={s.label} style={{background:'white',borderRadius:'10px',
                padding:'12px',textAlign:'center',border:'1px solid #e5e7eb'}}>
                <div style={{fontSize:'20px',fontWeight:'800',color:s.color}}>{s.value}</div>
                <div style={{fontSize:'10px',color:'#9ca3af',textTransform:'uppercase',
                  letterSpacing:'0.06em',marginTop:'2px'}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Lunch banner */}
          {shift===1 && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',
              gap:'8px',marginBottom:'12px'}}>
              {[
                {label:'Lunch A · 11:00 AM – 12:00 PM',
                 who:'Kyle · Marcio · Togiva · LaQuon',color:'#f59e0b'},
                {label:'Lunch B · 12:00 PM – 1:00 PM',
                 who:'Alan · Quincy · Keyshawn · Ashley',color:'#8b5cf6'},
              ].map(l => (
                <div key={l.label} style={{padding:'8px 12px',borderRadius:'8px',
                  background:`${l.color}15`,border:`1px solid ${l.color}44`,
                  fontSize:'11px'}}>
                  <div style={{fontWeight:'700',color:l.color,marginBottom:'2px'}}>
                    🍽 {l.label}
                  </div>
                  <div style={{color:'#374151'}}>{l.who}</div>
                </div>
              ))}
            </div>
          )}
          {shift===2 && (
            <div style={{padding:'8px 12px',borderRadius:'8px',marginBottom:'12px',
              background:'#f59e0b18',border:'1px solid #f59e0b44',fontSize:'11px'}}>
              <span style={{fontWeight:'700',color:'#f59e0b'}}>🍽 Lunch C · 1:00 – 2:00 PM&nbsp;</span>
              All 2nd shift DCs
            </div>
          )}

          {/* Per-pod schedule */}
          {(todayRows as NonNullable<typeof todayRows[0]>[]).map(row => {
            const {pod, members, allPod, podStations, personA, personB,
                   curBlock, onLunchA, onLunchB} = row
            const absentHere = allPod.filter(m => absent.has(m.id))
            const short = members.length < 2

            // Build the day's timeline for this pod
            const dayTimeline = shift===1 ? [
              { blockLabel:'Block 1', stId:podStations[0], startMin:7*60,  durHrs:2,
                timeLabel:'7:00 – 9:00 AM', isLunch:false, isLunchCover:false },
              { blockLabel:'Block 2', stId:podStations[1], startMin:9*60,  durHrs:2,
                timeLabel:'9:00 – 11:00 AM', isLunch:false, isLunchCover:false },
              ...(onLunchA ? [
                { blockLabel:'Lunch A', stId:'', startMin:11*60, durHrs:1,
                  timeLabel:'11:00 AM – 12:00 PM', isLunch:true, isLunchCover:false }
              ] : []),
              ...(onLunchB ? [
                { blockLabel:'Lunch B', stId:'', startMin:12*60, durHrs:1,
                  timeLabel:'12:00 – 1:00 PM', isLunch:true, isLunchCover:false }
              ] : []),
              ...(!onLunchA ? [
                { blockLabel:'Cover (11-12)', stId:lunchCover?.[pod]||podStations[2],
                  startMin:11*60, durHrs:1, timeLabel:'11:00 AM – 12:00 PM',
                  isLunch:false, isLunchCover:true }
              ] : []),
              ...(!onLunchB ? [
                { blockLabel:'Cover (12-1)', stId:lunchCover?.[pod]||podStations[2],
                  startMin:12*60, durHrs:1, timeLabel:'12:00 – 1:00 PM',
                  isLunch:false, isLunchCover:true }
              ] : []),
              { blockLabel:'Block 4', stId:podStations[3], startMin:13*60, durHrs:2,
                timeLabel:'1:00 – 3:00 PM', isLunch:false, isLunchCover:false },
            ] : [
              { blockLabel:'Block 1', stId:podStations[0], startMin:10*60, durHrs:2,
                timeLabel:'10:00 AM – 12:00 PM', isLunch:false, isLunchCover:false },
              { blockLabel:'Block 2', stId:podStations[1], startMin:12*60, durHrs:1,
                timeLabel:'12:00 – 1:00 PM', isLunch:false, isLunchCover:false },
              { blockLabel:'Lunch C', stId:'', startMin:13*60, durHrs:1,
                timeLabel:'1:00 – 2:00 PM', isLunch:true, isLunchCover:false },
              { blockLabel:'Block 3', stId:podStations[2], startMin:14*60, durHrs:2,
                timeLabel:'2:00 – 4:00 PM', isLunch:false, isLunchCover:false },
              { blockLabel:'Block 4', stId:podStations[3], startMin:16*60, durHrs:2,
                timeLabel:'4:00 – 6:00 PM', isLunch:false, isLunchCover:false },
            ]

            return (
              <div key={pod} style={{background:'white',borderRadius:'12px',
                border:'1px solid #e5e7eb',marginBottom:'10px',overflow:'hidden'}}>

                {/* Pod header */}
                <div style={{padding:'10px 14px',background:'#f9fafb',
                  borderBottom:'1px solid #e5e7eb',display:'flex',
                  alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
                  <span style={{fontSize:'12px',fontWeight:'700',fontFamily:'monospace',
                    color:'white',background:'#374151',padding:'3px 10px',borderRadius:'6px'}}>
                    {pod}
                  </span>
                  {members.map(m => (
                    <span key={m.id} style={{padding:'3px 10px',borderRadius:'99px',
                      fontSize:'12px',fontWeight:'600',background:'#dcfce7',color:'#16a34a',
                      border:'1px solid #86efac'}}>
                      {m.name}
                    </span>
                  ))}
                  {absentHere.map(m => (
                    <span key={m.id} style={{padding:'3px 10px',borderRadius:'99px',
                      fontSize:'12px',background:'#fee2e2',color:'#dc2626',
                      border:'1px solid #fca5a5',textDecoration:'line-through',opacity:0.6}}>
                      {m.name}
                    </span>
                  ))}
                  {short && (
                    <span style={{marginLeft:'auto',padding:'3px 10px',borderRadius:'99px',
                      fontSize:'10px',fontWeight:'700',fontFamily:'monospace',
                      background:'#fee2e2',color:'#dc2626'}}>
                      SOLO — reassign
                    </span>
                  )}
                  {curBlock && (
                    <span style={{marginLeft:'auto',padding:'3px 10px',borderRadius:'99px',
                      fontSize:'10px',fontWeight:'700',background:'#dcfce7',color:'#16a34a',
                      fontFamily:'monospace'}}>
                      ACTIVE ✓
                    </span>
                  )}
                </div>

                {/* Timeline blocks */}
                <div style={{padding:'12px 14px',display:'flex',flexDirection:'column',gap:'8px'}}>
                  {dayTimeline.map((block, bi) => {
                    if (block.isLunch) return (
                      <div key={bi} style={{padding:'8px 12px',borderRadius:'8px',
                        background:'#fffbeb',border:'1px dashed #fde68a',
                        display:'flex',alignItems:'center',gap:'8px',fontSize:'12px',
                        color:'#92400e'}}>
                        <span>🍽</span>
                        <strong>{block.blockLabel}</strong>
                        <span style={{color:'#9ca3af'}}>·</span>
                        <span style={{fontFamily:'monospace',fontSize:'11px'}}>{block.timeLabel}</span>
                      </div>
                    )

                    const info = STATION_INFO[block.stId]
                    if (!info) return null
                    const sessions = buildSessions(personA, personB, block.startMin, block.durHrs)
                    const blockAlert = getBlockAlert(block.startMin, block.durHrs, null)
                    const isActiveBlock = !!blockAlert
                    const activeSessionIdx = blockAlert?.sessionIndex ?? -1

                    return (
                      <div key={bi} style={{borderRadius:'10px',overflow:'hidden',
                        border:`1.5px solid ${isActiveBlock?info.dot:'#e5e7eb'}`,
                        background:isActiveBlock?`${info.dot}08`:'white'}}>

                        {/* Block header */}
                        <div style={{padding:'8px 12px',
                          background:isActiveBlock?`${info.dot}18`:'#fafafa',
                          borderBottom:'1px solid #f3f4f6',
                          display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
                          <div style={{width:'10px',height:'10px',borderRadius:'50%',
                            background:info.dot,flexShrink:0}}/>
                          <span style={{fontSize:'13px',fontWeight:'800'}}>{info.label}</span>
                          <span style={{fontSize:'11px',color:'#6b7280'}}>— {info.task}</span>
                          <span style={{fontSize:'10px',color:'#9ca3af',fontFamily:'monospace',
                            marginLeft:'auto'}}>{block.timeLabel}</span>
                          {block.isLunchCover && (
                            <span style={{padding:'1px 6px',borderRadius:'4px',fontSize:'9px',
                              fontWeight:'700',background:'#fef3c7',color:'#92400e'}}>
                              LUNCH COVER
                            </span>
                          )}
                          {isActiveBlock && (
                            <span style={{padding:'1px 6px',borderRadius:'4px',fontSize:'9px',
                              fontWeight:'700',background:'#dcfce7',color:'#16a34a',
                              fontFamily:'monospace'}}>
                              NOW ACTIVE
                            </span>
                          )}
                        </div>

                        {/* Sessions */}
                        <div style={{padding:'6px 12px'}}>
                          {sessions.map((s, si) => {
                            const isCurrent = si === activeSessionIdx && isActiveBlock
                            const isPast    = isActiveBlock && si < activeSessionIdx
                            return (
                              <div key={si} style={{display:'flex',alignItems:'center',
                                gap:'8px',padding:'4px 8px',borderRadius:'6px',
                                marginBottom:'2px',
                                background:isCurrent?`${info.dot}20`:isPast?'#f9fafb':'transparent',
                                border:isCurrent?`1px solid ${info.dot}`:'1px solid transparent'}}>
                                <div style={{width:'20px',height:'20px',borderRadius:'50%',
                                  display:'flex',alignItems:'center',justifyContent:'center',
                                  fontSize:'9px',fontWeight:'700',flexShrink:0,
                                  background:isCurrent?info.dot:isPast?'#d1d5db':'#e5e7eb',
                                  color:isCurrent?'white':isPast?'#6b7280':'#9ca3af'}}>
                                  {s.session}
                                </div>
                                <span style={{fontSize:'10px',fontFamily:'monospace',
                                  color:isCurrent?'#374151':'#9ca3af',minWidth:'120px'}}>
                                  {s.startTime} – {s.endTime}
                                </span>
                                <span style={{fontSize:'9px',fontWeight:'700',
                                  padding:'1px 5px',borderRadius:'4px',
                                  background:s.isPerson==='A'?'#dbeafe':'#fce7f3',
                                  color:s.isPerson==='A'?'#1d4ed8':'#be185d'}}>
                                  {s.isPerson}
                                </span>
                                <span style={{fontSize:'11px',
                                  fontWeight:isCurrent?'700':'400',
                                  color:isCurrent?'#111827':'#374151'}}>
                                  {s.person}
                                </span>
                                {isCurrent && (
                                  <span style={{fontSize:'9px',background:'#dcfce7',
                                    color:'#16a34a',padding:'1px 5px',borderRadius:'4px',
                                    fontWeight:'700',fontFamily:'monospace'}}>NOW</span>
                                )}
                                {isPast && <span style={{fontSize:'10px',color:'#9ca3af'}}>✓</span>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </>
      )}

      {/* ── ROSTER TAB ──────────────────────────────────────────────────────── */}
      {tab==='roster' && (
        <div style={{background:'white',borderRadius:'12px',
          border:'1px solid #e5e7eb',padding:'16px'}}>
          <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
            textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'12px'}}>
            Shift {shift} roster
            {currentUser?.role==='LEAD'&&' · tap to toggle absence'}
          </div>
          {(['LEAD','DC','DA'] as const).map(role => (
            <div key={role} style={{marginBottom:'14px'}}>
              <div style={{fontSize:'10px',color:'#9ca3af',textTransform:'uppercase',
                letterSpacing:'0.08em',marginBottom:'6px'}}>{role}s</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                {pool.filter(m=>m.role===role).map(m => {
                  const out=absent.has(m.id)
                  const isLead=currentUser?.role==='LEAD'
                  return (
                    <div key={m.id} onClick={() => isLead && toggle(m.id)}
                      style={{display:'flex',alignItems:'center',gap:'6px',
                        padding:'6px 10px',borderRadius:'8px',
                        border:`1px solid ${out?'#fca5a5':'#e5e7eb'}`,
                        background:out?'#fef2f2':'#f9fafb',
                        cursor:isLead?'pointer':'default'}}>
                      <div style={{width:'26px',height:'26px',borderRadius:'50%',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:'9px',fontWeight:'700',
                        background:COLORS[role][0],color:COLORS[role][1]}}>
                        {m.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div style={{fontSize:'12px',fontWeight:'600',
                          textDecoration:out?'line-through':'none',opacity:out?0.5:1}}>
                          {m.name}
                        </div>
                        <div style={{fontSize:'10px',color:'#9ca3af'}}>{m.pod||role}</div>
                      </div>
                      <span style={{padding:'2px 7px',borderRadius:'99px',fontSize:'9px',
                        fontWeight:'700',fontFamily:'monospace',
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

      {/* ── ROTATION TAB ────────────────────────────────────────────────────── */}
      {tab==='rotation' && (
        <div>
          <div style={{background:'white',borderRadius:'12px',
            border:'1px solid #e5e7eb',padding:'16px',marginBottom:'12px'}}>
            <div style={{fontSize:'13px',fontWeight:'700',marginBottom:'4px'}}>
              8-Day Station Rotation · Shift {shift}
            </div>
            <div style={{fontSize:'12px',color:'#6b7280',marginBottom:'8px'}}>
              {shift===1
                ? '4 stations per day · 7 hrs collection · 1 hr lunch · staggered coverage'
                : '4 stations per day · 7 hrs collection · 1 hr lunch'}
            </div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px'}}>
                <thead>
                  <tr style={{background:'#f9fafb'}}>
                    <th style={{padding:'8px',textAlign:'left',
                      border:'1px solid #e5e7eb',color:'#6b7280',fontFamily:'monospace'}}>
                      Day
                    </th>
                    {(shift===1
                      ? ['P1\nMarcio+Togiva','P2\nLaQuon+Quincy',
                         'P3\nKeyshawn+Ashley','P4\nKyle+Alan']
                      : ['PA\nKyria+Ethan','PB\nFlora+Andrew',
                         'PC\nMichael+Lavanya','PD\nDavid+Lucca']
                    ).map((h,i) => (
                      <th key={i} style={{padding:'8px',textAlign:'center',
                        border:'1px solid #e5e7eb',color:'#374151',
                        whiteSpace:'pre-line',lineHeight:1.5,fontWeight:'600'}}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({length:8},(_,i) => {
                    const rot  = shift===1?ROTATION_S1[String(i)]:ROTATION_S2[String(i)]
                    const pods2= shift===1?['P1','P2','P3','P4']:['PA','PB','PC','PD']
                    const isToday = i===dayIdx
                    return (
                      <tr key={i} style={{background:isToday?'#eff6ff':i%2===0?'white':'#f9fafb'}}>
                        <td style={{padding:'8px',border:'1px solid #e5e7eb',
                          fontWeight:isToday?'800':'500',fontFamily:'monospace',
                          color:isToday?'#1d4ed8':'#374151'}}>
                          Day {i+1}
                          {isToday&&(
                            <span style={{marginLeft:'6px',fontSize:'9px',
                              background:'#3b82f6',color:'white',
                              padding:'1px 6px',borderRadius:'4px'}}>TODAY</span>
                          )}
                        </td>
                        {pods2.map(pod => {
                          const stations = rot[pod] as string[]
                          return (
                            <td key={pod} style={{padding:'6px 8px',
                              border:'1px solid #e5e7eb',textAlign:'center'}}>
                              <div style={{display:'flex',flexDirection:'column',gap:'2px'}}>
                                {stations.map((stId,si) => {
                                  const info = STATION_INFO[stId]
                                  return (
                                    <span key={si} style={{padding:'2px 5px',borderRadius:'4px',
                                      background:`${info.dot}22`,color:info.dot,
                                      fontWeight:'700',fontSize:'9px'}}>
                                      B{si+1}: {info.label}
                                    </span>
                                  )
                                })}
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
            border:'1px solid #bfdbfe',fontSize:'12px',color:'#1e40af',lineHeight:1.6}}>
            <strong>1st shift:</strong> Block 1 (7–9AM) → Block 2 (9–11AM) → Lunch cover/lunch (11AM–1PM staggered) → Block 4 (1–3PM) = 7 hrs per person across 4 stations.<br/>
            <strong>2nd shift:</strong> Block 1 (10AM–12PM) → Block 2 (12–1PM) → Lunch (1–2PM) → Block 3 (2–4PM) → Block 4 (4–6PM) = 7 hrs per person across 4 stations.<br/>
            <strong>Alerts:</strong> Yellow warning at 10 min remaining · Red alert at 6 min · Clock updates every second.
          </div>
        </div>
      )}
    </div>
  )
}
