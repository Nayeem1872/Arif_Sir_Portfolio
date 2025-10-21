import CTA from "@/components/common/call-to-action";
import Heading from "@/components/common/heading";
import { SectionContainer } from "@/components/layout/section";
import { homepage } from "@/config/content/pages";
import Socials from "@/features/contact/components/socials";
import type { Profile } from "@/types/data";
import { IconBriefcase } from "@tabler/icons-react";

type Metrics = Profile["metrics"] | undefined;

const Metrics = ({ metrics }: { metrics: Metrics }) => {
  return (
    <SectionContainer className="relative w-full">
      <div className="relative">
        <div className="mx-auto w-full px-4 text-center md:w-[80%]">
          <Heading as="h2">{homepage.metricHeading}</Heading>
        </div>

        <div className="text-fg relative my-8 grid grid-cols-2 gap-8 text-center sm:place-items-center sm:gap-x-8 lg:my-14 lg:grid-cols-4">
          {metrics?.map((metric, index) => (
            <div key={index}>
              <h3 className="text-4xl font-bold sm:text-6xl md:text-7xl">
                <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  {metric.value}
                </span>
              </h3>
              <p className="mt-4 font-medium sm:text-xl">{metric.label}</p>
            </div>
          ))}
        </div>

        <CTA
          heading="Want to work together?"
          description="Drop me a message and let’s see how we can build something great
            together."
          href="/contact"
          className="mt-20"
          buttonContent={
            <>
              <IconBriefcase />
              <span>Let&apos;s Talk Success</span>
            </>
          }
        >
          <Socials />
        </CTA>
      </div>
    </SectionContainer>
  );
};

export default Metrics;
