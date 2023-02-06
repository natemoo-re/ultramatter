import { parse } from "../src";
import { describe, expect, it, test } from "vitest";

describe('frontmatter', () => {
  it(`works with simple example`, async () => {
    const input = `---
hello: world
---

# Title`
    expect(parse(input)).toEqual({ frontmatter: { hello: 'world' }, content: '# Title' });
  })

  it(`works with no frontmatter`, async () => {
    const input = `# Title`
    expect(parse(input)).toEqual({ content: '# Title' });
  })

  it(`works with random dashes frontmatter`, async () => {
    const input = `# Title\n---`
    expect(parse(input)).toEqual({ content: input });
  })

  it(`ignores --- with prefix`, async () => {
    const input = `# --- Title\n--- Woo`
    expect(parse(input)).toEqual({ content: input });
  })

  it(`ignores --- in body`, async () => {
    const input = `# Title

---
foo: bar
---

Woo`
    expect(parse(input)).toEqual({ content: input });
  })

  it(`works with array`, async () => {
    const input = `---
title: Foobar
values: [a, b, 'c', true, false, 0, 1]
---

# Title`
    expect(parse(input)).toEqual({ frontmatter: { title: 'Foobar', values: ['a', 'b', 'c', true, false, 0, 1] }, content: '# Title' });
  })

   it(`works with list`, async () => {
    const input = `---
title: Foobar
values:
  - a
  - b
  - 'c'
  - true
  - false
  - 0
  - 1
---

# Title`
    expect(parse(input)).toEqual({ frontmatter: { title: 'Foobar', values: ['a', 'b', 'c', true, false, 0, 1] }, content: '# Title' });
  })

  it(`works with block string`, async () => {
    const input = `---
title: Foobar
description: |
  Lorem ipsum
  testing
---

# Title`
    expect(parse(input)).toEqual({ frontmatter: { title: 'Foobar', description: 'Lorem ipsum\ntesting' }, content: '# Title' });
  })

  it(`handles comments`, async () => {
    const input = `---
title: Foobar # test
# other
authors:
  # List comment
  - nate
  - fred
---

# Title`
    expect(parse(input)).toEqual({ frontmatter: { title: 'Foobar', authors: ['nate', 'fred'] }, content: '# Title' });
  })

  it(`handles realword example`, async () => {
    const input = `---
title: 'Astro 1.0 Beta Release'
description: 'The Astro 1.0 Beta is now available! This release marks the stabilization of all major APIs, with no more major breaking changes planned between now and the official v1.0 release.'
publishDate: 'April 4, 2022'
url: https://foobar.com/
authors:
  - nate
  - fred
socialImage: '/assets/blog/astro-1-beta-release/social.png'
coverImage: '/assets/blog/astro-1-beta-release/cover.png'
lang: 'en'
---

# Title`
    expect(parse(input)).toEqual({ frontmatter: {
      title: 'Astro 1.0 Beta Release',
      description: 'The Astro 1.0 Beta is now available! This release marks the stabilization of all major APIs, with no more major breaking changes planned between now and the official v1.0 release.',
      publishDate: 'April 4, 2022',
      url: "https://foobar.com/",
      authors: ['nate', 'fred'],
      socialImage: '/assets/blog/astro-1-beta-release/social.png',
      coverImage: '/assets/blog/astro-1-beta-release/cover.png',
      lang: 'en'
    }, content: '# Title' });
  })

})
