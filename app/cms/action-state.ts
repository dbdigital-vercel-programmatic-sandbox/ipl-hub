export type CmsActionState = {
  status: "idle" | "success" | "error"
  message: string
  timestamp: number
}

export const initialCmsActionState: CmsActionState = {
  status: "idle",
  message: "",
  timestamp: 0,
}

export function successState(message: string): CmsActionState {
  return {
    status: "success",
    message,
    timestamp: Date.now(),
  }
}

export function errorState(message: string): CmsActionState {
  return {
    status: "error",
    message,
    timestamp: Date.now(),
  }
}
