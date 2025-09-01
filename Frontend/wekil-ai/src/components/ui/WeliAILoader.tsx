"use client";

export default function WeliAILoader() {
  const text = "WELIL - AI".split("");

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="flex space-x-1" id="fountainTextG">
        {text.map((letter, i) => (
          <span
            key={i}
            className="fountainTextG text-[34px] font-normal text-[rgb(24,14,173)]"
            style={{ animationDelay: `${i * 0.08 + 0.39}s` }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Fountain Loader Styles */}
      <style jsx>{`
        .fountainTextG {
          animation: bounce_fountainTextG 1.1s infinite;
          transform: scale(0.5);
        }

        @keyframes bounce_fountainTextG {
          0% {
            transform: scale(1);
            color: rgb(148, 70, 148);
          }
          100% {
            transform: scale(0.5);
            color: rgb(255, 255, 255);
          }
        }
      `}</style>
    </div>
  );
}
