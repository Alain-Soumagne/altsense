import { Component, inject } from '@angular/core';
import { StepLink, StepNav, StepOutlet, Stepper } from '@altsense/ui/stepper';
import { CheckoutStore } from './checkout.store';

@Component({
  selector: 'as-checkout',
  imports: [Stepper, StepNav, StepLink, StepOutlet],
  templateUrl: './checkout.html',
})
export class Checkout {
  protected readonly store = inject(CheckoutStore);
}
