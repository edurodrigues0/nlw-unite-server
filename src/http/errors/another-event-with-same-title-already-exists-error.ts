export class AnotherEventWithSameTitleAlreadyExistsError extends Error {
  constructor() {
    super('Another event with same title already exists.')
  }
}
