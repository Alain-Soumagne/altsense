import { inject } from '@angular/core';
import { CanActivateFn, Route, Router } from '@angular/router';
import { Checkout } from './checkout';
import { CheckoutStore } from './checkout.store';

/**
 * Le mode linéaire du stepper désactive les liens, mais n'empêche pas de saisir l'URL :
 * c'est le rôle d'un guard. Ici, on renvoie vers la première étape incomplète.
 */
const requireCompleted =
  (...steps: ('informations' | 'livraison')[]): CanActivateFn =>
  () => {
    const store = inject(CheckoutStore);
    const router = inject(Router);
    if (steps.includes('informations') && !store.nameValid()) {
      return router.parseUrl('/checkout/informations');
    }
    if (steps.includes('livraison') && !store.addressValid()) {
      return router.parseUrl('/checkout/livraison');
    }
    return true;
  };

export const checkoutRoutes: Route[] = [
  {
    path: '',
    component: Checkout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'informations' },
      {
        path: 'informations',
        title: 'Informations',
        loadComponent: () => import('./steps/informations').then((m) => m.Informations),
      },
      {
        path: 'livraison',
        title: 'Livraison',
        canActivate: [requireCompleted('informations')],
        loadComponent: () => import('./steps/shipping').then((m) => m.Shipping),
      },
      {
        path: 'paiement',
        title: 'Paiement',
        canActivate: [requireCompleted('informations', 'livraison')],
        loadComponent: () => import('./steps/payment').then((m) => m.Payment),
      },
    ],
  },
];
