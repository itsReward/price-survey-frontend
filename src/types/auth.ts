// Auth Types
export interface User {
    id: number
    email: string
    firstName: string
    lastName: string
    role: 'ADMIN' | 'USER'
    assignedStores: AssignedStore[]
}

export interface AssignedStore {
    id: number
    name: string
    address: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    token: string
    type: string
    user: User
}

export interface RegisterRequest {
    email: string
    password: string
    firstName: string
    lastName: string
    assignedStoreIds: number[]
}