import React from "react";
import { createElement } from "./core/react/index.ts";
import { createRoot } from "./core/react-dom/client/createRoot.ts";
import App from "./App";
console.log("sas1", App, React.createElement(App, { a: 1 }, "sax"));
console.log("sas2", App, React.createElement(App, { a: 1 }, ["sax"]));
console.log("sas3", App, React.createElement(App, { a: 1 }, "sax", App));
console.log("sas4", App, React.createElement(App, { a: 1 }, ["sax"], App));
console.log("sas5", App, React.createElement(App));

let test = React.createElement(App, { a: 1 }, "sax", <App a />);
console.log("sas6", test, test.type({ a: 1, children: "sax" }));

createRoot(document.getElementById("container")).render(
  createElement(
    "div",
    { a: 1, key: "test" },
    "as",
    createElement("div", { a: 1, key: "test" }, "as"),
    createElement(
      "div",
      { a: 1, key: "test" },
      "as",
      createElement("div", { a: 1, key: "test" }, "as"),
    ),
    createElement(
      "div",
      { a: 1, key: "test" },
      "as",
      createElement("div", { a: 1, key: "test" }, "as"),
    ),
  ),
);
