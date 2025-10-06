# Todo Categories App - Ionic + Angular + Cordova

Aplicación de gestión de tareas con categorías personalizables, desarrollada con Ionic Framework, Angular y Cordova. Incluye integración con Firebase Remote Config para control dinámico de funcionalidades mediante feature flags.

## Características Principales

- Gestión completa de tareas (crear, completar, eliminar)
- Categorías personalizables con colores e iconos
- Filtrado de tareas por categoría
- Firebase Remote Config para feature flags
- Modo oscuro controlado remotamente
- Almacenamiento local persistente
- Aplicación híbrida compilable para Android e iOS

## Tecnologías

- **Framework**: Ionic 8
- **Frontend**: Angular 20
- **Mobile**: Cordova
- **Backend**: Firebase Remote Config
- **Lenguaje**: TypeScript
- **Estilos**: SCSS

---

## Requisitos Previos

### General
- Node.js 18+
- npm 9+
- Ionic CLI: `npm install -g @ionic/cli`
- Cordova: `npm install -g cordova`

### Para Android
- Java JDK 17
- Android Studio con SDK Platform 34
- Variables de entorno:
  ```bash
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
  ```

### Para iOS (solo macOS)
- Xcode 14+
- CocoaPods: `sudo gem install cocoapods`
- Apple Developer Account (para distribución)

---

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/todo-categories-app.git
cd todo-categories-app

# Instalar dependencias
npm install

# Configurar Firebase (opcional)
# Editar src/environments/environment.ts con tus credenciales
```

### Configuración de Firebase

1. Crear proyecto en https://console.firebase.google.com/
2. Registrar app web y copiar credenciales
3. Actualizar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
  }
};
```

4. En Firebase Console, ir a Remote Config y crear estos parámetros:

| Parámetro | Tipo | Valor | Descripción |
|-----------|------|-------|-------------|
| `enableCategoryFilter` | Boolean | `true` | Muestra/oculta filtro de categorías |
| `enableTaskDescription` | Boolean | `true` | Habilita descripciones en tareas |

---

## Ejecución en Desarrollo

```bash
# Servidor local
npm start
# Abre en http://localhost:8100
```

---

## Compilación para Android

### Preparación inicial

```bash
# Agregar plataforma
cordova platform add android
```

### Generar APK

```bash
# 1. Build de producción
npm run build:prod

# 2. Compilar APK
cordova build android --release -- --packageType=apk
```

**Ubicación del APK:**
```
platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
o en la raíz app-release-unsigned.apk
```

### Instalar en dispositivo

```bash
# Via ADB
adb install platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk

# O transferir el APK al dispositivo e instalarlo manualmente
# (Habilitar "Instalar apps de fuentes desconocidas" en Android)
```

### Ejecutar en emulador

```bash
# Listar emuladores
emulator -list-avds

# Ejecutar
cordova emulate android
```

---

## Compilación para iOS

### Preparación inicial

```bash
# Agregar plataforma
cordova platform add ios

# Instalar dependencias
cd platforms/ios
pod install
cd ../..
```

### Compilar

```bash
# Build de producción
npm run build:prod

# Compilar iOS
cordova build ios --release

# Abrir en Xcode
open platforms/ios/*.xcworkspace
```

### Generar IPA desde Xcode

1. En Xcode, seleccionar **Any iOS Device**
2. Menu: **Product → Archive**
3. Cuando termine, click en **Distribute App**
4. Seleccionar método de distribución (requiere Apple Developer Account)
5. Exportar IPA

**Nota:** La generación de IPA requiere membresía Apple Developer Program ($99/año). Sin ella, solo es posible compilar el proyecto e instalar directamente desde Xcode a un dispositivo conectado.

---

## Archivos Compilados Generados

### Android
- **APK**: `platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk`
- **Tamaño**: ~10MB
- **Instalable**: Directamente en cualquier dispositivo Android

### iOS
- **Archive**: Generado exitosamente en Xcode
- **IPA**: No exportado (requiere Apple Developer Account de pago)
- **Alternativa**: Instalación directa desde Xcode a dispositivo conectado

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   └── color-icon-selector/     # Selector visual de colores/iconos
│   ├── models/
│   │   ├── task.model.ts
│   │   └── category.model.ts
│   ├── pages/
│   │   ├── home/                     # Pantalla principal
│   │   └── category-manager/        # Gestión de categorías
│   ├── services/
│   │   ├── task.service.ts
│   │   ├── category.service.ts
│   │   ├── storage.service.ts
│   │   └── remote-config.service.ts  # Feature flags
│   └── app.module.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── theme/
    └── variables.scss                # Tema + Dark mode
