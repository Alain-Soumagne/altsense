import { Component, inject } from '@angular/core';
import { CheckoutStore } from '../checkout.store';

@Component({
  selector: 'as-checkout-payment',
  template: `
    <p class="text-sm">
      Commande pour <strong>{{ store.name() }}</strong
      >, livrée au <strong>{{ store.address() }}</strong
      >.
    </p>
  `,
})
export class Payment {
  protected readonly store = inject(CheckoutStore);
}
