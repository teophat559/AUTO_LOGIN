export const required = (value: any): string | undefined => {
  if (value === undefined || value === null || value === '') {
    return 'Trường này là bắt buộc';
  }
  return undefined;
};

export const minLength = (min: number) => (value: string): string | undefined => {
  if (value && value.length < min) {
    return `Tối thiểu ${min} ký tự`;
  }
  return undefined;
};

export const maxLength = (max: number) => (value: string): string | undefined => {
  if (value && value.length > max) {
    return `Tối đa ${max} ký tự`;
  }
  return undefined;
};

export const email = (value: string): string | undefined => {
  if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
    return 'Email không hợp lệ';
  }
  return undefined;
};

export const password = (value: string): string | undefined => {
  if (value && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)) {
    return 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số';
  }
  return undefined;
};

export const phoneNumber = (value: string): string | undefined => {
  if (value && !/^[0-9]{10}$/.test(value)) {
    return 'Số điện thoại không hợp lệ';
  }
  return undefined;
};

export const match = (field: string, fieldName: string) => (value: string, allValues: any): string | undefined => {
  if (value !== allValues[field]) {
    return `${fieldName} không khớp`;
  }
  return undefined;
};

export const number = (value: string): string | undefined => {
  if (value && isNaN(Number(value))) {
    return 'Giá trị phải là số';
  }
  return undefined;
};

export const min = (min: number) => (value: string): string | undefined => {
  if (value && Number(value) < min) {
    return `Giá trị tối thiểu là ${min}`;
  }
  return undefined;
};

export const max = (max: number) => (value: string): string | undefined => {
  if (value && Number(value) > max) {
    return `Giá trị tối đa là ${max}`;
  }
  return undefined;
};

export const url = (value: string): string | undefined => {
  if (value && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
    return 'URL không hợp lệ';
  }
  return undefined;
};

export const composeValidators = (...validators: Array<(value: any) => string | undefined>) => (
  value: any
): string | undefined => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return undefined;
};

export const validateForm = (values: any, validators: Record<string, Array<(value: any) => string | undefined>>) => {
  const errors: Record<string, string> = {};

  Object.keys(validators).forEach(field => {
    const fieldValidators = validators[field];
    const error = composeValidators(...fieldValidators)(values[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};