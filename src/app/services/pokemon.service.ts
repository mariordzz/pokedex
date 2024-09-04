import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, from } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  searchPokemon(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${name}`);
  }

  getPokemons(limit: number = 24, offset: number = 0): Observable<any> {
    return this.http.get(`${this.apiUrl}?offset=${offset}&limit=${limit}`);
  }

  getPokemonDetails(url: string): Observable<any> {
    return this.http.get(url);
  }

  getSpecies(url: string): Observable<any> {
    return this.http.get(url);
  }

  getEvolutionChainByUrl(url: string): Observable<any> {
    return this.http.get(url);
  }

}
