import { Component, ElementRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'as-step-outlet',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  host: {
    tabindex: '-1',
    class:
      'block min-w-0 flex-1 rounded-md outline-ring focus-visible:outline-2 focus-visible:outline-offset-4',
  },
})
export class StepOutlet {
  readonly element: HTMLElement = inject(ElementRef).nativeElement;
}
