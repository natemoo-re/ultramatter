# `ultramatter`

Minimal frontmatter parsing in 717 bytes.

Zero dependencies. ESM-only. Parses a relaxed subset of YAML — everything you actually use in frontmatter, nothing you don't.

## Install

```sh
npm install ultramatter
```

## Usage

```js
import { parse } from 'ultramatter';

const file = `---
title: 'Astro 1.0 Beta Release'
description: 'The v1.0 Beta is now available!'
publishDate: 'April 4, 2022'
url: https://astro.build/blog/astro-1-beta-release
authors:
  - nate
  - fred
lang: 'en'
---

# Astro 1.0 Beta Release
`;

const { frontmatter, content } = parse(file);
// frontmatter => {
//   title: 'Astro 1.0 Beta Release',
//   description: 'The v1.0 Beta is now available!',
//   publishDate: 'April 4, 2022',
//   url: 'https://astro.build/blog/astro-1-beta-release',
//   authors: ['nate', 'fred'],
//   lang: 'en'
// }
// content => '# Astro 1.0 Beta Release\n'
```

## API

### `parse(input: string): Result`

```ts
interface Result {
  frontmatter?: Record<string, any>;
  content: string;
}
```

- **`input`** — a string containing optional `---`-fenced frontmatter followed by content
- **`frontmatter`** — the parsed YAML object, only present when frontmatter fences are found
- **`content`** — everything after the closing `---`

If no frontmatter is found, the result contains only `content`.

## Comparison

| | `ultramatter` | `gray-matter` |
|---|---|---|
| **Install size** | 717B gzipped | ~1.3MB |
| **Dependencies** | 0 | 4 |
| **YAML coverage** | Frontmatter subset | Full YAML 1.1 |

`gray-matter` is ~3.5x faster on nested fixtures (~726K vs ~201K ops/sec). If raw throughput on complex YAML matters more than bundle size, use `gray-matter`.

## Supported YAML

`ultramatter` supports the subset of YAML that commonly appears in frontmatter:

- **Key-value pairs** — `title: Hello World`
- **Nested maps** — indented key-value pairs under a parent key
- **Sequences** — `- item` (indented under a key)
- **Inline arrays** — `tags: [a, b, c]`
- **Literal blocks** — `description: |` followed by indented lines
- **Comments** — `# ignored`
- **Quoted strings** — `'single'` or `"double"`
- **Booleans** — `true` and `false` only (not `yes`/`no`/`on`/`off`)
- **Numbers** — automatically coerced

## Not Supported

`ultramatter` intentionally skips YAML features that rarely appear in document frontmatter:

- `null` / `undefined` coercion (returned as strings)
- Date coercion (returned as strings — parse them yourself)
- Inline objects (`{key: value}`)
- Folded blocks (`>`)
- Anchors and aliases
- Multi-document streams
- Complex keys
- Type tags (`!!str`, `!!int`, etc.)

If you need full YAML support, use [`gray-matter`](https://github.com/jonschlinkert/gray-matter) or [`js-yaml`](https://github.com/nodeca/js-yaml) directly.

## License

MIT
