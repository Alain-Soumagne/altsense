import { InjectionToken } from '@angular/core';
import type { Stepper } from './stepper';

// A token instead of the class avoids a runtime import cycle between the stepper and its parts.
export const STEPPER = new InjectionToken<Stepper>('Stepper');
