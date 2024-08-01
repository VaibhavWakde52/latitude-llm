import { forwardRef, InputHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { FormField, type FormFieldProps } from '$ui/ds/atoms/FormField'
import { font } from '$ui/ds/tokens'
import { cn } from '$ui/lib/utils'

export const INPUT_BASE_CLASSES = [
  'flex w-full border border-input bg-background ring-offset-background',
  'file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-ring rounded-md focus-visible:ring-2',
  'disabled:cursor-not-allowed disabled:opacity-50',
  font.size.h5,
]
export const INPUT_VARIANT_SIZE = {
  normal: 'px-2 py-1  focus-visible:ring-offset-2',
  small: 'px-1 rounded-sm focus-visible:ring-offset-1',
}

const inputVariants = cva(cn(INPUT_BASE_CLASSES), {
  variants: {
    size: {
      normal: `${INPUT_VARIANT_SIZE.normal} h-8`,
      small: INPUT_VARIANT_SIZE.small,
    },
  },
  defaultVariants: {
    size: 'normal',
  },
})

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  VariantProps<typeof inputVariants> &
  Omit<FormFieldProps, 'children'>
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, errors, errorStyle, description, type, size, ...props },
  ref,
) {
  return (
    <FormField
      label={label}
      description={description}
      errors={errors}
      errorStyle={errorStyle}
    >
      <input
        ref={ref}
        type={type}
        className={cn(inputVariants({ size }), className, {
          'border-red-500 focus-visible:ring-red-500': errors,
        })}
        {...props}
      />
    </FormField>
  )
})

export { Input }
