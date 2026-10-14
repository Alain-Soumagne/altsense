import { NgTemplateOutlet } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  Component,
  ElementRef,
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
  viewChild,
  viewChildren,
} from '@angular/core';
import {
  ActivatedRoute,
  IsActiveMatchOptions,
  Router,
  RouterLink,
  UrlTree,
  containsTree,
} from '@angular/router';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { cn } from '@altsense/ui/core';
import { Step, StepLink } from './step';
import { StepHeader } from './step-header';
import { StepIndicator } from './step-templates';
import {
  StepState,
  StepperOrientation,
  StepperSize,
  stepConnectorVariants,
  stepItemVariants,
  stepListVariants,
  stepTriggerVariants,
  stepperVariants,
} from './stepper.variants';

/** Une étape est active si l'URL courante contient son chemin (sous-routes incluses). */
const ACTIVE_MATCH: IsActiveMatchOptions = {
  paths: 'subset',
  queryParams: 'ignored',
  matrixParams: 'ignored',
  fragment: 'ignored',
};

/**
 * Stepper avec deux rendus :
 *
 * - **onglets** (par défaut) : construit sur le pattern Tabs d'Angular Aria, qui fournit les rôles
 *   ARIA, le focus « roving », la navigation clavier et la gestion des onglets désactivés ;
 * - **router** (dès qu'une étape a un `link`) : une `<nav>` de liens `routerLink`, car une étape
 *   qui change l'URL est une navigation, pas un onglet. Le contenu vient du `<router-outlet>`
 *   projeté dans le stepper, et l'étape courante est déduite de l'URL.
 *
 * Dans les deux cas, le stepper gère l'état des étapes, le mode linéaire, la navigation
 * précédente / suivante, le focus et les annonces aux lecteurs d'écran.
 */
@Component({
  selector: 'as-stepper',
  imports: [Tabs, TabList, Tab, TabPanel, TabContent, NgTemplateOutlet, RouterLink, StepHeader],
  templateUrl: './stepper.html',
  host: { class: 'block' },
})
export class Stepper {
  private readonly announcer = inject(LiveAnnouncer);
  private readonly injector = inject(Injector);
  private readonly router = inject(Router);
  /** Route du composant hôte : base des liens relatifs (absente si l'app n'a pas de routes). */
  private readonly route = inject(ActivatedRoute, { optional: true });

  /** Index de l'étape courante (two-way binding : `[(selectedIndex)]`). */
  readonly selectedIndex = model(0);

  /** Mode linéaire : impossible d'atteindre une étape tant qu'une précédente n'est pas terminée. */
  readonly linear = input(false, { transform: booleanAttribute });

  /** Disposition : également transmise à Aria (flèches gauche/droite ou haut/bas). */
  readonly orientation = input<StepperOrientation>('horizontal');

  readonly size = input<StepperSize>('md');

  /** Nom accessible de la liste des étapes (`<as-stepper aria-label="…">`). */
  readonly ariaLabel = input('Étapes', { alias: 'aria-label' });

  /** Les `<as-step>` projetés dans le stepper. */
  protected readonly steps = contentChildren(Step);

  /** Template de pastille personnalisé, s'il est fourni. */
  protected readonly customIndicator = contentChild(StepIndicator);

  /** Les panneaux Aria rendus par le template, dans l'ordre des étapes (mode onglets). */
  private readonly panels = viewChildren(TabPanel);

  /** Conteneur du `<router-outlet>` projeté (mode router). */
  private readonly routedContent = viewChild<ElementRef<HTMLElement>>('routedContent');

  /** Mode router : activé dès qu'une étape déclare un `link`. */
  protected readonly routed = computed(() =>
    this.steps().some((step) => step.link() !== undefined),
  );

  /** URL de chaque étape, résolue une fois pour le `routerLink` et la détection de l'étape active. */
  protected readonly urlTrees = computed(() =>
    this.steps().map((step) => {
      const link = step.link();
      return link === undefined ? null : this.toUrlTree(link);
    }),
  );

  /**
   * Index de l'étape correspondant à l'URL courante, ou -1.
   * `lastSuccessfulNavigation` est un signal du Router : ce computed se met à jour à chaque navigation.
   */
  private readonly activeRouteIndex = computed(() => {
    const url = this.router.lastSuccessfulNavigation()?.finalUrl;
    if (!url) return -1;
    return this.urlTrees().findIndex(
      (tree) => tree !== null && containsTree(url, tree, ACTIVE_MATCH),
    );
  });

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
  protected readonly itemClass = computed(() =>
    cn(stepItemVariants({ orientation: this.orientation() })),
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
    // Mode router : l'URL est la source de vérité, l'index la suit.
    effect(() => {
      const index = this.activeRouteIndex();
      if (index !== -1) this.selectedIndex.set(index);
    });

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
    if (this.hasPrevious()) this.goTo(this.previousIndex());
  }

  /** Va à l'étape atteignable suivante et place le focus sur son contenu. */
  next(): void {
    if (this.hasNext()) this.goTo(this.nextIndex());
  }

  private goTo(index: number): void {
    const tree = this.urlTrees()[index];
    if (tree) {
      // Mode router : on navigue, l'index sera mis à jour par l'effet de synchronisation.
      void this.router.navigateByUrl(tree).then((navigated) => {
        if (navigated) this.focusContent();
      });
    } else {
      this.selectedIndex.set(index);
      this.focusContent();
    }
  }

  /**
   * Le contenu n'est à jour qu'après le prochain rendu : afterNextRender attend le DOM avant de
   * déplacer le focus (panneau Aria avec tabindex="0", ou conteneur du router-outlet).
   */
  private focusContent(): void {
    afterNextRender(
      () => {
        const target = this.routed()
          ? this.routedContent()?.nativeElement
          : this.panels()[this.selectedIndex()]?.element;
        target?.focus();
      },
      { injector: this.injector },
    );
  }

  private toUrlTree(link: StepLink): UrlTree {
    if (link instanceof UrlTree) return link;
    const commands = typeof link === 'string' ? [link] : [...link];
    return this.router.createUrlTree(commands, { relativeTo: this.route });
  }

  protected onSelectedValueChange(value: string | undefined): void {
    if (value !== undefined) this.selectedIndex.set(Number(value));
  }
}
