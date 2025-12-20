export class SlotNotAvailableError extends Error {
  constructor(message: string = 'O horário selecionado não está mais disponível') {
    super(message);
    this.name = 'SlotNotAvailableError';
  }
}
