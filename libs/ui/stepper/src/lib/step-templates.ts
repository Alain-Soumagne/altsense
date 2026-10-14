import { Directive, TemplateRef, inject } from '@angular/core';
import { StepState } from './stepper.variants';

/** Contexte fourni au template `asStepIndicator`. */
export interface StepIndicatorContext {
  /** État de l'étape (accessible via `let-state`). */
  $implicit: StepState;
  /** Index de l'étape (accessible via `let-index="index"`). */
  index: number;
}

/**
 * Remplace le contenu de la pastille de toutes les étapes.
 *
 * ```html
 * <as-stepper>
 *   <ng-template asStepIndicator let-state let-index="index">…</ng-template>
 * </as-stepper>
 * ```
 */
@Directive({ selector: 'ng-template[asStepIndicator]' })
export class StepIndicator {
  readonly template = inject<TemplateRef<StepIndicatorContext>>(TemplateRef);

  /** Permet au compilateur de typer `let-state` et `let-index` dans le template. */
  static ngTemplateContextGuard(_dir: StepIndicator, _ctx: unknown): _ctx is StepIndicatorContext {
    return true;
  }
}

/**
 * Remplace le libellé texte d'une étape par un contenu riche.
 *
 * ```html
 * <as-step label="Paiement">
 *   <ng-template asStepLabel>Paiement <em>sécurisé</em></ng-template>
 * </as-step>
 * ```
 */
@Directive({ selector: 'ng-template[asStepLabel]' })
export class StepLabel {
  readonly template = inject(TemplateRef);
}
