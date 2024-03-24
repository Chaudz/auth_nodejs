import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../Input/Input";
import { IRegisterFormValues } from "../../types";
import { Link } from "react-router-dom";
import axios from "axios";

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterFormValues>();

  const onSubmit: SubmitHandler<IRegisterFormValues> = async (data) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:3000/api/v1/auth/register",
        {
          userName: data.userName,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }
      );

      console.log(response);

      if (response.status === 201) {
        alert(response.data.message);
      }
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data
      ) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert(`unknown error. Please try agian!!`);
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          padding: "30px 70px",
          boxShadow: "1px 2px 3px #ccc",
          borderRadius: 5,
        }}
      >
        <b>REGISTRATION FORM</b>
        <div
          style={{
            marginTop: 10,
            height: 330,
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              height: "25%",
              backgroundColor: "white",
              display: "flex",
              flexFlow: "column",
              alignItems: "start",
            }}
          >
            <Input<IRegisterFormValues>
              label="userName"
              required
              register={register}
            />
            {errors.userName && (
              <span style={{ color: "red" }}>This field is required</span>
            )}
          </div>
          <div
            style={{
              height: "25%",
              backgroundColor: "white",
              display: "flex",
              flexFlow: "column",
              alignItems: "start",
            }}
          >
            <Input<IRegisterFormValues>
              label="password"
              required
              register={register}
            />
            {errors.password && (
              <span style={{ color: "red" }}>This field is required</span>
            )}
          </div>
          <div
            style={{
              height: "25%",
              backgroundColor: "white",
              display: "flex",
              flexFlow: "column",
              alignItems: "start",
            }}
          >
            <Input<IRegisterFormValues>
              label="firstName"
              required
              register={register}
            />
            {errors.firstName && (
              <span style={{ color: "red" }}>This field is required</span>
            )}
          </div>
          <div
            style={{
              height: "25%",
              backgroundColor: "white",
              display: "flex",
              flexFlow: "column",
              alignItems: "start",
            }}
          >
            <Input<IRegisterFormValues>
              label="lastName"
              required
              register={register}
            />
            {errors.lastName && (
              <span style={{ color: "red" }}>This field is required</span>
            )}
          </div>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            backgroundColor: "orange",
            color: "white",
          }}
        >
          Register
        </button>
        <div
          style={{
            marginTop: 5,
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Link to={"/login"}>Login</Link>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
