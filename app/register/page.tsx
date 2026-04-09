import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import RegisterForm from "@/components/auth/Register"; // Renamed to avoid conflict with page component

export default function Register() {
  return (
    <main>
      <Header />
      <RegisterForm />
      <Footer />
    </main>
  );
}
