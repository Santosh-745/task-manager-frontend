import { Routes } from '@angular/router';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { AuthGuard } from './components/authentication/auth.guard';

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
        path: 'auth',
        component: AuthenticationComponent
    },
];
