import { getClients } from "@/lib/actions/clients";
import { getCurrentUserUsage } from "@/lib/actions/limits";
import { ClientsPageClient } from "@/components/clients/clients-page-client";
import { PLANS } from "@/lib/plans";

export const metadata = {
  title: "Clients",
};

export default async function ClientsPage() {
  const [clients, usage] = await Promise.all([getClients(), getCurrentUserUsage()]);

  const plan = usage?.plan ?? "free";
  const limit = PLANS[plan].maxClients;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <ClientsPageClient
        clients={clients}
        plan={plan}
        clientLimit={limit}
      />
    </div>
  );
}
