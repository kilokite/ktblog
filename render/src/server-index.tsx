import { renderToStringAsync, generateHydrationScript } from "solid-js/web";
import { ApiProvider } from "./lib/api";
import App from "./App";

export async function solid_render(fetchFn: typeof globalThis.fetch) {
  return renderToStringAsync(() =>
    <ApiProvider fetch={fetchFn}>
      <App />
    </ApiProvider>
  );
}

export { generateHydrationScript };
