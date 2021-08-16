import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NewsLetterService {
  constructor(private http: HttpClient) {}

  // TODO add notification service  in  backend
  addPushSubscriber(sub: any): Observable<any> {
    const url = 'http://localhost:5000/api/addSubscriber';
    const newSubscriber = { subscriber: sub };
    console.log('new user is ', newSubscriber);
    return this.http.post(url, newSubscriber);
  }

  //  newletter
  triggerSendLetter(): Observable<any> {
    const url = 'http://localhost:5000/api/sendNewsletter';

    return this.http.get(url);
  }
}
