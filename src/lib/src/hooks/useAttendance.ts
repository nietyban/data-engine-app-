'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getTodayAttendance,
  markAttendance,
  subscribeToAttendance,
  type AttendanceRecord
} from '../lib/supabase'

export function useAttendance(date?: string) {
  const today = date ?? new Date().toISOString().split('T')[0]
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getTodayAttendance(today)
      .then(data => { setAttendance(data); setLoading(false) })
      .catch(e  => { setError(e.message); setLoading(false) })
  }, [today])

  useEffect(() => {
    const unsubscribe = subscribeToAttendance(today, fresh => {
      setAttendance(fresh)
    })
    return unsubscribe
  }, [today])

  const absentIds = new Set(
    attendance.filter(a => a.status === 'absent').map(a => a.staff_id)
  )

  const markAbsent = useCallback(async (staffId: string, markedBy: string) => {
    try {
      await markAttendance(staffId, 'absent', markedBy, today)
    } catch (e: any) {
      setError(e.message)
    }
  }, [today])

  const markPresent = useCallback(async (staffId: string, markedBy: string) => {
    try {
      await markAttendance(staffId, 'present', markedBy, today)
    } catch (e: any) {
      setError(e.message)
    }
  }, [today])

  const toggle = useCallback(async (staffId: string, markedBy: string) => {
    if (absentIds.has(staffId)) {
      await markPresent(staffId, markedBy)
    } else {
      await markAbsent(staffId, markedBy)
    }
  }, [absentIds, markAbsent, markPresent])

  return { attendance, absentIds, loading, error, markAbsent, markPresent, toggle }
}
