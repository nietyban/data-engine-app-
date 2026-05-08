'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

// ─── SUPABASE ────────────────────────────────────────────────────────────────
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || !url.startsWith('http')) return null
  return createClient(url, key)
}
const supabase = typeof window !== 'undefined' ? getSupabase() : null

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
    {id:'yban', name:'Yban Nieto', role:'SUPER_ADMIN', shift:1, pod:null},
    {id:'guest', name:'Guest / Observer', role:'GUEST', shift:1, pod:null},
  ],
  s2: [
    {id:'dg',  name:'David Grande',         role:'LEAD', shift:2, pod:'PD'},
    {id:'kn',  name:'Kyria Nelum',          role:'DC',   shift:2, pod:'PA'},
    {id:'eb',  name:'Ethan Baltazar',       role:'DC',   shift:2, pod:'PA'},
    {id:'fl',  name:'Flora Li',             role:'DC',   shift:2, pod:'PB'},
    {id:'ab',  name:'Andrew Bremond',       role:'DC',   shift:2, pod:'PB'},
    {id:'ms',  name:'Michael Soebroto',     role:'DC',   shift:2, pod:'PC'},
    {id:'lv',  name:'Lavanya',              role:'DC',   shift:2, pod:'PC'},
    {id:'lf',  name:'Lucca F',             role:'DC',   shift:2, pod:'PD'},
    {id:'tc',  name:'Tracy Corleone',       role:'DA',   shift:2, pod:null},
    {id:'as2', name:'Aarushi Sharma',       role:'DA',   shift:2, pod:null},
    {id:'jc',  name:'Julian Cruz',          role:'DA',   shift:2, pod:null},
    {id:'al',  name:'Aaliyah',              role:'DA',   shift:2, pod:null},
    {id:'rrp', name:'Rathinapriya Ramjagan',role:'DA',   shift:2, pod:null},
    {id:'rr',  name:'Rashila Ravichandran', role:'LEAD', shift:2, pod:null},
    {id:'yban2', name:'Yban Nieto', role:'SUPER_ADMIN', shift:2, pod:null},
    {id:'guest2',name:'Guest / Observer',   role:'GUEST',shift:2, pod:null},
  ]
}
const ALL_PEOPLE = [...ROSTER.s1, ...ROSTER.s2]

// ─── STATION INFO ─────────────────────────────────────────────────────────────
const STATION_INFO: Record<string,{label:string,task:string,dot:string,shift:'s1'|'s2'|'both',solo:boolean}> = {
  ymc1: {label:'YMC 1', task:'Policy Eval (Asana)', dot:'#4f9eff', shift:'s1', solo:false},
  ymc2: {label:'YMC 2', task:'LEGO Stacking',       dot:'#f59e0b', shift:'s1', solo:false},
  ymc3: {label:'YMC 3', task:'Tote Stack HITL',     dot:'#2dd4bf', shift:'s1', solo:false},
  ymc4: {label:'YMC 4', task:'Pill Bottle Ext',     dot:'#f472b6', shift:'s1', solo:false},
  ymc7: {label:'YMC 7', task:'Tshirt Fold Teleop',  dot:'#a78bfa', shift:'s2', solo:false},
  g1:   {label:'G1',    task:'Robot Collection',    dot:'#22c55e', shift:'s2', solo:false},
  uc1:  {label:'UMI C1',task:'Pill Bottle Scan',    dot:'#7dd3fc', shift:'s2', solo:true},
  uc2:  {label:'UMI C2',task:'Fish Picking Demo',   dot:'#86efac', shift:'s2', solo:true},
}

// ─── 1ST SHIFT SCHEDULE ───────────────────────────────────────────────────────
// Stations: YMC1 YMC2 YMC3 YMC4 (always 1st shift)
// Cross-training: during 11AM-1PM overlap, some DCs rotate to YMC7/G1/UMI
//
// Block 1: 7:00-9:00  Block 2: 9:00-11:00  Block 4: 1:00-3:00
// Lunch staggered: Person A 11:00-11:30, Person B 11:30-12:00 (within pair)
//   then:         Person A 12:00-12:30, Person B 12:30-1:00 (second pair group)
//
// Cross-train slots (11AM-1PM):
//   11:00-12:00: P3+P4 cover solo on their stations (P1+P2 at lunch)
//                P3 cross-trains to YMC7 during their half-lunch
//                P4 cross-trains to G1 during their half-lunch
//   12:00-1:00:  P1+P2 back, cover solo
//                P1 cross-trains to UMI-C1 during their half-lunch
//                P2 cross-trains to UMI-C2 during their half-lunch

// 8-day rotation for 1st shift — each pod gets different starting YMC each day
// Format: [block1_station, block2_station, crossTrain_station, block4_station]
const ROTATION_S1: Record<string,Record<string,[string,string,string,string]>> = {
  '0': { P1:['ymc1','ymc2','uc1','ymc3'],  P2:['ymc2','ymc3','uc2','ymc4'],  P3:['ymc3','ymc4','ymc7','ymc1'],  P4:['ymc4','ymc1','g1','ymc2']  },
  '1': { P1:['ymc2','ymc3','uc1','ymc4'],  P2:['ymc3','ymc4','uc2','ymc1'],  P3:['ymc4','ymc1','ymc7','ymc2'],  P4:['ymc1','ymc2','g1','ymc3']  },
  '2': { P1:['ymc3','ymc4','uc1','ymc1'],  P2:['ymc4','ymc1','uc2','ymc2'],  P3:['ymc1','ymc2','ymc7','ymc3'],  P4:['ymc2','ymc3','g1','ymc4']  },
  '3': { P1:['ymc4','ymc1','uc1','ymc2'],  P2:['ymc1','ymc2','uc2','ymc3'],  P3:['ymc2','ymc3','ymc7','ymc4'],  P4:['ymc3','ymc4','g1','ymc1']  },
  '4': { P1:['ymc1','ymc3','g1','ymc4'],   P2:['ymc2','ymc4','ymc7','ymc1'], P3:['ymc3','ymc1','uc1','ymc2'],   P4:['ymc4','ymc2','uc2','ymc3'] },
  '5': { P1:['ymc2','ymc4','g1','ymc1'],   P2:['ymc3','ymc1','ymc7','ymc2'], P3:['ymc4','ymc2','uc1','ymc3'],   P4:['ymc1','ymc3','uc2','ymc4'] },
  '6': { P1:['ymc3','ymc1','g1','ymc2'],   P2:['ymc4','ymc2','ymc7','ymc3'], P3:['ymc1','ymc3','uc1','ymc4'],   P4:['ymc2','ymc4','uc2','ymc1'] },
  '7': { P1:['ymc4','ymc2','g1','ymc3'],   P2:['ymc1','ymc3','ymc7','ymc4'], P3:['ymc2','ymc4','uc1','ymc1'],   P4:['ymc3','ymc1','uc2','ymc2'] },
}

// Lunch schedule for 1st shift (staggered within pairs so station always manned)
// Lunch A group (11:00-12:00): P1 PersonA 11:00-11:30, P1 PersonB 11:30-12:00
//                              P2 PersonA 11:00-11:30, P2 PersonB 11:30-12:00
// Lunch B group (12:00-1:00):  P3 PersonA 12:00-12:30, P3 PersonB 12:30-1:00
//                              P4 PersonA 12:00-12:30, P4 PersonB 12:30-1:00
const LUNCH_GROUPS_S1: Record<string,{window:string,note:string}> = {
  P1: {window:'11:00 AM – 12:00 PM', note:'Person A 11:00-11:30 · Person B 11:30-12:00'},
  P2: {window:'11:00 AM – 12:00 PM', note:'Person A 11:00-11:30 · Person B 11:30-12:00'},
  P3: {window:'12:00 PM – 1:00 PM',  note:'Person A 12:00-12:30 · Person B 12:30-1:00'},
  P4: {window:'12:00 PM – 1:00 PM',  note:'Person A 12:00-12:30 · Person B 12:30-1:00'},
}

// ─── 2ND SHIFT SCHEDULE ───────────────────────────────────────────────────────
// Stations: YMC7 G1 UMI-C1 UMI-C2 (always 2nd shift)
// No QA — start data collection at 10:00 AM
// UMI stations = 1 person each (Person A on C1, Person B on C2 when pod assigned UMI)
//
// Block 1: 10:00-12:00
// Lunch C1 (12:00-1:00): PA+PB — Person A first half, Person B second half
// Lunch C2 (1:00-2:00):  PC+PD — Person A first half, Person B second half
// Block 2: 12:00-2:00 (staggered around lunch per pod)
// Block 3: 2:00-4:00  Block 4: 4:00-6:00

const ROTATION_S2: Record<string,Record<string,[string,string,string,string]>> = {
  '0': { PA:['ymc7','ymc7','g1','uc1'],    PB:['g1','g1','ymc7','uc2'],     PC:['uc1','uc2','ymc7','g1'],    PD:['uc2','uc1','g1','ymc7']  },
  '1': { PA:['g1','g1','ymc7','uc1'],      PB:['uc1','uc2','g1','ymc7'],    PC:['ymc7','ymc7','uc1','g1'],   PD:['uc2','uc1','ymc7','g1']  },
  '2': { PA:['uc1','uc2','g1','ymc7'],     PB:['ymc7','ymc7','uc1','g1'],   PC:['g1','g1','ymc7','uc1'],     PD:['uc2','uc1','g1','ymc7']  },
  '3': { PA:['uc2','uc1','ymc7','g1'],     PB:['g1','g1','uc1','ymc7'],     PC:['ymc7','ymc7','g1','uc1'],   PD:['uc1','uc2','ymc7','g1']  },
  '4': { PA:['ymc7','g1','uc1','uc2'],     PB:['g1','ymc7','uc2','uc1'],    PC:['uc1','uc2','g1','ymc7'],    PD:['uc2','uc1','ymc7','g1']  },
  '5': { PA:['g1','ymc7','uc2','uc1'],     PB:['ymc7','g1','uc1','uc2'],    PC:['uc2','uc1','ymc7','g1'],    PD:['uc1','uc2','g1','ymc7']  },
  '6': { PA:['uc1','ymc7','g1','uc2'],     PB:['uc2','g1','ymc7','uc1'],    PC:['g1','uc1','uc2','ymc7'],    PD:['ymc7','uc2','uc1','g1']  },
  '7': { PA:['uc2','g1','ymc7','uc1'],     PB:['uc1','ymc7','g1','uc2'],    PC:['g1','uc2','uc1','ymc7'],    PD:['ymc7','uc1','uc2','g1']  },
}

// ─── PIN HELPERS ─────────────────────────────────────────────────────────────
const DEFAULT_PIN = '0000'
function getPin(staffId: string): string {
  if (staffId==='guest'||staffId==='guest2') return '1234'
  if (staffId==='yban'||staffId==='yban2') {
    if (typeof window==='undefined') return '20131990'
    return localStorage.getItem(`pin_${staffId}`)||'20131990'
  }
  if (typeof window==='undefined') return DEFAULT_PIN
  return localStorage.getItem(`pin_${staffId}`)||DEFAULT_PIN
}
function isDefaultPin(staffId: string): boolean { return getPin(staffId)===DEFAULT_PIN }
function setPin(staffId: string, pin: string): void {
  if (typeof window==='undefined') return
  localStorage.setItem(`pin_${staffId}`, pin)
}
function isGuest(staffId: string|null): boolean {
  return staffId==='guest'||staffId==='guest2'
}
function isSuperAdmin(staffId: string|null): boolean {
  return staffId==='yban'||staffId==='yban2'
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getDayIndex() {
  const now=new Date(), start=new Date(now.getFullYear(),0,0)
  return Math.floor((now.getTime()-start.getTime())/86400000)%8
}
function getToday() { return new Date().toISOString().split('T')[0] }
function getClockTime() {
  return new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'})
}
function getCalendarDate() {
  return new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})
}
function formatMin(m: number) {
  const h=Math.floor(m/60), min=m%60, ampm=h>=12?'PM':'AM'
  const hour=h>12?h-12:h===0?12:h
  return `${hour}:${min.toString().padStart(2,'0')} ${ampm}`
}

function buildSessions(personA:string, personB:string, blockStartMin:number, durationHrs:number) {
  const SESSION=18, total=Math.floor(durationHrs*60/SESSION)
  return Array.from({length:total},(_,i)=>{
    const startMin=blockStartMin+i*SESSION, endMin=startMin+SESSION
    const isPerson=i%2===0?'A':'B', person=isPerson==='A'?personA:personB
    return {session:i+1,person,isPerson,startMin,endMin,
            startTime:formatMin(startMin),endTime:formatMin(endMin)}
  })
}

