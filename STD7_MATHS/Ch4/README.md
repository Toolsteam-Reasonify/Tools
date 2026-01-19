## CH4 Workspace

This folder contains four separate Vite + React TypeScript apps for visualizing simple arithmetic operations:

- `ch4_add`: Addition
- `ch4_sub`: Subtraction
- `ch4_mul`: Multiplication
- `ch4_div`: Division

Each app is self-contained and can be run independently.

### Prerequisites
- Node.js (LTS recommended)

### Getting Started (for any app)
1. Open a terminal in the specific app directory (e.g., `ch4_add`).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

### Build
```bash
npm run build
```
The production build outputs to the `dist/` directory inside each app folder.

### Project Structure
- Each `ch4_*` folder includes:
  - `src/`: App source code (components, pages, contexts, utils)
  - `index.html`: App entry HTML
  - `vite.config.ts`, `tsconfig*.json`, `tailwind.config.js`, `postcss.config.js`
  - `dist/`: Build output (after running build)

### Notes
- Use the `.gitignore` files to avoid committing build artifacts, dependencies, and local environment files.


