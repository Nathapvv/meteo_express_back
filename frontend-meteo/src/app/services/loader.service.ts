import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LoaderService {
  private loaderSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor() {}

  show(): void {
    this.loaderSubject.next(true);
  }

  hide(): void {
    this.loaderSubject.next(false);
  }

  getLoaderState(): Observable<boolean> {
    return this.loaderSubject.asObservable();
  }
}
