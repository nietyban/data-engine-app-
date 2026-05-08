'use client'

import { useState, useEffect, useCallback } from 'react'
export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
// Lazy init so it doesn't crash during Next.js static pre-rendering
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || !url.startsWith('http')) return null
  return createClient(url, key)
}
const supabase = typeof window !== 'undefined' ? getSupabase() : null

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
    {id:'sw',    name:'Sang Woo',        role:'DA',   shift:1, pod:null},
    {id:'guest', name:'Guest / Observer', role:'GUEST',shift:1, pod:null},
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
    {id:'tc',  name:'Tracy Corleone',        role:'DA',   shift:2, pod:null},
    {id:'as2', name:'Aarushi Sharma',        role:'DA',   shift:2, pod:null},
    {id:'jc',  name:'Julian Cruz',           role:'DA',   shift:2, pod:null},
    {id:'al',  name:'Aaliyah',               role:'DA',   shift:2, pod:null},
    {id:'rrp',   name:'Rathinapriya Ramjagan', role:'DA',   shift:2, pod:null},
    {id:'rr',    name:'Rashila Ravichandran',  role:'LEAD', shift:2, pod:null},
    {id:'guest2',name:'Guest / Observer',      role:'GUEST',shift:2, pod:null},
  ]
}

const ALL_PEOPLE = [...ROSTER.s1, ...ROSTER.s2]

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

const LUNCH_A_MEMBERS = ['kw','mr','ta','lp']
const LUNCH_B_MEMBERS = ['ah','qf','ks','am']

const COLORS: Record<string,string[]> = {
  LEAD:['#E6F1FB','#0C447C'],
  DC:  ['#EAF3DE','#3B6D11'],
  DA:  ['#F1EFE8','#5F5E5A'],
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

// ─── ROBOT DECORATIONS ────────────────────────────────────────────────────────
function RobotSmall({x,y,size=40,opacity=0.18,flip=false}: {x:string,y:string,size?:number,opacity?:number,flip?:boolean}) {
  return (
    <div style={{position:'absolute',left:x,top:y,opacity,pointerEvents:'none',
      transform:flip?'scaleX(-1)':'none',userSelect:'none'}}>
      <svg width={size} height={size*1.4} viewBox="0 0 40 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <rect x="10" y="2" width="20" height="16" rx="4" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="1.5"/>
        {/* Antenna */}
        <line x1="20" y1="2" x2="20" y2="-4" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="20" cy="-5" r="2" fill="#60a5fa"/>
        {/* Eyes */}
        <circle cx="15" cy="9" r="3" fill="#bfdbfe"/>
        <circle cx="15" cy="9" r="1.5" fill="#1d4ed8"/>
        <circle cx="25" cy="9" r="3" fill="#bfdbfe"/>
        <circle cx="25" cy="9" r="1.5" fill="#1d4ed8"/>
        {/* Mouth */}
        <rect x="14" y="14" width="12" height="2" rx="1" fill="#60a5fa"/>
        {/* Neck */}
        <rect x="18" y="18" width="4" height="3" fill="#3b82f6"/>
        {/* Body */}
        <rect x="8" y="21" width="24" height="20" rx="4" fill="#2563eb" stroke="#3b82f6" strokeWidth="1.5"/>
        {/* Chest panel */}
        <rect x="13" y="25" width="14" height="8" rx="2" fill="#1d4ed8"/>
        <circle cx="17" cy="29" r="2" fill="#60a5fa"/>
        <circle cx="23" cy="29" r="2" fill="#22c55e"/>
        {/* Arms */}
        <rect x="1" y="22" width="7" height="14" rx="3" fill="#2563eb" stroke="#3b82f6" strokeWidth="1"/>
        <rect x="32" y="22" width="7" height="14" rx="3" fill="#2563eb" stroke="#3b82f6" strokeWidth="1"/>
        {/* Hands */}
        <circle cx="4.5" cy="38" r="3" fill="#3b82f6"/>
        <circle cx="35.5" cy="38" r="3" fill="#3b82f6"/>
        {/* Legs */}
        <rect x="12" y="41" width="7" height="13" rx="3" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="1"/>
        <rect x="21" y="41" width="7" height="13" rx="3" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="1"/>
        {/* Feet */}
        <rect x="10" y="51" width="11" height="4" rx="2" fill="#3b82f6"/>
        <rect x="19" y="51" width="11" height="4" rx="2" fill="#3b82f6"/>
      </svg>
    </div>
  )
}

function RobotBg() {
  return (
    <div style={{position:'fixed',inset:0,overflow:'hidden',pointerEvents:'none',zIndex:0}}>
      <RobotSmall x="2%" y="8%" size={70} opacity={0.10}/>
      <RobotSmall x="88%" y="5%" size={55} opacity={0.09} flip/>
      <RobotSmall x="5%" y="55%" size={50} opacity={0.07}/>
      <RobotSmall x="91%" y="48%" size={65} opacity={0.08} flip/>
      <RobotSmall x="45%" y="2%" size={42} opacity={0.07}/>
      <RobotSmall x="20%" y="88%" size={48} opacity={0.06}/>
      <RobotSmall x="75%" y="82%" size={52} opacity={0.07} flip/>
      <RobotSmall x="60%" y="30%" size={35} opacity={0.05}/>
    </div>
  )
}

// ─── PIN HELPERS ─────────────────────────────────────────────────────────────
const DEFAULT_PIN = '0000'

function getPin(staffId: string): string {
  if (staffId === 'guest' || staffId === 'guest2') return '1234'
  if (typeof window === 'undefined') return DEFAULT_PIN
  return localStorage.getItem(`pin_${staffId}`) || DEFAULT_PIN
}

function isDefaultPin(staffId: string): boolean {
  return getPin(staffId) === DEFAULT_PIN
}

function setPin(staffId: string, pin: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`pin_${staffId}`, pin)
}

function isGuest(staffId: string | null): boolean {
  return staffId === 'guest' || staffId === 'guest2'
}

function getDayIndex() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime()-start.getTime())/86400000)
  return dayOfYear % 8
}

function getNowMin() {
  const now = new Date()
  return now.getHours()*60+now.getMinutes()
}

function getClockTime() {
  return new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'})
}

function getCalendarDate() {
  return new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})
}

function getToday() {
  return new Date().toISOString().split('T')[0]
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
  const nowMin=getNowMin(), elapsed=nowMin-blockStartMin, remaining=(blockStartMin+blockDurHrs*60)-nowMin
  if (elapsed<0||elapsed>=blockDurHrs*60) return null
  return {elapsed,remaining,sessionIndex:Math.floor(elapsed/18),personTurn:Math.floor(elapsed/18)%2,
          isWarning:remaining<=10&&remaining>6&&!!nextStation,
          isAlert:remaining<=6&&!!nextStation,nextStation}
}

