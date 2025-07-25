import type { ReactNode } from 'react';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import Hero from './hero';

describe('Hero', () => {
  const defaultProps = {
    title: 'Test Hero Title',
    description: 'Test hero description',
  };

  it('renders without crashing', () => {
    const component = createElement(Hero, defaultProps);
    expect(component).toBeDefined();
    expect(component.type).toBe(Hero);
  });

  it('renders the correct component structure', () => {
    const component = Hero(defaultProps);
    expect(component.type).toBe('section');
  });

  it('applies correct CSS classes to the section', () => {
    const component = Hero(defaultProps);
    expect(component.props.className).toBe('space-y-6 pt-16 pb-8 text-center');
  });

  it('displays the title correctly', () => {
    const component = Hero(defaultProps);
    const contentDiv = component.props.children[0];
    const titleElement = contentDiv.props.children[0];

    expect(titleElement.type).toBe('h1');
    expect(titleElement.props.children).toBe('Test Hero Title');
  });

  it('applies correct styling to the title', () => {
    const component = Hero(defaultProps);
    const contentDiv = component.props.children[0];
    const titleElement = contentDiv.props.children[0];

    expect(titleElement.props.className).toBe(
      'bg-gradient-to-r from-primary to-primary/60 bg-clip-text font-bold text-4xl text-transparent md:text-6xl'
    );
  });

  it('displays the description correctly', () => {
    const component = Hero(defaultProps);
    const contentDiv = component.props.children[0];
    const descriptionElement = contentDiv.props.children[1];

    expect(descriptionElement.type).toBe('p');
    expect(descriptionElement.props.children).toBe('Test hero description');
  });

  it('applies correct styling to the description', () => {
    const component = Hero(defaultProps);
    const contentDiv = component.props.children[0];
    const descriptionElement = contentDiv.props.children[1];

    expect(descriptionElement.props.className).toBe(
      'mx-auto max-w-2xl text-muted-foreground text-xl leading-relaxed md:text-2xl'
    );
  });

  it('renders the decorative gradient line', () => {
    const component = Hero(defaultProps);
    const gradientLine = component.props.children[1];

    expect(gradientLine.type).toBe('div');
    expect(gradientLine.props.className).toBe(
      'mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-primary to-primary/60'
    );
  });

  it('handles different title values', () => {
    const customProps = {
      title: 'Custom Hero Title',
      description: 'Custom description',
    };

    const component = Hero(customProps);
    const contentDiv = component.props.children[0];
    const titleElement = contentDiv.props.children[0];

    expect(titleElement.props.children).toBe('Custom Hero Title');
  });

  it('handles different description values', () => {
    const customProps = {
      title: 'Title',
      description: 'This is a custom description with more details',
    };

    const component = Hero(customProps);
    const contentDiv = component.props.children[0];
    const descriptionElement = contentDiv.props.children[1];

    expect(descriptionElement.props.children).toBe(
      'This is a custom description with more details'
    );
  });

  it('handles ReactNode description content', () => {
    const jsxDescription = createElement(
      'span',
      null,
      'JSX Description Content'
    );
    const customProps = {
      title: 'Title',
      description: jsxDescription as ReactNode,
    };

    const component = Hero(customProps);
    const contentDiv = component.props.children[0];
    const descriptionElement = contentDiv.props.children[1];

    expect(descriptionElement.props.children).toBe(jsxDescription);
  });

  it('maintains correct component hierarchy', () => {
    const component = Hero(defaultProps);
    expect(component.type).toBe('section');

    const [contentDiv, gradientLine] = component.props.children;
    expect(contentDiv.type).toBe('div');
    expect(gradientLine.type).toBe('div');

    const [titleElement, descriptionElement] = contentDiv.props.children;
    expect(titleElement.type).toBe('h1');
    expect(descriptionElement.type).toBe('p');
  });

  it('applies space-y-4 class to content container', () => {
    const component = Hero(defaultProps);
    const contentDiv = component.props.children[0];

    expect(contentDiv.props.className).toBe('space-y-4');
  });

  it('renders with complex description content', () => {
    const complexDescription = createElement(
      'span',
      null,
      'Welcome to our ',
      createElement('strong', null, 'amazing'),
      ' platform!'
    );

    const customProps = {
      title: 'Complex Title',
      description: complexDescription as ReactNode,
    };

    const component = Hero(customProps);
    const contentDiv = component.props.children[0];
    const descriptionElement = contentDiv.props.children[1];

    expect(descriptionElement.props.children).toBe(complexDescription);
  });
});
