# Finanzas Personales - Aplicación Móvil (iOS & Android)

¡Bienvenido al repositorio de la aplicación de **Finanzas Personales**! Esta aplicación está construida utilizando **React Native** con **Expo** y **TypeScript**, optimizada para un alto rendimiento, excelente experiencia de usuario en dispositivos móviles y una arquitectura altamente escalable para el trabajo en equipo a largo plazo.

Conecta directamente con un servidor de datos externo e implementa una caché inteligente local para permitir su funcionamiento fluido en condiciones de conexión inestable.

---

## 🏗️ Arquitectura del Proyecto

El proyecto adopta un patrón **Feature-First (Orientada a Características)** combinado con **Clean Architecture** (Arquitectura Limpia). 

### ¿Por qué Feature-First?
En lugar de organizar el código por tipo de archivo técnico (como separar todas las pantallas en un directorio y todos los hooks en otro), agrupamos el código por **módulos de negocio** o "features" (ej. `auth`, `transactions`, `budgets`, `analytics`).
- **Escalabilidad**: Múltiples desarrolladores pueden trabajar en diferentes módulos sin interferir entre sí ni generar conflictos en Git.
- **Mantenibilidad**: Toda la lógica asociada a una característica se encuentra en un mismo lugar.
- **Desacoplamiento**: Facilita reemplazar o refactorizar módulos completos sin afectar el resto de la aplicación.

