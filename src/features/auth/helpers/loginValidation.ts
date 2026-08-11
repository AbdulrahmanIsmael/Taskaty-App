export const validateEmail = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return "Email address is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return "Please enter a valid email address.";
  return null;
};

export const validatePassword = (value: string): string | null => {
  if (!value) return "Password is required.";
  return null;
};
