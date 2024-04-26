import { User } from "../authentication/user.model";

export interface Task {
    id?: number;
    title: string;
    description?: string;
    priority: string;
    startDate?: Date;
    endDate?: Date;
    status: string;
    users?: User[];
    userEmails?: string[];
}

export interface Tasks {
    message: string;
    tasks: Task[];
}

export interface CreateTask {
    title?: string;
    description?: string;
    priority?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    userIds: number[];
}