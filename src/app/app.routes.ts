import { Routes } from '@angular/router';
import { AnalyseCandidatComponent } from './analyse-candidat/analyse-candidat.component';

export const routes: Routes = [
  {
    path: 'test',
    component: AnalyseCandidatComponent
  },
  {
    path: 'espace-cv',
    loadComponent: () => import('./pages/espace-cv/espace-cv.component').then(m=> m.EspaceCvComponent)
  },
  {
    path: 'analyse-cv',
    loadComponent: () => import('./pages/analyse-cv/analyse-cv.component').then(m=> m.AnalyseCvComponent)
  },
  {
    path: 'espace-appel-offre',
    loadComponent: () => import('./pages/espace-appel-offre/espace-appel-offre.component').then(m=>m.EspaceAppelOffreComponent)
  },
  {
    path: 'matching-cvao',
    loadComponent: () => import('./pages/matching-cv-ao/matching-cv-ao.component').then((m) => m.MatchingCvAoComponent)
  },
  {
    path: 'visualisation',
    loadComponent: () => import('./pages/visualisation/visualisation.component').then((m) => m.VisualisationComponent)
  },
  {
    path: 'synthese-graphique',
    loadComponent: () => import('./pages/synthese-graphique/synthese-graphique.component').then((m) => m.SyntheseGraphiqueComponent)
  },
  { path: '', redirectTo: '/espace-cv', pathMatch: 'full' },
  { path: '**', redirectTo: '/espace-cv', pathMatch: 'full' },
];
