import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { cn } from '@altsense/ui/core';
import { Step } from './step';
import { StepIndicator } from './step-templates';
import {
  StepState,
  StepperSize,
  stepHintVariants,
  stepIndicatorVariants,
  stepLabelVariants,
} from './stepper.variants';

@Component({
  selector: 'as-step-header',
  imports: [NgTemplateOutlet],
  templateUrl: './step-header.html',
  host: { class: 'contents' },
})
export class StepHeader {
  readonly step = input.required<Step>();
  readonly index = input.required<number>();
  readonly state = input.required<StepState>();
  readonly size = input.required<StepperSize>();
  readonly customIndicator = input<StepIndicator>();

  protected readonly indicatorClass = computed(() =>
    cn(stepIndicatorVariants({ state: this.state(), size: this.size() })),
  );
  protected readonly labelClass = computed(() =>
    cn(stepLabelVariants({ state: this.state(), size: this.size() })),
  );
  protected readonly hintClass = computed(() =>
    cn(stepHintVariants({ error: this.state() === 'error' })),
  );

  protected readonly hint = computed(() => {
    const step = this.step();
    const error = step.error();
    if (typeof error === 'string' && error) return error;
    return step.description() ?? (step.optional() ? 'Optionnel' : undefined);
  });

  protected readonly srStatus = computed(() => {
    if (this.state() === 'complete') return ', terminée';
    if (this.state() === 'error') return ', en erreur';
    return '';
  });
}
