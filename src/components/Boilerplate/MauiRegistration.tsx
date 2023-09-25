
import React from 'react';
import { ShinyComponents } from '../../consts';
import MauiProgram from './Components/MauiProgram';

interface Props {
  componentName: string
}

const MauiRegistration = (props: Props) => { 
  const components = ShinyComponents.filter(c => c.id === props.componentName);
  return (<MauiProgram components={components}/>);
};

export default MauiRegistration;