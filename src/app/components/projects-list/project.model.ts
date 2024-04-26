import { User } from "../authentication/user.model";

export interface Project {
    id?: number;
    title: string;
    startDate?: Date;
    endDate?: Date;
    ownerEmail?: string;
    owner?: User;
    users?: User[];
}

export interface CreateProject {
    title: string;
    startDate?: Date;
    endDate?: Date;
    userIds?: number[];
}