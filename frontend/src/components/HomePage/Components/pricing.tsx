import { CheckIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const tiers = [
  {
    name: "Starter",
    id: "tier-starter",
    href: "#",
    price: { monthly: "$5" },
    description: "Perfect for individual educators and small courses.",
    features: [
      "Up to 5 courses",
      "Basic analytics",
      "Student progress tracking",
      "Email support",
      "Basic assignment creation",
      "Upgrade with Professional add-ons, like Zoom integration, payment tracking integration, etc."
    ],
    featured: false
  },
  {
    name: "Professional",
    id: "tier-professional",
    href: "#",
    price: { monthly: "$12" },
    description: "Ideal for growing tuition centres and course creators.",
    features: [
      "Up to 20 courses",
      "Advanced analytics",
      "Custom branding",
      "Priority support",
      "Advanced assignment creation",
      "API access",
      "Zoom Integration",
      "Team collaboration",
      "Certificate generation",
      "Payment tracking integration"
    ],
    featured: true
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    price: { monthly: "Custom" },
    description: "For large organisations with advanced needs.",
    features: [
      "Unlimited courses",
      "Custom analytics",
      "White-label solution",
      "24/7 dedicated support",
      "Custom integrations",
      "Advanced API access",
      "SLA guarantee",
      "Custom development",
      "Dedicated account manager"
    ],
    featured: false
  }
];

export function Pricing() {
  return (
    <div id="pricing" className="relative bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-base md:text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 mb-4"
          >
            Simple, transparent pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6"
          >
            Choose the right plan{" "}
            <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400">
              for your needs
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Start with our free trial and upgrade as you grow. All plans include
            our core features.
          </motion.p>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`flex flex-col justify-between rounded-3xl p-8 ring-1 ring-gray-800 xl:p-10 ${
                tier.featured ? "bg-gray-900 ring-crimson-9" : "bg-gray-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    className={`text-lg font-semibold leading-8 ${
                      tier.featured ? "text-white" : "text-white"
                    }`}
                  >
                    {tier.name}
                  </h3>
                  {tier.featured && (
                    <span className="rounded-full bg-crimson-9/10 px-2.5 py-1 text-xs font-semibold leading-5 text-crimson-9">
                      Most popular
                    </span>
                  )}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-300">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-white">
                    {tier.price.monthly}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-300">
                    /account/month
                  </span>
                </p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-300"
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        className={`h-6 w-5 flex-none ${
                          tier.featured ? "text-crimson-9" : "text-crimson-9"
                        }`}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={`mailto:official@arul.me?subject=Learny LMS - ${tier.name} Plan Inquiry&body=Dear Learny LMS Team,%0A%0AI am writing to inquire about the ${tier.name} plan for Learny LMS.%0A%0A${tier.description}%0A%0AKey features I'm interested in:%0A${tier.features.map((feature) => `- ${feature}`).join("%0A")}%0A%0AMy details:%0A- Name: %0A- Organization: %0A- Number of students: %0A- Current LMS (if any): %0A%0AI would like to know more about:%0A- Implementation timeline%0A- Training and support options%0A- Customization possibilities%0A%0ABest regards,%0A`}
                className={`mt-8 w-full rounded-md px-4 py-2 text-sm font-semibold text-white text-center ${
                  tier.featured
                    ? "bg-crimson-9 hover:bg-darkerpink"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                Contact Us
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
