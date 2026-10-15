import { Component, inject, input } from '@angular/core';
import { Tab } from '@angular/aria/tabs';
import { cn } from '@altsense/ui/core';
import { STEP_INPUTS, Step } from './step';
import { StepHeader } from './step-header';
import { stepTriggerVariants } from './stepper.variants';

@Component({
  selector: 'as-step-trigger',
  imports: [Tab, StepHeader],
  hostDirectives: [{ directive: Step, inputs: STEP_INPUTS }],
  host: { role: 'presentation' },
  template: `
    <!--
      ngTab lives in the template rather than in hostDirectives: its disabled state is computed
      by the stepper, and a host cannot bind its own host directives' inputs.
      softDisabled (default): disabled tabs stay focusable but cannot be selected.
    -->
    <div
      ngTab
      [value]="value()"
      [disabled]="!step.reachable()"
      [attr.aria-current]="step.current() ? 'step' : null"
      [class]="triggerClass"
    >
      <as-step-header [step]="step" />
    </div>
    @if (!step.last()) {
      <span aria-hidden="true" [class]="step.connectorClass()"></span>
    }
  `,
})
export class StepTrigger {
  protected readonly step = inject(Step);

  /** Pairs the trigger with the `as-step-panel` of the same value. */
  readonly value = input.required<string>();

  protected readonly triggerClass = cn(stepTriggerVariants());
}
