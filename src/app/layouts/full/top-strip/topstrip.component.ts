import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TablerIconsModule } from 'angular-tabler-icons';
import { SessionService } from 'src/app/services/session.service';
SessionService
@Component({
    selector: 'app-topstrip',
    imports: [TablerIconsModule, MatButtonModule, MatMenuModule],
    templateUrl: './topstrip.component.html',
})
export class AppTopstripComponent implements OnInit {
    user: any;
    sessionObj: any;
    constructor(private sessionService: SessionService) { }
    //  private usuario = this.sessionService.checkSession();

    ngOnInit() {
        const session = localStorage.getItem('session');
        if (session) {
            this.sessionObj = JSON.parse(session);
            console.log('Usuario en sesión:', this.sessionObj.user.username);
            console.log('ID de usuario:', this.sessionObj.user.company_name);
        } else {
            console.log('No hay usuario en sesión');
        }


        // this.sessionService.checkSession().subscribe((res: any) => {
        //     if (res.loggedIn) {
        //         this.user = res.user;
        //         console.log('Sesión activa:', this.user);
        //     } else {
        //         console.log('No hay sesión activa');
        //     }
        // });
    }


}
