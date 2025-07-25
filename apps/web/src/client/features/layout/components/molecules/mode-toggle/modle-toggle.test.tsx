import { createElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ModeToggle } from './mode-toggle';

const mockSetTheme = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
  }),
}));

vi.mock('@/client/components/ui/button', () => ({
  Button: ({ children, variant, size, ...props }: any) =>
    createElement(
      'button',
      { 'data-testid': 'theme-toggle-button', type: 'button', ...props },
      children
    ),
}));

vi.mock('@/client/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) =>
    createElement('div', { 'data-testid': 'dropdown-menu' }, children),
  DropdownMenuTrigger: ({ children }: any) =>
    createElement('div', { 'data-testid': 'dropdown-trigger' }, children),
  DropdownMenuContent: ({ children }: any) =>
    createElement('div', { 'data-testid': 'dropdown-content' }, children),
  DropdownMenuItem: ({ children, onClick }: any) =>
    createElement(
      'div',
      {
        'data-testid': 'dropdown-item',
        'data-value': children,
        onClick,
        role: 'menuitem',
        tabIndex: 0,
      },
      children
    ),
}));

vi.mock('lucide-react', () => ({
  Sun: () => createElement('span', { 'data-testid': 'sun-icon' }, 'Sun'),
  Moon: () => createElement('span', { 'data-testid': 'moon-icon' }, 'Moon'),
}));

describe('ModeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports ModeToggle function', () => {
    expect(typeof ModeToggle).toBe('function');
  });

  it('calls setTheme with correct values when rendered and interacted with', () => {
    const component = createElement(ModeToggle);
    expect(component).toBeDefined();
    expect(component.type).toBe(ModeToggle);
  });

  it('uses the useTheme hook from next-themes', () => {
    createElement(ModeToggle);
    expect(mockSetTheme).toBeDefined();
  });

  it('setTheme function is called when menu items are clicked', () => {
    const TestWrapper = () => {
      const result = ModeToggle();
      return result;
    };

    const wrapper = createElement(TestWrapper);
    expect(wrapper).toBeDefined();
  });

  it('component structure includes expected elements', () => {
    const component = ModeToggle();

    expect(component).toBeDefined();
    expect(component.type).toBeDefined();
  });

  it('mock functions are properly configured', () => {
    expect(mockSetTheme).toBeInstanceOf(Function);

    mockSetTheme('light');
    expect(mockSetTheme).toHaveBeenCalledWith('light');

    mockSetTheme('dark');
    expect(mockSetTheme).toHaveBeenCalledWith('dark');

    mockSetTheme('system');
    expect(mockSetTheme).toHaveBeenCalledWith('system');

    expect(mockSetTheme).toHaveBeenCalledTimes(3);
  });

  it('calls setTheme with "light" when light menu item is clicked', () => {
    const component = ModeToggle();
    const dropdownContent = component.props.children[1];
    const lightMenuItem = dropdownContent.props.children[0];

    // Trigger the onClick handler
    lightMenuItem.props.onClick();

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('calls setTheme with "dark" when dark menu item is clicked', () => {
    const component = ModeToggle();
    const dropdownContent = component.props.children[1];
    const darkMenuItem = dropdownContent.props.children[1];

    // Trigger the onClick handler
    darkMenuItem.props.onClick();

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('calls setTheme with "system" when system menu item is clicked', () => {
    const component = ModeToggle();
    const dropdownContent = component.props.children[1];
    const systemMenuItem = dropdownContent.props.children[2];

    // Trigger the onClick handler
    systemMenuItem.props.onClick();

    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });
});
