import { Directive, TemplateRef, inject } from '@angular/core';
import { StepState } from './stepper.variants';

export interface StepIndicatorContext {
  $implicit: StepState;
  index: number;
}

@Directive({ selector: 'ng-template[asStepIndicator]' })
export class StepIndicator {
  readonly template = inject<TemplateRef<StepIndicatorContext>>(TemplateRef);

  static ngTemplateContextGuard(_dir: StepIndicator, _ctx: unknown): _ctx is StepIndicatorContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[asStepLabel]' })
export class StepLabel {
  readonly template = inject(TemplateRef);
}
