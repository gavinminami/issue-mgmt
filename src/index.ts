type MyMapType = {
  [key: string]: string[];
};

export function parseData(formData: string): MyMapType {
  const lines = formData.split("\n");
  const jsondata = {};

  let key;
  let val = [];
  for (var i = 0; i < lines.length; i++) {
    console.log(lines[i]);
    const line = lines[i];
    if (line.startsWith("###")) {
      if (key !== undefined) {
        Object.assign(jsondata, {
          [`${key}`]: val,
        });
        key = undefined;
      }
      key = line.split("### ")[1];
      console.log({ key });
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

export function hasLabel(issue: any, labelName: string): boolean {
  const labels = issue?.data?.labels;
  return !!labels?.find(({ name }: { name: string }) => labelName === name);
}
