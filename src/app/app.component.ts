import { Component, OnInit, HostListener } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { NewsLetterService } from './services/news-letter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ng-pwa';
  readonly VAPID_PUBLIC_KEY =
    'YOUR-OWN-PUBLIC-KEY';

  deferredPrompt: any;
  showButton = false;

  constructor(
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private newsletterService: NewsLetterService
  ) {}
  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('New version available. Load New Version?')) {
          window.location.reload();
        }
      });
    }
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: any) {
    console.log(e);
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.showButton = true;
  }

  addToHomeScreen() {
    // hide our user interface that shows our A2HS button
    this.showButton = false;
    // show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log(
          'User accepted the A2H2 prompt. We can added app to mobile screen.'
        );
      } else {
        console.log('User dismissed the A2H2  prompt');
      }
      this.deferredPrompt = null;
    });
  }

  subscribeToNotifications() {
    if (this.swPush.isEnabled) {
      this.swPush
        .requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY,
        })
        .then((sub) =>
          this.newsletterService.addPushSubscriber(sub).subscribe()
        )
        .catch((err) =>
          console.error('Could not subscribe to notifications', err)
        );
    } else {
      console.log('swPush is not enabled');
    }
  }

  triggerSendLetter() {
    if (this.swPush.isEnabled) {
      this.newsletterService.triggerSendLetter().subscribe(
        (data) => {
          console.log('letter is', data);
        },
        (err) => {
          console.log('error is ', err);
        }
      );
    }
  }
}
