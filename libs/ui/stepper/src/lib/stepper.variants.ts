import { cva, type VariantProps } from 'class-variance-authority';

export type StepState = 'upcoming' | 'current' | 'complete' | 'error';

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

export const stepItemVariants = cva('flex', {
  variants: {
    orientation: {
      horizontal: 'flex-1 items-center gap-3 last:flex-none',
      vertical: 'flex-col gap-1',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

export const stepTriggerVariants = cva(
  'flex cursor-pointer items-center gap-2 rounded-md p-1 text-left outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
);

export const stepIndicatorVariants = cva(
  'flex shrink-0 items-center justify-center rounded-full border-2 font-medium transition-colors',
  {
    variants: {
      state: {
        upcoming: 'border-border text-muted-foreground',
        current: 'border-primary bg-primary text-primary-foreground',
        complete: 'border-primary text-primary',
        error: 'border-danger bg-danger text-danger-foreground',
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
      error: 'font-medium text-danger',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { state: 'upcoming', size: 'md' },
});

export const stepHintVariants = cva('text-xs', {
  variants: {
    error: {
      true: 'text-danger',
      false: 'text-muted-foreground',
    },
  },
  defaultVariants: { error: false },
});

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
  // Centers the vertical line under the indicator: trigger padding + half indicator - half line.
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

export type StepperOrientation = NonNullable<VariantProps<typeof stepperVariants>['orientation']>;
export type StepperSize = NonNullable<VariantProps<typeof stepIndicatorVariants>['size']>;
