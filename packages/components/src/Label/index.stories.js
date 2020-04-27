import React from "react";
import Label from "./index";

export default { title: "Label" };

const Placeholder = () => <img src="https://via.placeholder.com/360x40" />;

export const required = () => (
  <Label title="Username" isRequired>
    <Placeholder />
  </Label>
);
export const notRequired = () => (
  <Label title="Username">
    <Placeholder />
  </Label>
);
