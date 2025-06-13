import React from "react";
import PostUi from "../postUi";
import { formState, useFormState } from "@/lib/stores/formStore";
function Resume() {
  const formState = useFormState();
  return (
    <div className="w-full ">
      {formState.form && <PostUi postData={formState.form} />}
    </div>
  );
}

export default Resume;
