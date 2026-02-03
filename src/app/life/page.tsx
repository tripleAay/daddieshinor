import Header from "@/components/header";
import Footer from "@/components/footer";
import CategoryIndexPage from "@/components/CategoryIndexPage";

export default function LifePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />

      <CategoryIndexPage
        title="Life"
        description="Hard-earned perspective, real moments, and the meaning behind the everyday."
        categoryId={/* 🔁 PUT YOUR LIFE CATEGORY ID HERE */ 0}
      />

      <Footer />
    </div>
  );
}
