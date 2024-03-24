import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { ILoginFormValues } from "../../types";
import Input from "../Input/Input";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormValues>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ILoginFormValues> = async (data) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:3000/api/v1/auth/login",
        {
          userName: data.userName,
          password: data.password,
        }
      );
      if (response.status === 200) {
        Cookies.set("userId", response.data.data.userId);
        Cookies.set("accessToken", response.data.data.accessToken);
        Cookies.set("refeshToken", response.data.data.refeshToken);
        navigate("/");
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
          border: "1px solid #ccc",
          padding: "30px 50px",
          borderRadius: 5,
          boxShadow: "1px 2px 3px #ccc",
          height: 300,
        }}
      >
        <b style={{ width: "100%", textAlign: "center" }}>FORM LOGIN</b>
        <br />
        <br />
        <div
          style={{
            height: 180,
          }}
        >
          <div
            style={{
              height: 90,
              display: "flex",
              flexFlow: "column",
              alignItems: "start",
            }}
          >
            <Input<ILoginFormValues>
              label="userName"
              register={register}
              required
            />
            {errors.userName && (
              <span style={{ color: "red" }}>This field is required</span>
            )}
          </div>
          <div
            style={{
              height: 90,
              display: "flex",
              flexFlow: "column",
              alignItems: "start",
            }}
          >
            <Input<ILoginFormValues>
              label="password"
              register={register}
              required
            />
            {errors.password && (
              <span style={{ color: "red" }}>This field is required</span>
            )}
          </div>
        </div>
        <button
          type="submit"
          style={{
            marginTop: 10,
            backgroundColor: "orange",
            color: "white",
            width: "100%",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
