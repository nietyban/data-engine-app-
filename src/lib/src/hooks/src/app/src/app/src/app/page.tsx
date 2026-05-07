'use client'

import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs'
import { useAttendance } from '../hooks/useAttendance'
import { useState, useEffect } from 'react'
import { getRoster, type RosterMember } from '../lib/supabase'

export default function Home() {
  const { user, isLoaded } = useUser()
  const { attendance, absentIds, toggle } = useAttendance()
  const [roster, setRoster] = useState<RosterMember[]>([])
  const [shift, setShift] = useState<1|2>(1)

  useEffect(() => {
    getRoster().then(setRoster)
  }, [])

  if (!isLoaded) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', 
      height:'100vh', fontFamily:'monospace' }}>
      Loading...
    </div>
  )

  if (!user) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
      height:'100vh', flexDirection:'column', gap:'16px', fontFamily:'system-ui' }}>
      <div style={{ fontSize:'24px', fontWeight:'700' }}>Data Engine</div>
      <div style={{ fontSize:'14px', color:'#666' }}>Real-time shift scheduler</div>
      <SignInButton mode="modal">
        <button style={{ padding:'10px 24px', background:'#4f9eff', color:'#000',
          border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:'600',
          cursor:'pointer' }}>
          Sign in →
        </button>
      </SignInButton>
    </div>
  )

  const shiftRoster = roster.filter(m => m.shift === shift)
  const presentCount = shiftRoster.filter(m => 
    m.role === 'DC' && !absentIds.has(m.id)).length
  const absentCount = shiftRoster.filter(m => 
    m.role === 'DC' && absentIds.has(m.id)).length

  return (
    <div style={{ maxWidth:'800px', margin:'0 auto', padding:'24px', 
      fontFamily:'system-ui' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', 
        justifyContent:'space-between', marginBottom:'24px' }}>
        <div>
          <div style={{ fontSize:'20px', fontWeight:'700' }}>Data Engine</div>
          <div style={{ fontSize:'12px', color:'#666' }}>
            Signed in as {user.primaryEmailAddress?.emailAddress}
          </div>
        </div>
        <SignOutButton>
          <button style={{ padding:'6px 12px', border:'1px solid #ddd',
            borderRadius:'6px', fontSize:'12px', cursor:'pointer',
            background:'white' }}>
            Sign out
          </button>
        </SignOutButton>
      </div>

      {/* Shift toggle */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
        {[1,2].map(s => (
          <button key={s} onClick={() => setShift(s as 1|2)}
            style={{ padding:'8px 20px', borderRadius:'8px', cursor:'pointer',
              border:'1px solid #ddd', fontWeight:'600', fontSize:'13px',
              background: shift === s ? '#4f9eff' : 'white',
              color: shift === s ? '#000' : '#333' }}>
            {s === 1 ? '1st Shift · 7AM' : '2nd Shift · 10AM'}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', 
        gap:'12px', marginBottom:'20px' }}>
        {[
          { label:'Present', value: presentCount, color:'#22c55e' },
          { label:'Absent',  value: absentCount,  color:'#ef4444' },
          { label:'Stations',value: 8,             color:'#4f9eff' },
        ].map(s => (
          <div key={s.label} style={{ background:'#f9f9f9', borderRadius:'10px',
            padding:'14px', textAlign:'center', border:'1px solid #eee' }}>
            <div style={{ fontSize:'28px', fontWeight:'700', 
              color: s.color }}>{s.value}</div>
            <div style={{ fontSize:'11px', color:'#666', 
              textTransform:'uppercase', letterSpacing:'0.06em',
              marginTop:'4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Roster */}
      <div style={{ background:'white', border:'1px solid #eee', 
        borderRadius:'12px', padding:'16px' }}>
        <div style={{ fontSize:'11px', fontWeight:'600', color:'#999',
          textTransform:'uppercase', letterSpacing:'0.08em', 
          marginBottom:'12px' }}>
          Shift {shift} roster — click to toggle absence
        </div>
        {['LEAD','DC','DA'].map(role => (
          <div key={role} style={{ marginBottom:'14px' }}>
            <div style={{ fontSize:'10px', color:'#aaa',
