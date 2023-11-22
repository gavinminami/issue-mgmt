import { parse, stringify } from "yaml";
import * as fs from "fs";
import * as path from "path";

type MyMapType = {
  [key: string]: string[];
};

type StringMapType = {
  [key: string]: string;
};
type Field = {
  id: string;
  type: string;
  attributes: StringMapType;
};

export function parseData(formData: string): MyMapType {
  const lines = formData.split("\n");
  const jsondata = {};

  let key;
  let val = [];
  for (var i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("###")) {
      if (key !== undefined) {
        Object.assign(jsondata, {
          [`${key}`]: val,
        });
        key = undefined;
      }
      key = line.split("### ")[1];
      val = [];
    } else {
      val.push(line);
    }
  }

  if (key !== undefined) {
    Object.assign(jsondata, {
      [`${key}`]: val,
    });
  }

  return jsondata;
}

export function parseIssueTemplate(templateFile: string): any {
  console.log(process.cwd(), ".github/ISSUE_TEMPLATE", templateFile);
  const issueTemplateYaml = fs.readFileSync(
    path.join(process.cwd(), ".github/ISSUE_TEMPLATE", templateFile)
  );

  return parse(issueTemplateYaml.toString());
}

export function buildFieldLabelToIdMap(issueTemplate: any): any {
  let m = {};
  let field: Field;
  for (field of issueTemplate?.body) {
    const { id, type } = field;
    const { label } = field?.attributes;
    if (id === undefined || label === undefined) {
      continue;
    }

    m = {
      ...m,
      [label]: {
        id,
        type,
      },
    };
  }

  return m;
}

export function hasLabel(issue: any, labelName: string): boolean {
  const labels = issue?.data?.labels;
  return !!labels?.find(({ name }: { name: string }) => labelName === name);
}
