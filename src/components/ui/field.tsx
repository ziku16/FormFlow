"use client";

import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

type FieldPresentation = {
  label: string;
  hint?: ReactNode;
  error?: string;
  wrapperClassName?: string;
  optional?: boolean;
};

function FieldLabel({
  id,
  label,
  required,
  optional,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <label htmlFor={id}>
      {label}
      {required && (
        <span className="required" aria-hidden="true">
          *
        </span>
      )}
      {optional && (
        <span className="muted" style={{ fontWeight: 400 }}>
          {" "}
          (optional)
        </span>
      )}
    </label>
  );
}

function FieldMessages({
  id,
  hint,
  error,
}: {
  id: string;
  hint?: ReactNode;
  error?: string;
}) {
  return (
    <>
      {hint && (
        <span id={`${id}-hint`} className="hint">
          {hint}
        </span>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}

function describedBy(
  id: string,
  hint: ReactNode,
  error: string | undefined,
  existing: string | undefined,
) {
  return (
    [
      existing,
      hint ? `${id}-hint` : undefined,
      error ? `${id}-error` : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined
  );
}

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  FieldPresentation;

export function Input({
  label,
  hint,
  error,
  wrapperClassName,
  optional,
  id: providedId,
  required,
  "aria-describedby": description,
  ...props
}: InputProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  return (
    <div className={cn("field", wrapperClassName)}>
      <FieldLabel
        id={id}
        label={label}
        required={required}
        optional={optional}
      />
      <input
        {...props}
        id={id}
        required={required}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={describedBy(id, hint, error, description)}
      />
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}

export type SelectOption = { value: string; label: string; disabled?: boolean };
export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  FieldPresentation & { options: readonly SelectOption[] };

export function Select({
  label,
  hint,
  error,
  wrapperClassName,
  optional,
  options,
  id: providedId,
  required,
  "aria-describedby": description,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  return (
    <div className={cn("field", wrapperClassName)}>
      <FieldLabel
        id={id}
        label={label}
        required={required}
        optional={optional}
      />
      <select
        {...props}
        id={id}
        required={required}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={describedBy(id, hint, error, description)}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  FieldPresentation;

export function Textarea({
  label,
  hint,
  error,
  wrapperClassName,
  optional,
  id: providedId,
  required,
  "aria-describedby": description,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  return (
    <div className={cn("field", wrapperClassName)}>
      <FieldLabel
        id={id}
        label={label}
        required={required}
        optional={optional}
      />
      <textarea
        {...props}
        id={id}
        required={required}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={describedBy(id, hint, error, description)}
      />
      <FieldMessages id={id} hint={hint} error={error} />
    </div>
  );
}

export type ChoiceProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "children"
> & {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  wrapperClassName?: string;
};

function Choice({
  type,
  label,
  hint,
  error,
  wrapperClassName,
  id: providedId,
  required,
  "aria-describedby": description,
  ...props
}: ChoiceProps & { type: "checkbox" | "radio" }) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  return (
    <div className={cn("field", wrapperClassName)}>
      <label className="choice" htmlFor={id}>
        <input
          {...props}
          id={id}
          type={type}
          required={required}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={describedBy(id, hint, error, description)}
        />
        <span>
          {label}
          {required && (
            <span className="required" aria-hidden="true">
              *
            </span>
          )}
          {hint && (
            <span id={`${id}-hint`} className="hint">
              {hint}
            </span>
          )}
        </span>
      </label>
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Checkbox(props: ChoiceProps) {
  return <Choice {...props} type="checkbox" />;
}
export function Radio(props: ChoiceProps) {
  return <Choice {...props} type="radio" />;
}
