import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { cn } from '@altsense/ui/core';
import { Step } from './step';
import { STEPPER } from './stepper-token';
import { stepHintVariants, stepIndicatorVariants, stepLabelVariants } from './stepper.variants';

@Component({
  selector: 'as-step-header',
  imports: [NgTemplateOutlet],
  templateUrl: './step-header.html',
  host: { class: 'contents' },
})
export class StepHeader {
  protected readonly stepper = inject(STEPPER);

  readonly step = input.required<Step>();

  protected readonly state = computed(() => this.step().state());

  protected readonly indicatorClass = computed(() =>
    cn(stepIndicatorVariants({ state: this.state(), size: this.stepper.size() })),
  );
  protected readonly labelClass = computed(() =>
    cn(stepLabelVariants({ state: this.state(), size: this.stepper.size() })),
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