function getBlockAlert(blockStartMin:number, blockDurHrs:number, nextStation:string|null) {
  const nowMin=new Date().getHours()*60+new Date().getMinutes()
  const elapsed=nowMin-blockStartMin, remaining=(blockStartMin+blockDurHrs*60)-nowMin
  if (elapsed<0||elapsed>=blockDurHrs*60) return null
  return {elapsed,remaining,sessionIndex:Math.floor(elapsed/18),personTurn:Math.floor(elapsed/18)%2,
          isWarning:remaining<=10&&remaining>6&&!!nextStation,
          isAlert:remaining<=6&&!!nextStation,nextStation}
}

// ─── ROBOT DECORATIONS ────────────────────────────────────────────────────────
function RobotBg() {
  const robots=[
    {x:'3%',y:'6%',s:60,o:0.09,f:false},{x:'87%',y:'4%',s:50,o:0.08,f:true},
    {x:'5%',y:'55%',s:45,o:0.07,f:false},{x:'91%',y:'50%',s:55,o:0.07,f:true},
    {x:'45%',y:'1%',s:38,o:0.06,f:false},{x:'20%',y:'88%',s:44,o:0.06,f:false},
    {x:'75%',y:'82%',s:48,o:0.06,f:true},{x:'60%',y:'35%',s:32,o:0.04,f:false},
  ]
  return (
    <div style={{position:'fixed',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
      {robots.map((r,i)=>(
        <div key={i} style={{position:'absolute',left:r.x,top:r.y,opacity:r.o,
          transform:r.f?'scaleX(-1)':'none',userSelect:'none',pointerEvents:'none'}}>
          <svg width={r.s} height={r.s*1.4} viewBox="0 0 40 56" fill="none">
            <rect x="10" y="2" width="20" height="16" rx="4" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="1.5"/>
            <line x1="20" y1="2" x2="20" y2="-3" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="20" cy="-4" r="2" fill="#60a5fa"/>
            <circle cx="15" cy="9" r="3" fill="#bfdbfe"/><circle cx="15" cy="9" r="1.5" fill="#1d4ed8"/>
            <circle cx="25" cy="9" r="3" fill="#bfdbfe"/><circle cx="25" cy="9" r="1.5" fill="#1d4ed8"/>
            <rect x="14" y="14" width="12" height="2" rx="1" fill="#60a5fa"/>
            <rect x="18" y="18" width="4" height="3" fill="#3b82f6"/>
            <rect x="8" y="21" width="24" height="20" rx="4" fill="#2563eb" stroke="#3b82f6" strokeWidth="1.5"/>
            <rect x="13" y="25" width="14" height="8" rx="2" fill="#1d4ed8"/>
            <circle cx="17" cy="29" r="2" fill="#60a5fa"/><circle cx="23" cy="29" r="2" fill="#22c55e"/>
            <rect x="1" y="22" width="7" height="14" rx="3" fill="#2563eb" stroke="#3b82f6" strokeWidth="1"/>
            <rect x="32" y="22" width="7" height="14" rx="3" fill="#2563eb" stroke="#3b82f6" strokeWidth="1"/>
            <circle cx="4.5" cy="38" r="3" fill="#3b82f6"/><circle cx="35.5" cy="38" r="3" fill="#3b82f6"/>
            <rect x="12" y="41" width="7" height="13" rx="3" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="1"/>
            <rect x="21" y="41" width="7" height="13" rx="3" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="1"/>
            <rect x="10" y="51" width="11" height="4" rx="2" fill="#3b82f6"/>
            <rect x="19" y="51" width="11" height="4" rx="2" fill="#3b82f6"/>
          </svg>
        </div>
      ))}
    </div>
  )
}

const COLORS: Record<string,string[]> = {
  LEAD:['#E6F1FB','#0C447C'], DC:['#EAF3DE','#3B6D11'], DA:['#F1EFE8','#5F5E5A'],
  GUEST:['#F3F4F6','#6B7280'], SUPER_ADMIN:['#F3E8FF','#7C3AED']
}

// ─── REAL-TIME ATTENDANCE HOOK ────────────────────────────────────────────────
function useRealtimeAttendance() {
  const today = getToday()
  const [absentIds, setAbsentIds] = useState<Set<string>>(new Set(['gr']))
  const [loading, setLoading] = useState(true)
  const [synced, setSynced] = useState(false)
  const [vacationMap, setVacationMap] = useState<Record<string,{start:string,end:string,id:string}[]>>({})

  // Load attendance from Supabase on mount — ALWAYS read DB first
  useEffect(()=>{
    async function load() {
      setLoading(true)
      try {
        if (!supabase) { setLoading(false); return }
        // Ensure rows exist first
        const rows = ALL_PEOPLE.filter(p=>p.id!=='gr'&&!isGuest(p.id)).map(p=>({
          staff_id:p.id, shift_date:today, status:'present'
        }))
        await supabase.from('attendance').upsert(rows,{onConflict:'staff_id,shift_date',ignoreDuplicates:true})
        // Now fetch current state
        const {data} = await supabase.from('attendance').select('staff_id,status').eq('shift_date',today)
        if (data && data.length>0) {
          const absent = new Set(data.filter((r:any)=>r.status==='absent').map((r:any)=>r.staff_id))
          absent.add('gr')
          setAbsentIds(absent)
          setSynced(true)
        }
        // Load vacation
        const {data:vacData} = await supabase.from('time_off').select('id,staff_id,start_date,end_date').gte('end_date',today)
        if (vacData) {
          const vmap: Record<string,{start:string,end:string,id:string}[]> = {}
          vacData.forEach((v:any)=>{
            if (!vmap[v.staff_id]) vmap[v.staff_id]=[]
            vmap[v.staff_id].push({start:v.start_date,end:v.end_date,id:v.id})
          })
          setVacationMap(vmap)
        }
      } catch(e){ console.error(e) }
      finally { setLoading(false) }
    }
    load()
  },[today])

  // Real-time subscription
  useEffect(()=>{
    if (!supabase) return
    const channel = supabase.channel(`att-${today}`)
      .on('postgres_changes',{event:'*',schema:'public',table:'attendance',filter:`shift_date=eq.${today}`},
        async()=>{
          const {data} = await supabase!.from('attendance').select('staff_id,status').eq('shift_date',today)
          if (data) {
            const absent = new Set(data.filter((r:any)=>r.status==='absent').map((r:any)=>r.staff_id))
            absent.add('gr')
            setAbsentIds(new Set(absent))
          }
        }
      ).subscribe()
    return ()=>{ supabase!.removeChannel(channel) }
  },[today])

  const toggle = useCallback(async(staffId:string, markedBy:string)=>{
    const newStatus = absentIds.has(staffId)?'present':'absent'
    setAbsentIds(prev=>{ const n=new Set(prev); newStatus==='absent'?n.add(staffId):n.delete(staffId); return n })
    if (!supabase) return
    try {
      await supabase.from('attendance').upsert(
        {staff_id:staffId,shift_date:today,status:newStatus,marked_by:markedBy,marked_at:new Date().toISOString()},
        {onConflict:'staff_id,shift_date'}
      )
    } catch(e) {
      // Revert on error
      setAbsentIds(prev=>{ const n=new Set(prev); newStatus==='absent'?n.delete(staffId):n.add(staffId); return n })
    }
  },[absentIds,today])

  const bookTimeOff = useCallback(async(staffId:string, startDate:string, endDate:string)=>{
    if (!supabase) return
    await supabase.from('time_off').insert({staff_id:staffId,start_date:startDate,end_date:endDate})
    const rows=[];const cur=new Date(startDate);const end=new Date(endDate)
    while(cur<=end){
      rows.push({staff_id:staffId,shift_date:cur.toISOString().split('T')[0],status:'absent',marked_by:staffId,marked_at:new Date().toISOString(),notes:'scheduled time off'})
      cur.setDate(cur.getDate()+1)
    }
    await supabase.from('attendance').upsert(rows,{onConflict:'staff_id,shift_date'})
    const {data:vacData} = await supabase.from('time_off').select('id,staff_id,start_date,end_date').gte('end_date',today)
    if (vacData) {
      const vmap: Record<string,{start:string,end:string,id:string}[]>={}
      vacData.forEach((v:any)=>{ if(!vmap[v.staff_id])vmap[v.staff_id]=[]; vmap[v.staff_id].push({start:v.start_date,end:v.end_date,id:v.id}) })
      setVacationMap(vmap)
    }
    if (startDate<=today&&today<=endDate) setAbsentIds(prev=>{ const n=new Set(prev); n.add(staffId); return n })
  },[today])

  const cancelTimeOff = useCallback(async(id:string,staffId:string,start:string,end:string)=>{
    if (!supabase) return
    await supabase.from('time_off').delete().eq('id',id)
    const cur=new Date(start);const endD=new Date(end)
    while(cur<=endD){
      await supabase.from('attendance').upsert({staff_id:staffId,shift_date:cur.toISOString().split('T')[0],status:'present',marked_by:staffId,marked_at:new Date().toISOString()},{onConflict:'staff_id,shift_date'})
      cur.setDate(cur.getDate()+1)
    }
    setVacationMap(prev=>{ const n={...prev}; if(n[staffId])n[staffId]=n[staffId].filter(v=>v.id!==id); return n })
    if (start<=today&&today<=end) setAbsentIds(prev=>{ const n=new Set(prev); n.delete(staffId); return n })
  },[today])

  return {absentIds,loading,synced,toggle,vacationMap,bookTimeOff,cancelTimeOff}
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [shift,         setShift]        = useState<1|2>(1)
  const [tab,           setTab]          = useState<string>('mine')
  const [selectedUser,  setSelectedUser] = useState<string|null>(null)
  const [loggedIn,      setLoggedIn]     = useState(false)
  const [clock,         setClock]        = useState(getClockTime())
  const [pinStep,       setPinStep]      = useState(false)
  const [pinInput,      setPinInput]     = useState('')
  const [pinError,      setPinError]     = useState('')
  const [pinAttempts,   setPinAttempts]  = useState(0)
  const [pinLocked,     setPinLocked]    = useState(false)
  const [pinLockUntil,  setPinLockUntil] = useState<number|null>(null)
  const [showSetPin,    setShowSetPin]   = useState(false)
  const [newPin,        setNewPin]       = useState('')
  const [newPinConfirm, setNewPinConfirm]= useState('')
  const [pinSetMsg,     setPinSetMsg]    = useState('')
  const [showTimeOff,   setShowTimeOff]  = useState(false)
  const [toStart,       setToStart]      = useState('')
  const [toEnd,         setToEnd]        = useState('')
  const [toMsg,         setToMsg]        = useState('')

  const {absentIds,loading,synced,toggle,vacationMap,bookTimeOff,cancelTimeOff} = useRealtimeAttendance()
  const [overrides, setOverrides] = useState<Record<string,string>>({}) // pod_blockIdx -> staffId override
  const [notifications, setNotifications] = useState<{id:string,msg:string,time:number}[]>([])
  const [showReassign, setShowReassign] = useState<string|null>(null) // pod key being manually reassigned

  useEffect(()=>{ const t=setInterval(()=>setClock(getClockTime()),1000); return ()=>clearInterval(t) },[])

  const pool       = ROSTER[`s${shift}` as 's1'|'s2']
  const dayIdx     = getDayIndex()
  const dayStr     = String(dayIdx)
  const rotation   = shift===1 ? ROTATION_S1[dayStr] : ROTATION_S2[dayStr]
  const currentUser = selectedUser ? ALL_PEOPLE.find(m=>m.id===selectedUser) : null
  const myPod      = currentUser?.pod || null
  const presentDCs = pool.filter(m=>m.role==='DC'&&!absentIds.has(m.id)).length
  const absentDCs  = pool.filter(m=>m.role==='DC'&&absentIds.has(m.id)).length
  const presentDAs = pool.filter(m=>m.role==='DA'&&!absentIds.has(m.id)).length

  // Get my today's stations
  const myStations = myPod && rotation ? rotation[myPod] : null

  // Build my personal timeline
  function buildMyTimeline() {
    if (!myStations || !currentUser) return []
    const [b1,b2,cross,b4] = myStations
    const isS1 = currentUser.shift===1
    const lunchGroup = isS1 ? (myPod==='P1'||myPod==='P2'?'A':'B') : 'C'
    // 2nd shift: PA+PB lunch 12-1, PC+PD lunch 1-2
    const s2LunchGroup = (myPod==='PA'||myPod==='PB') ? 'C1' : 'C2'
    const lunchWindow = isS1
      ? (lunchGroup==='A' ? '11:00 AM – 12:00 PM' : '12:00 PM – 1:00 PM')
      : (s2LunchGroup==='C1' ? '12:00 – 1:00 PM' : '1:00 – 2:00 PM')
    const lunchNote = isS1
      ? 'Staggered: Person A first half, Person B second half'
      : (s2LunchGroup==='C1'
        ? 'Person A 12:00-12:30 · Person B 12:30-1:00'
        : 'Person A 1:00-1:30 · Person B 1:30-2:00')
    const isCrossUMI = cross==='uc1'||cross==='uc2'
    const crossNote = isCrossUMI ? '(solo - cross-training)' : '(cross-train with 2nd shift station)'

    if (isS1) return [
      {type:'block',label:'Block 1',station:b1,timeLabel:'7:00 – 9:00 AM',startMin:7*60,durHrs:2,isCross:false,isSolo:false},
      {type:'block',label:'Block 2',station:b2,timeLabel:'9:00 – 11:00 AM',startMin:9*60,durHrs:2,isCross:false,isSolo:false},
      {type:'lunch',label:`Lunch ${lunchGroup}`,station:'',timeLabel:lunchWindow,note:lunchNote,startMin:lunchGroup==='A'?11*60:12*60,durHrs:1,isCross:false,isSolo:false},
      {type:'cross',label:'Cross-Train',station:cross,timeLabel:lunchGroup==='A'?'During 11AM-12PM':'During 12PM-1PM',startMin:lunchGroup==='A'?11*60:12*60,durHrs:1,isCross:true,isSolo:true,note:crossNote},
      {type:'block',label:'Block 4',station:b4,timeLabel:'1:00 – 3:00 PM',startMin:13*60,durHrs:2,isCross:false,isSolo:false},
    ]
    else if (s2LunchGroup==='C1') return [
      {type:'block',label:'Block 1',station:b1,timeLabel:'10:00 AM – 12:00 PM',startMin:10*60,durHrs:2,isCross:false,isSolo:b1==='uc1'||b1==='uc2'},
      {type:'lunch',label:'Lunch C1',station:'',timeLabel:'12:00 – 1:00 PM',note:lunchNote,startMin:12*60,durHrs:1,isCross:false,isSolo:false},
      {type:'block',label:'Block 2',station:b2,timeLabel:'1:00 – 2:00 PM (post-lunch)',startMin:13*60,durHrs:1,isCross:false,isSolo:b2==='uc1'||b2==='uc2'},
      {type:'block',label:'Block 3',station:cross,timeLabel:'2:00 – 4:00 PM',startMin:14*60,durHrs:2,isCross:false,isSolo:cross==='uc1'||cross==='uc2'},
      {type:'block',label:'Block 4',station:b4,timeLabel:'4:00 – 6:00 PM',startMin:16*60,durHrs:2,isCross:false,isSolo:b4==='uc1'||b4==='uc2'},
    ]
    else return [
      {type:'block',label:'Block 1',station:b1,timeLabel:'10:00 AM – 12:00 PM',startMin:10*60,durHrs:2,isCross:false,isSolo:b1==='uc1'||b1==='uc2'},
      {type:'block',label:'Block 2',station:b2,timeLabel:'12:00 – 1:00 PM (pre-lunch)',startMin:12*60,durHrs:1,isCross:false,isSolo:b2==='uc1'||b2==='uc2'},
      {type:'lunch',label:'Lunch C2',station:'',timeLabel:'1:00 – 2:00 PM',note:lunchNote,startMin:13*60,durHrs:1,isCross:false,isSolo:false},
      {type:'block',label:'Block 3',station:cross,timeLabel:'2:00 – 4:00 PM',startMin:14*60,durHrs:2,isCross:false,isSolo:cross==='uc1'||cross==='uc2'},
      {type:'block',label:'Block 4',station:b4,timeLabel:'4:00 – 6:00 PM',startMin:16*60,durHrs:2,isCross:false,isSolo:b4==='uc1'||b4==='uc2'},
    ]
  }

  const myTimeline = buildMyTimeline()

  // Build team schedule for leads
  function buildTeamSchedule() {
    const pods = shift===1 ? ['P1','P2','P3','P4'] : ['PA','PB','PC','PD']
    return pods.map(pod=>{
      const ps = rotation?.[pod] as [string,string,string,string]|undefined
      if (!ps) return null
      const members = pool.filter(m=>m.pod===pod&&!absentIds.has(m.id))
      const allPod  = pool.filter(m=>m.pod===pod)
      const absentHere = allPod.filter(m=>absentIds.has(m.id))
      const personA = members[0]?.name.split(' ')[0]??'?'
      const personB = members[1]?.name.split(' ')[0]??'(solo)'
      const isSolo  = members.length<2

      const blocks = shift===1 ? [
        {label:'Block 1',station:ps[0],timeLabel:'7:00-9:00 AM',startMin:7*60,durHrs:2,isCross:false},
        {label:'Block 2',station:ps[1],timeLabel:'9:00-11:00 AM',startMin:9*60,durHrs:2,isCross:false},
        {label:'Cross-Train',station:ps[2],timeLabel:'11AM-1PM (during lunch)',startMin:11*60,durHrs:1,isCross:true},
        {label:'Block 4',station:ps[3],timeLabel:'1:00-3:00 PM',startMin:13*60,durHrs:2,isCross:false},
      ] : [
        {label:'Block 1',station:ps[0],timeLabel:'10:00AM-12:00PM',startMin:10*60,durHrs:2,isCross:false},
        {label:'Block 2',station:ps[1],timeLabel:'12:00-1:00PM',startMin:12*60,durHrs:1,isCross:false},
        {label:'Block 3',station:ps[2],timeLabel:'2:00-4:00PM',startMin:14*60,durHrs:2,isCross:false},
        {label:'Block 4',station:ps[3],timeLabel:'4:00-6:00PM',startMin:16*60,durHrs:2,isCross:false},
      ]
      return {pod,members,allPod,absentHere,personA,personB,isSolo,blocks}
    }).filter(Boolean)
  }

  // ── AUTO-ASSIGN ENGINE ───────────────────────────────────────────────────────
  // When a station pair has 0 present members, find best available DC to cover
  function getAutoAssignments(): Record<string,{pod:string,station:string,assignee:typeof ALL_PEOPLE[0],blockLabel:string}[]> {
    const nowMinutes = new Date().getHours()*60+new Date().getMinutes()
    const result: Record<string,{pod:string,station:string,assignee:typeof ALL_PEOPLE[0],blockLabel:string}[]> = {}

    const s1pods = ['P1','P2','P3','P4']
    const s2pods = ['PA','PB','PC','PD']
    const allPods = [...s1pods,...s2pods]

    allPods.forEach(pod => {
      const podShift = s1pods.includes(pod) ? 1 : 2
      const podPool = ROSTER[`s${podShift}` as 's1'|'s2']
      const rot = podShift===1 ? ROTATION_S1[dayStr] : ROTATION_S2[dayStr]
      if (!rot?.[pod]) return

      const podMembers = podPool.filter(m=>m.pod===pod)
      const presentMembers = podMembers.filter(m=>!absentIds.has(m.id))
      if (presentMembers.length > 0) return // station is covered

      // Station is empty — find someone to cover
      const stations = rot[pod] as string[]
      const blocks = podShift===1
        ? [{idx:0,startMin:7*60,endMin:9*60,label:'Block 1'},{idx:1,startMin:9*60,endMin:11*60,label:'Block 2'},{idx:3,startMin:13*60,endMin:15*60,label:'Block 4'}]
        : [{idx:0,startMin:10*60,endMin:12*60,label:'Block 1'},{idx:1,startMin:12*60,endMin:14*60,label:'Block 2'},{idx:2,startMin:14*60,endMin:16*60,label:'Block 3'},{idx:3,startMin:16*60,endMin:18*60,label:'Block 4'}]

      blocks.forEach(block => {
        if (nowMinutes < block.startMin || nowMinutes >= block.endMin) return // block not active now
        const stationId = stations[block.idx]
        if (!stationId) return
        const overrideKey = `${pod}_${block.idx}`
        if (overrides[overrideKey]) return // lead already manually assigned

        // Find best available person — same shift first, then opposite, then leads
        const sameShiftAvailable = ROSTER[`s${podShift}` as 's1'|'s2']
          .filter(m => m.role==='DC' && !absentIds.has(m.id) && m.pod!==pod
            && nowMinutes >= (podShift===1?7*60:10*60)
            && nowMinutes < (podShift===1?15*60:18*60))

        const otherShift = podShift===1?2:1
        const otherShiftStart = otherShift===1?7*60:10*60
        const otherShiftEnd = otherShift===1?15*60:18*60
        const otherShiftAvailable = ROSTER[`s${otherShift}` as 's1'|'s2']
          .filter(m => m.role==='DC' && !absentIds.has(m.id)
            && nowMinutes >= otherShiftStart && nowMinutes < otherShiftEnd)

        const leadsAvailable = [...ROSTER.s1,...ROSTER.s2]
          .filter(m => m.role==='LEAD' && !absentIds.has(m.id)
            && nowMinutes >= (m.shift===1?7*60:10*60)
            && nowMinutes < (m.shift===1?15*60:18*60))

        const assignee = sameShiftAvailable[0] || otherShiftAvailable[0] || leadsAvailable[0]
        if (!assignee) return

        if (!result[pod]) result[pod]=[]
        result[pod].push({pod,station:stationId,assignee,blockLabel:block.label})
      })
    })
    return result
  }

  const autoAssignments = getAutoAssignments()

  // Fire notifications when auto-assignments change
  useEffect(()=>{
    Object.entries(autoAssignments).forEach(([pod,assignments])=>{
      assignments.forEach(a=>{
        if (a.assignee.id === selectedUser) {
          const notifId = `${pod}_${a.station}_${a.blockLabel}`
          setNotifications(prev=>{
            if (prev.find(n=>n.id===notifId)) return prev
            return [...prev, {
              id:notifId,
              msg:`You have been assigned to cover ${STATION_INFO[a.station]?.label||a.station} (${a.blockLabel}) — ${pod} is short-staffed`,
              time:Date.now()
            }]
          })
        }
      })
    })
  },[JSON.stringify(autoAssignments),selectedUser])

  // ── LOGIN VIEW ─────────────────────────────────────────────────────────────
  const loginView = (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',
      minHeight:'100vh',flexDirection:'column',fontFamily:'system-ui',
      background:'linear-gradient(135deg,#dbeafe 0%,#bfdbfe 50%,#dbeafe 100%)',
      padding:'20px',position:'relative'}}>
      <RobotBg/>
      <div style={{background:'white',padding:'32px',borderRadius:'16px',
        boxShadow:'0 4px 24px rgba(0,0,0,0.08)',width:'100%',maxWidth:'400px',
        position:'relative',zIndex:1}}>
        {!pinStep ? (
          <div>
            <div style={{textAlign:'center',marginBottom:'24px'}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                <div style={{width:'10px',height:'10px',borderRadius:'50%',
                  background:'#22c55e',boxShadow:'0 0 8px #22c55e'}}/>
                <span style={{fontSize:'22px',fontWeight:'800'}}>Data Engine</span>
              </div>
              <div style={{fontSize:'14px',fontWeight:'600',color:'#374151'}}>{getCalendarDate()}</div>
              <div style={{fontSize:'12px',color:'#9ca3af',fontFamily:'monospace',marginTop:'2px'}}>
                {clock} · Rotation Day {dayIdx+1}/8
              </div>
            </div>
            <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
              textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>Your shift</div>
            <div style={{display:'flex',gap:'8px',marginBottom:'16px'}}>
              {[1,2].map(s=>(
                <button key={s} onClick={()=>setShift(s as 1|2)}
                  style={{flex:1,padding:'10px',borderRadius:'10px',cursor:'pointer',
                    border:'2px solid',fontWeight:'700',fontSize:'13px',
                    borderColor:shift===s?'#3b82f6':'#e5e7eb',
                    background:shift===s?'#eff6ff':'white',
                    color:shift===s?'#1d4ed8':'#374151'}}>
                  {s===1?'1st Shift 7AM-3PM':'2nd Shift 10AM-6PM'}
                </button>
              ))}
            </div>
            <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
              textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>Your name</div>
            <select value={selectedUser||''} onChange={e=>setSelectedUser(e.target.value)}
              style={{width:'100%',padding:'11px 12px',borderRadius:'10px',
                border:'1px solid #e5e7eb',fontSize:'13px',marginBottom:'12px',
                background:'white',cursor:'pointer'}}>
              <option value=''>- select your name -</option>
              {pool.map(p=>(
                <option key={p.id} value={p.id}>{p.name} - {p.role}{p.pod?' - '+p.pod:''}</option>
              ))}
            </select>
            <div style={{padding:'10px 14px',background:'#fffbeb',borderRadius:'8px',
              border:'1px solid #fde68a',fontSize:'12px',color:'#92400e',marginBottom:'16px'}}>
              Cutoff: {shift===1?'6:30 AM':'9:30 AM'} - mark absent before this time
            </div>
            <button disabled={!selectedUser}
              onClick={()=>{ setPinStep(true); setPinInput(''); setPinError('') }}
              style={{width:'100%',padding:'13px',borderRadius:'10px',
                background:selectedUser?'#3b82f6':'#e5e7eb',
                color:selectedUser?'white':'#9ca3af',
                border:'none',fontSize:'15px',fontWeight:'700',
                cursor:selectedUser?'pointer':'default'}}>
              Continue
            </button>
          </div>
        ) : (
          <div>
            <button onClick={()=>{setPinStep(false);setPinInput('');setPinError('')}}
              style={{background:'none',border:'none',cursor:'pointer',
                fontSize:'13px',color:'#6b7280',marginBottom:'16px',padding:'0',display:'block'}}>
              Back
            </button>
            <div style={{textAlign:'center',marginBottom:'20px'}}>
              <div style={{fontSize:'32px',marginBottom:'8px'}}>&#128272;</div>
              <div style={{fontSize:'18px',fontWeight:'700'}}>Enter your PIN</div>
              <div style={{fontSize:'13px',color:'#6b7280',marginTop:'4px'}}>
                {ALL_PEOPLE.find(m=>m.id===selectedUser)?.name}
              </div>
              {isGuest(selectedUser)?(
                <div style={{marginTop:'8px',padding:'6px 12px',background:'#eff6ff',
                  borderRadius:'8px',border:'1px solid #bfdbfe',fontSize:'11px',color:'#1d4ed8'}}>
                  Observer PIN: 1234
                </div>
              ):isSuperAdmin(selectedUser)?(
                <div style={{marginTop:'8px',padding:'6px 12px',background:'#f3e8ff',
                  borderRadius:'8px',border:'1px solid #d8b4fe',fontSize:'11px',color:'#7c3aed'}}>
                  Admin access · 8-digit PIN required
                </div>
              ):getPin(selectedUser||'')===DEFAULT_PIN?(
                <div style={{marginTop:'8px',padding:'6px 12px',background:'#fffbeb',
                  borderRadius:'8px',border:'1px solid #fde68a',fontSize:'11px',color:'#92400e'}}>
                  Default PIN is 0000
                </div>
              ):null}
            </div>
            <div style={{display:'flex',justifyContent:'center',gap:'8px',marginBottom:'20px'}}>
              {Array.from({length:(selectedUser==='yban'||selectedUser==='yban2')?8:4},(_,i)=>(
                <div key={i} style={{width:'14px',height:'14px',borderRadius:'50%',
                  background:pinInput.length>i?(pinError?'#ef4444':'#3b82f6'):'#e5e7eb'}}/>
              ))}
            </div>
            {pinError&&(
              <div style={{padding:'8px 12px',background:'#fef2f2',borderRadius:'8px',
                border:'1px solid #fca5a5',fontSize:'12px',color:'#dc2626',
                textAlign:'center',marginBottom:'12px'}}>{pinError}</div>
            )}
            {!pinLocked?(
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px'}}>
                {['1','2','3','4','5','6','7','8','9','','0','<'].map((d,i)=>(
                  <button key={i}
                    onClick={()=>{
                      if (!d) return
                      if (d==='<'){setPinInput(p=>p.slice(0,-1));return}
                      const maxLen = (selectedUser==='yban'||selectedUser==='yban2') ? 8 : 4
                      const next=(pinInput+d).slice(0,maxLen)
                      setPinInput(next); setPinError('')
                      const correct=getPin(selectedUser||'')
                      if (next.length===correct.length){
                        if (next===correct){
                          setPinInput('');setPinStep(false);setPinAttempts(0);setLoggedIn(true)
                        } else {
                          const att=pinAttempts+1; setPinAttempts(att)
                          if (att>=3){setPinLocked(true);setPinLockUntil(Date.now()+300000);setPinError('Too many attempts. Locked 5 min.')}
                          else{setPinError('Wrong PIN. '+(3-att)+' attempt(s) left.')}
                          setTimeout(()=>setPinInput(''),600)
                        }
                      }
                    }}
                    style={{padding:'16px',borderRadius:'12px',fontSize:'20px',fontWeight:'600',
                      cursor:d?'pointer':'default',border:d?'1px solid #e5e7eb':'none',
                      background:d==='<'?'#fef2f2':d?'white':'transparent',
                      color:d==='<'?'#dc2626':'#374151'}}>
                    {d==='<'?'del':d}
                  </button>
                ))}
              </div>
            ):(
              <div style={{textAlign:'center',padding:'20px',color:'#dc2626',fontSize:'13px'}}>
                Locked - Contact your shift lead to reset
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  if (!loggedIn) return loginView

  // ── MAIN DASHBOARD ────────────────────────────────────────────────────────
  const isLead = currentUser?.role==='LEAD' || currentUser?.role==='SUPER_ADMIN'
  const isGuest2 = isGuest(selectedUser)
  const tabs = currentUser?.role==='SUPER_ADMIN'
    ? ['team','roster','timeoff','rotation']
    : isLead
    ? ['mine','team','roster','timeoff','rotation']
    : ['mine','team','roster','rotation']

  const tabLabels: Record<string,string> = {
    mine:'My Schedule', team:'Team Schedule', roster:'Roster',
    timeoff:'Time Off', rotation:'Rotation'
  }

  // Alert check
  const nowMin = new Date().getHours()*60+new Date().getMinutes()
  const myActiveBlock = myTimeline.find(t=>{
    if (t.type!=='block'&&t.type!=='cross') return false
    const elapsed = nowMin - t.startMin
    return elapsed>=0 && elapsed<(t.durHrs*60)
  })
  const myNextBlock = myTimeline.find(t=>{
    if (t.type!=='block'&&t.type!=='cross') return false
    return t.startMin > nowMin
  })
  const alertStatus = myActiveBlock
    ? getBlockAlert(myActiveBlock.startMin, myActiveBlock.durHrs, myNextBlock?.station||null)
    : null

  const teamSchedule = buildTeamSchedule()

  return (
    <div style={{fontFamily:'system-ui',background:'linear-gradient(160deg,#dbeafe 0%,#bae6fd 40%,#dbeafe 100%)',
      minHeight:'100vh',padding:'16px',maxWidth:'960px',margin:'0 auto',position:'relative'}}>
      <RobotBg/>
      <div style={{position:'relative',zIndex:1}}>

        {/* 6-MIN ALERT */}
        {alertStatus?.isAlert && myNextBlock?.station && (
          <div style={{position:'fixed',top:0,left:0,right:0,zIndex:999,
            background:'#dc2626',color:'white',padding:'14px 20px',
            display:'flex',alignItems:'center',gap:'12px',
            boxShadow:'0 4px 20px rgba(220,38,38,0.5)'}}>
            <span style={{fontSize:'28px'}}>&#128680;</span>
            <div style={{flex:1}}>
              <div style={{fontSize:'16px',fontWeight:'800'}}>6 MINUTES - BEGIN TRANSITION NOW</div>
              <div style={{fontSize:'13px',opacity:0.9,marginTop:'2px'}}>
                Move to {STATION_INFO[myNextBlock.station]?.label} - {STATION_INFO[myNextBlock.station]?.task}
              </div>
            </div>
            <div style={{fontSize:'40px',fontWeight:'800',fontFamily:'monospace'}}>6 MIN</div>
          </div>
        )}

        {/* 10-MIN WARNING */}
        {alertStatus?.isWarning && myNextBlock?.station && !alertStatus.isAlert && (
          <div style={{background:'#f59e0b',color:'white',padding:'10px 16px',
            borderRadius:'10px',marginBottom:'12px',display:'flex',alignItems:'center',gap:'10px'}}>
            <span style={{fontSize:'20px'}}>&#9888;</span>
            <div>
              <div style={{fontWeight:'700',fontSize:'14px'}}>{alertStatus.remaining} minutes remaining</div>
              <div style={{fontSize:'12px',opacity:0.9}}>
                Next: {STATION_INFO[myNextBlock.station]?.label} ({STATION_INFO[myNextBlock.station]?.task})
              </div>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
          marginBottom:'8px',marginTop:alertStatus?.isAlert?'64px':'0'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <div style={{width:'8px',height:'8px',borderRadius:'50%',
              background:'#22c55e',boxShadow:'0 0 6px #22c55e'}}/>
            <span style={{fontWeight:'800',fontSize:'15px'}}>Data Engine</span>
            <span style={{fontSize:'10px',fontFamily:'monospace',padding:'2px 6px',
              borderRadius:'4px',
              background:synced?'#dcfce7':loading?'#fef3c7':'#fee2e2',
              color:synced?'#16a34a':loading?'#92400e':'#dc2626'}}>
              {synced?'live':loading?'connecting...':'offline'}
            </span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <span style={{fontSize:'12px',fontWeight:'500'}}>{currentUser?.name}</span>
            <button onClick={()=>setLoggedIn(false)}
              style={{padding:'5px 10px',border:'1px solid #e5e7eb',borderRadius:'6px',
                fontSize:'11px',cursor:'pointer',background:'white'}}>sign out</button>
          </div>
        </div>

        {/* ASSIGNMENT NOTIFICATIONS */}
        {notifications.filter(n=>Date.now()-n.time<3600000).map(n=>(
          <div key={n.id} style={{background:'#7c3aed',color:'white',padding:'10px 14px',
            borderRadius:'10px',marginBottom:'8px',display:'flex',
            alignItems:'center',gap:'10px',boxShadow:'0 2px 8px rgba(124,58,237,0.4)'}}>
            <span style={{fontSize:'20px'}}>&#128276;</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:'700',fontSize:'13px'}}>Station Coverage Needed</div>
              <div style={{fontSize:'12px',opacity:0.9,marginTop:'2px'}}>{n.msg}</div>
            </div>
            <button onClick={()=>setNotifications(prev=>prev.filter(p=>p.id!==n.id))}
              style={{background:'rgba(255,255,255,0.2)',border:'none',color:'white',
                borderRadius:'6px',padding:'4px 10px',cursor:'pointer',fontSize:'12px'}}>
              Got it
            </button>
          </div>
        ))}

        {/* DATE BAR */}
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

        {/* SHIFT TOGGLE — leads only */}
        {isLead && (
          <div style={{display:'flex',gap:'6px',marginBottom:'12px'}}>
            {[1,2].map(s=>(
              <button key={s} onClick={()=>setShift(s as 1|2)}
                style={{padding:'7px 16px',borderRadius:'8px',cursor:'pointer',
                  border:'1px solid',fontWeight:'600',fontSize:'12px',
                  borderColor:shift===s?'#3b82f6':'#e5e7eb',
                  background:shift===s?'#eff6ff':'white',
                  color:shift===s?'#1d4ed8':'#374151'}}>
                {s===1?'1st Shift 7AM-3PM':'2nd Shift 10AM-6PM'}
              </button>
            ))}
          </div>
        )}

        {/* LEAD STATUS CARD */}
        {currentUser?.role==='LEAD' && (
          <div style={{background:'white',borderRadius:'12px',
            border:`2px solid ${absentIds.has(currentUser.id)?'#fca5a5':'#bfdbfe'}`,
            padding:'14px',marginBottom:'12px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
              <div>
                <div style={{fontWeight:'700',fontSize:'15px'}}>{currentUser.name}</div>
                <div style={{fontSize:'11px',color:'#6b7280',fontFamily:'monospace'}}>
                  Lead · Shift {currentUser.shift}{currentUser.pod?' · Pod '+currentUser.pod:''}
                </div>
              </div>
              <span style={{padding:'4px 12px',borderRadius:'99px',fontSize:'11px',fontWeight:'700',
                fontFamily:'monospace',
                background:absentIds.has(currentUser.id)?'#fee2e2':'#E6F1FB',
                color:absentIds.has(currentUser.id)?'#dc2626':'#0C447C'}}>
                {absentIds.has(currentUser.id)?'ABSENT':'PRESENT'}
              </span>
            </div>
            <button onClick={()=>toggle(currentUser.id,currentUser.id)}
              style={{width:'100%',padding:'10px',borderRadius:'8px',marginBottom:'8px',
                border:'1px solid',fontWeight:'600',fontSize:'13px',cursor:'pointer',
                borderColor:absentIds.has(currentUser.id)?'#86efac':'#fca5a5',
                background:absentIds.has(currentUser.id)?'#f0fdf4':'#fef2f2',
                color:absentIds.has(currentUser.id)?'#16a34a':'#dc2626'}}>
              {absentIds.has(currentUser.id)?'Mark myself PRESENT':'I will be OUT today'}
            </button>
            <div style={{display:'flex',gap:'8px'}}>
              <button onClick={()=>{setShowSetPin(v=>!v);setNewPin('');setNewPinConfirm('');setPinSetMsg('')}}
                style={{flex:1,padding:'7px',borderRadius:'8px',border:'1px solid #e5e7eb',
                  background:'white',fontSize:'11px',cursor:'pointer',color:'#6b7280'}}>
                Change PIN
              </button>
              <button onClick={()=>{setShowTimeOff(v=>!v);setToStart('');setToEnd('');setToMsg('')}}
                style={{flex:1,padding:'7px',borderRadius:'8px',border:'1px solid #e5e7eb',
                  background:'white',fontSize:'11px',cursor:'pointer',color:'#6b7280'}}>
                Schedule Time Off
              </button>
            </div>
            {showSetPin && (
              <div style={{marginTop:'10px',padding:'12px',background:'#f9fafb',
                borderRadius:'10px',border:'1px solid #e5e7eb'}}>
                <div style={{fontSize:'12px',fontWeight:'600',marginBottom:'8px'}}>Set new 4-digit PIN</div>
                <input type="password" maxLength={4} value={newPin}
                  onChange={e=>setNewPin(e.target.value.replace(/[^0-9]/g,'').slice(0,4))}
                  placeholder="New PIN" style={{width:'100%',padding:'8px',borderRadius:'8px',
                    border:'1px solid #e5e7eb',fontSize:'13px',marginBottom:'6px',
                    letterSpacing:'0.3em',textAlign:'center'}}/>
                <input type="password" maxLength={4} value={newPinConfirm}
                  onChange={e=>setNewPinConfirm(e.target.value.replace(/[^0-9]/g,'').slice(0,4))}
                  placeholder="Confirm PIN" style={{width:'100%',padding:'8px',borderRadius:'8px',
                    border:'1px solid #e5e7eb',fontSize:'13px',marginBottom:'6px',
                    letterSpacing:'0.3em',textAlign:'center'}}/>
                {pinSetMsg&&<div style={{fontSize:'12px',color:pinSetMsg.includes('ok')?'#16a34a':'#dc2626',
                  marginBottom:'6px',textAlign:'center'}}>{pinSetMsg}</div>}
                <div style={{display:'flex',gap:'6px'}}>
                  <button onClick={()=>setShowSetPin(false)}
                    style={{flex:1,padding:'7px',borderRadius:'8px',border:'1px solid #e5e7eb',
                      background:'white',cursor:'pointer',fontSize:'11px',color:'#6b7280'}}>Cancel</button>
                  <button onClick={()=>{
                    if (newPin.length!==4){setPinSetMsg('Must be 4 digits');return}
                    if (newPin!==newPinConfirm){setPinSetMsg('PINs do not match');return}
                    setPin(currentUser.id,newPin); setPinSetMsg('PIN updated ok!')
                    setTimeout(()=>setShowSetPin(false),1500)
                  }} style={{flex:1,padding:'7px',borderRadius:'8px',border:'none',
                    background:'#3b82f6',color:'white',cursor:'pointer',fontSize:'11px',fontWeight:'600'}}>
                    Save
                  </button>
                </div>
              </div>
            )}
            {showTimeOff && (
              <div style={{marginTop:'10px',padding:'12px',background:'#f9fafb',
                borderRadius:'10px',border:'1px solid #e5e7eb'}}>
                <div style={{fontSize:'12px',fontWeight:'600',marginBottom:'10px'}}>Schedule Time Off</div>
                {(vacationMap[currentUser.id]||[]).map(v=>(
                  <div key={v.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                    padding:'6px 10px',background:'#eff6ff',borderRadius:'6px',
                    marginBottom:'6px',fontSize:'12px'}}>
                    <span style={{color:'#1d4ed8',fontFamily:'monospace'}}>{v.start} to {v.end}</span>
                    <button onClick={()=>cancelTimeOff(v.id,currentUser.id,v.start,v.end)}
                      style={{background:'#fee2e2',border:'1px solid #fca5a5',borderRadius:'4px',
                        padding:'2px 8px',fontSize:'11px',color:'#dc2626',cursor:'pointer'}}>Cancel</button>
                  </div>
                ))}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'8px'}}>
                  <div>
                    <div style={{fontSize:'10px',color:'#9ca3af',marginBottom:'3px'}}>From</div>
                    <input type="date" value={toStart} min={getToday()}
                      onChange={e=>{setToStart(e.target.value);setToMsg('')}}
                      style={{width:'100%',padding:'7px',borderRadius:'8px',
                        border:'1px solid #e5e7eb',fontSize:'12px'}}/>
                  </div>
                  <div>
                    <div style={{fontSize:'10px',color:'#9ca3af',marginBottom:'3px'}}>To</div>
                    <input type="date" value={toEnd} min={toStart||getToday()}
                      onChange={e=>{setToEnd(e.target.value);setToMsg('')}}
                      style={{width:'100%',padding:'7px',borderRadius:'8px',
                        border:'1px solid #e5e7eb',fontSize:'12px'}}/>
                  </div>
                </div>
                {toMsg&&<div style={{fontSize:'12px',textAlign:'center',marginBottom:'6px',
                  color:toMsg.includes('ok')?'#16a34a':'#dc2626'}}>{toMsg}</div>}
                <div style={{display:'flex',gap:'6px'}}>
                  <button onClick={()=>setShowTimeOff(false)}
                    style={{flex:1,padding:'7px',borderRadius:'8px',border:'1px solid #e5e7eb',
                      background:'white',cursor:'pointer',fontSize:'11px',color:'#6b7280'}}>Cancel</button>
                  <button onClick={async()=>{
                    if (!toStart||!toEnd){setToMsg('Select both dates');return}
                    if (toStart>toEnd){setToMsg('End must be after start');return}
                    setToMsg('Saving...')
                    await bookTimeOff(currentUser.id,toStart,toEnd)
                    setToMsg('Time off scheduled ok!'); setTimeout(()=>setShowTimeOff(false),1500)
                  }} style={{flex:2,padding:'7px',borderRadius:'8px',border:'none',
                    background:'#3b82f6',color:'white',cursor:'pointer',fontSize:'11px',fontWeight:'600'}}>
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',marginBottom:'12px'}}>
          {[
            {label:'DCs Present',value:presentDCs,color:'#16a34a'},
            {label:'DAs Present',value:presentDAs,color:'#0891b2'},
            {label:'DCs Absent', value:absentDCs, color:absentDCs>0?'#dc2626':'#9ca3af'},
            {label:'Rotation',   value:`Day ${dayIdx+1}/8`,color:'#7c3aed'},
          ].map(s=>(
            <div key={s.label} style={{background:'white',borderRadius:'10px',
              padding:'10px',textAlign:'center',border:'1px solid #e5e7eb'}}>
              <div style={{fontSize:'18px',fontWeight:'800',color:s.color}}>{s.value}</div>
              <div style={{fontSize:'9px',color:'#9ca3af',textTransform:'uppercase',
                letterSpacing:'0.06em',marginTop:'2px'}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* GUEST CARD */}
        {isGuest2 && (
          <div style={{background:'white',borderRadius:'12px',border:'2px solid #bfdbfe',
            padding:'16px',marginBottom:'12px',textAlign:'center'}}>
            <div style={{fontSize:'32px',marginBottom:'8px'}}>&#128064;</div>
            <div style={{fontSize:'16px',fontWeight:'700',marginBottom:'4px'}}>Observer Mode</div>
            <div style={{fontSize:'13px',color:'#6b7280'}}>
              Read-only view. Browse the tabs below to explore the team schedule.
            </div>
          </div>
        )}

        {/* SUPER ADMIN CARD */}
        {currentUser?.role==='SUPER_ADMIN' && (
          <div style={{background:'white',borderRadius:'12px',border:'2px solid #d8b4fe',
            padding:'16px',marginBottom:'12px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
              <div>
                <div style={{fontWeight:'700',fontSize:'15px'}}>{currentUser.name}</div>
                <div style={{fontSize:'11px',color:'#7c3aed',fontFamily:'monospace',fontWeight:'600'}}>
                  Super Admin · Full access
                </div>
              </div>
              <span style={{padding:'4px 12px',borderRadius:'99px',fontSize:'11px',fontWeight:'700',
                background:'#f3e8ff',color:'#7c3aed',fontFamily:'monospace'}}>ADMIN</span>
            </div>
            <div style={{padding:'8px 12px',background:'#f3e8ff',borderRadius:'8px',
              border:'1px solid #d8b4fe',fontSize:'12px',color:'#7c3aed',marginBottom:'10px'}}>
              You have full access to view both shifts, reset any PIN, toggle attendance,
              and manage time off across the entire team.
            </div>
            <button onClick={()=>{setShowSetPin(v=>!v);setNewPin('');setNewPinConfirm('');setPinSetMsg('')}}
              style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #d8b4fe',
                background:'#f3e8ff',fontSize:'12px',cursor:'pointer',color:'#7c3aed',fontWeight:'600'}}>
              Change my PIN
            </button>
            {showSetPin && (
              <div style={{marginTop:'10px',padding:'12px',background:'#faf5ff',
                borderRadius:'10px',border:'1px solid #d8b4fe'}}>
                <div style={{fontSize:'12px',fontWeight:'600',marginBottom:'8px',color:'#7c3aed'}}>
                  Set new PIN (4-8 digits)
                </div>
                <input type="password" maxLength={8} value={newPin}
                  onChange={e=>setNewPin(e.target.value.replace(/[^0-9]/g,'').slice(0,8))}
                  placeholder="New PIN" style={{width:'100%',padding:'8px',borderRadius:'8px',
                    border:'1px solid #d8b4fe',fontSize:'13px',marginBottom:'6px',
                    letterSpacing:'0.3em',textAlign:'center'}}/>
                <input type="password" maxLength={8} value={newPinConfirm}
                  onChange={e=>setNewPinConfirm(e.target.value.replace(/[^0-9]/g,'').slice(0,8))}
                  placeholder="Confirm PIN" style={{width:'100%',padding:'8px',borderRadius:'8px',
                    border:'1px solid #d8b4fe',fontSize:'13px',marginBottom:'6px',
                    letterSpacing:'0.3em',textAlign:'center'}}/>
                {pinSetMsg&&<div style={{fontSize:'12px',color:pinSetMsg.includes('ok')?'#16a34a':'#dc2626',
                  marginBottom:'6px',textAlign:'center'}}>{pinSetMsg}</div>}
                <div style={{display:'flex',gap:'6px'}}>
                  <button onClick={()=>setShowSetPin(false)}
                    style={{flex:1,padding:'7px',borderRadius:'8px',border:'1px solid #d8b4fe',
                      background:'white',cursor:'pointer',fontSize:'11px',color:'#7c3aed'}}>Cancel</button>
                  <button onClick={()=>{
                    if (newPin.length<4){setPinSetMsg('Min 4 digits');return}
                    if (newPin!==newPinConfirm){setPinSetMsg('PINs do not match');return}
                    setPin(currentUser.id,newPin); setPinSetMsg('PIN updated ok!')
                    setTimeout(()=>setShowSetPin(false),1500)
                  }} style={{flex:1,padding:'7px',borderRadius:'8px',border:'none',
                    background:'#7c3aed',color:'white',cursor:'pointer',fontSize:'11px',fontWeight:'600'}}>
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DC STATUS CARD */}
        {currentUser?.role==='DC' && myPod && myStations && (
          <div style={{background:'white',borderRadius:'12px',
            border:`2px solid ${absentIds.has(currentUser.id)?'#fca5a5':'#86efac'}`,
            padding:'14px',marginBottom:'12px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
              <div>
                <div style={{fontWeight:'700',fontSize:'15px'}}>{currentUser.name}</div>
                <div style={{fontSize:'11px',color:'#6b7280',fontFamily:'monospace'}}>
                  DC · Shift {currentUser.shift} · Pod {myPod}
                </div>
              </div>
              <span style={{padding:'4px 12px',borderRadius:'99px',fontSize:'11px',fontWeight:'700',
                fontFamily:'monospace',
                background:absentIds.has(currentUser.id)?'#fee2e2':'#dcfce7',
                color:absentIds.has(currentUser.id)?'#dc2626':'#16a34a'}}>
                {absentIds.has(currentUser.id)?'ABSENT':'PRESENT'}
              </span>
            </div>
            {!absentIds.has(currentUser.id) && (
              <button onClick={()=>toggle(currentUser.id,currentUser.id)}
                style={{width:'100%',padding:'10px',borderRadius:'8px',marginBottom:'8px',
                  border:'1px solid #fca5a5',background:'#fef2f2',color:'#dc2626',
                  fontWeight:'600',fontSize:'13px',cursor:'pointer'}}>
                I will be OUT today
              </button>
            )}
            {absentIds.has(currentUser.id) && (
              <button onClick={()=>toggle(currentUser.id,currentUser.id)}
                style={{width:'100%',padding:'10px',borderRadius:'8px',marginBottom:'8px',
                  border:'1px solid #86efac',background:'#f0fdf4',color:'#16a34a',
                  fontWeight:'600',fontSize:'13px',cursor:'pointer'}}>
                Mark myself PRESENT
              </button>
            )}
            {!isGuest2 && (
              <div style={{display:'flex',gap:'8px'}}>
                <button onClick={()=>{setShowSetPin(v=>!v);setNewPin('');setNewPinConfirm('');setPinSetMsg('')}}
                  style={{flex:1,padding:'7px',borderRadius:'8px',border:'1px solid #e5e7eb',
                    background:'white',fontSize:'11px',cursor:'pointer',color:'#6b7280'}}>
                  Change PIN
                </button>
                <button onClick={()=>{setShowTimeOff(v=>!v);setToStart('');setToEnd('');setToMsg('')}}
                  style={{flex:1,padding:'7px',borderRadius:'8px',border:'1px solid #e5e7eb',
                    background:'white',fontSize:'11px',cursor:'pointer',color:'#6b7280'}}>
                  Schedule Time Off
                </button>
              </div>
            )}
            {showSetPin && (
              <div style={{marginTop:'10px',padding:'12px',background:'#f9fafb',
                borderRadius:'10px',border:'1px solid #e5e7eb'}}>
                <div style={{fontSize:'12px',fontWeight:'600',marginBottom:'8px'}}>Set new 4-digit PIN</div>
                <input type="password" maxLength={4} value={newPin}
                  onChange={e=>setNewPin(e.target.value.replace(/[^0-9]/g,'').slice(0,4))}
                  placeholder="New PIN" style={{width:'100%',padding:'8px',borderRadius:'8px',
                    border:'1px solid #e5e7eb',fontSize:'13px',marginBottom:'6px',
                    letterSpacing:'0.3em',textAlign:'center'}}/>
                <input type="password" maxLength={4} value={newPinConfirm}
                  onChange={e=>setNewPinConfirm(e.target.value.replace(/[^0-9]/g,'').slice(0,4))}
                  placeholder="Confirm PIN" style={{width:'100%',padding:'8px',borderRadius:'8px',
                    border:'1px solid #e5e7eb',fontSize:'13px',marginBottom:'6px',
                    letterSpacing:'0.3em',textAlign:'center'}}/>
                {pinSetMsg&&<div style={{fontSize:'12px',color:pinSetMsg.includes('ok')?'#16a34a':'#dc2626',
                  marginBottom:'6px',textAlign:'center'}}>{pinSetMsg}</div>}
                <div style={{display:'flex',gap:'6px'}}>
                  <button onClick={()=>setShowSetPin(false)}
                    style={{flex:1,padding:'7px',borderRadius:'8px',border:'1px solid #e5e7eb',
                      background:'white',cursor:'pointer',fontSize:'11px',color:'#6b7280'}}>Cancel</button>
                  <button onClick={()=>{
                    if (newPin.length!==4){setPinSetMsg('Must be 4 digits');return}
                    if (newPin!==newPinConfirm){setPinSetMsg('PINs do not match');return}
                    setPin(currentUser.id,newPin); setPinSetMsg('PIN updated ok!')
                    setTimeout(()=>setShowSetPin(false),1500)
                  }} style={{flex:1,padding:'7px',borderRadius:'8px',border:'none',
                    background:'#3b82f6',color:'white',cursor:'pointer',fontSize:'11px',fontWeight:'600'}}>
                    Save
                  </button>
                </div>
              </div>
            )}
            {showTimeOff && (
              <div style={{marginTop:'10px',padding:'12px',background:'#f9fafb',
                borderRadius:'10px',border:'1px solid #e5e7eb'}}>
                <div style={{fontSize:'12px',fontWeight:'600',marginBottom:'10px'}}>Schedule Time Off</div>
                {(vacationMap[currentUser.id]||[]).map(v=>(
                  <div key={v.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                    padding:'6px 10px',background:'#eff6ff',borderRadius:'6px',
                    marginBottom:'6px',fontSize:'12px'}}>
                    <span style={{color:'#1d4ed8',fontFamily:'monospace'}}>{v.start} to {v.end}</span>
                    <button onClick={()=>cancelTimeOff(v.id,currentUser.id,v.start,v.end)}
                      style={{background:'#fee2e2',border:'1px solid #fca5a5',borderRadius:'4px',
                        padding:'2px 8px',fontSize:'11px',color:'#dc2626',cursor:'pointer'}}>Cancel</button>
                  </div>
                ))}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'8px'}}>
                  <div>
                    <div style={{fontSize:'10px',color:'#9ca3af',marginBottom:'3px'}}>From</div>
                    <input type="date" value={toStart} min={getToday()}
                      onChange={e=>{setToStart(e.target.value);setToMsg('')}}
                      style={{width:'100%',padding:'7px',borderRadius:'8px',
                        border:'1px solid #e5e7eb',fontSize:'12px'}}/>
                  </div>
                  <div>
                    <div style={{fontSize:'10px',color:'#9ca3af',marginBottom:'3px'}}>To</div>
                    <input type="date" value={toEnd} min={toStart||getToday()}
                      onChange={e=>{setToEnd(e.target.value);setToMsg('')}}
                      style={{width:'100%',padding:'7px',borderRadius:'8px',
                        border:'1px solid #e5e7eb',fontSize:'12px'}}/>
                  </div>
                </div>
                {toMsg&&<div style={{fontSize:'12px',textAlign:'center',marginBottom:'6px',
                  color:toMsg.includes('ok')?'#16a34a':'#dc2626'}}>{toMsg}</div>}
                <div style={{display:'flex',gap:'6px'}}>
                  <button onClick={()=>setShowTimeOff(false)}
                    style={{flex:1,padding:'7px',borderRadius:'8px',border:'1px solid #e5e7eb',
                      background:'white',cursor:'pointer',fontSize:'11px',color:'#6b7280'}}>Cancel</button>
                  <button onClick={async()=>{
                    if (!toStart||!toEnd){setToMsg('Select both dates');return}
                    if (toStart>toEnd){setToMsg('End must be after start');return}
                    setToMsg('Saving...')
                    await bookTimeOff(currentUser.id,toStart,toEnd)
                    setToMsg('Time off scheduled ok!'); setTimeout(()=>setShowTimeOff(false),1500)
                  }} style={{flex:2,padding:'7px',borderRadius:'8px',border:'none',
                    background:'#3b82f6',color:'white',cursor:'pointer',fontSize:'11px',fontWeight:'600'}}>
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DA STATUS CARD */}
        {currentUser?.role==='DA' && (
          <div style={{background:'white',borderRadius:'12px',
            border:`2px solid ${absentIds.has(currentUser.id)?'#fca5a5':'#a5f3fc'}`,
            padding:'14px',marginBottom:'12px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
              <div>
                <div style={{fontWeight:'700',fontSize:'15px'}}>{currentUser.name}</div>
                <div style={{fontSize:'11px',color:'#6b7280',fontFamily:'monospace'}}>DA · Shift {currentUser.shift}</div>
              </div>
              <span style={{padding:'4px 12px',borderRadius:'99px',fontSize:'11px',fontWeight:'700',
                fontFamily:'monospace',
                background:absentIds.has(currentUser.id)?'#fee2e2':'#cffafe',
                color:absentIds.has(currentUser.id)?'#dc2626':'#0e7490'}}>
                {absentIds.has(currentUser.id)?'ABSENT':'PRESENT'}
              </span>
            </div>
            <div style={{padding:'8px 12px',background:'#ecfeff',borderRadius:'8px',
              border:'1px solid #a5f3fc',fontSize:'12px',color:'#0e7490',marginBottom:'10px'}}>
              Contact your shift lead ({currentUser.shift===1?'Kyle / Alan':'David / Rashila'}) for today's task assignment
            </div>
            <button onClick={()=>toggle(currentUser.id,currentUser.id)}
              style={{width:'100%',padding:'10px',borderRadius:'8px',border:'1px solid',
                fontWeight:'600',fontSize:'13px',cursor:'pointer',
                borderColor:absentIds.has(currentUser.id)?'#a5f3fc':'#fca5a5',
                background:absentIds.has(currentUser.id)?'#ecfeff':'#fef2f2',
                color:absentIds.has(currentUser.id)?'#0e7490':'#dc2626'}}>
              {absentIds.has(currentUser.id)?'Mark myself PRESENT':'I will be OUT today'}
            </button>
          </div>
        )}

        {/* TABS */}
        <div style={{display:'flex',gap:'3px',background:'#f3f4f6',padding:'4px',
          borderRadius:'8px',marginBottom:'12px'}}>
          {tabs.map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{flex:1,padding:'7px 4px',borderRadius:'6px',cursor:'pointer',
                fontSize:'10px',fontWeight:'600',textTransform:'uppercase',
                letterSpacing:'0.04em',border:'none',
                background:tab===t?'white':'transparent',
                color:tab===t?'#111827':'#6b7280'}}>
              {tabLabels[t]}
            </button>
          ))}
        </div>

        {/* ── MY SCHEDULE TAB ──────────────────────────────────────────────── */}
        {tab==='mine' && (
          <div>
            {!myTimeline.length ? (
              <div style={{background:'white',borderRadius:'12px',border:'1px solid #e5e7eb',
                padding:'32px',textAlign:'center',color:'#9ca3af',fontSize:'13px'}}>
                <div style={{fontSize:'32px',marginBottom:'8px'}}>&#128203;</div>
                No station assignments — check with your shift lead.
              </div>
            ) : (
              <div>
                <div style={{fontSize:'12px',color:'#6b7280',marginBottom:'10px',
                  padding:'8px 12px',background:'white',borderRadius:'8px',
                  border:'1px solid #e5e7eb'}}>
                  <strong>Your stations today</strong> · Pod {myPod} · {currentUser?.shift===1?'1st Shift':'2nd Shift'} ·
                  Day {dayIdx+1}/8 rotation
                  {currentUser?.shift===1&&(
                    <span style={{marginLeft:'8px',color:'#7c3aed',fontSize:'11px'}}>
                      Cross-training on 2nd shift stations during your lunch window
                    </span>
                  )}
                </div>
                {myTimeline.map((block,i)=>{
                  if (block.type==='lunch') return (
                    <div key={i} style={{padding:'10px 14px',borderRadius:'10px',
                      background:'#fffbeb',border:'1px dashed #fde68a',
                      display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                      <span style={{fontSize:'20px'}}>&#127829;</span>
                      <div>
                        <div style={{fontWeight:'600',fontSize:'13px'}}>{block.label}</div>
                        <div style={{fontSize:'11px',color:'#92400e',fontFamily:'monospace'}}>{block.timeLabel}</div>
                        <div style={{fontSize:'10px',color:'#9ca3af',marginTop:'2px'}}>{block.note}</div>
                      </div>
                    </div>
                  )
                  if (block.type==='monitoring') return (
                    <div key={i} style={{padding:'10px 14px',borderRadius:'10px',
                      background:'#eff6ff',border:'1.5px solid #3b82f6',
                      display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                      <span style={{fontSize:'20px'}}>&#128270;</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:'700',fontSize:'13px',color:'#1d4ed8'}}>
                          {block.label} · Floor Monitoring
                        </div>
                        <div style={{fontSize:'11px',color:'#1d4ed8',fontFamily:'monospace',marginTop:'2px'}}>
                          {block.timeLabel}
                        </div>
                        <div style={{fontSize:'10px',color:'#6b7280',marginTop:'2px'}}>
                          Vacate your station · Stand by to monitor floor operations · Your partner runs solo
                        </div>
                      </div>
                      <span style={{padding:'3px 10px',borderRadius:'99px',fontSize:'10px',
                        fontWeight:'700',background:'#1d4ed8',color:'white',fontFamily:'monospace'}}>
                        MONITORING
                      </span>
                    </div>
                  )
                  const info = STATION_INFO[block.station]
                  if (!info) return null
                  const bAlert = getBlockAlert(block.startMin,block.durHrs,null)
                  const isActive = !!bAlert
                  const members = pool.filter(m=>m.pod===myPod&&!absentIds.has(m.id))
                  const personA = members[0]?.name.split(' ')[0]??'?'
                  const personB = members[1]?.name.split(' ')[0]??'(solo)'
                  const isSolo = block.isSolo || members.length<2
                  const sessions = buildSessions(personA,personB,block.startMin,block.durHrs)
                  const activeIdx = bAlert?.sessionIndex??-1
                  return (
                    <div key={i} style={{borderRadius:'12px',
                      border:`1.5px solid ${isActive?info.dot:'#e5e7eb'}`,
                      overflow:'hidden',marginBottom:'8px',
                      background:isActive?`${info.dot}08`:'white'}}>
                      <div style={{padding:'10px 14px',
                        background:isActive?`${info.dot}20`:'#fafafa',
                        borderBottom:'1px solid #f3f4f6',
                        display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
                        <div style={{width:'10px',height:'10px',borderRadius:'50%',background:info.dot}}/>
                        <span style={{fontSize:'14px',fontWeight:'800'}}>{info.label}</span>
                        <span style={{fontSize:'11px',color:'#6b7280'}}>— {info.task}</span>
                        <span style={{fontSize:'10px',color:'#9ca3af',fontFamily:'monospace',marginLeft:'auto'}}>
                          {block.timeLabel}
                        </span>
                        {block.isCross&&(
                          <span style={{padding:'2px 8px',borderRadius:'4px',fontSize:'9px',fontWeight:'700',
                            background:'#f3e8ff',color:'#7c3aed'}}>CROSS-TRAIN</span>
                        )}
                        {isSolo&&!block.isCross&&(
                          <span style={{padding:'2px 8px',borderRadius:'4px',fontSize:'9px',fontWeight:'700',
                            background:'#fef3c7',color:'#92400e'}}>SOLO</span>
                        )}
                        {isActive&&(
                          <span style={{padding:'2px 8px',borderRadius:'4px',fontSize:'9px',fontWeight:'700',
                            background:'#dcfce7',color:'#16a34a',fontFamily:'monospace'}}>NOW ACTIVE</span>
                        )}
                      </div>
                      <div style={{padding:'6px 14px'}}>
                        {sessions.map((s,si)=>{
                          const isCurrent=si===activeIdx&&isActive
                          const isPast=isActive&&si<activeIdx
                          return (
                            <div key={si} style={{display:'flex',alignItems:'center',gap:'8px',
                              padding:'4px 8px',borderRadius:'6px',marginBottom:'2px',
                              background:isCurrent?`${info.dot}20`:isPast?'#f9fafb':'transparent',
                              border:isCurrent?`1px solid ${info.dot}`:'1px solid transparent'}}>
                              <div style={{width:'20px',height:'20px',borderRadius:'50%',
                                display:'flex',alignItems:'center',justifyContent:'center',
                                fontSize:'9px',fontWeight:'700',flexShrink:0,
                                background:isCurrent?info.dot:isPast?'#d1d5db':'#e5e7eb',
                                color:isCurrent?'white':isPast?'#6b7280':'#9ca3af'}}>{s.session}</div>
                              <span style={{fontSize:'10px',fontFamily:'monospace',
                                color:isCurrent?'#374151':'#9ca3af',minWidth:'120px'}}>
                                {s.startTime} - {s.endTime}
                              </span>
                              <span style={{fontSize:'9px',fontWeight:'700',padding:'1px 5px',
                                borderRadius:'4px',
                                background:s.isPerson==='A'?'#dbeafe':'#fce7f3',
                                color:s.isPerson==='A'?'#1d4ed8':'#be185d'}}>{s.isPerson}</span>
                              <span style={{fontSize:'11px',fontWeight:isCurrent?'700':'400',
                                color:isCurrent?'#111827':'#374151'}}>{s.person}</span>
                              {isCurrent&&<span style={{fontSize:'9px',background:'#dcfce7',
                                color:'#16a34a',padding:'1px 5px',borderRadius:'4px',
                                fontWeight:'700',fontFamily:'monospace'}}>NOW</span>}
                              {isPast&&<span style={{fontSize:'10px',color:'#9ca3af'}}>&#10003;</span>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TEAM SCHEDULE TAB ────────────────────────────────────────────── */}
        {tab==='team' && (
          <div>
            {/* Station key */}
            <div style={{background:'white',borderRadius:'10px',border:'1px solid #e5e7eb',
              padding:'10px 14px',marginBottom:'12px'}}>
              <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
                textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'8px'}}>Station key</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                {Object.entries(STATION_INFO).map(([id,info])=>(
                  <span key={id} style={{padding:'3px 10px',borderRadius:'99px',fontSize:'11px',
                    fontWeight:'600',background:`${info.dot}22`,color:info.dot,
                    border:`1px solid ${info.dot}44`}}>
                    {info.label} - {info.shift==='s1'?'1st':'2nd'}{info.solo?' (solo)':''}
                  </span>
                ))}
              </div>
            </div>

            {/* Lunch schedule banner */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'10px'}}>
              {shift===1 ? (
                <>
                  <div style={{padding:'8px 12px',background:'#fef3c7',borderRadius:'8px',
                    border:'1px solid #fde68a',fontSize:'11px'}}>
                    <div style={{fontWeight:'700',color:'#92400e',marginBottom:'2px'}}>
                      Lunch A · 11:00 AM – 12:00 PM
                    </div>
                    <div style={{color:'#374151'}}>P1 + P2 staggered within pairs</div>
                  </div>
                  <div style={{padding:'8px 12px',background:'#f3e8ff',borderRadius:'8px',
                    border:'1px solid #d8b4fe',fontSize:'11px'}}>
                    <div style={{fontWeight:'700',color:'#7c3aed',marginBottom:'2px'}}>
                      Lunch B · 12:00 PM – 1:00 PM
                    </div>
                    <div style={{color:'#374151'}}>P3 + P4 staggered within pairs</div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{padding:'8px 12px',background:'#fef3c7',borderRadius:'8px',
                    border:'1px solid #fde68a',fontSize:'11px'}}>
                    <div style={{fontWeight:'700',color:'#92400e',marginBottom:'2px'}}>
                      Lunch C1 · 12:00 – 1:00 PM
                    </div>
                    <div style={{color:'#374151'}}>PA + PB staggered within pairs</div>
                  </div>
                  <div style={{padding:'8px 12px',background:'#f3e8ff',borderRadius:'8px',
                    border:'1px solid #d8b4fe',fontSize:'11px'}}>
                    <div style={{fontWeight:'700',color:'#7c3aed',marginBottom:'2px'}}>
                      Lunch C2 · 1:00 – 2:00 PM
                    </div>
                    <div style={{color:'#374151'}}>PC + PD staggered within pairs</div>
                  </div>
                </>
              )}
            </div>

            {/* Overlap note */}
            {shift===1&&(
              <div style={{padding:'8px 12px',background:'#f0fdf4',borderRadius:'8px',
                border:'1px solid #86efac',fontSize:'12px',color:'#16a34a',marginBottom:'10px'}}>
                10AM-1PM overlap: 1st shift covers YMC1-4. 2nd shift covers YMC7/G1/UMI. Zero station conflicts.
                During lunch windows, 1st shift DCs cross-train on 2nd shift stations.
              </div>
            )}
            {/* Monitoring schedule banner */}
            <div style={{padding:'8px 12px',background:'#eff6ff',borderRadius:'8px',
              border:'1px solid #bfdbfe',fontSize:'11px',color:'#1d4ed8',marginBottom:'10px'}}>
              <strong>&#128270; Lead monitoring schedule (every 90 min · 30 min each):</strong>
              {shift===1 ? (
                <span> Kyle: 8:30-9:00, 10:30-11:00, 1:30-2:00 · Alan: 8:45-9:15, 10:45-11:15, 1:45-2:15</span>
              ) : (
                <span> David: 11:30-12:00, 2:00-2:30, 3:30-4:00, 5:30-6:00</span>
              )}
              &nbsp;· Partner runs SOLO during these windows.
            </div>

            {/* AUTO-ASSIGNMENT ALERTS */}
            {Object.entries(autoAssignments).map(([pod,assignments])=>(
              assignments.map((a,ai)=>(
                <div key={`${pod}_${ai}`} style={{padding:'10px 14px',background:'#fef3c7',
                  borderRadius:'10px',border:'1px solid #fde68a',fontSize:'12px',
                  color:'#92400e',marginBottom:'8px',display:'flex',
                  alignItems:'center',gap:'10px'}}>
                  <span style={{fontSize:'20px'}}>&#9888;</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:'700'}}>
                      {pod} is empty — {STATION_INFO[a.station]?.label} needs coverage
                    </div>
                    <div style={{marginTop:'2px',opacity:0.9}}>
                      Auto-assigned: <strong>{a.assignee.name}</strong> ({a.blockLabel})
                      {a.assignee.pod ? ` from Pod ${a.assignee.pod}` : ''}
                    </div>
                  </div>
                  {isLead && (
                    <button onClick={()=>setShowReassign(`${pod}_${a.station}_${ai}`)}
                      style={{padding:'5px 12px',borderRadius:'6px',fontSize:'11px',
                        border:'1px solid #f59e0b',background:'white',
                        color:'#92400e',cursor:'pointer',fontWeight:'600',flexShrink:0}}>
                      Override
                    </button>
                  )}
                  {showReassign===`${pod}_${a.station}_${ai}` && (
                    <div style={{position:'absolute',right:'16px',background:'white',
                      borderRadius:'10px',border:'1px solid #e5e7eb',padding:'12px',
                      boxShadow:'0 4px 16px rgba(0,0,0,0.1)',zIndex:50,minWidth:'200px'}}>
                      <div style={{fontSize:'12px',fontWeight:'600',marginBottom:'8px',color:'#374151'}}>
                        Reassign {STATION_INFO[a.station]?.label}
                      </div>
                      {[...ROSTER.s1,...ROSTER.s2]
                        .filter(m=>m.role==='DC'&&!absentIds.has(m.id)&&m.pod!==pod)
                        .slice(0,8)
                        .map(m=>(
                          <div key={m.id}
                            onClick={()=>{
                              setOverrides(prev=>({...prev,[`${pod}_${a.station}`]:m.id}))
                              setShowReassign(null)
                            }}
                            style={{padding:'6px 10px',borderRadius:'6px',cursor:'pointer',
                              fontSize:'12px',color:'#374151',
                              background:'#f9fafb',marginBottom:'4px',
                              border:'1px solid #e5e7eb'}}>
                            {m.name} · Pod {m.pod} · Shift {m.shift}
                          </div>
                        ))}
                      <button onClick={()=>setShowReassign(null)}
                        style={{width:'100%',padding:'6px',borderRadius:'6px',
                          border:'1px solid #e5e7eb',background:'white',
                          cursor:'pointer',fontSize:'11px',color:'#6b7280',marginTop:'4px'}}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))
            ))}

            {teamSchedule.map((row:any)=>{
              if (!row) return null
              const {pod,members,allPod,absentHere,personA,personB,isSolo,blocks} = row
              return (
                <div key={pod} style={{background:'white',borderRadius:'12px',
                  border:'1px solid #e5e7eb',marginBottom:'10px',overflow:'hidden'}}>
                  <div style={{padding:'10px 14px',background:'#f9fafb',
                    borderBottom:'1px solid #e5e7eb',display:'flex',
                    alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
                    <span style={{fontSize:'12px',fontWeight:'700',fontFamily:'monospace',
                      color:'white',background:'#374151',padding:'3px 10px',borderRadius:'6px'}}>{pod}</span>
                    {members.map((m:any)=>(
                      <span key={m.id} style={{padding:'3px 10px',borderRadius:'99px',
                        fontSize:'12px',fontWeight:'600',background:'#dcfce7',color:'#16a34a',
                        border:'1px solid #86efac'}}>{m.name}</span>
                    ))}
                    {absentHere.map((m:any)=>(
                      <span key={m.id} style={{padding:'3px 10px',borderRadius:'99px',
                        fontSize:'12px',background:'#fee2e2',color:'#dc2626',
                        border:'1px solid #fca5a5',textDecoration:'line-through',opacity:0.6}}>{m.name}</span>
                    ))}
                    {isSolo&&<span style={{marginLeft:'auto',padding:'3px 10px',borderRadius:'99px',
                      fontSize:'10px',fontWeight:'700',background:'#fef3c7',color:'#92400e'}}>SOLO</span>}
                    {!isSolo&&isMonitoringSolo&&<span style={{marginLeft:'auto',padding:'3px 10px',
                      borderRadius:'99px',fontSize:'10px',fontWeight:'700',
                      background:'#eff6ff',color:'#1d4ed8'}}>
                      SOLO · {leadInMon?.name.split(' ')[0]} monitoring
                    </span>}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:`repeat(${blocks.length},1fr)`,overflow:'hidden'}}>
                    {blocks.map((b:any,bi:number)=>{
                      const info = STATION_INFO[b.station]
                      if (!info) return <div key={bi}/>
                      const bAlert = getBlockAlert(b.startMin,b.durHrs,null)
                      const isActive = !!bAlert
                      const sessions = buildSessions(personA,personB,b.startMin,b.durHrs)
                      const activeIdx = bAlert?.sessionIndex??-1
                      return (
                        <div key={bi} style={{
                          borderRight:bi<blocks.length-1?'1px solid #e5e7eb':'none',
                          background:isActive?`${info.dot}08`:'white'}}>
                          <div style={{padding:'8px 10px',
                            background:isActive?`${info.dot}18`:'#fafafa',
                            borderBottom:'1px solid #f3f4f6'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'5px',marginBottom:'2px'}}>
                              <div style={{width:'8px',height:'8px',borderRadius:'50%',background:info.dot}}/>
                              <span style={{fontSize:'12px',fontWeight:'800'}}>{info.label}</span>
                              {b.isCross&&<span style={{fontSize:'8px',fontWeight:'700',
                                background:'#f3e8ff',color:'#7c3aed',padding:'1px 4px',
                                borderRadius:'3px'}}>X-TRAIN</span>}
                              {info.solo&&<span style={{fontSize:'8px',fontWeight:'700',
                                background:'#fef3c7',color:'#92400e',padding:'1px 4px',
                                borderRadius:'3px'}}>SOLO</span>}
                            </div>
                            <div style={{fontSize:'9px',color:'#6b7280'}}>{info.task}</div>
                            <div style={{fontSize:'8px',color:'#9ca3af',fontFamily:'monospace',marginTop:'2px'}}>
                              {b.label} · {b.timeLabel}
                            </div>
                            {isActive&&<div style={{fontSize:'8px',background:'#dcfce7',color:'#16a34a',
                              padding:'1px 4px',borderRadius:'3px',fontWeight:'700',
                              display:'inline-block',marginTop:'2px'}}>ACTIVE</div>}
                          </div>
                          <div style={{padding:'4px 8px'}}>
                            {sessions.slice(0,3).map((s:any,si:number)=>{
                              const isCur=si===activeIdx&&isActive
                              const isPast=isActive&&si<activeIdx
                              return (
                                <div key={si} style={{display:'flex',alignItems:'center',gap:'4px',
                                  padding:'3px 4px',borderRadius:'4px',marginBottom:'1px',
                                  background:isCur?`${info.dot}20`:isPast?'#f9fafb':'transparent'}}>
                                  <span style={{fontSize:'8px',fontWeight:'700',padding:'1px 3px',
                                    borderRadius:'3px',
                                    background:s.isPerson==='A'?'#dbeafe':'#fce7f3',
                                    color:s.isPerson==='A'?'#1d4ed8':'#be185d'}}>{s.isPerson}</span>
                                  <span style={{fontSize:'9px',color:isCur?'#111827':'#6b7280',
                                    fontWeight:isCur?'700':'400',
                                    fontFamily:'monospace'}}>{s.startTime}</span>
                                  <span style={{fontSize:'9px',color:'#374151'}}>{s.person}</span>
                                  {isCur&&<span style={{fontSize:'8px',background:'#dcfce7',
                                    color:'#16a34a',padding:'1px 3px',borderRadius:'3px',
                                    fontWeight:'700'}}>NOW</span>}
                                </div>
                              )
                            })}
                            {sessions.length>3&&(
                              <div style={{fontSize:'8px',color:'#9ca3af',padding:'2px 4px'}}>
                                +{sessions.length-3} more sessions
                              </div>
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
        )}

        {/* ── ROSTER TAB ───────────────────────────────────────────────────── */}
        {tab==='roster' && (
          <div style={{background:'white',borderRadius:'12px',
            border:'1px solid #e5e7eb',padding:'16px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
              <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
                textTransform:'uppercase',letterSpacing:'0.08em'}}>
                Shift {shift} roster {isLead?'· tap to toggle':''}
              </div>
              <span style={{fontSize:'10px',fontFamily:'monospace',padding:'2px 8px',
                borderRadius:'4px',background:synced?'#dcfce7':'#fee2e2',
                color:synced?'#16a34a':'#dc2626'}}>{synced?'live':'offline'}</span>
            </div>
            {(['LEAD','DC','DA'] as const).map(role=>(
              <div key={role} style={{marginBottom:'14px'}}>
                <div style={{fontSize:'10px',color:'#9ca3af',textTransform:'uppercase',
                  letterSpacing:'0.08em',marginBottom:'6px'}}>{role}s</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                  {pool.filter(m=>m.role===role&&!isGuest(m.id)&&!isSuperAdmin(m.id)).map(m=>{
                    const out=absentIds.has(m.id)
                    return (
                      <div key={m.id} onClick={()=>isLead&&!isGuest(m.id)&&toggle(m.id,currentUser?.id||'')}
                        style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 10px',
                          borderRadius:'8px',border:`1px solid ${out?'#fca5a5':'#e5e7eb'}`,
                          background:out?'#fef2f2':'#f9fafb',
                          cursor:isLead?'pointer':'default',transition:'all 0.15s'}}>
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
                        {isLead&&!isGuest(m.id)&&(
                          <button onClick={e=>{e.stopPropagation();setPin(m.id,DEFAULT_PIN);alert(`PIN for ${m.name} reset to 0000`)}}
                            style={{marginLeft:'2px',padding:'1px 5px',borderRadius:'4px',
                              fontSize:'9px',border:'1px solid #e5e7eb',background:'white',
                              cursor:'pointer',color:'#6b7280'}}>reset PIN</button>
                        )}
                        {(vacationMap[m.id]||[]).length>0&&(
                          <span style={{fontSize:'9px',background:'#eff6ff',color:'#1d4ed8',
                            padding:'1px 4px',borderRadius:'3px',border:'1px solid #bfdbfe'}}>
                            &#128197; off
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TIME OFF TAB — leads only ─────────────────────────────────────── */}
        {tab==='timeoff' && isLead && (
          <div style={{background:'white',borderRadius:'12px',
            border:'1px solid #e5e7eb',padding:'16px'}}>
            <div style={{fontSize:'14px',fontWeight:'700',marginBottom:'4px'}}>Upcoming Time Off</div>
            <div style={{fontSize:'12px',color:'#6b7280',marginBottom:'16px'}}>
              All scheduled absences across both shifts
            </div>
            {(()=>{
              const today=getToday()
              const entries: {staffId:string,name:string,role:string,shift:number,start:string,end:string,id:string,days:number}[]=[]
              Object.entries(vacationMap).forEach(([sid,ranges])=>{
                const person=ALL_PEOPLE.find(p=>p.id===sid)
                if (!person) return
                ranges.forEach(r=>{
                  if (r.end>=today) {
                    const days=Math.round((new Date(r.end).getTime()-new Date(r.start).getTime())/86400000)+1
                    entries.push({staffId:sid,name:person.name,role:person.role,shift:person.shift,start:r.start,end:r.end,id:r.id,days})
                  }
                })
              })
              entries.sort((a,b)=>a.start.localeCompare(b.start))
              const dayCounts: Record<string,number>={}
              entries.forEach(e=>{
                const cur=new Date(e.start);const end=new Date(e.end)
                while(cur<=end){const k=cur.toISOString().split('T')[0];dayCounts[k]=(dayCounts[k]||0)+1;cur.setDate(cur.getDate()+1)}
              })
              if (!entries.length) return (
                <div style={{textAlign:'center',padding:'32px',color:'#9ca3af',fontSize:'13px'}}>
                  No upcoming time off scheduled
                </div>
              )
              return (
                <div>
                  {Object.entries(dayCounts).filter(([,n])=>n>=3).map(([date,count])=>(
                    <div key={date} style={{padding:'8px 12px',background:'#fef2f2',
                      borderRadius:'8px',border:'1px solid #fca5a5',fontSize:'12px',
                      color:'#dc2626',marginBottom:'8px'}}>
                      &#9888; <strong>{new Date(date+'T12:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</strong>
                      &nbsp;— {count} people out. Review coverage.
                    </div>
                  ))}
                  {entries.map(e=>(
                    <div key={e.id} style={{display:'flex',alignItems:'center',gap:'10px',
                      padding:'10px 12px',borderRadius:'8px',background:'#f9fafb',
                      border:'1px solid #e5e7eb',marginBottom:'6px'}}>
                      <div style={{width:'32px',height:'32px',borderRadius:'50%',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:'10px',fontWeight:'700',flexShrink:0,
                        background:COLORS[e.role]?.[0]||'#f3f4f6',
                        color:COLORS[e.role]?.[1]||'#374151'}}>
                        {e.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'13px',fontWeight:'600'}}>{e.name}</div>
                        <div style={{fontSize:'11px',color:'#6b7280',fontFamily:'monospace'}}>
                          {e.role} · Shift {e.shift} · {e.start===e.end
                            ?new Date(e.start+'T12:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})
                            :`${new Date(e.start+'T12:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})} to ${new Date(e.end+'T12:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}`
                          } · {e.days} day{e.days>1?'s':''}
                        </div>
                      </div>
                      <span style={{padding:'2px 8px',borderRadius:'99px',fontSize:'10px',
                        fontWeight:'700',fontFamily:'monospace',
                        background:e.start<=today&&today<=e.end?'#fee2e2':'#eff6ff',
                        color:e.start<=today&&today<=e.end?'#dc2626':'#1d4ed8'}}>
                        {e.start<=today&&today<=e.end?'OUT NOW':'UPCOMING'}
                      </span>
                      <button onClick={()=>cancelTimeOff(e.id,e.staffId,e.start,e.end)}
                        style={{padding:'4px 10px',borderRadius:'6px',fontSize:'11px',
                          border:'1px solid #fca5a5',background:'#fef2f2',
                          color:'#dc2626',cursor:'pointer',flexShrink:0}}>Cancel</button>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        )}

        {/* ── ROTATION TAB ─────────────────────────────────────────────────── */}
        {tab==='rotation' && (
          <div>
            <div style={{background:'white',borderRadius:'12px',
              border:'1px solid #e5e7eb',padding:'16px',marginBottom:'12px'}}>
              <div style={{fontSize:'13px',fontWeight:'700',marginBottom:'4px'}}>
                8-Day Station Rotation · Shift {shift}
              </div>
              <div style={{fontSize:'12px',color:'#6b7280',marginBottom:'12px'}}>
                {shift===1
                  ?'1st shift stations: YMC1-4. Cross-trains on YMC7/G1/UMI during lunch window.'
                  :'2nd shift stations: YMC7, G1, UMI-C1, UMI-C2. Starts collection at 10:00 AM.'}
              </div>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px'}}>
                  <thead>
                    <tr style={{background:'#f9fafb'}}>
                      <th style={{padding:'8px',textAlign:'left',border:'1px solid #e5e7eb',
                        color:'#6b7280',fontFamily:'monospace'}}>Day</th>
                      {(shift===1
                        ?['P1 Marcio+Togiva','P2 LaQuon+Quincy','P3 Keyshawn+Ashley','P4 Kyle+Alan']
                        :['PA Kyria+Ethan','PB Flora+Andrew','PC Michael+Lavanya','PD David+Lucca']
                      ).map((h,i)=>(
                        <th key={i} style={{padding:'8px',textAlign:'center',
                          border:'1px solid #e5e7eb',color:'#374151',fontWeight:'600',fontSize:'10px'}}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({length:8},(_,i)=>{
                      const rot = shift===1?ROTATION_S1[String(i)]:ROTATION_S2[String(i)]
                      const pods = shift===1?['P1','P2','P3','P4']:['PA','PB','PC','PD']
                      const isToday = i===dayIdx
                      return (
                        <tr key={i} style={{background:isToday?'#eff6ff':i%2===0?'white':'#f9fafb'}}>
                          <td style={{padding:'8px',border:'1px solid #e5e7eb',
                            fontWeight:isToday?'800':'500',fontFamily:'monospace',
                            color:isToday?'#1d4ed8':'#374151'}}>
                            Day {i+1}
                            {isToday&&<span style={{marginLeft:'6px',fontSize:'9px',
                              background:'#3b82f6',color:'white',
                              padding:'1px 6px',borderRadius:'4px'}}>TODAY</span>}
                          </td>
                          {pods.map(pod=>{
                            const sts=rot?.[pod] as string[]|undefined
                            if (!sts) return <td key={pod}/>
                            return (
                              <td key={pod} style={{padding:'5px 6px',border:'1px solid #e5e7eb',textAlign:'center'}}>
                                <div style={{display:'flex',flexDirection:'column',gap:'2px'}}>
                                  {sts.map((stId:string,si:number)=>{
                                    const info=STATION_INFO[stId]
                                    if (!info) return null
                                    return (
                                      <span key={si} style={{padding:'2px 4px',borderRadius:'4px',
                                        background:`${info.dot}22`,color:info.dot,
                                        fontWeight:'700',fontSize:'9px',
                                        border:`0.5px solid ${info.dot}44`}}>
                                        {si===2&&shift===1?'X:':''}{info.label}
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
              <strong>1st shift (YMC1-4):</strong> Block 1 (7-9AM) → Block 2 (9-11AM) → Cross-train on 2nd shift station during lunch (11AM-1PM staggered) → Block 4 (1-3PM)<br/>
              <strong>2nd shift (YMC7/G1/UMI):</strong> Block 1 (10AM-12PM) → Block 2 (12-1PM) → Lunch staggered 1-2PM → Block 3 (2-4PM) → Block 4 (4-6PM)<br/>
              <strong>X:</strong> marks cross-training slot in rotation grid · <strong>UMI stations</strong> = 1 person each
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
