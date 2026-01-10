export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="border rounded shadow-md p-6 w-[350px] mx-auto mt-20 bg-white">
      {children}
    </div>
  );
}
