export class LateCheckInValidateError extends Error {
  constructor() {
    super(
      'The check-in can only by validated until 20 minutes of its creation.',
    )
  }
}
