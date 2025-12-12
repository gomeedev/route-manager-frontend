# React + Vite + Supabase + Leaflet

[![Supabase](https://img.shields.io/badge/Supabase-%23000000.svg?logo=supabase&logoColor=3ECF8E)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.x-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3.x-61DAFB?logo=react)](https://react.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?logo=leaflet)](https://leafletjs.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.12.x-FF6384?logo=recharts)](https://recharts.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel)](https://vercel.com/)


> Frontend application for a logistics process management system for courier companies in Colombia, featuring interactive route visualization, real-time delivery tracking, and comprehensive reporting dashboards.


## Live Demo
- **Production Application**: https://route-manager-frontend.vercel.app
- **API Documentation**: [Swagger UI](https://route-manager-backend-production.up.railway.app/api/schema/swagger-ui/)
- **Backend API**: https://route-manager-backend-production.up.railway.app


### Prerequisites
- **Supabase Account**: For image storage and user authentication services
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 **or** **yarn** >= 1.22.0 **or** **pnpm** >= 8.0.0
- **Backend API**: Running instance of [Route Manager Backend](https://github.com/gomeedev/route-manager-backend)
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+


## Installation

### Clone repository
```sh
git clone https://github.com/gomeedev/route-manager-frontend.git
cd route-manager-frontend
```

### Install dependencies
```sh
npm install
# or
yarn install
# or
pnpm install
```

### Environment configuration
```sh
cp .env.example .env
```

### Start development server
```sh
npm run dev
```

### Build for production
```sh
npm run build
```

### Preview production build
```sh
npm run preview
```

## Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend API
VITE_API_URL=http://localhost:8000
```


## Key Dependencies

### Core Framework
- React 18  
- Vite 5  
- React Router DOM 6  

### UI & Styling
- Tailwind CSS  
- MUI  
- Lucide React  
- Recharts  
- React-Leaflet  

### State & Utilities
- Axios  
- React Context API  
- Date-fns  
- React-Hook-Form  

### Mapping & Geospatial
- Leaflet  
- Leaflet Routing Machine  
- React-Leaflet  

### Development Tools
- ESLint  
- Prettier  
- Husky  
- Commitlint  

## External Services Integration

### Supabase Setup
1. Create a project at supabase.com  
2. Go to Project Settings → API  
3. Copy project URL & anon key  
4. Create a bucket named `images`  
5. Add credentials to `.env`

### Backend API Integration
```env
VITE_API_BASE_URL=https://your-backend-url
```

## Deployment

### Deploy to Vercel
1. Push code  
2. Import repo  
3. Add environment variables  
4. Deploy  

### Manual Static Deployment
```sh
npm run build
```

Deploy `dist/` to any static hosting provider.


## Browser Support
- Chrome 90+  
- Firefox 88+  
- Safari 14+  
- Edge 90+  

Internet Explorer is not supported.


## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Authors
- **Johann Gómez** - [GitHub Profile](https://github.com/gomeedev)

<div align="center">
  <p><strong>Academic project created for Colombian logistics companies</strong></p>
  <p><em>Last update: [11/12/2025]</em></p>
</div>
