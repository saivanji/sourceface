import React from "react";
import Input from "./index";

export default { title: "Input" };

const props = {
  placeholder: "Please enter the text"
};

export const compactSize = () => <Input {...props} size="compact" />;
export const normalSize = () => <Input {...props} size="normal" />;
export const looseSize = () => <Input {...props} size="loose" />;
export const fitsContainer = () => <Input {...props} shouldFitContainer />;
export const error = () => (
  <Input {...props} error="This field is required" shouldFitContainer />
);
