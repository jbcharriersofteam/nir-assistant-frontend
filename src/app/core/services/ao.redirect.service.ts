import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AoRedirectService {
  constructor(private router: Router) {}

  redirect(ao: any) {
    ao.metier_fonc = ao.metier_fonc
      ? ao.metier_fonc
      : [];
    ao.experience = ao.experience
      ? ao.experience.match(/[0-9]+/g)?.[0]
      : undefined;
    ao.attractivite = ao.attractivite
      ? ao.attractivite.match(/[0-9]+/g)?.[0]
      : '0';
    ao.techno_majeures = ao.techno_majeures
      ? ao.techno_majeures
      : [];
    ao.techno_mineures = ao.techno_mineures
      ? ao.techno_mineures
      : [];
    this.router.navigate(['/analyse-ao'], { state: ao });
  }
}