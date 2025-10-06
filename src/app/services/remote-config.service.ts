import { Injectable } from '@angular/core';
import {
  RemoteConfig,
  fetchAndActivate,
  getBoolean,
  getString,
  getValue
} from '@angular/fire/remote-config';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FeatureFlags {
  enableCategoryFilter: boolean;
  enableTaskDescription: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {
  private featureFlagsSubject = new BehaviorSubject<FeatureFlags>({
    enableCategoryFilter: true,
    enableTaskDescription: true,
  });

  public featureFlags$: Observable<FeatureFlags> = this.featureFlagsSubject.asObservable();

  constructor(private remoteConfig: RemoteConfig) {
    this.initializeRemoteConfig();
  }

  private async initializeRemoteConfig(): Promise<void> {
    try {
      // Configurar valores por defecto
      // En desarrollo: 0 para obtener siempre los valores más recientes
      // En producción: usar un valor más alto (ej: 3600000 = 1 hora)
      this.remoteConfig.settings.minimumFetchIntervalMillis = 0;

      this.remoteConfig.defaultConfig = {
        enableCategoryFilter: true,
        enableTaskDescription: true,
      };

      console.log('🔧 Configuración de Remote Config:', {
        minimumFetchInterval: this.remoteConfig.settings.minimumFetchIntervalMillis,
        defaultConfig: this.remoteConfig.defaultConfig
      });

      // Obtener y activar configuración remota
      const activated = await fetchAndActivate(this.remoteConfig);
      console.log('📥 Fetch and Activate resultado:', activated);

      this.updateFeatureFlags();

      console.log('✅ Remote Config inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar Remote Config:', error);
      console.warn('⚠️ Usando valores por defecto');
      // Continuar con valores por defecto
    }
  }

  private updateFeatureFlags(): void {
    try {
      const flags: FeatureFlags = {
        enableCategoryFilter: getBoolean(this.remoteConfig, 'enableCategoryFilter'),
        enableTaskDescription: getBoolean(this.remoteConfig, 'enableTaskDescription'),
      };

      this.featureFlagsSubject.next(flags);
      console.log('🚀 Feature Flags actualizados:', flags);
    } catch (error) {
      console.error('Error al actualizar feature flags:', error);
    }
  }

  async refreshConfig(): Promise<void> {
    try {
      await fetchAndActivate(this.remoteConfig);
      this.updateFeatureFlags();
      console.log('🔄 Configuración actualizada desde Firebase');
    } catch (error) {
      console.error('Error al refrescar configuración:', error);
      throw error;
    }
  }

  getFeatureFlag(key: keyof FeatureFlags): any {
    return this.featureFlagsSubject.value[key];
  }

  isFeatureEnabled(key: keyof FeatureFlags): boolean {
    const value = this.getFeatureFlag(key);
    return typeof value === 'boolean' ? value : false;
  }
}
