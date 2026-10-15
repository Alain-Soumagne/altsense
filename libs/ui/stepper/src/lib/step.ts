import { Directive, booleanAttribute, computed, contentChild, inject, input } from '@angular/core';
import { cn } from '@altsense/ui/core';
import { StepLabel } from './step-templates';
import { STEPPER } from './stepper-token';
import { stepConnectorVariants, stepItemVariants } from './stepper.variants';

/** Shared step inputs and state, composed into `as-step-trigger` and `as-step-link`. */
@Directive({ host: { '[class]': 'itemClass()' } })
export class Step {
  private readonly stepper = inject(STEPPER);

  /** Required even with an `asStepLabel` template: used for screen reader announcements. */
  readonly label = input.required<string>();
  readonly description = input<string>();
  /** When `undefined`, the step counts as completed once passed and never blocks linear mode. */
  readonly completed = input<boolean | undefined>(undefined);
  readonly optional = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  /** `true` for the visual state only, or a message shown instead of the description. */
  readonly error = input<boolean | string>(false);

  readonly customLabel = contentChild(StepLabel);

  readonly index = computed(() => this.stepper.steps().indexOf(this));
  readonly state = computed(() => this.stepper.states()[this.index()] ?? 'upcoming');
  readonly reachable = computed(() => this.stepper.reachable()[this.index()] ?? false);
  readonly current = computed(() => this.index() === this.stepper.selectedIndex());
  readonly last = computed(() => this.index() === this.stepper.steps().length - 1);

  protected readonly itemClass = computed(() =>
    cn(stepItemVariants({ orientation: this.stepper.orientation() })),
  );
  readonly connectorClass = computed(() =>
    cn(
      stepConnectorVariants({
        complete: this.state() === 'complete',
        orientation: this.stepper.orientation(),
        size: this.stepper.size(),
      }),
    ),
  );
}

export const STEP_INPUTS = ['label', 'description', 'completed', 'optional', 'disabled', 'error'];
