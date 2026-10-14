import { Injectable, computed, signal } from '@angular/core';

/**
 * État partagé du tunnel de commande.
 * Fourni en root pour être accessible à la fois aux pages d'étapes et aux guards de route.
 */
@Injectable({ providedIn: 'root' })
export class CheckoutStore {
  readonly name = signal('');
  readonly address = signal('');

  readonly nameValid = computed(() => this.name().trim().length >= 2);
  readonly addressValid = computed(() => this.address().trim().length >= 5);
}
