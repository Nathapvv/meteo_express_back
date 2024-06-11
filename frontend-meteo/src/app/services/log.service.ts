import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable()
export class LogService {
  constructor() {}

  public handleError(error: HttpErrorResponse) {
    // Add error in log list
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }

    // Check if error.error is a JSON string
    try {
      const parsedError = JSON.parse(error.error);
      return throwError(parsedError);
    } catch (jsonError) {
      // If parsing as JSON fails, return the original error
      return throwError(error.error);
    }
  }
}