// ─── REAL-TIME ATTENDANCE HOOK ────────────────────────────────────────────────
function useRealtimeAttendance(userId: string|null) {
  const today = getToday()
  const [absentIds, setAbsentIds] = useState<Set<string>>(new Set(['gr']))
  const [loading, setLoading]     = useState(true)
  const [synced, setSynced]       = useState(false)
  const [vacationMap, setVacationMap] = useState<Record<string,{start:string,end:string,id:string}[]>>({})

  // Load from Supabase on mount
  useEffect(() => {
    async function load() {
      try {
        if (!supabase) { setLoading(false); return }
        // Load attendance
        const { data, error } = await supabase
          .from('attendance')
          .select('staff_id, status')
          .eq('shift_date', today)
        if (error) { console.error('Load error:', error); setLoading(false); return }
        if (data && data.length > 0) {
          const absent = new Set(
            data.filter((r:any) => r.status==='absent').map((r:any) => r.staff_id)
          )
          absent.add('gr')
          setAbsentIds(absent)
          setSynced(true)
        }
        // Load vacation ranges
        const { data: vacData } = await supabase
          .from('time_off')
          .select('id, staff_id, start_date, end_date')
          .gte('end_date', today)
        if (vacData) {
          const vmap: Record<string,{start:string,end:string,id:string}[]> = {}
          vacData.forEach((v:any) => {
            if (!vmap[v.staff_id]) vmap[v.staff_id] = []
            vmap[v.staff_id].push({start:v.start_date,end:v.end_date,id:v.id})
          })
          setVacationMap(vmap)
        }
      } catch(e) { console.error('Supabase load failed:', e) }
      finally { setLoading(false) }
    }
    load()
  }, [today])

  // Real-time subscription — fires on ANY attendance change
  useEffect(() => {
    if (!supabase) return
    const channel = supabase
      .channel(`attendance-${today}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'attendance',
        filter: `shift_date=eq.${today}`,
      }, async (payload: any) => {
        // Re-fetch full set on any change
        const { data } = await supabase
          .from('attendance')
          .select('staff_id, status')
          .eq('shift_date', today)
        if (data) {
          const absent = new Set(
            data.filter((r:any) => r.status==='absent').map((r:any) => r.staff_id)
          )
          absent.add('gr')
          setAbsentIds(new Set(absent))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [today])

  // Toggle a person's attendance and write to Supabase
  const toggle = useCallback(async (staffId: string, markedBy: string) => {
    const isCurrentlyAbsent = absentIds.has(staffId)
    const newStatus = isCurrentlyAbsent ? 'present' : 'absent'

    // Optimistic update — update local state immediately
    setAbsentIds(prev => {
      const next = new Set(prev)
      if (newStatus==='absent') next.add(staffId)
      else next.delete(staffId)
      return next
    })

    try {
      if (!supabase) return
      const { error } = await supabase
        .from('attendance')
        .upsert({
          staff_id:   staffId,
          shift_date: today,
          status:     newStatus,
          marked_by:  markedBy,
          marked_at:  new Date().toISOString(),
        }, { onConflict: 'staff_id,shift_date' })

      if (error) {
        console.error('Supabase write error:', error)
        // Revert on error
        setAbsentIds(prev => {
          const next = new Set(prev)
          if (newStatus==='absent') next.delete(staffId)
          else next.add(staffId)
          return next
        })
      }
    } catch(e) {
      console.error('Toggle failed:', e)
    }
  }, [absentIds, today])

  // Ensure today's attendance rows exist
  useEffect(() => {
    async function ensureRows() {
      try {
        // Insert present rows for all active staff (ignore conflicts)
        if (!supabase) return
      const rows = ALL_PEOPLE
          .filter(p => p.id !== 'gr')
          .map(p => ({
            staff_id:   p.id,
            shift_date: today,
            status:     'present',
          }))
        await supabase
          .from('attendance')
          .upsert(rows, { onConflict: 'staff_id,shift_date', ignoreDuplicates: true })
      } catch(e) { /* silent */ }
    }
    ensureRows()
  }, [today])

  // Book time off — marks absent for each day in range
  const bookTimeOff = async (staffId: string, startDate: string, endDate: string) => {
    if (!supabase) return
    try {
      // Insert into time_off table
      const { data: tof } = await supabase
        .from('time_off')
        .insert({ staff_id: staffId, start_date: startDate, end_date: endDate })
        .select()
      // Mark absent for each day in range
      const rows = []
      const cur = new Date(startDate)
      const end = new Date(endDate)
      while (cur <= end) {
        rows.push({
          staff_id: staffId,
          shift_date: cur.toISOString().split('T')[0],
          status: 'absent',
          marked_by: staffId,
          marked_at: new Date().toISOString(),
          notes: 'scheduled time off',
        })
        cur.setDate(cur.getDate() + 1)
      }
      await supabase.from('attendance').upsert(rows, { onConflict: 'staff_id,shift_date' })
      // Reload vacation map
      const { data: vacData } = await supabase
        .from('time_off').select('id, staff_id, start_date, end_date').gte('end_date', today)
      if (vacData) {
        const vmap: Record<string,{start:string,end:string,id:string}[]> = {}
        vacData.forEach((v:any) => {
          if (!vmap[v.staff_id]) vmap[v.staff_id] = []
          vmap[v.staff_id].push({start:v.start_date,end:v.end_date,id:v.id})
        })
        setVacationMap(vmap)
      }
      // Update absent if today is in range
      if (startDate <= today && today <= endDate) {
        setAbsentIds(prev => { const n=new Set(prev); n.add(staffId); return n })
      }
    } catch(e) { console.error('bookTimeOff error:', e) }
  }

  // Cancel time off
  const cancelTimeOff = async (timeOffId: string, staffId: string, startDate: string, endDate: string) => {
    if (!supabase) return
    try {
      await supabase.from('time_off').delete().eq('id', timeOffId)
      // Un-mark absent for days that no longer have time off
      const cur = new Date(startDate)
      const end = new Date(endDate)
      while (cur <= end) {
        const d = cur.toISOString().split('T')[0]
        await supabase.from('attendance')
          .upsert({ staff_id: staffId, shift_date: d, status: 'present',
                    marked_by: staffId, marked_at: new Date().toISOString() },
                  { onConflict: 'staff_id,shift_date' })
        cur.setDate(cur.getDate() + 1)
      }
      // Remove from local map
      setVacationMap(prev => {
        const n = {...prev}
        if (n[staffId]) n[staffId] = n[staffId].filter(v=>v.id!==timeOffId)
        return n
      })
      if (startDate <= today && today <= endDate) {
        setAbsentIds(prev => { const n=new Set(prev); n.delete(staffId); return n })
      }
    } catch(e) { console.error('cancelTimeOff error:', e) }
  }

  // Save PIN to Supabase roster table
  const savePinToDb = async (staffId: string, pin: string) => {
    if (!supabase) {
      // Fallback to localStorage
      if (typeof window !== 'undefined') localStorage.setItem(`pin_${staffId}`, pin)
      return
    }
    try {
      await supabase.from('roster').update({ clerk_user_id: `pin:${pin}` }).eq('id', staffId)
      // Also save locally as cache
      if (typeof window !== 'undefined') localStorage.setItem(`pin_${staffId}`, pin)
    } catch(e) {
      if (typeof window !== 'undefined') localStorage.setItem(`pin_${staffId}`, pin)
    }
  }

  // Load PIN from Supabase (falls back to localStorage)
  const loadPinFromDb = async (staffId: string): Promise<string> => {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem(`pin_${staffId}`)
      if (local) return local
    }
    if (!supabase) return DEFAULT_PIN
    try {
      const { data } = await supabase.from('roster').select('clerk_user_id').eq('id', staffId).single()
      if (data?.clerk_user_id?.startsWith('pin:')) {
        const pin = data.clerk_user_id.replace('pin:','')
        if (typeof window !== 'undefined') localStorage.setItem(`pin_${staffId}`, pin)
        return pin
      }
    } catch(e) {}
    return DEFAULT_PIN
  }

  return { absentIds, loading, synced, toggle, vacationMap, bookTimeOff, cancelTimeOff, savePinToDb, loadPinFromDb }
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [shift,        setShift]        = useState<1|2>(1)
  const [tab,          setTab]          = useState<string>('schedule')
  const [selectedUser, setSelectedUser] = useState<string|null>(null)
  const [loggedIn,     setLoggedIn]     = useState(false)
  const [clock,        setClock]        = useState(getClockTime())
  const [pinStep,      setPinStep]      = useState(false)
  const [pinInput,     setPinInput]     = useState('')
  const [pinError,     setPinError]     = useState('')
  const [pinAttempts,  setPinAttempts]  = useState(0)
  const [pinLocked,    setPinLocked]    = useState(false)
  const [pinLockUntil, setPinLockUntil] = useState<number|null>(null)
  const [showSetPin,   setShowSetPin]   = useState(false)
  const [newPin,       setNewPin]       = useState('')
  const [newPinConfirm,setNewPinConfirm]= useState('')
  const [pinSetMsg,    setPinSetMsg]    = useState('')
  const [showTimeOff,  setShowTimeOff]  = useState(false)
  const [toStart,      setToStart]      = useState('')
  const [toEnd,        setToEnd]        = useState('')
  const [toMsg,        setToMsg]        = useState('')

  const { absentIds, loading, synced, toggle, vacationMap, bookTimeOff, cancelTimeOff, savePinToDb, loadPinFromDb } = useRealtimeAttendance(selectedUser)

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setClock(getClockTime()), 1000)
    return () => clearInterval(t)
  }, [])

  const pool      = ROSTER[`s${shift}` as 's1'|'s2']
  const dayIdx    = getDayIndex()
  const dayStr    = String(dayIdx)
  const rotation  = shift===1 ? ROTATION_S1[dayStr] : ROTATION_S2[dayStr]
  const lunchCover= shift===1 ? LUNCH_COVER_S1[dayStr] : null

  const currentUser = selectedUser ? ALL_PEOPLE.find(m=>m.id===selectedUser) : null
  const presentDCs  = pool.filter(m=>m.role==='DC'&&!absentIds.has(m.id)).length
  const absentDCs   = pool.filter(m=>m.role==='DC'&&absentIds.has(m.id)).length
  const presentDAs  = pool.filter(m=>m.role==='DA'&&!absentIds.has(m.id)).length

  function getCurrentBlock(pod:string) {
    const ps = rotation?.[pod]
    if (!ps) return null
    const dataBlocks = shift===1
      ? [{idx:0,startMin:7*60,  durHrs:2,nextSt:ps[1]},
         {idx:1,startMin:9*60,  durHrs:2,nextSt:lunchCover?.[pod]||null},
         {idx:2,startMin:12*60, durHrs:1,nextSt:ps[3]},
         {idx:3,startMin:13*60, durHrs:2,nextSt:null}]
      : [{idx:0,startMin:10*60, durHrs:2,nextSt:ps[1]},
         {idx:1,startMin:12*60, durHrs:1,nextSt:ps[2]},
         {idx:2,startMin:14*60, durHrs:2,nextSt:ps[3]},
         {idx:3,startMin:16*60, durHrs:2,nextSt:null}]
    for (const b of dataBlocks) {
      const alert = getBlockAlert(b.startMin, b.durHrs, b.nextSt)
      if (alert) return {...b, alert}
    }
    return null
  }

  const myPod          = currentUser?.pod
  const myCurrentBlock = myPod ? getCurrentBlock(myPod) : null
  const globalAlert    = myCurrentBlock?.alert?.isAlert
  const globalWarn     = myCurrentBlock?.alert?.isWarning

  const pods = shift===1 ? ['P1','P2','P3','P4'] : ['PA','PB','PC','PD']

  // ── LOGIN ────────────────────────────────────────────────────────────────────
  if (!loggedIn) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',
      minHeight:'100vh',flexDirection:'column',fontFamily:'system-ui',
      background:'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #dbeafe 100%)',
      padding:'20px',position:'relative'}}>
      <RobotBg/>
      <div style={{background:'white',padding:'32px',borderRadius:'16px',
        boxShadow:'0 4px 24px rgba(0,0,0,0.08)',width:'100%',maxWidth:'400px',
        position:'relative',zIndex:1}}>

        {!pinStep ? (
          <>
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
                  {s===1?'1st Shift · 7AM-3PM':'2nd Shift · 10AM-6PM'}
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
                <option key={p.id} value={p.id}>
                  {p.name} - {p.role}{p.pod?' - '+p.pod:''}
                </option>
              ))}
            </select>
            <div style={{padding:'10px 14px',background:'#fffbeb',borderRadius:'8px',
              border:'1px solid #fde68a',fontSize:'12px',color:'#92400e',
              marginBottom:'16px',display:'flex',gap:'8px'}}>
              <span>Cutoff: {shift===1?'6:30 AM':'9:30 AM'} - mark absent before this time</span>
            </div>
            <button
              disabled={!selectedUser}
              onClick={()=>{ setPinStep(true); setPinInput(''); setPinError('') }}
              style={{width:'100%',padding:'13px',borderRadius:'10px',
                background:selectedUser?'#3b82f6':'#e5e7eb',
                color:selectedUser?'white':'#9ca3af',
                border:'none',fontSize:'15px',fontWeight:'700',
                cursor:selectedUser?'pointer':'default'}}>
              Continue
            </button>
          </>
        ) : (
          <>
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
              {isGuest(selectedUser) ? (
                <div style={{marginTop:'8px',padding:'6px 12px',background:'#eff6ff',
                  borderRadius:'8px',border:'1px solid #bfdbfe',fontSize:'11px',color:'#1d4ed8'}}>
                  Observer PIN: <strong>1234</strong>
                </div>
              ) : getPin(selectedUser||'') === DEFAULT_PIN ? (
                <div style={{marginTop:'8px',padding:'6px 12px',background:'#fffbeb',
                  borderRadius:'8px',border:'1px solid #fde68a',fontSize:'11px',color:'#92400e'}}>
                  Default PIN is 0000
                </div>
              ) : null}
            </div>
            <div style={{display:'flex',justifyContent:'center',gap:'16px',marginBottom:'20px'}}>
              {[0,1,2,3].map(i=>(
                <div key={i} style={{width:'18px',height:'18px',borderRadius:'50%',
                  background:pinInput.length>i?(pinError?'#ef4444':'#3b82f6'):'#e5e7eb'}}/>
              ))}
            </div>
            {pinError && (
              <div style={{padding:'8px 12px',background:'#fef2f2',borderRadius:'8px',
                border:'1px solid #fca5a5',fontSize:'12px',color:'#dc2626',
                textAlign:'center',marginBottom:'12px'}}>
                {pinError}
              </div>
            )}
            {!pinLocked ? (
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px'}}>
                {['1','2','3','4','5','6','7','8','9','','0','<'].map((d,i)=>(
                  <button key={i}
                    onClick={()=>{
                      if (!d) return
                      if (d==='<') { setPinInput(p=>p.slice(0,-1)); return }
                      if (pinLocked && Date.now()<(pinLockUntil||0)) return
                      const next=(pinInput+d).slice(0,4)
                      setPinInput(next)
                      setPinError('')
                      if (next.length===4) {
                        const correct = getPin(selectedUser||'')
                        if (next===correct) {
                          setPinInput(''); setPinStep(false); setPinAttempts(0); setLoggedIn(true)
                        } else {
                          const att=pinAttempts+1
                          setPinAttempts(att)
                          if (att>=3) {
                            setPinLocked(true); setPinLockUntil(Date.now()+300000)
                            setPinError('Too many attempts. Locked 5 min.')
                          } else {
                            setPinError('Wrong PIN. '+(3-att)+' attempt(s) left.')
                          }
                          setTimeout(()=>setPinInput(''),600)
                        }
                      }
                    }}
                    style={{padding:'16px',borderRadius:'12px',fontSize:'20px',
                      fontWeight:'600',cursor:d?'pointer':'default',
                      border:d?'1px solid #e5e7eb':'none',
                      background:d==='<'?'#fef2f2':d?'white':'transparent',
                      color:d==='<'?'#dc2626':'#374151'}}>
                    {d==='<'?'del':d}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{textAlign:'center',padding:'20px',color:'#dc2626',fontSize:'13px'}}>
                Locked - Contact your shift lead to reset
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )


  // ── PIN ENTRY SCREEN ─────────────────────────────────────────────────────────
  if (!loggedIn && pinStep && selectedUser) {
    const user = ALL_PEOPLE.find(m=>m.id===selectedUser)
    const isDefault = isDefaultPin(selectedUser)
    const lockRemaining = pinLockUntil ? Math.ceil((pinLockUntil - Date.now()) / 1000) : 0

    const handlePinDigit = (digit: string) => {
      if (pinLocked && Date.now() < (pinLockUntil||0)) return
      if (pinLocked) { setPinLocked(false); setPinAttempts(0) }
      const next = (pinInput + digit).slice(0, 4)
      setPinInput(next)
      setPinError('')
      if (next.length === 4) {
        if (next === getPin(selectedUser)) {
          setPinInput(''); setPinStep(false); setPinAttempts(0)
          setLoggedIn(true)
        } else {
          const attempts = pinAttempts + 1
          setPinAttempts(attempts)
          if (attempts >= 3) {
            setPinLocked(true)
            setPinLockUntil(Date.now() + 5 * 60 * 1000)
            setPinError('Too many attempts. Locked for 5 minutes.')
          } else {
            setPinError(`Incorrect PIN. ${3 - attempts} attempt${3-attempts===1?'':'s'} remaining.`)
          }
          setTimeout(() => setPinInput(''), 600)
        }
      }
    }

    const handlePinDelete = () => {
      setPinInput(p => p.slice(0, -1))
      setPinError('')
    }

    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',
        minHeight:'100vh',flexDirection:'column',fontFamily:'system-ui',
        background:"linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #dbeafe 100%)",
        padding:'20px',position:'relative'}}>
        <RobotBg/>
        <div style={{background:'white',padding:'32px',borderRadius:'16px',
          boxShadow:'0 4px 24px rgba(0,0,0,0.08)',width:'100%',maxWidth:'360px',
          position:'relative',zIndex:1}}>

          {/* Back button */}
          <button onClick={()=>{setPinStep(false);setPinInput('');setPinError('')}}
            style={{background:'none',border:'none',cursor:'pointer',
              fontSize:'13px',color:'#6b7280',marginBottom:'16px',padding:'0',
              display:'flex',alignItems:'center',gap:'4px'}}>
            ← Back
          </button>

          <div style={{textAlign:'center',marginBottom:'24px'}}>
            <div style={{width:'56px',height:'56px',borderRadius:'50%',
              background:'#eff6ff',border:'2px solid #3b82f6',
              display:'flex',alignItems:'center',justifyContent:'center',
              margin:'0 auto 12px',fontSize:'20px'}}>
              🔐
            </div>
            <div style={{fontSize:'18px',fontWeight:'700',marginBottom:'4px'}}>
              Enter your PIN
            </div>
            <div style={{fontSize:'13px',color:'#6b7280'}}>
              {user?.name}
            </div>
            {isDefault && (
              <div style={{marginTop:'8px',padding:'6px 12px',background:'#fffbeb',
                borderRadius:'8px',border:'1px solid #fde68a',fontSize:'11px',
                color:'#92400e'}}>
                Default PIN is <strong>0000</strong> — change it after logging in
              </div>
            )}
          </div>

          {/* PIN dots */}
          <div style={{display:'flex',justifyContent:'center',gap:'16px',marginBottom:'24px'}}>
            {[0,1,2,3].map(i=>(
              <div key={i} style={{width:'16px',height:'16px',borderRadius:'50%',
                background: pinInput.length > i
                  ? pinError ? '#ef4444' : '#3b82f6'
                  : '#e5e7eb',
                transition:'background 0.15s'}}/>
            ))}
          </div>

          {/* Error message */}
          {pinError && (
            <div style={{padding:'8px 12px',background:'#fef2f2',borderRadius:'8px',
              border:'1px solid #fca5a5',fontSize:'12px',color:'#dc2626',
              textAlign:'center',marginBottom:'16px'}}>
              {pinError}
            </div>
          )}

          {/* Numpad */}
          {!pinLocked && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px'}}>
              {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d,i)=>(
                <button key={i} onClick={()=>d==='⌫'?handlePinDelete():d&&handlePinDigit(d)}
                  disabled={!d}
                  style={{padding:'16px',borderRadius:'12px',fontSize:'18px',
                    fontWeight:'600',cursor:d?'pointer':'default',
                    border:`1px solid ${d?'#e5e7eb':'transparent'}`,
                    background: d==='⌫'?'#fef2f2': d?'white':'transparent',
                    color: d==='⌫'?'#dc2626':'#374151',
                    transition:'all 0.1s'}}>
                  {d}
                </button>
              ))}
            </div>
          )}

          {pinLocked && (
            <div style={{textAlign:'center',padding:'20px',color:'#dc2626',
              fontSize:'13px'}}>
              🔒 Account locked · Contact your shift lead to reset
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
  return (
    <div style={{fontFamily:'system-ui',background:'linear-gradient(160deg, #dbeafe 0%, #bae6fd 40%, #dbeafe 100%)',minHeight:'100vh',position:'relative',
      padding:'16px',maxWidth:'960px',margin:'0 auto'}}>
      <RobotBg/>

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
              Move to <strong>{STATION_INFO[myCurrentBlock.alert.nextStation].label}</strong>
              &nbsp;— {STATION_INFO[myCurrentBlock.alert.nextStation].task}
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
              Next → <strong>{STATION_INFO[myCurrentBlock.alert.nextStation].label}</strong>
              &nbsp;({STATION_INFO[myCurrentBlock.alert.nextStation].task}) · Start wrapping up
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
          {/* Sync indicator */}
          <span style={{fontSize:'10px',fontFamily:'monospace',padding:'2px 6px',
            borderRadius:'4px',
            background:synced?'#dcfce7':loading?'#fef3c7':'#fee2e2',
            color:synced?'#16a34a':loading?'#92400e':'#dc2626'}}>
            {synced?'● live sync':loading?'● connecting...':'● offline'}
          </span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <span style={{fontSize:'12px',fontWeight:'500'}}>{currentUser?.name}</span>
          <button onClick={()=>setLoggedIn(false)}
            style={{padding:'5px 10px',border:'1px solid #e5e7eb',
              borderRadius:'6px',fontSize:'11px',cursor:'pointer',background:'white'}}>
            sign out
          </button>
        </div>
      </div>

      {/* DATE + CLOCK */}
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
          {[1,2].map(s=>(
            <button key={s} onClick={()=>setShift(s as 1|2)}
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

      {/* GUEST VIEW */}
      {currentUser?.role==='GUEST' && (
        <div style={{background:'white',borderRadius:'12px',
          border:'2px solid #bfdbfe',padding:'16px',marginBottom:'12px',
          textAlign:'center'}}>
          <div style={{fontSize:'32px',marginBottom:'8px'}}>👀</div>
          <div style={{fontSize:'16px',fontWeight:'700',marginBottom:'4px'}}>
            Observer Mode
          </div>
          <div style={{fontSize:'13px',color:'#6b7280',marginBottom:'12px'}}>
            You are viewing the Data Engine schedule in read-only mode.
            You cannot make changes to attendance or assignments.
          </div>
          <div style={{padding:'8px 14px',background:'#eff6ff',borderRadius:'8px',
            border:'1px solid #bfdbfe',fontSize:'12px',color:'#1d4ed8'}}>
            Browse the Schedule, Roster, and Rotation tabs below to explore the team layout.
          </div>
        </div>
      )}

      {/* MY STATUS — DAs */}
      {currentUser?.role==='DA' && (
        <div style={{background:'white',borderRadius:'12px',
          border:`2px solid ${absentIds.has(currentUser.id)?'#fca5a5':'#a5f3fc'}`,
          padding:'16px',marginBottom:'12px'}}>
          <div style={{display:'flex',alignItems:'center',
            justifyContent:'space-between',marginBottom:'12px'}}>
            <div>
              <div style={{fontWeight:'700',fontSize:'15px'}}>{currentUser.name}</div>
              <div style={{fontSize:'11px',color:'#6b7280',fontFamily:'monospace'}}>
                DA · Shift {currentUser.shift}
              </div>
            </div>
            <span style={{padding:'4px 12px',borderRadius:'99px',fontSize:'11px',
              fontWeight:'700',fontFamily:'monospace',
              background:absentIds.has(currentUser.id)?'#fee2e2':'#cffafe',
              color:absentIds.has(currentUser.id)?'#dc2626':'#0e7490'}}>
              {absentIds.has(currentUser.id)?'ABSENT':'PRESENT'}
            </span>
          </div>

          {/* Status message */}
          {absentIds.has(currentUser.id) ? (
            <div style={{padding:'10px 14px',background:'#fef2f2',borderRadius:'8px',
              border:'1px solid #fca5a5',fontSize:'12px',color:'#dc2626',
              marginBottom:'12px',display:'flex',gap:'8px',alignItems:'center'}}>
              <span>📋</span>
              <div>
                <div style={{fontWeight:'700'}}>You are marked absent for today</div>
                <div style={{opacity:0.8,marginTop:'2px'}}>
                  Your lead has been notified. Tap below if your plans change.
                </div>
              </div>
            </div>
          ) : (
            <div style={{padding:'10px 14px',background:'#ecfeff',borderRadius:'8px',
              border:'1px solid #a5f3fc',fontSize:'12px',color:'#0e7490',
              marginBottom:'12px',display:'flex',gap:'8px',alignItems:'center'}}>
              <span>📋</span>
              <div>
                <div style={{fontWeight:'700'}}>You are confirmed present today</div>
                <div style={{opacity:0.8,marginTop:'2px'}}>
                  Contact your shift lead for today's task assignment and station pairing.
                </div>
              </div>
            </div>
          )}

          {/* Cutoff reminder */}
          <div style={{padding:'8px 12px',background:'#fffbeb',borderRadius:'8px',
            border:'1px solid #fde68a',fontSize:'11px',color:'#92400e',
            fontFamily:'monospace',marginBottom:'12px',display:'flex',gap:'6px'}}>
            <span>⏰</span>
            <span>
              Cutoff: <strong>{currentUser.shift===1?'6:30 AM':'9:30 AM'}</strong>
              &nbsp;· Mark absent before this time if you know you won't be in
            </span>
          </div>

          {/* Shift lead contact */}
          <div style={{padding:'8px 12px',background:'#f0fdf4',borderRadius:'8px',
            border:'1px solid #86efac',fontSize:'11px',color:'#16a34a',
            marginBottom:'12px',display:'flex',gap:'6px',alignItems:'center'}}>
            <span>👤</span>
            <span>
              <strong>Your shift lead:&nbsp;</strong>
              {currentUser.shift===1?'Kyle Wong / Alan Ho':'David Grande · Rashila Ravichandran'}
            </span>
          </div>

          {!isGuest(currentUser.id) && (
            <button onClick={()=>toggle(currentUser.id, currentUser.id)}
              style={{width:'100%',padding:'11px',borderRadius:'8px',
                border:'1px solid',fontWeight:'600',fontSize:'13px',cursor:'pointer',
                borderColor:absentIds.has(currentUser.id)?'#a5f3fc':'#fca5a5',
                background:absentIds.has(currentUser.id)?'#ecfeff':'#fef2f2',
                color:absentIds.has(currentUser.id)?'#0e7490':'#dc2626'}}>
              {absentIds.has(currentUser.id)?'↩ Mark myself PRESENT':'I will be OUT today'}
            </button>
          )}

          {/* Change PIN */}
          {!isGuest(currentUser.id) && (
            <button onClick={()=>{setShowSetPin(true);setNewPin('');setNewPinConfirm('');setPinSetMsg('')}}
              style={{width:'100%',padding:'8px',borderRadius:'8px',marginTop:'8px',
                border:'1px solid #e5e7eb',fontWeight:'500',fontSize:'12px',cursor:'pointer',
                background:'white',color:'#6b7280'}}>
              🔐 Change my PIN
            </button>
          )}

          {/* PIN change modal */}
          {showSetPin && (
            <div style={{marginTop:'12px',padding:'14px',background:'#f9fafb',
              borderRadius:'10px',border:'1px solid #e5e7eb'}}>
              <div style={{fontSize:'13px',fontWeight:'600',marginBottom:'10px'}}>
                Set a new 4-digit PIN
              </div>
              <input type="password" maxLength={4} value={newPin}
                onChange={e=>setNewPin(e.target.value.replace(/[^0-9]/g,'').slice(0,4))}
                placeholder="New PIN (4 digits)"
                style={{width:'100%',padding:'8px 12px',borderRadius:'8px',
                  border:'1px solid #e5e7eb',fontSize:'13px',marginBottom:'8px',
                  letterSpacing:'0.3em',textAlign:'center'}}/>
              <input type="password" maxLength={4} value={newPinConfirm}
                onChange={e=>setNewPinConfirm(e.target.value.replace(/[^0-9]/g,'').slice(0,4))}
                placeholder="Confirm PIN"
                style={{width:'100%',padding:'8px 12px',borderRadius:'8px',
                  border:'1px solid #e5e7eb',fontSize:'13px',marginBottom:'8px',
                  letterSpacing:'0.3em',textAlign:'center'}}/>
              {pinSetMsg && (
                <div style={{fontSize:'12px',color: pinSetMsg.includes('✓')?'#16a34a':'#dc2626',
                  marginBottom:'8px',textAlign:'center'}}>
                  {pinSetMsg}
                </div>
              )}
              <div style={{display:'flex',gap:'8px'}}>
                <button onClick={()=>setShowSetPin(false)}
                  style={{flex:1,padding:'8px',borderRadius:'8px',border:'1px solid #e5e7eb',
                    background:'white',cursor:'pointer',fontSize:'12px',color:'#6b7280'}}>
                  Cancel
                </button>
                <button onClick={()=>{
                  if (newPin.length!==4){setPinSetMsg('PIN must be 4 digits');return}
                  if (newPin!==newPinConfirm){setPinSetMsg('PINs do not match');return}
                  savePinToDb(currentUser.id, newPin).then(()=>{
                  if (typeof window!=='undefined') localStorage.setItem(`pin_${currentUser.id}`, newPin)
                })
                  setPinSetMsg('✓ PIN updated successfully!')
                  setTimeout(()=>setShowSetPin(false),1500)
                }}
                  style={{flex:1,padding:'8px',borderRadius:'8px',border:'none',
                    background:'#3b82f6',color:'white',cursor:'pointer',
                    fontSize:'12px',fontWeight:'600'}}>
                  Save PIN
                </button>
              </div>
            </div>
          )}
        </div>
      )}


          {/* Schedule Time Off */}
          {!isGuest(currentUser.id) && (
            <button onClick={()=>{setShowTimeOff(v=>!v);setToStart('');setToEnd('');setToMsg('')}}
              style={{width:'100%',padding:'8px',borderRadius:'8px',marginTop:'6px',
                border:'1px solid #e5e7eb',fontWeight:'500',fontSize:'12px',cursor:'pointer',
                background:'white',color:'#6b7280'}}>
              📅 {showTimeOff ? 'Close' : 'Schedule time off'}
            </button>
          )}

          {showTimeOff && (
            <div style={{marginTop:'10px',padding:'14px',background:'#f9fafb',
              borderRadius:'10px',border:'1px solid #e5e7eb'}}>
              <div style={{fontSize:'13px',fontWeight:'600',marginBottom:'12px',color:'#374151'}}>
                📅 Schedule time off
              </div>

              {/* Existing time off */}
              {(vacationMap[currentUser.id]||[]).length > 0 && (
                <div style={{marginBottom:'12px'}}>
                  <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
                    textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'6px'}}>
                    Upcoming time off
                  </div>
                  {(vacationMap[currentUser.id]||[]).map(v=>(
                    <div key={v.id} style={{display:'flex',alignItems:'center',
                      justifyContent:'space-between',padding:'6px 10px',
                      background:'#eff6ff',borderRadius:'6px',border:'1px solid #bfdbfe',
                      marginBottom:'4px',fontSize:'12px'}}>
                      <span style={{color:'#1d4ed8',fontFamily:'monospace'}}>
                        📅 {v.start} → {v.end}
                      </span>
                      <button onClick={()=>cancelTimeOff(v.id,currentUser.id,v.start,v.end)}
                        style={{background:'#fee2e2',border:'1px solid #fca5a5',
                          borderRadius:'4px',padding:'2px 8px',fontSize:'11px',
                          color:'#dc2626',cursor:'pointer'}}>
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Date range picker */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'8px'}}>
                <div>
                  <div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',
                    fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.06em'}}>
                    From
                  </div>
                  <input type="date" value={toStart} min={getToday()}
                    onChange={e=>{setToStart(e.target.value);setToMsg('')}}
                    style={{width:'100%',padding:'8px',borderRadius:'8px',
                      border:'1px solid #e5e7eb',fontSize:'12px',
                      background:'white',cursor:'pointer'}}/>
                </div>
                <div>
                  <div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',
                    fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.06em'}}>
                    To
                  </div>
                  <input type="date" value={toEnd} min={toStart||getToday()}
                    onChange={e=>{setToEnd(e.target.value);setToMsg('')}}
                    style={{width:'100%',padding:'8px',borderRadius:'8px',
                      border:'1px solid #e5e7eb',fontSize:'12px',
                      background:'white',cursor:'pointer'}}/>
                </div>
              </div>

              {/* Preview */}
              {toStart && toEnd && toStart<=toEnd && (
                <div style={{padding:'8px 10px',background:'#eff6ff',borderRadius:'6px',
                  border:'1px solid #bfdbfe',fontSize:'12px',color:'#1d4ed8',
                  marginBottom:'8px',fontFamily:'monospace'}}>
                  📅 {toStart} → {toEnd}&nbsp;·&nbsp;
                  {Math.round((new Date(toEnd).getTime()-new Date(toStart).getTime())/86400000)+1} day(s)
                </div>
              )}

              {toMsg && (
                <div style={{padding:'6px 10px',borderRadius:'6px',fontSize:'12px',
                  marginBottom:'8px',textAlign:'center',
                  background:toMsg.includes('✓')?'#f0fdf4':'#fef2f2',
                  color:toMsg.includes('✓')?'#16a34a':'#dc2626',
                  border:`1px solid ${toMsg.includes('✓')?'#86efac':'#fca5a5'}`}}>
                  {toMsg}
                </div>
              )}

              <div style={{display:'flex',gap:'8px'}}>
                <button onClick={()=>setShowTimeOff(false)}
                  style={{flex:1,padding:'8px',borderRadius:'8px',
                    border:'1px solid #e5e7eb',background:'white',
                    cursor:'pointer',fontSize:'12px',color:'#6b7280'}}>
                  Cancel
                </button>
                <button onClick={async()=>{
                  if (!toStart||!toEnd){setToMsg('Select both dates');return}
                  if (toStart>toEnd){setToMsg('End date must be after start');return}
                  setToMsg('Saving...')
                  await bookTimeOff(currentUser.id, toStart, toEnd)
                  setToMsg('✓ Time off scheduled!')
                  setTimeout(()=>{setShowTimeOff(false);setToStart('');setToEnd('')},1500)
                }}
                  style={{flex:2,padding:'8px',borderRadius:'8px',border:'none',
                    background:'#3b82f6',color:'white',cursor:'pointer',
                    fontSize:'12px',fontWeight:'600'}}>
                  Confirm time off
                </button>
              </div>
            </div>
          )}
      {/* MY STATUS — DCs */}
      {currentUser?.role==='DC' && myPod && rotation?.[myPod] && (
        <div style={{background:'white',borderRadius:'12px',
          border:`2px solid ${absentIds.has(currentUser.id)?'#fca5a5':'#86efac'}`,
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
              background:absentIds.has(currentUser.id)?'#fee2e2':'#dcfce7',
              color:absentIds.has(currentUser.id)?'#dc2626':'#16a34a'}}>
              {absentIds.has(currentUser.id)?'ABSENT':'PRESENT'}
            </span>
          </div>

          {/* 4 station cards */}
          <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
            textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'8px'}}>
            Today's 4 stations · 7 hrs data collection
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'6px',marginBottom:'10px'}}>
            {(rotation[myPod] as string[]).map((stId,bi)=>{
              const info=STATION_INFO[stId]
              const times=shift===1
                ?['7:00–9:00 AM','9:00–11:00 AM','11AM–1PM cover','1:00–3:00 PM']
                :['10AM–12PM','12–1PM','2:00–4:00 PM','4:00–6:00 PM']
              const isActive=myCurrentBlock?.idx===bi
              return (
                <div key={bi} style={{padding:'8px',borderRadius:'8px',textAlign:'center',
                  background:isActive?`${info.dot}18`:'#f9fafb',
                  border:`1.5px solid ${isActive?info.dot:'#e5e7eb'}`}}>
                  <div style={{fontSize:'9px',color:isActive?info.dot:'#9ca3af',
                    fontFamily:'monospace',fontWeight:'600',marginBottom:'3px'}}>
                    {shift===1&&bi===2?'COVER':(`B${bi+1}`)} {isActive?'✓':''}
                  </div>
                  <div style={{width:'8px',height:'8px',borderRadius:'50%',
                    background:info.dot,margin:'0 auto 3px'}}/>
                  <div style={{fontSize:'11px',fontWeight:'800'}}>{info.label}</div>
                  <div style={{fontSize:'9px',color:'#6b7280',marginTop:'1px'}}>{info.task}</div>
                  <div style={{fontSize:'8px',color:'#9ca3af',fontFamily:'monospace',marginTop:'3px'}}>
                    {times[bi]}
                  </div>
                </div>
              )
            })}
          </div>

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

          {!isGuest(currentUser.id) && (
            <button onClick={()=>toggle(currentUser.id, currentUser.id)}
              style={{width:'100%',padding:'10px',borderRadius:'8px',
                border:'1px solid',fontWeight:'600',fontSize:'13px',cursor:'pointer',
                borderColor:absentIds.has(currentUser.id)?'#86efac':'#fca5a5',
                background:absentIds.has(currentUser.id)?'#f0fdf4':'#fef2f2',
                color:absentIds.has(currentUser.id)?'#16a34a':'#dc2626'}}>
              {absentIds.has(currentUser.id)?'↩ Mark myself PRESENT':'I will be OUT today'}
            </button>
          )}

          {!isGuest(currentUser.id) && <button onClick={()=>{setShowSetPin(true);setNewPin('');setNewPinConfirm('');setPinSetMsg('')}}
            style={{width:'100%',padding:'8px',borderRadius:'8px',marginTop:'8px',
              border:'1px solid #e5e7eb',fontWeight:'500',fontSize:'12px',cursor:'pointer',
              background:'white',color:'#6b7280'}}>
            🔐 Change my PIN
          </button>

          {showSetPin && (
            <div style={{marginTop:'12px',padding:'14px',background:'#f9fafb',
              borderRadius:'10px',border:'1px solid #e5e7eb'}}>
              <div style={{fontSize:'13px',fontWeight:'600',marginBottom:'10px'}}>
                Set a new 4-digit PIN
              </div>
              <input type="password" maxLength={4} value={newPin}
                onChange={e=>setNewPin(e.target.value.replace(/[^0-9]/g,'').slice(0,4))}
                placeholder="New PIN (4 digits)"
                style={{width:'100%',padding:'8px 12px',borderRadius:'8px',
                  border:'1px solid #e5e7eb',fontSize:'13px',marginBottom:'8px',
                  letterSpacing:'0.3em',textAlign:'center'}}/>
              <input type="password" maxLength={4} value={newPinConfirm}
                onChange={e=>setNewPinConfirm(e.target.value.replace(/[^0-9]/g,'').slice(0,4))}
                placeholder="Confirm PIN"
                style={{width:'100%',padding:'8px 12px',borderRadius:'8px',
                  border:'1px solid #e5e7eb',fontSize:'13px',marginBottom:'8px',
                  letterSpacing:'0.3em',textAlign:'center'}}/>
              {pinSetMsg && (
                <div style={{fontSize:'12px',
                  color:pinSetMsg.includes('✓')?'#16a34a':'#dc2626',
                  marginBottom:'8px',textAlign:'center'}}>
                  {pinSetMsg}
                </div>
              )}
              <div style={{display:'flex',gap:'8px'}}>
                <button onClick={()=>setShowSetPin(false)}
                  style={{flex:1,padding:'8px',borderRadius:'8px',
                    border:'1px solid #e5e7eb',background:'white',
                    cursor:'pointer',fontSize:'12px',color:'#6b7280'}}>
                  Cancel
                </button>
                <button onClick={()=>{
                  if (newPin.length!==4){setPinSetMsg('PIN must be 4 digits');return}
                  if (newPin!==newPinConfirm){setPinSetMsg('PINs do not match');return}
                  savePinToDb(currentUser.id, newPin).then(()=>{
                  if (typeof window!=='undefined') localStorage.setItem(`pin_${currentUser.id}`, newPin)
                })
                  setPinSetMsg('✓ PIN updated successfully!')
                  setTimeout(()=>setShowSetPin(false),1500)
                }}
                  style={{flex:1,padding:'8px',borderRadius:'8px',border:'none',
                    background:'#3b82f6',color:'white',cursor:'pointer',
                    fontSize:'12px',fontWeight:'600'}}>
                  Save PIN
                </button>
              </div>
            </div>
          )}
        </div>
      )}


          {/* Schedule Time Off */}
          {!isGuest(currentUser.id) && (
            <button onClick={()=>{setShowTimeOff(v=>!v);setToStart('');setToEnd('');setToMsg('')}}
              style={{width:'100%',padding:'8px',borderRadius:'8px',marginTop:'6px',
                border:'1px solid #e5e7eb',fontWeight:'500',fontSize:'12px',cursor:'pointer',
                background:'white',color:'#6b7280'}}>
              📅 {showTimeOff ? 'Close' : 'Schedule time off'}
            </button>
          )}

          {showTimeOff && (
            <div style={{marginTop:'10px',padding:'14px',background:'#f9fafb',
              borderRadius:'10px',border:'1px solid #e5e7eb'}}>
              <div style={{fontSize:'13px',fontWeight:'600',marginBottom:'12px',color:'#374151'}}>
                📅 Schedule time off
              </div>

              {/* Existing time off */}
              {(vacationMap[currentUser.id]||[]).length > 0 && (
                <div style={{marginBottom:'12px'}}>
                  <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
                    textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'6px'}}>
                    Upcoming time off
                  </div>
                  {(vacationMap[currentUser.id]||[]).map(v=>(
                    <div key={v.id} style={{display:'flex',alignItems:'center',
                      justifyContent:'space-between',padding:'6px 10px',
                      background:'#eff6ff',borderRadius:'6px',border:'1px solid #bfdbfe',
                      marginBottom:'4px',fontSize:'12px'}}>
                      <span style={{color:'#1d4ed8',fontFamily:'monospace'}}>
                        📅 {v.start} → {v.end}
                      </span>
                      <button onClick={()=>cancelTimeOff(v.id,currentUser.id,v.start,v.end)}
                        style={{background:'#fee2e2',border:'1px solid #fca5a5',
                          borderRadius:'4px',padding:'2px 8px',fontSize:'11px',
                          color:'#dc2626',cursor:'pointer'}}>
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Date range picker */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'8px'}}>
                <div>
                  <div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',
                    fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.06em'}}>
                    From
                  </div>
                  <input type="date" value={toStart} min={getToday()}
                    onChange={e=>{setToStart(e.target.value);setToMsg('')}}
                    style={{width:'100%',padding:'8px',borderRadius:'8px',
                      border:'1px solid #e5e7eb',fontSize:'12px',
                      background:'white',cursor:'pointer'}}/>
                </div>
                <div>
                  <div style={{fontSize:'11px',color:'#9ca3af',marginBottom:'4px',
                    fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'0.06em'}}>
                    To
                  </div>
                  <input type="date" value={toEnd} min={toStart||getToday()}
                    onChange={e=>{setToEnd(e.target.value);setToMsg('')}}
                    style={{width:'100%',padding:'8px',borderRadius:'8px',
                      border:'1px solid #e5e7eb',fontSize:'12px',
                      background:'white',cursor:'pointer'}}/>
                </div>
              </div>

              {/* Preview */}
              {toStart && toEnd && toStart<=toEnd && (
                <div style={{padding:'8px 10px',background:'#eff6ff',borderRadius:'6px',
                  border:'1px solid #bfdbfe',fontSize:'12px',color:'#1d4ed8',
                  marginBottom:'8px',fontFamily:'monospace'}}>
                  📅 {toStart} → {toEnd}&nbsp;·&nbsp;
                  {Math.round((new Date(toEnd).getTime()-new Date(toStart).getTime())/86400000)+1} day(s)
                </div>
              )}

              {toMsg && (
                <div style={{padding:'6px 10px',borderRadius:'6px',fontSize:'12px',
                  marginBottom:'8px',textAlign:'center',
                  background:toMsg.includes('✓')?'#f0fdf4':'#fef2f2',
                  color:toMsg.includes('✓')?'#16a34a':'#dc2626',
                  border:`1px solid ${toMsg.includes('✓')?'#86efac':'#fca5a5'}`}}>
                  {toMsg}
                </div>
              )}

              <div style={{display:'flex',gap:'8px'}}>
                <button onClick={()=>setShowTimeOff(false)}
                  style={{flex:1,padding:'8px',borderRadius:'8px',
                    border:'1px solid #e5e7eb',background:'white',
                    cursor:'pointer',fontSize:'12px',color:'#6b7280'}}>
                  Cancel
                </button>
                <button onClick={async()=>{
                  if (!toStart||!toEnd){setToMsg('Select both dates');return}
                  if (toStart>toEnd){setToMsg('End date must be after start');return}
                  setToMsg('Saving...')
                  await bookTimeOff(currentUser.id, toStart, toEnd)
                  setToMsg('✓ Time off scheduled!')
                  setTimeout(()=>{setShowTimeOff(false);setToStart('');setToEnd('')},1500)
                }}
                  style={{flex:2,padding:'8px',borderRadius:'8px',border:'none',
                    background:'#3b82f6',color:'white',cursor:'pointer',
                    fontSize:'12px',fontWeight:'600'}}>
                  Confirm time off
                </button>
              </div>
            </div>
          )}
      {/* TABS */}
      <div style={{display:'flex',gap:'4px',background:'#f3f4f6',padding:'4px',
        borderRadius:'8px',marginBottom:'12px'}}>
        {(currentUser?.role==='LEAD'
        ? ['schedule','roster','timeoff','rotation']
        : ['schedule','roster','rotation'] as const
      ).map((t:string)=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{flex:1,padding:'7px',borderRadius:'6px',cursor:'pointer',
              fontSize:'11px',fontWeight:'600',textTransform:'uppercase',
              letterSpacing:'0.05em',border:'none',
              background:tab===t?'white':'transparent',
              color:tab===t?'#111827':'#6b7280'}}>
            {t==='timeoff'?'Time Off':t}
          </button>
        ))}
      </div>

      {/* ── SCHEDULE TAB ──────────────────────────────────────────────────────── */}
      {tab==='schedule' && (
        <>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',
            gap:'8px',marginBottom:'12px'}}>
            {[
              {label:'DCs Present',value:presentDCs,color:'#16a34a'},
              {label:'DAs Present',value:presentDAs,color:'#0891b2'},
              {label:'DCs Absent', value:absentDCs, color:absentDCs>0?'#dc2626':'#9ca3af'},
              {label:'Rotation',   value:`Day ${dayIdx+1}/8`,color:'#7c3aed'},
            ].map(s=>(
              <div key={s.label} style={{background:'white',borderRadius:'10px',
                padding:'12px',textAlign:'center',border:'1px solid #e5e7eb'}}>
                <div style={{fontSize:'20px',fontWeight:'800',color:s.color}}>{s.value}</div>
                <div style={{fontSize:'10px',color:'#9ca3af',textTransform:'uppercase',
                  letterSpacing:'0.06em',marginTop:'2px'}}>{s.label}</div>
              </div>
            ))}
          </div>

          {shift===1 && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'12px'}}>
              {[
                {label:'Lunch A · 11:00 AM – 12:00 PM',who:'Kyle · Marcio · Togiva · LaQuon',color:'#f59e0b'},
                {label:'Lunch B · 12:00 PM – 1:00 PM', who:'Alan · Quincy · Keyshawn · Ashley',color:'#8b5cf6'},
              ].map(l=>(
                <div key={l.label} style={{padding:'8px 12px',borderRadius:'8px',
                  background:`${l.color}15`,border:`1px solid ${l.color}44`,fontSize:'11px'}}>
                  <div style={{fontWeight:'700',color:l.color,marginBottom:'2px'}}>🍽 {l.label}</div>
                  <div style={{color:'#374151'}}>{l.who}</div>
                </div>
              ))}
            </div>
          )}
          {shift===2 && (
            <div style={{padding:'8px 12px',borderRadius:'8px',marginBottom:'12px',
              background:'#f59e0b18',border:'1px solid #f59e0b44',fontSize:'11px'}}>
              <span style={{fontWeight:'700',color:'#f59e0b'}}>🍽 Lunch C · 1:00–2:00 PM&nbsp;</span>
              All 2nd shift DCs
            </div>
          )}

          {pods.map(pod=>{
            const ps = rotation?.[pod] as [string,string,string,string]|undefined
            if (!ps) return null
            const members  = pool.filter(m=>m.pod===pod&&!absentIds.has(m.id))
            const allPod   = pool.filter(m=>m.pod===pod)
            const absentHere = allPod.filter(m=>absentIds.has(m.id))
            const personA  = members[0]?.name.split(' ')[0]??'?'
            const personB  = members[1]?.name.split(' ')[0]??'(solo)'
            const short    = members.length<2
            const curBlock = getCurrentBlock(pod)
            const podMemberIds = allPod.map(m=>m.id)
            const onLunchA = podMemberIds.some(id=>LUNCH_A_MEMBERS.includes(id))
            const onLunchB = podMemberIds.some(id=>LUNCH_B_MEMBERS.includes(id))

            const dayTimeline = shift===1 ? [
              {blockLabel:'Block 1',stId:ps[0],startMin:7*60, durHrs:2,timeLabel:'7:00–9:00 AM',   isLunch:false,isLunchCover:false},
              {blockLabel:'Block 2',stId:ps[1],startMin:9*60, durHrs:2,timeLabel:'9:00–11:00 AM',  isLunch:false,isLunchCover:false},
              ...(onLunchA?[{blockLabel:'Lunch A',stId:'',startMin:11*60,durHrs:1,timeLabel:'11:00 AM–12:00 PM',isLunch:true,isLunchCover:false}]:[]),
              ...(onLunchB?[{blockLabel:'Lunch B',stId:'',startMin:12*60,durHrs:1,timeLabel:'12:00–1:00 PM',    isLunch:true,isLunchCover:false}]:[]),
              ...(!onLunchA?[{blockLabel:'Cover (11–12)',stId:lunchCover?.[pod]||ps[2],startMin:11*60,durHrs:1,timeLabel:'11:00 AM–12:00 PM',isLunch:false,isLunchCover:true}]:[]),
              ...(!onLunchB?[{blockLabel:'Cover (12–1)', stId:lunchCover?.[pod]||ps[2],startMin:12*60,durHrs:1,timeLabel:'12:00–1:00 PM',    isLunch:false,isLunchCover:true}]:[]),
              {blockLabel:'Block 4',stId:ps[3],startMin:13*60,durHrs:2,timeLabel:'1:00–3:00 PM',   isLunch:false,isLunchCover:false},
            ] : [
              {blockLabel:'Block 1',stId:ps[0],startMin:10*60,durHrs:2,timeLabel:'10:00 AM–12:00 PM',isLunch:false,isLunchCover:false},
              {blockLabel:'Block 2',stId:ps[1],startMin:12*60,durHrs:1,timeLabel:'12:00–1:00 PM',    isLunch:false,isLunchCover:false},
              {blockLabel:'Lunch C',stId:'',   startMin:13*60,durHrs:1,timeLabel:'1:00–2:00 PM',     isLunch:true, isLunchCover:false},
              {blockLabel:'Block 3',stId:ps[2],startMin:14*60,durHrs:2,timeLabel:'2:00–4:00 PM',     isLunch:false,isLunchCover:false},
              {blockLabel:'Block 4',stId:ps[3],startMin:16*60,durHrs:2,timeLabel:'4:00–6:00 PM',     isLunch:false,isLunchCover:false},
            ]

            return (
              <div key={pod} style={{background:'white',borderRadius:'12px',
                border:'1px solid #e5e7eb',marginBottom:'10px',overflow:'hidden'}}>
                <div style={{padding:'10px 14px',background:'#f9fafb',
                  borderBottom:'1px solid #e5e7eb',display:'flex',
                  alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
                  <span style={{fontSize:'12px',fontWeight:'700',fontFamily:'monospace',
                    color:'white',background:'#374151',padding:'3px 10px',borderRadius:'6px'}}>
                    {pod}
                  </span>
                  {members.map(m=>(
                    <span key={m.id} style={{padding:'3px 10px',borderRadius:'99px',
                      fontSize:'12px',fontWeight:'600',background:'#dcfce7',color:'#16a34a',
                      border:'1px solid #86efac'}}>{m.name}</span>
                  ))}
                  {absentHere.map(m=>(
                    <span key={m.id} style={{padding:'3px 10px',borderRadius:'99px',
                      fontSize:'12px',background:'#fee2e2',color:'#dc2626',
                      border:'1px solid #fca5a5',textDecoration:'line-through',opacity:0.6}}>
                      {m.name}
                    </span>
                  ))}
                  {short&&<span style={{marginLeft:'auto',padding:'3px 10px',borderRadius:'99px',
                    fontSize:'10px',fontWeight:'700',fontFamily:'monospace',
                    background:'#fee2e2',color:'#dc2626'}}>SOLO — reassign</span>}
                  {curBlock&&<span style={{marginLeft:'auto',padding:'3px 10px',borderRadius:'99px',
                    fontSize:'10px',fontWeight:'700',background:'#dcfce7',color:'#16a34a',
                    fontFamily:'monospace'}}>ACTIVE ✓</span>}
                </div>

                <div style={{padding:'12px 14px',display:'flex',flexDirection:'column',gap:'8px'}}>
                  {dayTimeline.map((block,bi)=>{
                    if (block.isLunch) return (
                      <div key={bi} style={{padding:'8px 12px',borderRadius:'8px',
                        background:'#fffbeb',border:'1px dashed #fde68a',
                        display:'flex',alignItems:'center',gap:'8px',
                        fontSize:'12px',color:'#92400e'}}>
                        <span>🍽</span>
                        <strong>{block.blockLabel}</strong>
                        <span style={{color:'#9ca3af'}}>·</span>
                        <span style={{fontFamily:'monospace',fontSize:'11px'}}>{block.timeLabel}</span>
                      </div>
                    )
                    const info=STATION_INFO[block.stId]
                    if (!info) return null
                    const sessions=buildSessions(personA,personB,block.startMin,block.durHrs)
                    const bAlert=getBlockAlert(block.startMin,block.durHrs,null)
                    const isActiveBlock=!!bAlert
                    const activeIdx=bAlert?.sessionIndex??-1
                    const nextSt=shift===1&&bi<dayTimeline.length-1
                      ?dayTimeline.slice(bi+1).find(b=>!b.isLunch)?.stId||null:null

                    return (
                      <div key={bi} style={{borderRadius:'10px',overflow:'hidden',
                        border:`1.5px solid ${isActiveBlock?info.dot:'#e5e7eb'}`,
                        background:isActiveBlock?`${info.dot}08`:'white'}}>
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
                          {block.isLunchCover&&<span style={{padding:'1px 6px',borderRadius:'4px',
                            fontSize:'9px',fontWeight:'700',background:'#fef3c7',
                            color:'#92400e'}}>LUNCH COVER</span>}
                          {isActiveBlock&&<span style={{padding:'1px 6px',borderRadius:'4px',
                            fontSize:'9px',fontWeight:'700',background:'#dcfce7',
                            color:'#16a34a',fontFamily:'monospace'}}>NOW ACTIVE</span>}
                        </div>
                        <div style={{padding:'6px 12px'}}>
                          {sessions.map((s,si)=>{
                            const isCurrent=si===activeIdx&&isActiveBlock
                            const isPast=isActiveBlock&&si<activeIdx
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
                                <span style={{fontSize:'9px',fontWeight:'700',padding:'1px 5px',
                                  borderRadius:'4px',
                                  background:s.isPerson==='A'?'#dbeafe':'#fce7f3',
                                  color:s.isPerson==='A'?'#1d4ed8':'#be185d'}}>
                                  {s.isPerson}
                                </span>
                                <span style={{fontSize:'11px',fontWeight:isCurrent?'700':'400',
                                  color:isCurrent?'#111827':'#374151'}}>{s.person}</span>
                                {isCurrent&&<span style={{fontSize:'9px',background:'#dcfce7',
                                  color:'#16a34a',padding:'1px 5px',borderRadius:'4px',
                                  fontWeight:'700',fontFamily:'monospace'}}>NOW</span>}
                                {isPast&&<span style={{fontSize:'10px',color:'#9ca3af'}}>✓</span>}
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

      {/* ── ROSTER TAB ────────────────────────────────────────────────────────── */}
      {tab==='roster' && (
        <div style={{background:'white',borderRadius:'12px',
          border:'1px solid #e5e7eb',padding:'16px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
            marginBottom:'12px'}}>
            <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
              textTransform:'uppercase',letterSpacing:'0.08em'}}>
              Shift {shift} roster
              {currentUser?.role==='LEAD'&&' · tap to toggle'}
            </div>
            <span style={{fontSize:'10px',fontFamily:'monospace',padding:'2px 8px',
              borderRadius:'4px',
              background:synced?'#dcfce7':'#fee2e2',
              color:synced?'#16a34a':'#dc2626'}}>
              {synced?'live':'offline'}
            </span>
          </div>
          {(['LEAD','DC','DA'] as const).map(role=>(
            <div key={role} style={{marginBottom:'14px'}}>
              <div style={{fontSize:'10px',color:'#9ca3af',textTransform:'uppercase',
                letterSpacing:'0.08em',marginBottom:'6px'}}>{role}s</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                {pool.filter(m=>m.role===role).map(m=>{
                  const out=absentIds.has(m.id)
                  const isLead=currentUser?.role==='LEAD'
                  return (
                    <div key={m.id} onClick={()=>isLead&&toggle(m.id,currentUser!.id)}
                      style={{display:'flex',alignItems:'center',gap:'6px',
                        padding:'6px 10px',borderRadius:'8px',
                        border:`1px solid ${out?'#fca5a5':'#e5e7eb'}`,
                        background:out?'#fef2f2':'#f9fafb',
                        cursor:isLead?'pointer':'default',
                        transition:'all 0.15s'}}>
                      <div style={{width:'26px',height:'26px',borderRadius:'50%',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:'9px',fontWeight:'700',
                        background:COLORS[role][0],color:COLORS[role][1]}}>
                        {m.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div style={{fontSize:'12px',fontWeight:'600',
                          textDecoration:out?'line-through':'none',opacity:out?0.5:1,
                          display:'flex',alignItems:'center',gap:'4px'}}>
                          {m.name}
                          {(vacationMap[m.id]||[]).length>0 && (
                            <span style={{fontSize:'9px',background:'#eff6ff',
                              color:'#1d4ed8',padding:'1px 4px',borderRadius:'3px',
                              border:'1px solid #bfdbfe'}}>📅 off</span>
                          )}
                        </div>
                        <div style={{fontSize:'10px',color:'#9ca3af'}}>{m.pod||role}</div>
                      </div>
                      <span style={{padding:'2px 7px',borderRadius:'99px',fontSize:'9px',
                        fontWeight:'700',fontFamily:'monospace',
                        background:out?'#fee2e2':'#dcfce7',
                        color:out?'#dc2626':'#16a34a',marginLeft:'4px'}}>
                        {out?'OUT':'IN'}
                      </span>
                      {isLead && (
                        <button onClick={(e)=>{
                          e.stopPropagation()
                          savePinToDb(m.id, DEFAULT_PIN)
                          if(typeof window!=='undefined')localStorage.removeItem(`pin_${m.id}`)
                          alert(`PIN for ${m.name} reset to 0000`)
                        }}
                          style={{marginLeft:'4px',padding:'1px 6px',borderRadius:'4px',
                            fontSize:'9px',border:'1px solid #e5e7eb',background:'white',
                            cursor:'pointer',color:'#6b7280'}}>
                          reset PIN
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TIME OFF TAB — leads only ─────────────────────────────────────────── */}
      {tab==='timeoff' && currentUser?.role==='LEAD' && !isGuest(currentUser?.id||'') && (
        <div>
          <div style={{background:'white',borderRadius:'12px',
            border:'1px solid #e5e7eb',padding:'16px',marginBottom:'12px'}}>
            <div style={{display:'flex',alignItems:'center',
              justifyContent:'space-between',marginBottom:'16px'}}>
              <div>
                <div style={{fontSize:'14px',fontWeight:'700'}}>Upcoming Time Off</div>
                <div style={{fontSize:'12px',color:'#6b7280',marginTop:'2px'}}>
                  All scheduled absences across both shifts
                </div>
              </div>
              <div style={{display:'flex',gap:'6px'}}>
                {[1,2,'all'].map(s=>(
                  <button key={String(s)}
                    onClick={()=>setShift(s==='all'?shift:s as 1|2)}
                    style={{padding:'5px 12px',borderRadius:'6px',fontSize:'11px',
                      fontWeight:'600',cursor:'pointer',border:'1px solid #e5e7eb',
                      background:s===shift||s==='all'?'#eff6ff':'white',
                      color:s===shift||s==='all'?'#1d4ed8':'#6b7280'}}>
                    {s==='all'?'All':s===1?'1st':'2nd'}
                  </button>
                ))}
              </div>
            </div>

            {/* Build time off list from vacationMap */}
            {(()=>{
              const today = getToday()
              // Flatten all time off entries
              const allEntries: {
                staffId:string, name:string, role:string, shift:number,
                start:string, end:string, id:string, days:number
              }[] = []

              Object.entries(vacationMap).forEach(([staffId, ranges]) => {
                const person = ALL_PEOPLE.find(p=>p.id===staffId)
                if (!person) return
                ranges.forEach(r => {
                  if (r.end >= today) {
                    const days = Math.round(
                      (new Date(r.end).getTime()-new Date(r.start).getTime())/86400000
                    )+1
                    allEntries.push({
                      staffId, name:person.name, role:person.role,
                      shift:person.shift, start:r.start, end:r.end, id:r.id, days
                    })
                  }
                })
              })

              // Sort by start date
              allEntries.sort((a,b)=>a.start.localeCompare(b.start))

              // Group by week
              const grouped: Record<string, typeof allEntries> = {}
              allEntries.forEach(e => {
                const d = new Date(e.start)
                const monday = new Date(d)
                monday.setDate(d.getDate()-d.getDay()+1)
                const key = monday.toISOString().split('T')[0]
                if (!grouped[key]) grouped[key]=[]
                grouped[key].push(e)
              })

              // Find days with coverage warnings (3+ people out)
              const dayCounts: Record<string,number> = {}
              allEntries.forEach(e=>{
                const cur=new Date(e.start)
                const end=new Date(e.end)
                while(cur<=end){
                  const k=cur.toISOString().split('T')[0]
                  dayCounts[k]=(dayCounts[k]||0)+1
                  cur.setDate(cur.getDate()+1)
                }
              })

              if (allEntries.length===0) return (
                <div style={{textAlign:'center',padding:'32px',color:'#9ca3af',fontSize:'13px'}}>
                  <div style={{fontSize:'32px',marginBottom:'8px'}}>📅</div>
                  No upcoming time off scheduled
                </div>
              )

              return (
                <>
                  {/* Coverage warnings */}
                  {Object.entries(dayCounts).filter(([,n])=>n>=3).map(([date,count])=>(
                    <div key={date} style={{padding:'8px 12px',background:'#fef2f2',
                      borderRadius:'8px',border:'1px solid #fca5a5',fontSize:'12px',
                      color:'#dc2626',marginBottom:'8px',display:'flex',
                      alignItems:'center',gap:'8px'}}>
                      <span>⚠️</span>
                      <strong>{new Date(date+'T12:00:00').toLocaleDateString('en-US',
                        {weekday:'short',month:'short',day:'numeric'})}</strong>
                      &nbsp;— {count} people out. Review coverage.
                    </div>
                  ))}

                  {/* Grouped by week */}
                  {Object.entries(grouped).map(([weekStart, entries])=>(
                    <div key={weekStart} style={{marginBottom:'16px'}}>
                      <div style={{fontSize:'11px',fontWeight:'600',color:'#9ca3af',
                        textTransform:'uppercase',letterSpacing:'0.08em',
                        marginBottom:'8px',paddingBottom:'6px',
                        borderBottom:'1px solid #f3f4f6'}}>
                        Week of {new Date(weekStart+'T12:00:00').toLocaleDateString('en-US',
                          {month:'long',day:'numeric'})}
                      </div>
                      {entries.map(e=>(
                        <div key={e.id} style={{display:'flex',alignItems:'center',
                          gap:'12px',padding:'10px 12px',borderRadius:'8px',
                          background:'#f9fafb',border:'1px solid #e5e7eb',
                          marginBottom:'6px'}}>
                          {/* Avatar */}
                          <div style={{width:'32px',height:'32px',borderRadius:'50%',
                            display:'flex',alignItems:'center',justifyContent:'center',
                            fontSize:'10px',fontWeight:'700',flexShrink:0,
                            background:e.role==='LEAD'?'#E6F1FB':e.role==='DC'?'#EAF3DE':'#E1D5E7',
                            color:e.role==='LEAD'?'#0C447C':e.role==='DC'?'#3B6D11':'#4A235A'}}>
                            {e.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                          </div>
                          {/* Info */}
                          <div style={{flex:1}}>
                            <div style={{fontSize:'13px',fontWeight:'600'}}>{e.name}</div>
                            <div style={{fontSize:'11px',color:'#6b7280',marginTop:'1px',
                              fontFamily:'monospace'}}>
                              {e.role} · Shift {e.shift} ·&nbsp;
                              {e.start===e.end
                                ? new Date(e.start+'T12:00:00').toLocaleDateString('en-US',
                                    {weekday:'short',month:'short',day:'numeric'})
                                : `${new Date(e.start+'T12:00:00').toLocaleDateString('en-US',
                                    {month:'short',day:'numeric'})} → ${
                                    new Date(e.end+'T12:00:00').toLocaleDateString('en-US',
                                    {month:'short',day:'numeric'})}`
                              }
                              &nbsp;· {e.days} day{e.days>1?'s':''}
                            </div>
                          </div>
                          {/* Badge */}
                          <span style={{padding:'2px 8px',borderRadius:'99px',fontSize:'10px',
                            fontWeight:'700',fontFamily:'monospace',
                            background: e.start<=today&&today<=e.end?'#fee2e2':'#eff6ff',
                            color: e.start<=today&&today<=e.end?'#dc2626':'#1d4ed8'}}>
                            {e.start<=today&&today<=e.end?'OUT NOW':'UPCOMING'}
                          </span>
                          {/* Cancel */}
                          <button
                            onClick={()=>cancelTimeOff(e.id,e.staffId,e.start,e.end)}
                            style={{padding:'4px 10px',borderRadius:'6px',fontSize:'11px',
                              border:'1px solid #fca5a5',background:'#fef2f2',
                              color:'#dc2626',cursor:'pointer',flexShrink:0}}>
                            Cancel
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Summary */}
                  <div style={{marginTop:'8px',padding:'10px 14px',background:'#f0fdf4',
                    borderRadius:'8px',border:'1px solid #86efac',fontSize:'12px',
                    color:'#16a34a',display:'flex',justifyContent:'space-between'}}>
                    <span>{allEntries.length} request{allEntries.length!==1?'s':''} scheduled</span>
                    <span>{Object.values(dayCounts).filter(n=>n>=3).length} coverage warning{Object.values(dayCounts).filter(n=>n>=3).length!==1?'s':''}</span>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* ── ROTATION TAB ──────────────────────────────────────────────────────── */}
      {tab==='rotation' && (
        <div>
          <div style={{background:'white',borderRadius:'12px',
            border:'1px solid #e5e7eb',padding:'16px',marginBottom:'12px'}}>
            <div style={{fontSize:'13px',fontWeight:'700',marginBottom:'4px'}}>
              8-Day Rotation · Shift {shift}
            </div>
            <div style={{fontSize:'12px',color:'#6b7280',marginBottom:'12px'}}>
              4 stations per day · 7 hrs data collection · rotates automatically at midnight
            </div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px'}}>
                <thead>
                  <tr style={{background:'#f9fafb'}}>
                    <th style={{padding:'8px',textAlign:'left',border:'1px solid #e5e7eb',
                      color:'#6b7280',fontFamily:'monospace'}}>Day</th>
                    {(shift===1
                      ?['P1\nMarcio+Togiva','P2\nLaQuon+Quincy','P3\nKeyshawn+Ashley','P4\nKyle+Alan']
                      :['PA\nKyria+Ethan','PB\nFlora+Andrew','PC\nMichael+Lavanya','PD\nDavid+Lucca']
                    ).map((h,i)=>(
                      <th key={i} style={{padding:'8px',textAlign:'center',
                        border:'1px solid #e5e7eb',color:'#374151',
                        whiteSpace:'pre-line',lineHeight:1.5,fontWeight:'600'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({length:8},(_,i)=>{
                    const rot=shift===1?ROTATION_S1[String(i)]:ROTATION_S2[String(i)]
                    const p2=shift===1?['P1','P2','P3','P4']:['PA','PB','PC','PD']
                    const isToday=i===dayIdx
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
                        {p2.map(pod=>{
                          const sts=rot[pod] as string[]
                          return (
                            <td key={pod} style={{padding:'5px 7px',
                              border:'1px solid #e5e7eb',textAlign:'center'}}>
                              <div style={{display:'flex',flexDirection:'column',gap:'2px'}}>
                                {sts.map((stId,si)=>{
                                  const info=STATION_INFO[stId]
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
            border:'1px solid #bfdbfe',fontSize:'12px',color:'#1e40af',lineHeight:1.7}}>
            <strong>Real-time sync:</strong> When anyone taps "I will be OUT today" on their phone,
            every other open screen updates within 1 second via Supabase live sync. The&nbsp;
            <span style={{background:'#dcfce7',color:'#16a34a',padding:'1px 5px',
              borderRadius:'3px',fontFamily:'monospace',fontSize:'11px'}}>● live sync</span>
            &nbsp;badge in the header confirms you are connected.<br/>
            <strong>Alerts:</strong> Yellow at 10 min remaining · Red pulsing at 6 min · Clock ticks every second.
          </div>
        </div>
      )}
    </div>
  )
}
