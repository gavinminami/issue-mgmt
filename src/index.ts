import * as fs from "fs";
import * as path from "path";
import { parse } from "yaml";

// map of string to string array
type StringToStringArrayMapType = {
  [key: string]: string[];
};

// github issue template field type
type GithubIssueTemplateFieldType = {
  id: string;
  type: string;
  attributes: {
    label: string;
    multiple: boolean;
  };
};

// parse form data into key-value pairs where the key
// is the field label and the key is an array of lines
// which follow the line: ### <field_label>
export function parseData(formData: string): StringToStringArrayMapType {
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

// parse the issue template
export function parseIssueTemplate(templateFile: string): any {
  console.log(process.cwd(), ".github/ISSUE_TEMPLATE", templateFile);
  const issueTemplateYaml = fs.readFileSync(
    path.join(process.cwd(), ".github/ISSUE_TEMPLATE", templateFile)
  );

  return parse(issueTemplateYaml.toString());
}

// build a map of field id to value
export function buildFieldIdToValueMap(issueTemplate: any, formData: any): any {
  let m = {};
  let field: GithubIssueTemplateFieldType;
  for (field of issueTemplate?.body) {
    const { id, type } = field;
    const { label, multiple } = field?.attributes;
    if (id === undefined || label === undefined) {
      continue;
    }

    let value = undefined;
    let formLines = formData[label] as [string];
    if (type === "dropdown" && multiple) {
      // filter out empty lines
      value = formLines.filter(function (element) {
        return element.length > 0;
      });
    } else {
      // join the lines into a single string
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

// parse the issue template and form data into a map
export function parseIssueData(issueTemplateFile: string, issueBody: any): any {
  const parsedData = parseData(issueBody);

  // parse the issue template
  const issueTemplate = parseIssueTemplate(issueTemplateFile);
  return buildFieldIdToValueMap(issueTemplate, parsedData);
}

// check if the issue has a label
export function hasLabel(issue: any, labelName: string): boolean {
  const labels = issue?.data?.labels;
  return !!labels?.find(({ name }: { name: string }) => labelName === name);
}

// check if the issue has a label
export function readFileAsString(relPath: string) {
  console.log(process.cwd(), `reading contents of ${relPath}`);
  const issueTemplateYaml = fs.readFileSync(path.join(process.cwd(), relPath));

  return issueTemplateYaml.toString();
}
