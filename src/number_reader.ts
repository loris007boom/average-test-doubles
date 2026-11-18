export interface NumberReader {
  readNumbers(): Promise<Array<number>>;
}
