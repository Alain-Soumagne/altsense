import { Component, inject } from '@angular/core';
import { TabPanel } from '@angular/aria/tabs';

@Component({
  selector: 'as-step-panel',
  template: '<ng-content />',
  hostDirectives: [{ directive: TabPanel, inputs: ['value'] }],
  host: {
    class:
      'block min-w-0 flex-1 rounded-md outline-ring focus-visible:outline-2 focus-visible:outline-offset-4',
    // Aria makes hidden panels inert but does not hide them visually.
    '[hidden]': '!visible()',
  },
})
export class StepPanel {
  private readonly panel = inject(TabPanel);

  readonly visible = this.panel.visible;
  readonly element = this.panel.element;
}
