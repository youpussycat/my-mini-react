import React from "./core/react/index.ts";
let a = 1;
import { update } from "./core/react-dom/client/createRoot.ts";
function Profile(props) {
  console.log(React.createElement("sas"));
  return (
    <div
      x="1"
      onClick={() => {
        a++;
        debugger;
        update(document.getElementById("container"));
      }}
    >
      props: {JSON.stringify(props)}
      a:{a}
      {/* <img src="https://i.imgur.com/MK3eW3Am.jpg" alt="Katherine Johnson" /> */}
    </div>
  );
}

export default (props) => <Profile {...props} />;
