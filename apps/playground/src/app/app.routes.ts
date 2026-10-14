import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'stepper' },
  {
    path: 'stepper',
    loadComponent: () => import('./stepper-demo/stepper-demo').then((m) => m.StepperDemo),
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.routes').then((m) => m.checkoutRoutes),
  },
];
