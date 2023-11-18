import { parseData, hasLabel } from "../src/index";
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

describe("hasLabel", () => {
  it("returns true if label exists", async () => {
    const issue = {
      data: {
        labels: [
          {
            id: 6166972573,
            node_id: "LA_kwDOKpCqBc8AAAABb5SInQ",
            url: "https://api.github.com/repos/gavinminami/issue-mgmt/labels/bug",
            name: "bug",
            color: "d73a4a",
            default: true,
            description: "Something isn't working",
          },
        ],
      },
    };
    expect(hasLabel(issue, "bug")).toBeTruthy();
  });

  it("returns false if label doesn't exist", async () => {
    const issue = {
      data: {
        labels: [
          {
            id: 6166972573,
            node_id: "LA_kwDOKpCqBc8AAAABb5SInQ",
            url: "https://api.github.com/repos/gavinminami/issue-mgmt/labels/bug",
            name: "bug",
            color: "d73a4a",
            default: true,
            description: "Something isn't working",
          },
        ],
      },
    };
    expect(hasLabel(issue, "blah")).toBeFalsy();
  });
});
