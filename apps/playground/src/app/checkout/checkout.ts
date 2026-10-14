import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Step, Stepper } from '@altsense/ui/stepper';
import { CheckoutStore } from './checkout.store';

@Component({
  selector: 'as-checkout',
  imports: [Stepper, Step, RouterOutlet],
  templateUrl: './checkout.html',
})
export class Checkout {
  protected readonly store = inject(CheckoutStore);
}
