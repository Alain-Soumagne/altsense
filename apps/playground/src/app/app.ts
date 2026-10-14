import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'as-root',
  templateUrl: './app.html',
  host: { class: 'block min-h-dvh' },
})
export class App {
  protected readonly dark = signal(false);

  protected readonly pages = [
    { path: '/stepper', label: 'Stepper' },
    { path: '/checkout', label: 'Stepper + router' },
  ];

  protected toggleTheme(): void {
    this.dark.update((d) => !d);
    document.documentElement.dataset['theme'] = this.dark() ? 'dark' : 'light';
  }
}
