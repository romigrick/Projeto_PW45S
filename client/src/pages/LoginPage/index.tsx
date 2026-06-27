import { useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { AuthenticationResponse, IUserLogin } from "@/commons/types";
import { useAuth } from "@/context/AuthContext";
import AuthService from "@/services/authService";
import { Toast } from "primereact/toast";

export const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserLogin>({ defaultValues: { username: "", password: "" } });

  const navigate = useNavigate();
  const { login } = AuthService;
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const { handleLogin } = useAuth();

  // Utilitário: verifica se o usuário autenticado tem role admin
  const isAdminUser = (authResponse: AuthenticationResponse): boolean => {
    return (
      authResponse.user?.authorities?.some(
        (a) => a.authority === "ROLE_ADMIN"
      ) ?? false
    );
  };

  const onSubmit = async (userLogin: IUserLogin) => {
    setLoading(true);
    try {
      const response = await login(userLogin);
      if (response.status === 200) {
        const authResponse = response.data as AuthenticationResponse;

        await handleLogin(authResponse);

        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Login efetuado com sucesso.",
          life: 2000,
        });

        // Redireciona com base nas authorities do token, não em um campo "role"
        if (isAdminUser(authResponse)) {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: response.message || "Usuário ou senha inválidos.",
          life: 3000,
        });
      }
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao efetuar login.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoadingGoogle(true);

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = "http://localhost:5173/login";
    const scope = "openid email profile";
    const responseType = "token";

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;

    window.location.href = googleAuthUrl;
  };

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        handleGoogleCallback(accessToken);
      }
    }
  }, [navigate]);

  const handleGoogleCallback = async (accessToken: string) => {
    setLoading(true);
    try {
      const googleResponse = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
      );
      const googleUser = await googleResponse.json();

      if (!googleUser.email) {
        throw new Error("Não foi possível obter o e-mail da conta do Google.");
      }

      const generatedPassword = btoa(googleUser.email).substring(0, 10) + "Aa1!";

      const loginAttempt = await login({
        username: googleUser.email,
        password: generatedPassword,
      });

      let authResponse: AuthenticationResponse;

      if (loginAttempt.status === 200) {
        authResponse = loginAttempt.data;
      } else {
        const registerResponse = await fetch("http://localhost:8044/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            displayName: googleUser.name || googleUser.given_name,
            email: googleUser.email,
            username: googleUser.email,
            password: generatedPassword,
          }),
        });

        if (!registerResponse.ok) {
          const errorData = await registerResponse.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Falha ao registrar o usuário via Google."
          );
        }

        const secondLoginAttempt = await login({
          username: googleUser.email,
          password: generatedPassword,
        });

        if (secondLoginAttempt.status === 200) {
          authResponse = secondLoginAttempt.data;
        } else {
          throw new Error("Usuário criado, mas não foi possível autenticar a sessão.");
        }
      }

      await handleLogin(authResponse);

      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Login com Google efetuado com sucesso.",
        life: 2000,
      });

      // Mesmo critério: authorities, não "role"
      if (isAdminUser(authResponse)) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erro na Autenticação",
        detail: error.message || "Falha ao processar o fluxo de login.",
        life: 4000,
      });
    } finally {
      setLoading(false);
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="login-container">
      <Toast ref={toast} />

      <style>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f8fafc;
          padding: 1.5rem;
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
        }
        .google-btn {
          background-color: #ffffff !important;
          color: #374151 !important;
          border: 1px solid #d1d5db !important;
          transition: background-color 0.2s;
        }
        .google-btn:hover {
          background-color: #f9fafb !important;
          border-color: #eef2f6 !important;
        }
        .p-password input {
          width: 100%;
        }
      `}</style>

      <div className="login-card surface-card shadow-2 border-round-xl p-5">
        <div className="text-center mb-5">
          <div className="inline-flex align-items-center justify-content-center bg-blue-100 border-round-xl w-4rem h-4rem mb-3">
            <i className="pi pi-lock text-blue-600 text-2xl" />
          </div>
          <h2 className="m-0 text-900 font-bold text-2xl mb-2">Bem-vindo</h2>
          <p className="m-0 text-500 text-sm">Insira suas credenciais para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="field mb-4">
            <label htmlFor="username" className="block text-900 font-medium text-sm mb-2">
              Usuário
            </label>
            <span className="p-input-icon-left w-full">
              <i className="pi pi-user text-500" style={{ left: "0.75rem" }} />
              <Controller
                name="username"
                control={control}
                rules={{ required: "Informe o nome de usuário" }}
                render={({ field }) => (
                  <InputText
                    id="username"
                    placeholder="Digite seu usuário"
                    {...field}
                    className={errors.username ? "p-invalid w-full" : "w-full"}
                    style={{ paddingLeft: "2.5rem" }}
                    disabled={loading || isSubmitting || loadingGoogle}
                  />
                )}
              />
            </span>
            {errors.username && (
              <small className="p-error block mt-1">{errors.username.message}</small>
            )}
          </div>

          <div className="field mb-4">
            <div className="flex align-items-center justify-content-between mb-2">
              <label htmlFor="password" className="block text-900 font-medium text-sm m-0">
                Senha
              </label>
              <a href="#forgot" className="text-sm text-blue-600 no-underline hover:underline font-medium">
                Esqueceu a senha?
              </a>
            </div>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Informe a senha" }}
              render={({ field }) => (
                <Password
                  id="password"
                  placeholder="Digite sua senha"
                  {...field}
                  toggleMask
                  feedback={false}
                  className={errors.password ? "p-invalid w-full" : "w-full"}
                  inputClassName="w-full"
                  disabled={loading || isSubmitting || loadingGoogle}
                />
              )}
            />
            {errors.password && (
              <small className="p-error block mt-1">{errors.password.message}</small>
            )}
          </div>

          <Button
            type="submit"
            label="Entrar"
            icon="pi pi-sign-in"
            className="p-button-sm mb-3 w-full"
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting || loadingGoogle}
          />
        </form>

        <Divider align="center" className="my-4">
          <span className="text-400 text-xs font-normal">OU</span>
        </Divider>

        <Button
          type="button"
          label="Entrar com o Google"
          icon="pi pi-google text-red-500"
          className="google-btn p-button-sm w-full mb-4"
          loading={loadingGoogle}
          disabled={loading || isSubmitting}
          onClick={handleGoogleLogin}
        />

        <div className="text-center">
          <span className="text-500 text-sm">Não tem uma conta? </span>
          <Link to="/register" className="text-blue-600 no-underline hover:underline font-medium text-sm">
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
};
