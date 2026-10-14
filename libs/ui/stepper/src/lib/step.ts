import {
  Component,
  TemplateRef,
  booleanAttribute,
  contentChild,
  input,
  viewChild,
} from '@angular/core';
import { UrlTree } from '@angular/router';
import { StepLabel } from './step-templates';

export type StepLink = string | readonly unknown[] | UrlTree;

/** Renders nothing itself: its projected content is captured and rendered by the stepper. */
@Component({
  selector: 'as-step',
  template: '<ng-template><ng-content /></ng-template>',
})
export class Step {
  /** Required even with an `asStepLabel` template: used for screen reader announcements. */
  readonly label = input.required<string>();

  readonly description = input<string>();

  /** When `undefined`, the step counts as completed once passed and never blocks linear mode. */
  readonly completed = input<boolean | undefined>(undefined);

  readonly optional = input(false, { transform: booleanAttribute });

  readonly disabled = input(false, { transform: booleanAttribute });

  /** `true` for the visual state only, or a message shown instead of the description. */
  readonly error = input<boolean | string>(false);

  /**
   * Switches the stepper to router mode. Relative links resolve against the route of the
   * component hosting the stepper.
   */
  readonly link = input<StepLink>();

  readonly content = viewChild.required(TemplateRef);

  readonly customLabel = contentChild(StepLabel);
}
