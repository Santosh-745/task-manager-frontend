import { Routes } from '@angular/router';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { AuthGuard } from './components/authentication/auth.guard';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';

export const routes: Routes = [
    {
        path: '',
        component: AuthenticationComponent
    },
    {
        path: 'tasks-list/:id',
        canActivate: [AuthGuard],
        component: TasksListComponent,
    },
    {
        path: 'task/:id',
        canActivate: [AuthGuard],
        component: TaskDetailComponent,
    },
    {
        path: 'projects-list',
        canActivate: [AuthGuard],
        component: ProjectsListComponent,
    },
    {
        path: 'auth',
        component: AuthenticationComponent
    },
];
