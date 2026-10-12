const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignup = (data: any) => {
  const { name, email, password, role } = data;

  if (!name || !email || !password) {
    return "Name, email and password are required";
  }

  if (typeof name !== "string" || name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }

  if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    return "Invalid email format";
  }

  if (typeof password !== "string" || password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  if (role && role !== "contributor" && role !== "maintainer") {
    return "Invalid role";
  }

  return null;
};

export const validateLogin = (data: any) => {
  const { email, password } = data;

  if (!email || !password) {
    return "Email and password are required";
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return "Invalid email or password";
  }

  return null;
};
