import { Component, computed, signal } from '@angular/core';
import {
  StepIndicator,
  StepLabel,
  StepList,
  StepPanel,
  StepTrigger,
  Stepper,
  StepperOrientation,
  StepperSize,
} from '@altsense/ui/stepper';

@Component({
  selector: 'as-stepper-demo',
  imports: [Stepper, StepList, StepTrigger, StepPanel, StepIndicator, StepLabel],
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
  protected readonly addressError = computed(() =>
    this.address() && !this.addressValid() ? 'Adresse trop courte' : false,
  );

  protected readonly customStep = signal(1);
}
