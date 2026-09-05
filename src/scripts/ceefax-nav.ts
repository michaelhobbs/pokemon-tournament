import {
  navigate as transitionNavigate,
  supportsViewTransitions,
} from "astro:transitions/client";

export interface NavEntry {
  number: string;
  href: string;
  /** Hidden pages are reachable by number but skipped by arrow-key navigation. */
  hidden?: boolean;
}

interface NavData {
  pages: NavEntry[];
  current: string;
  help: string;
}

const DEBOUNCE_MS = 2000;
const CODE_LENGTH = 3;
const UNKNOWN_MS = 1500;
const TICKER_DURATION_MS = 30000;
const TICKER_EPOCH = Date.now();

interface NavWindow extends Window {
  ceefaxNavState?: NavData;
  ceefaxNavInstalled?: boolean;
  ceefaxNavPageLoadAttached?: boolean;
  ceefaxNavResizeAttached?: boolean;
}

const navigate = (href: string): void => {
  if (supportsViewTransitions) {
    transitionNavigate(href);
  } else {
    window.location.assign(href);
  }
};

const navWindow = window as NavWindow;

const currentState = (): NavData | null => navWindow.ceefaxNavState ?? null;

const getPageDisplay = (): HTMLElement | null =>
  document.getElementById("ceefax-pagebox");

const setDisplay = (
  display: HTMLElement,
  text: string,
  unknown: boolean,
): void => {
  display.textContent = text;
  display.setAttribute("data-unknown", String(unknown));
};

let buffer = "";
let timer: number | undefined;
let unknownTimer: number | undefined;

const syncDisplay = (state: NavData): void => {
  const display = getPageDisplay();
  if (!display) return;
  window.clearTimeout(unknownTimer);
  unknownTimer = undefined;
  setDisplay(display, state.current, false);
};

const showUnknown = (): void => {
  const display = getPageDisplay();
  if (!display) return;
  setDisplay(display, "???", true);
  unknownTimer = window.setTimeout(() => {
    const state = currentState();
    if (state) syncDisplay(state);
  }, UNKNOWN_MS);
};

const clearBuffer = (): void => {
  window.clearTimeout(timer);
  timer = undefined;
  buffer = "";
};

const navigateToCode = (code: string): boolean => {
  const state = currentState();
  const href = state
    ? state.pages.find((page) => page.number === code)?.href
    : undefined;
  if (!href) return false;
  navigate(href);
  return true;
};

const resolveCode = (): void => {
  const state = currentState();
  const code = buffer;
  const isComplete = code.length === CODE_LENGTH;
  clearBuffer();
  if (navigateToCode(code)) return;
  if (isComplete) {
    showUnknown();
  } else if (state) {
    syncDisplay(state);
  }
};

const isTypingTarget = (target: EventTarget | null): boolean => {
  const el = target as HTMLElement | null;
  if (!el || !el.isConnected) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable
  );
};

const hasModifier = (event: KeyboardEvent): boolean =>
  event.metaKey || event.ctrlKey || event.altKey;

const step = (direction: 1 | -1): void => {
  const state = currentState();
  if (!state) return;
  const pages = state.pages.filter((page) => !page.hidden);
  if (pages.length === 0) return;
  const index = pages.findIndex((page) => page.number === state.current);
  if (index === -1) {
    navigate(direction === 1 ? pages[0].href : pages[pages.length - 1].href);
    return;
  }
  const next = pages[(index + direction + pages.length) % pages.length];
  navigate(next.href);
};

const onKeydown = (event: KeyboardEvent): void => {
  const state = currentState();
  if (!state || hasModifier(event) || isTypingTarget(event.target)) return;

  if (/^[0-9]$/.test(event.key)) {
    event.preventDefault();
    window.clearTimeout(unknownTimer);
    window.clearTimeout(timer);
    buffer = (buffer + event.key).slice(-CODE_LENGTH);
    const display = getPageDisplay();
    if (display) setDisplay(display, buffer, false);
    if (buffer.length === CODE_LENGTH) {
      resolveCode();
    } else {
      timer = window.setTimeout(resolveCode, DEBOUNCE_MS);
    }
    return;
  }

  switch (event.key) {
    case "ArrowRight":
    case "ArrowUp":
      event.preventDefault();
      step(1);
      return;
    case "ArrowLeft":
    case "ArrowDown":
      event.preventDefault();
      step(-1);
      return;
    case "h":
    case "H":
    case "?":
      event.preventDefault();
      navigate(state.help);
      return;
    case "Escape":
      event.preventDefault();
      navigate(state.pages.find((page) => page.number === "100")?.href ?? "/");
      return;
  }

  clearBuffer();
  syncDisplay(state);
};

const scrollToHash = (): void => {
  const hash = window.location.hash;
  if (!hash) return;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;
  requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
};

const syncScrollPadding = (): void => {
  const head = document.querySelector<HTMLElement>(".ceefax-head");
  if (head) {
    document.documentElement.style.scrollPaddingTop = `${head.offsetHeight}px`;
  }
};

const syncTicker = (): void => {
  const elapsed = (Date.now() - TICKER_EPOCH) % TICKER_DURATION_MS;
  const delay = -(elapsed / 1000);
  for (const track of document.querySelectorAll<HTMLElement>(
    ".ceefax-ticker-track",
  )) {
    track.style.animationDelay = `${delay}s`;
  }
};

