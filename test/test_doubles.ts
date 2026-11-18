import { FileAccess } from "../src/file_access.ts";
import type { NumberReader } from "../src/number_reader.ts";

export class FakeNumberReader implements NumberReader {
  private readonly files = new Map<string, Array<number>>();

  constructor(private readonly path: string) {}

  public addFile(path: string, numbers: Array<number>): void {
    this.files.set(path, [...numbers]);
  }

  public readNumbers(): Promise<Array<number>> {
    const numbers = this.files.get(this.path);
    if (numbers === undefined) {
      return Promise.reject(
        new Error(`No fake file registered for path: ${this.path}`),
      );
    }
    return Promise.resolve([...numbers]);
  }
}

export class FixedNumberStub implements NumberReader {
  public readNumbers(): Promise<Array<number>> {
    return Promise.resolve([2, 4, 6]);
  }
}

export class ConfigurableNumberStub implements NumberReader {
  constructor(private readonly numbers: Array<number>) {}

  public readNumbers(): Promise<Array<number>> {
    return Promise.resolve([...this.numbers]);
  }
}

export class CountingNumberMock implements NumberReader {
  public calls = 0;

  public readNumbers(): Promise<Array<number>> {
    this.calls++;
    return Promise.resolve([2, 4, 6]);
  }
}

export class FileAccessSpy implements NumberReader {
  public calls = 0;
  public readonly returnedValues: Array<Array<number>> = [];

  constructor(private readonly fileAccess: FileAccess) {}

  public async readNumbers(): Promise<Array<number>> {
    this.calls++;
    const numbers = await this.fileAccess.readNumbers();
    this.returnedValues.push([...numbers]);
    return numbers;
  }
}
