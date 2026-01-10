type Props = {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({ title, onClick, disabled }: Props) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="bg-black disabled:bg-gray-500 text-white px-4 py-2 rounded w-full mt-3"
    >
      {title}
    </button>
  );
}
