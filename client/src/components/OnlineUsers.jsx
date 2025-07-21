export default function OnlineUsers({ users }) {
  return (
    <div className="w-64 bg-white border-r p-4">
      <h3 className="font-bold mb-2">Online Users</h3>
      <ul>
        {users.map((u, i) => (
          <li key={i} className="text-green-600">{u.username}</li>
        ))}
      </ul>
    </div>
  );
}
