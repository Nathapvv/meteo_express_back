import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable()
export class LogService {
  constructor() {}

  /**
   * La fonction handleError dans TypeScript enregistre et gère les erreurs HTTP, en essayant d'analyser
   * la réponse d'erreur au format JSON si possible.
   * @param {HttpErrorResponse} error - Le paramètre `error` dans la fonction `handleError` est de type
   * `HttpErrorResponse`, qui est généralement renvoyé lors des requêtes HTTP dans les applications
   * angulaires. Cet objet contient des informations sur l'erreur survenue lors de la requête HTTP,
   * telles que le code d'état, le message d'erreur et toute donnée supplémentaire.
   * @returns La fonction `handleError` renvoie soit l'objet d'erreur JSON analysé si `error.error` est
   * une chaîne JSON valide, soit l'original `error.error` si l'analyse car JSON échoue.
   */
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
