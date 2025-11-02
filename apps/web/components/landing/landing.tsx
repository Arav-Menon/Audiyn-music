import FaqSection from "./src/faq";
import Feature from "./src/features";
import Footer from "./src/footer";
import Header from "./src/header";
import HowItWorksPage from "./src/how-it-work";
import Navbar from "./src/navbar";
import Thoughts from "./src/thoughts";

export default function Landing() {
  return (
    <>
      <Navbar />
      <Header />
      <Feature />
      <HowItWorksPage />
      <Thoughts />
      <FaqSection />
      <Footer />
    </>
  );
}
