import { parseData } from "../src/index";
import * as fs from "fs";
import * as path from "path";

describe("index", () => {
  it("calls run when imported", async () => {
    console.log(__dirname);
    const data = fs.readFileSync(path.join(__dirname, "./testdata.txt"));

    const m = parseData(data.toString());
    console.log(m);
    expect(m["Contact Details"]).not.toBe(undefined);
  });
});
