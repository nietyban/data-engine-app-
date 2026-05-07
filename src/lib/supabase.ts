import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnon)

export interface RosterMember {
  id: string
  name: string
  alias: string
  email: string | null
  role: 'LEAD' | 'DC' | 'DA'
  shift: 1 | 2
  pod: string | null
  active: boolean
  clerk_user_id: string | null
}

export interface AttendanceRecord {
  id: string
  staff_id: string
  shift_date: string
  status: 'present' | 'absent'
  marked_at: string
  marked_by: string | null
  locked: boolean
  notes: string | null
}

export async function getRoster(shift?: 1 | 2): Promise<RosterMember[]> {
  let query = supabase.from('roster').select('*').eq('active', true)
  if (shift) query = query.eq('shift', shift)
  const { data, error } = await query.order('name')
  if (error) throw error
  return data ?? []
}

export async function getTodayAttendance(
  date = new Date().toISOString().split('T')[0]
): Promise<AttendanceRecord[]> {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('shift_date', date)
  if (error) throw error
  return data ?? []
}

export async function markAttendance(
  staffId: string,
  status: 'present' | 'absent',
  markedBy: string,
  date = new Date().toISOString().split('T')[0]
): Promise<void> {
  const { error } = await supabase
    .from('attendance')
    .upsert(
      { staff_id: staffId, shift_date: date, status, 
        marked_by: markedBy, marked_at: new Date().toISOString() },
      { onConflict: 'staff_id,shift_date' }
    )
  if (error) throw error
}

export function subscribeToAttendance(
  date: string,
  callback: (records: AttendanceRecord[]) => void
) {
  const channel = supabase
    .channel(`attendance-${date}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'attendance',
        filter: `shift_date=eq.${date}`,
      },
      async () => {
        const fresh = await getTodayAttendance(date)
        callback(fresh)
      }
    )
    .subscribe()
  return () => supabase.removeChannel(channel)
}
