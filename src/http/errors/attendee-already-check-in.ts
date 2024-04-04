export class AttendeeAlreadyCheckInError extends Error {
  constructor() {
    super('Attendee already check in.')
  }
}
