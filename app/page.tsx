'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

// ─── SUPABASE ────────────────────────────────────────────────────────────────
function getSupabase() {
  const url = 'https://dwtlaxhgflbtflakuevw.supabase.co'
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3dGxheGhnZmxidGZsYWt1ZXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwOTkxMDksImV4cCI6MjA5MzY3NTEwOX0.h3LzJAwVkPBGxYtE12bLXzHYwD1y-2gUpnpVzKk7qlM'
  return createClient(url, key)
}

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
    {id:'jb', name:'James Baase', role:'ANALYTICS_ADMIN', shift:1, pod:null},
    {id:'cs', name:'Charlene Shong', role:'ANALYTICS_ADMIN', shift:1, pod:null},
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
    {id:'as2', name:'Aarushi Sharma',       role:'DA',   shift:2, pod:null},
    {id:'jc',  name:'Julian Cruz',          role:'DA',   shift:2, pod:null},
    {id:'al',  name:'Aaliyah',              role:'DA',   shift:2, pod:null},
    {id:'rrp', name:'Rathinapriya Ramjagan',role:'DA',   shift:2, pod:null},
    {id:'rr',  name:'Rashila Ravichandran', role:'LEAD', shift:2, pod:null},
    {id:'yban2', name:'Yban Nieto', role:'SUPER_ADMIN', shift:2, pod:null},
    {id:'jb2', name:'James Baase', role:'ANALYTICS_ADMIN', shift:2, pod:null},
    {id:'cs2', name:'Charlene Shong', role:'ANALYTICS_ADMIN', shift:2, pod:null},
    {id:'guest2',name:'Guest / Observer',   role:'GUEST',shift:2, pod:null},
  ]
}
const ALL_PEOPLE = [...ROSTER.s1, ...ROSTER.s2]

