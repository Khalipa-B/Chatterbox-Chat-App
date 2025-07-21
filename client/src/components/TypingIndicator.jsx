export default function TypingIndicator({ username }) {
  return (
    username ? <p className="italic text-gray-500">{username} is typing...</p> : null
  );
}
