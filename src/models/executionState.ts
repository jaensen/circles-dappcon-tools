export enum ExecutionState {
    None = 'none',
    Initializing = 'initializing',
    Processing = 'processing',
    Success = 'success',
    Error = 'error',
}

export type ActionStatus = { state: ExecutionState, status: string };
