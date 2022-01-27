import * as React from 'react';
import {AuthContext} from './AuthContext';


export const useAuth = () => {
  const values = React.useContext(AuthContext)
  return values;
}