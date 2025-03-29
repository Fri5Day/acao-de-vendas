export interface AuthState {
  jwtToken: string | null
  isFetchingToken: boolean
  tokenPromise: Promise<string> | null
} 