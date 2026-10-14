import { cn } from './cn';

describe('cn', () => {
  it('concatène les classes conditionnelles', () => {
    const isHidden = false;
    expect(cn('px-2', isHidden && 'hidden', { 'font-bold': true })).toBe(
      'px-2 font-bold',
    );
  });

  it('laisse la dernière classe Tailwind gagner en cas de conflit', () => {
    expect(cn('px-2 py-1 bg-primary', 'px-4 bg-danger')).toBe(
      'py-1 px-4 bg-danger',
    );
  });
});
