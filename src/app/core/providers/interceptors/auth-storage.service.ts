import { Injectable } from '@angular/core';
import { NbAuthTokenParceler, NbTokenLocalStorage } from '@nebular/auth';

export const CoreAuth = {
    OPEN_AUTH_KEY: '__open_auth',
    // LAMB_AUTH_STRATEGY_NAME: '_open_auth_strategy'
}

@Injectable({ providedIn: 'root' })
export class AuthStorageService extends NbTokenLocalStorage {
    constructor(parceler: NbAuthTokenParceler) {
        super(parceler);
        this.key = CoreAuth.OPEN_AUTH_KEY;
    }
}
