import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { cn } from '@altsense/ui/core';
import { Step } from './step';
import { StepIndicator } from './step-templates';
import {
  StepState,
  StepperSize,
  stepHintVariants,
  stepIndicatorVariants,
  stepLabelVariants,
} from './stepper.variants';

/**
 * Contenu visuel d'une étape : pastille, libellé et texte secondaire.
 *
 * Composant interne (non exporté) : il est partagé par le rendu « onglets » et le rendu
 * « liens » du stepper. `display: contents` laisse ses enfants s'aligner dans le déclencheur.
 */
@Component({
  selector: 'as-step-header',
  imports: [NgTemplateOutlet],
  templateUrl: './step-header.html',
  host: { class: 'contents' },
})
export class StepHeader {
  readonly step = input.required<Step>();
  readonly index = input.required<number>();
  readonly state = input.required<StepState>();
  readonly size = input.required<StepperSize>();
  readonly customIndicator = input<StepIndicator>();

  protected readonly indicatorClass = computed(() =>
    cn(stepIndicatorVariants({ state: this.state(), size: this.size() })),
  );
  protected readonly labelClass = computed(() =>
    cn(stepLabelVariants({ state: this.state(), size: this.size() })),
  );
  protected readonly hintClass = computed(() =>
    cn(stepHintVariants({ error: this.state() === 'error' })),
  );

  /** Texte secondaire : message d'erreur, sinon description, sinon « Optionnel ». */
  protected readonly hint = computed(() => {
    const step = this.step();
    const error = step.error();
    if (typeof error === 'string' && error) return error;
    return step.description() ?? (step.optional() ? 'Optionnel' : undefined);
  });

  /** Texte lu uniquement par les lecteurs d'écran pour compléter l'état visuel. */
  protected readonly srStatus = computed(() => {
    if (this.state() === 'complete') return ', terminée';
    if (this.state() === 'error') return ', en erreur';
    return '';
  });
}
