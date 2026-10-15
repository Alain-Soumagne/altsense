import { Component, computed, input } from '@angular/core';
import { cn } from '@altsense/ui/core';
import { StepperOrientation, stepListVariants } from './stepper.variants';

@Component({
  // Attached to a native <nav> so consumers label the landmark themselves.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'nav[asStepNav]',
  template: '<ol [class]="listClass()"><ng-content /></ol>',
})
export class StepNav {
  readonly orientation = input<StepperOrientation>('horizontal');

  protected readonly listClass = computed(() =>
    cn(stepListVariants({ orientation: this.orientation() })),
  );
}
