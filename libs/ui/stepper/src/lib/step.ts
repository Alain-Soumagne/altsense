import { Component, TemplateRef, input, viewChild } from '@angular/core';

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
  /** Libellé affiché dans la liste des étapes. */
  readonly label = input.required<string>();

  /** Contenu de l'étape, rendu par le stepper. */
  readonly content = viewChild.required(TemplateRef);
}
