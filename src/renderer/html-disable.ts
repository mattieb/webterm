export const disable = (element: HTMLElement) =>
  element.setAttribute("disabled", "true");

export const enable = (element: HTMLElement) =>
  element.removeAttribute("disabled");
