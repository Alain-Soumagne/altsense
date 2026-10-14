# Alt Sense

Design system Angular construit pour apprendre : la logique et l'accessibilité reposent sur [Angular Aria](https://angular.dev/guide/aria/overview), le style sur Tailwind CSS v4 + CVA.

## Stack

| Outil                                          | Version         |
| ---------------------------------------------- | --------------- |
| Angular / `@angular/aria` / `@angular/cdk`     | 22.2            |
| Nx                                             | 23.3            |
| Tailwind CSS                                   | 4.3             |
| class-variance-authority, clsx, tailwind-merge | 0.7 / 2.1 / 3.7 |
| Vitest, Playwright                             | 4.1 / 1.64      |

## Structure

```
apps/
  playground/        # app de démo (zoneless) — pnpm start
  playground-e2e/    # tests Playwright
libs/
  ui/                # @altsense/ui — composants (Angular Aria + Tailwind + CVA)
    core/            # @altsense/ui/core — cn(), types partagés
    src/styles/      # altsense.css — tokens (variables --as-*, @theme Tailwind, dark mode)
```

La lib est publiable (ng-packagr). Les composants sont des **entry points secondaires** :

```bash
pnpm nx g @nx/angular:library-secondary-entry-point --library=ui --name=stepper --skipModule
```

## Thème

Les tokens sémantiques sont des variables CSS `--as-*`, exposées à Tailwind via `@theme inline` (`bg-primary`, `text-muted-foreground`, `border-border`…). Le thème sombre s'active avec `data-theme="dark"` sur `<html>` et la variante `dark:`.

Dans une app consommatrice :

```css
@import 'tailwindcss';
@import '@altsense/ui/styles/altsense.css';
```

## Commandes

```bash
pnpm start          # playground sur http://localhost:4200
pnpm test           # tests unitaires (Vitest)
pnpm lint
pnpm build          # libs → dist/libs, app → dist/apps
pnpm nx e2e playground-e2e
```
