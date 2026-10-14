import { Component, inject } from '@angular/core';
import { CheckoutStore } from '../checkout.store';

@Component({
  selector: 'as-checkout-informations',
  template: `
    <label class="flex flex-col gap-1 text-sm">
      Nom (2 caractères min.)
      <input
        class="rounded-md border bg-background px-3 py-2 outline-ring focus-visible:outline-2"
        [value]="store.name()"
        (input)="store.name.set($any($event.target).value)"
      />
    </label>
  `,
})
export class Informations {
  protected readonly store = inject(CheckoutStore);
}
