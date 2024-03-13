import { FederatedEvent } from './FederatedEvent';

export class CustomEvent extends FederatedEvent {
  constructor(eventName: string, eventArgs?: object) {
    super(null);

    this.type = eventName;
    this.detail = eventArgs;
  }
}
