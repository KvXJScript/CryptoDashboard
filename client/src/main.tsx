import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize static deployment features
if (typeof window !== 'undefined') {
  // Set static deployment flag
  (window as any).__STATIC_DEPLOYMENT__ = true;
  
  // Initialize demo data for static deployment
  import("./lib/staticStorage").then(({ StaticStorageService }) => {
    import("./lib/staticAuth").then(({ StaticAuthService }) => {
      const user = StaticAuthService.getCurrentUser();
      if (user) {
        StaticStorageService.initializeDemoData(user.id);
      }
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
