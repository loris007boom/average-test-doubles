import { assertEquals } from "@std/assert";
import { Average } from "../src/average.ts";
import { FileAccess } from "../src/file_access.ts";
import {
  ConfigurableNumberStub,
  CountingNumberMock,
  FakeNumberReader,
  FileAccessSpy,
  FixedNumberStub,
} from "./test_doubles.ts";

Deno.test("computes the mean with a fake number reader", async () => {
  const path = "/path/to/some/other/file";
  const reader = new FakeNumberReader(path);
  reader.addFile(path, [1, 2, 3, 4, 5]);

  const average = new Average(reader);

  assertEquals(await average.computeMeanOfFile(), 3);
});

Deno.test("computes the mean with a fixed stub", async () => {
  const average = new Average(new FixedNumberStub());

  assertEquals(await average.computeMeanOfFile(), 4);
});

Deno.test("computes the mean with a configurable stub", async () => {
  const average = new Average(new ConfigurableNumberStub([2, 4, 6]));

  assertEquals(await average.computeMeanOfFile(), 4);
});

Deno.test("the mock records that it was called", async () => {
  const mock = new CountingNumberMock();
  const average = new Average(mock);

  assertEquals(await average.computeMeanOfFile(), 4);
  assertEquals(mock.calls, 1);
});

Deno.test({
  name: "the spy records the real file access result",
  permissions: { read: true, write: true },
  fn: async () => {
    const path = await Deno.makeTempFile();
    try {
      await Deno.writeTextFile(path, "1\n2\n3\n");
      const spy = new FileAccessSpy(new FileAccess(path));
      const average = new Average(spy);

      assertEquals(await average.computeMeanOfFile(), 2);
      assertEquals(spy.calls, 1);
      assertEquals(spy.returnedValues, [[1, 2, 3]]);
    } finally {
      await Deno.remove(path);
    }
  },
});
