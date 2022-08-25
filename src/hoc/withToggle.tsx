import React, {FC, useState} from 'react';
import { Checkbox } from '@consta/uikit/Checkbox';

type InjectedProps = {
  checkboxLabel: string;
  checkboxClassName?: string;
};

export default function withToggle<T>(Component: FC<T>) {
  return function(props: T & InjectedProps) {
    const { checkboxLabel, checkboxClassName, ...restProps } = props;

    const [isDisabled, setIsDisabled] = useState(true);

    return (
        <>
          <Checkbox
              className={checkboxClassName}
              size="l"
              label={checkboxLabel}
              checked={!isDisabled}
              onChange={() => setIsDisabled(!isDisabled)}
          />
          <Component disabled={isDisabled} required={!isDisabled} {...(restProps as T & InjectedProps)} />
        </>
    );
  };
}
