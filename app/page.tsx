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

const ROTATION_S1: Record<string,{[pod:string]:[string,string]}> = {
  '0': { P1:['ymc7','ymc3'], P2:['ymc1','ymc4'], P3:['ymc2','uc1'], P4:['g1','g1']   },
  '1': { P1:['ymc1','ymc4'], P2:['ymc2','uc1'],  P3:['g1','g1'],   P4:['ymc7','ymc3']},
  '2': { P1:['ymc2','uc1'],  P2:['g1','g1'],     P3:['ymc7','ymc3'],P4:['ymc1','ymc4']},
  '3': { P1:['g1','g1'],     P2:['ymc7','ymc3'], P3:['ymc1','ymc4'],P4:['ymc2','uc1'] },
  '4': { P1:['ymc3','ymc7'], P2:['ymc4','ymc1'], P3:['uc1','ymc2'], P4:['g1','g1']   },
  '5': { P1:['ymc4','ymc1'], P2:['uc1','ymc2'],  P3:['g1','g1'],   P4:['ymc3','ymc7']},
  '6': { P1:['uc1','ymc2'],  P2:['g1','g1'],     P3:['ymc3','ymc7'],P4:['ymc4','ymc1']},
  '7': { P1:['g1','g1'],     P2:['ymc3','ymc7'], P3:['ymc4','ymc1'],P4:['uc1','ymc2'] },
}

const ROTATION_S2: Record<string,{[pod:string]:[string,string]}> = {
  '0': { PA:['ymc7','ymc4'], PB:['ymc3','ymc1'], PC:['ymc4','g1'],  PD:['ymc1','ymc7']},
  '1': { PA:['ymc3','ymc1'], PB:['ymc4','g1'],   PC:['ymc1','ymc7'],PD:['ymc7','ymc4']},
  '2': { PA:['ymc4','g1'],   PB:['ymc1','ymc7'], PC:['ymc7','ymc4'],PD:['ymc3','ymc1']},
  '3': { PA:['ymc1','ymc7'], PB:['ymc7','ymc4'], PC:['ymc3','ymc1'],PD:['ymc4','g1']  },
  '4': { PA:['ymc2','uc1'],  PB:['g1','ymc3'],   PC:['uc1','ymc2'], PD:['g1','ymc4']  },
  '5': { PA:['g1','ymc3'],   PB:['uc1','ymc2'],  PC:['g1','ymc4'],  PD:['ymc2','uc1'] },
  '6': { PA:['uc1','ymc2'],  PB:['g1','ymc4'],   PC:['ymc2','uc1'], PD:['g1','ymc3']  },
  '7': { PA:['g1','ymc4'],   PB:['ymc2','uc1'],  PC:['g1','ymc3'],  PD:['uc1','ymc2'] },
}

// Block start times (minutes since midnight)
const BLOCK_STARTS_S1 = [
  7*60+30,   // Block 1: 7:30 AM
  13*60+0,   // Block 2: 1:00 PM
]
const BLOCK_STARTS_S2 = [
  10*60+30,  // Block 1: 10:30 AM
  14*60+0,   // Block 2: 2:00 PM
]

function getDayIndex() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000)
  return dayOfYear % 8
}

