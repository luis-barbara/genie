
// User and authentication 
export type UserRole = "user" | "admin"

export interface User {
    id: string
    name?: string
    email: string
    role: UserRole
    createdAt: string
}




// Project
export type Plan = "free" | "starter" | "pro" | "business"

export interface Project {
    id: string
    name: string
    description?: string
    plan: Plan
    createdAt: string
}




// Error events
export interface ErrorEvent {
    id: string
    projectId: string
    type: "frontend" | "backend" | "network"
    message: string
    stack?: string
    source: string
    url?: string
    userAgent?: string
    timestamp: string
    severity: "low" | "medium" | "high" | "critical"
    occurrences: number
}




// Performance metrics
export interface PerformanceEvent {
    id: string
    projectId: string
    metric: "FCP" | "LCP" | "CLS" | "TTFB" | "CPU" | "Memory"
    value: number
    url?: string
    timestamp: string
}




// Security events
export interface SecurityEvent {
    id: string
    projectId: string
    type: "xss" | "sql_injection" | "csrf" | "dos" | "scan" | "unknown"
    description: string
    sourceIP?: string
    timestamp: string
    severity: "low" | "medium" | "high" | "critical"
}




// Insights
export interface Insight {
    id: string
    projectId: string
    category: "error" | "performance" | "security" | "usability"
    title: string
    description: string
    severity: "low" | "medium" | "high"
    createdAt: string
}



// Tickets
export type TicketType = "bug" | "performance" | "security"
export type TicketStatus = "new" | "in_progress" | "resolved"
export type TicketPriority = "low" | "medium" | "high" | "critical"

export interface Ticket {
    id: string
    projectId: string
    type: TicketType
    title: string
    description?: string
    status: TicketStatus
    priority: TicketPriority
    linkedEventId?: string
    occurrences: number
    createdAt: string
    updatedAt?: string
}




// Monthly Usage
export interface MonthlyUsage {
    id?: string
    projectId: string
    month: string 
    eventsCaptured: number
    eventsLimit: number
    plan: Plan
    updatedAt?: string
}




// DTOS - data transfer objects for API requests/responses
// SDK → API (client sends events)
export interface EventPushRequest {
    projectId: string
    type: "error" | "performance" | "security"
    payload: any
}

// Dashboard → API (filters)
export interface EventQuery {
    projectId: string
    type?: "error" | "performance" | "security"
    severity?: string
    startDate?: string
    endDate?: string
}
