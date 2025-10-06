# 🔥 Configuración de Firebase

## Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto" o "Create a project"
3. Nombra tu proyecto (ej: `todo-categories-app`)
4. Desactiva Google Analytics (opcional)
5. Click en "Crear proyecto"

## Paso 2: Agregar una App Web

1. En la página principal del proyecto, click en el ícono Web `</>`
2. Registra tu app con un nombre (ej: `Todo App`)
3. **NO** marcar "Firebase Hosting"
4. Click en "Registrar app"
5. **Copia las credenciales** que aparecen (las necesitarás en el siguiente paso)

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Paso 3: Configurar Remote Config

1. En el menú lateral de Firebase Console, ve a **"Remote Config"**
2. Click en "Crear configuración"
3. Agrega los siguientes parámetros:

### Parámetros a crear:

| Clave | Tipo | Valor por defecto | Descripción |
|-------|------|-------------------|-------------|
| `enableCategoryFilter` | Boolean | `true` | Habilita/deshabilita el filtro de categorías |
| `enableTaskDescription` | Boolean | `true` | Habilita/deshabilita las descripciones de tareas |

4. Click en "Publicar cambios"

## Paso 4: Actualizar environment.ts

Reemplaza las credenciales en `src/environments/environment.ts` y `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.appspot.com",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
  }
};
```

## Paso 5: Instalar Dependencias

```bash
npm install @angular/fire firebase
```

## Paso 6: Probar la Integración

1. Ejecuta la app: `ionic serve`
2. Verifica que el banner de "Feature Flags Activos" muestre los valores correctos
3. En Firebase Console, cambia el valor de `enableCategoryFilter` a `false`
4. En la app, toca el botón de refrescar (⟳) en el header
5. El filtro de categorías debería desaparecer

## 🎯 Demostración de Feature Flags

### Feature Flag 1: `enableCategoryFilter`
- **true**: Muestra la barra de segmentos para filtrar tareas por categoría
- **false**: Oculta la barra de segmentos

### Feature Flag 2: `enableTaskDescription`
- **true**: Permite agregar descripciones a las tareas y las muestra en la lista
- **false**: Oculta el campo de descripción al crear tareas y no muestra descripciones existentes

## 📊 Testing de Remote Config

Para probar que Remote Config funciona correctamente:

1. Cambia cualquier valor en Firebase Console
2. Click en "Publicar cambios"
3. En la app, toca el botón de refrescar (⟳)
4. Los cambios deberían reflejarse inmediatamente

## 🔒 Seguridad

⚠️ **Importante**: Las credenciales de Firebase están en el código fuente. Para producción:

1. Usa variables de entorno
2. Configura reglas de seguridad en Firebase
3. Implementa autenticación si es necesario
