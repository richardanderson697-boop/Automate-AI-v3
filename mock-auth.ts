// Mock authentication for development/preview environments
// This bypasses Supabase auth restrictions in iframe previews

export const MOCK_USER = {
  id: 'mock-user-123',
  email: 'demo@autoparts.com',
  user_metadata: {
    role: 'admin',
    full_name: 'Demo User',
  },
}

export function useMockAuth() {
  return typeof window !== 'undefined' && window.parent !== window
}
