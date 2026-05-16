# AJL Platform - Association des Jeunes Leaders

## 📋 Vue d'ensemble

Plateforme web complète pour gérer les membres, cotisations, paiements et subventions de l'Association des Jeunes Leaders.

### Version 1.0 - Fonctionnalités

✅ **Authentification** - JWT + Bcrypt
✅ **Gestion des membres** - Inscription, profil, matricule unique
✅ **Gestion des cotisations** - Formulaire, paiement en ligne
✅ **Tableau de bord admin** - Gestion complète
✅ **Paiements** - Intégration Stripe (extensible pour MTN/Airtel)
✅ **Base de données** - PostgreSQL avec Sequelize

---

## 🏗️ Architecture

```
ajl-platform/
├── frontend/              # Next.js 14 + React + TypeScript
│   ├── app/              # App Router
│   ├── components/       # Composants réutilisables
│   ├── pages/            # Pages
│   ├── styles/           # Tailwind CSS
│   └── lib/              # Utilitaires
│
├── backend/               # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/       # API Routes
│   │   ├── models/       # Modèles Sequelize
│   │   ├── controllers/  # Logique métier
│   │   ├── middleware/   # Auth, validation
│   │   ├── database/     # Configuration DB
│   │   └── utils/        # Utilitaires (JWT, hashing)
│   ├── .env.example      # Variables d'environnement
│   └── server.ts         # Point d'entrée
│
├── shared/                # Types et utilitaires partagés
│   └── types/            # Interfaces TypeScript
│
├── docker-compose.yml     # PostgreSQL + services
└── .github/workflows/     # CI/CD
```

---

## 🚀 Installation & Démarrage

### Prérequis
- Node.js 18+
- npm ou yarn
- Docker (pour PostgreSQL)

### 1. Cloner le dépôt
```bash
git clone https://github.com/mbvane40-art/Associations-des-jeunes-leaders-.git
cd Associations-des-jeunes-leaders-
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Démarrer PostgreSQL
```bash
docker-compose up -d
```

### 4. Configurer les variables d'environnement
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 5. Migrer la base de données
```bash
cd backend
npm run migrate
```

### 6. Démarrer les services
```bash
npm run dev
```

- **Frontend** : http://localhost:3000
- **Backend** : http://localhost:5000

---

## 📚 Documentation des APIs

### Authentification
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Membres
```
GET  /api/members
GET  /api/members/:id
POST /api/members
PUT  /api/members/:id
```

### Cotisations
```
GET  /api/subscriptions
POST /api/subscriptions
GET  /api/subscriptions/:id
PUT  /api/subscriptions/:id
```

### Paiements
```
POST /api/payments/create-intent
POST /api/payments/webhook
GET  /api/payments/:id
```

### Admin
```
GET  /api/admin/dashboard
GET  /api/admin/members
GET  /api/admin/payments
GET  /api/admin/subscriptions
```

---

## 🔐 Sécurité

- ✅ Passwords hashées avec Bcrypt
- ✅ JWT avec expiration (15 min access, 7j refresh)
- ✅ CORS configuré
- ✅ Rate limiting
- ✅ Validation des entrées
- ✅ Protection contre XSS et CSRF

---

## 📦 Technologies

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express
- TypeScript
- Sequelize ORM
- PostgreSQL
- JWT

**Infrastructure:**
- Docker
- GitHub Actions

---

## 🤝 Contribution

1. Créer une branche feature : `git checkout -b feature/nouvelle-feature`
2. Commit : `git commit -m "feat: description"`
3. Push : `git push origin feature/nouvelle-feature`
4. Créer une Pull Request

---

## 📞 Support

Pour toute question : support@ajl.com

---

## 📄 License

MIT License - Copyright © 2026 AJL
