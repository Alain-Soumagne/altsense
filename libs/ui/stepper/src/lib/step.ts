import {
  Component,
  TemplateRef,
  booleanAttribute,
  contentChild,
  input,
  viewChild,
} from '@angular/core';
import { StepLabel } from './step-templates';

/**
 * Une étape du stepper.
 *
 * Le composant ne rend rien lui-même : son contenu projeté est capturé dans un
 * `<ng-template>` que le stepper affichera dans le bon panneau.
 */
@Component({
  selector: 'as-step',
  template: '<ng-template><ng-content /></ng-template>',
})
export class Step {
  /**
   * Libellé de l'étape. Toujours requis : même avec un template `asStepLabel`,
   * il sert de texte de référence (annonces aux lecteurs d'écran).
   */
  readonly label = input.required<string>();

  /** Texte secondaire affiché sous le libellé. */
  readonly description = input<string>();

  /**
   * Étape terminée ?
   * Non renseigné (`undefined`) : l'étape est considérée terminée dès qu'on l'a dépassée,
   * et ne bloque jamais le mode linéaire.
   */
  readonly completed = input<boolean | undefined>(undefined);

  /** Étape facultative : ne bloque pas le mode linéaire, même non terminée. */
  readonly optional = input(false, { transform: booleanAttribute });

  /** Étape inaccessible, quel que soit le mode. */
  readonly disabled = input(false, { transform: booleanAttribute });

  /**
   * Erreur sur l'étape : `true` pour l'état visuel seul, ou un message affiché
   * à la place de la description.
   */
  readonly error = input<boolean | string>(false);

  /** Contenu de l'étape, rendu par le stepper. */
  readonly content = viewChild.required(TemplateRef);

  /** Template de libellé personnalisé, s'il est fourni. */
  readonly customLabel = contentChild(StepLabel);
}
