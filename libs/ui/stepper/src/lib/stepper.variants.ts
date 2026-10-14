import { cva, type VariantProps } from 'class-variance-authority';

/** État visuel d'une étape, dérivé par le stepper. */
export type StepState = 'upcoming' | 'current' | 'complete';

/** Conteneur racine : liste des étapes au-dessus (horizontal) ou à gauche (vertical) du contenu. */
export const stepperVariants = cva('flex', {
  variants: {
    orientation: {
      horizontal: 'flex-col gap-6',
      vertical: 'flex-row gap-8',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

export const stepListVariants = cva('flex', {
  variants: {
    orientation: {
      horizontal: 'flex-row items-center gap-3',
      vertical: 'shrink-0 flex-col gap-1',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

/** Pastille ronde (numéro ou coche) devant le libellé. */
export const stepIndicatorVariants = cva(
  'flex shrink-0 items-center justify-center rounded-full border-2 font-medium transition-colors',
  {
    variants: {
      state: {
        upcoming: 'border-border text-muted-foreground',
        current: 'border-primary bg-primary text-primary-foreground',
        complete: 'border-primary text-primary',
      },
      size: {
        sm: 'size-6 text-xs',
        md: 'size-8 text-sm',
        lg: 'size-10 text-base',
      },
    },
    defaultVariants: { state: 'upcoming', size: 'md' },
  },
);

export const stepLabelVariants = cva('transition-colors', {
  variants: {
    state: {
      upcoming: 'text-muted-foreground',
      current: 'font-medium text-foreground',
      complete: 'text-foreground',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { state: 'upcoming', size: 'md' },
});

/** Trait reliant deux étapes : coloré une fois l'étape précédente terminée. */
export const stepConnectorVariants = cva('rounded-full transition-colors', {
  variants: {
    complete: {
      true: 'bg-primary',
      false: 'bg-border',
    },
    orientation: {
      horizontal: 'h-0.5 min-w-4 flex-1',
      vertical: 'h-6 w-0.5',
    },
    size: { sm: '', md: '', lg: '' },
  },
  // En vertical, le trait doit passer sous le centre de la pastille :
  // marge = padding de l'onglet (p-1) + moitié de la pastille - moitié du trait.
  compoundVariants: [
    {
      orientation: 'vertical',
      size: 'sm',
      class: 'ml-[calc(--spacing(1)+--spacing(3)-1px)]',
    },
    {
      orientation: 'vertical',
      size: 'md',
      class: 'ml-[calc(--spacing(1)+--spacing(4)-1px)]',
    },
    {
      orientation: 'vertical',
      size: 'lg',
      class: 'ml-[calc(--spacing(1)+--spacing(5)-1px)]',
    },
  ],
  defaultVariants: { complete: false, orientation: 'horizontal', size: 'md' },
});

/** Valeurs acceptées par les inputs du stepper, déduites des variantes cva. */
export type StepperOrientation = NonNullable<VariantProps<typeof stepperVariants>['orientation']>;
export type StepperSize = NonNullable<VariantProps<typeof stepIndicatorVariants>['size']>;
