import { Component, computed, signal } from '@angular/core';
import {
  Step,
  StepIndicator,
  StepLabel,
  Stepper,
  StepperOrientation,
  StepperSize,
} from '@altsense/ui/stepper';

@Component({
  selector: 'as-stepper-demo',
  imports: [Stepper, Step, StepIndicator, StepLabel],
  templateUrl: './stepper-demo.html',
})
export class StepperDemo {
  protected readonly currentStep = signal(0);

  protected readonly orientations: StepperOrientation[] = ['horizontal', 'vertical'];
  protected readonly sizes: StepperSize[] = ['sm', 'md', 'lg'];
  protected readonly orientation = signal<StepperOrientation>('horizontal');
  protected readonly size = signal<StepperSize>('md');

  protected readonly name = signal('');
  protected readonly address = signal('');
  protected readonly nameValid = computed(() => this.name().trim().length >= 2);
  protected readonly addressValid = computed(() => this.address().trim().length >= 5);
  /** Erreur affichée seulement une fois la saisie commencée. */
  protected readonly addressError = computed(() =>
    this.address() && !this.addressValid() ? 'Adresse trop courte' : false,
  );

  protected readonly customStep = signal(1);
}
