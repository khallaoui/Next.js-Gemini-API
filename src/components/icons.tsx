export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
    >
      <rect width="256" height="256" fill="none" />
      <path
        d="M88,134.2,42.3,160,24.5,128,42.3,96,88,121.8a48,48,0,1,1,0,12.4Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M168,134.2,213.7,160,231.5,128,213.7,96,168,121.8a48,48,0,1,0,0,12.4Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  );
}
