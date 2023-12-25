export function Tag({ tag, cb }) {
  return (
    <div className="my-2 mr-4 rounded-full px-6 py-2 bg-gray-100 dark:bg-midnight general-ring-state">
      <button onClick={() => cb(tag)}>{tag}</button>
    </div>
  );
}
