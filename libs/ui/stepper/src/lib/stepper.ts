import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, contentChildren, model } from '@angular/core';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { cn } from '@altsense/ui/core';
import { Step } from './step';
import {
  StepState,
  stepConnectorVariants,
  stepIndicatorVariants,
  stepLabelVariants,
} from './stepper.variants';

/**
 * Stepper construit sur le pattern Tabs d'Angular Aria.
 *
 * Aria fournit : rôles ARIA (tablist / tab / tabpanel), liens aria-controls / aria-labelledby,
 * focus « roving » et navigation clavier (flèches, Home, End).
 * Le stepper ajoute : la notion d'index, l'état de chaque étape et la navigation précédente / suivante.
 */
@Component({
  selector: 'as-stepper',
  imports: [Tabs, TabList, Tab, TabPanel, TabContent, NgTemplateOutlet],
  templateUrl: './stepper.html',
  host: { class: 'block' },
})
export class Stepper {
  /** Index de l'étape courante (two-way binding : `[(selectedIndex)]`). */
  readonly selectedIndex = model(0);

  /** Les `<as-step>` projetés dans le stepper. */
  protected readonly steps = contentChildren(Step);

  readonly isFirst = computed(() => this.selectedIndex() === 0);
  readonly isLast = computed(
    () => this.selectedIndex() === this.steps().length - 1,
  );

  /** Aria identifie les onglets par une `value` string : on utilise l'index. */
  protected readonly selectedValue = computed(() => `${this.selectedIndex()}`);

  /** État de chaque étape, recalculé quand l'index ou un input `completed` change. */
  protected readonly states = computed<StepState[]>(() =>
    this.steps().map((step, index) => {
      if (index === this.selectedIndex()) return 'current';
      const completed = step.completed() ?? index < this.selectedIndex();
      return completed ? 'complete' : 'upcoming';
    }),
  );

  // Les fonctions cva sont exposées au template, combinées via cn().
  protected readonly indicatorClass = (state: StepState) =>
    cn(stepIndicatorVariants({ state }));
  protected readonly labelClass = (state: StepState) =>
    cn(stepLabelVariants({ state }));
  protected readonly connectorClass = (complete: boolean) =>
    cn(stepConnectorVariants({ complete }));

  previous(): void {
    if (!this.isFirst()) this.selectedIndex.update((i) => i - 1);
  }

  next(): void {
    if (!this.isLast()) this.selectedIndex.update((i) => i + 1);
  }

  protected onSelectedValueChange(value: string | undefined): void {
    if (value !== undefined) this.selectedIndex.set(Number(value));
  }
}
