import { Component } from '../component';
import { getElementCustomProp } from '../core/utils/elementCustomProp';
import { COMPONENT_FLAG } from '../models/generics';

// Reset to clean, uninitialized template~
const reset = () => {
  document.body.innerHTML = `
    <div l-state="{ foo: 'bar' }">
      <p l-text="foo"></p>
    </div>
  `;
};

// Does overall checks on whether it is a component or not
const validateComponentFunctionality = (error = false) => {
  const componentElement = document.querySelector('body > div') as HTMLElement;
  const componentText = componentElement.querySelector('p') as HTMLElement;
  const component = getElementCustomProp(componentElement, COMPONENT_FLAG);

  if (error) {
    expect(component).toBeUndefined();
  } else {
    expect(component).toBeDefined();
    expect((component as Component).state).toEqual({ foo: 'bar' });
    expect(componentText.innerHTML).toEqual('bar');
  }
};

reset();

describe('.browser', () => {
  it('should initialize component on document load', () => {
    document.addEventListener('DOMContentLoaded', () => {
      validateComponentFunctionality();
    });
  });
});
