export interface Task {
    title: string;
    description?: string;
    priority: string;
    startDate?: Date;
    endDate?: Date;
    status: string;
    assignedPerson: string;
    isEditingStatus?: boolean;
    isEditingpriority?: boolean;
}

export interface Tasks {
    message: string;
    tasks: Task[];
}
