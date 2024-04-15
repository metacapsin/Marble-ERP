import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class AESEncryptDecryptService {

    storagePrefix = "Private Key for My EMR";
    constructor() { }


    getToken() {
        return JSON.parse(window.localStorage.getItem(`${this.storagePrefix}_token`) as string);
    }

    setToken(token: string) {
        window.localStorage.setItem(`${this.storagePrefix}_token`, JSON.stringify(token));
    }

    getRefreshToken() {
        return JSON.parse(window.localStorage.getItem(`${this.storagePrefix}refreshToken`) as string);
    }

    setRefreshToken(token: string) {
        window.localStorage.setItem(`${this.storagePrefix}refreshToken`, JSON.stringify(token));
    }

    clearToken() {
        window.localStorage.removeItem(`${this.storagePrefix}refreshToken`);
    }

    setData(key: string, data: any) {
        const cipherText: any = CryptoJS.AES.encrypt(JSON.stringify(data), this.storagePrefix);
        window.localStorage.setItem(key, cipherText);
    }

    getData(key: string) {
        const dataString = window.localStorage.getItem(key) ? window.localStorage.getItem(key) : '';
        if (dataString) {
            const bytes = CryptoJS.AES.decrypt(dataString, this.storagePrefix);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decrypted);
        }

    }
}