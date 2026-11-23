// Lets global UI (top bar "+ New", command palette) ask a page to do something:
// open its "create" modal or apply a search. If the page isn't mounted yet
// (request made right before navigating to it), the request waits for it.

export type CreateTarget = 'vacancy' | 'company' | 'interview';
export type SearchTarget = 'vacancy' | 'company';

type RequestKind = 'create' | 'search';

interface PageRequest {
  kind: RequestKind;
  target: string;
  payload: string;
}

const PAGE_REQUEST_EVENT = 'devtrack:page-request';

const pendingRequests = new Map<string, string>();

const getKey = (kind: RequestKind, target: string) => `${kind}:${target}`;

function sendRequest(kind: RequestKind, target: string, payload = '') {
  pendingRequests.set(getKey(kind, target), payload);

  window.dispatchEvent(
    new CustomEvent<PageRequest>(PAGE_REQUEST_EVENT, { detail: { kind, target, payload } })
  );
}

function subscribe(kind: RequestKind, target: string, onRequest: (payload: string) => void) {
  const key = getKey(kind, target);
  const pendingPayload = pendingRequests.get(key);

  if (pendingPayload !== undefined) {
    pendingRequests.delete(key);
    queueMicrotask(() => onRequest(pendingPayload));
  }

  const listener = (event: Event) => {
    const { detail } = event as CustomEvent<PageRequest>;

    if (detail.kind === kind && detail.target === target) {
      pendingRequests.delete(key);
      onRequest(detail.payload);
    }
  };

  window.addEventListener(PAGE_REQUEST_EVENT, listener);

  return () => window.removeEventListener(PAGE_REQUEST_EVENT, listener);
}

/** Asks the page that owns `target` to open its "create" modal. */
const requestCreate = (target: CreateTarget) => sendRequest('create', target);

/** Asks the page that owns `target` to search for `query`. */
const requestSearch = (target: SearchTarget, query: string) => sendRequest('search', target, query);

/** For pages, inside useEffect. Returns the unsubscribe function. */
const subscribeToCreate = (target: CreateTarget, onRequest: () => void) =>
  subscribe('create', target, () => onRequest());

/** For pages, inside useEffect. Returns the unsubscribe function. */
const subscribeToSearch = (target: SearchTarget, onRequest: (query: string) => void) =>
  subscribe('search', target, onRequest);

export { requestCreate, requestSearch, subscribeToCreate, subscribeToSearch };
