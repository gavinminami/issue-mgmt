import { parse } from "yaml";
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

// parse form data into key-value pairs where the key
// is the field label and the key is an array of lines
// which follow the line: ### <field_label>
export function parseData(formData: string): MyMapType {
  const lines = formData.split("\n");
  const jsondata = {};

  let key;
  let val = [];
  for (var i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("###")) {
      if (key !== undefined) {
        // add the key and value to the map
        Object.assign(jsondata, {
          [`${key}`]: val,
        });
        key = undefined;
      }

      // parse the field label
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

export function buildFieldLabelToIdMap(issueTemplate: any, formData: any): any {
  let m = {};
  let field: Field;
  for (field of issueTemplate?.body) {
    const { id, type } = field;
    const { label, multiple } = field?.attributes;
    if (id === undefined || label === undefined) {
      continue;
    }

    let value = undefined;
    let formLines = formData[label] as [string];
    if (type === "dropdown" && multiple) {
      value = formLines.filter(function (element) {
        return element.length > 0;
      });
    } else {
      value = formLines.join("");
    }

    m = {
      ...m,
      [id]: {
        label,
        type,
        multiple,
        value,
      },
    };
  }

  return m;
}

export function parseIssueData(issueTemplateFile: string, issueBody: any): any {
  console.log({ body: issueBody });
  const parsedData = parseData(issueBody);
  console.log(JSON.stringify({ parsedData: parsedData }, null, 2));

  // parse the issue template
  const issueTemplate = parseIssueTemplate(issueTemplateFile);
  console.log(JSON.stringify({ issueTemplate: issueTemplate }, null, 2));
  return buildFieldLabelToIdMap(issueTemplate, parsedData);
}

export function hasLabel(issue: any, labelName: string): boolean {
  const labels = issue?.data?.labels;
  return !!labels?.find(({ name }: { name: string }) => labelName === name);
}

export function readFileAsString(relPath: string) {
  console.log(process.cwd(), `reading contents of ${relPath}`);
  const issueTemplateYaml = fs.readFileSync(path.join(process.cwd(), relPath));

  return issueTemplateYaml.toString();
}
