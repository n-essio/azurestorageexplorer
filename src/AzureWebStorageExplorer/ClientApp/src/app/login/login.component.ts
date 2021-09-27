import { Component, Inject, ViewChild, Output, EventEmitter } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';

@Component({
	selector: 'login',
	templateUrl: './login.component.html'
})

export class LoginComponent {

  @ViewChild('azureAccount', { read: null, static: true}) azureAccount: any;
  @ViewChild('azureKey', { read: null, static: true }) azureKey: any;
  @ViewChild('azureEndpointSuffix', { read: null, static: true }) azureEndpointSuffix: any;

	public currentVersion: string | undefined;

	//https://yakovfain.com/2016/10/31/angular-2-component-communication-with-events-vs-callbacks/
	@Output() signedIn: EventEmitter<boolean> = new EventEmitter();

	public loading: boolean = false;
	public showError: boolean = false;

	constructor(private utilsService: UtilsService) {

		let account = this.utilsService.getAccount();
		let key = this.utilsService.getKey();
		let endpointSuffix = this.utilsService.getEndpointSuffix();

		if (account && key && endpointSuffix)
			this.logIn(account, key, endpointSuffix);
		else
			this.logOut();
	}

	signIn() {
		this.loading = true;
		this.showError = false;

		let account = encodeURIComponent(this.azureAccount.nativeElement.value);
		let key = encodeURIComponent(this.azureKey.nativeElement.value);
		let endpointSuffix = encodeURIComponent(this.azureEndpointSuffix.nativeElement.value);

		this.logIn(account, key, endpointSuffix);
	}

	logIn(account: string, key: string, endpointSuffix: string) {
		this.utilsService.signIn(account, key, endpointSuffix).subscribe( () => {
			this.loading = false;
			this.signedIn.emit(true);
			this.utilsService.saveCredntials(account, key, endpointSuffix);
		}, error => {
			console.error(error)
			this.logOut();
			this.showError = true;
		});
	}

	logOut() {
		this.utilsService.clearCredentials();
		this.loading = false;
		this.signedIn.emit(false);
	}

	typingMessage(event: KeyboardEvent) {
		if (this.showError)
			this.showError = false;
		if (event.key == 'Enter')
			this.signIn();
	}
}
