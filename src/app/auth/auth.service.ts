import { Injectable, Testability } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject,  Observable } from 'rxjs';
import { User } from './user';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, tap } from 'rxjs/operators';
import decode from 'jwt-decode';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const helper = new JwtHelperService();

@Injectable()
export class AuthService {

  cachedRequests: Array<HttpRequest<any>> = [];

  // authToken: any;
  // user: any;

  private userServiceUrl = 'http://192.168.23.8/users';

  public loggedIn = new BehaviorSubject<boolean>(false); // {1}

  public _userType = new BehaviorSubject<string>(''); // {1}

  public _userName = new BehaviorSubject<string>(''); // {1}

  public collectFailedRequest(request): void {
    this.cachedRequests.push(request);
  }
  public retryFailedRequests(): void {
    // retry the requests. this method can
    // be called after the token is refreshed
  }

  get userType() {
    // this.loggedIn.next(tokenNotExpired('token'));
    this._userType.next(this.getUserType());
    return this._userType.asObservable(); // {2}
  }

  get userName() {
    // this.loggedIn.next(tokenNotExpired('token'));
    this._userName.next(this.getUserName());
    return this._userName.asObservable(); // {2}
  }

  get isLoggedIn() {
    // this.loggedIn.next(tokenNotExpired('token'));
    this.loggedIn.next(this.isAuthenticated());
    return this.loggedIn.asObservable(); // {2}
  }

  constructor(
    public http: HttpClient,
    private router: Router
  ) {}

  registerUser(user: any): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const url = `${this.userServiceUrl}/register`;

    return this.http.post(url, user, {headers: headers})
    .pipe(
      tap((result: any) => {
        this.log(`added user ${user.userName}`);
      }),
      catchError(this.handleError<any>('addUser'))
    );
  }

  login(user: User): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const url = `${this.userServiceUrl}/authenticate`;

    return this.http.post(url, user, {headers: headers})
    .pipe(
      tap( ( usertoken: any ) => {
          // no code needed here. just emiting values to subscriber.
      }),
      catchError(this.handleError<any>('authUser'))
    );

  }

  async logout() {                            // {4}
    // this.authToken = null;
    // this.user = null;
    await localStorage.clear();
    await this.loggedIn.next(false);
    await this.router.navigate(['/login']);
  }

  getProfile(): Observable<User> {
    const headers = new HttpHeaders();
    // const token = this.getToken();
    // headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');

    const url = `${this.userServiceUrl}/profile/${this.getUserName()}`;
    return this.http.get(url, {headers: headers}).pipe(
    map( ( v: any ) => v.user ))
    .pipe(
      tap( ( data: User ) => // OR tap( ( data: any ) => data.any)
          this.log(`fetched user profile`)),
      catchError(this.handleError<User>('profileUser'))
    );
  }

  // < NEW TOKEN CODE
  public getToken(): string {
    return localStorage.getItem('token');
  }

  public getUserName(): string {
    return localStorage.getItem('userName');
  }

  public getUserType(): string {
    return localStorage.getItem('usertype'); // {2}
  }

  public getUserOffice(): string {
    return localStorage.getItem('useroffice'); // {2}
  }

  public getUserMobile(): string {
    return localStorage.getItem('mobileno'); // {2}
  }

  public getUserEventCreator(): string {
    return localStorage.getItem('eventcreator'); // {2}
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    // return tokenNotExpired(null, token);

    // const decodedToken = helper.decodeToken(token);
    // const expirationDate = helper.getTokenExpirationDate(token);
    const isExpired = helper.isTokenExpired(token);
    return !isExpired;
  }
  // > NEW TOKEN CODE

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    // I think Stringfy will be helpful someday...
    // localStorage.setItem('user',JSON.stringify(user));
    localStorage.setItem('user', user);
    localStorage.setItem('userName', user.userName);
    localStorage.setItem('usertype', user.usertype);
    localStorage.setItem('mobileno', user.mobileno);
    localStorage.setItem('useroffice', user.useroffice);
    localStorage.setItem('eventcreator', user.eventcreator);
    // this.authToken = token;
    // this.user = user;
  }

  /** Log a HeroService message with the MessageService */
  public async log(message: string) {
    // await this.messageService.add('Auth Service: ' + message);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return error;
    };
  }
}
