
# TIWA-Kilimo

TIWA-Kilimo is a professional, modern dairy management platform designed to help farmers maximize milk production, streamline daily operations, and make data-driven decisions. Built with a robust React frontend and powered by Supabase as a backend-as-a-service (BaaS), TIWA-Kilimo delivers speed, security, and scalability for farms of all sizes.

---

## 🚀 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, shadcn-ui, Vite
- **Backend as a Service:** Supabase (PostgreSQL, Auth, Storage, Realtime)

---

## 🌟 Features

- Animal records management (health, breeding, production)
- Task scheduling and workflow automation
- Financial tracking and analytics
- Inventory and supplies management
- Reminders and notifications
- Insightful reports and dashboards
- Secure authentication and user roles

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Bun (optional, for faster builds)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd tiwa-dairy-diary

# Install dependencies
npm install
# or, for Bun users
bun install

# Start the development server
npm run dev
# or
bun run dev
```

### Environment Variables

Create a `.env` file and configure your Supabase credentials:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🧑‍💻 Development

- All source code is in the `src/` directory.
- UI components are in `src/components/`.
- Supabase integration is in `src/integrations/supabase/`.

---

## 🌐 Deployment

You can deploy TIWA-Kilimo to any modern hosting platform (Netlify, Vercel, etc.).

**Build for production:**

```sh
npm run build
# or
bun run build
```

**Preview production build locally:**

```sh
npm run preview
# or
bun run preview
```

**Netlify/Vercel settings:**
- Build command: `npm run build` or `bun run build`
- Publish directory: `dist`

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📫 Contact

For support or business inquiries, email [info@tiwa-kilimo.com](mailto:info@tiwa-kilimo.com)
