if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/serviceworker.js") // Ensure the path matches the final `dist` location.
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}
