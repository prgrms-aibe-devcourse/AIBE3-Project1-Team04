"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signInWithGoogle, signInWithGitHub } from "../../lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    agreeMarketing: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.includes("@")) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요";
    }

    if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상 입력해주세요";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "이용약관에 동의해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    const result = await signUp({
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      // 회원가입 성공 시 로그인 페이지로 이동
      router.push(
        "/login?message=회원가입이 완료되었습니다. 이메일 인증 후 로그인해주세요."
      );
    } else {
      setAuthError(result.error || "회원가입에 실패했습니다.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setAuthError(null);

    const result = await signInWithGoogle();

    if (!result.success) {
      setAuthError(result.error || "Google 회원가입에 실패했습니다.");
      setIsLoading(false);
    }
  };

  const handleGitHubSignup = async () => {
    setIsLoading(true);
    setAuthError(null);

    const result = await signInWithGitHub();

    if (!result.success) {
      setAuthError(result.error || "GitHub 회원가입에 실패했습니다.");
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // 에러 메시지 제거
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-user-add-line text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            StudyLog 계정 만들기
          </h1>
          <p className="text-gray-600">이메일로 간편하게 계정을 만들어보세요</p>
        </div>

        {authError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <i className="ri-error-warning-line text-red-400 text-sm mt-0.5 mr-2"></i>
              <p className="text-sm text-red-600">{authError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              이메일
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-mail-line text-gray-400 text-sm"></i>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm`}
                placeholder="your@email.com"
                required
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              비밀번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-lock-line text-gray-400 text-sm"></i>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm`}
                placeholder="8자 이상 입력하세요"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              >
                <i
                  className={`${
                    showPassword ? "ri-eye-off-line" : "ri-eye-line"
                  } text-gray-400 text-sm hover:text-gray-600`}
                ></i>
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              비밀번호 확인
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-lock-line text-gray-400 text-sm"></i>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 border ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm`}
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              >
                <i
                  className={`${
                    showConfirmPassword ? "ri-eye-off-line" : "ri-eye-line"
                  } text-gray-400 text-sm hover:text-gray-600`}
                ></i>
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 mt-0.5"
              />
              <span className="ml-2 text-sm text-gray-600">
                <span className="text-red-500">*</span>
                <Link
                  href="/terms"
                  className="text-green-600 hover:text-green-500 underline cursor-pointer"
                >
                  이용약관
                </Link>{" "}
                및{" "}
                <Link
                  href="/privacy"
                  className="text-green-600 hover:text-green-500 underline cursor-pointer"
                >
                  개인정보처리방침
                </Link>
                에 동의합니다
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-xs text-red-600">{errors.agreeTerms}</p>
            )}

            <label className="flex items-start">
              <input
                type="checkbox"
                name="agreeMarketing"
                checked={formData.agreeMarketing}
                onChange={handleChange}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 mt-0.5"
              />
              <span className="ml-2 text-sm text-gray-600">
                마케팅 정보 수신에 동의합니다 (선택)
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                계정 생성 중...
              </div>
            ) : (
              "계정 만들기"
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="ri-google-fill text-red-500 mr-2"></i>
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>
            <button
              type="button"
              onClick={handleGitHubSignup}
              disabled={isLoading}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="ri-github-fill text-gray-800 mr-2"></i>
              <span className="text-sm font-medium text-gray-700">GitHub</span>
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="text-green-600 hover:text-green-500 font-medium cursor-pointer"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
