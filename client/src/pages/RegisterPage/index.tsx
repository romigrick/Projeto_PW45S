import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";
import type { IUserRegister } from "@/commons/types";
import AuthService from "@/services/authService";
import { Toast } from "primereact/toast";

export const RegisterPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserRegister>({
    defaultValues: { username: "", password: "", displayName: "", email: "" },
  });

  const { signup } = AuthService;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const onSubmit = async (data: IUserRegister) => {
    setLoading(true);
    try {
      const response = await signup(data);
      if (response.success) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Usuário cadastrado com sucesso.",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: response.message || "Falha ao cadastrar usuário.",
          life: 3000,
        });
      }
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao cadastrar usuário.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Toast ref={toast} />

      <style>{`
        .register-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f8fafc;
          padding: 1.5rem;
        }
        .register-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
        }
        .p-password input {
          width: 100%;
        }
      `}</style>

      <div className="register-card surface-card shadow-2 border-round-xl p-5">
        <div className="text-center mb-5">
          <div className="inline-flex align-items-center justify-content-center bg-blue-100 border-round-xl w-4rem h-4rem mb-3">
            <i className="pi pi-user-plus text-blue-600 text-2xl" />
          </div>
          <h2 className="m-0 text-900 font-bold text-2xl mb-2">Criar Conta</h2>
          <p className="m-0 text-500 text-sm">Preencha os campos abaixo para se registrar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          {/* Nome de Exibição */}
          <div className="field mb-4">
            <label htmlFor="displayName" className="block text-900 font-medium text-sm mb-2">
              Nome Completo
            </label>
            <span className="p-input-icon-left w-full">
              <i className="pi pi-user text-500" style={{ left: '0.75rem' }} />
              <Controller
                name="displayName"
                control={control}
                rules={{ required: "Informe seu nome completo" }}
                render={({ field }) => (
                  <InputText
                    id="displayName"
                    placeholder="Ex: João das Neves"
                    {...field}
                    className={classNames({ "p-invalid": errors.displayName }, "w-full")}
                    style={{ paddingLeft: '2.5rem' }}
                    disabled={loading || isSubmitting}
                  />
                )}
              />
            </span>
            {errors.displayName && <small className="p-error block mt-1">{errors.displayName.message}</small>}
          </div>

          {/* Nome de Usuário */}
          <div className="field mb-4">
            <label htmlFor="username" className="block text-900 font-medium text-sm mb-2">
              Nome de Usuário
            </label>
            <span className="p-input-icon-left w-full">
              <i className="pi pi-id-card text-500" style={{ left: '0.75rem' }} />
              <Controller
                name="username"
                control={control}
                rules={{ required: "Informe um nome de usuário" }}
                render={({ field }) => (
                  <InputText
                    id="username"
                    placeholder="Ex: jsnow"
                    {...field}
                    className={classNames({ "p-invalid": errors.username }, "w-full")}
                    style={{ paddingLeft: '2.5rem' }}
                    disabled={loading || isSubmitting}
                  />
                )}
              />
            </span>
            {errors.username && <small className="p-error block mt-1">{errors.username.message}</small>}
          </div>

          {/* E-mail */}
          <div className="field mb-4">
            <label htmlFor="email" className="block text-900 font-medium text-sm mb-2">
              E-mail
            </label>
            <span className="p-input-icon-left w-full">
              <i className="pi pi-envelope text-500" style={{ left: '0.75rem' }} />
              <Controller
                name="email"
                control={control}
                rules={{ 
                  required: "Informe seu e-mail",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                    message: "Insira um endereço de e-mail válido"
                  }
                }}
                render={({ field }) => (
                  <InputText
                    id="email"
                    type="email"
                    placeholder="Ex: joao@email.com"
                    {...field}
                    className={classNames({ "p-invalid": errors.email }, "w-full")}
                    style={{ paddingLeft: '2.5rem' }}
                    disabled={loading || isSubmitting}
                  />
                )}
              />
            </span>
            {errors.email && <small className="p-error block mt-1">{errors.email.message}</small>}
          </div>

          {/* Senha */}
          <div className="field mb-4">
            <label htmlFor="password" className="block text-900 font-medium text-sm mb-2">
              Senha
            </label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Informe uma senha",
                minLength: { value: 6, message: "A senha deve ter no mínimo 6 caracteres" },
              }}
              render={({ field }) => (
                <Password
                  id="password"
                  placeholder="Crie uma senha forte"
                  {...field}
                  toggleMask
                  feedback={false}
                  className={classNames({ "p-invalid": errors.password }, "w-full")}
                  inputClassName="w-full"
                  disabled={loading || isSubmitting}
                />
              )}
            />
            {errors.password && <small className="p-error block mt-1">{errors.password.message}</small>}
          </div>

          <Button
            type="submit"
            label="Registrar"
            icon="pi pi-user-plus"
            className="p-button-sm mb-4 w-full"
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
          />
        </form>

        <div className="text-center">
          <span className="text-500 text-sm">Já tem uma conta? </span>
          <Link to="/login" className="text-blue-600 no-underline hover:underline font-medium text-sm">
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
};