import { User } from "../authentication/user.model";

export interface Task {
    id?: number;
    title: string;
    description?: string;
    priority: number;
    startDate?: Date | string;
    endDate?: Date | string;
    status: string;
    users?: User[];
    userEmails?: string[];
}

export interface getTasksResponse {
    message: string;
    tasks: Task[];
    count: number;
}

export interface CreateTask {
    title?: string;
    description?: string;
    priority?: number;
    startDate?: Date | string;
    endDate?: Date | string;
    status?: string;
    userIds: number[];
    startTime?: string;
    endTime?: string;
}