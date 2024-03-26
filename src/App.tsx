import React from "./core/react/index.ts";
function Profile(props) {
  console.log(React.createElement("sas"));
  return (
    <div>
      props: {JSON.stringify(props)}
      <img src="https://i.imgur.com/MK3eW3Am.jpg" alt="Katherine Johnson" />
    </div>
  );
}

export default (props) => <Profile {...props} />;
