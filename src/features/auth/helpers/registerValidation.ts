export const validateFullName = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return "Full name is required.";
  if (trimmed.split(/\s+/).length < 2)
    return "Please enter your first and last name.";
  return null;
};

export const validateEmail = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return "Email address is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return "Please enter a valid email address.";
  return null;
};

export const validatePassword = (value: string): string | null => {
  if (!value) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(value))
    return "Password must contain at least one uppercase letter.";
  if (!/[0-9]/.test(value)) return "Password must contain at least one number.";
  return null;
};

export const validateConfirmPassword = (
  value: string,
  password: string,
): string | null => {
  if (!value) return "Please confirm your password.";
  if (value !== password) return "Passwords do not match.";
  return null;
};
