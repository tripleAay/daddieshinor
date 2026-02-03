import Header from "@/components/header";
import Footer from "@/components/footer";
import CategoryIndexPage from "@/components/CategoryIndexPage";

export default function CulturePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />
      <CategoryIndexPage title="Culture" categoryId={17} />
      <Footer />
    </div>
  );
}
