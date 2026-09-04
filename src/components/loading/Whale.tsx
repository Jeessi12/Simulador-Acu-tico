import type { SVGProps } from "react";

export function Whale({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 118"
      role="img"
      aria-label="Ballena de BlueEcoSim"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none" stroke="#1672d4" strokeLinecap="round" strokeLinejoin="round">
        <g className="blueeco-whale__spout" strokeWidth="2.3">
          <path d="M76 28C71 22 71 17 75 13" />
          <path d="M82 27C84 20 88 18 92 17" />
          <path d="M79 20C79 15 81 12 83 10" />
        </g>

        <circle cx="22" cy="61" r="2.4" strokeWidth="1.5" />
        <circle cx="157" cy="69" r="3" strokeWidth="1.5" />
        <circle cx="150" cy="44" r="1.8" strokeWidth="1.4" />

        <g className="blueeco-whale__tail" fill="#e9f6ff" strokeWidth="2.7">
          <path d="M116 59C127 56 132 49 133 41C142 43 148 50 148 59C138 59 130 63 120 68Z" />
          <path d="M120 66C131 64 141 67 146 75C137 79 127 77 116 71Z" />
        </g>

        <path
          d="M35 62C36 43 53 32 75 32C96 32 111 44 118 60L121 67C116 80 98 87 76 86C52 85 35 76 35 62Z"
          fill="#edf8ff"
          strokeWidth="3"
        />
        <path d="M76 77C84 84 92 88 100 83C97 75 90 70 82 68" fill="#d9f0ff" strokeWidth="2.5" />
        <path d="M47 55C51 59 56 59 60 55" strokeWidth="2.5" />
        <path d="M43 66C48 71 54 71 59 67" strokeWidth="2.2" />
        <path d="M69 35C84 32 99 37 108 47" stroke="#7fbaf2" strokeWidth="1.7" />

        <path d="M22 98C29 92 35 104 42 98C49 92 55 104 62 98" stroke="#58b8ef" strokeWidth="2" />
        <path d="M66 102C73 96 79 108 86 102C93 96 99 108 106 102" stroke="#58b8ef" strokeWidth="2" />
        <path d="M111 97C118 91 124 103 131 97C138 91 144 103 151 97" stroke="#58b8ef" strokeWidth="2" />
      </g>
    </svg>
  );
}
