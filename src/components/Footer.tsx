"use client";

import { Heart } from "lucide-react";
import Image from "next/image";

const categories = [
  { label: "Navegadores", href: "#navegadores" },
  { label: "Produtividade", href: "#produtividade" },
  { label: "Desenvolvimento", href: "#desenvolvimento" },
  { label: "Mídia", href: "#midia" },
  { label: "Jogos", href: "#jogos" },
  { label: "Utilitários", href: "#utilitarios" },
];

const recursos = [
  { label: "Todos os Apps", href: "/" },
  { label: "Categorias", href: "#categorias" },
  { label: "Como Instalar", href: "#como-instalar" },
  { label: "Dicas Linux", href: "#dicas-linux" },
  { label: "Distribuições", href: "#distribuicoes" },
];

const sobre = [
  { label: "Sobre o Projeto", href: "/#sobre" },
  { label: "Contribuir", href: "https://github.com/MicaelSanPedro/linuxzeiro" },
  { label: "GitHub", href: "https://github.com/MicaelSanPedro/linuxzeiro" },
  { label: "Contato", href: "mailto:sanpedromicael@gmail.com" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="/" className="flex items-center gap-2.5 mb-4 w-fit">
              <div className="w-9 h-9 rounded-xl overflow-hidden">
                <Image
                  src="/logo.webp"
                  alt="LinuxZeiro"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-bold">
                <span className="text-white">Linux</span>
                <span className="shimmer-text">Zeiro</span>
              </span>
            </a>
            <p className="text-xs sm:text-sm text-white/30 leading-relaxed max-w-xs">
              Seu guia completo para encontrar e instalar os melhores aplicativos no Linux. Comandos prontos para copiar e dicas úteis.
            </p>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="text-sm font-semibold text-white/60 mb-4">Categorias</h4>
            <ul className="space-y-2.5">
              {categories.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-xs sm:text-sm text-white/30 hover:text-amber-400 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-sm font-semibold text-white/60 mb-4">Recursos</h4>
            <ul className="space-y-2.5">
              {recursos.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-xs sm:text-sm text-white/30 hover:text-amber-400 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-white/60 mb-4">Sobre</h4>
            <ul className="space-y-2.5">
              {sobre.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    {...(item.href.startsWith("http") || item.href.startsWith("mailto")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-xs sm:text-sm text-white/30 hover:text-amber-400 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            © {currentYear} LinuxZeiro. Feito para a comunidade Linux.
          </p>
          <p className="text-xs text-white/20 flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 text-amber-500 fill-amber-500" /> e Linux para o Open Source
          </p>
        </div>
      </div>
    </footer>
  );
}
