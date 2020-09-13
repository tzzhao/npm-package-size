import {ReactNode} from 'react';
import * as React from "react";

class HelloProps {
  public name?: string = '';
}

export class Hello extends React.Component<HelloProps> {
  render(): ReactNode {
    return <h1>Hello {this.props.name}</h1>;
  }
}
