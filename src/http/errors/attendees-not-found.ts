export class AttendeesNotFoundError extends Error {
  constructor() {
    super('Attendees not found.')
  }
}
