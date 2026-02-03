import Header from "@/components/header";
import Footer from "@/components/footer";
import CategoryIndexPage from "@/components/CategoryIndexPage";

export default function BrandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />

      <CategoryIndexPage
        title="Branding"
        description="Identity, positioning, and the psychology of how people see what you build."
        categoryId={/* 🔁 PUT YOUR BRANDING CATEGORY ID HERE */ 0}
      />

      <Footer />
    </div>
  );
}
