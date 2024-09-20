import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cv',
    loadComponent() {
      return import('./pages/cv/cv.component').then((m) => m.CvComponent);
    },
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'cv', pathMatch: 'full' },
];
