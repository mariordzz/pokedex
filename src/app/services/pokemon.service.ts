import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { Pokemon, Species, EvolutionChain } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  searchPokemon(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/${name}`).pipe(
      catchError(this.handleError)
    );
  }

  getAllPokemons(limit: number = 24, offset: number = 0): Observable<any> {
    return this.http.get<{ results: { url: string }[], count: number }>(`${this.apiUrl}?offset=${offset}&limit=${limit}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPokemonDetails(url: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(url).pipe(
      catchError(this.handleError)
    );
  }

  getSpecies(url: string): Observable<Species> {
    return this.http.get<Species>(url).pipe(
      catchError(this.handleError)
    );
  }

  getEvolutionChainByUrl(url: string): Observable<EvolutionChain> {
    return this.http.get<EvolutionChain>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('error:', error);
    return throwError(() => new Error('error al procesar la solicitud'));
  }
}
