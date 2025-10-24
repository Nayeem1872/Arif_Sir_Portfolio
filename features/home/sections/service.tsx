import Heading from "@/components/common/heading";
import { SectionContainer } from "@/components/layout/section";
import { SlideIn } from "@/components/ui/transitions";
import { homepage } from "@/config/content/pages";
import { Service } from "@/types/data";
import { cn } from "@/utils/cn";
import { IconBriefcase } from "@tabler/icons-react";

const ServiceSection = ({ services }: { services: Service[] }) => {
  return (
    <SectionContainer className="sm:py-16">
      <div className="mb-10 w-full px-4">
        <div className="section-badge">
          <IconBriefcase className="mr-2" />
          <span>Services</span>
        </div>
        <Heading as="h2">{homepage.serviceHeading}</Heading>
      </div>
      {services.length > 0 ? (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services?.map((service, index) => (
            <SlideIn key={index}>
              <ServiceComponent key={index} {...service} index={index} />
            </SlideIn>
          ))}
        </div>
      ) : (
        <div className="flex h-96 items-center justify-center">
          <p className="text-fg text-lg">
            Add services to your portfolio to showcase your skills and
            offerings.
          </p>
        </div>
      )}
    </SectionContainer>
  );
};

export default ServiceSection;

const ServiceComponent = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: string;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "group/feature border-border relative flex flex-col py-10",
        (index === 0 || index === 3) && "border-border border-0",
        index < 3 && "border-border border-0",
        (index % 3 === 0 || index % 3 === 1) && "border-0",
      )}
    >
      {index < 3 && (
        <div className="from-primary/10 pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100" />
      )}
      {index >= 3 && (
        <div className="from-primary/10 pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100" />
      )}
      <div className="text-fg relative z-10 mb-4 px-10">
        {icon ? (
          <div className="relative flex h-8 w-8 items-center justify-center">
            <span className="text-2xl">{icon}</span>
          </div>
        ) : (
          <IconBriefcase className="text-fg h-8 w-8" />
        )}
      </div>
      <div className="relative z-10 mb-2 px-10 text-lg font-bold">
        <div className="group-hover/feature:bg-primary bg-text-secondary absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-tr-full rounded-br-full transition-all duration-200 group-hover/feature:h-8" />
        <span className="group-hover/feature:text-primary text-fg inline-block text-lg transition duration-200 group-hover/feature:translate-x-2 md:text-xl lg:text-2xl">
          {title}
        </span>
      </div>
      <p className="text-text-secondary relative z-10 max-w-sm px-10 text-sm">
        {description}
      </p>
    </div>
  );
};
