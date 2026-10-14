import { cva } from 'class-variance-authority';

/** État visuel d'une étape, dérivé par le stepper. */
export type StepState = 'upcoming' | 'current' | 'complete';

/** Pastille ronde (numéro ou coche) devant le libellé. */
export const stepIndicatorVariants = cva(
  'flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
  {
    variants: {
      state: {
        upcoming: 'border-border text-muted-foreground',
        current: 'border-primary bg-primary text-primary-foreground',
        complete: 'border-primary text-primary',
      },
    },
    defaultVariants: { state: 'upcoming' },
  },
);

export const stepLabelVariants = cva('text-sm transition-colors', {
  variants: {
    state: {
      upcoming: 'text-muted-foreground',
      current: 'font-medium text-foreground',
      complete: 'text-foreground',
    },
  },
  defaultVariants: { state: 'upcoming' },
});

/** Trait reliant deux étapes : coloré une fois l'étape précédente terminée. */
export const stepConnectorVariants = cva(
  'h-0.5 flex-1 rounded-full transition-colors',
  {
    variants: {
      complete: {
        true: 'bg-primary',
        false: 'bg-border',
      },
    },
    defaultVariants: { complete: false },
  },
);
