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

const ACTIVE_MATCH: IsActiveMatchOptions = {
  paths: 'subset',
  queryParams: 'ignored',
  matrixParams: 'ignored',
  fragment: 'ignored',
};

/**
 * Renders Aria tabs by default, or a `<nav>` of router links as soon as a step has a `link`:
 * a step that changes the URL is navigation, not a tab.
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
  private readonly route = inject(ActivatedRoute, { optional: true });

  readonly selectedIndex = model(0);

  readonly linear = input(false, { transform: booleanAttribute });

  readonly orientation = input<StepperOrientation>('horizontal');

  readonly size = input<StepperSize>('md');

  readonly ariaLabel = input('Étapes', { alias: 'aria-label' });

  protected readonly steps = contentChildren(Step);

  protected readonly customIndicator = contentChild(StepIndicator);

  private readonly panels = viewChildren(TabPanel);

  private readonly routedContent = viewChild<ElementRef<HTMLElement>>('routedContent');

  protected readonly routed = computed(() =>
    this.steps().some((step) => step.link() !== undefined),
  );

  protected readonly urlTrees = computed(() =>
    this.steps().map((step) => {
      const link = step.link();
      return link === undefined ? null : this.toUrlTree(link);
    }),
  );

  private readonly activeRouteIndex = computed(() => {
    const url = this.router.lastSuccessfulNavigation()?.finalUrl;
    if (!url) return -1;
    return this.urlTrees().findIndex(
      (tree) => tree !== null && containsTree(url, tree, ACTIVE_MATCH),
    );
  });

  protected readonly selectedValue = computed(() => `${this.selectedIndex()}`);

  protected readonly states = computed<StepState[]>(() =>
    this.steps().map((step, index) => {
      if (step.error()) return 'error';
      if (index === this.selectedIndex()) return 'current';
      const completed = step.completed() ?? index < this.selectedIndex();
      return completed ? 'complete' : 'upcoming';
    }),
  );

  protected readonly reachable = computed<boolean[]>(() => {
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
    const tree = this.urlTrees()[index];
    if (tree) {
      // selectedIndex follows through the URL sync effect.
      void this.router.navigateByUrl(tree).then((navigated) => {
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