// ─── STATION INFO ─────────────────────────────────────────────────────────────
const STATION_INFO: Record<string,any> = {
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
const ROTATION_S1: any = {
  '0': { P1:['ymc1','ymc2','uc1','ymc3'],  P2:['ymc2','ymc3','uc2','ymc4'],  P3:['ymc3','ymc4','ymc7','ymc1'],  P4:['ymc4','ymc1','g1','ymc2']  },
  '1': { P1:['ymc2','ymc3','uc1','ymc4'],  P2:['ymc3','ymc4','uc2','ymc1'],  P3:['ymc4','ymc1','ymc7','ymc2'],  P4:['ymc1','ymc2','g1','ymc3']  },
  '2': { P1:['ymc3','ymc4','uc1','ymc1'],  P2:['ymc4','ymc1','uc2','ymc2'],  P3:['ymc1','ymc2','ymc7','ymc3'],  P4:['ymc2','ymc3','g1','ymc4']  },
  '3': { P1:['ymc4','ymc1','uc1','ymc2'],  P2:['ymc1','ymc2','uc2','ymc3'],  P3:['ymc2','ymc3','ymc7','ymc4'],  P4:['ymc3','ymc4','g1','ymc1']  },
  '4': { P1:['ymc1','ymc3','g1','ymc4'],   P2:['ymc2','ymc4','ymc7','ymc1'], P3:['ymc3','ymc1','uc1','ymc2'],   P4:['ymc4','ymc2','uc2','ymc3'] },
  '5': { P1:['ymc2','ymc4','g1','ymc1'],   P2:['ymc3','ymc1','ymc7','ymc2'], P3:['ymc4','ymc2','uc1','ymc3'],   P4:['ymc1','ymc3','uc2','ymc4'] },
  '6': { P1:['ymc3','ymc1','g1','ymc2'],   P2:['ymc4','ymc2','ymc7','ymc3'], P3:['ymc1','ymc3','uc1','ymc4'],   P4:['ymc2','ymc4','uc2','ymc1'] },
  '7': { P1:['ymc4','ymc2','g1','ymc3'],   P2:['ymc1','ymc3','ymc7','ymc4'], P3:['ymc2','ymc4','uc1','ymc1'],   P4:['ymc3','ymc1','uc2','ymc2'] },
}

const LUNCH_NOTE_A = 'Your lunch · 11:00 AM – 12:00 PM · Person B covers solo'
const LUNCH_NOTE_B = 'Your lunch · 12:00 PM – 1:00 PM · Person A covers solo'

// ─── 2ND SHIFT SCHEDULE ───────────────────────────────────────────────────────
const ROTATION_S2: any = {
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
const PROTECTED_PINS: Record<string,string> = { jb:'0101', jb2:'0101', cs:'9999', cs2:'9999' }
function getPin(staffId: string): string {
  if (staffId==='guest'||staffId==='guest2') return '1234'
  if (staffId==='yban'||staffId==='yban2') {
    if (typeof window==='undefined') return '20131990'
    return localStorage.getItem(`pin_${staffId}`)||'20131990'
  }
  if (PROTECTED_PINS[staffId]) {
    if (typeof window==='undefined') return PROTECTED_PINS[staffId]
    return localStorage.getItem(`pin_${staffId}`)||PROTECTED_PINS[staffId]
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
function isAnalyticsAdmin(staffId: string|null): boolean {
  return staffId==='yban'||staffId==='yban2'||staffId==='jb'||staffId==='jb2'||staffId==='cs'||staffId==='cs2'
}
function canManageStations(staffId: string|null): boolean {
  return ['kw','ah','dg','rr','yban','yban2'].includes(staffId||'')
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

// ─── MONITORING WINDOWS ───────────────────────────────────────────────────────
const MONITORING: Record<string,{startMin:number,endMin:number,label:string}[]> = {
  kw: [
    {startMin:8*60+30,  endMin:9*60,    label:'Monitoring 1'},
    {startMin:10*60+30, endMin:11*60,   label:'Monitoring 2'},
    {startMin:13*60+30, endMin:14*60,   label:'Monitoring 3'},
  ],
  ah: [
    {startMin:8*60+45,  endMin:9*60+15, label:'Monitoring 1'},
    {startMin:10*60+45, endMin:11*60+15,label:'Monitoring 2'},
    {startMin:13*60+45, endMin:14*60+15,label:'Monitoring 3'},
  ],
  dg: [
    {startMin:11*60+30, endMin:12*60,   label:'Monitoring 1'},
    {startMin:14*60,    endMin:14*60+30,label:'Monitoring 2'},
    {startMin:15*60+30, endMin:16*60,   label:'Monitoring 3'},
    {startMin:17*60+30, endMin:18*60,   label:'Monitoring 4'},
  ],
}
function getMonitoringWindows(staffId: string) {
  return MONITORING[staffId] || []
}
function checkMonitoringWindow(staffId: string, nowMin: number): boolean {
  return getMonitoringWindows(staffId).some(w => nowMin >= w.startMin && nowMin < w.endMin)
}

// ─── PUNCH EVENT HELPERS ──────────────────────────────────────────────────────
const PUNCH_EVENTS = [
  {id:'punch_in',      label:'Punch In',              color:'#16a34a', bg:'#dcfce7', icon:'🟢'},
  {id:'at_station',    label:'At Station',            color:'#1d4ed8', bg:'#dbeafe', icon:'📍'},
  {id:'waiting_station',label:'Waiting for Station', color:'#f59e0b', bg:'#fef3c7', icon:'⏳'},
  {id:'waiting_station_down',label:'Station Down',   color:'#dc2626', bg:'#fee2e2', icon:'🚫'},
  {id:'break',         label:'Break',                 color:'#7c3aed', bg:'#f3e8ff', icon:'☕'},
  {id:'car_move',      label:'Car Move',              color:'#0891b2', bg:'#ecfeff', icon:'🚗'},
  {id:'bathroom',      label:'Bathroom',              color:'#6b7280', bg:'#f3f4f6', icon:'🚻'},
  {id:'lunch',         label:'Lunch',                 color:'#92400e', bg:'#fffbeb', icon:'🍽️'},
  {id:'adhoc_task',    label:'Adhoc Task',            color:'#be185d', bg:'#fce7f3', icon:'📋'},
  {id:'transition',    label:'Transitioning',         color:'#059669', bg:'#d1fae5', icon:'🔄'},
  {id:'return_lunch',  label:'Return from Lunch',     color:'#16a34a', bg:'#dcfce7', icon:'↩️'},
  {id:'return_break',  label:'Return from Break',     color:'#16a34a', bg:'#dcfce7', icon:'↩️'},
  {id:'return_car_move',label:'Return from Car Move', color:'#16a34a', bg:'#dcfce7', icon:'↩️'},
  {id:'return_bathroom',label:'Return from Bathroom', color:'#16a34a', bg:'#dcfce7', icon:'↩️'},
  {id:'left_early',    label:'Left Work Early',        color:'#dc2626', bg:'#fee2e2', icon:'🚪'},
  {id:'punch_out',     label:'Punch Out',             color:'#dc2626', bg:'#fee2e2', icon:'🔴'},
]

function getPunchInfo(eventId: string) {
  return PUNCH_EVENTS.find(e=>e.id===eventId) || {id:eventId,label:eventId,color:'#6b7280',bg:'#f3f4f6',icon:'•'}
}

function formatDuration(ms: number): string {
  const mins = Math.floor(ms/60000)
  if (mins < 60) return mins + 'm'
  return Math.floor(mins/60) + 'h ' + (mins%60) + 'm'
}

function getShiftEndMin(shiftNum: number): number {
  return shiftNum === 1 ? 15*60 : 18*60 // 3PM or 6PM
}

// ─── REAL-TIME ATTENDANCE HOOK ────────────────────────────────────────────────
function useRealtimeAttendance() {
  // ✅ FIX: Create supabase client inside the hook so it runs in the browser
  // where window and env vars are both available. The module-level pattern
  // caused supabase to be null because it evaluated during SSR.
  const [supabase] = useState(() => getSupabase())

  const today = getToday()
  const [absentIds, setAbsentIds] = useState<any>(new Set(['gr']))
  const [loading, setLoading] = useState(true)
  const [synced, setSynced] = useState(false)
  const [vacationMap, setVacationMap] = useState<any>({})
  const [disabledStations, setDisabledStations] = useState<any>(new Set())

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
        // Load disabled stations (persist until manually re-enabled)
        const {data:dsData} = await supabase.from('station_overrides')
          .select('config_value').eq('config_key','disabled_stations').single()
        if (dsData?.config_value) {
          try {
            const ds = JSON.parse(dsData.config_value)
            setDisabledStations(new Set(ds))
          } catch(e){}
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
  },[today, supabase])

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
  },[today, supabase])

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
      setAbsentIds(prev=>{ const n=new Set(prev); newStatus==='absent'?n.delete(staffId):n.add(staffId); return n })
    }
  },[absentIds,today,supabase])

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
  },[today, supabase])

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
  },[today, supabase])

  const toggleStation = useCallback(async(stationId: string, actorId?: string)=>{
    const next = new Set(disabledStations)
    const action = next.has(stationId) ? 'enabled' : 'disabled'
    if (next.has(stationId)) next.delete(stationId)
    else next.add(stationId)
    setDisabledStations(next)
    if (!supabase) return
    try {
      await supabase.from('station_overrides').upsert(
        {config_key:'disabled_stations', config_value:JSON.stringify(Array.from(next)), updated_at:new Date().toISOString()},
        {onConflict:'config_key'}
      )
      // Log the action
      await supabase.from('station_logs').insert({
        station_id:stationId, action, actioned_by:actorId||'unknown', actioned_at:new Date().toISOString()
      })
      // Auto-log affected DCs as waiting_station_down
      if (action === 'disabled') {
        const affectedDCs = [...ROSTER.s1, ...ROSTER.s2].filter(m=>{
          const rot = m.shift===1 ? ROTATION_S1 : ROTATION_S2
          const dayRot = rot[String(getDayIndex())]
          if (!dayRot || !m.pod) return false
          const podStations = dayRot[m.pod] 
          return podStations && podStations.includes(stationId)
        })
        for (const dc of affectedDCs) {
          await supabase.from('punch_events').insert({
            staff_id:dc.id, event_type:'waiting_station_down',
            station_id:stationId, shift_date:getToday(), shift:dc.shift,
            logged_at:new Date().toISOString(), auto_logged:true,
            notes:`Station ${stationId} disabled by ${actorId||'lead'}`
          })
        }
      }
    } catch(e){ console.error('toggleStation error:',e) }
  },[disabledStations, supabase])

  return {absentIds,loading,synced,toggle,vacationMap,bookTimeOff,cancelTimeOff,disabledStations,toggleStation}
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [shift,         setShift]        = useState<any>(1)
  const [tab,           setTab]          = useState<string>('mine')
  const [selectedUser,  setSelectedUser] = useState<any>(null)
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

  const {absentIds,loading,synced,toggle,vacationMap,bookTimeOff,cancelTimeOff,disabledStations,toggleStation} = useRealtimeAttendance()
  const [adhocTasks, setAdhocTasks] = useState<any[]>([])
  const [showAdhocForm, setShowAdhocForm] = useState(false)
  const [adhocName, setAdhocName] = useState('')
  const [adhocDesc, setAdhocDesc] = useState('')
  const [adhocStartDate, setAdhocStartDate] = useState('')
  const [adhocStartTime, setAdhocStartTime] = useState('')
  const [adhocEndDate, setAdhocEndDate] = useState('')
  const [adhocEndTime, setAdhocEndTime] = useState('')
  const [adhocStaffId, setAdhocStaffId] = useState('')
  const [adhocMsg, setAdhocMsg] = useState('')
  const [adhocPendingConfirm, setAdhocPendingConfirm] = useState<any|null>(null)
  const [loginStats, setLoginStats] = useState<any[]>([])
  const [stationLogs, setStationLogs] = useState<any[]>([])
  const [analyticsTab, setAnalyticsTab] = useState<string>('hours')
  const [toastMsg, setToastMsg] = useState<any>(null)
  // Punch system state
  const [punchEvents, setPunchEvents] = useState<any[]>([])
  const [todayEvents, setTodayEvents] = useState<any[]>([])
  const [liveStatus, setLiveStatus] = useState<any>({})
  const [analyticsDate, setAnalyticsDate] = useState<string>('today')
  const [analyticsWeekOffset, setAnalyticsWeekOffset] = useState(0)
  const [overrides, setOverrides] = useState<any>({})
  const [notifications, setNotifications] = useState<any>([])
  const [showReassign, setShowReassign] = useState<any>(null)

  useEffect(()=>{ 
    const t=setInterval(()=>{
      setClock(getClockTime())
      // Auto punch-out check
      if (loggedIn && selectedUser && currentUser) {
        const nowM = new Date().getHours()*60+new Date().getMinutes()
        const endMin = getShiftEndMin(currentUser.shift)
        const myLastEvent = todayEvents.filter((e:any)=>e.staff_id===selectedUser).slice(-1)[0]
        if (nowM >= endMin && myLastEvent && myLastEvent.event_type !== 'punch_out' && myLastEvent.event_type !== 'left_early') {
          const sb = getSupabase()
          if (sb) {
            sb.from('punch_events').insert({
              staff_id:selectedUser, event_type:'punch_out',
              shift_date:getToday(), shift:currentUser.shift,
              logged_at:new Date().toISOString(), auto_logged:true,
              notes:'Auto punch-out at shift end'
            }).then(()=>{})
          }
        }
      }
    },1000); 
    return ()=>clearInterval(t) 
  },[loggedIn, selectedUser, todayEvents])

  // ─── TOAST NOTIFICATION ──────────────────────────────────────────────────────
  const showToast = (text:string, icon:string, color:string) => {
    setToastMsg({text,icon,color})
    setTimeout(()=>setToastMsg(null), 3000)
  }

  // ─── LOG PUNCH EVENT ──────────────────────────────────────────────────────
  const logPunchEvent = async(staffId:string, eventType:string, stationId?:string, autoLogged=false, notes='')=>{
    const sb = getSupabase(); if (!sb) return
    const person = ALL_PEOPLE.find(p=>p.id===staffId)
    if (!person) return
    const newEvent = {
      staff_id:staffId, event_type:eventType,
      station_id:stationId||null,
      shift_date:getToday(), shift:person.shift,
      logged_at:new Date().toISOString(),
      auto_logged:autoLogged, notes
    }
    // Update local state immediately so buttons re-render without waiting for realtime
    setTodayEvents(prev=>[...prev, newEvent])
    setLiveStatus((prev:any)=>({...prev,
      [staffId]:{event:eventType, station:stationId, since:new Date()}
    }))
    // Then persist to Supabase
    await sb.from('punch_events').insert(newEvent)
    if (!autoLogged) {
      const info = PUNCH_EVENTS.find(e=>e.id===eventType)
      if (info) showToast(info.label + ' logged at ' + new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}), info.icon, info.color)
    }
  }

  // Load adhoc tasks, login stats, station logs on login
  useEffect(()=>{
    if (!loggedIn) return
    const sb = getSupabase()
    if (!sb) return
    sb.from('adhoc_tasks').select('*').order('submitted_at',{ascending:false}).then(({data})=>{ if(data) setAdhocTasks(data) })
    if (isAnalyticsAdmin(selectedUser)) {
      sb.from('login_logs').select('*').order('logged_in_at',{ascending:false}).then(({data})=>{ if(data) setLoginStats(data) })
      sb.from('station_logs').select('*').order('actioned_at',{ascending:false}).then(({data})=>{ if(data) setStationLogs(data) })
    }
    // Check for pending adhoc tasks
    sb.from('adhoc_tasks').select('*').eq('status','pending_confirmation').then(({data})=>{
      if (data && data.length>0) {
        // Leads see any pending task, DCs only see their own
        const relevant = isLead || isSuperAdmin(selectedUser)
          ? data[0]
          : data.find((t:any)=>t.staff_id===selectedUser)
        if (relevant) setAdhocPendingConfirm(relevant)
      }
    })

    // Load today's punch events
    const loadPunchEvents = async () => {
      const {data} = await sb.from('punch_events').select('*')
        .eq('shift_date', getToday())
        .order('logged_at', {ascending: true})
      if (data) {
        setTodayEvents(data)
        const statusMap: any = {}
        data.forEach((e:any)=>{
          statusMap[e.staff_id] = {event:e.event_type, station:e.station_id, since:new Date(e.logged_at)}
        })
        setLiveStatus(statusMap)
      }
    }
    loadPunchEvents()

    // Refresh punch events every 30 seconds to catch any missed realtime updates
    const punchRefreshInterval = setInterval(loadPunchEvents, 30000)

    // Real-time punch events subscription — unique channel per session
    const sessionId = Math.random().toString(36).slice(2)
    const punchChannel = sb.channel(`punch-live-${sessionId}`)
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'punch_events',
        filter:`shift_date=eq.${getToday()}`},
        (payload:any)=>{
          setTodayEvents(prev=>{
            // Avoid duplicates
            if (prev.find((e:any)=>e.staff_id===payload.new.staff_id&&e.logged_at===payload.new.logged_at)) return prev
            return [...prev, payload.new]
          })
          setLiveStatus((prev:any)=>({...prev,
            [payload.new.staff_id]:{event:payload.new.event_type,station:payload.new.station_id,since:new Date(payload.new.logged_at)}
          }))
        }
      ).subscribe()

    // Real-time subscription for new adhoc tasks (so leads get notified without refresh)
    const adhocChannel = sb.channel('adhoc-pending')
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'adhoc_tasks'},
        async(payload:any)=>{
          if (payload.new.status==='pending_confirmation') {
            const isLeadOrAdmin = isLead || isSuperAdmin(selectedUser)
            const isOwn = payload.new.staff_id === selectedUser
            if (isLeadOrAdmin || isOwn) {
              setAdhocPendingConfirm(payload.new)
            }
          }
          // Refresh full list
          const {data:fresh} = await sb.from('adhoc_tasks').select('*').order('submitted_at',{ascending:false})
          if (fresh) setAdhocTasks(fresh)
        }
      ).subscribe()
    return ()=>{ 
      sb.removeChannel(adhocChannel)
      sb.removeChannel(punchChannel)
      clearInterval(punchRefreshInterval)
    }
  },[loggedIn, selectedUser])

  const pool       = ROSTER[`s${shift}` as 's1'|'s2']
  const dayIdx     = getDayIndex()
  const dayStr     = String(dayIdx)
  const rotation   = shift===1 ? ROTATION_S1[dayStr] : ROTATION_S2[dayStr]
  const currentUser = selectedUser ? ALL_PEOPLE.find(m=>m.id===selectedUser) : null
  const myPod      = currentUser?.pod || null
  const presentDCs = pool.filter(m=>m.role==='DC'&&!absentIds.has(m.id)).length
  const absentDCs  = pool.filter(m=>m.role==='DC'&&absentIds.has(m.id)).length
  const presentDAs = pool.filter(m=>m.role==='DA'&&!absentIds.has(m.id)).length

  const myStations = myPod && rotation ? rotation[myPod] : null

  function buildMyTimeline() {
    if (!myStations || !currentUser) return []
    const [b1,b2,cross,b4] = myStations
    const isS1 = currentUser.shift===1
    const podMembers = myPod ? (isS1 ? ROSTER.s1 : ROSTER.s2).filter(m=>m.pod===myPod) : []
    const podPresent = podMembers.filter(m=>!absentIds.has(m.id))
    const isSoloStation = podPresent.length <= 1
    const isPersonA = !isSoloStation && podMembers[0]?.id === currentUser.id
    const lunchWindow = isPersonA ? '11:00 AM – 12:00 PM' : '12:00 PM – 1:00 PM'
    const lunchNote = isSoloStation
      ? 'Solo lunch · 12:00 PM – 1:00 PM · Lead will cover your station'
      : isPersonA ? LUNCH_NOTE_A : LUNCH_NOTE_B
    const lunchStartMin = isPersonA ? 11*60 : 12*60
    const isCrossUMI = cross==='uc1'||cross==='uc2'
    const crossNote = isCrossUMI ? '(solo - cross-training)' : '(cross-train with 2nd shift station)'

    const isMonLead = ['kw','ah','dg'].includes(currentUser.id)
    const monBlocks = isMonLead ? getMonitoringWindows(currentUser.id).map(w=>({
      type:'monitoring',
      label:w.label,
      station:'',
      timeLabel:`${formatMin(w.startMin)} – ${formatMin(w.endMin)}`,
      startMin:w.startMin,
      durHrs:(w.endMin-w.startMin)/60,
      isCross:false,
      isSolo:false,
      note:'Vacate station · Stand by on floor · Your partner runs solo'
    })) : []

    if (isS1) {
      const base = [
        {type:'block',label:'Block 1',station:b1,timeLabel:'7:00 – 9:00 AM',startMin:7*60,durHrs:2,isCross:false,isSolo:false},
        {type:'block',label:'Block 2',station:b2,timeLabel:'9:00 – 11:00 AM',startMin:9*60,durHrs:2,isCross:false,isSolo:false},
        {type:'lunch',label:'Lunch',station:'',timeLabel:lunchWindow,note:lunchNote,startMin:lunchStartMin,durHrs:1,isCross:false,isSolo:false},
        {type:'cross',label:'Cross-Train',station:cross,timeLabel:`During ${isPersonA?'11AM-12PM':'12PM-1PM'}`,startMin:lunchStartMin,durHrs:1,isCross:true,isSolo:true,note:crossNote},
        {type:'block',label:'Block 4',station:b4,timeLabel:'1:00 – 3:00 PM',startMin:13*60,durHrs:2,isCross:false,isSolo:false},
      ]
      return [...base,...monBlocks].sort((a,b)=>a.startMin-b.startMin)
    }
    else {
      const base = [
        {type:'block',label:'Block 1',station:b1,timeLabel:'10:00 AM – 12:00 PM',startMin:10*60,durHrs:2,isCross:false,isSolo:b1==='uc1'||b1==='uc2'},
        {type:'lunch',label:'Lunch',station:'',timeLabel:lunchWindow,note:lunchNote,startMin:lunchStartMin,durHrs:1,isCross:false,isSolo:false},
        {type:'block',label:'Block 2',station:b2,timeLabel:'1:00 – 2:00 PM',startMin:13*60,durHrs:1,isCross:false,isSolo:b2==='uc1'||b2==='uc2'},
        {type:'block',label:'Block 3',station:cross,timeLabel:'2:00 – 4:00 PM',startMin:14*60,durHrs:2,isCross:false,isSolo:cross==='uc1'||cross==='uc2'},
        {type:'block',label:'Block 4',station:b4,timeLabel:'4:00 – 6:00 PM',startMin:16*60,durHrs:2,isCross:false,isSolo:b4==='uc1'||b4==='uc2'},
      ]
      return [...base,...monBlocks].sort((a,b)=>a.startMin-b.startMin)
    }
  }

  const myTimeline = buildMyTimeline()

  function buildTeamSchedule() {
    const pods = shift===1 ? ['P1','P2','P3','P4'] : ['PA','PB','PC','PD']
    return pods.map(pod=>{
      const ps = rotation?.[pod] 
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
      if (presentMembers.length > 0) return

      const stations = rot[pod]
      const blocks = podShift===1
        ? [{idx:0,startMin:7*60,endMin:9*60,label:'Block 1'},{idx:1,startMin:9*60,endMin:11*60,label:'Block 2'},{idx:3,startMin:13*60,endMin:15*60,label:'Block 4'}]
        : [{idx:0,startMin:10*60,endMin:12*60,label:'Block 1'},{idx:1,startMin:12*60,endMin:14*60,label:'Block 2'},{idx:2,startMin:14*60,endMin:16*60,label:'Block 3'},{idx:3,startMin:16*60,endMin:18*60,label:'Block 4'}]

      blocks.forEach(block => {
        if (nowMinutes < block.startMin || nowMinutes >= block.endMin) return
        const stationId = stations[block.idx]
        if (!stationId) return
        const overrideKey = `${pod}_${block.idx}`
        if (overrides[overrideKey]) return

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
                          // Log login
                          const sb = getSupabase()
                          if (sb) sb.from('login_logs').insert({staff_id:selectedUser||'',shift,logged_in_at:new Date().toISOString()}).then(()=>{})
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
  const tabs = isAnalyticsAdmin(selectedUser)
    ? ['team','roster','timeoff','adhoc','rotation','analytics']
    : currentUser?.role==='SUPER_ADMIN'
    ? ['team','roster','timeoff','adhoc','rotation','events']
    : isLead
    ? ['mine','team','roster','timeoff','adhoc','rotation','events']
    : ['mine','team','roster','adhoc','rotation']

  const tabLabels: Record<string,string> = {
    mine:'My Schedule', team:'Team Schedule', roster:'Roster',
    timeoff:'Time Off', adhoc:'Adhoc Tasks', rotation:'Rotation', analytics:'Analytics', events:'Cell Uptime'
  }
  const analyticsTabLabels: Record<string,string> = {
    events:'Events', hours:'Station Hours', timeoff:'Time Off', logins:'App Usage', stations:'Station Uptime'
  }

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
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}>
              <div style={{fontSize:'40px',fontWeight:'800',fontFamily:'monospace'}}>6 MIN</div>
              {selectedUser && currentUser && (
                <button onClick={async()=>{
                  await logPunchEvent(selectedUser,'transition',myNextBlock?.station||undefined)
                }} style={{padding:'6px 14px',borderRadius:'8px',border:'none',
                  background:'rgba(255,255,255,0.25)',color:'white',cursor:'pointer',
                  fontWeight:'700',fontSize:'11px'}}>
                  ✓ I'm Transitioning Now
                </button>
              )}
            </div>
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

        {/* ADHOC PENDING NOTIFICATION — shows everywhere for leads */}
        {adhocPendingConfirm && isLead && (
          <div style={{background:'#f59e0b',color:'white',padding:'10px 14px',
            borderRadius:'10px',marginBottom:'8px',display:'flex',
            alignItems:'center',gap:'10px',boxShadow:'0 2px 8px rgba(245,158,11,0.4)'}}>
            <span style={{fontSize:'20px'}}>&#128clipboard;</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:'700',fontSize:'13px'}}>&#128203; Adhoc Task Needs Your Confirmation</div>
              <div style={{fontSize:'12px',opacity:0.9,marginTop:'2px'}}>
                {ALL_PEOPLE.find(p=>p.id===adhocPendingConfirm.staff_id)?.name} requested: <strong>{adhocPendingConfirm.task_name}</strong>
                {' '}· {adhocPendingConfirm.start_date} {adhocPendingConfirm.start_time}
              </div>
            </div>
            <button onClick={()=>setTab('adhoc')}
              style={{background:'rgba(255,255,255,0.25)',border:'none',color:'white',
                borderRadius:'6px',padding:'4px 10px',cursor:'pointer',fontSize:'12px',fontWeight:'700'}}>
              Review
            </button>
          </div>
        )}

        {/* TOAST NOTIFICATION */}
        {toastMsg && (
          <div style={{position:'fixed',bottom:'24px',left:'50%',transform:'translateX(-50%)',
            zIndex:9999,padding:'12px 20px',borderRadius:'12px',
            background:'white',boxShadow:'0 4px 24px rgba(0,0,0,0.15)',
            border:`2px solid ${toastMsg.color}`,
            display:'flex',alignItems:'center',gap:'10px',
            animation:'slideUp 0.3s ease',minWidth:'240px',maxWidth:'340px'}}>
            <span style={{fontSize:'22px'}}>{toastMsg.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:'13px',fontWeight:'700',color:toastMsg.color}}>✓ Logged</div>
              <div style={{fontSize:'12px',color:'#374151',marginTop:'1px'}}>{toastMsg.text}</div>
            </div>
          </div>
        )}

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


        {/* ANALYTICS ADMIN CARD */}
        {(currentUser?.role==='ANALYTICS_ADMIN') && (
          <div style={{background:'white',borderRadius:'12px',border:'2px solid #6ee7b7',
            padding:'16px',marginBottom:'12px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
              <div>
                <div style={{fontWeight:'700',fontSize:'15px'}}>{currentUser.name}</div>
                <div style={{fontSize:'11px',color:'#059669',fontFamily:'monospace',fontWeight:'600'}}>
                  Analytics Observer · Read-only
                </div>
              </div>
              <span style={{padding:'4px 12px',borderRadius:'99px',fontSize:'11px',fontWeight:'700',
                background:'#d1fae5',color:'#059669',fontFamily:'monospace'}}>OBSERVER</span>
            </div>
            <div style={{padding:'8px 12px',background:'#d1fae5',borderRadius:'8px',
              border:'1px solid #6ee7b7',fontSize:'12px',color:'#059669',marginBottom:'10px'}}>
              You have read-only access to all schedules, time off, adhoc tasks, and the analytics dashboard.
            </div>
            <button onClick={()=>{setShowSetPin(v=>!v);setNewPin('');setNewPinConfirm('');setPinSetMsg('')}}
              style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #6ee7b7',
                background:'#d1fae5',fontSize:'12px',cursor:'pointer',color:'#059669',fontWeight:'600'}}>
              Change my PIN
            </button>
            {showSetPin && (
              <div style={{marginTop:'10px',padding:'12px',background:'#f0fdf4',
                borderRadius:'10px',border:'1px solid #6ee7b7'}}>
                <div style={{fontSize:'12px',fontWeight:'600',marginBottom:'8px',color:'#059669'}}>
                  Set new 4-digit PIN
                </div>
                <input type="password" maxLength={4} value={newPin}
                  onChange={e=>setNewPin(e.target.value.replace(/[^0-9]/g,'').slice(0,4))}
                  placeholder="New PIN" style={{width:'100%',padding:'8px',borderRadius:'8px',
                    border:'1px solid #6ee7b7',fontSize:'13px',marginBottom:'6px',
                    letterSpacing:'0.3em',textAlign:'center'}}/>
                <input type="password" maxLength={4} value={newPinConfirm}
                  onChange={e=>setNewPinConfirm(e.target.value.replace(/[^0-9]/g,'').slice(0,4))}
                  placeholder="Confirm PIN" style={{width:'100%',padding:'8px',borderRadius:'8px',
                    border:'1px solid #6ee7b7',fontSize:'13px',marginBottom:'6px',
                    letterSpacing:'0.3em',textAlign:'center'}}/>
                {pinSetMsg&&<div style={{fontSize:'12px',color:pinSetMsg.includes('ok')?'#16a34a':'#dc2626',
                  marginBottom:'6px',textAlign:'center'}}>{pinSetMsg}</div>}
                <div style={{display:'flex',gap:'6px'}}>
                  <button onClick={()=>setShowSetPin(false)}
                    style={{flex:1,padding:'7px',borderRadius:'8px',border:'1px solid #6ee7b7',
                      background:'white',cursor:'pointer',fontSize:'11px',color:'#059669'}}>Cancel</button>
                  <button onClick={()=>{
                    if (newPin.length!==4){setPinSetMsg('Must be 4 digits');return}
                    if (newPin!==newPinConfirm){setPinSetMsg('PINs do not match');return}
                    setPin(currentUser.id,newPin); setPinSetMsg('PIN updated ok!')
                    setTimeout(()=>setShowSetPin(false),1500)
                  }} style={{flex:1,padding:'7px',borderRadius:'8px',border:'none',
                    background:'#059669',color:'white',cursor:'pointer',fontSize:'11px',fontWeight:'600'}}>
                    Save
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

            {/* PUNCH EVENT PANEL */}
            {(()=>{
              const myEvents = todayEvents.filter((e:any)=>e.staff_id===selectedUser)
              const lastEvent = myEvents.slice(-1)[0]
              const lastInfo = lastEvent ? getPunchInfo(lastEvent.event_type) : null
              const isPunchedIn = lastEvent && lastEvent.event_type !== 'punch_out'
              const isPunchedOut = lastEvent?.event_type === 'punch_out'
              
              // Which buttons to show based on last event
              const showButtons = ()=>{
                if (!lastEvent || isPunchedOut || lastEvent?.event_type==='left_early') return ['punch_in']
                const e = lastEvent.event_type
                if (e==='punch_in'||e==='at_station'||e==='return_lunch'||e==='return_break'||e==='return_car_move'||e==='return_bathroom'||e==='transition') 
                  return ['at_station','waiting_station','break','car_move','bathroom','lunch','left_early','punch_out']
                if (e==='waiting_station'||e==='waiting_station_down') 
                  return ['at_station','break','bathroom','left_early','punch_out']
                if (e==='break') return ['return_break','left_early','punch_out']
                if (e==='car_move') return ['return_car_move','left_early','punch_out']
                if (e==='bathroom') return ['return_bathroom','left_early','punch_out']
                if (e==='lunch') return ['return_lunch','left_early','punch_out']
                if (e==='adhoc_task') return ['at_station','left_early','punch_out']
                return ['at_station','left_early','punch_out']
              }

              return (
                <div style={{marginTop:'10px',padding:'12px',background:'#f9fafb',
                  borderRadius:'10px',border:'1px solid #e5e7eb'}}>
                  <div style={{fontSize:'11px',fontWeight:'600',color:'#6b7280',
                    textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'8px'}}>
                    My Activity Log
                  </div>
                  {lastInfo && (
                    <div style={{display:'flex',alignItems:'center',gap:'8px',
                      padding:'6px 10px',borderRadius:'8px',marginBottom:'8px',
                      background:lastInfo.bg,border:`1px solid ${lastInfo.color}22`}}>
                      <span style={{fontSize:'16px'}}>{lastInfo.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'12px',fontWeight:'700',color:lastInfo.color}}>
                          {lastInfo.label}
                        </div>
                        <div style={{fontSize:'10px',color:'#6b7280'}}>
                          Since {new Date(lastEvent.logged_at).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}
                          {' · '}{formatDuration(Date.now()-new Date(lastEvent.logged_at).getTime())} ago
                        </div>
                      </div>
                    </div>
                  )}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'6px'}}>
                    {showButtons().map(btnId=>{
                      const info = getPunchInfo(btnId)
                      return (
                        <button key={btnId} onClick={async()=>{
                          if (!selectedUser||!currentUser) return
                          // Transition = also logs at_station for next station
                          if (btnId==='transition' && myNextBlock?.station) {
                            await logPunchEvent(selectedUser,'transition',myNextBlock.station)
                          } else {
                            const myStation = myActiveBlock?.station
                            await logPunchEvent(selectedUser,btnId,myStation)
                          }
                        }}
                          style={{padding:'8px',borderRadius:'8px',border:`1px solid ${info.color}44`,
                            background:info.bg,color:info.color,cursor:'pointer',
                            fontSize:'11px',fontWeight:'700',display:'flex',
                            alignItems:'center',gap:'5px',justifyContent:'center'}}>
                          <span>{info.icon}</span>{info.label}
                        </button>
                      )
                    })}
                  </div>
                  {/* Today's event log */}
                  {myEvents.length>0 && (
                    <div style={{marginTop:'10px',maxHeight:'150px',overflowY:'auto'}}>
                      <div style={{fontSize:'10px',color:'#9ca3af',marginBottom:'4px',fontWeight:'600',
                        textTransform:'uppercase',letterSpacing:'0.05em'}}>Today's log</div>
                      {myEvents.slice().reverse().map((e:any,i:number)=>{
                        const info = getPunchInfo(e.event_type)
                        return (
                          <div key={i} style={{display:'flex',alignItems:'center',gap:'6px',
                            padding:'3px 0',borderBottom:'1px solid #f3f4f6',fontSize:'11px'}}>
                            <span>{info.icon}</span>
                            <span style={{color:info.color,fontWeight:'600',flex:1}}>{info.label}</span>
                            <span style={{color:'#9ca3af',fontFamily:'monospace',fontSize:'10px'}}>
                              {new Date(e.logged_at).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}
                            </span>
                            {e.auto_logged && <span style={{fontSize:'9px',color:'#9ca3af'}}>auto</span>}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })()}
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
                fontWeight:'600',fontSize:'13px',cursor:'pointer',marginBottom:'8px',
                borderColor:absentIds.has(currentUser.id)?'#a5f3fc':'#fca5a5',
                background:absentIds.has(currentUser.id)?'#ecfeff':'#fef2f2',
                color:absentIds.has(currentUser.id)?'#0e7490':'#dc2626'}}>
              {absentIds.has(currentUser.id)?'Mark myself PRESENT':'I will be OUT today'}
            </button>
            {/* DA Punch Panel */}
            {(()=>{
              const myEvents = todayEvents.filter((e:any)=>e.staff_id===selectedUser)
              const lastEvent = myEvents.slice(-1)[0]
              const lastInfo = lastEvent ? getPunchInfo(lastEvent.event_type) : null
              const showButtons = ()=>{
                if (!lastEvent || lastEvent.event_type==='punch_out' || lastEvent.event_type==='left_early') return ['punch_in']
                const e = lastEvent.event_type
                if (e==='punch_in'||e==='at_station'||e.startsWith('return')||e==='transition')
                  return ['at_station','break','bathroom','lunch','left_early','punch_out']
                if (e==='break') return ['return_break','left_early','punch_out']
                if (e==='bathroom') return ['return_bathroom','left_early','punch_out']
                if (e==='lunch') return ['return_lunch','left_early','punch_out']
                return ['at_station','left_early','punch_out']
              }
              return (
                <div style={{marginTop:'0',marginBottom:'8px',padding:'12px',background:'#f9fafb',
                  borderRadius:'10px',border:'1px solid #e5e7eb'}}>
                  <div style={{fontSize:'11px',fontWeight:'600',color:'#6b7280',
                    textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'8px'}}>My Activity Log</div>
                  {lastInfo && (
                    <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'6px 10px',
                      borderRadius:'8px',marginBottom:'8px',background:lastInfo.bg}}>
                      <span>{lastInfo.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'12px',fontWeight:'700',color:lastInfo.color}}>{lastInfo.label}</div>
                        <div style={{fontSize:'10px',color:'#6b7280'}}>
                          Since {new Date(lastEvent.logged_at).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  )}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'6px'}}>
                    {showButtons().map(btnId=>{
                      const info = getPunchInfo(btnId)
                      return (
                        <button key={btnId} onClick={()=>logPunchEvent(selectedUser||'',btnId)}
                          style={{padding:'8px',borderRadius:'8px',border:`1px solid ${info.color}44`,
                            background:info.bg,color:info.color,cursor:'pointer',
                            fontSize:'11px',fontWeight:'700',display:'flex',
                            alignItems:'center',gap:'5px',justifyContent:'center'}}>
                          <span>{info.icon}</span>{info.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })()}
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
            {/* MY TIME OFF */}
            {(vacationMap[selectedUser||'']||[]).length > 0 && (
              <div style={{background:'white',borderRadius:'12px',border:'1px solid #bfdbfe',
                padding:'14px',marginBottom:'12px'}}>
                <div style={{fontSize:'13px',fontWeight:'700',marginBottom:'8px',color:'#1d4ed8',
                  display:'flex',alignItems:'center',gap:'6px'}}>
                  <span>📅</span> My Upcoming Time Off
                </div>
                {(vacationMap[selectedUser||'']||[]).map(v=>{
                  const today = getToday()
                  const isNow = v.start<=today&&today<=v.end
                  const days = Math.round((new Date(v.end+'T12:00').getTime()-new Date(v.start+'T12:00').getTime())/86400000)+1
                  return (
                    <div key={v.id} style={{display:'flex',alignItems:'center',gap:'10px',
                      padding:'8px 10px',borderRadius:'8px',marginBottom:'4px',
                      background:isNow?'#fee2e2':'#eff6ff',
                      border:`1px solid ${isNow?'#fca5a5':'#bfdbfe'}`}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:'12px',fontWeight:'600',
                          color:isNow?'#dc2626':'#1d4ed8'}}>
                          {v.start===v.end
                            ? new Date(v.start+'T12:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})
                            : `${new Date(v.start+'T12:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${new Date(v.end+'T12:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}`
                          }
                        </div>
                        <div style={{fontSize:'10px',color:'#6b7280',marginTop:'1px'}}>
                          {days} day{days!==1?'s':''} · {isNow?'You are currently out':'Upcoming'}
                        </div>
                      </div>
                      <span style={{padding:'2px 8px',borderRadius:'99px',fontSize:'10px',
                        fontWeight:'700',fontFamily:'monospace',
                        background:isNow?'#dc2626':'#1d4ed8',color:'white'}}>
                        {isNow?'OUT NOW':'APPROVED'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {!myTimeline.length ? (
              <div style={{background:'white',borderRadius:'12px',border:'1px solid #e5e7eb',
                padding:'32px',textAlign:'center',color:'#9ca3af',fontSize:'13px'}}>
                <div style={{fontSize:'32px',marginBottom:'8px'}}>&#128203;</div>
                No station assignments — check with your shift lead.
              </div>
            ) : (
              <div>
                <div style={{fontSize:'12px',color:'#6b7280',marginBottom:'8px',
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
                {['kw','ah','dg'].includes(currentUser?.id||'') && (
                  <div style={{padding:'10px 14px',background:'#1d4ed8',borderRadius:'10px',
                    marginBottom:'10px',border:'1px solid #1d4ed8'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
                      <span style={{fontSize:'16px'}}>&#128270;</span>
                      <span style={{fontWeight:'700',fontSize:'13px',color:'white'}}>
                        Your monitoring windows today
                      </span>
                    </div>
                    <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                      {getMonitoringWindows(currentUser?.id||'').map((w,i)=>{
                        const nowMin3=new Date().getHours()*60+new Date().getMinutes()
                        const isActive=nowMin3>=w.startMin&&nowMin3<w.endMin
                        const isPast=nowMin3>=w.endMin
                        return (
                          <span key={i} style={{padding:'4px 10px',borderRadius:'6px',
                            fontSize:'11px',fontWeight:'700',fontFamily:'monospace',
                            background:isActive?'white':isPast?'rgba(255,255,255,0.15)':'rgba(255,255,255,0.25)',
                            color:isActive?'#1d4ed8':isPast?'rgba(255,255,255,0.5)':'white',
                            border:isActive?'none':'1px solid rgba(255,255,255,0.2)',
                            textDecoration:isPast?'line-through':'none'}}>
                            {isActive?'NOW · ':''}{formatMin(w.startMin)}–{formatMin(w.endMin)}
                          </span>
                        )
                      })}
                    </div>
                    <div style={{fontSize:'10px',color:'rgba(255,255,255,0.6)',marginTop:'6px'}}>
                      Every 90 min · 30 min each · Vacate station during these windows
                    </div>
                  </div>
                )}
                {myTimeline.map((block,i)=>{
                  if (block.type==='lunch') {
                    const isSoloLunch = block.note?.includes('Solo lunch')
                    return (
                      <div key={i} style={{padding:'10px 14px',borderRadius:'10px',
                        background:isSoloLunch?'#fef3c7':'#fffbeb',
                        border:isSoloLunch?'1.5px solid #f59e0b':'1px dashed #fde68a',
                        display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                        <span style={{fontSize:'20px'}}>&#127829;</span>
                        <div style={{flex:1}}>
                          <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                            <span style={{fontWeight:'600',fontSize:'13px'}}>{block.label}</span>
                            {isSoloLunch&&(
                              <span style={{padding:'1px 7px',borderRadius:'4px',fontSize:'9px',
                                fontWeight:'700',background:'#f59e0b',color:'white'}}>
                                SOLO · Lead covers
                              </span>
                            )}
                          </div>
                          <div style={{fontSize:'11px',color:'#92400e',fontFamily:'monospace',marginTop:'2px'}}>
                            {block.timeLabel}
                          </div>
                          <div style={{fontSize:'10px',color:'#9ca3af',marginTop:'2px'}}>{block.note}</div>
                        </div>
                      </div>
                    )
                  }
                  if (block.type==='monitoring') {
                    const nowMin2 = new Date().getHours()*60+new Date().getMinutes()
                    const isNowMon = nowMin2 >= block.startMin && nowMin2 < (block.startMin+block.durHrs*60)
                    return (
                      <div key={i} style={{padding:'14px 16px',borderRadius:'12px',
                        background:isNowMon
                          ?'linear-gradient(135deg,#1d4ed8,#3b82f6)'
                          :'linear-gradient(135deg,#eff6ff,#dbeafe)',
                        border:isNowMon?'2px solid #1d4ed8':'2px solid #93c5fd',
                        display:'flex',alignItems:'center',gap:'12px',marginBottom:'8px',
                        boxShadow:isNowMon?'0 4px 16px rgba(29,78,216,0.35)':'none',
                        transition:'all 0.3s'}}>
                        <span style={{fontSize:'26px'}}>&#128270;</span>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:'800',fontSize:'14px',
                            color:isNowMon?'white':'#1d4ed8',letterSpacing:'-0.01em'}}>
                            {block.label} &mdash; Floor Monitoring
                          </div>
                          <div style={{fontSize:'12px',fontFamily:'monospace',marginTop:'3px',
                            fontWeight:'600',color:isNowMon?'rgba(255,255,255,0.85)':'#3b82f6'}}>
                            {block.timeLabel}
                          </div>
                          <div style={{fontSize:'11px',marginTop:'4px',
                            color:isNowMon?'rgba(255,255,255,0.75)':'#6b7280'}}>
                            Vacate station · Stand by on floor · Partner runs solo
                          </div>
                        </div>
                        <div style={{flexShrink:0,textAlign:'center'}}>
                          <div style={{padding:'6px 14px',borderRadius:'8px',
                            background:isNowMon?'rgba(255,255,255,0.2)':'#1d4ed8',
                            border:isNowMon?'1px solid rgba(255,255,255,0.35)':'none'}}>
                            <div style={{fontSize:'9px',textTransform:'uppercase',
                              letterSpacing:'0.06em',marginBottom:'2px',
                              color:isNowMon?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.8)'}}>
                              {isNowMon?'ACTIVE NOW':'30 min'}
                            </div>
                            <div style={{fontSize:'18px',fontWeight:'800',
                              fontFamily:'monospace',color:'white'}}>
                              {isNowMon?'NOW':'&#128270;'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
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

            {/* LIVE STATUS BOARD */}
            <div style={{background:'#1d4ed8',borderRadius:'12px',padding:'14px',marginBottom:'12px',
              border:'2px solid #1e40af'}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px'}}>
                <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#22c55e',
                  boxShadow:'0 0 6px #22c55e'}}/>
                <span style={{fontWeight:'800',fontSize:'13px',color:'white'}}>Live Team Status</span>
                <span style={{fontSize:'10px',color:'rgba(255,255,255,0.6)',marginLeft:'auto'}}>
                  {new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}
                </span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'6px'}}>
                {pool.filter(m=>!isGuest(m.id)&&!isSuperAdmin(m.id)&&m.role!=='ANALYTICS_ADMIN'&&!absentIds.has(m.id)).map(m=>{
                  const status = liveStatus[m.id]
                  const info = status ? getPunchInfo(status.event) : null
                  const sinceMs = status ? Date.now()-status.since.getTime() : 0
                  return (
                    <div key={m.id} style={{padding:'8px 10px',borderRadius:'8px',
                      background:info?info.bg:'rgba(255,255,255,0.1)',
                      border:`1px solid ${info?info.color+'44':'rgba(255,255,255,0.2)'}`}}>
                      <div style={{fontSize:'11px',fontWeight:'700',
                        color:info?info.color:'rgba(255,255,255,0.7)',marginBottom:'2px'}}>
                        {m.name.split(' ')[0]}
                      </div>
                      <div style={{fontSize:'10px',color:info?info.color:'rgba(255,255,255,0.5)',
                        display:'flex',alignItems:'center',gap:'4px'}}>
                        {info?<span>{info.icon}</span>:<span>⬜</span>}
                        <span>{info?info.label:'Not punched in'}</span>
                      </div>
                      {status && (
                        <div style={{fontSize:'9px',color:'#6b7280',marginTop:'2px',fontFamily:'monospace'}}>
                          {formatDuration(sinceMs)}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            {disabledStations.size>0&&(
              <div style={{padding:'10px 14px',background:'#fef2f2',borderRadius:'10px',
                border:'1px solid #fca5a5',marginBottom:'12px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                  <span style={{fontSize:'16px'}}>&#128683;</span>
                  <div style={{fontWeight:'700',fontSize:'13px',color:'#dc2626'}}>
                    {disabledStations.size} station{disabledStations.size>1?'s':''} currently disabled
                  </div>
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'8px'}}>
                  {Array.from(disabledStations).map((stId:any)=>{
                    const info=STATION_INFO[stId]
                    if (!info) return null
                    return (
                      <div key={stId} style={{display:'flex',alignItems:'center',gap:'6px',
                        padding:'4px 10px',borderRadius:'8px',background:'white',
                        border:'1px solid #fca5a5'}}>
                        <div style={{width:'8px',height:'8px',borderRadius:'50%',
                          background:'#9ca3af'}}/>
                        <span style={{fontSize:'12px',fontWeight:'600',
                          color:'#6b7280',textDecoration:'line-through'}}>{info.label}</span>
                        {canManageStations(selectedUser)&&(
                          <button onClick={()=>toggleStation(stId)}
                            style={{marginLeft:'4px',padding:'2px 8px',borderRadius:'4px',
                              border:'1px solid #86efac',background:'#f0fdf4',
                              color:'#16a34a',cursor:'pointer',fontSize:'10px',fontWeight:'700'}}>
                            Re-enable
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div style={{fontSize:'11px',color:'#dc2626',opacity:0.8}}>
                  DCs from disabled stations have been redistributed to active stations.
                  Only leads and Yban can re-enable stations.
                </div>
              </div>
            )}

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

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'10px'}}>
              <div style={{padding:'8px 12px',background:'#fef3c7',borderRadius:'8px',
                border:'1px solid #fde68a',fontSize:'11px'}}>
                <div style={{fontWeight:'700',color:'#92400e',marginBottom:'2px'}}>
                  &#127829; Person A Lunch · 11:00 AM – 12:00 PM
                </div>
                <div style={{color:'#374151'}}>All pairs · both shifts · Person B covers solo</div>
              </div>
              <div style={{padding:'8px 12px',background:'#f3e8ff',borderRadius:'8px',
                border:'1px solid #d8b4fe',fontSize:'11px'}}>
                <div style={{fontWeight:'700',color:'#7c3aed',marginBottom:'2px'}}>
                  &#127829; Person B Lunch · 12:00 PM – 1:00 PM
                </div>
                <div style={{color:'#374151'}}>All pairs · both shifts · Person A covers solo</div>
                <div style={{color:'#7c3aed',fontSize:'10px',marginTop:'2px'}}>
                  Solo DCs also lunch at 12-1 · Lead covers their station
                </div>
              </div>
            </div>

            {shift===1&&(
              <div style={{padding:'8px 12px',background:'#f0fdf4',borderRadius:'8px',
                border:'1px solid #86efac',fontSize:'12px',color:'#16a34a',marginBottom:'10px'}}>
                10AM-1PM overlap: 1st shift covers YMC1-4. 2nd shift covers YMC7/G1/UMI. Zero station conflicts.
                During lunch windows, 1st shift DCs cross-train on 2nd shift stations.
              </div>
            )}
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
                    {isSolo&&(
                      <span style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'6px'}}>
                        <span style={{padding:'3px 10px',borderRadius:'99px',
                          fontSize:'10px',fontWeight:'700',background:'#fef3c7',color:'#92400e'}}>
                          SOLO
                        </span>
                        <span style={{padding:'3px 8px',borderRadius:'6px',fontSize:'9px',
                          background:'#fee2e2',color:'#dc2626',fontWeight:'600'}}>
                          Lead covers lunch 12-1
                        </span>
                      </span>
                    )}
                    {!isSolo&&(()=>{
                      const nowMC=new Date().getHours()*60+new Date().getMinutes()
                      const lim=row.allPod.find((m:any)=>
                        (m.id==='kw'||m.id==='ah'||m.id==='dg')&&
                        !absentIds.has(m.id)&&checkMonitoringWindow(m.id,nowMC))
                      return lim?(
                        <span style={{marginLeft:'auto',padding:'3px 10px',
                          borderRadius:'99px',fontSize:'10px',fontWeight:'700',
                          background:'#eff6ff',color:'#1d4ed8'}}>
                          SOLO · {lim.name.split(' ')[0]} monitoring
                        </span>
                      ):null
                    })()}
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
                          {disabledStations.has(b.station) ? (
                            <div style={{padding:'12px 10px',background:'#f3f4f6',
                              borderBottom:'1px solid #e5e7eb',opacity:0.7}}>
                              <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'4px'}}>
                                <div style={{width:'8px',height:'8px',borderRadius:'50%',
                                  background:'#9ca3af'}}/>
                                <span style={{fontSize:'12px',fontWeight:'800',
                                  textDecoration:'line-through',color:'#9ca3af'}}>{info.label}</span>
                                <span style={{fontSize:'8px',fontWeight:'700',
                                  background:'#fee2e2',color:'#dc2626',
                                  padding:'1px 6px',borderRadius:'3px'}}>DISABLED</span>
                              </div>
                              <div style={{fontSize:'9px',color:'#9ca3af',marginBottom:'6px'}}>
                                Station removed from schedule by research leadership
                              </div>
                              {canManageStations(selectedUser)&&(
                                <button onClick={()=>toggleStation(b.station)}
                                  style={{width:'100%',padding:'4px',borderRadius:'6px',
                                    border:'1px solid #86efac',background:'#f0fdf4',
                                    color:'#16a34a',cursor:'pointer',fontSize:'9px',
                                    fontWeight:'700'}}>
                                  Re-enable Station
                                </button>
                              )}
                            </div>
                          ) : (
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
                            {canManageStations(selectedUser)&&(
                              <button onClick={()=>toggleStation(b.station)}
                                style={{marginTop:'4px',width:'100%',padding:'3px',
                                  borderRadius:'4px',border:'1px solid #fca5a5',
                                  background:'#fef2f2',color:'#dc2626',cursor:'pointer',
                                  fontSize:'8px',fontWeight:'700'}}>
                                Disable Station
                              </button>
                            )}
                          </div>
                          )}
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
              Object.entries(vacationMap).forEach(([sid,ranges]:any[])=>{
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

        {/* ── CELL UPTIME TAB — leads only ─────────────────────────────────── */}
        {tab==='events' && isLead && (
          <div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',
              marginBottom:'12px'}}>
              <div style={{fontSize:'13px',fontWeight:'700',color:'#374151'}}>
                Cell Uptime — Shift {currentUser?.shift}
              </div>
              <button onClick={async()=>{
                const sb=getSupabase(); if(!sb) return
                const {data}=await sb.from('punch_events').select('*').eq('shift_date',getToday()).order('logged_at',{ascending:true})
                if(data) setTodayEvents(data)
              }} style={{padding:'5px 12px',borderRadius:'6px',border:'1px solid #e5e7eb',
                background:'white',cursor:'pointer',fontSize:'11px',color:'#6b7280',fontWeight:'600'}}>
                ↻ Refresh
              </button>
            </div>

            {(()=>{
              // Only show DCs and DAs from this lead's shift
              const myShiftPool = pool.filter((m:any)=>
                (m.role==='DC'||m.role==='DA')&&!isGuest(m.id)&&!isSuperAdmin(m.id)&&m.role!=='ANALYTICS_ADMIN'
              )
              const collectionEvents = ['at_station','transition']
              const overheadEvents = ['waiting_station','waiting_station_down','break','car_move','bathroom','lunch','adhoc_task']

              if (todayEvents.length===0) return (
                <div style={{textAlign:'center',padding:'32px',color:'#9ca3af',fontSize:'13px',
                  background:'white',borderRadius:'12px',border:'1px solid #e5e7eb'}}>
                  No events logged yet today. Ask your team to punch in.
                </div>
              )

              return (
                <div>
                  {myShiftPool.map((person:any)=>{
                    const personEvents = todayEvents
                      .filter((e:any)=>e.staff_id===person.id)
                      .sort((a:any,b:any)=>new Date(a.logged_at).getTime()-new Date(b.logged_at).getTime())

                    if (!personEvents.length) return (
                      <div key={person.id} style={{display:'flex',alignItems:'center',gap:'10px',
                        padding:'10px 12px',borderRadius:'8px',background:'#f9fafb',
                        border:'1px solid #e5e7eb',marginBottom:'6px',opacity:0.5}}>
                        <div style={{width:'28px',height:'28px',borderRadius:'50%',
                          display:'flex',alignItems:'center',justifyContent:'center',
                          fontSize:'9px',fontWeight:'700',
                          background:COLORS[person.role]?.[0]||'#f3f4f6',
                          color:COLORS[person.role]?.[1]||'#374151'}}>
                          {person.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:'12px',fontWeight:'600'}}>{person.name}</div>
                          <div style={{fontSize:'10px',color:'#9ca3af'}}>{person.role}{person.pod?' · Pod '+person.pod:''} · Not punched in</div>
                        </div>
                      </div>
                    )

                    // Calculate durations
                    const eventDurations: any = {}
                    personEvents.forEach((e:any,i:number)=>{
                      const next = personEvents[i+1]
                      const dur = next
                        ? (new Date(next.logged_at).getTime()-new Date(e.logged_at).getTime())/60000
                        : (Date.now()-new Date(e.logged_at).getTime())/60000
                      eventDurations[e.event_type] = (eventDurations[e.event_type]||0)+dur
                    })

                    const totalMins:number = Object.values(eventDurations).reduce((a:any,b:any)=>a+b,0) as number
                    const collectionMins:number = Object.entries(eventDurations)
                      .filter(([k])=>collectionEvents.includes(k))
                      .reduce((a:number,[,v]:any[])=>a+(v as number),0)
                    const overheadMins:number = Object.entries(eventDurations)
                      .filter(([k])=>overheadEvents.includes(k))
                      .reduce((a:number,[,v]:any[])=>a+(v as number),0)
                    const collectionPct = totalMins>0?Math.round(collectionMins/totalMins*100):0
                    const lastEvent = personEvents[personEvents.length-1]
                    const lastInfo = getPunchInfo(lastEvent.event_type)
                    const isPunchedOut = lastEvent.event_type==='punch_out'

                    return (
                      <div key={person.id} style={{background:'white',borderRadius:'12px',
                        border:'1px solid #e5e7eb',padding:'12px',marginBottom:'8px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                          <div style={{width:'32px',height:'32px',borderRadius:'50%',
                            display:'flex',alignItems:'center',justifyContent:'center',
                            fontSize:'10px',fontWeight:'700',flexShrink:0,
                            background:COLORS[person.role]?.[0]||'#f3f4f6',
                            color:COLORS[person.role]?.[1]||'#374151'}}>
                            {person.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:'13px',fontWeight:'700'}}>{person.name}</div>
                            <div style={{fontSize:'10px',color:'#6b7280'}}>{person.role}{person.pod?' · Pod '+person.pod:''}</div>
                          </div>
                          <div style={{textAlign:'right'}}>
                            <div style={{fontSize:'13px',fontWeight:'800',
                              color:collectionPct>=50?'#16a34a':collectionPct>=25?'#f59e0b':'#dc2626'}}>
                              {collectionPct}% on cell
                            </div>
                            <div style={{fontSize:'10px',color:'#6b7280'}}>{Math.round(totalMins)}m total</div>
                          </div>
                        </div>

                        {/* Current status */}
                        {!isPunchedOut && (
                          <div style={{display:'flex',alignItems:'center',gap:'6px',
                            padding:'5px 8px',borderRadius:'6px',marginBottom:'8px',
                            background:lastInfo.bg,border:`1px solid ${lastInfo.color}33`}}>
                            <span style={{fontSize:'14px'}}>{lastInfo.icon}</span>
                            <span style={{fontSize:'11px',fontWeight:'600',color:lastInfo.color}}>
                              Now: {lastInfo.label}
                            </span>
                            <span style={{fontSize:'10px',color:'#6b7280',marginLeft:'auto'}}>
                              since {new Date(lastEvent.logged_at).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}
                            </span>
                          </div>
                        )}

                        {/* Time bar */}
                        <div style={{display:'flex',height:'14px',borderRadius:'6px',overflow:'hidden',marginBottom:'6px'}}>
                          {Object.entries(eventDurations).filter(([,v]:any[])=>(v as number)>0).map(([evt,mins]:any[])=>{
                            const info=getPunchInfo(evt)
                            const pct=totalMins>0?((mins as number)/totalMins*100):0
                            return pct>0?<div key={evt} title={`${info.label}: ${Math.round(mins as number)}m`}
                              style={{width:`${pct}%`,background:info.color}}/>:null
                          })}
                        </div>

                        {/* Event breakdown */}
                        <div style={{display:'flex',flexWrap:'wrap',gap:'4px'}}>
                          {Object.entries(eventDurations).filter(([,v]:any[])=>(v as number)>1).sort((a:any,b:any)=>b[1]-a[1]).map(([evt,mins]:any[])=>{
                            const info=getPunchInfo(evt)
                            return (
                              <span key={evt} style={{fontSize:'10px',padding:'2px 6px',borderRadius:'4px',
                                background:info.bg,color:info.color,fontWeight:'600'}}>
                                {info.icon} {info.label}: {Math.round(mins as number)}m
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
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
                            const sts=rot?.[pod] 
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

        {/* ── ADHOC TASKS TAB ─────────────────────────────────────────────── */}
        {tab==='adhoc' && (
          <div>
            {/* Pending confirmation banner for leads */}
            {adhocPendingConfirm && isLead && (
              <div style={{padding:'14px',background:'#7c3aed',color:'white',borderRadius:'12px',
                marginBottom:'12px',border:'2px solid #6d28d9'}}>
                <div style={{fontWeight:'800',fontSize:'14px',marginBottom:'6px'}}>
                  &#128276; Adhoc Task Confirmation Required
                </div>
                <div style={{fontSize:'13px',marginBottom:'8px'}}>
                  <strong>{ALL_PEOPLE.find(p=>p.id===adhocPendingConfirm.staff_id)?.name}</strong> has requested an adhoc task:
                  <br/><strong>{adhocPendingConfirm.task_name}</strong>
                  {adhocPendingConfirm.description && <span> — {adhocPendingConfirm.description}</span>}
                  <br/>Start: {adhocPendingConfirm.start_date} {adhocPendingConfirm.start_time}
                  {adhocPendingConfirm.end_date && <span> · End: {adhocPendingConfirm.end_date} {adhocPendingConfirm.end_time}</span>}
                </div>
                <div style={{display:'flex',gap:'8px'}}>
                  <button onClick={async()=>{
                    const sb = getSupabase(); if (!sb) return
                    await sb.from('adhoc_tasks').update({
                      status:'active', confirmed_by:selectedUser||'',
                      confirmed_at:new Date().toISOString()
                    }).eq('id',adhocPendingConfirm.id)
                    const {data} = await sb.from('adhoc_tasks').select('*').order('submitted_at',{ascending:false})
                    if (data) setAdhocTasks(data)
                    setAdhocPendingConfirm(null)
                  }} style={{flex:1,padding:'8px',borderRadius:'8px',border:'none',
                    background:'#22c55e',color:'white',cursor:'pointer',fontWeight:'700',fontSize:'13px'}}>
                    ✓ Confirm & Activate
                  </button>
                  <button onClick={async()=>{
                    const sb = getSupabase(); if (!sb) return
                    await sb.from('adhoc_tasks').update({status:'cancelled'}).eq('id',adhocPendingConfirm.id)
                    const {data} = await sb.from('adhoc_tasks').select('*').order('submitted_at',{ascending:false})
                    if (data) setAdhocTasks(data)
                    setAdhocPendingConfirm(null)
                  }} style={{flex:1,padding:'8px',borderRadius:'8px',border:'none',
                    background:'#ef4444',color:'white',cursor:'pointer',fontWeight:'700',fontSize:'13px'}}>
                    ✗ Reject
                  </button>
                </div>
              </div>
            )}

            {/* DC pending confirmation notice */}
            {adhocPendingConfirm && !isLead && adhocPendingConfirm.staff_id===selectedUser && (
              <div style={{padding:'12px 14px',background:'#fef3c7',borderRadius:'10px',
                border:'1px solid #fde68a',marginBottom:'12px',fontSize:'13px',color:'#92400e'}}>
                &#9203; Your adhoc task <strong>{adhocPendingConfirm.task_name}</strong> is pending lead confirmation.
                Please verify the start time with your lead before beginning.
              </div>
            )}

            {/* Add new adhoc task */}
            {(isLead || currentUser?.role==='DC' || currentUser?.role==='DA' || currentUser?.role==='SUPER_ADMIN' || currentUser?.role==='ANALYTICS_ADMIN') && (
              <div style={{background:'white',borderRadius:'12px',border:'1px solid #e5e7eb',
                padding:'14px',marginBottom:'12px'}}>
                <button onClick={()=>setShowAdhocForm(v=>!v)}
                  style={{width:'100%',padding:'10px',borderRadius:'8px',border:'none',
                    background:'#7c3aed',color:'white',fontWeight:'700',fontSize:'13px',cursor:'pointer'}}>
                  {showAdhocForm ? 'Cancel' : '+ New Adhoc Task'}
                </button>
                {showAdhocForm && (
                  <div style={{marginTop:'12px'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'8px'}}>
                      <div style={{gridColumn:'1/-1'}}>
                        {(isLead||isSuperAdmin(selectedUser)) ? (
                          <>
                            <div style={{fontSize:'11px',color:'#6b7280',marginBottom:'3px'}}>Assign to</div>
                            <select value={adhocStaffId} onChange={e=>setAdhocStaffId(e.target.value)}
                              style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #e5e7eb',fontSize:'12px'}}>
                              <option value=''>- select person -</option>
                              {ALL_PEOPLE.filter(p=>!isGuest(p.id)&&p.role!=='ANALYTICS_ADMIN'&&!isSuperAdmin(p.id)).map(p=>(
                                <option key={p.id} value={p.id}>{p.name} — {p.role} Shift {p.shift}</option>
                              ))}
                            </select>
                          </>
                        ) : (
                          <>
                            <div style={{fontSize:'11px',color:'#6b7280',marginBottom:'3px'}}>Assigned to</div>
                            <div style={{padding:'8px',borderRadius:'8px',border:'1px solid #e5e7eb',
                              fontSize:'12px',background:'#f9fafb',color:'#374151',fontWeight:'600'}}>
                              {currentUser?.name} (you)
                            </div>
                          </>
                        )}
                      </div>
                      <div style={{gridColumn:'1/-1'}}>
                        <div style={{fontSize:'11px',color:'#6b7280',marginBottom:'3px'}}>Task name</div>
                        <input value={adhocName} onChange={e=>setAdhocName(e.target.value)}
                          placeholder="e.g. Special data collection run"
                          style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #e5e7eb',fontSize:'12px'}}/>
                      </div>
                      <div style={{gridColumn:'1/-1'}}>
                        <div style={{fontSize:'11px',color:'#6b7280',marginBottom:'3px'}}>Description (optional)</div>
                        <input value={adhocDesc} onChange={e=>setAdhocDesc(e.target.value)}
                          placeholder="Additional details..."
                          style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #e5e7eb',fontSize:'12px'}}/>
                      </div>
                      <div>
                        <div style={{fontSize:'11px',color:'#6b7280',marginBottom:'3px'}}>Start date</div>
                        <input type="date" value={adhocStartDate} onChange={e=>setAdhocStartDate(e.target.value)}
                          style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #e5e7eb',fontSize:'12px'}}/>
                      </div>
                      <div>
                        <div style={{fontSize:'11px',color:'#6b7280',marginBottom:'3px'}}>Start time</div>
                        <input type="time" value={adhocStartTime} onChange={e=>setAdhocStartTime(e.target.value)}
                          style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #e5e7eb',fontSize:'12px'}}/>
                      </div>
                      <div>
                        <div style={{fontSize:'11px',color:'#6b7280',marginBottom:'3px'}}>End date (optional)</div>
                        <input type="date" value={adhocEndDate} onChange={e=>setAdhocEndDate(e.target.value)}
                          style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #e5e7eb',fontSize:'12px'}}/>
                      </div>
                      <div>
                        <div style={{fontSize:'11px',color:'#6b7280',marginBottom:'3px'}}>End time (optional)</div>
                        <input type="time" value={adhocEndTime} onChange={e=>setAdhocEndTime(e.target.value)}
                          style={{width:'100%',padding:'8px',borderRadius:'8px',border:'1px solid #e5e7eb',fontSize:'12px'}}/>
                      </div>
                    </div>
                    {adhocMsg&&<div style={{fontSize:'12px',textAlign:'center',marginBottom:'8px',
                      color:adhocMsg.includes('ok')||adhocMsg.includes('submitted')?'#16a34a':'#dc2626'}}>{adhocMsg}</div>}
                    <button onClick={async()=>{
                      const assignTarget = (isLead||isSuperAdmin(selectedUser)) ? adhocStaffId : selectedUser||''
                      if (!assignTarget||!adhocName||!adhocStartDate||!adhocStartTime){
                        setAdhocMsg('Fill in person, task name, start date and time'); return
                      }
                      const assignedPerson = ALL_PEOPLE.find(p=>p.id===assignTarget)
                      const isDC = assignedPerson?.role==='DC'||assignedPerson?.role==='DA'
                      const submitterIsDC = currentUser?.role==='DC'||currentUser?.role==='DA'
                      // DC assigning themselves must confirm with lead first
                      if (submitterIsDC) {
                        if (!window.confirm('Please confirm with your shift lead before submitting this adhoc task. Continue?')) return
                      }
                      const sb = getSupabase(); if (!sb){setAdhocMsg('Not connected to database');return}
                      const status = isLead||isSuperAdmin(selectedUser) ? 'active' : 'pending_confirmation'
                      const personShift = assignedPerson?.shift || currentUser?.shift || shift
                      const {data:newTask, error:insertError} = await sb.from('adhoc_tasks').insert({
                        staff_id:assignTarget, task_name:adhocName, description:adhocDesc||'',
                        start_date:adhocStartDate, start_time:adhocStartTime,
                        end_date:adhocEndDate||null, end_time:adhocEndTime||null,
                        submitted_by:selectedUser||'', shift:personShift,
                        status, confirmed_by:isLead||isSuperAdmin(selectedUser)?selectedUser||'':null,
                        confirmed_at:isLead||isSuperAdmin(selectedUser)?new Date().toISOString():null
                      }).select().single()
                      if (insertError){setAdhocMsg('Error: '+insertError.message);return}
                      if (newTask && status==='pending_confirmation') setAdhocPendingConfirm(newTask)
                      const {data} = await sb.from('adhoc_tasks').select('*').order('submitted_at',{ascending:false})
                      if (data) setAdhocTasks(data)
                      setAdhocMsg(status==='active'?'Adhoc task created ok!':'Submitted — pending lead confirmation')
                      setTimeout(()=>{setShowAdhocForm(false);setAdhocName('');setAdhocDesc('');setAdhocStartDate('');setAdhocStartTime('');setAdhocEndDate('');setAdhocEndTime('');setAdhocStaffId('');setAdhocMsg('')},2000)
                    }} style={{width:'100%',padding:'10px',borderRadius:'8px',border:'none',
                      background:'#7c3aed',color:'white',fontWeight:'700',fontSize:'13px',cursor:'pointer'}}>
                      Submit Adhoc Task
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Adhoc task list */}
            <div style={{background:'white',borderRadius:'12px',border:'1px solid #e5e7eb',padding:'16px'}}>
              <div style={{fontSize:'14px',fontWeight:'700',marginBottom:'4px'}}>Adhoc Tasks</div>
              <div style={{fontSize:'12px',color:'#6b7280',marginBottom:'12px'}}>All active and pending tasks</div>
              {adhocTasks.length===0?(
                <div style={{textAlign:'center',padding:'32px',color:'#9ca3af',fontSize:'13px'}}>
                  No adhoc tasks yet
                </div>
              ):adhocTasks.map((task:any)=>{
                const person = ALL_PEOPLE.find(p=>p.id===task.staff_id)
                const confirmer = task.confirmed_by ? ALL_PEOPLE.find(p=>p.id===task.confirmed_by) : null
                const statusColor = task.status==='active'?'#16a34a':task.status==='pending_confirmation'?'#f59e0b':task.status==='completed'?'#3b82f6':'#dc2626'
                const statusBg = task.status==='active'?'#dcfce7':task.status==='pending_confirmation'?'#fef3c7':task.status==='completed'?'#eff6ff':'#fee2e2'
                return (
                  <div key={task.id} style={{padding:'12px',borderRadius:'8px',background:'#f9fafb',
                    border:'1px solid #e5e7eb',marginBottom:'8px'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'6px'}}>
                      <div style={{fontWeight:'700',fontSize:'13px'}}>{task.task_name}</div>
                      <span style={{padding:'2px 8px',borderRadius:'99px',fontSize:'10px',fontWeight:'700',
                        background:statusBg,color:statusColor,fontFamily:'monospace',textTransform:'uppercase'}}>
                        {task.status.replace('_',' ')}
                      </span>
                    </div>
                    <div style={{fontSize:'12px',color:'#374151',marginBottom:'4px'}}>
                      <strong>Assigned to:</strong> {person?.name||task.staff_id} · Shift {task.shift}
                    </div>
                    {task.description&&<div style={{fontSize:'11px',color:'#6b7280',marginBottom:'4px'}}>{task.description}</div>}
                    <div style={{fontSize:'11px',color:'#6b7280',fontFamily:'monospace'}}>
                      Start: {task.start_date} {task.start_time}
                      {task.end_date&&<span> · End: {task.end_date} {task.end_time}</span>}
                    </div>
                    <div style={{fontSize:'10px',color:'#9ca3af',marginTop:'4px'}}>
                      Submitted by {ALL_PEOPLE.find(p=>p.id===task.submitted_by)?.name||task.submitted_by} · {new Date(task.submitted_at).toLocaleString()}
                      {confirmer&&<span> · Confirmed by {confirmer.name} · {new Date(task.confirmed_at).toLocaleString()}</span>}
                    </div>
                    {/* Lead/admin can mark complete or cancel */}
                    {(isLead||isSuperAdmin(selectedUser))&&task.status==='active'&&(
                      <div style={{display:'flex',gap:'6px',marginTop:'8px'}}>
                        <button onClick={async()=>{
                          const sb=getSupabase();if(!sb)return
                          await sb.from('adhoc_tasks').update({status:'completed',end_date:getToday(),end_time:new Date().toTimeString().slice(0,5)}).eq('id',task.id)
                          const {data}=await sb.from('adhoc_tasks').select('*').order('submitted_at',{ascending:false})
                          if(data)setAdhocTasks(data)
                        }} style={{flex:1,padding:'5px',borderRadius:'6px',border:'1px solid #86efac',
                          background:'#f0fdf4',color:'#16a34a',cursor:'pointer',fontSize:'11px',fontWeight:'600'}}>
                          Mark Complete
                        </button>
                        <button onClick={async()=>{
                          const sb=getSupabase();if(!sb)return
                          await sb.from('adhoc_tasks').update({status:'cancelled'}).eq('id',task.id)
                          const {data}=await sb.from('adhoc_tasks').select('*').order('submitted_at',{ascending:false})
                          if(data)setAdhocTasks(data)
                        }} style={{flex:1,padding:'5px',borderRadius:'6px',border:'1px solid #fca5a5',
                          background:'#fef2f2',color:'#dc2626',cursor:'pointer',fontSize:'11px',fontWeight:'600'}}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── ANALYTICS TAB — Yban, James, Charlene only ───────────────────── */}
        {tab==='analytics' && isAnalyticsAdmin(selectedUser) && (
          <div>
            {/* Date range toggle */}
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px',
              padding:'10px 14px',background:'white',borderRadius:'10px',border:'1px solid #e5e7eb'}}>
              <div style={{display:'flex',gap:'4px'}}>
                <button onClick={()=>setAnalyticsDate('today')}
                  style={{padding:'5px 12px',borderRadius:'6px',border:'1px solid',fontSize:'11px',
                    fontWeight:'600',cursor:'pointer',
                    borderColor:analyticsDate==='today'?'#059669':'#e5e7eb',
                    background:analyticsDate==='today'?'#d1fae5':'white',
                    color:analyticsDate==='today'?'#059669':'#374151'}}>Today</button>
                <button onClick={()=>setAnalyticsDate('week')}
                  style={{padding:'5px 12px',borderRadius:'6px',border:'1px solid',fontSize:'11px',
                    fontWeight:'600',cursor:'pointer',
                    borderColor:analyticsDate==='week'?'#059669':'#e5e7eb',
                    background:analyticsDate==='week'?'#d1fae5':'white',
                    color:analyticsDate==='week'?'#059669':'#374151'}}>Week</button>
              </div>
              {analyticsDate==='week' && (
                <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                  <button onClick={()=>setAnalyticsWeekOffset(w=>w-1)}
                    style={{padding:'4px 8px',borderRadius:'6px',border:'1px solid #e5e7eb',
                      background:'white',cursor:'pointer',fontSize:'12px'}}>←</button>
                  <span style={{fontSize:'11px',color:'#374151',fontWeight:'600'}}>
                    {(()=>{
                      const d = new Date(); d.setDate(d.getDate()+analyticsWeekOffset*7)
                      const start = new Date(d); start.setDate(d.getDate()-d.getDay())
                      const end = new Date(start); end.setDate(start.getDate()+6)
                      return start.toLocaleDateString('en-US',{month:'short',day:'numeric'})+' – '+end.toLocaleDateString('en-US',{month:'short',day:'numeric'})
                    })()}
                  </span>
                  <button onClick={()=>setAnalyticsWeekOffset(w=>Math.min(0,w+1))}
                    style={{padding:'4px 8px',borderRadius:'6px',border:'1px solid #e5e7eb',
                      background:'white',cursor:'pointer',fontSize:'12px'}}>→</button>
                </div>
              )}
              {/* Export buttons */}
              <div style={{marginLeft:'auto',display:'flex',gap:'6px'}}>
                <button onClick={()=>{
                  const rows = [['Name','Event','Station','Date','Time','Auto']]
                  todayEvents.forEach((e:any)=>{
                    const p = ALL_PEOPLE.find(x=>x.id===e.staff_id)
                    rows.push([p?.name||e.staff_id, getPunchInfo(e.event_type).label,
                      e.station_id||'', e.shift_date,
                      new Date(e.logged_at).toLocaleTimeString(), e.auto_logged?'Yes':'No'])
                  })
                  const csv = rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n')
                  const blob = new Blob([csv],{type:'text/csv'})
                  const a = document.createElement('a'); a.href=URL.createObjectURL(blob)
                  a.download=`data-engine-events-${getToday()}.csv`; a.click()
                }} style={{padding:'5px 10px',borderRadius:'6px',border:'1px solid #e5e7eb',
                  background:'white',cursor:'pointer',fontSize:'11px',fontWeight:'600',color:'#374151'}}>
                  ⬇ CSV
                </button>
                <button onClick={async()=>{
                  // Excel export using SheetJS-style CSV with BOM for Excel compatibility
                  const rows = [['Name','Role','Shift','Event','Station','Date','Time','Duration (min)','Auto-logged']]
                  const sorted = [...todayEvents].sort((a,b)=>a.staff_id.localeCompare(b.staff_id)||a.logged_at.localeCompare(b.logged_at))
                  sorted.forEach((e:any,i:number)=>{
                    const p = ALL_PEOPLE.find(x=>x.id===e.staff_id)
                    const nextEvent = sorted[i+1]
                    const dur = nextEvent && nextEvent.staff_id===e.staff_id
                      ? Math.round((new Date(nextEvent.logged_at).getTime()-new Date(e.logged_at).getTime())/60000)
                      : ''
                    rows.push([p?.name||e.staff_id, p?.role||'', String(p?.shift||''),
                      getPunchInfo(e.event_type).label, e.station_id||'', e.shift_date,
                      new Date(e.logged_at).toLocaleTimeString(), String(dur), e.auto_logged?'Yes':'No'])
                  })
                  const csv = '\uFEFF'+rows.map(r=>r.join('\t')).join('\n')
                  const blob = new Blob([csv],{type:'application/vnd.ms-excel'})
                  const a = document.createElement('a'); a.href=URL.createObjectURL(blob)
                  a.download=`data-engine-events-${getToday()}.xls`; a.click()
                }} style={{padding:'5px 10px',borderRadius:'6px',border:'1px solid #e5e7eb',
                  background:'white',cursor:'pointer',fontSize:'11px',fontWeight:'600',color:'#374151'}}>
                  ⬇ Excel
                </button>
              </div>
            </div>

            <div style={{display:'flex',gap:'6px',marginBottom:'12px',flexWrap:'wrap'}}>
              {(['events','hours','timeoff','logins','stations'] as const).map(t=>(
                <button key={t} onClick={()=>setAnalyticsTab(t)}
                  style={{padding:'7px 14px',borderRadius:'8px',cursor:'pointer',
                    border:'1px solid',fontWeight:'600',fontSize:'11px',textTransform:'uppercase',
                    borderColor:analyticsTab===t?'#059669':'#e5e7eb',
                    background:analyticsTab===t?'#d1fae5':'white',
                    color:analyticsTab===t?'#059669':'#374151'}}>
                  {analyticsTabLabels[t]||t}
                </button>
              ))}
            </div>

            {/* EVENTS BREAKDOWN */}
            {analyticsTab==='events' && (
              <div>
                <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'8px'}}>
                  <button onClick={async()=>{
                    const sb=getSupabase(); if(!sb) return
                    const {data}=await sb.from('punch_events').select('*').eq('shift_date',getToday()).order('logged_at',{ascending:true})
                    if(data) setTodayEvents(data)
                  }} style={{padding:'5px 12px',borderRadius:'6px',border:'1px solid #e5e7eb',
                    background:'white',cursor:'pointer',fontSize:'11px',color:'#6b7280',fontWeight:'600'}}>
                    ↻ Refresh
                  </button>
                  {(selectedUser==='yban'||selectedUser==='yban2') && (
                    <button onClick={async()=>{
                      if (!window.confirm('Delete ALL punch events for today? This cannot be undone.')) return
                      const sb=getSupabase(); if(!sb) return
                      await sb.from('punch_events').delete().eq('shift_date',getToday())
                      setTodayEvents([])
                      setLiveStatus({})
                    }} style={{padding:'5px 12px',borderRadius:'6px',border:'1px solid #fca5a5',
                      background:'#fef2f2',cursor:'pointer',fontSize:'11px',color:'#dc2626',fontWeight:'600'}}>
                      🗑 Reset Today
                    </button>
                  )}
                </div>
                {todayEvents.length===0 ? (
                  <div style={{textAlign:'center',padding:'32px',color:'#9ca3af',fontSize:'13px'}}>
                    No events logged today yet. Hit Refresh if you expect data.
                  </div>
                ) : (
                <div>
                {/* Per shift breakdown */}
                {[1,2].map(s=>{
                  const shiftPool = ROSTER[s===1?'s1':'s2'].filter((m:any)=>!isGuest(m.id)&&m.role!=='ANALYTICS_ADMIN'&&!isSuperAdmin(m.id))
                  const shiftEvents = todayEvents.filter((e:any)=>shiftPool.find((p:any)=>p.id===e.staff_id))
                  if (!shiftEvents.length) return (
                    <div key={s} style={{marginBottom:'12px',padding:'10px 14px',background:'white',
                      borderRadius:'10px',border:'1px solid #e5e7eb',color:'#9ca3af',fontSize:'12px'}}>
                      Shift {s} — No events logged yet
                    </div>
                  )

                  // Build per-person event durations correctly
                  // Group events by person first, then calculate durations within each person's timeline
                  const byPerson: any = {}
                  shiftPool.forEach((p:any)=>{ byPerson[p.id]={} })

                  const eventsByPerson: any = {}
                  shiftEvents.forEach((e:any)=>{
                    if (!eventsByPerson[e.staff_id]) eventsByPerson[e.staff_id] = []
                    eventsByPerson[e.staff_id].push(e)
                  })

                  Object.entries(eventsByPerson).forEach(([staffId, events]:any)=>{
                    events.forEach((e:any, i:number)=>{
                      const next = events[i+1]
                      if (!byPerson[staffId]) byPerson[staffId] = {}
                      const dur = next
                        ? (new Date(next.logged_at).getTime()-new Date(e.logged_at).getTime())/60000
                        : (Date.now()-new Date(e.logged_at).getTime())/60000 // ongoing event
                      byPerson[staffId][e.event_type] = (byPerson[staffId][e.event_type]||0)+dur
                    })
                  })

                  // Team summary
                  const teamSummary: Record<string,number> = {}
                  Object.values(byPerson).forEach((personEvents:any)=>{
                    Object.entries(personEvents).forEach(([evt,mins]:any[])=>{
                      teamSummary[evt]=(teamSummary[evt]||0)+(mins as number)
                    })
                  })
                  const collectionEvents = ['at_station','transition']
                  const overheadEvents = ['waiting_station','waiting_station_down','break','car_move','bathroom','lunch','adhoc_task']
                  const totalCollectionMins = Object.entries(teamSummary).filter(([k])=>collectionEvents.includes(k)).reduce((a:number,[,v]:any[])=>a+(v as number),0)
                  const totalOverheadMins = Object.entries(teamSummary).filter(([k])=>overheadEvents.includes(k)).reduce((a:number,[,v]:any[])=>a+(v as number),0)
                  const totalMins = totalCollectionMins+totalOverheadMins
                  const collectionPct = totalMins>0?Math.round(totalCollectionMins/totalMins*100):0

                  return (
                    <div key={s} style={{marginBottom:'16px'}}>
                      <div style={{fontWeight:'700',fontSize:'14px',marginBottom:'8px',color:'#059669',
                        padding:'8px 12px',background:'#d1fae5',borderRadius:'8px',
                        display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <span>Shift {s} — Event Breakdown</span>
                        <span style={{fontSize:'12px'}}>
                          Collection: {Math.round(totalCollectionMins)}m ({collectionPct}%) · Overhead: {Math.round(totalOverheadMins)}m ({100-collectionPct}%)
                        </span>
                      </div>

                      {/* Team summary bar */}
                      <div style={{background:'white',borderRadius:'10px',border:'1px solid #e5e7eb',
                        padding:'12px',marginBottom:'10px'}}>
                        <div style={{fontSize:'11px',fontWeight:'600',color:'#6b7280',marginBottom:'8px',
                          textTransform:'uppercase',letterSpacing:'0.05em'}}>Team Summary</div>
                        <div style={{display:'flex',height:'24px',borderRadius:'6px',overflow:'hidden',marginBottom:'8px'}}>
                          {Object.entries(teamSummary).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).map(([evt,mins])=>{
                            const info = getPunchInfo(evt)
                            const pct = totalMins>0?(mins/totalMins*100):0
                            return pct>1?(
                              <div key={evt} style={{width:`${pct}%`,background:info.color,
                                display:'flex',alignItems:'center',justifyContent:'center',
                                fontSize:'8px',color:'white',fontWeight:'700',overflow:'hidden'}}>
                                {pct>5?`${Math.round(pct)}%`:''}
                              </div>
                            ):null
                          })}
                        </div>
                        <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                          {Object.entries(teamSummary).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).map(([evt,mins])=>{
                            const info = getPunchInfo(evt)
                            return (
                              <span key={evt} style={{fontSize:'10px',padding:'2px 6px',borderRadius:'4px',
                                background:info.bg,color:info.color,fontWeight:'600'}}>
                                {info.icon} {info.label}: {Math.round(mins)}m
                              </span>
                            )
                          })}
                        </div>
                      </div>

                      {/* Per person */}
                      {shiftPool.filter((p:any)=>byPerson[p.id]&&Object.keys(byPerson[p.id]).length>0).map((person:any)=>{
                        const events:any = byPerson[person.id]
                        const personTotal:number = Object.values(events).reduce((a:any,b:any)=>a+b,0) as number
                        const personCollection:number = Object.entries(events).filter(([k])=>collectionEvents.includes(k)).reduce((a:number,[,v]:any[])=>a+(v as number),0)
                        const personPct = personTotal>0?Math.round(personCollection/personTotal*100):0
                        return (
                          <div key={person.id} style={{background:'white',borderRadius:'10px',
                            border:'1px solid #e5e7eb',padding:'12px',marginBottom:'6px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                              <div style={{width:'28px',height:'28px',borderRadius:'50%',
                                display:'flex',alignItems:'center',justifyContent:'center',
                                fontSize:'9px',fontWeight:'700',
                                background:COLORS[person.role]?.[0]||'#f3f4f6',
                                color:COLORS[person.role]?.[1]||'#374151'}}>
                                {person.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                              </div>
                              <div style={{flex:1}}>
                                <div style={{fontSize:'12px',fontWeight:'700'}}>{person.name}</div>
                                <div style={{fontSize:'10px',color:'#6b7280'}}>{person.role} · Pod {person.pod||'—'}</div>
                              </div>
                              <div style={{textAlign:'right'}}>
                                <div style={{fontSize:'12px',fontWeight:'700',color:'#059669'}}>
                                  {personPct}% collecting
                                </div>
                                <div style={{fontSize:'10px',color:'#6b7280'}}>{Math.round(personTotal)}m total</div>
                              </div>
                            </div>
                            <div style={{display:'flex',height:'12px',borderRadius:'4px',overflow:'hidden',marginBottom:'6px'}}>
                              {Object.entries(events).filter(([,v]:any[])=>(v as number)>0).map(([evt,mins]:any[])=>{
                                const info=getPunchInfo(evt)
                                const pct=personTotal>0?(mins/personTotal*100):0
                                return pct>0?<div key={evt} style={{width:`${pct}%`,background:info.color}}/>:null
                              })}
                            </div>
                            <div style={{display:'flex',flexWrap:'wrap',gap:'4px'}}>
                              {Object.entries(events).filter(([,v]:any[])=>(v as number)>0).sort((a:any,b:any)=>b[1]-a[1]).map(([evt,mins]:any[])=>{
                                const info=getPunchInfo(evt)
                                return (
                                  <span key={evt} style={{fontSize:'9px',padding:'1px 5px',borderRadius:'3px',
                                    background:info.bg,color:info.color,fontWeight:'600'}}>
                                    {info.icon} {Math.round(mins)}m
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
                </div>
                )}
              </div>
            )}

            {/* STATION HOURS PER PERSON PER SHIFT */}
            {analyticsTab==='hours' && (
              <div>
                {[1,2].map(s=>{
                  const shiftPool = ROSTER[s===1?'s1':'s2']
                  const rot = s===1?ROTATION_S1:ROTATION_S2
                  const pods = s===1?['P1','P2','P3','P4']:['PA','PB','PC','PD']
                  const stationHours: Record<string,Record<string,number>> = {}
                  pods.forEach(pod=>{
                    const members = shiftPool.filter(m=>m.pod===pod&&m.role==='DC')
                    members.forEach(m=>{
                      if (!stationHours[m.name]) stationHours[m.name]={}
                      Object.values(rot).forEach((dayRot:any)=>{
                        const ps = dayRot[pod] 
                        if (!ps) return
                        ps.forEach((stId,idx)=>{
                          if (!stationHours[m.name][stId]) stationHours[m.name][stId]=0
                          const hrs = s===1?(idx===2?0.5:2):(idx===0?2:idx===1?1:2)
                          stationHours[m.name][stId] += hrs/2 // split between 2 pod members
                        })
                      })
                    })
                  })
                  return (
                    <div key={s} style={{background:'white',borderRadius:'12px',border:'1px solid #e5e7eb',
                      padding:'16px',marginBottom:'12px'}}>
                      <div style={{fontWeight:'700',fontSize:'14px',marginBottom:'12px',color:'#059669'}}>
                        Shift {s} — Station Hours per Person (per 8-day cycle)
                      </div>
                      <div style={{overflowX:'auto'}}>
                        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px'}}>
                          <thead>
                            <tr style={{background:'#f9fafb'}}>
                              <th style={{padding:'8px',textAlign:'left',border:'1px solid #e5e7eb',color:'#6b7280'}}>Person</th>
                              {Object.keys(STATION_INFO).filter(id=>STATION_INFO[id].shift===(s===1?'s1':'s2')).map(id=>(
                                <th key={id} style={{padding:'8px',textAlign:'center',border:'1px solid #e5e7eb',
                                  color:STATION_INFO[id].dot,fontWeight:'700'}}>
                                  {STATION_INFO[id].label}
                                </th>
                              ))}
                              <th style={{padding:'8px',textAlign:'center',border:'1px solid #e5e7eb',fontWeight:'700'}}>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(stationHours).map(([name,hrs])=>{
                              const stIds = Object.keys(STATION_INFO).filter(id=>STATION_INFO[id].shift===(s===1?'s1':'s2'))
                              const total = Object.values(hrs).reduce((a,b)=>a+b,0)
                              return (
                                <tr key={name}>
                                  <td style={{padding:'8px',border:'1px solid #e5e7eb',fontWeight:'600'}}>{name}</td>
                                  {stIds.map(id=>(
                                    <td key={id} style={{padding:'8px',textAlign:'center',border:'1px solid #e5e7eb',
                                      background:hrs[id]?`${STATION_INFO[id].dot}15`:'transparent'}}>
                                      {hrs[id]?`${hrs[id].toFixed(1)}h`:'—'}
                                    </td>
                                  ))}
                                  <td style={{padding:'8px',textAlign:'center',border:'1px solid #e5e7eb',
                                    fontWeight:'700',color:'#059669'}}>{total.toFixed(1)}h</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* TIME OFF PER PERSON */}
            {analyticsTab==='timeoff' && (
              <div style={{background:'white',borderRadius:'12px',border:'1px solid #e5e7eb',padding:'16px'}}>
                <div style={{fontWeight:'700',fontSize:'14px',marginBottom:'12px',color:'#059669'}}>
                  Time Off Per Person
                </div>
                {[1,2].map(s=>(
                  <div key={s} style={{marginBottom:'16px'}}>
                    <div style={{fontSize:'12px',fontWeight:'700',color:'#374151',marginBottom:'8px',
                      padding:'6px 10px',background:'#f3f4f6',borderRadius:'6px'}}>
                      Shift {s}
                    </div>
                    {ALL_PEOPLE.filter(p=>p.shift===s&&!isGuest(p.id)&&!isSuperAdmin(p.id)&&p.role!=='ANALYTICS_ADMIN').map(p=>{
                      const entries = vacationMap[p.id]||[]
                      const totalDays = entries.reduce((sum,v)=>{
                        return sum+Math.round((new Date(v.end+'T12:00').getTime()-new Date(v.start+'T12:00').getTime())/86400000)+1
                      },0)
                      return (
                        <div key={p.id} style={{display:'flex',alignItems:'center',gap:'10px',
                          padding:'8px 10px',borderRadius:'8px',background:'#f9fafb',
                          border:'1px solid #e5e7eb',marginBottom:'4px'}}>
                          <div style={{width:'28px',height:'28px',borderRadius:'50%',
                            display:'flex',alignItems:'center',justifyContent:'center',
                            fontSize:'9px',fontWeight:'700',flexShrink:0,
                            background:COLORS[p.role]?.[0]||'#f3f4f6',color:COLORS[p.role]?.[1]||'#374151'}}>
                            {p.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:'12px',fontWeight:'600'}}>{p.name}</div>
                            <div style={{fontSize:'10px',color:'#6b7280'}}>{p.role}</div>
                          </div>
                          <div style={{textAlign:'right'}}>
                            <div style={{fontSize:'13px',fontWeight:'700',color:totalDays>0?'#dc2626':'#9ca3af'}}>
                              {totalDays} day{totalDays!==1?'s':''}
                            </div>
                            <div style={{fontSize:'10px',color:'#9ca3af'}}>{entries.length} request{entries.length!==1?'s':''}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* APP USAGE / LOGIN FREQUENCY */}
            {analyticsTab==='logins' && (
              <div style={{background:'white',borderRadius:'12px',border:'1px solid #e5e7eb',padding:'16px'}}>
                <div style={{fontWeight:'700',fontSize:'14px',marginBottom:'4px',color:'#059669'}}>
                  App Usage — Login Frequency
                </div>
                <div style={{fontSize:'12px',color:'#6b7280',marginBottom:'12px'}}>
                  How often each person has logged in
                </div>
                {loginStats.length===0?(
                  <div style={{textAlign:'center',padding:'24px',color:'#9ca3af',fontSize:'13px'}}>
                    No login data yet — data is collected from this point forward
                  </div>
                ):(
                  <div>
                    {[1,2].map(s=>{
                      const shiftStats = loginStats.filter((l:any)=>l.shift===s)
                      if (!shiftStats.length) return null
                      const byCounts: Record<string,number> = {}
                      shiftStats.forEach((l:any)=>{ byCounts[l.staff_id]=(byCounts[l.staff_id]||0)+1 })
                      const sorted = Object.entries(byCounts).sort((a,b)=>b[1]-a[1])
                      return (
                        <div key={s} style={{marginBottom:'16px'}}>
                          <div style={{fontSize:'12px',fontWeight:'700',color:'#374151',marginBottom:'8px',
                            padding:'6px 10px',background:'#f3f4f6',borderRadius:'6px'}}>Shift {s}</div>
                          {sorted.map(([staffId,count])=>{
                            const person = ALL_PEOPLE.find(p=>p.id===staffId)
                            const maxCount = sorted[0][1]
                            return (
                              <div key={staffId} style={{display:'flex',alignItems:'center',gap:'10px',
                                padding:'6px 10px',marginBottom:'4px'}}>
                                <div style={{fontSize:'12px',fontWeight:'600',minWidth:'140px'}}>
                                  {person?.name||staffId}
                                </div>
                                <div style={{flex:1,background:'#f3f4f6',borderRadius:'4px',height:'16px',overflow:'hidden'}}>
                                  <div style={{height:'100%',borderRadius:'4px',background:'#059669',
                                    width:`${(count/maxCount)*100}%`,transition:'width 0.3s'}}/>
                                </div>
                                <div style={{fontSize:'12px',fontWeight:'700',color:'#059669',minWidth:'40px',textAlign:'right'}}>
                                  {count}x
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STATION UPTIME */}
            {analyticsTab==='stations' && (
              <div style={{background:'white',borderRadius:'12px',border:'1px solid #e5e7eb',padding:'16px'}}>
                <div style={{fontWeight:'700',fontSize:'14px',marginBottom:'4px',color:'#059669'}}>
                  Station Enable/Disable Log
                </div>
                <div style={{fontSize:'12px',color:'#6b7280',marginBottom:'12px'}}>
                  History of when stations were taken offline and restored
                </div>
                {stationLogs.length===0?(
                  <div style={{textAlign:'center',padding:'24px',color:'#9ca3af',fontSize:'13px'}}>
                    No station log data yet — logged from this point forward
                  </div>
                ):(
                  <div>
                    {Object.keys(STATION_INFO).map(stId=>{
                      const logs = stationLogs.filter((l:any)=>l.station_id===stId)
                      if (!logs.length) return null
                      let totalDisabledMs = 0
                      let lastDisabled: Date|null = null
                      logs.forEach((l:any)=>{
                        if (l.action==='disabled') lastDisabled=new Date(l.actioned_at)
                        else if (l.action==='enabled'&&lastDisabled) {
                          totalDisabledMs += new Date(l.actioned_at).getTime()-lastDisabled.getTime()
                          lastDisabled=null
                        }
                      })
                      const totalDisabledHrs = (totalDisabledMs/3600000).toFixed(1)
                      return (
                        <div key={stId} style={{marginBottom:'12px',padding:'10px',
                          background:'#f9fafb',borderRadius:'8px',border:'1px solid #e5e7eb'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                            <div style={{width:'10px',height:'10px',borderRadius:'50%',
                              background:STATION_INFO[stId].dot}}/>
                            <span style={{fontWeight:'700',fontSize:'13px'}}>{STATION_INFO[stId].label}</span>
                            <span style={{marginLeft:'auto',fontSize:'11px',fontWeight:'600',
                              color:'#dc2626'}}>
                              {totalDisabledHrs}h total downtime
                            </span>
                          </div>
                          {logs.slice(0,5).map((l:any,i:number)=>(
                            <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',
                              fontSize:'11px',padding:'3px 0',
                              borderBottom:i<logs.length-1?'1px solid #f3f4f6':'none'}}>
                              <span style={{padding:'1px 6px',borderRadius:'4px',fontWeight:'700',
                                background:l.action==='disabled'?'#fee2e2':'#dcfce7',
                                color:l.action==='disabled'?'#dc2626':'#16a34a',
                                textTransform:'uppercase',fontSize:'9px'}}>{l.action}</span>
                              <span style={{color:'#374151',fontFamily:'monospace'}}>
                                {new Date(l.actioned_at).toLocaleString()}
                              </span>
                              <span style={{color:'#6b7280'}}>
                                by {ALL_PEOPLE.find(p=>p.id===l.actioned_by)?.name||l.actioned_by}
                              </span>
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
