import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  Component,
  Injector,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  model,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';
import { Tabs } from '@angular/aria/tabs';
import { cn } from '@altsense/ui/core';
import { Step } from './step';
import { StepLink } from './step-link';
import { StepList } from './step-list';
import { StepNav } from './step-nav';
import { StepOutlet } from './step-outlet';
import { StepPanel } from './step-panel';
import { StepIndicator } from './step-templates';
import { STEPPER } from './stepper-token';
import { StepState, StepperOrientation, StepperSize, stepperVariants } from './stepper.variants';

@Component({
  selector: 'as-stepper',
  template: '<ng-content />',
  hostDirectives: [Tabs],
  providers: [{ provide: STEPPER, useExisting: Stepper }],
  host: { '[class]': 'hostClass()' },
})
export class Stepper {
  private readonly announcer = inject(LiveAnnouncer);
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);

  readonly selectedIndex = model(0);
  readonly linear = input(false, { transform: booleanAttribute });
  readonly size = input<StepperSize>('md');

  readonly steps = contentChildren(Step, { descendants: true });
  readonly customIndicator = contentChild(StepIndicator);

  private readonly list = contentChild(StepList);
  private readonly nav = contentChild(StepNav);
  private readonly panels = contentChildren(StepPanel, { descendants: true });
  private readonly links = contentChildren(StepLink, { descendants: true });
  private readonly outlet = contentChild(StepOutlet, { descendants: true });

  readonly orientation = computed<StepperOrientation>(
    () => this.list()?.orientation() ?? this.nav()?.orientation() ?? 'horizontal',
  );

  readonly states = computed<StepState[]>(() =>
    this.steps().map((step, index) => {
      if (step.error()) return 'error';
      if (index === this.selectedIndex()) return 'current';
      const completed = step.completed() ?? index < this.selectedIndex();
      return completed ? 'complete' : 'upcoming';
    }),
  );

  readonly reachable = computed<boolean[]>(() => {
    let blocked = false;
    return this.steps().map((step) => {
      const reachable = !step.disabled() && !blocked;
      if (this.linear() && step.completed() === false && !step.optional()) blocked = true;
      return reachable;
    });
  });

  private readonly nextIndex = computed(() =>
    this.reachable().findIndex((ok, i) => ok && i > this.selectedIndex()),
  );
  private readonly previousIndex = computed(() =>
    this.reachable().findLastIndex((ok, i) => ok && i < this.selectedIndex()),
  );

  readonly hasNext = computed(() => this.nextIndex() !== -1);
  readonly hasPrevious = computed(() => this.previousIndex() !== -1);

  private readonly activeRouteIndex = computed(() =>
    this.links().findIndex((link) => link.active()),
  );

  protected readonly hostClass = computed(() =>
    cn(stepperVariants({ orientation: this.orientation() })),
  );

  constructor() {
    // In router mode the URL is the source of truth.
    effect(() => {
      const index = this.activeRouteIndex();
      if (index !== -1) this.selectedIndex.set(index);
    });

    // Focus may be on a Next button outside the step list, so step changes are announced.
    let initial = true;
    effect(() => {
      const index = this.selectedIndex();
      if (initial) {
        initial = false;
        return;
      }
      untracked(() => {
        const step = this.steps()[index];
        if (step) {
          this.announcer.announce(
            `Étape ${index + 1} sur ${this.steps().length} : ${step.label()}`,
          );
        }
      });
    });
  }

  previous(): void {
    if (this.hasPrevious()) this.goTo(this.previousIndex());
  }

  next(): void {
    if (this.hasNext()) this.goTo(this.nextIndex());
  }

  private goTo(index: number): void {
    const link = this.links()[index];
    if (link) {
      // selectedIndex follows through the URL sync effect.
      void this.router.navigateByUrl(link.urlTree()).then((navigated) => {
        if (navigated) this.focusContent();
      });
    } else {
      this.selectedIndex.set(index);
      this.focusContent();
    }
  }

  /** The new content only exists after the next render. */
  private focusContent(): void {
    afterNextRender(
      () => {
        const panel = this.panels().find((panel) => panel.visible());
        (panel?.element ?? this.outlet()?.element)?.focus();
      },
      { injector: this.injector },
    );
  }
}
