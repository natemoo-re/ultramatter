import benchmark from "benchmark";
import { parse as ultramatter } from "../dist/index.js";
import graymatter from 'gray-matter';

// @ts-ignore
const suite = new benchmark.Suite();

const FIXTURE = `---
a: Hello world!
b:
  - 0
  - 1
  - 2
c: [true, false]
x:
  y:
    z: foobar
---

# Hello world!
`

suite
  .add("ultramatter", () => {
    ultramatter(FIXTURE);
  })
  .add("gray-matter", () => {
    graymatter(FIXTURE);
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  });

suite.run();