const onPageLoad = (): void => {
  deactivatePageBox();
  const raw = document.body.dataset.ceefaxPages;
  if (!raw) return;
  const parsed = JSON.parse(raw);
  const data: NavData = {
    pages: parsed.pages ?? [],
    current: parsed.current ?? "",
    help: parsed.help ?? "/help",
  };
  navWindow.ceefaxNavState = data;
  window.scrollTo(0, 0);
  syncScrollPadding();
  scrollToHash();
  syncTicker();
  syncDisplay(data);
  const footerPage = document.getElementById("ceefax-footer-page");
  if (footerPage) footerPage.textContent = `PAGE ${data.current}`;
};

const PAGE_CODE_INPUT_ID = "ceefax-page-code-input";

const pageCodeInput = (): HTMLInputElement | null =>
  document.getElementById(PAGE_CODE_INPUT_ID) as HTMLInputElement | null;

const activatePageBox = (): void => {
  if (pageCodeInput()) return;
  const display = getPageDisplay();
  if (!display) return;
  const input = document.createElement("input");
  input.id = PAGE_CODE_INPUT_ID;
  input.type = "tel";
  input.inputMode = "numeric";
  input.pattern = "[0-9]*";
  input.maxLength = CODE_LENGTH;
  input.autocomplete = "off";
  input.autocapitalize = "off";
  input.spellcheck = false;
  input.setAttribute("aria-label", "Page number");
  input.classList.add("ceefax-pagebox");
  display.style.display = "none";
  display.parentElement?.insertBefore(input, display.nextSibling);
  input.focus();
};

const deactivatePageBox = (): void => {
  const input = pageCodeInput();
  const display = getPageDisplay();
  if (input) input.remove();
  if (display) {
    display.style.display = "";
    const state = currentState();
    if (state) syncDisplay(state);
  }
};

let inputFlashTimer: number | undefined;

const flashUnknown = (): void => {
  const input = pageCodeInput();
  if (!input) return;
  input.setAttribute("data-unknown", "true");
  window.clearTimeout(inputFlashTimer);
  inputFlashTimer = window.setTimeout(() => {
    input.removeAttribute("data-unknown");
  }, UNKNOWN_MS);
};

const onPageInput = (event: Event): void => {
  const input = event.target as HTMLInputElement | null;
  if (!input || input.id !== PAGE_CODE_INPUT_ID) return;
  if (/\D/.test(input.value)) {
    input.value = input.value.replace(/\D/g, "");
  }
  if (input.value.length === CODE_LENGTH && !navigateToCode(input.value)) {
    flashUnknown();
  }
};

const onPageBoxKeydown = (event: KeyboardEvent): void => {
  const target = event.target as HTMLElement | null;
  if (!target || target.id !== PAGE_CODE_INPUT_ID) return;
  const input = target as HTMLInputElement;
  if (event.key === "Enter") {
    event.preventDefault();
    const digits = input.value.replace(/\D/g, "");
    if (digits.length === CODE_LENGTH && !navigateToCode(digits)) {
      flashUnknown();
    }
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    deactivatePageBox();
    return;
  }
  if (event.key.length === 1 && !/^[0-9]$/.test(event.key)) {
    event.preventDefault();
    return;
  }
  if (
    /^[0-9]$/.test(event.key) &&
    input.value.replace(/\D/g, "").length >= CODE_LENGTH
  ) {
    event.preventDefault();
  }
};

const onPageBoxClick = (event: Event): void => {
  const target = event.target as HTMLElement | null;
  if (!target) return;
  if (target.closest(`#${PAGE_CODE_INPUT_ID}`)) return;
  if (target.closest("#ceefax-pagebox")) {
    event.preventDefault();
    activatePageBox();
  }
};

const onPageBoxFocusOut = (event: FocusEvent): void => {
  const input = pageCodeInput();
  if (!input) return;
  const related = event.relatedTarget as Node | null;
  if (related && input.contains(related)) return;
  deactivatePageBox();
};

const onNavButtonClick = (event: Event): void => {
  const target = event.target as HTMLElement | null;
  if (!target || typeof target.closest !== "function") return;
  const button = target.closest("#ceefax-prev, #ceefax-next");
  if (!button) return;
  step(button.id === "ceefax-prev" ? -1 : 1);
};

export function initCeefaxNavigation(data: NavData): void {
  navWindow.ceefaxNavState = data;

  if (!navWindow.ceefaxNavInstalled) {
    navWindow.ceefaxNavInstalled = true;
    window.addEventListener("keydown", onKeydown);
    document.addEventListener("click", onPageBoxClick);
    document.addEventListener("input", onPageInput);
    document.addEventListener("keydown", onPageBoxKeydown);
    document.addEventListener("focusout", onPageBoxFocusOut);
    document.addEventListener("click", onNavButtonClick);
  }

  if (!navWindow.ceefaxNavPageLoadAttached) {
    navWindow.ceefaxNavPageLoadAttached = true;
    document.addEventListener("astro:page-load", onPageLoad);
  }

  if (!navWindow.ceefaxNavResizeAttached) {
    navWindow.ceefaxNavResizeAttached = true;
    window.addEventListener("resize", syncScrollPadding);
  }

  syncScrollPadding();
  syncDisplay(data);
}
