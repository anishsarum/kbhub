import { auth } from "@/auth";

export async function DashboardContent() {
  const session = await auth();

  return (
    <>
      {/* Welcome Message */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Welcome to Knowledge Base Hub!
        </h2>
        <p className="text-gray-600">
          You are successfully authenticated. Your email:{" "}
          <strong>{session?.user?.email}</strong>
        </p>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Dashboard Content
        </h3>
        <p className="text-gray-600 mb-4">
          This is a placeholder dashboard. Here you could add:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Knowledge base articles</li>
          <li>Recent activity</li>
          <li>Search functionality</li>
          <li>User analytics</li>
          <li>Settings and preferences</li>
        </ul>
      </div>
    </>
  );
}
