import { Component, signal } from '@angular/core';
import { cn } from '@altsense/ui/core';

@Component({
  selector: 'as-root',
  templateUrl: './app.html',
  host: { class: 'block min-h-dvh' },
})
export class App {
  protected readonly dark = signal(false);

  protected readonly swatches = [
    { name: 'primary', class: 'bg-primary text-primary-foreground' },
    { name: 'success', class: 'bg-success text-success-foreground' },
    { name: 'danger', class: 'bg-danger text-danger-foreground' },
    { name: 'muted', class: 'bg-muted text-muted-foreground' },
    { name: 'surface', class: 'bg-surface text-foreground border' },
  ];

  protected readonly swatchClass = (extra: string) =>
    cn('flex h-20 items-end rounded-md p-3 text-sm font-medium', extra);

  protected toggleTheme(): void {
    this.dark.update((d) => !d);
    document.documentElement.dataset['theme'] = this.dark() ? 'dark' : 'light';
  }
}
