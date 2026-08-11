export function PwaIcon({ size }: { size: number }) {
  const inset = Math.round(size * 0.18);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#8A9A8B",
        borderRadius: Math.round(size * 0.2),
      }}
    >
      <div
        style={{
          width: size - inset * 2,
          height: size - inset * 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: Math.round(size * 0.14),
          background: "#F7F6F3",
        }}
      >
        <svg
          width={Math.round(size * 0.48)}
          height={Math.round(size * 0.48)}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 46L50 17L85 46V84H61V61H39V84H15V46Z"
            fill="#E8EDE8"
            stroke="#748576"
            strokeWidth="8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M72 25V36"
            stroke="#C8A98B"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
