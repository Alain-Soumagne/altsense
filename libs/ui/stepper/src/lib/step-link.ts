import { Component, computed, inject, input } from '@angular/core';
import {
  ActivatedRoute,
  IsActiveMatchOptions,
  Router,
  RouterLink,
  UrlTree,
  containsTree,
} from '@angular/router';
import { cn } from '@altsense/ui/core';
import { STEP_INPUTS, Step } from './step';
import { StepHeader } from './step-header';
import { stepTriggerVariants } from './stepper.variants';

export type StepLinkTarget = string | readonly unknown[] | UrlTree;

const ACTIVE_MATCH: IsActiveMatchOptions = {
  paths: 'subset',
  queryParams: 'ignored',
  matrixParams: 'ignored',
  fragment: 'ignored',
};

@Component({
  selector: 'as-step-link',
  imports: [RouterLink, StepHeader],
  hostDirectives: [{ directive: Step, inputs: STEP_INPUTS }],
  host: { role: 'listitem' },
  template: `
    @if (step.reachable()) {
      <a
        [routerLink]="urlTree()"
        [attr.aria-current]="step.current() ? 'step' : null"
        [class]="triggerClass"
      >
        <as-step-header [step]="step" />
      </a>
    } @else {
      <!-- No href, but still focusable so keyboard users can discover it. -->
      <a role="link" aria-disabled="true" tabindex="0" [class]="triggerClass">
        <as-step-header [step]="step" />
      </a>
    }
    @if (!step.last()) {
      <span aria-hidden="true" [class]="step.connectorClass()"></span>
    }
  `,
})
export class StepLink {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute, { optional: true });
  protected readonly step = inject(Step);

  /** Same forms as `routerLink`; relative links resolve against the stepper host's route. */
  readonly link = input.required<StepLinkTarget>();

  readonly urlTree = computed(() => {
    const link = this.link();
    if (link instanceof UrlTree) return link;
    const commands = typeof link === 'string' ? [link] : [...link];
    return this.router.createUrlTree(commands, { relativeTo: this.route });
  });

  readonly active = computed(() => {
    const url = this.router.lastSuccessfulNavigation()?.finalUrl;
    return !!url && containsTree(url, this.urlTree(), ACTIVE_MATCH);
  });

  protected readonly triggerClass = cn(stepTriggerVariants());
}
