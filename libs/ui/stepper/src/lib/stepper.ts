import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  booleanAttribute,
  computed,
  contentChildren,
  input,
  model,
} from '@angular/core';
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
 * focus « roving », navigation clavier (flèches, Home, End) et gestion des onglets désactivés.
 * Le stepper ajoute : la notion d'index, l'état de chaque étape, le mode linéaire
 * et la navigation précédente / suivante.
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

  /** Mode linéaire : impossible d'atteindre une étape tant qu'une précédente n'est pas terminée. */
  readonly linear = input(false, { transform: booleanAttribute });

  /** Les `<as-step>` projetés dans le stepper. */
  protected readonly steps = contentChildren(Step);

  /** Aria identifie les onglets par une `value` string : on utilise l'index. */
  protected readonly selectedValue = computed(() => `${this.selectedIndex()}`);

  /** État visuel de chaque étape. */
  protected readonly states = computed<StepState[]>(() =>
    this.steps().map((step, index) => {
      if (index === this.selectedIndex()) return 'current';
      const completed = step.completed() ?? index < this.selectedIndex();
      return completed ? 'complete' : 'upcoming';
    }),
  );

  /**
   * Étapes atteignables. En mode linéaire, une étape est bloquée dès qu'une étape précédente
   * non facultative est explicitement non terminée (`[completed]="false"`).
   */
  protected readonly reachable = computed<boolean[]>(() => {
    let blocked = false;
    return this.steps().map((step) => {
      const reachable = !step.disabled() && !blocked;
      if (this.linear() && step.completed() === false && !step.optional())
        blocked = true;
      return reachable;
    });
  });

  /** Index de l'étape atteignable la plus proche dans une direction, ou -1. */
  private readonly nextIndex = computed(() =>
    this.reachable().findIndex((ok, i) => ok && i > this.selectedIndex()),
  );
  private readonly previousIndex = computed(() =>
    this.reachable().findLastIndex((ok, i) => ok && i < this.selectedIndex()),
  );

  readonly hasNext = computed(() => this.nextIndex() !== -1);
  readonly hasPrevious = computed(() => this.previousIndex() !== -1);

  // Les fonctions cva sont exposées au template, combinées via cn().
  protected readonly indicatorClass = (state: StepState) =>
    cn(stepIndicatorVariants({ state }));
  protected readonly labelClass = (state: StepState) =>
    cn(stepLabelVariants({ state }));
  protected readonly connectorClass = (complete: boolean) =>
    cn(stepConnectorVariants({ complete }));

  previous(): void {
    if (this.hasPrevious()) this.selectedIndex.set(this.previousIndex());
  }

  next(): void {
    if (this.hasNext()) this.selectedIndex.set(this.nextIndex());
  }

  protected onSelectedValueChange(value: string | undefined): void {
    if (value !== undefined) this.selectedIndex.set(Number(value));
  }
}
