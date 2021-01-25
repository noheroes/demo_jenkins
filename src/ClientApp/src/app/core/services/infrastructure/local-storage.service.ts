import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import remove from 'lodash/remove';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private crypto: CryptoService) {}

  set = (key: string, data: any) => {
    try {
      // console.log(data);
      localStorage.setItem(key, JSON.stringify(this.crypto.encrypt(data)));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  };

  get<T>(key: string): T {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      if (!data) {
        return null;
      }
      return this.crypto.decrypt<T>(data);
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return null;
    }
  }

  remove = (key: string) => {
    this.removeAll(key);
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing data from localStorage', e);
      return null;
    }
  };
  removeAll = (pattern: string) => {
    localStorage.clear();
    for (const [key, value] of Object.entries(localStorage)) {
      if (key.startsWith(pattern)) {
        this.remove(key);
      }
    }
  };
}
