// index.tsx (or index.jsx if you're not using TypeScript)
import ReactDOM from "react-dom/client"; // ✅ React 18+ uses this
import App from "./App.js";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";

// 👇 Type assertion ensures TypeScript knows this is a non-null HTML element
const rootElement = document.getElementById("root") as HTMLElement;

// 👇 Create React 18 root
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
