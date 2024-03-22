import { useForm, SubmitHandler, Path, UseFormRegister } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

interface IFormValues {
  userName: string;
  pass: string;
}

type InputProps = {
  label: Path<IFormValues>;
  register: UseFormRegister<IFormValues>;
  required: boolean;
};

const Input = ({ label, register, required }: InputProps) => (
  <>
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        alignItems: "start",
      }}
    >
      <label>{label}</label>
      <input
        style={{ padding: 7, borderRadius: 5, border: "1px solid #ccc" }}
        {...register(label, { required })}
      />
    </div>
  </>
);

function FormLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    try {
      const response = await axios.post("http://127.0.0.1:3000/v1/login", {
        userName: data.userName,
        pass: data.pass,
      });

      if (response.status === 200) {
        Cookies.set("userId", response.data.userId);
        Cookies.set("token", response.data.token);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
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
        console.log("Error");
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
            <Input label="userName" register={register} required />
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
            <Input label="pass" register={register} required />
            {errors.pass && (
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

export default FormLogin;
