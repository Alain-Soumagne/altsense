import { Component, computed, contentChildren, effect, inject } from '@angular/core';
import { TabList } from '@angular/aria/tabs';
import { cn } from '@altsense/ui/core';
import { StepTrigger } from './step-trigger';
import { STEPPER } from './stepper-token';
import { stepListVariants } from './stepper.variants';

/**
 * Prefer `selectionMode="explicit"` so arrow keys only move focus and Enter / Space selects a step.
 * It cannot be defaulted here: a host cannot set its host directives' plain inputs.
 */
@Component({
  selector: 'as-step-list',
  template: '<ng-content />',
  hostDirectives: [
    { directive: TabList, inputs: ['orientation', 'selectionMode', 'wrap', 'focusMode'] },
  ],
  host: { '[class]': 'hostClass()' },
})
export class StepList {
  private readonly stepper = inject(STEPPER);
  private readonly tabList = inject(TabList);
  private readonly triggers = contentChildren(StepTrigger, { descendants: true });

  readonly orientation = this.tabList.orientation;

  protected readonly hostClass = computed(() =>
    cn(stepListVariants({ orientation: this.orientation() })),
  );

  constructor() {
    // A host cannot bind its host directives' inputs, but a model input can be written to.
    effect(() => {
      const trigger = this.triggers()[this.stepper.selectedIndex()];
      if (trigger) this.tabList.selectedTab.set(trigger.value());
    });

    this.tabList.selectedTab.subscribe((value) => {
      const index = this.triggers().findIndex((trigger) => trigger.value() === value);
      if (index !== -1) this.stepper.selectedIndex.set(index);
    });
  }
}
