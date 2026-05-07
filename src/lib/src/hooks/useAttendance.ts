export function useAttendance() {
  return {
    attendance: [],
    absentIds: new Set<string>(),
    loading: false,
    error: null,
    markAbsent: async () => {},
    markPresent: async () => {},
    toggle: async () => {},
  }
}
