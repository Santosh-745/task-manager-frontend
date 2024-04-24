import { User } from "../authentication/user.model";

export interface Project {
    id?: number;
    title: string;
    startDate?: Date;
    endDate?: Date;
    ownerEmail?: string;
    owner?: User;
}
