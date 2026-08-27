import DamagedItemChatFlow from "@/components/support/DamagedItemChatFlow";

export const metadata = {
  title: "Support | SSS Studio",
  description: "Contact our support team for any issues with your order.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
            Customer Support
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Need help with an existing order? You can report any issues here.
          </p>
        </div>

        <DamagedItemChatFlow />
      </div>
    </div>
  );
}
