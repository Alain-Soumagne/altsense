import { Component, computed, signal } from '@angular/core';
import { Step, Stepper } from '@altsense/ui/stepper';

@Component({
  imports: [Stepper, Step],
  selector: 'as-root',
  templateUrl: './app.html',
  host: { class: 'block min-h-dvh' },
})
export class App {
  protected readonly dark = signal(false);
  protected readonly currentStep = signal(0);

  protected readonly name = signal('');
  protected readonly address = signal('');
  protected readonly nameValid = computed(() => this.name().trim().length >= 2);
  protected readonly addressValid = computed(
    () => this.address().trim().length >= 5,
  );

  protected toggleTheme(): void {
    this.dark.update((d) => !d);
    document.documentElement.dataset['theme'] = this.dark() ? 'dark' : 'light';
  }
}
