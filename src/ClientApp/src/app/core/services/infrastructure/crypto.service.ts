import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

const encryptKey: string = 'D3923BDE-C58B-4F4A-8DAC-E9F301CDB8FD';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  encrypt(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), encryptKey).toString();
  }

  decrypt<T>(data: string): T {
    const bytes = CryptoJS.AES.decrypt(data, encryptKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

}
