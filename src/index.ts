function split(input: string): [string, string] {
  let match = 0;
  let state: "open" | "closed" | "default" = "default";
  let locs: number[] = [];
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === "-") {
      if (match === 0) {
        if (
          (state === "default" && i == 0) ||
          (state === "open" && input[i - 1] === "\n")
        ) {
          match = 1;
        } else {
          continue;
        }
      } else {
        match++;
      }
    } else {
      match = 0;
    }
    if (match === 3) {
      state = state === "default" ? "open" : "closed";
      locs.push(i + 1);
    }
  }
  switch (state) {
    case "default":
      return ["", input];
    case "open":
      return ["", input];
    case "closed":
      return [
        input.slice(locs[0], locs[1] - 3).trim(),
        input.slice(locs[1]).trimStart(),
      ];
  }
}

const getIndent = (value: string) =>
  value.slice(0, value.length - value.trimStart().length);
const dedent = (value: string) => {
  const indent = getIndent(value);
  return value
    .split("\n")
    .map((ln) => ln.slice(indent.length))
    .join("\n");
};
const unquote = (value: string) => {
  if (value[0] === '"' || value[0] === "'") {
    const quote = value[0];
    if (value[value.length - 1] === quote) {
      return value.slice(1, -1);
    }
  }
  return value;
}
const coerce = (value: string) => {
  if (value === 'true' || value === 'false') return value === 'true';
  if (!Number.isNaN(Number(value))) return Number(value);
  return unquote(value);
}

const yaml = (input: string): any => {
  const YAML_OBJECT_RE = /(^[^\:\s]+):(?!\/)\n?([\s\S]*?(?=^\S)|[\s\S]*$)/gm;
  const YAML_TOKENS_RE = /[\:\-\[\]\|\#]/gm;
  const YAML_COMMENT_RE = /#.*$/gm;

  const indent = getIndent(input);
  if (!YAML_TOKENS_RE.test(input)) {
    if (indent.length > 1) {
      return dedent(input)
    } else {
      return coerce(input.trim())
    }
  }
  if (indent.length <= 1) {
    input = input.trimStart();
  }

  let block;
  let obj: Record<string, any> = {};
  while ((block = YAML_OBJECT_RE.exec(input))) {
    let [_, key, value] = block;
    const indent = getIndent(value);
    if (indent.length > 1) {
      const lines = dedent(value);
      obj[key] = yaml(lines);
    } else {
      obj[key] = yaml(value);
    }
  }
  if (Object.keys(obj).length > 0) {
    return obj;
  }
  
  let value = input.trim().replace(YAML_COMMENT_RE, '').trim();
  if (value.startsWith('-')) {
    const items = value.split(/^\-/gm).filter(v => v).map(v => yaml(v.trimEnd()))
    return items;
  } else if (value.startsWith("[")) {
    value = value.slice(1, -1);
    return value.split(",").map((v) => coerce(v.trim()));
  } else if (value.startsWith("|")) {
    return dedent(value.replace("|", "").replace("\n", ""));
  } else {
    return coerce(value.trim());
  }
};

export interface Result {
  frontmatter?: Record<string, any>;
  content: string;
}

export function parse(input: string): Result {
  const [raw, content] = split(input);

  if (raw) {
    return {
      frontmatter: yaml(raw),
      content,
    };
  }

  return {
    content,
  };
}
