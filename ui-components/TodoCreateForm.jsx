/* eslint-disable */
"use client";
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createTodo } from "./graphql/mutations";
const client = generateClient();
export default function TodoCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    content: "",
    isDone: false,
    duedate: "",
    env: "",
  };
  const [content, setContent] = React.useState(initialValues.content);
  const [isDone, setIsDone] = React.useState(initialValues.isDone);
  const [duedate, setDuedate] = React.useState(initialValues.duedate);
  const [env, setEnv] = React.useState(initialValues.env);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setContent(initialValues.content);
    setIsDone(initialValues.isDone);
    setDuedate(initialValues.duedate);
    setEnv(initialValues.env);
    setErrors({});
  };
  const validations = {
    content: [],
    isDone: [],
    duedate: [],
    env: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          content,
          isDone,
          duedate,
          env,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createTodo.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "TodoCreateForm")}
      {...rest}
    >
      <TextField
        label="Content"
        isRequired={false}
        isReadOnly={false}
        value={content}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              content: value,
              isDone,
              duedate,
              env,
            };
            const result = onChange(modelFields);
            value = result?.content ?? value;
          }
          if (errors.content?.hasError) {
            runValidationTasks("content", value);
          }
          setContent(value);
        }}
        onBlur={() => runValidationTasks("content", content)}
        errorMessage={errors.content?.errorMessage}
        hasError={errors.content?.hasError}
        {...getOverrideProps(overrides, "content")}
      ></TextField>
      <SwitchField
        label="Is done"
        defaultChecked={false}
        isDisabled={false}
        isChecked={isDone}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              content,
              isDone: value,
              duedate,
              env,
            };
            const result = onChange(modelFields);
            value = result?.isDone ?? value;
          }
          if (errors.isDone?.hasError) {
            runValidationTasks("isDone", value);
          }
          setIsDone(value);
        }}
        onBlur={() => runValidationTasks("isDone", isDone)}
        errorMessage={errors.isDone?.errorMessage}
        hasError={errors.isDone?.hasError}
        {...getOverrideProps(overrides, "isDone")}
      ></SwitchField>
      <TextField
        label="Duedate"
        isRequired={false}
        isReadOnly={false}
        value={duedate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              content,
              isDone,
              duedate: value,
              env,
            };
            const result = onChange(modelFields);
            value = result?.duedate ?? value;
          }
          if (errors.duedate?.hasError) {
            runValidationTasks("duedate", value);
          }
          setDuedate(value);
        }}
        onBlur={() => runValidationTasks("duedate", duedate)}
        errorMessage={errors.duedate?.errorMessage}
        hasError={errors.duedate?.hasError}
        {...getOverrideProps(overrides, "duedate")}
      ></TextField>
      <TextField
        label="Env"
        isRequired={false}
        isReadOnly={false}
        value={env}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              content,
              isDone,
              duedate,
              env: value,
            };
            const result = onChange(modelFields);
            value = result?.env ?? value;
          }
          if (errors.env?.hasError) {
            runValidationTasks("env", value);
          }
          setEnv(value);
        }}
        onBlur={() => runValidationTasks("env", env)}
        errorMessage={errors.env?.errorMessage}
        hasError={errors.env?.hasError}
        {...getOverrideProps(overrides, "env")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
