# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Environment Configuration

Create a `.env` file based on `.env.example` to configure the API base URL.

```
VITE_API_BASE_URL=https://urban-realty-production.up.railway.app/api/v1
```

- For local development:
  - If running the server locally on port 5000, set:
    - `VITE_API_BASE_URL=http://localhost:5000/api/v1`
- The app reads this variable in `src/services/axios.js` via `import.meta.env.VITE_API_BASE_URL`.
