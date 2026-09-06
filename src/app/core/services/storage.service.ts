import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private memoryFallback = new Map<string, string>();

  /**
   * Save item to storage safely
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, serialized);
        return true;
      }
      this.memoryFallback.set(key, serialized);
      return true;
    } catch (e) {
      console.warn(`[StorageService] Failed to persist key "${key}" to localStorage:`, e);
      try {
        this.memoryFallback.set(key, JSON.stringify(value));
      } catch {
        // ignore
      }
      return false;
    }
  }

  /**
   * Retrieve item from storage
   */
  getItem<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          return JSON.parse(item) as T;
        }
      }
      const fallbackItem = this.memoryFallback.get(key);
      if (fallbackItem) {
        return JSON.parse(fallbackItem) as T;
      }
    } catch (e) {
      console.warn(`[StorageService] Failed to read key "${key}" from storage:`, e);
    }
    return defaultValue;
  }

  /**
   * Remove item from storage
   */
  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      this.memoryFallback.delete(key);
    } catch (e) {
      console.warn(`[StorageService] Failed to remove key "${key}":`, e);
    }
  }

  /**
   * Clear all storage
   */
  clear(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
      this.memoryFallback.clear();
    } catch (e) {
      console.warn('[StorageService] Failed to clear storage:', e);
    }
  }
}