function getNow() {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

function formatTime(minutesSinceMidnight: number) {
  const h = Math.floor(minutesSinceMidnight / 60)
  const m = minutesSinceMidnight % 60
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${m.toString().padStart(2,'0')} ${ampm}`
}

function getCalendarDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday:'long', year:'numeric', month:'long', day:'numeric'
  })
}

function getClockTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour:'2-digit', minute:'2-digit', second:'2-digit'
  })
}

// Get current block status for a shift
// Returns: { blockIndex, minuteInBlock, sessionIndex, personTurn, secIntoSession, isWarning, isAlert, nextStation }
function getBlockStatus(shift: 1|2, pod: string, rotation: {[p:string]:[string,string]}) {
  const nowMin = getNow()
  const starts = shift === 1 ? BLOCK_STARTS_S1 : BLOCK_STARTS_S2
  const SESSION = 18  // minutes per session
  const BLOCK   = 120 // minutes per block
  const WARNING_AT = 110 // show "moving to" banner
  const ALERT_AT   = 114 // 6-min transition alert

  for (let bi = 0; bi < starts.length; bi++) {
    const start = starts[bi]
    const elapsed = nowMin - start
    if (elapsed >= 0 && elapsed < BLOCK) {
      const sessionIndex = Math.floor(elapsed / SESSION) // 0-6
      const secIntoSession = (elapsed % SESSION)
      const personTurn = sessionIndex % 2 === 0 ? 0 : 1 // 0=PersonA, 1=PersonB
      const isWarning = elapsed >= WARNING_AT && elapsed < ALERT_AT
      const isAlert   = elapsed >= ALERT_AT
      const nextStation = bi < starts.length - 1 ? rotation[pod]?.[1] : null
      return { blockIndex:bi, minuteInBlock:elapsed, sessionIndex,
               personTurn, secIntoSession, isWarning, isAlert, nextStation,
               blockStart: start }
    }
  }
  return null
}

// Build full session timeline for a 2-hr block
function buildSessions(personA: string, personB: string, blockStartMin: number) {
  const SESSION = 18
  return Array.from({length:6}, (_, i) => {
    const startMin = blockStartMin + i * SESSION
    const endMin   = startMin + SESSION
    const person   = i % 2 === 0 ? personA : personB
    return {
      session: i + 1,
      person,
      isPerson: i % 2 === 0 ? 'A' : 'B',
      startTime: formatTime(startMin),
      endTime:   formatTime(endMin),
      startMin,
      endMin,
    }
  })
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
  const [nowMin,       setNowMin]       = useState(getNow())

  // Live clock — ticks every second
  useEffect(() => {
    const t = setInterval(() => {
      setClock(getClockTime())
      setNowMin(getNow())
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const pool = ROSTER[`s${shift}` as 's1'|'s2']
  const dayIdx   = getDayIndex()
  const rotation = shift === 1 ? ROTATION_S1[String(dayIdx)] : ROTATION_S2[String(dayIdx)]
  const blockStarts = shift === 1 ? BLOCK_STARTS_S1 : BLOCK_STARTS_S2

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

  // Global alert: is ANY block in 6-min warning for current user's pod?
  const myPod = currentUser?.pod
  const myStatus = (myPod && rotation?.[myPod])
    ? getBlockStatus(shift, myPod, rotation)
    : null

  const todaySchedule = rotation ? Object.entries(rotation).map(([pod, [block1, block3]]) => {
    const members  = pool.filter(m => m.pod === pod && !absent.has(m.id))
    const allPod   = pool.filter(m => m.pod === pod)
    const personA  = members[0]?.name.split(' ')[0] ?? '?'
    const personB  = members[1]?.name.split(' ')[0] ?? '(solo)'
    const b1info   = STATION_INFO[block1]
    const b3info   = STATION_INFO[block3]
    const status   = getBlockStatus(shift, pod, rotation)
    return { pod, members, allPod, block1, block3, b1info, b3info,
             personA, personB, status }
  }) : []

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  if (!loggedIn) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',
      minHeight:'100vh',flexDirection:'column',fontFamily:'system-ui',
      background:'#f0f4ff',padding:'20px'}}>
      <div style={{background:'white',padding:'32px',borderRadius:'16px',
        boxShadow:'0 4px 24px rgba(0,0,0,0.08)',width:'100%',maxWidth:'400px'}}>

        {/* Logo + date */}
        <div style={{textAlign:'center',marginBottom:'24px'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',
            marginBottom:'8px'}}>
            <div style={{width:'10px',height:'10px',borderRadius:'50%',
              background:'#22c55e',boxShadow:'0 0 8px #22c55e'}}/>
            <span style={{fontSize:'22px',fontWeight:'800',letterSpacing:'-0.02em'}}>
              Data Engine
            </span>
          </div>
          <div style={{fontSize:'13px',color:'#6b7280',fontWeight:'500'}}>
            {getCalendarDate()}
          </div>
          <div style={{fontSize:'12px',color:'#9ca3af',fontFamily:'monospace',
            marginTop:'2px'}}>
            {clock} · Rotation Day {dayIdx+1}/8
          </div>
        </div>

        {/* Shift */}
        <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
          textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>
          Your shift
        </div>
        <div style={{display:'flex',gap:'8px',marginBottom:'16px'}}>
          {[1,2].map(s => (
            <button key={s} onClick={() => setShift(s as 1|2)}
              style={{flex:1,padding:'10px',borderRadius:'10px',cursor:'pointer',
                border:'2px solid',fontWeight:'700',fontSize:'13px',
                borderColor: shift===s ? '#3b82f6':'#e5e7eb',
                background:  shift===s ? '#eff6ff' :'white',
                color:       shift===s ? '#1d4ed8' :'#374151'}}>
              {s===1 ? '1st Shift\n7:00 AM' : '2nd Shift\n10:00 AM'}
            </button>
          ))}
        </div>

        {/* Name */}
        <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
          textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>
          Your name
        </div>
        <select value={selectedUser||''}
          onChange={e => setSelectedUser(e.target.value)}
          style={{width:'100%',padding:'11px 12px',borderRadius:'10px',
            border:'1px solid #e5e7eb',fontSize:'13px',marginBottom:'12px',
            background:'white',cursor:'pointer',fontFamily:'system-ui'}}>
          <option value=''>— select your name —</option>
          {pool.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} · {p.role}{p.pod ? ' · '+p.pod : ''}
            </option>
          ))}
        </select>

        {/* Cutoff */}
        <div style={{padding:'10px 14px',background:'#fffbeb',borderRadius:'8px',
          border:'1px solid #fde68a',fontSize:'12px',color:'#92400e',
          fontFamily:'monospace',marginBottom:'16px',display:'flex',
          alignItems:'center',gap:'8px'}}>
          <span style={{fontSize:'16px'}}>⏰</span>
          <div>
            <div style={{fontWeight:'700'}}>
              Attendance cutoff: {shift===1 ? '6:30 AM' : '9:30 AM'}
            </div>
            <div>Mark absent before this time if you can't make it</div>
          </div>
        </div>

        <button onClick={() => selectedUser && setLoggedIn(true)}
          disabled={!selectedUser}
          style={{width:'100%',padding:'13px',borderRadius:'10px',
            background: selectedUser ? '#3b82f6':'#e5e7eb',
            color:      selectedUser ? 'white'  :'#9ca3af',
            border:'none',fontSize:'15px',fontWeight:'700',
            cursor: selectedUser ? 'pointer':'default',
            letterSpacing:'-0.01em'}}>
          Sign in →
        </button>
      </div>
    </div>
  )

  // ── 6-MIN TRANSITION ALERT (full screen overlay) ───────────────────────────
  const showAlert = myStatus?.isAlert && myStatus.nextStation
  const alertNextStation = myStatus?.nextStation
    ? STATION_INFO[myStatus.nextStation] : null

  return (
    <div style={{fontFamily:'system-ui',background:'#f9fafb',
      minHeight:'100vh',padding:'16px',maxWidth:'900px',margin:'0 auto',
      position:'relative'}}>

      {/* 6-MIN ALERT BANNER */}
      {showAlert && alertNextStation && (
        <div style={{position:'fixed',top:0,left:0,right:0,zIndex:999,
          background:'#dc2626',color:'white',padding:'16px 20px',
          display:'flex',alignItems:'center',gap:'12px',
          boxShadow:'0 4px 20px rgba(220,38,38,0.5)',
          animation:'pulse 1s ease-in-out infinite'}}>
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.85}}`}</style>
          <span style={{fontSize:'28px'}}>🚨</span>
          <div style={{flex:1}}>
            <div style={{fontSize:'16px',fontWeight:'800',letterSpacing:'-0.01em'}}>
              6 MINUTES — BEGIN TRANSITION NOW
            </div>
            <div style={{fontSize:'13px',opacity:0.9,marginTop:'2px'}}>
              Next station →&nbsp;
              <strong>{alertNextStation.label}</strong>
              &nbsp;({alertNextStation.task})
              &nbsp;· Wrap up your current session and move immediately
            </div>
          </div>
          <div style={{fontSize:'36px',fontWeight:'800',fontFamily:'monospace'}}>
            6 MIN
          </div>
        </div>
      )}

      {/* 10-MIN WARNING BANNER */}
      {myStatus?.isWarning && myStatus.nextStation && !showAlert && (
        <div style={{background:'#f59e0b',color:'white',padding:'12px 16px',
          borderRadius:'10px',marginBottom:'12px',display:'flex',
          alignItems:'center',gap:'10px',
          boxShadow:'0 2px 8px rgba(245,158,11,0.4)'}}>
          <span style={{fontSize:'20px'}}>⚠️</span>
          <div>
            <div style={{fontWeight:'700',fontSize:'14px'}}>
              10 minutes remaining in this block
            </div>
            <div style={{fontSize:'12px',opacity:0.9,marginTop:'2px'}}>
              Start wrapping up.&nbsp;
              Next station →&nbsp;
              <strong>
                {STATION_INFO[myStatus.nextStation].label}&nbsp;
                ({STATION_INFO[myStatus.nextStation].task})
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{display:'flex',alignItems:'center',
        justifyContent:'space-between',marginBottom:'4px',
        marginTop: showAlert ? '64px' : '0'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <div style={{width:'8px',height:'8px',borderRadius:'50%',
            background:'#22c55e',boxShadow:'0 0 6px #22c55e'}}/>
          <span style={{fontWeight:'800',fontSize:'15px',letterSpacing:'-0.01em'}}>
            Data Engine
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

      {/* DATE + CLOCK BAR */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'8px 12px',background:'white',borderRadius:'8px',
        border:'1px solid #e5e7eb',marginBottom:'12px'}}>
        <div style={{fontSize:'12px',fontWeight:'600',color:'#374151'}}>
          {getCalendarDate()}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <span style={{fontSize:'12px',color:'#6b7280',fontFamily:'monospace'}}>
            Rotation Day {dayIdx+1}/8
          </span>
          <span style={{fontSize:'13px',fontWeight:'700',fontFamily:'monospace',
            color:'#1d4ed8',background:'#eff6ff',padding:'3px 10px',
            borderRadius:'6px'}}>
            {clock}
          </span>
        </div>
      </div>

      {/* SHIFT TOGGLE — leads only */}
      {currentUser?.role === 'LEAD' && (
        <div style={{display:'flex',gap:'6px',marginBottom:'12px'}}>
          {[1,2].map(s => (
            <button key={s} onClick={() => setShift(s as 1|2)}
              style={{padding:'7px 16px',borderRadius:'8px',cursor:'pointer',
                border:'1px solid',fontWeight:'600',fontSize:'12px',
                borderColor: shift===s ? '#3b82f6':'#e5e7eb',
                background:  shift===s ? '#eff6ff' :'white',
                color:       shift===s ? '#1d4ed8' :'#374151'}}>
              {s===1 ? '1st Shift · 7AM–3PM' : '2nd Shift · 10AM–6PM'}
            </button>
          ))}
        </div>
      )}

      {/* MY STATUS CARD — DCs */}
      {currentUser?.role === 'DC' && myPod && rotation?.[myPod] && (
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
              background: absent.has(currentUser.id)?'#fee2e2':'#dcfce7',
              color:      absent.has(currentUser.id)?'#dc2626':'#16a34a'}}>
              {absent.has(currentUser.id) ? 'ABSENT' : 'PRESENT'}
            </span>
          </div>

          {/* Today's stations */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',
            gap:'8px',marginBottom:'10px'}}>
            {(rotation[myPod] as [string,string]).map((stId, bi) => {
              const info = STATION_INFO[stId]
              const times = shift===1
                ? ['7:30 AM – 9:30 AM · then 1:00 PM – 3:00 PM',
                   '1:00 PM – 3:00 PM'][bi]
                : ['10:30 AM – 12:30 PM','2:00 PM – 4:00 PM'][bi]
              const isActive = myStatus?.blockIndex === bi
              return (
                <div key={bi} style={{padding:'10px 12px',borderRadius:'10px',
                  background: isActive ? `${info.dot}18`:'#f9fafb',
                  border:`1.5px solid ${isActive ? info.dot:'#e5e7eb'}`,
                  transition:'all 0.3s'}}>
                  <div style={{fontSize:'9px',color:'#9ca3af',fontFamily:'monospace',
                    textTransform:'uppercase',marginBottom:'4px'}}>
                    Block {bi+1} {isActive ? '· ACTIVE NOW ✓':''}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'6px',
                    marginBottom:'3px'}}>
                    <div style={{width:'10px',height:'10px',borderRadius:'50%',
                      background:info.dot,flexShrink:0}}/>
                    <div style={{fontSize:'14px',fontWeight:'800'}}>{info.label}</div>
                  </div>
                  <div style={{fontSize:'11px',color:'#6b7280',marginBottom:'3px'}}>
                    {info.task}
                  </div>
                  <div style={{fontSize:'9px',color:'#9ca3af',fontFamily:'monospace'}}>
                    {times}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Current session status */}
          {myStatus && (
            <div style={{padding:'10px 12px',background:'#f0fdf4',borderRadius:'8px',
              border:'1px solid #86efac',marginBottom:'10px'}}>
              <div style={{fontSize:'11px',fontWeight:'700',color:'#16a34a',
                marginBottom:'4px'}}>
                Current session · Block {myStatus.blockIndex+1}
              </div>
              <div style={{fontSize:'12px',color:'#374151'}}>
                Session {myStatus.sessionIndex+1} of 6 ·&nbsp;
                <strong>
                  {myStatus.personTurn === 0 ? 'Person A' : 'Person B'} on station
                </strong>
                &nbsp;· {myStatus.secIntoSession} min elapsed in this 18-min session
              </div>
            </div>
          )}

          <button onClick={() => toggle(currentUser.id)}
            style={{width:'100%',padding:'10px',borderRadius:'8px',
              border:'1px solid',fontWeight:'600',fontSize:'13px',cursor:'pointer',
              borderColor: absent.has(currentUser.id)?'#86efac':'#fca5a5',
              background:  absent.has(currentUser.id)?'#f0fdf4':'#fef2f2',
              color:       absent.has(currentUser.id)?'#16a34a':'#dc2626'}}>
            {absent.has(currentUser.id) ? '↩ Mark myself PRESENT' : 'I will be OUT today'}
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
              background: tab===t ? 'white':'transparent',
              color:      tab===t ? '#111827':'#6b7280'}}>
            {t}
          </button>
        ))}
      </div>

      {/* ── SCHEDULE TAB ────────────────────────────────────────────────────── */}
      {tab === 'schedule' && (
        <>
          {/* Stats bar */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',
            gap:'8px',marginBottom:'12px'}}>
            {[
              {label:'DCs Present', value:presentDCs,        color:'#16a34a'},
              {label:'DCs Absent',  value:absentDCs,         color:absentDCs>0?'#dc2626':'#9ca3af'},
              {label:'Rotation',    value:`Day ${dayIdx+1}/8`,color:'#7c3aed'},
            ].map(s => (
              <div key={s.label} style={{background:'white',borderRadius:'10px',
                padding:'12px',textAlign:'center',border:'1px solid #e5e7eb'}}>
                <div style={{fontSize:'20px',fontWeight:'800',color:s.color}}>
                  {s.value}
                </div>
                <div style={{fontSize:'10px',color:'#9ca3af',textTransform:'uppercase',
                  letterSpacing:'0.06em',marginTop:'2px'}}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Per-pod schedule with sessions */}
          {todaySchedule.map(({pod, members, allPod, block1, block3,
                               b1info, b3info, personA, personB, status}) => {
            const absentHere = allPod.filter(m => absent.has(m.id))
            const short = members.length < 2
            const starts = blockStarts

            return (
              <div key={pod} style={{background:'white',borderRadius:'12px',
                border:'1px solid #e5e7eb',marginBottom:'10px',overflow:'hidden'}}>

                {/* Pod header */}
                <div style={{padding:'12px 16px',background:'#f9fafb',
                  borderBottom:'1px solid #e5e7eb',display:'flex',
                  alignItems:'center',gap:'8px'}}>
                  <span style={{fontSize:'12px',fontWeight:'700',
                    fontFamily:'monospace',color:'white',
                    background:'#374151',padding:'3px 10px',borderRadius:'6px'}}>
                    {pod}
                  </span>
                  {members.map(m => (
                    <span key={m.id} style={{padding:'4px 10px',borderRadius:'99px',
                      fontSize:'12px',fontWeight:'600',
                      background:'#dcfce7',color:'#16a34a',
                      border:'1px solid #86efac'}}>
                      {m.name}
                    </span>
                  ))}
                  {absentHere.map(m => (
                    <span key={m.id} style={{padding:'4px 10px',borderRadius:'99px',
                      fontSize:'12px',background:'#fee2e2',color:'#dc2626',
                      border:'1px solid #fca5a5',textDecoration:'line-through',
                      opacity:0.6}}>
                      {m.name}
                    </span>
                  ))}
                  {short && (
                    <span style={{marginLeft:'auto',padding:'3px 10px',
                      borderRadius:'99px',fontSize:'10px',fontWeight:'700',
                      fontFamily:'monospace',background:'#fee2e2',color:'#dc2626'}}>
                      SOLO — lead: reassign
                    </span>
                  )}
                  {status && (
                    <span style={{marginLeft:'auto',padding:'3px 10px',
                      borderRadius:'99px',fontSize:'10px',fontWeight:'700',
                      background:'#dcfce7',color:'#16a34a',fontFamily:'monospace'}}>
                      ACTIVE BLOCK {status.blockIndex+1}
                    </span>
                  )}
                </div>

                {/* Two blocks */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',
                  gap:'0',borderBottom:'none'}}>
                  {([[block1,b1info,starts[0]],[block3,b3info,starts[1]]] as
                    [string,typeof b1info,number][]).map(([stId,info,blockStart],bi) => {
                    const sessions = buildSessions(personA, personB, blockStart)
                    const isActiveBlock = status?.blockIndex === bi
                    const activeSession = isActiveBlock ? status?.sessionIndex : -1
                    const nextSt = bi === 0 ? STATION_INFO[block3] : null
                    const showWarn = isActiveBlock && status?.isWarning
                    const showAlertBlock = isActiveBlock && status?.isAlert

                    return (
                      <div key={bi} style={{
                        borderRight: bi===0 ? '1px solid #e5e7eb':'none',
                        background: isActiveBlock ? `${info.dot}08`:'white'}}>

                        {/* Block header */}
                        <div style={{padding:'10px 14px',
                          borderBottom:'1px solid #f3f4f6',
                          background: isActiveBlock ? `${info.dot}15`:'#fafafa'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'6px',
                            marginBottom:'3px'}}>
                            <div style={{width:'10px',height:'10px',borderRadius:'50%',
                              background:info.dot}}/>
                            <span style={{fontSize:'14px',fontWeight:'800'}}>
                              {info.label}
                            </span>
                            <span style={{fontSize:'11px',color:'#6b7280'}}>
                              — {info.task}
                            </span>
                          </div>
                          <div style={{fontSize:'10px',color:'#9ca3af',
                            fontFamily:'monospace'}}>
                            Block {bi+1} ·&nbsp;
                            {bi===0
                              ? (shift===1 ? '7:30 – 9:30 AM' : '10:30 AM – 12:30 PM')
                              : (shift===1 ? '1:00 – 3:00 PM'  : '2:00 – 4:00 PM')}
                            &nbsp;· 6 sessions × 18 min
                          </div>

                          {/* 10-min warning */}
                          {showWarn && nextSt && (
                            <div style={{marginTop:'6px',padding:'6px 10px',
                              background:'#fef3c7',borderRadius:'6px',
                              border:'1px solid #fde68a',fontSize:'11px',
                              color:'#92400e',fontWeight:'600'}}>
                              ⚠️ 10 min remaining · Next →&nbsp;
                              {nextSt.label} ({nextSt.task})
                            </div>
                          )}
                          {showAlertBlock && nextSt && (
                            <div style={{marginTop:'6px',padding:'6px 10px',
                              background:'#fee2e2',borderRadius:'6px',
                              border:'1px solid #fca5a5',fontSize:'11px',
                              color:'#dc2626',fontWeight:'700'}}>
                              🚨 6 MIN — Move to {nextSt.label} NOW
                            </div>
                          )}
                        </div>

                        {/* Session rows */}
                        <div style={{padding:'8px 14px'}}>
                          {sessions.map((s, si) => {
                            const isCurrentSession = si === activeSession
                            const isPast = isActiveBlock && si < (activeSession ?? -1)
                            const isPerson = s.isPerson
                            return (
                              <div key={si} style={{display:'flex',alignItems:'center',
                                gap:'8px',padding:'5px 8px',borderRadius:'6px',
                                marginBottom:'2px',
                                background: isCurrentSession
                                  ? `${info.dot}20`
                                  : isPast ? '#f3f4f6':'transparent',
                                border: isCurrentSession
                                  ? `1px solid ${info.dot}`
                                  : '1px solid transparent'}}>

                                {/* Session number */}
                                <div style={{width:'20px',height:'20px',
                                  borderRadius:'50%',display:'flex',
                                  alignItems:'center',justifyContent:'center',
                                  fontSize:'9px',fontWeight:'700',
                                  background: isCurrentSession ? info.dot
                                    : isPast ? '#d1d5db':'#e5e7eb',
                                  color: isCurrentSession ? 'white'
                                    : isPast ? '#6b7280':'#9ca3af',
                                  flexShrink:0}}>
                                  {s.session}
                                </div>

                                {/* Time range */}
                                <div style={{fontSize:'10px',fontFamily:'monospace',
                                  color: isCurrentSession ? '#374151':'#9ca3af',
                                  minWidth:'100px'}}>
                                  {s.startTime} – {s.endTime}
                                </div>

                                {/* Person badge */}
                                <div style={{display:'flex',alignItems:'center',
                                  gap:'4px'}}>
                                  <span style={{fontSize:'9px',fontWeight:'700',
                                    padding:'1px 5px',borderRadius:'4px',
                                    background: isPerson==='A' ? '#dbeafe':'#fce7f3',
                                    color: isPerson==='A' ? '#1d4ed8':'#be185d'}}>
                                    {isPerson}
                                  </span>
                                  <span style={{fontSize:'11px',fontWeight:
                                    isCurrentSession ? '700':'500',
                                    color: isCurrentSession ? '#111827':'#374151'}}>
                                    {s.person}
                                  </span>
                                  {isCurrentSession && (
                                    <span style={{fontSize:'9px',
                                      background:'#dcfce7',color:'#16a34a',
                                      padding:'1px 5px',borderRadius:'4px',
                                      fontWeight:'700',fontFamily:'monospace'}}>
                                      NOW
                                    </span>
                                  )}
                                  {isPast && (
                                    <span style={{fontSize:'9px',color:'#9ca3af'}}>
                                      ✓
                                    </span>
                                  )}
                                </div>
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
                  const isLead = currentUser?.role==='LEAD'
                  return (
                    <div key={m.id} onClick={() => isLead && toggle(m.id)}
                      style={{display:'flex',alignItems:'center',gap:'6px',
                        padding:'6px 10px',borderRadius:'8px',
                        border:`1px solid ${out?'#fca5a5':'#e5e7eb'}`,
                        background: out?'#fef2f2':'#f9fafb',
                        cursor: isLead?'pointer':'default'}}>
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
                        <div style={{fontSize:'10px',color:'#9ca3af'}}>
                          {m.pod||role}
                        </div>
                      </div>
                      <span style={{padding:'2px 7px',borderRadius:'99px',
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

      {/* ── ROTATION TAB ────────────────────────────────────────────────────── */}
      {tab === 'rotation' && (
        <div>
          <div style={{background:'white',borderRadius:'12px',
            border:'1px solid #e5e7eb',padding:'16px',marginBottom:'12px'}}>
            <div style={{fontSize:'13px',fontWeight:'700',marginBottom:'4px'}}>
              8-Day Station Rotation · Shift {shift}
            </div>
            <div style={{fontSize:'12px',color:'#6b7280',marginBottom:'16px'}}>
              Every pair visits every station within 8 working days.
              Advances automatically at midnight — no manual updates needed.
            </div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px'}}>
                <thead>
                  <tr style={{background:'#f9fafb'}}>
                    <th style={{padding:'8px 10px',textAlign:'left',
                      border:'1px solid #e5e7eb',color:'#6b7280',
                      fontFamily:'monospace'}}>Day</th>
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
                    const rot  = shift===1 ? ROTATION_S1[String(i)] : ROTATION_S2[String(i)]
                    const pods = shift===1 ? ['P1','P2','P3','P4'] : ['PA','PB','PC','PD']
                    const isToday = i === dayIdx
                    return (
                      <tr key={i} style={{
                        background: isToday ? '#eff6ff' : i%2===0 ? 'white':'#f9fafb'}}>
                        <td style={{padding:'8px 10px',border:'1px solid #e5e7eb',
                          fontWeight: isToday?'800':'500',fontFamily:'monospace',
                          color: isToday?'#1d4ed8':'#374151'}}>
                          Day {i+1}
                          {isToday && (
                            <span style={{marginLeft:'6px',fontSize:'9px',
                              background:'#3b82f6',color:'white',
                              padding:'1px 6px',borderRadius:'4px'}}>
                              TODAY
                            </span>
                          )}
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
                                  fontWeight:'700',fontSize:'10px'}}>
                                  {i1.label}
                                </span>
                                <span style={{fontSize:'9px',color:'#9ca3af'}}>→</span>
                                <span style={{padding:'2px 6px',borderRadius:'4px',
                                  background:`${i3.dot}22`,color:i3.dot,
                                  fontWeight:'700',fontSize:'10px'}}>
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
            border:'1px solid #bfdbfe',fontSize:'12px',color:'#1e40af',lineHeight:1.6}}>
            <strong>How alerts work:</strong> At 110 minutes into a block, a yellow
            warning banner appears showing your next station. At 114 minutes (6 min left),
            a red pulsing alert fires at the top of every screen telling you to move now.
            The clock in the header updates every second so everyone stays in sync.
          </div>
        </div>
      )}
    </div>
  )
}
