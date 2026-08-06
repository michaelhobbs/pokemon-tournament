import { navigate as transitionNavigate, supportsViewTransitions } from 'astro:transitions/client';

export interface NavEntry {
	number: string;
	href: string;
}

interface NavData {
	pages: NavEntry[];
	current: string;
	help: string;
}

const DEBOUNCE_MS = 2000;
const CODE_LENGTH = 3;
const UNKNOWN_MS = 1500;

interface NavWindow extends Window {
	ceefaxNavState?: NavData;
	ceefaxNavInstalled?: boolean;
	ceefaxNavPageLoadAttached?: boolean;
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

const getPageDisplay = (): HTMLElement | null => document.getElementById('ceefax-pagebox');

const setDisplay = (display: HTMLElement, text: string, unknown: boolean): void => {
	display.textContent = text;
	display.setAttribute('data-unknown', String(unknown));
};

let buffer = '';
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
	setDisplay(display, '???', true);
	unknownTimer = window.setTimeout(() => {
		const state = currentState();
		if (state) syncDisplay(state);
	}, UNKNOWN_MS);
};

const clearBuffer = (): void => {
	window.clearTimeout(timer);
	timer = undefined;
	buffer = '';
};

const resolveCode = (): void => {
	const state = currentState();
	const href = state ? state.pages.find((page) => page.number === buffer)?.href : undefined;
	const isComplete = buffer.length === CODE_LENGTH;
	clearBuffer();
	if (href) {
		navigate(href);
	} else if (isComplete) {
		showUnknown();
	} else if (state) {
		syncDisplay(state);
	}
};

const isTypingTarget = (target: EventTarget | null): boolean => {
	const el = target as HTMLElement | null;
	if (!el || !el.isConnected) return false;
	const tag = el.tagName;
	return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
};

const hasModifier = (event: KeyboardEvent): boolean =>
	event.metaKey || event.ctrlKey || event.altKey;

const step = (direction: 1 | -1): void => {
	const state = currentState();
	if (!state) return;
	const index = state.pages.findIndex((page) => page.number === state.current);
	if (index === -1) {
		navigate(direction === 1 ? state.pages[0].href : state.pages[state.pages.length - 1].href);
		return;
	}
	const next = state.pages[(index + direction + state.pages.length) % state.pages.length];
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
		case 'ArrowRight':
		case 'ArrowUp':
			event.preventDefault();
			step(1);
			return;
		case 'ArrowLeft':
		case 'ArrowDown':
			event.preventDefault();
			step(-1);
			return;
		case 'h':
		case 'H':
		case '?':
			event.preventDefault();
			navigate(state.help);
			return;
		case 'Escape':
			event.preventDefault();
			navigate(state.pages.find((page) => page.number === '100')?.href ?? '/');
			return;
	}

	clearBuffer();
	syncDisplay(state);
};

const onPageLoad = (): void => {
	const raw = document.body.dataset.ceefaxPages;
	if (!raw) return;
	const parsed = JSON.parse(raw);
	const data: NavData = {
		pages: parsed.pages ?? [],
		current: parsed.current ?? '',
		help: parsed.help ?? '/help',
	};
	navWindow.ceefaxNavState = data;
	const scroller = document.querySelector<HTMLElement>('.ceefax-scroll');
	if (scroller) scroller.scrollTop = 0;
	syncDisplay(data);
};

export function initCeefaxNavigation(data: NavData): void {
	navWindow.ceefaxNavState = data;

	if (!navWindow.ceefaxNavInstalled) {
		navWindow.ceefaxNavInstalled = true;
		window.addEventListener('keydown', onKeydown);
	}

	if (!navWindow.ceefaxNavPageLoadAttached) {
		navWindow.ceefaxNavPageLoadAttached = true;
		document.addEventListener('astro:page-load', onPageLoad);
	}

	syncDisplay(data);
}
