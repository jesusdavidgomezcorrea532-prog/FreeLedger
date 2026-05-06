import { getClients } from "@/lib/actions/clients";
import { ClientsPageClient } from "@/components/clients/clients-page-client";

export const metadata = {
  title: "Clients",
};

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <ClientsPageClient clients={clients} />
    </div>
  );
}
