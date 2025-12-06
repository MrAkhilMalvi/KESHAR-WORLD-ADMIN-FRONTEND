let redirectToLogin: (() => void) | null = null;

export const setRedirectToLogin = (cb: () => void) => {
  redirectToLogin = cb;
};

export const handleUnauthorizedRedirect = () => {
  if (redirectToLogin) {
    redirectToLogin();
  } else {
    console.warn("Redirect callback not set");
  }
};
