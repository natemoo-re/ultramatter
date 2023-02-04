# `ultramatter`

A <1kB library for parsing frontmatter. `ultramatter` has zero dependencies and is compatible with any JavaScript runtime.

### Features

- It's very small.
- It's very fast.
- It supports a small, relaxed subset of YAML
  - Maps (`key: value`)
  - Sequences (`- list`)
  - Inline Arrays (`[0, 1, 2]`)
  - Literal Blocks (`|`)
  - Comments (`# comment`)
  - Quoted values (`'single'`, `"double"`)
  - Boolean values (`true` and `false` ONLY)
  - Tabs are valid
