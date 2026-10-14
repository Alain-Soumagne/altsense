import { NgTemplateOutlet } from '@angular/common';
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
  viewChildren,
} from '@angular/core';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { cn } from '@altsense/ui/core';
import { Step } from './step';
import { StepHeader } from './step-header';
import { StepIndicator } from './step-templates';
import {
  StepState,
  StepperOrientation,
  StepperSize,
  stepConnectorVariants,
  stepListVariants,
  stepTriggerVariants,
  stepperVariants,
} from './stepper.variants';

/**
 * Stepper construit sur le pattern Tabs d'Angular Aria.
 *
 * Aria fournit : rôles ARIA (tablist / tab / tabpanel), liens aria-controls / aria-labelledby,
 * focus « roving », navigation clavier (flèches, Home, End) et gestion des onglets désactivés.
 * Le stepper ajoute : la notion d'index, l'état de chaque étape, le mode linéaire,
 * la navigation précédente / suivante et les annonces aux lecteurs d'écran.
 */
@Component({
  selector: 'as-stepper',
  imports: [Tabs, TabList, Tab, TabPanel, TabContent, NgTemplateOutlet, StepHeader],
  templateUrl: './stepper.html',
  host: { class: 'block' },
})
export class Stepper {
  private readonly announcer = inject(LiveAnnouncer);
  private readonly injector = inject(Injector);

  /** Index de l'étape courante (two-way binding : `[(selectedIndex)]`). */
  readonly selectedIndex = model(0);

  /** Mode linéaire : impossible d'atteindre une étape tant qu'une précédente n'est pas terminée. */
  readonly linear = input(false, { transform: booleanAttribute });

  /** Disposition : également transmise à Aria (flèches gauche/droite ou haut/bas). */
  readonly orientation = input<StepperOrientation>('horizontal');

  readonly size = input<StepperSize>('md');

  /** Les `<as-step>` projetés dans le stepper. */
  protected readonly steps = contentChildren(Step);

  /** Template de pastille personnalisé, s'il est fourni. */
  protected readonly customIndicator = contentChild(StepIndicator);

  /** Les panneaux Aria rendus par le template, dans l'ordre des étapes. */
  private readonly panels = viewChildren(TabPanel);

  /** Aria identifie les onglets par une `value` string : on utilise l'index. */
  protected readonly selectedValue = computed(() => `${this.selectedIndex()}`);

  /** État visuel de chaque étape. */
  protected readonly states = computed<StepState[]>(() =>
    this.steps().map((step, index) => {
      if (step.error()) return 'error';
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
      if (this.linear() && step.completed() === false && !step.optional()) blocked = true;
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

  // Classes calculées à partir des variantes cva, combinées via cn().
  protected readonly rootClass = computed(() =>
    cn(stepperVariants({ orientation: this.orientation() })),
  );
  protected readonly listClass = computed(() =>
    cn(stepListVariants({ orientation: this.orientation() })),
  );
  protected readonly triggerClass = cn(stepTriggerVariants());
  protected readonly connectorClass = (complete: boolean) =>
    cn(
      stepConnectorVariants({
        complete,
        orientation: this.orientation(),
        size: this.size(),
      }),
    );

  constructor() {
    // Annonce chaque changement d'étape (hors affichage initial) : utile quand la navigation
    // vient d'un bouton « Suivant », où le focus n'est pas sur la liste des étapes.
    let initial = true;
    effect(() => {
      const index = this.selectedIndex();
      if (initial) {
        initial = false;
        return;
      }
      // untracked : seul un changement d'index doit déclencher une annonce.
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

  /** Va à l'étape atteignable précédente et place le focus sur son contenu. */
  previous(): void {
    if (!this.hasPrevious()) return;
    this.selectedIndex.set(this.previousIndex());
    this.focusSelectedPanel();
  }

  /** Va à l'étape atteignable suivante et place le focus sur son contenu. */
  next(): void {
    if (!this.hasNext()) return;
    this.selectedIndex.set(this.nextIndex());
    this.focusSelectedPanel();
  }

  /**
   * Le panneau n'est visible qu'après le prochain rendu : afterNextRender attend que le DOM
   * soit à jour avant de déplacer le focus (le panneau visible a tabindex="0" grâce à Aria).
   */
  private focusSelectedPanel(): void {
    afterNextRender(() => this.panels()[this.selectedIndex()]?.element.focus(), {
      injector: this.injector,
    });
  }

  protected onSelectedValueChange(value: string | undefined): void {
    if (value !== undefined) this.selectedIndex.set(Number(value));
  }
}
