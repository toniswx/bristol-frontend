"use client";
import { useFormState } from "@/lib/stores/formStore";
import React from "react";

function NewPost(props: {
  data: { formId: string; form: React.ReactElement }[];
}) {
  const formState = useFormState();

  return <div>{props.data[formState.formStep].form}</div>;
}

export default NewPost;
