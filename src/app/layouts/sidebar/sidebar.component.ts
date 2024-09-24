import { Component, OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MenuModule, BadgeModule, DividerModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  items: any;

  ngOnInit(): void {
     this.items = [
    {
      label: 'Espace CV',
      icon: 'pi pi-file',
      routerLink: ['/espace-cv']
    },
    {
      label: 'Espace Appel d’offre',
      icon: 'pi pi-clipboard',
      routerLink: ['/espace-appel-offre']
    },
    {
      label: 'Matching CV-AO',
      icon: 'pi pi-bolt',
      routerLink: ['/matching-cvao']
    },
    {
      label: 'Visualisation',
      icon: 'pi pi-chart-bar',
      routerLink: ['/visualisation']
    },
    {
      label: 'Synthèse graphique',
      icon: 'pi pi-chart-pie',
      routerLink: ['/synthese-graphique']
    },
  ];
  }

}
