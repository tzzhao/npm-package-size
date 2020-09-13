import {render, RenderResult} from '@testing-library/react';
import renderer from 'react-test-renderer';
import * as React from 'react';
import {Hello} from './hello';

test('Sanity test', () => {
  const renderResult: RenderResult = render(<Hello />);
  expect(renderResult.baseElement.textContent).toBe("Hello ");
});

test('Sanity test - SNAPSHOT', () => {
  const component = renderer.create(<Hello />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Test name property', () => {
  const renderResult: RenderResult = render(<Hello name="World" />);
  expect(renderResult.baseElement.textContent).toBe("Hello World");
});

test('Test name property - SNAPSHOT', () => {
  const component = renderer.create(<Hello name="World" />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Test html name tag is not interpreted', () => {
  const renderResult: RenderResult = render(<Hello name="World <div>test</div>" />);
  expect(renderResult.baseElement.textContent).toBe("Hello World <div>test</div>");
});

test('Test html name tag is not interpreted - SNAPSHOT', () => {
  const component = renderer.create(<Hello name="World <div>test</div>" />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
