import { ReactiveController } from 'lit';
import { UsersComponent } from '../pages/users';
import { User } from './User';

export class UsersController implements ReactiveController {
  private host: UsersComponent;
  public items: User[] = [];
  
  constructor(host: UsersComponent) {
    this.host = host;
    this.host.addController(this);
  }

  async hostConnected() {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    this.host.users = await res.json();
  }
}
