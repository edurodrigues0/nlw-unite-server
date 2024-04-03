export class LimitOfAttendeesExceededError extends Error {
  constructor() {
    super('Limit of attendees exceeded.')
  }
}
