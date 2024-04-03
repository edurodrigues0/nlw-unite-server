export class EmailAlreadyRegisteredInEventError extends Error {
  constructor() {
    super('E-mail already registered in event.')
  }
}
