import { FC, useEffect, useRef } from "react";
import { Path, PathValue, Validate, useController, useFormContext } from "react-hook-form";
import { Tooltip } from "@consta/uikit/Tooltip";

type InjectedProps<F> = {
  fieldName: Path<F>;
  disabled?: boolean;
  required?: boolean;
  requiredMessage?: string;
  validation?: Validate<PathValue<F, Path<F>>> | Record<string, Validate<PathValue<F, Path<F>>>>;
};

export default function withValidation<T, F>(Component: FC<T>) {
  return function(props: T & InjectedProps<F>) {
    const { fieldName, disabled, required, requiredMessage, validation, ...restProps } = props;

    const anchorRef = useRef(null);

    const {setValue, clearErrors} = useFormContext<F>();

    const {
      field: { ref, value, onChange, onBlur },
      fieldState: { error },
    } = useController<F>({
      name: fieldName,
      rules: {
        required: {
          value: required && !disabled,
          message: requiredMessage
        },
        validate: !disabled ? validation : null
      }
    });

    useEffect(() => {
      if (disabled) {
        setValue(fieldName, null);
        clearErrors(fieldName);
      }
    }, [disabled]);

    return (
        <>
          <Component
              ref={anchorRef}
              inputRef={ref}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              status={error ? "alert" : null}
              required={required}
              disabled={disabled}
              {...(restProps as T & InjectedProps<F>)}
          />

          {error && (
              <Tooltip style={{marginTop: -8}} anchorRef={anchorRef} size="l" status="alert" direction="rightStartDown">
                {error.message}
              </Tooltip>
          )}
        </>
    );
  };
}
