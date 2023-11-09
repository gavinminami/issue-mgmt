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
      }
      key = line.split("### ")[1];
      console.log({ key });
      val = [];
    } else {
      val.push(line);
    }
  }

  return jsondata;
}
