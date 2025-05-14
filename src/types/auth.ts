// Auth Types
export interface User {
    id: number
    email: string
    firstName: string
    lastName: string
    role: 'ADMIN' | 'USER'
    isActive: boolean
    assignedStores: AssignedStore[]
    createdAt: string
    updatedAt?: string
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
}

export interface GoogleAuthRequest {
    token: string
    email: string
    firstName: string
    lastName: string
    picture?: string
}

export interface UserRequest {
    email: string
    password?: string
    firstName: string
    lastName: string
    role: string
    assignedStoreIds: number[]
}

export interface UpdateUserRequest {
    firstName?: string
    lastName?: string
    password?: string
    role?: string
    isActive?: boolean
    assignedStoreIds?: number[]
}

export interface UserStatusRequest {
    isActive: boolean
}

export interface AssignStoresRequest {
    storeIds: number[]
}