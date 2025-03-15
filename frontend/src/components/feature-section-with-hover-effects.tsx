import { cn } from "@/lib/utils";
import {
  IconShieldCheck,
  IconHeartbeat,
  IconCar,
  IconBuildingBank,
  IconUserShield,
  IconHome,
  IconPlane,
  IconBriefcase,
} from "@tabler/icons-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Comprehensive Health Coverage",
      description:
        "Protect yourself and your family with extensive health insurance plans covering hospital bills, medications, and more.",
      icon: <IconHeartbeat />,
    },
    {
      title: "Affordable Auto Insurance",
      description:
        "Drive with confidence knowing you're covered for accidents, theft, and damages.",
      icon: <IconCar />,
    },
    {
      title: "Secure Your Home",
      description:
        "Safeguard your home against unforeseen events like fire, theft, and natural disasters.",
      icon: <IconHome />,
    },
    {
      title: "Reliable Life Insurance",
      description:
        "Ensure your loved ones are financially protected with tailored life insurance plans.",
      icon: <IconShieldCheck />,
    },
    {
      title: "Business Protection Plans",
      description:
        "Secure your business with policies that cover liabilities, property damage, and more.",
      icon: <IconBriefcase />,
    },
    {
      title: "Travel with Peace of Mind",
      description:
        "Comprehensive travel insurance covering trip cancellations, medical emergencies, and lost baggage.",
      icon: <IconPlane />,
    },
    {
      title: "Personal Liability Coverage",
      description:
        "Stay protected from legal claims arising from accidental damages or injuries.",
      icon: <IconUserShield />,
    },
    {
      title: "Financial Stability Guaranteed",
      description:
        "Investment-linked insurance plans that provide security and wealth growth opportunities.",
      icon: <IconBuildingBank />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-20 px-2 relative group/feature hover:cursor-pointer dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-900 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};