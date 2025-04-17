"use client"; // Indica que este componente é para o cliente

import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc"; // ícone do Google
import { useGoogleLogin } from "@react-oauth/google"; // hook para o login com Google
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Controla qual formulário exibir
  const [isClient, setIsClient] = useState(false); // Estado para verificar se é no cliente
  const router = useRouter(); // Hook para manipular o roteamento

  // Verifica se estamos no lado do cliente
  useEffect(() => {
    setIsClient(true); // Atualiza para true quando o componente é renderizado no lado do cliente
  }, []);

  // Verifica se o usuário já está logado
  useEffect(() => {
    if (isClient) {
      const userLoggedIn = localStorage.getItem("userLoggedIn");
      if (userLoggedIn) {
        router.push("/dashboard"); // Redireciona se já estiver logado
      }
    }
  }, [isClient, router]);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  // Usando o hook useGoogleLogin para obter a função de login com Google
  const login = useGoogleLogin({
    onSuccess: (response) => handleLoginSuccess(response),
    onError: (error) => handleLoginFailure(error),
  });

  const handleLoginSuccess = (response: any) => {
    console.log("Login bem-sucedido:", response);
    // Armazenar no localStorage que o usuário está logado
    localStorage.setItem("userLoggedIn", "true");
    router.push("/dashboard"); // Redireciona para o dashboard após o login
  };

  const handleLoginFailure = (error: any) => {
    console.error("Erro no login:", error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-[var(--text-color)] transition-colors">
      <div className="w-full max-w-md bg-[var(--card)] text-[var(--card-foreground)] p-8 rounded-2xl shadow-lg border border-[var(--border)]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Entrar" : "Criar Conta"}
        </h2>

        {/* Botão Google personalizado com ícone */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-3 mb-6 border rounded-lg bg-[var(--input)] hover:bg-[var(--muted)] transition-colors"
          onClick={() => {
            login(); // Chama a função de login ao clicar no botão
          }}
        >
          <FcGoogle className="text-xl" />
          <span>{isLogin ? "Entrar com Google" : "Registrar com Google"}</span>
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border)]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-[var(--card)] px-2 text-[var(--muted-foreground)]">
              ou use seu email
            </span>
          </div>
        </div>

        {/* Formulário de Login/Registro */}
        <form className="space-y-5">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block mb-1">
                Nome
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 border rounded-lg bg-[var(--input)] text-[var(--text-color)] outline-none focus:ring-2 focus:ring-[var(--ring)]"
                placeholder="Seu nome completo"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border rounded-lg bg-[var(--input)] text-[var(--text-color)] outline-none focus:ring-2 focus:ring-[var(--ring)]"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">
              Senha
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border rounded-lg bg-[var(--input)] text-[var(--text-color)] outline-none focus:ring-2 focus:ring-[var(--ring)]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[var(--fc-button-bg-color)] text-[var(--fc-button-text-color)] hover:bg-[var(--fc-button-hover-bg-color)] transition-colors"
          >
            {isLogin ? "Acessar" : "Registrar"}
          </button>
        </form>

        {/* Link para alternar entre login e registro */}
        <p className="mt-6 text-sm text-center">
          {isLogin ? (
            <>
              Não tem uma conta?{" "}
              <button
                onClick={toggleForm}
                className="underline hover:text-[var(--fc-button-hover-bg-color)]"
              >
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{" "}
              <button
                onClick={toggleForm}
                className="underline hover:text-[var(--fc-button-hover-bg-color)]"
              >
                Entrar
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
