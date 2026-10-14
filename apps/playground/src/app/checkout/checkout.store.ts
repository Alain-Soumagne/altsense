import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CheckoutStore {
  readonly name = signal('');
  readonly address = signal('');

  readonly nameValid = computed(() => this.name().trim().length >= 2);
  readonly addressValid = computed(() => this.address().trim().length >= 5);
}
