import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

@Injectable()
export class StoreUserActionsService {

    private state: any = {
        userActions: [],
    };

    private userActions$ = new ReplaySubject<any[]>(1);

    constructor() { }

    public getUserActions$(): Observable<any[]> {
        return this.userActions$.asObservable();
    }

    public setUserActions(actions: any[]) {
        if (actions.length) {
            this.state.userActions = actions;
        } else {
            this.state.userActions = [];
        }
        this.userActions$.next(this.state.userActions);
    }
}