### Capas del Proyecto
1. **Capa de Enrutamiento (`src/app/`)**: Define la navegación física mediante archivos con **Expo Router**.
2. **Capa de Características (`src/features/`)**: Contiene la lógica de negocio específica de cada módulo.
    - **api/**: Peticiones HTTP y mapeo de datos específicos.
    - **store/**: Estado local persistente (Zustand).
    - **hooks/**: Enlaces de consulta de datos y sincronización (React Query).
    - **components/**: Componentes exclusivos de la característica.
3. **Capa Core / Infraestructura (`src/core/`)**: Fundamento común reutilizable por todas las features.
    - **api/**: Cliente HTTP base de Axios configurado con interceptores globales.
    - **theme/**: Proveedor y contexto para modo claro/oscuro dinámico.
    - **storage/**: Almacenamiento seguro en disco (SecureStore).
    - **components/**: Componentes UI atómicos reutilizables (Botones, Inputs, Cards).

---

## 📁 Estructura de Directorios

El siguiente árbol muestra la estructura física implementada en la raíz del proyecto:

```text
/AppFinanzaspersonales (raíz)
│
├── app/                          # Pantallas físicas y enrutamiento (Expo Router)
│   ├── (auth)/                   # Grupo público (Acceso / Registro)
│   │   ├── _layout.tsx           # Configuración de transición y stack de auth
│   │   ├── login.tsx             # Pantalla de Inicio de Sesión
│   │   └── register.tsx          # Pantalla de Registro
│   ├── (app)/                    # Grupo privado (Custodiado por autenticación)
│   │   ├── (tabs)/               # Pestañas principales
│   │   │   ├── _layout.tsx       # Estilo de barra de navegación inferior (Tabs)
│   │   │   ├── index.tsx         # Tab 1: Dashboard / Resumen General
│   │   │   ├── transactions.tsx  # Tab 2: Movimientos e Historial
│   │   │   ├── budgets.tsx       # Tab 3: Control de Presupuestos
│   │   │   └── profile.tsx       # Tab 4: Perfil y Preferencias de Tema
│   │   └── _layout.tsx           # Guarda de seguridad (Autenticado vs Anónimo)
│   ├── _layout.tsx               # Enlazador central de Providers (QueryClient, Theme)
│   └── index.tsx                 # Entrada raíz (Redirección inicial automática)
│
├── src/                          # Código fuente de lógica de negocio y UI
│   ├── core/                     # Fundamento global común
│   │   ├── api/                  # Axios apiClient e inyección automática de JWT
│   │   ├── constants/            # Paleta de colores premium (Palette), Spacing, Tipografías
│   │   ├── storage/              # secureStore.ts para tokens (iOS/Android/Web)
│   │   ├── theme/                # ThemeProvider (Light / Dark mode persistido)
│   │   └── utils/                # Utilidades de formato (formatCurrency, formatDate)
│   │
│   ├── features/                 # Módulos de negocio (Feature-First)
│   │   ├── auth/                 # Módulo de Autenticación
│   │   │   ├── api/              # Llamadas de registro/login (authService)
│   │   │   └── store/            # Zustand Store para manejar sesión (useAuthStore)
│   │   ├── transactions/         # Módulo de Ingresos/Gastos
│   │   │   ├── api/              # CRUD de movimientos (transactionsService)
│   │   │   └── hooks/            # Hooks de React Query (useTransactions, mutations)
│   │   ├── budgets/              # Módulo de Presupuestos y límites
│   │   │   ├── api/              # CRUD de presupuestos (budgetsService)
│   │   │   └── hooks/            # Hooks de React Query (useBudgets, useSaveBudget)
│   │   └── analytics/            # Módulo de Informes Financieros
│   │       ├── api/              # Llamadas de agregación de datos
│   │       └── hooks/            # Hooks de React Query (useAnalyticsSummary)
│   │
│   └── types/                    # Interfaces comunes de TypeScript (declarations.d.ts, index.ts)
│
├── assets/                       # Íconos, fuentes e imágenes estáticas
├── package.json                  # Script de dependencias
├── tsconfig.json                 # Configuración estricta de TypeScript
└── README.md                     # Este archivo (Documentación y Changelog)
```

---

## 🛠️ Tecnologías Utilizadas

- **Zustand**: Gestión del estado global y síncrono del cliente (sesión de usuario, preferencias locales).
- **TanStack Query (React Query)**: Gestión de peticiones HTTP, sincronización en tiempo real con el servidor externo, estados de carga y manejo robusto de caché.
- **Axios**: Cliente HTTP configurado con interceptores para inyectar dinámicamente el token JWT en las cabeceras de autorización y capturar respuestas 401 para hacer un auto-logout.
- **Expo Secure Store**: Almacenamiento seguro nativo cifrado en disco para resguardar la identidad del usuario de manera persistente.
- **React Hook Form + Zod**: Manejo de formularios altamente eficientes sin re-renderizar la pantalla de forma innecesaria y con validaciones estrictas tipadas en base a esquemas.
- **Ionicons (@expo/vector-icons)**: Iconografía premium multiplataforma nativa.

---

## 🚀 Cómo Iniciar el Proyecto

### Requisitos Previos
- Node.js (v20.x o superior recomendado)
- npm o yarn
- Emulador de Android (Android Studio), Simulador de iOS (Xcode, solo macOS) o la aplicación **Expo Go** en un dispositivo físico.

### Pasos
1. Instalar las dependencias de node:
   ```bash
   npm install
   ```
2. Iniciar el servidor de desarrollo de Expo:
   ```bash
   npm run start
   ```
3. Abrir la aplicación:
   - Presiona `a` para emulador Android.
   - Presiona `i` para simulador iOS.
   - Escanea el código QR en tu teléfono real mediante la app **Expo Go** para verlo en vivo.

---

## 🤝 Lineamientos para Desarrolladores (Cómo agregar nuevas funciones)

Cuando debas agregar una nueva característica al proyecto:
1. **Define los tipos**: Agrega las interfaces en `src/types/index.ts` o dentro de la carpeta `types/` de la nueva feature.
2. **Crea el Servicio API**: Define la clase o funciones en `src/features/[tu-feature]/api/[tu-servicio].ts` consumiendo `apiClient` desde `src/core/api/client.ts`.
3. **Crea los Hooks de React Query**: Implementa queries y mutations en `src/features/[tu-feature]/hooks/[tu-hook].ts` para enlazar el servicio y la caché.
4. **Agrega pantallas en Router**: Si requiere una nueva pantalla de navegación, agrégala en la subcarpeta correspondiente bajo `app/` (ej. `app/(app)/(tabs)/nueva-pantalla.tsx`) y enlázala en su respectivo `_layout.tsx`.
5. **Actualiza el Changelog**: No olvides detallar tus aportaciones al final de este archivo `README.md`.

---

## 📝 Historial de Cambios (Changelog)

A continuación se detallan los hitos e implementaciones realizadas para mantener a todo el equipo al tanto del estado del proyecto:

### [1.0.0] - 2026-06-26
#### Añadido (Added)
- **Inicialización del Proyecto**: Generación del proyecto con Expo SDK 56 y TypeScript.
- **Instalación de Librerías Core**: Instalación e integración de Zustand, `@tanstack/react-query`, `axios`, `react-hook-form`, `zod`, `@hookform/resolvers`, `expo-secure-store` y `@expo/vector-icons`.
- **Estructura de Carpetas Robustas**: Creación de la estructura Feature-First (`src/features/...`) y Capa de Infraestructura Común (`src/core/...`).
- **Sistema de Tematización**: Creación de `ThemeProvider` y constantes de color modernas (`src/core/constants/theme.ts`) con soporte dinámico para modo claro y modo oscuro.
- **Manejo Seguro de Almacenamiento**: Implementación del servicio `secureStorage` mediante `expo-secure-store` con fallback de memoria/localStorage para web.
- **Cliente HTTP Centralizado**: Creación de `apiClient` con Axios, inyección automatizada de token de autorización de tipo Bearer e interceptor para cierre de sesión global ante respuestas de token expirado (401).
- **Mapeo Global de Entidades**: Creación del archivo de tipos `src/types/index.ts` (Usuario, Transacciones, Presupuestos, Estructuras API).
- **Control de Estado de Autenticación**: Zustand store (`useAuthStore`) con inicio/cierre de sesión, restauración del estado en arranque y validaciones de esquema con Zod.
- **Servicios y Hooks con Mocks**: Implementación de `authService`, `transactionsService`, `budgetsService`, `analyticsService` y sus respectivos React Query hooks para transacciones, presupuestos y analíticas (preparados para conectar fácilmente a un backend real mediante variables de entorno).
- **Vistas y Flujos de Navegación**:
  - Pantallas de autenticación: `login.tsx` y `register.tsx` (con formularios validados).
  - Guarda de seguridad en `src/app/(app)/_layout.tsx` (redirecciones automáticas basadas en sesión).
  - Pestañas funcionales: Dashboard con reporte analítico, listado de movimientos con creación en modal, panel de presupuestos con barras de progreso y alertas, y pantalla de perfil con control de cambio de tema.
- **Verificación de Tipado**: Corrección de fallos y validación final de compilación TypeScript estricta exitosa (`npx tsc --noEmit` completado sin errores).