```

---

## Feature Flags Implementados

### 1. enableCategoryFilter
Controla la visibilidad del filtro de categorías en la pantalla principal.
- **true**: Muestra barra de segmentos para filtrar
- **false**: Oculta el filtro

### 2. enableTaskDescription
Habilita el campo de descripción en las tareas.
- **true**: Permite agregar y ver descripciones
- **false**: Oculta campo de descripción

### 3. enableDarkMode
Activa el modo oscuro globalmente.
- **true**: Aplica tema oscuro a toda la app
- **false**: Mantiene tema claro

### 4. maxTasksPerCategory
Define el límite de tareas permitidas por categoría.
- Valor numérico (ej: 100)
- Al alcanzar el límite, muestra alerta

### 5. welcomeMessage
Mensaje personalizable en el header.
- Texto libre
- Se muestra en el título grande de la página principal

### Demostración de Feature Flags

Para probar los feature flags:
1. Cambiar valores en Firebase Console
2. Publicar cambios
3. En la app, tocar el botón de refresh (⟳)
4. Observar cambios inmediatos en la UI

El banner de "Feature Flags Activos" muestra el estado actual de cada flag en tiempo real.

---

## Scripts Disponibles

```bash
npm start                  # Servidor de desarrollo
npm run build              # Build producción web
npm run build:prod         # Build producción optimizado
npm test                   # Tests unitarios
npm run lint               # Linter
```

---

## Solución de Problemas

### Android: "ANDROID_HOME is not set"
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Android: "Gradle build failed"
```bash
rm -rf platforms/android
cordova platform add android
cordova build android --release -- --packageType=apk
```

### iOS: "CocoaPods not found"
```bash
sudo gem install cocoapods
cd platforms/ios
pod install
cd ../..
```

### iOS: "xcodebuild requires Xcode"
```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
```

### Firebase: Valores no se actualizan
1. Verificar que los cambios estén publicados en Firebase Console
2. Tocar botón de refresh en la app
3. Revisar consola del navegador para errores
4. Verificar credenciales en `environment.ts`

---

## Respuestas a Preguntas Técnicas

### ¿Cuáles fueron los principales desafíos?

1. **Integración Firebase Remote Config con Angular 20**
  - Desafío: Configurar providers correctamente con las últimas versiones
  - Solución: Uso de `provideFirebaseApp` y `provideRemoteConfig` en app.module.ts

2. **Selector visual de colores/iconos**
  - Desafío: Ionic Alert no renderiza HTML personalizado
  - Solución: Componente modal standalone con grid interactivo

3. **Compatibilidad Cordova Android 14**
  - Desafío: Plugin whitelist incompatible
  - Solución: Remover plugin y usar network_security_config.xml

4. **Feature flags reactivos**
  - Desafío: Actualizar UI automáticamente al cambiar flags
  - Solución: BehaviorSubject + subscripciones en componentes

### ¿Qué técnicas de optimización aplicaste?

1. **Lazy Loading de Módulos**
  - Implementado en app-routing.module.ts
  - Reduce bundle inicial y mejora tiempo de carga

2. **Componentes Standalone**
  - ColorIconSelector y páginas principales
  - Reduce dependencias y mejora tree-shaking

3. **RxJS para manejo de estado**
  - BehaviorSubject para tasks y categories
  - Evita re-renders innecesarios

4. **Almacenamiento local optimizado**
  - LocalStorage con JSON stringify/parse
  - Operaciones síncronas rápidas

### ¿Cómo aseguraste la calidad del código?

1. **ESLint** configurado con reglas de Angular
2. **TypeScript strict mode** habilitado
3. **Interfaces** para todos los modelos de datos
4. **Servicios inyectables** con separación de responsabilidades
5. **Componentes reutilizables** (ColorIconSelector)
6. **Código documentado** con comentarios claros

---

## Estrategia de Branches

```
main
 └── develop
      ├── feature/task-management
      ├── feature/category-management
      ├── feature/firebase-integration
      ├── feature/mobile-build
```

Cada feature se desarrolló en su rama correspondiente y se integró a develop mediante pull requests.

---

## Autor

Edward Tapiero
- GitHub: [@EdwardTapiero](https://github.com/EdwardTapiero)

---

## Licencia

Proyecto desarrollado como prueba técnica.
