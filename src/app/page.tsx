import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div
      style={{
        backgroundImage: "url('/images/vgu-bg.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="min-h-screen flex flex-col items-center justify-center p-4"
    >
    </div>
  )
}
