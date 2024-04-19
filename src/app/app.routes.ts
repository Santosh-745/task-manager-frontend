import { Routes } from '@angular/router';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { AuthGuard } from './components/authentication/auth.guard';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';

export const routes: Routes = [
    {
        path: '',
        component: AuthenticationComponent
    },
    {
        path: 'tasks-list',
        canActivate: [AuthGuard],
        component: TasksListComponent,
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
