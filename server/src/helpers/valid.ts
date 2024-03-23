class UserValidator {
  validateUserName(userName: string): boolean {
    if (userName.length < 3 || userName.length > 20) {
      return false;
    }

    const regex = /^[a-zA-Z0-9_-]+$/;
    if (!regex.test(userName)) {
      return false;
    }

    if (userName.includes(" ")) {
      return false;
    }

    return true;
  }

  validatePassword(password: string): boolean {
    if (password.length < 10) {
      return false;
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{10,}$/;
    if (!regex.test(password)) {
      return false;
    }

    return true;
  }
}

export default new UserValidator();
