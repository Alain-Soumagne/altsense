import { Component, inject } from '@angular/core';
import { CheckoutStore } from '../checkout.store';

@Component({
  selector: 'as-checkout-shipping',
  template: `
    <label class="flex flex-col gap-1 text-sm">
      Adresse (5 caractères min.)
      <input
        class="rounded-md border bg-background px-3 py-2 outline-ring focus-visible:outline-2"
        [value]="store.address()"
        (input)="store.address.set($any($event.target).value)"
      />
    </label>
  `,
})
export class Shipping {
  protected readonly store = inject(CheckoutStore);
}
