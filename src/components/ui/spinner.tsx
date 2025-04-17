export default function Spinner() {
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center">
      <div className="border-primary h-16 w-16 animate-spin rounded-full border-8 border-solid border-t-transparent"></div>
    </div>
  );
}
