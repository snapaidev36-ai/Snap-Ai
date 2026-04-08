"use client";

import { useState, forwardRef } from "react";
import Image from "next/image";
import * as Accordion from "@radix-ui/react-accordion";

type FAQItem = {
  title: string;
  content: string;
};

const faqItems: FAQItem[] = [
  {
    title: "What is Snap Gen Ai?",
    content:
      "Snap Gen Ai is a comprehensive AI-powered toolset designed to enhance and streamline your creative process. From generating images from text to advanced image editing, Snap Budget Ai offers a suite of tools to help you unleash your creativity.",
  },
  {
    title: "How do I get started with Snap Gen Ai?",
    content:
      "Getting started is simple! Visit our website, sign up for an account, and explore our tools. Each tool comes with a user-friendly interface and tutorials to help you make the most of Snap Gen Ai",
  },
  {
    title: "Can I use Snap Gen Ai tools for commercial projects?",
    content:
      "Yes, you can use Snap Gen Ai tools for both personal and commercial projects. Our flexible licensing ensures that you can apply your creative outputs in various professional contexts.",
  },
  {
    title: "What image formats are supported by Snap Gen Ai?",
    content:
      "Snap Gen Ai supports a wide range of image formats, including JPEG, PNG, and SVG. Our vector generation tool specifically outputs in scalable vector formats suitable for various design applications.",
  },
  {
    title: "How accurate is the background removal tool?",
    content:
      "Our background removal tool uses advanced AI algorithms to deliver highly accurate results. While it works exceptionally well with most images, fine-tuning may be required for complex backgrounds or intricate details.",
  },
  {
    title: "Is there a limit to the number of images I can upscale?",
    content:
      "Snap Budget Ai offers various subscription plans with different limits on image upscaling. Check our pricing page for details on the plan that best fits your needs.",
  },
  {
    title: "What makes Snap Gen Ai different from other AI tools?",
    content:
      "Snap Budget Ai stands out with its user-centric design, advanced AI capabilities, and a comprehensive suite of tools that cater to diverse creative needs. We prioritize quality, ease of use, and flexibility to help you bring your visions to life.",
  },
  {
    title: "How do I contact customer support?",
    content:
      "You can reach our customer support team through our contact page or by emailing us at support@snapgenai.com. We strive to respond to all inquiries within 24 hours.",
  },
  {
    title: "Do you offer enterprise solutions for businesses?",
    content:
      "Yes, we offer customized enterprise solutions for businesses with specific needs. Please contact our sales team for more information.",
  },
];

const FAQ: React.FC = () => {
  const [selectedAccordion, setSelectedAccordion] = useState<
    string | undefined
  >();

  return (
    <section className="w-full max-w-7xl mx-auto text-center px-4 py-10 md:px-8">
      <div className="grid grid-cols-12 gap-4">
        {/* Left Image */}
        <div className="col-span-12 lg:col-span-6">
          <div className="bg-[#fafafa]">
            <Image
              src="https://res.cloudinary.com/da2yfyikz/image/upload/v1734595073/AI%20Suite/faq_tj8jww.jpg"
              className="mt-8 max-w-full mx-auto"
              alt="FAQ Illustration"
              width={500}
              height={600}
            />
          </div>
        </div>

        {/* Right Content */}
        <div className="col-span-12 lg:col-span-6">
          <h2 className="mt-8 lg:mt-0 text-center lg:text-left font-bold text-xl sm:text-2xl lg:text-[2rem]">
            Frequently Asked Questions
          </h2>

          <div className="mt-8">
            <Accordion.Root
              className="space-y-3"
              type="single"
              collapsible
              onValueChange={(val) => setSelectedAccordion(val)}
            >
              {faqItems.map((item, index) => (
                <Accordion.Item
                  key={index}
                  value={item.title}
                  className={`rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all ${
                    selectedAccordion === item.title
                      ? "bg-[rgb(197_255_103/var(--tw-bg-opacity,1))]!"
                      : ""
                  }`}
                >
                  <AccordionTrigger className="text-left text-base lg:text-lg font-bold flex items-center w-full px-6 py-4 relative">
                    <span className="pr-10">{item.title}</span>

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">
                      {selectedAccordion === item.title ? "−" : "+"}
                    </span>
                  </AccordionTrigger>

                  <AccordionContent className="pb-6 text-left text-base px-6">
                    {item.content}
                  </AccordionContent>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </div>
      </div>
    </section>
  );
};

/* Accordion Trigger */
const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Trigger>
>(({ children, className, ...props }, ref) => (
  <Accordion.Header>
    <Accordion.Trigger ref={ref} className={className} {...props}>
      {children}
    </Accordion.Trigger>
  </Accordion.Header>
));

AccordionTrigger.displayName = "AccordionTrigger";

/* Accordion Content */
const AccordionContent = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Accordion.Content>
>(({ children, className, ...props }, ref) => (
  <Accordion.Content ref={ref} className={className} {...props}>
    <div>{children}</div>
  </Accordion.Content>
));

AccordionContent.displayName = "AccordionContent";

export default FAQ;
