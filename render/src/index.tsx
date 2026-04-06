/* @refresh reload */
import './index.css'
import App from './App.tsx'
import { hydrate, render } from "solid-js/web";
import { ApiProvider } from "./lib/api";

const root = document.getElementById("root")!;
const app = () =>
  <ApiProvider>
    <App />
  </ApiProvider>;

if (root.childNodes.length > 0) {
  hydrate(app, root);
} else {
  render(app, root);
}
