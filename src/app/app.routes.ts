import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/job-application/job-application.routes').then(m => m.JOB_APPLICATION_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

